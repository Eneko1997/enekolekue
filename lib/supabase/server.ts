import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Cliente de Supabase para Server Components, Route Handlers y Server Actions.
 * Lee/escribe la sesión en cookies. En Server Components el set de cookies puede
 * fallar (no se pueden escribir): se ignora con seguridad porque el middleware
 * ya refresca la sesión en cada request.
 */
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ougvtcmqmcutrexxrxvz.supabase.co"),
        (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_lfcfMDSYpIDWzy2CWufT_A_NfJbTimc"),
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Llamado desde un Server Component: ignorar.
                        // El middleware se encarga de refrescar las cookies.
                    }
                },
            },
        }
    )
}
