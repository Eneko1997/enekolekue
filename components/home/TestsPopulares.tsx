"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { TITULOS_CATALOGO } from "@/components/dashboard/catalogo"
import SectionHeading from "@/components/home/SectionHeading"

const ACCENT = "#10B981"

type Fila = { test_id: string; reales: number; score: number }
type Item = { id: string; titulo: string; reales: number }

// Quita el prefijo "T.N — " / "ET.N — " y recorta para la tarjeta.
function limpiaTitulo(t: string): string {
    return t.replace(/^E?\.?T\.?\d+\s*[—-]\s*/i, "").trim()
}

export default function TestsPopulares() {
    const [items, setItems] = useState<Item[] | null>(null)

    useEffect(() => {
        let cancel = false
        ;(async () => {
            try {
                const supabase = createClient()
                const { data, error } = await supabase.rpc("tests_populares", {
                    p_limite: 6,
                })
                if (error || !Array.isArray(data)) {
                    if (!cancel) setItems([])
                    return
                }
                const mapped: Item[] = (data as Fila[])
                    .map((f) => {
                        const titulo = TITULOS_CATALOGO[f.test_id]
                        if (!titulo) return null
                        return { id: f.test_id, titulo: limpiaTitulo(titulo), reales: f.reales }
                    })
                    .filter((x): x is Item => x !== null)
                    .slice(0, 6)
                if (!cancel) setItems(mapped)
            } catch {
                if (!cancel) setItems([])
            }
        })()
        return () => {
            cancel = true
        }
    }, [])

    // Mientras carga o si no hay datos, no ocupamos espacio.
    if (items !== null && items.length === 0) return null

    const skeleton = items === null

    return (
        <section className="px-5 py-12 sm:py-16">
            <div className="mx-auto max-w-5xl">
                <SectionHeading
                    className="mb-8"
                    kicker="Lo más practicado"
                    title="Los tests que más se están haciendo"
                    subtitle="Los temas comunes que caen en casi todas las oposiciones de Euskadi. Empieza por aquí."
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(skeleton ? Array.from({ length: 6 }) : items!).map((it, i) => {
                        const item = it as Item | undefined
                        return (
                            <Link
                                key={item ? item.id : i}
                                href={item ? `/test?id=${item.id}` : "#"}
                                aria-hidden={skeleton}
                                tabIndex={skeleton ? -1 : 0}
                                className={`group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 ${
                                    skeleton ? "pointer-events-none animate-pulse" : ""
                                }`}
                            >
                                <span
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px] font-black text-white"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    {i + 1}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
                                        {skeleton ? " " : item!.titulo}
                                    </span>
                                    <span className="mt-0.5 block text-[12px] text-zinc-400">
                                        {skeleton ? " " : "30 preguntas · empezar"}
                                    </span>
                                </span>
                                <span
                                    aria-hidden
                                    className="shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-500"
                                >
                                    →
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
