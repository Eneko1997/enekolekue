import { createClient } from "@supabase/supabase-js"
import {
    CONVOCATORIAS,
    ESTADOS,
    type Convocatoria,
    type EstadoConvocatoria,
} from "./convocatorias"
import { empleoEntidad } from "./entidades-empleo"

// Fusiona las convocatorias CURADAS (en código, verificadas a mano) con las AUTO
// (ingeridas cada 2 días del BOE a la tabla convocatorias_auto). Las curadas mandan:
// si una auto coincide en slug, gana la curada. Si la BD falla, se devuelven solo las
// curadas (la web nunca se queda sin datos).

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ougvtcmqmcutrexxrxvz.supabase.co"
const KEY =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_lfcfMDSYpIDWzy2CWufT_A_NfJbTimc"

// Pista del boletín/origen a partir de la URL, para distinguir enlaces con etiqueta repetida.
function pistaOrigen(url: string): string | null {
    const u = String(url || "").toLowerCase()
    if (/gao-bog|gipuzkoa\.eus/.test(u)) return "BOG"
    if (/bopv|euskadi\.eus|\/eli\//.test(u)) return "BOPV"
    if (/bizkaia\.eus/.test(u)) return "BOB"
    if (/araba\.eus/.test(u)) return "BOTHA"
    if (/boe\.es/.test(u)) return "BOE"
    return null
}

// Una misma convocatoria a veces publica las bases por dos vías (la entidad y el boletín),
// y ambas llegan con la MISMA etiqueta ("Bases de la convocatoria"). Mostrar la etiqueta
// idéntica dos veces confunde: al repetido se le añade su origen (BOG, BOPV…) para diferenciarlo.
function distinguirEtiquetas<T extends { etiqueta: string; url: string }>(enlaces: T[]): T[] {
    const total = new Map<string, number>()
    for (const e of enlaces) total.set(e.etiqueta, (total.get(e.etiqueta) ?? 0) + 1)
    const vistos = new Map<string, number>()
    return enlaces.map((e) => {
        if ((total.get(e.etiqueta) ?? 0) <= 1) return e
        const n = (vistos.get(e.etiqueta) ?? 0) + 1
        vistos.set(e.etiqueta, n)
        if (n === 1) return e // el primero se queda tal cual
        const pista = pistaOrigen(e.url)
        return { ...e, etiqueta: pista ? `${e.etiqueta} (${pista})` : `${e.etiqueta} (${n})` }
    })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(r: any): Convocatoria {
    // Enlace de empleo de la entidad (verificado a mano) como principal, si lo hay.
    const enlacesBase: any[] = r.enlaces_oficiales ?? []
    const emp = empleoEntidad(r.nombre, r.resumen, r.organismo)
    const enlacesOficiales = distinguirEtiquetas(
        emp && !enlacesBase.some((e) => e?.url === emp.url)
            ? [{ etiqueta: emp.etiqueta, url: emp.url }, ...enlacesBase]
            : enlacesBase
    )
    return {
        slug: r.slug,
        organismo: r.organismo,
        nombre: r.nombre,
        cuerpoOCategoria: r.cuerpo_categoria ?? [],
        grupo: r.grupo ?? null,
        estado: (r.estado ?? "bases-publicadas") as EstadoConvocatoria,
        plazas: r.plazas ?? null,
        plazasDetalle: r.plazas_detalle ?? [],
        fechasClave: r.fechas_clave ?? [],
        perfilLinguistico: r.perfil_linguistico ?? null,
        enlacesOficiales,
        boletin: r.boletin ?? null,
        ultimaActualizacion: r.ultima_actualizacion,
        resumen: r.resumen ?? "",
        testsRelacionados: r.tests_relacionados ?? [],
        creadaEn: r.created_at ?? null,
    }
}

// ── Dedup cruzada curadas ↔ auto ─────────────────────────────────────────
// Una misma convocatoria no debe tener dos fichas. Firma por CONTENIDO:
// el puesto (rol) + un token distintivo de la entidad. Si una fila auto coincide
// con una curada, se descarta la auto (las curadas mandan). Ej.: la curada
// "Administrativo/a · Diputación Foral de Gipuzkoa" y la auto "138 plazas de
// administrativo/a" (misma diputación) son la misma → se muestra solo la curada.
const STOP_ENT = new Set([
    "de","del","la","el","los","las","en","para","con","y","a","una","un","plaza","plazas",
    "puesto","puestos","ayuntamiento","udala","diputacion","foral","aldundia","mancomunidad",
    "junta","juntas","generales","cuerpo","escala","agrupacion","profesional","administracion",
    "general","especial","comunidad","autonoma","pais","vasco","euskadi","servicio","servicios",
    "fundacion","sociedad","publica",
])
function normTxt(s: string): string {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
}
function rolFirma(nombre: string): string {
    let s = normTxt(nombre)
    if (s.includes("·")) s = s.split("·")[0]
    s = s.replace(/\(.*?\)/g, " ")
    s = s.replace(/,?\s*(en|para|del|de la|con destino)\s+(el|la)?\s*(ayuntamiento|udala|mancomunidad|merindad|junta|fundacion|sociedad|diputacion|servicio)\b.*/g, " ")
    s = s.replace(/^\s*\(?\d+\)?\s*(plazas?|puestos?)?\s*(de|del)?\s*/, "")
    s = s.replace(/\buna\s+plaza\s+(de|del)?\s*/, "")
    s = s.replace(/\s*reservad[ao]s?.*$/, "")
    s = s.replace(/\/[a-z]+/g, "")
    s = s.replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim()
    return s.replace(/s$/, "")
}
function entFirma(nombre: string, resumen: string): Set<string> {
    let ent = ""
    if (nombre.includes("·")) ent = nombre.split("·").slice(1).join(" ")
    else {
        const m = /convocada por ([^.]+)\./i.exec(resumen) || /ayuntamiento de ([a-zñáéíóúü ]+)/i.exec(nombre)
        ent = m ? m[1] : ""
    }
    return new Set(
        normTxt(ent).replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((t) => t.length >= 4 && !STOP_ENT.has(t))
    )
}
function mismaConv(a: Convocatoria, b: Convocatoria): boolean {
    const ra = rolFirma(a.nombre)
    if (!ra || ra !== rolFirma(b.nombre)) return false
    const ea = entFirma(a.nombre, a.resumen)
    const eb = entFirma(b.nombre, b.resumen)
    for (const t of ea) if (eb.has(t)) return true
    return false
}

function hoyIso(): string { return new Date().toISOString().slice(0, 10) }

// Fecha de FIN de inscripción: la iso más tardía de las fechas de inscripción/plazo/solicitud.
function finInscripcionIso(c: Convocatoria): string | null {
    const isos = (c.fechasClave || [])
        .filter((f) => f?.iso && /inscrip|plazo|solicitud/i.test(f?.etiqueta || ""))
        .map((f) => f.iso as string)
        .sort()
    return isos.length ? isos[isos.length - 1] : null
}

// Recalcula el estado: una "inscripción abierta" cuyo plazo YA venció pasa a "cerrada".
// Así las curadas (estado fijo en código) y cualquier otra se actualizan solas por fecha.
function estadoEfectivo(c: Convocatoria): Convocatoria {
    if (c.estado === "inscripcion-abierta") {
        const fin = finInscripcionIso(c)
        if (fin && fin < hoyIso()) return { ...c, estado: "inscripcion-cerrada" }
    }
    return c
}

// El título SIEMPRE lleva el nº de plazas por delante cuando se conoce (como las automáticas).
// Las curadas usan "Puesto · Entidad" sin contar plazas -> se les antepone "N plazas de …".
// Se salta: las que ya empiezan por número o mencionan "plaza", y las "OPE …" (nombre de programa,
// no una convocatoria de N plazas concretas).
function conPlazasEnTitulo(c: Convocatoria): Convocatoria {
    if (!c.plazas || c.plazas <= 0) return c
    const n = c.nombre
    if (/^\s*\d/.test(n) || /\bplazas?\b/i.test(n) || /^\s*ope\b/i.test(n)) return c
    return { ...c, nombre: `${c.plazas} ${c.plazas === 1 ? "plaza" : "plazas"} de ${n}` }
}

// Para ordenar "por más recientes" = cuándo se SUBIÓ la convocatoria.
// Auto: created_at (fecha real de ingesta). Curadas (sin created_at): ultimaActualizacion.
function fechaRef(c: Convocatoria): string {
    return c.creadaEn || c.ultimaActualizacion || "0000-00-00"
}

export async function getConvocatorias(): Promise<Convocatoria[]> {
    try {
        const supabase = createClient(URL, KEY, { auth: { persistSession: false } })
        const { data, error } = await supabase
            .from("convocatorias_auto")
            .select("*")
            .order("ultima_actualizacion", { ascending: false })
        if (error || !data) return CONVOCATORIAS.map(estadoEfectivo).filter(vigente).map(conPlazasEnTitulo)
        const curadas = new Set(CONVOCATORIAS.map((c) => c.slug))
        const auto = data
            .filter((r: any) => !curadas.has(r.slug))
            .map(mapRow)
            .filter((a) => !CONVOCATORIAS.some((c) => mismaConv(c, a)))
        return [...CONVOCATORIAS, ...auto].map(estadoEfectivo).filter(vigente).map(conPlazasEnTitulo)
    } catch {
        return CONVOCATORIAS.map(estadoEfectivo).filter(vigente).map(conPlazasEnTitulo)
    }
}

// Una convocatoria CERRADA se muestra 1 mes desde su fin de inscripción; luego se oculta.
// El resto de estados (abierta, oep-aprobada, resultados…) siempre visibles.
function vigente(c: Convocatoria): boolean {
    if (c.estado !== "inscripcion-cerrada") return true
    const fin = finInscripcionIso(c)
    if (!fin) return true
    const cutoff = new Date(); cutoff.setUTCDate(cutoff.getUTCDate() - 30)
    return fin >= cutoff.toISOString().slice(0, 10)
}

/** Ordenadas por urgencia (abierto/próximo primero) y, dentro de cada estado, por más recientes. */
export async function getConvocatoriasOrdenadas(): Promise<Convocatoria[]> {
    const all = await getConvocatorias()
    return all.sort((a, b) => {
        const o = ESTADOS[a.estado].orden - ESTADOS[b.estado].orden
        if (o !== 0) return o
        return fechaRef(b).localeCompare(fechaRef(a)) // más recientes primero
    })
}

export async function getConvocatoriaBySlug(slug: string): Promise<Convocatoria | undefined> {
    const curada = CONVOCATORIAS.find((c) => c.slug === slug)
    if (curada) return conPlazasEnTitulo(estadoEfectivo(curada))
    const all = await getConvocatorias()
    return all.find((c) => c.slug === slug)
}
