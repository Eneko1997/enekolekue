import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Ley 40/2015 — Régimen Jurídico del Sector Público | Oposiciones Euskadi",
    description:
        "Tests gratis de la Ley 40/2015 del Régimen Jurídico del Sector Público para oposiciones de Euskadi: órganos y competencia, órganos colegiados, responsabilidad patrimonial, potestad sancionadora y sector público vasco.",
    keywords: [
        "test ley 40/2015",
        "test régimen jurídico sector público",
        "LRJSP test",
        "responsabilidad patrimonial test",
        "ley 40/2015 oposiciones",
        "sector público vasco test",
    ],
    alternates: { canonical: "/ley-40-2015" },
}

const TESTS: TemaTest[] = [
    { id: "adm34", tema: "Responsabilidad patrimonial", titulo: "Responsabilidad patrimonial de las Administraciones Públicas: requisitos, plazos e indemnización", preguntas: 30 },
    { id: "supe06", tema: "Sector público vasco", titulo: "Organización y funcionamiento del sector público vasco (Ley 3/2022): encomienda, delegación y convenios", preguntas: 30 },
    { id: "adm29", tema: "Organización", titulo: "Organización administrativa: órganos, competencia y sector público institucional", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "Disposiciones generales y órganos", detalle: "Principios de actuación, órganos administrativos, competencia y sus técnicas: delegación, avocación, encomienda de gestión, delegación de firma y suplencia." },
    { titulo: "Órganos colegiados y abstención", detalle: "Régimen de los órganos colegiados (convocatoria, quórum y actas) y los deberes de abstención y recusación." },
    { titulo: "Responsabilidad patrimonial", detalle: "La responsabilidad de las Administraciones por el funcionamiento normal o anormal de los servicios públicos, con sus requisitos y la responsabilidad de las autoridades y personal." },
    { titulo: "Potestad sancionadora y convenios", detalle: "Principios de la potestad sancionadora (legalidad, tipicidad, proporcionalidad) y el régimen de los convenios entre Administraciones." },
]

const PUNTOS = [
    { t: "Competencia y sus técnicas", d: "Delegación, avocación, encomienda de gestión, delegación de firma y suplencia: qué altera la titularidad y qué no." },
    { t: "Abstención y recusación", d: "Causas de abstención, plazos de recusación y efectos de actuar estando incurso en causa." },
    { t: "Responsabilidad patrimonial", d: "Funcionamiento normal o anormal, fuerza mayor, plazos de reclamación e indemnización." },
    { t: "Potestad sancionadora", d: "Principios de legalidad, tipicidad, proporcionalidad y non bis in idem." },
]

const FAQS: Faq[] = [
    { q: "¿Qué diferencia hay entre la Ley 39/2015 y la Ley 40/2015?", a: "La 39/2015 regula el procedimiento administrativo común (la relación con el ciudadano) y la 40/2015 el Régimen Jurídico del Sector Público (la organización interna de las Administraciones)." },
    { q: "¿Qué es la encomienda de gestión?", a: "Encargar a otro órgano o entidad la realización de actividades materiales o técnicas, sin ceder la titularidad de la competencia ni sus elementos sustantivos." },
    { q: "¿Por qué funcionamiento responde la Administración?", a: "Por el funcionamiento normal o anormal de los servicios públicos, salvo fuerza mayor o cuando exista el deber jurídico de soportar el daño." },
    { q: "¿Entra el sector público vasco (Ley 3/2022) en la oposición?", a: "Sí: en las oposiciones del Gobierno Vasco, la organización del sector público autonómico (Ley 3/2022) se estudia junto a la Ley 40/2015 estatal." },
]

const JSON_LD = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: "Tests de la Ley 40/2015 — Régimen Jurídico del Sector Público", educationalLevel: "Oposiciones", about: "Ley 40/2015 del Régimen Jurídico del Sector Público", provider: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}/ley-40-2015` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Ley 40/2015", item: `${SITE_URL}/ley-40-2015` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]

export default function Ley40Page() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · Euskadi"
            title="Ley 40/2015"
            subtitle="El Régimen Jurídico del Sector Público: órganos, competencia, responsabilidad patrimonial y potestad sancionadora. A base de tests."
            ley="Ley 40/2015, de 1 de octubre, de Régimen Jurídico del Sector Público"
            stats={[
                { n: "60+", label: "preguntas" },
                { n: "2015", label: "en vigor" },
                { n: "LRJSP", label: "ley" },
                { n: "39/2015", label: "su pareja" },
            ]}
            enOposiciones="Junto a la Ley 39/2015, es de los temas jurídicos que más caen en todas las escalas de la OPE del Gobierno Vasco, y también en Diputaciones Forales y ayuntamientos."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de la Ley 40/2015"
            testsLead={{ prefix: "De la competencia a la responsabilidad patrimonial, tema a tema.", guestTail: "para ver tu mejor nota en cada test.", loggedTail: "Tu mejor nota aparece en cada test." }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "Ley 39/2015 · Procedimiento", href: "/ley-39-2015" },
                { label: "Temario completo", href: "/temario" },
                { label: "Estatuto e instituciones vascas", href: "/estatuto-de-autonomia" },
            ]}
            fuenteOficial={{ label: "Ley 40/2015 — texto consolidado (BOE)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10566" }}
            muestra={{ testId: "adm34", total: 60 }}
            jsonLd={JSON_LD}
        />
    )
}
