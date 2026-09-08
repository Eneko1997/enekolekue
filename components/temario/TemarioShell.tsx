import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import PuntosExamen from "@/components/lecciones/PuntosExamen"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { type Normativa } from "@/lib/data/temario/normativas"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"

const SECCIONES = [
    { id: "oposiciones", label: "¿En qué oposiciones?" },
    { id: "estructura", label: "Estructura de la norma" },
    { id: "puntos", label: "Lo que más se pregunta" },
    { id: "faq", label: "Preguntas frecuentes" },
]

export default function TemarioShell({ n }: { n: Normativa }) {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow={n.eyebrow}
                title={n.titulo}
                subtitle={n.intro}
                accent={ACCENT}
                ctaHref="#estructura"
                ctaLabel="Ver el temario →"
                breadcrumb={{ href: "/temario", label: "← Temario" }}
                stats={[
                    { n: String(n.puntosClave.length), label: "puntos clave" },
                    { n: String(n.estructura.length), label: "apartados" },
                    { n: n.eyebrow.includes("estatal") ? "Estatal" : "Vasca", label: "normativa" },
                    { n: "FAQ", label: "dudas resueltas" },
                ]}
            />

            <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 px-5 py-10 lg:grid-cols-[1fr_200px]">
                {/* Contenido */}
                <div className="min-w-0 space-y-12">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        {n.ley}
                    </p>

                    <section id="oposiciones" className="scroll-mt-20">
                        <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                            ¿En qué oposiciones entra?
                        </h2>
                        <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {n.enOposiciones}
                        </p>
                        {n.test && (
                            <Link
                                href={n.test.href}
                                className="mt-5 inline-flex rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
                                style={{ background: ACCENT }}
                            >
                                {n.test.label} →
                            </Link>
                        )}
                    </section>

                    <section id="estructura" className="scroll-mt-20">
                        <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                            Estructura de la norma
                        </h2>
                        <ul className="mt-4 space-y-3">
                            {n.estructura.map((s, i) => (
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
                            puntos={n.puntosClave}
                            accent={ACCENT}
                        />
                    </section>

                    {n.errorTipico && (
                        <section>
                            <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-5 py-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                                <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M12 9v4M12 17h.01M10.3 3.9 2.4 18a1.7 1.7 0 0 0 1.5 2.5h16.2a1.7 1.7 0 0 0 1.5-2.5L13.7 3.9a1.7 1.7 0 0 0-3 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Error típico de examen
                                </div>
                                <p className="mt-1.5 text-[14px] leading-relaxed text-amber-900/90 dark:text-amber-100/90">
                                    {n.errorTipico}
                                </p>
                            </div>
                        </section>
                    )}

                    {n.relacionadas.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                                Normativa relacionada
                            </h2>
                            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                                {n.relacionadas.map((r) => (
                                    <Link
                                        key={r.href}
                                        href={r.href}
                                        className="hover:text-zinc-950 dark:hover:text-white hover:underline"
                                    >
                                        → {r.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/guias"
                                    className="hover:text-zinc-950 dark:hover:text-white hover:underline"
                                >
                                    → Guías para opositar
                                </Link>
                            </div>
                        </section>
                    )}

                    {n.fuenteOficial && (
                        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                            Fuente oficial:{" "}
                            <a
                                href={n.fuenteOficial.href}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="font-medium hover:underline"
                                style={{ color: ACCENT }}
                            >
                                {n.fuenteOficial.label} ↗
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

            <div id="faq" className="scroll-mt-20">
                <FaqLeccion faqs={n.faqs} accent={ACCENT} />
            </div>

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Prepara este tema con tests"
                texto="Practica el temario oficial por bloques, con simulacros y estadísticas de tu progreso. Empieza gratis."
                cta="Ver los tests →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Article",
                            headline: n.h1,
                            about: n.ley,
                            inLanguage: "es",
                            author: { "@type": "Organization", name: "Gainditu" },
                            publisher: { "@type": "Organization", name: "Gainditu" },
                            url: `${SITE_URL}/temario/${n.slug}`,
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: n.faqs.map((f) => ({
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
