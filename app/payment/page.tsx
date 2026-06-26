import type { Metadata } from "next"
import PaymentClient from "@/components/payment/PaymentClient"

export const metadata: Metadata = {
    title: "Acceso Premium",
    description:
        "Acceso completo de por vida a Gainditu: exámenes oficiales, simulacros con penalización IVAP y estadísticas avanzadas para la OPE del Gobierno Vasco 2026.",
    robots: { index: false, follow: true },
}

export default function PaymentPage() {
    return <PaymentClient />
}
