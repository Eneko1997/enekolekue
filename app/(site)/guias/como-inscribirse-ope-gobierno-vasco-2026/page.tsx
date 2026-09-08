import type { Metadata } from "next"
import Link from "next/link"
import LeccionHero from "@/components/lecciones/LeccionHero"
import FaqLeccion from "@/components/lecciones/FaqLeccion"
import LeccionCTA from "@/components/lecciones/LeccionCTA"
import { SITE_URL } from "@/lib/site"

const ACCENT = "#10B981"
const RUTA = "/guias/como-inscribirse-ope-gobierno-vasco-2026"

export const metadata: Metadata = {
    title: "Cómo inscribirse en la OPE del Gobierno Vasco 2026",
    description:
        "Guía paso a paso para inscribirte en la OPE del Gobierno Vasco 2026 (Administrativo y Personal de Apoyo): requisitos, plazo, tasas, perfil lingüístico y solicitud telemática.",
    keywords: [
        "cómo inscribirse OPE Gobierno Vasco",
        "inscripción OPE Gobierno Vasco 2026",
        "solicitud oposiciones Gobierno Vasco",
        "OPE Euskadi 2026 inscripción",
        "tasa oposiciones Gobierno Vasco",
    ],
    alternates: { canonical: RUTA },
}

// Pasos de la inscripción (también alimentan el schema HowTo → resultados enriquecidos en Google).
const PASOS: { titulo: string; texto: string }[] = [
    {
        titulo: "Localiza la convocatoria y lee las bases",
        texto:
            "Cada plaza tiene su convocatoria publicada en el BOPV (Boletín Oficial del País Vasco). Ahí están los requisitos, el temario, el baremo y el enlace de solicitud. Empieza siempre por leer las bases de tu escala.",
    },
    {
        titulo: "Comprueba que cumples los requisitos",
        texto:
            "Nacionalidad, edad, no estar inhabilitado y la titulación exigida por tu escala. Para Administrativo se pide Bachiller o Técnico de FP; para Personal de Apoyo no se exige titulación. Comprueba también el perfil lingüístico de euskera que pide o valora la plaza.",
    },
    {
        titulo: "Reúne la documentación",
        texto:
            "Documento de identidad, el título académico (si tu escala lo exige) y la acreditación del perfil lingüístico de euskera si lo tienes, ya que suele puntuar como mérito. Ten a mano un medio de identificación electrónica para la sede.",
    },
    {
        titulo: "Rellena la solicitud telemática",
        texto:
            "La solicitud se presenta de forma telemática en la sede electrónica de la Administración (euskadi.eus), siguiendo el enlace concreto que indica la propia convocatoria. Revisa que la escala, el turno (libre, promoción interna o reserva por discapacidad) y tus datos son correctos.",
    },
    {
        titulo: "Paga la tasa (o justifica la exención)",
        texto:
            "La convocatoria 2026 fija una tasa de 20,68 € para Administrativo y de 8,18 € para Personal de Apoyo. Hay exenciones y bonificaciones (por ejemplo, para personas en desempleo o con discapacidad); revisa si te aplican antes de pagar.",
    },
    {
        titulo: "Presenta dentro de plazo y guarda el resguardo",
        texto:
            "Envía la solicitud antes de que termine el plazo y descarga el justificante. En la OPE 2026 el plazo fue del 20 de agosto al 16 de septiembre de 2026. Ese resguardo es tu prueba de haberte inscrito: guárdalo.",
    },
    {
        titulo: "Revisa las listas de admitidos",
        texto:
            "Cuando termine el plazo se publican las listas provisionales de personas admitidas y excluidas. Si apareces como excluido por un error subsanable, tendrás un plazo para corregirlo. Consúltalas para asegurarte de que tu solicitud entró bien.",
    },
]

