// Contenido de las páginas de normativa (/temario/[slug]). Separado del JSX.
// Cada norma: qué es, en qué oposiciones entra, estructura, puntos más
// preguntados (plazos, mayorías, órganos, competencias), CTA a su test y FAQ.

export interface PuntoNorma {
    t: string
    d: string
}
export interface SeccionEstructura {
    titulo: string
    detalle: string
}
export interface Enlace {
    label: string
    href: string
}
export interface FaqNorma {
    q: string
    a: string
}

export interface Normativa {
    slug: string
    /** Título corto para nav/índice. */
    titulo: string
    /** Nombre/identificación de la norma. */
    ley: string
    eyebrow: string
    /** H1 de la página. */
    h1: string
    /** 2-3 frases: qué es y por qué entra en el examen. */
    intro: string
    /** En qué oposiciones concretas entra (enlaces a hubs/convocatorias). */
    enOposiciones: string
    /** Estructura navegable de la norma. */
    estructura: SeccionEstructura[]
    /** Lo que más se pregunta. */
    puntosClave: PuntoNorma[]
    /** CTA al test de ese bloque (o null). */
    test: Enlace | null
    faqs: FaqNorma[]
    /** Otras normas/páginas relacionadas. */
    relacionadas: Enlace[]
    /** Fuente oficial (BOE/BOPV) para "consulta el texto". */
    fuenteOficial?: Enlace
}

