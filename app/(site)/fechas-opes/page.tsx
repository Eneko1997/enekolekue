import Link from "next/link"
import type { Metadata } from "next"
import { SCALE_COLORS } from "@/lib/theme"
import LeccionHero from "@/components/lecciones/LeccionHero"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import FaqLeccion, { type Faq } from "@/components/lecciones/FaqLeccion"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#E8543A"

export const metadata: Metadata = {
    title: "Fechas OPE Gobierno Vasco 2026 — Convocatorias y exámenes (IVAP)",
    description:
        "Calendario de la OPE 2026 del Gobierno Vasco: fechas de convocatoria y primera prueba para Auxiliar Administrativo, Administrativo, Técnico de Gestión y Superior. Calendario provisional del IVAP.",
    keywords: [
        "fechas OPE Gobierno Vasco 2026",
        "convocatoria OPE Euskadi 2026",
        "examen auxiliar administrativo Gobierno Vasco",
        "calendario oposiciones IVAP",
        "fechas examen administrativo Euskadi",
    ],
    alternates: { canonical: "/fechas-opes" },
}

// Fuente: Calendario de procesos selectivos OPE 2026 (Gobierno Vasco), provisional a 26-03-2026.
const FILAS = [
    { escala: "Auxiliar Administrativa", grupo: "C2", convocatoria: "Septiembre 2026", prueba: "Enero 2027", color: SCALE_COLORS.auxiliares },
    { escala: "Administrativa", grupo: "C1", convocatoria: "Septiembre 2026", prueba: "Enero 2027", color: SCALE_COLORS.administrativos },
    { escala: "Gestión Administrativa", grupo: "B", convocatoria: "Octubre 2026", prueba: "Abril 2027", color: SCALE_COLORS.gestion },
    { escala: "Superior de Administración", grupo: "A", convocatoria: "Octubre 2026", prueba: "Abril 2027", color: SCALE_COLORS.superiores },
]

const FAQS: Faq[] = [
    {
        q: "¿Cuándo es la OPE del Gobierno Vasco 2026?",
        a: "Según el calendario provisional del IVAP, las convocatorias de las escalas administrativas se publican entre septiembre y octubre de 2026, con las primeras pruebas entre enero y abril de 2027.",
    },
    {
        q: "¿Cuándo es el examen de Auxiliar Administrativo del Gobierno Vasco?",
        a: "La primera prueba de la escala Auxiliar Administrativa está prevista para enero de 2027 (convocatoria en septiembre de 2026). Son fechas provisionales sujetas a cambios.",
    },
    {
        q: "¿Dónde se publican las convocatorias oficiales?",
        a: "En el Boletín Oficial del País Vasco (BOPV) y en euskadi.eus/oposiciones. Verifica siempre ahí las fechas definitivas.",
    },
    {
        q: "¿Estas fechas son definitivas?",
        a: "No. Es un calendario provisional a 26 de marzo de 2026 y puede ajustarse tanto en fechas como en las escalas convocadas.",
    },
]

export default function FechasOpesPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="OPE Gobierno Vasco 2026"
                title="Fechas de las OPEs"
                subtitle="Convocatorias y primera prueba de la OPE 2026 del Gobierno Vasco. Organízate y llega con el temario dominado."
                accent={ACCENT}
                ctaHref="/"
                ctaLabel="Ver los tests →"
                stats={[
                    { n: "2026", label: "convocatoria" },
                    { n: "2027", label: "1ª prueba" },
                    { n: "4", label: "escalas" },
                    { n: "IVAP", label: "temario" },
                ]}
            />

            <section className="px-5 py-8">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-white">
                        Calendario por escala
                    </h2>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur">
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
                        y en el BOPV.
                    </p>
                </div>
            </section>

            <FaqLeccion faqs={FAQS} accent={ACCENT} />

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Llega al examen con ventaja"
                texto="Hazte Premium y prepara la OPE con exámenes oficiales, simulacros con penalización IVAP y estadísticas de tu progreso."
                cta="Ver acceso Premium →"
            />

            <div className="mx-auto mb-12 max-w-4xl px-5">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
                    <Link href="/" className="hover:text-white hover:underline">
                        → Todos los tests por escala
                    </Link>
                    <Link href="/constitucion" className="hover:text-white hover:underline">
                        → La Constitución Española
                    </Link>
                    <Link href="/ley-39-2015" className="hover:text-white hover:underline">
                        → Ley 39/2015
                    </Link>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
                                { "@type": "ListItem", position: 2, name: "Fechas de las OPEs", item: `${SITE_URL}/fechas-opes` },
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
