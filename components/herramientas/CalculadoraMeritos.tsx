"use client"

import { useMemo, useState } from "react"

const ACCENT = "#10B981"

// Baremos oficiales de la fase de concurso (BOPV nº157, 19/08/2026).
// Fase de concurso: máximo 45 puntos = experiencia (máx 27) + titulaciones (máx 18)
// + euskera (según tabla, solo si no es preceptivo en la plaza). El total nunca
// supera 45.
type Escala = "administrativo" | "apoyo"

const EXP_POR_MES = 0.45
const EXP_MAX = 27
const TITUL_MAX = 18
const CONCURSO_MAX = 45

// Titulaciones que puntúan como mérito (se pueden sumar varias hasta el tope).
const TITULACIONES: Record<Escala, { label: string; v: number }[]> = {
    administrativo: [
        { label: "FP grado medio (Gestión administrativa, Act. comerciales)", v: 7.2 },
        { label: "FP superior o especialización (Admin. y finanzas, DAW, DAM, Marketing, ASIR…)", v: 10.8 },
    ],
    apoyo: [
        { label: "Graduado en ESO o equivalente", v: 7.2 },
        { label: "FP grado medio (de la lista de la convocatoria)", v: 10.8 },
    ],
}

const EUSKERA: Record<Escala, { label: string; v: number }[]> = {
    administrativo: [
        { label: "Sin acreditar / preceptivo en la plaza", v: 0 },
        { label: "Nivel básico (comprensión A2 · expresión B1)", v: 7.25 },
        { label: "PL1 (B1 · B1)", v: 10.15 },
        { label: "Intermedio (B1 · B2)", v: 11.6 },
        { label: "PL2 o superior (B2/C1/C2)", v: 14.5 },
    ],
    apoyo: [
        { label: "Sin acreditar / preceptivo en la plaza", v: 0 },
        { label: "Nivel básico (comprensión A2 · expresión B1)", v: 7.25 },
        { label: "PL1 o superior", v: 10.15 },
    ],
}

function Num({
    label,
    value,
    onChange,
    min = 0,
    max,
}: {
    label: string
    value: number
    onChange: (n: number) => void
    min?: number
    max?: number
}) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
            <input
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                value={Number.isFinite(value) ? value : ""}
                onChange={(e) => {
                    let n = Number(e.target.value) || 0
                    n = Math.max(min, n)
                    if (max != null) n = Math.min(max, n)
                    onChange(n)
                }}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-[16px] text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500"
            />
        </label>
    )
}

const fmt = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 })

