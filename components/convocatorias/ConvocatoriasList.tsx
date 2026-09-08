"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
    type Convocatoria,
    type EstadoConvocatoria,
    ESTADOS,
} from "@/lib/data/convocatorias"
import { getOrganismo } from "@/lib/data/organismos"

const ACCENT = "#10B981"

function EstadoBadge({ estado }: { estado: EstadoConvocatoria }) {
    const e = ESTADOS[estado]
    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
            style={{ color: e.color, background: `${e.color}18`, border: `1px solid ${e.color}30` }}
        >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: e.color }} />
            {e.label}
        </span>
    )
}

function Select({
    label,
    value,
    onChange,
    options,
}: {
    label: string
    value: string
    onChange: (v: string) => void
    options: { value: string; label: string }[]
}) {
    return (
        <div className="relative">
            <select
                aria-label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none rounded-full border border-zinc-200 bg-white py-2.5 pl-4 pr-9 text-[13px] font-semibold text-zinc-700 outline-none transition-colors hover:border-zinc-300 focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 sm:w-auto"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden
            >
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

const normaliza = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

// Texto de inscripción para la card: SIEMPRE "inicio – cierre" cuando hay ambas fechas;
// si solo hay una, la que haya; para las curadas ("Inscripción" con rango) el propio rango.
function inscripcionTexto(c: Convocatoria): string {
    const fc = c.fechasClave || []
    const ini = fc.find((f) => /inicio/i.test(f.etiqueta) && f.fecha)
    const fin = fc.find((f) => /fin/i.test(f.etiqueta) && f.fecha)
    const insc = fc.find((f) => /^inscrip/i.test(f.etiqueta) && f.fecha) // curadas: rango en un solo campo
    if (ini && fin) return `${ini.fecha} – ${fin.fecha}`
    if (insc) return insc.fecha as string
    if (fin) return `hasta el ${fin.fecha}`
    if (ini) return `desde el ${ini.fecha}`
    return fc[0]?.fecha ?? "Pendiente"
}

// Días naturales que faltan para el CIERRE de inscripción (la iso más tardía de las
// fechas de fin/plazo/solicitud), o null si no se conoce. 0 = hoy es el último día.
function diasParaCierre(c: Convocatoria): number | null {
    const isos = (c.fechasClave || [])
        .filter((f) => f?.iso && /(fin|cierre|inscrip|plazo|solicitud)/i.test(f?.etiqueta || ""))
        .map((f) => f.iso as string)
        .sort()
    const fin = isos.length ? isos[isos.length - 1] : null
    if (!fin) return null
    const [y, m, d] = fin.split("-").map((n) => parseInt(n, 10))
    if (!y || !m || !d) return null
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    const finDate = new Date(y, m - 1, d)
    return Math.round((finDate.getTime() - hoy.getTime()) / 86400000)
}

// Aviso de urgencia para la card: solo si la inscripción está abierta y quedan 10 días o
// menos. Ámbar de normal, rojo cuando quedan 3 o menos (para que no se le pase el plazo).
function avisoPlazo(c: Convocatoria): { texto: string; color: string } | null {
    if (c.estado !== "inscripcion-abierta") return null
    const d = diasParaCierre(c)
    if (d === null || d < 0 || d > 10) return null
    const color = d <= 3 ? "#DC2626" : "#F59E0B"
    const texto =
        d === 0 ? "¡Último día!"
            : d === 1 ? "Queda 1 día"
                : `Quedan ${d} días`
    return { texto, color }
}

export default function ConvocatoriasList({
    convocatorias,
}: {
    convocatorias: Convocatoria[]
}) {
    const [organismo, setOrganismo] = useState<string>("todos")
    const [estado, setEstado] = useState<string>("todos")
    const [orden, setOrden] = useState<string>("recientes")
    const [query, setQuery] = useState<string>("")

    // Opciones presentes en los datos (no listamos filtros vacíos).
    const organismos = useMemo(
        () => Array.from(new Set(convocatorias.map((c) => c.organismo))),
        [convocatorias]
    )
    const estados = useMemo(
        () => Array.from(new Set(convocatorias.map((c) => c.estado))),
        [convocatorias]
    )

    // Índice de búsqueda por ficha: nombre + escala/categoría + organismo.
    const indexado = useMemo(
        () =>
            convocatorias.map((c) => ({
                c,
                texto: normaliza(
                    [
                        c.nombre,
                        c.cuerpoOCategoria.join(" "),
                        getOrganismo(c.organismo)?.nombre ?? "",
                        getOrganismo(c.organismo)?.corto ?? "",
                    ].join(" ")
                ),
            })),
        [convocatorias]
    )

    const filtradas = useMemo(() => {
        const q = normaliza(query.trim())
        const terminos = q ? q.split(/\s+/) : []
        const lista = indexado
            .filter(
                ({ c, texto }) =>
                    (organismo === "todos" || c.organismo === organismo) &&
                    (estado === "todos" || c.estado === estado) &&
                    terminos.every((t) => texto.includes(t))
            )
            .map(({ c }) => c)
        // "recientes" = últimas convocatorias que han salido = por la fecha de INICIO de inscripción,
        // de más nueva a más antigua. Se prioriza la etiqueta "Inicio" (la iso "Inscripción" de las
        // curadas es el FIN, no vale como inicio). (Subida/ultimaActualizacion empatan: no vale.)
        const inicioInscripcion = (c: Convocatoria) => {
            const fc = c.fechasClave || []
            const ini = fc.find((f) => f?.iso && /inicio/i.test(f?.etiqueta || ""))
            const insc = fc.find((f) => f?.iso && /inscrip|plazo|solicitud/i.test(f?.etiqueta || ""))
            return ini?.iso || insc?.iso || fc?.[0]?.iso || c.creadaEn || c.ultimaActualizacion || ""
        }
        const cmp: Record<string, (a: Convocatoria, b: Convocatoria) => number> = {
            recientes: (a, b) => { const fa = inicioInscripcion(a), fb = inicioInscripcion(b); return fa < fb ? 1 : fa > fb ? -1 : 0 },
            plazas: (a, b) => (b.plazas ?? -1) - (a.plazas ?? -1),
            abiertas: (a, b) => ESTADOS[a.estado].orden - ESTADOS[b.estado].orden,
        }
        return lista.sort(cmp[orden] ?? cmp.recientes)
    }, [indexado, organismo, estado, orden, query])

    return (
        <div>
            {/* Buscador */}
            <div className="relative mb-4">
                <svg
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden
                >
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Busca por escala o municipio (ej. administrativo, Getxo, bomberos)…"
                    aria-label="Buscar convocatorias"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-2.5 pl-11 pr-4 text-[14px] text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 focus:border-emerald-500"
                />
            </div>

            {/* Filtros compactos: organismo, estado y orden */}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <Select
                    label="Filtrar por organismo"
                    value={organismo}
                    onChange={setOrganismo}
                    options={[
                        { value: "todos", label: "Todos los organismos" },
                        ...organismos.map((slug) => ({ value: slug, label: getOrganismo(slug)?.corto ?? slug })),
                    ]}
                />
                <Select
                    label="Filtrar por estado"
                    value={estado}
                    onChange={setEstado}
                    options={[
                        { value: "todos", label: "Todos los estados" },
                        ...estados.map((e) => ({ value: e, label: ESTADOS[e].label })),
                    ]}
                />
                <Select
                    label="Ordenar por"
                    value={orden}
                    onChange={setOrden}
                    options={[
                        { value: "recientes", label: "Inscripción más reciente" },
                        { value: "plazas", label: "Más plazas" },
                        { value: "abiertas", label: "Inscripción abierta primero" },
                    ]}
                />
            </div>

            {/* Contador */}
            <p className="mt-6 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                {filtradas.length}{" "}
                {filtradas.length === 1 ? "convocatoria" : "convocatorias"}
            </p>

            {/* Listado */}
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                {filtradas.map((c) => {
                    const org = getOrganismo(c.organismo)
                    return (
                        <Link
                            key={c.slug}
                            href={`/convocatorias/${c.slug}`}
                            className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                        <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    {org?.corto ?? c.organismo}
                                </span>
                                <EstadoBadge estado={c.estado} />
                            </div>
                            <h3 className="mt-2.5 text-[17px] font-extrabold leading-snug tracking-tight text-zinc-950 dark:text-zinc-50">
                                {c.nombre}
                            </h3>
                            <p className="mt-1.5 line-clamp-2 text-[13px] text-zinc-500 dark:text-zinc-400">
                                {c.cuerpoOCategoria.join(" · ")}
                            </p>
                            {(() => {
                                const av = avisoPlazo(c)
                                return av ? (
                                    <div className="mt-3">
                                        <span
                                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                                            style={{ color: av.color, background: `${av.color}18`, border: `1px solid ${av.color}33` }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {av.texto}
                                        </span>
                                    </div>
                                ) : null
                            })()}
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-zinc-500 dark:text-zinc-400">
                                <span>
                                    <strong className="text-zinc-700 dark:text-zinc-300">Plazas:</strong>{" "}
                                    {c.plazas ?? "Pendiente"}
                                </span>
                                <span>
                                    <strong className="text-zinc-700 dark:text-zinc-300">
                                        Inscripción:
                                    </strong>{" "}
                                    {inscripcionTexto(c)}
                                </span>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/70 pt-3">
                                <span className="text-[11px] text-zinc-400">
                                    Actualizado: {c.ultimaActualizacion}
                                </span>
                                <span
                                    className="text-[13px] font-semibold transition-transform group-hover:translate-x-0.5"
                                    style={{ color: ACCENT }}
                                >
                                    Ver ficha →
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {filtradas.length === 0 && (
                <div className="mt-8 text-center">
                    <p className="text-sm text-zinc-500">
                        No hay convocatorias que coincidan con tu búsqueda.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("")
                            setOrganismo("todos")
                            setEstado("todos")
                            setOrden("recientes")
                        }}
                        className="mt-3 text-[13px] font-semibold"
                        style={{ color: ACCENT }}
                    >
                        Quitar filtros
                    </button>
                </div>
            )}
        </div>
    )
}
