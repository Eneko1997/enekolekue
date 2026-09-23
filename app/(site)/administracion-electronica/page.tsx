import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Administración Electrónica — Oposiciones Euskadi",
    description:
        "Tests gratis de administración electrónica para oposiciones de Euskadi: sede electrónica, identificación y firma (Cl@ve), registro electrónico, expediente y archivo electrónico, interoperabilidad y Esquema Nacional de Seguridad.",
    keywords: [
        "test administración electrónica",
        "test administración electrónica oposiciones",
        "test firma electrónica",
        "test sede electrónica",
        "test registro electrónico",
        "administración electrónica test gratis",
    ],
    alternates: { canonical: "/administracion-electronica" },
}

const TESTS: TemaTest[] = [
    { id: "c07", tema: "Administración electrónica", titulo: "Administración electrónica: sede, identificación y firma, expediente y archivo electrónico", preguntas: 30 },
    { id: "adm22", tema: "Firma e identificación", titulo: "Identificación y firma electrónica: certificados, Cl@ve y el reglamento eIDAS", preguntas: 30 },
    { id: "adm20", tema: "Registro electrónico", titulo: "El registro electrónico: presentación de documentos, cómputo de plazos y asientos", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "Sede electrónica y PAG", detalle: "La sede electrónica como punto de acceso oficial y el Punto de Acceso General electrónico de la Administración." },
    { titulo: "Identificación y firma", detalle: "Sistemas de identificación y firma: certificados electrónicos, DNIe, Cl@ve y el marco europeo eIDAS." },
    { titulo: "Registro y expediente", detalle: "El registro electrónico, el expediente electrónico (con índice y foliado) y el archivo electrónico único de los procedimientos finalizados." },
    { titulo: "Interoperabilidad y seguridad", detalle: "La interoperabilidad entre Administraciones y el Esquema Nacional de Seguridad (ENS) y de Interoperabilidad (ENI)." },
]

const PUNTOS = [
    { t: "Sede y punto de acceso", d: "Qué es la sede electrónica y quién responde de su integridad y actualización." },
    { t: "Identificación vs firma", d: "Diferencia entre identificarse y firmar, y los sistemas admitidos (Cl@ve, certificado, DNIe)." },
    { t: "Registro y notificaciones", d: "Cómo se presenta un documento en el registro electrónico y cuándo se entiende practicada una notificación electrónica." },
    { t: "Expediente y archivo", d: "Composición del expediente electrónico y el archivo electrónico único." },
]

const FAQS: Faq[] = [
    { q: "¿Qué es la sede electrónica?", a: "La dirección electrónica de titularidad de una Administración a través de la cual la ciudadanía accede a sus servicios y trámites, con las garantías de identificación, seguridad y responsabilidad." },
    { q: "¿Qué es Cl@ve?", a: "El sistema estatal de identificación y firma electrónica para la ciudadanía en sus relaciones con la Administración." },
    { q: "¿Cuándo se entiende practicada una notificación electrónica?", a: "En el momento en que se accede a su contenido; se entiende rechazada si transcurren 10 días naturales desde su puesta a disposición sin acceder." },
    { q: "¿Entra la administración electrónica en la oposición?", a: "Sí, y cada vez con más peso: sede, firma, registro y expediente electrónico son contenidos habituales del bloque común." },
]

const JSON_LD = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: "Tests de Administración Electrónica — Oposiciones Euskadi", educationalLevel: "Oposiciones", about: "Administración electrónica", provider: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}/administracion-electronica` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Administración electrónica", item: `${SITE_URL}/administracion-electronica` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]

export default function AdminElectronicaPage() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · Euskadi"
            title="Administración electrónica"
            subtitle="Sede, firma, registro y expediente electrónico: un bloque muy rentable y en alza. A base de tests."
            ley="Ley 39/2015 y Ley 40/2015 (medios electrónicos), reglamento eIDAS y Esquema Nacional de Seguridad"
            stats={[
                { n: "60+", label: "preguntas" },
                { n: "Cl@ve", label: "firma" },
                { n: "ENS", label: "seguridad" },
                { n: "10 días", label: "notificación" },
            ]}
            enOposiciones="Es un tema transversal del bloque común de la OPE del Gobierno Vasco (todas las escalas) y también entra en Diputaciones Forales y ayuntamientos."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de administración electrónica"
            testsLead={{ prefix: "De la sede electrónica al expediente digital, tema a tema.", guestTail: "para ver tu mejor nota en cada test.", loggedTail: "Tu mejor nota aparece en cada test." }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "Ley 39/2015 · Procedimiento", href: "/ley-39-2015" },
                { label: "Protección de datos", href: "/proteccion-datos" },
                { label: "Temario completo", href: "/temario" },
            ]}
            fuenteOficial={{ label: "Ley 39/2015 — texto consolidado (BOE)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-10565" }}
            muestra={{ testId: "c07", total: 60 }}
            jsonLd={JSON_LD}
        />
    )
}
