"use client"

// Pantalla interna SOLO de redes sociales (separada de Captación). Dos categorías:
//  • Convocatorias: un borrador por convocatoria abierta (auto + curadas del GV).
//  • Contenido: posts orgánicos de promo natural (herramientas, premium, exámenes, técnica, motivación…).
// Cada categoría tiene versión X (con botón "Publicar en X" por intent) y LinkedIn (copiar; cuenta aún no creada).
// El estado "hecho/ocultar" se guarda en localStorage por categoría+red. Gate por email admin.

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { esAdminEmail } from "@/lib/admin"
import { borradorX, borradorLinkedIn, convocatoriasCuradas, POSTS_ORGANICOS, POSTS_INTERACCION, type Conv } from "@/lib/social/drafts"

const ACCENT = "#10B981"
type Categoria = "convocatorias" | "contenido" | "interaccion"
type Red = "x" | "linkedin"
type Item = { id: string; tema: string; x: string; li: string; opciones?: string[] }

function claveLS(cat: Categoria, red: Red) { return `gainditu_hechos_${cat}_${red}_v1` }
function leer(k: string): Set<string> {
    try { return new Set(JSON.parse(localStorage.getItem(k) || "[]")) } catch { return new Set() }
}
function guardar(k: string, s: Set<string>) {
    try { localStorage.setItem(k, JSON.stringify([...s])) } catch { /* noop */ }
}

