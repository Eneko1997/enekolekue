import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()
    const routes = [
        { path: "/", priority: 1, freq: "weekly" as const },
        { path: "/dashboard", priority: 0.9, freq: "weekly" as const },
        { path: "/ley-39-2015", priority: 0.8, freq: "monthly" as const },
        { path: "/constitucion", priority: 0.8, freq: "monthly" as const },
        { path: "/fechas-opes", priority: 0.7, freq: "weekly" as const },
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
