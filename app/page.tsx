import Link from "next/link"
import type { Metadata } from "next"
import LightNavbar from "@/components/site/LightNavbar"
import MagneticIcon from "@/components/home/MagneticIcon"
import Reveal from "@/components/home/Reveal"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

export const metadata: Metadata = {
    title: { absolute: "Gainditu — Tests OPE Gobierno Vasco 2026 (IVAP)" },
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
}

const ACCENT = "#10B981"

/* ─────────── Icono 3D flotante (PNG 3dicons) con magnético + flotación ─────────── */
function Floaty({
    src,
    size,
    className = "",
    delay = 0,
    from = "left",
}: {
    src: string
    size: number
    className?: string
    delay?: number
    from?: "left" | "right"
}) {
    return (
        <MagneticIcon
            className={`${from === "left" ? "enter-left" : "enter-right"} absolute ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <img
                src={src}
                alt=""
                aria-hidden
                width={size}
                height={size}
                className="float-slow select-none drop-shadow-[0_12px_22px_rgba(15,23,42,0.22)]"
                style={{ animationDelay: `${delay}ms` }}
            />
        </MagneticIcon>
    )
}

/* ───────────────────────── Chips de UI flotantes ───────────────────────── */
function Chip({
    children,
    className = "",
    dot = ACCENT,
    delay = 0,
    from = "left",
}: {
    children: React.ReactNode
    className?: string
    dot?: string
    delay?: number
    from?: "left" | "right"
}) {
    return (
        <div
            className={`${from === "left" ? "enter-left" : "enter-right"} absolute inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2 text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-lg shadow-zinc-900/5 ${className}`}
            style={{ animationDelay: `${delay}ms` }}
            aria-hidden
        >
            <span className="float-slow h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
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
    { t: "Temario oficial del IVAP", d: "Cada test sigue el temario real de la convocatoria: bloque común (T.1–14) y específicos de tu escala.", icon: "/icons3d/notebook-front.png" },
    { t: "Dos vistas de estudio", d: "Practica por bloques temáticos transversales o sigue el temario oficial tema a tema, marcando tu avance.", icon: "/icons3d/copy-front.png" },
    { t: "30 preguntas por tema", d: "Preguntas estilo examen con explicación elaborada de por qué cada opción es correcta o falla.", icon: "/icons3d/tick-front.png" },
    { t: "Simulacros con penalización real", d: "Exámenes oficiales de convocatorias anteriores y simulacros con la penalización del IVAP.", icon: "/icons3d/pencil-front.png" },
    { t: "Tu progreso, medido", d: "Mejor porcentaje por tema, racha de estudio y estadísticas para saber exactamente qué repasar.", icon: "/icons3d/folder-new-front.png" },
    { t: "Recursos clave", d: "Páginas dedicadas a la Constitución, la Ley 39/2015 y el calendario de las OPEs 2026.", icon: "/icons3d/calender-front.png" },
]

const TESTIMONIOS = [
    { n: "María G.", e: "Administrativo C1", t: "Por fin un sitio que sigue el temario del IVAP de verdad. Las explicaciones de cada pregunta valen oro." },
    { n: "Iker A.", e: "Técnico Superior", t: "Los simulacros con penalización real me prepararon para el examen mucho mejor que cualquier PDF." },
    { n: "Nerea L.", e: "Personal de Apoyo", t: "Estudio desde el móvil en cualquier rato. Ver mi progreso por tema me mantiene enganchada." },
    { n: "Jon E.", e: "Técnico de Gestión", t: "La vista por bloques me ayudó a ordenar el temario y saber exactamente qué me fallaba." },
    { n: "Ainhoa R.", e: "Administrativo C1", t: "Las estadísticas por tema son adictivas. Repasar lo que llevo flojo es mucho más eficiente." },
    { n: "Unai B.", e: "Personal de Apoyo", t: "Empecé gratis para probar y me quedé. Es justo lo que necesitaba para la OPE del Gobierno Vasco." },
]

// Profesores de ejemplo (MVP: fichas ilustrativas hasta tener altas reales)
const PROFES = [
    { n: "Ane M.", mat: "Derecho administrativo · Ley 39/2015", zona: "Bilbao · online", ini: "A" },
    { n: "Gorka L.", mat: "Constitución y organización del Estado", zona: "Vitoria-Gasteiz", ini: "G" },
    { n: "Leire S.", mat: "Euskera para oposiciones (perfil lingüístico)", zona: "Donostia · online", ini: "L" },
]

const FAQS = [
    { q: "¿Qué es Gainditu?", a: "Una plataforma de tests para preparar la OPE del Gobierno Vasco 2026, con preguntas organizadas por el temario oficial del IVAP." },
    { q: "¿Los tests son gratis?", a: "Sí. Creas una cuenta gratis y empiezas a practicar. El acceso Premium añade exámenes oficiales de convocatorias anteriores, simulacros con penalización real del IVAP y estadísticas avanzadas." },
    { q: "¿Qué escalas y cuerpos cubrís?", a: "Personal de Apoyo, Administrativos, Técnicos de Gestión y Técnicos Superiores del Gobierno Vasco, con el bloque común (temas 1–14) y los específicos de cada escala." },
    { q: "¿Incluye la Constitución y la Ley 39/2015?", a: "Sí, además de tests específicos tienes páginas dedicadas a la Constitución Española y a la Ley 39/2015 del Procedimiento Administrativo Común." },
]

function ProductPreview() {
    return (
        <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/10">
            <div className="flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-900 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                <span className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                <span className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                <span className="ml-3 text-[12px] font-medium text-zinc-400 dark:text-zinc-500">gainditu · Tema 7 — Capacidad de obrar e interesados</span>
            </div>
            <div className="p-6 text-left">
                <div className="flex items-center justify-between text-[12px] font-semibold text-zinc-400 dark:text-zinc-500">
                    <span>Pregunta 12 / 30</span>
                    <span style={{ color: ACCENT }}>92% acierto</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-full w-2/5 rounded-full" style={{ backgroundColor: ACCENT }} />
                </div>
                <p className="mt-5 text-[15px] font-semibold text-zinc-950 dark:text-zinc-50">¿Quién tiene capacidad de obrar ante las Administraciones Públicas según la Ley 39/2015?</p>
                <div className="mt-4 space-y-2.5">
                    {[
                        { o: "A", t: "Solo las personas mayores de edad", ok: false },
                        { o: "B", t: "Los menores para el ejercicio de derechos que les permita el ordenamiento", ok: true },
                        { o: "C", t: "Únicamente las personas jurídicas", ok: false },
                    ].map((op) => (
                        <div
                            key={op.o}
                            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-[14px] ${
                                op.ok
                                    ? "font-semibold text-emerald-800 dark:text-emerald-300"
                                    : "border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                            }`}
                            style={op.ok ? { borderColor: ACCENT, background: "rgba(16,185,129,0.10)" } : undefined}
                        >
                            <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                                    op.ok ? "text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                                }`}
                                style={op.ok ? { background: ACCENT } : undefined}
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

/* ── Tira marquee de academias: sticky abajo, acompaña dentro de su contenedor ── */
const MARQUEE_ITEMS = [
    "¿Tienes una academia de oposiciones?",
    "Publicítala en Gainditu y llega a miles de opositores del Gobierno Vasco",
    "Espacios destacados · Campañas a medida",
    "Escríbenos a hola@gainditu.com",
]
function MarqueeGroup() {
    return (
        <div className="flex shrink-0 items-center">
            {MARQUEE_ITEMS.map((t, i) => (
                <span key={i} className="flex items-center whitespace-nowrap text-[13px] font-semibold">
                    {t}
                    <span className="mx-6" style={{ color: ACCENT }}>
                        ●
                    </span>
                </span>
            ))}
        </div>
    )
}
function AcademiaMarquee() {
    return (
        <div className="sticky bottom-0 z-40 px-4 pb-4 sm:px-5">
            <a
                href="mailto:hola@gainditu.com?subject=Publicidad%20para%20academias"
                className="marquee-group mx-auto flex max-w-5xl items-center gap-3 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/85 dark:bg-zinc-900/85 px-3 py-2 text-zinc-600 dark:text-zinc-300 shadow-lg shadow-zinc-900/5 backdrop-blur-md transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
            >
                <span
                    className="hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide sm:inline"
                    style={{ background: "rgba(16,185,129,0.12)", color: "#047857" }}
                >
                    Academias
                </span>
                <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
                    <div className="animate-marquee flex w-max items-center">
                        <MarqueeGroup />
                        <MarqueeGroup />
                    </div>
                </div>
                <span
                    className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white"
                    style={{ background: ACCENT }}
                >
                    Contactar →
                </span>
            </a>
        </div>
    )
}

export default function HomePage() {
    return (
        <div className="min-h-dvh bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
            <LightNavbar />

            {/* CONTENEDOR STICKY: hero + premium + tests. El marquee acompaña abajo hasta el final de esta zona */}
            <div className="relative">

            {/* ───────────── HERO ───────────── */}
            <section className="relative isolate overflow-hidden px-5 pb-20 pt-16 sm:pt-24">
                <div className="hero-emerald" aria-hidden />

                <div className="relative z-10 mx-auto max-w-5xl">
                    {/* Constelación de iconos 3D + chips que caen desde los laterales (desktop) */}
                    <div className="pointer-events-none absolute inset-0 hidden md:block">
                        <div className="pointer-events-auto">
                            <Floaty src="/icons3d/notebook-dyn.png" size={104} from="left" className="left-[-2%] top-[2%]" delay={500} />
                            <Floaty src="/icons3d/calender-dyn.png" size={76} from="left" className="left-[8%] top-[40%]" delay={560} />
                            <Floaty src="/icons3d/pencil-dyn.png" size={84} from="left" className="left-[-3%] top-[74%]" delay={620} />
                            <Floaty src="/icons3d/tick-dyn.png" size={104} from="right" className="right-[-2%] top-[4%]" delay={530} />
                            <Floaty src="/icons3d/folder-new-dyn.png" size={76} from="right" className="right-[8%] top-[42%]" delay={590} />
                            <Floaty src="/icons3d/copy-dyn.png" size={84} from="right" className="right-[-3%] top-[76%]" delay={650} />
                        </div>
                        <Chip from="left" className="left-[12%] top-[22%]" delay={640}>Tema 7 · 92%</Chip>
                        <Chip from="left" className="left-[18%] top-[9%]" delay={880}>Ley 39/2015</Chip>
                        <Chip from="left" className="left-[-1%] top-[57%]" delay={740}>Constitución ✓</Chip>
                        <Chip from="left" className="left-[9%] top-[90%]" dot="#18181B" delay={800}>Racha 12 días</Chip>
                        <Chip from="right" className="right-[11%] top-[24%]" delay={670}>30 preguntas</Chip>
                        <Chip from="right" className="right-[17%] top-[11%]" delay={900}>Aprobado ✓</Chip>
                        <Chip from="right" className="right-[-1%] top-[59%]" delay={770}>Nuevo récord 88%</Chip>
                        <Chip from="right" className="right-[8%] top-[92%]" dot="#18181B" delay={830}>Simulacro IVAP</Chip>
                    </div>

                    {/* Núcleo del hero */}
                    <div className="relative z-10 mx-auto max-w-3xl text-center">
                        <span className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400" style={{ animationDelay: "0ms" }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                            OPE Gobierno Vasco 2026 · IVAP
                        </span>
                        <h1 className="anim-fade-up mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-6xl md:text-7xl" style={{ animationDelay: "80ms" }}>
                            Aprueba tu plaza
                            <br />
                            en el Gobierno Vasco.
                        </h1>
                        <p className="anim-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400" style={{ animationDelay: "180ms" }}>
                            La plataforma técnica para preparar tu oposición: tests por el temario oficial del IVAP, simulacros reales y tu progreso medido al detalle.
                        </p>
                        <div className="anim-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "280ms" }}>
                            <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 px-7 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03] sm:w-auto">Empieza gratis</Link>
                            <Link href="/dashboard" className="inline-flex w-full items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-7 py-3.5 text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60 sm:w-auto">Ver los tests</Link>
                        </div>
                        <p className="anim-fade-up mt-4 text-[13px] text-zinc-400 dark:text-zinc-500" style={{ animationDelay: "360ms" }}>Gratis para empezar · Sin tarjeta · Temario oficial IVAP</p>
                    </div>
                </div>

                {/* Preview del producto */}
                <Reveal className="relative z-10 mt-16 px-1" delay={120}>
                    <ProductPreview />
                </Reveal>
            </section>

            {/* ───────────── STAT STRIP ───────────── */}
            <section className="border-y border-zinc-100 dark:border-zinc-800/70 bg-zinc-50/60 dark:bg-zinc-900/40">
                <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px sm:grid-cols-4">
                    {[
                        { n: "4", l: "escalas" },
                        { n: "30", l: "preguntas/tema" },
                        { n: "100%", l: "temario IVAP" },
                        { n: "2026", l: "convocatoria" },
                    ].map((s, i) => (
                        <Reveal key={s.l} className="px-5 py-7 text-center" delay={i * 80}>
                            <div className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">{s.n}</div>
                            <div className="mt-1 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">{s.l}</div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ───────────── PREMIUM / COMUNIDAD (debajo del banner) ───────────── */}
            <section className="px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Reveal>
                            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Premium</span>
                            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">Desbloquea todo y entra en la comunidad</h2>
                            <p className="mt-3 text-zinc-500 dark:text-zinc-400">Empieza gratis y, cuando quieras dar el salto, accede a todo el material avanzado con un único pago. Sin suscripción.</p>
                            <ul className="mt-6 space-y-3">
                                {["Exámenes oficiales de convocatorias anteriores", "Simulacros con penalización real del IVAP", "Estadísticas avanzadas y seguimiento por tema", "Comunidad de opositores y novedades de la OPE"].map((b) => (
                                    <li key={b} className="flex items-start gap-3 text-[15px] text-zinc-700 dark:text-zinc-300">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ backgroundColor: ACCENT }}>✓</span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                        <Reveal delay={120}>
                            <div className="flex flex-col justify-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8">
                                <div className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Acceso completo</div>
                                <div className="mt-2 flex items-end gap-2">
                                    <span className="text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">24,99€</span>
                                    <span className="mb-1.5 text-[14px] text-zinc-400 dark:text-zinc-500 line-through">40€</span>
                                </div>
                                <div className="mt-1 text-[14px] text-zinc-500 dark:text-zinc-400">Pago único · Acceso de por vida</div>
                                <Link href="/payment" className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03]">Conseguir acceso</Link>
                                <Link href="/signup" className="mt-3 text-center text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900">o empieza gratis →</Link>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ───────────── POR ESCALA ───────────── */}
            <section className="px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <Reveal>
                        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">Elige tu escala</h2>
                        <p className="mt-3 max-w-2xl text-zinc-500 dark:text-zinc-400">Cada escala con su temario completo: bloque común y específicos, en vista por bloques o temario oficial.</p>
                    </Reveal>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {ESCALAS.map((e, i) => (
                            <Reveal key={e.href} delay={i * 70}>
                                <Link href={e.href} className="group flex items-center justify-between rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/5">
                                    <div>
                                        <div className="text-lg font-bold text-zinc-950 dark:text-zinc-50">{e.label}</div>
                                        <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">OPE Gobierno Vasco · Grupo {e.grupo}</div>
                                    </div>
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all group-hover:translate-x-1" style={{ color: ACCENT }}>→</span>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

                {/* Tira de academias: pegada abajo, acompaña hasta aquí y se aparca */}
                <AcademiaMarquee />
            </div>
            {/* fin contenedor sticky */}

            {/* ───────────── FEATURES ───────────── */}
            <section className="border-t border-zinc-100 dark:border-zinc-800/70 bg-zinc-50/60 dark:bg-zinc-900/40 px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <Reveal><h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">Todo lo que necesitas para aprobar</h2></Reveal>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((f, i) => (
                            <Reveal key={f.t} delay={(i % 3) * 80}>
                                <div className="h-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(145deg, rgba(16,185,129,0.20), rgba(16,185,129,0.06))" }}>
                                        <img src={f.icon} alt="" aria-hidden width={44} height={44} className="h-11 w-11 object-contain" loading="lazy" />
                                    </div>
                                    <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">{f.t}</h3>
                                    <p className="mt-2 text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">{f.d}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── OPINIONES (carrusel automático) ───────────── */}
            <section className="py-20">
                <div className="mx-auto max-w-5xl px-5">
                    <Reveal><h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">Lo que dicen los opositores</h2></Reveal>
                    <div className="marquee-group relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
                        <div className="animate-marquee-slow flex w-max gap-4">
                        {[...TESTIMONIOS, ...TESTIMONIOS].map((t, i) => (
                            <figure key={i} className="flex w-[300px] shrink-0 flex-col rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:w-[360px]">
                                <div className="mb-3 flex gap-0.5" style={{ color: ACCENT }} aria-hidden>{"★★★★★".split("").map((s, k) => (<span key={k}>{s}</span>))}</div>
                                <blockquote className="flex-1 text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300">“{t.t}”</blockquote>
                                <figcaption className="mt-5 flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 text-[13px] font-bold text-white">{t.n[0]}</span>
                                    <span>
                                        <span className="block text-[13px] font-bold text-zinc-950 dark:text-zinc-50">{t.n}</span>
                                        <span className="block text-[12px] text-zinc-400 dark:text-zinc-500">{t.e}</span>
                                    </span>
                                </figcaption>
                            </figure>
                        ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────── PROFESORES ───────────── */}
            <section className="border-t border-zinc-100 dark:border-zinc-800/70 bg-zinc-50/60 dark:bg-zinc-900/40 px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <Reveal>
                        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Clases particulares</span>
                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">Profesores para tu oposición</h2>
                        <p className="mt-3 max-w-2xl text-zinc-500 dark:text-zinc-400">¿Necesitas un empujón con algún bloque? Profesores particulares especializados en la OPE del Gobierno Vasco. Y si eres profe, anúnciate y llega a nuevos alumnos.</p>
                    </Reveal>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {PROFES.map((p, i) => (
                            <Reveal key={p.n} delay={i * 70}>
                                <div className="flex h-full flex-col rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-bold text-white" style={{ background: `linear-gradient(145deg, #34D399, ${ACCENT})` }}>{p.ini}</span>
                                        <div>
                                            <div className="text-[15px] font-bold text-zinc-950 dark:text-zinc-50">{p.n}</div>
                                            <div className="text-[12px] text-zinc-400 dark:text-zinc-500">{p.zona}</div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">{p.mat}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link href="/profesores" className="inline-flex items-center justify-center rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]">Ver profesores →</Link>
                        <a href="mailto:hola@gainditu.com?subject=Quiero%20anunciarme%20como%20profesor" className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-3 text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60">Anúnciate como profesor</a>
                    </div>
                </div>
            </section>

            {/* ───────────── RECURSOS ───────────── */}
            <section className="px-5 py-20">
                <div className="mx-auto max-w-5xl">
                    <Reveal><h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">Recursos destacados</h2></Reveal>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[
                            { t: "Constitución Española", d: "Test y teoría del bloque común.", href: "/constitucion" },
                            { t: "Ley 39/2015", d: "Procedimiento Administrativo Común.", href: "/ley-39-2015" },
                            { t: "Fechas de las OPEs 2026", d: "Calendario provisional del IVAP.", href: "/fechas-opes" },
                        ].map((r, i) => (
                            <Reveal key={r.href} delay={i * 70}>
                                <Link href={r.href} className="group block h-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/5">
                                    <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 group-hover:underline">{r.t}</h3>
                                    <p className="mt-2 text-[14px] text-zinc-500 dark:text-zinc-400">{r.d}</p>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── FAQ ───────────── */}
            <section className="border-t border-zinc-100 dark:border-zinc-800/70 bg-zinc-50/60 dark:bg-zinc-900/40 px-5 py-20">
                <div className="mx-auto max-w-3xl">
                    <Reveal><h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">Preguntas frecuentes</h2></Reveal>
                    <Reveal delay={80} className="mt-8 divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        {FAQS.map((f) => (
                            <details key={f.q} className="group px-6">
                                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[15px] font-semibold text-zinc-950 dark:text-zinc-50">
                                    {f.q}
                                    <span className="ml-4 text-zinc-400 dark:text-zinc-500 transition-transform group-open:rotate-45">+</span>
                                </summary>
                                <p className="pb-5 text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">{f.a}</p>
                            </details>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* ───────────── CTA ───────────── */}
            <section className="px-5 py-20">
                <Reveal className="mx-auto max-w-5xl">
                    <div className="overflow-hidden rounded-[2rem] bg-zinc-950 dark:border dark:border-zinc-800 dark:bg-zinc-900 px-8 py-16 text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Empieza a preparar tu plaza hoy</h2>
                        <p className="mx-auto mt-4 max-w-xl text-zinc-400 dark:text-zinc-500">Crea tu cuenta gratis y practica el temario oficial del IVAP desde el primer minuto.</p>
                        <Link href="/signup" className="mt-8 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold text-zinc-950 dark:text-zinc-50 transition-transform hover:scale-[1.03]" style={{ backgroundColor: ACCENT }}>Empieza gratis</Link>
                    </div>
                </Reveal>
            </section>

            {/* ───────────── FOOTER ───────────── */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 px-5 py-12">
                <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 sm:flex-row">
                    <div>
                        <div className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">gain<span style={{ color: ACCENT }}>ditu</span>.</div>
                        <p className="mt-2 max-w-xs text-[13px] text-zinc-500 dark:text-zinc-400">Tests por temario oficial del IVAP para la OPE del Gobierno Vasco 2026.</p>
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
                            <Link key={h} href={h} className="text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-950 dark:hover:text-white">{l}</Link>
                        ))}
                    </div>
                </div>
                <div className="mx-auto mt-10 max-w-5xl border-t border-zinc-100 dark:border-zinc-800/70 pt-6 text-[12px] text-zinc-400 dark:text-zinc-500">© {new Date().getFullYear()} {SITE_NAME}. No oficial; sin relación con el IVAP ni el Gobierno Vasco.</div>
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
