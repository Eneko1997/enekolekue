import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import FaqLeccion, { type Faq } from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import {
    CONVOCATORIAS,
    getConvocatoria,
    ESTADOS,
    type Convocatoria,
} from "@/lib/data/convocatorias"
import { getOrganismo } from "@/lib/data/organismos"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

export function generateStaticParams() {
    return CONVOCATORIAS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const c = getConvocatoria(slug)
    if (!c) return { title: "Convocatoria no encontrada" }
    const org = getOrganismo(c.organismo)?.corto ?? ""
    return {
        title: `${c.nombre} — Plazas y fechas`.slice(0, 60),
        description:
            `${c.resumen}`.slice(0, 155) ||
            `Convocatoria de ${org}: estado, plazas, fechas y enlaces oficiales.`,
        alternates: { canonical: `/convocatorias/${c.slug}` },
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
    const c = getConvocatoria(slug)
    if (!c) notFound()

    const org = getOrganismo(c.organismo)
    const estado = ESTADOS[c.estado]
    const faqs = faqsDe(c)
    const examen = c.fechasClave.find((f) => /examen/i.test(f.etiqueta) && f.iso)

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
                        {c.resumen}
                    </p>
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

                    {/* CTA a tests relacionados */}
                    {c.testsRelacionados.length > 0 && (
                        <section>
                            <h2 className="mb-3 text-lg font-bold text-zinc-950 dark:text-zinc-50">
                                Prepárate con tests
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {c.testsRelacionados.map((t) => (
                                    <Link
                                        key={t.url}
                                        href={t.url}
                                        className="rounded-full px-4 py-2 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
                                        style={{ background: ACCENT }}
                                    >
                                        {t.etiqueta} →
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
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

                    <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                        <div className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400">
                            Herramientas útiles
                        </div>
                        <ul className="mt-3 space-y-2 text-[14px]">
                            <li>
                                <Link href="/herramientas/calculadora-nota-corte" className="font-medium hover:underline" style={{ color: ACCENT }}>
                                    Calculadora de nota de corte →
                                </Link>
                            </li>
                            <li>
                                <Link href="/herramientas/equivalencias-perfil-linguistico" className="font-medium hover:underline" style={{ color: ACCENT }}>
                                    Equivalencias de euskera →
                                </Link>
                            </li>
                            <li>
                                <Link href="/herramientas/ratio-aspirantes-plaza" className="font-medium hover:underline" style={{ color: ACCENT }}>
                                    Ratio aspirantes / plaza →
                                </Link>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>

            <FaqLeccion faqs={faqs} accent={ACCENT} />

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Prepara tu oposición con tests"
                texto="Practica el temario oficial por tema, con simulacros y estadísticas de tu progreso. Empieza gratis."
                cta="Ver los tests →"
            />

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
                        ...(examen?.iso
                            ? [
                                  {
                                      "@context": "https://schema.org",
                                      "@type": "Event",
                                      name: `Examen — ${c.nombre}`,
                                      startDate: examen.iso,
                                      eventAttendanceMode:
                                          "https://schema.org/OfflineEventAttendanceMode",
                                      eventStatus: "https://schema.org/EventScheduled",
                                      location: {
                                          "@type": "Place",
                                          name: examen.nota?.includes("BEC")
                                              ? "Bilbao Exhibition Centre (BEC), Barakaldo"
                                              : "País Vasco",
                                      },
                                      organizer: {
                                          "@type": "Organization",
                                          name: org?.nombre ?? "Administración vasca",
                                      },
                                      url: `${SITE_URL}/convocatorias/${c.slug}`,
                                  },
                              ]
                            : []),
                    ]),
                }}
            />
        </main>
    )
}
