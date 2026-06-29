"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export interface Stat {
    n: string
    label: string
}

export default function LeccionHero({
    eyebrow,
    title,
    subtitle,
    stats,
    accent = "#10B981",
    ctaHref = "#tests",
    ctaLabel = "Empezar a practicar →",
}: {
    eyebrow: string
    title: string
    subtitle: string
    stats: Stat[]
    accent?: string
    ctaHref?: string
    ctaLabel?: string
}) {
    return (
        <section className="relative isolate overflow-hidden px-5 pb-12 pt-16 sm:pt-20">
            {/* Baño esmeralda animado de fondo */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[420px]"
                style={{
                    background:
                        `radial-gradient(38% 60% at 20% 10%, ${accent}40, transparent 70%), radial-gradient(34% 50% at 85% 0%, rgba(20,184,166,0.30), transparent 72%)`,
                    filter: "blur(50px)",
                }}
            />

            <div className="relative z-10 mx-auto max-w-4xl">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-zinc-500"
                >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                    {eyebrow}
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="mt-5 text-4xl font-extrabold leading-[1.03] tracking-tight text-zinc-950 sm:text-6xl"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.12 }}
                    className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-500"
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.18 }}
                    className="mt-7 flex flex-wrap gap-3"
                >
                    {stats.map((s) => (
                        <div
                            key={s.label + s.n}
                            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm shadow-zinc-900/5"
                        >
                            <div className="text-xl font-extrabold leading-none text-zinc-950">
                                {s.n}
                            </div>
                            <div className="mt-1 text-[11px] uppercase tracking-wide text-zinc-400">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.24 }}
                >
                    <Link
                        href={ctaHref}
                        className="mt-7 inline-flex items-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                    >
                        {ctaLabel}
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
