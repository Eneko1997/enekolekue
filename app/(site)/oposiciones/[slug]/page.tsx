import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import LeccionHero from "@/components/lecciones/LeccionHero"
import PuntosExamen, { type Punto } from "@/components/lecciones/PuntosExamen"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import FaqLeccion, { type Faq } from "@/components/lecciones/FaqLeccion"
import { SCALE_COLORS } from "@/lib/theme"
import { SITE_URL } from "@/lib/site"

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
    "auxiliar-administrativo": {
        escala: "auxiliares",
        nombre: "Auxiliar Administrativo",
        grupo: "C2",
        color: SCALE_COLORS.auxiliares,
        convocatoria: "Septiembre 2026",
        prueba: "Enero 2027",
        title: "Oposiciones Auxiliar Administrativo Gobierno Vasco 2026 — Tests IVAP",
        description:
            "Prepara la oposición de Auxiliar Administrativo del Gobierno Vasco 2026 con tests por tema del temario oficial del IVAP. Parte general (temas 1–14) y específicos de la escala auxiliar.",
        keywords: [
            "oposiciones auxiliar administrativo Gobierno Vasco",
            "auxiliar administrativo Euskadi 2026",
            "test auxiliar administrativo IVAP",
            "OPE auxiliar administrativo Eusko Jaurlaritza",
        ],
        intro: "La escala Auxiliar Administrativa (subgrupo C2) es la puerta de entrada al empleo público vasco. Practica el temario oficial del IVAP tema a tema.",
        puntos: [
            { t: "Parte general (T.1–14)", d: "Constitución, organización del Estado y de Euskadi, empleo público, protección de datos y prevención de riesgos." },
            { t: "Específicos de la escala", d: "Gestión documental, archivo, registros electrónicos y atención a la ciudadanía." },
            { t: "Procedimiento administrativo", d: "Nociones de la Ley 39/2015 aplicadas al trabajo auxiliar." },
            { t: "Euskera e igualdad", d: "Normalización lingüística e igualdad de mujeres y hombres en la CAE." },
        ],
        faqs: [
            { q: "¿Qué se necesita para ser Auxiliar Administrativo del Gobierno Vasco?", a: "El título de Graduado en ESO (o equivalente). Es la titulación exigida para el subgrupo C2." },
            { q: "¿Cuándo es el examen de Auxiliar Administrativo?", a: "Según el calendario provisional del IVAP, la convocatoria se prevé en septiembre de 2026 y la primera prueba en enero de 2027." },
            { q: "¿Qué temas entran en la oposición de Auxiliar Administrativo?", a: "El bloque común (temas 1–14) más los temas específicos de gestión documental, registros y atención a la ciudadanía." },
        ],
    },
    administrativo: {
        escala: "administrativos",
        nombre: "Administrativo",
        grupo: "C1",
        color: SCALE_COLORS.administrativos,
        convocatoria: "Septiembre 2026",
        prueba: "Enero 2027",
        title: "Oposiciones Administrativo Gobierno Vasco 2026 — Tests IVAP",
        description:
            "Prepara la oposición de Administrativo del Gobierno Vasco 2026 con tests por tema oficial del IVAP: parte general (temas 1–14), procedimiento administrativo y específicos de la escala administrativa.",
        keywords: [
            "oposiciones administrativo Gobierno Vasco",
            "administrativo Euskadi 2026",
            "test administrativo IVAP",
            "OPE administrativo Eusko Jaurlaritza",
        ],
        intro: "La escala Administrativa (subgrupo C1) amplía las funciones del auxiliar con más procedimiento y gestión. Practica con el temario oficial del IVAP.",
        puntos: [
            { t: "Parte general (T.1–14)", d: "Constitución, organización de Euskadi, empleo público, protección de datos y prevención de riesgos." },
            { t: "Procedimiento administrativo", d: "Ley 39/2015: acto administrativo, fases, recursos y responsabilidad." },
            { t: "Gestión y organización", d: "Documentación, registros electrónicos e interoperabilidad en la CAE." },
            { t: "Euskera e igualdad", d: "Normalización lingüística e igualdad de mujeres y hombres." },
        ],
        faqs: [
            { q: "¿Qué titulación se necesita para Administrativo del Gobierno Vasco?", a: "El título de Bachiller o Técnico (o equivalente), exigido para el subgrupo C1." },
            { q: "¿Cuándo es el examen de Administrativo?", a: "Convocatoria prevista en septiembre de 2026 y primera prueba en enero de 2027 (calendario provisional del IVAP)." },
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
        title: "Oposiciones Técnico de Gestión Gobierno Vasco 2026 — Tests IVAP",
        description:
            "Prepara la oposición de Técnico de Gestión Administrativa del Gobierno Vasco 2026 con tests del temario oficial del IVAP: parte general, procedimiento y gestión administrativa.",
        keywords: [
            "oposiciones técnico de gestión Gobierno Vasco",
            "gestión administrativa Euskadi 2026",
            "test técnico gestión IVAP",
        ],
        intro: "La escala de Gestión Administrativa (grupo B) requiere un perfil técnico-administrativo. Practica el temario oficial del IVAP por temas.",
        puntos: [
            { t: "Parte general (T.1–14)", d: "Constitución, organización de Euskadi, empleo público y protección de datos." },
            { t: "Procedimiento administrativo", d: "Ley 39/2015 y régimen jurídico del sector público." },
            { t: "Gestión administrativa", d: "Organización, documentación y tramitación de expedientes." },
            { t: "Euskera e igualdad", d: "Normalización lingüística e igualdad en la CAE." },
        ],
        faqs: [
            { q: "¿Qué titulación se necesita para Técnico de Gestión?", a: "Una titulación de grado B (Técnico Superior de FP o equivalente) según las bases de la convocatoria." },
            { q: "¿Cuándo es el examen de Técnico de Gestión?", a: "Convocatoria prevista en octubre de 2026 y primera prueba en abril de 2027 (calendario provisional del IVAP)." },
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
        title: "Oposiciones Técnico Superior de Administración Gobierno Vasco 2026 — Tests IVAP",
        description:
            "Prepara la oposición de la Escala Superior de Administración del Gobierno Vasco 2026 con tests del temario oficial del IVAP: parte general, procedimiento avanzado y régimen jurídico.",
        keywords: [
            "oposiciones técnico superior Gobierno Vasco",
            "escala superior administración Euskadi",
            "test técnico superior IVAP",
        ],
        intro: "La Escala Superior de Administración (grupo A) es el nivel más alto del cuerpo general. Practica el temario oficial del IVAP a base de tests.",
        puntos: [
            { t: "Parte general (T.1–14)", d: "Constitución, organización de Euskadi, empleo público y protección de datos." },
            { t: "Procedimiento avanzado", d: "Ley 39/2015 en profundidad: actos, fases, recursos y responsabilidad patrimonial." },
            { t: "Régimen jurídico", d: "Organización y funcionamiento del sector público (Ley 40/2015)." },
            { t: "Euskera e igualdad", d: "Normalización lingüística e igualdad de mujeres y hombres." },
        ],
        faqs: [
            { q: "¿Qué titulación se necesita para Técnico Superior?", a: "Un título universitario de grado (grupo A1/A2) según las bases de la convocatoria." },
            { q: "¿Cuándo es el examen de Técnico Superior?", a: "Convocatoria prevista en octubre de 2026 y primera prueba en abril de 2027 (calendario provisional del IVAP)." },
            { q: "¿Qué nivel tiene esta oposición?", a: "Es la escala más alta del cuerpo general, con mayor profundidad en derecho administrativo y régimen jurídico." },
        ],
    },
}

const SLUGS = Object.keys(ESCALAS)

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

    const dashHref = `/?escala=${d.escala}`

    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="OPE Gobierno Vasco 2026"
                title={`Oposiciones ${d.nombre}`}
                subtitle={d.intro}
                accent={d.color}
                ctaHref={dashHref}
                ctaLabel={`Ver tests de ${d.nombre} →`}
                stats={[
                    { n: d.grupo, label: "grupo" },
                    { n: d.convocatoria.split(" ")[0], label: "convocatoria" },
                    { n: d.prueba.split(" ")[0], label: "1ª prueba" },
                    { n: "IVAP", label: "temario" },
                ]}
            />

            <PuntosExamen
                titulo="Qué entra en el temario"
                puntos={d.puntos}
                accent={d.color}
            />

            <section className="px-5 py-8">
                <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:p-8">
                    <h2 className="text-xl font-bold text-white">
                        Practica los tests de {d.nombre}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
                        Accede al catálogo completo de tests por tema de la escala{" "}
                        {d.nombre} del Gobierno Vasco, con el bloque común y los
                        específicos, y mide tu progreso.
                    </p>
                    <Link
                        href={dashHref}
                        className="mt-5 inline-flex items-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                        style={{
                            backgroundColor: d.color,
                            boxShadow: `0 14px 40px -12px ${d.color}88`,
                        }}
                    >
                        Ver todos los tests →
                    </Link>
                </div>
            </section>

            <FaqLeccion faqs={d.faqs} accent={d.color} />

            <LeccionCTA
                accent={d.color}
                href="/payment"
                titulo="Desbloquea todo el temario"
                texto="Hazte Premium y accede a exámenes oficiales, simulacros con penalización real del IVAP y estadísticas avanzadas."
                cta="Ver acceso Premium →"
            />

            <div className="mx-auto mb-12 max-w-4xl px-5">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
                    {SLUGS.filter((s) => s !== slug).map((s) => (
                        <Link
                            key={s}
                            href={`/oposiciones/${s}`}
                            className="hover:text-white hover:underline"
                        >
                            → Oposiciones {ESCALAS[s].nombre}
                        </Link>
                    ))}
                    <Link href="/fechas-opes" className="hover:text-white hover:underline">
                        → Fechas de las OPEs 2026
                    </Link>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Course",
                            name: `Oposiciones ${d.nombre} — Gobierno Vasco 2026`,
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
