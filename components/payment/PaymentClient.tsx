"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useIsMobile } from "@/lib/use-is-mobile"
import { SunIcon, MoonIcon, CheckIcon } from "@/components/icons"
import LightNavbar from "@/components/site/LightNavbar"
import SiteFooter from "@/components/site/SiteFooter"

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51TjFCiJMIRLdIAQNCE42HQtsnlfvPkFsBNqovT0ayide74xAphiDiJOY2SlI8NrR6A6uL1yWK2nvjCMu7na7dENq00dizBLEaF"
const CHECKOUT_FN = process.env.NEXT_PUBLIC_CHECKOUT_FN_NAME || "create-embedded-checkout"
const STRIPE_FALLBACK_URL = "https://buy.stripe.com/fZu6oI8MYeuW1Fj88Y2Ji00"

const PRICE = "24,99"
const ORIGINAL_PRICE = "40"
const ACCENT = "#10B981"

const FEATURES = [
    "Exámenes oficiales convocatorias anteriores",
    "Simulacros con penalización real IVAP",
    "Estadísticas avanzadas y progreso por escala",
    "Actualizaciones gratuitas hasta el examen",
    "Acceso de por vida · Sin suscripción",
]

export default function PaymentClient() {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile(rootRef)
    const [dark, setDark] = React.useState(false)

    const [isCreatingCheckout, setIsCreatingCheckout] = React.useState(false)
    const [checkoutMounted, setCheckoutMounted] = React.useState(false)
    const [checkoutError, setCheckoutError] = React.useState("")
    const [embeddedReady, setEmbeddedReady] = React.useState(false)
    const embeddedContainerRef = React.useRef<HTMLDivElement | null>(null)
    const checkoutInstanceRef = React.useRef<any>(null)
    const stripeScriptLoadedRef = React.useRef(false)

    const bg = dark ? "#0B0C10" : "#FFFFFF"
    const surface = dark ? "rgba(25,26,35,0.8)" : "rgba(255,255,255,0.9)"
    const border = dark ? "rgba(255,255,255,0.08)" : "#E4E4E7"
    const textMain = dark ? "#FFFFFF" : "#09090B"
    const textMuted = dark ? "#8B8D98" : "#71717A"
    const navBg = "rgba(10,10,12,0.96)"

    const ensureStripeScript = React.useCallback(async () => {
        if (typeof window === "undefined") return false
        if ((window as any).Stripe) {
            stripeScriptLoadedRef.current = true
            return true
        }
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

    const mountEmbeddedCheckout = React.useCallback(async () => {
        if (checkoutInstanceRef.current || isCreatingCheckout) return
        try {
            setCheckoutError("")
            setIsCreatingCheckout(true)
            if (!STRIPE_PK.startsWith("pk_")) {
                setCheckoutError("Falta la Stripe Publishable Key.")
                return
            }
            const stripeOk = await ensureStripeScript()
            if (!stripeOk || !(window as any).Stripe) {
                setCheckoutError("Stripe.js no disponible.")
                return
            }

            // Llamada a la edge function (gestiona apikey + JWT del usuario).
            const supabase = createClient()
            const { data, error } = await supabase.functions.invoke(CHECKOUT_FN, {
                body: {
                    productName: "Gainditu Premium — Acceso de por vida",
                    price: PRICE,
                    currency: "€",
                },
            })
            if (error) throw new Error(error.message || "Error al crear la sesión de pago")
            const clientSecret = data?.clientSecret || data?.client_secret
            if (!clientSecret) throw new Error("No se recibió el clientSecret de Stripe")

            const stripe = (window as any).Stripe(STRIPE_PK)
            const checkout = await stripe.initEmbeddedCheckout({
                fetchClientSecret: async () => clientSecret,
            })
            checkoutInstanceRef.current = checkout
            setCheckoutMounted(true)
            setEmbeddedReady(true)
        } catch (err: any) {
            setCheckoutError(err?.message || "Error al iniciar el checkout.")
            setEmbeddedReady(false)
        } finally {
            setIsCreatingCheckout(false)
        }
    }, [ensureStripeScript, isCreatingCheckout])

    React.useEffect(() => {
        if (!checkoutMounted || !embeddedContainerRef.current) return
        const checkout = checkoutInstanceRef.current
        if (!checkout) return
        checkout.mount(embeddedContainerRef.current)
        return () => {
            try {
                checkout.unmount?.()
            } catch {}
            try {
                checkout.destroy?.()
            } catch {}
            checkoutInstanceRef.current = null
        }
    }, [checkoutMounted])

    // Auto-iniciar el checkout embebido al entrar.
    React.useEffect(() => {
        if (checkoutMounted || isCreatingCheckout) return
        mountEmbeddedCheckout()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            ref={rootRef}
            style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: bg,
                color: textMain,
                fontFamily: "Inter, system-ui, sans-serif",
                boxSizing: "border-box",
            }}
        >
            <LightNavbar />

            {/* CONTENIDO */}
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
                {/* COLUMNA IZQUIERDA */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "24px" }}
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
                                margin: isMobile ? "0 0 10px" : "0 0 20px",
                                color: textMain,
                            }}
                        >
                            {isMobile ? (
                                "Acceso completo de por vida."
                            ) : (
                                <>
                                    Acceso completo
                                    <br />
                                    <span style={{ color: ACCENT }}>de por vida.</span>
                                </>
                            )}
                        </h1>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                            <span
                                style={{
                                    fontSize: isMobile ? "32px" : "44px",
                                    fontWeight: 900,
                                    color: textMain,
                                    letterSpacing: "-1.5px",
                                    lineHeight: 1,
                                }}
                            >
                                €{PRICE}
                            </span>
                            <span
                                style={{
                                    fontSize: isMobile ? "14px" : "18px",
                                    color: textMuted,
                                    textDecoration: "line-through",
                                }}
                            >
                                €{ORIGINAL_PRICE}
                            </span>
                        </div>
                        <div style={{ fontSize: "11px", color: textMuted, marginTop: "4px" }}>
                            Pago único · Sin suscripción
                        </div>
                    </div>

                    {isMobile ? (
                        <div style={{ fontSize: "12px", color: textMuted, lineHeight: 1.7 }}>
                            Exámenes oficiales y simulacros con penalización IVAP · ✓
                            Estadísticas avanzadas · Acceso de por vida, sin suscripción
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {FEATURES.map((f, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <CheckIcon color={ACCENT} />
                                    <span style={{ fontSize: "13px", color: textMain }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isMobile ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "12px 16px",
                                background: surface,
                                border: `1px solid ${border}`,
                                borderRadius: "10px",
                            }}
                        >
                            <span style={{ fontSize: "18px" }}></span>
                            <span style={{ fontSize: "12px", color: textMuted }}>
                                Garantía de <strong style={{ color: textMain }}>30 días</strong> o
                                te devolvemos el dinero
                            </span>
                        </div>
                    ) : (
                        <div style={{ fontSize: "11px", color: textMuted }}>
                            Garantía de 30 días o te devolvemos el dinero
                        </div>
                    )}
                </motion.div>

                {/* COLUMNA DERECHA — Checkout */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 }}
                >
                    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "20px", overflow: "hidden" }}>
                        <div
                            style={{
                                padding: "20px 24px",
                                borderBottom: `1px solid ${border}`,
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.5 }}>
                                <rect x="2.5" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                                <path d="M4.5 6V4.5C4.5 3.12 5.62 2 7 2C8.38 2 9.5 3.12 9.5 4.5V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                            <span style={{ fontSize: "12px", color: textMuted }}>
                                Pago seguro vía Stripe · SSL 256-bit
                            </span>
                        </div>

                        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            {!embeddedReady && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={mountEmbeddedCheckout}
                                    disabled={isCreatingCheckout}
                                    style={{
                                        width: "100%",
                                        padding: "15px",
                                        borderRadius: "12px",
                                        background: ACCENT,
                                        color: "#fff",
                                        border: "none",
                                        fontSize: "15px",
                                        fontWeight: 700,
                                        cursor: isCreatingCheckout ? "default" : "pointer",
                                        fontFamily: "Inter, system-ui, sans-serif",
                                        opacity: isCreatingCheckout ? 0.7 : 1,
                                        boxSizing: "border-box",
                                    }}
                                >
                                    {isCreatingCheckout ? "Preparando pago..." : `Pagar €${PRICE} →`}
                                </motion.button>
                            )}

                            <AnimatePresence>
                                {embeddedReady && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{ borderRadius: "10px", overflow: "hidden", minHeight: "480px", background: "#fff" }}
                                    >
                                        <div ref={embeddedContainerRef} style={{ width: "100%", minHeight: "480px" }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {checkoutError && (
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#FCA5A5",
                                        background: "rgba(127,29,29,0.2)",
                                        border: "1px solid rgba(248,113,113,0.3)",
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                    }}
                                >
                                    {checkoutError}
                                </div>
                            )}

                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ flex: 1, height: "1px", background: border }} />
                                <span style={{ fontSize: "11px", color: textMuted }}>o</span>
                                <div style={{ flex: 1, height: "1px", background: border }} />
                            </div>

                            <a
                                href={STRIPE_FALLBACK_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: `1px solid ${ACCENT}40`,
                                    color: ACCENT,
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxSizing: "border-box",
                                }}
                            >
                                Pagar en página externa →
                            </a>

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
