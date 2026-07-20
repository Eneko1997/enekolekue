// Catálogo de tests por escala + agrupación por áreas temáticas.
// Módulo de datos puro (sin React): lo comparten el dashboard y las páginas por escala.

export interface Test {
    id: string
    titulo: string
    preguntas: number
    tema?: string
}
export interface Bloque {
    bloque: string
    tests: Test[]
}

// ─── ÁREAS TEMÁTICAS TRANSVERSALES (Vista por Bloques) ────────────────────────
// Agrupan los temas por materia real, independientemente de su número oficial.
export const AREA_ORDER = [
    "Constitución y derechos fundamentales",
    "Procedimiento y acto administrativo (Ley 39/2015)",
    "Organización del Estado y de Euskadi",
    "Organización y sector público (Ley 3/2022)",
    "Empleo público, igualdad y euskera",
    "Administración electrónica, documentación y datos",
    "Transparencia y gobierno abierto",
    "Prevención de riesgos y salud laboral",
    "Atención a la ciudadanía y comunicación",
    "Contratación pública y servicios",
    "Hacienda, presupuestos y subvenciones",
    "Gestión pública y organización",
    "Vigilancia y labores de apoyo",
    "Correspondencia y paquetería",
    "Almacenamiento y materiales",
    "Mantenimiento e instalaciones",
    "Simulacros",
    "Otros temas",
]

export function areaDeTest(test: Test): string {
    const s = `${test.tema ?? ""} ${test.titulo}`.toLowerCase()
    const has = (...w: string[]) => w.some((x) => s.includes(x))
    if (has("simulacro")) return "Simulacros"
    // Constitución + marco europeo (la UE se integra aquí para no quedar suelta)
    if (
        has(
            "constituci",
            "derechos y libertades",
            "derechos fundamentales",
            "unión europea",
            "union europea"
        )
    )
        return "Constitución y derechos fundamentales"
    // Ley 39/2015 — va inmediatamente después de la Constitución
    if (
        has(
            "acto administrativo",
            "silencio",
            "nulidad",
            "anulabilidad",
            "procedimiento administrativo",
            "fases del procedimiento",
            "recursos administrativos",
            "revisión de oficio",
            "responsabilidad de las administraciones",
            "responsabilidad patrimonial",
            "fuentes del derecho",
            "interesad",
            "obligación de resolver",
            "plazos"
        )
    )
        return "Procedimiento y acto administrativo (Ley 39/2015)"
    // Igualdad/euskera antes de la organización territorial (evita capturar "en la CAE")
    if (
        has(
            "igualdad de mujeres",
            "igualdad de género",
            "violencia machista",
            "normalización lingüística",
            "perfil lingüístico",
            "euskera"
        )
    )
        return "Empleo público, igualdad y euskera"
    if (
        has(
            "organización territorial",
            "comunidades autónomas",
            "estatuto",
            "organización política",
            "cae",
            "concierto",
            "territorios históricos",
            "gobierno vasco",
            "lehendakari",
            "instituciones locales"
        )
    )
        return "Organización del Estado y de Euskadi"
    if (
        has(
            "encomienda",
            "convenios",
            "órganos administrativos",
            "organización administrativa",
            "delegación",
            "avocación",
            "competencia",
            "sector público"
        )
    )
        return "Organización y sector público (Ley 3/2022)"
    // Prevención antes de empleo público (evita capturar "riesgos laborales" como laboral)
    if (has("riesgos laborales", "primeros auxilios", "pantallas", "posturas"))
        return "Prevención de riesgos y salud laboral"
    // Protección de datos antes de empleo ("datos personales" contiene "personal")
    if (has("protección de datos", "datos personales"))
        return "Administración electrónica, documentación y datos"
    if (
        has(
            "empleo público",
            "empleo en",
            "personal",
            "función pública",
            "puestos de trabajo",
            "relación de puestos",
            "cuerpos y escalas",
            "plantilla",
            "oferta de empleo",
            "retribuciones",
            "disciplinario",
            "código ético",
            "provisión",
            "selección",
            "laboral",
            "seguridad social",
            "igualdad",
            "euskera",
            "normalización lingüística",
            "perfil lingüístico"
        )
    )
        return "Empleo público, igualdad y euskera"
    if (
        has(
            "expediente",
            "documento administrativo",
            "documentación",
            "biblioteca",
            "archivística",
            "firma electrónica",
            "administración electrónica",
            "sede electrónica",
            "certificado electrónico",
            "registros electrónicos",
            "archivo",
            "copias",
            "certificaciones",
            "protección de datos",
            "datos personales"
        )
    )
        return "Administración electrónica, documentación y datos"
    if (has("gobierno abierto", "transparencia", "información pública", "buen gobierno"))
        return "Transparencia y gobierno abierto"
    // Labores de apoyo antes de Atención (control de acceso/reuniones mencionan "atención"/"comunicación")
    if (
        has(
            "control de acceso",
            "vigilancia",
            "apoyo a reuniones",
            "preparación de salas",
            "trabajos auxiliares de oficina"
        )
    )
        return "Vigilancia y labores de apoyo"
    if (
        has(
            "atención",
            "ciudadanía",
            "comunicación",
            "quejas",
            "lenguaje administrativo"
        )
    )
        return "Atención a la ciudadanía y comunicación"
    if (has("contrat", "servicio público", "concesión", "autorizaciones", "licencias", "sancionadora"))
        return "Contratación pública y servicios"
    if (has("hacienda", "presupuesto", "contabilidad", "subvenci", "ayudas"))
        return "Hacienda, presupuestos y subvenciones"
    if (has("control de acceso", "vigilancia", "apoyo a", "trabajos auxiliares de oficina", "reuniones"))
        return "Vigilancia y labores de apoyo"
    if (has("correspondencia", "paquetería")) return "Correspondencia y paquetería"
    if (has("almacen", "existencias", "materiales", "residuos"))
        return "Almacenamiento y materiales"
    if (has("mantenimiento", "cerrajería", "fontanería", "vehículos", "instalaciones"))
        return "Mantenimiento e instalaciones"
    if (has("administración educativa", "educativa")) return "Gestión pública y organización"
    if (has("gestión pública", "procesos", "proyectos", "organización", "cultura", "gobernanza", "calidad", "satisfacción"))
        return "Gestión pública y organización"
    return "Otros temas"
}

