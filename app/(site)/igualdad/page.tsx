import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Igualdad (DL 1/2023) — Oposiciones Euskadi",
    description:
        "Tests gratis de igualdad de mujeres y hombres para oposiciones de Euskadi: Decreto Legislativo 1/2023, conceptos (discriminación directa e indirecta, acción positiva, transversalidad), Emakunde y representación equilibrada.",
    keywords: [
        "test igualdad oposiciones",
        "test DL 1/2023 igualdad",
        "test igualdad mujeres y hombres",
        "test Emakunde",
        "igualdad de género test",
        "test igualdad Euskadi gratis",
    ],
    alternates: { canonical: "/igualdad" },
}

const TESTS: TemaTest[] = [
    { id: "c06", tema: "DL 1/2023", titulo: "Igualdad de mujeres y hombres (DL 1/2023): principios, conceptos y medidas de acción positiva", preguntas: 30 },
    { id: "supe43", tema: "Políticas de igualdad", titulo: "Políticas de igualdad, transversalidad de género y evaluación de impacto en función del género", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "DL 1/2023 (texto refundido)", detalle: "Decreto Legislativo 1/2023, texto refundido de la Ley para la Igualdad de Mujeres y Hombres y Vidas Libres de Violencia Machista contra las Mujeres." },
    { titulo: "Conceptos clave", detalle: "Discriminación directa e indirecta, acción positiva, transversalidad (mainstreaming), representación equilibrada y lenguaje no sexista." },
    { titulo: "Instituciones y herramientas", detalle: "Emakunde (Instituto Vasco de la Mujer), la evaluación previa del impacto en función del género y los planes de igualdad." },
    { titulo: "Violencia machista", detalle: "Definiciones y ejes de actuación de los poderes públicos frente a la violencia contra las mujeres." },
]

const PUNTOS = [
    { t: "Discriminación y acción positiva", d: "Diferencia entre discriminación directa e indirecta y qué son las medidas de acción positiva." },
    { t: "Transversalidad y representación", d: "La perspectiva de género en todas las políticas y la representación equilibrada (ni más del 60% ni menos del 40% de un sexo)." },
    { t: "Emakunde y evaluación de impacto", d: "El papel de Emakunde y la evaluación previa del impacto de género de las normas." },
    { t: "Lenguaje y conciliación", d: "Lenguaje inclusivo en la Administración y medidas de conciliación y corresponsabilidad." },
]

const FAQS: Faq[] = [
    { q: "¿Qué norma regula la igualdad en Euskadi?", a: "El Decreto Legislativo 1/2023, texto refundido de la Ley para la Igualdad de Mujeres y Hombres y Vidas Libres de Violencia Machista contra las Mujeres. Sustituyó a la anterior Ley 4/2005." },
    { q: "¿Qué es la discriminación indirecta?", a: "Una disposición o práctica aparentemente neutra que perjudica de forma desproporcionada a las personas de un sexo, sin una justificación objetiva." },
    { q: "¿Qué es la representación equilibrada?", a: "Que ningún sexo supere el 60% ni baje del 40% de las personas en un ámbito. Es un dato que cae con frecuencia." },
    { q: "¿Entra la igualdad en la oposición del Gobierno Vasco?", a: "Sí: la normativa de igualdad forma parte del bloque común de todas las escalas y también entra en Diputaciones Forales y ayuntamientos." },
]

const JSON_LD = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: "Tests de Igualdad (DL 1/2023) — Oposiciones Euskadi", educationalLevel: "Oposiciones", about: "Igualdad de mujeres y hombres (DL 1/2023)", provider: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}/igualdad` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Igualdad", item: `${SITE_URL}/igualdad` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]

export default function IgualdadPage() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · Euskadi"
            title="Igualdad de mujeres y hombres"
            subtitle="El DL 1/2023, los conceptos clave y las políticas de igualdad. Un tema que cae seguro, a base de tests."
            ley="Decreto Legislativo 1/2023, texto refundido de la Ley para la Igualdad de Mujeres y Hombres y Vidas Libres de Violencia Machista"
            stats={[
                { n: "50+", label: "preguntas" },
                { n: "2023", label: "texto refundido" },
                { n: "40-60%", label: "representación" },
                { n: "Emakunde", label: "instituto" },
            ]}
            enOposiciones="Forma parte del bloque común de todas las escalas de la OPE del Gobierno Vasco (Personal de Apoyo, Administrativos, Técnicos de Gestión y Superiores) y también en Diputaciones Forales y ayuntamientos."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de igualdad"
            testsLead={{ prefix: "De los conceptos a las políticas de igualdad, tema a tema.", guestTail: "para ver tu mejor nota en cada test.", loggedTail: "Tu mejor nota aparece en cada test." }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "Temario completo", href: "/temario" },
                { label: "Constitución Española", href: "/constitucion" },
                { label: "Convocatorias de Euskadi", href: "/convocatorias" },
            ]}
            fuenteOficial={{ label: "DL 1/2023 (BOPV)", href: "https://www.euskadi.eus/bopv2/datos/2023/03/2301481a.pdf" }}
            muestra={{ testId: "c06", total: 50 }}
            jsonLd={JSON_LD}
        />
    )
}
