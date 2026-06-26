"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Hook para detectar mobile — mide el ANCHO DEL CONTENEDOR (no window),
// porque dentro del canvas de Framer window.innerWidth es el del editor completo,
// no el del frame/dispositivo que se está diseñando.
function useIsMobile(containerRef: React.RefObject<HTMLElement | null>) {
    const [isMobile, setIsMobile] = useState(true)
    useEffect(() => {
        let ro: ResizeObserver | null = null
        let rafId: number
        let cancelled = false

        const measure = (w: number) => setIsMobile(w < 640)

        // El elemento del ref puede no existir aún en el primer tick (p.ej. mientras
        // el componente muestra un spinner de carga antes de montar el layout real).
        // Reintentamos en el siguiente frame hasta encontrarlo, evitando quedarnos
        // parados en el valor inicial para siempre.
        const tryAttach = () => {
            if (cancelled) return
            const el = containerRef.current
            if (!el) {
                rafId = requestAnimationFrame(tryAttach)
                return
            }
            measure(el.getBoundingClientRect().width)
            if (typeof ResizeObserver === "undefined") {
                const handler = () => measure(el.getBoundingClientRect().width)
                window.addEventListener("resize", handler)
                ;(tryAttach as any)._cleanup = () =>
                    window.removeEventListener("resize", handler)
                return
            }
            ro = new ResizeObserver((entries) => {
                for (const entry of entries) measure(entry.contentRect.width)
            })
            ro.observe(el)
        }
        tryAttach()

        return () => {
            cancelled = true
            if (rafId) cancelAnimationFrame(rafId)
            if (ro) ro.disconnect()
            if ((tryAttach as any)._cleanup) (tryAttach as any)._cleanup()
        }
    }, [containerRef])
    return isMobile
}

import { createClient } from "@/lib/supabase/client"
import { translateAuthError } from "@/lib/auth-errors"

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ougvtcmqmcutrexxrxvz.supabase.co")
const supabase = createClient()

interface SessionShape {
    user: any
    access_token: string
}

async function getSession(): Promise<SessionShape | null> {
    const { data } = await supabase.auth.getSession()
    if (!data.session) return null
    return { user: data.session.user, access_token: data.session.access_token }
}

async function validateSessionInBackground(
    _current: SessionShape,
    onUpdate: (s: SessionShape | null) => void
) {
    const { data } = await supabase.auth.getUser()
    if (data.user) return
    const { data: r } = await supabase.auth.refreshSession()
    if (r.session)
        onUpdate({ user: r.session.user, access_token: r.session.access_token })
    else onUpdate(null)
}

async function getProgress(
    userId: string,
    _token: string
): Promise<Record<string, any>> {
    const { data, error } = await supabase
        .from("test_progress")
        .select("*")
        .eq("user_id", userId)
    if (error || !Array.isArray(data)) return {}
    const map: Record<string, any> = {}
    data.forEach((r: any) => {
        map[r.test_id] = r
    })
    return map
}

function signInWithGoogle() {
    supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
    })
}

async function signInWithEmail(
    email: string,
    password: string
): Promise<SessionShape | { error: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (error || !data.session)
        return { error: translateAuthError(error?.message || "Error") }
    return { user: data.user, access_token: data.session.access_token }
}

async function signUpWithEmail(
    email: string,
    password: string,
    nombre: string
): Promise<SessionShape | { needsConfirmation: true } | { error: string }> {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: nombre },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
    })
    if (error) return { error: translateAuthError(error.message) }
    if (data.session)
        return { user: data.user, access_token: data.session.access_token }
    return { needsConfirmation: true }
}

async function resetPassword(
    email: string
): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    if (error) return { ok: false, error: translateAuthError(error.message) }
    return { ok: true }
}

async function signOut(_token: string) {
    await supabase.auth.signOut()
}

// ─── TIPOS ────────────────────────────────────────────────────────────────────
type Tab = "auxiliares" | "administrativos" | "gestion" | "superiores"
type AuthMode = "login" | "register" | "forgot"
interface Test {
    id: string
    titulo: string
    preguntas: number
    tema?: string
}
interface Bloque {
    bloque: string
    tests: Test[]
}
interface UserProfile {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
}

// ─── PALETA POR ESCALA ────────────────────────────────────────────────────────
const SCALE_COLORS: Record<Tab, string> = {
    auxiliares: "#3B82F6", // azul
    administrativos: "#E8543A", // naranja
    gestion: "#10B981", // verde esmeralda
    superiores: "#8B5CF6", // violeta
}

// Color de acento del header — fijo en todas las pantallas, NUNCA cambia con la escala
const HEADER_ACCENT = "#E8E6E1"

// ─── TEMA OSCURO / CLARO ─────────────────────────────────────────────────────
function getTheme(dark: boolean) {
    return {
        bg: dark ? "#0B0C10" : "#F5F5F7",
        surface: dark ? "rgba(25,26,35,0.7)" : "rgba(255,255,255,0.85)",
        surfaceHover: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        border: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)",
        borderStrong: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)",
        textMain: dark ? "#FFFFFF" : "#111111",
        textMuted: dark ? "#8B8D98" : "#666870",
        overlay: "rgba(0,0,0,0.6)",
        modalBg: dark ? "#141520" : "#FFFFFF",
        success: "#22C55E",
        // Navbar: negro neutro fijo, independiente del modo claro/oscuro
        navBg: "rgba(10,10,12,0.96)",
        navText: "#FFFFFF",
        navTextMuted: "rgba(255,255,255,0.62)",
        navBorder: "rgba(255,255,255,0.10)",
        navSurface: "rgba(255,255,255,0.07)",
        navSurfaceHover: "rgba(255,255,255,0.12)",
    }
}

// ─── BLOQUE COMÚN ─────────────────────────────────────────────────────────────
const BLOQUE_COMUN: Bloque[] = [
    {
        bloque: "Parte General — Temas 1 al 14 (comunes a todas las escalas)",
        tests: [
            {
                id: "c01",
                tema: "T.1",
                titulo: "T.1 — Constitución: derechos, libertades y garantías. Deberes. Principios constitucionales de la actuación administrativa",
                preguntas: 30,
            },
            {
                id: "c02",
                tema: "T.2",
                titulo: "T.2 — Organización territorial del Estado. Comunidades Autónomas y Estatutos de Autonomía",
                preguntas: 30,
            },
            {
                id: "c03",
                tema: "T.3",
                titulo: "T.3 — Derecho de la Unión Europea. Instituciones. Reglamentos y Directivas",
                preguntas: 25,
            },
            {
                id: "c04",
                tema: "T.4",
                titulo: "T.4 — Organización política y administrativa de la CAE. Parlamento, Gobierno Vasco y Lehendakari",
                preguntas: 30,
            },
            {
                id: "c05",
                tema: "T.5",
                titulo: "T.5 — Distribución de competencias CAE–Territorios Históricos. Concierto Económico. Instituciones Locales",
                preguntas: 30,
            },
            {
                id: "c06",
                tema: "T.6",
                titulo: "T.6 — Normativa vasca para la igualdad de mujeres y hombres y vidas libres de violencia machista en la CAE",
                preguntas: 25,
            },
            {
                id: "c07",
                tema: "T.7",
                titulo: "T.7 — Administración Electrónica. Sede electrónica. Identificación y firma electrónica. Archivo y expediente electrónico",
                preguntas: 30,
            },
            {
                id: "c08",
                tema: "T.8",
                titulo: "T.8 — Normalización lingüística del euskera en la Administración. Perfil lingüístico. Planes de normalización",
                preguntas: 25,
            },
            {
                id: "c09",
                tema: "T.9",
                titulo: "T.9 — Personal al servicio de las AAPP vascas: clases, derechos, código ético y régimen disciplinario",
                preguntas: 30,
            },
            {
                id: "c10",
                tema: "T.10",
                titulo: "T.10 — Protección de datos personales: conceptos, principios, bases de legitimación, derechos y categorías especiales",
                preguntas: 30,
            },
            {
                id: "c11",
                tema: "T.11",
                titulo: "T.11 — Prevención de riesgos laborales: derechos, obligaciones, principios preventivos, plan y evaluación de riesgos",
                preguntas: 25,
            },
            {
                id: "c12",
                tema: "T.12",
                titulo: "T.12 — Prevención de riesgos laborales: pantallas de visualización de datos",
                preguntas: 15,
            },
            {
                id: "c13",
                tema: "T.13",
                titulo: "T.13 — Nociones básicas de primeros auxilios",
                preguntas: 15,
            },
            {
                id: "c14",
                tema: "T.14",
                titulo: "T.14 — Gobierno abierto: concepto y principios. Acceso a la información pública y buen gobierno",
                preguntas: 20,
            },
            {
                id: "c00",
                titulo: "Simulacro Parte General — Temas 1 al 14",
                preguntas: 50,
            },
        ],
    },
]

