"use client"

import { useEffect, useMemo, useState } from "react"
import {
    agruparPorArea,
    getCatalogo,
    type EscalaKey,
} from "@/components/dashboard/catalogo"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "@/lib/use-theme"

const ACCENT = "#10B981"
const LIGHT_T = {
    border: "#E4E4E7",
    surface: "#FFFFFF",
    surfaceHover: "#FAFAFA",
    textMain: "#09090B",
    textMuted: "#71717A",
}
const DARK_T = {
    border: "#27272A",
    surface: "#18181B",
    surfaceHover: "#27272A",
    textMain: "#FAFAFA",
    textMuted: "#A1A1AA",
}

type Progreso = Record<string, { mejor_porcentaje: number }>

function startTest(id: string) {
    window.location.href = `/test?id=${id}&accent=${encodeURIComponent(ACCENT)}`
}

export default function EscalaTests({
    escala,
    nombre,
}: {
    escala: EscalaKey
    nombre: string
}) {
    const [search, setSearch] = useState("")
    const [vista, setVista] = useState<"bloques" | "oficial">("bloques")
    const [progress, setProgress] = useState<Progreso>({})
    const { dark } = useTheme()
    const t = dark ? DARK_T : LIGHT_T

    // Progreso solo si hay sesión (páginas públicas)
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getSession().then(({ data }) => {
            const uid = data.session?.user?.id
            if (!uid) return
            supabase
                .from("test_progress")
                .select("*")
                .eq("user_id", uid)
                .then(({ data }) => {
                    if (!Array.isArray(data)) return
                    const m: Progreso = {}
                    data.forEach((r: any) => (m[r.test_id] = r))
                    setProgress(m)
                })
        })
    }, [])

    const data = useMemo(() => getCatalogo(escala), [escala])

    const filteredData = useMemo(() => {
        if (search.trim() === "") return data
        const q = search.toLowerCase()
        return data
            .map((b) => ({
                ...b,
                tests: b.tests.filter(
                    (x) =>
                        x.titulo.toLowerCase().includes(q) ||
                        (x.tema && x.tema.toLowerCase().includes(q))
                ),
            }))
            .filter((b) => b.tests.length > 0)
    }, [data, search])

    const bloquesVista = useMemo(
        () => (vista === "bloques" ? agruparPorArea(filteredData) : filteredData),
        [filteredData, vista]
    )
    const oficialTests = useMemo(
        () => filteredData.flatMap((b) => b.tests),
        [filteredData]
    )

    return (
        <section id="tests-escala" className="px-5 py-10">
            <div className="mx-auto max-w-4xl">
                <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
                    Tests de {nombre}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Practica el temario oficial del IVAP tema a tema. Cámbialo entre
                    vista por bloques temáticos o el temario oficial completo.
                </p>

                {/* Buscador */}
                <div style={{ marginTop: 22, position: "relative" }}>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar tema o test…"
                        style={{
                            width: "100%",
                            padding: "13px 16px",
                            borderRadius: 14,
                            border: `1px solid ${t.border}`,
                            background: t.surface,
                            color: t.textMain,
                            fontSize: 15,
                            outline: "none",
                        }}
                    />
                </div>

                {/* Toggle de vista */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        margin: "18px 0",
                        flexWrap: "wrap",
                    }}
                >
                    {(
                        [
                            { id: "bloques", label: "Vista por bloques", hint: "Recomendada" },
                            { id: "oficial", label: "Temario oficial", hint: "" },
                        ] as const
                    ).map((v) => {
                        const activo = vista === v.id
                        return (
                            <button
                                key={v.id}
                                type="button"
                                aria-pressed={activo}
                                onClick={() => setVista(v.id)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 7,
                                    padding: "8px 14px",
                                    borderRadius: 100,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    border: `1px solid ${activo ? ACCENT : t.border}`,
                                    background: activo ? ACCENT : t.surface,
                                    color: activo ? "#fff" : t.textMuted,
                                    transition: "all 0.2s",
                                }}
                            >
                                {v.label}
                                {v.hint && (
                                    <span
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.04em",
                                            padding: "1px 6px",
                                            borderRadius: 100,
                                            background: activo
                                                ? "rgba(255,255,255,0.22)"
                                                : `${ACCENT}22`,
                                            color: activo ? "#fff" : ACCENT,
                                        }}
                                    >
                                        {v.hint}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* VISTA TEMARIO OFICIAL */}
                {vista === "oficial" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {oficialTests.map((test) => {
                            const prog = progress[test.id]
                            const sinPreguntas = test.preguntas === 0
                            const hecho = !!prog && prog.mejor_porcentaje >= 50
                            return (
                                <button
                                    key={test.id}
                                    type="button"
                                    disabled={sinPreguntas}
                                    onClick={() => !sinPreguntas && startTest(test.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        width: "100%",
                                        textAlign: "left",
                                        padding: "11px 14px",
                                        borderRadius: 12,
                                        border: `1px solid ${t.border}`,
                                        background: t.surface,
                                        cursor: sinPreguntas ? "default" : "pointer",
                                        opacity: sinPreguntas ? 0.55 : 1,
                                    }}
                                >
                                    <span
                                        style={{
                                            flexShrink: 0,
                                            width: 26,
                                            height: 26,
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            border: `2px solid ${hecho ? ACCENT : t.border}`,
                                            background: hecho ? ACCENT : "transparent",
                                            color: hecho ? "#fff" : t.textMuted,
                                        }}
                                    >
                                        {hecho ? "✓" : ""}
                                    </span>
                                    {test.tema && (
                                        <span
                                            style={{
                                                flexShrink: 0,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                color: ACCENT,
                                                minWidth: 42,
                                            }}
                                        >
                                            {test.tema}
                                        </span>
                                    )}
                                    <span
                                        style={{
                                            flex: 1,
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: t.textMain,
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {test.titulo.replace(/^T\.\d+\s*—\s*/, "")}
                                    </span>
                                    <span
                                        style={{
                                            flexShrink: 0,
                                            fontSize: 11,
                                            color: t.textMuted,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {sinPreguntas
                                            ? "Próximamente"
                                            : `${test.preguntas} preg.`}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    /* VISTA POR BLOQUES */
                    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                        {bloquesVista.map((bloque) => (
                            <div key={bloque.bloque}>
                                <h3
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        fontSize: 15,
                                        fontWeight: 700,
                                        color: t.textMain,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 4,
                                            height: 18,
                                            borderRadius: 4,
                                            background: ACCENT,
                                        }}
                                    />
                                    {bloque.bloque}
                                </h3>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                                        gap: 12,
                                    }}
                                >
                                    {bloque.tests.map((test) => {
                                        const prog = progress[test.id]
                                        const sinPreguntas = test.preguntas === 0
                                        return (
                                            <button
                                                key={test.id}
                                                type="button"
                                                disabled={sinPreguntas}
                                                onClick={() =>
                                                    !sinPreguntas && startTest(test.id)
                                                }
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 8,
                                                    textAlign: "left",
                                                    padding: "16px 16px 14px",
                                                    borderRadius: 16,
                                                    border: `1px solid ${t.border}`,
                                                    background: t.surface,
                                                    cursor: sinPreguntas
                                                        ? "default"
                                                        : "pointer",
                                                    opacity: sinPreguntas ? 0.55 : 1,
                                                }}
                                            >
                                                {test.tema && (
                                                    <div
                                                        style={{
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            color: ACCENT,
                                                            letterSpacing: "0.4px",
                                                        }}
                                                    >
                                                        {test.tema}
                                                    </div>
                                                )}
                                                <div
                                                    style={{
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        lineHeight: 1.35,
                                                        color: t.textMain,
                                                    }}
                                                >
                                                    {test.titulo.replace(
                                                        /^T\.\d+\s*—\s*/,
                                                        ""
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: 11,
                                                            color: t.textMuted,
                                                        }}
                                                    >
                                                        {sinPreguntas
                                                            ? "Próximamente"
                                                            : `${test.preguntas} preguntas`}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: 13,
                                                            color: prog
                                                                ? ACCENT
                                                                : t.textMuted,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {prog
                                                            ? `${Math.round(prog.mejor_porcentaje)}%`
                                                            : "→"}
                                                    </span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
