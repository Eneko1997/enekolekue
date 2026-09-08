"use client"

// Presencia + registro de visitas SIN Realtime (heartbeat + RPC).
// EXCLUSIONES ("no rastrear este navegador"): no cuenta visitas ni presencia si
//   (a) el navegador tiene el flag localStorage `gainditu_notrack` (se activa visitando
//       cualquier página con ?notrack=1 — así el dueño excluye su PC y Claude su navegador), o
//   (b) el usuario logueado es admin (enekolekue16 / info@) → además se auto-marca el flag.
// Se monta en el layout raíz. Fail-safe: si algo falla, no rompe nada.

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { esAdminEmail } from "@/lib/admin"

function obtenerKey(): string {
    try {
        let k = sessionStorage.getItem("gainditu_presencia_key")
        if (!k) { k = crypto.randomUUID(); sessionStorage.setItem("gainditu_presencia_key", k) }
        return k
    } catch {
        return Math.random().toString(36).slice(2)
    }
}

export default function PresenceTracker() {
    const pathname = usePathname()
    const supaRef = useRef<ReturnType<typeof createClient> | null>(null)
    const keyRef = useRef<string>("")
    const nameRef = useRef<string>("Invitado")
    const pathRef = useRef<string>("/")
    const noTrackRef = useRef<boolean>(false)

    const latir = () => {
        if (noTrackRef.current) return
        const s = supaRef.current
        if (!s || !keyRef.current) return
        s.rpc("presencia_heartbeat", { p_key: keyRef.current, p_name: nameRef.current, p_path: pathRef.current }).then(() => {}, () => {})
    }
    const visita = () => {
        if (noTrackRef.current || !keyRef.current) return
        // Va por la API route para añadir la ubicación (geo de Vercel) al registrar la visita.
        try {
            fetch("/api/visita", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: pathRef.current, key: keyRef.current }),
                keepalive: true,
            }).catch(() => {})
        } catch { /* noop */ }
    }

    useEffect(() => {
        // ?notrack=1 marca este navegador para no volver a contarlo nunca
        try {
            const u = new URL(window.location.href)
            if (u.searchParams.get("notrack") === "1" || window.location.hash === "#notrack") {
                localStorage.setItem("gainditu_notrack", "1")
            }
            noTrackRef.current = localStorage.getItem("gainditu_notrack") === "1"
        } catch { /* noop */ }

        keyRef.current = obtenerKey()
        pathRef.current = window.location.pathname
        const supabase = createClient()
        supaRef.current = supabase
        let parado = false
        let timer: ReturnType<typeof setInterval> | undefined
        ;(async () => {
            try {
                const { data } = await supabase.auth.getUser()
                nameRef.current = data.user?.email || "Invitado"
                if (esAdminEmail(data.user?.email)) {
                    noTrackRef.current = true
                    try { localStorage.setItem("gainditu_notrack", "1") } catch { /* noop */ }
                }
            } catch { /* invitado */ }
            if (parado) return
            latir()
            timer = setInterval(latir, 20000)
        })()
        return () => { parado = true; if (timer) clearInterval(timer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Al navegar (y al entrar): actualiza presencia + registra la visita de esa pantalla
    useEffect(() => {
        pathRef.current = pathname || "/"
        latir()
        visita()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    return null
}
