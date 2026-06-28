import Link from "next/link"
import { BRAND_ACCENT } from "@/lib/theme"
import { CONTACT_EMAIL, SOCIAL } from "@/lib/site"

const COLS = [
    {
        title: "OPE 2026",
        links: [
            { label: "Personal de Apoyo", href: "/oposiciones/personal-de-apoyo" },
            { label: "Administrativos", href: "/oposiciones/administrativo" },
            { label: "Técnicos de Gestión", href: "/oposiciones/tecnico-gestion" },
            { label: "Técnicos Superiores", href: "/oposiciones/tecnico-superior" },
        ],
    },
    {
        title: "Recursos",
        links: [
            { label: "Ley 39/2015", href: "/ley-39-2015" },
            { label: "Constitución Española", href: "/constitucion" },
            { label: "Fechas de las OPEs", href: "/fechas-opes" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Aviso legal", href: "/aviso-legal" },
            { label: "Privacidad", href: "/privacidad" },
            { label: "Cookies", href: "/cookies" },
        ],
    },
]

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-white/10 bg-[#08090D]">
            <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-9 px-6 py-12">
                <div>
                    <div className="mb-2.5 text-[22px] font-extrabold tracking-tight text-white">
                        gain<span style={{ color: BRAND_ACCENT }}>ditu</span>.
                    </div>
                    <p className="mb-4 max-w-[220px] text-[13px] leading-relaxed text-white/55">
                        Tests por tema oficial del IVAP para la OPE del Gobierno
                        Vasco 2026.
                    </p>
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-[13px] font-semibold"
                        style={{ color: BRAND_ACCENT }}
                    >
                        {CONTACT_EMAIL}
                    </a>
                </div>

                {COLS.map((col) => (
                    <div key={col.title}>
                        <div className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-white/45">
                            {col.title}
                        </div>
                        {col.links.map((l) => (
                            <Link
                                key={l.label}
                                href={l.href}
                                className="mb-2 block text-[13px] text-white/55 transition-colors hover:text-white"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-[12px] text-white/40 sm:flex-row">
                    <span>
                        © {new Date().getFullYear()} Gainditu. Proyecto
                        independiente, no vinculado al Gobierno Vasco ni al IVAP.
                    </span>
                    <a
                        href={SOCIAL.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white"
                    >
                        Instagram
                    </a>
                </div>
            </div>
        </footer>
    )
}
