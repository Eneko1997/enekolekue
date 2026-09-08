"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export const POST_AUTH_KEY = "gainditu_post_auth_next"

/**
 * Tras iniciar sesión con Google, Supabase a veces devuelve a la Site URL (la home)
 * en vez de a la página donde estabas (si el redirectTo con query no está en la
 * allowlist). Este componente, montado globalmente, lee el destino que guardamos
 * ANTES de ir a Google y te reenvía allí en cuanto hay sesión. Funciona sin tocar
 * la configuración de Supabase.
 */
export default function PostAuthRedirect() {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        let raw: string | null = null
        try {
            raw = localStorage.getItem(POST_AUTH_KEY)
        } catch {}
        if (!raw) return

        let dest: string | null = null
        try {
            const p = JSON.parse(raw)
            // Solo válido unos minutos, para no reenviar por una sesión antigua.
            if (p && p.next && Date.now() - (p.ts || 0) < 5 * 60 * 1000) dest = p.next
        } catch {}
        try {
            localStorage.removeItem(POST_AUTH_KEY)
        } catch {}
        if (!dest) return

        const target = dest
        const targetPath = target.split("?")[0]
        if (targetPath === pathname) return // ya estás donde toca

        const supabase = createClient()
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) router.replace(target)
        })
    }, [pathname, router])

    return null
}
