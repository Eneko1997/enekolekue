// Constantes globales del sitio para SEO y enlaces.

export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://gainditu.com"

export const SITE_NAME = "Gainditu"

export const SITE_DESCRIPTION =
    "Tests por tema oficial del IVAP para la OPE del Gobierno Vasco 2026. Auxiliares, Administrativos, Técnicos de Gestión y Superiores. Practica con miles de preguntas y mide tu progreso."

export const CONTACT_EMAIL = "gaindituoposiciones@gmail.com"

export const SOCIAL = {
    instagram: "https://instagram.com/gainditu",
}
