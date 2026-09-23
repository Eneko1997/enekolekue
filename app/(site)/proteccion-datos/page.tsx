import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Protección de Datos (RGPD y LOPDGDD) — Oposiciones Euskadi",
    description:
        "Tests gratis de protección de datos (RGPD y LOPDGDD) y transparencia para oposiciones de Euskadi: principios, derechos, bases jurídicas, brechas de seguridad y publicidad activa.",
    keywords: [
        "test protección de datos",
        "test RGPD",
        "test LOPDGDD",
        "test protección de datos oposiciones",
        "test transparencia Ley 19/2013",
        "protección de datos test gratis",
    ],
    alternates: { canonical: "/proteccion-datos" },
}

const TESTS: TemaTest[] = [
    { id: "c10", tema: "LOPDGDD", titulo: "Ley Orgánica 3/2018 (LOPDGDD): objeto, derechos y garantías de los derechos digitales", preguntas: 30 },
    { id: "supe44", tema: "RGPD", titulo: "Reglamento General de Protección de Datos (RGPD): principios, bases jurídicas y responsable del tratamiento", preguntas: 30 },
    { id: "c14", tema: "Transparencia", titulo: "Ley 19/2013 de transparencia, acceso a la información pública y buen gobierno", preguntas: 30 },
    { id: "supe42", tema: "Gobierno abierto", titulo: "Gobierno abierto: transparencia, participación y colaboración", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "RGPD (Reglamento UE 2016/679)", detalle: "Norma europea de aplicación directa: principios del tratamiento, bases jurídicas, derechos del interesado y obligaciones del responsable y del encargado." },
    { titulo: "LOPDGDD (Ley Orgánica 3/2018)", detalle: "Adapta el RGPD en España y añade los derechos digitales. Regula el consentimiento, el Delegado de Protección de Datos y el régimen sancionador." },
    { titulo: "Derechos del interesado", detalle: "Acceso, rectificación, supresión (olvido), limitación, portabilidad y oposición. Se ejercen de forma gratuita y con un plazo general de un mes." },
    { titulo: "Transparencia (Ley 19/2013)", detalle: "Publicidad activa, derecho de acceso a la información pública y buen gobierno. En Euskadi, complementada por la normativa autonómica." },
]

const PUNTOS = [
    { t: "Principios y bases jurídicas", d: "Licitud, lealtad, minimización y limitación de la finalidad; consentimiento y misión de interés público como base habitual de la Administración." },
    { t: "Derechos y plazos", d: "Acceso, rectificación, supresión, limitación, portabilidad y oposición; plazo de respuesta de un mes, gratuito." },
    { t: "Seguridad y brechas", d: "Medidas de seguridad, Delegado de Protección de Datos (obligatorio en el sector público) y notificación de brechas en 72 horas." },
    { t: "Transparencia y acceso", d: "Publicidad activa, derecho de acceso, silencio desestimatorio y el Consejo de Transparencia." },
]

const FAQS: Faq[] = [
    { q: "¿Qué diferencia hay entre el RGPD y la LOPDGDD?", a: "El RGPD es el Reglamento europeo, de aplicación directa en toda la UE. La LOPDGDD (Ley Orgánica 3/2018) lo adapta en España y añade los derechos digitales. Ambos se estudian juntos." },
    { q: "¿En cuánto tiempo hay que notificar una brecha de seguridad?", a: "En 72 horas desde que se tiene constancia, a la autoridad de control (la AEPD), salvo que sea improbable que suponga un riesgo para los derechos de las personas." },
    { q: "¿Cuándo es obligatorio el Delegado de Protección de Datos?", a: "Siempre en las autoridades y organismos públicos, entre otros supuestos. Es una figura que cae con frecuencia en el examen." },
    { q: "¿Entra la transparencia en la oposición del Gobierno Vasco?", a: "Sí: la Ley 19/2013 de transparencia y el derecho de acceso a la información pública forman parte del bloque común de casi todas las escalas." },
]

const JSON_LD = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: "Tests de Protección de Datos (RGPD y LOPDGDD) — Oposiciones Euskadi", educationalLevel: "Oposiciones", about: "Protección de datos personales (RGPD y LOPDGDD)", provider: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}/proteccion-datos` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Protección de datos", item: `${SITE_URL}/proteccion-datos` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]

export default function ProteccionDatosPage() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · Euskadi"
            title="Protección de datos y transparencia"
            subtitle="RGPD, LOPDGDD y la Ley de transparencia: principios, derechos y plazos que caen sí o sí. A base de tests."
            ley="Reglamento (UE) 2016/679 (RGPD), Ley Orgánica 3/2018 (LOPDGDD) y Ley 19/2013 de transparencia"
            stats={[
                { n: "70+", label: "preguntas" },
                { n: "72h", label: "brechas" },
                { n: "2018", label: "LOPDGDD" },
                { n: "1 mes", label: "derechos" },
            ]}
            enOposiciones="Forma parte del bloque común de la OPE del Gobierno Vasco (Personal de Apoyo, Administrativos, Técnicos de Gestión y Superiores) y también entra en Diputaciones Forales, ayuntamientos y Osakidetza."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de protección de datos y transparencia"
            testsLead={{ prefix: "Del RGPD a la transparencia, tema a tema.", guestTail: "para ver tu mejor nota en cada test.", loggedTail: "Tu mejor nota aparece en cada test." }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "Temario completo", href: "/temario" },
                { label: "Ley 39/2015 · Procedimiento", href: "/ley-39-2015" },
                { label: "La Constitución Española", href: "/constitucion" },
            ]}
            fuenteOficial={{ label: "LOPDGDD — texto consolidado (BOE)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673" }}
            muestra={{ testId: "c10", total: 90 }}
            jsonLd={JSON_LD}
        />
    )
}
