"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
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
    "procedimiento-notificaciones": "Notificaciones",
    "hacienda-regimen-local": "Hacienda local",
    "Régimen local": "Régimen local",
    recursos: "Recursos administrativos",
}
function labelMateria(tema: string): string {
    return LABELS[tema] ?? tema.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
}
const GLOBAL = "__global__"
function tituloTema(t: string | null): string {
    if (t === GLOBAL) return "Todo lo vencido"
    return t ? labelMateria(t) : ""
}

// Bloqueo de lanzamiento: se ve pero en gris, sin interacción, hasta el lunes 21 a las 12:00 (España).
const DESBLOQUEO = new Date("2026-09-21T12:00:00+02:00").getTime()
function faltaTexto(ms: number): string {
    const s = Math.max(0, Math.floor(ms / 1000))
    const d = Math.floor(s / 86400)
    const h = Math.floor((s % 86400) / 3600)
    const m = Math.floor((s % 3600) / 60)
    if (d > 0) return `${d} d ${h} h`
    if (h > 0) return `${h} h ${m} min`
    return `${m} min`
}

type Materia = { tema: string; total: number; dominadas: number; vencidas: number; nuevas: number; cupo_nuevas: number }
type Card = { id: string; frente: string; dorso: string; explicacion: string; caja: number }
type Resultado = "otra_vez" | "bien" | "facil"

