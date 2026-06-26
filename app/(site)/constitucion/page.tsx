import Link from "next/link"
import type { Metadata } from "next"
import TemaTests, { type TemaTest } from "@/components/tests/TemaTests"
import LeccionHero from "@/components/lecciones/LeccionHero"
import PuntosExamen from "@/components/lecciones/PuntosExamen"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#3B82F6"

export const metadata: Metadata = {
    title: "La Constitución Española: tests para oposiciones (IVAP)",
    description:
        "Practica el tema 1 de tu oposición: la Constitución Española. Cientos de preguntas sobre derechos, garantías y organización del Estado para la OPE del Gobierno Vasco 2026.",
    alternates: { canonical: "/constitucion" },
}

const TESTS: TemaTest[] = [
    { id: "c01", tema: "T.1", titulo: "La Constitución: derechos, libertades y garantías. Deberes. Principios constitucionales de la actuación administrativa", preguntas: 350 },
    { id: "c02", tema: "T.2", titulo: "Organización territorial del Estado. Comunidades Autónomas y Estatutos de Autonomía", preguntas: 30 },
    { id: "c04", tema: "T.4", titulo: "Organización política y administrativa de la CAE. Parlamento, Gobierno Vasco y Lehendakari", preguntas: 30 },
]

const PUNTOS = [
    { t: "Derechos y libertades", d: "Título I: fundamentales (arts. 15–29), garantías y suspensión de derechos." },
    { t: "Garantías (art. 53)", d: "Recurso de amparo, reserva de ley orgánica y niveles de protección." },
    { t: "Organización del Estado", d: "Corona, Cortes Generales, Gobierno y poder judicial." },
    { t: "Euskadi", d: "Parlamento Vasco, Gobierno Vasco y Lehendakari." },
]

export default function ConstitucionPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Temario IVAP · OPE 2026"
                title="La Constitución Española"
                subtitle="El tema 1 y de los más preguntados. Domínalo a base de tests reales, no de leer artículos."
                accent={ACCENT}
                stats={[
                    { n: "410", label: "preguntas" },
                    { n: "1978", label: "año" },
                    { n: "T.1", label: "bloque común" },
                    { n: "169", label: "artículos" },
                ]}
            />

            <PuntosExamen puntos={PUNTOS} accent={ACCENT} />

            <section id="tests" className="scroll-mt-20 px-5 py-8">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-white">
                        Tests de la Constitución
                    </h2>
                    <p className="mb-6 text-sm text-white/55">
                        Más de 350 preguntas solo del tema 1.{" "}
                        <Link href="/login" className="font-semibold text-white hover:underline">
                            Inicia sesión
                        </Link>{" "}
                        para ver tu progreso.
                    </p>
                    <TemaTests tests={TESTS} accent={ACCENT} />
                </div>
            </section>

            <LeccionCTA
                accent={ACCENT}
                titulo="¿Te sabes la Constitución?"
                texto="Compruébalo ahora con un test del tema 1 y descubre tus puntos débiles."
            />

            <div className="mx-auto mb-12 max-w-4xl px-5">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
                    <Link href="/ley-39-2015" className="hover:text-white hover:underline">
                        → Ley 39/2015
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
                        name: "Tests de la Constitución Española — OPE Gobierno Vasco 2026",
                        educationalLevel: "Oposiciones",
                        about: "Constitución Española de 1978",
                        provider: { "@type": "Organization", name: "Gainditu" },
                        url: `${SITE_URL}/constitucion`,
                    }),
                }}
            />
        </main>
    )
}
