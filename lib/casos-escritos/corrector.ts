// Motor de corrección de casos prácticos ESCRITOS, sin IA (determinista, gratis,
// instantáneo). Puntúa por RÚBRICA: cada apartado define "conceptos" a detectar
// (con sinónimos y variantes eus/es), sus puntos, y si son afirmación/negación.
// La nota sale de sumar los puntos de los conceptos detectados. Es orientativa:
// mide presencia + vínculo de lo esperado, no juzga elocuencia.

export type Concepto = {
    // Qué comprueba (se muestra al alumno en el desglose).
    label: string
    puntos: number
    // Basta con que aparezca UNA de estas expresiones (se normalizan al comparar).
    patrones: string[]
    // "negacion": el apartado correcto es un NO (p. ej. "¿puede excusarse? No").
    tipo?: "texto" | "negacion"
}

export type PreguntaCaso = {
    n: string
    enunciado: string
    conceptos: Concepto[]
    modelo: string
    // Pista opcional de norma (bonus informativo, no puntúa por defecto).
    ley?: string
    // Explicación redactada ("el porqué") que se muestra en la corrección.
    comentario?: string
}

export type Ejercicio = {
    titulo: string
    contexto: string
    preguntas: PreguntaCaso[]
}

export type CasoEscrito = {
    id: string
    titulo: string
    entidad: string
    escala: string
    fecha: string
    ejercicios: Ejercicio[]
    leyesClave?: string[]
}

// ── Normalización: minúsculas, sin tildes, sin puntuación, espacios colapsados ──
export function norm(s: string): string {
    return (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9ñ\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
}

// Distancia de edición (para tolerar erratas en palabras largas).
function levenshtein(a: string, b: string): number {
    const m = a.length
    const n = b.length
    if (!m) return n
    if (!n) return m
    const dp = new Array(n + 1)
    for (let j = 0; j <= n; j++) dp[j] = j
    for (let i = 1; i <= m; i++) {
        let prev = dp[0]
        dp[0] = i
        for (let j = 1; j <= n; j++) {
            const tmp = dp[j]
            dp[j] = Math.min(
                dp[j] + 1,
                dp[j - 1] + 1,
                prev + (a[i - 1] === b[j - 1] ? 0 : 1)
            )
            prev = tmp
        }
    }
    return dp[n]
}

// ¿Aparece el patrón en el texto? Frase → substring; palabra → límite de palabra
// (+ tolerancia a erratas). Evita el falso positivo por negación ("no tiene derecho").
function apareceEnTexto(hayNorm: string, patron: string): boolean {
    const p = norm(patron)
    if (!p) return false
    const padded = ` ${hayNorm} `
    const esFrase = p.includes(" ")

    // Guarda de negación: si justo antes va "no", no cuenta como afirmación.
    if (padded.includes(` no ${p} `) || padded.includes(` no ${p}`)) return false

    if (esFrase) {
        if (hayNorm.includes(p)) return true
    } else {
        if (padded.includes(` ${p} `)) return true
        // erratas en palabras de ≥5 letras: token con distancia ≤1
        if (p.length >= 5) {
            for (const tok of hayNorm.split(" ")) {
                if (Math.abs(tok.length - p.length) <= 1 && levenshtein(tok, p) <= 1) return true
            }
        }
    }
    return false
}

// Detecta una marca negativa clara en la respuesta (para apartados cuya respuesta
// correcta es "No"): "no", "no puede", "incorrect...", "mal", etc.
function hayNegacion(hayNorm: string, patrones: string[]): boolean {
    const padded = ` ${hayNorm} `
    if (patrones.some((p) => hayNorm.includes(norm(p)))) return true
    // "no" como palabra suelta cuenta como respuesta negativa.
    return padded.includes(" no ")
}

export type PreguntaResultado = {
    n: string
    enunciado: string
    puntos: number
    max: number
    aciertos: { label: string; puntos: number }[]
    fallos: { label: string; puntos: number }[]
    modelo: string
    ley?: string
    comentario?: string
    vacia: boolean
}

export function corrigePregunta(respuesta: string, preg: PreguntaCaso): PreguntaResultado {
    const h = norm(respuesta)
    const vacia = h.length === 0
    const aciertos: { label: string; puntos: number }[] = []
    const fallos: { label: string; puntos: number }[] = []
    let puntos = 0
    let max = 0

    for (const c of preg.conceptos) {
        max += c.puntos
        let ok = false
        if (!vacia) {
            ok =
                c.tipo === "negacion"
                    ? hayNegacion(h, c.patrones)
                    : c.patrones.some((p) => apareceEnTexto(h, p))
        }
        if (ok) {
            puntos += c.puntos
            aciertos.push({ label: c.label, puntos: c.puntos })
        } else {
            fallos.push({ label: c.label, puntos: c.puntos })
        }
    }

    return { n: preg.n, enunciado: preg.enunciado, puntos, max, aciertos, fallos, modelo: preg.modelo, ley: preg.ley, comentario: preg.comentario, vacia }
}

export type CasoResultado = {
    total: number
    max: number
    nota10: number
    ejercicios: {
        titulo: string
        puntos: number
        max: number
        preguntas: PreguntaResultado[]
    }[]
}

// respuestas: mapa "e{indiceEjercicio}p{n}" -> texto del alumno.
export function corrigeCaso(respuestas: Record<string, string>, caso: CasoEscrito): CasoResultado {
    let total = 0
    let max = 0
    const ejercicios = caso.ejercicios.map((ej, ei) => {
        let ep = 0
        let em = 0
        const preguntas = ej.preguntas.map((preg) => {
            const key = `e${ei}p${preg.n}`
            const r = corrigePregunta(respuestas[key] ?? "", preg)
            ep += r.puntos
            em += r.max
            return r
        })
        total += ep
        max += em
        return { titulo: ej.titulo, puntos: ep, max: em, preguntas }
    })
    const nota10 = max > 0 ? Math.round((total / max) * 100) / 10 : 0
    return { total, max, nota10, ejercicios }
}
