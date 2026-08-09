"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const ACCENT = "#10B981"

export type Testimonio = { n: string; e: string; t: string }

// Carrusel de opiniones: muestra 3 tarjetas fijas (sin auto-movimiento) y
// flechas izquierda/derecha para desplazarse por el resto. Responsive: 1 en
// móvil, 2 en tablet, 3 en escritorio. Navegación por scroll con snap.
export default function Testimonios({ items }: { items: Testimonio[] }) {
    const ref = useRef<HTMLDivElement>(null)
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(false)

    const actualizar = useCallback(() => {
        const el = ref.current
        if (!el) return
        setAtStart(el.scrollLeft <= 2)
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
    }, [])

    useEffect(() => {
        actualizar()
        const el = ref.current
        if (!el) return
        el.addEventListener("scroll", actualizar, { passive: true })
        window.addEventListener("resize", actualizar)
        return () => {
            el.removeEventListener("scroll", actualizar)
            window.removeEventListener("resize", actualizar)
        }
    }, [actualizar])

    function mover(dir: -1 | 1) {
        const el = ref.current
        if (!el) return
        el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" })
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                    Lo que dicen los opositores
                </h2>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => mover(-1)}
                        disabled={atStart}
                        aria-label="Ver opiniones anteriores"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 transition-colors hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => mover(1)}
                        disabled={atEnd}
                        aria-label="Ver más opiniones"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 transition-colors hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                ref={ref}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {items.map((t, i) => (
                    <figure
                        key={i}
                        className="flex shrink-0 snap-start basis-full flex-col rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
                    >
                        <div className="mb-3 flex gap-0.5" style={{ color: ACCENT }} aria-hidden>
                            {"★★★★★".split("").map((s, k) => (
                                <span key={k}>{s}</span>
                            ))}
                        </div>
                        <blockquote className="flex-1 text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                            “{t.t}”
                        </blockquote>
                        <figcaption className="mt-5 flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 text-[13px] font-bold text-white">
                                {t.n[0]}
                            </span>
                            <span>
                                <span className="block text-[13px] font-bold text-zinc-950 dark:text-zinc-50">{t.n}</span>
                                <span className="block text-[12px] text-zinc-400 dark:text-zinc-500">{t.e}</span>
                            </span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </div>
    )
}
