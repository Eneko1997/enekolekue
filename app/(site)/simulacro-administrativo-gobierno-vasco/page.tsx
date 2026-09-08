import type { Metadata } from "next"
import FunnelLandingCTA from "@/components/funnel/FunnelLandingCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const PATH = "/simulacro-administrativo-gobierno-vasco"

export const metadata: Metadata = {
    title: "Simulacro Administrativo del Gobierno Vasco — gratis | Gainditu",
    description:
        "Haz gratis un simulacro tipo examen de Administrativo del Gobierno Vasco: 30 preguntas con penalización. Corrección al momento con tu nota y desglose por áreas. Sin registro para empezar.",
    alternates: { canonical: PATH },
}

const PUNTOS = [
    {
        t: "30 preguntas, tipo examen real",
        d: "30 preguntas con penalización por error, igual que en la OPE.",
    },
    {
        t: "Unos 30 minutos",
        d: "A tu ritmo. Cuando termines, corriges y ves tu resultado al instante.",
    },
    {
        t: "Nota y desglose por áreas",
        d: "Tu nota sobre 10, el veredicto apto/no apto y en qué áreas fallas más.",
    },
    {
        t: "Sin registro para empezar",
        d: "Empiezas directamente. Solo te pedimos el correo al final para darte la nota.",
    },
]

const AREAS_MOCK = [
    { l: "Constitución y derechos", p: 78 },
    { l: "Procedimiento administrativo", p: 64 },
    { l: "Empleo público", p: 41 },
    { l: "Institucional vasco y UE", p: 70 },
]

export default function Page() {
    return (
        <main className="relative flex flex-1 flex-col overflow-hidden">
            {/* Fondo con profundidad (bruma verde) sobre el blanco del layout */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute -top-32 right-[-12%] h-[520px] w-[520px] rounded-full bg-emerald-400/[0.12] blur-[130px] dark:bg-emerald-500/[0.12]" />
                <div className="absolute top-1/2 left-[-16%] h-[480px] w-[480px] rounded-full bg-emerald-300/[0.10] blur-[130px] dark:bg-emerald-500/[0.08]" />
                <div className="absolute bottom-[-10%] right-[6%] h-[460px] w-[460px] rounded-full bg-teal-300/[0.08] blur-[130px] dark:bg-teal-500/[0.06]" />
                <div className="absolute inset-0 text-zinc-900 opacity-[0.035] dark:text-zinc-100 dark:opacity-[0.05] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:46px_46px]" />
            </div>

            {/* Hero a dos columnas */}
            <section className="relative z-10 px-5 pb-10 pt-14 sm:pt-16">
                <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
                    <div>
                        <span
                            className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
                            style={{ backgroundColor: ACCENT }}
                        >
                            Simulacro gratis
                        </span>
                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
                            Simulacro Administrativo del Gobierno Vasco
                        </h1>
                        <p className="mt-4 max-w-md text-lg text-zinc-600 dark:text-zinc-300">
                            Ponte a prueba con un examen real: 30 preguntas del temario oficial, con
                            penalización, y corrección al momento con tu nota y tus puntos débiles.
                        </p>
                        <div className="mt-8">
                            <FunnelLandingCTA accent={ACCENT} />
                        </div>
                    </div>

                    {/* Mock del muro de resultados */}
                    <div className="relative mx-auto w-full max-w-sm">
                        <div aria-hidden className="absolute inset-3 rounded-[2.5rem] bg-emerald-400/25 blur-2xl dark:bg-emerald-500/20" />
                        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div>
                                <div className="mb-4 flex justify-center">
                                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">Ejemplo de resultado</span>
                                </div>
                                <div className="text-center">
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Tu nota</div>
                                    <div className="text-6xl font-black leading-none" style={{ color: ACCENT }}>7,2</div>
                                    <span className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: ACCENT }}>APTO</span>
                                </div>
                                <div className="mt-6 space-y-3.5">
                                    {AREAS_MOCK.map((a) => (
                                        <div key={a.l}>
                                            <div className="mb-1 flex justify-between text-[12px] text-zinc-500 dark:text-zinc-400">
                                                <span>{a.l}</span><span>{a.p}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                <div className="h-full rounded-full" style={{ width: `${a.p}%`, backgroundColor: a.p >= 50 ? ACCENT : "#EF4444" }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 text-center text-[12px] text-zinc-500 dark:text-zinc-400">
                                    Corregido al momento, con tu nota y el desglose por áreas.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Puntos */}
            <section className="relative z-10 px-5 pb-16">
                <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
                    {PUNTOS.map((p) => (
                        <div
                            key={p.t}
                            className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-emerald-800/50"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M2 6.5 5 9l5-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                <div className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                                    {p.t}
                                </div>
                            </div>
                            <p className="mt-2 pl-9 text-sm text-zinc-600 dark:text-zinc-300">
                                {p.d}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Quiz",
                        name: "Simulacro Administrativo del Gobierno Vasco",
                        about: "Oposición de Administrativo del Gobierno Vasco",
                        educationalLevel: "Oposición",
                        url: `${SITE_URL}${PATH}`,
                    }),
                }}
            />
        </main>
    )
}
