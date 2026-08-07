"use client"

import { useMemo, useState } from "react"

const ACCENT = "#10B981"

function interpreta(ratio: number): { texto: string; color: string } {
    if (ratio <= 0) return { texto: "Introduce los datos", color: "#64748B" }
    if (ratio < 10) return { texto: "Ratio asequible", color: "#10B981" }
    if (ratio < 30) return { texto: "Competida", color: "#F59E0B" }
    if (ratio < 60) return { texto: "Muy competida", color: "#F59E0B" }
    return { texto: "Altamente competida", color: "#EF4444" }
}

const PRESENTA = [40, 50, 60, 70, 100]

export default function RatioAspirantes() {
    const [aspirantes, setAspirantes] = useState(3000)
    const [plazas, setPlazas] = useState(100)
    const [presenta, setPresenta] = useState(60)

    const { ratio, efectivo, info } = useMemo(() => {
        const ratio = plazas > 0 ? aspirantes / plazas : 0
        const efectivo = ratio * (presenta / 100)
        return { ratio, efectivo, info: interpreta(efectivo) }
    }, [aspirantes, plazas, presenta])

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
            <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                    <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Aspirantes admitidos</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={aspirantes}
                        onChange={(e) => setAspirantes(Math.max(0, Number(e.target.value) || 0))}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-[16px] text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500"
                    />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Plazas convocadas</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={plazas}
                        onChange={(e) => setPlazas(Math.max(1, Number(e.target.value) || 0))}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-[16px] text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500"
                    />
                </label>
            </div>

            <div className="mt-4">
                <div className="mb-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-400">
                    ¿Qué % de admitidos suele presentarse?
                </div>
                <div className="flex flex-wrap gap-2">
                    {PRESENTA.map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPresenta(p)}
                            className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 transition-colors hover:border-zinc-300"
                            style={presenta === p ? { background: ACCENT, borderColor: ACCENT, color: "#fff" } : undefined}
                        >
                            {p === 100 ? "Todos" : `${p} %`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 px-5 py-4">
                <div className="flex gap-6">
                    <div>
                        <div className="text-[12px] uppercase tracking-wide text-zinc-400">Sobre admitidos</div>
                        <div className="text-2xl font-bold tracking-tight text-zinc-500 dark:text-zinc-400">
                            {ratio > 0 ? ratio.toFixed(1) : "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-[12px] uppercase tracking-wide text-zinc-400">Ratio efectivo</div>
                        <div className="text-3xl font-extrabold tracking-tight" style={{ color: ACCENT }}>
                            {efectivo > 0 ? efectivo.toFixed(1) : "—"}
                        </div>
                    </div>
                </div>
                <span
                    className="rounded-full px-3 py-1.5 text-[13px] font-bold"
                    style={{ color: info.color, background: `${info.color}18`, border: `1px solid ${info.color}30` }}
                >
                    {info.texto}
                </span>
            </div>

            <p className="mt-4 text-[12px] text-zinc-500 dark:text-zinc-400">
                Método: <em>ratio = aspirantes admitidos ÷ plazas</em>, y{" "}
                <em>ratio efectivo = ratio × (% que se presenta)</em>. Como en muchas oposiciones se
                presenta solo el 50-60 % de los admitidos, el ratio efectivo (real de competencia)
                suele ser bastante menor. Guía sobre el efectivo: &lt;10 asequible, 10-30 competida,
                &gt;30 muy competida.
            </p>
        </div>
    )
}
