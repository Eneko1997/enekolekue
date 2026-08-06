import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

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

const ESTRUCTURA = [
    { titulo: "Título Preliminar", detalle: "Principios básicos: Estado social y democrático de Derecho, soberanía nacional, lenguas y símbolos (arts. 1 a 9)." },
    { titulo: "Título I — Derechos y deberes", detalle: "Derechos fundamentales, garantías y recurso de amparo. El artículo 53 y la suspensión de derechos (art. 55)." },
    { titulo: "Títulos II a VI — Poderes del Estado", detalle: "La Corona, las Cortes Generales, el Gobierno y la Administración, y el Poder Judicial." },
    { titulo: "Títulos VII y VIII — Economía y territorio", detalle: "Economía y Hacienda y la organización territorial del Estado (municipios, provincias y Comunidades Autónomas)." },
    { titulo: "Títulos IX y X — Tribunal Constitucional y reforma", detalle: "El Tribunal Constitucional y los procedimientos de reforma constitucional (arts. 166 a 169)." },
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

const JSON_LD = [
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
]

export default function ConstitucionPage() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · OPE 2026"
            title="La Constitución Española"
            subtitle="La Constitución y la organización del Estado (temas 1 a 5), de lo más preguntado. Domínalos a base de tests reales, no de leer artículos."
            ley="Constitución Española de 1978"
            stats={[
                { n: "430", label: "preguntas" },
                { n: "5", label: "temas" },
                { n: "1978", label: "Constitución" },
                { n: "169", label: "artículos" },
            ]}
            enOposiciones="Forma parte del bloque común de todas las escalas del Gobierno Vasco (Personal de Apoyo, Administrativos, Técnicos de Gestión y Superiores) y también entra en Diputaciones Forales, ayuntamientos, Osakidetza y Ertzaintza."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de la Constitución"
            testsLead={{
                prefix: "Constitución y organización del Estado, tema a tema (temas 1 a 5 de la parte general).",
                guestTail: "para ver tu progreso.",
                loggedTail: "Tu progreso se guarda automáticamente.",
            }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "Ley 39/2015", href: "/ley-39-2015" },
                { label: "Todos los tests por escala", href: "/" },
                { label: "Convocatorias de Euskadi", href: "/convocatorias" },
            ]}
            fuenteOficial={{
                label: "Texto consolidado (BOE)",
                href: "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229",
            }}
            jsonLd={JSON_LD}
        />
    )
}
