import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Prevención de Riesgos Laborales (Ley 31/1995) — Oposiciones Euskadi",
    description:
        "Tests gratis de prevención de riesgos laborales (Ley 31/1995) para oposiciones de Euskadi: obligaciones del empresario, principios de la acción preventiva, EPIs, pantallas de visualización y primeros auxilios.",
    keywords: [
        "test prevención de riesgos laborales",
        "test Ley 31/1995",
        "test PRL oposiciones",
        "test riesgos laborales gratis",
        "prevención riesgos laborales test",
        "test primeros auxilios oposiciones",
    ],
    alternates: { canonical: "/prevencion-riesgos-laborales" },
}

const TESTS: TemaTest[] = [
    { id: "c11", tema: "Ley 31/1995", titulo: "Ley 31/1995 de Prevención de Riesgos Laborales: obligaciones, principios de la acción preventiva y derechos", preguntas: 30 },
    { id: "c12", tema: "Pantallas (PVD)", titulo: "Puestos con pantallas de visualización de datos (RD 488/1997): ergonomía y prevención", preguntas: 30 },
    { id: "c13", tema: "Primeros auxilios", titulo: "Primeros auxilios: actuación PAS, RCP básica y situaciones de emergencia", preguntas: 30 },
    { id: "apoyo31", tema: "Ergonomía", titulo: "Ergonomía y prevención de sobreesfuerzos: manipulación de cargas y posturas forzadas", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "Ley 31/1995 (LPRL)", detalle: "Marco general de la prevención: derecho a la protección eficaz, obligaciones del empresario y derechos y deberes de los trabajadores." },
    { titulo: "Principios de la acción preventiva", detalle: "Evitar los riesgos, evaluar los que no se puedan evitar, combatirlos en el origen y anteponer la protección colectiva a la individual." },
    { titulo: "Organización de la prevención", detalle: "Servicios de prevención, delegados de prevención y el Comité de Seguridad y Salud (a partir de 50 trabajadores)." },
    { titulo: "Equipos y emergencias", detalle: "Equipos de protección individual (EPI), pantallas de visualización de datos y actuación en primeros auxilios." },
]

const PUNTOS = [
    { t: "Obligación del empresario", d: "Garantizar la seguridad y la salud de los trabajadores en todos los aspectos del trabajo." },
    { t: "Principios preventivos", d: "El orden de los principios de la acción preventiva del artículo 15, empezando por evitar el riesgo." },
    { t: "EPI y protección colectiva", d: "Cuándo se usa el EPI (cuando el riesgo no se puede evitar por medios colectivos) y sus reglas." },
    { t: "Primeros auxilios", d: "La secuencia Proteger-Avisar-Socorrer (PAS) y las nociones básicas de RCP." },
]

const FAQS: Faq[] = [
    { q: "¿A quién se aplica la Ley 31/1995?", a: "Con carácter general, a las relaciones laborales y a las Administraciones Públicas, con particularidades para policía, Fuerzas Armadas y protección civil en casos de grave riesgo o catástrofe." },
    { q: "¿Cuál es el primer principio de la acción preventiva?", a: "Evitar los riesgos. Solo los que no se pueden evitar se evalúan y se combaten en su origen." },
    { q: "¿A partir de cuántos trabajadores es obligatorio el Comité de Seguridad y Salud?", a: "A partir de 50 trabajadores. Es un dato muy repetido en el examen." },
    { q: "¿Entran los primeros auxilios en la oposición?", a: "Sí, sobre todo en las escalas de Personal de Apoyo: la secuencia PAS y la RCP básica son contenidos habituales." },
]

const JSON_LD = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: "Tests de Prevención de Riesgos Laborales (Ley 31/1995) — Oposiciones Euskadi", educationalLevel: "Oposiciones", about: "Prevención de riesgos laborales (Ley 31/1995)", provider: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}/prevencion-riesgos-laborales` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Prevención de Riesgos Laborales", item: `${SITE_URL}/prevencion-riesgos-laborales` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]

export default function PrlPage() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · Euskadi"
            title="Prevención de Riesgos Laborales"
            subtitle="La Ley 31/1995, los EPIs, las pantallas y los primeros auxilios. Un bloque muy rentable, a base de tests."
            ley="Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales"
            stats={[
                { n: "80+", label: "preguntas" },
                { n: "1995", label: "LPRL" },
                { n: "50", label: "trabajadores (Comité)" },
                { n: "PAS", label: "primeros auxilios" },
            ]}
            enOposiciones="Es un tema del bloque común de la OPE del Gobierno Vasco, con especial peso en Personal de Apoyo (donde entran también los primeros auxilios y la ergonomía)."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de prevención de riesgos laborales"
            testsLead={{ prefix: "De la Ley 31/1995 a los primeros auxilios, tema a tema.", guestTail: "para ver tu mejor nota en cada test.", loggedTail: "Tu mejor nota aparece en cada test." }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "Temario completo", href: "/temario" },
                { label: "Personal de Apoyo del Gobierno Vasco", href: "/guias/personal-de-apoyo-gobierno-vasco-sin-titulacion" },
                { label: "Convocatorias de Euskadi", href: "/convocatorias" },
            ]}
            fuenteOficial={{ label: "Ley 31/1995 — texto consolidado (BOE)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292" }}
            muestra={{ testId: "c11", total: 80 }}
            jsonLd={JSON_LD}
        />
    )
}
