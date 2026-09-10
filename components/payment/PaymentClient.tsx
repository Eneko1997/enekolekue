"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useIsMobile } from "@/lib/use-is-mobile"
import { CheckIcon } from "@/components/icons"
import LightNavbar from "@/components/site/LightNavbar"
import { useTheme } from "@/lib/use-theme"
import SiteFooter from "@/components/site/SiteFooter"
import { precioActualCent, precioSiguienteCent, fechaSiguienteSubida, euros, fechaLegible, PRECIO_TOPE_CENT } from "@/lib/precio"

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51TjFCiJMIRLdIAQNCE42HQtsnlfvPkFsBNqovT0ayide74xAphiDiJOY2SlI8NrR6A6uL1yWK2nvjCMu7na7dENq00dizBLEaF"
const CHECKOUT_FN = process.env.NEXT_PUBLIC_CHECKOUT_FN_NAME || "create-embedded-checkout"
const ACCENT = "#10B981"

// Oferta única: pago único, acceso completo hasta el examen (mínimo 12 meses).
// El precio (mostrado aquí y cobrado por Stripe) sale de lib/precio.ts, replicado en la edge
// function create-embedded-checkout: sube +5€ el día 1 de cada mes hasta el tope, automático.
const OFFER = { valorTotal: "195" }

// Lo que entra, con su valor de referencia (deliverables reales del producto).
const INCLUYE = [
    { t: "Exámenes oficiales de convocatorias anteriores", v: "59€" },
    { t: "Casos Prácticos Gainditu, exclusivos", v: "49€" },
    { t: "Simulacros con penalización real", v: "39€" },
    { t: "Explicación con IA en cada pregunta", v: "29€" },
    { t: "Estadísticas y progreso por escala", v: "19€" },
]

// Bono real y exclusivo del acceso (las herramientas, avisos de convocatoria y
// demás son gratis para todos, así que NO cuentan aquí como valor de pago).
const BONOS = [
    { t: "Plan de estudio personalizado hasta tu examen", v: "49€" },
    { t: "Tus impugnaciones, revisadas y respondidas por un experto", v: "19€" },
]

