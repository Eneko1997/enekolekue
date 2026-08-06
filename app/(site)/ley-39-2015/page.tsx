import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Ley 39/2015 — Procedimiento Administrativo Común",
    description:
        "Tests de la Ley 39/2015 del Procedimiento Administrativo Común para oposiciones de Euskadi: interesados, acto, nulidad, fases, silencio y plazos, recursos y responsabilidad.",
    keywords: [
        "test ley 39/2015",
        "test procedimiento administrativo común",
        "ley 39/2015 oposiciones",
        "LPACAP test",
        "acto administrativo test",
    ],
    alternates: { canonical: "/ley-39-2015" },
}

const TESTS: TemaTest[] = [
    { id: "supe07", tema: "Interesados", titulo: "Interesados: capacidad de obrar, representación y derechos ante la Administración", preguntas: 30 },
    { id: "adm30", tema: "Acto administrativo", titulo: "El acto administrativo: producción, contenido, motivación, eficacia, nulidad y anulabilidad", preguntas: 30 },
    { id: "supe09", tema: "Nulidad y validez", titulo: "Nulidad y anulabilidad. Conversión, conservación y convalidación de los actos", preguntas: 30 },
    { id: "adm31", tema: "Procedimiento", titulo: "Procedimiento administrativo: principios, personas interesadas, abstención y recusación", preguntas: 30 },
    // Fases (pool grande, 115 preg) presentado en 4 bloques de ~29, cada uno
    // con su propio contenido y progreso (ids sintéticos adm32_bN).
    ...Array.from({ length: 4 }, (_, i) => ({
        id: `adm32_b${i + 1}`,
        tema: `Fases · B${i + 1}`,
        titulo: `Fases del procedimiento administrativo — Bloque ${i + 1} de 4`,
        preguntas: 30,
    })),
    { id: "supe11", tema: "Silencio y plazos", titulo: "Obligación de resolver, silencio administrativo, términos y plazos", preguntas: 30 },
    { id: "adm33", tema: "Recursos", titulo: "Revisión de los actos: recursos administrativos, revisión de oficio y rectificación de errores", preguntas: 30 },
    { id: "adm34", tema: "Responsabilidad", titulo: "Responsabilidad patrimonial de las Administraciones Públicas", preguntas: 30 },
    { id: "c07", tema: "Admin. electrónica", titulo: "Administración electrónica: sede, identificación y firma, expediente y archivo electrónico", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "Título Preliminar", detalle: "Objeto y ámbito de aplicación de la Ley del Procedimiento Administrativo Común (LPACAP)." },
    { titulo: "Título I — Interesados", detalle: "Capacidad de obrar, concepto de interesado, representación e identificación ante la Administración." },
    { titulo: "Título II — Actividad de las Administraciones", detalle: "Normas generales de actuación, términos y plazos, y notificaciones." },
    { titulo: "Título III — Actos administrativos", detalle: "Requisitos, eficacia, notificación, nulidad, anulabilidad, conversión y convalidación." },
    { titulo: "Título IV — Procedimiento administrativo común", detalle: "Fases del procedimiento: iniciación, ordenación, instrucción y finalización. Silencio administrativo." },
    { titulo: "Títulos V a VII — Revisión y responsabilidad", detalle: "Revisión de oficio, recursos administrativos (alzada y reposición), iniciativa legislativa y potestad reglamentaria." },
]

const PUNTOS = [
    { t: "Interesados y derechos", d: "Capacidad de obrar, representación y derechos en las relaciones con la Administración." },
    { t: "Acto y validez", d: "Requisitos, eficacia, notificación, nulidad, anulabilidad y convalidación." },
    { t: "Procedimiento y plazos", d: "Fases del procedimiento, obligación de resolver, silencio administrativo y plazos." },
    { t: "Recursos y responsabilidad", d: "Alzada, reposición, revisión de oficio y responsabilidad patrimonial." },
]

const FAQS: Faq[] = [
    {
        q: "¿Qué regula la Ley 39/2015?",
        a: "Regula el Procedimiento Administrativo Común de las Administraciones Públicas (LPACAP): cómo se relacionan los ciudadanos con la Administración y cómo esta dicta, notifica y revisa sus actos.",
    },
    {
        q: "¿Cuántos temas del examen cubre la Ley 39/2015?",
        a: "Es transversal: aparece en varios temas (interesados, acto administrativo, fases del procedimiento, silencio y plazos, recursos y responsabilidad). En Gainditu la practicas con más de 370 preguntas repartidas por subtema.",
    },
    {
        q: "¿Qué diferencia hay entre la Ley 39/2015 y la 40/2015?",
        a: "La 39/2015 regula el procedimiento (relación con el ciudadano) y la 40/2015 el Régimen Jurídico del Sector Público (organización interna de las Administraciones).",
    },
    {
        q: "¿Es la Ley 39/2015 importante para la oposición?",
        a: "Mucho: el procedimiento administrativo común es de los temas que más caen en casi todas las oposiciones de la OPE del Gobierno Vasco.",
    },
]

const JSON_LD = [
    {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: "Tests de la Ley 39/2015 — OPE Gobierno Vasco 2026",
        educationalLevel: "Oposiciones",
        about: "Ley 39/2015 del Procedimiento Administrativo Común",
        provider: { "@type": "Organization", name: "Gainditu" },
        url: `${SITE_URL}/ley-39-2015`,
    },
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Ley 39/2015", item: `${SITE_URL}/ley-39-2015` },
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

export default function Ley39Page() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · OPE 2026"
            title="Ley 39/2015"
            subtitle="El Procedimiento Administrativo Común: el tema estrella de casi toda oposición. A base de tests, no de empollar el BOE."
            ley="Ley 39/2015, de 1 de octubre, del Procedimiento Administrativo Común de las Administraciones Públicas"
            stats={[
                { n: "370", label: "preguntas" },
                { n: "9", label: "temas" },
                { n: "2015", label: "en vigor" },
                { n: "LPACAP", label: "ley" },
            ]}
            enOposiciones="Es un tema transversal del bloque común: entra en todas las escalas del Gobierno Vasco (Personal de Apoyo, Administrativos, Técnicos de Gestión y Superiores) y también en Diputaciones Forales, ayuntamientos y Osakidetza."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de la Ley 39/2015"
            testsLead={{
                prefix: "Del acto administrativo al silencio y los recursos, tema a tema.",
                guestTail: "para ver tu mejor nota en cada test.",
                loggedTail: "Tu mejor nota aparece en cada test.",
            }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "La Constitución Española", href: "/constitucion" },
                { label: "Todos los tests por escala", href: "/" },
                { label: "Convocatorias de Euskadi", href: "/convocatorias" },
            ]}
            fuenteOficial={{
                label: "Texto consolidado (BOE)",
                href: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10565",
            }}
            jsonLd={JSON_LD}
        />
    )
}
