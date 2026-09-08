import Link from "next/link"
import AnimatedGlowBg from "@/components/home/AnimatedGlowBg"
import { SITE_NAME, CONTACT_EMAIL, SOCIAL } from "@/lib/site"

const ACCENT = "#10B981"

// Footer ordenado por secciones + RRSS. Se usa tanto en las páginas del grupo
// (site) como en la home, para tener un único footer consistente.

type Col = { titulo: string; links: [string, string][] }

const COLS: Col[] = [
    {
        titulo: "Oposiciones",
        links: [
            ["Personal de Apoyo", "/oposiciones/personal-de-apoyo"],
            ["Administrativo", "/oposiciones/administrativo"],
            ["Técnico de Gestión", "/oposiciones/tecnico-gestion"],
            ["Técnico Superior", "/oposiciones/tecnico-superior"],
        ],
    },
    {
        titulo: "Estudia",
        links: [
            ["Temario", "/temario"],
            ["Constitución", "/constitucion"],
            ["Ley 39/2015", "/ley-39-2015"],
        ],
    },
    {
        titulo: "Recursos",
        links: [
            ["Convocatorias", "/convocatorias"],
            ["Actualidad OPE", "/actualidad"],
            ["Herramientas", "/herramientas"],
            ["Guías", "/guias"],
            ["Profesores", "/profesores"],
        ],
    },
    {
        titulo: "Legal",
        links: [
            ["Aviso legal", "/aviso-legal"],
            ["Privacidad", "/privacidad"],
            ["Cookies", "/cookies"],
        ],
    },
]

const ICON = "h-[18px] w-[18px]"

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
        </svg>
    )
}

function TikTokIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={ICON} aria-hidden>
            <path d="M16.5 3c.3 2 1.5 3.5 3.5 3.9v2.5c-1.3 0-2.5-.4-3.5-1v5.7a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.6a3 3 0 1 0 2.1 2.9V3h2.6Z" />
        </svg>
    )
}

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={ICON} aria-hidden>
            <path d="M17.5 3h3l-6.6 7.6L21.7 21h-5.9l-4.6-6-5.3 6H3l7-8-6.8-9h6l4.1 5.5L17.5 3Zm-1 16h1.6L7.6 4.7H5.9L16.5 19Z" />
        </svg>
    )
}

function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={ICON} aria-hidden>
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C20.7 8.75 22 10.9 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2.02-3.3-2.02 0-2.33 1.57-2.33 3.2V21H9V9Z" />
        </svg>
    )
}

const RRSS: [string, string, () => React.ReactElement][] = [
    ["Instagram", SOCIAL.instagram, InstagramIcon],
    ["TikTok", SOCIAL.tiktok, TikTokIcon],
    ["X (Twitter)", SOCIAL.twitter, XIcon],
    ["LinkedIn", SOCIAL.linkedin, LinkedInIcon],
]

export default function SiteFooter() {
    return (
        <footer className="relative overflow-hidden border-t border-white/10 bg-[#0B0C10] px-5 py-14">
            <AnimatedGlowBg />
            <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
                {/* Marca + tagline + RRSS */}
                <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                    <div className="text-xl font-extrabold tracking-tight text-white">
                        gain<span style={{ color: ACCENT }}>ditu</span>.
                    </div>
                    <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-zinc-400">
                        El portal de las oposiciones de Euskadi: tests,
                        convocatorias, temario y herramientas.
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                        {RRSS.map(([label, href, Icon]) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
                            >
                                <Icon />
                            </a>
                        ))}
                    </div>
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="mt-5 inline-block text-[13px] text-zinc-400 transition-colors hover:text-white"
                    >
                        {CONTACT_EMAIL}
                    </a>
                </div>

                {/* Columnas de enlaces */}
                {COLS.map((col) => (
                    <div key={col.titulo}>
                        <div className="text-[12px] font-bold uppercase tracking-wider text-zinc-500">
                            {col.titulo}
                        </div>
                        <ul className="mt-3 space-y-2">
                            {col.links.map(([l, h]) => (
                                <li key={h}>
                                    <Link
                                        href={h}
                                        className="text-[14px] text-zinc-400 transition-colors hover:text-white"
                                    >
                                        {l}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="relative z-10 mx-auto mt-12 flex max-w-5xl flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                    © {new Date().getFullYear()} {SITE_NAME}. No oficial; sin relación con
                    las administraciones convocantes.
                </span>
                <Link
                    href="/para-academias"
                    className="shrink-0 text-zinc-400 transition-colors hover:text-white"
                >
                    Para academias · anúnciate
                </Link>
            </div>
        </footer>
    )
}
