// Constantes globales del sitio para SEO y enlaces.

export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://gaindituoposiciones.com"

export const SITE_NAME = "Gainditu"

export const SITE_DESCRIPTION =
    "Tests para preparar las oposiciones de Euskadi: Gobierno Vasco, Osakidetza, Ertzaintza, Educación y más. Practica por temario oficial y mide tu progreso."

export const CONTACT_EMAIL = "gaindituoposiciones@gmail.com"

export const SOCIAL = {
    instagram: "https://instagram.com/gainditu",
}
