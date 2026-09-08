import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import ConvocatoriasList from "@/components/convocatorias/ConvocatoriasList"
import SuscripcionConvocatorias from "@/components/convocatorias/SuscripcionConvocatorias"
import PopupAvisosConvocatorias from "@/components/convocatorias/PopupAvisosConvocatorias"
import { getConvocatoriasOrdenadas } from "@/lib/data/convocatorias-db"
import { ORGANISMOS_NOMBRES } from "@/lib/data/organismos"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

// Se regenera cada hora para recoger las convocatorias auto-ingeridas del BOE.
export const revalidate = 3600

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

export default async function ConvocatoriasPage() {
    const convocatorias = await getConvocatoriasOrdenadas()
    const nOrganismos = new Set(convocatorias.map((c) => c.organismo)).size
    // Aviso principal: las OPE GRANDES del Gobierno Vasco con inscripción abierta
    // (Administrativo, Personal de Apoyo, Escala Administrativa…), ordenadas por nº de plazas.
    // Se exigen ≥30 plazas para no llenar la entradilla de escalas menores (Pesca, Vigilante…);
    // esas siguen visibles en el listado completo de abajo.
    const avisoPrincipal = convocatorias
        .filter(
            (c) =>
                c.organismo === "gobierno-vasco" &&
                c.estado === "inscripcion-abierta" &&
                (c.plazas ?? 0) >= 30 &&
                // Fuera de la entradilla las escalas penitenciarias (ejecución penal), poco representativas.
                !/ejecuci[oó]n penal|penitenciari/i.test(c.nombre)
        )
        .sort((a, b) => (b.plazas ?? 0) - (a.plazas ?? 0))

    return (
        <main className="flex flex-1 flex-col">
            <PopupAvisosConvocatorias />
            <LeccionHero
                eyebrow="Oposiciones de Euskadi"
                title="Convocatorias"
                subtitle="Todas las oposiciones del País Vasco: estado, plazas, fechas y enlaces oficiales."
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
                    {/* Aviso principal: las OPE del Gobierno Vasco con inscripción abierta */}
                    {avisoPrincipal.length > 0 && (
                        <div className="mb-8">
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide" style={{ color: "#047857" }}>
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: ACCENT }} />
                                        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: ACCENT }} />
                                    </span>
                                    Inscripción abierta
                                </div>
                                <Link href="/actualidad" className="text-[12px] font-semibold transition-transform hover:translate-x-0.5" style={{ color: ACCENT }}>
                                    Ver todas las novedades →
                                </Link>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {avisoPrincipal.map((c) => {
                                    // Inscripción SIEMPRE con inicio – cierre cuando hay ambas (mismo criterio que la lista).
                                    const fc = c.fechasClave || []
                                    const ini = fc.find((f) => /inicio/i.test(f.etiqueta) && f.fecha)
                                    const fin = fc.find((f) => /fin/i.test(f.etiqueta) && f.fecha)
                                    const insc = fc.find((f) => /^inscrip/i.test(f.etiqueta) && f.fecha)
                                    const inscripcion = ini && fin
                                        ? `${ini.fecha} – ${fin.fecha}`
                                        : insc?.fecha
                                          ? insc.fecha
                                          : fin?.fecha
                                            ? `hasta el ${fin.fecha}`
                                            : ini?.fecha
                                              ? `desde el ${ini.fecha}`
                                              : fc[0]?.fecha
                                    return (
                                        <Link
                                            key={c.slug}
                                            href={`/convocatorias/${c.slug}`}
                                            className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900"
                                        >
                                            <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-60 blur-3xl" style={{ background: "rgba(16,185,129,0.18)" }} />
                                            <div className="relative flex items-center gap-4">
                                                {c.plazas != null && (
                                                    <div className="shrink-0 text-center">
                                                        <div className="text-3xl font-extrabold leading-none sm:text-4xl" style={{ color: ACCENT }}>
                                                            {c.plazas}
                                                        </div>
                                                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">plazas</div>
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-[15px] font-bold leading-snug text-zinc-950 dark:text-zinc-50">
                                                        {c.nombre}
                                                    </div>
                                                    {inscripcion && (
                                                        <div className="mt-0.5 text-[12.5px] text-zinc-500 dark:text-zinc-400">
                                                            Inscripción: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{inscripcion}</span>
                                                        </div>
                                                    )}
                                                    <span className="mt-1.5 inline-block text-[13px] font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>
                                                        Ver convocatoria e inscripción →
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}

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

                    <SuscripcionConvocatorias />

                    <p className="mt-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 px-4 py-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                        Los datos son orientativos y se contrastan con fuentes oficiales
                        (BOPV, euskadi.eus, Osakidetza, IVAP y Academia de Arkaute). Cuando un
                        dato no está confirmado oficialmente, verás{" "}
                        <span className="font-semibold">&laquo;Pendiente&raquo;</span>.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/guias/como-inscribirse-ope-gobierno-vasco-2026" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                            → Cómo inscribirte en la OPE del Gobierno Vasco
                        </Link>
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
