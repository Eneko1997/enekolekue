import Link from "next/link"
import type { Metadata } from "next"
import { SCALE_COLORS, BRAND_ACCENT } from "@/lib/theme"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: { absolute: "Gainditu — Tests OPE Gobierno Vasco 2026 (IVAP)" },
    description:
        "Practica para la OPE del Gobierno Vasco 2026 con tests por tema oficial del IVAP: Auxiliares, Administrativos, Técnicos de Gestión y Superiores. Más de 2.000 preguntas, simulacros con penalización real y seguimiento de tu progreso.",
    alternates: { canonical: "/" },
}

const ESCALAS = [
    {
        id: "auxiliares",
        nombre: "Auxiliares Administrativos",
        desc: "Parte general (T.1–14) + específicos de la escala auxiliar.",
    },
    {
        id: "administrativos",
        nombre: "Administrativos",
        desc: "Temario común y específico de Administrativo del Gobierno Vasco.",
    },
    {
        id: "gestion",
        nombre: "Técnicos de Gestión",
        desc: "Tests por tema para la escala de gestión (grupo B).",
    },
    {
        id: "superiores",
        nombre: "Técnicos Superiores",
        desc: "Preparación específica para la escala técnica superior (grupo A).",
    },
] as const

const PASOS = [
    {
        n: "1",
        t: "Crea tu cuenta gratis",
        d: "Regístrate en segundos con email o Google. Sin tarjeta.",
    },
    {
        n: "2",
        t: "Practica por tema",
        d: "Elige tu escala y haz tests tema a tema o simulacros completos.",
    },
    {
        n: "3",
        t: "Mide tu progreso",
        d: "Estadísticas, mejor nota por tema e historial para llegar listo al examen.",
    },
]

const FAQS = [
    {
        q: "¿Qué es la OPE del Gobierno Vasco 2026?",
        a: "Es la Oferta Pública de Empleo del Gobierno Vasco, cuyos procesos selectivos se preparan con el temario oficial del IVAP (Instituto Vasco de Administración Pública). Gainditu organiza tests por cada tema oficial para auxiliares, administrativos y técnicos.",
    },
    {
        q: "¿Los tests son gratis?",
        a: "Sí, puedes crear una cuenta gratis y practicar. El acceso Premium añade exámenes oficiales de convocatorias anteriores, simulacros con penalización real del IVAP y estadísticas avanzadas.",
    },
    {
        q: "¿Cubrís la Ley 39/2015 y la Constitución?",
        a: "Sí. Tenemos teoría y tests específicos del Procedimiento Administrativo Común (Ley 39/2015) y de la Constitución Española, además del resto de temas del temario.",
    },
    {
        q: "¿Hay simulacros con penalización?",
        a: "Sí, los simulacros replican el formato y la penalización por error reales del IVAP para que practiques en condiciones de examen.",
    },
]

