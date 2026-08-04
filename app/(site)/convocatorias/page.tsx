import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import ConvocatoriasList from "@/components/convocatorias/ConvocatoriasList"
import { CONVOCATORIAS, convocatoriasOrdenadas } from "@/lib/data/convocatorias"
import { ORGANISMOS_NOMBRES } from "@/lib/data/organismos"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

export const metadata: Metadata = {
    title: "Convocatorias de oposiciones de Euskadi",
    description:
        "Todas las convocatorias de oposiciones de Euskadi: Gobierno Vasco, Osakidetza, Ertzaintza y Educación. Estado, plazas, fechas y enlaces oficiales al BOPV.",
    keywords: [
        "convocatorias oposiciones Euskadi",
        "convocatorias oposiciones País Vasco",
        "OPE Euskadi 2026",
        "convocatoria BOPV oposiciones",
    ],
    alternates: { canonical: "/convocatorias" },
}

const nOrganismos = new Set(CONVOCATORIAS.map((c) => c.organismo)).size

export default function ConvocatoriasPage() {
    const convocatorias = convocatoriasOrdenadas()

    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Oposiciones de Euskadi"
                title="Convocatorias"
                subtitle="Todas las oposiciones del País Vasco en un sitio: estado del proceso, plazas, fechas clave y enlaces oficiales al BOPV. Guárdalo en marcadores."
                accent={ACCENT}
                ctaHref="#lista"
                ctaLabel="Ver convocatorias →"
                stats={[
                    { n: String(convocatorias.length), label: "convocatorias" },
                    { n: String(nOrganismos), label: "organismos" },
                    { n: "BOPV", label: "fuente oficial" },
                    { n: "Euskadi", label: "ámbito" },
                ]}
            />

            <section id="lista" className="scroll-mt-20 px-5 py-10">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                                Todas las convocatorias
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Cubrimos {ORGANISMOS_NOMBRES.join(", ")}. Verifica siempre los
                                datos en el enlace oficial de cada ficha.
                            </p>
                        </div>
                    </div>

                    <ConvocatoriasList convocatorias={convocatorias} />

                    <p className="mt-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 px-4 py-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                        Los datos son orientativos y se contrastan con fuentes oficiales
                        (BOPV, euskadi.eus, Osakidetza, IVAP y Academia de Arkaute). Cuando un
                        dato no está confirmado oficialmente, verás{" "}
                        <span className="font-semibold">&laquo;Pendiente&raquo;</span>.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                            → Todos los tests por escala
                        </Link>
                        <Link href="/constitucion" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                            → La Constitución Española
                        </Link>
                        <Link href="/ley-39-2015" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                            → Ley 39/2015
                        </Link>
                    </div>
                </div>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        name: "Convocatorias de oposiciones de Euskadi",
                        itemListElement: convocatorias.map((c, i) => ({
                            "@type": "ListItem",
                            position: i + 1,
                            name: c.nombre,
                            url: `${SITE_URL}/convocatorias/${c.slug}`,
                        })),
                    }),
                }}
            />
        </main>
    )
}
