import { Suspense } from "react"
import type { Metadata } from "next"
import SegmentosClient from "@/components/segmentos/SegmentosClient"

export const metadata: Metadata = {
    title: "Segmentos — Sprints y ranking",
    description:
        "Sprints de 10 preguntas contrarreloj y ranking semanal por aciertos y velocidad. Pícate con otros opositores.",
    robots: { index: false, follow: true },
}

export default function SegmentosPage() {
    return (
        <Suspense fallback={null}>
            <SegmentosClient />
        </Suspense>
    )
}
