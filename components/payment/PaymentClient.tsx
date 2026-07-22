"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useIsMobile } from "@/lib/use-is-mobile"
import { CheckIcon } from "@/components/icons"
import LightNavbar from "@/components/site/LightNavbar"
import { useTheme } from "@/lib/use-theme"
import SiteFooter from "@/components/site/SiteFooter"

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51TjFCiJMIRLdIAQNCE42HQtsnlfvPkFsBNqovT0ayide74xAphiDiJOY2SlI8NrR6A6uL1yWK2nvjCMu7na7dENq00dizBLEaF"
const CHECKOUT_FN = process.env.NEXT_PUBLIC_CHECKOUT_FN_NAME || "create-embedded-checkout"
const ACCENT = "#10B981"

type PlanId = "monthly" | "lifetime"

const PLANS: Record<
    PlanId,
    { label: string; price: string; original?: string; suffix: string; sub: string }
> = {
    monthly: {
        label: "Mensual",
        price: "8,99",
        suffix: "/mes",
        sub: "Cancela cuando quieras",
    },
    lifetime: {
        label: "De por vida",
        price: "24,99",
        original: "40",
        suffix: "",
        sub: "Pago único · Para siempre",
    },
}

const FEATURES = [
    "Exámenes oficiales de convocatorias anteriores",
    "Simulacros con penalización real del IVAP",
    "Estadísticas avanzadas y progreso por escala",
    "Actualizaciones gratuitas hasta el examen",
]

function getInitialPlan(): PlanId {
    if (typeof window === "undefined") return "lifetime"
    const p = new URLSearchParams(window.location.search).get("plan")
    return p === "monthly" ? "monthly" : "lifetime"
}

