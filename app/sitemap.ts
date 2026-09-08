import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { getConvocatorias } from "@/lib/data/convocatorias-db"
import { NORMATIVAS } from "@/lib/data/temario/normativas"
import { HERRAMIENTAS } from "@/lib/data/herramientas"

// Fecha estable de última actualización del contenido. Se cambia a mano cuando
// se renueva el contenido de forma relevante; así el sitemap no le dice a Google
// que "todo cambió hoy" en cada deploy (eso resta credibilidad a la señal lastmod).
const LAST_MODIFIED = new Date("2026-08-17")

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = LAST_MODIFIED
    const CONVOCATORIAS = await getConvocatorias()
    const routes = [
        { path: "/", priority: 1, freq: "weekly" as const },
        { path: "/simulacro-administrativo-gobierno-vasco", priority: 0.95, freq: "monthly" as const },
        { path: "/simulacro-auxiliar-administrativo-gobierno-vasco", priority: 0.95, freq: "monthly" as const },
        { path: "/simulacro-personal-apoyo-gobierno-vasco", priority: 0.9, freq: "monthly" as const },
        { path: "/simulacro-tecnico-gestion-gobierno-vasco", priority: 0.9, freq: "monthly" as const },
        { path: "/simulacro-tecnico-superior-gobierno-vasco", priority: 0.9, freq: "monthly" as const },
        { path: "/oposiciones/personal-de-apoyo", priority: 0.9, freq: "monthly" as const },
        { path: "/oposiciones/administrativo", priority: 0.9, freq: "monthly" as const },
        { path: "/oposiciones/tecnico-gestion", priority: 0.9, freq: "monthly" as const },
        { path: "/oposiciones/tecnico-superior", priority: 0.9, freq: "monthly" as const },
        { path: "/convocatorias", priority: 0.9, freq: "weekly" as const },
        { path: "/actualidad", priority: 0.85, freq: "weekly" as const },
        ...CONVOCATORIAS.map((c) => ({
            path: `/convocatorias/${c.slug}`,
            priority: 0.8,
            freq: "weekly" as const,
        })),
        { path: "/temario", priority: 0.8, freq: "monthly" as const },
        { path: "/ley-39-2015", priority: 0.8, freq: "monthly" as const },
        { path: "/constitucion", priority: 0.8, freq: "monthly" as const },
        ...NORMATIVAS.map((n) => ({
            path: `/temario/${n.slug}`,
            priority: 0.7,
            freq: "monthly" as const,
        })),
        { path: "/herramientas", priority: 0.7, freq: "monthly" as const },
        ...HERRAMIENTAS.map((h) => ({
            path: `/herramientas/${h.slug}`,
            priority: 0.7,
            freq: "monthly" as const,
        })),
        { path: "/guias", priority: 0.7, freq: "monthly" as const },
        { path: "/guias/como-inscribirse-ope-gobierno-vasco-2026", priority: 0.75, freq: "monthly" as const },
        { path: "/guias/concurso-oposicion-euskadi", priority: 0.7, freq: "monthly" as const },
        { path: "/guias/turnos-de-acceso-oposiciones", priority: 0.7, freq: "monthly" as const },
        { path: "/guias/fases-de-una-oposicion", priority: 0.7, freq: "monthly" as const },
        { path: "/profesores", priority: 0.6, freq: "monthly" as const },
        { path: "/para-academias", priority: 0.5, freq: "monthly" as const },
        { path: "/aviso-legal", priority: 0.2, freq: "yearly" as const },
        { path: "/privacidad", priority: 0.2, freq: "yearly" as const },
        { path: "/cookies", priority: 0.2, freq: "yearly" as const },
    ]
    return routes.map((r) => ({
        url: `${SITE_URL}${r.path}`,
        lastModified: now,
        changeFrequency: r.freq,
        priority: r.priority,
    }))
}
