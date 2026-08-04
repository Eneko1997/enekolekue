import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import { NORMATIVAS, TEMARIO_EXISTENTE } from "@/lib/data/temario/normativas"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

export const metadata: Metadata = {
    title: "Temario de oposiciones de Euskadi",
    description:
        "Todo el temario de las oposiciones de Euskadi explicado: Constitución, Ley 39/2015, Estatuto de Gernika, función pública vasca, euskera, igualdad y más.",
    keywords: [
        "temario oposiciones Euskadi",
        "normativa vasca oposiciones",
        "temario oposiciones País Vasco",
        "estatuto de Gernika oposiciones",
    ],
    alternates: { canonical: "/temario" },
}

function Card({ titulo, ley, href }: { titulo: string; ley: string; href: string }) {
    return (
        <Link
            href={href}
            className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/5"
        >
            <h3 className="text-[15px] font-bold leading-snug text-zinc-950 dark:text-zinc-50">
                {titulo}
            </h3>
            <p className="mt-1.5 flex-1 text-[13px] text-zinc-500 dark:text-zinc-400">{ley}</p>
            <span
                className="mt-4 text-[13px] font-semibold transition-transform group-hover:translate-x-0.5"
                style={{ color: ACCENT }}
            >
                Ver temario →
            </span>
        </Link>
    )
}

export default function TemarioIndexPage() {
    const vascas = NORMATIVAS.filter((n) => n.eyebrow.includes("vasca"))
    const estatales = NORMATIVAS.filter((n) => !n.eyebrow.includes("vasca"))

    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Oposiciones de Euskadi"
                title="Temario"
                subtitle="El temario de las oposiciones vascas explicado, norma a norma: qué es, en qué oposiciones entra y lo que más se pregunta. Con test en cada bloque."
                accent={ACCENT}
                ctaHref="#normativa"
                ctaLabel="Ver el temario →"
                stats={[
                    { n: String(NORMATIVAS.length + TEMARIO_EXISTENTE.length), label: "bloques" },
                    { n: "Vasca", label: "y estatal" },
                    { n: "BOE/BOPV", label: "fuentes" },
                    { n: "Tests", label: "en cada bloque" },
                ]}
            />

            <section id="normativa" className="scroll-mt-20 px-5 py-10">
                <div className="mx-auto max-w-4xl space-y-10">
                    <div>
                        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                            Bloques principales
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {TEMARIO_EXISTENTE.map((t) => (
                                <Card key={t.href} titulo={t.titulo} ley={t.ley} href={t.href} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                            Normativa vasca
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {vascas.map((n) => (
                                <Card key={n.slug} titulo={n.titulo} ley={n.ley} href={`/temario/${n.slug}`} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                            Normativa estatal
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {estatales.map((n) => (
                                <Card key={n.slug} titulo={n.titulo} ley={n.ley} href={`/temario/${n.slug}`} />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                            → Todos los tests por escala
                        </Link>
                        <Link href="/convocatorias" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                            → Convocatorias de Euskadi
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
                        name: "Temario de oposiciones de Euskadi",
                        itemListElement: [
                            ...TEMARIO_EXISTENTE.map((t, i) => ({
                                "@type": "ListItem",
                                position: i + 1,
                                name: t.titulo,
                                url: `${SITE_URL}${t.href}`,
                            })),
                            ...NORMATIVAS.map((n, i) => ({
                                "@type": "ListItem",
                                position: TEMARIO_EXISTENTE.length + i + 1,
                                name: n.titulo,
                                url: `${SITE_URL}/temario/${n.slug}`,
                            })),
                        ],
                    }),
                }}
            />
        </main>
    )
}
