import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const RUTA = "/guias/penalizacion-examenes-tipo-test"

export const metadata: Metadata = {
    title: "La penalización en los exámenes tipo test: cómo funciona y cómo jugarla",
    description:
        "Cómo penalizan los errores en las oposiciones tipo test, la fórmula habitual, cuándo conviene arriesgar y cuándo dejar en blanco. Estrategia de examen.",
    keywords: [
        "penalización examen tipo test",
        "cómo penalizan los errores oposición",
        "dejar en blanco o arriesgar test",
        "fórmula penalización oposiciones",
        "estrategia examen test",
    ],
    alternates: { canonical: RUTA },
}

const FAQS = [
    { q: "¿Cómo se calcula la penalización?", a: "Varía según la convocatoria, pero una fórmula muy habitual es restar los errores divididos entre el número de opciones menos uno. Con preguntas de 4 opciones, eso significa que cada 3 respuestas incorrectas restan el valor de un acierto." },
    { q: "¿Penaliza dejar una pregunta en blanco?", a: "Con carácter general, no: las preguntas sin contestar ni suman ni restan. Solo penalizan las respuestas incorrectas. Aun así, confírmalo en las bases de tu convocatoria." },
    { q: "¿Conviene contestar si dudo?", a: "Depende de cuánto puedas descartar. Si no tienes ni idea, la penalización juega en tu contra. Pero si logras eliminar una o dos opciones, la probabilidad se vuelve favorable y suele compensar arriesgar." },
    { q: "¿Y las preguntas de reserva?", a: "Muchos exámenes incluyen preguntas de reserva que solo se corrigen si se anula alguna de las oficiales. Contéstalas igualmente: no cuesta nada y pueden acabar puntuando." },
    { q: "¿Dónde veo la penalización exacta de mi examen?", a: "En las bases de la convocatoria, publicadas en el boletín oficial. Ahí figura la fórmula concreta y si las preguntas en blanco cuentan o no." },
]

export default function GuiaPenalizacionPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guía · Técnica de examen"
                title="La penalización en los tests: cómo funciona y cómo jugarla"
                subtitle="En un examen tipo test, saber cuándo arriesgar y cuándo dejar en blanco también suma puntos. Te explicamos la mecánica y la estrategia."
                accent={ACCENT}
                ctaHref="#estrategia"
                ctaLabel="Ver la estrategia →"
                breadcrumb={{ href: "/guias", label: "← Guías" }}
            />

            <div className="mx-auto w-full max-w-3xl px-5 py-10">
                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    En la mayoría de oposiciones tipo test, <strong>las respuestas incorrectas restan</strong>.
                    El objetivo es evitar que se acierte por puro azar. Entender cómo penalizan te permite
                    decidir con criterio qué contestar y qué dejar en blanco.
                </p>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">La fórmula habitual</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Aunque cada convocatoria fija la suya, la fórmula más frecuente resta los
                        <strong> errores divididos entre el número de opciones menos uno</strong>. En un examen
                        de 4 opciones, eso significa que <strong>cada 3 fallos restan el valor de un acierto</strong>.
                        Las preguntas sin contestar, por lo general, ni suman ni restan.
                    </p>
                </section>

                <section id="estrategia" className="mt-12 scroll-mt-20 space-y-4">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">La estrategia, según lo que sepas</h2>
                    {[
                        ["La sabes", "Contesta sin dudar. Aquí no hay decisión que tomar."],
                        ["Dudas entre dos", "Suele compensar arriesgar: al descartar opciones, la probabilidad de acertar supera lo que te penalizaría fallar."],
                        ["Puedes descartar una", "La balanza empieza a inclinarse a tu favor. Contestar suele ser mejor que dejar en blanco."],
                        ["No tienes ni idea", "Aquí la penalización juega en tu contra. Salvo que la fórmula de tu examen sea muy suave, lo prudente es dejarla en blanco."],
                    ].map(([t, d]) => (
                        <div key={t} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                            <div className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{t}</div>
                            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">{d}</p>
                        </div>
                    ))}
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Entrénalo antes del examen</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Esta decisión se automatiza con la práctica. Haciendo simulacros con la misma
                        penalización que el examen real, aprendes a leer todas las opciones, a descartar con
                        cabeza y a decidir en segundos si arriesgar o pasar.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/guias/fases-de-una-oposicion" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Las fases de una oposición</Link>
                        <Link href="/convocatorias" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Ver convocatorias abiertas</Link>
                    </div>
                </section>
            </div>

            <div id="faq" className="scroll-mt-20">
                <FaqLeccion faqs={FAQS} accent={ACCENT} />
            </div>

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Entrena la penalización con simulacros reales"
                texto="Nuestros simulacros aplican la penalización del examen para que llegues al día clave con la estrategia interiorizada. Empieza gratis."
                cta="Ver cómo prepararla →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "Article", headline: "La penalización en los exámenes tipo test", inLanguage: "es", author: { "@type": "Organization", name: "Gainditu" }, publisher: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}${RUTA}` },
                        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
                    ]),
                }}
            />
        </main>
    )
}
