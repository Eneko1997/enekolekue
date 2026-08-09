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

function Chip({
    activo,
    onClick,
    children,
}: {
    activo: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 text-[13px] font-semibold text-zinc-600 dark:text-zinc-300 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
            style={
                activo
                    ? { background: ACCENT, borderColor: ACCENT, color: "#fff" }
                    : undefined
            }
        >
            {children}
        </button>
    )
}

const normaliza = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

export default function ConvocatoriasList({
    convocatorias,
}: {
    convocatorias: Convocatoria[]
}) {
    const [organismo, setOrganismo] = useState<string>("todos")
    const [estado, setEstado] = useState<string>("todos")
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
        return indexado
            .filter(
                ({ c, texto }) =>
                    (organismo === "todos" || c.organismo === organismo) &&
                    (estado === "todos" || c.estado === estado) &&
                    terminos.every((t) => texto.includes(t))
            )
            .map(({ c }) => c)
    }, [indexado, organismo, estado, query])

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

            {/* Filtros */}
            <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
                        Organismo
                    </span>
                    <Chip activo={organismo === "todos"} onClick={() => setOrganismo("todos")}>
                        Todos
                    </Chip>
                    {organismos.map((slug) => (
                        <Chip key={slug} activo={organismo === slug} onClick={() => setOrganismo(slug)}>
                            {getOrganismo(slug)?.corto ?? slug}
                        </Chip>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-[12px] font-semibold uppercase tracking-wide text-zinc-400">
                        Estado
                    </span>
                    <Chip activo={estado === "todos"} onClick={() => setEstado("todos")}>
                        Todos
                    </Chip>
                    {estados.map((e) => (
                        <Chip key={e} activo={estado === e} onClick={() => setEstado(e)}>
                            {ESTADOS[e].label}
                        </Chip>
                    ))}
                </div>
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
                    const prox = c.fechasClave[0]
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
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-zinc-500 dark:text-zinc-400">
                                <span>
                                    <strong className="text-zinc-700 dark:text-zinc-300">Plazas:</strong>{" "}
                                    {c.plazas ?? "Pendiente"}
                                </span>
                                {prox && (
                                    <span>
                                        <strong className="text-zinc-700 dark:text-zinc-300">
                                            {prox.etiqueta}:
                                        </strong>{" "}
                                        {prox.fecha ?? "Pendiente"}
                                    </span>
                                )}
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
