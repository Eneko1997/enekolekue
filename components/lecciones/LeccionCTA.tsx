"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function LeccionCTA({
    titulo,
    texto,
    accent = "#E8543A",
    href = "#tests",
    cta = "Empezar a practicar →",
}: {
    titulo: string
    texto: string
    accent?: string
    href?: string
    cta?: string
}) {
    return (
        <section className="px-5 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 p-8 text-center sm:p-12"
                style={{
                    background: `radial-gradient(120% 140% at 50% 0%, ${accent}26, transparent 60%), rgba(255,255,255,0.03)`,
                }}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-16 left-1/2 h-48 w-[420px] -translate-x-1/2 rounded-full blur-3xl"
                    style={{ background: `${accent}33` }}
                />
                <h2 className="relative text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {titulo}
                </h2>
                <p className="relative mx-auto mt-3 max-w-md text-sm text-white/65">
                    {texto}
                </p>
                <Link
                    href={href}
                    className="relative mt-6 inline-flex items-center rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                    style={{
                        backgroundColor: accent,
                        boxShadow: `0 14px 40px -12px ${accent}99`,
                    }}
                >
                    {cta}
                </Link>
            </motion.div>
        </section>
    )
}
