"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import LightNavbar from "@/components/site/LightNavbar"
import SiteFooter from "@/components/site/SiteFooter"
import { useTheme } from "@/lib/use-theme"
import { createClient } from "@/lib/supabase/client"
import { corrigeCaso, corrigePregunta, type CasoEscrito, type CasoResultado, type PreguntaResultado } from "@/lib/casos-escritos/corrector"

const ACCENT = "#10B981"
const ROJO = "#EF4444"
const AMBAR = "#F59E0B"

// Impugnar una corrección concreta (la beta puede fallar). Reusa la edge function
// `impugnar-pregunta`, la misma de los tests: el aviso le llega al admin por email.
function ImpugnarCorreccion({ casoId, preguntaId, enunciado, comentario, respuesta, puntos, max, dark }: {
    casoId: string; preguntaId: string; enunciado: string; comentario?: string; respuesta: string; puntos: number; max: number; dark: boolean
}) {
    const [open, setOpen] = React.useState(false)
    const [msg, setMsg] = React.useState("")
    const [estado, setEstado] = React.useState<"idle" | "enviando" | "ok" | "error">("idle")

    const border = dark ? "rgba(255,255,255,0.08)" : "#E4E4E7"
    const textMain = dark ? "#FFFFFF" : "#09090B"
    const textMuted = dark ? "#8B8D98" : "#71717A"
    const inputBg = dark ? "rgba(255,255,255,0.04)" : "#FAFAFA"

    async function enviar() {
        setEstado("enviando")
        try {
            const supabase = createClient()
            let email = ""
            try { const { data: u } = await supabase.auth.getUser(); email = u.user?.email || "" } catch { /* invitado */ }
            const { data, error } = await supabase.functions.invoke("impugnar-pregunta", {
                body: {
                    test_id: casoId,
                    pregunta_id: preguntaId,
                    enunciado,
                    opciones: [],
                    correcta: -1,
                    explicacion: comentario || "",
                    motivo: `[Examen escrito · corrección impugnada] Nota dada: ${puntos}/${max}. Respuesta del alumno: «${(respuesta || "").trim() || "(sin responder)"}». Detalle: ${msg.trim() || "(sin detalle)"}`,
                    url: typeof window !== "undefined" ? window.location.href : "",
                    email,
                },
            })
            setEstado(!error && (data as { ok?: boolean })?.ok ? "ok" : "error")
        } catch { setEstado("error") }
    }

    if (estado === "ok") {
        return <div style={{ marginTop: "10px", fontSize: "12px", fontWeight: 700, color: ACCENT }}>✓ Gracias, revisaremos esta corrección.</div>
    }
    if (!open) {
        return (
            <button onClick={() => setOpen(true)} style={{ marginTop: "10px", background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "12px", fontWeight: 700, color: textMuted, textDecoration: "underline" }}>
                ¿Mal corregida? Impugnar
            </button>
        )
    }
    return (
        <div style={{ marginTop: "10px", borderTop: `1px solid ${border}`, paddingTop: "10px" }}>
            <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={2}
                placeholder="¿Qué ha corregido mal? (opcional)"
                style={{ width: "100%", resize: "vertical", padding: "8px 10px", borderRadius: "8px", border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: "12.5px", fontFamily: "inherit", boxSizing: "border-box" }}
            />
            {estado === "error" && <div style={{ fontSize: "12px", color: ROJO, marginTop: "6px" }}>No se pudo enviar. Inténtalo de nuevo.</div>}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button onClick={enviar} disabled={estado === "enviando"} style={{ padding: "8px 14px", borderRadius: "8px", background: ACCENT, color: "#04251b", fontSize: "12.5px", fontWeight: 800, border: "none", cursor: "pointer", opacity: estado === "enviando" ? 0.6 : 1 }}>
                    {estado === "enviando" ? "Enviando…" : "Enviar impugnación"}
                </button>
                <button onClick={() => setOpen(false)} style={{ padding: "8px 14px", borderRadius: "8px", background: "transparent", color: textMuted, fontSize: "12.5px", fontWeight: 700, border: `1px solid ${border}`, cursor: "pointer" }}>
                    Cancelar
                </button>
            </div>
        </div>
    )
}

