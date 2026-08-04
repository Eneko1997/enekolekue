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

export default function ConvocatoriasList({
    convocatorias,
}: {
    convocatorias: Convocatoria[]
}) {
    const [organismo, setOrganismo] = useState<string>("todos")
    const [estado, setEstado] = useState<string>("todos")

    // Opciones presentes en los datos (no listamos filtros vacíos).
    const organismos = useMemo(
        () => Array.from(new Set(convocatorias.map((c) => c.organismo))),
        [convocatorias]
    )
    const estados = useMemo(
        () => Array.from(new Set(convocatorias.map((c) => c.estado))),
        [convocatorias]
    )

    const filtradas = useMemo(
        () =>
            convocatorias.filter(
                (c) =>
                    (organismo === "todos" || c.organismo === organismo) &&
                    (estado === "todos" || c.estado === estado)
            ),
        [convocatorias, organismo, estado]
    )

    return (
        <div>
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

            {/* Listado */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                <EstadoBadge estado={c.estado} />
                                <span className="text-[11px] text-zinc-400">
                                    {org?.corto}
                                </span>
                            </div>
                            <h3 className="mt-3 text-[15px] font-bold leading-snug text-zinc-950 dark:text-zinc-50">
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
                <p className="mt-8 text-center text-sm text-zinc-500">
                    No hay convocatorias con esos filtros.
                </p>
            )}
        </div>
    )
}
