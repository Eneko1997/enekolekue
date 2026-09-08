"use client"

import { useState, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

export default function SuscripcionConvocatorias() {
    const [email, setEmail] = useState("")
    const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "error">("idle")
    const [msg, setMsg] = useState("")

    async function suscribir(e: FormEvent) {
        e.preventDefault()
        const mail = email.trim().toLowerCase()
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
            setEstado("error")
            setMsg("Introduce un email válido.")
            return
        }
        setEstado("loading")
        try {
            const supabase = createClient()
            const { data, error } = await supabase.functions.invoke("suscribir-convocatorias", {
                body: { email: mail, origen: "convocatorias" },
            })
            if (error || !(data as { ok?: boolean })?.ok) {
                setEstado("error")
                setMsg("No se pudo completar. Inténtalo de nuevo en un momento.")
                return
            }
            setEstado("ok")
            setMsg(
                (data as { ya?: boolean }).ya
                    ? "Ya estabas suscrito. Te avisaremos de las nuevas convocatorias."
                    : "Listo. Revisa tu email: te hemos enviado la confirmación."
            )
            setEmail("")
        } catch {
            setEstado("error")
            setMsg("No se pudo completar. Inténtalo de nuevo en un momento.")
        }
    }

    return (
        <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-md">
                    <h3 className="text-[17px] font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Te avisamos cuando salga tu convocatoria
                    </h3>
                    <p className="mt-1 text-[13.5px] text-zinc-600 dark:text-zinc-400">
                        Te avisamos por email cuando salga una nueva convocatoria en Euskadi. Sin spam.
                    </p>
                </div>

                {estado === "ok" ? (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-3 text-[13.5px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-zinc-900 dark:text-emerald-400 sm:max-w-[280px]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
                            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{msg}</span>
                    </div>
                ) : (
                    <form onSubmit={suscribir} className="w-full sm:w-auto">
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                aria-label="Tu email para avisos de convocatorias"
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 sm:w-60"
                            />
                            <button
                                type="submit"
                                disabled={estado === "loading"}
                                className="shrink-0 rounded-xl px-5 py-2.5 text-[14px] font-bold text-white transition-opacity disabled:opacity-60"
                                style={{ background: ACCENT }}
                            >
                                {estado === "loading" ? "Enviando…" : "Avisadme"}
                            </button>
                        </div>
                        {estado === "error" && (
                            <p className="mt-2 text-[12.5px] font-medium text-red-500">{msg}</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    )
}
