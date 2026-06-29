import Link from "next/link"
import type { Metadata } from "next"
import LightNavbar from "@/components/site/LightNavbar"
import MagneticIcon from "@/components/home/MagneticIcon"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

export const metadata: Metadata = {
    title: { absolute: "Gainditu — Tests OPE Gobierno Vasco 2026 (IVAP)" },
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
}

const ACCENT = "#10B981"

/* ───────────────────── Iconos 3D glossy (estilo clay) ───────────────────── */
function ClayTile({
    id,
    size = 84,
    from,
    to,
    edge,
    shadow,
    children,
}: {
    id: string
    size?: number
    from: string
    to: string
    edge: string
    shadow: string
    children: React.ReactNode
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 96 96"
            fill="none"
            style={{ filter: `drop-shadow(0 16px 24px ${shadow})`, display: "block" }}
        >
            <defs>
                <linearGradient id={`g-${id}`} x1="48" y1="6" x2="48" y2="90" gradientUnits="userSpaceOnUse">
                    <stop stopColor={from} />
                    <stop offset="1" stopColor={to} />
                </linearGradient>
                <radialGradient id={`hi-${id}`} cx="0.3" cy="0.16" r="0.9">
                    <stop stopColor="#ffffff" stopOpacity="0.65" />
                    <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
            </defs>
            {/* grosor / extrusión */}
            <rect x="8" y="12" width="80" height="80" rx="26" fill={edge} />
            {/* cara */}
            <rect x="8" y="6" width="80" height="80" rx="26" fill={`url(#g-${id})`} />
            {/* brillo especular */}
            <rect x="8" y="6" width="80" height="80" rx="26" fill={`url(#hi-${id})`} />
            <ellipse cx="36" cy="26" rx="22" ry="11" fill="#ffffff" opacity="0.22" />
            <g
                stroke="#ffffff"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            >
                {children}
            </g>
        </svg>
    )
}

const EMERALD = { from: "#6EE7B7", to: "#059669", edge: "#047857", shadow: "rgba(16,185,129,0.4)" }
const DARK = { from: "#3F3F46", to: "#09090B", edge: "#000000", shadow: "rgba(9,9,11,0.34)" }
const MINT = { from: "#A7F3D0", to: "#10B981", edge: "#059669", shadow: "rgba(16,185,129,0.35)" }

