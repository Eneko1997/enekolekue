"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "@/lib/supabase/use-session"
import { createClient } from "@/lib/supabase/client"
import { BRAND_ACCENT } from "@/lib/theme"
import AccountMenu from "@/components/site/AccountMenu"

const NAV_LINKS = [
    { label: "Ley 39/2015", href: "/ley-39-2015" },
    { label: "Constitución", href: "/constitucion" },
    { label: "Fechas OPE", href: "/fechas-opes" },
]

const CUENTA_ITEMS = [
    { label: "Mi progreso", href: "/perfil?tab=stats" },
    { label: "Mis exámenes", href: "/perfil?tab=examenes" },
    { label: "Mi historial", href: "/perfil?tab=historial" },
    { label: "Ajustes", href: "/perfil?tab=ajustes" },
]

export default function Navbar() {
    const { user, loading } = useSession()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    async function handleSignOut() {
        const supabase = createClient()
        await supabase.auth.signOut()
        setOpen(false)
        router.push("/")
        router.refresh()
    }

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
                        <AccountMenu user={user} />
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
                            {!loading && user ? (
                                <div className="mt-2 border-t border-white/10 pt-2">
                                    <div className="truncate px-3 pb-1 text-[12px] text-white/45">
                                        {user.email}
                                    </div>
                                    {CUENTA_ITEMS.map((it) => (
                                        <Link
                                            key={it.href}
                                            href={it.href}
                                            onClick={() => setOpen(false)}
                                            className="block rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
                                        >
                                            {it.label}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-400 hover:bg-white/5"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-2 flex gap-2">
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
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