export default function PaymentClient() {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile(rootRef)
    const { dark } = useTheme()

    const [plan, setPlan] = React.useState<PlanId>("lifetime")
    const [isCreatingCheckout, setIsCreatingCheckout] = React.useState(false)
    const [embeddedReady, setEmbeddedReady] = React.useState(false)
    const [checkoutError, setCheckoutError] = React.useState("")
    const embeddedContainerRef = React.useRef<HTMLDivElement | null>(null)
    const checkoutInstanceRef = React.useRef<any>(null)
    const stripeScriptLoadedRef = React.useRef(false)

    const bg = dark ? "#0B0C10" : "#FFFFFF"
    const surface = dark ? "rgba(25,26,35,0.8)" : "rgba(255,255,255,0.9)"
    const border = dark ? "rgba(255,255,255,0.08)" : "#E4E4E7"
    const textMain = dark ? "#FFFFFF" : "#09090B"
    const textMuted = dark ? "#8B8D98" : "#71717A"

    const cfg = PLANS[plan]

    React.useEffect(() => {
        setPlan(getInitialPlan())
    }, [])

    const ensureStripeScript = React.useCallback(async () => {
        if (typeof window === "undefined") return false
        if ((window as any).Stripe) return true
        if (stripeScriptLoadedRef.current) return !!(window as any).Stripe
        stripeScriptLoadedRef.current = true
        await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://js.stripe.com/v3/"
            script.async = true
            script.onload = () => resolve()
            script.onerror = () => reject(new Error("No se pudo cargar Stripe.js"))
            document.head.appendChild(script)
        })
        return !!(window as any).Stripe
    }, [])

    const teardown = React.useCallback(() => {
        const inst = checkoutInstanceRef.current
        if (inst) {
            try { inst.unmount?.() } catch {}
            try { inst.destroy?.() } catch {}
            checkoutInstanceRef.current = null
        }
    }, [])

    // Crea/reinicia el checkout embebido para el plan activo.
    const initCheckout = React.useCallback(
        async (forPlan: PlanId) => {
            if (isCreatingCheckout) return
            try {
                setCheckoutError("")
                setEmbeddedReady(false)
                setIsCreatingCheckout(true)
                teardown()

                if (!STRIPE_PK.startsWith("pk_")) {
                    setCheckoutError("Falta la Stripe Publishable Key.")
                    return
                }
                const stripeOk = await ensureStripeScript()
                if (!stripeOk || !(window as any).Stripe) {
                    setCheckoutError("Stripe.js no disponible.")
                    return
                }

                const supabase = createClient()
                const { data, error } = await supabase.functions.invoke(CHECKOUT_FN, {
                    body: { plan: forPlan },
                })
                if (error) throw new Error(error.message || "Error al crear la sesión de pago")
                const clientSecret = data?.clientSecret || data?.client_secret
                if (!clientSecret) throw new Error("No se recibió el clientSecret de Stripe")

                const stripe = (window as any).Stripe(STRIPE_PK)
                const checkout = await stripe.initEmbeddedCheckout({
                    fetchClientSecret: async () => clientSecret,
                })
                checkoutInstanceRef.current = checkout
                if (embeddedContainerRef.current) {
                    checkout.mount(embeddedContainerRef.current)
                    setEmbeddedReady(true)
                }
            } catch (err: any) {
                setCheckoutError(err?.message || "Error al iniciar el checkout.")
                setEmbeddedReady(false)
            } finally {
                setIsCreatingCheckout(false)
            }
        },
        [ensureStripeScript, isCreatingCheckout, teardown]
    )

    // (Re)inicia al montar y cada vez que cambia el plan.
    React.useEffect(() => {
        initCheckout(plan)
        return () => teardown()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plan])

    function PlanCard({ id }: { id: PlanId }) {
        const p = PLANS[id]
        const active = plan === id
        const recommended = id === "lifetime"
        return (
            <button
                onClick={() => setPlan(id)}
                disabled={isCreatingCheckout && !active}
                style={{
                    flex: 1,
                    textAlign: "left",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    border: `1.5px solid ${active ? ACCENT : border}`,
                    background: active ? `${ACCENT}12` : surface,
                    cursor: "pointer",
                    position: "relative",
                    fontFamily: "inherit",
                    transition: "all .15s",
                }}
            >
                {recommended && (
                    <span
                        style={{
                            position: "absolute",
                            top: "-9px",
                            right: "12px",
                            fontSize: "9px",
                            fontWeight: 800,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            color: "#fff",
                            background: ACCENT,
                            padding: "2px 8px",
                            borderRadius: "100px",
                        }}
                    >
                        Recomendado
                    </span>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                        style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            border: `2px solid ${active ? ACCENT : textMuted}`,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {active && (
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: ACCENT }} />
                        )}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: textMain }}>{p.label}</span>
                </div>
                <div style={{ marginTop: "8px", display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span style={{ fontSize: "22px", fontWeight: 900, color: textMain, letterSpacing: "-0.5px" }}>
                        €{p.price}
                    </span>
                    <span style={{ fontSize: "12px", color: textMuted }}>{p.suffix}</span>
                    {p.original && (
                        <span style={{ fontSize: "12px", color: textMuted, textDecoration: "line-through" }}>
                            €{p.original}
                        </span>
                    )}
                </div>
                <div style={{ fontSize: "11px", color: textMuted, marginTop: "2px" }}>{p.sub}</div>
            </button>
        )
    }

    return (
        <div
            ref={rootRef}
            style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: bg,
                color: textMain,
                fontFamily: "var(--font-manrope), system-ui, sans-serif",
                boxSizing: "border-box",
            }}
        >
            <LightNavbar />

            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    padding: isMobile ? "24px 18px 50px" : "60px 24px 80px",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? "20px" : "48px",
                    alignItems: "start",
                }}
            >
                {/* IZQUIERDA */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "22px" }}
                >
                    <div>
                        {!isMobile && (
                            <div
                                style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    color: ACCENT,
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    marginBottom: "12px",
                                }}
                            >
                                OPE Gobierno Vasco 2026
                            </div>
                        )}
                        <h1
                            style={{
                                fontSize: isMobile ? "22px" : "30px",
                                fontWeight: 800,
                                letterSpacing: "-0.6px",
                                lineHeight: 1.2,
                                margin: "0 0 6px",
                                color: textMain,
                            }}
                        >
                            Elige tu acceso a{" "}
                            <span style={{ color: ACCENT }}>Gainditu Premium.</span>
                        </h1>
                        <p style={{ fontSize: "13px", color: textMuted, margin: 0 }}>
                            Prueba con la mensual o asegúrate el acceso de por vida con un único pago.
                        </p>
                    </div>

                    {/* Selector de plan */}
                    <div style={{ display: "flex", gap: "12px", marginTop: "2px" }}>
                        <PlanCard id="monthly" />
                        <PlanCard id="lifetime" />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {FEATURES.map((f, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <CheckIcon color={ACCENT} />
                                <span style={{ fontSize: "13px", color: textMain }}>{f}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ fontSize: "11px", color: textMuted }}>
                        {plan === "monthly"
                            ? "Suscripción mensual · Cancela en un clic cuando quieras."
                            : "Pago único · Sin suscripción · Garantía de 30 días."}
                    </div>
                </motion.div>

                {/* DERECHA — Checkout */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 }}
                >
                    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "20px", overflow: "hidden" }}>
                        <div
                            style={{
                                padding: "16px 24px",
                                borderBottom: `1px solid ${border}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <span style={{ fontSize: "12px", color: textMuted }}>
                                Pago seguro vía Stripe · SSL
                            </span>
                            <span style={{ fontSize: "13px", fontWeight: 800, color: textMain }}>
                                €{cfg.price}
                                <span style={{ fontSize: "11px", fontWeight: 600, color: textMuted }}>{cfg.suffix}</span>
                            </span>
                        </div>

                        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div
                                style={{
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    minHeight: "480px",
                                    background: "#fff",
                                    position: "relative",
                                }}
                            >
                                <div ref={embeddedContainerRef} style={{ width: "100%", minHeight: "480px" }} />
                                <AnimatePresence>
                                    {(!embeddedReady || isCreatingCheckout) && !checkoutError && (
                                        <motion.div
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "#fff",
                                                color: "#71717A",
                                                fontSize: "13px",
                                            }}
                                        >
                                            Preparando el pago…
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {checkoutError && (
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#B91C1C",
                                        background: "rgba(248,113,113,0.12)",
                                        border: "1px solid rgba(248,113,113,0.3)",
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                    }}
                                >
                                    {checkoutError}{" "}
                                    <button
                                        onClick={() => initCheckout(plan)}
                                        style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            )}

                            <p style={{ fontSize: "11px", color: textMuted, textAlign: "center", margin: 0, lineHeight: 1.6 }}>
                                El acceso se activa inmediatamente tras el pago.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <SiteFooter />
        </div>
    )
}
