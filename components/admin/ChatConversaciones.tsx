"use client"

// Visor de conversaciones del chatbot (solo admin, dentro de Captación).
// Lee la RPC chat_conversaciones (admin) y las agrupa por sesión. Las preguntas
// que el bot no supo responder ("sin respuesta") van marcadas, para saber qué
// respuestas hay que añadir al asistente.

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

type Row = { session_key: string; pregunta: string; respuesta: string; sin_match: boolean; path: string; created_at: string }
type Grupo = { key: string; arr: Row[]; ultimo: string; path: string }

function fhora(iso: string): string {
    try {
        return new Date(iso).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
    } catch {
        return ""
    }
}

function agrupar(rows: Row[]): Grupo[] {
    const map = new Map<string, Row[]>()
    for (const r of rows) {
        const k = r.session_key || "—"
        if (!map.has(k)) map.set(k, [])
        map.get(k)!.push(r)
    }
    const grupos: Grupo[] = [...map.entries()].map(([key, arr]) => {
        arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        return { key, arr, ultimo: arr[arr.length - 1].created_at, path: arr[0].path || "" }
    })
    grupos.sort((a, b) => new Date(b.ultimo).getTime() - new Date(a.ultimo).getTime())
    return grupos
}

export default function ChatConversaciones() {
    const [rows, setRows] = useState<Row[]>([])
    const [cargando, setCargando] = useState(true)

    async function cargar() {
        setCargando(true)
        try {
            const supabase = createClient()
            const { data } = await supabase.rpc("chat_conversaciones", { p_limite: 250 })
            setRows(Array.isArray(data) ? (data as Row[]) : [])
        } catch { /* noop */ }
        setCargando(false)
    }

    async function marcarRevisado(key: string) {
        // Optimista: la quitamos ya de la lista para que no se acumule.
        setRows((prev) => prev.filter((r) => r.session_key !== key))
        try {
            await createClient().rpc("chat_marcar_revisado", { p_key: key })
        } catch { /* noop; reaparecerá al Actualizar si algo falla */ }
    }

    useEffect(() => { cargar() }, [])

    const grupos = agrupar(rows)
    const sinResp = rows.filter((r) => r.sin_match).length

    return (
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Conversaciones del chat</h2>
                <span className="rounded-full px-2.5 py-0.5 text-[12px] font-bold" style={{ color: ACCENT, backgroundColor: `${ACCENT}1A` }}>
                    {grupos.length} conversaciones
                </span>
                {sinResp > 0 && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[12px] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                        {sinResp} sin respuesta
                    </span>
                )}
                <button
                    type="button"
                    onClick={cargar}
                    className="ml-auto rounded-full border border-zinc-300 px-3 py-1 text-[12.5px] font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                    Actualizar
                </button>
            </div>

            {cargando ? (
                <p className="mt-4 text-[14px] text-zinc-500">Cargando conversaciones…</p>
            ) : grupos.length === 0 ? (
                <p className="mt-4 text-[14px] text-zinc-500">Aún no hay conversaciones. Aparecerán aquí en cuanto la gente escriba al asistente.</p>
            ) : (
                <div className="mt-4 max-h-[540px] space-y-3 overflow-y-auto pr-1">
                    {grupos.map((g) => (
                        <div key={g.key} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                            <div className="mb-2 flex items-center justify-between gap-2 text-[11.5px] text-zinc-400">
                                <span className="truncate">{g.path || "web"} · {fhora(g.ultimo)}</span>
                                <button
                                    type="button"
                                    onClick={() => marcarRevisado(g.key)}
                                    className="shrink-0 rounded-full border border-zinc-300 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 transition-colors hover:border-emerald-400 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                                >
                                    Marcar revisada
                                </button>
                            </div>
                            <div className="space-y-2">
                                {g.arr.map((r, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-end">
                                            <div className="max-w-[80%] rounded-2xl rounded-br-md px-3 py-1.5 text-[13px] text-white" style={{ background: ACCENT }}>
                                                {r.pregunta}
                                            </div>
                                        </div>
                                        <div className="flex justify-start">
                                            <div
                                                className={
                                                    r.sin_match
                                                        ? "max-w-[85%] rounded-2xl rounded-bl-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-[13px] text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                                                        : "max-w-[85%] rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-3 py-1.5 text-[13px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                                                }
                                            >
                                                {r.respuesta}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
