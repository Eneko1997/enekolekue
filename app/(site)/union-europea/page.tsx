import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Unión Europea — Oposiciones Euskadi",
    description:
        "Tests gratis de la Unión Europea para oposiciones de Euskadi: instituciones (Parlamento, Consejo, Comisión, TJUE), fuentes del Derecho de la UE (reglamento, directiva, decisión), principios y mercado interior.",
    keywords: [
        "test unión europea oposiciones",
        "test UE oposiciones",
        "test instituciones europeas",
        "test reglamento directiva UE",
        "derecho unión europea test",
        "test unión europea gratis",
    ],
    alternates: { canonical: "/union-europea" },
}

const TESTS: TemaTest[] = [
    { id: "c03", tema: "UE", titulo: "La Unión Europea: instituciones, fuentes del Derecho (reglamentos y directivas) y principios", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "Instituciones de la UE", detalle: "Parlamento Europeo, Consejo Europeo, Consejo, Comisión, Tribunal de Justicia (TJUE), Banco Central Europeo y Tribunal de Cuentas." },
    { titulo: "Fuentes del Derecho", detalle: "Derecho originario (Tratados TUE y TFUE) y derecho derivado: reglamentos (aplicación directa), directivas (requieren transposición), decisiones, recomendaciones y dictámenes." },
    { titulo: "Principios y competencias", detalle: "Principios de atribución, subsidiariedad y proporcionalidad; primacía y efecto directo del Derecho de la UE." },
    { titulo: "Ciudadanía y mercado interior", detalle: "Ciudadanía europea, las cuatro libertades del mercado interior y el espacio Schengen." },
]

const PUNTOS = [
    { t: "Instituciones", d: "Qué hace cada institución: iniciativa legislativa de la Comisión, colegislación de Parlamento y Consejo." },
    { t: "Reglamento vs directiva", d: "El reglamento es obligatorio y directamente aplicable; la directiva obliga en el resultado y requiere transposición." },
    { t: "Principios", d: "Subsidiariedad, proporcionalidad, primacía y efecto directo del Derecho de la Unión." },
    { t: "Ciudadanía y libertades", d: "Ciudadanía europea y libre circulación de personas, mercancías, servicios y capitales." },
]

const FAQS: Faq[] = [
    { q: "¿Qué diferencia hay entre un reglamento y una directiva europea?", a: "El reglamento es de alcance general, obligatorio y directamente aplicable en todos los Estados. La directiva obliga en cuanto al resultado, pero deja a cada Estado la forma y los medios (requiere transposición)." },
    { q: "¿Cuáles son las instituciones de la UE?", a: "Parlamento Europeo, Consejo Europeo, Consejo, Comisión, Tribunal de Justicia de la UE, Banco Central Europeo y Tribunal de Cuentas." },
    { q: "¿Qué es el principio de subsidiariedad?", a: "Que la UE actúa solo si los objetivos se alcanzan mejor a escala europea que a escala nacional." },
    { q: "¿Entra la UE en la oposición del Gobierno Vasco?", a: "Sí: la Unión Europea y sus fuentes del Derecho forman parte del bloque común de las oposiciones de Euskadi." },
]

const JSON_LD = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: "Tests de la Unión Europea — Oposiciones Euskadi", educationalLevel: "Oposiciones", about: "La Unión Europea y su Derecho", provider: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}/union-europea` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Unión Europea", item: `${SITE_URL}/union-europea` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]

export default function UePage() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · Euskadi"
            title="La Unión Europea"
            subtitle="Instituciones, fuentes del Derecho y principios de la UE. Un tema del bloque común, a base de tests."
            ley="Tratado de la Unión Europea (TUE) y Tratado de Funcionamiento de la UE (TFUE)"
            stats={[
                { n: "24", label: "preguntas" },
                { n: "7", label: "instituciones" },
                { n: "27", label: "Estados" },
                { n: "4", label: "libertades" },
            ]}
            enOposiciones="Forma parte del bloque común de las oposiciones de la OPE del Gobierno Vasco y también entra en Diputaciones Forales y ayuntamientos de Euskadi."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de la Unión Europea"
            testsLead={{ prefix: "De las instituciones a las fuentes del Derecho, tema a tema.", guestTail: "para ver tu mejor nota en cada test.", loggedTail: "Tu mejor nota aparece en cada test." }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "Temario completo", href: "/temario" },
                { label: "Constitución Española", href: "/constitucion" },
                { label: "Estatuto e instituciones vascas", href: "/estatuto-de-autonomia" },
            ]}
            fuenteOficial={{ label: "Tratados de la UE (EUR-Lex)", href: "https://eur-lex.europa.eu/collection/eu-law/treaties/treaties-force.html" }}
            muestra={{ testId: "c03", total: 24 }}
            jsonLd={JSON_LD}
        />
    )
}
