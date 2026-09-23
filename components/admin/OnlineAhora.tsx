"use client"

// Visor de presencia (solo admin, dentro de Captación): quién está online y en qué pantalla.
// Sondea la RPC presencia_activa cada 20 s (sin Realtime). El tiempo conectado se refresca cada 30 s.

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

type Fila = { name: string; path: string; since: string }

// Tiempo que lleva conectado (desde que abrió la web esa pestaña)
function tiempoConectado(sinceIso: string): string {
    const t = new Date(sinceIso).getTime()
    const s = Math.max(0, Math.floor((Date.now() - t) / 1000))
    if (s < 45) return "acaba de entrar"
    const m = Math.floor(s / 60)
    if (m < 1) return "menos de 1 min"
    if (m < 60) return `${m} min conectado`
    const h = Math.floor(m / 60)
    const rm = m % 60
    return rm ? `${h} h ${rm} min conectado` : `${h} h conectado`
}

// Máximo tiempo conectado para seguir mostrando una sesión (evita pestañas fantasma
// abiertas durante horas/días que no son actividad real).
const MAX_HORAS = 6

// Páginas de norma (temario/SEO): ruta → nombre corto de la materia.
const NORMA_LABELS: Record<string, string> = {
    "/constitucion": "Constitución",
    "/ley-39-2015": "Ley 39/2015",
    "/ley-40-2015": "Ley 40/2015",
    "/proteccion-datos": "Protección de datos",
    "/estatuto-de-autonomia": "Estatuto de Autonomía",
    "/empleo-publico": "Empleo público",
    "/prevencion-riesgos-laborales": "Prevención de riesgos",
    "/hacienda-publica": "Hacienda pública",
    "/igualdad": "Igualdad",
    "/union-europea": "Unión Europea",
    "/administracion-electronica": "Admin. electrónica",
    "/euskera": "Euskera",
}

// Traduce la ruta a un nombre de pantalla legible
function pantalla(path: string): string {
    if (path === "/") return "Inicio"
    if (NORMA_LABELS[path]) return `Temario · ${NORMA_LABELS[path]}`
    if (path.startsWith("/convocatorias/")) return "Ficha de convocatoria"
    if (path === "/convocatorias") return "Convocatorias"
    if (path.startsWith("/oposiciones")) return "Oposiciones"
    if (path.startsWith("/test")) return "Test"
    if (path.startsWith("/simulacro")) return "Simulacro"
    if (path.startsWith("/mi-plan")) return "Mi plan"
    if (path.startsWith("/herramientas")) return "Herramientas"
    if (path.startsWith("/temario")) return "Temario"
    if (path.startsWith("/guias")) return "Guías"
    if (path.startsWith("/actualidad")) return "Actualidad"
    if (path.startsWith("/perfil") || path.startsWith("/profile") || path.startsWith("/cuenta")) return "Perfil"
    if (path.startsWith("/payment") || path.startsWith("/pago")) return "Pago"
    if (path.startsWith("/login") || path.startsWith("/registro") || path.startsWith("/auth")) return "Acceso"
    if (path === "/admin/captacion") return "Captación (admin)"
    if (path === "/admin/redes") return "Redes sociales (admin)"
    return path
}

export default function OnlineAhora() {
    const [filas, setFilas] = useState<Fila[]>([])
    const [, setTick] = useState(0)

    useEffect(() => {
        const supabase = createClient()
        let parado = false
        const cargar = async () => {
            try {
                const { data } = await supabase.rpc("presencia_activa")
                if (!parado) {
                    const arr = (data as Fila[]) || []
                    arr.sort((a, b) => (a.name === "Invitado" ? 1 : 0) - (b.name === "Invitado" ? 1 : 0) || a.name.localeCompare(b.name))
                    setFilas(arr)
                }
            } catch { /* noop */ }
        }
        cargar()
        const idPoll = setInterval(cargar, 20000)       // vuelve a pedir la lista
        const idTick = setInterval(() => setTick((t) => t + 1), 30000)  // refresca el tiempo
        return () => { parado = true; clearInterval(idPoll); clearInterval(idTick) }
    }, [])

    // Oculta sesiones fantasma (pestañas abiertas más de MAX_HORAS): no son actividad real.
    const limite = MAX_HORAS * 60 * 60 * 1000
    const visibles = filas.filter((f) => Date.now() - new Date(f.since).getTime() <= limite)

    return (
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: ACCENT }} />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                </span>
                <h2 className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Ahora mismo</h2>
                <span className="ml-1 rounded-full px-2.5 py-0.5 text-[12px] font-bold" style={{ color: ACCENT, backgroundColor: `${ACCENT}1A` }}>{visibles.length} online</span>
            </div>

            {visibles.length === 0 ? (
                <p className="mt-4 text-[14px] text-zinc-500">No hay nadie conectado en este momento.</p>
            ) : (
                <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {visibles.map((f, i) => (
                        <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                            <div className="min-w-0">
                                <div className="truncate text-[14px] font-medium text-zinc-800 dark:text-zinc-200">
                                    {f.name === "Invitado" ? "Invitado" : f.name}
                                </div>
                                <div className="text-[12px] text-zinc-400">{tiempoConectado(f.since)}</div>
                            </div>
                            <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-[12.5px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                {pantalla(f.path)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
