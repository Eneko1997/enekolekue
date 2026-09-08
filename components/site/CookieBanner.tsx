"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

// Aviso de cookies poco intrusivo (abajo a la izquierda). Solo usamos cookies
// técnicas (sesión) y de pago (Stripe), no de marketing, así que es informativo:
// se guarda la aceptación en localStorage para no volver a mostrarlo.

const KEY = "gainditu-cookie-consent"

export default function CookieBanner() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        try {
            if (!localStorage.getItem(KEY)) setShow(true)
        } catch {
            /* sin localStorage: no mostramos para no molestar */
        }
    }, [])

    function accept() {
        try {
            localStorage.setItem(KEY, "1")
        } catch {
            /* ignore */
        }
        setShow(false)
    }

    if (!show) return null

    return (
        <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:left-6 sm:max-w-sm">
            <div className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-xl shadow-zinc-900/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
                <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Usamos cookies propias necesarias para mantener tu sesión y
                    procesar los pagos. No usamos cookies de publicidad ni de
                    seguimiento. Más info en la{" "}
                    <Link
                        href="/cookies"
                        className="font-semibold text-zinc-950 underline dark:text-zinc-50"
                    >
                        política de cookies
                    </Link>
                    .
                </p>
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={accept}
                        className="rounded-full bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03] dark:bg-white dark:text-zinc-950"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    )
}
