"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

// Subtítulo de las landings de tests (Ley 39/2015, Constitución) que se adapta
// a la sesión: a un usuario con sesión iniciada NO se le muestra "Inicia sesión".
export default function TestsLead({
    prefix,
    guestTail,
    loggedTail,
}: {
    prefix: string
    guestTail: string
    loggedTail: string
}) {
    const [estado, setEstado] = useState<"cargando" | "invitado" | "sesion">("cargando")

    useEffect(() => {
        const supabase = createClient()
        let cancelled = false
        ;(async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!cancelled) setEstado(user ? "sesion" : "invitado")
        })()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {prefix}
            {estado === "invitado" && (
                <>
                    {" "}
                    <Link
                        href="/login"
                        className="font-semibold text-zinc-950 dark:text-zinc-50 hover:underline"
                    >
                        Inicia sesión
                    </Link>{" "}
                    {guestTail}
                </>
            )}
            {estado === "sesion" && <> {loggedTail}</>}
        </p>
    )
}
