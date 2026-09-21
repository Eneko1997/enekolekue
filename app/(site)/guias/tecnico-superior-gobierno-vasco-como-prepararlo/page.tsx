import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const RUTA = "/guias/tecnico-superior-gobierno-vasco-como-prepararlo"

export const metadata: Metadata = {
    title: "Técnico Superior del Gobierno Vasco: qué estudiar y cómo prepararlo",
    description:
        "Guía de la oposición de Técnico Superior (A1) del Gobierno Vasco: titulación exigida, cómo es el concurso-oposición, qué entra en el temario y cómo prepararla.",
    keywords: [
        "técnico superior Gobierno Vasco oposición",
        "temario técnico superior Gobierno Vasco",
        "oposición A1 Euskadi",
        "OPE técnico superior Gobierno Vasco 2026",
        "cómo preparar técnico superior Euskadi",
    ],
    alternates: { canonical: RUTA },
}

const FAQS = [
    { q: "¿Qué titulación se necesita para Técnico Superior?", a: "Es una plaza del subgrupo A1, el más alto, para el que se exige un título universitario de Grado (o equivalente). El requisito exacto figura en las bases de cada convocatoria." },
    { q: "¿Cómo es el proceso selectivo?", a: "Por concurso-oposición: una fase de oposición con las pruebas (que en A1 suelen combinar test con ejercicios de desarrollo o supuestos prácticos) y una fase de concurso en la que puntúan méritos como la experiencia, las titulaciones y el euskera." },
    { q: "¿Cuándo sale la convocatoria de 2026?", a: "La OPE está aprobada y la convocatoria se preveía para octubre de 2026, pero no hay fecha oficial cerrada. Conviene confirmarlo en las publicaciones oficiales del proceso y en las convocatorias de Gainditu." },
    { q: "¿Tiene especialidades?", a: "Habitualmente sí. La parte específica del temario varía según la especialidad o escala (jurídica, económica, etc.), mientras que la parte común es compartida. Revisa qué especialidades convoca cada proceso." },
    { q: "¿Cómo puntúa el euskera?", a: "Según el perfil lingüístico del puesto y su fecha de preceptividad, el euskera puede sumar como mérito o ser requisito. Lo explicamos en la guía de perfiles lingüísticos." },
]

export default function GuiaTecnicoSuperiorPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guía · Gobierno Vasco"
                title="Técnico Superior del Gobierno Vasco: qué estudiar y cómo prepararlo"
                subtitle="La plaza de mayor nivel (A1) del Gobierno Vasco. Te contamos los requisitos, cómo es el proceso y por dónde empezar a prepararla."
                accent={ACCENT}
                ctaHref="#temario"
                ctaLabel="Ver qué entra →"
                breadcrumb={{ href: "/guias", label: "← Guías" }}
            />

            <div className="mx-auto w-full max-w-3xl px-5 py-10">
                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    La plaza de <strong>Técnico Superior</strong> del Gobierno Vasco pertenece al subgrupo
                    <strong> A1</strong>, el más alto, y para presentarse se exige un <strong>título
                    universitario de Grado</strong>. Su OPE ya está aprobada; la convocatoria se preveía para
                    octubre de 2026, aunque conviene confirmar las fechas en las publicaciones oficiales.
                </p>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Cómo es el proceso</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Es un <strong>concurso-oposición</strong>: primero la fase de oposición y después la de
                        concurso, donde puntúan méritos como la experiencia, las titulaciones y el euskera. En
                        el grupo A1 las pruebas suelen ser más completas que en grupos inferiores, combinando
                        preguntas tipo test con ejercicios de desarrollo o supuestos prácticos.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/guias/concurso-oposicion-euskadi" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Cómo funciona el concurso-oposición</Link>
                        <Link href="/guias/euskera-perfiles-linguisticos-oposiciones" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ El euskera y los perfiles lingüísticos</Link>
                    </div>
                </section>

                <section id="temario" className="mt-12 scroll-mt-20">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Qué entra en el temario</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        En A1 el temario es más amplio y con mayor profundidad. La <strong>parte común</strong>
                        suele girar en torno a estos bloques, a los que se añade una <strong>parte específica</strong>
                        según la especialidad:
                    </p>
                    <ul className="mt-4 space-y-2">
                        {[
                            "Constitución Española, organización del Estado y Unión Europea.",
                            "Instituciones vascas y Estatuto de Autonomía de Gernika.",
                            "Procedimiento administrativo (Ley 39/2015) y sector público (Ley 40/2015).",
                            "Empleo público y función pública.",
                            "Hacienda, presupuestos y contratación del sector público.",
                            "Transparencia, protección de datos e igualdad.",
                        ].map((t) => (
                            <li key={t} className="flex gap-2.5 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ACCENT }} />
                                <span>{t}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                        La parte específica depende de la especialidad convocada. Comprueba siempre el temario
                        exacto y numerado en las bases oficiales.
                    </p>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Cómo prepararla</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Con un temario extenso, la clave es un plan que reparta los bloques y reserve tiempo de
                        repaso. Afianza cada tema con tests, entrena con exámenes oficiales de convocatorias
                        anteriores y ensaya el formato completo con simulacros cronometrados y casos prácticos,
                        que en A1 pesan especialmente.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/oposiciones/tecnico-superior" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Tests de Técnico Superior</Link>
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
                titulo="Prepara Técnico Superior del Gobierno Vasco con método"
                texto="Temario, tests por tema, exámenes oficiales explicados, casos prácticos y simulacros con penalización real. Todo en un mismo sitio."
                cta="Ver cómo prepararla →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "Article", headline: "Técnico Superior del Gobierno Vasco: qué estudiar y cómo prepararlo", inLanguage: "es", author: { "@type": "Organization", name: "Gainditu" }, publisher: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}${RUTA}` },
                        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
                    ]),
                }}
            />
        </main>
    )
}
