"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CONVOCATORIAS } from "@/lib/data/convocatorias"
import { getOrganismo } from "@/lib/data/organismos"

const ACCENT = "#10B981"

type Area = "administracion" | "sanidad" | "seguridad" | "educacion"

const AREA_ORGANISMOS: Record<Area, string[]> = {
    administracion: ["gobierno-vasco", "diputaciones-forales", "administracion-local"],
    sanidad: ["osakidetza"],
    seguridad: ["ertzaintza", "bomberos"],
    educacion: ["educacion"],
}

const TITULACIONES = [
    { id: "e", label: "Sin titulación / EGB", nota: "Grupo E: Personal de Apoyo, servicios." },
    { id: "c2", label: "Graduado ESO", nota: "Grupo C2: auxiliares." },
    { id: "c1", label: "Bachiller o FP superior", nota: "Grupo C1: administrativo." },
    { id: "a", label: "Grado universitario", nota: "Grupos A/B: gestión, superior, docentes." },
]
const EUSKERAS = [
    { id: "ninguno", label: "Ninguno" },
    { id: "b1", label: "B1 (PL1)" },
    { id: "b2", label: "B2 (PL2)" },
    { id: "c1", label: "C1 o más (PL3/PL4)" },
]
const AREAS: { id: Area; label: string }[] = [
    { id: "administracion", label: "Administración" },
    { id: "sanidad", label: "Sanidad (Osakidetza)" },
    { id: "seguridad", label: "Seguridad (Ertzaintza/Bomberos)" },
    { id: "educacion", label: "Educación (docentes)" },
]

function Grupo<T extends string>({
    opciones,
    value,
    onChange,
}: {
    opciones: { id: T; label: string }[]
    value: T | null
    onChange: (v: T) => void
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {opciones.map((o) => (
                <button
                    key={o.id}
                    type="button"
                    onClick={() => onChange(o.id)}
                    className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 text-[13px] font-semibold text-zinc-700 dark:text-zinc-200 transition-colors hover:border-zinc-300"
                    style={value === o.id ? { background: ACCENT, borderColor: ACCENT, color: "#fff" } : undefined}
                >
                    {o.label}
                </button>
            ))}
        </div>
    )
}

export default function QueOposicion() {
    const [titulacion, setTitulacion] = useState<string | null>(null)
    const [euskera, setEuskera] = useState<string | null>(null)
    const [area, setArea] = useState<Area | null>(null)

    const completo = titulacion && euskera && area
    const recomendadas = useMemo(() => {
        if (!area) return []
        const slugs = AREA_ORGANISMOS[area]
        return CONVOCATORIAS.filter((c) => slugs.includes(c.organismo))
    }, [area])

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
            <div className="space-y-5">
                <div>
                    <div className="mb-2 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">1. ¿Qué titulación tienes?</div>
                    <Grupo opciones={TITULACIONES} value={titulacion} onChange={setTitulacion} />
                </div>
                <div>
                    <div className="mb-2 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">2. ¿Qué nivel de euskera tienes?</div>
                    <Grupo opciones={EUSKERAS} value={euskera} onChange={setEuskera} />
                </div>
                <div>
                    <div className="mb-2 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">3. ¿Qué área te interesa?</div>
                    <Grupo opciones={AREAS} value={area} onChange={setArea} />
                </div>
            </div>

            {completo && (
                <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-5">
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Oposiciones que encajan</h3>
                    <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                        Con tu nivel de euskera ({EUSKERAS.find((e) => e.id === euskera)?.label}) prioriza
                        las plazas con perfil igual o inferior. Revisa cada ficha para requisitos y
                        fechas.
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {recomendadas.map((c) => (
                            <Link
                                key={c.slug}
                                href={`/convocatorias/${c.slug}`}
                                className="group flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 transition-colors hover:border-zinc-300"
                            >
                                <div>
                                    <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                                        {getOrganismo(c.organismo)?.corto}
                                    </div>
                                    <div className="text-[12px] text-zinc-500 dark:text-zinc-400">{c.nombre}</div>
                                </div>
                                <span className="text-[13px] font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>
                                    →
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <p className="mt-5 text-[12px] text-zinc-500 dark:text-zinc-400">
                Orientativo: cruza tu área de interés con las convocatorias de Euskadi. Cada
                oposición tiene sus propios requisitos de titulación y euskera; confírmalos en la ficha
                oficial de cada convocatoria.
            </p>
        </div>
    )
}
