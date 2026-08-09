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
    /** Fin del rango en ISO (YYYY-MM-DD), para el endDate del Event. */
    isoFin?: string | null
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

const HOY = "2026-08-08" // última revisión general de las fichas

export const CONVOCATORIAS: Convocatoria[] = [
    // ───────────────────────── Gobierno Vasco (una ficha por escala) ─────────────────────────
    // La OPE de la Administración General se convoca escala a escala, cada una
    // con sus fechas. No se mezclan en una sola ficha. Las fechas de convocatoria
    // y prueba son la previsión del calendario provisional (no oficiales todavía).
    {
        slug: "ope-gobierno-vasco-personal-apoyo-2026",
        organismo: "gobierno-vasco",
        nombre: "OPE Gobierno Vasco 2026 · Personal de Apoyo",
        cuerpoOCategoria: ["Personal de Apoyo (Agrupación Profesional)"],
        grupo: "E",
        estado: "oep-aprobada",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "Convocatoria (previsión)", fecha: "Septiembre de 2026", iso: null, nota: "Calendario provisional de la OPE; pendiente de publicación en el BOPV." },
            { etiqueta: "Primera prueba (previsión)", fecha: "Enero de 2027", iso: null, nota: "Fecha orientativa según el calendario provisional." },
        ],
        perfilLinguistico: "Variable según plaza (buena parte PL1; el euskera puntúa).",
        enlacesOficiales: [
            { etiqueta: "Empleo público del Gobierno Vasco", url: "https://www.euskadi.eus/empleo-publico/" },
            { etiqueta: "IVAP — OPE de la Administración autonómica", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-la-administracion-autonomica-de-euskadi/webivap00-h2home/es/" },
        ],
        boletin: "BOPV (según convocatoria)",
        ultimaActualizacion: HOY,
        resumen:
            "Oposición de la Agrupación Profesional de Personal de Apoyo (grupo E) del Gobierno Vasco, dentro de la OPE 2026. Es la puerta de entrada al empleo público vasco y no exige titulación. Plazas y fechas pendientes de confirmación oficial en el BOPV.",
        testsRelacionados: [{ etiqueta: "Tests de Personal de Apoyo", url: "/oposiciones/personal-de-apoyo" }],
    },
    {
        slug: "ope-gobierno-vasco-administrativo-2026",
        organismo: "gobierno-vasco",
        nombre: "OPE Gobierno Vasco 2026 · Administrativo",
        cuerpoOCategoria: ["Administrativo/a"],
        grupo: "C1",
        estado: "oep-aprobada",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "Convocatoria (previsión)", fecha: "Septiembre de 2026", iso: null, nota: "Calendario provisional de la OPE; pendiente de publicación en el BOPV." },
            { etiqueta: "Primera prueba (previsión)", fecha: "Enero de 2027", iso: null, nota: "Fecha orientativa según el calendario provisional." },
        ],
        perfilLinguistico: "Variable según plaza (buena parte PL1; el euskera puntúa).",
        enlacesOficiales: [
            { etiqueta: "Empleo público del Gobierno Vasco", url: "https://www.euskadi.eus/empleo-publico/" },
            { etiqueta: "IVAP — OPE de la Administración autonómica", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-la-administracion-autonomica-de-euskadi/webivap00-h2home/es/" },
        ],
        boletin: "BOPV (según convocatoria)",
        ultimaActualizacion: HOY,
        resumen:
            "Oposición de la escala Administrativa (subgrupo C1) del Gobierno Vasco, dentro de la OPE 2026. Requiere Bachiller o FP de grado superior. Plazas y fechas pendientes de confirmación oficial en el BOPV.",
        testsRelacionados: [{ etiqueta: "Tests de Administrativo", url: "/oposiciones/administrativo" }],
    },
    {
        slug: "ope-gobierno-vasco-tecnico-gestion-2026",
        organismo: "gobierno-vasco",
        nombre: "OPE Gobierno Vasco 2026 · Técnico de Gestión",
        cuerpoOCategoria: ["Técnico/a de Gestión Administrativa"],
        grupo: "B",
        estado: "oep-aprobada",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "Convocatoria (previsión)", fecha: "Octubre de 2026", iso: null, nota: "Calendario provisional de la OPE; pendiente de publicación en el BOPV." },
            { etiqueta: "Primera prueba (previsión)", fecha: "Abril de 2027", iso: null, nota: "Fecha orientativa según el calendario provisional." },
        ],
        perfilLinguistico: "Variable según plaza (buena parte PL1; el euskera puntúa).",
        enlacesOficiales: [
            { etiqueta: "Empleo público del Gobierno Vasco", url: "https://www.euskadi.eus/empleo-publico/" },
            { etiqueta: "IVAP — OPE de la Administración autonómica", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-la-administracion-autonomica-de-euskadi/webivap00-h2home/es/" },
        ],
        boletin: "BOPV (según convocatoria)",
        ultimaActualizacion: HOY,
        resumen:
            "Oposición de la escala de Gestión Administrativa (grupo B) del Gobierno Vasco, dentro de la OPE 2026. Perfil técnico-administrativo. Plazas y fechas pendientes de confirmación oficial en el BOPV.",
        testsRelacionados: [{ etiqueta: "Tests de Técnico de Gestión", url: "/oposiciones/tecnico-gestion" }],
    },
    {
        slug: "ope-gobierno-vasco-tecnico-superior-2026",
        organismo: "gobierno-vasco",
        nombre: "OPE Gobierno Vasco 2026 · Técnico Superior",
        cuerpoOCategoria: ["Técnico/a Superior de Administración"],
        grupo: "A",
        estado: "oep-aprobada",
        plazas: null,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "Convocatoria (previsión)", fecha: "Octubre de 2026", iso: null, nota: "Calendario provisional de la OPE; pendiente de publicación en el BOPV." },
            { etiqueta: "Primera prueba (previsión)", fecha: "Abril de 2027", iso: null, nota: "Fecha orientativa según el calendario provisional." },
        ],
        perfilLinguistico: "Variable según plaza (buena parte PL1; el euskera puntúa).",
        enlacesOficiales: [
            { etiqueta: "Empleo público del Gobierno Vasco", url: "https://www.euskadi.eus/empleo-publico/" },
            { etiqueta: "IVAP — OPE de la Administración autonómica", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-la-administracion-autonomica-de-euskadi/webivap00-h2home/es/" },
        ],
        boletin: "BOPV (según convocatoria)",
        ultimaActualizacion: HOY,
        resumen:
            "Oposición de la Escala Superior de Administración (grupo A) del Gobierno Vasco, dentro de la OPE 2026. Es el nivel más alto del cuerpo general. Plazas y fechas pendientes de confirmación oficial en el BOPV.",
        testsRelacionados: [{ etiqueta: "Tests de Técnico Superior", url: "/oposiciones/tecnico-superior" }],
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
                isoFin: "2026-06-21",
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
        plazasDetalle: [
            { cuerpo: "Gipuzkoa — OPE 2026 (138 de administrativo/a en convocatoria)", plazas: 281 },
            { cuerpo: "Bizkaia — OPE 2026 (34 de administrativo/a)", plazas: 69 },
            { cuerpo: "Álava — 1ª OPE 2026", plazas: 40 },
        ],
        fechasClave: [
            {
                etiqueta: "Gipuzkoa — OPE 2026",
                fecha: "281 plazas en 18 procesos selectivos",
                iso: null,
                nota: "Incluye plazas de Administrativo/a (Diputación y Juntas Generales) y 68 de Bombero/a. Primeras pruebas no antes de enero de 2027.",
            },
            {
                etiqueta: "Gipuzkoa — Administrativo/a: plazo de solicitudes",
                fecha: "21 de julio – 21 de agosto de 2026",
                iso: "2026-08-21",
                nota: "138 plazas (124 de turno libre y 14 de reserva por discapacidad), subgrupo C1, concurso-oposición. Bases en el BOG de 20 de julio de 2026.",
            },
            {
                etiqueta: "Bizkaia — OPE 2026",
                fecha: "69 plazas (34 de administrativo/a)",
                iso: null,
                nota: "Convocatorias por categoría en el BOB. Segunda OEP prevista para fin de año.",
            },
            {
                etiqueta: "Álava — 1ª OPE 2026",
                fecha: "40 plazas (BOTHA nº 55, mayo de 2026)",
                iso: null,
                nota: "19 de técnico/a de administración general, 8 laborantes, 5 inspector/a auxiliar de tributos, 5 guardería forestal y 3 letrado/a. Segunda OPE prevista antes de fin de año.",
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
            "Las tres Diputaciones Forales convocan sus propias oposiciones. Gipuzkoa aprobó su OPE 2026 con 281 plazas en 18 procesos y tiene abierta la convocatoria de 138 plazas de Administrativo/a (solicitudes hasta el 21 de agosto de 2026); Bizkaia ofertó 69 plazas (34 de administrativo/a) y Álava, una primera OPE 2026 de 40 plazas. Consulta cada Diputación para las convocatorias por categoría.",
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
        estado: "bases-publicadas",
        plazas: null,
        plazasDetalle: [
            { cuerpo: "Getxo — Administrativo/a (C1)", plazas: 34 },
            { cuerpo: "Bilbao — Administrativo/a (turno libre)", plazas: 76 },
        ],
        fechasClave: [
            {
                etiqueta: "Getxo — 34 administrativos/as",
                fecha: "Solicitudes hasta el 14 de agosto de 2026",
                iso: "2026-08-14",
                nota: "29 de turno libre y 5 de reserva por discapacidad (subgrupo C1). Perfil lingüístico PL2 preceptivo en la mayoría. Bases en el BOB.",
            },
            {
                etiqueta: "Bilbao — 76 administrativos/as",
                fecha: "Convocatoria publicada en el BOE (junio de 2025)",
                iso: null,
                nota: "Sistema de concurso-oposición.",
            },
            {
                etiqueta: "Bilbao — OEP 2026",
                fecha: "Aprobada en 2026",
                iso: null,
                nota: "Incluye 41 plazas de Policía Local y 32 de Administrativo/a, entre otras.",
            },
            {
                etiqueta: "Otros municipios",
                fecha: "Vitoria-Gasteiz, Donostia y otros convocan sus propias OPE",
                iso: null,
                nota: "Consulta cada ayuntamiento para plazas y fechas.",
            },
        ],
        perfilLinguistico: "Perfil de euskera según plaza y municipio.",
        enlacesOficiales: [
            { etiqueta: "Ayuntamiento de Getxo", url: "https://www.getxo.eus/" },
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
            "Los ayuntamientos vascos convocan sus propias oposiciones. Getxo tiene abierta una convocatoria de 34 plazas de Administrativo/a (solicitudes hasta el 14 de agosto de 2026); Bilbao ofertó 76 de Administrativo/a (BOE de junio de 2025) y su OEP 2026 suma 41 de Policía Local y 32 de Administrativo/a. Otros municipios como Vitoria-Gasteiz y Donostia publican sus OPE de forma periódica.",
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
        estado: "bases-publicadas",
        plazas: null,
        plazasDetalle: [
            { cuerpo: "Gipuzkoa — Bombero/a (turno libre)", plazas: 68 },
            { cuerpo: "Bizkaia — Bombero/a conductor/a", plazas: 39 },
        ],
        fechasClave: [
            {
                etiqueta: "Gipuzkoa — bases",
                fecha: "BOG nº 238, de 12 de diciembre de 2025",
                iso: null,
                nota: "68 plazas de Bombero/a (16 de la OPE 2024 y 52 de la OPE 2025).",
            },
            {
                etiqueta: "Bizkaia — primeras pruebas",
                fecha: "Primer semestre de 2026",
                iso: null,
                nota: "39 plazas de bombero/a conductor/a, además de plazas de cabo.",
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
            "Los servicios de bomberos vascos dependen de las Diputaciones Forales. Gipuzkoa convocó 68 plazas de Bombero/a (bases en el BOG de diciembre de 2025) y Bizkaia 39 plazas de bombero/a conductor/a, con primeras pruebas en el primer semestre de 2026. Consulta cada servicio para el estado exacto del proceso.",
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
