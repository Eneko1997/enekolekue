import type { Metadata } from "next"
import Link from "next/link"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import EquivalenciasPL from "@/components/herramientas/EquivalenciasPL"
import { getHerramienta } from "@/lib/data/herramientas"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const H = getHerramienta("equivalencias-perfil-linguistico")!

export const metadata: Metadata = {
    title: H.titulo,
    description: H.descripcion,
    alternates: { canonical: `/herramientas/${H.slug}` },
}

export default function Page() {
    return (
        <main className="flex flex-1 flex-col">
            <section className="px-5 pb-6 pt-10">
                <div className="mx-auto max-w-3xl">
                    <Link href="/herramientas" className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">
                        ← Herramientas
                    </Link>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                        {H.titulo}
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-300">{H.subtitulo}</p>
                </div>
            </section>
            <section className="px-5 pb-10">
                <div className="mx-auto max-w-3xl">
                    <EquivalenciasPL />
                </div>
            </section>
            <LeccionCTA
                accent={ACCENT}
                href="/temario/ley-normalizacion-euskera"
                titulo="El euskera en tu oposición"
                texto="Repasa la Ley de Normalización del Euskera y el sistema de perfiles lingüísticos que piden las oposiciones vascas."
                cta="Ver el temario de euskera →"
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        name: H.titulo,
                        description: H.descripcion,
                        applicationCategory: "EducationApplication",
                        operatingSystem: "Web",
                        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
                        url: `${SITE_URL}/herramientas/${H.slug}`,
                    }),
                }}
            />
        </main>
    )
}
