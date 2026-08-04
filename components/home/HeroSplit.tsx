"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, GraduationCap } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { useEffect, useState } from "react"

// Hero a dos columnas: izquierda con eyebrow + titular + subtítulo + CTA + prueba
// social; derecha la foto de la opositora con tarjetas de stats flotantes.
// El fondo de la sección (#EAEFF5) coincide con el fondo del recorte de la imagen
// para que la chica se integre sin caja visible. La sección se mantiene siempre
// en claro (la foto lleva fondo claro horneado), con texto oscuro en ambos temas.
//
// Animación (framer-motion): entrada escalonada de la columna izquierda, las dos
// tarjetas de stats entran y luego flotan en bucle, y los porcentajes suben desde
// 0. Todo se desactiva con prefers-reduced-motion. Pensado para verse "vivo" al
// grabar la web para un reel.

const ACCENT = "#10B981"

// Retratos de stock (Pexels, licencia libre: uso comercial, sin atribución).
const AVATARS = [
    "/avatars/1.jpg",
    "/avatars/2.jpg",
    "/avatars/3.jpg",
    "/avatars/4.jpg",
]

function UpArrow() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden fill="none">
            <path d="M8 3.5 13 11H3z" fill={ACCENT} />
        </svg>
    )
}

// Contador que sube de 0 a `to` al montar. Respeta reduced-motion.
function Counter({ to, delay = 0 }: { to: number; delay?: number }) {
    const reduce = useReducedMotion()
    const [v, setV] = useState(reduce ? to : 0)

    useEffect(() => {
        if (reduce) {
            setV(to)
            return
        }
        let raf = 0
        const dur = 1100
        let start = 0
        const tick = (now: number) => {
            if (!start) start = now
            const p = Math.min(1, (now - start) / dur)
            const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
            setV(Math.round(eased * to))
            if (p < 1) raf = requestAnimationFrame(tick)
        }
        const t = setTimeout(() => {
            raf = requestAnimationFrame(tick)
        }, delay)
        return () => {
            clearTimeout(t)
            cancelAnimationFrame(raf)
        }
    }, [to, delay, reduce])

    return <>{v}</>
}

