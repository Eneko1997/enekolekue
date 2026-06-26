"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const ITEMS = [
    { label: "Mi progreso", href: "/perfil?tab=stats" },
    { label: "Mis exámenes", href: "/perfil?tab=examenes" },
    { label: "Mi historial", href: "/perfil?tab=historial" },
    { label: "Ajustes", href: "/perfil?tab=ajustes" },
]

function initials(user: User): string {
    const name = (user.user_metadata?.full_name as string) || user.email || "?"
    const base = name.includes("@") ? name.split("@")[0] : name
    const parts = base.trim().split(/\s+/)
    const ini =
        parts.length > 1
            ? parts[0][0] + parts[1][0]
            : base.replace(/[^a-zA-Z]/g, "").slice(0, 2)
    return (ini || base.slice(0, 2)).toUpperCase()
}

export default function AccountMenu({ user }: { user: User }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false)
        }
        document.addEventListener("mousedown", onClick)
        return () => document.removeEventListener("mousedown", onClick)
    }, [])

    async function handleSignOut() {
        const supabase = createClient()
        await supabase.auth.signOut()
        setOpen(false)
        router.push("/")
        router.refresh()
    }

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1 pr-2.5 transition-colors hover:bg-white/10"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#0A0A0C]">
                    {initials(user)}
                </span>
                <span className="hidden max-w-[120px] truncate text-[13px] font-semibold text-white/80 sm:block">
                    {(user.email || "").split("@")[0]}
                </span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        role="menu"
                        className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#141520] shadow-2xl"
                    >
                        <div className="truncate border-b border-white/10 px-4 py-3 text-[12px] text-white/45">
                            {user.email}
                        </div>
                        <div className="py-1">
                            {ITEMS.map((it) => (
                                <Link
                                    key={it.href}
                                    href={it.href}
                                    role="menuitem"
                                    onClick={() => setOpen(false)}
                                    className="block px-4 py-2.5 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                                >
                                    {it.label}
                                </Link>
                            ))}
                        </div>
                        <button
                            onClick={handleSignOut}
                            role="menuitem"
                            className="block w-full border-t border-white/10 px-4 py-2.5 text-left text-[13px] font-semibold text-red-400 transition-colors hover:bg-white/5"
                        >
                            Cerrar sesión
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
