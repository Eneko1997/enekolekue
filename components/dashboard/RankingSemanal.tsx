"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

type Entry = { alias: string; puntos: number; tests: number; acierto: number; tu?: boolean }

const MEDAL = ["#F59E0B", "#94A3B8", "#B45309"] // oro, plata, bronce

export default function RankingSemanal() {
    const [entries, setEntries] = useState<Entry[] | null>(null)
    const [puesto, setPuesto] = useState<number>(0)

    useEffect(() => {
        let cancel = false
        ;(async () => {
            try {
                const supabase = createClient()
                const { data: seeds } = await supabase
                    .from("ranking_seed")
                    .select("alias, puntos, tests, acierto")
                    .eq("activo", true)
                const seedEntries: Entry[] = (seeds ?? []).map((s) => ({
                    alias: s.alias as string,
                    puntos: s.puntos as number,
                    tests: s.tests as number,
                    acierto: s.acierto as number,
                }))

                let tu: Entry = { alias: "Tú", puntos: 0, tests: 0, acierto: 0, tu: true }
                const {
                    data: { user },
                } = await supabase.auth.getUser()
                if (user) {
                    const desde = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
                    const { data: res } = await supabase
                        .from("test_results")
                        .select("correctas, porcentaje")
                        .eq("user_id", user.id)
                        .gte("completado_at", desde)
                    if (res && res.length) {
                        const puntos = res.reduce((a, r) => a + (Number(r.correctas) || 0), 0)
                        const acierto = Math.round(
                            res.reduce((a, r) => a + (Number(r.porcentaje) || 0), 0) / res.length
                        )
                        tu = { alias: "Tú", puntos, tests: res.length, acierto, tu: true }
                    }
                }

                const all = [...seedEntries, tu].sort((a, b) => b.puntos - a.puntos)
                if (cancel) return
                setPuesto(all.findIndex((e) => e.tu) + 1)
                setEntries(all)
            } catch {
                if (!cancel) setEntries([])
            }
        })()
        return () => {
            cancel = true
        }
    }, [])

    if (!entries || entries.length === 0) return null

    const top = entries.slice(0, 5)
    const tuEntry = entries.find((e) => e.tu)!
    const tuFuera = !top.some((e) => e.tu)

    const Fila = ({ e, pos }: { e: Entry; pos: number }) => (
        <li
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                e.tu ? "ring-1" : ""
            }`}
            style={e.tu ? { background: `${ACCENT}10`, boxShadow: `inset 0 0 0 1px ${ACCENT}40` } : undefined}
        >
            <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold"
                style={
                    pos <= 3
                        ? { background: `${MEDAL[pos - 1]}22`, color: MEDAL[pos - 1] }
                        : { background: "rgba(148,163,184,0.15)", color: "#64748b" }
                }
            >
                {pos}
            </span>
            <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
                {e.tu ? "Tú" : e.alias}
            </span>
            <span className="hidden shrink-0 text-[12px] text-zinc-400 sm:inline dark:text-zinc-500">
                {e.tests} tests · {e.acierto}%
            </span>
            <span className="shrink-0 text-[14px] font-extrabold" style={{ color: ACCENT }}>
                {e.puntos}
            </span>
        </li>
    )

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                    <div className="text-[15px] font-extrabold text-zinc-950 dark:text-zinc-50">
                        Ranking de la semana
                    </div>
                    <div className="text-[12px] text-zinc-400 dark:text-zinc-500">
                        Por respuestas acertadas · se reinicia cada lunes
                    </div>
                </div>
                <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{ background: `${ACCENT}14`, color: "#047857" }}
                >
                    Puesto {puesto}
                </span>
            </div>

            <ol className="space-y-1">
                {top.map((e, i) => (
                    <Fila key={`${e.alias}-${i}`} e={e} pos={i + 1} />
                ))}
                {tuFuera && (
                    <>
                        <li className="py-0.5 text-center text-[12px] text-zinc-300 dark:text-zinc-600">···</li>
                        <Fila e={tuEntry} pos={puesto} />
                    </>
                )}
            </ol>

            <p className="mt-3 text-[12.5px] text-zinc-500 dark:text-zinc-400">
                {tuEntry.puntos === 0
                    ? "Haz tests esta semana para entrar en el ranking."
                    : puesto === 1
                      ? "Vas primero esta semana. A mantenerlo."
                      : `Suma ${entries[puesto - 2].puntos - tuEntry.puntos + 1} puntos más para subir un puesto.`}
            </p>
        </div>
    )
}
