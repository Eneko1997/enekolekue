// Fuente ÚNICA de las convocatorias de oposiciones de Euskadi.
// Regla: se rellena SOLO lo verificable en fuentes oficiales (BOPV, euskadi.eus,
// Osakidetza, IVAP, Academia de Arkaute). Todo lo no confirmado va en `null` y la
// UI muestra "Pendiente de confirmación". Este shape está pensado para poder
// alimentarse en el futuro de un scraper del BOPV.

export type EstadoConvocatoria =
    | "oep-aprobada"
    | "bases-publicadas"
    | "inscripcion-abierta"
    | "inscripcion-cerrada"
    | "pendiente-examen"
    | "examen-realizado"
    | "resultados"
    | "finalizada"

export interface FechaClave {
    etiqueta: string
    /** Texto mostrable (puede ser un rango, p. ej. "2–16 de marzo de 2026"). */
    fecha: string | null
    /** Fecha ISO (YYYY-MM-DD) si es un día concreto, para JSON-LD Event. */
    iso?: string | null
    nota?: string
}

export interface PlazaDetalle {
    cuerpo: string
    plazas: number | null
    turno?: string
}

export interface EnlaceOficial {
    etiqueta: string
    url: string
}

export interface Convocatoria {
    slug: string
    /** slug del organismo (ver lib/data/organismos.ts). */
    organismo: string
    nombre: string
    cuerpoOCategoria: string[]
    /** Grupo de clasificación (A/B/C1/C2/E) o null si son varios. */
    grupo: string | null
    estado: EstadoConvocatoria
    plazas: number | null
    plazasDetalle: PlazaDetalle[]
    fechasClave: FechaClave[]
    perfilLinguistico: string | null
    enlacesOficiales: EnlaceOficial[]
    boletin: string | null
    /** Fecha ISO de la última revisión de esta ficha. Argumento de confianza. */
    ultimaActualizacion: string
    resumen: string
    /** CTAs a los tests relacionados dentro de Gainditu. */
    testsRelacionados: EnlaceOficial[]
}

// ── Metadatos de estado: etiqueta, color (paleta sobria: verde=activo,
// ámbar=próximo/atención, gris=pasado) y orden de urgencia para el listado. ──
export const ESTADOS: Record<
    EstadoConvocatoria,
    { label: string; color: string; orden: number }
> = {
    "inscripcion-abierta": { label: "Inscripción abierta", color: "#10B981", orden: 0 },
    "bases-publicadas": { label: "Bases publicadas", color: "#10B981", orden: 1 },
    "pendiente-examen": { label: "Pendiente de examen", color: "#F59E0B", orden: 2 },
    "inscripcion-cerrada": { label: "Inscripción cerrada", color: "#F59E0B", orden: 3 },
    "oep-aprobada": { label: "OEP aprobada", color: "#F59E0B", orden: 4 },
    "examen-realizado": { label: "Examen realizado", color: "#64748B", orden: 5 },
    resultados: { label: "Resultados", color: "#64748B", orden: 6 },
    finalizada: { label: "Finalizada", color: "#9CA3AF", orden: 7 },
}

const HOY = "2026-08-01" // última revisión general de las fichas

