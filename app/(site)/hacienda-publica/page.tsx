import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Hacienda Pública y Presupuestos — Oposiciones Euskadi",
    description:
        "Tests gratis de hacienda pública y presupuestos para oposiciones de Euskadi: principios presupuestarios, fases del gasto (ADOP), ingresos, subvenciones y control económico de la Hacienda General del País Vasco.",
    keywords: [
        "test hacienda pública",
        "test presupuestos oposiciones",
        "test fases del gasto ADOP",
        "test subvenciones",
        "hacienda pública vasca test",
        "presupuesto test oposiciones",
    ],
    alternates: { canonical: "/hacienda-publica" },
}

const TESTS: TemaTest[] = [
    { id: "adm15", tema: "Presupuesto de gastos", titulo: "El presupuesto: principios presupuestarios y fases de ejecución del gasto (ADOP)", preguntas: 30 },
    { id: "adm16", tema: "Ingresos y Hacienda", titulo: "Ingresos públicos, Hacienda General del País Vasco y prescripción de derechos", preguntas: 30 },
    { id: "supe35", tema: "Subvenciones", titulo: "Régimen general de las subvenciones: concesión, justificación y reintegro", preguntas: 30 },
    { id: "supe34", tema: "Control económico", titulo: "Contabilidad pública y control económico: fiscalización previa e Intervención", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "Principios presupuestarios", detalle: "Anualidad, unidad, universalidad, especialidad y estabilidad presupuestaria: las reglas que ordenan el presupuesto público." },
    { titulo: "Ciclo presupuestario", detalle: "Elaboración, aprobación, ejecución y control del presupuesto, y las modificaciones de crédito (transferencias, suplementos, créditos extraordinarios)." },
    { titulo: "Ejecución del gasto", detalle: "Las fases del gasto público: Autorización, Disposición (compromiso), Reconocimiento de la Obligación y Ordenación del Pago (ADOP)." },
    { titulo: "Subvenciones y control", detalle: "Régimen de las subvenciones (concesión, justificación y reintegro) y el control económico interno (Intervención y fiscalización previa)." },
]

const PUNTOS = [
    { t: "Principios presupuestarios", d: "Anualidad, unidad, universalidad y especialidad, y el principio de estabilidad presupuestaria." },
    { t: "Fases del gasto (ADOP)", d: "El orden Autorización → Disposición → Reconocimiento de la obligación → Ordenación del pago." },
    { t: "Modificaciones de crédito", d: "Transferencias, suplementos de crédito y créditos extraordinarios: cuándo procede cada una." },
    { t: "Subvenciones y control", d: "Concesión y justificación de subvenciones, reintegro y la función de la Intervención." },
]

const FAQS: Faq[] = [
    { q: "¿Cuáles son las fases de ejecución del gasto público?", a: "Autorización, Disposición o compromiso, Reconocimiento de la obligación y Ordenación del pago (las siglas ADOP). Es una de las preguntas más repetidas." },
    { q: "¿Qué es el principio de anualidad presupuestaria?", a: "Que el presupuesto se aprueba y ejecuta por un ejercicio, que coincide con el año natural." },
    { q: "¿Qué norma regula la Hacienda General del País Vasco?", a: "El texto refundido de la Ley de Principios Ordenadores de la Hacienda General del País Vasco (Decreto Legislativo 1/1997), junto con la ley de presupuestos de cada año." },
    { q: "¿Entra hacienda en todas las oposiciones?", a: "El bloque de presupuesto e ingresos entra en las escalas Administrativa y Técnicas del Gobierno Vasco; su peso es mayor cuanto más alto es el grupo." },
]

const JSON_LD = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: "Tests de Hacienda Pública y Presupuestos — Oposiciones Euskadi", educationalLevel: "Oposiciones", about: "Hacienda pública y presupuestos", provider: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}/hacienda-publica` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Hacienda pública", item: `${SITE_URL}/hacienda-publica` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]

export default function HaciendaPage() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · Euskadi"
            title="Hacienda pública y presupuestos"
            subtitle="Principios presupuestarios, fases del gasto (ADOP), ingresos, subvenciones y control económico. A base de tests."
            ley="Hacienda General del País Vasco (DLeg 1/1997) y normativa presupuestaria"
            stats={[
                { n: "80+", label: "preguntas" },
                { n: "ADOP", label: "fases del gasto" },
                { n: "4", label: "principios clásicos" },
                { n: "DL 1/1997", label: "Hacienda vasca" },
            ]}
            enOposiciones="Entra en las escalas Administrativa, Técnico de Gestión y Técnico Superior del Gobierno Vasco, y también en Diputaciones Forales y ayuntamientos."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de hacienda y presupuestos"
            testsLead={{ prefix: "De los principios presupuestarios al control del gasto, tema a tema.", guestTail: "para ver tu mejor nota en cada test.", loggedTail: "Tu mejor nota aparece en cada test." }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "Temario completo", href: "/temario" },
                { label: "Ley 40/2015 · Sector Público", href: "/ley-40-2015" },
                { label: "Convocatorias de Euskadi", href: "/convocatorias" },
            ]}
            fuenteOficial={{ label: "Hacienda General del País Vasco (DLeg 1/1997)", href: "https://www.euskadi.eus/y22-bopv/es/bopv2/datos/1997/11/9705490a.shtml" }}
            muestra={{ testId: "adm15", total: 80 }}
            jsonLd={JSON_LD}
        />
    )
}
