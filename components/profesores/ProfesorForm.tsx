"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

// Guarda la solicitud como lead (tabla leads_profesor) y avisa al equipo por email (Resend),
// vía la edge function `lead-profesor`. Aparece en /admin/captacion (fuente: Profesor).

type Estado = "idle" | "enviando" | "ok" | "error"

const inputCls =
    "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-[14px] text-zinc-900 outline-none transition-colors focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
const labelCls =
    "mb-1.5 block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300"

export default function ProfesorForm() {
    const [estado, setEstado] = useState<Estado>("idle")

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setEstado("enviando")
        const fd = new FormData(e.currentTarget)
        const body = {
            nombre: String(fd.get("nombre") || ""),
            email: String(fd.get("email") || ""),
            telefono: String(fd.get("telefono") || ""),
            zona: String(fd.get("zona") || ""),
            materias: String(fd.get("materias") || ""),
            modalidad: String(fd.get("modalidad") || ""),
            mensaje: String(fd.get("mensaje") || ""),
        }
        try {
            const supabase = createClient()
            const { data, error } = await supabase.functions.invoke("lead-profesor", { body })
            setEstado(!error && (data as { ok?: boolean })?.ok ? "ok" : "error")
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
                <h3 className="mt-4 text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    ¡Recibido! Nos pondremos en contacto contigo pronto
                </h3>
                <p className="mx-auto mt-2 max-w-md text-[14px] text-zinc-600 dark:text-zinc-300">
                    Te escribiremos al email que nos has dejado para explicarte cómo
                    aparecer en el directorio de profesores de Gainditu.
                </p>
            </div>
        )
    }

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8"
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className={labelCls} htmlFor="pf-nombre">Nombre y apellidos</label>
                    <input id="pf-nombre" name="nombre" required className={inputCls} />
                </div>
                <div>
                    <label className={labelCls} htmlFor="pf-email">Email de contacto</label>
                    <input id="pf-email" name="email" type="email" required className={inputCls} />
                </div>
                <div>
                    <label className={labelCls} htmlFor="pf-tel">Teléfono (opcional)</label>
                    <input id="pf-tel" name="telefono" className={inputCls} />
                </div>
                <div>
                    <label className={labelCls} htmlFor="pf-zona">Zona</label>
                    <input id="pf-zona" name="zona" placeholder="Bilbao, Donostia, online…" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="pf-materias">¿Qué materias das?</label>
                    <input id="pf-materias" name="materias" required placeholder="Derecho administrativo, Constitución, euskera…" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="pf-modalidad">Modalidad</label>
                    <select id="pf-modalidad" name="modalidad" className={inputCls}>
                        <option value="online">Online</option>
                        <option value="presencial">Presencial</option>
                        <option value="ambas">Online y presencial</option>
                    </select>
                </div>
                <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="pf-mensaje">Cuéntanos algo más (opcional)</label>
                    <textarea id="pf-mensaje" name="mensaje" rows={4} className={inputCls} />
                </div>
            </div>

            {estado === "error" && (
                <p className="mt-4 text-[13px] font-medium text-red-500">
                    No se ha podido enviar. Inténtalo de nuevo o escríbenos a info@gaindituoposiciones.com.
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
                Tus datos solo se usan para contactar contigo sobre el directorio de profesores.
            </p>
        </form>
    )
}
