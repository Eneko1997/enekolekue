"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import Reveal from "@/components/home/Reveal"
import SectionHeading from "@/components/home/SectionHeading"
import { createClient } from "@/lib/supabase/client"
import { precioActualCent, precioSiguienteCent, fechaSiguienteSubida, euros, fechaLegible, PRECIO_TOPE_CENT } from "@/lib/precio"

const ACCENT = "#10B981"

const VENTAJAS = [
    "Plan de estudio personalizado hasta tu examen",
    "Exámenes oficiales de convocatorias anteriores",
    "Casos Prácticos Gainditu: la parte que marca la diferencia",
    "Simulacros con penalización real del examen",
    "Explicación con IA en cada pregunta",
    "Estadísticas avanzadas y seguimiento por tema",
]

// El Método Gainditu: el premium contado como un camino en 3 fases (mismo
// producto y bonos, solo el posicionamiento).
const FASES = [
    {
        t: "Domina el temario",
        d: "Tests por tema de toda la convocatoria, con corrección al momento y seguimiento de tu progreso.",
    },
    {
        t: "Entrena el examen real",
        d: "Exámenes oficiales de años anteriores, los Casos Prácticos Gainditu y simulacros con la penalización del examen.",
    },
    {
        t: "Plan y seguimiento",
        d: "Un plan personalizado hasta tu fecha y estadísticas por tema para saber qué reforzar cada semana.",
    },
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

    // Precio en vivo desde el calendario (lib/precio.ts): mismo que cobra Stripe.
    const precio = useMemo(() => {
        const now = new Date()
        const sig = precioSiguienteCent(now)
        const fSig = fechaSiguienteSubida(now)
        return {
            str: euros(precioActualCent(now)),
            nextStr: sig != null ? euros(sig) : null,
            nextDate: fSig ? fechaLegible(fSig) : null,
            capStr: euros(PRECIO_TOPE_CENT),
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
                            kicker="El Método Gainditu"
                            title="El método que te lleva a la plaza"
                            subtitle="No es contenido suelto: es un camino en tres fases, con todo lo que necesitas hasta el día del examen."
                        />
                        <div className="mt-6 space-y-4">
                            {FASES.map((f, i) => (
                                <div key={f.t} className="flex gap-3.5">
                                    <span
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white"
                                        style={{ backgroundColor: ACCENT }}
                                    >
                                        {i + 1}
                                    </span>
                                    <div>
                                        <div className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                                            {f.t}
                                        </div>
                                        <p className="mt-0.5 text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                                            {f.d}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-[13px] text-zinc-500 dark:text-zinc-400">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-200">Y de regalo:</span> tus impugnaciones respondidas una a una y contenido nuevo cada semana.
                        </p>
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
                                        {precio.str}€
                                    </span>
                                    <span className="text-[15px] text-zinc-400 line-through dark:text-zinc-500">
                                        263€
                                    </span>
                                    <span className="whitespace-nowrap text-[13px] font-semibold" style={{ color: ACCENT }}>
                                        pago único
                                    </span>
                                </div>
                                <div className="mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-400">
                                    Sin suscripción · hasta tu examen
                                </div>
                                {precio.nextStr && precio.nextDate && (
                                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold dark:bg-emerald-950/40" style={{ color: ACCENT }}>
                                        Sube a {precio.nextStr}€ el {precio.nextDate}
                                    </div>
                                )}
                                <Link
                                    href="/payment"
                                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.02] dark:bg-white dark:text-zinc-950"
                                >
                                    Consigue tu acceso
                                </Link>
                                <div className="mt-3 text-center text-[12px] text-zinc-500 dark:text-zinc-400">
                                    <span className="font-bold text-zinc-700 dark:text-zinc-200">Apruebas o sigues gratis</span> · 7 días de devolución
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
