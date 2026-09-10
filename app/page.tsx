import Link from "next/link"
import type { Metadata } from "next"
import LightNavbar from "@/components/site/LightNavbar"
import HeroSplit from "@/components/home/HeroSplit"
import Reveal from "@/components/home/Reveal"
import PremiumSection from "@/components/home/PremiumSection"
import TestsPopulares from "@/components/home/TestsPopulares"
import SectionHeading from "@/components/home/SectionHeading"
import SuscripcionConvocatorias from "@/components/convocatorias/SuscripcionConvocatorias"
import FinalCTA from "@/components/home/FinalCTA"
import Testimonios from "@/components/home/Testimonios"
import BackToTop from "@/components/site/BackToTop"
import QueOposicionNudge from "@/components/site/QueOposicionNudge"
import NotebookBg from "@/components/home/NotebookBg"
import SiteFooter from "@/components/site/SiteFooter"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SOCIAL } from "@/lib/site"

export const metadata: Metadata = {
    title: { absolute: "Gainditu — Oposiciones de Euskadi: tests, convocatorias y temario" },
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
}

const ACCENT = "#10B981"

/* ───────────────────────── Datos ───────────────────────── */
const ESCALAS = [
    { label: "Personal de Apoyo", grupo: "E", href: "/oposiciones/personal-de-apoyo" },
    { label: "Administrativo", grupo: "C1", href: "/oposiciones/administrativo" },
    { label: "Técnico de Gestión", grupo: "B", href: "/oposiciones/tecnico-gestion" },
    { label: "Técnico Superior", grupo: "A", href: "/oposiciones/tecnico-superior" },
]

const TESTIMONIOS = [
    { n: "María G.", e: "Administrativo C1", t: "Por fin un sitio que sigue el temario oficial de verdad. Las explicaciones de cada pregunta valen oro." },
    { n: "Iker A.", e: "Técnico Superior", t: "Los simulacros con penalización real me prepararon para el examen mucho mejor que cualquier PDF." },
    { n: "Nerea L.", e: "Personal de Apoyo", t: "Volví a estudiar a los 49 con miedo de no ser capaz. Ir tema a tema y a mi ritmo me lo ha puesto fácil." },
    { n: "Jon E.", e: "Técnico de Gestión", t: "La vista por bloques me ayudó a ordenar el temario y saber exactamente qué me fallaba." },
    { n: "Ainhoa R.", e: "Administrativo C1", t: "Retomé las oposiciones después de años y el euskera me daba pánico. Aquí lo llevo poco a poco y sé por dónde voy." },
    { n: "Unai B.", e: "Personal de Apoyo", t: "Empecé gratis para probar y me quedé. Es justo lo que necesitaba para la OPE del Gobierno Vasco." },
]

