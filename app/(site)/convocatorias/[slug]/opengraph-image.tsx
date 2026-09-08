import { ImageResponse } from "next/og"
import { getConvocatoria, ESTADOS } from "@/lib/data/convocatorias"
import { getOrganismo } from "@/lib/data/organismos"

export const alt = "Convocatoria de oposición en Euskadi — Gainditu"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const c = getConvocatoria(slug)
    const estado = c ? ESTADOS[c.estado] : null
    const org = c ? getOrganismo(c.organismo)?.nombre ?? "" : ""
    const nombre = c?.nombre ?? "Convocatorias de oposiciones de Euskadi"
    const examen = c?.fechasClave.find((f) => /examen/i.test(f.etiqueta))
    const dato = c
        ? c.plazas
            ? `${c.plazas} plazas`
            : examen?.fecha
              ? `Examen: ${examen.fecha}`
              : "Plazas y fechas pendientes de BOPV"
        : ""

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px",
                    background: "#0B0C10",
                    color: "#FFFFFF",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", fontSize: 38, fontWeight: 800 }}>
                        <span>gain</span>
                        <span style={{ color: "#10B981" }}>ditu</span>
                        <span>.</span>
                    </div>
                    {estado && (
                        <div
                            style={{
                                display: "flex",
                                fontSize: 26,
                                fontWeight: 700,
                                color: estado.color,
                                border: `2px solid ${estado.color}`,
                                borderRadius: 999,
                                padding: "8px 22px",
                            }}
                        >
                            {estado.label}
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    {org ? (
                        <div style={{ display: "flex", fontSize: 28, color: "#8B8D98", marginBottom: 16 }}>
                            {org}
                        </div>
                    ) : null}
                    <div style={{ display: "flex", fontSize: 62, fontWeight: 800, lineHeight: 1.08, maxWidth: 1050 }}>
                        {nombre}
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#10B981" }}>
                        {dato}
                    </div>
                    <div style={{ display: "flex", fontSize: 24, color: "#8B8D98" }}>
                        gaindituoposiciones.com
                    </div>
                </div>
            </div>
        ),
        { ...size }
    )
}
