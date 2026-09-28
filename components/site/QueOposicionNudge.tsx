"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
    PRECIO_BASE_CENT,
    precioActualCent,
    precioSiguienteCent,
    fechaSiguienteSubida,
    fechaLegible,
    euros,
} from "@/lib/precio"

const ACCENT = "#10B981"
// localStorage (persiste entre visitas): se marca la PRIMERA vez que se muestra o al
// cerrarlo; a partir de ahí no vuelve a aparecer nunca. Así solo se ve una vez en total.
// Clave distinta para el nudge de PRECIO (promo) y para el de la herramienta, para que
// cerrar uno no oculte el otro.
const KEY = "gainditu_qo_nudge_v2"
const KEY_PROMO = "gainditu_precio_nudge_v1"

// ¿Estamos en la ventana de precio de lanzamiento (39,99 €)? Es decir, ANTES de la
// próxima subida (el día 1 del mes que viene). En cuanto sube, deja de ser promo y
// vuelve el nudge de la herramienta — sin tocar nada a mano.
function enPromoPrecio(): boolean {
    return precioActualCent() === PRECIO_BASE_CENT && precioSiguienteCent() != null
}

// Nudge discreto (home): aparece UNA sola vez (la primera visita en la que se hace scroll),
// es cerrable y no vuelve a salir. Avisa de su estado/altura por un evento para que el botón
// de "volver arriba" se coloque encima y no se solapen. Durante el precio de lanzamiento
// muestra la oferta (Método Gainditu + precio); después, la herramienta de orientación.
export default function QueOposicionNudge() {
    const [show, setShow] = useState(false)
    const [dismissed, setDismissed] = useState(true) // oculto hasta comprobar el storage
    const [isDesktop, setIsDesktop] = useState(false) // solo en PC; en móvil no aparece
    const [promo, setPromo] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)

    const storageKey = promo ? KEY_PROMO : KEY

    useEffect(() => {
        const p = enPromoPrecio()
        setPromo(p)
        try {
            // Ya se mostró/cerró alguna vez (en cualquier visita anterior) → no volver a enseñarlo.
            setDismissed(localStorage.getItem(p ? KEY_PROMO : KEY) != null)
        } catch {
            setDismissed(false)
        }
    }, [])

    // Solo escritorio: en móvil ocupa mucho y molesta al opositor.
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)")
        const apply = () => setIsDesktop(mq.matches)
        apply()
        mq.addEventListener("change", apply)
        return () => mq.removeEventListener("change", apply)
    }, [])

    // Aparece bastante más tarde (tras scroll amplio), para no interrumpir pronto.
    useEffect(() => {
        if (dismissed || !isDesktop) return
        const onScroll = () => {
            if (window.scrollY > 1800) {
                setShow(true)
                // Marcarlo como visto la PRIMERA vez que se muestra: no volverá a aparecer
                // en próximas visitas aunque no lo cierre.
                try { localStorage.setItem(storageKey, "shown") } catch {}
                window.removeEventListener("scroll", onScroll)
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [dismissed, isDesktop, storageKey])

    // Notifica a BackToTop (abierto/cerrado + altura) para evitar solapamiento.
    useEffect(() => {
        const open = show && !dismissed
        const height = open && ref.current ? ref.current.offsetHeight : 0
        window.dispatchEvent(new CustomEvent("gainditu:nudge", { detail: { source: "qo", open, height } }))
        return () => {
            window.dispatchEvent(new CustomEvent("gainditu:nudge", { detail: { source: "qo", open: false, height: 0 } }))
        }
    }, [show, dismissed])

    function cerrar() {
        setShow(false)
        setDismissed(true)
        try {
            localStorage.setItem(storageKey, "dismissed")
        } catch {}
    }

    if (dismissed || !isDesktop) return null

    const subida = fechaSiguienteSubida()
    const precioAhora = euros(precioActualCent())
    const precioNuevoCent = precioSiguienteCent()

    return (
        <div
            ref={ref}
            aria-hidden={!show}
            className={`fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-[320px] transition-all duration-500 ${
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

                {promo ? (
                    <div className="relative">
                        <span
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide"
                            style={{ color: "#047857" }}
                        >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
                            El Método Gainditu
                        </span>
                        <p className="mt-1.5 text-[15px] font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                            Tu plaza te espera
                        </p>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-[24px] font-extrabold tracking-tight" style={{ color: ACCENT }}>
                                {precioAhora} €
                            </span>
                            {precioNuevoCent != null && (
                                <span className="text-[15px] font-semibold text-zinc-400 line-through decoration-2">
                                    {euros(precioNuevoCent)} €
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                            Un pago único, hasta tu examen.
                            {subida && (
                                <>
                                    {" "}
                                    <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                                        Sube el {fechaLegible(subida)}.
                                    </span>
                                </>
                            )}
                        </p>
                        <Link
                            href="/payment"
                            onClick={cerrar}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
                            style={{ background: ACCENT }}
                        >
                            Asegurar mi acceso →
                        </Link>
                    </div>
                ) : (
                    <div className="relative">
                        <span
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide"
                            style={{ color: "#047857" }}
                        >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
                            Análisis con IA
                        </span>
                        <p className="mt-1.5 text-[14px] font-bold text-zinc-950 dark:text-zinc-50">
                            ¿No sabes qué oposición elegir?
                        </p>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                            Responde seis preguntas y te decimos la que encaja contigo, con datos de Euskadi.
                        </p>
                        <Link
                            href="/herramientas/que-oposicion-elegir"
                            onClick={cerrar}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
                            style={{ background: ACCENT }}
                        >
                            Probar el análisis →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
