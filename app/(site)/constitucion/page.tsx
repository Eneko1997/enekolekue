import Link from "next/link"
import type { Metadata } from "next"
import TemaTests, { type TemaTest } from "@/components/tests/TemaTests"
import { BRAND_ACCENT } from "@/lib/theme"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "La Constitución Española: resumen y tests para oposiciones",
    description:
        "Resumen de la Constitución Española de 1978 para oposiciones: derechos y libertades, garantías, deberes y organización del Estado. Practica con cientos de preguntas del temario IVAP (OPE Gobierno Vasco 2026).",
    alternates: { canonical: "/constitucion" },
}

// Tests reales en Supabase relacionados con la Constitución y la organización del Estado.
const TESTS: TemaTest[] = [
    { id: "c01", tema: "T.1", titulo: "La Constitución: derechos, libertades y garantías. Deberes. Principios constitucionales de la actuación administrativa", preguntas: 350 },
    { id: "c02", tema: "T.2", titulo: "Organización territorial del Estado. Comunidades Autónomas y Estatutos de Autonomía", preguntas: 30 },
    { id: "c04", tema: "T.4", titulo: "Organización política y administrativa de la CAE. Parlamento, Gobierno Vasco y Lehendakari", preguntas: 30 },
]

const SECCIONES = [
    {
        h: "La Constitución Española de 1978",
        p: "Es la norma suprema del ordenamiento jurídico español. Su Título Preliminar fija los valores superiores, la soberanía nacional, las lenguas y la organización territorial. En oposiciones es el tema 1 del bloque común y uno de los más preguntados.",
    },
    {
        h: "Derechos y libertades (Título I)",
        p: "Distingue los derechos fundamentales y libertades públicas (Sección 1ª, arts. 15–29), con la máxima protección, de los derechos y deberes de los ciudadanos. Conviene dominar las garantías: el recurso de amparo, la reserva de ley orgánica y la suspensión de derechos.",
    },
    {
        h: "Garantías de los derechos",
        p: "El artículo 53 establece los distintos niveles de protección según el grupo de derechos, incluido el procedimiento preferente y sumario y el recurso de amparo ante el Tribunal Constitucional. El Defensor del Pueblo y el Ministerio Fiscal completan el sistema.",
    },
    {
        h: "Organización del Estado",
        p: "La Corona, las Cortes Generales, el Gobierno y el poder judicial, junto a la organización territorial (CCAA, Estatutos de Autonomía) y, en Euskadi, el Parlamento Vasco, el Gobierno Vasco y el Lehendakari.",
    },
]

export default function ConstitucionPage() {
    return (
        <main className="mx-auto max-w-3xl px-5 py-12">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: BRAND_ACCENT }}>
                Temario IVAP · OPE 2026
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                La Constitución Española
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/65">
                Resumen para oposiciones de la Constitución de 1978 y tests para
                practicar derechos, garantías y organización del Estado, con el
                enfoque del temario oficial del IVAP.
            </p>

            <section className="mt-10 space-y-6">
                {SECCIONES.map((s) => (
                    <div key={s.h}>
                        <h2 className="text-xl font-bold text-white">{s.h}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            {s.p}
                        </p>
                    </div>
                ))}
            </section>

            <p className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[13px] text-white/55">
                ℹ️ Resumen divulgativo provisional para estudio. Consulta el
                texto consolidado oficial en el{" "}
                <a
                    href="https://www.boe.es/eli/es/c/1978/12/27/(1)/con"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:underline"
                >
                    BOE
                </a>
                .
            </p>

            <section className="mt-12">
                <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-white">
                    Tests de la Constitución
                </h2>
                <p className="mb-6 text-sm text-white/55">
                    Más de 350 preguntas solo del tema 1. {" "}
                    <Link href="/login" className="font-semibold text-white hover:underline">
                        Inicia sesión
                    </Link>{" "}
                    para ver tu progreso.
                </p>
                <TemaTests tests={TESTS} accent="#3B82F6" />
            </section>

            <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-lg font-bold text-white">Sigue estudiando</h2>
                <ul className="mt-3 space-y-2 text-sm">
                    <li>
                        <Link href="/ley-39-2015" className="text-white/70 hover:text-white hover:underline">
                            → Ley 39/2015 del Procedimiento Administrativo Común
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard" className="text-white/70 hover:text-white hover:underline">
                            → Todos los tests por escala
                        </Link>
                    </li>
                    <li>
                        <Link href="/fechas-opes" className="text-white/70 hover:text-white hover:underline">
                            → Fechas de las OPEs del Gobierno Vasco 2026
                        </Link>
                    </li>
                </ul>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: "La Constitución Española: resumen y tests para oposiciones",
                        author: { "@type": "Organization", name: "Gainditu" },
                        publisher: { "@type": "Organization", name: "Gainditu" },
                        mainEntityOfPage: `${SITE_URL}/constitucion`,
                    }),
                }}
            />
        </main>
    )
}
