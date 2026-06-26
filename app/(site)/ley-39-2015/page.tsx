import Link from "next/link"
import type { Metadata } from "next"
import TemaTests, { type TemaTest } from "@/components/tests/TemaTests"
import LeccionHero from "@/components/lecciones/LeccionHero"
import PuntosExamen from "@/components/lecciones/PuntosExamen"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#E8543A"

export const metadata: Metadata = {
    title: "Ley 39/2015: tests del Procedimiento Administrativo Común (IVAP)",
    description:
        "Practica la Ley 39/2015 (Procedimiento Administrativo Común) para tu oposición: actos, fases, recursos y responsabilidad. Cientos de preguntas del temario IVAP para la OPE del Gobierno Vasco 2026.",
    alternates: { canonical: "/ley-39-2015" },
}

const TESTS: TemaTest[] = [
    { id: "adm30", tema: "Acto administrativo", titulo: "El acto administrativo: producción, contenido, motivación, eficacia, nulidad y anulabilidad", preguntas: 40 },
    { id: "adm31", tema: "Procedimiento", titulo: "Procedimiento administrativo: principios, personas interesadas, abstención y recusación", preguntas: 25 },
    { id: "adm32", tema: "Fases", titulo: "Fases del procedimiento administrativo: iniciación, ordenación, instrucción y finalización", preguntas: 115 },
    { id: "adm33", tema: "Recursos", titulo: "Revisión de los actos: recursos administrativos, revisión de oficio y rectificación de errores", preguntas: 39 },
    { id: "adm34", tema: "Responsabilidad", titulo: "Responsabilidad patrimonial de las Administraciones Públicas", preguntas: 17 },
    { id: "c07", tema: "Admin. electrónica", titulo: "Administración electrónica: sede, identificación y firma, expediente y archivo electrónico", preguntas: 30 },
]

const PUNTOS = [
    { t: "El acto administrativo", d: "Requisitos, eficacia, notificación, nulidad y anulabilidad." },
    { t: "Fases del procedimiento", d: "Iniciación, ordenación, instrucción y finalización. Plazos y silencio." },
    { t: "Recursos y revisión", d: "Alzada, reposición, extraordinario de revisión y revisión de oficio." },
    { t: "Responsabilidad patrimonial", d: "Cuándo responde la Administración y su procedimiento." },
]

export default function Ley39Page() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Temario IVAP · OPE 2026"
                title="Ley 39/2015"
                subtitle="El Procedimiento Administrativo Común: el tema estrella de casi toda oposición. A base de tests, no de empollar el BOE."
                accent={ACCENT}
                stats={[
                    { n: "266", label: "preguntas" },
                    { n: "6", label: "tests" },
                    { n: "2015", label: "en vigor" },
                    { n: "LPACAP", label: "ley" },
                ]}
            />

            <PuntosExamen puntos={PUNTOS} accent={ACCENT} />

            <section id="tests" className="scroll-mt-20 px-5 py-8">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-white">
                        Tests de la Ley 39/2015
                    </h2>
                    <p className="mb-6 text-sm text-white/55">
                        Practica tema a tema.{" "}
                        <Link href="/login" className="font-semibold text-white hover:underline">
                            Inicia sesión
                        </Link>{" "}
                        para ver tu mejor nota en cada test.
                    </p>
                    <TemaTests tests={TESTS} accent={ACCENT} />
                </div>
            </section>

            <LeccionCTA
                accent={ACCENT}
                titulo="Ponte a prueba con la 39/2015"
                texto="Haz un test de procedimiento y mide cuánto dominas el tema que más cae."
            />

            <div className="mx-auto mb-12 max-w-4xl px-5">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
                    <Link href="/constitucion" className="hover:text-white hover:underline">
                        → La Constitución Española
                    </Link>
                    <Link href="/" className="hover:text-white hover:underline">
                        → Todos los tests por escala
                    </Link>
                    <Link href="/fechas-opes" className="hover:text-white hover:underline">
                        → Fechas de las OPEs 2026
                    </Link>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LearningResource",
                        name: "Tests de la Ley 39/2015 — OPE Gobierno Vasco 2026",
                        educationalLevel: "Oposiciones",
                        about: "Ley 39/2015 del Procedimiento Administrativo Común",
                        provider: { "@type": "Organization", name: "Gainditu" },
                        url: `${SITE_URL}/ley-39-2015`,
                    }),
                }}
            />
        </main>
    )
}
