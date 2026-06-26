import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Callback de autenticación (Google OAuth y confirmación de email).
 * Supabase redirige aquí con un `code` que intercambiamos por la sesión (cookies).
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/dashboard"

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Si algo falla, volver al login con aviso.
    return NextResponse.redirect(`${origin}/login?error=auth`)
}
