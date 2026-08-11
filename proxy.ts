import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// El dominio oficial. Los alias .vercel.app redirigen aquí para que no sirvan
// contenido ni se indexen (no se tocan las preview con hash).
const CANONICAL_HOST = "gaindituoposiciones.com"
const ALIAS_HOSTS = new Set([
    "gainditu-oposiciones.vercel.app",
    "gainditu-web.vercel.app",
])

// Next.js 16: el antiguo `middleware` se llama ahora `proxy` (runtime nodejs).
// Redirige los alias de Vercel al dominio oficial y, si no, refresca la sesión
// de Supabase en cada request y protege rutas privadas.
export async function proxy(request: NextRequest) {
    const host = (request.headers.get("host") ?? "").toLowerCase()
    if (ALIAS_HOSTS.has(host)) {
        const url = request.nextUrl.clone()
        url.protocol = "https"
        url.host = CANONICAL_HOST
        return NextResponse.redirect(url, 308)
    }
    return await updateSession(request)
}

export const config = {
    matcher: [
        // Todas las rutas excepto estáticos e imágenes.
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
}
