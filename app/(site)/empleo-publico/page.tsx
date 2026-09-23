import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Empleo Público Vasco (Ley 11/2022 y EBEP) — Oposiciones Euskadi",
    description:
        "Tests gratis de empleo público para oposiciones de Euskadi: Ley 11/2022 de Empleo Público Vasco y EBEP. Clases de personal, acceso, situaciones administrativas, derechos, deberes y régimen disciplinario.",
    keywords: [
        "test empleo público",
        "test Ley 11/2022 empleo público vasco",
        "test EBEP",
        "test función pública oposiciones",
        "situaciones administrativas test",
        "empleo público Euskadi test gratis",
    ],
    alternates: { canonical: "/empleo-publico" },
}

const TESTS: TemaTest[] = [
    { id: "adm17", tema: "Clases de personal", titulo: "Empleo público: clases de personal, funcionarios de carrera, interinos y personal laboral", preguntas: 30 },
    { id: "adm18", tema: "Acceso y provisión", titulo: "Acceso al empleo público (igualdad, mérito, capacidad y publicidad) y provisión de puestos", preguntas: 30 },
    { id: "supe26", tema: "Derechos y retribuciones", titulo: "Derechos y deberes del personal empleado público, carrera y retribuciones (básicas y complementarias)", preguntas: 30 },
    { id: "c09", tema: "Régimen disciplinario", titulo: "Ley 11/2022 de Empleo Público Vasco: situaciones administrativas y régimen disciplinario", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "Ley 11/2022 de Empleo Público Vasco", detalle: "Norma que regula el empleo público en la Comunidad Autónoma de Euskadi. Complementa y desarrolla el EBEP en el ámbito vasco." },
    { titulo: "Clases de personal", detalle: "Funcionarios de carrera, funcionarios interinos, personal laboral y personal eventual, con su régimen y funciones." },
    { titulo: "Acceso y carrera", detalle: "Principios de igualdad, mérito, capacidad y publicidad; oferta de empleo público, selección, provisión de puestos y promoción interna." },
    { titulo: "Derechos, deberes y disciplina", detalle: "Derechos individuales y colectivos, situaciones administrativas, retribuciones y régimen disciplinario (faltas y sanciones)." },
]

const PUNTOS = [
    { t: "Clases de personal", d: "Diferencias entre funcionario de carrera, interino, laboral y eventual; cuándo procede cada uno." },
    { t: "Acceso y provisión", d: "Principios rectores del acceso, sistemas selectivos, oferta de empleo público y formas de provisión." },
    { t: "Situaciones y retribuciones", d: "Servicio activo, excedencias, servicios especiales; retribuciones básicas (sueldo y trienios) y complementarias." },
    { t: "Régimen disciplinario", d: "Clasificación de faltas (muy graves, graves y leves), sanciones y prescripción." },
]

const FAQS: Faq[] = [
    { q: "¿Qué norma regula el empleo público en Euskadi?", a: "La Ley 11/2022 de Empleo Público Vasco, que desarrolla en el ámbito autonómico el Estatuto Básico del Empleado Público (EBEP). En la oposición se estudian juntas." },
    { q: "¿Cuáles son los principios de acceso al empleo público?", a: "Igualdad, mérito, capacidad y publicidad. Es una de las preguntas más repetidas del bloque." },
    { q: "¿Qué clases de personal existen?", a: "Funcionarios de carrera, funcionarios interinos, personal laboral (fijo, indefinido o temporal) y personal eventual de confianza o asesoramiento." },
    { q: "¿Cómo se clasifican las faltas disciplinarias?", a: "En muy graves, graves y leves. La separación del servicio solo procede por faltas muy graves." },
]

const JSON_LD = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: "Tests de Empleo Público Vasco (Ley 11/2022 y EBEP) — Oposiciones Euskadi", educationalLevel: "Oposiciones", about: "Empleo público (Ley 11/2022 y EBEP)", provider: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}/empleo-publico` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Empleo público", item: `${SITE_URL}/empleo-publico` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]

export default function EmpleoPublicoPage() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · Euskadi"
            title="Empleo público en Euskadi"
            subtitle="La Ley 11/2022 de Empleo Público Vasco y el EBEP: clases de personal, acceso, situaciones y régimen disciplinario. A base de tests."
            ley="Ley 11/2022, de 1 de diciembre, de Empleo Público Vasco (y EBEP, texto refundido RDLeg 5/2015)"
            stats={[
                { n: "90+", label: "preguntas" },
                { n: "2022", label: "ley vasca" },
                { n: "4", label: "clases de personal" },
                { n: "EBEP", label: "base estatal" },
            ]}
            enOposiciones="Es un tema del bloque común de todas las escalas de la OPE del Gobierno Vasco (Personal de Apoyo, Administrativos, Técnicos de Gestión y Superiores) y también en Diputaciones Forales y ayuntamientos."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de empleo público"
            testsLead={{ prefix: "De las clases de personal al régimen disciplinario, tema a tema.", guestTail: "para ver tu mejor nota en cada test.", loggedTail: "Tu mejor nota aparece en cada test." }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "Temario completo", href: "/temario" },
                { label: "Requisitos para opositar en Euskadi", href: "/guias/requisitos-para-opositar-euskadi" },
                { label: "Convocatorias de Euskadi", href: "/convocatorias" },
            ]}
            fuenteOficial={{ label: "Ley 11/2022 — texto consolidado (BOE)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2022-21619" }}
            muestra={{ testId: "adm18", total: 90 }}
            jsonLd={JSON_LD}
        />
    )
}
