import Link from "next/link"
import type { Metadata } from "next"
import LightNavbar from "@/components/site/LightNavbar"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

export const metadata: Metadata = {
    title: { absolute: "Gainditu — Tests OPE Gobierno Vasco 2026 (IVAP)" },
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
}

const ACCENT = "#10B981"

/* ───────────────────────── Iconos 3D glossy (SVG) ───────────────────────── */
function GlossyIcon({
    id,
    from,
    to,
    shadow,
    children,
    className = "",
    style,
}: {
    id: string
    from: string
    to: string
    shadow: string
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}) {
    return (
        <div
            className={className}
            style={{ filter: `drop-shadow(0 14px 22px ${shadow})`, ...style }}
            aria-hidden
        >
            <svg width="100%" height="100%" viewBox="0 0 72 72" fill="none">
                <defs>
                    <linearGradient
                        id={`g-${id}`}
                        x1="36"
                        y1="4"
                        x2="36"
                        y2="68"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor={from} />
                        <stop offset="1" stopColor={to} />
                    </linearGradient>
                    <radialGradient
                        id={`h-${id}`}
                        cx="0.32"
                        cy="0.18"
                        r="0.85"
                    >
                        <stop stopColor="#ffffff" stopOpacity="0.6" />
                        <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <rect x="5" y="5" width="62" height="62" rx="19" fill={`url(#g-${id})`} />
                <rect x="5" y="5" width="62" height="62" rx="19" fill={`url(#h-${id})`} />
                <g
                    stroke="#ffffff"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                >
                    {children}
                </g>
            </svg>
        </div>
    )
}

const IconBook = (p: { className?: string; style?: React.CSSProperties }) => (
    <GlossyIcon id="book" from="#34D399" to="#059669" shadow="rgba(16,185,129,0.45)" {...p}>
        <path d="M24 22h18a4 4 0 0 1 4 4v24H28a4 4 0 0 0-4 4V22Z" />
        <path d="M24 22a4 4 0 0 0-4 4v28a4 4 0 0 1 4-4" />
    </GlossyIcon>
)
const IconExam = (p: { className?: string; style?: React.CSSProperties }) => (
    <GlossyIcon id="exam" from="#27272A" to="#09090B" shadow="rgba(9,9,11,0.4)" {...p}>
        <rect x="22" y="20" width="28" height="32" rx="4" />
        <path d="M28 30h10M28 38h14" strokeWidth="3" />
        <path d="M40 30l3.5 3.5L50 27" stroke={ACCENT} />
    </GlossyIcon>
)
const IconScales = (p: { className?: string; style?: React.CSSProperties }) => (
    <GlossyIcon id="scales" from="#34D399" to="#10B981" shadow="rgba(16,185,129,0.45)" {...p}>
        <path d="M36 20v32M26 52h20" />
        <path d="M22 26h28M22 26l-6 12h12l-6-12ZM50 26l-6 12h12l-6-12Z" strokeWidth="2.6" />
    </GlossyIcon>
)
const IconCalendar = (p: { className?: string; style?: React.CSSProperties }) => (
    <GlossyIcon id="cal" from="#27272A" to="#09090B" shadow="rgba(9,9,11,0.4)" {...p}>
        <rect x="20" y="22" width="32" height="30" rx="5" />
        <path d="M20 32h32M28 18v6M44 18v6" />
        <circle cx="30" cy="42" r="1.6" fill={ACCENT} stroke={ACCENT} />
        <circle cx="42" cy="42" r="1.6" fill="#fff" />
    </GlossyIcon>
)
const IconTrophy = (p: { className?: string; style?: React.CSSProperties }) => (
    <GlossyIcon id="trophy" from="#34D399" to="#059669" shadow="rgba(16,185,129,0.45)" {...p}>
        <path d="M28 20h16v8a8 8 0 0 1-16 0v-8Z" />
        <path d="M28 24h-5a5 5 0 0 0 5 8M44 24h5a5 5 0 0 1-5 8M34 36v8M30 50h12M32 44h8" />
    </GlossyIcon>
)
const IconChart = (p: { className?: string; style?: React.CSSProperties }) => (
    <GlossyIcon id="chart" from="#27272A" to="#09090B" shadow="rgba(9,9,11,0.4)" {...p}>
        <path d="M22 50h28M26 50V40M36 50V28M46 50V34" />
        <path d="M26 34l8-8 6 4 8-10" stroke={ACCENT} strokeWidth="3" />
    </GlossyIcon>
)

