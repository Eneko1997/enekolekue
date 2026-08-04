"use client"

import { useState } from "react"
import Link from "next/link"
import { CONVOCATORIAS } from "@/lib/data/convocatorias"
import { getOrganismo } from "@/lib/data/organismos"

const ACCENT = "#10B981"

// Equivalencias orientativas (base: Decreto 297/2010 e IVAP/HABE). El perfil PL4
// exige un nivel alto de C1; algunas fuentes lo aproximan a C2. Verifica siempre
// la convalidación concreta en el Decreto y en el IVAP.
const FILAS = [
    { pl: "PL1", mcer: "B1", egaHabe: "HABE B1 · EOI Nivel Intermedio B1" },
    { pl: "PL2", mcer: "B2", egaHabe: "HABE B2 · EOI Nivel Avanzado B2" },
    { pl: "PL3", mcer: "C1", egaHabe: "EGA · HABE C1 · EOI C1" },
    { pl: "PL4", mcer: "C1 (nivel alto) / C2", egaHabe: "HABE C2 · EOI C2" },
]

export default function EquivalenciasPL() {
    const [sel, setSel] = useState<string | null>(null)
    const convocatorias = CONVOCATORIAS.filter((c) => c.perfilLinguistico)

    return (
        <div className="space-y-6">
            {/* Selector rápido */}
            <div className="flex flex-wrap gap-2">
                {FILAS.map((f) => (
                    <button
                        key={f.pl}
                        type="button"
                        onClick={() => setSel(sel === f.pl ? null : f.pl)}
                        className="rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-[14px] font-bold text-zinc-700 dark:text-zinc-200 transition-colors hover:border-zinc-300"
                        style={sel === f.pl ? { background: ACCENT, borderColor: ACCENT, color: "#fff" } : undefined}
                    >
                        {f.pl}
                    </button>
                ))}
            </div>

            {sel && (
                (() => {
                    const f = FILAS.find((x) => x.pl === sel)!
                    return (
                        <div className="rounded-2xl border-2 p-5" style={{ borderColor: ACCENT }}>
                            <div className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400">
                                Perfil {f.pl} equivale a
                            </div>
                            <div className="mt-1 text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
                                MCER {f.mcer}
                            </div>
                            <div className="mt-1 text-[14px] text-zinc-600 dark:text-zinc-400">{f.egaHabe}</div>
                        </div>
                    )
                })()
            )}

            {/* Tabla completa */}
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-[14px]">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[12px] uppercase tracking-wide text-zinc-500">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Perfil (PL)</th>
                            <th className="px-4 py-3 font-semibold">MCER</th>
                            <th className="px-4 py-3 font-semibold">EGA / HABE / EOI</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {FILAS.map((f) => (
                            <tr key={f.pl} className={sel === f.pl ? "bg-emerald-50/60 dark:bg-emerald-500/5" : ""}>
                                <td className="px-4 py-3 font-bold text-zinc-900 dark:text-zinc-100">{f.pl}</td>
                                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{f.mcer}</td>
                                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{f.egaHabe}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                Tabla orientativa basada en el Decreto 297/2010 y en las equivalencias del IVAP y
                HABE. El PL4 exige un C1 de nivel alto (algunas fuentes lo aproximan a C2).
                <strong> Verifica siempre la convalidación exacta</strong> en el Decreto y en el IVAP
                antes de acreditar un título.
            </p>

            {/* Qué pide cada convocatoria */}
            <div>
                <h3 className="mb-3 text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    Qué euskera pide cada convocatoria
                </h3>
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    {convocatorias.map((c) => (
                        <li key={c.slug} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                href={`/convocatorias/${c.slug}`}
                                className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200 hover:underline"
                            >
                                {getOrganismo(c.organismo)?.corto} — {c.nombre}
                            </Link>
                            <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
                                {c.perfilLinguistico}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
