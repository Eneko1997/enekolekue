"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import LightNavbar from "@/components/site/LightNavbar"
import SiteFooter from "@/components/site/SiteFooter"
import { useTheme } from "@/lib/use-theme"
import { corrigeCaso, type CasoEscrito, type CasoResultado } from "@/lib/casos-escritos/corrector"

const ACCENT = "#10B981"

// Layout a nivel de módulo (NO dentro del componente): si se define dentro,
// cada cambio de estado lo remonta y las cajas de texto pierden el foco al teclear.
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

    const [respuestas, setRespuestas] = React.useState<Record<string, string>>({})
    const [resultado, setResultado] = React.useState<CasoResultado | null>(null)
    const resultRef = React.useRef<HTMLDivElement>(null)

    const surface = dark ? "rgba(25,26,35,0.7)" : "#FFFFFF"
    const border = dark ? "rgba(255,255,255,0.08)" : "#E4E4E7"
    const textMain = dark ? "#FFFFFF" : "#09090B"
    const textMuted = dark ? "#8B8D98" : "#71717A"
    const inputBg = dark ? "rgba(255,255,255,0.04)" : "#FAFAFA"

    function corregir() {
        setResultado(corrigeCaso(respuestas, caso))
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60)
    }

    function reiniciar() {
        setRespuestas({})
        setResultado(null)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Bloqueado para todos salvo acceso beta (?beta=1).
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

    const notaColor = resultado ? (resultado.nota10 >= 5 ? ACCENT : "#EF4444") : textMain

    return (
        <PageShell dark={dark}>
            {/* Cabecera */}
            <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: ACCENT, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Examen escrito · Beta
                </div>
                <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.2, margin: "0 0 6px" }}>{caso.titulo}</h1>
                <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>
                    Responde con tus palabras. La nota es orientativa: comprueba que aparecen los puntos, leyes y plazos que se valoran.
                </p>
            </div>

            {/* Ejercicios */}
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
                                        style={{ width: "100%", resize: "vertical", padding: "10px 12px", borderRadius: "10px", border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: "14px", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {/* Botón corregir */}
            {!resultado && (
                <button onClick={corregir} style={{ width: "100%", padding: "15px", borderRadius: "12px", background: ACCENT, color: "#04251b", fontSize: "16px", fontWeight: 800, border: "none", cursor: "pointer" }}>
                    Corregir mi respuesta
                </button>
            )}

            {/* Resultado */}
            {resultado && (
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
                                return (
                                <div key={pr.n} style={{ border: `1px solid ${border}`, borderRadius: "12px", background: surface, padding: "14px 16px", marginBottom: "10px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "13.5px", fontWeight: 700 }}>{pr.n}. {pr.enunciado}</span>
                                        <span style={{ fontSize: "13px", fontWeight: 800, color: pr.puntos === pr.max ? ACCENT : pr.puntos === 0 ? "#EF4444" : textMuted, whiteSpace: "nowrap" }}>{pr.puntos} / {pr.max}</span>
                                    </div>
                                    <div style={{ fontSize: "12.5px", color: textMuted, marginBottom: "10px", lineHeight: 1.5 }}>
                                        <span style={{ fontWeight: 700, color: textMain }}>Tu respuesta: </span>
                                        {miResp ? <span style={{ fontStyle: "italic" }}>«{miResp}»</span> : <span style={{ fontStyle: "italic", opacity: 0.7 }}>(sin responder)</span>}
                                    </div>
                                    <div style={{ fontSize: "11px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "5px" }}>
                                        Qué se valora en este apartado
                                    </div>
                                    {pr.aciertos.map((a, i) => (
                                        <div key={"a" + i} style={{ fontSize: "12.5px", color: textMain, display: "flex", gap: "6px", padding: "1px 0" }}>
                                            <span style={{ color: ACCENT, fontWeight: 800 }}>✓</span> {a.label} <span style={{ color: textMuted }}>(+{a.puntos})</span>
                                        </div>
                                    ))}
                                    {pr.fallos.map((f, i) => (
                                        <div key={"f" + i} style={{ fontSize: "12.5px", color: textMuted, display: "flex", gap: "6px", padding: "1px 0" }}>
                                            <span style={{ color: "#EF4444", fontWeight: 800 }}>✗</span> Te faltó: {f.label}
                                        </div>
                                    ))}
                                    <div style={{ marginTop: "8px", padding: "8px 10px", borderRadius: "8px", background: `${ACCENT}12`, border: `1px solid ${ACCENT}30` }}>
                                        <span style={{ fontSize: "11px", fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.5px" }}>Respuesta modelo</span>
                                        <div style={{ fontSize: "12.5px", color: textMain, lineHeight: 1.5, marginTop: "3px" }}>{pr.modelo}</div>
                                        {pr.ley && <div style={{ fontSize: "11px", color: textMuted, marginTop: "4px" }}>Base: {pr.ley}</div>}
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                    ))}

                    {caso.leyesClave && caso.leyesClave.length > 0 && (
                        <div style={{ border: `1px dashed ${border}`, borderRadius: "12px", padding: "12px 16px", marginBottom: "18px" }}>
                            <div style={{ fontSize: "11px", fontWeight: 800, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Normativa clave del caso</div>
                            {caso.leyesClave.map((l, i) => (
                                <div key={i} style={{ fontSize: "12.5px", color: textMuted, padding: "1px 0" }}>· {l}</div>
                            ))}
                        </div>
                    )}

                    <button onClick={reiniciar} style={{ width: "100%", padding: "13px", borderRadius: "12px", background: "transparent", color: textMain, fontSize: "14px", fontWeight: 700, border: `1px solid ${border}`, cursor: "pointer" }}>
                        Intentar de nuevo
                    </button>
                </div>
            )}
        </PageShell>
    )
}
