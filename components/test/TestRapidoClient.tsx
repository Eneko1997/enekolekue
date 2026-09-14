"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import LightNavbar from "@/components/site/LightNavbar"
import { createClient } from "@/lib/supabase/client"

// Test rápido del día — página propia, autónoma (no usa el reproductor grande).
// 6 preguntas de la materia del día (RPC get_microtest_dia), modo examen: se
// responden las 6 y al corregir se ve la nota. Anónimo: muro de registro para
// ver la nota. Fetch directo al endpoint REST (la RPC es pública).

const ACCENT = "#10B981"
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ougvtcmqmcutrexxrxvz.supabase.co"
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_lfcfMDSYpIDWzy2CWufT_A_NfJbTimc"

const MICRO_LABELS: Record<string, string> = {
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

type Q = { id: string; enunciado: string; opciones: string[]; correcta: number; explicacion: string; tema: string | null }

function barajar(q: any): Q {
    const ops: string[] = Array.isArray(q.opciones) ? q.opciones : []
    const idx = ops.map((_, i) => i)
    for (let i = idx.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[idx[i], idx[j]] = [idx[j], idx[i]]
    }
    return {
        id: q.id,
        enunciado: q.enunciado,
        opciones: idx.map((i) => ops[i]),
        correcta: idx.indexOf(q.correcta),
        explicacion: q.explicacion,
        tema: q.tema ?? null,
    }
}

export default function TestRapidoClient() {
    const [qs, setQs] = useState<Q[] | null>(null) // null = cargando; [] = error
    const [resp, setResp] = useState<(number | null)[]>([])
    const [corregido, setCorregido] = useState(false)
    const [user, setUser] = useState<any>(undefined) // undefined = comprobando
    const [materia, setMateria] = useState<string | null>(null)

    useEffect(() => {
        let cancel = false
        ;(async () => {
            try {
                const r = await fetch(`${SUPA_URL}/rest/v1/rpc/get_microtest_dia`, {
                    method: "POST",
                    headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ p_limite: 6 }),
                })
                const data = await r.json()
                if (cancel) return
                const arr = Array.isArray(data) ? data.map(barajar) : []
                setQs(arr)
                setResp(Array(arr.length).fill(null))
                setMateria(arr[0]?.tema ? MICRO_LABELS[arr[0].tema] ?? null : null)
            } catch {
                if (!cancel) setQs([])
            }
        })()
        createClient()
            .auth.getUser()
            .then(({ data }) => !cancel && setUser(data.user ?? null))
            .catch(() => !cancel && setUser(null))
        return () => {
            cancel = true
        }
    }, [])

    const titulo = materia ? `Test rápido · ${materia}` : "Test rápido del día"
    const respondidas = resp.filter((r) => r !== null).length
    const aciertos = qs ? qs.reduce((a, q, i) => a + (resp[i] === q.correcta ? 1 : 0), 0) : 0
    const total = qs?.length || 0
    const nota = total ? Math.round((aciertos / total) * 10 * 10) / 10 : 0
    const aprobado = nota >= 5

    return (
        <div className="relative min-h-dvh bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
            <LightNavbar />
            <main className="mx-auto max-w-2xl px-5 py-8">
                <Link href="/" className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">
                    ← Volver
                </Link>

                <div className="mt-4">
                    <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>
                        Test rápido del día · gratis
                    </div>
                    <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{titulo}</h1>
                    <p className="mt-1 text-[13.5px] text-zinc-500 dark:text-zinc-400">
                        6 preguntas rápidas. Responde y corrige para ver tu nota.
                    </p>
                </div>

                {qs === null && (
                    <div className="mt-10 text-center text-[14px] text-zinc-500">Cargando preguntas…</div>
                )}

                {qs !== null && qs.length === 0 && (
                    <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-[14px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                        No hemos podido cargar el test ahora mismo. Inténtalo de nuevo en un momento.
                    </div>
                )}

                {qs !== null && qs.length > 0 && (
                    <>
                        {/* Resultado */}
                        {corregido && (
                            <div className="relative mt-6">
                                <div
                                    className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900"
                                    style={{ filter: user === null ? "blur(7px)" : undefined }}
                                    aria-hidden={user === null}
                                >
                                    <div className="text-[12px] font-semibold uppercase tracking-wide text-zinc-400">Tu nota</div>
                                    <div className="text-6xl font-black leading-none" style={{ color: aprobado ? "#22C55E" : "#EF4444" }}>
                                        {nota.toFixed(1).replace(".", ",")}
                                    </div>
                                    <div className="mt-2 text-[13px] text-zinc-500 dark:text-zinc-400">
                                        {aciertos} de {total} correctas
                                    </div>
                                </div>
                                {user === null && (
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                                            <div className="text-[16px] font-extrabold">Crea tu cuenta gratis para ver tu nota</div>
                                            <p className="mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-400">
                                                Guarda tu progreso y sigue practicando el temario oficial.
                                            </p>
                                            <Link
                                                href="/signup"
                                                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-[14px] font-semibold text-white dark:bg-white dark:text-zinc-950"
                                            >
                                                Crear cuenta gratis
                                            </Link>
                                            <Link href="/login" className="mt-3 block text-[13px] font-semibold" style={{ color: ACCENT }}>
                                                Ya tengo cuenta →
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Preguntas */}
                        <div className="mt-6 space-y-4">
                            {qs.map((q, qi) => (
                                <div key={q.id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="text-[14px] font-bold">
                                        <span className="text-zinc-400">{qi + 1}.</span> {q.enunciado}
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        {q.opciones.map((op, oi) => {
                                            const elegido = resp[qi] === oi
                                            const esCorrecta = q.correcta === oi
                                            let border = "border-zinc-200 dark:border-zinc-700"
                                            let bg = "bg-transparent"
                                            if (corregido) {
                                                if (esCorrecta) {
                                                    border = "border-emerald-500"
                                                    bg = "bg-emerald-50 dark:bg-emerald-950/30"
                                                } else if (elegido) {
                                                    border = "border-red-400"
                                                    bg = "bg-red-50 dark:bg-red-950/20"
                                                }
                                            } else if (elegido) {
                                                border = "border-emerald-500"
                                                bg = "bg-emerald-50 dark:bg-emerald-950/30"
                                            }
                                            return (
                                                <button
                                                    key={oi}
                                                    type="button"
                                                    disabled={corregido}
                                                    onClick={() => {
                                                        const n = [...resp]
                                                        n[qi] = oi
                                                        setResp(n)
                                                    }}
                                                    className={`flex w-full items-center gap-3 rounded-xl border ${border} ${bg} px-4 py-2.5 text-left text-[13.5px] transition-colors`}
                                                >
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-[11px] font-bold text-zinc-500 dark:border-zinc-600">
                                                        {["A", "B", "C", "D"][oi]}
                                                    </span>
                                                    <span className="text-zinc-800 dark:text-zinc-100">{op}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                    {corregido && q.explicacion && (
                                        <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-[12.5px] leading-relaxed text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
                                            {q.explicacion}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Acción */}
                        {!corregido ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setCorregido(true)
                                    window.scrollTo({ top: 0, behavior: "smooth" })
                                }}
                                disabled={respondidas === 0}
                                className="mt-6 w-full rounded-full bg-zinc-950 px-6 py-3.5 text-[15px] font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-zinc-950"
                            >
                                Corregir {respondidas < total ? `(${respondidas}/${total})` : ""}
                            </button>
                        ) : (
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="flex-1 rounded-full border border-zinc-300 px-6 py-3 text-[14px] font-semibold text-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                                >
                                    Otro test
                                </button>
                                <Link
                                    href="/simulacro-administrativo-gobierno-vasco"
                                    className="flex-1 rounded-full px-6 py-3 text-center text-[14px] font-semibold text-white"
                                    style={{ background: ACCENT }}
                                >
                                    Probar un simulacro completo →
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}
