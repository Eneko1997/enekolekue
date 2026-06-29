"use client"

import { useId, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface Faq {
    q: string
    a: string
}

export default function FaqLeccion({
    faqs,
    accent = "#10B981",
    titulo = "Preguntas frecuentes",
}: {
    faqs: Faq[]
    accent?: string
    titulo?: string
}) {
    const [open, setOpen] = useState<number | null>(0)
    const baseId = useId()

    return (
        <section className="px-5 py-14">
            <div className="mx-auto max-w-3xl">
                <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl">
                    {titulo}
                </h2>
                <div className="divide-y divide-zinc-200 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
                    {faqs.map((f, i) => {
                        const isOpen = open === i
                        const btnId = `${baseId}-btn-${i}`
                        const panelId = `${baseId}-panel-${i}`
                        return (
                            <div key={f.q}>
                                <button
                                    type="button"
                                    id={btnId}
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                >
                                    <span className="text-[15px] font-semibold text-zinc-950">
                                        {f.q}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="shrink-0 text-lg leading-none transition-transform duration-200"
                                        style={{
                                            color: accent,
                                            transform: isOpen ? "rotate(45deg)" : "none",
                                        }}
                                    >
                                        +
                                    </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={btnId}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <p className="px-6 pb-5 text-[14px] leading-relaxed text-zinc-500">
                                                {f.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
