import { ImageResponse } from "next/og"

export const alt = "Gainditu — Tests OPE Gobierno Vasco 2026 (IVAP)"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "80px",
                    background: "#0B0C10",
                    color: "#FFFFFF",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", fontSize: 40, fontWeight: 800, marginBottom: 24 }}>
                    <span>gain</span>
                    <span style={{ color: "#10B981" }}>ditu</span>
                    <span>.</span>
                </div>
                <div
                    style={{
                        fontSize: 64,
                        fontWeight: 800,
                        lineHeight: 1.1,
                        maxWidth: 900,
                    }}
                >
                    Tests OPE Gobierno Vasco 2026
                </div>
                <div
                    style={{
                        fontSize: 32,
                        color: "#8B8D98",
                        marginTop: 24,
                        maxWidth: 900,
                    }}
                >
                    Temario oficial IVAP · Auxiliares, Administrativos, Gestión y
                    Superiores
                </div>
            </div>
        ),
        { ...size }
    )
}
