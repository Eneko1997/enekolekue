import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site"

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
})

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} — Tests OPE Gobierno Vasco 2026 (IVAP)`,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [
        "OPE Gobierno Vasco",
        "oposiciones Euskadi",
        "IVAP",
        "test oposiciones",
        "auxiliar administrativo",
        "administrativo",
        "técnico de gestión",
        "Ley 39/2015",
        "Constitución Española",
    ],
    authors: [{ name: SITE_NAME }],
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        locale: "es_ES",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: `${SITE_NAME} — Tests OPE Gobierno Vasco 2026`,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} — Tests OPE Gobierno Vasco 2026`,
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
            className={`${inter.variable} h-full antialiased`}
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
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    )
}
