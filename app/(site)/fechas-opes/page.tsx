import Link from "next/link"
import type { Metadata } from "next"
import { BRAND_ACCENT, SCALE_COLORS } from "@/lib/theme"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Fechas de las OPEs del Gobierno Vasco 2026",
    description:
        "Calendario provisional de la OPE 2026 del Gobierno Vasco: fechas de convocatoria y primera prueba para Auxiliares, Administrativos, Técnicos de Gestión y Superiores (IVAP).",
    alternates: { canonical: "/fechas-opes" },
}

// Fuente: Calendario de procesos selectivos OPE 2026 (Gobierno Vasco), provisional a 26-03-2026.
const FILAS = [
    { escala: "Auxiliar Administrativa", grupo: "C2", convocatoria: "Septiembre 2026", prueba: "Enero 2027", color: SCALE_COLORS.auxiliares },
    { escala: "Administrativa", grupo: "C1", convocatoria: "Septiembre 2026", prueba: "Enero 2027", color: SCALE_COLORS.administrativos },
    { escala: "Gestión Administrativa", grupo: "B", convocatoria: "Octubre 2026", prueba: "Abril 2027", color: SCALE_COLORS.gestion },
    { escala: "Superior de Administración", grupo: "A", convocatoria: "Octubre 2026", prueba: "Abril 2027", color: SCALE_COLORS.superiores },
]

export default function FechasOpesPage() {
    return (
        <main className="mx-auto max-w-3xl px-5 py-12">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: BRAND_ACCENT }}>
                OPE Gobierno Vasco 2026
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Fechas de las OPEs
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/65">
                Calendario de la OPE 2026 del Gobierno Vasco para las escalas
                administrativas: fechas previstas de convocatoria y de la primera
                prueba. Planifica tu estudio con tiempo.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="bg-white/[0.05] text-white/60">
                            <th className="px-4 py-3 font-semibold">Escala</th>
                            <th className="px-4 py-3 font-semibold">Grupo</th>
                            <th className="px-4 py-3 font-semibold">Convocatoria</th>
                            <th className="px-4 py-3 font-semibold">1ª prueba</th>
                        </tr>
                    </thead>
                    <tbody>
                        {FILAS.map((f) => (
                            <tr key={f.escala} className="border-t border-white/10">
                                <td className="px-4 py-3 font-semibold text-white">
                                    <span
                                        className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                                        style={{ background: f.color }}
                                    />
                                    {f.escala}
                                </td>
                                <td className="px-4 py-3 text-white/70">{f.grupo}</td>
                                <td className="px-4 py-3 text-white/70">{f.convocatoria}</td>
                                <td className="px-4 py-3 text-white/70">{f.prueba}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[13px] leading-relaxed text-white/55">
                ⚠️ <strong className="text-white/80">Calendario provisional</strong> a
                fecha 26 de marzo de 2026, sujeto a posibles ajustes en fechas y
                escalas a convocar. Verifica siempre las fechas oficiales en{" "}
                <a
                    href="https://www.euskadi.eus/oposiciones"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:underline"
                >
                    euskadi.eus/oposiciones
                </a>{" "}
                y en el Boletín Oficial del País Vasco (BOPV).
            </p>

            <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <h2 className="text-lg font-bold text-white">
                    Aprovecha el tiempo hasta el examen
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
                    Empieza a practicar hoy con tests por tema del temario IVAP.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-4 inline-block rounded-xl px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: BRAND_ACCENT }}
                >
                    Ver los tests →
                </Link>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: "Fechas de las OPEs del Gobierno Vasco 2026",
                        author: { "@type": "Organization", name: "Gainditu" },
                        publisher: { "@type": "Organization", name: "Gainditu" },
                        mainEntityOfPage: `${SITE_URL}/fechas-opes`,
                    }),
                }}
            />
        </main>
    )
}