const dbAuxiliares: Bloque[] = [
    ...BLOQUE_COMUN,
    {
        bloque: "Organización y Gestión Administrativa — Temas 15 al 19",
        tests: [
            {
                id: "aux15",
                tema: "T.15",
                titulo: "T.15 — Gestión de la documentación en archivos de oficina. Sistema de Archivo de la CAE",
                preguntas: 25,
            },
            {
                id: "aux16",
                tema: "T.16",
                titulo: "T.16 — Registros electrónicos de entrada y salida en la CAE. Interoperabilidad",
                preguntas: 25,
            },
            {
                id: "aux17",
                tema: "T.17",
                titulo: "T.17 — El documento y el expediente administrativo. Copias, certificaciones y acceso",
                preguntas: 25,
            },
            {
                id: "aux18",
                tema: "T.18",
                titulo: "T.18 — Legalizaciones de firmas. Validación en la administración electrónica. Certificado electrónico",
                preguntas: 20,
            },
            {
                id: "aux19",
                tema: "T.19",
                titulo: "T.19 — Administración educativa no universitaria. Principios generales y organización de centros docentes",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Atención a la Ciudadanía — Temas 20 al 23",
        tests: [
            {
                id: "aux20",
                tema: "T.20",
                titulo: "T.20 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos y registros",
                preguntas: 25,
            },
            {
                id: "aux21",
                tema: "T.21",
                titulo: "T.21 — La ciudadanía como destinataria de servicios. Atención al público, quejas, discapacidad e interculturalidad",
                preguntas: 25,
            },
            {
                id: "aux22",
                tema: "T.22",
                titulo: "T.22 — Comunicación escrita en la Administración. Lenguaje administrativo no sexista",
                preguntas: 25,
            },
            {
                id: "aux23",
                tema: "T.23",
                titulo: "T.23 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Procedimiento Administrativo — Temas 24 al 30",
        tests: [
            {
                id: "aux24",
                tema: "T.24",
                titulo: "T.24 — Fuentes del derecho administrativo. Jerarquía normativa. Principio de legalidad",
                preguntas: 25,
            },
            {
                id: "aux25",
                tema: "T.25",
                titulo: "T.25 — La organización administrativa. Órganos administrativos y colegiados",
                preguntas: 20,
            },
            {
                id: "aux26",
                tema: "T.26",
                titulo: "T.26 — El acto administrativo: concepto, eficacia. Silencio. Nulidad y anulabilidad",
                preguntas: 30,
            },
            {
                id: "aux27",
                tema: "T.27",
                titulo: "T.27 — Procedimiento administrativo: principios. Personas interesadas. Abstención y recusación",
                preguntas: 25,
            },
            {
                id: "aux28",
                tema: "T.28",
                titulo: "T.28 — Fases del procedimiento administrativo",
                preguntas: 25,
            },
            {
                id: "aux29",
                tema: "T.29",
                titulo: "T.29 — Revisión de los actos: recursos, revisión de oficio y rectificación de errores",
                preguntas: 25,
            },
            {
                id: "aux30",
                tema: "T.30",
                titulo: "T.30 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Correspondencia y Paquetería — Tema 31",
        tests: [
            {
                id: "aux31",
                tema: "T.31",
                titulo: "T.31 — Correspondencia y paquetería. Certificados, acuses de recibo, telegramas, notificaciones",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Simulacros Auxiliares Administrativos",
        tests: [
            {
                id: "sim_aux1",
                titulo: "Simulacro completo — 60 preguntas",
                preguntas: 60,
            },
            {
                id: "sim_aux2",
                titulo: "Simulacro Parte General + Procedimiento — 50 preguntas",
                preguntas: 50,
            },
        ],
    },
]

const dbAdministrativos: Bloque[] = [
    ...BLOQUE_COMUN,
    {
        bloque: "Presupuestos y Contabilidad — Temas 15 y 16",
        tests: [
            {
                id: "adm15",
                tema: "T.15",
                titulo: "T.15 — Presupuesto de gastos: fases de ejecución, créditos, residuos y fondos anticipados",
                preguntas: 30,
            },
            {
                id: "adm16",
                tema: "T.16",
                titulo: "T.16 — Presupuesto de ingresos: tipos, fases y devolución de ingresos indebidos",
                preguntas: 25,
            },
        ],
    },
    {
        bloque: "Personal — Temas 17 y 18",
        tests: [
            {
                id: "adm17",
                tema: "T.17",
                titulo: "T.17 — Estructura del empleo en las AAPP vascas. Relación de puestos de trabajo. Cuerpos y Escalas",
                preguntas: 25,
            },
            {
                id: "adm18",
                tema: "T.18",
                titulo: "T.18 — Acceso al empleo público y provisión de puestos. Situaciones administrativas",
                preguntas: 25,
            },
        ],
    },
    {
        bloque: "Organización y Gestión Administrativa — Temas 19 al 22",
        tests: [
            {
                id: "adm19",
                tema: "T.19",
                titulo: "T.19 — Gestión de la documentación en archivos de oficina. Sistema de Archivo de la CAE",
                preguntas: 25,
            },
            {
                id: "adm20",
                tema: "T.20",
                titulo: "T.20 — Registros electrónicos de entrada y salida en la CAE. Interoperabilidad",
                preguntas: 25,
            },
            {
                id: "adm21",
                tema: "T.21",
                titulo: "T.21 — El documento y el expediente administrativo. Copias, certificaciones y acceso",
                preguntas: 25,
            },
            {
                id: "adm22",
                tema: "T.22",
                titulo: "T.22 — Legalizaciones de firmas. Validación en la administración electrónica. Certificado electrónico",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Atención a la Ciudadanía — Temas 23 al 26",
        tests: [
            {
                id: "adm23",
                tema: "T.23",
                titulo: "T.23 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos y registros",
                preguntas: 25,
            },
            {
                id: "adm24",
                tema: "T.24",
                titulo: "T.24 — La ciudadanía como destinataria de servicios. Información, atención al público y quejas",
                preguntas: 25,
            },
            {
                id: "adm25",
                tema: "T.25",
                titulo: "T.25 — Comunicación escrita. Lenguaje administrativo no sexista. Tipos de documentos escritos",
                preguntas: 25,
            },
            {
                id: "adm26",
                tema: "T.26",
                titulo: "T.26 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Biblioteca — Tema 27",
        tests: [
            {
                id: "adm27",
                tema: "T.27",
                titulo: "T.27 — Centros de documentación y bibliotecas: concepto, funciones y redes bibliotecarias",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Procedimiento Administrativo — Temas 28 al 34",
        tests: [
            {
                id: "adm28",
                tema: "T.28",
                titulo: "T.28 — Fuentes del derecho administrativo. Jerarquía normativa. Principio de legalidad",
                preguntas: 25,
            },
            {
                id: "adm29",
                tema: "T.29",
                titulo: "T.29 — La organización administrativa. Órganos administrativos y colegiados",
                preguntas: 20,
            },
            {
                id: "adm30",
                tema: "T.30",
                titulo: "T.30 — El acto administrativo: concepto, eficacia. Silencio. Nulidad y anulabilidad",
                preguntas: 30,
            },
            {
                id: "adm31",
                tema: "T.31",
                titulo: "T.31 — Procedimiento administrativo: principios. Personas interesadas. Abstención y recusación",
                preguntas: 25,
            },
            {
                id: "adm32",
                tema: "T.32",
                titulo: "T.32 — Fases del procedimiento administrativo",
                preguntas: 25,
            },
            {
                id: "adm33",
                tema: "T.33",
                titulo: "T.33 — Revisión de los actos: recursos, revisión de oficio y rectificación de errores",
                preguntas: 25,
            },
            {
                id: "adm34",
                tema: "T.34",
                titulo: "T.34 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Simulacros Administrativos",
        tests: [
            {
                id: "sim_adm1",
                titulo: "Simulacro completo — 70 preguntas",
                preguntas: 70,
            },
            {
                id: "sim_adm2",
                titulo: "Simulacro Parte General + Procedimiento — 50 preguntas",
                preguntas: 50,
            },
        ],
    },
]

const dbGestion: Bloque[] = [
    ...BLOQUE_COMUN,
    {
        bloque: "Organización y Gestión Administrativa — Temas 15 y 16",
        tests: [
            {
                id: "ges15",
                tema: "T.15",
                titulo: "T.15 — El documento y el expediente administrativo. Copias, certificaciones y acceso",
                preguntas: 25,
            },
            {
                id: "ges16",
                tema: "T.16",
                titulo: "T.16 — Legalizaciones de firmas. Validación en la administración electrónica. Certificado electrónico",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Atención a la Ciudadanía — Temas 17 al 19",
        tests: [
            {
                id: "ges17",
                tema: "T.17",
                titulo: "T.17 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos y registros",
                preguntas: 25,
            },
            {
                id: "ges18",
                tema: "T.18",
                titulo: "T.18 — Comunicación escrita en la Administración. Lenguaje administrativo no sexista",
                preguntas: 25,
            },
            {
                id: "ges19",
                tema: "T.19",
                titulo: "T.19 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Procedimiento Administrativo — Temas 20 al 26",
        tests: [
            {
                id: "ges20",
                tema: "T.20",
                titulo: "T.20 — Fuentes del derecho administrativo. Jerarquía normativa. Principio de legalidad",
                preguntas: 25,
            },
            {
                id: "ges21",
                tema: "T.21",
                titulo: "T.21 — La organización administrativa. Órganos administrativos y colegiados",
                preguntas: 20,
            },
            {
                id: "ges22",
                tema: "T.22",
                titulo: "T.22 — El acto administrativo: concepto, eficacia. Silencio. Nulidad y anulabilidad",
                preguntas: 30,
            },
            {
                id: "ges23",
                tema: "T.23",
                titulo: "T.23 — Procedimiento administrativo: principios. Personas interesadas. Abstención y recusación",
                preguntas: 25,
            },
            {
                id: "ges24",
                tema: "T.24",
                titulo: "T.24 — Fases del procedimiento administrativo",
                preguntas: 25,
            },
            {
                id: "ges25",
                tema: "T.25",
                titulo: "T.25 — Revisión de los actos: recursos, revisión de oficio y rectificación de errores",
                preguntas: 25,
            },
            {
                id: "ges26",
                tema: "T.26",
                titulo: "T.26 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Temario Específico — Próximamente",
        tests: [
            {
                id: "ges_pronto",
                titulo: "Temario específico — En preparación, disponible próximamente",
                preguntas: 0,
            },
        ],
    },
    {
        bloque: "Simulacros Técnicos de Gestión",
        tests: [
            {
                id: "sim_ges1",
                titulo: "Simulacro Parte General — 60 preguntas",
                preguntas: 60,
            },
        ],
    },
]

const dbSuperiores: Bloque[] = [
    ...BLOQUE_COMUN,
    {
        bloque: "Organización y Gestión Administrativa — Temas 15 y 16",
        tests: [
            {
                id: "sup15",
                tema: "T.15",
                titulo: "T.15 — El documento y el expediente administrativo. Copias, certificaciones y acceso",
                preguntas: 25,
            },
            {
                id: "sup16",
                tema: "T.16",
                titulo: "T.16 — Legalizaciones de firmas. Validación electrónica. Certificado electrónico",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Atención a la Ciudadanía — Temas 17 al 19",
        tests: [
            {
                id: "sup17",
                tema: "T.17",
                titulo: "T.17 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos",
                preguntas: 25,
            },
            {
                id: "sup18",
                tema: "T.18",
                titulo: "T.18 — Comunicación escrita. Lenguaje administrativo no sexista. Tipos de documentos",
                preguntas: 25,
            },
            {
                id: "sup19",
                tema: "T.19",
                titulo: "T.19 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Procedimiento Administrativo General — Temas 20 al 26",
        tests: [
            {
                id: "sup20",
                tema: "T.20",
                titulo: "T.20 — Fuentes del derecho administrativo. Jerarquía normativa",
                preguntas: 25,
            },
            {
                id: "sup21",
                tema: "T.21",
                titulo: "T.21 — La organización administrativa. Órganos administrativos y colegiados",
                preguntas: 20,
            },
            {
                id: "sup22",
                tema: "T.22",
                titulo: "T.22 — El acto administrativo: concepto, eficacia. Silencio. Nulidad y anulabilidad",
                preguntas: 30,
            },
            {
                id: "sup23",
                tema: "T.23",
                titulo: "T.23 — Procedimiento administrativo: principios. Personas interesadas. Abstención y recusación",
                preguntas: 25,
            },
            {
                id: "sup24",
                tema: "T.24",
                titulo: "T.24 — Fases del procedimiento administrativo",
                preguntas: 25,
            },
            {
                id: "sup25",
                tema: "T.25",
                titulo: "T.25 — Revisión de los actos: recursos, revisión de oficio y rectificación de errores",
                preguntas: 25,
            },
            {
                id: "sup26",
                tema: "T.26",
                titulo: "T.26 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Temario Específico — Organización y Derecho (E.T.1–E.T.14)",
        tests: [
            {
                id: "supe01",
                tema: "E.T.1",
                titulo: "E.T.1 — Derechos y deberes fundamentales. Garantías de libertades y derechos",
                preguntas: 30,
            },
            {
                id: "supe02",
                tema: "E.T.2",
                titulo: "E.T.2 — Organización política de la CAE. Competencias Estado–CAE–Municipios",
                preguntas: 30,
            },
            {
                id: "supe03",
                tema: "E.T.3",
                titulo: "E.T.3 — Administración General de la CAE e Institucional. Gobierno Vasco. Potestad reglamentaria",
                preguntas: 30,
            },
            {
                id: "supe04",
                tema: "E.T.4",
                titulo: "E.T.4 — Fuentes del derecho administrativo. Jerarquía normativa. Autotutela",
                preguntas: 25,
            },
            {
                id: "supe05",
                tema: "E.T.5",
                titulo: "E.T.5 — Órganos administrativos. Competencia. Delegación. Avocación",
                preguntas: 25,
            },
            {
                id: "supe06",
                tema: "E.T.6",
                titulo: "E.T.6 — Encomienda de gestión. Convenios interadministrativos",
                preguntas: 20,
            },
            {
                id: "supe07",
                tema: "E.T.7",
                titulo: "E.T.7 — Capacidad de obrar e interesados. Representación. Derechos en las relaciones con la Administración",
                preguntas: 25,
            },
            {
                id: "supe08",
                tema: "E.T.8",
                titulo: "E.T.8 — El acto administrativo: producción, motivación. Notificación y publicación",
                preguntas: 30,
            },
            {
                id: "supe09",
                tema: "E.T.9",
                titulo: "E.T.9 — Nulidad y anulabilidad. Conversión, conservación y convalidación",
                preguntas: 25,
            },
            {
                id: "supe10",
                tema: "E.T.10",
                titulo: "E.T.10 — Revisión de actos. Recursos. Revisión de oficio. Rectificación de errores",
                preguntas: 25,
            },
            {
                id: "supe11",
                tema: "E.T.11",
                titulo: "E.T.11 — Obligación de resolver. Silencio administrativo. Términos y plazos",
                preguntas: 25,
            },
            {
                id: "supe12",
                tema: "E.T.12",
                titulo: "E.T.12 — Procedimiento: principios. Interesados y sus derechos. Abstención y recusación",
                preguntas: 25,
            },
            {
                id: "supe13",
                tema: "E.T.13",
                titulo: "E.T.13 — Fases del procedimiento: iniciación, instrucción, finalización y ejecución",
                preguntas: 30,
            },
            {
                id: "supe14",
                tema: "E.T.14",
                titulo: "E.T.14 — Responsabilidad patrimonial: principios y procedimiento",
                preguntas: 25,
            },
        ],
    },
    {
        bloque: "Temario Específico — Función Pública Vasca (E.T.15–E.T.29)",
        tests: [
            {
                id: "supe15",
                tema: "E.T.15",
                titulo: "E.T.15 — La estructuración de las organizaciones. Diseño organizacional",
                preguntas: 25,
            },
            {
                id: "supe16",
                tema: "E.T.16",
                titulo: "E.T.16 — Cultura de la organización. Cambio organizativo. Modernización administrativa",
                preguntas: 25,
            },
            {
                id: "supe17",
                tema: "E.T.17",
                titulo: "E.T.17 — Administración General de la CAE: estructura y organización. Valoración de puestos",
                preguntas: 25,
            },
            {
                id: "supe18",
                tema: "E.T.18",
                titulo: "E.T.18 — Gobernanza pública. Atención multicanal a la ciudadanía. Tramitación electrónica",
                preguntas: 25,
            },
            {
                id: "supe19",
                tema: "E.T.19",
                titulo: "E.T.19 — Expediente electrónico. Identificación y firma electrónica. Archivo electrónico",
                preguntas: 25,
            },
            {
                id: "supe20",
                tema: "E.T.20",
                titulo: "E.T.20 — Servicio público. Formas de gestión: gestión directa y concesión",
                preguntas: 20,
            },
            {
                id: "supe21",
                tema: "E.T.21",
                titulo: "E.T.21 — Contratos del Sector Público: tipos, adjudicación y extinción",
                preguntas: 30,
            },
            {
                id: "supe22",
                tema: "E.T.22",
                titulo: "E.T.22 — Autorizaciones y licencias administrativas. Potestad sancionadora",
                preguntas: 25,
            },
            {
                id: "supe23",
                tema: "E.T.23",
                titulo: "E.T.23 — Personal empleado público vasco: clases, estructura, RPT y Oferta de Empleo",
                preguntas: 30,
            },
            {
                id: "supe24",
                tema: "E.T.24",
                titulo: "E.T.24 — Adquisición y pérdida de la condición de empleado público. Selección. Bolsas de trabajo",
                preguntas: 25,
            },
            {
                id: "supe25",
                tema: "E.T.25",
                titulo: "E.T.25 — Provisión definitiva y temporal de puestos. Concursos, libre designación",
                preguntas: 25,
            },
            {
                id: "supe26",
                tema: "E.T.26",
                titulo: "E.T.26 — Derechos y deberes del empleado público vasco. Retribuciones. Régimen disciplinario",
                preguntas: 30,
            },
            {
                id: "supe27",
                tema: "E.T.27",
                titulo: "E.T.27 — Personal laboral: selección, derechos, contrato laboral, provisión y movilidad",
                preguntas: 25,
            },
            {
                id: "supe28",
                tema: "E.T.28",
                titulo: "E.T.28 — Seguridad Social: régimen general, afiliación, cotización y prestaciones",
                preguntas: 25,
            },
            {
                id: "supe29",
                tema: "E.T.29",
                titulo: "E.T.29 — El perfil lingüístico. Euskera en procesos de selección y provisión",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Hacienda General del País Vasco (E.T.30–E.T.36)",
        tests: [
            {
                id: "supe30",
                tema: "E.T.30",
                titulo: "E.T.30 — Hacienda General del País Vasco: concepto, normativa. Presupuestos Generales de Euskadi",
                preguntas: 30,
            },
            {
                id: "supe31",
                tema: "E.T.31",
                titulo: "E.T.31 — Presupuestos Generales CAE: ámbito, estructura funcional, orgánica y territorial",
                preguntas: 30,
            },
            {
                id: "supe32",
                tema: "E.T.32",
                titulo: "E.T.32 — Procedimiento de elaboración presupuestaria. Modificaciones presupuestarias",
                preguntas: 25,
            },
            {
                id: "supe33",
                tema: "E.T.33",
                titulo: "E.T.33 — Ejecución de los presupuestos: ejecución del ingreso y del gasto",
                preguntas: 25,
            },
            {
                id: "supe34",
                tema: "E.T.34",
                titulo: "E.T.34 — Contabilidad Pública CAE: marco conceptual, principios contables",
                preguntas: 25,
            },
            {
                id: "supe35",
                tema: "E.T.35",
                titulo: "E.T.35 — Régimen de ayudas y subvenciones de la CAE: normas y competencia",
                preguntas: 25,
            },
            {
                id: "supe36",
                tema: "E.T.36",
                titulo: "E.T.36 — Subvenciones: objeto, requisitos, beneficiarios y reintegro",
                preguntas: 25,
            },
        ],
    },
    {
        bloque: "Gestión Pública Avanzada (E.T.37–E.T.47)",
        tests: [
            {
                id: "supe37",
                tema: "E.T.37",
                titulo: "E.T.37 — Gestión Pública Avanzada. Sistemas y tipos de contraste",
                preguntas: 25,
            },
            {
                id: "supe38",
                tema: "E.T.38",
                titulo: "E.T.38 — Los procesos en la Administración. Gestión por procesos: diseño, mapa y mejora",
                preguntas: 25,
            },
            {
                id: "supe39",
                tema: "E.T.39",
                titulo: "E.T.39 — Gestión por objetivos basada en datos. Indicadores. Gobernanza de datos en la CAE",
                preguntas: 25,
            },
            {
                id: "supe40",
                tema: "E.T.40",
                titulo: "E.T.40 — Planificación y gestión de proyectos: ciclo de vida, dirección y evaluación",
                preguntas: 25,
            },
            {
                id: "supe41",
                tema: "E.T.41",
                titulo: "E.T.41 — Satisfacción de la ciudadanía y calidad de los servicios públicos",
                preguntas: 20,
            },
            {
                id: "supe42",
                tema: "E.T.42",
                titulo: "E.T.42 — Gobierno Abierto: transparencia, protección de datos. Comisión Vasca de Acceso",
                preguntas: 25,
            },
            {
                id: "supe43",
                tema: "E.T.43",
                titulo: "E.T.43 — Igualdad: evaluación de impacto de género. Medidas en contratación y subvenciones",
                preguntas: 25,
            },
            {
                id: "supe44",
                tema: "E.T.44",
                titulo: "E.T.44 — Protección de datos: derechos, RAT, DPD. Autoridad Vasca de Protección de Datos",
                preguntas: 25,
            },
            {
                id: "supe45",
                tema: "E.T.45",
                titulo: "E.T.45 — Departamentos del Gobierno Vasco con competencias en políticas educativas",
                preguntas: 20,
            },
            {
                id: "supe46",
                tema: "E.T.46",
                titulo: "E.T.46 — Departamentos con competencias en comercio y consumo. Kontsumobide",
                preguntas: 20,
            },
            {
                id: "supe47",
                tema: "E.T.47",
                titulo: "E.T.47 — Docencia y formación en salud. Acreditación de tutores. Formación especializada",
                preguntas: 20,
            },
        ],
    },
    {
        bloque: "Simulacros Técnicos Superiores",
        tests: [
            {
                id: "sim_sup1",
                titulo: "Simulacro Parte General — 50 preguntas",
                preguntas: 50,
            },
            {
                id: "sim_sup2",
                titulo: "Simulacro Específico Parte I (E.T.1–E.T.14) — 60 preguntas",
                preguntas: 60,
            },
            {
                id: "sim_sup3",
                titulo: "Simulacro Específico Parte II (E.T.15–E.T.29) — 60 preguntas",
                preguntas: 60,
            },
            {
                id: "sim_sup4",
                titulo: "Simulacro Hacienda General del País Vasco — 40 preguntas",
                preguntas: 40,
            },
            {
                id: "sim_sup5",
                titulo: "Simulacro Gestión Pública Avanzada — 40 preguntas",
                preguntas: 40,
            },
            {
                id: "sim_sup6",
                titulo: "Simulacro completo Cuerpo Superior — 90 preguntas",
                preguntas: 90,
            },
        ],
    },
]

// ─── SUBCOMPONENTES ───────────────────────────────────────────────────────────
function GoogleIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            style={{ flexShrink: 0 }}
        >
            <path
                fill="#EA4335"
                d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.6 0 6.6 5.5 2.7 13.5l7.9 6.1C12.5 13.3 17.8 9.5 24 9.5z"
            />
            <path
                fill="#34A853"
                d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 6.9-10.1 6.9-17z"
            />
            <path
                fill="#FBBC05"
                d="M10.6 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.1.7-4.5l-7.9-6.1A23.8 23.8 0 0 0 0 24c0 3.9.9 7.6 2.7 10.8l7.9-6.2z"
            />
            <path
                fill="#4285F4"
                d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.3 2.3-6.2 0-11.5-4.2-13.4-9.9l-7.9 6.2C6.6 42.5 14.6 48 24 48z"
            />
        </svg>
    )
}

function SunIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
    )
}
function MoonIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    )
}
function SearchIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    )
}

// ─── MODAL DE AUTENTICACIÓN ───────────────────────────────────────────────────
function AuthModal({
    visible,
    onClose,
    accent,
    dark,
    onSuccess,
}: {
    visible: boolean
    onClose: () => void
    accent: string
    dark: boolean
    onSuccess: (user: any, token: string) => void
}) {
    const t = getTheme(dark)
    const [mode, setMode] = useState<AuthMode>("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [nombre, setNombre] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    function reset() {
        setEmail("")
        setPassword("")
        setNombre("")
        setError("")
        setSuccess("")
    }

    async function handleGoogle() {
        setLoading(true)
        signInWithGoogle()
    }

    async function handleSubmit() {
        setError("")
        setSuccess("")
        setLoading(true)
        try {
            if (mode === "login") {
                const res = await signInWithEmail(email, password)
                if ("error" in res) {
                    setError(translateAuthError(res.error))
                    return
                }
                onSuccess(res.user, res.access_token)
                onClose()
            } else if (mode === "register") {
                if (!nombre.trim()) {
                    setError("Introduce tu nombre")
                    setLoading(false)
                    return
                }
                if (!email.includes("@") || !email.includes(".")) {
                    setError("Introduce un email válido")
                    setLoading(false)
                    return
                }
                if (password.length < 6) {
                    setError("La contraseña debe tener al menos 6 caracteres")
                    setLoading(false)
                    return
                }
                const res = await signUpWithEmail(email, password, nombre)
                if ("needsConfirmation" in res) {
                    setSuccess(
                        "¡Cuenta creada! Revisa tu email para confirmarla y luego inicia sesión."
                    )
                    return
                }
                if ("error" in res) {
                    setError(translateAuthError(res.error))
                    return
                }
                onSuccess(res.user, res.access_token)
                onClose()
            } else {
                const res = await resetPassword(email)
                if (!res.ok) {
                    setError(translateAuthError(res.error || "Error"))
                    return
                }
                setSuccess("Email enviado. Revisa tu bandeja de entrada.")
            }
        } finally {
            setLoading(false)
        }
    }

    if (!visible) return null

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "11px 14px",
        borderRadius: "10px",
        border: `1.5px solid ${t.border}`,
        background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        color: t.textMain,
        fontSize: "14px",
        fontFamily: "Inter, system-ui, sans-serif",
        outline: "none",
        boxSizing: "border-box",
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                background: t.overlay,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                    background: t.modalBg,
                    border: `1px solid ${t.borderStrong}`,
                    borderRadius: "20px",
                    padding: "36px 32px",
                    maxWidth: "400px",
                    width: "100%",
                    position: "relative",
                }}
            >
                {/* Cerrar */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        color: t.textMuted,
                        cursor: "pointer",
                        fontSize: "20px",
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>

                {/* Logo / título */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div
                        style={{
                            fontSize: "22px",
                            fontWeight: 800,
                            letterSpacing: "-0.5px",
                            color: t.textMain,
                            marginBottom: "4px",
                        }}
                    >
                        gain<span style={{ color: accent }}>ditu</span>.
                    </div>
                    <div style={{ fontSize: "14px", color: t.textMuted }}>
                        {mode === "login"
                            ? "Accede a tu cuenta"
                            : mode === "register"
                              ? "Crea tu cuenta gratis"
                              : "Recuperar contraseña"}
                    </div>
                </div>

                {/* Google */}
                {mode !== "forgot" && (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGoogle}
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "10px",
                                border: `1.5px solid ${t.border}`,
                                background: dark
                                    ? "rgba(255,255,255,0.07)"
                                    : "rgba(0,0,0,0.04)",
                                color: t.textMain,
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                marginBottom: "16px",
                                fontFamily: "Inter, system-ui, sans-serif",
                            }}
                        >
                            <GoogleIcon />
                            {loading ? "Redirigiendo…" : "Continuar con Google"}
                        </motion.button>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "16px",
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    height: "1px",
                                    background: t.border,
                                }}
                            />
                            <span
                                style={{ fontSize: "12px", color: t.textMuted }}
                            >
                                o con email
                            </span>
                            <div
                                style={{
                                    flex: 1,
                                    height: "1px",
                                    background: t.border,
                                }}
                            />
                        </div>
                    </>
                )}

                {/* Formulario */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    {mode === "register" && (
                        <input
                            placeholder="Tu nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            style={inputStyle}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />
                    {mode !== "forgot" && (
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSubmit()
                            }
                        />
                    )}
                </div>

                {error && (
                    <p
                        style={{
                            color: "#EF4444",
                            fontSize: "12px",
                            margin: "10px 0 0",
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </p>
                )}
                {success && (
                    <p
                        style={{
                            color: "#22C55E",
                            fontSize: "12px",
                            margin: "10px 0 0",
                            textAlign: "center",
                        }}
                    >
                        {success}
                    </p>
                )}

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "13px",
                        borderRadius: "10px",
                        background: accent,
                        color: "#fff",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: "pointer",
                        marginTop: "14px",
                        fontFamily: "Inter, system-ui, sans-serif",
                    }}
                >
                    {loading
                        ? "…"
                        : mode === "login"
                          ? "Entrar"
                          : mode === "register"
                            ? "Crear cuenta"
                            : "Enviar email de recuperación"}
                </motion.button>

                {/* Links de cambio de modo */}
                <div
                    style={{
                        marginTop: "16px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: t.textMuted,
                    }}
                >
                    {mode === "login" && (
                        <>
                            <button
                                onClick={() => {
                                    setMode("register")
                                    reset()
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: accent,
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                }}
                            >
                                Crear cuenta nueva
                            </button>
                            {" · "}
                            <button
                                onClick={() => {
                                    setMode("forgot")
                                    reset()
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: t.textMuted,
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    textDecoration: "underline",
                                }}
                            >
                                ¿Olvidaste la contraseña?
                            </button>
                        </>
                    )}
                    {mode === "register" && (
                        <>
                            ¿Ya tienes cuenta?{" "}
                            <button
                                onClick={() => {
                                    setMode("login")
                                    reset()
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: accent,
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                }}
                            >
                                Entrar
                            </button>
                        </>
                    )}
                    {mode === "forgot" && (
                        <button
                            onClick={() => {
                                setMode("login")
                                reset()
                            }}
                            style={{
                                background: "none",
                                border: "none",
                                color: accent,
                                cursor: "pointer",
                                fontSize: "12px",
                                fontFamily: "Inter, system-ui, sans-serif",
                            }}
                        >
                            ← Volver al login
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

// ─── POPUP PREMIUM ────────────────────────────────────────────────────────────
function PremiumPopup({
    visible,
    onClose,
    accent,
    dark,
    user,
    onShowAuth,
}: {
    visible: boolean
    onClose: () => void
    accent: string
    dark: boolean
    user?: any
    onShowAuth?: () => void
}) {
    const t = getTheme(dark)
    if (!visible) return null
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1100,
                padding: "20px",
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                style={{
                    background: t.modalBg,
                    border: `1px solid ${accent}40`,
                    borderRadius: "24px",
                    padding: "40px 32px",
                    maxWidth: "420px",
                    width: "100%",
                    textAlign: "center",
                    position: "relative",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        color: t.textMuted,
                        cursor: "pointer",
                        fontSize: "20px",
                    }}
                >
                    ×
                </button>

                <div style={{ fontSize: "36px", marginBottom: "12px" }}></div>
                <div
                    style={{
                        fontSize: "11px",
                        color: accent,
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                    }}
                >
                    Contenido exclusivo
                </div>
                <h2
                    style={{
                        fontSize: "22px",
                        fontWeight: 800,
                        color: t.textMain,
                        marginBottom: "8px",
                        letterSpacing: "-0.5px",
                    }}
                >
                    Has llegado al límite gratuito
                </h2>
                <p
                    style={{
                        fontSize: "14px",
                        color: t.textMuted,
                        lineHeight: 1.6,
                        marginBottom: "20px",
                    }}
                >
                    Para continuar con los exámenes oficiales y simulacros,
                    activa tu acceso completo.
                </p>

                {/* Oferta urgencia */}
                <div
                    style={{
                        background: `${accent}12`,
                        border: `1px solid ${accent}30`,
                        borderRadius: "14px",
                        padding: "16px",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "11px",
                            color: accent,
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            marginBottom: "6px",
                        }}
                    >
                        OFERTA — Próximas 48h
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "center",
                            gap: "10px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "16px",
                                color: t.textMuted,
                                textDecoration: "line-through",
                            }}
                        >
                            40€
                        </span>
                        <span
                            style={{
                                fontSize: "32px",
                                fontWeight: 900,
                                color: accent,
                            }}
                        >
                            24,99€
                        </span>
                    </div>
                    <div
                        style={{
                            fontSize: "12px",
                            color: t.textMuted,
                            marginTop: "4px",
                        }}
                    >
                        Acceso completo · Pago único · Sin suscripción
                    </div>
                </div>

                {/* Lo que incluye */}
                <div style={{ textAlign: "left", marginBottom: "20px" }}>
                    {[
                        "Exámenes oficiales convocatorias anteriores",
                        "Simulacros cronometrados con penalización real",
                        "Técnicas de estudio y memorización",
                        "Actualizaciones gratuitas hasta el examen",
                        "Comunidad privada de opositores vascos",
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                fontSize: "13px",
                                color: t.textMain,
                                padding: "5px 0",
                                borderBottom:
                                    i < 4 ? `1px solid ${t.border}` : "none",
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>

                {user ? (
                    /* Usuario logueado → botón de pago directo */
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                            window.location.href = getStripeUrl()
                        }}
                        style={{
                            width: "100%",
                            padding: "15px",
                            borderRadius: "12px",
                            background: accent,
                            color: "#fff",
                            border: "none",
                            fontSize: "15px",
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "Inter, system-ui, sans-serif",
                            marginBottom: "12px",
                        }}
                    >
                        Conseguir acceso completo →
                    </motion.button>
                ) : (
                    /* Sin sesión → primero hay que registrarse */
                    <div>
                        <div
                            style={{
                                background: `${accent}10`,
                                border: `1px solid ${accent}25`,
                                borderRadius: "10px",
                                padding: "12px 16px",
                                marginBottom: "12px",
                                fontSize: "13px",
                                color: t.textMain,
                                lineHeight: 1.5,
                            }}
                        >
                            Necesitas una cuenta para completar la compra y
                            activar tu acceso premium.
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                onClose()
                                onShowAuth && onShowAuth()
                            }}
                            style={{
                                width: "100%",
                                padding: "15px",
                                borderRadius: "12px",
                                background: accent,
                                color: "#fff",
                                border: "none",
                                fontSize: "15px",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "Inter, system-ui, sans-serif",
                                marginBottom: "8px",
                            }}
                        >
                            Crear cuenta gratis →
                        </motion.button>
                        <div style={{ fontSize: "12px", color: t.textMuted }}>
                            Ya tengo cuenta —{" "}
                            <button
                                onClick={() => {
                                    onClose()
                                    onShowAuth && onShowAuth()
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: accent,
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    textDecoration: "underline",
                                }}
                            >
                                iniciar sesión
                            </button>
                        </div>
                    </div>
                )}

                {user && (
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: t.textMuted,
                            fontSize: "12px",
                            cursor: "pointer",
                            fontFamily: "Inter, system-ui, sans-serif",
                            textDecoration: "underline",
                        }}
                    >
                        Ahora no, seguir con el plan gratuito
                    </button>
                )}
            </motion.div>
        </motion.div>
    )
}

// ─── SECCIÓN PREMIUM BLOQUEADA ────────────────────────────────────────────────
function SeccionPremium({
    accent,
    dark,
    onUnlock,
    onStartTest,
    isMobile,
}: {
    accent: string
    dark: boolean
    onUnlock: () => void
    onStartTest: (id: string) => void
    isMobile: boolean
}) {
    const t = getTheme(dark)

    // En mobile: solo 2 cards borrosas. En desktop: 6
    const bloqueadas = isMobile
        ? ["Simulacro IVAP Oficial 2024"]
        : [
              "Examen Bilbao — Auxiliares Administrativos 2022",
              "Simulacro IVAP Oficial 2024 — 90 preguntas",
              "Examen Osakidetza — Gestión 2023",
              "Simulacro Cronometrado — 45 min presión real",
              "Examen Vitoria-Gasteiz — Superiores 2022",
              "Examen Barakaldo — Administrativos 2021",
          ]

    return (
        <div style={{ marginBottom: "40px" }}>
            <h4
                style={{
                    margin: "0 0 6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    borderLeft: `3px solid ${accent}`,
                    paddingLeft: "12px",
                    color: t.textMain,
                }}
            >
                Exámenes Oficiales y Simulacros
            </h4>
            <p
                style={{
                    fontSize: "12px",
                    color: t.textMuted,
                    paddingLeft: "15px",
                    marginBottom: "16px",
                }}
            >
                Exámenes reales de convocatorias anteriores + simulacros con
                penalización oficial del IVAP.
            </p>

            {/* Contenedor único, sin doble marco */}
            <div
                style={{
                    position: "relative",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: `1px solid ${accent}35`,
                    background: dark
                        ? "rgba(12,13,20,0.97)"
                        : "rgba(248,248,252,0.97)",
                }}
            >
                {/* Grid de cards */}
                <div
                    style={{
                        padding: "16px 16px 0",
                        display: "grid",
                        gridTemplateColumns: isMobile
                            ? "1fr 1fr"
                            : "repeat(auto-fill,minmax(220px,1fr))",
                        gap: "8px",
                        maxHeight: isMobile ? "120px" : "none",
                        overflow: "hidden",
                    }}
                >
                    {/* Sopela — visible y clicable */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStartTest("premium_demo")}
                        style={{
                            background: t.surface,
                            border: `1.5px solid ${accent}60`,
                            borderRadius: "10px",
                            padding: "12px",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "2px",
                                background: accent,
                            }}
                        />
                        <div
                            style={{
                                fontSize: "9px",
                                fontWeight: 700,
                                color: accent,
                                letterSpacing: "0.5px",
                                marginBottom: "5px",
                                paddingTop: "4px",
                            }}
                        >
                            OFICIAL
                        </div>
                        <div
                            style={{
                                fontSize: isMobile ? "12px" : "13px",
                                fontWeight: 700,
                                color: t.textMain,
                                lineHeight: 1.3,
                                marginBottom: "6px",
                            }}
                        >
                            Examen Sopela
                            {isMobile ? "" : " — Administrativos 2023"}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "10px",
                                    color: t.textMuted,
                                    background: dark
                                        ? "rgba(0,0,0,0.4)"
                                        : "rgba(0,0,0,0.07)",
                                    padding: "2px 6px",
                                    borderRadius: "100px",
                                }}
                            >
                                60 preg.
                            </span>
                            <span
                                style={{
                                    color: accent,
                                    fontSize: "12px",
                                    fontWeight: 700,
                                }}
                            >
                                →
                            </span>
                        </div>
                    </motion.div>

                    {/* Cards borrosas */}
                    {bloqueadas.map((titulo, i) => (
                        <div
                            key={i}
                            style={{
                                background: t.surface,
                                border: `1px solid ${t.border}`,
                                borderRadius: "10px",
                                padding: "12px",
                                filter: isMobile ? "blur(2px)" : "blur(3px)",
                                userSelect: "none",
                                opacity: isMobile ? 0.35 : 0.4,
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "9px",
                                    fontWeight: 700,
                                    color: accent,
                                }}
                            >
                                OFICIAL
                            </div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: t.textMain,
                                    lineHeight: 1.3,
                                }}
                            >
                                {titulo}
                            </div>
                            <span
                                style={{ fontSize: "10px", color: t.textMuted }}
                            >
                                60 preg.
                            </span>
                        </div>
                    ))}
                </div>

                {/* Bloque oferta superpuesto */}
                <div
                    style={{
                        padding: isMobile ? "14px 16px 18px" : "28px 24px",
                        background: dark
                            ? "linear-gradient(to bottom, transparent 0%, rgba(10,11,18,0.96) 20%, rgba(10,11,18,1) 100%)"
                            : "linear-gradient(to bottom, transparent 0%, rgba(248,248,252,0.96) 20%, rgba(248,248,252,1) 100%)",
                        marginTop: isMobile ? "-36px" : "-80px",
                        position: "relative",
                    }}
                >
                    {isMobile ? (
                        // ── MOBILE: layout compacto vertical ──
                        <div style={{ textAlign: "center" }}>
                            <div
                                style={{
                                    fontSize: "9px",
                                    color: accent,
                                    fontWeight: 700,
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    marginBottom: "4px",
                                }}
                            >
                                Oferta · Próximas 48h
                            </div>
                            <h3
                                style={{
                                    fontSize: "15px",
                                    fontWeight: 800,
                                    color: t.textMain,
                                    margin: "0 0 8px",
                                    lineHeight: 1.2,
                                }}
                            >
                                Accede a todos los exámenes y simulacros
                            </h3>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: "8px",
                                    justifyContent: "center",
                                    marginBottom: "10px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "12px",
                                        color: t.textMuted,
                                        textDecoration: "line-through",
                                    }}
                                >
                                    40€
                                </span>
                                <span
                                    style={{
                                        fontSize: "26px",
                                        fontWeight: 900,
                                        color: accent,
                                        lineHeight: 1,
                                    }}
                                >
                                    24,99€
                                </span>
                                <span
                                    style={{
                                        fontSize: "10px",
                                        color: t.textMuted,
                                    }}
                                >
                                    pago único
                                </span>
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: `0 0 20px ${accent}50`,
                                }}
                                onClick={onUnlock}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "12px",
                                    background: accent,
                                    color: "#fff",
                                    border: "none",
                                    fontSize: "14px",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    marginBottom: "6px",
                                }}
                            >
                                Conseguir acceso →
                            </motion.button>
                            <div
                                style={{ fontSize: "10px", color: t.textMuted }}
                            >
                                Sin suscripción · Acceso de por vida
                            </div>
                        </div>
                    ) : (
                        // ── DESKTOP: layout horizontal ──
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "20px",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ flex: "1 1 240px" }}>
                                <div
                                    style={{
                                        fontSize: "10px",
                                        color: accent,
                                        fontWeight: 700,
                                        letterSpacing: "1px",
                                        textTransform: "uppercase",
                                        marginBottom: "8px",
                                    }}
                                >
                                    Oferta limitada · Próximas 48h
                                </div>
                                <h3
                                    style={{
                                        fontSize: "19px",
                                        fontWeight: 800,
                                        color: t.textMain,
                                        margin: "0 0 12px",
                                        letterSpacing: "-0.4px",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Accede a todos los exámenes
                                    <br />y simulacros oficiales
                                </h3>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "6px",
                                    }}
                                >
                                    {[
                                        "Exámenes oficiales",
                                        "Simulacros reales",
                                        "Técnicas de estudio",
                                        "Comunidad privada",
                                    ].map((item) => (
                                        <span
                                            key={item}
                                            style={{
                                                fontSize: "11px",
                                                color: dark
                                                    ? "rgba(255,255,255,0.65)"
                                                    : "rgba(0,0,0,0.6)",
                                                background: dark
                                                    ? "rgba(255,255,255,0.07)"
                                                    : "rgba(0,0,0,0.06)",
                                                padding: "4px 10px",
                                                borderRadius: "100px",
                                                border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                                            }}
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div
                                style={{
                                    flex: "0 1 210px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: "8px",
                                }}
                            >
                                <div style={{ textAlign: "right" }}>
                                    <span
                                        style={{
                                            fontSize: "13px",
                                            color: t.textMuted,
                                            textDecoration: "line-through",
                                            display: "block",
                                        }}
                                    >
                                        Precio normal 40€
                                    </span>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: "6px",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "36px",
                                                fontWeight: 900,
                                                color: accent,
                                                lineHeight: 1,
                                            }}
                                        >
                                            24,99€
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "12px",
                                                color: t.textMuted,
                                            }}
                                        >
                                            pago único
                                        </span>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{
                                        scale: 1.04,
                                        boxShadow: `0 0 28px ${accent}55`,
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onUnlock}
                                    style={{
                                        width: "100%",
                                        padding: "14px 20px",
                                        borderRadius: "12px",
                                        background: accent,
                                        color: "#fff",
                                        border: "none",
                                        fontSize: "15px",
                                        fontWeight: 800,
                                        cursor: "pointer",
                                        fontFamily:
                                            "Inter, system-ui, sans-serif",
                                    }}
                                >
                                    Conseguir acceso →
                                </motion.button>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        color: t.textMuted,
                                        textAlign: "center",
                                        width: "100%",
                                    }}
                                >
                                    Sin suscripción · Acceso de por vida
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── PROGRESS BADGE ───────────────────────────────────────────────────────────
function ProgressBadge({ pct, accent }: { pct: number; accent: string }) {
    const color = pct >= 70 ? "#22C55E" : accent
    return (
        <span
            style={{
                fontSize: "10px",
                fontWeight: 700,
                color,
                background: `${color}18`,
                border: `1px solid ${color}30`,
                padding: "2px 7px",
                borderRadius: "100px",
            }}
        >
            {pct}%
        </span>
    )
}

// ─── TIRA ACADEMIAS ───────────────────────────────────────────────────────────
function TiraAcademias({ accent, dark }: { accent: string; dark: boolean }) {
    const t = getTheme(dark)
    return (
        <div
            style={{
                margin: "0 0 24px",
                padding: "16px 20px",
                borderRadius: "14px",
                background: `${accent}12`,
                border: `1.5px solid ${accent}35`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <div style={{ fontSize: "24px", flexShrink: 0 }}></div>
                <div>
                    <div
                        style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: t.textMain,
                            marginBottom: "2px",
                        }}
                    >
                        ¿Tienes academia de oposiciones?
                    </div>
                    <div
                        style={{
                            fontSize: "12px",
                            color: t.textMuted,
                            lineHeight: 1.4,
                        }}
                    >
                        Llega a opositores del Gobierno Vasco anunciándote en
                        Gainditu.
                    </div>
                </div>
            </div>
            <a
                href={`mailto:hola@gainditu.com?subject=Quiero anunciarme en Gainditu`}
                style={{
                    padding: "9px 18px",
                    borderRadius: "9px",
                    background: accent,
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 700,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                }}
            >
                Contactar →
            </a>
        </div>
    )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ dark, accent }: { dark: boolean; accent: string }) {
    const t = getTheme(dark)
    return (
        <footer
            style={{
                borderTop: `1px solid ${t.border}`,
                marginTop: "64px",
                backgroundColor: dark ? "#08090D" : "#EBEBED",
            }}
        >
            {/* Franja superior */}
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "48px 24px 36px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "36px",
                }}
            >
                {/* Marca */}
                <div>
                    <div
                        style={{
                            fontSize: "22px",
                            fontWeight: 800,
                            letterSpacing: "-0.5px",
                            color: t.textMain,
                            marginBottom: "10px",
                        }}
                    >
                        gain<span style={{ color: accent }}>ditu</span>.
                    </div>
                    <p
                        style={{
                            fontSize: "13px",
                            color: t.textMuted,
                            lineHeight: 1.6,
                            margin: "0 0 16px",
                        }}
                    >
                        Tests por tema oficial del IVAP para la OPE Gobierno
                        Vasco 2026.
                    </p>
                    <a
                        href="mailto:hola@gainditu.com"
                        style={{
                            fontSize: "13px",
                            color: accent,
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        hola@gainditu.com
                    </a>
                </div>

                {/* OPE 2026 */}
                <div>
                    <div
                        style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: t.textMuted,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            marginBottom: "14px",
                        }}
                    >
                        OPE 2026
                    </div>
                    {[
                        { label: "Auxiliares Administrativos", href: "/oposiciones/auxiliar-administrativo" },
                        { label: "Administrativos", href: "/oposiciones/administrativo" },
                        { label: "Técnicos de Gestión", href: "/oposiciones/tecnico-gestion" },
                        { label: "Técnicos Superiores", href: "/oposiciones/tecnico-superior" },
                        { label: "Exámenes Oficiales", href: "/payment" },
                    ].map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            style={{
                                display: "block",
                                fontSize: "13px",
                                color: t.textMuted,
                                textDecoration: "none",
                                marginBottom: "8px",
                                transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) =>
                                ((e.target as HTMLElement).style.color = accent)
                            }
                            onMouseLeave={(e) =>
                                ((e.target as HTMLElement).style.color =
                                    t.textMuted)
                            }
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Temario */}
                <div>
                    <div
                        style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: t.textMuted,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            marginBottom: "14px",
                        }}
                    >
                        Temario IVAP
                    </div>
                    {[
                        {
                            label: "T.1 — Constitución Española",
                            href: "/test?id=c01",
                        },
                        {
                            label: "T.4 — Organización CAE",
                            href: "/test?id=c04",
                        },
                        {
                            label: "T.5 — Concierto Económico",
                            href: "/test?id=c05",
                        },
                        {
                            label: "T.9 — Empleo público vasco",
                            href: "/test?id=c09",
                        },
                        { label: "Ley 39/2015", href: "/ley-39-2015" },
                    ].map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            style={{
                                display: "block",
                                fontSize: "13px",
                                color: t.textMuted,
                                textDecoration: "none",
                                marginBottom: "8px",
                                transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) =>
                                ((e.target as HTMLElement).style.color = accent)
                            }
                            onMouseLeave={(e) =>
                                ((e.target as HTMLElement).style.color =
                                    t.textMuted)
                            }
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Síguenos */}
                <div>
                    <div
                        style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: t.textMuted,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            marginBottom: "14px",
                        }}
                    >
                        Síguenos
                    </div>
                    <a
                        href="https://instagram.com/gainditu"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "13px",
                            color: t.textMuted,
                            textDecoration: "none",
                            marginBottom: "10px",
                            transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                            ((e.target as HTMLElement).style.color = accent)
                        }
                        onMouseLeave={(e) =>
                            ((e.target as HTMLElement).style.color =
                                t.textMuted)
                        }
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                        </svg>
                        @gainditu
                    </a>
                    <div
                        style={{
                            marginTop: "20px",
                            padding: "14px",
                            borderRadius: "10px",
                            background: `${accent}12`,
                            border: `1px solid ${accent}25`,
                        }}
                    >
                        <div
                            style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: accent,
                                marginBottom: "4px",
                            }}
                        >
                            OPE 2026
                        </div>
                        <div
                            style={{
                                fontSize: "12px",
                                color: t.textMuted,
                                lineHeight: 1.5,
                            }}
                        >
                            Convocatoria prevista
                            <br />
                            septiembre 2026
                        </div>
                    </div>
                </div>
            </div>

            {/* Franja inferior */}
            <div
                style={{
                    borderTop: `1px solid ${t.border}`,
                    padding: "16px 24px",
                }}
            >
                <div
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <div style={{ fontSize: "12px", color: t.textMuted }}>
                        © {new Date().getFullYear()} Gainditu · Todos los
                        derechos reservados
                    </div>
                    <div style={{ display: "flex", gap: "20px" }}>
                        <a
                            href="/privacidad"
                            style={{
                                fontSize: "12px",
                                color: t.textMuted,
                                textDecoration: "none",
                            }}
                        >
                            Política de privacidad
                        </a>
                        <a
                            href="/aviso-legal"
                            style={{
                                fontSize: "12px",
                                color: t.textMuted,
                                textDecoration: "none",
                            }}
                        >
                            Aviso legal
                        </a>
                        <a
                            href="/cookies"
                            style={{
                                fontSize: "12px",
                                color: t.textMuted,
                                textDecoration: "none",
                            }}
                        >
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
// ─── STRIPE URL CON EMAIL PREFILLED ──────────────────────────────────────────
const STRIPE_PAYMENT_LINK = "/payment"

