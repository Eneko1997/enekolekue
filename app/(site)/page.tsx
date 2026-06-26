import Link from "next/link"
import type { Metadata } from "next"
import DashboardClient from "@/components/dashboard/DashboardClient"
import FaqLeccion, { type Faq } from "@/components/lecciones/FaqLeccion"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

export const metadata: Metadata = {
    title: { absolute: "Gainditu — Tests OPE Gobierno Vasco 2026 (IVAP)" },
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
}

const ESCALAS = [
    { label: "Auxiliar Administrativo", href: "/?escala=auxiliares" },
    { label: "Administrativo", href: "/?escala=administrativos" },
    { label: "Técnico de Gestión", href: "/?escala=gestion" },
    { label: "Técnico Superior", href: "/?escala=superiores" },
]

const RECURSOS = [
    { label: "Test de la Constitución Española", href: "/constitucion" },
    { label: "Test de la Ley 39/2015", href: "/ley-39-2015" },
    { label: "Fechas de las OPEs 2026", href: "/fechas-opes" },
]

const FAQS: Faq[] = [
    {
        q: "¿Qué es Gainditu?",
        a: "Una plataforma de tests para preparar las oposiciones de la OPE del Gobierno Vasco 2026, con preguntas organizadas por el temario oficial del IVAP.",
    },
    {
        q: "¿Los tests son gratis?",
        a: "Sí. Creas una cuenta gratis y empiezas a practicar. El acceso Premium añade exámenes oficiales de convocatorias anteriores, simulacros con penalización real del IVAP y estadísticas avanzadas.",
    },
    {
        q: "¿Qué escalas y cuerpos cubrís?",
        a: "Auxiliares Administrativos, Administrativos, Técnicos de Gestión y Técnicos Superiores del Gobierno Vasco, con el bloque común (temas 1–14) y los específicos de cada escala.",
    },
    {
        q: "¿Incluye la Constitución y la Ley 39/2015?",
        a: "Sí, además de tests específicos tienes páginas dedicadas a la Constitución Española y a la Ley 39/2015 del Procedimiento Administrativo Común.",
    },
]

export default function HomePage() {
    return (
        <>
            <DashboardClient />

            {/* Bloque de contenido para SEO (renderizado en servidor) */}
            <section className="border-t border-white/10 px-5 py-14">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                        Tests para la OPE del Gobierno Vasco 2026
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/65">
                        {SITE_NAME} es la plataforma de tests para preparar las
                        oposiciones del Gobierno Vasco (Eusko Jaurlaritza).
                        Practica el temario oficial del IVAP tema a tema —
                        Constitución, Ley 39/2015, organización de Euskadi,
                        empleo público vasco, protección de datos o prevención de
                        riesgos— con miles de preguntas, simulacros con
                        penalización real y seguimiento de tu progreso.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <div>
                            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/50">
                                Por escala
                            </h3>
                            <ul className="space-y-2">
                                {ESCALAS.map((e) => (
                                    <li key={e.href}>
                                        <Link
                                            href={e.href}
                                            className="text-sm text-white/70 hover:text-white hover:underline"
                                        >
                                            Tests de {e.label} — OPE Gobierno Vasco
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/50">
                                Temas destacados
                            </h3>
                            <ul className="space-y-2">
                                {RECURSOS.map((r) => (
                                    <li key={r.href}>
                                        <Link
                                            href={r.href}
                                            className="text-sm text-white/70 hover:text-white hover:underline"
                                        >
                                            {r.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <FaqLeccion faqs={FAQS} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: SITE_NAME,
                            url: SITE_URL,
                            description: SITE_DESCRIPTION,
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: SITE_NAME,
                            url: SITE_URL,
                            description:
                                "Tests por tema oficial del IVAP para la OPE del Gobierno Vasco 2026.",
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: FAQS.map((f) => ({
                                "@type": "Question",
                                name: f.q,
                                acceptedAnswer: { "@type": "Answer", text: f.a },
                            })),
                        },
                    ]),
                }}
            />
        </>
    )
}
