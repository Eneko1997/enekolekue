import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const RUTA = "/guias/administrativo-gobierno-vasco-como-prepararlo"

export const metadata: Metadata = {
    title: "Administrativo del Gobierno Vasco: qué estudiar y cómo prepararlo",
    description:
        "Guía de la oposición de Administrativo (C1) del Gobierno Vasco: requisitos, cómo es el proceso, qué entra en el temario y cómo prepararlo paso a paso.",
    keywords: [
        "administrativo Gobierno Vasco oposición",
        "temario administrativo Gobierno Vasco",
        "oposición C1 Euskadi",
        "OPE administrativo Gobierno Vasco 2026",
        "cómo preparar administrativo Euskadi",
    ],
    alternates: { canonical: RUTA },
}

const FAQS = [
    { q: "¿Qué titulación se necesita para Administrativo del Gobierno Vasco?", a: "Es una plaza del subgrupo C1, para la que se exige el título de Bachiller o de Técnico (o equivalente). El requisito exacto figura en las bases de cada convocatoria." },
    { q: "¿Cómo es el proceso selectivo?", a: "Funciona por concurso-oposición: una fase de oposición (las pruebas, habitualmente tipo test) y una fase de concurso en la que puntúan méritos como la experiencia, las titulaciones y el euskera. La nota final suma ambas." },
    { q: "¿Cuántas plazas hay en la convocatoria de 2026?", a: "La OPE del Gobierno Vasco de 2026 convocó 305 plazas de Administrativo. El plazo de inscripción estuvo abierto del 20 de agosto al 16 de septiembre de 2026." },
    { q: "¿Cuándo es el examen?", a: "No hay fecha oficial confirmada. Según las previsiones se maneja enero de 2027, pero conviene confirmarlo siempre en las publicaciones oficiales del proceso." },
    { q: "¿Cómo puntúa el euskera?", a: "Según el perfil lingüístico del puesto y su fecha de preceptividad, el euskera puede sumar como mérito o ser requisito. Lo explicamos en la guía de perfiles lingüísticos." },
]

export default function GuiaAdministrativoPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guía · Gobierno Vasco"
                title="Administrativo del Gobierno Vasco: qué estudiar y cómo prepararlo"
                subtitle="Una de las oposiciones más demandadas de Euskadi. Te contamos los requisitos, cómo es el proceso y por dónde empezar a prepararla."
                accent={ACCENT}
                ctaHref="#temario"
                ctaLabel="Ver qué entra →"
                breadcrumb={{ href: "/guias", label: "← Guías" }}
            />

            <div className="mx-auto w-full max-w-3xl px-5 py-10">
                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    La plaza de <strong>Administrativo</strong> del Gobierno Vasco pertenece al subgrupo
                    <strong> C1</strong> y para presentarse se exige el título de Bachiller o de Técnico. En la
                    OPE de 2026 se convocaron <strong>305 plazas</strong>, con inscripción abierta del 20 de
                    agosto al 16 de septiembre de 2026.
                </p>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Cómo es el proceso</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Es un <strong>concurso-oposición</strong>: primero la fase de oposición (las pruebas,
                        habitualmente tipo test) y después la fase de concurso, donde puntúan méritos como la
                        experiencia, las titulaciones y el euskera. La nota final combina ambas fases.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/guias/concurso-oposicion-euskadi" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Cómo funciona el concurso-oposición</Link>
                        <Link href="/guias/euskera-perfiles-linguisticos-oposiciones" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ El euskera y los perfiles lingüísticos</Link>
                    </div>
                </section>

                <section id="temario" className="mt-12 scroll-mt-20">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Qué entra en el temario</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        El temario oficial está en las bases, pero los grandes bloques suelen repetirse en
                        este tipo de plazas:
                    </p>
                    <ul className="mt-4 space-y-2">
                        {[
                            "Constitución Española y organización del Estado.",
                            "Instituciones vascas y Estatuto de Autonomía de Gernika.",
                            "Procedimiento administrativo (Ley 39/2015) y sector público (Ley 40/2015).",
                            "Empleo público y función pública.",
                            "Transparencia, protección de datos y administración electrónica.",
                            "Igualdad, hacienda y contratación del sector público.",
                        ].map((t) => (
                            <li key={t} className="flex gap-2.5 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ACCENT }} />
                                <span>{t}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Comprueba siempre el temario exacto y numerado en las bases oficiales de la convocatoria.
                    </p>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Cómo prepararla</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Con el examen de tipo test, la práctica es clave: estudia cada bloque y afiánzalo con
                        tests por tema, entrena con exámenes oficiales de convocatorias anteriores y ensaya con
                        simulacros cronometrados y penalización, para llegar al día del examen con el formato
                        interiorizado.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/oposiciones/administrativo" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Tests de Administrativo</Link>
                        <Link href="/mi-plan" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Crea tu plan de estudio</Link>
                    </div>
                </section>
            </div>

            <div id="faq" className="scroll-mt-20">
                <FaqLeccion faqs={FAQS} accent={ACCENT} />
            </div>

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Prepara Administrativo del Gobierno Vasco con método"
                texto="Temario, tests por tema, exámenes oficiales explicados, casos prácticos y simulacros con penalización real. Todo en un mismo sitio."
                cta="Ver cómo prepararla →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "Article", headline: "Administrativo del Gobierno Vasco: qué estudiar y cómo prepararlo", inLanguage: "es", author: { "@type": "Organization", name: "Gainditu" }, publisher: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}${RUTA}` },
                        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
                    ]),
                }}
            />
        </main>
    )
}
