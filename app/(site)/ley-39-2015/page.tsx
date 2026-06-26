import Link from "next/link"
import type { Metadata } from "next"
import TemaTests, { type TemaTest } from "@/components/tests/TemaTests"
import { BRAND_ACCENT } from "@/lib/theme"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Ley 39/2015 del Procedimiento Administrativo Común: resumen y tests",
    description:
        "Resumen de la Ley 39/2015 (PACAP) para oposiciones: actos administrativos, fases del procedimiento, recursos y responsabilidad. Practica con tests por tema del temario IVAP (OPE Gobierno Vasco 2026).",
    alternates: { canonical: "/ley-39-2015" },
}

// Tests reales en Supabase relacionados con la Ley 39/2015 (Procedimiento Administrativo Común).
const TESTS: TemaTest[] = [
    { id: "adm30", tema: "Acto administrativo", titulo: "El acto administrativo: producción, contenido, motivación, eficacia, nulidad y anulabilidad", preguntas: 40 },
    { id: "adm31", tema: "Procedimiento", titulo: "Procedimiento administrativo: principios, personas interesadas, abstención y recusación", preguntas: 25 },
    { id: "adm32", tema: "Fases", titulo: "Fases del procedimiento administrativo: iniciación, ordenación, instrucción y finalización", preguntas: 115 },
    { id: "adm33", tema: "Recursos", titulo: "Revisión de los actos: recursos administrativos, revisión de oficio y rectificación de errores", preguntas: 39 },
    { id: "adm34", tema: "Responsabilidad", titulo: "Responsabilidad patrimonial de las Administraciones Públicas", preguntas: 17 },
    { id: "c07", tema: "Admin. electrónica", titulo: "Administración electrónica: sede, identificación y firma, expediente y archivo electrónico", preguntas: 30 },
]

const SECCIONES = [
    {
        h: "¿Qué regula la Ley 39/2015?",
        p: "La Ley 39/2015, de 1 de octubre, del Procedimiento Administrativo Común de las Administraciones Públicas (LPACAP) regula cómo se relacionan los ciudadanos con la Administración y cómo esta dicta y revisa sus actos. Es uno de los temas con más peso en casi todas las oposiciones de la OPE del Gobierno Vasco 2026.",
    },
    {
        h: "El acto administrativo",
        p: "Define el concepto, los requisitos (competencia, contenido, motivación y forma), la eficacia, la notificación y publicación, y los supuestos de nulidad de pleno derecho y anulabilidad. Es la base para entender los recursos.",
    },
    {
        h: "Fases del procedimiento",
        p: "Iniciación (de oficio o a solicitud), ordenación, instrucción (alegaciones, prueba, informes y audiencia) y finalización (resolución, desistimiento, renuncia, caducidad). Incluye los plazos, el silencio administrativo y la tramitación simplificada.",
    },
    {
        h: "Recursos y revisión",
        p: "Recurso de alzada, potestativo de reposición y extraordinario de revisión, además de la revisión de oficio de actos nulos y la declaración de lesividad. Conviene dominar plazos y órganos competentes.",
    },
]

export default function Ley39Page() {
    return (
        <main className="mx-auto max-w-3xl px-5 py-12">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: BRAND_ACCENT }}>
                Temario IVAP · OPE 2026
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ley 39/2015 del Procedimiento Administrativo Común
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/65">
                Resumen orientado a oposiciones del Procedimiento Administrativo
                Común (LPACAP) y tests por tema para practicar. Repasa la teoría
                clave y mide tu nivel con preguntas del temario oficial del IVAP.
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
                ℹ️ Resumen divulgativo provisional para estudio. Consulta siempre
                el texto consolidado oficial en el{" "}
                <a
                    href="https://www.boe.es/eli/es/l/2015/10/01/39/con"
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
                    Tests de la Ley 39/2015
                </h2>
                <p className="mb-6 text-sm text-white/55">
                    Practica tema a tema. Si{" "}
                    <Link href="/login" className="font-semibold text-white hover:underline">
                        inicias sesión
                    </Link>{" "}
                    verás tu mejor nota en cada test.
                </p>
                <TemaTests tests={TESTS} />
            </section>

            <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-lg font-bold text-white">Sigue estudiando</h2>
                <ul className="mt-3 space-y-2 text-sm">
                    <li>
                        <Link href="/constitucion" className="text-white/70 hover:text-white hover:underline">
                            → La Constitución Española: resumen y tests
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard" className="text-white/70 hover:text-white hover:underline">
                            → Todos los tests por escala (Auxiliares, Administrativos…)
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
                        headline: "Ley 39/2015 del Procedimiento Administrativo Común: resumen y tests",
                        author: { "@type": "Organization", name: "Gainditu" },
                        publisher: { "@type": "Organization", name: "Gainditu" },
                        mainEntityOfPage: `${SITE_URL}/ley-39-2015`,
                    }),
                }}
            />
        </main>
    )
}
