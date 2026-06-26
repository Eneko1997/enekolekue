"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { translateAuthError } from "@/lib/auth-errors"
import { BRAND_ACCENT } from "@/lib/theme"

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [done, setDone] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({ password })
        setLoading(false)
        if (error) return setError(translateAuthError(error.message))
        setDone(true)
        setTimeout(() => {
            router.push("/dashboard")
            router.refresh()
        }, 1500)
    }

    return (
        <div className="w-full max-w-[400px] rounded-2xl border border-white/15 bg-[#141520] p-8 sm:p-9">
            <div className="mb-6 text-center">
                <div className="mb-1 text-[22px] font-extrabold tracking-tight text-white">
                    gain<span style={{ color: BRAND_ACCENT }}>ditu</span>.
                </div>
                <div className="text-sm text-white/60">Nueva contraseña</div>
            </div>

            {done ? (
                <p className="text-center text-sm" style={{ color: "#22C55E" }}>
                    Contraseña actualizada. Redirigiendo…
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="rounded-[10px] border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                    />
                    {error && <p className="text-[13px] text-red-400">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-1 rounded-[10px] px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                        style={{ backgroundColor: BRAND_ACCENT }}
                    >
                        {loading ? "Guardando…" : "Guardar contraseña"}
                    </button>
                </form>
            )}
        </div>
    )
}
