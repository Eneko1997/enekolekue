import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const RUTA = "/guias/personal-de-apoyo-gobierno-vasco-sin-titulacion"

export const metadata: Metadata = {
    title: "Personal de Apoyo del Gobierno Vasco: opositar sin titulación",
    description:
        "Guía de la oposición de Personal de Apoyo (Agrupación Profesional) del Gobierno Vasco: sin titulación académica, requisitos, cómo es el proceso y cómo prepararla.",
    keywords: [
        "personal de apoyo Gobierno Vasco",
        "oposiciones sin titulación Euskadi",
        "agrupación profesional empleo público",
        "OPE personal de apoyo 2026",
        "oposición sin estudios Euskadi",
    ],
    alternates: { canonical: RUTA },
}

const FAQS = [
    { q: "¿Se puede opositar a Personal de Apoyo sin titulación?", a: "Sí. Es una plaza de Agrupación Profesional, para la que no se exige una titulación académica concreta. Es una de las vías de acceso al empleo público más accesibles en cuanto a requisitos de estudios." },
    { q: "¿Qué requisitos hay entonces?", a: "Los generales para opositar: nacionalidad, edad y capacidad, entre otros. Cada convocatoria detalla los requisitos exactos en sus bases, así que conviene revisarlas antes de solicitar." },
    { q: "¿Cuántas plazas hay en 2026?", a: "La OPE del Gobierno Vasco de 2026 convocó 117 plazas de Personal de Apoyo. El plazo de inscripción estuvo abierto del 20 de agosto al 16 de septiembre de 2026." },
    { q: "¿Cuándo es el examen?", a: "No hay fecha oficial confirmada. Según las previsiones se maneja enero de 2027; conviene confirmarlo en las publicaciones oficiales del proceso." },
    { q: "¿Es un buen punto de entrada al empleo público?", a: "Para muchas personas sí: al no exigir titulación, permite acceder a una plaza pública estable y, una vez dentro, optar más adelante a la promoción interna hacia otros grupos." },
]

export default function GuiaPersonalApoyoPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guía · Gobierno Vasco"
                title="Personal de Apoyo del Gobierno Vasco: opositar sin titulación"
                subtitle="Una de las puertas de entrada más accesibles al empleo público vasco: no exige titulación académica. Te contamos cómo es y cómo prepararla."
                accent={ACCENT}
                ctaHref="#preparar"
                ctaLabel="Cómo prepararla →"
                breadcrumb={{ href: "/guias", label: "← Guías" }}
            />

            <div className="mx-auto w-full max-w-3xl px-5 py-10">
                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    La plaza de <strong>Personal de Apoyo</strong> del Gobierno Vasco es una
                    <strong> Agrupación Profesional</strong>, lo que significa que <strong>no exige una
                    titulación académica</strong> concreta. Por eso es una de las vías de acceso al empleo
                    público con menos barreras de entrada. En la OPE de 2026 se convocaron
                    <strong> 117 plazas</strong>, con inscripción del 20 de agosto al 16 de septiembre de 2026.
                </p>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Requisitos</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Al no pedir titulación, bastan los requisitos generales para opositar (nacionalidad,
                        edad y capacidad funcional, entre otros). Cada convocatoria fija los detalles exactos
                        en sus bases, por lo que conviene leerlas antes de presentar la solicitud.
                    </p>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Cómo es el proceso</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Se accede por <strong>concurso-oposición</strong>: una fase de pruebas (habitualmente
                        tipo test) y una fase de concurso en la que puntúan méritos como la experiencia y el
                        euskera. El temario es más breve que el de grupos superiores, centrado en aspectos
                        prácticos del puesto y en nociones básicas de la Administración.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/guias/concurso-oposicion-euskadi" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Cómo funciona el concurso-oposición</Link>
                        <Link href="/guias/euskera-perfiles-linguisticos-oposiciones" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ El euskera y los perfiles lingüísticos</Link>
                    </div>
                </section>

                <section id="preparar" className="mt-12 scroll-mt-20">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Cómo prepararla</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Al ser un temario más corto, la constancia y la práctica marcan la diferencia: repasa
                        los bloques con tests, entrena el formato con simulacros y llega al examen habituado a
                        responder bajo tiempo. Un plan realista, aunque dediques poco rato al día, es lo que
                        sostiene la preparación.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/oposiciones/personal-de-apoyo" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Tests de Personal de Apoyo</Link>
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
                titulo="Da el paso a tu plaza pública"
                texto="Prepara Personal de Apoyo con tests por tema, simulacros con penalización real y un plan de estudio a tu medida. Empieza gratis."
                cta="Ver cómo prepararla →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "Article", headline: "Personal de Apoyo del Gobierno Vasco: opositar sin titulación", inLanguage: "es", author: { "@type": "Organization", name: "Gainditu" }, publisher: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}${RUTA}` },
                        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
                    ]),
                }}
            />
        </main>
    )
}