export default function FlashcardsClient() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [isPremium, setIsPremium] = useState(false)
    const [materias, setMaterias] = useState<Materia[] | null>(null)

    const [vista, setVista] = useState<"materias" | "sesion" | "fin">("materias")
    const [temaActivo, setTemaActivo] = useState<string | null>(null)
    const [cards, setCards] = useState<Card[]>([])
    const [idx, setIdx] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const [cargandoSesion, setCargandoSesion] = useState(false)
    const [stats, setStats] = useState({ bien: 0, otra: 0 })
    const [, setTick] = useState(0)
    const bloqueado = Date.now() < DESBLOQUEO
    const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
    function sb() {
        if (!supabaseRef.current) supabaseRef.current = createClient()
        return supabaseRef.current
    }

    const cargarMaterias = useCallback(async () => {
        const { data } = await sb().rpc("flashcards_materias")
        setMaterias(Array.isArray(data) ? (data as Materia[]) : [])
    }, [])

    useEffect(() => {
        let cancel = false
        sb()
            .auth.getUser()
            .then(async ({ data }) => {
                if (cancel) return
                const u = data.user ?? null
                setUser(u)
                if (u) {
                    const { data: prof } = await sb().from("profiles").select("is_premium").eq("id", u.id).single()
                    const premium = !!prof?.is_premium
                    setIsPremium(premium)
                    if (premium) await cargarMaterias()
                }
                if (!cancel) setLoading(false)
            })
        return () => {
            cancel = true
        }
    }, [cargarMaterias])

    async function empezar(tema: string) {
        setCargandoSesion(true)
        setTemaActivo(tema)
        try {
            const { data } = await sb().rpc("flashcards_sesion", { p_tema: tema, p_limite: 20 })
            const arr = Array.isArray(data) ? (data as Card[]) : []
            setCards(arr)
            setIdx(0)
            setFlipped(false)
            setStats({ bien: 0, otra: 0 })
            setVista("sesion")
        } finally {
            setCargandoSesion(false)
        }
    }

    async function empezarGlobal() {
        setCargandoSesion(true)
        setTemaActivo(GLOBAL)
        try {
            const { data } = await sb().rpc("flashcards_sesion_global", { p_limite: 30 })
            const arr = Array.isArray(data) ? (data as Card[]) : []
            setCards(arr)
            setIdx(0)
            setFlipped(false)
            setStats({ bien: 0, otra: 0 })
            setVista("sesion")
        } finally {
            setCargandoSesion(false)
        }
    }

    const calificar = useCallback(
        (r: Resultado) => {
            const card = cards[idx]
            if (!card) return
            // Optimista: guardamos en segundo plano y avanzamos.
            sb().rpc("flashcards_calificar", { p_pregunta_id: card.id, p_resultado: r })
            setStats((s) => (r === "otra_vez" ? { ...s, otra: s.otra + 1 } : { ...s, bien: s.bien + 1 }))
            if (idx + 1 >= cards.length) {
                setVista("fin")
                cargarMaterias()
            } else {
                setIdx((i) => i + 1)
                setFlipped(false)
            }
        },
        [cards, idx, cargarMaterias],
    )

    // Atajos de teclado (PC): espacio/enter voltea; 1/2/3 califican.
    useEffect(() => {
        if (vista !== "sesion") return
        function onKey(e: KeyboardEvent) {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault()
                if (!flipped) setFlipped(true)
            } else if (flipped) {
                if (e.key === "1") calificar("otra_vez")
                else if (e.key === "2") calificar("bien")
                else if (e.key === "3") calificar("facil")
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [vista, flipped, calificar])

    // Cuenta atrás del bloqueo de lanzamiento (refresca el "faltan…" y desbloquea en vivo).
    useEffect(() => {
        if (!bloqueado) return
        const iv = setInterval(() => setTick((t) => t + 1), 30000)
        return () => clearInterval(iv)
    }, [bloqueado])

    if (loading) return <div className="py-20 text-center text-zinc-400">Cargando…</div>

    if (!user) {
        return (
            <Gate
                titulo="Tus flashcards te esperan"
                texto="Inicia sesión con la cuenta con la que compraste tu acceso para estudiar con flashcards."
                cta="Iniciar sesión"
                href="/login?redirect=/flashcards"
            />
        )
    }
    if (!isPremium) {
        return (
            <Gate
                titulo="Las flashcards son un extra del acceso completo"
                texto="Memoriza el temario con repetición espaciada: cada día repasas solo lo que toca y ves qué materias dominas. Incluido con el Método Gainditu."
                cta="Conseguir mi acceso →"
                href="/payment"
            />
        )
    }

    // ── Sesión de estudio ────────────────────────────────────────────────────
    if (vista === "sesion") {
        const card = cards[idx]
        if (!card) {
            return (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="text-[15px] font-bold text-zinc-950 dark:text-zinc-50">{temaActivo === GLOBAL ? "¡Todo al día!" : "¡Al día en esta materia!"}</div>
                    <p className="mx-auto mt-2 max-w-md text-[14px] text-zinc-500">
                        {temaActivo === GLOBAL
                            ? "No te queda ninguna tarjeta pendiente de repaso para hoy. Puedes empezar tarjetas nuevas de una materia."
                            : `No tienes tarjetas pendientes de ${temaActivo ? labelMateria(temaActivo) : "esta materia"} para hoy. Vuelve mañana o elige otra materia.`}
                    </p>
                    <button onClick={() => setVista("materias")} className="mt-5 rounded-full px-6 py-3 text-[14px] font-semibold text-white" style={{ background: ACCENT }}>
                        Elegir materia
                    </button>
                </div>
            )
        }
        return (
            <div className="mx-auto flex max-w-xl flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                    <button onClick={() => setVista("materias")} className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                        ← Materias
                    </button>
                    <div className="text-[13px] font-semibold text-zinc-500">
                        {tituloTema(temaActivo)} · {idx + 1}/{cards.length}
                    </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((idx / cards.length) * 100)}%`, background: ACCENT }} />
                </div>

                <button
                    type="button"
                    onClick={() => setFlipped((f) => !f)}
                    className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-3xl border bg-gradient-to-b from-white to-zinc-50 p-7 text-center shadow-lg shadow-zinc-900/5 transition-all dark:from-zinc-900 dark:to-zinc-900/60 dark:shadow-black/20 sm:p-9"
                    style={{ borderColor: flipped ? `${ACCENT}66` : "rgba(120,120,130,0.18)", cursor: "pointer" }}
                >
                    <div className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: flipped ? ACCENT : "#a1a1aa" }}>
                        {flipped ? "Respuesta" : "Pregunta"}
                    </div>
                    <p className="mt-3 text-[18px] font-semibold leading-relaxed text-zinc-950 dark:text-zinc-50">{card.frente}</p>
                    {flipped && (
                        <div className="mt-5 w-full border-t border-zinc-100 pt-5 dark:border-zinc-800">
                            <p className="text-[18px] font-bold leading-relaxed" style={{ color: ACCENT }}>{card.dorso}</p>
                            <div className="mt-4 text-[12px] text-zinc-400">Toca la tarjeta para volver a la pregunta</div>
                        </div>
                    )}
                    {!flipped && <div className="mt-5 text-[12.5px] text-zinc-400">Piénsalo y gírala para ver la respuesta</div>}
                </button>

                {!flipped ? (
                    <div className="flex justify-center">
                        <button onClick={() => setFlipped(true)} className="rounded-full px-8 py-3 text-[15px] font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]" style={{ background: ACCENT }}>
                            Girar tarjeta
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        <CalifBtn label="Otra vez" sub="< 1 día" color="#DC2626" onClick={() => calificar("otra_vez")} />
                        <CalifBtn label="Bien" sub="repaso" color="#2563EB" onClick={() => calificar("bien")} />
                        <CalifBtn label="Fácil" sub="+ tiempo" color={ACCENT} onClick={() => calificar("facil")} />
                    </div>
                )}
            </div>
        )
    }

    // ── Fin de sesión ────────────────────────────────────────────────────────
    if (vista === "fin") {
        return (
            <div className="rounded-2xl border p-8 text-center" style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}0d` }}>
                <div className="text-[13px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>Sesión completada</div>
                <div className="mt-2 text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">{stats.bien + stats.otra} tarjetas repasadas</div>
                <p className="mt-1 text-[14px] text-zinc-600 dark:text-zinc-300">
                    {stats.bien} las llevabas bien · {stats.otra} a reforzar. Las que fallaste vuelven pronto; las que dominas, más adelante.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <button onClick={() => (temaActivo === GLOBAL ? empezarGlobal() : temaActivo && empezar(temaActivo))} disabled={cargandoSesion} className="rounded-full px-6 py-3 text-[14px] font-semibold text-white disabled:opacity-60" style={{ background: ACCENT }}>
                        {cargandoSesion ? "Cargando…" : "Seguir estudiando"}
                    </button>
                    <button onClick={() => setVista("materias")} className="rounded-full border border-zinc-200 px-6 py-3 text-[14px] font-semibold text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                        Elegir otra materia
                    </button>
                </div>
            </div>
        )
    }

    // ── Selector de materias ─────────────────────────────────────────────────
    if (!materias) return <div className="py-20 text-center text-zinc-400">Cargando materias…</div>
    if (materias.length === 0) {
        return <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-[14px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">Aún no hay flashcards disponibles.</div>
    }
    const totalVencidas = materias.reduce((s, m) => s + m.vencidas, 0)
    return (
        <div className="flex flex-col gap-4">
            {bloqueado && (
                <div className="rounded-2xl border border-dashed p-5 text-center" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}0d` }}>
                    <div className="text-[12px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>Próximamente</div>
                    <div className="mt-1 text-[16px] font-extrabold text-zinc-950 dark:text-zinc-50">Se desbloquea el lunes a las 12:00</div>
                    <p className="mx-auto mt-1 max-w-md text-[13.5px] text-zinc-600 dark:text-zinc-300">
                        Ya está todo listo: 13 materias para memorizar el temario con repetición espaciada.
                    </p>
                </div>
            )}
            {totalVencidas > 0 && !bloqueado && (
                <button
                    onClick={empezarGlobal}
                    disabled={cargandoSesion}
                    className="flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-white shadow-sm transition-transform hover:scale-[1.005] disabled:opacity-60"
                    style={{ background: ACCENT }}
                >
                    <div>
                        <div className="text-[15px] font-extrabold">Repasar todo lo vencido</div>
                        <div className="text-[12.5px] opacity-90">Tarjetas de todas las materias que tocan hoy.</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-[14px] font-bold">{totalVencidas}</span>
                </button>
            )}
            <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${bloqueado ? "pointer-events-none select-none opacity-50" : ""}`}>
            {materias.map((m) => {
                const paraHoy = Math.min(20, m.vencidas + Math.min(m.nuevas, m.cupo_nuevas ?? 0))
                const empezadas = m.total - m.nuevas
                const pct = m.total ? Math.round((empezadas / m.total) * 100) : 0
                const dominada = m.total > 0 && m.dominadas === m.total
                const sub = m.dominadas > 0 ? `${m.dominadas} dominadas` : empezadas > 0 ? "En progreso" : "Sin empezar"
                return (
                    <button
                        key={m.tema}
                        onClick={() => empezar(m.tema)}
                        disabled={cargandoSesion || paraHoy === 0 || bloqueado}
                        className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 text-left transition-transform hover:scale-[1.01] disabled:cursor-default disabled:opacity-70 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="text-[15px] font-bold text-zinc-950 dark:text-zinc-50">{labelMateria(m.tema)}</div>
                            {dominada ? (
                                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: `${ACCENT}18`, color: ACCENT }}>Dominada</span>
                            ) : paraHoy > 0 ? (
                                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold text-white" style={{ background: ACCENT }}>{paraHoy} para hoy</span>
                            ) : (
                                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold text-zinc-500" style={{ background: "rgba(120,120,130,0.12)" }}>Al día</span>
                            )}
                        </div>
                        <div className="mt-0.5 text-[12.5px] text-zinc-500">{sub}</div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ACCENT }} />
                        </div>
                    </button>
                )
            })}
            </div>
        </div>
    )
}

function CalifBtn({ label, sub, color, onClick }: { label: string; sub: string; color: string; onClick: () => void }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center rounded-xl border py-3 font-semibold transition-colors" style={{ borderColor: `${color}55`, color }}>
            <span className="text-[14px]">{label}</span>
            <span className="text-[11px] opacity-70">{sub}</span>
        </button>
    )
}

function Gate({ titulo, texto, cta, href }: { titulo: string; texto: string; cta: string; href: string }) {
    return (
        <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50">{titulo}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">{texto}</p>
            <Link href={href} className="mt-5 inline-flex items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold text-white" style={{ background: ACCENT }}>
                {cta}
            </Link>
        </div>
    )
}
