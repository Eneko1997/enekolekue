"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { precioActualCent, euros } from "@/lib/precio"

// Banda de premium STICKY: pastilla fija abajo y centrada. Ancla el Método
// Gainditu sin ocupar sitio en el flujo de la página. Compacta y cerrable
// (por sesión, para que no moleste). Precio en vivo desde lib/precio.ts.
const KEY = "gainditu_premband_off"

export default function PremiumBand() {
    const [hidden, setHidden] = useState(true) // oculto hasta comprobar el storage

    useEffect(() => {
        try {
            setHidden(sessionStorage.getItem(KEY) === "1")
        } catch {
            setHidden(false)
        }
    }, [])

    if (hidden) return null

    const precio = euros(precioActualCent())

    return (
        <div className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-200/70 bg-white/95 py-2 pl-4 pr-2 shadow-xl shadow-emerald-900/10 backdrop-blur dark:border-emerald-900/40 dark:bg-zinc-900/95 sm:max-w-xl">
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold text-zinc-900 dark:text-zinc-100">
                <span className="text-emerald-600 dark:text-emerald-400">Método Gainditu</span>
                <span className="font-normal text-zinc-500 dark:text-zinc-400">
                    <span className="sm:hidden"> · empieza hoy</span>
                    <span className="hidden sm:inline"> · todo para tu oposición, un pago</span>
                </span>
            </span>
            <Link
                href="/payment"
                className="shrink-0 rounded-full bg-emerald-500 px-4 py-2 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
            >
                {precio} € →
            </Link>
            <button
                type="button"
                onClick={() => {
                    try { sessionStorage.setItem(KEY, "1") } catch {}
                    setHidden(true)
                }}
                aria-label="Cerrar"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
        </div>
    )
}
