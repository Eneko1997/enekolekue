import type { Metadata } from "next"
import DashboardClient from "@/components/dashboard/DashboardClient"

export const metadata: Metadata = {
    title: "Tests por tema — OPE Gobierno Vasco 2026",
    description:
        "Catálogo de tests por tema oficial del IVAP para Auxiliares, Administrativos, Técnicos de Gestión y Superiores. Practica y mide tu progreso para la OPE del Gobierno Vasco 2026.",
    alternates: { canonical: "/dashboard" },
}

export default function DashboardPage() {
    return <DashboardClient />
}
