"use client"

import { motion } from "framer-motion"

export interface Punto {
    t: string
    d: string
}

export default function PuntosExamen({
    titulo = "Lo que entra en el examen",
    puntos,
    accent = "#10B981",
}: {
    titulo?: string
    puntos: Punto[]
    accent?: string
}) {
    return (
        <section className="px-5 py-14">
            <div className="mx-auto max-w-4xl">
                <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl">
                    {titulo}
                </h2>
                <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {puntos.map((p, i) => (
                        <motion.div
                            key={p.t}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                            className="group rounded-3xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/5"
                        >
                            <div
                                className="mb-4 h-1.5 w-9 rounded-full transition-all group-hover:w-14"
                                style={{ background: accent }}
                            />
                            <h3 className="text-base font-bold text-zinc-950">
                                {p.t}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                                {p.d}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
