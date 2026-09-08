import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import LeccionHero from "@/components/lecciones/LeccionHero"
import PuntosExamen, { type Punto } from "@/components/lecciones/PuntosExamen"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import FaqLeccion, { type Faq } from "@/components/lecciones/FaqLeccion"
import EscalaTests from "@/components/escala/EscalaTests"
import { SCALE_COLORS } from "@/lib/theme"
import { SITE_URL } from "@/lib/site"
import { ESTADOS, type Convocatoria } from "@/lib/data/convocatorias"
import { getConvocatorias } from "@/lib/data/convocatorias-db"
import { getOrganismo } from "@/lib/data/organismos"

interface EscalaData {
    escala: "auxiliares" | "administrativos" | "gestion" | "superiores"
    nombre: string
    grupo: string
    color: string
    convocatoria: string
    prueba: string
    title: string
    description: string
    keywords: string[]
    intro: string
    puntos: Punto[]
    faqs: Faq[]
}

const ESCALAS: Record<string, EscalaData> = {
    "personal-de-apoyo": {
        escala: "auxiliares",
        nombre: "Personal de Apoyo",
        grupo: "E",
        color: SCALE_COLORS.auxiliares,
        convocatoria: "Septiembre 2026",
        prueba: "Enero 2027",
        title: "Oposiciones Personal de Apoyo del Gobierno Vasco — Temario y tests",
        description:
            "Prepara la oposición de la Agrupación Profesional de Personal de Apoyo del Gobierno Vasco 2026 con tests por tema del temario oficial de la convocatoria. Parte general (temas 1–14) y específicos de la agrupación.",
        keywords: [
            "oposiciones personal de apoyo Gobierno Vasco",
            "agrupación profesional personal de apoyo Euskadi 2026",
            "test personal de apoyo",
            "OPE personal de apoyo Eusko Jaurlaritza",
        ],
        intro: "Personal de Apoyo (grupo E), la puerta de entrada al empleo público vasco. Temario oficial, tema a tema y a tu ritmo.",
        puntos: [
            { t: "Parte general (T.1–14)", d: "Constitución, organización del Estado y de Euskadi, empleo público, protección de datos y prevención de riesgos." },
            { t: "Atención a la ciudadanía", d: "Derechos de la ciudadanía, comunicación escrita y oral, y atención al público." },
            { t: "Labores de apoyo", d: "Vigilancia y control de acceso, correspondencia y paquetería, almacenamiento y materiales." },
            { t: "Mantenimiento", d: "Nociones básicas de instalaciones, elementos de seguridad y mantenimiento de equipos." },
        ],
        faqs: [
            { q: "¿Qué se necesita para ser Personal de Apoyo del Gobierno Vasco?", a: "No se exige titulación académica para la Agrupación Profesional de Personal de Apoyo (grupo E); basta con los requisitos generales de acceso al empleo público." },
            { q: "¿Cuándo es el examen de Personal de Apoyo?", a: "Según el calendario provisional de la OPE, la convocatoria se prevé en septiembre de 2026 y la primera prueba en enero de 2027." },
            { q: "¿Qué temas entran en la oposición de Personal de Apoyo?", a: "El bloque común (temas 1–14) más los temas específicos de atención a la ciudadanía, vigilancia y labores de apoyo, correspondencia, almacenamiento y mantenimiento." },
        ],
    },
    administrativo: {
        escala: "administrativos",
        nombre: "Administrativo",
        grupo: "C1",
        color: SCALE_COLORS.administrativos,
        convocatoria: "Septiembre 2026",
        prueba: "Enero 2027",
        title: "Oposiciones Administrativo del Gobierno Vasco — Temario y tests",
        description:
            "Prepara la oposición de Administrativo del Gobierno Vasco 2026 con tests por tema oficial: parte general (temas 1–14), procedimiento administrativo y específicos de la escala administrativa.",
        keywords: [
            "oposiciones administrativo Gobierno Vasco",
            "administrativo Euskadi 2026",
            "test administrativo",
            "OPE administrativo Eusko Jaurlaritza",
        ],
        intro: "Escala Administrativa (C1): más procedimiento y gestión. Temario oficial, tema a tema.",
        puntos: [
            { t: "Parte general (T.1–14)", d: "Constitución, organización de Euskadi, empleo público, protección de datos y prevención de riesgos." },
            { t: "Procedimiento administrativo", d: "Ley 39/2015: acto administrativo, fases, recursos y responsabilidad." },
            { t: "Gestión y organización", d: "Documentación, registros electrónicos e interoperabilidad en la CAE." },
            { t: "Euskera e igualdad", d: "Normalización lingüística e igualdad de mujeres y hombres." },
        ],
        faqs: [
            { q: "¿Qué titulación se necesita para Administrativo del Gobierno Vasco?", a: "El título de Bachiller o Técnico (o equivalente), exigido para el subgrupo C1." },
            { q: "¿Cuándo es el examen de Administrativo?", a: "Convocatoria prevista en septiembre de 2026 y primera prueba en enero de 2027 (calendario provisional de la OPE)." },
            { q: "¿Qué diferencia hay entre Auxiliar y Administrativo?", a: "El Administrativo (C1) asume tareas de mayor responsabilidad y procedimiento, y exige una titulación superior a la del Auxiliar (C2)." },
        ],
    },
    "tecnico-gestion": {
        escala: "gestion",
        nombre: "Técnico de Gestión",
        grupo: "B",
        color: SCALE_COLORS.gestion,
        convocatoria: "Octubre 2026",
        prueba: "Abril 2027",
        title: "Oposiciones Técnico de Gestión del Gobierno Vasco — Temario y tests",
        description:
            "Prepara la oposición de Técnico de Gestión Administrativa del Gobierno Vasco 2026 con tests del temario oficial de la convocatoria: parte general, procedimiento y gestión administrativa.",
        keywords: [
            "oposiciones técnico de gestión Gobierno Vasco",
            "gestión administrativa Euskadi 2026",
            "test técnico gestión",
        ],
        intro: "Gestión Administrativa (grupo B), perfil técnico-administrativo. Temario oficial por temas, todo ordenado.",
        puntos: [
            { t: "Parte general (T.1–14)", d: "Constitución, organización de Euskadi, empleo público y protección de datos." },
            { t: "Procedimiento administrativo", d: "Ley 39/2015 y régimen jurídico del sector público." },
            { t: "Gestión administrativa", d: "Organización, documentación y tramitación de expedientes." },
            { t: "Euskera e igualdad", d: "Normalización lingüística e igualdad en la CAE." },
        ],
        faqs: [
            { q: "¿Qué titulación se necesita para Técnico de Gestión?", a: "Una titulación de grado B (Técnico Superior de FP o equivalente) según las bases de la convocatoria." },
            { q: "¿Cuándo es el examen de Técnico de Gestión?", a: "Convocatoria prevista en octubre de 2026 y primera prueba en abril de 2027 (calendario provisional de la OPE)." },
            { q: "¿Qué temas entran?", a: "El bloque común y los específicos de gestión y procedimiento administrativo." },
        ],
    },
    "tecnico-superior": {
        escala: "superiores",
        nombre: "Técnico Superior",
        grupo: "A",
        color: SCALE_COLORS.superiores,
        convocatoria: "Octubre 2026",
        prueba: "Abril 2027",
        title: "Oposiciones Técnico Superior del Gobierno Vasco — Temario y tests",
        description:
            "Prepara la oposición de la Escala Superior de Administración del Gobierno Vasco 2026 con tests del temario oficial de la convocatoria: parte general, procedimiento avanzado y régimen jurídico.",
        keywords: [
            "oposiciones técnico superior Gobierno Vasco",
            "escala superior administración Euskadi",
            "test técnico superior",
        ],
        intro: "Escala Superior (grupo A), el nivel más alto del cuerpo general. Temario oficial a base de tests.",
        puntos: [
            { t: "Parte general (T.1–14)", d: "Constitución, organización de Euskadi, empleo público y protección de datos." },
            { t: "Procedimiento avanzado", d: "Ley 39/2015 en profundidad: actos, fases, recursos y responsabilidad patrimonial." },
            { t: "Régimen jurídico", d: "Organización y funcionamiento del sector público (Ley 40/2015)." },
            { t: "Euskera e igualdad", d: "Normalización lingüística e igualdad de mujeres y hombres." },
        ],
        faqs: [
            { q: "¿Qué titulación se necesita para Técnico Superior?", a: "Un título universitario de grado (grupo A1/A2) según las bases de la convocatoria." },
            { q: "¿Cuándo es el examen de Técnico Superior?", a: "Convocatoria prevista en octubre de 2026 y primera prueba en abril de 2027 (calendario provisional de la OPE)." },
            { q: "¿Qué nivel tiene esta oposición?", a: "Es la escala más alta del cuerpo general, con mayor profundidad en derecho administrativo y régimen jurídico." },
        ],
    },
}

