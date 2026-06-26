// Sistema de tema y marca de Gainditu, portado de los componentes Framer.

export type Escala = "auxiliares" | "administrativos" | "gestion" | "superiores"

// Color de acento por escala (idéntico al original)
export const SCALE_COLORS: Record<Escala, string> = {
    auxiliares: "#3B82F6", // azul
    administrativos: "#E8543A", // naranja (acento principal de marca)
    gestion: "#10B981", // verde esmeralda
    superiores: "#8B5CF6", // violeta
}

// Acento principal de marca
export const BRAND_ACCENT = "#E8543A"
// Acento del header (fijo, no cambia con la escala)
export const HEADER_ACCENT = "#E8E6E1"

export interface Theme {
    bg: string
    surface: string
    surfaceHover: string
    border: string
    borderStrong: string
    textMain: string
    textMuted: string
    overlay: string
    modalBg: string
    success: string
    navBg: string
    navText: string
    navTextMuted: string
    navBorder: string
    navSurface: string
    navSurfaceHover: string
}

// Paleta oscuro/claro, idéntica a getTheme() de los componentes Framer.
export function getTheme(dark: boolean): Theme {
    return {
        bg: dark ? "#0B0C10" : "#F5F5F7",
        surface: dark ? "rgba(25,26,35,0.7)" : "rgba(255,255,255,0.85)",
        surfaceHover: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        border: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)",
        borderStrong: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)",
        textMain: dark ? "#FFFFFF" : "#111111",
        textMuted: dark ? "#8B8D98" : "#666870",
        overlay: "rgba(0,0,0,0.6)",
        modalBg: dark ? "#141520" : "#FFFFFF",
        success: "#22C55E",
        navBg: "rgba(10,10,12,0.96)",
        navText: "#FFFFFF",
        navTextMuted: "rgba(255,255,255,0.62)",
        navBorder: "rgba(255,255,255,0.10)",
        navSurface: "rgba(255,255,255,0.07)",
        navSurfaceHover: "rgba(255,255,255,0.12)",
    }
}
