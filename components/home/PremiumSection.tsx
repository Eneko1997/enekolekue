"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Reveal from "@/components/home/Reveal"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

const VENTAJAS = [
    "Exámenes oficiales de convocatorias anteriores",
    "Simulacros con penalización real del IVAP",
    "Estadísticas avanzadas y seguimiento por tema",
    "Comunidad de opositores y novedades de la OPE",
]

export default function PremiumSection() {
    const [isPremium, setIsPremium] = useState(false)

    useEffect(() => {
        const supabase = createClient()
        let cancelled = false
        ;(async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user || cancelled) return
            const { data } = await supabase
                .from("profiles")
                .select("is_premium")
                .eq("id", user.id)
                .single()
            if (!cancelled && data?.is_premium) setIsPremium(true)
        })()
        return () => {
            cancelled = true
        }
    }, [])

    // ── Usuario Premium: nada de venta; acceso directo a su material ──
    if (isPremium) {
        return (
            <section className="px-5 py-12 sm:py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Reveal>
                            <span
                                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-white"
                                style={{ backgroundColor: ACCENT }}
                            >
                                ✓ Premium activo
                            </span>
                            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                                Ya tienes acceso completo
                            </h2>
                            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
                                Tienes desbloqueado todo el material avanzado, sin
                                límites y para siempre. A por la plaza.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {VENTAJAS.map((b) => (
                                    <li
                                        key={b}
                                        className="flex items-start gap-3 text-[15px] text-zinc-700 dark:text-zinc-300"
                                    >
                                        <span
                                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                                            style={{ backgroundColor: ACCENT }}
                                        >
                                            ✓
                                        </span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                        <Reveal delay={120}>
                            <div className="flex flex-col justify-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8">
                                <div className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                    Tu acceso
                                </div>
                                <div className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                                    Premium · de por vida
                                </div>
                                <Link
                                    href="/perfil?tab=examenes"
                                    className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03]"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    Ver mis exámenes oficiales →
                                </Link>
                                <Link
                                    href="/oposiciones/administrativo#tests-escala"
                                    className="mt-3 text-center text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                >
                                    Ir a exámenes y simulacros →
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>
        )
    }

    // ── Invitado / registrado gratis: bloque de venta ──
    return (
        <section className="px-5 py-12 sm:py-20">
            <div className="mx-auto max-w-5xl">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Reveal>
                        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            Premium
                        </span>
                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                            Desbloquea todo y entra en la comunidad
                        </h2>
                        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
                            Empieza gratis y, cuando quieras dar el salto, accede a
                            todo el material avanzado con un único pago. Sin
                            suscripción.
                        </p>
                        <ul className="mt-6 space-y-3">
                            {VENTAJAS.map((b) => (
                                <li
                                    key={b}
                                    className="flex items-start gap-3 text-[15px] text-zinc-700 dark:text-zinc-300"
                                >
                                    <span
                                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                                        style={{ backgroundColor: ACCENT }}
                                    >
                                        ✓
                                    </span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                    <Reveal delay={120}>
                        <div className="flex flex-col justify-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8">
                            <div className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                Acceso completo
                            </div>
                            <div className="mt-2 flex items-end gap-2">
                                <span className="text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                                    24,99€
                                </span>
                                <span className="mb-1.5 text-[14px] text-zinc-400 dark:text-zinc-500 line-through">
                                    40€
                                </span>
                            </div>
                            <div className="mt-1 text-[14px] text-zinc-500 dark:text-zinc-400">
                                Pago único · Acceso de por vida
                            </div>
                            <Link
                                href="/payment"
                                className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03]"
                            >
                                Conseguir acceso
                            </Link>
                            <Link
                                href="/signup"
                                className="mt-3 text-center text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900"
                            >
                                o empieza gratis →
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