export function agruparPorArea(bloques: Bloque[]): Bloque[] {
    const map = new Map<string, Test[]>()
    bloques.forEach((b) =>
        b.tests.forEach((tt) => {
            const a = areaDeTest(tt)
            if (!map.has(a)) map.set(a, [])
            map.get(a)!.push(tt)
        })
    )
    // Orden canónico (Simulacros se fuerza al final, fuera de la fusión)
    const ordenadas = AREA_ORDER.filter((a) => map.has(a) && a !== "Simulacros")
    const extra = [...map.keys()].filter(
        (a) => !AREA_ORDER.includes(a) && a !== "Simulacros"
    )
    const result: Bloque[] = [...ordenadas, ...extra].map((a) => ({
        bloque: a,
        tests: map.get(a)!,
    }))
    // Fusionar bloques con un único tema en su vecino (el anterior; el siguiente
    // si es el primero) para que ningún tema quede suelto.
    for (let i = 0; i < result.length; i++) {
        if (result[i].tests.length === 1 && result.length > 1) {
            if (i > 0) {
                result[i - 1].tests.push(...result[i].tests)
            } else {
                result[i + 1].tests.unshift(...result[i].tests)
            }
            result.splice(i, 1)
            i--
        }
    }
    // Simulacros siempre al final
    if (map.has("Simulacros")) {
        result.push({ bloque: "Simulacros", tests: map.get("Simulacros")! })
    }
    return result
}

