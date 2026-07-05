"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "@/lib/use-theme"
import { BRAND_ACCENT } from "@/lib/theme"

export interface TemaTest {
    id: string
    tema?: string
    titulo: string
    preguntas: number
}

function Badge({ pct, accent }: { pct: number; accent: string }) {
    const color = pct >= 70 ? "#22C55E" : accent
    return (
        <span
            style={{
                fontSize: "10px",
                fontWeight: 700,
                color,
                background: `${color}18`,
                border: `1px solid ${color}30`,
                padding: "2px 7px",
                borderRadius: "100px",
            }}
        >
            {pct}%
        </span>
    )
}

/**
 * Cuadrícula de tests de un tema concreto (Ley 39/2015, Constitución…).
 * Portado del componente Framer TestsLey39: muestra progreso si hay sesión.
 */
export default function TemaTests({
    tests,
    accent = BRAND_ACCENT,
}: {
    tests: TemaTest[]
    accent?: string
}) {
    const [progress, setProgress] = useState<Record<string, any>>({})
    const { dark } = useTheme()

    useEffect(() => {
        const supabase = createClient()
        const ids = tests.map((t) => t.id)
        supabase.auth.getSession().then(async ({ data }) => {
            const session = data.session
            if (!session) return
            const { data: rows } = await supabase
                .from("test_progress")
                .select("*")
                .eq("user_id", session.user.id)
                .in("test_id", ids)
            if (!Array.isArray(rows)) return
            const map: Record<string, any> = {}
            rows.forEach((r: any) => {
                map[r.test_id] = r
            })
            setProgress(map)
        })
    }, [tests])

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "10px",
            }}
        >
            {tests.map((test) => {
                const prog = progress[test.id]
                return (
                    <motion.a
                        key={test.id}
                        href={`/test?id=${test.id}&accent=${encodeURIComponent(accent)}`}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: dark ? "#18181B" : "#FFFFFF",
                            border: `1px solid ${dark ? "#27272A" : "#E4E4E7"}`,
                            borderRadius: "16px",
                            padding: "16px",
                            boxShadow: "0 1px 2px rgba(9,9,11,0.04)",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            position: "relative",
                            overflow: "hidden",
                            textDecoration: "none",
                        }}
                    >
                        {prog && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    height: "3px",
                                    width: `${prog.mejor_porcentaje}%`,
                                    background:
                                        prog.mejor_porcentaje >= 70
                                            ? "#22C55E"
                                            : accent,
                                }}
                            />
                        )}
                        {test.tema && (
                            <div
                                style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    color: accent,
                                    letterSpacing: "0.4px",
                                    paddingTop: prog ? "4px" : 0,
                                }}
                            >
                                {test.tema}
                            </div>
                        )}
                        <div
                            style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                lineHeight: 1.4,
                                color: dark ? "#FAFAFA" : "#09090B",
                            }}
                        >
                            {test.titulo}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "11px",
                                    color: dark ? "#A1A1AA" : "#71717A",
                                    background: dark ? "#27272A" : "#F4F4F5",
                                    padding: "2px 8px",
                                    borderRadius: "100px",
                                }}
                            >
                                {test.preguntas} preguntas
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                            >
                                {prog && (
                                    <Badge
                                        pct={Math.round(prog.mejor_porcentaje)}
                                        accent={accent}
                                    />
                                )}
                                <span style={{ color: accent, fontSize: "14px" }}>
                                    →
                                </span>
                            </div>
                        </div>
                    </motion.a>
                )
            })}
        </div>
    )
}
