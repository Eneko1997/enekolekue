"use client"

// Prueba social HONESTA: opositores que han entrado en los últimos 7 días.
// Dato real leído de `pageviews` (RPC pública actividad_publica). Si el número es bajo
// no se muestra nada (evita enseñar una cifra pobre); nunca se infla.

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

type Actividad = { sesiones_7d: number; ciudades_7d: number }

export default function ActividadSemana() {
    const [data, setData] = useState<Actividad | null>(null)

    useEffect(() => {
        const supabase = createClient()
        supabase.rpc("actividad_publica").then(
            ({ data }) => {
                if (data && typeof (data as Actividad).sesiones_7d === "number") {
                    setData(data as Actividad)
                }
            },
            () => {}
        )
    }, [])

    // Umbral de decencia: por debajo de 20 no mostramos (mejor nada que un número flojo).
    if (!data || data.sesiones_7d < 20) return null

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "0 20px", marginTop: "-8px", marginBottom: "8px" }}>
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "7px 14px",
                    borderRadius: "999px",
                    background: "rgba(16,185,129,0.10)",
                    border: "1px solid rgba(16,185,129,0.30)",
                    fontSize: "13px",
                    color: "#047857",
                    lineHeight: 1.3,
                }}
            >
                <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px" }}>
                    <span
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "999px",
                            background: ACCENT,
                            opacity: 0.55,
                            animation: "gd-ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
                        }}
                    />
                    <span style={{ position: "relative", width: "8px", height: "8px", borderRadius: "999px", background: ACCENT }} />
                </span>
                <span>
                    <strong style={{ fontWeight: 800 }}>{data.sesiones_7d.toLocaleString("es-ES")}</strong> opositores han
                    entrado esta semana
                    {data.ciudades_7d >= 5 ? ` · desde ${data.ciudades_7d} localidades` : ""}
                </span>
                <style>{`@keyframes gd-ping{75%,100%{transform:scale(2.2);opacity:0}}`}</style>
            </div>
        </div>
    )
}
