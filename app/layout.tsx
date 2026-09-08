import type { Metadata } from "next"
import { Manrope, Inter } from "next/font/google"
import "./globals.css"
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site"
import CookieBanner from "@/components/site/CookieBanner"
import PostAuthRedirect from "@/components/auth/PostAuthRedirect"
import PasswordRecoveryGate from "@/components/auth/PasswordRecoveryGate"
import PresenceTracker from "@/components/presence/PresenceTracker"

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
    display: "swap",
})

// Solo para las superficies de lectura del test (enunciado, opciones y
// explicación): más legible en textos densos que Manrope.
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
})

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} — Oposiciones de Euskadi: tests, convocatorias y temario`,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [
        "oposiciones Euskadi",
        "oposiciones País Vasco",
        "tests oposiciones Euskadi",
        "test oposiciones online",
        "oposiciones Gobierno Vasco",
        "oposiciones Osakidetza",
        "oposiciones Ertzaintza",
        "oposiciones Educación País Vasco",
    ],
    authors: [{ name: SITE_NAME }],
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        locale: "es_ES",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: `${SITE_NAME} — Oposiciones de Euskadi: tests, convocatorias y temario`,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} — Oposiciones de Euskadi: tests, convocatorias y temario`,
        description: SITE_DESCRIPTION,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="es"
            className={`${manrope.variable} ${inter.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <head>
                {/* Aplica el tema guardado antes de pintar (evita parpadeo) */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
                    }}
                />
            </head>
            <body className="flex min-h-full flex-col overflow-x-clip">
                {children}
                <PostAuthRedirect />
                <PasswordRecoveryGate />
                <PresenceTracker />
                <CookieBanner />
            </body>
        </html>
    )
}