const FAQS: { q: string; a: string }[] = [
    {
        q: "¿Dónde se presenta la solicitud de la OPE del Gobierno Vasco?",
        a: "De forma telemática, en la sede electrónica de la Administración (euskadi.eus), a través del enlace de solicitud que publica cada convocatoria en el BOPV. Conviene tener un medio de identificación electrónica preparado.",
    },
    {
        q: "¿Cuánto cuesta la tasa de inscripción?",
        a: "En la OPE 2026, 20,68 € para la escala Administrativa y 8,18 € para Personal de Apoyo. Existen exenciones y bonificaciones (desempleo, discapacidad, familia numerosa…), así que revisa las bases por si te corresponde alguna.",
    },
    {
        q: "¿Qué titulación necesito?",
        a: "Para Administrativo se exige el título de Bachiller o Técnico de Formación Profesional (o equivalente). Para Personal de Apoyo no se exige titulación académica. Cada convocatoria detalla la titulación válida en sus requisitos.",
    },
    {
        q: "¿Es obligatorio el euskera?",
        a: "Depende de la plaza. El perfil lingüístico (PL1 a PL4) puede ser preceptivo o valorarse como mérito. En Administrativo se manejan perfiles PL2, PL3 y PL4, y en Personal de Apoyo PL1 y PL2. Acreditarlo suele sumar puntos en la fase de concurso.",
    },
    {
        q: "¿Cómo funciona el concurso-oposición?",
        a: "Hay una fase de oposición (los exámenes) y una fase de concurso, en la que se valoran méritos como la experiencia, las titulaciones y el euskera. Puedes estimar tu puntuación de concurso con nuestra calculadora de méritos.",
    },
    {
        q: "¿Qué pasa si me equivoco o falta un documento?",
        a: "Si apareces como excluido por un defecto subsanable, la Administración abre un plazo para corregirlo. Por eso es importante revisar las listas provisionales de admitidos y guardar el resguardo de tu solicitud.",
    },
]

