"use client"

import { motion } from "framer-motion"

export interface Punto {
    t: string
    d: string
}

export default function PuntosExamen({
    titulo = "Lo que entra en el examen",
    puntos,
    accent = "#E8543A",
}: {
    titulo?: string
    puntos: Punto[]
    accent?: string
}) {
    return (
        <section className="px-5 py-8">
            <div className="mx-auto max-w-4xl">
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                    {titulo}
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {puntos.map((p, i) => (
                        <motion.div
                            key={p.t}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-colors hover:border-white/25 hover:bg-white/[0.06]"
                        >
                            <div
                                className="mb-3 h-1.5 w-9 rounded-full transition-all group-hover:w-14"
                                style={{ background: accent }}
                            />
                            <h3 className="text-base font-bold text-white">
                                {p.t}
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-white/55">
                                {p.d}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