export const NORMATIVAS: Normativa[] = [
    // ───────────────────────── Estatuto de Gernika ─────────────────────────
    {
        slug: "estatuto-gernika",
        titulo: "Estatuto de Gernika",
        ley: "LO 3/1979, de 18 de diciembre, de Estatuto de Autonomía del País Vasco",
        eyebrow: "Normativa vasca",
        h1: "Estatuto de Gernika (Estatuto de Autonomía del País Vasco)",
        intro:
            "Es la norma institucional básica de Euskadi: aprobada en referéndum el 25 de octubre de 1979, define las instituciones de la Comunidad Autónoma, sus competencias y su encaje con el Estado. Cae en prácticamente toda oposición vasca.",
        enOposiciones:
            "Entra en el bloque común de todas las escalas del Gobierno Vasco y también en Diputaciones, ayuntamientos, Osakidetza y Ertzaintza.",
        estructura: [
            { titulo: "Título Preliminar", detalle: "Territorio, símbolos, lenguas oficiales (euskera y castellano) y los Territorios Históricos." },
            { titulo: "Título I — Competencias", detalle: "Competencias exclusivas (art. 10), de desarrollo legislativo y de ejecución." },
            { titulo: "Título II — Poderes", detalle: "Parlamento Vasco, Gobierno y Lehendakari, y Administración de Justicia en la CAE." },
            { titulo: "Título III — Hacienda y Patrimonio", detalle: "El Concierto Económico y el sistema de Hacienda propia (art. 41)." },
            { titulo: "Título IV — Reforma", detalle: "Procedimiento de reforma del Estatuto." },
        ],
        puntosClave: [
            { t: "Lenguas oficiales", d: "El euskera y el castellano son las dos lenguas oficiales de Euskadi (art. 6)." },
            { t: "Territorios Históricos", d: "Álava, Bizkaia y Gipuzkoa, con sus Órganos Forales." },
            { t: "Competencias exclusivas", d: "El art. 10 enumera las competencias exclusivas de la CAE." },
            { t: "Concierto Económico", d: "Relación tributaria y financiera con el Estado (art. 41)." },
            { t: "Reforma", d: "Requiere mayoría absoluta del Parlamento Vasco y referéndum." },
        ],
        test: { label: "Practica instituciones vascas", href: "/test?id=c04" },
        faqs: [
            { q: "¿Qué es el Estatuto de Gernika?", a: "La norma institucional básica del País Vasco (LO 3/1979), aprobada en referéndum en 1979, que fija las instituciones y competencias de la Comunidad Autónoma." },
            { q: "¿Cuáles son las lenguas oficiales según el Estatuto?", a: "El euskera y el castellano, ambas oficiales en todo el territorio de la CAE (art. 6)." },
            { q: "¿Cómo se reforma el Estatuto?", a: "Por el procedimiento del Título IV: aprobación por mayoría absoluta del Parlamento Vasco y ratificación en referéndum." },
        ],
        relacionadas: [
            { label: "Instituciones comunes y Territorios Históricos", href: "/temario/instituciones-comunes-territorios-historicos" },
            { label: "La Constitución Española", href: "/constitucion" },
        ],
        fuenteOficial: { label: "Texto en el BOE (LO 3/1979)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-1979-30177" },
    },

    // ─────────────────── Ley de Empleo Público Vasco ───────────────────
    {
        slug: "ley-funcion-publica-vasca",
        titulo: "Función Pública Vasca",
        ley: "Ley 11/2022, de 1 de diciembre, de Empleo Público Vasco",
        eyebrow: "Normativa vasca",
        h1: "Ley de Empleo Público Vasco (Ley 11/2022)",
        intro:
            "Regula el empleo público en las Administraciones vascas: clases de personal, acceso, carrera, derechos y deberes, código ético y régimen disciplinario. Sustituye a la antigua Ley 6/1989 y es clave en las oposiciones a cualquier administración vasca.",
        enOposiciones:
            "Bloque común de las escalas del Gobierno Vasco y, por su ámbito, también en Diputaciones y ayuntamientos.",
        estructura: [
            { titulo: "Clases de personal", detalle: "Funcionariado de carrera e interino, personal laboral y personal eventual (arts. 27-30)." },
            { titulo: "Acceso y provisión", detalle: "Principios de igualdad, mérito y capacidad; sistemas selectivos y provisión de puestos." },
            { titulo: "Derechos y deberes", detalle: "Derechos individuales y colectivos, deberes y código ético." },
            { titulo: "Situaciones administrativas", detalle: "Servicio activo, excedencias, servicios especiales, etc." },
            { titulo: "Régimen disciplinario", detalle: "Faltas leves, graves y muy graves y sus sanciones (arts. 178 y ss.)." },
            { titulo: "Euskera", detalle: "Perfiles lingüísticos y su preceptividad en los puestos." },
        ],
        puntosClave: [
            { t: "Clases de personal", d: "Carrera, interino, laboral y eventual: distínguelos bien (arts. 27-30)." },
            { t: "Faltas muy graves", d: "El acoso y el abandono del servicio, entre otras (art. 178)." },
            { t: "Agrupación por cuerpos", d: "Cuerpos, escalas, especialidades y la agrupación profesional de personal de apoyo (art. 56)." },
            { t: "Acceso", d: "Igualdad, mérito y capacidad, con publicidad y transparencia." },
            { t: "Perfiles lingüísticos", d: "PL1-PL4 y su carácter preceptivo o de mérito según el puesto." },
        ],
        test: { label: "Test de función pública vasca", href: "/test?id=c09" },
        faqs: [
            { q: "¿Qué ley regula la función pública vasca?", a: "La Ley 11/2022, de 1 de diciembre, de Empleo Público Vasco, que sustituyó a la Ley 6/1989." },
            { q: "¿Qué clases de personal distingue?", a: "Funcionariado de carrera e interino, personal laboral y personal eventual (arts. 27-30)." },
            { q: "¿Qué falta es muy grave?", a: "Entre otras, el acoso laboral, sexual o por razón de sexo y el abandono del servicio (art. 178)." },
        ],
        relacionadas: [
            { label: "EBEP (estatal)", href: "/temario/ebep" },
            { label: "Normalización del euskera", href: "/temario/ley-normalizacion-euskera" },
        ],
        fuenteOficial: { label: "Texto en el BOPV (Ley 11/2022)", href: "https://www.euskadi.eus/y22-bopv/es/p43aBOPVWebWar/VerParalelo.do?cd2022005556" },
    },

    // ─────────────────── Ley de Normalización del Euskera ───────────────────
    {
        slug: "ley-normalizacion-euskera",
        titulo: "Normalización del Euskera",
        ley: "Ley 10/1982, de 24 de noviembre, básica de normalización del uso del Euskera",
        eyebrow: "Normativa vasca",
        h1: "Ley de Normalización del Euskera (Ley 10/1982)",
        intro:
            "La ley básica que desarrolla la cooficialidad del euskera: derechos lingüísticos de la ciudadanía y uso del euskera en la Administración, la enseñanza y los medios. Detrás está el sistema de perfiles lingüísticos que piden las oposiciones.",
        enOposiciones:
            "Bloque común de todas las escalas del Gobierno Vasco; el perfil lingüístico afecta a casi cualquier oposición vasca.",
        estructura: [
            { titulo: "Derechos lingüísticos", detalle: "Derecho a usar el euskera o el castellano en las relaciones con la Administración." },
            { titulo: "Euskera en la Administración", detalle: "Uso del euskera y perfiles lingüísticos del personal." },
            { titulo: "Euskera en la enseñanza", detalle: "El euskera como lengua vehicular y de estudio." },
            { titulo: "Euskera en los medios", detalle: "Medios de comunicación y normalización." },
        ],
        puntosClave: [
            { t: "Cooficialidad", d: "Euskera y castellano son cooficiales; nadie puede ser discriminado por razón de lengua." },
            { t: "Perfiles lingüísticos", d: "PL1-PL4, con fechas de preceptividad e índices de obligado cumplimiento." },
            { t: "HABE e IVAP", d: "HABE (alfabetización/euskaldunización) e IVAP (acreditación de perfiles del personal)." },
            { t: "Derecho de la ciudadanía", d: "Relacionarse con la Administración en la lengua oficial que elija." },
        ],
        test: { label: "Test de normalización del euskera", href: "/test?id=c08" },
        faqs: [
            { q: "¿Qué es la Ley de Normalización del Euskera?", a: "La Ley 10/1982, ley básica que regula la cooficialidad y el uso del euskera en Euskadi." },
            { q: "¿Qué es un perfil lingüístico?", a: "El nivel de euskera (PL1 a PL4) asociado a un puesto de trabajo público, que puede ser preceptivo o valorarse como mérito." },
            { q: "¿Puedo dirigirme a la Administración en castellano?", a: "Sí: la ciudadanía tiene derecho a relacionarse con la Administración en euskera o en castellano, a su elección." },
        ],
        relacionadas: [
            { label: "Equivalencias de perfil lingüístico", href: "/herramientas/equivalencias-perfil-linguistico" },
            { label: "Función Pública Vasca", href: "/temario/ley-funcion-publica-vasca" },
        ],
        fuenteOficial: { label: "Texto en el BOE (Ley 10/1982)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2012-3402" },
    },

    // ─────────────────── Ley de Igualdad de Euskadi ───────────────────
    {
        slug: "ley-igualdad-euskadi",
        titulo: "Igualdad de Euskadi",
        ley: "Ley 4/2005, para la Igualdad de Mujeres y Hombres y vidas libres de violencia machista",
        eyebrow: "Normativa vasca",
        h1: "Ley de Igualdad de Euskadi (Ley 4/2005)",
        intro:
            "Establece los principios y medidas para la igualdad de mujeres y hombres en Euskadi y para una vida libre de violencia machista. Es un tema transversal muy recurrente en las oposiciones vascas (modificada en profundidad por la Ley 1/2022).",
        enOposiciones:
            "Bloque común de las escalas del Gobierno Vasco y presente, como materia transversal, en el resto de administraciones vascas.",
        estructura: [
            { titulo: "Principios generales", detalle: "Igualdad de trato y de oportunidades, acción positiva, transversalidad de género." },
            { titulo: "Medidas para integrar la igualdad", detalle: "Evaluación previa del impacto en función del género, lenguaje e imágenes no sexistas." },
            { titulo: "Emakunde", detalle: "Instituto Vasco de la Mujer: impulso y coordinación de las políticas de igualdad." },
            { titulo: "Representación equilibrada", detalle: "Presencia equilibrada de mujeres y hombres en órganos y tribunales." },
        ],
        puntosClave: [
            { t: "Representación equilibrada", d: "Ninguno de los dos sexos por debajo del 40% ni por encima del 60%." },
            { t: "Emakunde", d: "Organismo que impulsa y coordina la igualdad en la CAE." },
            { t: "Acción positiva", d: "Medidas temporales para corregir situaciones de desigualdad." },
            { t: "Transversalidad", d: "La perspectiva de género se integra en todas las políticas públicas." },
            { t: "Impacto de género", d: "Evaluación previa del impacto en función del género de las normas." },
        ],
        test: { label: "Test de igualdad", href: "/test?id=c06" },
        faqs: [
            { q: "¿Qué ley regula la igualdad en Euskadi?", a: "La Ley 4/2005 para la Igualdad de Mujeres y Hombres, modificada en profundidad por la Ley 1/2022." },
            { q: "¿Qué es la representación equilibrada?", a: "Que en órganos y tribunales cada sexo tenga al menos un 40% y como máximo un 60% de presencia." },
            { q: "¿Qué es Emakunde?", a: "El Instituto Vasco de la Mujer, encargado de impulsar y coordinar las políticas de igualdad de la CAE." },
        ],
        relacionadas: [
            { label: "Estatuto de Gernika", href: "/temario/estatuto-gernika" },
            { label: "La Constitución Española", href: "/constitucion" },
        ],
        fuenteOficial: { label: "Texto en el BOE (Ley 4/2005)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-20561" },
    },

    // ────── Instituciones Comunes y Territorios Históricos (LTH) ──────
    {
        slug: "instituciones-comunes-territorios-historicos",
        titulo: "Instituciones y Territorios Históricos",
        ley: "Ley 27/1983, de Relaciones entre las Instituciones Comunes y los Órganos Forales (LTH)",
        eyebrow: "Normativa vasca",
        h1: "Instituciones Comunes y Territorios Históricos (Ley 27/1983, LTH)",
        intro:
            "La «Ley de Territorios Históricos» reparte las competencias entre las Instituciones Comunes de la CAE (Parlamento y Gobierno Vasco) y los Órganos Forales de Álava, Bizkaia y Gipuzkoa (Juntas Generales y Diputaciones Forales). Es la arquitectura institucional interna de Euskadi.",
        enOposiciones:
            "Bloque común de las escalas del Gobierno Vasco y, de forma destacada, en las oposiciones de las Diputaciones Forales.",
        estructura: [
            { titulo: "Instituciones Comunes", detalle: "Parlamento Vasco y Gobierno Vasco." },
            { titulo: "Órganos Forales", detalle: "Juntas Generales (normativo) y Diputaciones Forales (ejecutivo) de cada Territorio Histórico." },
            { titulo: "Competencias", detalle: "Exclusivas de los Territorios Históricos (art. 7), de desarrollo y de ejecución." },
            { titulo: "Comisión Arbitral", detalle: "Resuelve conflictos de competencia entre Instituciones Comunes y Órganos Forales." },
            { titulo: "Finanzas", detalle: "Consejo Vasco de Finanzas Públicas y aportaciones de las Diputaciones." },
        ],
        puntosClave: [
            { t: "Competencias exclusivas de los TH", d: "El art. 7 enumera las competencias exclusivas de los Territorios Históricos." },
            { t: "Comisión Arbitral", d: "Órgano que resuelve los conflictos de competencia entre las instituciones." },
            { t: "Consejo Vasco de Finanzas Públicas", d: "Coordina la Hacienda de la CAE y de los Territorios Históricos." },
            { t: "Juntas Generales vs Diputación", d: "Las Juntas Generales son el órgano normativo; la Diputación Foral, el ejecutivo." },
        ],
        test: { label: "Test de instituciones y competencias", href: "/test?id=c05" },
        faqs: [
            { q: "¿Qué es la Ley de Territorios Históricos?", a: "La Ley 27/1983 (LTH), que regula el reparto de competencias entre las Instituciones Comunes de la CAE y los Órganos Forales." },
            { q: "¿Qué es la Comisión Arbitral?", a: "El órgano que resuelve los conflictos de competencia entre las Instituciones Comunes y los Órganos Forales de los Territorios Históricos." },
            { q: "¿Qué diferencia hay entre Juntas Generales y Diputación Foral?", a: "Las Juntas Generales son el órgano representativo y normativo del Territorio Histórico; la Diputación Foral es su órgano ejecutivo." },
        ],
        relacionadas: [
            { label: "Estatuto de Gernika", href: "/temario/estatuto-gernika" },
            { label: "Ley de Instituciones Locales de Euskadi", href: "/temario/ley-municipal-euskadi" },
        ],
        fuenteOficial: { label: "Texto en el BOE (Ley 27/1983)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2012-1213" },
    },

    // ─────────────────── Ley de Instituciones Locales de Euskadi ───────────────────
    {
        slug: "ley-municipal-euskadi",
        titulo: "Instituciones Locales de Euskadi",
        ley: "Ley 2/2016, de 7 de abril, de Instituciones Locales de Euskadi",
        eyebrow: "Normativa vasca",
        h1: "Ley de Instituciones Locales de Euskadi (Ley 2/2016)",
        intro:
            "Regula el régimen de los municipios vascos: sus competencias propias, su organización, la garantía de la autonomía local y su financiación. Es la referencia para las oposiciones de ayuntamientos del País Vasco.",
        enOposiciones:
            "Oposiciones de ayuntamientos del País Vasco y bloque común de las escalas del Gobierno Vasco.",
        estructura: [
            { titulo: "Autonomía municipal", detalle: "Garantía de la autonomía local y posición del municipio en Euskadi." },
            { titulo: "Competencias", detalle: "Competencias propias de los municipios vascos." },
            { titulo: "Organización", detalle: "Órganos municipales y su funcionamiento." },
            { titulo: "Participación y euskera", detalle: "Participación ciudadana y uso del euskera en el ámbito local." },
            { titulo: "Financiación", detalle: "Consejo Vasco de Finanzas Públicas Locales y recursos municipales." },
        ],
        puntosClave: [
            { t: "Competencias propias", d: "La ley enumera las competencias propias de los municipios vascos." },
            { t: "Autonomía local", d: "Garantía reforzada de la autonomía municipal en Euskadi." },
            { t: "Euskera en lo local", d: "El municipio como ámbito de uso normalizado del euskera." },
            { t: "Financiación local", d: "Órganos de coordinación de la financiación municipal." },
        ],
        test: { label: "Test de instituciones locales", href: "/test?id=c05" },
        faqs: [
            { q: "¿Qué ley regula los municipios vascos?", a: "La Ley 2/2016, de Instituciones Locales de Euskadi, que regula sus competencias, organización y financiación." },
            { q: "¿Qué competencias tienen los municipios?", a: "Las competencias propias que enumera la ley, con garantía reforzada de la autonomía local." },
        ],
        relacionadas: [
            { label: "Instituciones y Territorios Históricos", href: "/temario/instituciones-comunes-territorios-historicos" },
            { label: "Convocatorias de Ayuntamientos", href: "/convocatorias" },
        ],
        fuenteOficial: { label: "Texto en el BOE (Ley 2/2016)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2016-4171" },
    },

    // ─────────────────── Ley 40/2015 ───────────────────
    {
        slug: "ley-40-2015",
        titulo: "Ley 40/2015",
        ley: "Ley 40/2015, de 1 de octubre, de Régimen Jurídico del Sector Público",
        eyebrow: "Normativa estatal",
        h1: "Ley 40/2015, de Régimen Jurídico del Sector Público",
        intro:
            "La «hermana» de la Ley 39/2015: mientras la 39 regula el procedimiento (relación con el ciudadano), la 40 regula la organización y el funcionamiento interno del sector público, las relaciones entre Administraciones y la responsabilidad patrimonial.",
        enOposiciones:
            "Bloque común y específicos de las escalas administrativas del Gobierno Vasco, y en general en toda oposición administrativa.",
        estructura: [
            { titulo: "Órganos administrativos", detalle: "Creación, competencia, delegación y avocación." },
            { titulo: "Órganos colegiados", detalle: "Composición, convocatoria, quórum y actas; abstención y recusación." },
            { titulo: "Principios de actuación", detalle: "Servicio, buena fe, confianza legítima, lealtad institucional." },
            { titulo: "Sector público institucional", detalle: "Organismos autónomos, entidades públicas empresariales, etc." },
            { titulo: "Relaciones interadministrativas", detalle: "Convenios y cooperación entre Administraciones." },
            { titulo: "Responsabilidad y potestad sancionadora", detalle: "Principios de la responsabilidad patrimonial y de la potestad sancionadora." },
        ],
        puntosClave: [
            { t: "Abstención y recusación", d: "Causas y efectos: actuar mediando causa de abstención no invalida por sí solo, pero genera responsabilidad." },
            { t: "Delegación y avocación", d: "No cabe delegar en materias sancionadoras concretas ni la resolución de recursos." },
            { t: "Órganos colegiados", d: "Convocatoria, quórum de constitución y régimen de actas." },
            { t: "Responsabilidad patrimonial", d: "Objetiva y directa: funcionamiento normal o anormal, salvo fuerza mayor." },
            { t: "Convenios", d: "Requisitos y contenido mínimo de los convenios entre Administraciones." },
        ],
        test: { label: "Practica organización administrativa", href: "/oposiciones/administrativo" },
        faqs: [
            { q: "¿Qué diferencia hay entre la Ley 39/2015 y la 40/2015?", a: "La 39/2015 regula el procedimiento administrativo común (relación con el ciudadano) y la 40/2015 el Régimen Jurídico del Sector Público (organización y funcionamiento interno)." },
            { q: "¿Dónde se regula la responsabilidad patrimonial?", a: "Los principios están en la Ley 40/2015 y el procedimiento en la Ley 39/2015: es una materia compartida." },
        ],
        relacionadas: [
            { label: "Ley 39/2015 (procedimiento)", href: "/ley-39-2015" },
            { label: "EBEP", href: "/temario/ebep" },
        ],
        fuenteOficial: { label: "Texto en el BOE (Ley 40/2015)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10566" },
    },

    // ─────────────────── EBEP ───────────────────
    {
        slug: "ebep",
        titulo: "EBEP",
        ley: "RDL 5/2015, texto refundido del Estatuto Básico del Empleado Público",
        eyebrow: "Normativa estatal",
        h1: "EBEP — Estatuto Básico del Empleado Público (RDL 5/2015)",
        intro:
            "La norma estatal básica de la función pública: clases de personal, derechos y deberes, código de conducta, acceso, carrera, situaciones y régimen disciplinario. Es la base común sobre la que se asienta la Ley 11/2022 de Empleo Público Vasco.",
        enOposiciones:
            "Bloque común de las escalas del Gobierno Vasco y de cualquier oposición a la función pública (estatal, autonómica o local).",
        estructura: [
            { titulo: "Clases de personal", detalle: "Funcionariado de carrera e interino, personal laboral y eventual, y directivo." },
            { titulo: "Derechos y deberes", detalle: "Derechos individuales y colectivos; deberes y código de conducta." },
            { titulo: "Acceso al empleo público", detalle: "Igualdad, mérito y capacidad; requisitos y sistemas selectivos." },
            { titulo: "Carrera y evaluación", detalle: "Carrera profesional, provisión de puestos y evaluación del desempeño." },
            { titulo: "Situaciones administrativas", detalle: "Servicio activo, excedencias, servicios especiales, suspensión." },
            { titulo: "Régimen disciplinario", detalle: "Faltas y sanciones; principios de la potestad disciplinaria." },
        ],
        puntosClave: [
            { t: "Clases de personal", d: "Distingue funcionario de carrera, interino, laboral, eventual y directivo profesional." },
            { t: "Acceso", d: "Principios constitucionales de igualdad, mérito y capacidad, con publicidad." },
            { t: "Código de conducta", d: "Principios éticos y de conducta que rigen la actuación del empleado público." },
            { t: "Situaciones administrativas", d: "Servicio activo, excedencias, servicios especiales, suspensión de funciones." },
            { t: "Faltas y sanciones", d: "Clasificación en leves, graves y muy graves y sus sanciones." },
        ],
        test: { label: "Test de empleo público", href: "/test?id=c09" },
        faqs: [
            { q: "¿Qué es el EBEP?", a: "El Estatuto Básico del Empleado Público (RDL 5/2015), norma estatal básica que regula el régimen de los empleados públicos." },
            { q: "¿Qué relación tiene con la Ley 11/2022 vasca?", a: "El EBEP es la norma básica estatal; la Ley 11/2022 de Empleo Público Vasco la desarrolla y adapta en la CAE." },
        ],
        relacionadas: [
            { label: "Función Pública Vasca (Ley 11/2022)", href: "/temario/ley-funcion-publica-vasca" },
            { label: "Ley 40/2015", href: "/temario/ley-40-2015" },
        ],
        fuenteOficial: { label: "Texto en el BOE (RDL 5/2015)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11719" },
    },
]

export function getNormativa(slug: string): Normativa | undefined {
    return NORMATIVAS.find((n) => n.slug === slug)
}

/** Páginas de temario que ya existen (con su propia URL) para el índice /temario. */
export const TEMARIO_EXISTENTE: { titulo: string; ley: string; href: string }[] = [
    { titulo: "La Constitución Española", ley: "Constitución de 1978 y organización del Estado", href: "/constitucion" },
    { titulo: "Ley 39/2015", ley: "Procedimiento Administrativo Común", href: "/ley-39-2015" },
]
