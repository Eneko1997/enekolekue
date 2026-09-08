"use client"

import { useEffect, useRef } from "react"
import { CONTACT_EMAIL } from "@/lib/site"

const ACCENT = "#10B981"

// Tira marquee de academias (espacio publicitario): sticky abajo, acompaña dentro de
// su contenedor y se aparca al final de este. El texto se mueve en bucle.
const MARQUEE_ITEMS = [
    "¿Tienes una academia de oposiciones?",
    "Anúnciate en Gainditu y llega a opositores del País Vasco",
    "Justo donde estudian: tests, simulacros y exámenes oficiales",
    "Cuéntanos qué necesitas y lo montamos",
]

function MarqueeGroup() {
    return (
        <div className="flex shrink-0 items-center">
            {MARQUEE_ITEMS.map((t, i) => (
                <span key={i} className="flex items-center whitespace-nowrap text-[13px] font-semibold">
                    {t}
                    <span className="mx-6" style={{ color: ACCENT }}>
                        ●
                    </span>
                </span>
            ))}
        </div>
    )
}

export default function AcademiaMarquee() {
    const ref = useRef<HTMLDivElement | null>(null)

    // Mientras el marquee "flota" pegado al fondo, avisa (evento compartido) para que
    // el botón de "volver arriba" se coloque encima y no se solapen en móvil.
    useEffect(() => {
        const el = ref.current
        const parent = el?.parentElement
        if (!el || !parent) return
        let raf = 0
        const update = () => {
            const floating = parent.getBoundingClientRect().bottom > window.innerHeight + 4
            window.dispatchEvent(
                new CustomEvent("gainditu:nudge", {
                    detail: { source: "academia", open: floating, height: floating ? el.offsetHeight : 0 },
                })
            )
        }
        const onScroll = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(update)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        update()
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
            cancelAnimationFrame(raf)
            window.dispatchEvent(
                new CustomEvent("gainditu:nudge", { detail: { source: "academia", open: false, height: 0 } })
            )
        }
    }, [])

    return (
        <div ref={ref} className="sticky bottom-0 z-40 px-4 pb-4 sm:px-5">
            <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Publicidad para academias en Gainditu")}`}
                className="marquee-group mx-auto flex max-w-5xl items-center gap-3 rounded-2xl border border-zinc-200/90 bg-white/85 px-3 py-2 text-zinc-600 shadow-lg shadow-zinc-900/5 backdrop-blur-md transition-colors hover:border-zinc-300 dark:border-zinc-800/90 dark:bg-zinc-900/85 dark:text-zinc-300 dark:hover:border-zinc-700"
            >
                <span
                    className="hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide sm:inline"
                    style={{ background: "rgba(16,185,129,0.12)", color: "#047857" }}
                >
                    Academias
                </span>
                <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
                    <div className="animate-marquee flex w-max items-center">
                        <MarqueeGroup />
                        <MarqueeGroup />
                    </div>
                </div>
                <span
                    className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white"
                    style={{ background: ACCENT }}
                >
                    Anúnciate →
                </span>
            </a>
        </div>
    )
}
