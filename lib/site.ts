// Constantes globales del sitio para SEO y enlaces.

export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://gaindituoposiciones.com"

export const SITE_NAME = "Gainditu"

export const SITE_DESCRIPTION =
    "El portal de las oposiciones de Euskadi: tests, convocatorias, temario y herramientas. Gobierno Vasco, Osakidetza, Ertzaintza, Educación y más, por temario oficial."

export const CONTACT_EMAIL = "gaindituoposiciones@gmail.com"

export const SOCIAL = {
    instagram: "https://instagram.com/gainditu",
}
