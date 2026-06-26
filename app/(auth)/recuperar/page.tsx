import { Suspense } from "react"
import type { Metadata } from "next"
import AuthForm from "@/components/auth/AuthForm"

export const metadata: Metadata = {
    title: "Recuperar contraseña",
    description: "Restablece la contraseña de tu cuenta de Gainditu.",
    robots: { index: false, follow: true },
}

export default function RecuperarPage() {
    return (
        <Suspense fallback={null}>
            <AuthForm mode="forgot" />
        </Suspense>
    )
}