function getStripeUrl(): string {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (!key || (!key.includes("supabase") && !key.includes("sb-")))
                continue
            const p = JSON.parse(localStorage.getItem(key) || "{}")
            const email = p?.user?.email || p?.currentSession?.user?.email
            if (email)
                return `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}`
        }
    } catch {}
    return STRIPE_PAYMENT_LINK
}

// ─── BOTÓN CON BORDE LED ANIMADO ─────────────────────────────────────────────
function LedButton({
    accent,
    dark,
    onClick,
    label,
    ledAngle,
}: {
    accent: string
    dark: boolean
    onClick: () => void
    label: string
    ledAngle: number
}) {
    const ledGradient = `conic-gradient(from ${ledAngle}deg at 50% 50%, ${accent} 0deg, #fff5 50deg, transparent 110deg, transparent 250deg, ${accent}88 310deg, ${accent} 360deg)`

    return (
        <div
            style={{
                position: "relative",
                borderRadius: "12px",
                padding: "2px",
                background: ledGradient,
                flexShrink: 0,
            }}
        >
            <motion.button
                whileHover={{ scale: 1.02, background: `${accent}25` }}
                whileTap={{ scale: 0.97 }}
                onClick={onClick}
                style={{
                    display: "block",
                    padding: "12px 24px",
                    borderRadius: "11px",
                    background: `${accent}18`,
                    color: "#fff",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "Inter, system-ui, sans-serif",
                    whiteSpace: "nowrap",
                }}
            >
                {label}
            </motion.button>
        </div>
    )
}

