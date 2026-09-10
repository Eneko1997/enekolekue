// Fuente ÚNICA del precio del acceso premium. La usan a la vez la web (mostrar precio,
// próxima subida) y la edge function de checkout (importe que cobra Stripe), así que
// lo que se ve y lo que se cobra SIEMPRE coinciden. Si cambias aquí, replica el mismo
// cálculo en la edge function create-embedded-checkout (Deno no importa este módulo).
//
// Regla: precio de lanzamiento y +5,00 € el día 1 de cada mes (según se añade contenido),
// hasta un tope. Todo en céntimos y en UTC (el día 1 a las 00:00 UTC), para que web y
// servidor calculen igual sin depender de la zona horaria del visitante.

export const PRECIO_BASE_CENT = 3999 // 39,99 € en el mes ancla
export const PRECIO_STEP_CENT = 500 // +5,00 € cada mes
export const PRECIO_TOPE_CENT = 5999 // tope 59,99 €
// Mes ancla del precio base (0-based: 8 = septiembre). Septiembre de 2026 = 39,99 €.
export const PRECIO_ANCLA_ANIO = 2026
export const PRECIO_ANCLA_MES0 = 8

const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

/** Nº de subidas (meses de calendario) transcurridas desde el mes ancla, en UTC. */
export function mesesTranscurridos(d: Date = new Date()): number {
    const elapsed = (d.getUTCFullYear() - PRECIO_ANCLA_ANIO) * 12 + (d.getUTCMonth() - PRECIO_ANCLA_MES0)
    return Math.max(0, elapsed)
}

/** Precio actual en céntimos, con tope. */
export function precioActualCent(d: Date = new Date()): number {
    return Math.min(PRECIO_TOPE_CENT, PRECIO_BASE_CENT + PRECIO_STEP_CENT * mesesTranscurridos(d))
}

/** Precio del próximo escalón en céntimos, o null si ya está en el tope. */
export function precioSiguienteCent(d: Date = new Date()): number | null {
    const actual = precioActualCent(d)
    if (actual >= PRECIO_TOPE_CENT) return null
    return Math.min(PRECIO_TOPE_CENT, actual + PRECIO_STEP_CENT)
}

/** Fecha (UTC) de la próxima subida = día 1 del mes que viene, o null si ya está en el tope. */
export function fechaSiguienteSubida(d: Date = new Date()): Date | null {
    if (precioActualCent(d) >= PRECIO_TOPE_CENT) return null
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))
}

/** Céntimos → "39,99" (coma decimal, sin símbolo). */
export function euros(cent: number): string {
    return (cent / 100).toFixed(2).replace(".", ",")
}

/** Fecha → "1 de octubre" (en UTC). */
export function fechaLegible(d: Date): string {
    return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`
}
