// Sistema de tema y marca de Gainditu, portado de los componentes Framer.

export type Escala = "auxiliares" | "administrativos" | "gestion" | "superiores"

// Color de etiqueta por escala — SOLO se usa como pequeño distintivo (puntos,
// indicadores) para diferenciar escalas en el dashboard. El acento real de la
// web es siempre BRAND_ACCENT.
export const SCALE_COLORS: Record<Escala, string> = {
    auxiliares: "#3B82F6", // azul
    administrativos: "#F43F5E", // rosa
    gestion: "#14B8A6", // teal
    superiores: "#8B5CF6", // violeta
}

// Acento principal de marca (único color de la web)
export const BRAND_ACCENT = "#10B981" // esmeralda
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
