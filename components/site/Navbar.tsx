"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "@/lib/supabase/use-session"
import { BRAND_ACCENT } from "@/lib/theme"

const NAV_LINKS = [
    { label: "Tests", href: "/dashboard" },
    { label: "Ley 39/2015", href: "/ley-39-2015" },
    { label: "Constitución", href: "/constitucion" },
    { label: "Fechas OPE", href: "/fechas-opes" },
]

export default function Navbar() {
    const { user, loading } = useSession()
    const [open, setOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(10,10,12,0.9)] backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5">
                <Link
                    href="/"
                    className="shrink-0 text-xl font-extrabold tracking-tight text-white"
                    onClick={() => setOpen(false)}
                >
                    gain<span style={{ color: BRAND_ACCENT }}>ditu</span>.
                </Link>

                {/* Links escritorio */}
                <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
                    {NAV_LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* CTA escritorio */}
                <div className="hidden shrink-0 items-center gap-2 md:flex">
                    {!loading && user ? (
                        <Link
                            href="/dashboard"
                            className="rounded-lg bg-white px-4 py-1.5 text-[13px] font-bold text-[#0A0A0C] transition-opacity hover:opacity-90"
                        >
                            Mi panel
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white/80 hover:text-white"
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-lg px-4 py-1.5 text-[13px] font-bold text-white"
                                style={{ backgroundColor: BRAND_ACCENT }}
                            >
                                Empezar gratis
                            </Link>
                        </>
                    )}
                </div>

                {/* Botón móvil */}
                <button
                    aria-label="Abrir menú"
                    onClick={() => setOpen((v) => !v)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white md:hidden"
                >
                    <div className="flex flex-col gap-[5px]">
                        <span className="block h-0.5 w-4 rounded bg-current" />
                        <span className="block h-0.5 w-4 rounded bg-current" />
                        <span className="block h-0.5 w-4 rounded bg-current" />
                    </div>
                </button>
            </div>

            {/* Menú móvil */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-white/10 md:hidden"
                    >
                        <div className="flex flex-col gap-1 px-5 py-3">
                            {NAV_LINKS.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
                                >
                                    {l.label}
                                </Link>
                            ))}
                            <div className="mt-2 flex gap-2">
                                {!loading && user ? (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setOpen(false)}
                                        className="flex-1 rounded-lg bg-white px-4 py-2 text-center text-sm font-bold text-[#0A0A0C]"
                                    >
                                        Mi panel
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setOpen(false)}
                                            className="flex-1 rounded-lg border border-white/15 px-4 py-2 text-center text-sm font-semibold text-white"
                                        >
                                            Entrar
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setOpen(false)}
                                            className="flex-1 rounded-lg px-4 py-2 text-center text-sm font-bold text-white"
                                            style={{ backgroundColor: BRAND_ACCENT }}
                                        >
                                            Empezar gratis
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
