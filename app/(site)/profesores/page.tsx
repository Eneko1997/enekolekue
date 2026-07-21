import Link from "next/link"
import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Profesores particulares — OPE Gobierno Vasco 2026",
    description:
        "Profesores particulares especializados en la OPE del Gobierno Vasco (IVAP): clases de derecho administrativo, Constitución, euskera y más. ¿Eres profe? Anúnciate en Gainditu.",
    alternates: { canonical: "/profesores" },
}

const ACCENT = "#10B981"
const CONTACTO = "mailto:gaindituoposiciones@gmail.com?subject=Quiero%20anunciarme%20como%20profesor"

const PROFES = [
    { n: "Ane M.", mat: "Derecho administrativo · Ley 39/2015 y 40/2015", zona: "Bilbao · online", ini: "A" },
    { n: "Gorka L.", mat: "Constitución y organización del Estado y de Euskadi", zona: "Vitoria-Gasteiz · presencial", ini: "G" },
    { n: "Leire S.", mat: "Euskera para oposiciones · perfil lingüístico (IVAP/HABE)", zona: "Donostia · online", ini: "L" },
    { n: "Mikel A.", mat: "Empleo público vasco y régimen jurídico", zona: "Online", ini: "M" },
]

export default function ProfesoresPage() {
    return (
        <main className="flex flex-1 flex-col">
            {/* HERO */}
            <section className="relative isolate overflow-hidden px-5 pb-12 pt-16 sm:pt-20">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[380px]"
                    style={{
                        background: `radial-gradient(38% 60% at 20% 10%, ${ACCENT}40, transparent 70%), radial-gradient(34% 50% at 85% 0%, rgba(20,184,166,0.28), transparent 72%)`,
                        filter: "blur(50px)",
                    }}
                />
                <div className="relative z-10 mx-auto max-w-4xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                        Clases particulares · País Vasco
                    </span>
                    <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-6xl">
                        Profesores particulares
                        <br />
                        para tu oposición
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Refuerza los bloques que más te cuestan con profesores especializados en el temario del IVAP. Y si eres profe, anúnciate y llega a nuevos alumnos.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a href={CONTACTO} className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 px-7 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03] sm:w-auto">
                            Anúnciate como profesor
                        </a>
                        <Link href="/" className="inline-flex w-full items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-7 py-3.5 text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60 sm:w-auto">
                            Practicar tests
                        </Link>
                    </div>
                </div>
            </section>

            {/* LISTADO (ejemplos) */}
            <section className="px-5 py-14">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">Algunos profesores</h2>
                    <p className="mt-2 text-[14px] text-zinc-400 dark:text-zinc-500">
                        Fichas de ejemplo. El directorio está en marcha: escríbenos para aparecer aquí.
                    </p>
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {PROFES.map((p) => (
                            <div key={p.n} className="flex items-start gap-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white" style={{ background: `linear-gradient(145deg, #34D399, ${ACCENT})` }}>
                                    {p.ini}
                                </span>
                                <div>
                                    <div className="text-[15px] font-bold text-zinc-950 dark:text-zinc-50">{p.n}</div>
                                    <div className="text-[12px] text-zinc-400 dark:text-zinc-500">{p.zona}</div>
                                    <p className="mt-2 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">{p.mat}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOS PÚBLICOS */}
            <section className="border-t border-zinc-100 dark:border-zinc-800/70 bg-zinc-50/60 dark:bg-zinc-900/40 px-5 py-14">
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7">
                        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Si preparas la oposición</h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                            Encuentra apoyo en los bloques que más se resisten: procedimiento administrativo, organización de Euskadi, euskera… Clases online o presenciales, a tu ritmo.
                        </p>
                    </div>
                    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7">
                        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Si eres profesor</h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                            Date a conocer entre opositores del País Vasco. Nos cuentas tu perfil (materias, zona, modalidad) y te incluimos. Escríbenos y te explicamos cómo funciona.
                        </p>
                        <a href={CONTACTO} className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[14px] font-semibold text-zinc-950 dark:text-zinc-50 transition-transform hover:scale-[1.03]" style={{ backgroundColor: ACCENT }}>
                            Quiero anunciarme →
                        </a>
                    </div>
                </div>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
                            { "@type": "ListItem", position: 2, name: "Profesores", item: `${SITE_URL}/profesores` },
                        ],
                    }),
                }}
            />
        </main>
    )
}
