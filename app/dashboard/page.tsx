import type { Metadata } from "next"
import DashboardClient from "@/components/dashboard/DashboardClient"
import LightNavbar from "@/components/site/LightNavbar"
import SiteFooter from "@/components/site/SiteFooter"

export const metadata: Metadata = {
    title: "Mis tests — Gainditu",
    description:
        "Catálogo de tests por tema oficial del IVAP para la OPE del Gobierno Vasco 2026. Practica por escala, bloque o temario oficial y mide tu progreso.",
    alternates: { canonical: "/dashboard" },
}

// El catálogo de tests (antes en la home). La home pasa a ser una landing de marketing.
export default function DashboardPage() {
    return (
        <div className="flex min-h-dvh flex-col bg-white text-zinc-950">
            <LightNavbar />
            <div className="flex-1">
                <DashboardClient />
            </div>
            <SiteFooter />
        </div>
    )
}
