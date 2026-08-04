"use client"

import { useMemo, useState } from "react"

const ACCENT = "#10B981"

const PRESETS = [
    { label: "4 opciones (resta 1/3)", pen: 3 },
    { label: "5 opciones (resta 1/4)", pen: 4 },
    { label: "Sin penalización", pen: 0 },
]

function Campo({
    label,
    value,
    onChange,
    min = 0,
}: {
    label: string
    value: number
    onChange: (n: number) => void
    min?: number
}) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
            <input
                type="number"
                inputMode="numeric"
                min={min}
                value={Number.isFinite(value) ? value : ""}
                onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-[16px] text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500"
            />
        </label>
    )
}

export default function CalculadoraNotaCorte() {
    const [total, setTotal] = useState(100)
    const [aciertos, setAciertos] = useState(60)
    const [fallos, setFallos] = useState(10)
    const [pen, setPen] = useState(3)
    const [escala, setEscala] = useState(10)

    const { blancos, netos, nota } = useMemo(() => {
        const blancos = Math.max(0, total - aciertos - fallos)
        const netos = pen > 0 ? aciertos - fallos / pen : aciertos
        const nota = total > 0 ? Math.max(0, (netos / total) * escala) : 0
        return { blancos, netos, nota }
    }, [total, aciertos, fallos, pen, escala])

    const excede = aciertos + fallos > total

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                    <button
                        key={p.label}
                        type="button"
                        onClick={() => setPen(p.pen)}
                        className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 transition-colors hover:border-zinc-300"
                        style={pen === p.pen ? { background: ACCENT, borderColor: ACCENT, color: "#fff" } : undefined}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Campo label="Preguntas" value={total} onChange={setTotal} min={1} />
                <Campo label="Aciertos" value={aciertos} onChange={setAciertos} />
                <Campo label="Fallos" value={fallos} onChange={setFallos} />
                <label className="flex flex-col gap-1">
                    <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Escala</span>
                    <select
                        value={escala}
                        onChange={(e) => setEscala(Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-[16px] text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500"
                    >
                        <option value={10}>Sobre 10</option>
                        <option value={100}>Sobre 100</option>
                    </select>
                </label>
            </div>

            {excede && (
                <p className="mt-3 text-[13px] font-medium text-amber-600">
                    Aciertos + fallos superan el total de preguntas: revisa los números.
                </p>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 px-5 py-4">
                <div className="text-[13px] text-zinc-500 dark:text-zinc-400">
                    En blanco: <strong className="text-zinc-700 dark:text-zinc-200">{blancos}</strong> ·
                    Netos: <strong className="text-zinc-700 dark:text-zinc-200">{netos.toFixed(2)}</strong>
                </div>
                <div className="text-right">
                    <div className="text-[12px] uppercase tracking-wide text-zinc-400">Tu nota</div>
                    <div className="text-3xl font-extrabold tracking-tight" style={{ color: ACCENT }}>
                        {nota.toFixed(2)}
                    </div>
                </div>
            </div>

            <p className="mt-4 text-[12px] text-zinc-500 dark:text-zinc-400">
                Método: <em>netos = aciertos − (fallos ÷ divisor de penalización)</em>, y{" "}
                <em>nota = (netos ÷ preguntas) × escala</em>. La penalización típica es 1/3 con 4
                opciones y 1/4 con 5. Ajusta el divisor a lo que indiquen las bases de tu convocatoria.
            </p>
        </div>
    )
}