// ─── BLOQUE COMÚN ─────────────────────────────────────────────────────────────
export const BLOQUE_COMUN: Bloque[] = [
    {
        bloque: "Parte General — Temas 1 al 14 (comunes a todas las escalas)",
        tests: [
            {
                id: "c01",
                tema: "T.1",
                titulo: "T.1 — Constitución: derechos, libertades y garantías. Deberes. Principios constitucionales de la actuación administrativa",
                preguntas: 30,
            },
            {
                id: "c02",
                tema: "T.2",
                titulo: "T.2 — Organización territorial del Estado. Comunidades Autónomas y Estatutos de Autonomía",
                preguntas: 30,
            },
            {
                id: "c03",
                tema: "T.3",
                titulo: "T.3 — Derecho de la Unión Europea. Instituciones. Reglamentos y Directivas",
                preguntas: 30,
            },
            {
                id: "c04",
                tema: "T.4",
                titulo: "T.4 — Organización política y administrativa de la CAE. Parlamento, Gobierno Vasco y Lehendakari",
                preguntas: 30,
            },
            {
                id: "c05",
                tema: "T.5",
                titulo: "T.5 — Distribución de competencias CAE–Territorios Históricos. Concierto Económico. Instituciones Locales",
                preguntas: 30,
            },
            {
                id: "c06",
                tema: "T.6",
                titulo: "T.6 — Normativa vasca para la igualdad de mujeres y hombres y vidas libres de violencia machista en la CAE",
                preguntas: 30,
            },
            {
                id: "c07",
                tema: "T.7",
                titulo: "T.7 — Administración Electrónica. Sede electrónica. Identificación y firma electrónica. Archivo y expediente electrónico",
                preguntas: 30,
            },
            {
                id: "c08",
                tema: "T.8",
                titulo: "T.8 — Normalización lingüística del euskera en la Administración. Perfil lingüístico. Planes de normalización",
                preguntas: 30,
            },
            {
                id: "c09",
                tema: "T.9",
                titulo: "T.9 — Personal al servicio de las AAPP vascas: clases, derechos, código ético y régimen disciplinario",
                preguntas: 30,
            },
            {
                id: "c10",
                tema: "T.10",
                titulo: "T.10 — Protección de datos personales: conceptos, principios, bases de legitimación, derechos y categorías especiales",
                preguntas: 30,
            },
            {
                id: "c11",
                tema: "T.11",
                titulo: "T.11 — Prevención de riesgos laborales: derechos, obligaciones, principios preventivos, plan y evaluación de riesgos",
                preguntas: 30,
            },
            {
                id: "c12",
                tema: "T.12",
                titulo: "T.12 — Prevención de riesgos laborales: pantallas de visualización de datos",
                preguntas: 30,
            },
            {
                id: "c13",
                tema: "T.13",
                titulo: "T.13 — Nociones básicas de primeros auxilios",
                preguntas: 30,
            },
            {
                id: "c14",
                tema: "T.14",
                titulo: "T.14 — Gobierno abierto: concepto y principios. Acceso a la información pública y buen gobierno",
                preguntas: 30,
            },
            {
                id: "c00",
                titulo: "Simulacro Parte General — Temas 1 al 14",
                preguntas: 50,
            },
        ],
    },
]