const ACCENT = "#10B981"

// Landing del simulacro gratis por escala (las que tienen uno montado).
const SIM_LANDING: Record<string, string> = {
    administrativo: "/simulacro-administrativo-gobierno-vasco",
    "personal-de-apoyo": "/simulacro-personal-apoyo-gobierno-vasco",
    "tecnico-gestion": "/simulacro-tecnico-gestion-gobierno-vasco",
    "tecnico-superior": "/simulacro-tecnico-superior-gobierno-vasco",
}

// Se regenera cada hora para recoger convocatorias auto-ingeridas de esta escala.
export const revalidate = 3600
const SLUGS = Object.keys(ESCALAS)

// El hub de escala es EVERGREEN y de toda Euskadi. Lista todas las convocatorias de
// esa escala (Gobierno Vasco, Diputaciones, ayuntamientos…) por grupo + palabra clave.
const ESCALA_MATCH: Record<string, { grupo: string; kw: RegExp }> = {
    "personal-de-apoyo": { grupo: "E", kw: /apoyo|subalterno|servicios/i },
    administrativo: { grupo: "C1", kw: /administrativ/i },
    "tecnico-gestion": { grupo: "B", kw: /gesti[oó]n/i },
    "tecnico-superior": { grupo: "A", kw: /superior/i },
}

