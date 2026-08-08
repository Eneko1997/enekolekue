import Link from "next/link"
import type { Metadata } from "next"

const ACCENT = "#10B981"

export const metadata: Metadata = {
    title: "Página no encontrada — Gainditu",
    robots: { index: false, follow: true },
}

const ENLACES = [
    { label: "Tests por escala", href: "/" },
    { label: "Temario", href: "/temario" },
    { label: "Convocatorias", href: "/convocatorias" },
    { label: "Herramientas", href: "/herramientas" },
]

export default function NotFound() {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center bg-white dark:bg-zinc-950 px-5 py-20 text-center text-zinc-950 dark:text-zinc-50">
            <Link href="/" className="mb-8 text-xl font-extrabold tracking-tight">
                gain<span style={{ color: ACCENT }}>ditu</span>.
            </Link>

            <div className="text-6xl font-extrabold tracking-tight" style={{ color: ACCENT }}>
                404
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight">
                Esta página no existe
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                El enlace está roto o la página se ha movido. Vuelve al inicio o sigue preparando tu
                oposición desde aquí.
            </p>

            <Link
                href="/"
                className="mt-7 inline-flex rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03]"
                style={{ background: ACCENT }}
            >
                Volver al inicio →
            </Link>

            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                {ENLACES.map((e) => (
                    <Link
                        key={e.href}
                        href={e.href}
                        className="hover:text-zinc-950 dark:hover:text-white hover:underline"
                    >
                        {e.label}
                    </Link>
                ))}
            </div>
        </main>
    )
}
