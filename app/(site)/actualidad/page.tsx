import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import { novedades, formatFecha } from "@/lib/data/actualidad"
import { getConvocatorias } from "@/lib/data/convocatorias-db"
import { SITE_URL } from "@/lib/site"

export const revalidate = 3600

const ACCENT = "#10B981"

export const metadata: Metadata = {
    title: "Actualidad OPE — novedades de oposiciones de Euskadi",
    description:
        "Últimas novedades de las oposiciones de Euskadi: nuevas convocatorias, plazos de inscripción, plazas y fechas de examen del Gobierno Vasco, Osakidetza, Ertzaintza, Diputaciones y administración local.",
    keywords: [
        "novedades oposiciones Euskadi",
        "actualidad OPE País Vasco",
        "nuevas convocatorias Euskadi 2026",
        "plazos inscripción oposiciones Euskadi",
    ],
    alternates: { canonical: "/actualidad" },
}

export default async function ActualidadPage() {
    const items = novedades(await getConvocatorias())

    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Novedades"
                title="Actualidad OPE"
                subtitle="Nuevas convocatorias, plazos, plazas y fechas de examen en Euskadi. Al día."
                accent={ACCENT}
                hideCta
            />

            <section className="px-5 py-10">
                <div className="mx-auto max-w-3xl">
                    <ol className="relative space-y-4 border-l border-zinc-200 pl-5 dark:border-zinc-800">
                        {items.map((n) => (
                            <li key={n.id} className="relative">
                                <span
                                    aria-hidden
                                    className="absolute -left-[23px] top-3 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-zinc-950"
                                    style={{ background: n.etiquetaColor }}
                                />
                                <Link
                                    href={n.href}
                                    className="group block rounded-2xl border border-zinc-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                                >
                                    <div className="flex items-center gap-2 text-[11px]">
                                        <span
                                            className="rounded-full px-2 py-0.5 font-bold uppercase tracking-wide"
                                            style={{ background: `${n.etiquetaColor}1f`, color: n.etiquetaColor }}
                                        >
                                            {n.etiqueta}
                                        </span>
                                        <time className="text-zinc-400 dark:text-zinc-500">{formatFecha(n.fecha)}</time>
                                    </div>
                                    <h2 className="mt-2 text-[15px] font-bold leading-snug text-zinc-950 dark:text-zinc-50">
                                        {n.titulo}
                                    </h2>
                                    <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                        {n.resumen}
                                    </p>
                                    <span
                                        className="mt-2 inline-block text-[13px] font-semibold transition-transform group-hover:translate-x-0.5"
                                        style={{ color: ACCENT }}
                                    >
                                        Ver la convocatoria →
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        name: "Actualidad OPE — novedades de oposiciones de Euskadi",
                        url: `${SITE_URL}/actualidad`,
                        hasPart: items.slice(0, 20).map((n) => ({
                            "@type": "NewsArticle",
                            headline: n.titulo,
                            datePublished: n.fecha,
                            url: `${SITE_URL}${n.href}`,
                        })),
                    }),
                }}
            />
        </main>
    )
}
