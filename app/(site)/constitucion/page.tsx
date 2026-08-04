import Link from "next/link"
import TestsLead from "@/components/site/TestsLead"
import type { Metadata } from "next"
import TemaTests, { type TemaTest } from "@/components/tests/TemaTests"
import LeccionHero from "@/components/lecciones/LeccionHero"
import PuntosExamen from "@/components/lecciones/PuntosExamen"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import FaqLeccion, { type Faq } from "@/components/lecciones/FaqLeccion"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

export const metadata: Metadata = {
    title: "Test Constitución Española — Oposiciones Euskadi",
    description:
        "Tests de la Constitución Española y la organización del Estado para oposiciones de Euskadi: derechos, garantías, CCAA, Unión Europea e instituciones vascas. Practica gratis.",
    keywords: [
        "test constitución española",
        "test constitución oposiciones",
        "constitución española OPE Gobierno Vasco",
        "tema 1 oposiciones",
        "preguntas constitución 1978",
    ],
    alternates: { canonical: "/constitucion" },
}

const TESTS: TemaTest[] = [
    // Tema 1 (pool grande) presentado en 11 bloques de ~30, cada uno con su
    // propio contenido y su propio progreso (ids sintéticos c01_bN).
    ...Array.from({ length: 11 }, (_, i) => ({
        id: `c01_b${i + 1}`,
        tema: `T.1 · B${i + 1}`,
        titulo: `La Constitución: derechos, libertades y garantías — Bloque ${i + 1} de 11`,
        preguntas: 30,
    })),
    { id: "c02", tema: "T.2", titulo: "Organización territorial del Estado. Comunidades Autónomas y Estatutos de Autonomía", preguntas: 30 },
    { id: "c03", tema: "T.3", titulo: "Derecho de la Unión Europea. Instituciones. Reglamentos y Directivas", preguntas: 30 },
    { id: "c04", tema: "T.4", titulo: "Organización política y administrativa de la CAE. Parlamento, Gobierno Vasco y Lehendakari", preguntas: 30 },
    { id: "c05", tema: "T.5", titulo: "Distribución de competencias CAE–Territorios Históricos. Concierto Económico. Instituciones Locales", preguntas: 30 },
]

const PUNTOS = [
    { t: "Derechos y garantías", d: "Título I, derechos fundamentales, garantías y recurso de amparo (art. 53)." },
    { t: "Organización territorial", d: "Comunidades Autónomas, Estatutos de Autonomía y distribución de competencias." },
    { t: "Unión Europea", d: "Instituciones de la UE, reglamentos y directivas." },
    { t: "Instituciones vascas", d: "Parlamento Vasco, Gobierno Vasco, Lehendakari y Concierto Económico." },
]

const FAQS: Faq[] = [
    {
        q: "¿Cuántas preguntas de la Constitución entran en el examen?",
        a: "Depende de la escala, pero la Constitución (tema 1) es uno de los temas con más peso en la OPE del Gobierno Vasco. En Gainditu tienes más de 430 preguntas, incluyendo la organización del Estado (temas 1 a 5), para practicarla a fondo.",
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
        a: "Sí. Puedes crear una cuenta gratis y practicar. El acceso Premium añade exámenes oficiales, simulacros con penalización oficial y estadísticas avanzadas.",
    },
]

export default function ConstitucionPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Temario oficial · OPE 2026"
                title="La Constitución Española"
                subtitle="La Constitución y la organización del Estado (temas 1 a 5), de lo más preguntado. Domínalos a base de tests reales, no de leer artículos."
                accent={ACCENT}
                stats={[
                    { n: "430", label: "preguntas" },
                    { n: "5", label: "temas" },
                    { n: "1978", label: "Constitución" },
                    { n: "169", label: "artículos" },
                ]}
            />

            <PuntosExamen puntos={PUNTOS} accent={ACCENT} />

            <section id="tests" className="scroll-mt-20 px-5 py-8">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Tests de la Constitución
                    </h2>
                    <TestsLead
                        prefix="Constitución y organización del Estado, tema a tema (temas 1 a 5 de la parte general)."
                        guestTail="para ver tu progreso."
                        loggedTail="Tu progreso se guarda automáticamente."
                    />
                    <TemaTests tests={TESTS} accent={ACCENT} />
                </div>
            </section>

            <FaqLeccion faqs={FAQS} accent={ACCENT} />

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Desbloquea todo el temario"
                texto="Hazte Premium y accede a exámenes oficiales, simulacros con penalización real del examen y estadísticas avanzadas para todas las escalas."
                cta="Ver acceso Premium →"
            />

            <div className="mx-auto mb-12 max-w-4xl px-5">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <Link href="/ley-39-2015" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                        → Ley 39/2015
                    </Link>
                    <Link href="/" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                        → Todos los tests por escala
                    </Link>
                    <Link href="/convocatorias" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                        → Convocatorias de Euskadi
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
