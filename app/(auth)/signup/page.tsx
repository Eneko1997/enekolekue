import { Suspense } from "react"
import type { Metadata } from "next"
import AuthForm from "@/components/auth/AuthForm"

export const metadata: Metadata = {
    title: "Crear cuenta gratis",
    description: "Regístrate gratis en Gainditu y empieza a practicar tests por tema oficial del IVAP para la OPE del Gobierno Vasco 2026.",
    robots: { index: false, follow: true },
}

export default function SignupPage() {
    return (
        <Suspense fallback={null}>
            <AuthForm mode="register" />
        </Suspense>
    )
}