function convocatoriasDeEscala(slug: string, all: Convocatoria[]): Convocatoria[] {
    const m = ESCALA_MATCH[slug]
    if (!m) return []
    return all
        .filter((c) => c.grupo === m.grupo && m.kw.test(`${c.nombre} ${c.cuerpoOCategoria.join(" ")}`))
        .sort((a, b) => ESTADOS[a.estado].orden - ESTADOS[b.estado].orden)
}

export function generateStaticParams() {
    return SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const d = ESCALAS[slug]
    if (!d) return {}
    return {
        title: d.title,
        description: d.description,
        keywords: d.keywords,
        alternates: { canonical: `/oposiciones/${slug}` },
    }
}

export default async function OposicionPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const d = ESCALAS[slug]
    if (!d) notFound()

    const convs = convocatoriasDeEscala(slug, await getConvocatorias())
    // Convocatoria destacada: abierta primero y, entre esas, la de más plazas.
    const flagship = convs.slice().sort((a, b) => {
        const ao = a.estado === "inscripcion-abierta" ? 0 : 1
        const bo = b.estado === "inscripcion-abierta" ? 0 : 1
        return ao !== bo ? ao - bo : (b.plazas ?? 0) - (a.plazas ?? 0)
    })[0]
    const flagEstado = flagship ? ESTADOS[flagship.estado] : null
    const flagPlazo = (() => {
        const fc = flagship?.fechasClave || []
        const ini = fc.find((f) => /inicio/i.test(f.etiqueta) && f.fecha)
        const fin = fc.find((f) => /fin/i.test(f.etiqueta) && f.fecha)
        const insc = fc.find((f) => /^inscrip|solicitud/i.test(f.etiqueta) && f.fecha)
        if (ini && fin) return `${ini.fecha} – ${fin.fecha}`
        if (insc?.fecha) return insc.fecha
        if (fin?.fecha) return `hasta el ${fin.fecha}`
        if (ini?.fecha) return `desde el ${ini.fecha}`
        return fc.find((f) => /plazo/i.test(f.etiqueta) && f.fecha)?.fecha
    })()
    const flagOrg = flagship ? getOrganismo(flagship.organismo)?.corto : null
    const simPath = SIM_LANDING[slug]
    const simPreguntas = slug === "administrativo" ? 30 : 60 // Administrativo se redujo a 30

    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Oposiciones de Euskadi"
                title={`Oposiciones ${d.nombre}`}
                subtitle={d.intro}
                accent={ACCENT}
                ctaHref="#tests-escala"
                ctaLabel={`Ver tests de ${d.nombre} →`}
            />

            {/* Convocatoria destacada de esta escala (la abierta con más plazas) + ver todas */}
            {flagship && flagEstado && (
                <div className="mx-auto -mt-2 mb-2 w-full max-w-4xl px-5">
                    <Link
                        href={`/convocatorias/${flagship.slug}`}
                        className="group relative block overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900"
                    >
                        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-60 blur-3xl" style={{ background: "rgba(16,185,129,0.18)" }} />
                        <div className="relative flex items-center gap-4">
                            {flagship.plazas != null && (
                                <div className="shrink-0 text-center">
                                    <div className="text-3xl font-extrabold leading-none sm:text-4xl" style={{ color: ACCENT }}>
                                        {flagship.plazas}
                                    </div>
                                    <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">plazas</div>
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <span
                                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                                    style={{ color: flagEstado.color, background: `${flagEstado.color}1f` }}
                                >
                                    {flagEstado.label}
                                </span>
                                <div className="mt-1 text-[15px] font-bold leading-snug text-zinc-950 dark:text-zinc-50">
                                    {flagOrg ? `${flagOrg} · ` : ""}{d.nombre}
                                </div>
                                {flagPlazo && (
                                    <div className="mt-0.5 text-[12.5px] text-zinc-500 dark:text-zinc-400">
                                        Plazo: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{flagPlazo}</span>
                                    </div>
                                )}
                            </div>
                            <span className="shrink-0 text-lg font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>→</span>
                        </div>
                    </Link>
                    <div className="mt-2 text-right">
                        <Link href="/convocatorias" className="text-[13px] font-semibold transition-transform hover:translate-x-0.5" style={{ color: ACCENT }}>
                            Ver todas las convocatorias de {d.nombre} →
                        </Link>
                    </div>
                </div>
            )}

            <PuntosExamen
                titulo="Qué entra en el temario"
                puntos={d.puntos}
                accent={ACCENT}
            />

            <EscalaTests escala={d.escala} nombre={d.nombre} />

            {/* Simulacro gratis de la escala: se pone a prueba tras ver los tests */}
            {simPath && (
                <div className="mx-auto w-full max-w-4xl px-5 py-4">
                    <Link
                        href={simPath}
                        className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900"
                    >
                        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-60 blur-3xl" style={{ background: "rgba(16,185,129,0.18)" }} />
                        <span
                            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                            style={{ backgroundColor: ACCENT }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M9 11l3 3 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <div className="relative min-w-0 flex-1">
                            <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white" style={{ backgroundColor: ACCENT }}>
                                Simulacro gratis
                            </span>
                            <div className="mt-1 text-[15px] font-bold leading-snug text-zinc-950 dark:text-zinc-50">
                                Ponte a prueba: simulacro de {d.nombre}
                            </div>
                            <div className="mt-0.5 text-[12.5px] text-zinc-500 dark:text-zinc-400">
                                {simPreguntas} preguntas tipo examen, con corrección al momento. Sin registro para empezar.
                            </div>
                        </div>
                        <span className="relative shrink-0 text-lg font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>→</span>
                    </Link>
                </div>
            )}

            <FaqLeccion faqs={d.faqs} accent={ACCENT} />

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Desbloquea todo el temario"
                texto="Hazte Premium y accede a exámenes oficiales, simulacros con penalización real del examen y estadísticas avanzadas."
                cta="Ver acceso Premium →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Course",
                            name: `Oposiciones ${d.nombre} en Euskadi — temario y tests`,
                            description: d.description,
                            provider: { "@type": "Organization", name: "Gainditu", url: SITE_URL },
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
                                { "@type": "ListItem", position: 2, name: "Oposiciones", item: `${SITE_URL}/oposiciones/${slug}` },
                                { "@type": "ListItem", position: 3, name: d.nombre, item: `${SITE_URL}/oposiciones/${slug}` },
                            ],
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: d.faqs.map((f) => ({
                                "@type": "Question",
                                name: f.q,
                                acceptedAnswer: { "@type": "Answer", text: f.a },
                            })),
                        },
                    ]),
                }}
            />
        </main>
    )
}
