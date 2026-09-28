"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { translateAuthError } from "@/lib/auth-errors"
import { BRAND_ACCENT } from "@/lib/theme"
import GoogleIcon from "./GoogleIcon"

type Mode = "login" | "register" | "forgot"

const INPUT_CLS =
    "rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-3 text-sm text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-900 dark:focus:border-zinc-300 focus:outline-none"

// Campo de contraseña con el "ojito" para mostrar/ocultar lo que se escribe.
function CampoPassword({
    value,
    onChange,
    placeholder,
    autoComplete,
}: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    autoComplete: string
}) {
    const [ver, setVer] = useState(false)
    return (
        <div className="relative">
            <input
                type={ver ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                minLength={6}
                autoComplete={autoComplete}
                className={`${INPUT_CLS} w-full pr-11`}
            />
            <button
                type="button"
                onClick={() => setVer((v) => !v)}
                aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
            >
                {ver ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3.5 7 10 7a9.12 9.12 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
        </div>
    )
}

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

    // Recuperación por código (2 pasos): pide email → introduce código + contraseña.
    const [pasoForgot, setPasoForgot] = useState<"email" | "codigo">("email")
    const [codigo, setCodigo] = useState("")

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

    // Envía (o reenvía) el código de 6 cifras al email.
    async function enviarCodigo() {
        setError("")
        setInfo("")
        setLoading(true)
        try {
            await supabase.functions.invoke("recuperar-codigo", { body: { email } })
        } catch (_e) {
            /* no revelamos si el email existe */
        }
        setLoading(false)
        setPasoForgot("codigo")
        setInfo("Si ese email tiene cuenta, te hemos enviado un código. Revisa tu correo (y el spam).")
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setInfo("")

        if (mode === "forgot") {
            if (pasoForgot === "email") return enviarCodigo()
            // Paso 2: verificar código y fijar la nueva contraseña.
            setLoading(true)
            const { error: eVerif } = await supabase.auth.verifyOtp({
                email,
                token: codigo.trim(),
                type: "recovery",
            })
            if (eVerif) {
                setLoading(false)
                return setError(translateAuthError(eVerif.message))
            }
            const { error: ePass } = await supabase.auth.updateUser({ password })
            setLoading(false)
            if (ePass) return setError(translateAuthError(ePass.message))
            // Aviso de seguridad: "tu contraseña se ha cambiado" (no bloquea).
            supabase.functions.invoke("aviso-password").catch(() => {})
            setInfo("Contraseña cambiada. Entrando…")
            setTimeout(() => {
                router.push(redirect)
                router.refresh()
            }, 900)
            return
        }

        setLoading(true)

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
            return setInfo("Cuenta creada. Revisa tu email para confirmar tu cuenta.")
        }

        // login
        const { error } = await supabase.auth.signInWithPassword({ email, password })
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

    const submitLabel = loading
        ? "Un momento…"
        : mode === "login"
          ? "Entrar"
          : mode === "register"
            ? "Crear cuenta gratis"
            : pasoForgot === "email"
              ? "Enviar código"
              : "Cambiar contraseña"

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
                        className={INPUT_CLS}
                    />
                )}

                {/* Email: en recuperación solo en el paso 1 (en el paso 2 ya está fijado). */}
                {!(mode === "forgot" && pasoForgot === "codigo") && (
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className={INPUT_CLS}
                    />
                )}

                {/* Paso 2 de recuperación: código + nueva contraseña. */}
                {mode === "forgot" && pasoForgot === "codigo" && (
                    <>
                        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                            Código enviado a <span className="font-semibold text-zinc-800 dark:text-zinc-200">{email}</span>.
                        </p>
                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            placeholder="Introduce el código"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                            required
                            className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-3 text-center text-lg font-bold tracking-[0.25em] text-zinc-950 dark:text-zinc-50 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-900 dark:focus:border-zinc-300 focus:outline-none"
                        />
                        <CampoPassword
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nueva contraseña"
                            autoComplete="new-password"
                        />
                    </>
                )}

                {/* Contraseña en login/registro. */}
                {mode !== "forgot" && (
                    <CampoPassword
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        autoComplete={mode === "register" ? "new-password" : "current-password"}
                    />
                )}

                {error && <p className="text-[13px] text-red-500">{error}</p>}
                {info && (
                    <p className="text-[13px]" style={{ color: BRAND_ACCENT }}>
                        {info}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 rounded-full bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 dark:bg-white dark:text-zinc-950"
                >
                    {submitLabel}
                </button>

                {/* En el paso 2: reenviar o corregir el email. */}
                {mode === "forgot" && pasoForgot === "codigo" && (
                    <div className="mt-1 flex items-center justify-between text-[12.5px] text-zinc-500 dark:text-zinc-400">
                        <button
                            type="button"
                            onClick={enviarCodigo}
                            disabled={loading}
                            className="hover:text-zinc-950 dark:hover:text-white hover:underline disabled:opacity-60"
                        >
                            Reenviar código
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setPasoForgot("email")
                                setCodigo("")
                                setError("")
                                setInfo("")
                            }}
                            className="hover:text-zinc-950 dark:hover:text-white hover:underline"
                        >
                            Cambiar email
                        </button>
                    </div>
                )}
            </form>

            <div className="mt-5 space-y-1.5 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
                {mode === "login" && (
                    <>
                        <p>
                            ¿No tienes cuenta?{" "}
                            <Link href="/signup" className="font-semibold text-zinc-950 dark:text-zinc-50 hover:underline">
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
                        <Link href="/login" className="font-semibold text-zinc-950 dark:text-zinc-50 hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                )}
                {mode === "forgot" && (
                    <p>
                        <Link href="/login" className="font-semibold text-zinc-950 dark:text-zinc-50 hover:underline">
                            ← Volver a iniciar sesión
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}
