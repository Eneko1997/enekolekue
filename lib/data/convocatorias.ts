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
    /** Cuándo se subió/ingirió (created_at de la BD). Solo en las auto; para ordenar por recientes. */
    creadaEn?: string | null
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
        estado: "inscripcion-abierta",
        plazas: 117,
        plazasDetalle: [
            { cuerpo: "Turno libre — acceso general", plazas: 112 },
            { cuerpo: "Reserva para personas con discapacidad", plazas: 5 },
        ],
        fechasClave: [
            { etiqueta: "Inicio de inscripción", fecha: "20 de agosto de 2026", iso: "2026-08-20" },
            { etiqueta: "Fin de inscripción", fecha: "16 de septiembre de 2026", iso: "2026-09-16", nota: "Hasta las 14:00 h. Solicitud telemática en euskadi.eus (BOPV n.º 157, 19-08-2026)." },
            { etiqueta: "Primera prueba (previsión)", fecha: "Enero de 2027", iso: null, nota: "Según el calendario de la convocatoria." },
        ],
        perfilLinguistico: "PL1 o PL2 (requisito en puestos con fecha de preceptividad vencida); en el resto, el euskera puntúa como mérito.",
        enlacesOficiales: [
            { etiqueta: "Inscripción — sede de OPE (euskadi.eus)", url: "https://www.euskadi.eus/web01-sedeope/es/ac27aaUdaWar/convocatorias" },
            { etiqueta: "IVAP — empleo y materiales de apoyo", url: "https://www.ivap.euskadi.eus/empleo-ivap/" },
        ],
        boletin: "BOPV n.º 157, de 19 de agosto de 2026 (Orden de 30 de julio de 2026)",
        ultimaActualizacion: "2026-08-26",
        resumen:
            "117 plazas de Personal de Apoyo (grupo AP) del Gobierno Vasco: 112 de acceso general y 5 de reserva por discapacidad. Sin titulación: la puerta de entrada al empleo público vasco. Concurso-oposición. Plazo hasta el 16 de septiembre de 2026. Tasa: 8,18 €.",
        testsRelacionados: [{ etiqueta: "Tests de Personal de Apoyo", url: "/oposiciones/personal-de-apoyo" }],
    },
    {
        slug: "ope-gobierno-vasco-administrativo-2026",
        organismo: "gobierno-vasco",
        nombre: "OPE Gobierno Vasco 2026 · Administrativo (C1)",
        cuerpoOCategoria: ["Administrativo/a (Escala Administrativa)"],
        grupo: "C1",
        estado: "inscripcion-abierta",
        plazas: 305,
        plazasDetalle: [
            { cuerpo: "Turno libre", plazas: 160 },
            { cuerpo: "Promoción interna vertical", plazas: 145 },
        ],
        fechasClave: [
            { etiqueta: "Inicio de inscripción", fecha: "20 de agosto de 2026", iso: "2026-08-20" },
            { etiqueta: "Fin de inscripción", fecha: "16 de septiembre de 2026", iso: "2026-09-16", nota: "Hasta las 14:00 h. Solicitud telemática en euskadi.eus (BOPV n.º 157, 19-08-2026)." },
            { etiqueta: "Primera prueba (previsión)", fecha: "Enero de 2027", iso: null, nota: "Según el calendario de la convocatoria." },
        ],
        perfilLinguistico: "PL2, PL3 o PL4 (requisito en puestos con fecha de preceptividad vencida); en el resto, el euskera puntúa como mérito.",
        enlacesOficiales: [
            { etiqueta: "Inscripción — sede de OPE (euskadi.eus)", url: "https://www.euskadi.eus/web01-sedeope/es/ac27aaUdaWar/convocatorias" },
            { etiqueta: "IVAP — temarios de Administración General", url: "https://www.ivap.euskadi.eus/temarios-administracion-general-de-la-cae-y-sus-organismos-autonomos/webivap00-a3gaizerr/es/" },
        ],
        boletin: "BOPV n.º 157, de 19 de agosto de 2026 (Orden de 30 de julio de 2026)",
        ultimaActualizacion: "2026-08-26",
        resumen:
            "305 plazas de Administrativo (C1) del Gobierno Vasco: 160 de turno libre y 145 de promoción interna. Requiere Bachiller o FP de grado medio. Concurso-oposición. Plazo hasta el 16 de septiembre de 2026. Tasa: 20,68 €.",
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
    // Las OPE de las diputaciones forales (Gipuzkoa/Bizkaia/Álava) ya NO se curan aquí:
    // se auto-ingieren de la sede de euskadi.eus (edge function `ingest-euskadi-dip`,
    // fuente='opendata-euskadi-dip', organismo='diputaciones-forales') y viven en convocatorias_auto.

    // ───────────────────────── Ayuntamientos (una ficha por convocatoria) ─────────────────────────
    {
        slug: "ope-getxo-administrativo-2026",
        organismo: "administracion-local",
        nombre: "Administrativo/a · Ayuntamiento de Getxo",
        cuerpoOCategoria: ["Administrativo/a"],
        grupo: "C1",
        estado: "inscripcion-abierta",
        plazas: 34,
        plazasDetalle: [
            { cuerpo: "Turno libre", plazas: 29 },
            { cuerpo: "Reserva por discapacidad", plazas: 5 },
        ],
        fechasClave: [
            { etiqueta: "Plazo de solicitudes", fecha: "Hasta el 14 de agosto de 2026", iso: "2026-08-14", nota: "Resolución en el BOE de 18 de julio de 2026; bases en el BOB." },
        ],
        perfilLinguistico: "PL2 preceptivo en la mayoría de las plazas.",
        enlacesOficiales: [
            { etiqueta: "Ayuntamiento de Getxo", url: "https://www.getxo.eus/" },
            { etiqueta: "IVAP — OPE de otras administraciones vascas", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-otras-administraciones-publicas-vascas/webivap00-a2eusk/es/" },
        ],
        boletin: "BOB (Boletín Oficial de Bizkaia)",
        ultimaActualizacion: HOY,
        resumen:
            "El Ayuntamiento de Getxo tiene abierta la convocatoria de 34 plazas de Administrativo/a (29 de turno libre y 5 de reserva por discapacidad), subgrupo C1. El plazo de solicitudes está abierto hasta el 14 de agosto de 2026. La mayoría de las plazas exige perfil lingüístico PL2 preceptivo.",
        testsRelacionados: [
            { etiqueta: "Tests de Administrativo", url: "/oposiciones/administrativo" },
            { etiqueta: "Ley 39/2015", url: "/ley-39-2015" },
            { etiqueta: "Constitución", url: "/constitucion" },
        ],
    },
    {
        slug: "ope-leioa-administrativo-2026",
        organismo: "administracion-local",
        nombre: "Administrativo/a · Ayuntamiento de Leioa",
        cuerpoOCategoria: ["Administrativo/a"],
        grupo: "C1",
        estado: "inscripcion-abierta",
        plazas: 7,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "Plazo de solicitudes", fecha: "30 de julio – 18 de agosto de 2026", iso: "2026-08-18", nota: "Concurso-oposición. Convocatoria en el BOE de 29 de julio de 2026 (bases en el BOB de 27 de febrero de 2026)." },
        ],
        perfilLinguistico: "Perfil lingüístico según plaza.",
        enlacesOficiales: [
            { etiqueta: "Ayuntamiento de Leioa", url: "https://www.leioa.eus/" },
            { etiqueta: "IVAP — OPE de otras administraciones vascas", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-otras-administraciones-publicas-vascas/webivap00-a2eusk/es/" },
        ],
        boletin: "BOB (Boletín Oficial de Bizkaia)",
        ultimaActualizacion: HOY,
        resumen:
            "El Ayuntamiento de Leioa tiene abierta la convocatoria de 7 plazas de Administrativo/a (subgrupo C1) por concurso-oposición. El plazo de solicitudes va del 30 de julio al 18 de agosto de 2026 (convocatoria en el BOE de 29 de julio de 2026).",
        testsRelacionados: [
            { etiqueta: "Tests de Administrativo", url: "/oposiciones/administrativo" },
            { etiqueta: "Ley 39/2015", url: "/ley-39-2015" },
            { etiqueta: "Constitución", url: "/constitucion" },
        ],
    },
    {
        slug: "ope-bilbao-administrativo-2025",
        organismo: "administracion-local",
        nombre: "Administrativo/a · Ayuntamiento de Bilbao",
        cuerpoOCategoria: ["Administrativo/a"],
        grupo: "C1",
        estado: "bases-publicadas",
        plazas: 76,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "Convocatoria", fecha: "BOE de junio de 2025", iso: null, nota: "Sistema de concurso-oposición (turno libre)." },
        ],
        perfilLinguistico: "Perfil lingüístico según plaza.",
        enlacesOficiales: [
            { etiqueta: "Ayuntamiento de Bilbao", url: "https://www.bilbao.eus/" },
            { etiqueta: "IVAP — OPE de otras administraciones vascas", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-otras-administraciones-publicas-vascas/webivap00-a2eusk/es/" },
        ],
        boletin: "BOB / BOE",
        ultimaActualizacion: HOY,
        resumen:
            "El Ayuntamiento de Bilbao convocó 76 plazas de Administrativo/a (subgrupo C1) por concurso-oposición, turno libre, publicadas en el BOE en junio de 2025.",
        testsRelacionados: [
            { etiqueta: "Tests de Administrativo", url: "/oposiciones/administrativo" },
            { etiqueta: "Ley 39/2015", url: "/ley-39-2015" },
            { etiqueta: "Constitución", url: "/constitucion" },
        ],
    },
    {
        slug: "ope-bilbao-policia-local-2026",
        organismo: "policia-local",
        nombre: "Policía Local · Ayuntamiento de Bilbao",
        cuerpoOCategoria: ["Agente de Policía Municipal"],
        grupo: "C1",
        estado: "oep-aprobada",
        plazas: 41,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "OEP 2026", fecha: "BOPV de 19 de mayo de 2026", iso: null, nota: "41 plazas de agente de Policía Municipal (turno libre)." },
        ],
        perfilLinguistico: "Perfil lingüístico según convocatoria.",
        enlacesOficiales: [
            { etiqueta: "Ayuntamiento de Bilbao", url: "https://www.bilbao.eus/" },
            { etiqueta: "IVAP — OPE de otras administraciones vascas", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-otras-administraciones-publicas-vascas/webivap00-a2eusk/es/" },
        ],
        boletin: "BOPV / BOB",
        ultimaActualizacion: HOY,
        resumen:
            "El Ayuntamiento de Bilbao incluye en su OEP 2026 41 plazas de agente de Policía Municipal (turno libre), aprobadas en el BOPV de 19 de mayo de 2026. La convocatoria del proceso selectivo se publicará próximamente.",
        testsRelacionados: [{ etiqueta: "Constitución", url: "/constitucion" }],
    },
    {
        slug: "ope-irun-policia-local-2026",
        organismo: "policia-local",
        nombre: "Policía Local · Ayuntamiento de Irun",
        cuerpoOCategoria: ["Agente de Policía Local"],
        grupo: "C1",
        estado: "oep-aprobada",
        plazas: 9,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "OEP 2026", fecha: "BOPV de 30 de enero de 2026", iso: null, nota: "9 plazas de agente de Policía Local. Convocatoria del proceso selectivo pendiente." },
        ],
        perfilLinguistico: "Perfil lingüístico según convocatoria.",
        enlacesOficiales: [
            { etiqueta: "Ayuntamiento de Irun", url: "https://www.irun.org/" },
            { etiqueta: "IVAP — OPE de otras administraciones vascas", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-otras-administraciones-publicas-vascas/webivap00-a2eusk/es/" },
        ],
        boletin: "BOPV / BOG",
        ultimaActualizacion: HOY,
        resumen:
            "El Ayuntamiento de Irun incluye en su OEP 2026 9 plazas de agente de Policía Local, aprobadas en el BOPV de 30 de enero de 2026. La convocatoria del proceso selectivo se publicará próximamente.",
        testsRelacionados: [{ etiqueta: "Constitución", url: "/constitucion" }],
    },

    // ───────────────────────── Bomberos (una ficha por convocatoria) ─────────────────────────
    {
        slug: "ope-bomberos-gipuzkoa-2026",
        organismo: "bomberos",
        nombre: "Bombero/a · Gipuzkoa",
        cuerpoOCategoria: ["Bombero/a"],
        grupo: "C1",
        estado: "bases-publicadas",
        plazas: 68,
        plazasDetalle: [
            { cuerpo: "OPE 2024", plazas: 16 },
            { cuerpo: "OPE 2025", plazas: 52 },
        ],
        fechasClave: [
            { etiqueta: "Bases publicadas", fecha: "BOG nº 238, de 12 de diciembre de 2025", iso: null, nota: "68 plazas de Bombero/a (16 de la OPE 2024 y 52 de la OPE 2025)." },
        ],
        perfilLinguistico: "Perfil lingüístico según convocatoria.",
        enlacesOficiales: [
            { etiqueta: "Diputación Foral de Gipuzkoa", url: "https://www.gipuzkoa.eus/" },
            { etiqueta: "IVAP — OPE de otras administraciones vascas", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-otras-administraciones-publicas-vascas/webivap00-a2eusk/es/" },
        ],
        boletin: "BOG (Boletín Oficial de Gipuzkoa)",
        ultimaActualizacion: HOY,
        resumen:
            "El servicio de bomberos de Gipuzkoa convocó 68 plazas de Bombero/a (16 de la OPE 2024 y 52 de la OPE 2025), con las bases publicadas en el BOG nº 238 de 12 de diciembre de 2025.",
        testsRelacionados: [{ etiqueta: "Constitución", url: "/constitucion" }],
    },
    {
        slug: "ope-bomberos-bizkaia-2026",
        organismo: "bomberos",
        nombre: "Bombero/a conductor/a · Bizkaia",
        cuerpoOCategoria: ["Bombero/a conductor/a"],
        grupo: "C1",
        estado: "bases-publicadas",
        plazas: 39,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "Primeras pruebas (previsión)", fecha: "Primer semestre de 2026", iso: null, nota: "39 plazas de bombero/a conductor/a, además de plazas de cabo." },
        ],
        perfilLinguistico: "Perfil lingüístico según convocatoria.",
        enlacesOficiales: [
            { etiqueta: "Diputación Foral de Bizkaia", url: "https://www.bizkaia.eus/" },
            { etiqueta: "IVAP — OPE de otras administraciones vascas", url: "https://www.ivap.euskadi.eus/oferta-publica-de-empleo-ope-de-otras-administraciones-publicas-vascas/webivap00-a2eusk/es/" },
        ],
        boletin: "BOB (Boletín Oficial de Bizkaia)",
        ultimaActualizacion: HOY,
        resumen:
            "El servicio de bomberos de Bizkaia convocó 39 plazas de bombero/a conductor/a (además de plazas de cabo), con las primeras pruebas previstas para el primer semestre de 2026.",
        testsRelacionados: [{ etiqueta: "Constitución", url: "/constitucion" }],
    },
    // Bidegi (Agencia Guipuzcoana de Infraestructuras). El feed de Open Data Euskadi tituló mal
    // esta plaza ("obra civil"); el anuncio real de Bidegi/BOG es Protección Civil. Curada con el
    // MISMO slug que la fila automática para que mande sobre ella y no se sobrescriba en la reingesta.
    {
        slug: "eus-empleo_publico_1788775617539",
        organismo: "administracion-local",
        nombre: "Técnico/a de Gestión de Emergencias y Protección Civil en Bidegi",
        cuerpoOCategoria: ["Técnico/a de Gestión de Emergencias y Protección Civil"],
        grupo: "A2",
        estado: "inscripcion-abierta",
        plazas: 1,
        plazasDetalle: [],
        fechasClave: [
            { etiqueta: "Inicio de inscripción", fecha: "7 de septiembre de 2026", iso: "2026-09-07" },
            { etiqueta: "Fin de inscripción", fecha: "28 de septiembre de 2026", iso: "2026-09-28", nota: "Según las bases publicadas en www.bidegi.eus." },
        ],
        perfilLinguistico: null,
        enlacesOficiales: [
            { etiqueta: "Empleo público · Bidegi", url: "https://www.bidegi.eus/es/oferta-de-empleo" },
            { etiqueta: "Bases de la convocatoria", url: "https://www.bidegi.eus/documents/42696171/89922668/Bases+de+la+convocatoria+EMER.pdf/503963d1-35db-e618-bf0c-c9d9f8ed5fa9?t=1788520324878" },
            { etiqueta: "Anuncio en el BOG", url: "https://egoitza.gipuzkoa.eus/gao-bog/castell/bog/2026/08/31/c2605700.pdf" },
            { etiqueta: "Ficha en Euskadi.eus", url: "https://www.gazteaukera.euskadi.eus/webgaz00-tramite3/es/contenidos/empleo_publico/empleo_publico_1788775617539/es_def/index.shtml" },
        ],
        boletin: "Boletín Oficial de Gipuzkoa (BOG), 31 de agosto de 2026",
        ultimaActualizacion: "2026-09-09",
        resumen:
            "1 plaza de Técnico/a de Gestión de Emergencias y Protección Civil (ámbito de infraestructuras viarias) en Bidegi, la agencia guipuzcoana de infraestructuras, con sede en Zarautz. Incorporación en plantilla con contrato de relevo indefinido. Plazo hasta el 28 de septiembre de 2026.",
        testsRelacionados: [],
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
