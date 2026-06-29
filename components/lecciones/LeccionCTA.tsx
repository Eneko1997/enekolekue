"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function LeccionCTA({
    titulo,
    texto,
    accent = "#10B981",
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
        <section className="px-5 py-14">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-zinc-950 px-8 py-14 text-center sm:py-16"
            >
                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {titulo}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                    {texto}
                </p>
                <Link
                    href={href}
                    className="mt-7 inline-flex items-center rounded-full px-7 py-3.5 text-sm font-semibold text-zinc-950 transition-transform hover:scale-[1.03]"
                    style={{ backgroundColor: accent }}
                >
                    {cta}
                </Link>
            </motion.div>
        </section>
    )
}
