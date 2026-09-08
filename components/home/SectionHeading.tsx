import type { ReactNode } from "react"

const ACCENT = "#10B981"

/**
 * Cabecera de sección unificada de la home (fuente única de verdad).
 * Aplica la misma jerarquía, eyebrow, ritmo vertical y alineación en todas
 * las secciones para que los títulos queden alineados entre sí.
 *
 * Convención:
 *  - eyebrow: píldora con borde en color de acento (uppercase, bold, xs)
 *  - título:  text-3xl → sm:text-4xl, extrabold, tracking-tight
 *  - ritmo:   eyebrow → título = mt-4 · título → subtítulo = mt-4
 *  - alineación: izquierda por defecto (mismo eje que el resto de la home)
 */
export default function SectionHeading({
    kicker,
    title,
    subtitle,
    align = "left",
    className = "",
}: {
    kicker?: ReactNode
    title: ReactNode
    subtitle?: ReactNode
    align?: "left" | "center"
    className?: string
}) {
    const center = align === "center"
    return (
        <div className={`${center ? "text-center" : ""} ${className}`}>
            {kicker ? (
                <span
                    className="inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide"
                    style={{ color: ACCENT, borderColor: `${ACCENT}55` }}
                >
                    {kicker}
                </span>
            ) : null}
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                {title}
            </h2>
            {subtitle ? (
                <p
                    className={`mt-4 text-zinc-500 dark:text-zinc-400 ${
                        center ? "mx-auto max-w-xl" : "max-w-md"
                    }`}
                >
                    {subtitle}
                </p>
            ) : null}
        </div>
    )
}