export default function CalculadoraMeritos() {
    const [escala, setEscala] = useState<Escala>("administrativo")
    const [anios, setAnios] = useState(3)
    const [meses, setMeses] = useState(0)
    const [titulSel, setTitulSel] = useState<number[]>([])
    const [euskIdx, setEuskIdx] = useState(0)

    const r = useMemo(() => {
        const totalMeses = anios * 12 + meses
        const exp = Math.min(EXP_MAX, totalMeses * EXP_POR_MES)
        const titulBruto = titulSel.reduce((s, i) => s + (TITULACIONES[escala][i]?.v ?? 0), 0)
        const titul = Math.min(TITUL_MAX, titulBruto)
        const eusk = EUSKERA[escala][euskIdx]?.v ?? 0
        const bruto = exp + titul + eusk
        const total = Math.min(CONCURSO_MAX, bruto)
        // Anchos del desglose (escalados a 45 si el bruto supera el tope).
        const esc = bruto > CONCURSO_MAX ? CONCURSO_MAX / bruto : 1
        return {
            exp,
            titul,
            eusk,
            bruto,
            total,
            wExp: (exp * esc) / CONCURSO_MAX * 100,
            wTitul: (titul * esc) / CONCURSO_MAX * 100,
            wEusk: (eusk * esc) / CONCURSO_MAX * 100,
        }
    }, [escala, anios, meses, titulSel, euskIdx])

    const toggleTitul = (i: number) =>
        setTitulSel((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
            {/* Escala */}
            <div className="mb-5 flex flex-wrap gap-2">
                {(
                    [
                        { id: "administrativo", label: "Administrativo (C1)" },
                        { id: "apoyo", label: "Personal de Apoyo" },
                    ] as { id: Escala; label: string }[]
                ).map((o) => (
                    <button
                        key={o.id}
                        type="button"
                        onClick={() => {
                            setEscala(o.id)
                            setTitulSel([])
                            setEuskIdx(0)
                        }}
                        className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 transition-colors hover:border-zinc-300"
                        style={escala === o.id ? { background: ACCENT, borderColor: ACCENT, color: "#fff" } : undefined}
                    >
                        {o.label}
                    </button>
                ))}
            </div>

            {/* Experiencia */}
            <div className="mb-1 text-[13px] font-bold uppercase tracking-wide text-zinc-400">Experiencia</div>
            <div className="grid grid-cols-2 gap-3">
                <Num label="Años trabajados (asimilables)" value={anios} onChange={setAnios} max={40} />
                <Num label="Meses adicionales" value={meses} onChange={setMeses} max={11} />
            </div>
            <p className="mt-1.5 text-[12px] text-zinc-500 dark:text-zinc-400">
                0,45 puntos por mes, máximo 27. Se cuentan los últimos 10 años en puestos asimilables.
            </p>

            {/* Titulaciones (multi) */}
            <div className="mt-5 mb-1 flex items-center justify-between">
                <span className="text-[13px] font-bold uppercase tracking-wide text-zinc-400">Titulaciones (mérito)</span>
                <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">{fmt(r.titul)} / 18</span>
            </div>
            <div className="space-y-2">
                {TITULACIONES[escala].map((t, i) => {
                    const on = titulSel.includes(i)
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => toggleTitul(i)}
                            className="flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors"
                            style={{
                                borderColor: on ? ACCENT : undefined,
                                background: on ? `${ACCENT}12` : undefined,
                            }}
                        >
                            <span
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-white"
                                style={{ borderColor: on ? ACCENT : "#a1a1aa", background: on ? ACCENT : "transparent" }}
                                aria-hidden
                            >
                                {on ? "✓" : ""}
                            </span>
                            <span className="flex-1 text-[14px] text-zinc-800 dark:text-zinc-200">{t.label}</span>
                            <span className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">{fmt(t.v)} pts</span>
                        </button>
                    )
                })}
            </div>
            <p className="mt-1.5 text-[12px] text-zinc-500 dark:text-zinc-400">
                Marca todas las que tengas: suman hasta un máximo de 18 puntos. No puntúa el título que ya
                es requisito de acceso a la plaza.
            </p>

            {/* Euskera */}
            <div className="mt-5 mb-1 text-[13px] font-bold uppercase tracking-wide text-zinc-400">Euskera</div>
            <select
                value={euskIdx}
                onChange={(e) => setEuskIdx(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2.5 text-[15px] text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500"
            >
                {EUSKERA[escala].map((t, i) => (
                    <option key={i} value={i}>
                        {t.label} {t.v > 0 ? `· ${fmt(t.v)} pts` : ""}
                    </option>
                ))}
            </select>
            <p className="mt-1.5 text-[12px] text-zinc-500 dark:text-zinc-400">
                Solo puntúa en las plazas donde el euskera no es requisito (sin preceptividad vencida).
            </p>

            {/* Resultado */}
            <div className="mt-6 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 px-5 py-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="space-y-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                        <div>Experiencia: <strong className="text-zinc-700 dark:text-zinc-200">{fmt(r.exp)}</strong> / 27</div>
                        <div>Titulaciones: <strong className="text-zinc-700 dark:text-zinc-200">{fmt(r.titul)}</strong> / 18</div>
                        <div>Euskera: <strong className="text-zinc-700 dark:text-zinc-200">{fmt(r.eusk)}</strong></div>
                    </div>
                    <div className="text-right">
                        <div className="text-[12px] uppercase tracking-wide text-zinc-400">Fase de concurso</div>
                        <div className="text-4xl font-extrabold tracking-tight" style={{ color: ACCENT }}>
                            {fmt(r.total)}
                        </div>
                        <div className="text-[12px] text-zinc-400">de 45 puntos</div>
                    </div>
                </div>

                {/* Desglose visual apilado sobre 45 */}
                <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div className="h-full" style={{ width: `${r.wExp}%`, background: ACCENT }} title={`Experiencia ${fmt(r.exp)}`} />
                    <div className="h-full" style={{ width: `${r.wTitul}%`, background: "#0EA5E9" }} title={`Titulaciones ${fmt(r.titul)}`} />
                    <div className="h-full" style={{ width: `${r.wEusk}%`, background: "#A855F7" }} title={`Euskera ${fmt(r.eusk)}`} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: ACCENT }} />Experiencia</span>
                    <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#0EA5E9" }} />Titulaciones</span>
                    <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#A855F7" }} />Euskera</span>
                </div>

                {r.total < CONCURSO_MAX ? (
                    <p className="mt-3 text-[12px] text-zinc-500 dark:text-zinc-400">
                        Te faltan <strong className="text-zinc-700 dark:text-zinc-200">{fmt(CONCURSO_MAX - r.total)}</strong> puntos
                        para el máximo de la fase de concurso.
                    </p>
                ) : (
                    <p className="mt-3 text-[12px] font-medium text-emerald-600">
                        Estás en el máximo de la fase de concurso (45 puntos).
                    </p>
                )}
                {r.bruto > CONCURSO_MAX && (
                    <p className="mt-1 text-[12px] font-medium text-amber-600">
                        Tu suma bruta es {fmt(r.bruto)}, pero la fase de concurso está topada en 45 puntos.
                    </p>
                )}
            </div>

            <p className="mt-4 text-[12px] text-zinc-500 dark:text-zinc-400">
                Cálculo orientativo según las bases específicas del BOPV nº157 (19/08/2026). La oposición
                puntúa aparte hasta 100 puntos; esto solo estima la <em>fase de concurso</em> (méritos). Revisa
                siempre las bases oficiales de tu plaza.
            </p>
        </div>
    )
}
