import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const RUTA = "/guias/requisitos-para-opositar-euskadi"

export const metadata: Metadata = {
    title: "Requisitos para opositar en Euskadi: nacionalidad, edad y titulación",
    description:
        "Qué requisitos generales se piden para opositar al empleo público en Euskadi: nacionalidad, edad, titulación, capacidad funcional y no estar inhabilitado.",
    keywords: [
        "requisitos para opositar Euskadi",
        "requisitos oposiciones empleo público",
        "edad para opositar",
        "titulación oposiciones grupos",
        "requisitos generales EBEP",
    ],
    alternates: { canonical: RUTA },
}

const FAQS = [
    { q: "¿Hay que tener la nacionalidad española?", a: "Para la mayoría de plazas se admite también la nacionalidad de Estados de la Unión Europea y otros supuestos previstos por ley. Algunos puestos que implican ejercicio de autoridad pública sí quedan reservados a quienes tengan nacionalidad española." },
    { q: "¿Qué edad se necesita?", a: "Hay que tener cumplidos 16 años y no superar la edad máxima de jubilación forzosa. Salvo que la convocatoria fije una edad mínima distinta para un cuerpo concreto." },
    { q: "¿Qué titulación piden?", a: "Depende del grupo de la plaza: desde ninguna titulación académica en las Agrupaciones Profesionales, hasta un título universitario en los grupos A. Cada convocatoria indica la exigida." },
    { q: "¿Puedo opositar con antecedentes o una sanción?", a: "No puede haberse sido separado del servicio de una Administración ni estar en situación de inhabilitación para el empleo público. Las bases detallan este requisito." },
    { q: "¿El euskera es un requisito?", a: "Según el puesto y su fecha de preceptividad, el euskera puede ser mérito o requisito. Lo explicamos en la guía de perfiles lingüísticos." },
]

export default function GuiaRequisitosPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guía · Requisitos"
                title="Requisitos para opositar en Euskadi"
                subtitle="Antes de elegir oposición conviene saber si cumples lo básico. Estos son los requisitos generales para acceder al empleo público."
                accent={ACCENT}
                ctaHref="#requisitos"
                ctaLabel="Ver los requisitos →"
                breadcrumb={{ href: "/guias", label: "← Guías" }}
            />

            <div className="mx-auto w-full max-w-3xl px-5 py-10">
                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Para presentarse a una oposición hay que cumplir unos <strong>requisitos generales</strong>,
                    comunes a casi todas las plazas, más los <strong>específicos</strong> que fije cada
                    convocatoria (titulación, perfil lingüístico, etc.). Estos son los generales.
                </p>

                <section id="requisitos" className="mt-12 scroll-mt-20 space-y-4">
                    {[
                        ["Nacionalidad", "Española o de un Estado de la Unión Europea, además de otros supuestos previstos por ley. Algunos puestos con ejercicio de autoridad se reservan a quienes tengan nacionalidad española."],
                        ["Edad", "Tener cumplidos 16 años y no superar la edad máxima de jubilación forzosa."],
                        ["Titulación", "La que exija la plaza según su grupo: desde ninguna en las Agrupaciones Profesionales, hasta título universitario en los grupos A."],
                        ["Capacidad funcional", "Poseer la capacidad funcional para desempeñar las tareas del puesto."],
                        ["No estar inhabilitado", "No haber sido separado del servicio de una Administración ni hallarse en inhabilitación para el empleo público."],
                    ].map(([t, d]) => (
                        <div key={t} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                            <div className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{t}</div>
                            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">{d}</p>
                        </div>
                    ))}
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Además, según la plaza</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Cada convocatoria puede añadir requisitos propios: un perfil lingüístico de euskera, un
                        permiso de conducir, una habilitación concreta o el pago de la tasa de examen. Revisa
                        siempre las bases oficiales antes de presentar la solicitud.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/guias/euskera-perfiles-linguisticos-oposiciones" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ El euskera y los perfiles lingüísticos</Link>
                        <Link href="/herramientas" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Descubre qué oposición te encaja</Link>
                    </div>
                </section>
            </div>

            <div id="faq" className="scroll-mt-20">
                <FaqLeccion faqs={FAQS} accent={ACCENT} />
            </div>

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="¿Cumples los requisitos? Da el siguiente paso"
                texto="Elige tu oposición, monta tu plan de estudio y prepárala con tests, exámenes oficiales y simulacros. Empieza gratis."
                cta="Ver cómo prepararla →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "Article", headline: "Requisitos para opositar en Euskadi", inLanguage: "es", author: { "@type": "Organization", name: "Gainditu" }, publisher: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}${RUTA}` },
                        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
                    ]),
                }}
            />
        </main>
    )
}
