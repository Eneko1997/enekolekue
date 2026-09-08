import Link from "next/link"
import AnimatedGlowBg from "@/components/home/AnimatedGlowBg"

const ACCENT = "#10B981"

/**
 * Banda a sangre completa (full-bleed) OSCURA con fondo en movimiento.
 * Es el "pattern interrupt" de la home: rompe color + anchura + escala de golpe
 * para cortar la linealidad del scroll. Info útil (diferenciadores reales) +
 * un único CTA a la boca del embudo (simulacro gratis). Fondo animado en CSS
 * puro (glows a la deriva), desactivado con prefers-reduced-motion.
 */

const VALORES = [
    {
        t: "Temario oficial, al día",
        d: "El del Gobierno Vasco, actualizado con cada cambio normativo. Nada de apuntes de hace cinco años.",
    },
    {
        t: "Entiendes, no memorizas",
        d: "Cada pregunta lleva su explicación: sabes por qué fallas y dejas de repetir el mismo error.",
    },
    {
        t: "Como el examen de verdad",
        d: "Simulacros cronometrados, con la penalización real de la OPE y tu nota al instante.",
    },
]

export default function ValueBand() {
    return (
        <section className="relative overflow-hidden bg-[#0B0C10] px-5 py-20 sm:py-28">
            <AnimatedGlowBg />

            <div className="relative z-10 mx-auto max-w-5xl">
                <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-300">
                    La diferencia
                </span>
                <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
                    No es un PDF más. Es el examen real, corregido al momento.
                </h2>

                <div className="mt-12 grid gap-8 sm:grid-cols-3">
                    {VALORES.map((v) => (
                        <div key={v.t}>
                            <div className="flex items-center gap-2.5">
                                <span
                                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                                        <path d="M2 6.5 5 9l5-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <h3 className="text-[15px] font-bold text-white">{v.t}</h3>
                            </div>
                            <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">{v.d}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-start gap-2">
                    <Link
                        href="/simulacro-administrativo-gobierno-vasco"
                        className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-bold text-white shadow-lg transition-transform hover:scale-[1.03]"
                        style={{ backgroundColor: ACCENT, boxShadow: "0 10px 30px -5px rgba(16,185,129,0.5)" }}
                    >
                        Simulacro gratis del Gobierno Vasco →
                    </Link>
                    <span className="text-[13px] text-zinc-500">Examen tipo GV · sin registro para empezar · en unos 60 minutos tienes tu nota.</span>
                </div>
            </div>
        </section>
    )
}
