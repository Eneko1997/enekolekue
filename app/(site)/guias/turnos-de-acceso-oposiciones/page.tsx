import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const RUTA = "/guias/turnos-de-acceso-oposiciones"

export const metadata: Metadata = {
    title: "Turnos de acceso en las oposiciones: libre, promoción interna y discapacidad",
    description:
        "Qué son los turnos de acceso en las oposiciones de Euskadi: turno libre, promoción interna y reserva para personas con discapacidad. A cuál te conviene presentarte.",
    keywords: [
        "turnos de acceso oposiciones",
        "turno libre promoción interna",
        "reserva discapacidad oposiciones",
        "cupo discapacidad empleo público",
        "promoción interna Euskadi",
    ],
    alternates: { canonical: RUTA },
}

const FAQS = [
    { q: "¿Puedo presentarme por varios turnos a la vez?", a: "Depende de la convocatoria. A veces se permite concurrir simultáneamente por el turno libre y por el de reserva de discapacidad, pero cada convocatoria fija sus reglas: revísalas siempre antes de solicitar." },
    { q: "¿Qué se necesita para la promoción interna?", a: "Ser ya personal de la Administración y cumplir la antigüedad y los requisitos (cuerpo o escala de origen, titulación) que exija la convocatoria. Compite solo con otro personal interno, por lo que suele haber menos aspirantes." },
    { q: "¿Cuánto se reserva para personas con discapacidad?", a: "En las ofertas de empleo público se reserva un cupo para personas con discapacidad (como mínimo un 7% de las plazas). Las plazas no cubiertas por ese turno suelen acumularse al turno libre." },
    { q: "¿El examen es más fácil en algún turno?", a: "No necesariamente: el contenido suele ser el mismo. Lo que cambia es con quién compites y, a veces, algunas adaptaciones (por ejemplo, de tiempo o medios en el cupo de discapacidad)." },
    { q: "¿Dónde veo el turno de cada plaza?", a: "En las bases de la convocatoria, publicadas en el BOPV, que detallan cuántas plazas van a cada turno y sus requisitos. En cada ficha de convocatoria enlazamos a esas bases oficiales." },
]

export default function GuiaTurnosPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guía · Acceso"
                title="Turnos de acceso: libre, promoción interna y discapacidad"
                subtitle="No todas las plazas van al mismo saco. Elegir bien el turno puede mejorar mucho tus opciones reales de conseguir plaza."
                accent={ACCENT}
                ctaHref="#turnos"
                ctaLabel="Ver los turnos →"
                breadcrumb={{ href: "/guias", label: "← Guías" }}
            />

            <div className="mx-auto w-full max-w-3xl px-5 py-10">
                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Al leer una convocatoria conviene fijarse no solo en cuántas plazas hay, sino en
                    <strong> cómo se reparten entre turnos</strong>. La competencia y los requisitos
                    cambian según el turno, y presentarte por el que mejor encaja contigo puede marcar la
                    diferencia.
                </p>

                <section id="turnos" className="mt-12 scroll-mt-20 space-y-4">
                    {[
                        ["Turno libre", "Abierto a cualquier persona que cumpla los requisitos generales (nacionalidad, titulación, edad…). Es el turno con más plazas y, también, con más aspirantes."],
                        ["Promoción interna", "Reservado a quien ya es personal de la Administración y cumple la antigüedad y los requisitos exigidos. Se compite solo con personal interno, por lo que suele haber menos competencia."],
                        ["Reserva para personas con discapacidad", "Un cupo de plazas (como mínimo el 7% de la oferta) reservado a personas con discapacidad reconocida. Puede conllevar adaptaciones en las pruebas; las plazas no cubiertas suelen pasar al turno libre."],
                    ].map(([t, d]) => (
                        <div key={t} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                            <div className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{t}</div>
                            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">{d}</p>
                        </div>
                    ))}
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Antes de decidir</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Mira las bases de tu convocatoria: ahí figura el reparto exacto de plazas por turno
                        y sus requisitos. Elegir el turno adecuado es parte de la estrategia, tanto como el
                        estudio.
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
                titulo="Sea cual sea tu turno, el examen es el mismo"
                texto="Prepara la parte de conocimientos con tests por tema, simulacros cronometrados y exámenes oficiales explicados. Empieza gratis."
                cta="Ver cómo prepararla →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "Article", headline: "Turnos de acceso en las oposiciones de Euskadi", inLanguage: "es", author: { "@type": "Organization", name: "Gainditu" }, publisher: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}${RUTA}` },
                        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
                    ]),
                }}
            />
        </main>
    )
}
