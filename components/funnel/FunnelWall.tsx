"use client"

import { useEffect, useMemo, useState } from "react"
import type { CSSProperties, FormEvent } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { logFunnelEvent } from "@/lib/funnel"
import GoogleIcon from "@/components/auth/GoogleIcon"

const SIM_RESULT_KEY = "gainditu_sim_done"

type Preg = {
    enunciado: string
    opciones: string[]
    correcta: number
    explicacion?: string
    tema?: string | null
}

// Etiqueta bonita para cada `tema` de la BD (clasificación por materia).
const TEMA_LABEL: Record<string, string> = {
    "constitucion": "Constitución",
    "instituciones-vascas": "Institucional vasco y local",
    "ue": "Unión Europea",
    "ley-39-2015": "Procedimiento (Ley 39/2015)",
    "ley-40-2015": "Régimen jurídico (Ley 40/2015)",
    "empleo-publico": "Empleo público",
    "igualdad": "Igualdad",
    "transparencia-datos": "Transparencia y datos",
    "hacienda-contratacion": "Hacienda y contratación",
    "admin-electronica-ofimatica": "Admin. electrónica y ofimática",
    "atencion-archivo": "Atención y archivo",
    "prevencion-medioambiente": "Prevención y medio ambiente",
}

// ── Clasificador de área por palabras clave sobre el enunciado ────────────────
// El banco no está etiquetado por tema, así que agrupamos en 6 áreas por keywords.
const AREAS: { label: string; kw: string[] }[] = [
    {
        label: "Constitución y derechos",
        kw: ["constituci", "tribunal constitucional", "cortes", "congreso", "senado", "rey", "corona", "defensor del pueblo", "amparo", "derechos fundamentales", "soberan", "decreto-ley", "moción de censura", "investidura", "poder judicial", "tutela judicial", "ley orgánica", "refrend", "sucesión de la corona"],
    },
    {
        label: "Procedimiento administrativo",
        kw: ["ley 39/2015", "notificaci", "recurso", "alzada", "reposición", "plazo", "acto administrativo", "nulidad", "anulab", "silencio", "interesado", "audiencia", "informe", "instru", "revisión de oficio", "responsabilidad patrimonial", "obligación de resolver", "capacidad de obrar"],
    },
    {
        label: "Régimen jurídico y organización",
        kw: ["ley 40/2015", "sector público", "delegación", "avocación", "encomienda", "órganos colegiados", "abstención", "recusación", "convenios", "secretario", "principios de actuación", "potestad sancionadora", "infracciones", "sanciones", "consejo de estado", "tribunal de cuentas"],
    },
    {
        label: "Empleo público",
        kw: ["trebep", "empleado público", "funcionario", "personal eventual", "disciplinario", "excedencia", "servicios especiales", "permiso", "acceso al empleo", "provisión de puestos", "sistemas selectivos", "condición de funcionario", "faltas muy graves"],
    },
    {
        label: "Institucional vasco y UE",
        kw: ["estatuto de autonomía", "país vasco", "lehendakari", "parlamento vasco", "concierto económico", "territorio histórico", "juntas generales", "ararteko", "ivap", "perfil lingüístic", "comunidad autónoma", "unión europea", "directiva", "organiza territorialmente"],
    },
    {
        label: "Transparencia, datos e igualdad",
        kw: ["transparencia", "ley 19/2013", "información pública", "publicidad activa", "rgpd", "protección de datos", "lopdgdd", "supresión", "minimiz", "delegado de protección", "igualdad", "3/2007", "discrimina", "planes de igualdad", "acción positiva", "sede electrónica", "firma electrónica", "seguridad y salud", "prevención"],
    },
]

// Materia de la pregunta: usa la etiqueta REAL de la BD (`tema`); si no la tiene ('otros'/null),
// cae al clasificador por palabras clave como respaldo.
function materiaDe(p: Preg): string {
    if (p.tema && TEMA_LABEL[p.tema]) return TEMA_LABEL[p.tema]
    const s = (p.enunciado || "").toLowerCase()
    for (const a of AREAS) if (a.kw.some((k) => s.includes(k))) return a.label
    return "Otras materias"
}

// Puntúan las primeras 50 si el simulacro trae más de 50 (el resto es reserva); si trae 50 o
// menos (p. ej. el de Administrativo, 30), puntúan todas. Se calcula dentro del componente.

