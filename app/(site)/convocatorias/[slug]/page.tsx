import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import FaqLeccion, { type Faq } from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import ConvocatoriaAlerta from "@/components/convocatorias/ConvocatoriaAlerta"
import SimulacroNudge from "@/components/site/SimulacroNudge"
import { CONVOCATORIAS, ESTADOS, type Convocatoria } from "@/lib/data/convocatorias"
import { getConvocatoriaBySlug } from "@/lib/data/convocatorias-db"
import { getOrganismo } from "@/lib/data/organismos"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

// Se regenera cada hora; las auto-ingeridas del BOE (slugs no prerenderizados) se
// generan bajo demanda (dynamicParams por defecto).
export const revalidate = 3600

export function generateStaticParams() {
    return CONVOCATORIAS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const c = await getConvocatoriaBySlug(slug)
    if (!c) return { title: "Convocatoria no encontrada" }
    const org = getOrganismo(c.organismo)?.corto ?? ""
    const examen = c.fechasClave.find((f) => /examen/i.test(f.etiqueta))
    const title = `${c.nombre} — Plazas y fechas`.slice(0, 60)
    // Descripción específica con estado + plazas + examen (lo útil en el preview de WhatsApp/Telegram).
    const factos = [
        ESTADOS[c.estado].label,
        c.plazas ? `${c.plazas} plazas` : null,
        examen?.fecha ? `Examen: ${examen.fecha}` : null,
    ]
        .filter(Boolean)
        .join(" · ")
    const resumenLimpio = c.resumen.replace(/\s*Fuente:.*$/i, "").trim()
    const ogDesc = `${factos}. ${resumenLimpio}`.slice(0, 200)
    const url = `${SITE_URL}/convocatorias/${c.slug}`
    return {
        title,
        description: `${resumenLimpio}`.slice(0, 155) ||
            `Convocatoria de ${org}: estado, plazas, fechas y enlaces oficiales.`,
        alternates: { canonical: `/convocatorias/${c.slug}` },
        openGraph: {
            title: c.nombre,
            description: ogDesc,
            url,
            type: "article",
            siteName: "Gainditu",
        },
        twitter: {
            card: "summary_large_image",
            title: c.nombre,
            description: ogDesc,
        },
    }
}

function formatISO(iso: string): string {
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ]
    const [y, m, d] = iso.split("-").map(Number)
    if (!y || !m || !d) return iso
    return `${d} de ${meses[m - 1]} de ${y}`
}

function faqsDe(c: Convocatoria): Faq[] {
    const examen = c.fechasClave.find((f) => /examen/i.test(f.etiqueta))
    return [
        {
            q: `¿Cuántas plazas tiene ${c.nombre}?`,
            a: c.plazas
                ? `${c.plazas} plazas.`
                : "El número de plazas todavía no está confirmado oficialmente en el BOPV. En cuanto se publique, lo actualizamos aquí.",
        },
        {
            q: "¿Cuándo es el examen?",
            a: examen?.fecha
                ? `${examen.fecha}${examen.nota ? ` (${examen.nota})` : ""}.`
                : "Aún no hay fecha de examen confirmada. Consulta el enlace oficial para la fecha definitiva.",
        },
        {
            q: "¿Qué nivel de euskera se pide?",
            a: c.perfilLinguistico ?? "Según la convocatoria específica de cada plaza.",
        },
        {
            q: "¿Dónde se publica la convocatoria oficial?",
            a: `En el Boletín Oficial del País Vasco (BOPV)${
                c.boletin && c.boletin !== "BOPV (según convocatoria)" ? ` — ${c.boletin}` : ""
            } y en la web oficial del organismo. Verifica siempre ahí las fechas y plazas definitivas.`,
        },
    ]
}

