import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Estatuto de Autonomía e Instituciones Vascas — Oposiciones Euskadi",
    description:
        "Tests gratis del Estatuto de Autonomía de Gernika y las instituciones vascas para oposiciones de Euskadi: Parlamento Vasco, Gobierno Vasco, Lehendakari, Territorios Históricos y Concierto Económico.",
    keywords: [
        "test estatuto de autonomía",
        "test instituciones vascas",
        "test Parlamento Vasco",
        "test Gobierno Vasco oposiciones",
        "Estatuto de Gernika test",
        "instituciones Euskadi test gratis",
    ],
    alternates: { canonical: "/estatuto-de-autonomia" },
}

const TESTS: TemaTest[] = [
    { id: "supe02", tema: "Estatuto de Gernika", titulo: "El Estatuto de Autonomía del País Vasco: norma institucional básica, competencias y reforma", preguntas: 30 },
    { id: "c04", tema: "Instituciones comunes", titulo: "Organización política y administrativa de la CAE: Parlamento Vasco, Gobierno Vasco y Lehendakari", preguntas: 30 },
    { id: "supe03", tema: "Gobierno Vasco", titulo: "El Gobierno Vasco y el Lehendakari: composición, funciones y relaciones con el Parlamento", preguntas: 30 },
    { id: "c05", tema: "Territorios Históricos", titulo: "Distribución de competencias, Concierto Económico e Instituciones Locales de Euskadi (Ley 2/2016)", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "Estatuto de Autonomía de Gernika (1979)", detalle: "Norma institucional básica del País Vasco: derechos y deberes, competencias de la Comunidad Autónoma y régimen de reforma." },
    { titulo: "Instituciones comunes", detalle: "El Parlamento Vasco (75 parlamentarios, 25 por Territorio Histórico), el Gobierno Vasco y el Lehendakari, elegido por el Parlamento." },
    { titulo: "Territorios Históricos", detalle: "Álava, Bizkaia y Gipuzkoa, con sus Juntas Generales y Diputaciones Forales, y la distribución de competencias con las instituciones comunes." },
    { titulo: "Concierto Económico y euskera", detalle: "El sistema de financiación mediante Concierto Económico y el euskera como lengua propia, oficial junto al castellano." },
]

const PUNTOS = [
    { t: "Norma institucional básica", d: "El Estatuto de Gernika (1979): naturaleza, competencias exclusivas y procedimiento de reforma." },
    { t: "Parlamento y Lehendakari", d: "Composición del Parlamento (75, igual por territorio), elección del Lehendakari y responsabilidad del Gobierno ante la Cámara." },
    { t: "Territorios Históricos", d: "Juntas Generales, Diputaciones Forales y el reparto de competencias con las instituciones comunes (LTH)." },
    { t: "Concierto y euskera", d: "Financiación por Concierto Económico y el régimen del euskera (perfiles lingüísticos)." },
]

const FAQS: Faq[] = [
    { q: "¿Cuál es la norma institucional básica del País Vasco?", a: "El Estatuto de Autonomía de Gernika, aprobado en 1979. Es el equivalente autonómico a una 'constitución' del autogobierno vasco." },
    { q: "¿Cuántos parlamentarios tiene el Parlamento Vasco?", a: "75, elegidos a razón de 25 por cada Territorio Histórico (Álava, Bizkaia y Gipuzkoa), con independencia de su población." },
    { q: "¿Quién elige al Lehendakari?", a: "El Parlamento Vasco, de entre sus miembros. El Gobierno Vasco responde políticamente ante el Parlamento." },
    { q: "¿Qué son los Territorios Históricos?", a: "Álava, Bizkaia y Gipuzkoa, con instituciones propias (Juntas Generales y Diputación Foral) y competencias reconocidas por el Estatuto y la Ley de Territorios Históricos." },
]

const JSON_LD = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: "Tests del Estatuto de Autonomía e instituciones vascas — Oposiciones Euskadi", educationalLevel: "Oposiciones", about: "Estatuto de Autonomía del País Vasco e instituciones vascas", provider: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}/estatuto-de-autonomia` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Estatuto de Autonomía", item: `${SITE_URL}/estatuto-de-autonomia` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]

export default function EstatutoPage() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · Euskadi"
            title="Estatuto de Autonomía e instituciones vascas"
            subtitle="El Estatuto de Gernika, el Parlamento, el Gobierno Vasco y los Territorios Históricos. Lo más vasco del temario, a base de tests."
            ley="Ley Orgánica 3/1979, de 18 de diciembre, de Estatuto de Autonomía para el País Vasco"
            stats={[
                { n: "70+", label: "preguntas" },
                { n: "1979", label: "Estatuto" },
                { n: "75", label: "parlamentarios" },
                { n: "3", label: "territorios" },
            ]}
            enOposiciones="Es parte esencial del bloque común de todas las escalas de la OPE del Gobierno Vasco y también entra en Diputaciones Forales y ayuntamientos de Euskadi."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests del Estatuto e instituciones vascas"
            testsLead={{ prefix: "Del Estatuto de Gernika a los Territorios Históricos, tema a tema.", guestTail: "para ver tu mejor nota en cada test.", loggedTail: "Tu mejor nota aparece en cada test." }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "Temario completo", href: "/temario" },
                { label: "La Constitución Española", href: "/constitucion" },
                { label: "El euskera en las oposiciones", href: "/guias/euskera-perfiles-linguisticos-oposiciones" },
            ]}
            fuenteOficial={{ label: "Estatuto de Gernika — texto consolidado (BOE)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-1979-30177" }}
            muestra={{ testId: "supe02", total: 90 }}
            jsonLd={JSON_LD}
        />
    )
}
