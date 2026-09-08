// Constantes globales del sitio para SEO y enlaces.

export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://gaindituoposiciones.com"

export const SITE_NAME = "Gainditu"

export const SITE_DESCRIPTION =
    "Tests por temario oficial, simulacros y seguimiento de tu progreso para tu oposición en Euskadi. A tu ritmo, tanto si empiezas de cero como si te sientes preparado."

export const CONTACT_EMAIL = "info@gaindituoposiciones.com"

export const SOCIAL = {
    instagram: "https://www.instagram.com/gaindituoposiciones/",
    tiktok: "https://www.tiktok.com/@gaindituoposiciones",
    twitter: "https://x.com/gaindituopo",
    linkedin: "https://www.linkedin.com/company/gainditu-oposiciones/",
}
