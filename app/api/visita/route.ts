import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Registra una visita añadiendo la UBICACIÓN (país/ciudad/región) desde las cabeceras de Vercel.
// El navegador (PresenceTracker) hace POST aquí; la geo la pone Vercel, no el cliente (no se puede falsear).

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ougvtcmqmcutrexxrxvz.supabase.co"
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_lfcfMDSYpIDWzy2CWufT_A_NfJbTimc"

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}))
        const h = request.headers
        const pais = h.get("x-vercel-ip-country") || ""
        let ciudad = h.get("x-vercel-ip-city") || ""
        const region = h.get("x-vercel-ip-country-region") || ""
        try { ciudad = decodeURIComponent(ciudad) } catch { /* dejar tal cual */ }

        const supabase = createClient(URL, KEY, { auth: { persistSession: false } })
        await supabase.rpc("registrar_visita", {
            p_path: String(body?.path || "/"),
            p_key: String(body?.key || ""),
            p_pais: pais,
            p_ciudad: ciudad,
            p_region: region,
        })
        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ ok: false })
    }
}
