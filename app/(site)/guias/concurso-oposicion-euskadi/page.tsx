import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const RUTA = "/guias/concurso-oposicion-euskadi"

export const metadata: Metadata = {
    title: "Concurso-oposición en Euskadi: cómo funciona",
    description:
        "Qué es el concurso-oposición en las oposiciones de Euskadi: la fase de oposición (exámenes), la de concurso (méritos: experiencia, titulaciones y euskera) y cómo se suma la nota final.",
    keywords: [
        "concurso-oposición Euskadi",
        "qué es el concurso-oposición",
        "fase de concurso méritos oposiciones",
        "cómo puntúa el euskera oposiciones",
        "sistema selectivo Gobierno Vasco",
    ],
    alternates: { canonical: RUTA },
}

const FAQS = [
    { q: "¿La fase de concurso elimina?", a: "No. La fase de oposición (los exámenes) es la eliminatoria; el concurso solo suma puntos por méritos y no puede, por sí mismo, dejarte fuera. Por eso el grueso del esfuerzo va a los exámenes." },
    { q: "¿Qué mérito pesa más?", a: "Por lo general, la experiencia profesional en la Administración es el mérito que más puntúa, seguida de las titulaciones y la formación. El euskera acreditado también suma según el perfil lingüístico." },
    { q: "¿El euskera es obligatorio?", a: "Depende de la plaza: en unas es requisito (perfil preceptivo) y en otras se valora como mérito en el concurso. Acreditar el perfil correspondiente casi siempre mejora tu puntuación final." },
    { q: "¿Cómo se calcula la nota final?", a: "Se suman los puntos de la oposición y los del concurso según el peso que fije la convocatoria. En la OPE del Gobierno Vasco 2026, por ejemplo, la oposición vale 100 puntos y el concurso hasta 45." },
    { q: "¿Es lo mismo que una oposición?", a: "No exactamente. En la oposición pura solo cuentan los exámenes; en el concurso-oposición, además de los exámenes, se valoran méritos previos. Es el sistema más habitual en el empleo público vasco." },
]

export default function GuiaConcursoOposicionPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guía · Sistema selectivo"
                title="Concurso-oposición en Euskadi: cómo funciona"
                subtitle="Las dos fases (oposición y concurso), qué méritos puntúan —experiencia, titulaciones y euskera— y cómo se suma la nota final."
                accent={ACCENT}
                ctaHref="#fases"
                ctaLabel="Ver cómo funciona →"
                breadcrumb={{ href: "/guias", label: "← Guías" }}
            />

            <div className="mx-auto w-full max-w-3xl px-5 py-10">
                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    El <strong>concurso-oposición</strong> es el sistema selectivo más habitual en el
                    empleo público vasco. Combina dos fases: una de <strong>oposición</strong> (los
                    exámenes) y otra de <strong>concurso</strong> (la valoración de méritos). Entenderlo
                    te ayuda a decidir dónde poner el esfuerzo.
                </p>

                <section id="fases" className="mt-12 scroll-mt-20">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">La fase de oposición</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Es la parte de exámenes y, normalmente, la <strong>eliminatoria</strong>: hay que
                        superar una nota mínima para seguir. Según la escala puede incluir test de temario,
                        casos prácticos y, en su caso, prueba de euskera. Es donde se decide la mayor parte
                        del proceso, así que es donde más rinde estudiar con método.
                    </p>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">La fase de concurso (méritos)</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        No elimina: <strong>suma puntos</strong> por lo que ya traes acreditado. Los méritos
                        típicos son:
                    </p>
                    <ul className="mt-4 space-y-2">
                        {[
                            ["Experiencia profesional", "Servicios prestados en la Administración; suele ser el mérito que más pesa."],
                            ["Titulaciones y formación", "Títulos oficiales, cursos y formación relacionada con la plaza."],
                            ["Euskera", "El perfil lingüístico acreditado puntúa como mérito (o es requisito, según la plaza)."],
                            ["Otros méritos", "Los que fije cada convocatoria (por ejemplo, otras pruebas superadas)."],
                        ].map(([t, d]) => (
                            <li key={t} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
                                <div className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">{t}</div>
                                <div className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-400">{d}</div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Cómo se suma la nota final</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        La nota final es la suma de la oposición y el concurso, con el peso que fije cada
                        convocatoria. En la OPE del Gobierno Vasco 2026, por ejemplo, la oposición vale 100
                        puntos y el concurso hasta 45. Puedes estimar tu parte de concurso con nuestra
                        calculadora de méritos.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/herramientas/calculadora-meritos-gobierno-vasco" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Calcula tu puntuación de méritos</Link>
                        <Link href="/guias/como-inscribirse-ope-gobierno-vasco-2026" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Cómo inscribirte en la OPE del GV</Link>
                        <Link href="/convocatorias" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Convocatorias abiertas</Link>
                    </div>
                </section>
            </div>

            <div id="faq" className="scroll-mt-20">
                <FaqLeccion faqs={FAQS} accent={ACCENT} />
            </div>

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Prepara la fase de oposición"
                texto="La fase eliminatoria son los exámenes: entrénalos con tests por tema, simulacros cronometrados y exámenes oficiales explicados. Empieza gratis."
                cta="Ver cómo prepararla →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "Article", headline: "Concurso-oposición en Euskadi: cómo funciona", inLanguage: "es", author: { "@type": "Organization", name: "Gainditu" }, publisher: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}${RUTA}` },
                        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
                    ]),
                }}
            />
        </main>
    )
}
