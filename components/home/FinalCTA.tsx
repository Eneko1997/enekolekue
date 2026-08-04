"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Reveal from "@/components/home/Reveal"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

// CTA final de la home, adaptado a la sesión:
//  - invitado (sin sesión): "Crea tu cuenta gratis" → /signup
//  - registrado gratis:     "Sigue preparando tu plaza" → /perfil
//  - premium:               sin venta ni signup, acceso directo a su material
// Mismo patrón de detección que PremiumSection (profiles.is_premium).

type Estado = "cargando" | "invitado" | "gratis" | "premium"

export default function FinalCTA() {
    const [estado, setEstado] = useState<Estado>("cargando")

    useEffect(() => {
        const supabase = createClient()
        let cancelled = false
        ;(async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (cancelled) return
            if (!user) {
                setEstado("invitado")
                return
            }
            const { data } = await supabase
                .from("profiles")
                .select("is_premium")
                .eq("id", user.id)
                .single()
            if (cancelled) return
            setEstado(data?.is_premium ? "premium" : "gratis")
        })()
        return () => {
            cancelled = true
        }
    }, [])

    // Mientras resolvemos la sesión no mostramos nada, para que un usuario
    // premium NUNCA llegue a ver (ni de refilón) el CTA de "crea tu cuenta".
    if (estado === "cargando") return null

    const contenido =
        estado === "premium"
            ? {
                  titulo: "A por tu plaza",
                  texto: "Tienes acceso completo: exámenes oficiales, simulacros con penalización real y estadísticas de tu progreso.",
                  cta: "Ver mis exámenes oficiales →",
                  href: "/perfil?tab=examenes",
              }
            : estado === "gratis"
              ? {
                    titulo: "Sigue preparando tu plaza",
                    texto: "Continúa practicando el temario oficial de la convocatoria y mide tu progreso tema a tema.",
                    cta: "Ir a mis tests →",
                    href: "/perfil",
                }
              : {
                    titulo: "Empieza a preparar tu plaza hoy",
                    texto: "Crea tu cuenta gratis y practica el temario oficial de la convocatoria desde el primer minuto.",
                    cta: "Empieza gratis",
                    href: "/signup",
                }

    return (
        <section className="px-5 py-12 sm:py-20">
            <Reveal className="mx-auto max-w-5xl">
                <div className="overflow-hidden rounded-[2rem] bg-zinc-950 dark:border dark:border-zinc-800 dark:bg-zinc-900 px-8 py-16 text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{contenido.titulo}</h2>
                    <p className="mx-auto mt-4 max-w-xl text-zinc-400 dark:text-zinc-500">{contenido.texto}</p>
                    <Link
                        href={contenido.href}
                        className="mt-8 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold text-zinc-950 dark:text-zinc-50 transition-transform hover:scale-[1.03]"
                        style={{ backgroundColor: ACCENT }}
                    >
                        {contenido.cta}
                    </Link>
                </div>
            </Reveal>
        </section>
    )
}
