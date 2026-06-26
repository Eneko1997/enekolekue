import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let browserClient: SupabaseClient | undefined

/**
 * Cliente de Supabase para componentes de cliente ("use client").
 * Gestiona la sesión (cookies + storage), refresca el token automáticamente
 * y expone supabase.auth y supabase.from(...). Sustituye a todo el parseo
 * manual de localStorage y la lógica de refresh que tenían los componentes Framer.
 *
 * Se cachea como singleton para evitar múltiples instancias de GoTrueClient.
 */
export function createClient() {
    if (browserClient) return browserClient
    browserClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    return browserClient
}
