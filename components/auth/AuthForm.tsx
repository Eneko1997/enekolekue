"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { translateAuthError } from "@/lib/auth-errors"
import { BRAND_ACCENT } from "@/lib/theme"
import GoogleIcon from "./GoogleIcon"

type Mode = "login" | "register" | "forgot"

export default function AuthForm({ mode }: { mode: Mode }) {
    const router = useRouter()
    const params = useSearchParams()
    const redirect = params.get("redirect") || "/"

    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [info, setInfo] = useState("")

    const supabase = createClient()

    async function handleGoogle() {
        setError("")
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
            },
        })
        if (error) {
            setError(translateAuthError(error.message))
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setInfo("")
        setLoading(true)

        if (mode === "forgot") {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
            })
            setLoading(false)
            if (error) return setError(translateAuthError(error.message))
            return setInfo(
                "Te hemos enviado un email para restablecer tu contraseña."
            )
        }

        if (mode === "register") {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: nombre },
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
                },
            })
            setLoading(false)
            if (error) return setError(translateAuthError(error.message))
            if (data.session) {
                router.push(redirect)
                router.refresh()
                return
            }
            return setInfo(
                "Cuenta creada. Revisa tu email para confirmar tu cuenta."
            )
        }

        // login
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        setLoading(false)
        if (error) return setError(translateAuthError(error.message))
        router.push(redirect)
        router.refresh()
    }

    const title =
        mode === "login"
            ? "Accede a tu cuenta"
            : mode === "register"
              ? "Crea tu cuenta gratis"
              : "Recuperar contraseña"

    return (
        <div className="w-full max-w-[400px] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xl shadow-zinc-900/5 sm:p-9">
            <div className="mb-6 text-center">
                <div className="mb-1 text-[22px] font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                    gain<span style={{ color: BRAND_ACCENT }}>ditu</span>.
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">{title}</div>
            </div>

            {mode !== "forgot" && (
                <>
                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={loading}
                        className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60 disabled:opacity-60"
                    >
                        <GoogleIcon />
                        {loading ? "Redirigiendo…" : "Continuar con Google"}
                    </button>
                    <div className="mb-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">o con email</span>
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                </>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {mode === "register" && (
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-3 text-sm text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-900 dark:focus:border-zinc-300 focus:outline-none"
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-3 text-sm text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-900 dark:focus:border-zinc-300 focus:outline-none"
                />
                {mode !== "forgot" && (
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete={
                            mode === "register"
                                ? "new-password"
                                : "current-password"
                        }
                        className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-3 text-sm text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-900 dark:focus:border-zinc-300 focus:outline-none"
                    />
                )}

                {error && (
                    <p className="text-[13px] text-red-500">{error}</p>
                )}
                {info && (
                    <p className="text-[13px]" style={{ color: "#22C55E" }}>
                        {info}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 rounded-full bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                >
                    {loading
                        ? "Un momento…"
                        : mode === "login"
                          ? "Entrar"
                          : mode === "register"
                            ? "Crear cuenta gratis"
                            : "Enviar email"}
                </button>
            </form>

            <div className="mt-5 space-y-1.5 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
                {mode === "login" && (
                    <>
                        <p>
                            ¿No tienes cuenta?{" "}
                            <Link
                                href="/signup"
                                className="font-semibold text-zinc-950 dark:text-zinc-50 hover:underline"
                            >
                                Regístrate gratis
                            </Link>
                        </p>
                        <p>
                            <Link
                                href="/recuperar"
                                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </p>
                    </>
                )}
                {mode === "register" && (
                    <p>
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-zinc-950 dark:text-zinc-50 hover:underline"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                )}
                {mode === "forgot" && (
                    <p>
                        <Link
                            href="/login"
                            className="font-semibold text-zinc-950 dark:text-zinc-50 hover:underline"
                        >
                            ← Volver a iniciar sesión
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}
