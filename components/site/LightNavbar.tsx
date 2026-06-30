"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "@/lib/supabase/use-session"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

const TESTS_LINKS = [
    { label: "Personal de Apoyo", href: "/oposiciones/personal-de-apoyo" },
    { label: "Administrativo", href: "/oposiciones/administrativo" },
    { label: "Técnico de Gestión", href: "/oposiciones/tecnico-gestion" },
    { label: "Técnico Superior", href: "/oposiciones/tecnico-superior" },
]

const NAV_LINKS = [
    { label: "Ley 39/2015", href: "/ley-39-2015" },
    { label: "Constitución", href: "/constitucion" },
    { label: "Fechas OPE", href: "/fechas-opes" },
]

const CUENTA_ITEMS = [
    { label: "Mi progreso", href: "/perfil?tab=stats" },
    { label: "Mis exámenes", href: "/perfil?tab=examenes" },
    { label: "Ajustes", href: "/perfil?tab=ajustes" },
]

function Chevron({ open }: { open: boolean }) {
    return (
        <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            style={{
                transform: open ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
            }}
        >
            <path
                d="M2.5 4.5 6 8l3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default function LightNavbar() {
    const { user, loading } = useSession()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [testsOpen, setTestsOpen] = useState(false)
    const [mobileTestsOpen, setMobileTestsOpen] = useState(false)
    const [acctOpen, setAcctOpen] = useState(false)

    async function handleSignOut() {
        const supabase = createClient()
        await supabase.auth.signOut()
        setOpen(false)
        setAcctOpen(false)
        router.push("/")
        router.refresh()
    }

    const initial = (user?.email?.[0] || "U").toUpperCase()

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
                <Link
                    href="/"
                    className="shrink-0 text-xl font-extrabold tracking-tight text-zinc-950"
                    onClick={() => setOpen(false)}
                >
                    gain<span style={{ color: ACCENT }}>ditu</span>.
                </Link>

                {/* Links escritorio */}
                <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
                    <div
                        className="relative"
                        onMouseEnter={() => setTestsOpen(true)}
                        onMouseLeave={() => setTestsOpen(false)}
                    >
                        <button
                            type="button"
                            aria-expanded={testsOpen}
                            aria-haspopup="true"
                            onClick={() => setTestsOpen((v) => !v)}
                            className="flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                        >
                            Tests
                            <Chevron open={testsOpen} />
                        </button>
                        <AnimatePresence>
                            {testsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-1/2 top-full z-50 mt-1 w-64 -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-900/5"
                                >
                                    {TESTS_LINKS.map((l) => (
                                        <Link
                                            key={l.href}
                                            href={l.href}
                                            onClick={() => setTestsOpen(false)}
                                            className="block rounded-xl px-3 py-2 text-[14px] font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                                        >
                                            Tests de {l.label}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {NAV_LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="rounded-full px-3.5 py-2 text-[14px] font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* CTA escritorio */}
                <div className="hidden shrink-0 items-center gap-2 md:flex">
                    {!loading && user ? (
                        <div
                            className="relative"
                            onMouseEnter={() => setAcctOpen(true)}
                            onMouseLeave={() => setAcctOpen(false)}
                        >
                            <button
                                type="button"
                                aria-expanded={acctOpen}
                                onClick={() => setAcctOpen((v) => !v)}
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[14px] font-bold text-white"
                                style={{ backgroundColor: "#18181B" }}
                            >
                                {initial}
                            </button>
                            <AnimatePresence>
                                {acctOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full z-50 mt-1 w-60 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-900/5"
                                    >
                                        <div className="truncate px-3 py-2 text-[12px] text-zinc-400">
                                            {user.email}
                                        </div>
                                        {CUENTA_ITEMS.map((it) => (
                                            <Link
                                                key={it.href}
                                                href={it.href}
                                                onClick={() => setAcctOpen(false)}
                                                className="block rounded-xl px-3 py-2 text-[14px] font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                                            >
                                                {it.label}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={handleSignOut}
                                            className="mt-1 block w-full cursor-pointer rounded-xl border-t border-zinc-100 px-3 py-2 text-left text-[14px] font-semibold text-red-500 hover:bg-zinc-50"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-full px-3.5 py-2 text-[14px] font-semibold text-zinc-700 transition-colors hover:text-zinc-950"
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-full bg-zinc-950 px-5 py-2 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 md:hidden"
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
                        className="overflow-hidden border-t border-zinc-200 bg-white md:hidden"
                    >
                        <div className="flex flex-col gap-1 px-5 py-3">
                            <button
                                type="button"
                                aria-expanded={mobileTestsOpen}
                                onClick={() => setMobileTestsOpen((v) => !v)}
                                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                            >
                                Tests
                                <Chevron open={mobileTestsOpen} />
                            </button>
                            {mobileTestsOpen &&
                                TESTS_LINKS.map((l) => (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        onClick={() => setOpen(false)}
                                        className="rounded-lg py-2 pl-6 pr-3 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                                    >
                                        Tests de {l.label}
                                    </Link>
                                ))}
                            {NAV_LINKS.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                                >
                                    {l.label}
                                </Link>
                            ))}
                            {!loading && user ? (
                                <div className="mt-2 border-t border-zinc-200 pt-2">
                                    <div className="truncate px-3 pb-1 text-[12px] text-zinc-400">
                                        {user.email}
                                    </div>
                                    {CUENTA_ITEMS.map((it) => (
                                        <Link
                                            key={it.href}
                                            href={it.href}
                                            onClick={() => setOpen(false)}
                                            className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                                        >
                                            {it.label}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-zinc-50"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-2 flex gap-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setOpen(false)}
                                        className="flex-1 rounded-full border border-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-900"
                                    >
                                        Entrar
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setOpen(false)}
                                        className="flex-1 rounded-full bg-zinc-950 px-4 py-2 text-center text-sm font-semibold text-white"
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
