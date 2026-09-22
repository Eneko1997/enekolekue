"use client"

// Bloque premium de "Mi progreso", en BENTO: (1) Predicción de nota (IRT/Rasch, blindada
// hasta tener datos), (2) Repaso espaciado de fallos ("Repaso de hoy"), (3) Punto flojo,
// (4) Mapa de dominio por materia. Lee de prediccion_nota(), repaso_resumen(), dominio_mapa().
// Si no es premium, no renderiza nada.

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
function nota1(n: number): string {
    return n.toFixed(1).replace(".", ",")
}
// Ranking en lenguaje de marketing (sin la palabra "percentil"). Percentil alto = top pequeño.
function rankingTexto(percentil: number): string {
    if (percentil >= 50) return `En el top ${Math.max(1, 100 - percentil)}% de quienes preparan tu oposición`
    return `Mejor que el ${percentil}% de quienes preparan tu oposición`
}

// Donut ("quesito") de 3 segmentos: dominadas / en progreso / a reforzar.
function Donut({ v, a, r }: { v: number; a: number; r: number }) {
    const total = v + a + r || 1
    const R = 30
    const C = 2 * Math.PI * R
    const segs = [
        { val: v, c: ACCENT },
        { val: a, c: "#F59E0B" },
        { val: r, c: "#EF4444" },
    ]
    let off = 0
    return (
        <svg width="86" height="86" viewBox="0 0 86 86" style={{ flexShrink: 0 }} aria-hidden>
            <circle cx="43" cy="43" r={R} fill="none" stroke="rgba(120,120,130,0.18)" strokeWidth="11" />
            {segs.map((s, i) => {
                const len = (s.val / total) * C
                const node = (
                    <circle
                        key={i}
                        cx="43"
                        cy="43"
                        r={R}
                        fill="none"
                        stroke={s.c}
                        strokeWidth="11"
                        strokeDasharray={`${len} ${C - len}`}
                        strokeDashoffset={-off}
                        transform="rotate(-90 43 43)"
                    />
                )
                off += len
                return node
            })}
        </svg>
    )
}
function Leg({ color, label, n, t }: { color: string; label: string; n: number; t: any }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: "12.5px", color: t.textMuted }}>{label}</span>
            <span style={{ fontSize: "12.5px", fontWeight: 800, color: t.textMain, marginLeft: "auto" }}>{n}</span>
        </div>
    )
}

type Dominio = { tema: string; practicadas: number; intentos: number; pct: number | null; dominadas: number; flojas: number; total_banco: number }
type Pred = { shown: boolean; nota?: number; aciertos_pct?: number; percentil?: number | null; respondidas?: number; faltan?: number }

const META_PRED = 50 // preguntas para desbloquear la predicción (igual que el umbral del RPC)

