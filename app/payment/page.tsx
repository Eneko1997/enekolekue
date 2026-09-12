import type { Metadata } from "next"
import PaymentClient from "@/components/payment/PaymentClient"

export const metadata: Metadata = {
    title: "Método Gainditu · Acceso completo",
    description:
        "Acceso completo a Gainditu con un único pago: exámenes oficiales, simulacros con penalización real y estadísticas avanzadas para la OPE del Gobierno Vasco 2026, hasta el día de tu examen.",
    robots: { index: false, follow: true },
}

export default function PaymentPage() {
    return <PaymentClient />
}