export default function PaymentClient() {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile(rootRef)
    const { dark } = useTheme()

    // Precio en vivo desde el calendario (lib/precio.ts): mismo cálculo que cobra Stripe.
    const precio = React.useMemo(() => {
        const now = new Date()
        const sig = precioSiguienteCent(now)
        const fSig = fechaSiguienteSubida(now)
        return {
            str: euros(precioActualCent(now)),
            nextStr: sig != null ? euros(sig) : null,
            nextDate: fSig ? fechaLegible(fSig) : null,
            capStr: euros(PRECIO_TOPE_CENT),
        }
    }, [])

    const [authChecked, setAuthChecked] = React.useState(false)
    const [user, setUser] = React.useState<any>(null)

    const [isCreatingCheckout, setIsCreatingCheckout] = React.useState(false)
    const [embeddedReady, setEmbeddedReady] = React.useState(false)
    const [checkoutError, setCheckoutError] = React.useState("")
    const embeddedContainerRef = React.useRef<HTMLDivElement | null>(null)
    const checkoutInstanceRef = React.useRef<any>(null)
    const stripeScriptLoadedRef = React.useRef(false)
    const reqIdRef = React.useRef(0)

    const bg = dark ? "#0B0C10" : "#FFFFFF"
    const surface = dark ? "rgba(25,26,35,0.8)" : "rgba(255,255,255,0.9)"
    const border = dark ? "rgba(255,255,255,0.08)" : "#E4E4E7"
    const textMain = dark ? "#FFFFFF" : "#09090B"
    const textMuted = dark ? "#8B8D98" : "#71717A"

    const authRedirect = "/payment"

    // Al entrar, siempre arriba (evita heredar el scroll de la página anterior).
    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Comprueba la sesión (una sola vez).
    React.useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user ?? null)
            setAuthChecked(true)
        })
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

    // Crea/reinicia el checkout embebido. El precio y el modo los fija el servidor.
    const initCheckout = React.useCallback(
        async () => {
            const myReq = ++reqIdRef.current
            setCheckoutError("")
            setEmbeddedReady(false)
            setIsCreatingCheckout(true)
            teardown()
            try {
                if (!STRIPE_PK.startsWith("pk_")) {
                    setCheckoutError("Falta la Stripe Publishable Key.")
                    return
                }
                const stripeOk = await ensureStripeScript()
                if (myReq !== reqIdRef.current) return
                if (!stripeOk || !(window as any).Stripe) {
                    setCheckoutError("Stripe.js no disponible.")
                    return
                }

                const supabase = createClient()
                const { data, error } = await supabase.functions.invoke(CHECKOUT_FN, {
                    body: {},
                })
                if (myReq !== reqIdRef.current) return
                if (error) throw new Error(error.message || "Error al crear la sesión de pago")
                const clientSecret = data?.clientSecret || data?.client_secret
                if (!clientSecret) throw new Error("No se recibió el clientSecret de Stripe")

                const stripe = (window as any).Stripe(STRIPE_PK)
                const checkout = await stripe.initEmbeddedCheckout({
                    fetchClientSecret: async () => clientSecret,
                })
                if (myReq !== reqIdRef.current) {
                    try { checkout.destroy?.() } catch {}
                    return
                }
                checkoutInstanceRef.current = checkout
                if (embeddedContainerRef.current) {
                    checkout.mount(embeddedContainerRef.current)
                    setEmbeddedReady(true)
                }
            } catch (err: any) {
                if (myReq === reqIdRef.current) {
                    setCheckoutError(err?.message || "Error al iniciar el checkout.")
                    setEmbeddedReady(false)
                }
            } finally {
                if (myReq === reqIdRef.current) setIsCreatingCheckout(false)
            }
        },
        [ensureStripeScript, teardown]
    )

    // Solo se crea el checkout cuando: sesión comprobada + usuario logueado.
    React.useEffect(() => {
        if (!authChecked || !user) return
        initCheckout()
        return () => teardown()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authChecked, user])

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
                            <div style={{ fontSize: "11px", fontWeight: 700, color: ACCENT, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
                                Objetivo Plaza · OPE Gobierno Vasco 2026
                            </div>
                        )}
                        <h1 style={{ fontSize: isMobile ? "22px" : "30px", fontWeight: 800, letterSpacing: "-0.6px", lineHeight: 1.2, margin: "0 0 6px", color: textMain }}>
                            Todo hecho por ti para <span style={{ color: ACCENT }}>aprobar.</span>
                        </h1>
                        <p style={{ fontSize: "13px", color: textMuted, margin: 0, lineHeight: 1.6 }}>
                            Un único pago. Acceso completo hasta el día de tu examen.
                        </p>
                    </div>

                    {/* Value stack: lo que entra */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                        {INCLUYE.map((f, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <CheckIcon color={ACCENT} />
                                <span style={{ fontSize: "13px", color: textMain, flex: 1 }}>{f.t}</span>
                                <span style={{ fontSize: "12px", color: textMuted, textDecoration: "line-through" }}>{f.v}</span>
                            </div>
                        ))}
                        <div style={{ fontSize: "11px", fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "6px" }}>
                            Y además, de regalo:
                        </div>
                        {BONOS.map((f, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <CheckIcon color={ACCENT} />
                                <span style={{ fontSize: "13px", color: textMain, flex: 1 }}>{f.t}</span>
                                <span style={{ fontSize: "12px", color: textMuted, textDecoration: "line-through" }}>{f.v}</span>
                            </div>
                        ))}
                    </div>

                    {/* Total apilado vs precio */}
                    <div style={{ borderTop: `1px solid ${border}`, paddingTop: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <span style={{ fontSize: "13px", color: textMuted }}>Valor total</span>
                            <span style={{ fontSize: "15px", color: textMuted, textDecoration: "line-through" }}>€{OFFER.valorTotal}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <span style={{ fontSize: "15px", fontWeight: 800, color: textMain }}>Hoy, pago único</span>
                            <span style={{ fontSize: "30px", fontWeight: 900, color: ACCENT, letterSpacing: "-1px" }}>€{precio.str}</span>
                        </div>
                    </div>

                    {/* Garantía audaz: apruebas o sigues gratis */}
                    <div style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}35`, borderRadius: "12px", padding: "12px 14px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span style={{ marginTop: "1px" }}><CheckIcon color={ACCENT} /></span>
                        <div>
                            <div style={{ fontSize: "13px", fontWeight: 800, color: textMain }}>Apruebas o sigues gratis</div>
                            <div style={{ fontSize: "12px", color: textMuted, lineHeight: 1.55 }}>
                                Si te presentas al examen y no lo apruebas, mantienes el acceso gratis hasta la
                                siguiente convocatoria. Y si al empezar ves que no es para ti, te devolvemos el
                                dinero en los primeros 7 días.
                                <span style={{ display: "block", marginTop: "4px", fontSize: "11px", opacity: 0.8 }}>
                                    *Prórroga sujeta a acreditar la inscripción y el resultado oficial de no apto, y
                                    haber usado la plataforma de forma efectiva (mínimo 10 simulacros o tests
                                    completos y 30 días de actividad). Una prórroga por persona y convocatoria.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Urgencia honesta: precio escalonado por más contenido */}
                    <div style={{ fontSize: "11px", color: textMuted, lineHeight: 1.6 }}>
                        {precio.nextStr && precio.nextDate ? (
                            <>
                                <strong style={{ color: textMain }}>Precio de lanzamiento €{precio.str}</strong>. Sube a
                                €{precio.nextStr} el {precio.nextDate}: cada mes añadimos contenido y el precio sube
                                con él (hasta €{precio.capStr}). Cuanto antes entres, menos pagas.{" "}
                            </>
                        ) : (
                            <>
                                <strong style={{ color: textMain }}>€{precio.str}, pago único.</strong>{" "}
                            </>
                        )}
                        Sin suscripción, con acceso hasta tu examen (mínimo 12 meses).
                    </div>
                </motion.div>

                {/* DERECHA — Gate de login o Checkout */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 }}
                >
                    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: "20px", overflow: "hidden" }}>
                        {/* Sin sesión → obligamos a identificarse antes de pagar */}
                        {authChecked && !user ? (
                            <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "14px", textAlign: "center" }}>
                                <div style={{ fontSize: "15px", fontWeight: 800, color: textMain }}>
                                    Inicia sesión para continuar
                                </div>
                                <p style={{ fontSize: "13px", color: textMuted, margin: 0, lineHeight: 1.6 }}>
                                    El acceso se vincula a tu cuenta. Entra o crea una cuenta gratis
                                    y volverás aquí para completar el pago.
                                </p>
                                <Link
                                    href={`/signup?redirect=${encodeURIComponent(authRedirect)}`}
                                    style={{ marginTop: "4px", padding: "13px", borderRadius: "12px", background: ACCENT, color: "#fff", fontSize: "15px", fontWeight: 700, textDecoration: "none" }}
                                >
                                    Crear cuenta gratis
                                </Link>
                                <Link
                                    href={`/login?redirect=${encodeURIComponent(authRedirect)}`}
                                    style={{ fontSize: "13px", fontWeight: 600, color: ACCENT, textDecoration: "none" }}
                                >
                                    Ya tengo cuenta · Iniciar sesión →
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div style={{ padding: "16px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: "12px", color: textMuted }}>Pago seguro vía Stripe · SSL</span>
                                    <span style={{ fontSize: "13px", fontWeight: 800, color: textMain }}>
                                        €{precio.str}
                                        <span style={{ fontSize: "11px", fontWeight: 600, color: textMuted }}> pago único</span>
                                    </span>
                                </div>

                                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div style={{ borderRadius: "10px", overflow: "hidden", minHeight: "480px", background: "#fff", position: "relative" }}>
                                        <div ref={embeddedContainerRef} style={{ width: "100%", minHeight: "480px" }} />
                                        <AnimatePresence>
                                            {(!embeddedReady || isCreatingCheckout) && !checkoutError && (
                                                <motion.div
                                                    initial={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", color: "#71717A", fontSize: "13px" }}
                                                >
                                                    Preparando el pago…
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {checkoutError && (
                                        <div style={{ fontSize: "12px", color: "#B91C1C", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", padding: "10px 12px", borderRadius: "8px" }}>
                                            {checkoutError}{" "}
                                            <button onClick={() => initCheckout()} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
                                                Reintentar
                                            </button>
                                        </div>
                                    )}

                                    <p style={{ fontSize: "11px", color: textMuted, textAlign: "center", margin: 0, lineHeight: 1.6 }}>
                                        El acceso se activa inmediatamente tras el pago.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>

            <SiteFooter />
        </div>
    )
}
