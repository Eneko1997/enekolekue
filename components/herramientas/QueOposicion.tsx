"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CONVOCATORIAS } from "@/lib/data/convocatorias"
import { getOrganismo } from "@/lib/data/organismos"

const ACCENT = "#10B981"

type Area = "administracion" | "sanidad" | "seguridad" | "educacion"
type TitId = "e" | "c2" | "c1" | "a"
type EuskId = "ninguno" | "b1" | "b2" | "c1"

const AREA_ORGANISMOS: Record<Area, string[]> = {
    administracion: ["gobierno-vasco", "diputaciones-forales", "administracion-local"],
    sanidad: ["osakidetza"],
    seguridad: ["ertzaintza", "bomberos"],
    educacion: ["educacion"],
}

const TITULACIONES: { id: TitId; label: string }[] = [
    { id: "e", label: "Sin titulación / EGB" },
    { id: "c2", label: "Graduado ESO" },
    { id: "c1", label: "Bachiller o FP superior" },
    { id: "a", label: "Grado universitario" },
]

// A qué grupo/escala da acceso cada titulación (art. 76 EBEP): siempre el tuyo
// y todos los inferiores. Tracks = tests de Gainditu que le corresponden.
const TITULACION_INFO: Record<
    TitId,
    { grupos: string; detalle: string; tracks: { label: string; href: string }[] }
> = {
    e: {
        grupos: "Agrupaciones Profesionales (AP)",
        detalle:
            "Plazas de subalterno, conserje, personal de servicios y apoyo. No exigen titulación académica.",
        tracks: [{ label: "Tests de Personal de Apoyo", href: "/oposiciones/personal-de-apoyo" }],
    },
    c2: {
        grupos: "C2 y AP",
        detalle:
            "Auxiliar administrativo/a (C2) y todas las plazas de grupo inferior. El Graduado en ESO es el requisito del grupo C2.",
        tracks: [{ label: "Tests de Personal de Apoyo", href: "/oposiciones/personal-de-apoyo" }],
    },
    c1: {
        grupos: "C1, C2 y AP",
        detalle:
            "Administrativo/a (C1) y todas las plazas de grupos inferiores. Bachiller o FP de grado superior es el requisito del grupo C1.",
        tracks: [{ label: "Tests de Administrativo", href: "/oposiciones/administrativo" }],
    },
    a: {
        grupos: "A1, A2 y todos los inferiores",
        detalle:
            "Técnico/a de Gestión (A2), Técnico/a Superior (A1) y cuerpos docentes. Un grado universitario abre todos los grupos.",
        tracks: [
            { label: "Tests de Técnico de Gestión", href: "/oposiciones/tecnico-gestion" },
            { label: "Tests de Técnico Superior", href: "/oposiciones/tecnico-superior" },
        ],
    },
}

const EUSKERAS: { id: EuskId; label: string }[] = [
    { id: "ninguno", label: "Ninguno" },
    { id: "b1", label: "B1 (PL1)" },
    { id: "b2", label: "B2 (PL2)" },
    { id: "c1", label: "C1 o más (PL3/PL4)" },
]

// Qué desbloquea cada nivel en el sistema de perfiles lingüísticos de Euskadi.
const EUSKERA_INFO: Record<EuskId, string> = {
    ninguno:
        "Sin perfil acreditado solo puedes presentarte a las plazas sin perfil lingüístico preceptivo, y el euskera no te sumará como mérito. Acreditar un PL amplía mucho tus opciones.",
    b1: "Con B1 (PL1) cumples el perfil en las plazas de PL1 preceptivo. En plazas con PL2 o superior, si el euskera no es preceptivo, te puntúa como mérito.",
    b2: "Con B2 (PL2) cumples el perfil en las plazas de PL1 y PL2 preceptivo, que son la mayoría de las administrativas. En PL3/PL4 te cuenta como mérito si no es preceptivo.",
    c1: "Con C1 o más (PL3/PL4) cumples el perfil en prácticamente cualquier plaza, incluidas las de perfil alto. Es el nivel que más puertas abre.",
}

const AREAS: { id: Area; label: string }[] = [
    { id: "administracion", label: "Administración" },
    { id: "sanidad", label: "Sanidad (Osakidetza)" },
    { id: "seguridad", label: "Seguridad (Ertzaintza/Bomberos)" },
    { id: "educacion", label: "Educación (docentes)" },
]

// Aviso cuando la titulación no alcanza el requisito típico del área.
function avisoArea(area: Area, tit: TitId): string | null {
    if (area === "educacion" && tit !== "a")
        return "Las plazas docentes exigen titulación universitaria (y el Máster de Profesorado para Secundaria). Con tu titulación aún no cumplirías el requisito de acceso."
    if (area === "seguridad" && (tit === "e" || tit === "c2"))
        return "El ingreso en la Ertzaintza (escala básica) exige Bachiller o FP de grado superior. Con tu titulación no cumplirías el requisito de acceso todavía."
    if (area === "sanidad" && tit === "e")
        return "La mayoría de categorías de Osakidetza pide como mínimo el Graduado en ESO (grupo C2); las plazas de personal subalterno son limitadas."
    return null
}

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
    const [titulacion, setTitulacion] = useState<TitId | null>(null)
    const [euskera, setEuskera] = useState<EuskId | null>(null)
    const [area, setArea] = useState<Area | null>(null)

    const completo = titulacion && euskera && area
    const recomendadas = useMemo(() => {
        if (!area) return []
        const slugs = AREA_ORGANISMOS[area]
        return CONVOCATORIAS.filter((c) => slugs.includes(c.organismo))
    }, [area])

    const tit = titulacion ? TITULACION_INFO[titulacion] : null
    const aviso = completo ? avisoArea(area, titulacion) : null

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

            {completo && tit && (
                <div className="mt-6 space-y-5 border-t border-zinc-100 dark:border-zinc-800 pt-5">
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Tu diagnóstico</h3>

                    {aviso && (
                        <div
                            className="rounded-xl border px-4 py-3 text-[13px] leading-relaxed"
                            style={{ borderColor: "#f59e0b55", background: "#f59e0b12", color: "inherit" }}
                        >
                            <span className="font-bold" style={{ color: "#b45309" }}>
                                Ojo:{" "}
                            </span>
                            {aviso}
                        </div>
                    )}

                    {/* Grupo según titulación */}
                    <div>
                        <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                            A qué grupo puedes opositar
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                            <span className="font-semibold" style={{ color: ACCENT }}>
                                {tit.grupos}
                            </span>
                            . {tit.detalle}
                        </p>
                    </div>

                    {/* Euskera */}
                    <div>
                        <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                            Qué te aporta tu nivel de euskera
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {EUSKERA_INFO[euskera]}
                        </p>
                    </div>

                    {/* Tests por los que empezar */}
                    <div>
                        <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                            Empieza a practicar
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {tit.tracks.map((t) => (
                                <Link
                                    key={t.href}
                                    href={t.href}
                                    className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
                                    style={{ background: ACCENT }}
                                >
                                    {t.label} →
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Convocatorias del área */}
                    {recomendadas.length > 0 && (
                        <div>
                            <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                                Convocatorias de tu área en Euskadi
                            </div>
                            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                </div>
            )}

            <p className="mt-5 text-[12px] text-zinc-500 dark:text-zinc-400">
                Orientativo. Los grupos de titulación siguen el EBEP y las equivalencias de euskera
                (PL) el sistema de perfiles de Euskadi; cada plaza fija sus propios requisitos y su
                fecha de preceptividad. Confírmalos siempre en la ficha oficial de cada convocatoria.
            </p>
        </div>
    )
}