export const CONVOCATORIAS: Convocatoria[] = [
    // ───────────────────────── Gobierno Vasco ─────────────────────────
    {
        slug: "ope-gobierno-vasco-2026",
        organismo: "gobierno-vasco",
        nombre: "OPE Gobierno Vasco 2026 — Administración General",
        cuerpoOCategoria: [
            "Personal de Apoyo",
            "Administrativo",
            "Técnico de Gestión",
            "Técnico Superior",
            "Auxiliar administrativo",
        ],
        grupo: null,
        estado: "oep-aprobada",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            {
                etiqueta: "Primeras convocatorias",
                fecha: "Previstas desde finales de agosto de 2026",
                iso: null,
                nota: "Según fuentes no oficiales; pendiente de publicación en el BOPV.",
            },
        ],
        perfilLinguistico: "Variable según plaza (buena parte PL1; el euskera puntúa).",
        enlacesOficiales: [
            { etiqueta: "Empleo público del Gobierno Vasco", url: "https://www.euskadi.eus/empleo-publico/" },
            {
                etiqueta: "IVAP — OPE de la Administración autonómica",
                url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-la-administracion-autonomica-de-euskadi/webivap00-h2home/es/",
            },
        ],
        boletin: "BOPV (según convocatoria)",
        ultimaActualizacion: HOY,
        resumen:
            "Oferta de empleo de la Administración General del Gobierno Vasco, gestionada por el IVAP. Las convocatorias por cuerpo se publican de forma escalonada en el BOPV. El número de plazas y las fechas están pendientes de confirmación oficial.",
        testsRelacionados: [
            { etiqueta: "Personal de Apoyo", url: "/oposiciones/personal-de-apoyo" },
            { etiqueta: "Administrativo", url: "/oposiciones/administrativo" },
            { etiqueta: "Técnico de Gestión", url: "/oposiciones/tecnico-gestion" },
            { etiqueta: "Técnico Superior", url: "/oposiciones/tecnico-superior" },
        ],
    },

    // ───────────────────────── Educación ─────────────────────────
    {
        slug: "ope-educacion-docentes-2026",
        organismo: "educacion",
        nombre: "OPE Educación (docentes) — País Vasco",
        cuerpoOCategoria: [
            "Maestros/as",
            "Profesorado de Secundaria",
            "Formación Profesional",
            "Artes Plásticas y Diseño",
            "Música y Artes Escénicas",
        ],
        grupo: null,
        estado: "oep-aprobada",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            {
                etiqueta: "Convocatorias por cuerpo",
                fecha: "Escalonadas a lo largo de 2026-2027",
                iso: null,
                nota: "Según cuerpo; pendiente de publicación en el BOPV.",
            },
        ],
        perfilLinguistico: "Perfil de euskera según plaza (habitualmente B2/C1/C2).",
        enlacesOficiales: [
            {
                etiqueta: "Departamento de Educación (Hezkuntza)",
                url: "https://www.euskadi.eus/gobierno-vasco/departamento-educacion/",
            },
        ],
        boletin: "BOPV (según convocatoria)",
        ultimaActualizacion: HOY,
        resumen:
            "Procesos selectivos de personal docente de la enseñanza pública vasca (Hezkuntza). Las convocatorias por cuerpo y especialidad se publican de forma escalonada en el BOPV. Plazas y fechas pendientes de confirmación oficial.",
        testsRelacionados: [{ etiqueta: "Constitución", url: "/constitucion" }],
    },

    // ───────────────────────── Ertzaintza ─────────────────────────
    {
        slug: "ope-ertzaintza",
        organismo: "ertzaintza",
        nombre: "OPE Ertzaintza — Escala Básica (Agente)",
        cuerpoOCategoria: ["Agente (Escala Básica)"],
        grupo: null,
        estado: "resultados",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            {
                etiqueta: "Examen (última promoción)",
                fecha: "7 de febrero de 2026",
                iso: "2026-02-07",
                nota: "Realizado (BEC, Barakaldo).",
            },
        ],
        perfilLinguistico: "Requisito de euskera según convocatoria.",
        enlacesOficiales: [
            {
                etiqueta: "Ingreso en la Ertzaintza",
                url: "https://www.ertzaintza.euskadi.eus/lfr/web/ertzaintza/ingreso-en-la-ertzaintza",
            },
            {
                etiqueta: "Academia Vasca de Policía y Emergencias (Arkaute)",
                url: "https://www.arkauteakademia.euskadi.eus/lfr/web/avpe",
            },
        ],
        boletin: "BOPV (según convocatoria)",
        ultimaActualizacion: HOY,
        resumen:
            "Acceso a la Ertzaintza (Escala Básica) por oposición libre, con curso en la Academia de Arkaute. La última promoción realizó su examen en febrero de 2026. Consulta la Academia para las próximas convocatorias. Nº de plazas pendiente de confirmación.",
        testsRelacionados: [{ etiqueta: "Constitución", url: "/constitucion" }],
    },

    // ───────────────────────── Osakidetza ─────────────────────────
    {
        slug: "ope-osakidetza-2023-2025",
        organismo: "osakidetza",
        nombre: "OPE Osakidetza 2023-2024-2025",
        cuerpoOCategoria: [
            "Administrativo/a",
            "Auxiliar administrativo/a",
            "Celador/a",
            "Auxiliar de enfermería",
            "Enfermería",
            "Técnico especialista",
            "y otras (50 categorías)",
        ],
        grupo: null,
        estado: "resultados",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "Inscripción (fase I)", fecha: "2–16 de marzo de 2026", iso: null },
            { etiqueta: "Inscripción (fase II)", fecha: "2–29 de junio de 2026", iso: null },
            {
                etiqueta: "Exámenes primeras categorías",
                fecha: "19–21 de junio de 2026",
                iso: "2026-06-19",
                nota: "Realizados (BEC, Barakaldo).",
            },
            {
                etiqueta: "Listas de aprobados y reclamaciones",
                fecha: "Desde julio de 2026",
                iso: null,
                nota: "En curso.",
            },
        ],
        perfilLinguistico: "Variable según categoría (PL1–PL4).",
        enlacesOficiales: [
            {
                etiqueta: "Osakidetza — OPE 2023-2024-2025",
                url: "https://www.osakidetza.euskadi.eus/ope-2023-2024-2025/webosk00-procon/es/",
            },
        ],
        boletin: "BOPV (varias resoluciones)",
        ultimaActualizacion: HOY,
        resumen:
            "OPE del Servicio Vasco de Salud (2023-2025), con 50 categorías convocadas en dos fases. Los exámenes de las primeras categorías se celebraron en junio de 2026 y el proceso está en fase de listas de aprobados. El total de plazas está pendiente de confirmación oficial.",
        testsRelacionados: [
            { etiqueta: "Ley 39/2015", url: "/ley-39-2015" },
            { etiqueta: "Constitución", url: "/constitucion" },
        ],
    },

    // ───────────────────────── Diputaciones Forales ─────────────────────────
    {
        slug: "ope-diputaciones-forales",
        organismo: "diputaciones-forales",
        nombre: "Oposiciones de las Diputaciones Forales (Álava, Bizkaia y Gipuzkoa)",
        cuerpoOCategoria: [
            "Administrativo/a",
            "Auxiliar administrativo/a",
            "Técnicos/as",
            "Personal foral",
        ],
        grupo: null,
        estado: "oep-aprobada",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            {
                etiqueta: "Convocatorias",
                fecha: "Periódicas, por cada Diputación Foral",
                iso: null,
                nota: "Cada Diputación publica su propia OPE. Pendiente de convocatoria concreta.",
            },
        ],
        perfilLinguistico: "Perfil de euskera según plaza.",
        enlacesOficiales: [
            { etiqueta: "Diputación Foral de Bizkaia", url: "https://www.bizkaia.eus/" },
            { etiqueta: "Diputación Foral de Gipuzkoa", url: "https://www.gipuzkoa.eus/" },
            { etiqueta: "Diputación Foral de Álava", url: "https://www.araba.eus/" },
            {
                etiqueta: "IVAP — OPE de otras administraciones vascas",
                url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-otras-administraciones-publicas-vascas/webivap00-a2eusk/es/",
            },
        ],
        boletin: "BOPV y boletines forales (BOB, BOG, BOTHA)",
        ultimaActualizacion: HOY,
        resumen:
            "Las tres Diputaciones Forales (Álava, Bizkaia y Gipuzkoa) convocan sus propias oposiciones de forma periódica. Consulta la web de cada Diputación para la convocatoria concreta, plazas y fechas.",
        testsRelacionados: [
            { etiqueta: "Ley 39/2015", url: "/ley-39-2015" },
            { etiqueta: "Constitución", url: "/constitucion" },
        ],
    },

    // ───────────────────────── Ayuntamientos ─────────────────────────
    {
        slug: "ope-ayuntamientos",
        organismo: "administracion-local",
        nombre: "Oposiciones de Ayuntamientos (País Vasco)",
        cuerpoOCategoria: [
            "Administrativo/a",
            "Auxiliar administrativo/a",
            "Policía local",
            "Personal de servicios",
        ],
        grupo: null,
        estado: "oep-aprobada",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            {
                etiqueta: "Convocatorias",
                fecha: "Periódicas, por cada ayuntamiento",
                iso: null,
                nota: "Cada municipio publica su propia OPE. Pendiente de convocatoria concreta.",
            },
        ],
        perfilLinguistico: "Perfil de euskera según plaza y municipio.",
        enlacesOficiales: [
            { etiqueta: "Ayuntamiento de Bilbao", url: "https://www.bilbao.eus/" },
            { etiqueta: "Ayuntamiento de Vitoria-Gasteiz", url: "https://www.vitoria-gasteiz.org/" },
            { etiqueta: "Ayuntamiento de Donostia / San Sebastián", url: "https://www.donostia.eus/" },
            {
                etiqueta: "IVAP — OPE de otras administraciones vascas",
                url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-otras-administraciones-publicas-vascas/webivap00-a2eusk/es/",
            },
        ],
        boletin: "BOPV y boletines territoriales (BOB, BOG, BOTHA)",
        ultimaActualizacion: HOY,
        resumen:
            "Los ayuntamientos del País Vasco convocan sus propias oposiciones (administrativo, auxiliar, policía local y personal de servicios) de forma periódica. Consulta la web de cada ayuntamiento para la convocatoria concreta.",
        testsRelacionados: [
            { etiqueta: "Ley 39/2015", url: "/ley-39-2015" },
            { etiqueta: "Constitución", url: "/constitucion" },
        ],
    },

    // ───────────────────────── Bomberos ─────────────────────────
    {
        slug: "ope-bomberos-euskadi",
        organismo: "bomberos",
        nombre: "Oposiciones de Bomberos (País Vasco)",
        cuerpoOCategoria: ["Bombero/a", "Bombero/a conductor/a"],
        grupo: null,
        estado: "oep-aprobada",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            {
                etiqueta: "Convocatorias",
                fecha: "Periódicas, por servicio (foral o municipal)",
                iso: null,
                nota: "Pendiente de convocatoria concreta.",
            },
        ],
        perfilLinguistico: "Perfil de euskera según convocatoria.",
        enlacesOficiales: [
            { etiqueta: "Diputación Foral de Bizkaia (bomberos)", url: "https://www.bizkaia.eus/" },
            { etiqueta: "Diputación Foral de Gipuzkoa", url: "https://www.gipuzkoa.eus/" },
            {
                etiqueta: "IVAP — OPE de otras administraciones vascas",
                url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-otras-administraciones-publicas-vascas/webivap00-a2eusk/es/",
            },
        ],
        boletin: "BOPV y boletines forales",
        ultimaActualizacion: HOY,
        resumen:
            "En el País Vasco los servicios de bomberos dependen de las Diputaciones Forales y de algunos ayuntamientos, que convocan sus procesos de forma periódica. El número de plazas y las fechas dependen de cada convocatoria concreta.",
        testsRelacionados: [{ etiqueta: "Constitución", url: "/constitucion" }],
    },
]

export function getConvocatoria(slug: string): Convocatoria | undefined {
    return CONVOCATORIAS.find((c) => c.slug === slug)
}

/** Ordenadas por urgencia (abierto/próximo primero, pasado al final). */
export function convocatoriasOrdenadas(): Convocatoria[] {
    return [...CONVOCATORIAS].sort(
        (a, b) => ESTADOS[a.estado].orden - ESTADOS[b.estado].orden
    )
}
