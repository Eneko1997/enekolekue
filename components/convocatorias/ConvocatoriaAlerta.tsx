"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { logFunnelEvent } from "@/lib/funnel"

export default function ConvocatoriaAlerta({
    slug,
    nombre,
    accent,
    organismo,
}: {
    slug: string
    nombre: string
    accent: string
    organismo?: string
}) {
    const [email, setEmail] = useState("")
    const [consent, setConsent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [done, setDone] = useState(false)

    async function enviar(e: FormEvent) {
        e.preventDefault()
        setError("")
        const mail = email.trim().toLowerCase()
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
            setError("Introduce un email válido.")
            return
        }
        if (!consent) {
            setError("Marca la casilla para poder avisarte.")
            return
        }
        setLoading(true)
        const supabase = createClient()
        const { data, error: fnError } = await supabase.functions.invoke("captar-aviso", {
            body: { tipo: "convocatoria", email: mail, slug, convocatoria: nombre, organismo, origen: "ficha_convocatoria" },
        })
        setLoading(false)
        if (fnError || !(data as { ok?: boolean })?.ok) {
            setError("No se ha podido registrar. Inténtalo de nuevo.")
            return
        }
        void logFunnelEvent("email_captured", {
            source: "alerta_convocatoria",
            slug,
            email: mail,
        })
        setDone(true)
    }

    if (done) {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <div className="text-[15px] font-bold text-emerald-800 dark:text-emerald-300">
                    Estás apuntado a las alertas
                </div>
                <p className="mt-1 text-[14px] text-emerald-700/90 dark:text-emerald-200/80">
                    Te avisamos el mismo día que se publique en el BOPV: plazas, plazos y fecha de examen.
                </p>
                <Link
                    href="/simulacro-administrativo-gobierno-vasco"
                    className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold text-white transition-transform hover:scale-[1.03]"
                    style={{ backgroundColor: accent }}
                >
                    Mientras tanto, haz un simulacro gratis →
                </Link>
            </div>
        )
    }

    return (
        <form
            onSubmit={enviar}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
            <div className="text-[15px] font-bold text-zinc-950 dark:text-zinc-50">
                Te avisamos cuando salga
            </div>
            <p className="mt-1 text-[14px] text-zinc-600 dark:text-zinc-400">
                Te avisamos el mismo día que se publique en el BOPV: plazas, plazos y fecha de examen.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-[15px] text-zinc-900 outline-none focus:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl px-6 py-2.5 text-[15px] font-bold text-white transition-transform hover:scale-[1.03] disabled:opacity-70"
                    style={{ backgroundColor: accent }}
                >
                    {loading ? "…" : "Avísame"}
                </button>
            </div>
            <label className="mt-3 flex items-start gap-2.5 text-[12.5px] text-zinc-500 dark:text-zinc-400">
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ accentColor: accent }}
                />
                <span>
                    Acepto recibir el aviso de esta convocatoria por correo. Consulta la{" "}
                    <Link href="/privacidad" target="_blank" className="underline">
                        política de privacidad
                    </Link>
                    .
                </span>
            </label>
            {error && <div className="mt-2 text-[13px] text-red-500">{error}</div>}
        </form>
    )
}
