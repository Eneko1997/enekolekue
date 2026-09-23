"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import LightNavbar from "@/components/site/LightNavbar"
import SiteFooter from "@/components/site/SiteFooter"
import { useTheme } from "@/lib/use-theme"
import { corrigeCaso, maxPuntos, type CasoEscrito, type CasoResultado } from "@/lib/casos-escritos/corrector"

const ACCENT = "#10B981"
const ROJO = "#EF4444"
const AMBAR = "#F59E0B"

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

type TestPreg = { n: string; enunciado: string; puntos: number; max: number; sel: number | null; correctaIdx: number; opciones: { t: string; ok?: boolean }[]; comentario?: string; vacia: boolean }
type TestResultado = { total: number; max: number; nota10: number; ejercicios: { titulo: string; puntos: number; max: number; preguntas: TestPreg[] }[] }

export default function ExamenEscritoClient({ caso }: { caso: CasoEscrito }) {
    const { dark } = useTheme()
    const searchParams = useSearchParams()
    const beta = searchParams.get("beta") === "1"

    const [modo, setModo] = React.useState<"examen" | "test">("examen")
    const [respuestas, setRespuestas] = React.useState<Record<string, string>>({})
    const [seleccion, setSeleccion] = React.useState<Record<string, number>>({})
    const [resultado, setResultado] = React.useState<CasoResultado | null>(null)
    const [testResult, setTestResult] = React.useState<TestResultado | null>(null)
    const resultRef = React.useRef<HTMLDivElement>(null)

    const surface = dark ? "rgba(25,26,35,0.7)" : "#FFFFFF"
    const border = dark ? "rgba(255,255,255,0.08)" : "#E4E4E7"
    const textMain = dark ? "#FFFFFF" : "#09090B"
    const textMuted = dark ? "#8B8D98" : "#71717A"
    const inputBg = dark ? "rgba(255,255,255,0.04)" : "#FAFAFA"

    function scrollResult() {
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60)
    }

    function corregirExamen() {
        setResultado(corrigeCaso(respuestas, caso))
        scrollResult()
    }

    function corregirTest() {
        let total = 0
        let max = 0
        const ejercicios = caso.ejercicios.map((ej, ei) => {
            let ep = 0
            let em = 0
            const preguntas: TestPreg[] = ej.preguntas.map((pr) => {
                const m = maxPuntos(pr)
                const key = `e${ei}p${pr.n}`
                const opciones = pr.opciones ?? []
                const correctaIdx = opciones.findIndex((o) => o.ok)
                const sel = key in seleccion ? seleccion[key] : null
                const pts = sel !== null && sel === correctaIdx ? m : 0
                ep += pts
                em += m
                return { n: pr.n, enunciado: pr.enunciado, puntos: pts, max: m, sel, correctaIdx, opciones, comentario: pr.comentario, vacia: sel === null }
            })
            total += ep
            max += em
            return { titulo: ej.titulo, puntos: ep, max: em, preguntas }
        })
        setTestResult({ total, max, nota10: max > 0 ? Math.round((total / max) * 100) / 10 : 0, ejercicios })
        scrollResult()
    }

    function reiniciar() {
        setRespuestas({})
        setSeleccion({})
        setResultado(null)
        setTestResult(null)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function cambiarModo(m: "examen" | "test") {
        setModo(m)
        setResultado(null)
        setTestResult(null)
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

    const hayResultado = modo === "examen" ? !!resultado : !!testResult
    const notaActual = modo === "examen" ? resultado : testResult
    const notaColor = notaActual ? (notaActual.nota10 >= 5 ? ACCENT : ROJO) : textMain

    const tabBtn = (m: "examen" | "test", label: string): React.CSSProperties => ({
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

    return (
        <PageShell dark={dark}>
            <div style={{ marginBottom: "18px" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: ACCENT, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Examen escrito · Beta
                </div>
                <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.2, margin: "0 0 6px" }}>{caso.titulo}</h1>
                <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>
                    {modo === "examen"
                        ? "Responde con tus palabras. La nota es orientativa: comprueba que aparecen los puntos que se valoran."
                        : "Elige la opción correcta en cada apartado."}
                </p>
            </div>

            {/* Selector de modo */}
            <div style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "12px", background: inputBg, border: `1px solid ${border}`, marginBottom: "22px" }}>
                <button onClick={() => cambiarModo("examen")} style={tabBtn("examen", "Modo examen")}>Modo examen</button>
                <button onClick={() => cambiarModo("test")} style={tabBtn("test", "Modo test")}>Modo test</button>
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
                                    {modo === "examen" ? (
                                        <textarea
                                            value={respuestas[key] ?? ""}
                                            onChange={(e) => setRespuestas((r) => ({ ...r, [key]: e.target.value }))}
                                            placeholder="Escribe tu respuesta…"
                                            rows={3}
                                            style={{ width: "100%", resize: "vertical", padding: "10px 12px", borderRadius: "10px", border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: "14px", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }}
                                        />
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                            {(preg.opciones ?? []).map((op, oi) => {
                                                const elegido = seleccion[key] === oi
                                                return (
                                                    <button
                                                        key={oi}
                                                        onClick={() => setSeleccion((s) => ({ ...s, [key]: oi }))}
                                                        style={{ textAlign: "left", padding: "11px 13px", borderRadius: "10px", cursor: "pointer", fontSize: "13.5px", lineHeight: 1.4, color: textMain, background: elegido ? `${ACCENT}18` : inputBg, border: `1.5px solid ${elegido ? ACCENT : border}` }}
                                                    >
                                                        {op.t}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {/* Botón corregir */}
            {!hayResultado && (
                <button onClick={modo === "examen" ? corregirExamen : corregirTest} style={{ width: "100%", padding: "15px", borderRadius: "12px", background: ACCENT, color: "#04251b", fontSize: "16px", fontWeight: 800, border: "none", cursor: "pointer" }}>
                    Corregir mi respuesta
                </button>
            )}

            {/* Resultado */}
            {hayResultado && notaActual && (
                <div ref={resultRef} style={{ marginTop: "8px" }}>
                    <div style={{ border: `1px solid ${border}`, borderRadius: "16px", background: surface, padding: "22px", textAlign: "center", marginBottom: "20px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Tu nota (orientativa)</div>
                        <div style={{ fontSize: "52px", fontWeight: 900, color: notaColor, letterSpacing: "-2px", lineHeight: 1.1 }}>{notaActual.nota10.toFixed(1)}<span style={{ fontSize: "22px", color: textMuted }}> / 10</span></div>
                        <div style={{ fontSize: "13px", color: textMuted }}>{notaActual.total} de {notaActual.max} puntos</div>
                    </div>

                    {/* Modo examen */}
                    {modo === "examen" && resultado && resultado.ejercicios.map((ej, ei) => (
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
                                    </div>
                                )
                            })}
                        </div>
                    ))}

                    {/* Modo test */}
                    {modo === "test" && testResult && testResult.ejercicios.map((ej, ei) => (
                        <div key={ei} style={{ marginBottom: "18px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                                <span style={{ fontSize: "14px", fontWeight: 800 }}>{ej.titulo}</span>
                                <span style={{ fontSize: "13px", fontWeight: 700, color: ACCENT }}>{ej.puntos} / {ej.max}</span>
                            </div>
                            {ej.preguntas.map((pr) => {
                                const veredicto = pr.vacia ? "Sin responder." : pr.puntos === pr.max ? "Correcto." : "No es correcto."
                                const vColor = pr.puntos === pr.max ? ACCENT : pr.vacia ? textMuted : ROJO
                                return (
                                    <div key={pr.n} style={{ border: `1px solid ${border}`, borderRadius: "12px", background: surface, padding: "14px 16px", marginBottom: "10px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "baseline", marginBottom: "10px" }}>
                                            <span style={{ fontSize: "13.5px", fontWeight: 700 }}>{pr.n}. {pr.enunciado}</span>
                                            <span style={{ fontSize: "13px", fontWeight: 800, color: vColor, whiteSpace: "nowrap" }}>{pr.puntos} / {pr.max}</span>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
                                            {pr.opciones.map((op, oi) => {
                                                const esCorrecta = oi === pr.correctaIdx
                                                const esElegidaMal = oi === pr.sel && !esCorrecta
                                                const col = esCorrecta ? ACCENT : esElegidaMal ? ROJO : border
                                                return (
                                                    <div key={oi} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "8px 10px", borderRadius: "8px", border: `1.5px solid ${col}`, background: esCorrecta ? `${ACCENT}12` : esElegidaMal ? `${ROJO}10` : "transparent" }}>
                                                        <span style={{ fontWeight: 800, color: esCorrecta ? ACCENT : esElegidaMal ? ROJO : textMuted }}>{esCorrecta ? "✓" : esElegidaMal ? "✗" : "·"}</span>
                                                        <span style={{ fontSize: "13px", color: textMain, lineHeight: 1.4 }}>{op.t}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        {pr.comentario && (
                                            <div style={{ fontSize: "12.5px", color: textMuted, lineHeight: 1.55 }}>
                                                <span style={{ fontWeight: 800, color: vColor }}>{veredicto} </span>{pr.comentario}
                                            </div>
                                        )}
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
