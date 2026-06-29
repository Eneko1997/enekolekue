import type { Metadata } from "next"
import DashboardClient from "@/components/dashboard/DashboardClient"

export const metadata: Metadata = {
    title: "Mis tests — Gainditu",
    description:
        "Catálogo de tests por tema oficial del IVAP para la OPE del Gobierno Vasco 2026. Practica por escala, bloque o temario oficial y mide tu progreso.",
    alternates: { canonical: "/dashboard" },
}

// El catálogo de tests (antes en la home). La home pasa a ser una landing de marketing.
export default function DashboardPage() {
    return <DashboardClient />
}
