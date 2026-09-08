"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { BRAND_ACCENT } from "@/lib/theme"
import { logFunnelEvent } from "@/lib/funnel"

export default function PaymentSuccessClient() {
    const [premium, setPremium] = useState(false)
    const [checking, setChecking] = useState(true)
    // Destino tras pagar: si venías de un simulacro bloqueado, vuelves ahí.
    const [next, setNext] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()
        let tries = 0
        let cancelled = false
        let timer: ReturnType<typeof setTimeout>

        async function poll() {
            if (cancelled) return
            tries++
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("is_premium")
                    .eq("id", user.id)
                    .single()
                if (data?.is_premium) {
                    setPremium(true)
                    setChecking(false)
                    void logFunnelEvent("purchase", {})
                    return
                }
            }
            if (tries < 6) {
                timer = setTimeout(poll, 1500)
            } else {
                setChecking(false)
            }
        }

        async function activar() {
            // 1) Confirmación directa con Stripe (no depende del webhook):
            //    verifica el pago y activa premium al instante.
            try {
                const sessionId = new URLSearchParams(
                    window.location.search
                ).get("session_id")
                if (sessionId) {
                    await supabase.functions.invoke("confirm-checkout", {
                        body: { session_id: sessionId },
                    })
                }
            } catch (_e) {
                // si falla, el webhook y el polling siguen como respaldo
            }
            // 2) Comprobar el estado (y reintentar por si el webhook llega antes)
            poll()
        }

        try {
            setNext(sessionStorage.getItem("gainditu_post_pay_next"))
        } catch {}

        activar()
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [])

    // Una vez confirmado el premium, si venías de un simulacro bloqueado, vuelves ahí.
    useEffect(() => {
        if (!premium || !next) return
        try {
            sessionStorage.removeItem("gainditu_post_pay_next")
        } catch {}
        const t = setTimeout(() => {
            window.location.href = next
        }, 1400)
        return () => clearTimeout(t)
    }, [premium, next])

    return (
        <main className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md rounded-2xl border border-white/15 bg-[#141520] p-9"
            >
                <div
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                    style={{ background: `${BRAND_ACCENT}20` }}
                >
                    
                </div>
                <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white">
                    ¡Pago completado!
                </h1>
                <p className="mb-6 text-sm leading-relaxed text-white/60">
                    {checking
                        ? "Estamos activando tu acceso Premium… esto puede tardar unos segundos."
                        : premium
                          ? next
                            ? "Tu acceso Premium ya está activo. Te llevamos a tu simulacro…"
                            : "Tu acceso Premium ya está activo. ¡A por la OPE!"
                          : "Tu pago se ha registrado. Si el acceso Premium no aparece en unos minutos, escríbenos a info@gaindituoposiciones.com."}
                </p>
                <Link
                    href={premium && next ? next : "/"}
                    className="inline-block rounded-[10px] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: BRAND_ACCENT }}
                >
                    {premium && next ? "Ir a mi simulacro →" : "Ir a mi panel →"}
                </Link>
                {premium && !next && (
                    <Link
                        href="/mi-plan"
                        className="mt-3 block text-sm font-semibold text-white/70 transition-colors hover:text-white"
                    >
                        Crea tu plan de estudio personalizado →
                    </Link>
                )}
            </motion.div>
        </main>
    )
}