export default function ProgresoAvanzado({ t, isPremium }: { t: any; isPremium: boolean }) {
    const [pend, setPend] = useState(0)
    const [total, setTotal] = useState(0)
    const [mapa, setMapa] = useState<Dominio[] | null>(null)
    const [pred, setPred] = useState<Pred | null>(null)

    useEffect(() => {
        if (!isPremium) return
        const sb = createClient()
        let cancel = false
        ;(async () => {
            const [{ data: r }, { data: d }, { data: pr }] = await Promise.all([
                sb.rpc("repaso_resumen"),
                sb.rpc("dominio_mapa"),
                sb.rpc("prediccion_nota"),
            ])
            if (cancel) return
            if (r && typeof r === "object") {
                setPend((r as any).pendientes ?? 0)
                setTotal((r as any).total ?? 0)
            }
            setMapa(Array.isArray(d) ? (d as Dominio[]) : [])
            setPred((pr as Pred) ?? { shown: false })
        })()
        return () => {
            cancel = true
        }
    }, [isPremium])

    if (!isPremium) return null

    const tile = {
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: "16px",
        padding: "18px",
    } as const
    const eyebrow = { fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase" as const, color: ACCENT }
    // Reparto de materias por estado (para el quesito): dominadas ≥70, en progreso 50-69, a reforzar <50.
    const buckets = (mapa ?? []).reduce(
        (acc, m) => {
            const p = m.pct ?? 0
            if (p >= 70) acc.verde++
            else if (p >= 50) acc.ambar++
            else acc.rojo++
            return acc
        },
        { verde: 0, ambar: 0, rojo: 0 },
    )
    const totMat = buckets.verde + buckets.ambar + buckets.rojo
    const flojo = mapa && mapa.length > 0 ? mapa[0] : null

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: "14px",
                marginBottom: "24px",
            }}
        >
            {/* ── HERO: Predicción de nota (span completo) ─────────────────── */}
            <div
                style={{
                    ...tile,
                    gridColumn: "1 / -1",
                    padding: "22px",
                    background: pred?.shown
                        ? `linear-gradient(135deg, ${ACCENT}14, ${t.surface} 60%)`
                        : t.surface,
                    borderColor: pred?.shown ? `${ACCENT}55` : t.border,
                }}
            >
                <div style={eyebrow}>Predicción de nota</div>
                {pred?.shown ? (
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "18px", marginTop: "8px" }}>
                        <div>
                            <div style={{ fontSize: "12.5px", color: t.textMuted, marginBottom: "2px" }}>Si el examen fuera hoy</div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                                <span style={{ fontSize: "46px", fontWeight: 900, color: t.textMain, lineHeight: 1 }}>{nota1(pred.nota ?? 0)}</span>
                                <span style={{ fontSize: "18px", fontWeight: 700, color: t.textMuted }}>/ 10</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "12.5px", fontWeight: 700, color: t.textMain, background: `${ACCENT}18`, borderRadius: "999px", padding: "6px 12px" }}>
                                ≈ {pred.aciertos_pct}% de aciertos
                            </span>
                            {pred.percentil != null && (
                                <span style={{ fontSize: "12.5px", fontWeight: 700, color: t.textMain, background: `${ACCENT}18`, borderRadius: "999px", padding: "6px 12px" }}>
                                    {rankingTexto(pred.percentil)}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ marginTop: "8px" }}>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: t.textMain }}>
                            Sigue practicando para desbloquear tu predicción
                        </div>
                        <p style={{ fontSize: "12.5px", color: t.textMuted, margin: "5px 0 12px", lineHeight: 1.6 }}>
                            La calculamos con la dificultad real de cada pregunta (calibrada con las respuestas de todos). Necesita unas cuantas respuestas tuyas para ser fiable, no un número al azar.
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ flex: 1, height: "8px", borderRadius: "999px", background: t.border, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${Math.min(100, Math.round(((pred?.respondidas ?? 0) / META_PRED) * 100))}%`, background: ACCENT, borderRadius: "999px" }} />
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 800, color: t.textMuted, whiteSpace: "nowrap" }}>
                                {pred?.respondidas ?? 0} / {META_PRED}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Repaso de hoy ────────────────────────────────────────────── */}
            <div style={{ ...tile, borderColor: pend > 0 ? `${ACCENT}55` : t.border, background: pend > 0 ? `${ACCENT}0d` : t.surface, display: "flex", flexDirection: "column" }}>
                <div style={eyebrow}>Repaso de hoy</div>
                {pend > 0 ? (
                    <>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "7px", marginTop: "6px" }}>
                            <span style={{ fontSize: "30px", fontWeight: 900, color: t.textMain, lineHeight: 1 }}>{pend}</span>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: t.textMuted }}>{pend === 1 ? "para repasar" : "para repasar"}</span>
                        </div>
                        <p style={{ fontSize: "12px", color: t.textMuted, margin: "6px 0 12px", lineHeight: 1.5 }}>
                            Tus fallos, reprogramados con repetición espaciada.
                        </p>
                        <a href="/test?id=repaso_hoy" style={{ marginTop: "auto", textAlign: "center", padding: "10px 16px", borderRadius: "10px", background: ACCENT, color: "#fff", fontSize: "13.5px", fontWeight: 800, textDecoration: "none" }}>
                            Empezar repaso →
                        </a>
                    </>
                ) : (
                    <p style={{ fontSize: "12.5px", color: t.textMuted, margin: "8px 0 0", lineHeight: 1.6 }}>
                        {total > 0 ? "Al día: sin repasos para hoy. Vuelve mañana." : "Aquí caerán las preguntas que falles, para repasarlas hasta dominarlas."}
                    </p>
                )}
            </div>

            {/* ── Quesito: reparto de materias ─────────────────────────────── */}
            <div style={{ ...tile, display: "flex", flexDirection: "column" }}>
                <div style={eyebrow}>Cómo llevas las materias</div>
                {totMat > 0 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "10px" }}>
                        <div style={{ position: "relative", width: "86px", height: "86px" }}>
                            <Donut v={buckets.verde} a={buckets.ambar} r={buckets.rojo} />
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: "21px", fontWeight: 900, color: t.textMain, lineHeight: 1 }}>{totMat}</span>
                                <span style={{ fontSize: "9.5px", color: t.textMuted }}>materias</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "7px", flex: 1 }}>
                            <Leg color={ACCENT} label="Dominadas" n={buckets.verde} t={t} />
                            <Leg color="#F59E0B" label="En progreso" n={buckets.ambar} t={t} />
                            <Leg color="#EF4444" label="A reforzar" n={buckets.rojo} t={t} />
                        </div>
                    </div>
                ) : (
                    <p style={{ fontSize: "12.5px", color: t.textMuted, margin: "8px 0 0", lineHeight: 1.6 }}>Haz algún test y aquí verás cómo repartes tus materias.</p>
                )}
            </div>

            {/* ── Tu punto más flojo (3ª card de la fila) ──────────────────── */}
            <div style={{ ...tile, display: "flex", flexDirection: "column" }}>
                <div style={eyebrow}>Tu punto más flojo</div>
                {flojo ? (
                    <>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: t.textMain, marginTop: "8px", lineHeight: 1.25 }}>{labelTema(flojo.tema)}</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "6px" }}>
                            <span style={{ fontSize: "26px", fontWeight: 900, color: colorPct(flojo.pct ?? 0), lineHeight: 1 }}>{flojo.pct ?? 0}%</span>
                            <span style={{ fontSize: "12px", color: t.textMuted }}>de aciertos</span>
                        </div>
                        <p style={{ fontSize: "12px", color: t.textMuted, margin: "6px 0 0", lineHeight: 1.5 }}>Por aquí es donde más ganas ahora mismo.</p>
                    </>
                ) : (
                    <p style={{ fontSize: "12.5px", color: t.textMuted, margin: "8px 0 0", lineHeight: 1.6 }}>Haz algún test y aquí verás tu materia más floja.</p>
                )}
            </div>

            {/* ── Mapa de dominio (span completo) ──────────────────────────── */}
            <div style={{ ...tile, gridColumn: "1 / -1" }}>
                <div style={eyebrow}>Tu mapa de dominio</div>
                <p style={{ fontSize: "12.5px", color: t.textMuted, margin: "5px 0 14px", lineHeight: 1.5 }}>
                    Por materia, según tus tests. Lo más flojo primero.
                </p>
                {mapa === null ? (
                    <p style={{ fontSize: "13px", color: t.textMuted, margin: 0 }}>Cargando…</p>
                ) : mapa.length === 0 ? (
                    <p style={{ fontSize: "13px", color: t.textMuted, margin: 0, lineHeight: 1.6 }}>
                        Haz algún test y aquí verás qué materias dominas y cuáles reforzar, en vez de un porcentaje genérico.
                    </p>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px 22px" }}>
                        {mapa.map((m) => {
                            const pct = m.pct ?? 0
                            return (
                                <div key={m.tema}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", marginBottom: "5px" }}>
                                        <span style={{ fontSize: "13px", fontWeight: 700, color: t.textMain }}>{labelTema(m.tema)}</span>
                                        <span style={{ fontSize: "12.5px", fontWeight: 800, color: colorPct(pct) }}>{pct}%</span>
                                    </div>
                                    <div style={{ height: "6px", width: "100%", borderRadius: "999px", background: t.border, overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${pct}%`, background: colorPct(pct), borderRadius: "999px" }} />
                                    </div>
                                    <div style={{ fontSize: "11px", color: t.textMuted, marginTop: "4px" }}>
                                        {m.practicadas} practicadas de {m.total_banco}
                                        {m.dominadas > 0 ? ` · ${m.dominadas} dominadas` : ""}
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
