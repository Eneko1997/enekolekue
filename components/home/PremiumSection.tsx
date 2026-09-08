"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Reveal from "@/components/home/Reveal"
import SectionHeading from "@/components/home/SectionHeading"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

const VENTAJAS = [
    "Plan de estudio personalizado hasta tu examen",
    "Exámenes oficiales de convocatorias anteriores",
    "Casos Prácticos Gainditu: la parte que marca la diferencia",
    "Simulacros con penalización real del examen",
    "Explicación con IA en cada pregunta",
    "Estadísticas avanzadas y seguimiento por tema",
]

export default function PremiumSection() {
    const [isPremium, setIsPremium] = useState(false)
    const [plan, setPlan] = useState<string | null>(null)

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
                .select("is_premium, premium_plan")
                .eq("id", user.id)
                .single()
            if (!cancelled && data?.is_premium) {
                setIsPremium(true)
                setPlan(data.premium_plan ?? null)
            }
        })()
        return () => {
            cancelled = true
        }
    }, [])

    // ── Premium: sin venta; acceso directo ──
    if (isPremium) {
        return (
            <section className="px-5 py-12 sm:py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Reveal>
                            <SectionHeading
                                kicker="✓ Objetivo Plaza · activo"
                                title="Ya tienes acceso completo"
                                subtitle="Tienes desbloqueado todo el material avanzado. A por la plaza."
                            />
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
                                    {plan === "lifetime"
                                        ? "Objetivo Plaza · de por vida"
                                        : "Objetivo Plaza · hasta tu examen"}
                                </div>
                                <Link
                                    href="/perfil?tab=examenes"
                                    className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03]"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    Ver mis exámenes oficiales →
                                </Link>
                                <Link
                                    href="/mi-plan"
                                    className="mt-3 text-center text-[13px] font-semibold hover:opacity-80"
                                    style={{ color: ACCENT }}
                                >
                                    Crear mi plan de estudio →
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>
        )
    }

    // ── Invitado / gratis: oferta única (pago único, hasta el examen) ──
    return (
        <section className="px-5 py-16 sm:py-24">
            <div className="mx-auto max-w-5xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100/70 bg-gradient-to-br from-emerald-50/80 via-white to-white p-7 dark:border-emerald-900/30 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-zinc-900 sm:p-12">
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/15" />
                <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Reveal>
                        <SectionHeading
                            kicker="Objetivo Plaza"
                            title="Todo para aprobar, en un solo pago"
                            subtitle="Empieza gratis y desbloquéalo todo con un pago único, sin suscripción."
                        />
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
                        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
                            <div
                                className="rounded-2xl border-2 p-6"
                                style={{ borderColor: ACCENT }}
                            >
                                <div className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                                    Objetivo Plaza · acceso hasta tu examen
                                </div>
                                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                    <span className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                                        39,99€
                                    </span>
                                    <span className="text-[15px] text-zinc-400 line-through dark:text-zinc-500">
                                        195€
                                    </span>
                                    <span className="whitespace-nowrap text-[13px] font-semibold" style={{ color: ACCENT }}>
                                        pago único
                                    </span>
                                </div>
                                <div className="mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-400">
                                    Sin suscripción · hasta tu examen
                                </div>
                                <Link
                                    href="/payment"
                                    className="mt-5 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.02]"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    Consigue tu acceso
                                </Link>
                                <div className="mt-3 text-center text-[12px] text-zinc-500 dark:text-zinc-400">
                                    Garantía de 7 días*, te devolvemos el dinero
                                    <span className="mt-0.5 block text-[11px] opacity-80">
                                        *Salvo compras a menos de un mes de un examen ya convocado.
                                    </span>
                                </div>
                            </div>
                            <Link
                                href="/signup"
                                className="text-center text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900"
                            >
                                o empieza gratis →
                            </Link>
                        </div>
                    </Reveal>
                </div>
              </div>
            </div>
        </section>
    )
}
