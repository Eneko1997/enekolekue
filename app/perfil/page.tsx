import type { Metadata } from "next"
import ProfileClient from "@/components/profile/ProfileClient"

export const metadata: Metadata = {
    title: "Mi perfil",
    description: "Tu progreso, estadísticas e historial de tests en Gainditu.",
    robots: { index: false, follow: false },
}

export default function PerfilPage() {
    return <ProfileClient />
}