const IconBook = ({ size }: { size?: number }) => (
    <ClayTile id="book" size={size} {...EMERALD}>
        <path d="M32 30h22a4 4 0 0 1 4 4v30H38a6 6 0 0 0-6 6V30Z" strokeWidth="5" />
        <path d="M32 30a6 6 0 0 0-6 6v34a6 6 0 0 1 6-6" strokeWidth="5" />
    </ClayTile>
)
const IconExam = ({ size }: { size?: number }) => (
    <ClayTile id="exam" size={size} {...DARK}>
        <rect x="30" y="28" width="36" height="42" rx="6" strokeWidth="5" />
        <path d="M38 42h12M38 52h18" strokeWidth="4.5" />
        <path d="M52 40l4.5 4.5L65 36" stroke={ACCENT} strokeWidth="5.5" />
    </ClayTile>
)
const IconScales = ({ size }: { size?: number }) => (
    <ClayTile id="scales" size={size} {...MINT}>
        <path d="M48 26v44M34 70h28" strokeWidth="5.5" />
        <path d="M30 34h36" strokeWidth="5" />
        <path d="M30 34l-8 16h16l-8-16ZM66 34l-8 16h16l-8-16Z" strokeWidth="4" />
    </ClayTile>
)
const IconCalendar = ({ size }: { size?: number }) => (
    <ClayTile id="cal" size={size} {...DARK}>
        <rect x="28" y="30" width="40" height="38" rx="7" strokeWidth="5" />
        <path d="M28 42h40M38 24v8M58 24v8" strokeWidth="5" />
        <circle cx="42" cy="55" r="2.5" fill={ACCENT} stroke={ACCENT} />
        <circle cx="56" cy="55" r="2.5" fill="#fff" />
    </ClayTile>
)
const IconTrophy = ({ size }: { size?: number }) => (
    <ClayTile id="trophy" size={size} {...EMERALD}>
        <path d="M38 26h20v12a10 10 0 0 1-20 0V26Z" strokeWidth="5" />
        <path d="M38 32h-7a7 7 0 0 0 7 10M58 32h7a7 7 0 0 1-7 10M48 48v10M40 68h16M43 58h10" strokeWidth="5" />
    </ClayTile>
)
const IconChart = ({ size }: { size?: number }) => (
    <ClayTile id="chart" size={size} {...DARK}>
        <path d="M30 66h36M36 66V52M48 66V38M60 66V46" strokeWidth="5.5" />
        <path d="M34 46l10-10 8 5 11-13" stroke={ACCENT} strokeWidth="5.5" />
    </ClayTile>
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
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
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
    { t: "Temario oficial del IVAP", d: "Cada test sigue el temario real de la convocatoria: bloque común (T.1–14) y específicos de tu escala." },
    { t: "Dos vistas de estudio", d: "Practica por bloques temáticos transversales o sigue el temario oficial tema a tema, marcando tu avance." },
    { t: "30 preguntas por tema", d: "Preguntas estilo examen con explicación elaborada de por qué cada opción es correcta o falla." },
    { t: "Simulacros con penalización real", d: "Exámenes oficiales de convocatorias anteriores y simulacros con la penalización del IVAP." },
    { t: "Tu progreso, medido", d: "Mejor porcentaje por tema, racha de estudio y estadísticas para saber exactamente qué repasar." },
    { t: "Recursos clave", d: "Páginas dedicadas a la Constitución, la Ley 39/2015 y el calendario de las OPEs 2026." },
]

const TESTIMONIOS = [
    { n: "María G.", e: "Administrativo C1", t: "Por fin un sitio que sigue el temario del IVAP de verdad. Las explicaciones de cada pregunta valen oro." },
    { n: "Iker A.", e: "Técnico Superior", t: "Los simulacros con penalización real me prepararon para el examen mucho mejor que cualquier PDF." },
    { n: "Nerea L.", e: "Personal de Apoyo", t: "Estudio desde el móvil en cualquier rato. Ver mi progreso por tema me mantiene enganchada." },
]

const FAQS = [
    { q: "¿Qué es Gainditu?", a: "Una plataforma de tests para preparar la OPE del Gobierno Vasco 2026, con preguntas organizadas por el temario oficial del IVAP." },
    { q: "¿Los tests son gratis?", a: "Sí. Creas una cuenta gratis y empiezas a practicar. El acceso Premium añade exámenes oficiales de convocatorias anteriores, simulacros con penalización real del IVAP y estadísticas avanzadas." },
    { q: "¿Qué escalas y cuerpos cubrís?", a: "Personal de Apoyo, Administrativos, Técnicos de Gestión y Técnicos Superiores del Gobierno Vasco, con el bloque común (temas 1–14) y los específicos de cada escala." },
    { q: "¿Incluye la Constitución y la Ley 39/2015?", a: "Sí, además de tests específicos tienes páginas dedicadas a la Constitución Española y a la Ley 39/2015 del Procedimiento Administrativo Común." },
]

