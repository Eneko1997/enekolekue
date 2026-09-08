import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"

const ACCENT = "#10B981"

export const metadata: Metadata = {
    title: "Guías de oposiciones de Euskadi",
    description:
        "Guías prácticas para opositar en Euskadi: cómo inscribirte en las OPE, el concurso-oposición, el euskera y los méritos. Paso a paso y al grano.",
    alternates: { canonical: "/guias" },
}

// Índice de guías. Al añadir una guía nueva (su propia página en /guias/<slug>),
// se añade aquí su tarjeta.
const GUIAS: { slug: string; titulo: string; resumen: string; etiqueta: string }[] = [
    {
        slug: "como-inscribirse-ope-gobierno-vasco-2026",
        titulo: "Cómo inscribirse en la OPE del Gobierno Vasco 2026",
        resumen:
            "Requisitos, plazo, tasas, perfil lingüístico y la solicitud telemática, paso a paso, para Administrativo y Personal de Apoyo.",
        etiqueta: "Gobierno Vasco",
    },
    {
        slug: "concurso-oposicion-euskadi",
        titulo: "Concurso-oposición en Euskadi: cómo funciona",
        resumen:
            "Las dos fases (oposición y concurso), qué méritos puntúan —experiencia, titulaciones y euskera— y cómo se suma la nota final.",
        etiqueta: "Sistema selectivo",
    },
    {
        slug: "turnos-de-acceso-oposiciones",
        titulo: "Turnos de acceso: libre, promoción interna y discapacidad",
        resumen:
            "Cómo se reparten las plazas por turno y a cuál te conviene presentarte para mejorar tus opciones reales.",
        etiqueta: "Acceso",
    },
    {
        slug: "fases-de-una-oposicion",
        titulo: "Las fases de una oposición, en orden",
        resumen:
            "De la convocatoria a la toma de posesión: qué ocurre en cada paso del proceso selectivo y qué tienes que hacer.",
        etiqueta: "Proceso selectivo",
    },
]

export default function GuiasIndexPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guías de Euskadi"
                title="Guías para opositar en Euskadi"
                subtitle="Lo práctico y concreto: cómo inscribirte, cómo funciona el concurso-oposición, el euskera y los méritos. Al grano."
                accent={ACCENT}
                hideCta
            />

            <section className="mx-auto w-full max-w-4xl px-5 py-10">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {GUIAS.map((g) => (
                        <Link
                            key={g.slug}
                            href={`/guias/${g.slug}`}
                            className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-900/5"
                        >
                            <span className="inline-flex w-fit items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>
                                {g.etiqueta}
                            </span>
                            <h2 className="mt-2.5 text-[17px] font-extrabold leading-snug tracking-tight text-zinc-950 dark:text-zinc-50">
                                {g.titulo}
                            </h2>
                            <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                {g.resumen}
                            </p>
                            <span className="mt-4 inline-block text-[13px] font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>
                                Leer la guía →
                            </span>
                        </Link>
                    ))}
                </div>

                <p className="mt-8 text-[13px] text-zinc-500 dark:text-zinc-400">
                    Iremos añadiendo más guías. ¿Echas en falta alguna?{" "}
                    <Link href="/convocatorias" className="font-semibold hover:underline" style={{ color: ACCENT }}>
                        Mira también las convocatorias abiertas →
                    </Link>
                </p>
            </section>
        </main>
    )
}
