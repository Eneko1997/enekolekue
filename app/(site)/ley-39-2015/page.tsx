import Link from "next/link"
import TestsLead from "@/components/site/TestsLead"
import type { Metadata } from "next"
import TemaTests, { type TemaTest } from "@/components/tests/TemaTests"
import LeccionHero from "@/components/lecciones/LeccionHero"
import PuntosExamen from "@/components/lecciones/PuntosExamen"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import FaqLeccion, { type Faq } from "@/components/lecciones/FaqLeccion"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

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

export default function Ley39Page() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Temario oficial · OPE 2026"
                title="Ley 39/2015"
                subtitle="El Procedimiento Administrativo Común: el tema estrella de casi toda oposición. A base de tests, no de empollar el BOE."
                accent={ACCENT}
                stats={[
                    { n: "370", label: "preguntas" },
                    { n: "9", label: "temas" },
                    { n: "2015", label: "en vigor" },
                    { n: "LPACAP", label: "ley" },
                ]}
            />

            <PuntosExamen puntos={PUNTOS} accent={ACCENT} />

            <section id="tests" className="scroll-mt-20 px-5 py-8">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Tests de la Ley 39/2015
                    </h2>
                    <TestsLead
                        prefix="Del acto administrativo al silencio y los recursos, tema a tema."
                        guestTail="para ver tu mejor nota en cada test."
                        loggedTail="Tu mejor nota aparece en cada test."
                    />
                    <TemaTests tests={TESTS} accent={ACCENT} />
                </div>
            </section>

            <FaqLeccion faqs={FAQS} accent={ACCENT} />

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Desbloquea todo el temario"
                texto="Hazte Premium y accede a exámenes oficiales, simulacros con penalización real del examen y estadísticas avanzadas para todas las escalas."
                cta="Ver acceso Premium →"
            />

            <div className="mx-auto mb-12 max-w-4xl px-5">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <Link href="/constitucion" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                        → La Constitución Española
                    </Link>
                    <Link href="/" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                        → Todos los tests por escala
                    </Link>
                    <Link href="/convocatorias" className="hover:text-zinc-950 dark:hover:text-white hover:underline">
                        → Convocatorias de Euskadi
                    </Link>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
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
                    ]),
                }}
            />
        </main>
    )
}
