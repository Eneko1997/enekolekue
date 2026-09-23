import Link from "next/link"

// Bloque de SEO programático: 5 preguntas REALES del banco (con respuesta y explicación,
// indexables por Google) + muro de registro para el resto. Server Component: lee `preguntas`
// (lectura pública) por REST, en orden estable (order=orden) para que el contenido no cambie
// en cada revalidación. Se monta en las páginas de norma vía TemaTestsShell.

const ACCENT = "#10B981"
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ougvtcmqmcutrexxrxvz.supabase.co"
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_lfcfMDSYpIDWzy2CWufT_A_NfJbTimc"
const LETRAS = ["A", "B", "C", "D"]

type Row = { enunciado: string; opciones: string[] | string; correcta: number; explicacion: string | null }
type P = { enunciado: string; opciones: string[]; correcta: number; explicacion: string | null }

async function fetchMuestra(testId: string, n: number): Promise<P[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/preguntas?test_id=eq.${encodeURIComponent(testId)}&select=enunciado,opciones,correcta,explicacion&order=orden.asc&limit=${n}`
        const r = await fetch(url, {
            headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
            next: { revalidate: 86400 },
        })
        if (!r.ok) return []
        const data = (await r.json()) as Row[]
        if (!Array.isArray(data)) return []
        return data.map((d) => ({
            enunciado: d.enunciado,
            opciones: Array.isArray(d.opciones) ? d.opciones : JSON.parse(d.opciones as string),
            correcta: d.correcta,
            explicacion: d.explicacion,
        }))
    } catch {
        return []
    }
}

export default async function PreguntasMuestra({
    testId,
    total,
    tituloNorma,
    href,
}: {
    testId: string
    total: number
    tituloNorma: string
    href?: string
}) {
    const preguntas = await fetchMuestra(testId, 5)
    if (preguntas.length === 0) return null
    const link = href || `/test?id=${testId}`
    const restantes = Math.max(0, total - preguntas.length)

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        name: `Test de ${tituloNorma} — preguntas de ejemplo`,
        about: tituloNorma,
        educationalLevel: "Oposiciones",
        hasPart: preguntas.map((p) => ({
            "@type": "Question",
            name: p.enunciado,
            acceptedAnswer: { "@type": "Answer", text: p.opciones[p.correcta] },
            suggestedAnswer: p.opciones
                .map((o, i) => (i !== p.correcta ? { "@type": "Answer", text: o } : null))
                .filter(Boolean),
        })),
    }

    return (
        <section id="muestra" className="scroll-mt-20 px-5 py-8">
            <div className="mx-auto max-w-4xl">
                <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                    Prueba unas preguntas gratis
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Cinco preguntas reales del banco de {tituloNorma}, con la respuesta correcta y su explicación. Al estilo del examen oficial.
                </p>

                <div className="mt-6 space-y-4">
                    {preguntas.map((p, idx) => (
                        <div key={idx} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>
                                Pregunta {idx + 1}
                            </div>
                            <p className="mt-1.5 text-[15px] font-semibold leading-relaxed text-zinc-950 dark:text-zinc-50">
                                {p.enunciado}
                            </p>
                            <ul className="mt-3 space-y-1.5">
                                {p.opciones.map((o, i) => {
                                    const ok = i === p.correcta
                                    return (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 rounded-lg px-3 py-2 text-[14px] leading-relaxed"
                                            style={{
                                                background: ok ? `${ACCENT}14` : "transparent",
                                                color: ok ? undefined : "inherit",
                                            }}
                                        >
                                            <span className="font-bold text-zinc-400">{LETRAS[i]})</span>
                                            <span className={ok ? "font-semibold text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-300"}>
                                                {o}
                                            </span>
                                            {ok && (
                                                <span className="ml-auto shrink-0 text-[12px] font-bold" style={{ color: ACCENT }}>
                                                    ✓ Correcta
                                                </span>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                            {p.explicacion && (
                                <p className="mt-3 border-t border-zinc-100 pt-3 text-[13px] leading-relaxed text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">Por qué: </span>
                                    {p.explicacion}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Muro de registro: el resto de preguntas tras registrarse */}
                <div className="mt-6 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white p-6 text-center dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900">
                    <div className="text-[17px] font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                        {restantes > 0 ? `Te quedan más de ${restantes} preguntas de ${tituloNorma}` : `Sigue practicando ${tituloNorma}`}
                    </div>
                    <p className="mx-auto mt-1.5 max-w-md text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                        Hazlas todas, corrige con la penalización real del examen y guarda tu progreso. Es gratis al registrarte.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                        <Link
                            href={link}
                            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
                            style={{ background: ACCENT }}
                        >
                            Hacer el test completo →
                        </Link>
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-[14px] font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100"
                        >
                            Crear cuenta gratis
                        </Link>
                    </div>
                </div>

                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </div>
        </section>
    )
}
