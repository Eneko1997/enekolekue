import type { Metadata } from "next"
import SectionHeading from "@/components/home/SectionHeading"
import AcademiaForm from "@/components/academias/AcademiaForm"
import { SITE_URL, CONTACT_EMAIL } from "@/lib/site"

const ACCENT = "#10B981"
const PATH = "/para-academias"

const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Publicidad para academias en Gainditu"
)}`

export const metadata: Metadata = {
    title: "Para academias — anúnciate en Gainditu | Oposiciones de Euskadi",
    description:
        "Llega a los opositores del País Vasco justo donde estudian: tests, simulacros y exámenes oficiales de las OPE de Euskadi. Cuéntanos qué necesita tu academia y preparamos una propuesta.",
    alternates: { canonical: PATH },
}

const POR_QUE = [
    {
        t: "Audiencia de alta intención",
        d: "No es tráfico frío: son personas que ya preparan una oposición de Euskadi y buscan avanzar.",
    },
    {
        t: "En el contexto adecuado",
        d: "Tu academia aparece junto al temario oficial, los tests y los simulacros. Donde de verdad se decide.",
    },
    {
        t: "Segmentado por oposición",
        d: "Dirigimos tu mensaje por escala o área —administrativo, apoyo, gestión, superior— según a quién te dirijas.",
    },
    {
        t: "Centrado en Euskadi",
        d: "Contenido y audiencia de las OPE del País Vasco: Gobierno Vasco, Osakidetza, Ertzaintza y ayuntamientos.",
    },
]

const FORMAS = [
    {
        t: "Espacio destacado",
        d: "Presencia de tu academia en secciones de la web, con enlace directo a tu página.",
    },
    {
        t: "Contenido patrocinado",
        d: "Guías, artículos o tests preparados con tu marca que aportan valor real al opositor.",
    },
    {
        t: "Difusión en convocatorias",
        d: "Aparece en los avisos y el seguimiento de convocatorias, cuando la demanda está en su punto.",
    },
]

export default function ParaAcademiasPage() {
    return (
        <main className="flex flex-1 flex-col">
            {/* HERO */}
            <section className="relative isolate overflow-hidden px-5 pb-12 pt-16 sm:pt-20">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[380px]"
                    style={{
                        background: `radial-gradient(38% 60% at 20% 10%, ${ACCENT}40, transparent 70%), radial-gradient(34% 50% at 85% 0%, rgba(20,184,166,0.28), transparent 72%)`,
                        filter: "blur(50px)",
                    }}
                />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <span
                        className="inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide"
                        style={{ color: ACCENT, borderColor: `${ACCENT}55` }}
                    >
                        Para academias
                    </span>
                    <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-6xl">
                        Llega a los opositores de Euskadi, justo donde estudian
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Gainditu es donde los opositores del País Vasco hacen sus tests, simulacros y
                        exámenes oficiales. Pon tu academia delante de ellos en el momento en que están
                        estudiando.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="#contacto"
                            className="inline-flex w-full items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] sm:w-auto"
                            style={{ backgroundColor: ACCENT, boxShadow: "0 10px 25px -5px rgba(16,185,129,0.4)" }}
                        >
                            Contactar
                        </a>
                        <a
                            href="#formas"
                            className="inline-flex w-full items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-7 py-3.5 text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60 sm:w-auto"
                        >
                            Ver formas de colaborar
                        </a>
                    </div>
                </div>
            </section>

            {/* POR QUÉ */}
            <section className="px-5 py-14 sm:py-16">
                <div className="mx-auto max-w-5xl">
                    <SectionHeading
                        kicker="Por qué Gainditu"
                        title="El sitio donde ya están tus futuros alumnos"
                        subtitle="En lugar de perseguir tráfico frío, apareces ante quien ya ha decidido opositar en Euskadi."
                    />
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {POR_QUE.map((p) => (
                            <div
                                key={p.t}
                                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                                        style={{ backgroundColor: ACCENT }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                                            <path d="M2 6.5 5 9l5-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">{p.t}</h3>
                                </div>
                                <p className="mt-2 pl-9 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                                    {p.d}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FORMAS DE COLABORAR */}
            <section
                id="formas"
                className="scroll-mt-24 border-t border-zinc-100 dark:border-zinc-800/70 bg-zinc-50/60 dark:bg-zinc-900/40 px-5 py-14 sm:py-16"
            >
                <div className="mx-auto max-w-5xl">
                    <SectionHeading
                        kicker="Formas de colaborar"
                        title="Nos adaptamos a tu academia"
                        subtitle="Estas son algunas maneras de trabajar juntos. Cuéntanos tu objetivo y montamos la que mejor encaje."
                    />
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {FORMAS.map((f, i) => (
                            <div
                                key={f.t}
                                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
                            >
                                <div
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-black text-white"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    {i + 1}
                                </div>
                                <h3 className="mt-4 text-base font-bold text-zinc-950 dark:text-zinc-50">{f.t}</h3>
                                <p className="mt-2 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                                    {f.d}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACTO — formulario en sección clara normal (guarda + avisa) */}
            <section id="contacto" className="scroll-mt-24 px-5 py-14 sm:py-16">
                <div className="mx-auto max-w-2xl">
                    <SectionHeading
                        kicker="Contacto"
                        title="Cuéntanos qué necesitas"
                        subtitle="Rellena el formulario y te preparamos una propuesta a tu medida, sin compromiso."
                    />
                    <div className="mt-8">
                        <AcademiaForm />
                    </div>
                    <p className="mt-4 text-[13px] text-zinc-400 dark:text-zinc-500">
                        O escríbenos directamente a{" "}
                        <a href={MAILTO} className="text-zinc-500 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                            {CONTACT_EMAIL}
                        </a>
                    </p>
                </div>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
                            { "@type": "ListItem", position: 2, name: "Para academias", item: `${SITE_URL}${PATH}` },
                        ],
                    }),
                }}
            />
        </main>
    )
}
