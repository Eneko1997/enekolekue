import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const RUTA = "/guias/euskera-perfiles-linguisticos-oposiciones"

export const metadata: Metadata = {
    title: "El euskera en las oposiciones vascas: los perfiles lingüísticos (PL1-PL4)",
    description:
        "Qué son los perfiles lingüísticos en las oposiciones de Euskadi, cuándo el euskera es mérito y cuándo requisito (fecha de preceptividad) y cómo se acredita.",
    keywords: [
        "perfiles lingüísticos oposiciones",
        "euskera oposiciones Euskadi",
        "PL1 PL2 PL3 PL4",
        "fecha de preceptividad",
        "acreditar euskera oposiciones",
    ],
    alternates: { canonical: RUTA },
}

const FAQS = [
    { q: "¿El euskera es obligatorio para opositar en Euskadi?", a: "No siempre. Depende del puesto: cada plaza tiene asignado un perfil lingüístico y una fecha de preceptividad. Si esa fecha ya ha pasado, acreditar el perfil es requisito; si no, el euskera puntúa como mérito pero no impide presentarse." },
    { q: "¿Qué diferencia hay entre mérito y requisito?", a: "Como mérito, el euskera suma puntos en la fase de concurso pero no es imprescindible. Como requisito (perfil preceptivo), hay que acreditar el nivel para poder ocupar la plaza. Lo determina la fecha de preceptividad de cada puesto, que figura en las bases." },
    { q: "¿A qué nivel equivale cada perfil?", a: "De forma orientativa: PL1 se corresponde con un B1, PL2 con un B2 y PL3 y PL4 con un nivel C1 (con distinto grado de exigencia). La equivalencia oficial la fija HABE; conviene consultarla para tu caso." },
    { q: "¿Cómo acredito mi nivel de euskera?", a: "Con títulos y certificados oficiales (por ejemplo, el EGA o los certificados de HABE) o mediante las pruebas del IVAP. Existen tablas oficiales de equivalencias entre certificados y perfiles lingüísticos." },
    { q: "¿Hay exenciones?", a: "La normativa contempla algunos supuestos de exención (por ejemplo, en función de la edad). Cada convocatoria detalla si aplica y en qué condiciones: revisa siempre las bases oficiales." },
]

export default function GuiaEuskeraPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guía · Euskera"
                title="El euskera en las oposiciones: los perfiles lingüísticos"
                subtitle="En muchas plazas de Euskadi el euskera puntúa o es requisito. Entender los perfiles lingüísticos te ayuda a saber a qué puedes presentarte."
                accent={ACCENT}
                ctaHref="#perfiles"
                ctaLabel="Ver los perfiles →"
                breadcrumb={{ href: "/guias", label: "← Guías" }}
            />

            <div className="mx-auto w-full max-w-3xl px-5 py-10">
                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    En buena parte de las convocatorias de empleo público en Euskadi el conocimiento de
                    euskera influye. Cada puesto tiene asignado un <strong>perfil lingüístico</strong> y una
                    <strong> fecha de preceptividad</strong>, y de ambos depende que el euskera sea un mérito
                    que suma puntos o un requisito para ocupar la plaza.
                </p>

                <section id="perfiles" className="mt-12 scroll-mt-20 space-y-4">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Los cuatro perfiles lingüísticos</h2>
                    {[
                        ["Perfil lingüístico 1 (PL1)", "El nivel más básico, orientativamente equivalente a un B1. Habitual en puestos con menor interacción escrita en euskera."],
                        ["Perfil lingüístico 2 (PL2)", "Equivale de forma aproximada a un B2. Es uno de los más frecuentes en puestos administrativos y de atención."],
                        ["Perfil lingüístico 3 (PL3)", "Se corresponde con un nivel C1. Propio de puestos con más responsabilidad o mayor uso del euskera."],
                        ["Perfil lingüístico 4 (PL4)", "El nivel más alto (también en torno a un C1, con mayor exigencia). Reservado a puestos con un uso avanzado del idioma."],
                    ].map(([t, d]) => (
                        <div key={t} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                            <div className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{t}</div>
                            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">{d}</p>
                        </div>
                    ))}
                    <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Las equivalencias con los niveles del Marco Común Europeo son orientativas; la
                        correspondencia oficial la fija HABE.
                    </p>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Mérito o requisito: la fecha de preceptividad</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Cada puesto tiene una <strong>fecha de preceptividad</strong>. Si esa fecha ya ha
                        pasado, acreditar el perfil lingüístico es <strong>obligatorio</strong> para ocupar la
                        plaza. Si aún no ha llegado, el euskera cuenta como <strong>mérito</strong>: suma puntos
                        en la fase de concurso, pero no impide presentarse ni aprobar.
                    </p>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Cómo se acredita</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        El nivel se acredita con títulos y certificados oficiales —como el EGA o los
                        certificados de HABE— o mediante las pruebas del IVAP. Existen tablas oficiales de
                        equivalencias entre certificados y perfiles, así que conviene revisar si un título que
                        ya tienes te sirve.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/convocatorias" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Ver convocatorias abiertas</Link>
                        <Link href="/guias/concurso-oposicion-euskadi" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Cómo funciona el concurso-oposición</Link>
                    </div>
                </section>
            </div>

            <div id="faq" className="scroll-mt-20">
                <FaqLeccion faqs={FAQS} accent={ACCENT} />
            </div>

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="El euskera suma, pero el examen lo decide todo"
                texto="Prepara la parte de conocimientos con tests por tema, simulacros cronometrados y exámenes oficiales explicados. Empieza gratis."
                cta="Ver cómo prepararla →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "Article", headline: "El euskera en las oposiciones vascas: los perfiles lingüísticos", inLanguage: "es", author: { "@type": "Organization", name: "Gainditu" }, publisher: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}${RUTA}` },
                        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
                    ]),
                }}
            />
        </main>
    )
}
