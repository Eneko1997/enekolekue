"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import OnlineAhora from "@/components/admin/OnlineAhora"

const ACCENT = "#10B981"

type Semana = { semana: string; desde: string; simulacro: number; convocatorias: number; academia: number }
type Metricas = {
    generado: string
    totales: { simulacro: number; convocatorias: number; academia: number }
    ultimos7: { simulacro: number; convocatorias: number; academia: number }
    previos7: { simulacro: number; convocatorias: number; academia: number }
    semanas: Semana[]
    embudo: Record<string, number>
    simulacro_por_origen: { origen: string; n: number }[]
}

const PASOS: [string, string][] = [
    ["landing_view", "Vieron la landing"],
    ["test_started", "Empezaron el test"],
    ["test_finished", "Terminaron el test"],
    ["email_captured", "Dejaron su email"],
    ["purchase", "Compraron premium"],
]

function Delta({ now, prev }: { now: number; prev: number }) {
    const d = now - prev
    if (d === 0) return <span className="text-[12px] text-zinc-400">= vs semana previa</span>
    const up = d > 0
    return (
        <span className={`text-[12px] font-semibold ${up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
            {up ? "▲" : "▼"} {Math.abs(d)} vs semana previa
        </span>
    )
}

function Card({ label, total, now, prev }: { label: string; total: number; now: number; prev: number }) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">{label}</div>
            <div className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">{total}</div>
            <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[13px] font-semibold" style={{ color: ACCENT }}>+{now} esta semana</span>
            </div>
            <div className="mt-0.5">
                <Delta now={now} prev={prev} />
            </div>
        </div>
    )
}

type Lead = { email: string; fuente: string; motivo: string | null; detalle: string | null; estado: string; fecha: string }

const FUENTE_COLOR: Record<string, string> = {
    "Registro": "#14B8A6",
    "Simulacro": "#10B981",
    "Avisos convocatorias": "#3B82F6",
    "Academia": "#8B5CF6",
    "Profesor": "#6366F1",
    "Alerta convocatoria": "#F59E0B",
    "Recomendador": "#EC4899",
}

// Texto claro para cada fuente (el valor real no cambia; solo cómo se lee).
// "Avisos" = quiere enterarse de TODAS las OPE. "Alerta" = pidió UNA OPE concreta.
const FUENTE_LABEL: Record<string, string> = {
    "Avisos convocatorias": "Avisos · todas las OPE",
    "Alerta convocatoria": "Alerta · una OPE concreta",
}
const fuenteLabel = (f: string) => FUENTE_LABEL[f] ?? f

type Ficha = {
    email: string; nombre: string | null; registrado: string | null; tipo: string
    premium: { plan: string | null; status: string | null; desde: string | null; hasta: string | null } | null
    marketing_consent: boolean | null; gratis_usadas: number; escala_objetivo: string | null
    tests: { total: number; ultimo: string | null; media: number | null }
    ultima_conexion: string | null; online: boolean
    fuentes: string[]; emails: { tipo: string; fecha: string | null }[]
}
function fdate(s: string | null | undefined): string { return s ? new Date(s).toLocaleString("es-ES") : "—" }
function Dato({ k, v }: { k: string; v: string }) {
    return (
        <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{k}</dt>
            <dd className="mt-0.5 text-zinc-800 dark:text-zinc-200">{v}</dd>
        </div>
    )
}

type Visitas = { total7: number; total_prev: number; top: { pantalla: string; n: number }[]; ubicaciones: { lugar: string; n: number }[] }
type Ticket = { id: number; test_id: string; pregunta_id: string; enunciado: string; motivo: string; email: string | null; estado: string; url: string | null; created_at: string }

export default function CaptacionDashboard() {
    const [data, setData] = useState<Metricas | null>(null)
    const [lista, setLista] = useState<Lead[]>([])
    const [filtro, setFiltro] = useState<string>("todas")
    const [filtroEstado, setFiltroEstado] = useState<string>("todos")
    const [estado, setEstado] = useState<"cargando" | "ok" | "denegado" | "error">("cargando")
    const [sel, setSel] = useState<string | null>(null)
    const [ficha, setFicha] = useState<Ficha | null>(null)
    const [fichaCargando, setFichaCargando] = useState(false)
    const [refrescando, setRefrescando] = useState(false)
    const [visitas, setVisitas] = useState<Visitas | null>(null)
    const [tickets, setTickets] = useState<Ticket[]>([])
    // Responder impugnación por email
    const [resp, setResp] = useState<Ticket | null>(null)
    const [respAsunto, setRespAsunto] = useState("")
    const [respMsg, setRespMsg] = useState("")
    const [respEstado, setRespEstado] = useState("desestimada")
    const [respEnviando, setRespEnviando] = useState(false)
    const [respError, setRespError] = useState<string | null>(null)

    function abrirResponder(t: Ticket) {
        setResp(t)
        setRespError(null)
        setRespEstado("desestimada")
        setRespAsunto("Gainditu · Respuesta a tu consulta sobre una pregunta")
        setRespMsg(
            "Kaixo, gracias por tu consulta.\n\n[Escribe aquí la respuesta]\n\nHemos revisado la pregunta con calma. ¡Gracias por ayudarnos a mejorar y mucho ánimo con la preparación!"
        )
    }

    async function enviarRespuesta() {
        if (!resp) return
        setRespEnviando(true)
        setRespError(null)
        try {
            const supabase = createClient()
            const { data, error } = await supabase.functions.invoke("responder-impugnacion", {
                body: { id: resp.id, mensaje: respMsg, asunto: respAsunto, estado: respEstado },
            })
            const r = data as { ok?: boolean; error?: string } | null
            if (error || !r?.ok) {
                setRespError(r?.error || error?.message || "No se pudo enviar el email.")
                return
            }
            setTickets((ts) => ts.map((t) => (t.id === resp.id ? { ...t, estado: respEstado } : t)))
            setResp(null)
        } catch (e) {
            setRespError(String(e))
        } finally {
            setRespEnviando(false)
        }
    }

    async function cargar(silencioso = false) {
        try {
            if (silencioso) setRefrescando(true)
            const supabase = createClient()
            const { data, error } = await supabase.rpc("metricas_captacion")
            if (error) {
                setEstado(/no autorizado/i.test(error.message) ? "denegado" : "error")
                return
            }
            setData(data as Metricas)
            const { data: l } = await supabase.rpc("lista_captacion")
            setLista(Array.isArray(l) ? (l as Lead[]) : [])
            const { data: v } = await supabase.rpc("visitas_resumen")
            setVisitas((v as Visitas) || null)
            const { data: tk } = await supabase.rpc("lista_impugnaciones")
            setTickets(Array.isArray(tk) ? (tk as Ticket[]) : [])
            setEstado("ok")
        } catch {
            setEstado("error")
        } finally {
            setRefrescando(false)
        }
    }

    async function resolverTicket(id: number, estado: string) {
        try {
            const supabase = createClient()
            await supabase.rpc("resolver_impugnacion", { p_id: id, p_estado: estado })
            setTickets((ts) => ts.map((t) => t.id === id ? { ...t, estado } : t))
        } catch { /* noop */ }
    }

    async function abrirFicha(email: string) {
        setSel(email); setFicha(null); setFichaCargando(true)
        try {
            const supabase = createClient()
            const { data } = await supabase.rpc("perfil_captacion", { p_email: email })
            setFicha((data as Ficha) || null)
        } catch { /* noop */ } finally { setFichaCargando(false) }
    }

    useEffect(() => {
        cargar()
        const id = setInterval(() => cargar(true), 60000)  // auto-refresco cada 60 s
        return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (estado === "cargando") return <p className="text-[14px] text-zinc-500">Cargando métricas…</p>
    if (estado === "denegado")
        return (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <h1 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Acceso restringido</h1>
                <p className="mt-2 text-[14px] text-zinc-500">Esta página es solo para el equipo de Gainditu. Inicia sesión con una cuenta autorizada.</p>
            </div>
        )
    if (estado === "error" || !data)
        return (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-[14px] text-zinc-500">No se han podido cargar las métricas. Inténtalo de nuevo.</p>
                <button onClick={() => { setEstado("cargando"); cargar() }} className="mt-3 rounded-full px-5 py-2 text-[14px] font-semibold text-white" style={{ backgroundColor: ACCENT }}>Reintentar</button>
            </div>
        )

    const base = Math.max(1, data.embudo.landing_view || 0)
    const maxSemana = Math.max(1, ...data.semanas.map((s) => s.simulacro + s.convocatorias + s.academia))
    const orientacion = data.embudo.orientacion_result || 0

    return (
        <div>
            <div className="flex items-end justify-between gap-4">
                <div>
                    <span className="inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide" style={{ color: ACCENT, borderColor: `${ACCENT}55` }}>
                        Interno
                    </span>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Captación</h1>
                </div>
                <span className="text-[12px] text-zinc-400">Actualizado {new Date(data.generado).toLocaleString("es-ES")}</span>
            </div>

            {/* Quién está online y en qué pantalla (tiempo real) */}
            <OnlineAhora />

            {/* Impugnaciones de preguntas (tickets) */}
            <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Impugnaciones</h2>
                    {(() => { const ab = tickets.filter((t) => t.estado === "abierta").length; return (
                        <span className="rounded-full px-2.5 py-0.5 text-[12px] font-bold" style={ab > 0 ? { background: "rgba(239,68,68,0.12)", color: "#dc2626" } : { background: `${ACCENT}1a`, color: ACCENT }}>
                            {ab} abierta{ab === 1 ? "" : "s"}
                        </span>
                    ) })()}
                </div>
                {tickets.length === 0 ? (
                    <p className="mt-4 text-[14px] text-zinc-500">No hay impugnaciones. Cuando alguien impugne una pregunta, te llega por email y aparece aquí.</p>
                ) : (
                    <ul className="mt-4 space-y-2.5">
                        {tickets.map((t) => (
                            <li key={t.id} className={`rounded-xl border p-3.5 ${t.estado === "abierta" ? "border-amber-300/60 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/5" : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40"}`}>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
                                        #{t.id} · Pregunta {t.pregunta_id} <span className="font-normal text-zinc-400">· test {t.test_id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={t.estado === "abierta" ? { background: "rgba(245,158,11,0.15)", color: "#b45309" } : { background: `${ACCENT}1a`, color: ACCENT }}>
                                            {t.estado === "abierta" ? "Abierta" : "Resuelta"}
                                        </span>
                                        {t.email && (
                                            <button onClick={() => abrirResponder(t)} className="rounded-full border px-3 py-1 text-[12px] font-semibold" style={{ borderColor: ACCENT, color: ACCENT }}>Responder</button>
                                        )}
                                        {t.estado === "abierta"
                                            ? <button onClick={() => resolverTicket(t.id, "resuelta")} className="rounded-full px-3 py-1 text-[12px] font-semibold text-white" style={{ backgroundColor: ACCENT }}>Resolver</button>
                                            : <button onClick={() => resolverTicket(t.id, "abierta")} className="rounded-full border border-zinc-300 px-3 py-1 text-[12px] font-medium text-zinc-500 dark:border-zinc-700">Reabrir</button>}
                                    </div>
                                </div>
                                <p className="mt-1.5 text-[13.5px] text-zinc-700 dark:text-zinc-300"><span className="font-semibold">Motivo:</span> {t.motivo}</p>
                                {t.enunciado && <p className="mt-1 line-clamp-2 text-[12.5px] text-zinc-500">{t.enunciado}</p>}
                                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11.5px] text-zinc-400">
                                    <span>{new Date(t.created_at).toLocaleString("es-ES")}</span>
                                    {t.email && <span>· {t.email}</span>}
                                    {t.url && <a href={t.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600">ver en el test</a>}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Visitas de la web (últimos 7 días) */}
            {visitas && (
                <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                        <h2 className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Visitas de la web</h2>
                        <div className="text-right">
                            <div className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">{visitas.total7}</div>
                            <div className="text-[12px]"><span className="text-zinc-400">últimos 7 días · </span><Delta now={visitas.total7} prev={visitas.total_prev} /></div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Pantallas más visitadas</div>
                        {visitas.top.length === 0 ? (
                            <p className="mt-2 text-[14px] text-zinc-500">Aún no hay visitas registradas esta semana.</p>
                        ) : (
                            <ul className="mt-3 space-y-2">
                                {visitas.top.map((t, i) => {
                                    const max = Math.max(1, ...visitas.top.map((x) => x.n))
                                    return (
                                        <li key={i} className="flex items-center gap-3">
                                            <span className="w-5 shrink-0 text-[13px] font-bold text-zinc-400">{i + 1}</span>
                                            <span className="w-40 shrink-0 truncate text-[13.5px] font-medium text-zinc-800 dark:text-zinc-200">{t.pantalla}</span>
                                            <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.round((t.n / max) * 100)}%`, backgroundColor: ACCENT }} />
                                            </span>
                                            <span className="w-12 shrink-0 text-right text-[13px] font-bold text-zinc-700 dark:text-zinc-200">{t.n}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>

                    <div className="mt-6">
                        <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Ubicación de las visitas</div>
                        {(!visitas.ubicaciones || visitas.ubicaciones.length === 0) ? (
                            <p className="mt-2 text-[14px] text-zinc-500">Aún sin ubicaciones registradas esta semana.</p>
                        ) : (
                            <ul className="mt-3 space-y-2">
                                {visitas.ubicaciones.map((u, i) => {
                                    const max = Math.max(1, ...visitas.ubicaciones.map((x) => x.n))
                                    return (
                                        <li key={i} className="flex items-center gap-3">
                                            <span className="w-40 shrink-0 truncate text-[13.5px] font-medium text-zinc-800 dark:text-zinc-200">{u.lugar}</span>
                                            <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.round((u.n / max) * 100)}%`, backgroundColor: "#6366F1" }} />
                                            </span>
                                            <span className="w-12 shrink-0 text-right text-[13px] font-bold text-zinc-700 dark:text-zinc-200">{u.n}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                        <p className="mt-2 text-[11.5px] text-zinc-400">Ubicación aproximada (por IP). Solo se cuentan las visitas con ubicación detectada.</p>
                    </div>
                </section>
            )}

            {/* Totales por fuente */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card label="Simulacro (leads)" total={data.totales.simulacro} now={data.ultimos7.simulacro} prev={data.previos7.simulacro} />
                <Card label="Avisos convocatoria" total={data.totales.convocatorias} now={data.ultimos7.convocatorias} prev={data.previos7.convocatorias} />
                <Card label="Academias" total={data.totales.academia} now={data.ultimos7.academia} prev={data.previos7.academia} />
            </div>

            {/* Embudo del simulacro */}
            <section className="mt-10">
                <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Embudo del simulacro</h2>
                <p className="mt-1 text-[13px] text-zinc-500">De cada 100 que ven la landing, cuántos llegan a dejar el email.</p>
                <div className="mt-4 space-y-2.5">
                    {PASOS.map(([k, label]) => {
                        const n = data.embudo[k] || 0
                        const pct = Math.round((n / base) * 100)
                        return (
                            <div key={k} className="flex items-center gap-3">
                                <div className="w-40 shrink-0 text-[13px] text-zinc-600 dark:text-zinc-300">{label}</div>
                                <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                    <div className="h-full rounded-lg" style={{ width: `${Math.max(pct, n > 0 ? 4 : 0)}%`, backgroundColor: ACCENT }} />
                                </div>
                                <div className="w-24 shrink-0 text-right text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
                                    {n} <span className="text-zinc-400">· {pct}%</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <p className="mt-3 text-[12px] text-zinc-400">Además, {orientacion} usos del recomendador “¿Qué oposición elegir?”.</p>
            </section>

            {/* Últimas 8 semanas */}
            <section className="mt-10">
                <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Leads por semana (8 últimas)</h2>
                <div className="mt-4 space-y-2">
                    {data.semanas.map((s) => {
                        const total = s.simulacro + s.convocatorias + s.academia
                        return (
                            <div key={s.semana} className="flex items-center gap-3">
                                <div className="w-24 shrink-0 text-[12px] text-zinc-500">{s.desde}</div>
                                <div className="relative h-6 flex-1 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                    <div className="h-full rounded-lg" style={{ width: `${(total / maxSemana) * 100}%`, backgroundColor: ACCENT }} />
                                </div>
                                <div className="w-32 shrink-0 text-right text-[12px] text-zinc-600 dark:text-zinc-300">
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{total}</span>
                                    <span className="text-zinc-400"> ({s.simulacro}/{s.convocatorias}/{s.academia})</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <p className="mt-3 text-[12px] text-zinc-400">Total por semana; entre paréntesis, simulacro / convocatoria / academia.</p>
            </section>

            {/* Simulacro por origen */}
            {data.simulacro_por_origen.length > 0 && (
                <section className="mt-10">
                    <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Leads de simulacro por origen</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {data.simulacro_por_origen.map((o) => (
                            <span key={o.origen} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[13px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                                {o.origen} <span className="font-bold text-zinc-950 dark:text-zinc-50">{o.n}</span>
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Lista de emails captados */}
            <section className="mt-10">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Emails captados</h2>
                        <p className="mt-1 text-[13px] text-zinc-500">
                            Quién dejó su email o se registró, y cuándo. {lista.length} en total ·{" "}
                            {lista.filter((l) => l.estado === "activo").length} activos ·{" "}
                            {lista.filter((l) => l.estado === "baja").length} bajas. Pulsa en un email para ver su ficha.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                        >
                            <option value="todas">Todas las fuentes</option>
                            <option value="Registro">Registro</option>
                            <option value="Simulacro">Simulacro</option>
                            <option value="Avisos convocatorias">{fuenteLabel("Avisos convocatorias")}</option>
                            <option value="Alerta convocatoria">{fuenteLabel("Alerta convocatoria")}</option>
                            <option value="Recomendador">Recomendador</option>
                            <option value="Academia">Academia</option>
                            <option value="Profesor">Profesor</option>
                        </select>
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                        >
                            <option value="todos">Activos y bajas</option>
                            <option value="activo">Solo activos</option>
                            <option value="baja">Solo bajas</option>
                        </select>
                        <button
                            onClick={() => cargar(true)}
                            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                        >
                            {refrescando ? "Actualizando…" : "Actualizar"}
                        </button>
                        <button
                            onClick={() => descargarCsv(lista.filter((l) => (filtro === "todas" || l.fuente === filtro) && (filtroEstado === "todos" || l.estado === filtroEstado)))}
                            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                        >
                            Descargar CSV
                        </button>
                    </div>
                </div>

                <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
                        <thead>
                            <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60">
                                <th className="px-3 py-2.5 font-semibold">#</th>
                                <th className="px-3 py-2.5 font-semibold">Email</th>
                                <th className="px-3 py-2.5 font-semibold">Fuente</th>
                                <th className="px-3 py-2.5 font-semibold">Motivo</th>
                                <th className="px-3 py-2.5 font-semibold">Detalle</th>
                                <th className="px-3 py-2.5 font-semibold">Estado</th>
                                <th className="px-3 py-2.5 font-semibold">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista
                                .filter((l) => (filtro === "todas" || l.fuente === filtro) && (filtroEstado === "todos" || l.estado === filtroEstado))
                                .map((l, i) => (
                                    <tr key={`${l.email}-${l.fecha}-${i}`} onClick={() => abrirFicha(l.email)} className="cursor-pointer border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800/60 dark:hover:bg-zinc-800/40">
                                        <td className="px-3 py-2.5 tabular-nums text-zinc-400">{i + 1}</td>
                                        <td className="px-3 py-2.5 font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100">{l.email}</td>
                                        <td className="px-3 py-2.5">
                                            <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: `${FUENTE_COLOR[l.fuente] || "#71717a"}1a`, color: FUENTE_COLOR[l.fuente] || "#71717a" }}>
                                                {fuenteLabel(l.fuente)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-zinc-600 dark:text-zinc-300">{l.motivo || "—"}</td>
                                        <td className="px-3 py-2.5 text-zinc-500 dark:text-zinc-400">{l.detalle || "—"}</td>
                                        <td className="px-3 py-2.5">
                                            <span
                                                className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                                                style={l.estado === "baja"
                                                    ? { background: "rgba(239,68,68,0.12)", color: "#dc2626" }
                                                    : { background: `${ACCENT}1a`, color: ACCENT }}
                                            >
                                                {l.estado === "baja" ? "Baja" : "Activo"}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2.5 text-zinc-500 dark:text-zinc-400">{new Date(l.fecha).toLocaleString("es-ES")}</td>
                                    </tr>
                                ))}
                            {lista.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-3 py-8 text-center text-zinc-400">Aún no hay emails captados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Responder impugnación */}
            {resp && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => !respEnviando && setResp(null)}>
                    <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="text-lg font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Responder por email</h3>
                                <p className="mt-0.5 break-all text-[13px] text-zinc-500">Para: {resp.email}</p>
                            </div>
                            <button onClick={() => !respEnviando && setResp(null)} className="rounded-full px-2 text-2xl leading-none text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">×</button>
                        </div>

                        <div className="mt-3 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/40">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Pregunta impugnada</p>
                            <p className="mt-1 text-[13.5px] font-medium text-zinc-800 dark:text-zinc-200">{resp.enunciado}</p>
                            <p className="mt-1 text-[12.5px] text-zinc-500"><span className="font-semibold">Su motivo:</span> {resp.motivo}</p>
                        </div>

                        <label className="mt-4 block">
                            <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">Asunto</span>
                            <input
                                value={respAsunto}
                                onChange={(e) => setRespAsunto(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-[14px] text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            />
                        </label>
                        <label className="mt-3 block">
                            <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">Mensaje</span>
                            <textarea
                                value={respMsg}
                                onChange={(e) => setRespMsg(e.target.value)}
                                rows={7}
                                className="mt-1 w-full resize-y rounded-xl border border-zinc-300 bg-white px-3 py-2 text-[14px] leading-relaxed text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            />
                            <span className="mt-1 block text-[11.5px] text-zinc-400">Se enviará con el contexto de la pregunta (enunciado, opciones y enlace) añadido automáticamente debajo.</span>
                        </label>
                        <label className="mt-3 block">
                            <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">Marcar impugnación como</span>
                            <select
                                value={respEstado}
                                onChange={(e) => setRespEstado(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-[14px] text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            >
                                <option value="desestimada">Desestimada (la pregunta estaba bien)</option>
                                <option value="aceptada">Aceptada (había que corregir)</option>
                                <option value="resuelta">Resuelta</option>
                            </select>
                        </label>

                        {respError && <p className="mt-3 text-[13px] font-medium text-red-500">{respError}</p>}

                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button onClick={() => setResp(null)} disabled={respEnviando} className="rounded-full border border-zinc-300 px-4 py-2 text-[13px] font-medium text-zinc-600 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300">Cancelar</button>
                            <button onClick={enviarRespuesta} disabled={respEnviando || !respMsg.trim()} className="rounded-full px-5 py-2 text-[13px] font-semibold text-white disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
                                {respEnviando ? "Enviando…" : "Enviar email"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ficha de la persona */}
            {sel && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => setSel(null)}>
                    <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="break-all text-lg font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">{sel}</h3>
                                {ficha?.nombre && <p className="text-[13px] text-zinc-500">{ficha.nombre}</p>}
                            </div>
                            <button onClick={() => setSel(null)} className="rounded-full px-2 text-2xl leading-none text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">×</button>
                        </div>

                        {fichaCargando || !ficha ? (
                            <p className="mt-6 text-[14px] text-zinc-500">Cargando ficha…</p>
                        ) : (
                            <div className="mt-4 space-y-5 text-[13.5px]">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full px-2.5 py-1 text-[12px] font-bold" style={{ background: `${ACCENT}1a`, color: ACCENT }}>{ficha.tipo}</span>
                                    {ficha.online && <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[12px] font-bold text-emerald-600 dark:text-emerald-400">● Online ahora</span>}
                                    {ficha.premium && <span className="text-[12px] text-zinc-500">Plan {ficha.premium.plan} · {ficha.premium.status}{ficha.premium.hasta ? ` · hasta ${new Date(ficha.premium.hasta).toLocaleDateString("es-ES")}` : ""}</span>}
                                </div>

                                <dl className="grid grid-cols-2 gap-3">
                                    <Dato k="Registrado" v={fdate(ficha.registrado)} />
                                    <Dato k="Última conexión" v={fdate(ficha.ultima_conexion)} />
                                    <Dato k="Tests realizados" v={`${ficha.tests.total}${ficha.tests.media != null ? ` · media ${ficha.tests.media}%` : ""}`} />
                                    <Dato k="Último test" v={fdate(ficha.tests.ultimo)} />
                                    <Dato k="Preguntas gratis usadas" v={String(ficha.gratis_usadas)} />
                                    <Dato k="Consiente marketing" v={ficha.marketing_consent ? "Sí" : "No"} />
                                    {ficha.escala_objetivo && <Dato k="Escala objetivo" v={ficha.escala_objetivo} />}
                                </dl>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Está en</div>
                                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                                        {ficha.fuentes.length ? ficha.fuentes.map((f) => (
                                            <span key={f} className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: `${FUENTE_COLOR[f] || "#71717a"}1a`, color: FUENTE_COLOR[f] || "#71717a" }}>{fuenteLabel(f)}</span>
                                        )) : <span className="text-[13px] text-zinc-400">—</span>}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Emails que le hemos enviado</div>
                                    {ficha.emails.length ? (
                                        <ul className="mt-1.5 space-y-1">
                                            {ficha.emails.map((e, i) => (
                                                <li key={i} className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-1.5 dark:bg-zinc-800/40">
                                                    <span className="text-zinc-700 dark:text-zinc-200">{e.tipo}</span>
                                                    <span className="shrink-0 text-[12px] text-zinc-400">{fdate(e.fecha)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="mt-1 text-[13px] text-zinc-400">Ninguno todavía.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function descargarCsv(rows: Lead[]) {
    const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`
    const head = ["Email", "Fuente", "Motivo", "Detalle", "Estado", "Fecha"]
    const body = rows.map((l) => [l.email, l.fuente, l.motivo || "", l.detalle || "", l.estado || "", new Date(l.fecha).toISOString()].map(esc).join(","))
    const csv = [head.map(esc).join(","), ...body].join("\n")
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `captacion-gainditu-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
}
