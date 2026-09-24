"use client"

// CTA del bloque de muestra (PreguntasMuestra). Es cliente porque cambia según
// si el usuario está registrado: al invitado se le anima a registrarse; al que
// ya tiene cuenta NO se le da la matraca de "crear cuenta", y el botón le lleva
// a ELEGIR entre todos los tests de la norma (no a un test suelto/aleatorio).

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

export default function MuestraCTA({ link, restantes, tituloNorma }: { link: string; restantes: number; tituloNorma: string }) {
    const [logged, setLogged] = useState<boolean | null>(null)

    useEffect(() => {
        const s = createClient()
        s.auth.getUser().then(({ data }) => setLogged(!!data.user)).catch(() => setLogged(false))
    }, [])

    // Registrado: sin muro; que elija entre todos los tests de la norma.
    if (logged) {
        return (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-[17px] font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                    Sigue practicando {tituloNorma}
                </div>
                <p className="mx-auto mt-1.5 max-w-md text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Tienes todos los tests en tu cuenta. Elige uno y corrige con la penalización real del examen.
                </p>
                <div className="mt-4 flex justify-center">
                    <Link
                        href="#tests"
                        className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
                        style={{ background: ACCENT }}
                    >
                        Ver todos los tests →
                    </Link>
                </div>
            </div>
        )
    }

    // Invitado (o aún sin saber): muro de registro.
    return (
        <div className="mt-6 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white p-6 text-center dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-zinc-900">
            <div className="text-[17px] font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                {restantes > 0 ? `Te quedan más de ${restantes} preguntas de ${tituloNorma}` : `Sigue practicando ${tituloNorma}`}
            </div>
            <p className="mx-auto mt-1.5 max-w-md text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                Hazlas todas, corrige con la penalización real del examen y guarda tu progreso. Es gratis al registrarte.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link
                    href={link}
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
                    style={{ background: ACCENT }}
                >
                    Hacer el test completo →
                </Link>
                <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-[14px] font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100"
                >
                    Crear cuenta gratis
                </Link>
            </div>
        </div>
    )
}