export default async function ConvocatoriaFicha({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const c = await getConvocatoriaBySlug(slug)
    if (!c) notFound()

    const org = getOrganismo(c.organismo)
    const estado = ESTADOS[c.estado]
    const faqs = faqsDe(c)
    // Todas las fechas de examen/prueba con día concreto → un Event cada una.
    // Normalizamos tildes para que "Exámenes" también case con /examen/.
    const eventos = c.fechasClave.filter((f) => {
        if (!f.iso) return false
        const norm = f.etiqueta
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
        return /examen|prueba|oposici/i.test(norm)
    })

    // CTA final: nunca a /payment desde tráfico frío. Si la convocatoria es de una
    // escala del cuerpo general con simulacro gratis, enlaza EL SUYO (embudo de venta);
    // si no (Ertzaintza, Osakidetza, Educación…), a la herramienta de orientación.
    const simConv = ((): { path: string; nombre: string } | null => {
        const txt = `${c.slug} ${c.nombre} ${c.cuerpoOCategoria.join(" ")} ${c.testsRelacionados
            .map((t) => t.url)
            .join(" ")}`.toLowerCase()
        if (/personal de apoyo|subalterno|\bapoyo\b/.test(txt))
            return { path: "/simulacro-personal-apoyo-gobierno-vasco", nombre: "Personal de Apoyo" }
        if (/t[eé]cnico\/?a? superior|escala superior/.test(txt))
            return { path: "/simulacro-tecnico-superior-gobierno-vasco", nombre: "Técnico Superior" }
        if (/t[eé]cnico\/?a? de gesti[oó]n|gesti[oó]n administrativa/.test(txt))
            return { path: "/simulacro-tecnico-gestion-gobierno-vasco", nombre: "Técnico de Gestión" }
        if (/administrativo|auxiliar administrativo/.test(txt))
            return { path: "/simulacro-administrativo-gobierno-vasco", nombre: "Administrativo" }
        return null
    })()
    const cta = simConv
        ? {
              href: simConv.path,
              titulo: "Haz un simulacro gratis",
              texto: `${simConv.path.includes("administrativo") ? 30 : 60} preguntas tipo examen de ${simConv.nombre} del Gobierno Vasco, corregidas al momento con tu nota y tus puntos débiles. Sin registro para empezar.`,
              boton: "Empezar el simulacro →",
          }
        : {
              href: "/herramientas/que-oposicion-elegir",
              titulo: "¿Qué oposición te encaja?",
              texto: "Responde unas preguntas y te decimos qué oposiciones de Euskadi encajan contigo. Gratis y sin registro.",
              boton: "Descúbrelo gratis →",
          }

    // Inscripción abierta: CTA destacado con el enlace oficial de inscripción.
    const abierta = c.estado === "inscripcion-abierta"
    // Botón honesto según a dónde lleva DE VERDAD el enlace principal:
    //   - inscripción real (solo en curadas con enlace explícito) → "Inscribirme"
    //   - portal de empleo del ayuntamiento/diputación → "Ver empleo público"
    //   - bases del boletín → "Ver las bases"
    //   - ficha/convocatoria → "Ver la convocatoria"
    // Nunca "Inscribirme" para las automáticas: no garantizamos un formulario directo.
    const enlaceInscripcion = c.enlacesOficiales.find((e) => /inscri|solicitud/i.test(e.etiqueta))
    const enlacePrimario = enlaceInscripcion ?? c.enlacesOficiales[0]
    const inscripcionUrl = enlacePrimario?.url
    const etPrim = (enlacePrimario?.etiqueta ?? "").toLowerCase()
    const ctaLabel = enlaceInscripcion
        ? "Inscribirme ↗"
        : /empleo p[uú]blico/.test(etPrim)
          ? "Ver empleo público ↗"
          : /bases/.test(etPrim)
            ? "Ver las bases ↗"
            : "Ver la convocatoria ↗"
    // "Plazo" = rango inicio–cierre cuando hay ambas fechas (no solo el inicio).
    const plazoIni = c.fechasClave.find((f) => /inicio/i.test(f.etiqueta))?.fecha
    const plazoFin = c.fechasClave.find((f) => /fin|cierre/i.test(f.etiqueta))?.fecha
    const plazoInscripcion =
        plazoIni && plazoFin
            ? `${plazoIni} – ${plazoFin}`
            : plazoFin ??
              plazoIni ??
              c.fechasClave.find((f) => /inscrip|solicitud|plazo/i.test(f.etiqueta))?.fecha ??
              null

    // Días naturales que faltan para el cierre de inscripción (o null): para el aviso de urgencia.
    const finIso =
        c.fechasClave
            .filter((f) => f?.iso && /(fin|cierre|inscrip|plazo|solicitud)/i.test(f.etiqueta || ""))
            .map((f) => f.iso as string)
            .sort()
            .pop() ?? null
    const diasCierre = (() => {
        if (!finIso) return null
        const [y, m, d] = finIso.split("-").map((n) => parseInt(n, 10))
        if (!y || !m || !d) return null
        const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
        return Math.round((new Date(y, m - 1, d).getTime() - hoy.getTime()) / 86400000)
    })()
    const avisoDias =
        abierta && diasCierre !== null && diasCierre >= 0 && diasCierre <= 10
            ? {
                  color: diasCierre <= 3 ? "#DC2626" : "#F59E0B",
                  texto:
                      diasCierre === 0
                          ? "¡Último día para inscribirte!"
                          : diasCierre === 1
                            ? "Queda 1 día para el cierre"
                            : `Faltan ${diasCierre} días para el cierre`,
              }
            : null

    return (
        <main className="flex flex-1 flex-col">
            {/* Cabecera / resumen */}
            <section className="border-b border-zinc-100 dark:border-zinc-800/70 px-5 py-10">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href="/convocatorias"
                        className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                    >
                        ← Todas las convocatorias
                    </Link>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                            style={{ color: estado.color, background: `${estado.color}18`, border: `1px solid ${estado.color}30` }}
                        >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: estado.color }} />
                            {estado.label}
                        </span>
                        {org && (
                            <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">
                                {org.nombre}
                            </span>
                        )}
                    </div>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                        {c.nombre}
                    </h1>
                    <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        {c.resumen.replace(/\s*Fuente:.*$/i, "").trim()}
                    </p>

                    {abierta && inscripcionUrl && (
                        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                {c.plazas != null && (
                                    <div className="shrink-0 text-center">
                                        <div className="text-3xl font-extrabold leading-none sm:text-4xl" style={{ color: ACCENT }}>
                                            {c.plazas}
                                        </div>
                                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                            plazas
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <div className="text-[15px] font-bold text-zinc-950 dark:text-zinc-50">
                                        Inscripción abierta
                                    </div>
                                    {plazoInscripcion && (
                                        <div className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-300">
                                            Plazo:{" "}
                                            <span className="font-semibold text-zinc-800 dark:text-zinc-100">{plazoInscripcion}</span>
                                        </div>
                                    )}
                                    {avisoDias && (
                                        <div
                                            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold"
                                            style={{ color: avisoDias.color, background: `${avisoDias.color}18`, border: `1px solid ${avisoDias.color}33` }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {avisoDias.texto}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <a
                                href={inscripcionUrl}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold text-white transition-transform hover:scale-[1.03]"
                                style={{ background: ACCENT, boxShadow: "0 10px 25px -5px rgba(16,185,129,0.4)" }}
                            >
                                {ctaLabel}
                            </a>
                        </div>
                    )}

                    <p className="mt-4 text-[12px] text-zinc-400">
                        Actualizado el {formatISO(c.ultimaActualizacion)}
                    </p>
                </div>
            </section>

            <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 px-5 py-10 lg:grid-cols-3">
                {/* Columna principal */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Timeline de fases */}
                    <section>
                        <h2 className="mb-4 text-lg font-bold text-zinc-950 dark:text-zinc-50">
                            Estado del proceso
                        </h2>
                        <ol className="relative border-l border-zinc-200 dark:border-zinc-800 pl-6">
                            {c.fechasClave.map((f, i) => (
                                <li key={i} className="mb-6 last:mb-0">
                                    <span
                                        className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full ring-4 ring-white dark:ring-zinc-950"
                                        style={{ background: ACCENT }}
                                    />
                                    <div className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
                                        {f.etiqueta}
                                    </div>
                                    <div className="text-[13px] text-zinc-600 dark:text-zinc-400">
                                        {f.fecha ?? "Pendiente de confirmación"}
                                    </div>
                                    {f.nota && (
                                        <div className="mt-0.5 text-[12px] text-zinc-400">{f.nota}</div>
                                    )}
                                </li>
                            ))}
                        </ol>

                        {/* Alerta: captura en el momento en que lee "pendiente de confirmación" */}
                        <div className="mt-6">
                            <ConvocatoriaAlerta slug={c.slug} nombre={c.nombre} accent={ACCENT} organismo={c.organismo} />
                        </div>
                    </section>

                    {/* Plazas */}
                    <section>
                        <h2 className="mb-3 text-lg font-bold text-zinc-950 dark:text-zinc-50">Plazas</h2>
                        {c.plazasDetalle.length > 0 ? (
                            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                                {c.plazasDetalle.map((p, i) => (
                                    <li key={i} className="flex items-center justify-between px-4 py-2.5 text-[14px]">
                                        <span className="text-zinc-700 dark:text-zinc-300">{p.cuerpo}</span>
                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                            {p.plazas ?? "Pendiente"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-[14px] text-zinc-600 dark:text-zinc-400">
                                {c.plazas
                                    ? `${c.plazas} plazas.`
                                    : "Número de plazas pendiente de confirmación oficial en el BOPV."}
                            </p>
                        )}
                    </section>

                    {/* Cuerpos / requisitos */}
                    <section>
                        <h2 className="mb-3 text-lg font-bold text-zinc-950 dark:text-zinc-50">
                            Cuerpos y categorías
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {c.cuerpoOCategoria.map((cu) => (
                                <span
                                    key={cu}
                                    className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-[13px] text-zinc-700 dark:text-zinc-300"
                                >
                                    {cu}
                                </span>
                            ))}
                        </div>
                        <p className="mt-4 text-[14px] text-zinc-600 dark:text-zinc-400">
                            <strong className="text-zinc-800 dark:text-zinc-200">Euskera:</strong>{" "}
                            {c.perfilLinguistico ?? "Según la convocatoria específica."}
                        </p>
                    </section>

                </div>

                {/* Columna lateral: enlaces oficiales */}
                <aside className="lg:col-span-1">
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                        <div className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400">
                            Enlaces oficiales
                        </div>
                        <ul className="mt-3 space-y-2">
                            {c.enlacesOficiales.map((e) => (
                                <li key={e.url}>
                                    <a
                                        href={e.url}
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        className="text-[14px] font-medium hover:underline"
                                        style={{ color: ACCENT }}
                                    >
                                        {e.etiqueta} ↗
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800/70 pt-3 text-[12px] text-zinc-400">
                            Boletín: {c.boletin ?? "BOPV"}
                        </div>
                    </div>

                    {(simConv || c.testsRelacionados.length > 0) && (
                    <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                        <div className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400">
                            Mejora tu nivel
                        </div>
                        <div className="mt-3 space-y-2">
                            {simConv && (
                                <Link
                                    href={simConv.path}
                                    className="block rounded-full px-4 py-2.5 text-center text-[14px] font-semibold text-white transition-transform hover:scale-[1.02]"
                                    style={{ background: ACCENT }}
                                >
                                    Haz un simulacro gratis →
                                </Link>
                            )}
                            {c.testsRelacionados.map((t) => (
                                <Link
                                    key={t.url}
                                    href={t.url}
                                    className="block rounded-full border border-zinc-200 px-4 py-2.5 text-center text-[14px] font-semibold text-zinc-800 transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-600"
                                >
                                    {t.etiqueta} →
                                </Link>
                            ))}
                        </div>
                    </div>
                    )}
                </aside>
            </div>

            <FaqLeccion faqs={faqs} accent={ACCENT} />

            <LeccionCTA
                accent={ACCENT}
                href={cta.href}
                titulo={cta.titulo}
                texto={cta.texto}
                cta={cta.boton}
            />

            {/* Nudge del simulacro gratis: en fichas de escalas del cuerpo general (tráfico caliente) */}
            {simConv && <SimulacroNudge href={simConv.path} />}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: faqs.map((f) => ({
                                "@type": "Question",
                                name: f.q,
                                acceptedAnswer: { "@type": "Answer", text: f.a },
                            })),
                        },
                        ...eventos.map((ev) => ({
                            "@context": "https://schema.org",
                            "@type": "Event",
                            name: `${ev.etiqueta} — ${c.nombre}`,
                            startDate: ev.iso,
                            ...(ev.isoFin ? { endDate: ev.isoFin } : {}),
                            eventAttendanceMode:
                                "https://schema.org/OfflineEventAttendanceMode",
                            eventStatus: "https://schema.org/EventScheduled",
                            location: {
                                "@type": "Place",
                                name: ev.nota?.includes("BEC")
                                    ? "Bilbao Exhibition Centre (BEC), Barakaldo"
                                    : "País Vasco",
                            },
                            organizer: {
                                "@type": "Organization",
                                name: org?.nombre ?? "Administración vasca",
                            },
                            url: `${SITE_URL}/convocatorias/${c.slug}`,
                        })),
                    ]),
                }}
            />
        </main>
    )
}
