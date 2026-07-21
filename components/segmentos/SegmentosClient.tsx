"use client"

import * as React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import LightNavbar from "@/components/site/LightNavbar"
import SiteFooter from "@/components/site/SiteFooter"
import { useTheme } from "@/lib/use-theme"

const ACCENT = "#10B981"
const supabase = createClient()

interface Segmento {
    id: string
    nombre: string
    descripcion: string | null
    test_id: string
    n_preguntas: number
    escala: string | null
    orden: number
}
interface RankRow {
    pos: number
    nombre: string
    correctas: number
    total: number
    tiempo_ms: number
    es_yo: boolean
}
interface Pregunta {
    id: string
    enunciado: string
    opciones: string[]
    correcta: number
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}
function shuffleOpciones(opciones: string[], correcta: number) {
    if (!Array.isArray(opciones) || opciones.length < 2)
        return { opciones, correcta }
    const t = opciones[correcta]
    const b = shuffle(opciones)
    return { opciones: b, correcta: b.indexOf(t) }
}
function fmtTiempo(ms: number): string {
    const s = ms / 1000
    return s < 60
        ? `${s.toFixed(1)}s`
        : `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`
}

export default function SegmentosClient() {
    const { dark } = useTheme()
    const t = dark
        ? {
              bg: "#0b0f0e",
              surface: "rgba(255,255,255,0.04)",
              border: "rgba(255,255,255,0.10)",
              textMain: "#f4f4f5",
              textMuted: "#9ca3af",
              glass: "rgba(255,255,255,0.06)",
          }
        : {
              bg: "#f7faf9",
              surface: "#ffffff",
              border: "rgba(0,0,0,0.08)",
              textMain: "#111827",
              textMuted: "#6b7280",
              glass: "rgba(0,0,0,0.04)",
          }

    const [userId, setUserId] = useState<string | null>(null)
    const [segmentos, setSegmentos] = useState<Segmento[]>([])
    const [rankings, setRankings] = useState<Record<string, RankRow[]>>({})
    const [loading, setLoading] = useState(true)

    // Estado del sprint en curso
    const [jugando, setJugando] = useState<Segmento | null>(null)
    const [preguntas, setPreguntas] = useState<Pregunta[]>([])
    const [idx, setIdx] = useState(0)
    const [aciertos, setAciertos] = useState(0)
    const [inicio, setInicio] = useState(0)
    const [transcurrido, setTranscurrido] = useState(0)
    const [resultado, setResultado] = useState<{
        correctas: number
        total: number
        tiempo_ms: number
        guardado: boolean
    } | null>(null)
    const tickRef = useRef<number | null>(null)

    const cargarRanking = useCallback(async (segId: string) => {
        const { data } = await supabase.rpc("get_ranking_segmento", {
            p_seg: segId,
            p_limit: 5,
        })
        setRankings((prev) => ({
            ...prev,
            [segId]: Array.isArray(data) ? (data as RankRow[]) : [],
        }))
    }, [])

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUserId(data.session?.user?.id ?? null)
        })
        supabase
            .from("segmentos")
            .select("*")
            .eq("activo", true)
            .order("orden")
            .then(({ data }) => {
                const segs = (data as Segmento[]) || []
                setSegmentos(segs)
                setLoading(false)
                segs.forEach((s) => cargarRanking(s.id))
            })
    }, [cargarRanking])

    // Cronómetro
    useEffect(() => {
        if (jugando && !resultado) {
            tickRef.current = window.setInterval(
                () => setTranscurrido(Date.now() - inicio),
                100
            )
            return () => {
                if (tickRef.current) window.clearInterval(tickRef.current)
            }
        }
    }, [jugando, resultado, inicio])

    async function empezar(seg: Segmento) {
        const { data } = await supabase.rpc("get_test_preguntas", {
            p_test_id: seg.test_id,
            p_limite: seg.n_preguntas,
        })
        const rows = (Array.isArray(data) ? data : []) as any[]
        if (rows.length === 0) return
        const parsed: Pregunta[] = rows.map((r) => {
            const raw: string[] = Array.isArray(r.opciones)
                ? r.opciones
                : JSON.parse(r.opciones)
            const m = shuffleOpciones(raw, r.correcta)
            return {
                id: r.id,
                enunciado: r.enunciado,
                opciones: m.opciones,
                correcta: m.correcta,
            }
        })
        setPreguntas(parsed)
        setIdx(0)
        setAciertos(0)
        setResultado(null)
        setInicio(Date.now())
        setTranscurrido(0)
        setJugando(seg)
    }

    async function responder(opcion: number) {
        const pregunta = preguntas[idx]
        const acierto = opcion === pregunta.correcta
        const nuevosAciertos = aciertos + (acierto ? 1 : 0)
        setAciertos(nuevosAciertos)
        if (idx + 1 < preguntas.length) {
            setIdx(idx + 1)
        } else {
            // fin del sprint
            const tiempo = Date.now() - inicio
            if (tickRef.current) window.clearInterval(tickRef.current)
            let guardado = false
            if (userId && jugando) {
                const { error } = await supabase
                    .from("segmento_intentos")
                    .insert({
                        segmento_id: jugando.id,
                        user_id: userId,
                        correctas: nuevosAciertos,
                        total: preguntas.length,
                        tiempo_ms: tiempo,
                    } as any)
                guardado = !error
                if (guardado) cargarRanking(jugando.id)
            }
            setResultado({
                correctas: nuevosAciertos,
                total: preguntas.length,
                tiempo_ms: tiempo,
                guardado,
            })
        }
    }

    function salir() {
        if (tickRef.current) window.clearInterval(tickRef.current)
        setJugando(null)
        setPreguntas([])
        setResultado(null)
    }

    const card: React.CSSProperties = {
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: "16px",
        padding: "22px",
    }

    // ── Pantalla de sprint (jugando) ──────────────────────────────────────────
    if (jugando && !resultado) {
        const p = preguntas[idx]
        return (
            <div style={{ minHeight: "100svh", background: t.bg, color: t.textMain, fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>
                <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 20px 60px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <button onClick={salir} style={{ background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>← Salir</button>
                        <div style={{ fontVariantNumeric: "tabular-nums", fontWeight: 800, color: ACCENT, fontSize: "16px" }}>⏱ {fmtTiempo(transcurrido)}</div>
                    </div>
                    <div style={{ fontSize: "13px", color: t.textMuted, fontWeight: 600, marginBottom: "8px" }}>{jugando.nombre} · pregunta {idx + 1}/{preguntas.length}</div>
                    <div style={{ height: "6px", background: t.glass, borderRadius: "99px", overflow: "hidden", marginBottom: "24px" }}>
                        <div style={{ width: `${((idx) / preguntas.length) * 100}%`, height: "100%", background: ACCENT, transition: "width .3s" }} />
                    </div>
                    <div style={{ ...card, marginBottom: "18px" }}>
                        <div style={{ fontSize: "17px", fontWeight: 700, lineHeight: 1.4 }}>{p.enunciado}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {p.opciones.map((op, i) => (
                            <button key={i} onClick={() => responder(i)}
                                style={{ textAlign: "left", background: t.surface, border: `1.5px solid ${t.border}`, borderRadius: "12px", padding: "16px 18px", color: t.textMain, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", transition: "border-color .15s" }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}>
                                <span style={{ fontWeight: 800, color: ACCENT, marginRight: "10px" }}>{String.fromCharCode(65 + i)}</span>{op}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // ── Pantalla de resultado ─────────────────────────────────────────────────
    if (jugando && resultado) {
        const perfecto = resultado.correctas === resultado.total
        return (
            <div style={{ minHeight: "100svh", background: t.bg, color: t.textMain, fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>
                <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 20px 60px", textAlign: "center" }}>
                    <div style={{ fontSize: "48px", marginBottom: "8px" }}>{perfecto ? "🏆" : resultado.correctas >= resultado.total * 0.7 ? "💪" : "📚"}</div>
                    <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 4px" }}>{jugando.nombre}</h2>
                    <div style={{ fontSize: "40px", fontWeight: 800, color: ACCENT, letterSpacing: "-1px", margin: "16px 0 4px" }}>
                        {resultado.correctas}/{resultado.total}
                    </div>
                    <div style={{ fontSize: "16px", color: t.textMuted, fontWeight: 600, marginBottom: "24px" }}>en {fmtTiempo(resultado.tiempo_ms)}</div>
                    {!userId && (
                        <div style={{ ...card, marginBottom: "16px", fontSize: "14px", color: t.textMuted }}>
                            <a href="/login" style={{ color: ACCENT, fontWeight: 700 }}>Inicia sesión</a> para guardar tu marca y aparecer en el ranking.
                        </div>
                    )}
                    {userId && resultado.guardado && (
                        <div style={{ fontSize: "14px", color: ACCENT, fontWeight: 700, marginBottom: "20px" }}>✓ Marca guardada en el ranking semanal</div>
                    )}
                    {/* Ranking tras jugar */}
                    <Ranking rows={rankings[jugando.id] || []} t={t} />
                    <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "center" }}>
                        <button onClick={() => empezar(jugando)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: "12px", padding: "14px 22px", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>Reintentar</button>
                        <button onClick={salir} style={{ background: t.surface, color: t.textMain, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 22px", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>Ver segmentos</button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Listado de segmentos ──────────────────────────────────────────────────
    return (
        <div style={{ minHeight: "100svh", background: t.bg, color: t.textMain, fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>
            <LightNavbar />
            <div style={{ maxWidth: "820px", margin: "0 auto", padding: "40px 20px 60px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Segmentos</h1>
                <p style={{ fontSize: "15px", color: t.textMuted, margin: "0 0 28px", maxWidth: "560px" }}>
                    Sprints de 10 preguntas contrarreloj. Compite en el ranking semanal por aciertos y velocidad. El ranking se reinicia cada lunes.
                </p>
                {loading ? (
                    <div style={{ color: t.textMuted }}>Cargando segmentos…</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {segmentos.map((seg) => {
                            const rows = rankings[seg.id] || []
                            const lider = rows[0]
                            return (
                                <div key={seg.id} style={card}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", flexWrap: "wrap" }}>
                                        <div style={{ flex: "1 1 260px" }}>
                                            <div style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.3px" }}>{seg.nombre}</div>
                                            <div style={{ fontSize: "13px", color: t.textMuted, marginTop: "2px" }}>{seg.descripcion}</div>
                                            {lider ? (
                                                <div style={{ fontSize: "13px", color: t.textMuted, marginTop: "10px" }}>
                                                    👑 Líder semanal: <strong style={{ color: t.textMain }}>{lider.nombre}</strong> · {lider.correctas}/{lider.total} en {fmtTiempo(lider.tiempo_ms)}
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: "13px", color: t.textMuted, marginTop: "10px" }}>Aún sin marcas esta semana. ¡Sé el primero!</div>
                                            )}
                                        </div>
                                        <button onClick={() => empezar(seg)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: "12px", padding: "12px 22px", fontWeight: 700, cursor: "pointer", fontSize: "15px", whiteSpace: "nowrap" }}>
                                            Jugar →
                                        </button>
                                    </div>
                                    {rows.length > 0 && (
                                        <div style={{ marginTop: "16px", borderTop: `1px solid ${t.border}`, paddingTop: "14px" }}>
                                            <Ranking rows={rows} t={t} compact />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <SiteFooter />
        </div>
    )
}

function Ranking({
    rows,
    t,
    compact,
}: {
    rows: RankRow[]
    t: any
    compact?: boolean
}) {
    if (rows.length === 0)
        return (
            <div style={{ fontSize: "13px", color: t.textMuted, textAlign: compact ? "left" : "center" }}>
                Sin marcas todavía esta semana.
            </div>
        )
    const medalla = (pos: number) =>
        pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : `${pos}.`
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {rows.map((r) => (
                <div key={r.pos} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "6px 10px", borderRadius: "8px", background: r.es_yo ? "rgba(16,185,129,0.12)" : "transparent", fontSize: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <span style={{ width: "24px", textAlign: "center", fontWeight: 700, color: t.textMuted }}>{medalla(r.pos)}</span>
                        <span style={{ fontWeight: r.es_yo ? 800 : 600, color: t.textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.nombre}{r.es_yo ? " (tú)" : ""}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", whiteSpace: "nowrap", color: t.textMuted, fontVariantNumeric: "tabular-nums" }}>
                        <span style={{ fontWeight: 700, color: ACCENT }}>{r.correctas}/{r.total}</span>
                        <span>{fmtTiempo(r.tiempo_ms)}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