/* ───────────────────────── Chips de UI flotantes ───────────────────────── */
function Chip({
    children,
    className = "",
    dot = ACCENT,
    style,
}: {
    children: React.ReactNode
    className?: string
    dot?: string
    style?: React.CSSProperties
}) {
    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-zinc-700 shadow-lg shadow-zinc-900/5 ${className}`}
            style={style}
            aria-hidden
        >
            <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: dot }}
            />
            {children}
        </div>
    )
}

/* ───────────────────────── Datos ───────────────────────── */
const ESCALAS = [
    { label: "Personal de Apoyo", grupo: "E", href: "/oposiciones/personal-de-apoyo" },
    { label: "Administrativo", grupo: "C1", href: "/oposiciones/administrativo" },
    { label: "Técnico de Gestión", grupo: "B", href: "/oposiciones/tecnico-gestion" },
    { label: "Técnico Superior", grupo: "A", href: "/oposiciones/tecnico-superior" },
]

const FEATURES = [
    {
        t: "Temario oficial del IVAP",
        d: "Cada test sigue el temario real de la convocatoria: bloque común (T.1–14) y específicos de tu escala.",
    },
    {
        t: "Dos vistas de estudio",
        d: "Practica por bloques temáticos transversales o sigue el temario oficial tema a tema, marcando tu avance.",
    },
    {
        t: "30 preguntas por tema",
        d: "Preguntas estilo examen con explicación elaborada de por qué cada opción es correcta o falla.",
    },
    {
        t: "Simulacros con penalización real",
        d: "Exámenes oficiales de convocatorias anteriores y simulacros con la penalización del IVAP.",
    },
    {
        t: "Tu progreso, medido",
        d: "Mejor porcentaje por tema, racha de estudio y estadísticas para saber exactamente qué repasar.",
    },
    {
        t: "Recursos clave",
        d: "Páginas dedicadas a la Constitución, la Ley 39/2015 y el calendario de las OPEs 2026.",
    },
]

const FAQS = [
    {
        q: "¿Qué es Gainditu?",
        a: "Una plataforma de tests para preparar la OPE del Gobierno Vasco 2026, con preguntas organizadas por el temario oficial del IVAP.",
    },
    {
        q: "¿Los tests son gratis?",
        a: "Sí. Creas una cuenta gratis y empiezas a practicar. El acceso Premium añade exámenes oficiales de convocatorias anteriores, simulacros con penalización real del IVAP y estadísticas avanzadas.",
    },
    {
        q: "¿Qué escalas y cuerpos cubrís?",
        a: "Personal de Apoyo, Administrativos, Técnicos de Gestión y Técnicos Superiores del Gobierno Vasco, con el bloque común (temas 1–14) y los específicos de cada escala.",
    },
    {
        q: "¿Incluye la Constitución y la Ley 39/2015?",
        a: "Sí, además de tests específicos tienes páginas dedicadas a la Constitución Española y a la Ley 39/2015 del Procedimiento Administrativo Común.",
    },
]

export default function HomePage() {
    return (
        <div className="min-h-dvh bg-white text-zinc-950">
            <LightNavbar />

            {/* ───────────── HERO ───────────── */}
            <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:pt-24">
                {/* halo sutil */}
                <div
                    className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[820px] -translate-x-1/2"
                    style={{
                        background:
                            "radial-gradient(50% 50% at 50% 0%, rgba(16,185,129,0.14), transparent 70%)",
                    }}
                    aria-hidden
                />

                {/* Iconos flotantes — izquierda (solo desktop) */}
                <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[24%] md:block">
                    <IconBook className="float-slow absolute left-[18%] top-[14%] h-16 w-16" style={{ animationDelay: "0s" }} />
                    <IconScales className="float-slow absolute left-[54%] top-[34%] h-14 w-14" style={{ animationDelay: "1.1s" }} />
                    <IconCalendar className="float-slow absolute left-[10%] top-[58%] h-14 w-14" style={{ animationDelay: "2.2s" }} />
                    <Chip className="float-slow absolute left-[20%] top-[40%]" style={{ animationDelay: "0.6s" }}>
                        Tema 7 · 92%
                    </Chip>
                    <Chip className="float-slow absolute left-[8%] top-[78%]" dot="#18181B" style={{ animationDelay: "1.7s" }}>
                        Racha 12 días
                    </Chip>
                </div>

                {/* Iconos flotantes — derecha (solo desktop) */}
                <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[24%] md:block">
                    <IconExam className="float-slow absolute right-[16%] top-[12%] h-16 w-16" style={{ animationDelay: "0.4s" }} />
                    <IconTrophy className="float-slow absolute right-[52%] top-[32%] h-14 w-14" style={{ animationDelay: "1.5s" }} />
                    <IconChart className="float-slow absolute right-[12%] top-[60%] h-14 w-14" style={{ animationDelay: "2.6s" }} />
                    <Chip className="float-slow absolute right-[18%] top-[44%]" style={{ animationDelay: "0.9s" }}>
                        30 preguntas
                    </Chip>
                    <Chip className="float-slow absolute right-[6%] top-[80%]" dot="#18181B" style={{ animationDelay: "2.1s" }}>
                        Simulacro IVAP
                    </Chip>
                </div>

                {/* Núcleo del hero */}
                <div className="relative mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-zinc-500">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                        OPE Gobierno Vasco 2026 · IVAP
                    </span>
                    <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight text-zinc-950 sm:text-6xl md:text-7xl">
                        Aprueba tu plaza
                        <br />
                        en el Gobierno Vasco.
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500">
                        La plataforma técnica para preparar tu oposición: tests por
                        el temario oficial del IVAP, simulacros reales y tu progreso
                        medido al detalle.
                    </p>
                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/signup"
                            className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-7 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03] sm:w-auto"
                        >
                            Empieza gratis
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex w-full items-center justify-center rounded-full border border-zinc-300 bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 sm:w-auto"
                        >
                            Ver los tests
                        </Link>
                    </div>
                    <p className="mt-4 text-[13px] text-zinc-400">
                        Gratis para empezar · Sin tarjeta · Temario oficial IVAP
                    </p>
                </div>
            </section>

            {/* ───────────── STAT STRIP ───────────── */}
            <section className="border-y border-zinc-100 bg-zinc-50/60">
                <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px sm:grid-cols-4">
                    {[
                        { n: "4", l: "escalas" },
                        { n: "30", l: "preguntas/tema" },
                        { n: "100%", l: "temario IVAP" },
                        { n: "2026", l: "convocatoria" },
                    ].map((s) => (
                        <div key={s.l} className="px-5 py-7 text-center">
                            <div className="text-3xl font-extrabold tracking-tight text-zinc-950">
                                {s.n}
                            </div>
                            <div className="mt-1 text-[13px] font-medium text-zinc-500">
                                {s.l}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───────────── POR ESCALA ───────────── */}
            <section className="px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
                        Elige tu escala
                    </h2>
                    <p className="mt-3 max-w-2xl text-zinc-500">
                        Cada escala con su temario completo: bloque común y
                        específicos, en vista por bloques o temario oficial.
                    </p>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {ESCALAS.map((e) => (
                            <Link
                                key={e.href}
                                href={e.href}
                                className="group flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5"
                            >
                                <div>
                                    <div className="text-lg font-bold text-zinc-950">
                                        {e.label}
                                    </div>
                                    <div className="mt-1 text-[13px] text-zinc-500">
                                        OPE Gobierno Vasco · Grupo {e.grupo}
                                    </div>
                                </div>
                                <span
                                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-zinc-400 transition-all group-hover:translate-x-1"
                                    style={{ color: ACCENT }}
                                >
                                    →
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── FEATURES ───────────── */}
            <section className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
                        Todo lo que necesitas para aprobar
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((f) => (
                            <div
                                key={f.t}
                                className="rounded-3xl border border-zinc-200 bg-white p-6"
                            >
                                <div
                                    className="mb-4 h-9 w-9 rounded-xl"
                                    style={{
                                        background: `linear-gradient(145deg, #34D399, ${ACCENT})`,
                                    }}
                                />
                                <h3 className="text-base font-bold text-zinc-950">
                                    {f.t}
                                </h3>
                                <p className="mt-2 text-[14px] leading-relaxed text-zinc-500">
                                    {f.d}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── RECURSOS ───────────── */}
            <section className="px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
                        Recursos destacados
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                            { t: "Constitución Española", d: "Test y teoría del bloque común.", href: "/constitucion" },
                            { t: "Ley 39/2015", d: "Procedimiento Administrativo Común.", href: "/ley-39-2015" },
                            { t: "Fechas de las OPEs 2026", d: "Calendario provisional del IVAP.", href: "/fechas-opes" },
                        ].map((r) => (
                            <Link
                                key={r.href}
                                href={r.href}
                                className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5"
                            >
                                <h3 className="text-base font-bold text-zinc-950 group-hover:underline">
                                    {r.t}
                                </h3>
                                <p className="mt-2 text-[14px] text-zinc-500">
                                    {r.d}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── FAQ ───────────── */}
            <section className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-20">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
                        Preguntas frecuentes
                    </h2>
                    <div className="mt-8 divide-y divide-zinc-200 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
                        {FAQS.map((f) => (
                            <details key={f.q} className="group px-6">
                                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[15px] font-semibold text-zinc-950">
                                    {f.q}
                                    <span className="ml-4 text-zinc-400 transition-transform group-open:rotate-45">
                                        +
                                    </span>
                                </summary>
                                <p className="pb-5 text-[14px] leading-relaxed text-zinc-500">
                                    {f.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── CTA ───────────── */}
            <section className="px-5 py-20">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-zinc-950 px-8 py-16 text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Empieza a preparar tu plaza hoy
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                        Crea tu cuenta gratis y practica el temario oficial del IVAP
                        desde el primer minuto.
                    </p>
                    <Link
                        href="/signup"
                        className="mt-8 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold text-zinc-950 transition-transform hover:scale-[1.03]"
                        style={{ backgroundColor: ACCENT }}
                    >
                        Empieza gratis
                    </Link>
                </div>
            </section>

            {/* ───────────── FOOTER ───────────── */}
            <footer className="border-t border-zinc-200 px-5 py-12">
                <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 sm:flex-row">
                    <div>
                        <div className="text-xl font-extrabold tracking-tight text-zinc-950">
                            gain<span style={{ color: ACCENT }}>ditu</span>.
                        </div>
                        <p className="mt-2 max-w-xs text-[13px] text-zinc-500">
                            Tests por temario oficial del IVAP para la OPE del
                            Gobierno Vasco 2026.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[14px] sm:grid-cols-3">
                        {[
                            ["Personal de Apoyo", "/oposiciones/personal-de-apoyo"],
                            ["Administrativo", "/oposiciones/administrativo"],
                            ["Técnico de Gestión", "/oposiciones/tecnico-gestion"],
                            ["Técnico Superior", "/oposiciones/tecnico-superior"],
                            ["Constitución", "/constitucion"],
                            ["Ley 39/2015", "/ley-39-2015"],
                            ["Fechas OPE", "/fechas-opes"],
                            ["Aviso legal", "/aviso-legal"],
                            ["Privacidad", "/privacidad"],
                        ].map(([l, h]) => (
                            <Link
                                key={h}
                                href={h}
                                className="text-zinc-500 transition-colors hover:text-zinc-950"
                            >
                                {l}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="mx-auto mt-10 max-w-5xl border-t border-zinc-100 pt-6 text-[12px] text-zinc-400">
                    © {new Date().getFullYear()} {SITE_NAME}. No oficial; sin
                    relación con el IVAP ni el Gobierno Vasco.
                </div>
            </footer>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: SITE_NAME,
                            url: SITE_URL,
                            description: SITE_DESCRIPTION,
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: SITE_NAME,
                            url: SITE_URL,
                            description:
                                "Tests por tema oficial del IVAP para la OPE del Gobierno Vasco 2026.",
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
        </div>
    )
}