export default function FunnelWall({
    testId,
    preguntas,
    respuestas,
    accent,
    dark,
    onRepetir,
    onVolver,
    variant = "simulacro",
}: {
    testId: string
    preguntas: Preg[]
    respuestas: (number | null)[]
    accent: string
    dark: boolean
    onRepetir: () => void
    onVolver: () => void
    variant?: "simulacro" | "microtest"
}) {
    const esMicro = variant === "microtest"
    const wallTitle = esMicro ? "Tu micro-test está corregido" : "Tu examen está corregido"
    const upsellHeading = esMicro
        ? "Esto es solo el calentamiento"
        : "Tienes más simulacros de esta convocatoria en Gainditu"
    const upsellText = esMicro
        ? "Da el salto con el Método Gainditu: tests por tema, exámenes oficiales, casos prácticos y simulacros con penalización real, con un plan hasta tu examen."
        : "Simulacros completos, exámenes oficiales reales y seguimiento de tu progreso. Desbloquéalo todo."
    const repetirLabel = esMicro ? "Repetir micro-test" : "Repetir simulacro"
    const [captured, setCaptured] = useState(false)
    const [email, setEmail] = useState("")
    const [consent, setConsent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [verRepaso, setVerRepaso] = useState(false)

    const bg = dark ? "#0B0C10" : "#FFFFFF"
    const surface = dark ? "#141520" : "#FFFFFF"
    const border = dark ? "rgba(255,255,255,0.10)" : "#E4E4E7"
    const textMain = dark ? "#FFFFFF" : "#09090B"
    const textMuted = dark ? "#8B8D98" : "#71717A"
    const track = dark ? "rgba(255,255,255,0.08)" : "#EEEEF1"

    // Cuántas puntúan: 50 si hay reserva (>50 servidas), o todas si son 50 o menos.
    const N_PUNTUAN = preguntas.length > 50 ? 50 : preguntas.length
    const N_RESERVA = preguntas.length - N_PUNTUAN

    // ── Cálculo de nota SOLO sobre las que puntúan ────────────────────────────
    const stats = useMemo(() => {
        const cuenta = preguntas.slice(0, N_PUNTUAN)
        const resp = respuestas.slice(0, N_PUNTUAN)
        const total = cuenta.length || 1
        let aciertos = 0,
            fallos = 0,
            sin = 0
        cuenta.forEach((p, i) => {
            const r = resp[i]
            if (r === null || r === undefined) sin++
            else if (r === p.correcta) aciertos++
            else fallos++
        })
        const puntos = Math.max(0, aciertos - fallos * 0.33)
        const nota = Math.round((puntos / total) * 10 * 10) / 10 // sobre 10, 1 decimal
        const aprobado = nota >= 5

        // Desglose por áreas (solo las que puntúan)
        const areaMap = new Map<string, { ok: number; tot: number }>()
        cuenta.forEach((p, i) => {
            const a = materiaDe(p)
            const cur = areaMap.get(a) || { ok: 0, tot: 0 }
            cur.tot++
            if (resp[i] === p.correcta) cur.ok++
            areaMap.set(a, cur)
        })
        const areas = Array.from(areaMap.entries())
            .map(([label, v]) => ({
                label,
                pct: Math.round((v.ok / v.tot) * 100),
                ok: v.ok,
                tot: v.tot,
            }))
            .sort((a, b) => b.tot - a.tot)

        return { aciertos, fallos, sin, nota, aprobado, total, areas }
    }, [preguntas, respuestas, N_PUNTUAN])

    async function capturar(e: FormEvent) {
        e.preventDefault()
        setError("")
        const mail = email.trim().toLowerCase()
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
            setError("Introduce un email válido.")
            return
        }
        if (!consent) {
            setError("Debes aceptar el tratamiento de tus datos para ver la nota.")
            return
        }
        setLoading(true)
        const supabase = createClient()
        // 1) Guardar el lead. NO se envía ningún correo (ni Supabase Auth ni Resend):
        //    solo se almacena el email para poder contactarle a mano cuando toque.
        try {
            await supabase.from("leads_simulacro").insert({
                email: mail,
                test_id: testId,
                nota: stats.nota,
                marketing_consent: true,
            })
        } catch {
            /* si falla, la nota se muestra igual */
        }
        // 2) Registrar el consentimiento en el perfil si hay sesión (anónima).
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (user)
                await supabase
                    .from("profiles")
                    .update({
                        marketing_consent: true,
                        marketing_consent_at: new Date().toISOString(),
                    })
                    .eq("id", user.id)
        } catch {
            /* silencioso */
        }
        // 3) Medición.
        void logFunnelEvent("email_captured", {
            test_id: testId,
            email: mail,
            nota: stats.nota,
        })
        try {
            sessionStorage.setItem("gainditu_sim_captured", "1")
        } catch {}
        setLoading(false)
        setCaptured(true)
    }

    // Si vuelves con una cuenta REAL (p. ej. tras entrar con Google), se desbufa
    // solo. La sesión anónima del embudo NO cuenta (esa sí debe ver el muro).
    useEffect(() => {
        // Si ya capturaste en esta sesión (email o cuenta real), al volver a la
        // página se ve la nota directamente, sin volver a pedir el correo.
        try {
            if (sessionStorage.getItem("gainditu_sim_captured") === "1") {
                setCaptured(true)
                return
            }
        } catch {}
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user && user.is_anonymous === false) setCaptured(true)
        })
    }, [])

    async function entrarConGoogle() {
        // Google redirige fuera; guardamos el examen ya hecho para restaurarlo al volver.
        try {
            sessionStorage.setItem(
                SIM_RESULT_KEY,
                JSON.stringify({ testId, preguntas, respuestas })
            )
            localStorage.setItem(
                "gainditu_post_auth_next",
                JSON.stringify({ next: `/test?id=${testId}&funnel=1`, ts: Date.now() })
            )
        } catch {}
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(`/test?id=${testId}&funnel=1`)}`,
            },
        })
    }

    function irAPremium() {
        try {
            sessionStorage.setItem(
                "gainditu_post_pay_next",
                "/test?id=sim_adm_general_1"
            )
        } catch {}
        window.location.href = "/payment"
    }

    const notaColor = stats.aprobado ? "#22C55E" : "#EF4444"

    return (
        <div
            style={{
                maxWidth: 640,
                margin: "0 auto",
                padding: "40px 20px",
                position: "relative",
                color: textMain,
            }}
        >
            {/* ── Resumen (difuminado hasta capturar el email) ── */}
            <div
                style={{
                    filter: captured ? "none" : "blur(9px)",
                    pointerEvents: captured ? "auto" : "none",
                    userSelect: captured ? "auto" : "none",
                    transition: "filter 0.4s ease",
                }}
                aria-hidden={!captured}
            >
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ fontSize: 13, color: textMuted, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
                        Tu nota
                    </div>
                    <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.05, color: notaColor }}>
                        {stats.nota.toFixed(1).replace(".", ",")}
                    </div>
                    <div
                        style={{
                            display: "inline-block",
                            marginTop: 8,
                            padding: "6px 16px",
                            borderRadius: 999,
                            fontWeight: 800,
                            fontSize: 14,
                            color: "#fff",
                            background: notaColor,
                        }}
                    >
                        {stats.aprobado ? "APTO" : "NO APTO"}
                    </div>
                    <div style={{ marginTop: 14, fontSize: 13, color: textMuted }}>
                        {stats.aciertos} aciertos · {stats.fallos} fallos · {stats.sin} en blanco · sobre {stats.total} que puntúan{N_RESERVA > 0 ? ` (+${N_RESERVA} de reserva)` : ""}
                    </div>
                </div>

                {/* Barras por área */}
                <div
                    style={{
                        background: surface,
                        border: `1px solid ${border}`,
                        borderRadius: 16,
                        padding: 20,
                    }}
                >
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>
                        Desglose por áreas
                    </div>
                    {stats.areas.map((a) => (
                        <div key={a.label} style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                                <span style={{ color: textMain }}>{a.label}</span>
                                <span style={{ color: textMuted, fontWeight: 600 }}>
                                    {a.ok}/{a.tot} · {a.pct}%
                                </span>
                            </div>
                            <div style={{ height: 8, borderRadius: 6, background: track, overflow: "hidden" }}>
                                <div
                                    style={{
                                        height: "100%",
                                        width: `${a.pct}%`,
                                        borderRadius: 6,
                                        background: a.pct >= 50 ? accent : "#EF4444",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Contenido tras capturar: upsell + acciones ── */}
            {captured && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginTop: 24 }}
                >
                    <div
                        style={{
                            background: `linear-gradient(135deg, ${accent}22, ${accent}0d)`,
                            border: `1px solid ${accent}55`,
                            borderRadius: 16,
                            padding: 22,
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>
                            {upsellHeading}
                        </div>
                        <div style={{ fontSize: 14, color: textMuted, marginBottom: 16 }}>
                            {upsellText}
                        </div>
                        <button
                            onClick={irAPremium}
                            style={{
                                background: accent,
                                color: "#fff",
                                border: "none",
                                borderRadius: 10,
                                padding: "13px 28px",
                                fontWeight: 800,
                                fontSize: 15,
                                cursor: "pointer",
                            }}
                        >
                            Ver planes y precios →
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
                        <button onClick={() => setVerRepaso((v) => !v)} style={btnGhost(border, textMain)}>
                            {verRepaso ? "Ocultar repaso" : "Repasar mis respuestas"}
                        </button>
                        <button onClick={onRepetir} style={btnGhost(border, textMain)}>
                            {repetirLabel}
                        </button>
                        <button onClick={onVolver} style={btnGhost(border, textMain)}>
                            Volver al inicio
                        </button>
                    </div>

                    {verRepaso && (
                        <div style={{ marginTop: 18 }}>
                            {preguntas.map((p, i) => {
                                const r = respuestas[i]
                                const ok = r === p.correcta
                                const reserva = i >= N_PUNTUAN
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            background: surface,
                                            border: `1px solid ${border}`,
                                            borderRadius: 12,
                                            padding: 16,
                                            marginBottom: 10,
                                        }}
                                    >
                                        <div style={{ fontSize: 12, color: textMuted, marginBottom: 6 }}>
                                            Pregunta {i + 1} {reserva ? "· reserva (no puntúa)" : ""} ·{" "}
                                            <span style={{ color: ok ? "#22C55E" : r == null ? textMuted : "#EF4444", fontWeight: 700 }}>
                                                {ok ? "Acierto" : r == null ? "En blanco" : "Fallo"}
                                            </span>
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{p.enunciado}</div>
                                        <div style={{ fontSize: 13, color: "#22C55E", marginBottom: 4 }}>
                                            Correcta: {p.opciones[p.correcta]}
                                        </div>
                                        {!ok && r != null && (
                                            <div style={{ fontSize: 13, color: "#EF4444", marginBottom: 4 }}>
                                                Tu respuesta: {p.opciones[r]}
                                            </div>
                                        )}
                                        {p.explicacion && (
                                            <div style={{ fontSize: 13, color: textMuted, marginTop: 6 }}>{p.explicacion}</div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </motion.div>
            )}

            {/* ── Muro: modal NO cerrable de captura de email ── */}
            {!captured && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 60,
                        background: "rgba(5,6,10,0.72)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                    }}
                >
                    <motion.form
                        onSubmit={capturar}
                        initial={{ opacity: 0, scale: 0.96, y: 14 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        style={{
                            width: "100%",
                            maxWidth: 440,
                            background: surface,
                            border: `1px solid ${border}`,
                            borderRadius: 20,
                            padding: 30,
                            textAlign: "center",
                            color: textMain,
                        }}
                    >
                        <div
                            style={{
                                margin: "0 auto 12px",
                                width: 48,
                                height: 48,
                                borderRadius: 999,
                                background: accent,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                                <path d="M12 1.5a4.75 4.75 0 0 0-4.75 4.75V9H6.5A2.5 2.5 0 0 0 4 11.5v7A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 17.5 9h-.75V6.25A4.75 4.75 0 0 0 12 1.5Zm2.75 7.5h-5.5V6.25a2.75 2.75 0 0 1 5.5 0V9Z" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, letterSpacing: "-0.4px" }}>
                            {wallTitle}
                        </h2>
                        <p style={{ fontSize: 14, color: textMuted, marginBottom: 20, lineHeight: 1.5 }}>
                            Introduce tu correo para ver tu nota, el veredicto y el desglose por áreas.
                        </p>
                        <button
                            type="button"
                            onClick={entrarConGoogle}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                background: dark ? "#0B0C10" : "#fff",
                                color: textMain,
                                border: `1px solid ${border}`,
                                borderRadius: 10,
                                padding: "12px",
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: "pointer",
                                marginBottom: 14,
                            }}
                        >
                            <GoogleIcon />
                            Continuar con Google
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <div style={{ flex: 1, height: 1, background: border }} />
                            <span style={{ fontSize: 11, color: textMuted }}>o con tu correo</span>
                            <div style={{ flex: 1, height: 1, background: border }} />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            autoFocus
                            style={{
                                width: "100%",
                                padding: "13px 14px",
                                borderRadius: 10,
                                border: `1px solid ${border}`,
                                background: dark ? "#0B0C10" : "#F4F4F5",
                                color: textMain,
                                fontSize: 15,
                                marginBottom: 14,
                                outline: "none",
                            }}
                        />
                        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left", fontSize: 12.5, color: textMuted, marginBottom: 16, cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                                style={{ marginTop: 2, accentColor: accent, width: 16, height: 16, flexShrink: 0 }}
                            />
                            <span>
                                Acepto que Gainditu trate mi correo para enviarme mi resultado e información sobre la oposición. Consulta la{" "}
                                <a href="/privacidad" target="_blank" rel="noreferrer" style={{ color: accent, textDecoration: "underline" }}>
                                    política de privacidad
                                </a>
                                .
                            </span>
                        </label>
                        {error && (
                            <div style={{ fontSize: 13, color: "#EF4444", marginBottom: 12 }}>{error}</div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                background: accent,
                                color: "#fff",
                                border: "none",
                                borderRadius: 10,
                                padding: "14px",
                                fontWeight: 800,
                                fontSize: 15,
                                cursor: loading ? "default" : "pointer",
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? "Corrigiendo…" : "Ver mi nota →"}
                        </button>
                    </motion.form>
                </div>
            )}
        </div>
    )
}

function btnGhost(border: string, text: string): CSSProperties {
    return {
        background: "transparent",
        color: text,
        border: `1px solid ${border}`,
        borderRadius: 10,
        padding: "10px 18px",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
    }
}
