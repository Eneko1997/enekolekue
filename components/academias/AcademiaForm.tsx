"use client"

import { useState, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

// Formulario de contacto de academias. Guarda el contacto en public.leads_academia
// (RLS: insert público) y un trigger AFTER INSERT avisa al equipo por email
// (edge function notify-academia). Nada de datos personales sensibles.

type Estado = "idle" | "enviando" | "ok" | "error"

const inputCls =
    "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-[14px] text-zinc-900 outline-none transition-colors focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
const labelCls = "mb-1.5 block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300"

export default function AcademiaForm() {
    const [estado, setEstado] = useState<Estado>("idle")

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const email = String(fd.get("email") || "").trim().toLowerCase()
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            setEstado("error")
            return
        }
        setEstado("enviando")
        try {
            const supabase = createClient()
            const { error } = await supabase.from("leads_academia").insert({
                academia: String(fd.get("academia") || "").trim() || null,
                nombre: String(fd.get("nombre") || "").trim() || null,
                email,
                telefono: String(fd.get("telefono") || "").trim() || null,
                mensaje: String(fd.get("mensaje") || "").trim() || null,
                origen: "para-academias",
            })
            setEstado(error ? "error" : "ok")
        } catch {
            setEstado("error")
        }
    }

    if (estado === "ok") {
        return (
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-50 p-8 text-center dark:bg-emerald-500/10">
                <div
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: ACCENT }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 className="mt-4 text-lg font-bold text-zinc-950 dark:text-zinc-50">Recibido. Te escribimos pronto</h3>
                <p className="mx-auto mt-2 max-w-md text-[14px] text-zinc-600 dark:text-zinc-300">
                    Nos pondremos en contacto con el email que nos has dejado para prepararte una propuesta a medida.
                </p>
            </div>
        )
    }

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-zinc-200 bg-white p-6 text-left dark:border-zinc-800 dark:bg-zinc-900 sm:p-8"
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className={labelCls} htmlFor="ac-academia">Nombre de la academia</label>
                    <input id="ac-academia" name="academia" required className={inputCls} />
                </div>
                <div>
                    <label className={labelCls} htmlFor="ac-nombre">Persona de contacto</label>
                    <input id="ac-nombre" name="nombre" className={inputCls} />
                </div>
                <div>
                    <label className={labelCls} htmlFor="ac-email">Email de contacto</label>
                    <input id="ac-email" name="email" type="email" required className={inputCls} />
                </div>
                <div>
                    <label className={labelCls} htmlFor="ac-tel">Teléfono (opcional)</label>
                    <input id="ac-tel" name="telefono" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="ac-mensaje">¿Qué tienes en mente? (opcional)</label>
                    <textarea id="ac-mensaje" name="mensaje" rows={4} placeholder="Cuéntanos tu academia y qué te gustaría hacer con Gainditu." className={inputCls} />
                </div>
            </div>

            {estado === "error" && (
                <p className="mt-4 text-[13px] font-medium text-red-500">
                    No se ha podido enviar. Revisa el email o escríbenos a info@gaindituoposiciones.com.
                </p>
            )}

            <button
                type="submit"
                disabled={estado === "enviando"}
                className="mt-6 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
                style={{ backgroundColor: ACCENT }}
            >
                {estado === "enviando" ? "Enviando…" : "Enviar solicitud"}
            </button>
            <p className="mt-3 text-[12px] text-zinc-400 dark:text-zinc-500">
                Usamos tus datos solo para contactar contigo sobre publicidad en Gainditu.
            </p>
        </form>
    )
}
