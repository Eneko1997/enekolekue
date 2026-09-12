"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

// Etiquetas de presentación por materia (la clave viene de la RPC, fuente única
// de la rotación en la base). Solo formatea; no decide la materia.
const LABELS: Record<string, string> = {
    constitucion: "Constitución",
    "ley-39-2015": "Ley 39/2015",
    "ley-40-2015": "Ley 40/2015",
    "empleo-publico": "Empleo público",
    "instituciones-vascas": "Instituciones vascas",
    "hacienda-contratacion": "Hacienda y contratación",
    "transparencia-datos": "Transparencia y datos",
    igualdad: "Igualdad",
    ue: "Unión Europea",
    "admin-electronica-ofimatica": "Administración electrónica",
    "atencion-archivo": "Atención y archivo",
    "prevencion-medioambiente": "Prevención y medioambiente",
}

export default function MicrotestDiaCard() {
    const [materia, setMateria] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()
        let cancelled = false
        ;(async () => {
            const { data } = await supabase.rpc("get_microtest_dia_materia")
            if (!cancelled && typeof data === "string") setMateria(LABELS[data] ?? null)
        })()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <Link
            href="/test?id=microtest_dia"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/5 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900 sm:p-7"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-60 blur-3xl"
                style={{ background: "rgba(16,185,129,0.18)" }}
            />
            <div className="relative">
                <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                    style={{ background: "rgba(16,185,129,0.14)", color: "#047857" }}
                >
                    Micro-test del día · gratis
                </span>
                <h2 className="mt-3 text-xl font-extrabold text-zinc-950 dark:text-zinc-50">
                    {materia ? `Hoy toca: ${materia}` : "Tu reto rápido de hoy"}
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    6 preguntas para calentar en 2 minutos. Cada día, una materia distinta.
                    Una victoria rápida para no perder el ritmo.
                </p>
                <span
                    className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition-transform group-hover:scale-[1.02]"
                    style={{ background: ACCENT }}
                >
                    Hacer el micro-test de hoy →
                </span>
            </div>
        </Link>
    )
}
