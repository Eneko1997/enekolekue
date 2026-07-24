"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

export default function LeccionCTA({
    titulo,
    texto,
    accent = "#10B981",
    href = "#tests",
    cta = "Empezar a practicar →",
}: {
    titulo: string
    texto: string
    accent?: string
    href?: string
    cta?: string
}) {
    // Solo los CTA que llevan a la pasarela son "venta de premium".
    const esVentaPremium = href.startsWith("/payment")
    const [isPremium, setIsPremium] = useState(false)

    useEffect(() => {
        if (!esVentaPremium) return
        const supabase = createClient()
        let cancelado = false
        ;(async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user || cancelado) return
            const { data } = await supabase
                .from("profiles")
                .select("is_premium")
                .eq("id", user.id)
                .single()
            if (!cancelado && data?.is_premium) setIsPremium(true)
        })()
        return () => {
            cancelado = true
        }
    }, [esVentaPremium])

    // Si ya es premium, no se le vende: se le da acceso a su material.
    const yaPremium = esVentaPremium && isPremium
    const tit = yaPremium ? "Ya tienes acceso Premium" : titulo
    const txt = yaPremium
        ? "Tienes desbloqueados los exámenes oficiales, los simulacros con penalización del IVAP y las estadísticas avanzadas."
        : texto
    const destino = yaPremium ? "/perfil?tab=examenes" : href
    const etiqueta = yaPremium ? "Ir a mis exámenes oficiales →" : cta

    return (
        <section className="px-5 py-14">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-zinc-950 dark:border dark:border-zinc-800 dark:bg-zinc-900 px-8 py-14 text-center sm:py-16"
            >
                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {tit}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">
                    {txt}
                </p>
                <Link
                    href={destino}
                    className="mt-7 inline-flex items-center rounded-full px-7 py-3.5 text-sm font-semibold text-zinc-950 dark:text-zinc-50 transition-transform hover:scale-[1.03]"
                    style={{ backgroundColor: accent }}
                >
                    {etiqueta}
                </Link>
            </motion.div>
        </section>
    )
}
