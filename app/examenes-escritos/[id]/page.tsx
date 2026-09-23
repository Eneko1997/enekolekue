import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import ExamenEscritoClient from "@/components/casos-escritos/ExamenEscritoClient"
import { getCasoEscrito } from "@/lib/casos-escritos/casos"

// Beta: no indexar mientras esté bloqueado.
export const metadata: Metadata = {
    title: "Examen escrito (beta)",
    robots: { index: false, follow: false },
}

export default async function ExamenEscritoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const caso = getCasoEscrito(id)
    if (!caso) notFound()
    return (
        <Suspense fallback={null}>
            <ExamenEscritoClient caso={caso} />
        </Suspense>
    )
}
