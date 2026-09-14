"use client"

import { useEffect, useState } from "react"

// Registra el service worker y ofrece instalar la PWA.
// - Android/escritorio: usa el evento nativo beforeinstallprompt -> botón "Instalar".
// - iOS (Safari no dispara ese evento): muestra la instrucción "Compartir -> Añadir a inicio".
// El banner es discreto, descartable y no aparece si la app ya está instalada.

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

const DISMISS_KEY = "gainditu_pwa_prompt_off"

export default function PwaSetup() {
    const [deferred, setDeferred] = useState<BIPEvent | null>(null)
    const [iosHint, setIosHint] = useState(false)
    const [visible, setVisible] = useState(false)

    // Registro del service worker.
    useEffect(() => {
        if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return
        const onLoad = () => navigator.serviceWorker.register("/sw.js").catch(() => {})
        if (document.readyState === "complete") onLoad()
        else window.addEventListener("load", onLoad, { once: true })
    }, [])

    // Lógica del banner de instalación.
    useEffect(() => {
        try {
            if (localStorage.getItem(DISMISS_KEY) === "1") return
        } catch {}
        // Ya instalada -> no molestar.
        const standalone =
            window.matchMedia?.("(display-mode: standalone)").matches ||
            // @ts-expect-error safari
            window.navigator.standalone === true
        if (standalone) return

        const onBIP = (e: Event) => {
            e.preventDefault()
            setDeferred(e as BIPEvent)
            setVisible(true)
        }
        window.addEventListener("beforeinstallprompt", onBIP)

        // iOS Safari: no hay beforeinstallprompt -> instrucción manual.
        const ua = window.navigator.userAgent || ""
        const isIOS = /iphone|ipad|ipod/i.test(ua)
        const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua)
        if (isIOS && isSafari) {
            setIosHint(true)
            setVisible(true)
        }

        return () => window.removeEventListener("beforeinstallprompt", onBIP)
    }, [])

    const cerrar = () => {
        setVisible(false)
        try {
            localStorage.setItem(DISMISS_KEY, "1")
        } catch {}
    }

    const instalar = async () => {
        if (!deferred) return
        await deferred.prompt()
        try {
            await deferred.userChoice
        } catch {}
        setDeferred(null)
        cerrar()
    }

    if (!visible) return null

    // Icono real de "Compartir" de iOS (cuadrado con flecha hacia arriba).
    const IconoCompartir = () => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path
                d="M12 3v12M12 3l-3.5 3.5M12 3l3.5 3.5"
                stroke="#0A84FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7 10H5.5A1.5 1.5 0 0 0 4 11.5v7A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 18.5 10H17"
                stroke="#0A84FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    return (
        <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            {iosHint ? (
                // iPhone: guía visual paso a paso (Apple no permite botón automático).
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B0C10] text-[22px] font-extrabold tracking-tight text-white">
                            g<span className="text-[#10B981]">.</span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[15px] font-extrabold text-zinc-900 dark:text-zinc-50">
                                Ten Gainditu en tu iPhone
                            </div>
                            <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400">
                                Se añade como una app más, en 2 pasos:
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={cerrar}
                            aria-label="Cerrar"
                            className="shrink-0 rounded-full px-2 py-1 text-[18px] leading-none text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        >
                            ×
                        </button>
                    </div>
                    <ol className="mt-3 space-y-2.5">
                        <li className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/60">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-[12px] font-bold text-white">
                                1
                            </span>
                            <span className="flex items-center gap-1.5 text-[13.5px] text-zinc-700 dark:text-zinc-200">
                                Toca el botón
                                <span className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 dark:border-zinc-700 dark:bg-zinc-900">
                                    <IconoCompartir />
                                    <strong className="text-[12.5px]">Compartir</strong>
                                </span>
                                (abajo)
                            </span>
                        </li>
                        <li className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/60">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-[12px] font-bold text-white">
                                2
                            </span>
                            <span className="text-[13.5px] text-zinc-700 dark:text-zinc-200">
                                Elige <strong>“Añadir a pantalla de inicio”</strong>
                            </span>
                        </li>
                    </ol>
                </div>
            ) : (
                // Android / escritorio: instalación de un toque.
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B0C10] text-[22px] font-extrabold tracking-tight text-white">
                        g<span className="text-[#10B981]">.</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-extrabold text-zinc-900 dark:text-zinc-50">
                            Instala Gainditu como app
                        </div>
                        <p className="mt-0.5 text-[12.5px] leading-snug text-zinc-500 dark:text-zinc-400">
                            Acceso directo desde tu pantalla de inicio. Sin ocupar apenas espacio.
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={instalar}
                                className="rounded-full bg-zinc-950 px-5 py-2 text-[13px] font-semibold text-white dark:bg-white dark:text-zinc-950"
                            >
                                Instalar app
                            </button>
                            <button
                                type="button"
                                onClick={cerrar}
                                className="rounded-full px-3 py-2 text-[13px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                            >
                                Ahora no
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
