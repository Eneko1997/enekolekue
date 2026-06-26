import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Rutas que requieren sesión iniciada. Si no hay usuario, se redirige a /login.
// /dashboard y /test son públicos (navegables para SEO); gestionan el estado
// sin sesión en el propio componente. Solo el perfil exige login.
const PROTECTED_PREFIXES = ["/perfil"]

/**
 * Refresca la sesión de Supabase en cada request (renueva cookies) y protege
 * las rutas privadas. Basado en el patrón oficial de @supabase/ssr para Next.js.
 */
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANTE: no ejecutar código entre createServerClient y getUser().
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl
    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

    if (!user && isProtected) {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        url.searchParams.set("redirect", pathname)
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
