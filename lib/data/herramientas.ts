// Metadatos de las herramientas gratuitas (/herramientas). Fuente única para el
// índice y las páginas.

export interface Herramienta {
    slug: string
    titulo: string
    /** Subtítulo/gancho corto. */
    subtitulo: string
    /** Descripción SEO (120-155). */
    descripcion: string
    /** Uso libre, sin necesidad de cuenta (imán SEO). El resto exige registro. */
    libre?: boolean
    /** Herramienta estrella: se muestra como banner destacado en el índice. */
    destacada?: boolean
}

export const HERRAMIENTAS: Herramienta[] = [
    {
        slug: "calculadora-nota-corte",
        titulo: "Calculadora de nota de corte",
        subtitulo: "Tu nota según aciertos, fallos y penalización.",
        descripcion:
            "Calcula tu nota de oposición según aciertos, fallos, preguntas en blanco y la penalización de la convocatoria. Gratis, sin registro y al instante.",
        libre: true,
    },
    {
        slug: "calculadora-meritos-gobierno-vasco",
        titulo: "Calculadora de méritos del Gobierno Vasco",
        subtitulo: "Tu puntuación de la fase de concurso: experiencia, titulaciones y euskera.",
        descripcion:
            "Calcula los puntos de la fase de concurso de la OPE del Gobierno Vasco 2026 (Administrativo y Personal de Apoyo): experiencia, titulaciones y euskera, según el baremo oficial del BOPV. Gratis y al instante.",
        libre: true,
    },
    {
        slug: "que-oposicion-elegir",
        titulo: "¿Qué oposición elegir?",
        subtitulo: "Análisis personalizado: la oposición de Euskadi que encaja contigo.",
        descripcion:
            "Análisis personalizado para descubrir qué oposición de Euskadi encaja con tu titulación, tu nivel de euskera y tu área de interés. Con tu cuenta gratis de Gainditu.",
        destacada: true,
    },
]

export function getHerramienta(slug: string): Herramienta | undefined {
    return HERRAMIENTAS.find((h) => h.slug === slug)
}