export default function GuiaInscripcionGVPage() {
    return (
        <main className="flex flex-1 flex-col">
            <LeccionHero
                eyebrow="Guía · Gobierno Vasco"
                title="Cómo inscribirse en la OPE del Gobierno Vasco 2026"
                subtitle="Paso a paso para presentar tu solicitud: requisitos, plazo, tasas, perfil lingüístico y la solicitud telemática, sin perderte."
                accent={ACCENT}
                ctaHref="#pasos"
                ctaLabel="Ver los pasos →"
                breadcrumb={{ href: "/guias", label: "← Guías" }}
            />

            <div className="mx-auto w-full max-w-3xl px-5 py-10">
                <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Inscribirse en una oposición del Gobierno Vasco es sencillo si sigues el orden
                    correcto. Esta guía resume los pasos de la OPE 2026 (escalas Administrativa y de
                    Personal de Apoyo). Los datos son orientativos: <strong>verifica siempre el plazo y
                    el enlace de solicitud en la convocatoria oficial</strong> de tu escala.
                </p>

                {/* Enlaces a las fichas oficiales */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Link
                        href="/convocatorias/ope-gobierno-vasco-administrativo-2026"
                        className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 transition-colors hover:border-emerald-400"
                    >
                        <div className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">Administrativo/a · 305 plazas</div>
                        <div className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400">Ver la convocatoria y sus enlaces oficiales →</div>
                    </Link>
                    <Link
                        href="/convocatorias/ope-gobierno-vasco-personal-apoyo-2026"
                        className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 transition-colors hover:border-emerald-400"
                    >
                        <div className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">Personal de Apoyo · 117 plazas</div>
                        <div className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400">Ver la convocatoria y sus enlaces oficiales →</div>
                    </Link>
                </div>

                {/* Pasos */}
                <section id="pasos" className="mt-12 scroll-mt-20">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Los pasos para inscribirte</h2>
                    <ol className="mt-5 space-y-4">
                        {PASOS.map((p, i) => (
                            <li key={i} className="flex gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                                <div
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-white"
                                    style={{ background: ACCENT }}
                                >
                                    {i + 1}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">{p.titulo}</div>
                                    <p className="mt-1 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">{p.texto}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Datos clave */}
                <section className="mt-12">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Plazo, tasas y datos clave (OPE 2026)</h2>
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full border-collapse text-[13.5px]">
                            <thead>
                                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                                    <th className="border-b border-zinc-200 dark:border-zinc-800 py-2 pr-4 font-semibold"> </th>
                                    <th className="border-b border-zinc-200 dark:border-zinc-800 py-2 pr-4 font-semibold">Administrativo/a</th>
                                    <th className="border-b border-zinc-200 dark:border-zinc-800 py-2 font-semibold">Personal de Apoyo</th>
                                </tr>
                            </thead>
                            <tbody className="text-zinc-700 dark:text-zinc-200">
                                <tr><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2 pr-4 font-semibold">Plazas</td><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2 pr-4">305 (160 libre + 145 promoción interna)</td><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2">117 (112 general + 5 discapacidad)</td></tr>
                                <tr><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2 pr-4 font-semibold">Titulación</td><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2 pr-4">Bachiller o Técnico de FP</td><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2">Sin titulación</td></tr>
                                <tr><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2 pr-4 font-semibold">Tasa</td><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2 pr-4">20,68 €</td><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2">8,18 €</td></tr>
                                <tr><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2 pr-4 font-semibold">Perfil lingüístico</td><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2 pr-4">PL2 / PL3 / PL4</td><td className="border-b border-zinc-100 dark:border-zinc-800/60 py-2">PL1 / PL2</td></tr>
                                <tr><td className="py-2 pr-4 font-semibold">Sistema</td><td className="py-2 pr-4">Concurso-oposición</td><td className="py-2">Concurso-oposición</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-[12.5px] text-zinc-500 dark:text-zinc-400">
                        Plazo de solicitud de la OPE 2026: del 20 de agosto al 16 de septiembre de 2026 (BOPV nº 157).
                        Confírmalo siempre en la convocatoria oficial.
                    </p>
                </section>

                {/* Enlaces útiles */}
                <section className="mt-12">
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Antes de opositar, calcula y prepárate</h2>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        <Link href="/herramientas/calculadora-meritos-gobierno-vasco" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Calcula tu puntuación de méritos</Link>
                        <Link href="/simulacro-administrativo-gobierno-vasco" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Simulacro de Administrativo</Link>
                        <Link href="/convocatorias" className="hover:text-zinc-950 dark:hover:text-white hover:underline">→ Todas las convocatorias de Euskadi</Link>
                    </div>
                </section>
            </div>

            <div id="faq" className="scroll-mt-20">
                <FaqLeccion faqs={FAQS} accent={ACCENT} />
            </div>

            <LeccionCTA
                accent={ACCENT}
                href="/payment"
                titulo="Prepara la OPE del Gobierno Vasco"
                texto="Temario oficial, tests por tema, simulacros con la penalización real y exámenes oficiales explicados. Empieza gratis."
                cta="Ver cómo prepararla →"
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "HowTo",
                            name: "Cómo inscribirse en la OPE del Gobierno Vasco 2026",
                            description:
                                "Pasos para presentar la solicitud en la OPE del Gobierno Vasco 2026 (Administrativo y Personal de Apoyo).",
                            inLanguage: "es",
                            step: PASOS.map((p, i) => ({
                                "@type": "HowToStep",
                                position: i + 1,
                                name: p.titulo,
                                text: p.texto,
                            })),
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
                        {
                            "@context": "https://schema.org",
                            "@type": "Article",
                            headline: "Cómo inscribirse en la OPE del Gobierno Vasco 2026",
                            inLanguage: "es",
                            author: { "@type": "Organization", name: "Gainditu" },
                            publisher: { "@type": "Organization", name: "Gainditu" },
                            url: `${SITE_URL}${RUTA}`,
                        },
                    ]),
                }}
            />
        </main>
    )
}
