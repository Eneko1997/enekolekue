"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface Faq {
    q: string
    a: string
}

export default function FaqLeccion({
    faqs,
    accent = "#E8543A",
    titulo = "Preguntas frecuentes",
}: {
    faqs: Faq[]
    accent?: string
    titulo?: string
}) {
    const [open, setOpen] = useState<number | null>(0)

    return (
        <section className="px-5 py-8">
            <div className="mx-auto max-w-4xl">
                <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-white">
                    {titulo}
                </h2>
                <div className="space-y-3">
                    {faqs.map((f, i) => {
                        const isOpen = open === i
                        return (
                            <motion.div
                                key={f.q}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.35, delay: i * 0.04 }}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur"
                            >
                                <button
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-sm font-semibold text-white">
                                        {f.q}
                                    </span>
                                    <span
                                        className="text-lg leading-none transition-transform"
                                        style={{
                                            color: accent,
                                            transform: isOpen
                                                ? "rotate(45deg)"
                                                : "none",
                                        }}
                                    >
                                        +
                                    </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <p className="px-5 pb-4 text-sm leading-relaxed text-white/60">
                                                {f.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
