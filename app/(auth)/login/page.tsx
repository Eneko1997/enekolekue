import { Suspense } from "react"
import type { Metadata } from "next"
import AuthForm from "@/components/auth/AuthForm"

export const metadata: Metadata = {
    title: "Iniciar sesión",
    description: "Accede a tu cuenta de Gainditu para practicar tests de la OPE del Gobierno Vasco 2026.",
    robots: { index: false, follow: true },
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <AuthForm mode="login" />
        </Suspense>
    )
}
