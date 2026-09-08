import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const RUTA = "/guias/fases-de-una-oposicion"

export const metadata: Metadata = {
    title: "Las fases de una oposición: de la convocatoria a la plaza",
    description:
        "Todas las fases de una oposición en Euskadi, en orden: convocatoria, solicitud, listas de admitidos, exámenes, concurso de méritos, lista de aprobados y toma de posesión.",
    keywords: [
        "fases de una oposición",
        "proceso selectivo pasos",
        "de la convocatoria a la plaza",
        "listas de admitidos oposiciones",
        "toma de posesión funcionario",
    ],
    alternates: { canonical: RUTA },
}

const PASOS = [
    { titulo: "Convocatoria", texto: "Se publica en el BOPV con las bases: plazas, requisitos, temario, baremo de méritos y turnos. Es el punto de partida y conviene leerla entera." },
    { titulo: "Solicitud e inscripción", texto: "Presentas la solicitud telemática dentro del plazo y pagas la tasa. Guarda el resguardo: es tu prueba de haberte inscrito." },
    { titulo: "Listas de admitidos y excluidos", texto: "Terminado el plazo se publican las listas provisionales. Si apareces excluido por un error subsanable, hay un plazo para corregirlo antes de la lista definitiva." },
    { titulo: "Fase de oposición (exámenes)", texto: "Las pruebas eliminatorias: test de temario, casos prácticos y, en su caso, euskera. Hay que superar la nota mínima para continuar." },
    { titulo: "Fase de concurso (méritos)", texto: "Se valoran los méritos acreditados (experiencia, titulaciones, euskera). No elimina: suma a la nota de la oposición." },
    { titulo: "Lista de aprobados y de personas seleccionadas", texto: "Se publica la puntuación final y quién ha superado el proceso, por orden de nota, hasta cubrir las plazas." },
    { titulo: "Elección de destino y toma de posesión", texto: "Quienes obtienen plaza eligen destino por orden de puntuación, presentan la documentación y toman posesión, adquiriendo la condición de personal funcionario o laboral fijo." },
]

const FAQS = [
    { q: "¿Cuánto dura todo el proceso?", a: "Varía mucho: desde la convocatoria hasta la toma de posesión pueden pasar de varios meses a más de un año, según el número de aspirantes y las fases. Las bases y los anuncios posteriores van marcando las fechas." },
    { q: "¿Qué pasa si me excluyen de la lista?", a: "Si es por un defecto subsanable (un documento, un dato), tendrás un plazo para corregirlo. Por eso conviene revisar siempre las listas provisionales de admitidos y guardar el resguardo de la solicitud." },
    { q: "¿La nota del concurso puede dejarme fuera?", a: "No: la fase eliminatoria es la oposición (los exámenes). El concurso solo suma méritos. Aun así, esos méritos pueden ser decisivos para el orden final cuando hay muchas personas aprobadas." },
    { q: "¿Aprobar el examen garantiza plaza?", a: "No siempre. Hay que estar entre las mejores puntuaciones hasta cubrir el número de plazas convocadas. Superar la nota mínima es necesario, pero la plaza depende del orden final." },
    { q: "¿Cuándo se elige el destino?", a: "Tras publicarse la lista de personas seleccionadas: se elige destino por orden de puntuación, se aporta la documentación y se toma posesión en el plazo señalado." },
]

export default function GuiaFasesPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guía · Proceso selectivo"
                title="Las fases de una oposición, en orden"
                subtitle="De la convocatoria a la toma de posesión: qué ocurre en cada paso y qué tienes que hacer en cada uno."
                accent={ACCENT}
                ctaHref="#fases"
                ctaLabel="Ver las fases →"
                breadcrumb={{ href: "/guias", label: "← Guías" }}
            />

            <div className="mx-auto w-full max-w-3xl px-5 py-10">
                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Saber por dónde va el proceso quita agobio y te ayuda a planificar. Estas son las
                    fases de una oposición en Euskadi, en el orden en que ocurren.
                </p>

                <section id="fases" className="mt-12 scroll-mt-20">
                    <ol className="space-y-4">
                        {PASOS.map((p, i) => (
                            <li key={i} className="flex gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-white" style={{ background: ACCENT }}>
                                    {i + 1}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{p.titulo}</div>
                                    <p className="mt-1 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">{p.texto}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/guias/como-inscribirse-ope-gobierno-vasco-2026" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Cómo inscribirte (paso a paso)</Link>
                        <Link href="/guias/concurso-oposicion-euskadi" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Qué es el concurso-oposición</Link>
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
                titulo="La fase que decide es la de exámenes"
                texto="Llega preparado a la oposición: temario, tests por tema, simulacros cronometrados y exámenes oficiales explicados. Empieza gratis."
                cta="Ver cómo prepararla →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "Article", headline: "Las fases de una oposición, en orden", inLanguage: "es", author: { "@type": "Organization", name: "Gainditu" }, publisher: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}${RUTA}` },
                        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
                    ]),
                }}
            />
        </main>
    )
}
