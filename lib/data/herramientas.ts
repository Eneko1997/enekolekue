// Metadatos de las herramientas gratuitas (/herramientas). Fuente única para el
// índice y las páginas.

export interface Herramienta {
    slug: string
    titulo: string
    /** Subtítulo/gancho corto. */
    subtitulo: string
    /** Descripción SEO (120-155). */
    descripcion: string
    /** Solo disponible con acceso Premium. */
    premium?: boolean
}

export const HERRAMIENTAS: Herramienta[] = [
    {
        slug: "calculadora-nota-corte",
        titulo: "Calculadora de nota de corte",
        subtitulo: "Tu nota según aciertos, fallos y penalización.",
        descripcion:
            "Calcula tu nota de oposición según aciertos, fallos, preguntas en blanco y la penalización de la convocatoria. Al instante, con tu cuenta gratis de Gainditu.",
    },
    {
        slug: "ratio-aspirantes-plaza",
        titulo: "Ratio aspirantes por plaza",
        subtitulo: "Cómo de competida está tu oposición.",
        descripcion:
            "Calcula el ratio de aspirantes por plaza de una oposición y descubre cómo de competida está de verdad. Herramienta Premium de Gainditu.",
        premium: true,
    },
    {
        slug: "equivalencias-perfil-linguistico",
        titulo: "Equivalencias de perfil lingüístico",
        subtitulo: "PL1-PL4 ↔ MCER ↔ EGA / HABE / EOI.",
        descripcion:
            "Tabla y conversor de perfiles lingüísticos de euskera (PL1-PL4) con sus equivalencias en el MCER (B1-C2), EGA, HABE y EOI. Qué perfil pide cada oposición.",
    },
    {
        slug: "que-oposicion-elegir",
        titulo: "¿Qué oposición elegir?",
        subtitulo: "Encuentra la oposición de Euskadi que encaja contigo.",
        descripcion:
            "Test rápido para descubrir qué oposición de Euskadi encaja con tu titulación, tu nivel de euskera y tu área de interés. Con tu cuenta gratis de Gainditu.",
    },
]

export function getHerramienta(slug: string): Herramienta | undefined {
    return HERRAMIENTAS.find((h) => h.slug === slug)
}