// ─── AVATAR DROPDOWN ─────────────────────────────────────────────────────────
function AvatarDropdown({
    user,
    accent,
    dark,
    onSignOut,
    open,
    setOpen,
    dropdownRef,
}: {
    user: any
    accent: string
    dark: boolean
    onSignOut?: () => void
    open: boolean
    setOpen: (v: boolean | ((p: boolean) => boolean)) => void
    dropdownRef: React.RefObject<HTMLDivElement | null>
}) {
    const t = getTheme(dark)
    const iniciales = (user.full_name ?? user.email ?? "OP")
        .substring(0, 2)
        .toUpperCase()
    const nombre =
        user.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Perfil"
    const items = [
        { label: "Mi progreso", href: "/perfil?tab=stats" },
        { label: "Mis exámenes", href: "/perfil?tab=examenes" },
        { label: "Mi historial", href: "/perfil?tab=historial" },
        { label: "Ajustes", href: "/perfil?tab=ajustes" },
    ]
    return (
        <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen((o) => !o)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    background: "none",
                    border: `1px solid ${open ? accent : t.border}`,
                    borderRadius: "100px",
                    padding: "3px 10px 3px 3px",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                }}
            >
                <div
                    style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                    }}
                >
                    {iniciales}
                </div>
                <span
                    style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: t.textMain,
                        whiteSpace: "nowrap",
                    }}
                >
                    {nombre}
                </span>
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    style={{
                        marginLeft: "2px",
                        transition: "transform 0.15s",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        flexShrink: 0,
                    }}
                >
                    <path
                        d="M2 3.5L5 6.5L8 3.5"
                        stroke={t.textMuted}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            right: 0,
                            minWidth: "190px",
                            zIndex: 200,
                            background: dark ? "#141520" : "#FFFFFF",
                            border: `1px solid ${t.border}`,
                            borderRadius: "14px",
                            boxShadow: dark
                                ? "0 8px 32px rgba(0,0,0,0.5)"
                                : "0 8px 32px rgba(0,0,0,0.12)",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                padding: "12px 14px 10px",
                                borderBottom: `1px solid ${t.border}`,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "11px",
                                    color: t.textMuted,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {user.email}
                            </div>
                        </div>
                        {items.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                style={{
                                    display: "block",
                                    padding: "10px 14px",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: t.textMain,
                                    textDecoration: "none",
                                    transition: "background 0.1s",
                                    borderBottom: `1px solid ${t.border}`,
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = dark
                                        ? "rgba(255,255,255,0.05)"
                                        : "rgba(0,0,0,0.04)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        "transparent")
                                }
                            >
                                {item.label}
                            </a>
                        ))}
                        <button
                            onClick={() => {
                                setOpen(false)
                                onSignOut && onSignOut()
                            }}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px 14px",
                                textAlign: "left",
                                background: "none",
                                border: "none",
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "#EF4444",
                                cursor: "pointer",
                                fontFamily: "Inter, system-ui, sans-serif",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                    "rgba(239,68,68,0.08)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    "transparent")
                            }
                        >
                            → Cerrar sesión
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function DashboardOPE(props: {
    onTestSelect?: (id: string) => void
}) {
    const [activeTab, setActiveTab] = useState<Tab>("administrativos")
    const [user, setUser] = useState<UserProfile | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [showAuth, setShowAuth] = useState(false)
    const [progress, setProgress] = useState<Record<string, any>>({})
    const [dark, setDark] = useState(true)
    const [search, setSearch] = useState("")
    const [showPremium, setShowPremium] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile(rootRef)
    const [showScrollTop, setShowScrollTop] = useState(false)
    // Estados subidos de SeccionPremium y LedButton (Framer no acepta useState en subcomponentes)
    const [ledAngle, setLedAngle] = useState(0)
    // Estados del AvatarDropdown (Framer no acepta useState en subcomponentes)
    const [avatarOpen, setAvatarOpen] = useState(false)
    const avatarRef = useRef<HTMLDivElement>(null)

    const accent = SCALE_COLORS[activeTab]

    // Seleccionar escala desde la URL (?escala=auxiliares|administrativos|gestion|superiores)
    useEffect(() => {
        try {
            const e = new URLSearchParams(window.location.search).get("escala")
            if (
                e === "auxiliares" ||
                e === "administrativos" ||
                e === "gestion" ||
                e === "superiores"
            )
                setActiveTab(e as Tab)
        } catch {}
    }, [])

    // Scroll-to-top: mostrar cuando >320px de scroll
    useEffect(() => {
        const handler = () => setShowScrollTop(window.scrollY > 320)
        window.addEventListener("scroll", handler, { passive: true })
        return () => window.removeEventListener("scroll", handler)
    }, [])

    // LED animado para SeccionPremium y LedButton
    useEffect(() => {
        let frame: number
        const tick = () => {
            setLedAngle((a) => (a + 0.9) % 360)
            frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [])

    // Cerrar dropdown avatar al hacer click fuera
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (
                avatarRef.current &&
                !avatarRef.current.contains(e.target as Node)
            )
                setAvatarOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])
    const t = getTheme(dark)

    const data =
        activeTab === "auxiliares"
            ? dbAuxiliares
            : activeTab === "administrativos"
              ? dbAdministrativos
              : activeTab === "gestion"
                ? dbGestion
                : dbSuperiores

    const tabs: { id: Tab; label: string }[] = [
        { id: "administrativos", label: "Administrativos" },
        { id: "auxiliares", label: "Auxiliares" },
        { id: "superiores", label: "Técnicos Superiores" },
        { id: "gestion", label: "Técnicos de Gestión" },
    ]

    useEffect(() => {
        getSession().then((session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    full_name: session.user.user_metadata?.full_name ?? null,
                    avatar_url: session.user.user_metadata?.avatar_url ?? null,
                })
                setToken(session.access_token)
                // Validar/refrescar en segundo plano, sin bloquear ni parpadear la UI
                validateSessionInBackground(session, (updated) => {
                    if (!updated) {
                        setUser(null)
                        setToken(null)
                        return
                    }
                    if (updated.access_token !== session.access_token) {
                        setUser({
                            id: updated.user.id,
                            email: updated.user.email,
                            full_name:
                                updated.user.user_metadata?.full_name ?? null,
                            avatar_url:
                                updated.user.user_metadata?.avatar_url ?? null,
                        })
                        setToken(updated.access_token)
                    }
                })
            }
            setAuthLoading(false)
        })
    }, [])

    useEffect(() => {
        if (!user || !token) return
        getProgress(user.id, token).then(setProgress)
    }, [user, token])

    // Filtrar tests por búsqueda
    const filteredData =
        search.trim() === ""
            ? data
            : data
                  .map((b) => ({
                      ...b,
                      tests: b.tests.filter(
                          (t) =>
                              t.titulo
                                  .toLowerCase()
                                  .includes(search.toLowerCase()) ||
                              (t.tema &&
                                  t.tema
                                      .toLowerCase()
                                      .includes(search.toLowerCase()))
                      ),
                  }))
                  .filter((b) => b.tests.length > 0)

    function handleStartTest(testId: string) {
        const color = encodeURIComponent(accent)
        window.location.href = `/test?id=${testId}&accent=${color}`
    }

    function handleAuthSuccess(user: any, token: string) {
        setUser({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null,
        })
        setToken(token)
        setShowAuth(false)
    }

    async function handleSignOut() {
        if (token) await signOut(token)
        setUser(null)
        setToken(null)
        setProgress({})
    }

    const completedCount = Object.keys(progress).length
    const avgPct =
        completedCount > 0
            ? Math.round(
                  Object.values(progress).reduce(
                      (a: number, p: any) => a + p.mejor_porcentaje,
                      0
                  ) / completedCount
              )
            : 0

    // Detectar si hay hash de OAuth en la URL antes de mostrar nada
    const hasOAuthHash =
        typeof window !== "undefined" &&
        window.location.hash.includes("access_token")

    if (authLoading) {
        return (
            <div
                ref={rootRef}
                style={{
                    width: "100%",
                    minHeight: "100vh",
                    backgroundColor: dark ? "transparent" : t.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "16px",
                    fontFamily: "Inter, system-ui, sans-serif",
                }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border: `3px solid ${t.border}`,
                        borderTopColor: accent,
                    }}
                />
                <div style={{ fontSize: "14px", color: t.textMuted }}>
                    {hasOAuthHash
                        ? "Iniciando sesión con Google…"
                        : "Cargando…"}
                </div>
            </div>
        )
    }

    return (
        <div
            ref={rootRef}
            style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: dark ? "transparent" : t.bg,
                color: t.textMain,
                fontFamily: "Inter, system-ui, sans-serif",
                boxSizing: "border-box",
                transition: "background 0.2s, color 0.2s",
            }}
        >

            {/* ── CONTENIDO ── */}
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "56px 24px 32px",
                }}
            >
                {/* HERO */}
                <section
                    style={{
                        display: "flex",
                        gap: "32px",
                        marginBottom: "52px",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                        position: "relative",
                    }}
                >
                    {/* Orbe flotante decorativo */}
                    <div
                        aria-hidden
                        className="float-slow"
                        style={{
                            position: "absolute",
                            top: "-40px",
                            right: "8%",
                            width: "260px",
                            height: "260px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle at 35% 30%, ${accent}55, ${accent}11 55%, transparent 72%)`,
                            filter: "blur(8px)",
                            pointerEvents: "none",
                            zIndex: 0,
                            transition: "background 0.4s",
                        }}
                    />
                    <div style={{ flex: "1 1 280px", position: "relative", zIndex: 1 }}>
                        <div
                            style={{
                                fontSize: "11px",
                                color: accent,
                                fontWeight: 700,
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                                marginBottom: "14px",
                                transition: "color 0.3s",
                            }}
                        >
                            OPE Gobierno Vasco · Eusko Jaurlaritza 2026
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            style={{
                                fontSize: "clamp(32px,5vw,52px)",
                                fontWeight: 800,
                                lineHeight: 1.08,
                                margin: "0 0 16px",
                                letterSpacing: "-2px",
                                color: t.textMain,
                            }}
                        >
                            Prepara tu plaza
                            <br />
                            <span
                                style={{
                                    color: accent,
                                    transition: "color 0.3s",
                                }}
                            >
                                en el Gobierno Vasco.
                            </span>
                        </motion.h1>
                        <p
                            style={{
                                color: t.textMuted,
                                fontSize: "16px",
                                margin: "0 0 8px",
                                lineHeight: 1.6,
                            }}
                        >
                            Tests por tema oficial del IVAP para la OPE 2026.
                        </p>
                        <div style={{ height: "24px" }} />
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                            }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    const el =
                                        document.getElementById("tests-section")
                                    if (el)
                                        el.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                    else handleStartTest("random")
                                }}
                                style={{
                                    padding: "12px 24px",
                                    borderRadius: "10px",
                                    background: accent,
                                    color: "#fff",
                                    border: "none",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    transition: "background 0.3s",
                                }}
                            >
                                Empieza gratis →
                            </motion.button>
                            <LedButton
                                accent={accent}
                                dark={dark}
                                onClick={() => setShowPremium(true)}
                                label="Ver acceso completo"
                                ledAngle={ledAngle}
                            />
                        </div>
                        {user && completedCount > 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "18px",
                                }}
                            >
                                <div
                                    style={{
                                        background: t.surface,
                                        border: `1px solid ${t.border}`,
                                        borderRadius: "10px",
                                        padding: "10px 16px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: 800,
                                            color: accent,
                                        }}
                                    >
                                        {completedCount}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "10px",
                                            color: t.textMuted,
                                        }}
                                    >
                                        tests hechos
                                    </div>
                                </div>
                                <div
                                    style={{
                                        background: t.surface,
                                        border: `1px solid ${t.border}`,
                                        borderRadius: "10px",
                                        padding: "10px 16px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: 800,
                                            color: "#22C55E",
                                        }}
                                    >
                                        {avgPct}%
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "10px",
                                            color: t.textMuted,
                                        }}
                                    >
                                        media de acierto
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card aleatorio */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStartTest("random")}
                        style={{
                            flex: "0 1 200px",
                            background: "transparent",
                            border: `1px solid ${t.border}`,
                            borderRadius: "14px",
                            padding: "16px 18px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            transition: "border-color 0.2s, background 0.2s",
                        }}
                        onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.background =
                                t.surfaceHover)
                        }
                        onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.background =
                                "transparent")
                        }
                    >
                        <div style={{ fontSize: "22px", flexShrink: 0 }}>
                            
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: t.textMain,
                                    marginBottom: "2px",
                                }}
                            >
                                Test aleatorio
                            </div>
                            <div
                                style={{ fontSize: "11px", color: t.textMuted }}
                            >
                                30 preguntas · Temario completo
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* BUSCADOR */}
                <div style={{ position: "relative", marginBottom: "20px" }}>
                    <div
                        style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: t.textMuted,
                            pointerEvents: "none",
                        }}
                    >
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar tema o test…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "11px 14px 11px 40px",
                            borderRadius: "12px",
                            border: `1.5px solid ${t.border}`,
                            background: t.surface,
                            color: t.textMain,
                            fontSize: "14px",
                            fontFamily: "Inter, system-ui, sans-serif",
                            outline: "none",
                            boxSizing: "border-box",
                            transition: "border-color 0.15s",
                        }}
                        onFocus={(e) => {
                            ;(e.target as HTMLElement).style.borderColor =
                                accent
                        }}
                        onBlur={(e) => {
                            ;(e.target as HTMLElement).style.borderColor =
                                t.border
                        }}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                color: t.textMuted,
                                cursor: "pointer",
                                fontSize: "16px",
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* TABS */}
                <div
                    style={{
                        display: "flex",
                        gap: "6px",
                        marginBottom: "18px",
                        borderBottom: `1px solid ${t.border}`,
                        paddingBottom: "12px",
                        flexWrap: "wrap",
                    }}
                >
                    {tabs.map((tab) => {
                        const tabColor = SCALE_COLORS[tab.id]
                        const active = activeTab === tab.id
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id)
                                    setSearch("")
                                }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "100px",
                                    background: active
                                        ? tabColor
                                        : "transparent",
                                    color: active ? "#fff" : t.textMuted,
                                    border: active
                                        ? "none"
                                        : `1px solid ${t.border}`,
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    transition: "all 0.2s",
                                }}
                            >
                                {tab.label}
                            </motion.button>
                        )
                    })}
                </div>

                {/* TIRA ACADEMIAS */}
                <TiraAcademias accent={accent} dark={dark} />

                {/* SECCIÓN PREMIUM */}
                <SeccionPremium
                    accent={accent}
                    dark={dark}
                    onUnlock={() => setShowPremium(true)}
                    onStartTest={handleStartTest}
                    isMobile={isMobile}
                />

                {/* TESTS */}
                <AnimatePresence mode="wait">
                    <motion.div
                        id="tests-section"
                        key={activeTab + search}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                    >
                        {filteredData.length === 0 ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px 20px",
                                    color: t.textMuted,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "32px",
                                        marginBottom: "8px",
                                    }}
                                >
                                    
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                    No hay tests que coincidan con "{search}"
                                </div>
                            </div>
                        ) : (
                            filteredData.map((bloque, idx) => (
                                <div key={idx} style={{ marginBottom: "36px" }}>
                                    <h4
                                        style={{
                                            margin: "0 0 14px",
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            borderLeft: `3px solid ${accent}`,
                                            paddingLeft: "12px",
                                            color: t.textMain,
                                            transition: "border-color 0.3s",
                                        }}
                                    >
                                        {bloque.bloque}
                                    </h4>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fill,minmax(270px,1fr))",
                                            gap: "10px",
                                        }}
                                    >
                                        {bloque.tests.map((test) => {
                                            const prog = progress[test.id]
                                            const sinPreguntas =
                                                test.preguntas === 0
                                            return (
                                                <motion.div
                                                    key={test.id}
                                                    whileHover={
                                                        !sinPreguntas
                                                            ? {
                                                                  scale: 1.02,
                                                                  y: -3,
                                                                  borderColor: `${accent}66`,
                                                                  boxShadow: `0 16px 40px -16px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.06)`,
                                                              }
                                                            : {}
                                                    }
                                                    whileTap={
                                                        !sinPreguntas
                                                            ? { scale: 0.98 }
                                                            : {}
                                                    }
                                                    onClick={() =>
                                                        !sinPreguntas &&
                                                        handleStartTest(test.id)
                                                    }
                                                    style={{
                                                        background: dark
                                                            ? "rgba(22,23,32,0.55)"
                                                            : t.surface,
                                                        backdropFilter:
                                                            "blur(14px) saturate(130%)",
                                                        WebkitBackdropFilter:
                                                            "blur(14px) saturate(130%)",
                                                        border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : t.border}`,
                                                        borderRadius: "16px",
                                                        padding: "15px",
                                                        cursor: sinPreguntas
                                                            ? "default"
                                                            : "pointer",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "7px",
                                                        position: "relative",
                                                        overflow: "hidden",
                                                        opacity: sinPreguntas
                                                            ? 0.4
                                                            : 1,
                                                        boxShadow: dark
                                                            ? "inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 30px -20px rgba(0,0,0,0.8)"
                                                            : "0 6px 18px -14px rgba(0,0,0,0.4)",
                                                        transition:
                                                            "background 0.15s",
                                                    }}
                                                >
                                                    {prog && (
                                                        <div
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                height: "3px",
                                                                width: `${prog.mejor_porcentaje}%`,
                                                                background:
                                                                    prog.mejor_porcentaje >=
                                                                    70
                                                                        ? "#22C55E"
                                                                        : accent,
                                                                transition:
                                                                    "width 0.4s, background 0.3s",
                                                            }}
                                                        />
                                                    )}
                                                    {test.tema && (
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "10px",
                                                                fontWeight: 700,
                                                                color: accent,
                                                                letterSpacing:
                                                                    "0.4px",
                                                                transition:
                                                                    "color 0.3s",
                                                            }}
                                                        >
                                                            {test.tema}
                                                        </div>
                                                    )}
                                                    <div
                                                        style={{
                                                            fontSize: "13px",
                                                            fontWeight: 600,
                                                            lineHeight: 1.35,
                                                            color: t.textMain,
                                                        }}
                                                    >
                                                        {test.titulo}
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "11px",
                                                                color: t.textMuted,
                                                                background: dark
                                                                    ? "rgba(0,0,0,0.4)"
                                                                    : "rgba(0,0,0,0.07)",
                                                                padding:
                                                                    "2px 8px",
                                                                borderRadius:
                                                                    "100px",
                                                            }}
                                                        >
                                                            {sinPreguntas
                                                                ? "Próximamente"
                                                                : `${test.preguntas} preguntas`}
                                                        </span>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: "6px",
                                                            }}
                                                        >
                                                            {prog && (
                                                                <ProgressBadge
                                                                    pct={Math.round(
                                                                        prog.mejor_porcentaje
                                                                    )}
                                                                    accent={
                                                                        accent
                                                                    }
                                                                />
                                                            )}
                                                            {!sinPreguntas && (
                                                                <span
                                                                    style={{
                                                                        color: accent,
                                                                        fontSize:
                                                                            "14px",
                                                                        transition:
                                                                            "color 0.3s",
                                                                    }}
                                                                >
                                                                    →
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>


            {/* SCROLL TO TOP */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{
                            scale: 1.08,
                            boxShadow: `0 0 20px ${accent}50`,
                        }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        aria-label="Volver arriba"
                        style={{
                            position: "fixed",
                            bottom: "24px",
                            right: "24px",
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: accent,
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 90,
                            boxShadow: `0 4px 16px rgba(0,0,0,0.3)`,
                            fontSize: "18px",
                            fontWeight: 700,
                            transition: "background 0.3s",
                        }}
                    >
                        ↑
                    </motion.button>
                )}
            </AnimatePresence>

            {/* MODALS */}
            <AnimatePresence>
                {showAuth && (
                    <AuthModal
                        visible={showAuth}
                        onClose={() => setShowAuth(false)}
                        accent={accent}
                        dark={dark}
                        onSuccess={handleAuthSuccess}
                    />
                )}
                {showPremium && (
                    <PremiumPopup
                        visible={showPremium}
                        onClose={() => setShowPremium(false)}
                        accent={accent}
                        dark={dark}
                        user={user}
                        onShowAuth={() => {
                            setShowPremium(false)
                            setShowAuth(true)
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
