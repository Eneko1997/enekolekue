import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import { HERRAMIENTAS } from "@/lib/data/herramientas"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

export const metadata: Metadata = {
    title: "Herramientas para oposiciones de Euskadi",
    description:
        "Herramientas para opositar en Euskadi: calculadora de nota de corte, ratio aspirantes/plaza, equivalencias de perfil lingüístico y test de qué oposición elegir. Con tu cuenta gratis.",
    keywords: [
        "calculadora nota de corte oposiciones",
        "equivalencias perfil lingüístico euskera",
        "ratio aspirantes plaza",
        "qué oposición elegir Euskadi",
    ],
    alternates: { canonical: "/herramientas" },
}

export default function HerramientasIndex() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Con tu cuenta gratis"
                title="Herramientas"
                subtitle="Utilidades para opositar en Euskadi: calcula tu nota, mira cómo de competida está tu plaza, convierte tu nivel de euskera y descubre qué oposición encaja contigo. Gratis con tu cuenta."
                accent={ACCENT}
                ctaHref="#lista"
                ctaLabel="Ver herramientas →"
                stats={[
                    { n: String(HERRAMIENTAS.length), label: "herramientas" },
                    { n: "Gratis", label: "con tu cuenta" },
                    { n: "1", label: "Premium" },
                    { n: "Euskadi", label: "enfoque" },
                ]}
            />

            <section id="lista" className="scroll-mt-20 px-5 py-10">
                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
                    {HERRAMIENTAS.map((h) => (
                        <Link
                            key={h.slug}
                            href={`/herramientas/${h.slug}`}
                            className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/5"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <h2 className="text-[16px] font-bold text-zinc-950 dark:text-zinc-50">{h.titulo}</h2>
                                {h.premium && (
                                    <span
                                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                                        style={{ background: "rgba(16,185,129,0.12)", color: "#047857" }}
                                    >
                                        Premium
                                    </span>
                                )}
                            </div>
                            <p className="mt-1.5 flex-1 text-[13px] text-zinc-500 dark:text-zinc-400">{h.subtitulo}</p>
                            <span className="mt-4 text-[13px] font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>
                                Abrir →
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        name: "Herramientas para oposiciones de Euskadi",
                        itemListElement: HERRAMIENTAS.map((h, i) => ({
                            "@type": "ListItem",
                            position: i + 1,
                            name: h.titulo,
                            url: `${SITE_URL}/herramientas/${h.slug}`,
                        })),
                    }),
                }}
            />
        </main>
    )
}
