import type { Metadata } from "next"
import { type TemaTest } from "@/components/tests/TemaTests"
import { type Faq } from "@/components/lecciones/FaqLeccion"
import TemaTestsShell from "@/components/temario/TemaTestsShell"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Test Euskera y Perfiles Lingüísticos (Decreto 19/2024) — Oposiciones Euskadi",
    description:
        "Tests gratis sobre el euskera en las oposiciones de Euskadi: Decreto 19/2024, perfiles lingüísticos PL1-PL4, fecha de preceptividad (mérito o requisito), planificación lingüística y acreditación (HABE, IVAP).",
    keywords: [
        "test euskera oposiciones",
        "test perfiles lingüísticos",
        "test Decreto 19/2024",
        "test normalización euskera",
        "perfil lingüístico test",
        "euskera oposiciones test gratis",
    ],
    alternates: { canonical: "/euskera" },
}

const TESTS: TemaTest[] = [
    { id: "c08", tema: "Decreto 19/2024", titulo: "Normalización del uso del euskera: Decreto 19/2024, perfiles lingüísticos y preceptividad", preguntas: 30 },
    { id: "supe29", tema: "Perfiles y planificación", titulo: "Perfiles lingüísticos (PL1-PL4), planificación lingüística y régimen del euskera en la función pública", preguntas: 30 },
]

const ESTRUCTURA = [
    { titulo: "Marco del euskera", detalle: "El euskera como lengua propia, oficial junto al castellano, y el proceso de normalización de su uso en las Administraciones vascas." },
    { titulo: "Decreto 19/2024", detalle: "Norma que regula la normalización del uso del euskera en las Administraciones públicas vascas y sus perfiles lingüísticos." },
    { titulo: "Perfiles lingüísticos", detalle: "Los cuatro perfiles (PL1 a PL4), de menor a mayor exigencia, asignados a cada puesto de trabajo." },
    { titulo: "Preceptividad y acreditación", detalle: "La fecha de preceptividad (que convierte el perfil en mérito o en requisito) y la acreditación mediante títulos oficiales (HABE, EGA) o pruebas del IVAP." },
]

const PUNTOS = [
    { t: "Cuántos perfiles hay", d: "Los cuatro perfiles lingüísticos PL1-PL4 y su orden creciente de exigencia." },
    { t: "Mérito o requisito", d: "El papel de la fecha de preceptividad: si ha pasado, el perfil es requisito; si no, es mérito." },
    { t: "Acreditación", d: "Cómo se acredita el nivel (certificados de HABE, EGA, pruebas del IVAP) y las equivalencias." },
    { t: "Planificación lingüística", d: "Los periodos de planificación y el objetivo de normalización del uso del euskera." },
]

const FAQS: Faq[] = [
    { q: "¿Cuántos perfiles lingüísticos hay?", a: "Cuatro: PL1, PL2, PL3 y PL4, de menor a mayor exigencia. Cada puesto de trabajo tiene asignado uno." },
    { q: "¿Cuándo es el euskera un requisito y cuándo un mérito?", a: "Depende de la fecha de preceptividad del puesto: si ya ha pasado, el perfil es obligatorio; si no ha llegado, el euskera puntúa como mérito pero no impide presentarse." },
    { q: "¿Qué norma regula el euskera en las oposiciones ahora?", a: "El Decreto 19/2024, de 22 de febrero, sobre la normalización del uso del euskera en las Administraciones públicas vascas." },
    { q: "¿Cómo se acredita el nivel de euskera?", a: "Con títulos y certificados oficiales (como el EGA o los de HABE) o mediante las pruebas del IVAP, según las tablas de equivalencias." },
]

const JSON_LD = [
    { "@context": "https://schema.org", "@type": "LearningResource", name: "Tests de euskera y perfiles lingüísticos (Decreto 19/2024) — Oposiciones Euskadi", educationalLevel: "Oposiciones", about: "Normalización del euskera y perfiles lingüísticos", provider: { "@type": "Organization", name: "Gainditu" }, url: `${SITE_URL}/euskera` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Euskera", item: `${SITE_URL}/euskera` } ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
]

export default function EuskeraPage() {
    return (
        <TemaTestsShell
            eyebrow="Temario oficial · Euskadi"
            title="Euskera y perfiles lingüísticos"
            subtitle="El Decreto 19/2024, los perfiles PL1-PL4 y la preceptividad. Lo que hay que saber del euskera en la oposición, a base de tests."
            ley="Decreto 19/2024, de 22 de febrero, de normalización del uso del euskera en las Administraciones públicas vascas"
            stats={[
                { n: "60+", label: "preguntas" },
                { n: "4", label: "perfiles" },
                { n: "2024", label: "decreto" },
                { n: "HABE", label: "acreditación" },
            ]}
            enOposiciones="Afecta a todas las oposiciones de Euskadi: cada puesto lleva un perfil lingüístico, que según la fecha de preceptividad puntúa como mérito o es requisito."
            estructura={ESTRUCTURA}
            puntos={PUNTOS}
            testsTitulo="Tests de euskera y perfiles lingüísticos"
            testsLead={{ prefix: "Del Decreto 19/2024 a los perfiles PL1-PL4, tema a tema.", guestTail: "para ver tu mejor nota en cada test.", loggedTail: "Tu mejor nota aparece en cada test." }}
            tests={TESTS}
            faqs={FAQS}
            relacionadas={[
                { label: "El euskera en las oposiciones (guía)", href: "/guias/euskera-perfiles-linguisticos-oposiciones" },
                { label: "Estatuto e instituciones vascas", href: "/estatuto-de-autonomia" },
                { label: "Temario completo", href: "/temario" },
            ]}
            fuenteOficial={{ label: "Decreto 19/2024 (BOPV)", href: "https://www.euskadi.eus/bopv2/datos/2024/03/2401301a.pdf" }}
            muestra={{ testId: "c08", total: 60 }}
            jsonLd={JSON_LD}
        />
    )
}