export const dbAuxiliares: Bloque[] = [
    ...BLOQUE_COMUN,
    {
        bloque: "Administración educativa — Tema 15",
        tests: [
            { id: "apoyo15", tema: "T.15", titulo: "T.15 — Administración educativa no universitaria. Principios generales y organización de los centros docentes", preguntas: 30 },
        ],
    },
    {
        bloque: "Atención a la Ciudadanía — Temas 16 al 19",
        tests: [
            { id: "apoyo16", tema: "T.16", titulo: "T.16 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos y registros", preguntas: 30 },
            { id: "apoyo17", tema: "T.17", titulo: "T.17 — La ciudadanía como destinataria de los servicios. Atención al público, quejas, discapacidad e interculturalidad", preguntas: 30 },
            { id: "apoyo18", tema: "T.18", titulo: "T.18 — Comunicación escrita en la Administración. Lenguaje administrativo no sexista. Documentos", preguntas: 30 },
            { id: "apoyo19", tema: "T.19", titulo: "T.19 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal", preguntas: 30 },
        ],
    },
    {
        bloque: "Vigilancia, control y labores de apoyo — Temas 20 al 22",
        tests: [
            { id: "apoyo20", tema: "T.20", titulo: "T.20 — Control de acceso, identificación, recepción, información y atención en dependencias administrativas", preguntas: 30 },
            { id: "apoyo21", tema: "T.21", titulo: "T.21 — Apoyo a reuniones y comunicación: preparación de salas, mobiliario y medios audiovisuales", preguntas: 30 },
            { id: "apoyo22", tema: "T.22", titulo: "T.22 — Trabajos auxiliares de oficina: fotocopiado, escaneo, encuadernación, plastificado y grapado", preguntas: 30 },
        ],
    },
    {
        bloque: "Correspondencia y paquetería — Tema 23",
        tests: [
            { id: "apoyo23", tema: "T.23", titulo: "T.23 — Correspondencia y paquetería. Certificados, acuses de recibo, telegramas, reembolsos y notificaciones", preguntas: 30 },
        ],
    },
    {
        bloque: "Almacenamiento y movimiento de materiales — Temas 24 al 27",
        tests: [
            { id: "apoyo24", tema: "T.24", titulo: "T.24 — Almacenamiento de materiales: estanterías, espacios y materiales peligrosos", preguntas: 30 },
            { id: "apoyo25", tema: "T.25", titulo: "T.25 — Control de existencias de material: registros, fichas y albaranes", preguntas: 30 },
            { id: "apoyo26", tema: "T.26", titulo: "T.26 — Movimiento de material y equipos. Manejo y transporte de materiales combustibles e inflamables", preguntas: 30 },
            { id: "apoyo27", tema: "T.27", titulo: "T.27 — Retirada y reciclaje de residuos: clasificación, recogida y retirada selectiva", preguntas: 30 },
        ],
    },
    {
        bloque: "Mantenimiento y reparación de equipos e instalaciones — Temas 28 al 30",
        tests: [
            { id: "apoyo28", tema: "T.28", titulo: "T.28 — Nociones básicas de cerrajería, fontanería, electricidad, carpintería, albañilería y climatización", preguntas: 30 },
            { id: "apoyo29", tema: "T.29", titulo: "T.29 — Mantenimiento y revisión de elementos de seguridad: extintores y puertas cortafuegos", preguntas: 30 },
            { id: "apoyo30", tema: "T.30", titulo: "T.30 — Mantenimiento básico de vehículos", preguntas: 30 },
        ],
    },
    {
        bloque: "Simulacros Personal de Apoyo",
        tests: [
            { id: "sim_aux1", titulo: "Simulacro completo Personal de Apoyo — 60 preguntas", preguntas: 60 },
            { id: "sim_aux2", titulo: "Simulacro Parte General (Temas 1–14) — 50 preguntas", preguntas: 50 },
        ],
    },
]
export const dbAdministrativos: Bloque[] = [
    ...BLOQUE_COMUN,
    {
        bloque: "Presupuestos y Contabilidad — Temas 15 y 16",
        tests: [
            {
                id: "adm15",
                tema: "T.15",
                titulo: "T.15 — Presupuesto de gastos: fases de ejecución, créditos, residuos y fondos anticipados",
                preguntas: 30,
            },
            {
                id: "adm16",
                tema: "T.16",
                titulo: "T.16 — Presupuesto de ingresos: tipos, fases y devolución de ingresos indebidos",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Personal — Temas 17 y 18",
        tests: [
            {
                id: "adm17",
                tema: "T.17",
                titulo: "T.17 — Estructura del empleo en las AAPP vascas. Relación de puestos de trabajo. Cuerpos y Escalas",
                preguntas: 30,
            },
            {
                id: "adm18",
                tema: "T.18",
                titulo: "T.18 — Acceso al empleo público y provisión de puestos. Situaciones administrativas",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Organización y Gestión Administrativa — Temas 19 al 22",
        tests: [
            {
                id: "adm19",
                tema: "T.19",
                titulo: "T.19 — Gestión de la documentación en archivos de oficina. Sistema de Archivo de la CAE",
                preguntas: 30,
            },
            {
                id: "adm20",
                tema: "T.20",
                titulo: "T.20 — Registros electrónicos de entrada y salida en la CAE. Interoperabilidad",
                preguntas: 30,
            },
            {
                id: "adm21",
                tema: "T.21",
                titulo: "T.21 — El documento y el expediente administrativo. Copias, certificaciones y acceso",
                preguntas: 30,
            },
            {
                id: "adm22",
                tema: "T.22",
                titulo: "T.22 — Legalizaciones de firmas. Validación en la administración electrónica. Certificado electrónico",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Atención a la Ciudadanía — Temas 23 al 26",
        tests: [
            {
                id: "adm23",
                tema: "T.23",
                titulo: "T.23 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos y registros",
                preguntas: 30,
            },
            {
                id: "adm24",
                tema: "T.24",
                titulo: "T.24 — La ciudadanía como destinataria de servicios. Información, atención al público y quejas",
                preguntas: 30,
            },
            {
                id: "adm25",
                tema: "T.25",
                titulo: "T.25 — Comunicación escrita. Lenguaje administrativo no sexista. Tipos de documentos escritos",
                preguntas: 30,
            },
            {
                id: "adm26",
                tema: "T.26",
                titulo: "T.26 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Biblioteca — Tema 27",
        tests: [
            {
                id: "adm27",
                tema: "T.27",
                titulo: "T.27 — Centros de documentación y bibliotecas: concepto, funciones y redes bibliotecarias",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Procedimiento Administrativo — Temas 28 al 34",
        tests: [
            {
                id: "adm28",
                tema: "T.28",
                titulo: "T.28 — Fuentes del derecho administrativo. Jerarquía normativa. Principio de legalidad",
                preguntas: 30,
            },
            {
                id: "adm29",
                tema: "T.29",
                titulo: "T.29 — La organización administrativa. Órganos administrativos y colegiados",
                preguntas: 30,
            },
            {
                id: "adm30",
                tema: "T.30",
                titulo: "T.30 — El acto administrativo: concepto, eficacia. Silencio. Nulidad y anulabilidad",
                preguntas: 30,
            },
            {
                id: "adm31",
                tema: "T.31",
                titulo: "T.31 — Procedimiento administrativo: principios. Personas interesadas. Abstención y recusación",
                preguntas: 30,
            },
            {
                id: "adm32",
                tema: "T.32",
                titulo: "T.32 — Fases del procedimiento administrativo",
                preguntas: 30,
            },
            {
                id: "adm33",
                tema: "T.33",
                titulo: "T.33 — Revisión de los actos: recursos, revisión de oficio y rectificación de errores",
                preguntas: 30,
            },
            {
                id: "adm34",
                tema: "T.34",
                titulo: "T.34 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Simulacros Administrativos",
        tests: [
            {
                id: "sim_adm1",
                titulo: "Simulacro completo — 70 preguntas",
                preguntas: 70,
            },
            {
                id: "sim_adm2",
                titulo: "Simulacro Parte General + Procedimiento — 50 preguntas",
                preguntas: 50,
            },
        ],
    },
]

export const dbGestion: Bloque[] = [
    ...BLOQUE_COMUN,
    {
        bloque: "Organización y Gestión Administrativa — Temas 15 y 16",
        tests: [
            {
                id: "ges15",
                tema: "T.15",
                titulo: "T.15 — El documento y el expediente administrativo. Copias, certificaciones y acceso",
                preguntas: 30,
            },
            {
                id: "ges16",
                tema: "T.16",
                titulo: "T.16 — Legalizaciones de firmas. Validación en la administración electrónica. Certificado electrónico",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Atención a la Ciudadanía — Temas 17 al 19",
        tests: [
            {
                id: "ges17",
                tema: "T.17",
                titulo: "T.17 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos y registros",
                preguntas: 30,
            },
            {
                id: "ges18",
                tema: "T.18",
                titulo: "T.18 — Comunicación escrita en la Administración. Lenguaje administrativo no sexista",
                preguntas: 30,
            },
            {
                id: "ges19",
                tema: "T.19",
                titulo: "T.19 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Procedimiento Administrativo — Temas 20 al 26",
        tests: [
            {
                id: "ges20",
                tema: "T.20",
                titulo: "T.20 — Fuentes del derecho administrativo. Jerarquía normativa. Principio de legalidad",
                preguntas: 30,
            },
            {
                id: "ges21",
                tema: "T.21",
                titulo: "T.21 — La organización administrativa. Órganos administrativos y colegiados",
                preguntas: 30,
            },
            {
                id: "ges22",
                tema: "T.22",
                titulo: "T.22 — El acto administrativo: concepto, eficacia. Silencio. Nulidad y anulabilidad",
                preguntas: 30,
            },
            {
                id: "ges23",
                tema: "T.23",
                titulo: "T.23 — Procedimiento administrativo: principios. Personas interesadas. Abstención y recusación",
                preguntas: 30,
            },
            {
                id: "ges24",
                tema: "T.24",
                titulo: "T.24 — Fases del procedimiento administrativo",
                preguntas: 30,
            },
            {
                id: "ges25",
                tema: "T.25",
                titulo: "T.25 — Revisión de los actos: recursos, revisión de oficio y rectificación de errores",
                preguntas: 30,
            },
            {
                id: "ges26",
                tema: "T.26",
                titulo: "T.26 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Temario Específico — Próximamente",
        tests: [
            {
                id: "ges_pronto",
                titulo: "Temario específico — En preparación, disponible próximamente",
                preguntas: 0,
            },
        ],
    },
    {
        bloque: "Simulacros Técnicos de Gestión",
        tests: [
            {
                id: "sim_ges1",
                titulo: "Simulacro Parte General — 60 preguntas",
                preguntas: 60,
            },
            {
                id: "sim_ges2",
                titulo: "Simulacro Procedimiento Administrativo — 40 preguntas",
                preguntas: 40,
            },
        ],
    },
]

export const dbSuperiores: Bloque[] = [
    ...BLOQUE_COMUN,
    {
        bloque: "Organización y Gestión Administrativa — Temas 15 y 16",
        tests: [
            {
                id: "sup15",
                tema: "T.15",
                titulo: "T.15 — El documento y el expediente administrativo. Copias, certificaciones y acceso",
                preguntas: 30,
            },
            {
                id: "sup16",
                tema: "T.16",
                titulo: "T.16 — Legalizaciones de firmas. Validación electrónica. Certificado electrónico",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Atención a la Ciudadanía — Temas 17 al 19",
        tests: [
            {
                id: "sup17",
                tema: "T.17",
                titulo: "T.17 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos",
                preguntas: 30,
            },
            {
                id: "sup18",
                tema: "T.18",
                titulo: "T.18 — Comunicación escrita. Lenguaje administrativo no sexista. Tipos de documentos",
                preguntas: 30,
            },
            {
                id: "sup19",
                tema: "T.19",
                titulo: "T.19 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Procedimiento Administrativo General — Temas 20 al 26",
        tests: [
            {
                id: "sup20",
                tema: "T.20",
                titulo: "T.20 — Fuentes del derecho administrativo. Jerarquía normativa",
                preguntas: 30,
            },
            {
                id: "sup21",
                tema: "T.21",
                titulo: "T.21 — La organización administrativa. Órganos administrativos y colegiados",
                preguntas: 30,
            },
            {
                id: "sup22",
                tema: "T.22",
                titulo: "T.22 — El acto administrativo: concepto, eficacia. Silencio. Nulidad y anulabilidad",
                preguntas: 30,
            },
            {
                id: "sup23",
                tema: "T.23",
                titulo: "T.23 — Procedimiento administrativo: principios. Personas interesadas. Abstención y recusación",
                preguntas: 30,
            },
            {
                id: "sup24",
                tema: "T.24",
                titulo: "T.24 — Fases del procedimiento administrativo",
                preguntas: 30,
            },
            {
                id: "sup25",
                tema: "T.25",
                titulo: "T.25 — Revisión de los actos: recursos, revisión de oficio y rectificación de errores",
                preguntas: 30,
            },
            {
                id: "sup26",
                tema: "T.26",
                titulo: "T.26 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Temario Específico — Organización y Derecho (E.T.1–E.T.14)",
        tests: [
            {
                id: "supe01",
                tema: "E.T.1",
                titulo: "E.T.1 — Derechos y deberes fundamentales. Garantías de libertades y derechos",
                preguntas: 30,
            },
            {
                id: "supe02",
                tema: "E.T.2",
                titulo: "E.T.2 — Organización política de la CAE. Competencias Estado–CAE–Municipios",
                preguntas: 30,
            },
            {
                id: "supe03",
                tema: "E.T.3",
                titulo: "E.T.3 — Administración General de la CAE e Institucional. Gobierno Vasco. Potestad reglamentaria",
                preguntas: 30,
            },
            {
                id: "supe04",
                tema: "E.T.4",
                titulo: "E.T.4 — Fuentes del derecho administrativo. Jerarquía normativa. Autotutela",
                preguntas: 30,
            },
            {
                id: "supe05",
                tema: "E.T.5",
                titulo: "E.T.5 — Órganos administrativos. Competencia. Delegación. Avocación",
                preguntas: 30,
            },
            {
                id: "supe06",
                tema: "E.T.6",
                titulo: "E.T.6 — Encomienda de gestión. Convenios interadministrativos",
                preguntas: 30,
            },
            {
                id: "supe07",
                tema: "E.T.7",
                titulo: "E.T.7 — Capacidad de obrar e interesados. Representación. Derechos en las relaciones con la Administración",
                preguntas: 30,
            },
            {
                id: "supe08",
                tema: "E.T.8",
                titulo: "E.T.8 — El acto administrativo: producción, motivación. Notificación y publicación",
                preguntas: 30,
            },
            {
                id: "supe09",
                tema: "E.T.9",
                titulo: "E.T.9 — Nulidad y anulabilidad. Conversión, conservación y convalidación",
                preguntas: 30,
            },
            {
                id: "supe10",
                tema: "E.T.10",
                titulo: "E.T.10 — Revisión de actos. Recursos. Revisión de oficio. Rectificación de errores",
                preguntas: 30,
            },
            {
                id: "supe11",
                tema: "E.T.11",
                titulo: "E.T.11 — Obligación de resolver. Silencio administrativo. Términos y plazos",
                preguntas: 30,
            },
            {
                id: "supe12",
                tema: "E.T.12",
                titulo: "E.T.12 — Procedimiento: principios. Interesados y sus derechos. Abstención y recusación",
                preguntas: 30,
            },
            {
                id: "supe13",
                tema: "E.T.13",
                titulo: "E.T.13 — Fases del procedimiento: iniciación, instrucción, finalización y ejecución",
                preguntas: 30,
            },
            {
                id: "supe14",
                tema: "E.T.14",
                titulo: "E.T.14 — Responsabilidad patrimonial: principios y procedimiento",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Temario Específico — Función Pública Vasca (E.T.15–E.T.29)",
        tests: [
            {
                id: "supe15",
                tema: "E.T.15",
                titulo: "E.T.15 — La estructuración de las organizaciones. Diseño organizacional",
                preguntas: 30,
            },
            {
                id: "supe16",
                tema: "E.T.16",
                titulo: "E.T.16 — Cultura de la organización. Cambio organizativo. Modernización administrativa",
                preguntas: 30,
            },
            {
                id: "supe17",
                tema: "E.T.17",
                titulo: "E.T.17 — Administración General de la CAE: estructura y organización. Valoración de puestos",
                preguntas: 30,
            },
            {
                id: "supe18",
                tema: "E.T.18",
                titulo: "E.T.18 — Gobernanza pública. Atención multicanal a la ciudadanía. Tramitación electrónica",
                preguntas: 30,
            },
            {
                id: "supe19",
                tema: "E.T.19",
                titulo: "E.T.19 — Expediente electrónico. Identificación y firma electrónica. Archivo electrónico",
                preguntas: 30,
            },
            {
                id: "supe20",
                tema: "E.T.20",
                titulo: "E.T.20 — Servicio público. Formas de gestión: gestión directa y concesión",
                preguntas: 30,
            },
            {
                id: "supe21",
                tema: "E.T.21",
                titulo: "E.T.21 — Contratos del Sector Público: tipos, adjudicación y extinción",
                preguntas: 30,
            },
            {
                id: "supe22",
                tema: "E.T.22",
                titulo: "E.T.22 — Autorizaciones y licencias administrativas. Potestad sancionadora",
                preguntas: 30,
            },
            {
                id: "supe23",
                tema: "E.T.23",
                titulo: "E.T.23 — Personal empleado público vasco: clases, estructura, RPT y Oferta de Empleo",
                preguntas: 30,
            },
            {
                id: "supe24",
                tema: "E.T.24",
                titulo: "E.T.24 — Adquisición y pérdida de la condición de empleado público. Selección. Bolsas de trabajo",
                preguntas: 30,
            },
            {
                id: "supe25",
                tema: "E.T.25",
                titulo: "E.T.25 — Provisión definitiva y temporal de puestos. Concursos, libre designación",
                preguntas: 30,
            },
            {
                id: "supe26",
                tema: "E.T.26",
                titulo: "E.T.26 — Derechos y deberes del empleado público vasco. Retribuciones. Régimen disciplinario",
                preguntas: 30,
            },
            {
                id: "supe27",
                tema: "E.T.27",
                titulo: "E.T.27 — Personal laboral: selección, derechos, contrato laboral, provisión y movilidad",
                preguntas: 30,
            },
            {
                id: "supe28",
                tema: "E.T.28",
                titulo: "E.T.28 — Seguridad Social: régimen general, afiliación, cotización y prestaciones",
                preguntas: 30,
            },
            {
                id: "supe29",
                tema: "E.T.29",
                titulo: "E.T.29 — El perfil lingüístico. Euskera en procesos de selección y provisión",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Hacienda General del País Vasco (E.T.30–E.T.36)",
        tests: [
            {
                id: "supe30",
                tema: "E.T.30",
                titulo: "E.T.30 — Hacienda General del País Vasco: concepto, normativa. Presupuestos Generales de Euskadi",
                preguntas: 30,
            },
            {
                id: "supe31",
                tema: "E.T.31",
                titulo: "E.T.31 — Presupuestos Generales CAE: ámbito, estructura funcional, orgánica y territorial",
                preguntas: 30,
            },
            {
                id: "supe32",
                tema: "E.T.32",
                titulo: "E.T.32 — Procedimiento de elaboración presupuestaria. Modificaciones presupuestarias",
                preguntas: 30,
            },
            {
                id: "supe33",
                tema: "E.T.33",
                titulo: "E.T.33 — Ejecución de los presupuestos: ejecución del ingreso y del gasto",
                preguntas: 30,
            },
            {
                id: "supe34",
                tema: "E.T.34",
                titulo: "E.T.34 — Contabilidad Pública CAE: marco conceptual, principios contables",
                preguntas: 30,
            },
            {
                id: "supe35",
                tema: "E.T.35",
                titulo: "E.T.35 — Régimen de ayudas y subvenciones de la CAE: normas y competencia",
                preguntas: 30,
            },
            {
                id: "supe36",
                tema: "E.T.36",
                titulo: "E.T.36 — Subvenciones: objeto, requisitos, beneficiarios y reintegro",
                preguntas: 30,
            },
        ],
    },
    {
        bloque: "Gestión Pública Avanzada (E.T.37–E.T.47)",
        tests: [
            {
                id: "supe37",
                tema: "E.T.37",
                titulo: "E.T.37 — Gestión Pública Avanzada. Sistemas y tipos de contraste",
                preguntas: 30,
            },
            {
                id: "supe38",
                tema: "E.T.38",
                titulo: "E.T.38 — Los procesos en la Administración. Gestión por procesos: diseño, mapa y mejora",
                preguntas: 30,
            },
            {
                id: "supe39",
                tema: "E.T.39",
                titulo: "E.T.39 — Gestión por objetivos basada en datos. Indicadores. Gobernanza de datos en la CAE",
                preguntas: 30,
            },
            {
                id: "supe40",
                tema: "E.T.40",
                titulo: "E.T.40 — Planificación y gestión de proyectos: ciclo de vida, dirección y evaluación",
                preguntas: 30,
            },
            {
                id: "supe41",
                tema: "E.T.41",
                titulo: "E.T.41 — Satisfacción de la ciudadanía y calidad de los servicios públicos",
                preguntas: 30,
            },
            {
                id: "supe42",
                tema: "E.T.42",
                titulo: "E.T.42 — Gobierno Abierto: transparencia, protección de datos. Comisión Vasca de Acceso",
                preguntas: 30,
            },
            {
                id: "supe43",
                tema: "E.T.43",
                titulo: "E.T.43 — Igualdad: evaluación de impacto de género. Medidas en contratación y subvenciones",
                preguntas: 30,
            },
            {
                id: "supe44",
                tema: "E.T.44",
                titulo: "E.T.44 — Protección de datos: derechos, RAT, DPD. Autoridad Vasca de Protección de Datos",
                preguntas: 30,
            },
            {
                id: "supe45",
                tema: "E.T.45",
                titulo: "E.T.45 — Departamentos del Gobierno Vasco con competencias en políticas educativas",
                preguntas: 30,
            },
            {
                id: "supe46",
                tema: "E.T.46",
                titulo: "E.T.46 — Departamentos con competencias en comercio y consumo. Kontsumobide",
                preguntas: 30,
            },
            {
                id: "supe47",
                tema: "E.T.47",
                titulo: "E.T.47 — Docencia y formación en salud. Acreditación de tutores. Formación especializada (en preparación, disponible próximamente)",
                preguntas: 0,
            },
        ],
    },
    {
        bloque: "Simulacros Técnicos Superiores",
        tests: [
            {
                id: "sim_sup1",
                titulo: "Simulacro Parte General — 50 preguntas",
                preguntas: 50,
            },
            {
                id: "sim_sup2",
                titulo: "Simulacro Específico Parte I (E.T.1–E.T.14) — 60 preguntas",
                preguntas: 60,
            },
            {
                id: "sim_sup3",
                titulo: "Simulacro Específico Parte II (E.T.15–E.T.29) — 60 preguntas",
                preguntas: 60,
            },
            {
                id: "sim_sup4",
                titulo: "Simulacro Hacienda General del País Vasco — 40 preguntas",
                preguntas: 40,
            },
            {
                id: "sim_sup5",
                titulo: "Simulacro Gestión Pública Avanzada — 40 preguntas",
                preguntas: 40,
            },
            {
                id: "sim_sup6",
                titulo: "Simulacro completo Cuerpo Superior — 90 preguntas",
                preguntas: 90,
            },
        ],
    },
]

export type EscalaKey = "auxiliares" | "administrativos" | "gestion" | "superiores"

export function getCatalogo(escala: EscalaKey): Bloque[] {
    switch (escala) {
        case "auxiliares":
            return dbAuxiliares
        case "administrativos":
            return dbAdministrativos
        case "gestion":
            return dbGestion
        case "superiores":
            return dbSuperiores
    }
}

export const ESCALA_LABELS: Record<EscalaKey, string> = {
    auxiliares: "Personal de Apoyo",
    administrativos: "Administrativo",
    gestion: "Técnico de Gestión",
    superiores: "Técnico Superior",
}

// Mapa plano id → título construido a partir de todos los catálogos.
// Fuente única de la verdad para el nombre visible de cada test (dashboard,
// pantalla de test, resultados…). Al añadir tests al catálogo, su título
// queda disponible aquí automáticamente.
export const TITULOS_CATALOGO: Record<string, string> = (() => {
    const map: Record<string, string> = {}
    const todos = [
        ...dbAuxiliares,
        ...dbAdministrativos,
        ...dbGestion,
        ...dbSuperiores,
    ]
    for (const bloque of todos) {
        for (const t of bloque.tests) {
            if (!map[t.id]) map[t.id] = t.titulo
        }
    }
    return map
})()
