"use client"

import { useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

export interface SessionState {
    session: Session | null
    user: User | null
    loading: boolean
}

/**
 * Hook de sesión basado en el cliente oficial de Supabase.
 * Reemplaza toda la lógica manual de localStorage/refresh de los componentes Framer:
 * supabase-js refresca el token automáticamente y emite eventos onAuthStateChange.
 */
export function useSession(): SessionState {
    const [state, setState] = useState<SessionState>({
        session: null,
        user: null,
        loading: true,
    })

    useEffect(() => {
        const supabase = createClient()
        let mounted = true

        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return
            setState({
                session: data.session,
                user: data.session?.user ?? null,
                loading: false,
            })
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return
            setState({
                session,
                user: session?.user ?? null,
                loading: false,
            })
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    return state
}
