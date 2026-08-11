"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "@/lib/supabase/use-session"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

function Candado() {
    return (
        <span
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: "rgba(16,185,129,0.12)", color: ACCENT }}
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="2" />
                <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </span>
    )
}

// Bloquea el uso de una herramienta. Por defecto exige haber iniciado sesión
// (cuenta gratis); con `premium` exige además acceso Premium. La herramienta se
// ve difuminada por detrás para que se intuya el valor y convierta mejor.
export default function HerramientaGate({
    children,
    premium = false,
}: {
    children: React.ReactNode
    premium?: boolean
}) {
    const { user, loading } = useSession()
    const [isPremium, setIsPremium] = useState<boolean | null>(null)

    useEffect(() => {
        if (!premium) return
        const uid = user?.id
        if (!uid) {
            setIsPremium(false)
            return
        }
        let cancelled = false
        const supabase = createClient()
        supabase
            .from("profiles")
            .select("is_premium")
            .eq("id", uid)
            .single()
            .then(({ data }: { data: { is_premium?: boolean } | null }) => {
                if (!cancelled) setIsPremium(!!data?.is_premium)
            })
        return () => {
            cancelled = true
        }
    }, [premium, user?.id])

    const resolviendoPremium = premium && !!user && isPremium === null

    // Difuminado de fondo mientras se decide o cuando está bloqueado.
    const Fondo = (
        <div className="pointer-events-none select-none blur-[3px] opacity-60" aria-hidden>
            {children}
        </div>
    )

    if (loading || resolviendoPremium) {
        return <div className="relative">{Fondo}</div>
    }

    // Acceso concedido.
    if (user && (!premium || isPremium)) {
        return <>{children}</>
    }

    // Tarjeta de bloqueo.
    const bloqueoPremium = premium && !isPremium && !!user
    return (
        <div className="relative">
            {Fondo}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white/95 p-6 text-center shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
                    <Candado />
                    {bloqueoPremium ? (
                        <>
                            <h3 className="mt-4 text-lg font-bold text-zinc-950 dark:text-zinc-50">
                                Herramienta Premium
                            </h3>
                            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                Esta herramienta está incluida en el acceso Premium, junto con los
                                exámenes oficiales, los simulacros con penalización real y las
                                estadísticas avanzadas.
                            </p>
                            <Link
                                href="/payment"
                                className="mt-5 inline-flex rounded-full px-6 py-2.5 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
                                style={{ background: ACCENT }}
                            >
                                Ver acceso Premium →
                            </Link>
                        </>
                    ) : (
                        <>
                            <h3 className="mt-4 text-lg font-bold text-zinc-950 dark:text-zinc-50">
                                Inicia sesión para usar esta herramienta
                            </h3>
                            <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                Crea tu cuenta gratis y accede a todas las herramientas. Tardas
                                menos de un minuto.
                            </p>
                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                                <Link
                                    href="/signup"
                                    className="inline-flex rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
                                    style={{ background: ACCENT }}
                                >
                                    Crear cuenta gratis →
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex rounded-full border border-zinc-200 px-5 py-2.5 text-[14px] font-semibold text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-200"
                                >
                                    Entrar
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
