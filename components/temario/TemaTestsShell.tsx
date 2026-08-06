import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import PuntosExamen from "@/components/lecciones/PuntosExamen"
import FaqLeccion, { type Faq } from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import TestsLead from "@/components/site/TestsLead"
import TemaTests, { type TemaTest } from "@/components/tests/TemaTests"
import { type PuntoNorma, type SeccionEstructura, type Enlace } from "@/lib/data/temario/normativas"

const ACCENT = "#10B981"

const SECCIONES = [
    { id: "oposiciones", label: "¿En qué oposiciones?" },
    { id: "estructura", label: "Estructura de la norma" },
    { id: "puntos", label: "Lo que más se pregunta" },
    { id: "tests", label: "Tests por tema" },
    { id: "faq", label: "Preguntas frecuentes" },
]

export interface TemaTestsShellProps {
    eyebrow: string
    title: string
    subtitle: string
    /** Nombre/identificación de la norma (etiqueta pequeña). */
    ley: string
    stats: { n: string; label: string }[]
    enOposiciones: string
    estructura: SeccionEstructura[]
    puntos: PuntoNorma[]
    testsTitulo: string
    testsLead: { prefix: string; guestTail: string; loggedTail: string }
    tests: TemaTest[]
    faqs: Faq[]
    relacionadas: Enlace[]
    fuenteOficial?: Enlace
    /** JSON-LD específico de la página (LearningResource, Breadcrumb, FAQ…). */
    jsonLd: object[]
}

export default function TemaTestsShell(p: TemaTestsShellProps) {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow={p.eyebrow}
                title={p.title}
                subtitle={p.subtitle}
                accent={ACCENT}
                ctaHref="#tests"
                ctaLabel="Ir a los tests →"
                stats={p.stats}
            />

            <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 px-5 py-10 lg:grid-cols-[1fr_200px]">
                {/* Contenido */}
                <div className="min-w-0 space-y-12">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        {p.ley}
                    </p>

                    <section id="oposiciones" className="scroll-mt-20">
                        <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                            ¿En qué oposiciones entra?
                        </h2>
                        <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {p.enOposiciones}
                        </p>
                    </section>

                    <section id="estructura" className="scroll-mt-20">
                        <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                            Estructura de la norma
                        </h2>
                        <ul className="mt-4 space-y-3">
                            {p.estructura.map((s, i) => (
                                <li
                                    key={i}
                                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3"
                                >
                                    <div className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">
                                        {s.titulo}
                                    </div>
                                    <div className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-400">
                                        {s.detalle}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section id="puntos" className="scroll-mt-20">
                        <PuntosExamen
                            titulo="Lo que más se pregunta"
                            puntos={p.puntos}
                            accent={ACCENT}
                        />
                    </section>

                    {p.relacionadas.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                                Normativa relacionada
                            </h2>
                            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                                {p.relacionadas.map((r) => (
                                    <Link
                                        key={r.href}
                                        href={r.href}
                                        className="hover:text-zinc-950 dark:hover:text-white hover:underline"
                                    >
                                        → {r.label}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {p.fuenteOficial && (
                        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                            Fuente oficial:{" "}
                            <a
                                href={p.fuenteOficial.href}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="font-medium hover:underline"
                                style={{ color: ACCENT }}
                            >
                                {p.fuenteOficial.label} ↗
                            </a>
                        </p>
                    )}
                </div>

                {/* Índice lateral (sticky en escritorio) */}
                <aside className="hidden lg:block">
                    <nav className="sticky top-20">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                            En esta página
                        </div>
                        <ul className="mt-3 space-y-1.5 border-l border-zinc-200 dark:border-zinc-800">
                            {SECCIONES.map((s) => (
                                <li key={s.id}>
                                    <a
                                        href={`#${s.id}`}
                                        className="block border-l-2 border-transparent -ml-px pl-3 py-0.5 text-[13px] text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                    >
                                        {s.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
            </div>

            <section id="tests" className="scroll-mt-20 px-5 py-8">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                        {p.testsTitulo}
                    </h2>
                    <TestsLead
                        prefix={p.testsLead.prefix}
                        guestTail={p.testsLead.guestTail}
                        loggedTail={p.testsLead.loggedTail}
                    />
                    <TemaTests tests={p.tests} accent={ACCENT} />
                </div>
            </section>

            <div id="faq" className="scroll-mt-20">
                <FaqLeccion faqs={p.faqs} accent={ACCENT} />
            </div>

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Desbloquea todo el temario"
                texto="Hazte Premium y accede a exámenes oficiales, simulacros con penalización real del examen y estadísticas avanzadas para todas las escalas."
                cta="Ver acceso Premium →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(p.jsonLd) }}
            />
        </main>
    )
}
