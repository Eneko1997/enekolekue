import Link from "next/link"
import type { Metadata } from "next"
import TemaTests, { type TemaTest } from "@/components/tests/TemaTests"
import LeccionHero from "@/components/lecciones/LeccionHero"
import PuntosExamen from "@/components/lecciones/PuntosExamen"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import FaqLeccion, { type Faq } from "@/components/lecciones/FaqLeccion"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

export const metadata: Metadata = {
    title: "Test Constitución Española — Oposiciones OPE Gobierno Vasco 2026",
    description:
        "Tests de la Constitución Española para la OPE del Gobierno Vasco 2026 (IVAP): más de 400 preguntas sobre derechos, garantías y organización del Estado. Practica gratis el tema 1.",
    keywords: [
        "test constitución española",
        "test constitución oposiciones",
        "constitución española OPE Gobierno Vasco",
        "tema 1 oposiciones IVAP",
        "preguntas constitución 1978",
    ],
    alternates: { canonical: "/constitucion" },
}

const TESTS: TemaTest[] = [
    { id: "c01", tema: "T.1", titulo: "La Constitución: derechos, libertades y garantías. Deberes. Principios constitucionales de la actuación administrativa", preguntas: 350 },
    { id: "c02", tema: "T.2", titulo: "Organización territorial del Estado. Comunidades Autónomas y Estatutos de Autonomía", preguntas: 30 },
    { id: "c04", tema: "T.4", titulo: "Organización política y administrativa de la CAE. Parlamento, Gobierno Vasco y Lehendakari", preguntas: 30 },
]

const PUNTOS = [
    { t: "Derechos y libertades", d: "Título I: fundamentales (arts. 15–29), garantías y suspensión de derechos." },
    { t: "Garantías (art. 53)", d: "Recurso de amparo, reserva de ley orgánica y niveles de protección." },
    { t: "Organización del Estado", d: "Corona, Cortes Generales, Gobierno y poder judicial." },
    { t: "Euskadi", d: "Parlamento Vasco, Gobierno Vasco y Lehendakari." },
]

const FAQS: Faq[] = [
    {
        q: "¿Cuántas preguntas de la Constitución entran en el examen?",
        a: "Depende de la escala, pero la Constitución (tema 1) es uno de los temas con más peso en la OPE del Gobierno Vasco. En Gainditu tienes más de 400 preguntas para practicarlo a fondo.",
    },
    {
        q: "¿Qué partes de la Constitución son más importantes para la oposición?",
        a: "Los derechos y libertades del Título I, las garantías del artículo 53, la organización del Estado y, en Euskadi, las instituciones de la CAE (Parlamento Vasco, Gobierno Vasco y Lehendakari).",
    },
    {
        q: "¿La Constitución es el tema 1 en todas las escalas?",
        a: "Sí, forma parte del bloque común (temas 1 al 14), por lo que entra en Personal de Apoyo, Administrativos, Técnicos de Gestión y Superiores.",
    },
    {
        q: "¿Puedo practicar los tests de la Constitución gratis?",
        a: "Sí. Puedes crear una cuenta gratis y practicar. El acceso Premium añade exámenes oficiales, simulacros con penalización IVAP y estadísticas avanzadas.",
    },
]

export default function ConstitucionPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Temario IVAP · OPE 2026"
                title="La Constitución Española"
                subtitle="El tema 1 y de los más preguntados. Domínalo a base de tests reales, no de leer artículos."
                accent={ACCENT}
                stats={[
                    { n: "410", label: "preguntas" },
                    { n: "1978", label: "año" },
                    { n: "T.1", label: "bloque común" },
                    { n: "169", label: "artículos" },
                ]}
            />

            <PuntosExamen puntos={PUNTOS} accent={ACCENT} />

            <section id="tests" className="scroll-mt-20 px-5 py-8">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-zinc-950">
                        Tests de la Constitución
                    </h2>
                    <p className="mb-6 text-sm text-zinc-500">
                        Más de 350 preguntas solo del tema 1.{" "}
                        <Link href="/login" className="font-semibold text-zinc-950 hover:underline">
                            Inicia sesión
                        </Link>{" "}
                        para ver tu progreso.
                    </p>
                    <TemaTests tests={TESTS} accent={ACCENT} />
                </div>
            </section>

            <FaqLeccion faqs={FAQS} accent={ACCENT} />

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Desbloquea todo el temario"
                texto="Hazte Premium y accede a exámenes oficiales, simulacros con penalización real del IVAP y estadísticas avanzadas para todas las escalas."
                cta="Ver acceso Premium →"
            />

            <div className="mx-auto mb-12 max-w-4xl px-5">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                    <Link href="/ley-39-2015" className="hover:text-zinc-950 hover:underline">
                        → Ley 39/2015
                    </Link>
                    <Link href="/dashboard" className="hover:text-zinc-950 hover:underline">
                        → Todos los tests por escala
                    </Link>
                    <Link href="/fechas-opes" className="hover:text-zinc-950 hover:underline">
                        → Fechas de las OPEs 2026
                    </Link>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "LearningResource",
                            name: "Tests de la Constitución Española — OPE Gobierno Vasco 2026",
                            educationalLevel: "Oposiciones",
                            about: "Constitución Española de 1978",
                            provider: { "@type": "Organization", name: "Gainditu" },
                            url: `${SITE_URL}/constitucion`,
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
                                { "@type": "ListItem", position: 2, name: "La Constitución Española", item: `${SITE_URL}/constitucion` },
                            ],
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
        </main>
    )
}
