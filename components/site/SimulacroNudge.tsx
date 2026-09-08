"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const ACCENT = "#10B981"
const KEY = "gainditu_sim_nudge_dismissed"

// Nudge del simulacro gratis para fichas de convocatoria (tráfico caliente). Aparece
// tras un poco de scroll, es cerrable y recuerda el cierre en la sesión. Reutiliza el
// evento "gainditu:nudge" para que el botón de "volver arriba" se coloque encima.
export default function SimulacroNudge({
    href = "/simulacro-administrativo-gobierno-vasco",
}: {
    href?: string
}) {
    const [show, setShow] = useState(false)
    const [dismissed, setDismissed] = useState(true)
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        try {
            setDismissed(sessionStorage.getItem(KEY) === "1")
        } catch {
            setDismissed(false)
        }
    }, [])

    useEffect(() => {
        if (dismissed) return
        const onScroll = () => {
            if (window.scrollY > 500) {
                setShow(true)
                window.removeEventListener("scroll", onScroll)
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [dismissed])

    useEffect(() => {
        const open = show && !dismissed
        const height = open && ref.current ? ref.current.offsetHeight : 0
        window.dispatchEvent(new CustomEvent("gainditu:nudge", { detail: { source: "sim", open, height } }))
        return () => {
            window.dispatchEvent(new CustomEvent("gainditu:nudge", { detail: { source: "sim", open: false, height: 0 } }))
        }
    }, [show, dismissed])

    function cerrar() {
        setShow(false)
        setDismissed(true)
        try {
            sessionStorage.setItem(KEY, "1")
        } catch {}
    }

    if (dismissed) return null

    return (
        <div
            ref={ref}
            aria-hidden={!show}
            className={`fixed bottom-5 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-[320px] transition-all duration-500 ${
                show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
            }`}
        >
            <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white/95 p-4 pr-9 shadow-xl shadow-emerald-900/10 backdrop-blur dark:border-emerald-900/40 dark:bg-zinc-900/95">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-60 blur-2xl"
                    style={{ background: "rgba(16,185,129,0.18)" }}
                />
                <button
                    type="button"
                    onClick={cerrar}
                    aria-label="Cerrar"
                    className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <div className="relative">
                    <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{ color: "#047857" }}
                    >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
                        Simulacro gratis
                    </span>
                    <p className="mt-1.5 text-[14px] font-bold text-zinc-950 dark:text-zinc-50">
                        ¿Cómo llevas el temario?
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Mídete con un simulacro real del Gobierno Vasco: 60 preguntas, corregido al momento con tu nota.
                    </p>
                    <Link
                        href={href}
                        onClick={cerrar}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
                        style={{ background: ACCENT }}
                    >
                        Empezar el simulacro →
                    </Link>
                </div>
            </div>
        </div>
    )
}
