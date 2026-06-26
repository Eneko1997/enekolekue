import type { Metadata } from "next"
import PaymentSuccessClient from "@/components/payment/PaymentSuccessClient"

export const metadata: Metadata = {
    title: "Pago completado",
    robots: { index: false, follow: false },
}

export default function PaymentSuccessPage() {
    return <PaymentSuccessClient />
}