/* ───────────────────────── Preview del producto ───────────────────────── */
function ProductPreview() {
    return (
        <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10">
            <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-zinc-300" />
                <span className="h-3 w-3 rounded-full bg-zinc-300" />
                <span className="h-3 w-3 rounded-full bg-zinc-300" />
                <span className="ml-3 text-[12px] font-medium text-zinc-400">
                    gainditu · Tema 7 — Capacidad de obrar e interesados
                </span>
            </div>
            <div className="p-6 text-left">
                <div className="flex items-center justify-between text-[12px] font-semibold text-zinc-400">
                    <span>Pregunta 12 / 30</span>
                    <span style={{ color: ACCENT }}>92% acierto</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full w-2/5 rounded-full" style={{ backgroundColor: ACCENT }} />
                </div>
                <p className="mt-5 text-[15px] font-semibold text-zinc-950">
                    ¿Quién tiene capacidad de obrar ante las Administraciones Públicas
                    según la Ley 39/2015?
                </p>
                <div className="mt-4 space-y-2.5">
                    {[
                        { o: "A", t: "Solo las personas mayores de edad", ok: false },
                        { o: "B", t: "Los menores para el ejercicio de derechos que les permita el ordenamiento", ok: true },
                        { o: "C", t: "Únicamente las personas jurídicas", ok: false },
                    ].map((op) => (
                        <div
                            key={op.o}
                            className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-[14px]"
                            style={
                                op.ok
                                    ? { borderColor: ACCENT, background: "rgba(16,185,129,0.08)", color: "#065F46", fontWeight: 600 }
                                    : { borderColor: "#E4E4E7", color: "#52525B" }
                            }
                        >
                            <span
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                                style={op.ok ? { background: ACCENT, color: "#fff" } : { background: "#F4F4F5", color: "#71717A" }}
                            >
                                {op.ok ? "✓" : op.o}
                            </span>
                            {op.t}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function HomePage() {
    return (
        <div className="min-h-dvh bg-white text-zinc-950">
            <LightNavbar />

            {/* ───────────── HERO ───────────── */}
            <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:pt-24">
                <div
                    className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[820px] -translate-x-1/2"
                    style={{ background: "radial-gradient(50% 50% at 50% 0%, rgba(16,185,129,0.14), transparent 70%)" }}
                    aria-hidden
                />

                {/* Iconos flotantes — izquierda */}
                <div className="absolute inset-y-0 left-0 hidden w-[26%] md:block">
                    <MagneticIcon className="float-slow absolute left-[16%] top-[12%]" style={{ animationDelay: "0s" }}>
                        <IconBook size={88} />
                    </MagneticIcon>
                    <MagneticIcon className="float-slow absolute left-[56%] top-[33%]" style={{ animationDelay: "1.1s" }}>
                        <IconScales size={72} />
                    </MagneticIcon>
                    <MagneticIcon className="float-slow absolute left-[8%] top-[58%]" style={{ animationDelay: "2.2s" }}>
                        <IconCalendar size={76} />
                    </MagneticIcon>
                    <Chip className="float-slow absolute left-[20%] top-[42%]" style={{ animationDelay: "0.6s" }}>
                        Tema 7 · 92%
                    </Chip>
                    <Chip className="float-slow absolute left-[6%] top-[80%]" dot="#18181B" style={{ animationDelay: "1.7s" }}>
                        Racha 12 días
                    </Chip>
                </div>

                {/* Iconos flotantes — derecha */}
                <div className="absolute inset-y-0 right-0 hidden w-[26%] md:block">
                    <MagneticIcon className="float-slow absolute right-[14%] top-[11%]" style={{ animationDelay: "0.4s" }}>
                        <IconExam size={88} />
                    </MagneticIcon>
                    <MagneticIcon className="float-slow absolute right-[54%] top-[32%]" style={{ animationDelay: "1.5s" }}>
                        <IconTrophy size={72} />
                    </MagneticIcon>
                    <MagneticIcon className="float-slow absolute right-[10%] top-[60%]" style={{ animationDelay: "2.6s" }}>
                        <IconChart size={76} />
                    </MagneticIcon>
                    <Chip className="float-slow absolute right-[18%] top-[45%]" style={{ animationDelay: "0.9s" }}>
                        30 preguntas
                    </Chip>
                    <Chip className="float-slow absolute right-[4%] top-[82%]" dot="#18181B" style={{ animationDelay: "2.1s" }}>
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
                        La plataforma técnica para preparar tu oposición: tests por el
                        temario oficial del IVAP, simulacros reales y tu progreso medido
                        al detalle.
                    </p>
                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-7 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03] sm:w-auto">
                            Empieza gratis
                        </Link>
                        <Link href="/dashboard" className="inline-flex w-full items-center justify-center rounded-full border border-zinc-300 bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 sm:w-auto">
                            Ver los tests
                        </Link>
                    </div>
                    <p className="mt-4 text-[13px] text-zinc-400">
                        Gratis para empezar · Sin tarjeta · Temario oficial IVAP
                    </p>
                </div>

                {/* Preview del producto */}
                <div className="relative mt-16 px-1">
                    <ProductPreview />
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
                            <div className="text-3xl font-extrabold tracking-tight text-zinc-950">{s.n}</div>
                            <div className="mt-1 text-[13px] font-medium text-zinc-500">{s.l}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───────────── POR ESCALA ───────────── */}
            <section className="px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">Elige tu escala</h2>
                    <p className="mt-3 max-w-2xl text-zinc-500">
                        Cada escala con su temario completo: bloque común y específicos, en vista por bloques o temario oficial.
                    </p>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {ESCALAS.map((e) => (
                            <Link key={e.href} href={e.href} className="group flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5">
                                <div>
                                    <div className="text-lg font-bold text-zinc-950">{e.label}</div>
                                    <div className="mt-1 text-[13px] text-zinc-500">OPE Gobierno Vasco · Grupo {e.grupo}</div>
                                </div>
                                <span className="flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all group-hover:translate-x-1" style={{ color: ACCENT }}>→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── FEATURES ───────────── */}
            <section className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">Todo lo que necesitas para aprobar</h2>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((f) => (
                            <div key={f.t} className="rounded-3xl border border-zinc-200 bg-white p-6">
                                <div className="mb-4 h-9 w-9 rounded-xl" style={{ background: `linear-gradient(145deg, #34D399, ${ACCENT})` }} />
                                <h3 className="text-base font-bold text-zinc-950">{f.t}</h3>
                                <p className="mt-2 text-[14px] leading-relaxed text-zinc-500">{f.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── OPINIONES ───────────── */}
            <section className="px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">Lo que dicen los opositores</h2>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {TESTIMONIOS.map((t) => (
                            <figure key={t.n} className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-6">
                                <div className="mb-3 flex gap-0.5" style={{ color: ACCENT }} aria-hidden>
                                    {"★★★★★".split("").map((s, i) => (<span key={i}>{s}</span>))}
                                </div>
                                <blockquote className="flex-1 text-[14px] leading-relaxed text-zinc-700">“{t.t}”</blockquote>
                                <figcaption className="mt-5 flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-[13px] font-bold text-white">{t.n[0]}</span>
                                    <span>
                                        <span className="block text-[13px] font-bold text-zinc-950">{t.n}</span>
                                        <span className="block text-[12px] text-zinc-400">{t.e}</span>
                                    </span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── PREMIUM / COMUNIDAD ───────────── */}
            <section className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-zinc-500">Premium</span>
                            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">Desbloquea todo y entra en la comunidad</h2>
                            <p className="mt-3 text-zinc-500">
                                Empieza gratis y, cuando quieras dar el salto, accede a todo el material avanzado con un único pago. Sin suscripción.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {[
                                    "Exámenes oficiales de convocatorias anteriores",
                                    "Simulacros con penalización real del IVAP",
                                    "Estadísticas avanzadas y seguimiento por tema",
                                    "Comunidad de opositores y novedades de la OPE",
                                ].map((b) => (
                                    <li key={b} className="flex items-start gap-3 text-[15px] text-zinc-700">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ backgroundColor: ACCENT }}>✓</span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center rounded-3xl border border-zinc-200 bg-white p-8">
                            <div className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400">Acceso completo</div>
                            <div className="mt-2 flex items-end gap-2">
                                <span className="text-5xl font-extrabold tracking-tight text-zinc-950">24,99€</span>
                                <span className="mb-1.5 text-[14px] text-zinc-400 line-through">40€</span>
                            </div>
                            <div className="mt-1 text-[14px] text-zinc-500">Pago único · Acceso de por vida</div>
                            <Link href="/payment" className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03]">
                                Conseguir acceso
                            </Link>
                            <Link href="/signup" className="mt-3 text-center text-[13px] font-medium text-zinc-500 hover:text-zinc-900">
                                o empieza gratis →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────── RECURSOS ───────────── */}
            <section className="px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">Recursos destacados</h2>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                            { t: "Constitución Española", d: "Test y teoría del bloque común.", href: "/constitucion" },
                            { t: "Ley 39/2015", d: "Procedimiento Administrativo Común.", href: "/ley-39-2015" },
                            { t: "Fechas de las OPEs 2026", d: "Calendario provisional del IVAP.", href: "/fechas-opes" },
                        ].map((r) => (
                            <Link key={r.href} href={r.href} className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5">
                                <h3 className="text-base font-bold text-zinc-950 group-hover:underline">{r.t}</h3>
                                <p className="mt-2 text-[14px] text-zinc-500">{r.d}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── ACADEMIAS ───────────── */}
            <section className="px-5 pb-20">
                <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 rounded-3xl border border-zinc-200 bg-white p-8 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-950">¿Tienes una academia de oposiciones?</h2>
                        <p className="mt-2 max-w-xl text-[14px] text-zinc-500">
                            Llega a miles de opositores del Gobierno Vasco anunciándote en Gainditu. Espacios destacados y campañas a medida.
                        </p>
                    </div>
                    <a href="mailto:hola@gainditu.com?subject=Publicidad%20para%20academias" className="inline-flex shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-[14px] font-semibold text-zinc-900 transition-colors hover:bg-zinc-50">
                        Contactar →
                    </a>
                </div>
            </section>

            {/* ───────────── FAQ ───────────── */}
            <section className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-20">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">Preguntas frecuentes</h2>
                    <div className="mt-8 divide-y divide-zinc-200 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
                        {FAQS.map((f) => (
                            <details key={f.q} className="group px-6">
                                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[15px] font-semibold text-zinc-950">
                                    {f.q}
                                    <span className="ml-4 text-zinc-400 transition-transform group-open:rotate-45">+</span>
                                </summary>
                                <p className="pb-5 text-[14px] leading-relaxed text-zinc-500">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── CTA ───────────── */}
            <section className="px-5 py-20">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-zinc-950 px-8 py-16 text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Empieza a preparar tu plaza hoy</h2>
                    <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                        Crea tu cuenta gratis y practica el temario oficial del IVAP desde el primer minuto.
                    </p>
                    <Link href="/signup" className="mt-8 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold text-zinc-950 transition-transform hover:scale-[1.03]" style={{ backgroundColor: ACCENT }}>
                        Empieza gratis
                    </Link>
                </div>
            </section>

            {/* ───────────── FOOTER ───────────── */}
            <footer className="border-t border-zinc-200 px-5 py-12">
                <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 sm:flex-row">
                    <div>
                        <div className="text-xl font-extrabold tracking-tight text-zinc-950">gain<span style={{ color: ACCENT }}>ditu</span>.</div>
                        <p className="mt-2 max-w-xs text-[13px] text-zinc-500">Tests por temario oficial del IVAP para la OPE del Gobierno Vasco 2026.</p>
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
                            <Link key={h} href={h} className="text-zinc-500 transition-colors hover:text-zinc-950">{l}</Link>
                        ))}
                    </div>
                </div>
                <div className="mx-auto mt-10 max-w-5xl border-t border-zinc-100 pt-6 text-[12px] text-zinc-400">
                    © {new Date().getFullYear()} {SITE_NAME}. No oficial; sin relación con el IVAP ni el Gobierno Vasco.
                </div>
            </footer>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION },
                        { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, description: "Tests por tema oficial del IVAP para la OPE del Gobierno Vasco 2026." },
                        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
                    ]),
                }}
            />
        </div>
    )
}
