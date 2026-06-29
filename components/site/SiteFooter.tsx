import Link from "next/link"
import { SITE_NAME } from "@/lib/site"

const ACCENT = "#10B981"

const LINKS: [string, string][] = [
    ["Personal de Apoyo", "/oposiciones/personal-de-apoyo"],
    ["Administrativo", "/oposiciones/administrativo"],
    ["Técnico de Gestión", "/oposiciones/tecnico-gestion"],
    ["Técnico Superior", "/oposiciones/tecnico-superior"],
    ["Constitución", "/constitucion"],
    ["Ley 39/2015", "/ley-39-2015"],
    ["Fechas OPE", "/fechas-opes"],
    ["Aviso legal", "/aviso-legal"],
    ["Privacidad", "/privacidad"],
]

export default function SiteFooter() {
    return (
        <footer className="border-t border-zinc-200 bg-white px-5 py-12">
            <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 sm:flex-row">
                <div>
                    <div className="text-xl font-extrabold tracking-tight text-zinc-950">
                        gain<span style={{ color: ACCENT }}>ditu</span>.
                    </div>
                    <p className="mt-2 max-w-xs text-[13px] text-zinc-500">
                        Tests por temario oficial del IVAP para la OPE del Gobierno
                        Vasco 2026.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[14px] sm:grid-cols-3">
                    {LINKS.map(([l, h]) => (
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
                © {new Date().getFullYear()} {SITE_NAME}. No oficial; sin relación con
                el IVAP ni el Gobierno Vasco.
            </div>
        </footer>
    )
}
