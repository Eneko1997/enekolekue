"use client"

import { useEffect, useState, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"
const LS_KEY = "gainditu_avisos_popup_v1"

// Una sola lista de oposiciones concretas: el Gobierno Vasco va por cuerpo (es el
// núcleo del producto); el resto, por organismo entero (Ertzaintza/Osakidetza no
// comparten las escalas del GV, así que no se mezclan en un selector aparte).
const OPES: { id: string; label: string }[] = [
    { id: "gv-administrativo", label: "Administrativo · Gobierno Vasco" },
    { id: "gv-auxiliar", label: "Auxiliar administrativo · Gobierno Vasco" },
    { id: "gv-gestion", label: "Técnico de Gestión · Gobierno Vasco" },
    { id: "gv-superior", label: "Técnico Superior · Gobierno Vasco" },
    { id: "gv-apoyo", label: "Personal de Apoyo · Gobierno Vasco" },
    { id: "osakidetza", label: "Osakidetza" },
    { id: "ertzaintza", label: "Ertzaintza" },
    { id: "diputaciones", label: "Diputaciones Forales" },
    { id: "ayuntamientos", label: "Ayuntamientos" },
    { id: "educacion", label: "Educación (docentes)" },
]

const MAX_OPES = 3

export default function PopupAvisosConvocatorias() {
    const [abierto, setAbierto] = useState(false)
    const [opes, setOpes] = useState<string[]>([])
    const [email, setEmail] = useState("")
    const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "error">("idle")
    const [msg, setMsg] = useState("")

    useEffect(() => {
        let visto = false
        try {
            visto = localStorage.getItem(LS_KEY) === "1"
        } catch {}
        if (visto) return
        const t = setTimeout(() => setAbierto(true), 6000)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        if (!abierto) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") cerrar()
        }
        document.addEventListener("keydown", onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [abierto])

    function marcarVisto() {
        try {
            localStorage.setItem(LS_KEY, "1")
        } catch {}
    }
    function cerrar() {
        setAbierto(false)
        marcarVisto()
    }
    function toggleOpe(id: string) {
        setOpes((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id)
            if (prev.length >= MAX_OPES) return prev
            return [...prev, id]
        })
    }

    async function enviar(e: FormEvent) {
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
                body: { email: mail, opes, origen: "convocatorias-popup" },
            })
            if (error || !(data as { ok?: boolean })?.ok) {
                setEstado("error")
                setMsg("No se pudo completar. Inténtalo de nuevo en un momento.")
                return
            }
            setEstado("ok")
            setMsg(
                (data as { ya?: boolean }).ya
                    ? "Ya estabas suscrito. Hemos actualizado tus oposiciones."
                    : "Listo. Revisa tu email: te hemos enviado la confirmación."
            )
            marcarVisto()
        } catch {
            setEstado("error")
            setMsg("No se pudo completar. Inténtalo de nuevo en un momento.")
        }
    }

    if (!abierto) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Avisos de convocatorias"
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cerrar} />
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                <button
                    onClick={cerrar}
                    aria-label="Cerrar"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                </button>

                {estado === "ok" ? (
                    <div className="flex flex-col items-center gap-3 p-8 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `${ACCENT}1a`, color: ACCENT }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="text-[17px] font-extrabold text-zinc-950 dark:text-zinc-50">Hecho</h3>
                        <p className="text-[13.5px] text-zinc-600 dark:text-zinc-400">{msg}</p>
                        <button onClick={cerrar} className="mt-1 rounded-full px-6 py-2.5 text-[14px] font-bold text-white" style={{ background: ACCENT }}>
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <form onSubmit={enviar} className="flex flex-col gap-4 p-6 sm:p-7">
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>
                                Avisos de convocatorias
                            </div>
                            <h3 className="mt-1 text-[19px] font-extrabold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50">
                                Te avisamos cuando salga tu oposición
                            </h3>
                            <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                                Elige hasta {MAX_OPES} oposiciones y te avisamos por email cuando salga la convocatoria. Sin spam.
                            </p>
                        </div>

                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">¿Qué oposiciones te interesan?</span>
                                <span className="text-[11.5px] text-zinc-400">{opes.length}/{MAX_OPES}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {OPES.map((o) => {
                                    const activo = opes.includes(o.id)
                                    const bloqueado = !activo && opes.length >= MAX_OPES
                                    return (
                                        <button
                                            key={o.id}
                                            type="button"
                                            onClick={() => toggleOpe(o.id)}
                                            disabled={bloqueado}
                                            className="rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors disabled:opacity-40"
                                            style={activo ? { background: ACCENT, borderColor: ACCENT, color: "#fff" } : { borderColor: "rgba(120,120,130,0.3)", color: "inherit" }}
                                        >
                                            {o.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            aria-label="Tu email"
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[14px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                        />

                        {estado === "error" && <p className="text-[12.5px] font-medium text-red-500">{msg}</p>}

                        <button
                            type="submit"
                            disabled={estado === "loading"}
                            className="rounded-xl px-5 py-3 text-[14.5px] font-bold text-white transition-opacity disabled:opacity-60"
                            style={{ background: ACCENT }}
                        >
                            {estado === "loading" ? "Enviando…" : "Avisadme"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