export default function RedesSociales() {
    const [gate, setGate] = useState<"cargando" | "ok" | "denegado">("cargando")
    const [convs, setConvs] = useState<Conv[]>([])
    const [cat, setCat] = useState<Categoria>("convocatorias")
    const [red, setRed] = useState<Red>("x")
    const [hechos, setHechos] = useState<Set<string>>(new Set())
    const [copiado, setCopiado] = useState<string | null>(null)

    useEffect(() => {
        ;(async () => {
            const supabase = createClient()
            const { data: u } = await supabase.auth.getUser()
            if (!esAdminEmail(u.user?.email)) { setGate("denegado"); return }
            setGate("ok")
            const curadas = convocatoriasCuradas()
            // Auto (ingeridas de la BD) ordenadas por MÁS RECIENTES primero, para que las
            // convocatorias añadidas estos días salgan arriba y sea fácil hacerles su post.
            const { data } = await supabase
                .from("convocatorias_auto").select("slug,nombre,plazas,organismo,created_at")
                .eq("estado", "inscripcion-abierta")
                .order("created_at", { ascending: false })
                .limit(80)
            const auto = ((data as any[]) || []).map((r) => ({
                slug: r.slug, nombre: r.nombre, plazas: r.plazas, organismo: r.organismo,
            })) as Conv[]
            // Primero las auto (recientes), después las curadas del GV.
            const vistos = new Set<string>()
            const todas = [...auto, ...curadas].filter((c) => !vistos.has(c.slug) && vistos.add(c.slug))
            setConvs(todas)
        })()
    }, [])

    // Recarga el estado hecho/ocultar al cambiar de categoría o red
    useEffect(() => { setHechos(leer(claveLS(cat, red))) }, [cat, red])

    const items: Item[] = useMemo(() => {
        if (cat === "convocatorias") return convs.map((c) => ({ id: c.slug, tema: "", x: borradorX(c), li: borradorLinkedIn(c) }))
        const fuente = cat === "interaccion" ? POSTS_INTERACCION : POSTS_ORGANICOS
        return fuente.map((p) => ({ id: p.id, tema: p.tema, x: p.x, li: p.linkedin, opciones: p.opciones }))
    }, [cat, convs])

    const pendientes = useMemo(() => items.filter((it) => !hechos.has(it.id)), [items, hechos])
    const texto = (it: Item) => (red === "x" ? it.x : it.li)

    function marcar(id: string) { const s = new Set(hechos); s.add(id); setHechos(s); guardar(claveLS(cat, red), s) }
    function restaurar() { const s = new Set<string>(); setHechos(s); guardar(claveLS(cat, red), s) }
    async function copiar(it: Item) {
        try { await navigator.clipboard.writeText(texto(it)); setCopiado(it.id); setTimeout(() => setCopiado(null), 1500) } catch { /* noop */ }
    }
    function publicarX(it: Item) {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(it.x)}`, "_blank", "noopener,noreferrer")
    }

    if (gate === "cargando") return <p className="text-[14px] text-zinc-500">Cargando…</p>
    if (gate === "denegado")
        return (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <h1 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Acceso restringido</h1>
                <p className="mt-2 text-[14px] text-zinc-500">Esta pantalla es solo para el equipo de Gainditu.</p>
            </div>
        )

    const Seg = <T extends string>({ value, set, opts }: { value: T; set: (v: T) => void; opts: [T, string][] }) => (
        <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-100/70 p-1 dark:border-zinc-800 dark:bg-zinc-900/70">
            {opts.map(([id, label]) => (
                <button key={id} onClick={() => set(id)}
                    className={`rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors ${value === id ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"}`}>
                    {label}
                </button>
            ))}
        </div>
    )

    return (
        <div>
            <div>
                <span className="inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide" style={{ color: ACCENT, borderColor: `${ACCENT}55` }}>Interno</span>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">Redes sociales</h1>
                <p className="mt-1 text-[14px] text-zinc-500">Borradores listos. Elige categoría y red, revisa y publica.</p>
            </div>

            {/* Plan semanal sugerido (interno) */}
            <details className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <summary className="cursor-pointer select-none text-[13.5px] font-semibold text-zinc-700 dark:text-zinc-200">📅 Plan semanal sugerido (interno)</summary>
                <ul className="mt-2.5 space-y-1 text-[13px] text-zinc-600 dark:text-zinc-300">
                    <li><b>Lunes</b> — Arranque de semana / motivación · <span className="text-zinc-400">Contenido</span></li>
                    <li><b>Martes</b> — Técnica de estudio por perfil · <span className="text-zinc-400">Contenido</span></li>
                    <li><b>Miércoles</b> — Convocatoria destacada · <span className="text-zinc-400">Convocatorias</span></li>
                    <li><b>Jueves</b> — Encuesta · <span className="text-zinc-400">Interacción</span></li>
                    <li><b>Viernes</b> — Producto/valor suave (herramientas, exámenes, premium) · <span className="text-zinc-400">Contenido</span></li>
                    <li><b>Sábado</b> — Pregunta a la comunidad · <span className="text-zinc-400">Interacción</span></li>
                    <li><b>Domingo</b> — Por qué merece la pena / reflexión · <span className="text-zinc-400">Contenido</span></li>
                </ul>
                <p className="mt-2.5 text-[12px] text-zinc-400">1 post al día basta. Alterna X y LinkedIn. Empieza fijando el post de presentación (Interacción). Ve marcando “Hecho” para no repetir.</p>
            </details>

            {/* Categoría: convocatorias vs contenido orgánico */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
                <Seg value={cat} set={setCat} opts={[["convocatorias", "Convocatorias"], ["contenido", "Contenido"], ["interaccion", "Interacción"]]} />
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <Seg value={red} set={setRed} opts={[["x", "X (Twitter)"], ["linkedin", "LinkedIn"]]} />
            </div>

            <p className="mt-3 text-[13px] text-zinc-500">
                {cat === "convocatorias"
                    ? "Un post por convocatoria abierta (datos + link a la ficha)."
                    : cat === "interaccion"
                        ? "Presentación, encuestas y preguntas para la comunidad. Empieza fijando el post de presentación."
                        : "Posts orgánicos de promo natural: herramientas, premium, exámenes oficiales, técnica de estudio y motivación."}
            </p>

            {red === "linkedin" && (
                <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    Publica desde tu página de empresa: copia el borrador y pégalo en «Empezar una publicación». LinkedIn no permite dejar el texto pre-escrito por enlace.
                </div>
            )}

            {cat === "interaccion" && (
                <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    Las <b>encuestas</b> hay que crearlas como encuesta nativa: pulsa publicar y añade a mano las opciones que ves en cada tarjeta. Las preguntas son para responder en comentarios.
                </div>
            )}

            <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full px-3 py-1 text-[12px] font-bold" style={{ color: ACCENT, backgroundColor: `${ACCENT}1A` }}>{pendientes.length} pendientes</span>
                <button onClick={restaurar} className="text-[13px] font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">Volver a mostrar ocultados</button>
            </div>

            {pendientes.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
                    <p className="text-[14px] text-zinc-500">No hay borradores pendientes aquí.</p>
                </div>
            ) : (
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {pendientes.map((it) => (
                        <div key={it.id} className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                            {it.tema && <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-zinc-400">{it.tema}</div>}
                            <pre className="whitespace-pre-wrap break-words font-sans text-[13.5px] leading-snug text-zinc-800 dark:text-zinc-200">{texto(it)}</pre>
                            {it.opciones && it.opciones.length > 0 && (
                                <div className="mt-2 rounded-lg bg-white p-2.5 dark:bg-zinc-900/50">
                                    <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Opciones de la encuesta</div>
                                    <ul className="mt-1 space-y-0.5">
                                        {it.opciones.map((o, k) => <li key={k} className="text-[13px] text-zinc-700 dark:text-zinc-200">• {o}</li>)}
                                    </ul>
                                </div>
                            )}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {red === "x" ? (
                                    <button onClick={() => publicarX(it)} className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]" style={{ backgroundColor: ACCENT }}>Publicar en X</button>
                                ) : (
                                    <a href="https://www.linkedin.com/company/gainditu-oposiciones/" target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]" style={{ backgroundColor: ACCENT }}>Abrir página</a>
                                )}
                                <button onClick={() => copiar(it)} className="rounded-full border border-zinc-300 px-3.5 py-1.5 text-[13px] font-semibold text-zinc-600 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white">
                                    {copiado === it.id ? "¡Copiado!" : "Copiar"}
                                </button>
                                <button onClick={() => marcar(it.id)} className="ml-auto rounded-full px-3 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">Hecho / ocultar</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
