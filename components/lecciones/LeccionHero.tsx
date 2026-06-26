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
    accent = "#E8543A",
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
        <section className="relative overflow-hidden px-5 pb-10 pt-14">
            {/* Glow + orbe flotante */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 right-[4%] h-80 w-80 rounded-full blur-2xl"
                style={{
                    background: `radial-gradient(circle at 35% 30%, ${accent}66, ${accent}11 55%, transparent 72%)`,
                }}
            />
            <motion.div
                aria-hidden
                className="pointer-events-none absolute right-[10%] top-10 h-24 w-24 rounded-3xl border border-white/10"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(255,255,255,0.06), transparent)",
                    backdropFilter: "blur(6px)",
                }}
                animate={{ y: [0, -16, 0], rotate: [0, 6, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative mx-auto max-w-4xl">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: accent }}
                >
                    {eyebrow}
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.12 }}
                    className="mt-4 max-w-xl text-lg leading-relaxed text-white/70"
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
                            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur"
                        >
                            <div
                                className="text-xl font-extrabold leading-none text-white"
                                style={{ textShadow: `0 0 24px ${accent}40` }}
                            >
                                {s.n}
                            </div>
                            <div className="mt-1 text-[11px] uppercase tracking-wide text-white/45">
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
                        className="mt-7 inline-flex items-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                        style={{
                            backgroundColor: accent,
                            boxShadow: `0 14px 40px -12px ${accent}88`,
                        }}
                    >
                        {ctaLabel}
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
