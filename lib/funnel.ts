import { createClient } from "@/lib/supabase/client"

export type FunnelEvent =
    | "landing_view"
    | "test_started"
    | "test_finished"
    | "email_captured"
    | "purchase"
    // Embudo de orientación (herramienta "¿Qué oposición elegir?")
    | "orientacion_result"
    | "orientacion_to_simulacro"
    | "orientacion_waitlist"

/** Id de sesión anónima persistente (para hilar los eventos de un mismo visitante). */
export function getFunnelSessionId(): string {
    if (typeof window === "undefined") return "ssr"
    try {
        const KEY = "gainditu_fsid"
        let sid = window.localStorage.getItem(KEY)
        if (!sid) {
            sid =
                typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
            window.localStorage.setItem(KEY, sid)
        }
        return sid
    } catch {
        return "no-storage"
    }
}

/**
 * Registra un evento del embudo en `public.funnel_events`.
 * Best-effort: nunca lanza (no debe romper el flujo del usuario).
 */
export async function logFunnelEvent(
    event: FunnelEvent,
    meta: Record<string, unknown> = {}
): Promise<void> {
    try {
        const supabase = createClient()
        const {
            data: { session },
        } = await supabase.auth.getSession()
        await supabase.from("funnel_events").insert({
            event,
            test_id: (meta.test_id as string) ?? null,
            user_id: session?.user?.id ?? null,
            session_id: getFunnelSessionId(),
            meta,
        })
    } catch {
        /* silencioso a propósito */
    }
}
