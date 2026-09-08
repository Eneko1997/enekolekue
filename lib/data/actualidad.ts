// Feed de "Actualidad OPE": se autogenera desde las convocatorias (fuente única),
// ordenado por fecha de última actualización. Así nunca queda desactualizado: se
// nutre de lo que ya se mantiene. Hay hueco para entradas MANUALES puntuales (una
// reforma legal, un aviso de plazo…) que no son una convocatoria.

import { CONVOCATORIAS, ESTADOS, type Convocatoria } from "./convocatorias"

export interface Novedad {
    id: string
    /** Fecha ISO (YYYY-MM-DD). */
    fecha: string
    /** Título con el nº de plazas (para el feed). */
    titulo: string
    /** Nombre sin el sufijo de plazas (para maquetar la destacada). */
    nombre: string
    resumen: string
    href: string
    etiqueta: string
    etiquetaColor: string
    plazas: number | null
    /** Texto del plazo de inscripción/solicitudes, si lo hay. */
    plazo: string | null
    /** true si el enlace sale del sitio. */
    externa?: boolean
}

// Texto del plazo (inscripción/solicitudes) de una convocatoria, si existe.
function plazoDe(fechasClave: { etiqueta: string; fecha: string | null }[]): string | null {
    const f = fechasClave.find((x) => /inscrip|solicitud|plazo/i.test(x.etiqueta))
    return f?.fecha ?? null
}

// Entradas manuales opcionales (vacío por defecto). Añade aquí novedades que no
// correspondan a una convocatoria concreta.
const MANUALES: Novedad[] = []

export function novedades(convs: Convocatoria[] = CONVOCATORIAS): Novedad[] {
    const deConvocatorias: Novedad[] = convs.map((c) => ({
        id: `conv-${c.slug}`,
        fecha: c.ultimaActualizacion,
        titulo: c.plazas ? `${c.nombre} · ${c.plazas} plazas` : c.nombre,
        nombre: c.nombre,
        resumen: c.resumen,
        href: `/convocatorias/${c.slug}`,
        etiqueta: ESTADOS[c.estado].label,
        etiquetaColor: ESTADOS[c.estado].color,
        plazas: c.plazas,
        plazo: plazoDe(c.fechasClave),
    }))
    return [...MANUALES, ...deConvocatorias].sort((a, b) =>
        a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0
    )
}

const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

/** "2026-08-19" → "19 de agosto de 2026". */
export function formatFecha(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number)
    if (!y || !m || !d) return iso
    return `${d} de ${MESES[m - 1]} de ${y}`
}
