import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import { HERRAMIENTAS } from "@/lib/data/herramientas"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

export const metadata: Metadata = {
    title: "Herramientas para oposiciones de Euskadi",
    description:
        "Herramientas gratis para opositar en Euskadi: calculadora de nota de corte, calculadora de méritos del Gobierno Vasco y test de qué oposición elegir. Empieza y ve resultado hoy.",
    keywords: [
        "calculadora nota de corte oposiciones",
        "calculadora méritos gobierno vasco",
        "baremo méritos oposiciones euskadi",
        "qué oposición elegir Euskadi",
    ],
    alternates: { canonical: "/herramientas" },
}

export default function HerramientasIndex() {
    const destacada = HERRAMIENTAS.find((h) => h.destacada)
    const resto = HERRAMIENTAS.filter((h) => !h.destacada)
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Gratis · sin tarjeta"
                title="Empieza y ve resultado hoy"
                subtitle="En 3 minutos sabes a qué opositar, con qué plan y cómo vas. Calcula tu nota y tus méritos y descubre qué oposición encaja contigo."
                accent={ACCENT}
                ctaHref="#empieza"
                ctaLabel="Empezar ahora →"
            />

            {/* Onboarding: primer valor inmediato en 3 pasos */}
            <section id="empieza" className="scroll-mt-20 px-5 pt-4">
                <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-6">
                    <div className="text-[12px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>
                        Empieza hoy en 3 pasos
                    </div>
                    <p className="mt-1 text-[13.5px] text-zinc-500 dark:text-zinc-400">
                        Sin pagar nada: orienta tu oposición, calcula tu nota y haz tu primer test. Hoy.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {[
                            ["1", "Descubre tu oposición", "El análisis te dice qué encaja contigo.", "/herramientas/que-oposicion-elegir"],
                            ["2", "Calcula tu nota de corte", "Mira qué nota necesitas para tu plaza.", "/herramientas/calculadora-nota-corte"],
                            ["3", "Haz tu primer test", "Un simulacro gratis del Gobierno Vasco.", "/simulacro-administrativo-gobierno-vasco"],
                        ].map(([n, t, d, href]) => (
                            <Link
                                key={n}
                                href={href}
                                className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-extrabold text-white" style={{ background: ACCENT }}>
                                    {n}
                                </div>
                                <div className="mt-2.5 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">{t}</div>
                                <p className="mt-0.5 flex-1 text-[12.5px] text-zinc-500 dark:text-zinc-400">{d}</p>
                                <span className="mt-3 text-[12.5px] font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>
                                    Empezar →
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section id="lista" className="scroll-mt-20 px-5 py-10">
                <div className="mx-auto max-w-4xl">
                    {destacada && (
                        <Link
                            href={`/herramientas/${destacada.slug}`}
                            className="group relative mb-4 block overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/5 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900 sm:p-8"
                        >
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-60 blur-3xl"
                                style={{ background: "rgba(16,185,129,0.18)" }}
                            />
                            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="max-w-xl">
                                    <span
                                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                                        style={{ background: "rgba(16,185,129,0.14)", color: "#047857" }}
                                    >
                                        Herramienta estrella · Análisis con IA
                                    </span>
                                    <h2 className="mt-3 text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
                                        {destacada.titulo}
                                    </h2>
                                    <p className="mt-2 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                                        Responde seis preguntas y nuestro análisis cruza tu titulación, tu
                                        nivel de euskera y tu área con las convocatorias de Euskadi para
                                        decirte qué oposición te encaja —y por qué.
                                    </p>
                                    <span
                                        className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition-transform group-hover:scale-[1.02]"
                                        style={{ background: ACCENT }}
                                    >
                                        Probar el análisis →
                                    </span>
                                </div>
                                <div
                                    aria-hidden
                                    className="hidden w-52 shrink-0 rounded-xl border border-emerald-100 bg-white/70 p-4 shadow-sm dark:border-emerald-900/30 dark:bg-zinc-900/60 sm:block"
                                >
                                    <div className="text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                        Tu oposición ideal
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-100">
                                            Administrativo (C1)
                                        </span>
                                        <span className="text-[13px] font-extrabold" style={{ color: ACCENT }}>
                                            94%
                                        </span>
                                    </div>
                                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                                        <div className="h-full rounded-full" style={{ width: "94%", background: ACCENT }} />
                                    </div>
                                    <div className="mt-3 text-[9px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                        Alternativa
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-[12px] font-semibold text-zinc-600 dark:text-zinc-300">
                                            Auxiliar (C2)
                                        </span>
                                        <span className="text-[13px] font-extrabold text-zinc-500 dark:text-zinc-400">
                                            82%
                                        </span>
                                    </div>
                                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                                        <div className="h-full rounded-full bg-zinc-400 dark:bg-zinc-500" style={{ width: "82%" }} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {resto.map((h) => (
                            <Link
                                key={h.slug}
                                href={`/herramientas/${h.slug}`}
                                className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/5"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="text-[16px] font-bold text-zinc-950 dark:text-zinc-50">{h.titulo}</h2>
                                </div>
                                <p className="mt-1.5 flex-1 text-[13px] text-zinc-500 dark:text-zinc-400">{h.subtitulo}</p>
                                <span className="mt-4 text-[13px] font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>
                                    Abrir →
                                </span>
                            </Link>
                        ))}
                    </div>
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