export default function HomePage() {
    return (
        <div className="relative min-h-dvh text-zinc-950 dark:text-zinc-50">
            {/* Fondo con profundidad: base + glows emerald muy suaves + rejilla tenue.
                Fijo detrás de todo; las secciones transparentes lo dejan ver. */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white dark:bg-zinc-950">
                <div className="absolute -top-40 right-[-12%] h-[560px] w-[560px] rounded-full bg-emerald-400/[0.10] blur-[130px] dark:bg-emerald-500/[0.10]" />
                <div className="absolute top-1/3 left-[-16%] h-[520px] w-[520px] rounded-full bg-emerald-300/[0.08] blur-[130px] dark:bg-emerald-500/[0.07]" />
                <div className="absolute bottom-[-12%] right-[8%] h-[520px] w-[520px] rounded-full bg-teal-300/[0.07] blur-[130px] dark:bg-teal-500/[0.06]" />
                <div className="absolute inset-0 text-zinc-900 opacity-[0.035] dark:text-zinc-100 dark:opacity-[0.05] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:46px_46px]" />
            </div>

            <LightNavbar />

            {/* CONTENEDOR STICKY: hero + simulacro + orientación + premium. El marquee de
                academias flota abajo y se aparca al final de esta zona (antes de "Por escala"). */}
            <div className="relative">

            {/* ───────────── HERO ───────────── */}
            <HeroSplit />

            {/* ───────────── SIMULACRO GRATIS (embudo de captación) ───────────── */}
            <section className="px-5 py-12 sm:py-16">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Copy + CTA */}
                        <Reveal>
                            <SectionHeading
                                kicker="Simulacro gratis"
                                title="Mídete gratis y descubre tu nota"
                                subtitle="Un simulacro real de Administrativo del Gobierno Vasco. Sin registro para empezar."
                            />
                            <ul className="mt-6 space-y-2.5">
                                {[
                                    "30 preguntas tipo examen, con penalización",
                                    "Corrección y nota al instante",
                                    "Desglose por áreas: sabes qué repasar",
                                ].map((t) => (
                                    <li key={t} className="flex items-center gap-3 text-[15px] text-zinc-700 dark:text-zinc-200">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: ACCENT }}>
                                            <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden><path d="M2 6.5 5 9l5-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </span>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/simulacro-administrativo-gobierno-vasco"
                                className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-4 text-[15px] font-bold text-white shadow-lg transition-transform hover:scale-[1.03]"
                                style={{ backgroundColor: ACCENT, boxShadow: "0 10px 25px -5px rgba(16,185,129,0.4)" }}
                            >
                                Empezar el simulacro →
                            </Link>
                        </Reveal>

                        {/* Mock del muro de resultados (difuminado) — solo en 2 columnas (oculto en móvil) */}
                        <Reveal delay={120} className="hidden lg:block">
                          <div className="relative mx-auto w-full max-w-sm">
                            <div aria-hidden className="absolute inset-3 rounded-[2.5rem] bg-emerald-400/25 blur-2xl dark:bg-emerald-500/20" />
                            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900">
                                <div>
                                    <div className="mb-4 flex justify-center">
                                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">Ejemplo de resultado</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Tu nota</div>
                                        <div className="text-6xl font-black leading-none" style={{ color: ACCENT }}>7,2</div>
                                        <span className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: ACCENT }}>APTO</span>
                                    </div>
                                    <div className="mt-6 space-y-3.5">
                                        {[
                                            { l: "Constitución y derechos", p: 78 },
                                            { l: "Procedimiento administrativo", p: 64 },
                                            { l: "Empleo público", p: 41 },
                                            { l: "Institucional vasco y UE", p: 70 },
                                        ].map((a) => (
                                            <div key={a.l}>
                                                <div className="mb-1 flex justify-between text-[12px] text-zinc-500 dark:text-zinc-400">
                                                    <span>{a.l}</span><span>{a.p}%</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                    <div className="h-full rounded-full" style={{ width: `${a.p}%`, backgroundColor: a.p >= 50 ? ACCENT : "#EF4444" }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 text-center text-[12px] text-zinc-500 dark:text-zinc-400">
                                        Corregido al momento, con tu nota y el desglose por áreas.
                                    </div>
                                </div>
                            </div>
                          </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ───────────── ORIENTACIÓN (embudo para indecisos) ───────────── */}
            <section className="border-y border-emerald-100/70 bg-gradient-to-b from-emerald-50/70 to-transparent px-5 py-12 dark:border-emerald-900/30 dark:from-emerald-950/25 sm:py-16">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Preview de las preguntas */}
                        <Reveal className="order-2 lg:order-1">
                            <div className="mx-auto w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900">
                                {[
                                    { n: "1", t: "¿Qué titulación tienes?" },
                                    { n: "2", t: "¿Qué nivel de euskera?" },
                                    { n: "3", t: "¿Qué área te interesa?" },
                                    { n: "4", t: "¿Cuánto tiempo tienes?" },
                                ].map((q) => (
                                    <div key={q.n} className="flex items-center gap-3 border-b border-zinc-100 py-3 last:border-0 dark:border-zinc-800">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white" style={{ backgroundColor: ACCENT }}>
                                            {q.n}
                                        </span>
                                        <span className="text-[14px] font-medium text-zinc-700 dark:text-zinc-200">{q.t}</span>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        {/* Copy + CTA */}
                        <Reveal className="order-1 lg:order-2">
                            <SectionHeading
                                kicker="¿Indeciso?"
                                title="¿No sabes qué oposición elegir?"
                                subtitle="Responde 4 preguntas y te decimos cuál encaja contigo. Gratis."
                            />
                            <Link
                                href="/herramientas/que-oposicion-elegir"
                                className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-4 text-[15px] font-bold text-white shadow-lg transition-transform hover:scale-[1.03]"
                                style={{ backgroundColor: ACCENT, boxShadow: "0 10px 25px -5px rgba(16,185,129,0.4)" }}
                            >
                                Descúbrelo gratis →
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ───────────── TESTS MÁS POPULARES (prueba social · conteo real) ───────────── */}
            <TestsPopulares />

            {/* ───────────── PREMIUM / COMUNIDAD (oculta la venta a quien ya es premium) ───────────── */}
            <PremiumSection />
            </div>
            {/* fin contenedor sticky */}

            {/* ───────────── CONVOCATORIAS (seguimiento + alertas) — cuaderno 1/2 ───────────── */}
            <section className="relative overflow-hidden border-t border-zinc-100 dark:border-zinc-800/70 px-5 py-12 sm:py-16">
                <NotebookBg />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                            <Reveal>
                                <SectionHeading
                                    kicker="Convocatorias"
                                    title="Sigue tu convocatoria de cerca"
                                    subtitle="Plazas, fechas y enlaces oficiales. Te avisamos el día que salga en el BOPV."
                                />
                                <Link
                                    href="/convocatorias"
                                    className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold text-white transition-transform hover:scale-[1.03]"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    Ver convocatorias →
                                </Link>
                            </Reveal>
                            <Reveal delay={120}>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { o: "Gobierno Vasco", d: "Administrativo, Técnico, Personal de Apoyo" },
                                        { o: "Osakidetza", d: "Categorías sanitarias" },
                                        { o: "Ertzaintza y ayuntamientos", d: "Seguridad y administración local" },
                                    ].map((c) => (
                                        <div key={c.o} className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
                                            <div>
                                                <div className="text-[14px] font-bold text-zinc-950 dark:text-zinc-50">{c.o}</div>
                                                <div className="text-[12px] text-zinc-500 dark:text-zinc-400">{c.d}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                        <Reveal delay={200}>
                            <SuscripcionConvocatorias />
                        </Reveal>
                    </div>
            </section>

            {/* ───────────── POR ESCALA — cuaderno 2/2 ───────────── */}
            <section className="relative overflow-hidden border-b border-zinc-100 dark:border-zinc-800/70 px-5 py-12 sm:py-16">
                <NotebookBg fade />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <Reveal>
                        <SectionHeading
                            kicker="Temario"
                            title="Elige tu escala"
                            subtitle="Temario completo de cada escala: común y específico."
                        />
                    </Reveal>
                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {ESCALAS.map((e, i) => (
                            <Reveal key={e.href} delay={i * 70}>
                                <Link href={e.href} className="group flex items-center justify-between rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/5">
                                    <div>
                                        <div className="text-lg font-bold text-zinc-950 dark:text-zinc-50">{e.label}</div>
                                        <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">Oposiciones de Euskadi · Grupo {e.grupo}</div>
                                    </div>
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10" style={{ color: ACCENT }}>→</span>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────────── OPINIONES (carrusel manual con flechas) ───────────── */}
            <section className="border-y border-zinc-100 bg-zinc-50/60 py-12 dark:border-zinc-800/70 dark:bg-zinc-900/40 sm:py-16">
                <div className="mx-auto max-w-5xl px-5">
                    <Reveal>
                        <Testimonios items={TESTIMONIOS} />
                    </Reveal>
                </div>
            </section>

            {/* ───────────── CTA final (adaptado a la sesión: invitado / gratis / premium) ───────────── */}
            <FinalCTA />

            {/* ───────────── FOOTER ───────────── */}
            <SiteFooter />

            <QueOposicionNudge />
            <BackToTop />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: "es", description: SITE_DESCRIPTION },
                        {
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: SITE_NAME,
                            url: SITE_URL,
                            logo: `${SITE_URL}/icon.png`,
                            description: "Tests, temario, convocatorias y herramientas para preparar las oposiciones de Euskadi.",
                            sameAs: [SOCIAL.instagram, SOCIAL.tiktok, SOCIAL.twitter],
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "SiteNavigationElement",
                            name: ["Tests", "Temario", "Convocatorias", "Herramientas", "Profesores"],
                            url: [
                                `${SITE_URL}/`,
                                `${SITE_URL}/temario`,
                                `${SITE_URL}/convocatorias`,
                                `${SITE_URL}/herramientas`,
                                `${SITE_URL}/profesores`,
                            ],
                        },
                    ]),
                }}
            />
        </div>
    )
}
