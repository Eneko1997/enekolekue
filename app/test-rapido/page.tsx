import { Suspense } from "react"
import type { Metadata } from "next"
import TestRapidoClient from "@/components/test/TestRapidoClient"

export const metadata: Metadata = {
    title: { absolute: "Test rápido del día · Gainditu Oposiciones" },
    description:
        "6 preguntas rápidas de la materia del día, modo examen. Gratis para todos. Corrige y mide tu nota para la OPE del Gobierno Vasco 2026.",
    robots: { index: false, follow: true },
}

export default function TestRapidoPage() {
    return (
        <Suspense fallback={null}>
            <TestRapidoClient />
        </Suspense>
    )
}
