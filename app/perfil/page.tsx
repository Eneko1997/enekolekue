import type { Metadata } from "next"
import ProfileClient from "@/components/profile/ProfileClient"

export const metadata: Metadata = {
    title: "Mi perfil",
    description: "Tu progreso, estadísticas e historial de tests en Gainditu.",
    robots: { index: false, follow: false },
}

// Página privada por usuario: se renderiza en cliente (usa ?tab= reactivo).
export const dynamic = "force-dynamic"

export default function PerfilPage() {
    return <ProfileClient />
}
