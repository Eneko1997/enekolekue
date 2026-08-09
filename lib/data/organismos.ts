// Fuente ÚNICA de los organismos y cuerpos que cubre (o cubrirá) Gainditu.
// Añadir un organismo aquí lo propaga a la home, metadata y páginas que lo usen,
// sin tocar diez sitios. El posicionamiento del proyecto es "oposiciones de
// Euskadi / País Vasco"; el Gobierno Vasco es uno más de los organismos.

export interface Organismo {
    slug: string
    /** Nombre completo, p. ej. "Gobierno Vasco". */
    nombre: string
    /** Nombre corto para listados. */
    corto: string
    /** Una línea de contexto. */
    descripcion: string
    /** Cuerpos / categorías principales cubiertos. */
    cuerpos: string[]
    /** ¿Hay ya temario/tests en la plataforma para este organismo? */
    disponibleTests: boolean
}

export const ORGANISMOS: Organismo[] = [
    {
        slug: "gobierno-vasco",
        nombre: "Gobierno Vasco",
        corto: "Gobierno Vasco",
        descripcion: "Administración General de la CAE (pruebas del IVAP).",
        cuerpos: [
            "Personal de Apoyo",
            "Administrativo",
            "Técnico de Gestión",
            "Técnico Superior",
        ],
        disponibleTests: true,
    },
    {
        slug: "osakidetza",
        nombre: "Osakidetza",
        corto: "Osakidetza",
        descripcion: "Servicio Vasco de Salud.",
        cuerpos: [
            "Administrativo/a",
            "Auxiliar administrativo/a",
            "Celador/a",
            "Auxiliar de enfermería",
            "Enfermería",
        ],
        disponibleTests: false,
    },
    {
        slug: "ertzaintza",
        nombre: "Ertzaintza",
        corto: "Ertzaintza",
        descripcion: "Policía del País Vasco (Academia de Arkaute).",
        cuerpos: ["Agente (Escala Básica)"],
        disponibleTests: false,
    },
    {
        slug: "educacion",
        nombre: "Educación (Hezkuntza)",
        corto: "Educación",
        descripcion: "Docentes de la enseñanza pública vasca.",
        cuerpos: ["Maestros/as", "Profesorado de Secundaria"],
        disponibleTests: false,
    },
    {
        slug: "diputaciones-forales",
        nombre: "Diputaciones Forales",
        corto: "Diputaciones",
        descripcion: "Álava, Bizkaia y Gipuzkoa.",
        cuerpos: ["Administrativo/a", "Auxiliar administrativo/a"],
        disponibleTests: false,
    },
    {
        slug: "administracion-local",
        nombre: "Ayuntamientos",
        corto: "Ayuntamientos",
        descripcion: "Administración local del País Vasco.",
        cuerpos: ["Administrativo/a", "Auxiliar administrativo/a", "Personal de servicios"],
        disponibleTests: false,
    },
    {
        slug: "policia-local",
        nombre: "Policía Local (Euskadi)",
        corto: "Policía Local",
        descripcion: "Agentes de Policía Local de los municipios vascos.",
        cuerpos: ["Agente de Policía Local"],
        disponibleTests: false,
    },
    {
        slug: "bomberos",
        nombre: "Bomberos",
        corto: "Bomberos",
        descripcion: "Servicios de extinción de incendios (forales y municipales).",
        cuerpos: ["Bombero/a", "Bombero/a conductor/a"],
        disponibleTests: false,
    },
]

/** Nombres cortos para listar en copys ("Gobierno Vasco, Osakidetza, …"). */
export const ORGANISMOS_NOMBRES = ORGANISMOS.map((o) => o.corto)

export function getOrganismo(slug: string): Organismo | undefined {
    return ORGANISMOS.find((o) => o.slug === slug)
}
