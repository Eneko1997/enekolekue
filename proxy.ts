import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// Next.js 16: el antiguo `middleware` se llama ahora `proxy` (runtime nodejs).
// Refresca la sesión de Supabase en cada request y protege rutas privadas.
export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        // Todas las rutas excepto estáticos e imágenes.
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
}