// Layout a nivel de módulo (si va dentro del componente, cada tecla remonta y las
// cajas pierden el foco).
function PageShell({ dark, children }: { dark: boolean; children: React.ReactNode }) {
    const bg = dark ? "#0B0C10" : "#FFFFFF"
    const textMain = dark ? "#FFFFFF" : "#09090B"
    return (
        <div style={{ width: "100%", minHeight: "100vh", backgroundColor: bg, color: textMain, fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>
            <LightNavbar />
            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 20px 80px" }}>{children}</div>
            <SiteFooter />
        </div>
    )
}

export default function ExamenEscritoClient({ caso }: { caso: CasoEscrito }) {
    const { dark } = useTheme()
    const searchParams = useSearchParams()
    const beta = searchParams.get("beta") === "1"

    const [modo, setModo] = React.useState<"examen" | "test">("examen")
    const [respuestas, setRespuestas] = React.useState<Record<string, string>>({})
    const [resultado, setResultado] = React.useState<CasoResultado | null>(null)
    const [paso, setPaso] = React.useState(0) // pregunta actual en modo test
    const [revisada, setRevisada] = React.useState<Record<string, PreguntaResultado>>({}) // feedback por pregunta (modo test)
    const resultRef = React.useRef<HTMLDivElement>(null)

    const surface = dark ? "rgba(25,26,35,0.7)" : "#FFFFFF"
    const border = dark ? "rgba(255,255,255,0.08)" : "#E4E4E7"
    const textMain = dark ? "#FFFFFF" : "#09090B"
    const textMuted = dark ? "#8B8D98" : "#71717A"
    const inputBg = dark ? "rgba(255,255,255,0.04)" : "#FAFAFA"

    // Lista plana de preguntas (para el modo test, una a una)
    const flat = React.useMemo(
        () =>
            caso.ejercicios.flatMap((ej, ei) =>
                ej.preguntas.map((preg) => ({ ei, ej, preg, key: `e${ei}p${preg.n}` }))
            ),
        [caso]
    )

    function scrollResult() {
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60)
    }

    function corregir() {
        setResultado(corrigeCaso(respuestas, caso))
        scrollResult()
    }

    function reiniciar() {
        setRespuestas({})
        setResultado(null)
        setPaso(0)
        setRevisada({})
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function cambiarModo(m: "examen" | "test") {
        setModo(m)
        setResultado(null)
        setPaso(0)
        setRevisada({})
    }

    // Veredicto de una pregunta (texto + color) según puntos obtenidos
    function veredictoDe(pr: PreguntaResultado): { texto: string; color: string } {
        if (pr.vacia) return { texto: "Sin responder.", color: textMuted }
        if (pr.puntos === pr.max) return { texto: "Correcto.", color: ACCENT }
        if (pr.puntos === 0) return { texto: "No es correcto.", color: ROJO }
        return { texto: "Incompleto.", color: AMBAR }
    }

    if (!beta) {
        return (
            <PageShell dark={dark}>
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: ACCENT, marginBottom: "14px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M7 10V8a5 5 0 0 1 10 0v2M5 10h14v10H5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Exámenes escritos · Beta
                    </div>
                    <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 10px" }}>Muy pronto</h1>
                    <p style={{ fontSize: "14px", color: textMuted, lineHeight: 1.6, maxWidth: "420px", margin: "0 auto" }}>
                        Estamos preparando los <strong>casos prácticos escritos con corrección</strong>: escribes tu respuesta y te la puntuamos al momento. Estará disponible en breve.
                    </p>
                    <Link href="/perfil?tab=examenes" style={{ display: "inline-block", marginTop: "22px", padding: "12px 22px", borderRadius: "10px", background: ACCENT, color: "#04251b", fontSize: "14px", fontWeight: 800, textDecoration: "none" }}>
                        Volver a mis exámenes
                    </Link>
                </div>
            </PageShell>
        )
    }

    const hayResultado = !!resultado
    const notaColor = resultado ? (resultado.nota10 >= 5 ? ACCENT : ROJO) : textMain

    const tabBtn = (m: "examen" | "test"): React.CSSProperties => ({
        flex: 1,
        padding: "9px 12px",
        borderRadius: "9px",
        border: "none",
        cursor: "pointer",
        fontSize: "13.5px",
        fontWeight: 800,
        background: modo === m ? ACCENT : "transparent",
        color: modo === m ? "#04251b" : textMuted,
    })

    const textareaStyle: React.CSSProperties = {
        width: "100%",
        resize: "vertical",
        padding: "10px 12px",
        borderRadius: "10px",
        border: `1px solid ${border}`,
        background: inputBg,
        color: textMain,
        fontSize: "14px",
        fontFamily: "inherit",
        lineHeight: 1.5,
        boxSizing: "border-box",
    }

    return (
        <PageShell dark={dark}>
            <div style={{ marginBottom: "18px" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: ACCENT, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Examen escrito · Beta
                </div>
                <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.2, margin: "0 0 6px" }}>{caso.titulo}</h1>
                <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>
                    {modo === "examen"
                        ? "Todo el examen a la vista. Responde con tus palabras y corrige al final."
                        : "Una pregunta cada vez, como un test. Escribe tu respuesta y avanza."}
                </p>
            </div>

            {/* Selector de modo */}
            {!hayResultado && (
                <div style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "12px", background: inputBg, border: `1px solid ${border}`, marginBottom: "22px" }}>
                    <button onClick={() => cambiarModo("examen")} style={tabBtn("examen")}>Modo examen</button>
                    <button onClick={() => cambiarModo("test")} style={tabBtn("test")}>Modo test</button>
                </div>
            )}

            {/* ============ MODO EXAMEN · todo a la vista ============ */}
            {!hayResultado && modo === "examen" && (
                <>
                    {caso.ejercicios.map((ej, ei) => (
                        <div key={ei} style={{ marginBottom: "28px", border: `1px solid ${border}`, borderRadius: "16px", background: surface, overflow: "hidden" }}>
                            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${border}` }}>
                                <div style={{ fontSize: "15px", fontWeight: 800, marginBottom: "6px" }}>{ej.titulo}</div>
                                <p style={{ fontSize: "13px", color: textMuted, lineHeight: 1.6, margin: 0 }}>{ej.contexto}</p>
                            </div>
                            <div style={{ padding: "6px 18px 18px" }}>
                                {ej.preguntas.map((preg) => {
                                    const key = `e${ei}p${preg.n}`
                                    return (
                                        <div key={key} style={{ paddingTop: "16px" }}>
                                            <label style={{ display: "block", fontSize: "13.5px", fontWeight: 700, marginBottom: "8px" }}>
                                                {preg.n}. {preg.enunciado}
                                            </label>
                                            <textarea
                                                value={respuestas[key] ?? ""}
                                                onChange={(e) => setRespuestas((r) => ({ ...r, [key]: e.target.value }))}
                                                placeholder="Escribe tu respuesta…"
                                                rows={3}
                                                style={textareaStyle}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                    <button onClick={corregir} style={{ width: "100%", padding: "15px", borderRadius: "12px", background: ACCENT, color: "#04251b", fontSize: "16px", fontWeight: 800, border: "none", cursor: "pointer" }}>
                        Corregir mi examen
                    </button>
                </>
            )}

            {/* ============ MODO TEST · una pregunta cada vez, con nota inmediata ============ */}
            {!hayResultado && modo === "test" && flat.length > 0 && (() => {
                const item = flat[paso]
                const key = item.key
                const rev = revisada[key]
                const esUltima = paso === flat.length - 1
                const ver = rev ? veredictoDe(rev) : null
                const miResp = (respuestas[key] || "").trim()
                return (
                    <div>
                        {/* Progreso */}
                        <div style={{ marginBottom: "18px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                <span style={{ fontSize: "12px", color: textMuted }}>{paso + 1} / {flat.length}</span>
                                <span style={{ fontSize: "12px", color: ACCENT, fontWeight: 700 }}>{Math.round(((paso + 1) / flat.length) * 100)}%</span>
                            </div>
                            <div style={{ height: "3px", background: border, borderRadius: "100px", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${((paso + 1) / flat.length) * 100}%`, background: ACCENT, borderRadius: "100px", transition: "width 0.35s ease" }} />
                            </div>
                        </div>

                        {/* Supuesto · justo encima de la pregunta para no perder el contexto */}
                        <div style={{ border: `1px solid ${border}`, borderRadius: "14px", background: inputBg, padding: "14px 16px", marginBottom: "14px" }}>
                            <div style={{ fontSize: "11px", fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "6px" }}>Supuesto · {item.ej.titulo}</div>
                            <p style={{ fontSize: "12.5px", color: textMuted, lineHeight: 1.6, margin: 0 }}>{item.ej.contexto}</p>
                        </div>

                        {/* Pregunta actual */}
                        <div key={key} style={{ border: `1px solid ${border}`, borderRadius: "18px", background: surface, padding: "22px", marginBottom: "14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline", marginBottom: "14px" }}>
                                <label style={{ display: "block", fontSize: "16px", fontWeight: 700, lineHeight: 1.5 }}>
                                    {item.preg.n}. {item.preg.enunciado}
                                </label>
                                {rev && <span style={{ fontSize: "13px", fontWeight: 800, color: ver!.color, whiteSpace: "nowrap" }}>{rev.puntos} / {rev.max}</span>}
                            </div>
                            <textarea
                                value={respuestas[key] ?? ""}
                                onChange={(e) => setRespuestas((r) => ({ ...r, [key]: e.target.value }))}
                                placeholder="Escribe tu respuesta…"
                                rows={5}
                                disabled={!!rev}
                                style={{ ...textareaStyle, opacity: rev ? 0.75 : 1, cursor: rev ? "default" : "text" }}
                            />

                            {/* Feedback inmediato de esta pregunta */}
                            {rev && (
                                <div style={{ marginTop: "14px", borderTop: `1px solid ${border}`, paddingTop: "14px", fontSize: "13px", color: textMuted, lineHeight: 1.55 }}>
                                    <span style={{ fontWeight: 800, color: ver!.color }}>{ver!.texto} </span>{rev.comentario}
                                    <ImpugnarCorreccion casoId={caso.id} preguntaId={`${caso.id}-${key}`} enunciado={item.preg.enunciado} comentario={rev.comentario} respuesta={respuestas[key] ?? ""} puntos={rev.puntos} max={rev.max} dark={dark} />
                                </div>
                            )}
                        </div>

                        {/* Navegación */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            {paso > 0 && (
                                <button onClick={() => { setPaso((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }) }} style={{ flex: "0 0 auto", padding: "14px 20px", borderRadius: "12px", background: "transparent", color: textMain, fontSize: "15px", fontWeight: 700, border: `1px solid ${border}`, cursor: "pointer" }}>
                                    ← Anterior
                                </button>
                            )}
                            {!rev ? (
                                <button
                                    onClick={() => setRevisada((v) => ({ ...v, [key]: corrigePregunta(miResp, item.preg) }))}
                                    style={{ flex: 1, padding: "15px", borderRadius: "12px", background: ACCENT, color: "#04251b", fontSize: "16px", fontWeight: 800, border: "none", cursor: "pointer" }}
                                >
                                    Comprobar
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (esUltima) { corregir(); return }
                                        setPaso((p) => p + 1)
                                        window.scrollTo({ top: 0, behavior: "smooth" })
                                    }}
                                    style={{ flex: 1, padding: "15px", borderRadius: "12px", background: ACCENT, color: "#04251b", fontSize: "16px", fontWeight: 800, border: "none", cursor: "pointer" }}
                                >
                                    {esUltima ? "Ver mi nota final →" : "Siguiente →"}
                                </button>
                            )}
                        </div>
                    </div>
                )
            })()}

            {/* ============ RESULTADO (común a ambos modos) ============ */}
            {hayResultado && resultado && (
                <div ref={resultRef} style={{ marginTop: "8px" }}>
                    <div style={{ border: `1px solid ${border}`, borderRadius: "16px", background: surface, padding: "22px", textAlign: "center", marginBottom: "20px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Tu nota (orientativa)</div>
                        <div style={{ fontSize: "52px", fontWeight: 900, color: notaColor, letterSpacing: "-2px", lineHeight: 1.1 }}>{resultado.nota10.toFixed(1)}<span style={{ fontSize: "22px", color: textMuted }}> / 10</span></div>
                        <div style={{ fontSize: "13px", color: textMuted }}>{resultado.total} de {resultado.max} puntos</div>
                    </div>

                    {resultado.ejercicios.map((ej, ei) => (
                        <div key={ei} style={{ marginBottom: "18px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                                <span style={{ fontSize: "14px", fontWeight: 800 }}>{ej.titulo}</span>
                                <span style={{ fontSize: "13px", fontWeight: 700, color: ACCENT }}>{ej.puntos} / {ej.max}</span>
                            </div>
                            {ej.preguntas.map((pr) => {
                                const miResp = (respuestas[`e${ei}p${pr.n}`] || "").trim()
                                const veredicto = pr.vacia ? "Sin responder." : pr.puntos === pr.max ? "Correcto." : pr.puntos === 0 ? "No es correcto." : "Incompleto."
                                const vColor = pr.puntos === pr.max ? ACCENT : pr.puntos === 0 ? ROJO : AMBAR
                                return (
                                    <div key={pr.n} style={{ border: `1px solid ${border}`, borderRadius: "12px", background: surface, padding: "14px 16px", marginBottom: "10px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "13.5px", fontWeight: 700 }}>{pr.n}. {pr.enunciado}</span>
                                            <span style={{ fontSize: "13px", fontWeight: 800, color: vColor, whiteSpace: "nowrap" }}>{pr.puntos} / {pr.max}</span>
                                        </div>
                                        <div style={{ fontSize: "12.5px", color: textMuted, marginBottom: "10px", lineHeight: 1.5 }}>
                                            <span style={{ fontWeight: 700, color: textMain }}>Tu respuesta: </span>
                                            {miResp ? <span style={{ fontStyle: "italic" }}>«{miResp}»</span> : <span style={{ fontStyle: "italic", opacity: 0.7 }}>(sin responder)</span>}
                                        </div>
                                        <div style={{ fontSize: "12.5px", color: textMuted, lineHeight: 1.55 }}>
                                            <span style={{ fontWeight: 800, color: vColor }}>{veredicto} </span>{pr.comentario}
                                        </div>
                                        <ImpugnarCorreccion casoId={caso.id} preguntaId={`${caso.id}-e${ei}p${pr.n}`} enunciado={pr.enunciado} comentario={pr.comentario} respuesta={miResp} puntos={pr.puntos} max={pr.max} dark={dark} />
                                    </div>
                                )
                            })}
                        </div>
                    ))}

                    <button onClick={reiniciar} style={{ width: "100%", padding: "13px", borderRadius: "12px", background: "transparent", color: textMain, fontSize: "14px", fontWeight: 700, border: `1px solid ${border}`, cursor: "pointer" }}>
                        Intentar de nuevo
                    </button>
                </div>
            )}
        </PageShell>
    )
}
