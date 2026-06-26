import { Suspense } from "react"
import type { Metadata } from "next"
import TestClient from "@/components/test/TestClient"

export const metadata: Metadata = {
    title: "Test",
    description:
        "Responde el test por tema oficial del IVAP y mide tu progreso para la OPE del Gobierno Vasco 2026.",
    robots: { index: false, follow: true },
}

export default function TestPage() {
    return (
        <Suspense fallback={null}>
            <TestClient />
        </Suspense>
    )
}