// Entrada escalonada de la columna izquierda.
const stackVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
}
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function HeroSplit() {
    const reduce = useReducedMotion()

    // Bucle de flotación de las tarjetas (se anula con reduced-motion).
    const float = (dy: number, rot: [number, number]) =>
        reduce
            ? undefined
            : {
                  y: [0, dy, 0],
                  rotate: [rot[0], rot[1], rot[0]],
              }
    const floatT = (dur: number) => ({
        duration: dur,
        repeat: Infinity,
        ease: "easeInOut" as const,
    })

    return (
        <section className="relative overflow-hidden bg-[#EAEFF5]">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 pb-14 pt-8 sm:gap-10 sm:py-14 lg:grid-cols-2 lg:gap-6 lg:py-20">
                {/* ── Columna izquierda ── */}
                <motion.div
                    className="relative z-10 order-1 lg:order-1"
                    variants={stackVariants}
                    initial="hidden"
                    animate="show"
                >
                    <motion.span
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-zinc-600 shadow-sm ring-1 ring-black/[0.04]"
                    >
                        <GraduationCap size={15} className="text-emerald-500" aria-hidden />
                        Oposiciones · País Vasco
                    </motion.span>

                    <motion.h1
                        variants={itemVariants}
                        className="mt-6 text-[2.9rem] font-extrabold leading-[0.98] tracking-tight text-zinc-950 sm:text-6xl lg:text-[4.1rem]"
                    >
                        Aprueba tu oposición
                        <br />
                        en el País Vasco.
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="mt-6 max-w-md text-base leading-relaxed text-zinc-500 sm:text-lg"
                    >
                        Tests, simulacros y seguimiento de tu progreso para
                        preparar tu oposición en Euskadi, todo en un mismo sitio.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-5"
                    >
                        <Link
                            href="/signup"
                            aria-label="Crear cuenta gratis en Gainditu"
                            className="group inline-flex items-center gap-3 rounded-full bg-zinc-950 py-2 pl-2 pr-6 text-[15px] font-semibold text-white shadow-lg shadow-zinc-900/15 transition-transform hover:scale-[1.03]"
                        >
                            <span
                                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-950 transition-transform group-hover:translate-x-0.5"
                                style={{ backgroundColor: ACCENT }}
                            >
                                <ArrowRight size={18} className="text-white" aria-hidden />
                            </span>
                            Empieza gratis
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2.5">
                                {AVATARS.map((src, i) => (
                                    <motion.img
                                        key={src}
                                        src={src}
                                        alt=""
                                        aria-hidden
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 rounded-full object-cover ring-2 ring-[#EAEFF5]"
                                        initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.75 + i * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                ))}
                            </div>
                            <span className="text-[13px] font-medium leading-tight text-zinc-500">
                                +500 opositores ya
                                <br />
                                preparan su examen aquí
                            </span>
                        </div>
                    </motion.div>

                    {/* Stats compactas SOLO en móvil (en escritorio se ven las
                        tarjetas flotantes de la columna derecha). Pensado para que
                        una grabación vertical del hero tenga también ese "motion". */}
                    <motion.div variants={itemVariants} className="mt-9 grid grid-cols-2 gap-3 lg:hidden">
                        <motion.div
                            className="rounded-2xl bg-white p-4 shadow-lg shadow-zinc-900/10 ring-1 ring-black/[0.04]"
                            style={{ rotate: -2 }}
                            animate={float(-7, [-2, -3.4])}
                            transition={floatT(5.4)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] font-bold text-zinc-800">Aciertos</span>
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">+6%</span>
                            </div>
                            <div className="mt-2 flex items-end justify-between">
                                <div className="text-[26px] font-extrabold leading-none tracking-tight text-zinc-950">
                                    <Counter to={96} delay={650} />
                                    <span className="ml-0.5 text-[15px] font-bold text-zinc-400">%</span>
                                </div>
                                <UpArrow />
                            </div>
                        </motion.div>

                        <motion.div
                            className="rounded-2xl bg-white p-4 shadow-lg shadow-zinc-900/10 ring-1 ring-black/[0.04]"
                            style={{ rotate: 2 }}
                            animate={float(7, [2, 3.4])}
                            transition={floatT(6.2)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] font-bold text-zinc-800">Progreso</span>
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">+12%</span>
                            </div>
                            <div className="mt-2 flex items-end justify-between">
                                <div className="text-[26px] font-extrabold leading-none tracking-tight text-zinc-950">
                                    <Counter to={82} delay={800} />
                                    <span className="ml-0.5 text-[15px] font-bold text-zinc-400">%</span>
                                </div>
                                <UpArrow />
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* ── Columna derecha: foto + tarjetas (oculta en móvil) ── */}
                <div className="relative order-2 hidden lg:order-2 lg:block">
                    <motion.div
                        className="relative mx-auto aspect-[3/4] w-full max-w-[15rem] sm:max-w-sm lg:max-w-md"
                        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Image
                            src="/hero-chica.avif"
                            alt="Opositora preparando su oposición en el País Vasco con Gainditu"
                            fill
                            priority
                            sizes="(max-width: 1024px) 90vw, 45vw"
                            className="object-contain object-bottom"
                        />

                        {/* Tarjeta stat 1 (arriba-dcha) — entra y flota */}
                        <motion.div
                            className="absolute -right-2 top-3 w-[150px] sm:-right-6 sm:top-6 sm:w-[188px]"
                            initial={reduce ? false : { opacity: 0, y: -18, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <motion.div
                                className="rounded-2xl bg-white p-3 shadow-xl shadow-zinc-900/10 ring-1 ring-black/[0.04] sm:p-4"
                                style={{ rotate: 3 }}
                                animate={float(-9, [3, 4.6])}
                                transition={floatT(5.4)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold text-zinc-800">Aciertos</span>
                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">+6%</span>
                                </div>
                                <div className="mt-3 grid grid-cols-3 gap-1.5">
                                    {[
                                        { n: "1", d: "Lun", on: true },
                                        { n: "2", d: "Mar", on: false },
                                        { n: "3", d: "Mié", on: false },
                                    ].map((c) => (
                                        <div
                                            key={c.d}
                                            className={`rounded-lg px-2 py-1.5 text-center ${c.on ? "bg-zinc-100" : ""}`}
                                        >
                                            <div className="text-[13px] font-bold text-zinc-800">{c.n}</div>
                                            <div className="text-[9px] font-medium text-zinc-400">{c.d}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex items-end justify-between">
                                    <div className="text-[22px] font-extrabold leading-none tracking-tight text-zinc-950 sm:text-[26px]">
                                        <Counter to={96} delay={650} />
                                        <span className="ml-0.5 text-[13px] font-bold text-zinc-400 sm:text-[15px]">%</span>
                                    </div>
                                    <UpArrow />
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Tarjeta stat 2 (abajo-izda) — entra y flota */}
                        <motion.div
                            className="absolute -left-2 bottom-5 w-[140px] sm:-left-6 sm:bottom-8 sm:w-[176px]"
                            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <motion.div
                                className="rounded-2xl bg-white p-3 shadow-xl shadow-zinc-900/10 ring-1 ring-black/[0.04] sm:p-4"
                                style={{ rotate: -4 }}
                                animate={float(8, [-4, -5.6])}
                                transition={floatT(6.2)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold text-zinc-800">Progreso</span>
                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">+12%</span>
                                </div>
                                <div className="mt-0.5 text-[11px] font-medium text-zinc-400">Bloque común</div>
                                <div className="mt-3 flex items-end justify-between">
                                    <div className="text-[22px] font-extrabold leading-none tracking-tight text-zinc-950 sm:text-[26px]">
                                        <Counter to={82} delay={800} />
                                        <span className="ml-0.5 text-[13px] font-bold text-zinc-400 sm:text-[15px]">%</span>
                                    </div>
                                    <UpArrow />
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
