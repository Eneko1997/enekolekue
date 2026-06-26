import type { Metadata } from "next"
import DashboardClient from "@/components/dashboard/DashboardClient"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

export const metadata: Metadata = {
    title: { absolute: "Gainditu — Tests OPE Gobierno Vasco 2026 (IVAP)" },
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
}

export default function HomePage() {
    return (
        <>
            <DashboardClient />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        name: SITE_NAME,
                        url: SITE_URL,
                        description: SITE_DESCRIPTION,
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: SITE_NAME,
                        url: SITE_URL,
                        description:
                            "Tests por tema oficial del IVAP para la OPE del Gobierno Vasco 2026.",
                    }),
                }}
            />
        </>
    )
}
