"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

/**
 * Al pulsar "Crear nueva contraseña" en el email de recuperación, Supabase
 * devuelve a la Site URL (la home) con la sesión de recuperación en el hash
 * (#access_token=…&type=recovery). Sin esto, el usuario se queda en la home y
 * no encuentra dónde cambiar la contraseña.
 *
 * Montado globalmente: detecta la recuperación (por el evento PASSWORD_RECOVERY
 * de supabase-js o por el hash de la URL) y reenvía a /reset-password una vez
 * establecida la sesión. Funciona sin tocar la config de Supabase.
 */
export default function PasswordRecoveryGate() {
    const router = useRouter()

    useEffect(() => {
        if (typeof window === "undefined") return

        const irAReset = () => {
            if (window.location.pathname !== "/reset-password") {
                router.replace("/reset-password")
            }
        }

        const supabase = createClient()

        // 1) Señal fiable: el evento que dispara supabase-js al detectar el token.
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") irAReset()
        })

        // 2) Respaldo: si el evento se disparó antes de montar, detectamos el
        //    token en el hash y esperamos a que la sesión esté lista.
        const hash = window.location.hash || ""
        if (hash.includes("type=recovery")) {
            let tries = 0
            const iv = setInterval(async () => {
                tries++
                const { data } = await supabase.auth.getSession()
                if (data.session) {
                    clearInterval(iv)
                    irAReset()
                } else if (tries > 20) {
                    clearInterval(iv)
                }
            }, 150)
            return () => {
                clearInterval(iv)
                sub.subscription.unsubscribe()
            }
        }

        return () => sub.subscription.unsubscribe()
    }, [router])

    return null
}
