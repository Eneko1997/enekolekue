"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { BRAND_ACCENT } from "@/lib/theme"

export default function PaymentSuccessClient() {
    const [premium, setPremium] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const supabase = createClient()
        let tries = 0
        let timer: ReturnType<typeof setTimeout>

        async function poll() {
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
                    return
                }
            }
            // El webhook de Stripe puede tardar unos segundos en activar premium.
            if (tries < 8) {
                timer = setTimeout(poll, 1500)
            } else {
                setChecking(false)
            }
        }
        poll()
        return () => clearTimeout(timer)
    }, [])

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
                    ✅
                </div>
                <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white">
                    ¡Pago completado!
                </h1>
                <p className="mb-6 text-sm leading-relaxed text-white/60">
                    {checking
                        ? "Estamos activando tu acceso Premium… esto puede tardar unos segundos."
                        : premium
                          ? "Tu acceso Premium ya está activo. ¡A por la OPE!"
                          : "Tu pago se ha registrado. Si el acceso Premium no aparece en unos minutos, escríbenos a hola@gainditu.com."}
                </p>
                <Link
                    href="/"
                    className="inline-block rounded-[10px] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: BRAND_ACCENT }}
                >
                    Ir a mi panel →
                </Link>
            </motion.div>
        </main>
    )
}