export default function HomePage() {
    return (
        <main className="flex flex-1 flex-col">
            {/* HERO */}
            <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:pt-24">
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
                    style={{ background: BRAND_ACCENT }}
                />
                <div className="relative mx-auto max-w-3xl text-center">
                    <span
                        className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider"
                        style={{ color: BRAND_ACCENT }}
                    >
                        OPE Gobierno Vasco 2026 · IVAP
                    </span>
                    <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
                        Aprueba tu oposición con{" "}
                        <span style={{ color: BRAND_ACCENT }}>
                            tests por tema oficial
                        </span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
                        Más de 2.000 preguntas del temario IVAP, simulacros con
                        penalización real y seguimiento de tu progreso. Para
                        Auxiliares, Administrativos, Técnicos de Gestión y
                        Superiores.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/signup"
                            className="w-full rounded-xl px-7 py-3.5 text-center text-sm font-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
                            style={{ backgroundColor: BRAND_ACCENT }}
                        >
                            Empezar gratis →
                        </Link>
                        <Link
                            href="/dashboard"
                            className="w-full rounded-xl border border-white/15 px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/5 sm:w-auto"
                        >
                            Ver todos los tests
                        </Link>
                    </div>
                    <p className="mt-4 text-xs text-white/40">
                        Sin tarjeta · Cuenta gratis · Acceso Premium de pago único
                    </p>
                </div>
            </section>

            {/* ESCALAS */}
            <section className="px-5 py-12">
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-white">
                        Elige tu escala
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-center text-sm text-white/55">
                        Tests organizados por el temario oficial de cada cuerpo
                        del Gobierno Vasco.
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {ESCALAS.map((e) => {
                            const color = SCALE_COLORS[e.id]
                            return (
                                <Link
                                    key={e.id}
                                    href="/dashboard"
                                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                                >
                                    <div
                                        className="mb-3 h-1.5 w-10 rounded-full"
                                        style={{ background: color }}
                                    />
                                    <h3 className="text-lg font-bold text-white">
                                        {e.nombre}
                                    </h3>
                                    <p className="mt-1 text-sm text-white/55">
                                        {e.desc}
                                    </p>
                                    <span
                                        className="mt-3 inline-block text-sm font-semibold"
                                        style={{ color }}
                                    >
                                        Practicar →
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* EXÁMENES OFICIALES */}
            <section
                id="examenes-oficiales"
                className="scroll-mt-20 px-5 py-12"
            >
                <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8 sm:p-10">
                    <h2 className="text-2xl font-extrabold tracking-tight text-white">
                        Exámenes oficiales y simulacros reales
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
                        Practica con exámenes de convocatorias anteriores y
                        simulacros que replican el formato y la penalización por
                        error del IVAP. Entrena en condiciones de examen y llega
                        con seguridad al día clave.
                    </p>
                    <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                            "Exámenes oficiales de convocatorias pasadas",
                            "Simulacros con penalización real IVAP",
                            "Estadísticas avanzadas por escala y tema",
                            "Actualizaciones gratuitas hasta el examen",
                        ].map((f) => (
                            <li
                                key={f}
                                className="flex items-start gap-2 text-sm text-white/80"
                            >
                                <span style={{ color: BRAND_ACCENT }}>✓</span>
                                {f}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/payment"
                        className="mt-7 inline-block rounded-xl px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: BRAND_ACCENT }}
                    >
                        Ver acceso Premium →
                    </Link>
                </div>
            </section>

            {/* CÓMO FUNCIONA */}
            <section className="px-5 py-12">
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-8 text-center text-2xl font-extrabold tracking-tight text-white">
                        Cómo funciona
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {PASOS.map((p) => (
                            <div
                                key={p.n}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                            >
                                <div
                                    className="mb-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                                    style={{ background: BRAND_ACCENT }}
                                >
                                    {p.n}
                                </div>
                                <h3 className="text-base font-bold text-white">
                                    {p.t}
                                </h3>
                                <p className="mt-1 text-sm text-white/55">
                                    {p.d}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RECURSOS */}
            <section className="px-5 py-12">
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-white">
                        Recursos para opositores
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-center text-sm text-white/55">
                        Teoría y tests de los temas con más peso, además del
                        calendario de procesos.
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                            {
                                href: "/ley-39-2015",
                                t: "Ley 39/2015",
                                d: "Procedimiento Administrativo Común: teoría y tests por tema.",
                            },
                            {
                                href: "/constitucion",
                                t: "La Constitución",
                                d: "Derechos, organización del Estado y tests de la Constitución Española.",
                            },
                            {
                                href: "/fechas-opes",
                                t: "Fechas de las OPEs",
                                d: "Calendario de procesos selectivos del Gobierno Vasco 2026.",
                            },
                        ].map((r) => (
                            <Link
                                key={r.href}
                                href={r.href}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                            >
                                <h3 className="text-base font-bold text-white">
                                    {r.t}
                                </h3>
                                <p className="mt-1 text-sm text-white/55">
                                    {r.d}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="px-5 py-12">
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-8 text-center text-2xl font-extrabold tracking-tight text-white">
                        Preguntas frecuentes
                    </h2>
                    <div className="space-y-3">
                        {FAQS.map((f) => (
                            <details
                                key={f.q}
                                className="group rounded-xl border border-white/10 bg-white/[0.03] p-5"
                            >
                                <summary className="cursor-pointer list-none text-sm font-semibold text-white">
                                    {f.q}
                                </summary>
                                <p className="mt-2 text-sm leading-relaxed text-white/60">
                                    {f.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="px-5 py-16">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        Empieza a preparar tu OPE hoy
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
                        Crea tu cuenta gratis y haz tu primer test en menos de un
                        minuto.
                    </p>
                    <Link
                        href="/signup"
                        className="mt-6 inline-block rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: BRAND_ACCENT }}
                    >
                        Crear cuenta gratis →
                    </Link>
                </div>
            </section>

            {/* JSON-LD FAQ */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: FAQS.map((f) => ({
                            "@type": "Question",
                            name: f.q,
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: f.a,
                            },
                        })),
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: "Gainditu",
                        url: SITE_URL,
                        description:
                            "Tests por tema oficial del IVAP para la OPE del Gobierno Vasco 2026.",
                    }),
                }}
            />
        </main>
    )
}
