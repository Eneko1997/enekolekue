"use client"

// Bloque premium de "Mi progreso": (1) Repaso espaciado de fallos ("Repaso de hoy")
// y (2) Mapa de dominio por materia. Lee de las RPCs repaso_resumen() y dominio_mapa().
// Se monta arriba de la pestaña Progreso. Si no es premium, no renderiza nada.

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

const LABELS: Record<string, string> = {
    constitucion: "Constitución",
    "ley-39-2015": "Ley 39/2015 · Procedimiento",
    "ley-40-2015": "Ley 40/2015 · Sector público",
    "empleo-publico": "Empleo público",
    "instituciones-vascas": "Instituciones vascas",
    "hacienda-contratacion": "Hacienda y contratación",
    "transparencia-datos": "Transparencia y datos",
    igualdad: "Igualdad",
    ue: "Unión Europea",
    "admin-electronica-ofimatica": "Administración electrónica",
    "atencion-archivo": "Atención y archivo",
    "prevencion-medioambiente": "Prevención y medioambiente",
    sancionador: "Potestad sancionadora",
}
function labelTema(x: string): string {
    return LABELS[x] ?? x.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
}
function colorPct(pct: number): string {
    if (pct >= 70) return ACCENT
    if (pct >= 50) return "#F59E0B"
    return "#EF4444"
}

type Dominio = {
    tema: string
    practicadas: number
    intentos: number
    pct: number | null
    dominadas: number
    flojas: number
    total_banco: number
}

export default function ProgresoAvanzado({ t, isPremium }: { t: any; isPremium: boolean }) {
    const [pend, setPend] = useState(0)
    const [total, setTotal] = useState(0)
    const [mapa, setMapa] = useState<Dominio[] | null>(null)

    useEffect(() => {
        if (!isPremium) return
        const sb = createClient()
        let cancel = false
        ;(async () => {
            const [{ data: r }, { data: d }] = await Promise.all([
                sb.rpc("repaso_resumen"),
                sb.rpc("dominio_mapa"),
            ])
            if (cancel) return
            if (r && typeof r === "object") {
                setPend((r as any).pendientes ?? 0)
                setTotal((r as any).total ?? 0)
            }
            setMapa(Array.isArray(d) ? (d as Dominio[]) : [])
        })()
        return () => {
            cancel = true
        }
    }, [isPremium])

    if (!isPremium) return null

    const card = {
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "16px",
    } as const

    return (
        <div style={{ marginBottom: "8px" }}>
            {/* ── Repaso de hoy ─────────────────────────────────────────────── */}
            <div style={{ ...card, borderColor: pend > 0 ? `${ACCENT}55` : t.border, background: pend > 0 ? `${ACCENT}0d` : t.surface }}>
                <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase", color: ACCENT }}>
                    Repaso espaciado
                </div>
                {pend > 0 ? (
                    <>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "6px" }}>
                            <span style={{ fontSize: "30px", fontWeight: 900, color: t.textMain, lineHeight: 1 }}>{pend}</span>
                            <span style={{ fontSize: "15px", fontWeight: 700, color: t.textMain }}>
                                {pend === 1 ? "pregunta para repasar hoy" : "preguntas para repasar hoy"}
                            </span>
                        </div>
                        <p style={{ fontSize: "13px", color: t.textMuted, margin: "6px 0 0", lineHeight: 1.6 }}>
                            Tus fallos, reprogramados para que se te queden. Los que aciertes se espacian; los que fallas vuelven antes.
                        </p>
                        <a
                            href="/test?id=repaso_hoy"
                            style={{ display: "inline-block", marginTop: "14px", padding: "11px 22px", borderRadius: "10px", background: ACCENT, color: "#fff", fontSize: "14px", fontWeight: 800, textDecoration: "none" }}
                        >
                            Empezar repaso →
                        </a>
                    </>
                ) : (
                    <p style={{ fontSize: "13.5px", color: t.textMuted, margin: "8px 0 0", lineHeight: 1.6 }}>
                        {total > 0
                            ? "Repaso al día: no te queda ninguna pregunta para hoy. Vuelve mañana."
                            : "Aquí aparecerán las preguntas que falles en los tests, para repasarlas de forma espaciada hasta que las domines."}
                    </p>
                )}
            </div>

            {/* ── Mapa de dominio ───────────────────────────────────────────── */}
            <div style={card}>
                <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase", color: ACCENT }}>
                    Tu mapa de dominio
                </div>
                <p style={{ fontSize: "13px", color: t.textMuted, margin: "5px 0 14px", lineHeight: 1.55 }}>
                    Por materia, según tus tests. Lo más flojo primero.
                </p>
                {mapa === null ? (
                    <p style={{ fontSize: "13px", color: t.textMuted, margin: 0 }}>Cargando…</p>
                ) : mapa.length === 0 ? (
                    <p style={{ fontSize: "13px", color: t.textMuted, margin: 0, lineHeight: 1.6 }}>
                        Haz algún test y aquí verás qué materias dominas y cuáles reforzar, en vez de un porcentaje genérico.
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {mapa.map((m) => {
                            const pct = m.pct ?? 0
                            return (
                                <div key={m.tema}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", marginBottom: "5px" }}>
                                        <span style={{ fontSize: "13.5px", fontWeight: 700, color: t.textMain }}>{labelTema(m.tema)}</span>
                                        <span style={{ fontSize: "13px", fontWeight: 800, color: colorPct(pct) }}>{pct}%</span>
                                    </div>
                                    <div style={{ height: "6px", width: "100%", borderRadius: "999px", background: t.border, overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${pct}%`, background: colorPct(pct), borderRadius: "999px" }} />
                                    </div>
                                    <div style={{ fontSize: "11.5px", color: t.textMuted, marginTop: "4px" }}>
                                        {m.practicadas} practicadas de {m.total_banco}
                                        {m.dominadas > 0 ? ` · ${m.dominadas} dominadas` : ""}
                                        {m.flojas > 0 ? ` · ${m.flojas} a reforzar` : ""}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
