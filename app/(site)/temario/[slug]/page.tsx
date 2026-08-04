import type { Metadata } from "next"
import { notFound } from "next/navigation"
import TemarioShell from "@/components/temario/TemarioShell"
import { NORMATIVAS, getNormativa } from "@/lib/data/temario/normativas"

export function generateStaticParams() {
    return NORMATIVAS.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const n = getNormativa(slug)
    if (!n) return { title: "Temario no encontrado" }
    return {
        title: `${n.titulo} — Temario de oposiciones`.slice(0, 60),
        description: n.intro.slice(0, 155),
        alternates: { canonical: `/temario/${n.slug}` },
    }
}

export default async function TemarioNormativaPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const n = getNormativa(slug)
    if (!n) notFound()
    return <TemarioShell n={n} />
}
