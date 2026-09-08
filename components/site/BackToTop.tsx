"use client"

import { useEffect, useRef, useState } from "react"

const ACCENT = "#10B981"

// Botón flotante "volver arriba": aparece al bajar y sube al inicio con scroll suave.
export default function BackToTop() {
    const [visible, setVisible] = useState(false)
    // Desplazamiento vertical extra cuando el nudge de la home está abierto, para
    // que ambos queden apilados en el borde derecho sin solaparse.
    const [nudgeOffset, setNudgeOffset] = useState(0)
    // Altura reservada por cada elemento pegado al fondo (marquee, nudges), por fuente.
    const offsetsRef = useRef<Record<string, number>>({})

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 500)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => {
        const onNudge = (e: Event) => {
            const d = (e as CustomEvent<{ source?: string; open: boolean; height: number }>).detail
            const key = d?.source ?? "_"
            offsetsRef.current[key] = d?.open ? d.height + 12 : 0
            setNudgeOffset(Math.max(0, ...Object.values(offsetsRef.current)))
        }
        window.addEventListener("gainditu:nudge", onNudge as EventListener)
        return () => window.removeEventListener("gainditu:nudge", onNudge as EventListener)
    }, [])

    function subir() {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
    }

    return (
        <button
            type="button"
            onClick={subir}
            aria-label="Volver arriba"
            aria-hidden={!visible}
            tabIndex={visible ? 0 : -1}
            className={`fixed right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
            }`}
            style={{ background: ACCENT, bottom: `calc(1.25rem + ${nudgeOffset}px)` }}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M12 19V5M12 5l-6 6M12 5l6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    )
}
