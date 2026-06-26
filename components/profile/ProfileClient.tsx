"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { createClient } from "@/lib/supabase/client"

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ougvtcmqmcutrexxrxvz.supabase.co")
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_lfcfMDSYpIDWzy2CWufT_A_NfJbTimc")
const supabase = createClient()

// Caché de sesión síncrona poblada por supabase-js (que refresca el token solo).
let _token: string | null = null
let _user: any = null
if (typeof window !== "undefined") {
    supabase.auth.getSession().then(({ data }) => {
        _token = data.session?.access_token ?? null
        _user = data.session?.user ?? null
    })
    supabase.auth.onAuthStateChange((_e, session) => {
        _token = session?.access_token ?? null
        _user = session?.user ?? null
    })
}

function getSession(): { user: any; token: string } | null {
    if (_token && _user) return { user: _user, token: _token }
    return null
}

// Devuelve la sesión real (await) cuando la caché aún no está poblada.
async function getSessionAsync(): Promise<{ user: any; token: string } | null> {
    const cached = getSession()
    if (cached) return cached
    const { data } = await supabase.auth.getSession()
    if (!data.session) return null
    _token = data.session.access_token
    _user = data.session.user
    return { user: data.session.user, token: data.session.access_token }
}

async function refreshSession(): Promise<{ token: string; user: any } | null> {
    const { data } = await supabase.auth.refreshSession()
    if (data.session) {
        _token = data.session.access_token
        _user = data.session.user
        return { token: data.session.access_token, user: data.session.user }
    }
    return null
}

async function fetchWithAuth(
    url: string,
    token: string,
    options: RequestInit = {}
): Promise<Response> {
    let res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
        },
    })
    if (res.status === 401) {
        const refreshed = await refreshSession()
        if (refreshed) {
            res = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${refreshed.token}`,
                },
            })
        }
    }
    return res
}

function limpiarSesion(url: string) {
    supabase.auth.signOut().finally(() => {
        if (typeof window !== "undefined") window.location.href = url
    })
}

// Color de acento del header — fijo en todas las pantallas, NUNCA cambia con la escala
const HEADER_ACCENT = "#E8E6E1"

function getTheme(dark: boolean) {
    return {
        bg: dark ? "#0B0C10" : "#F5F5F7",
        surface: dark ? "rgba(25,26,35,0.7)" : "rgba(255,255,255,0.9)",
        border: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)",
        borderStrong: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.20)",
        textMain: dark ? "#FFFFFF" : "#111111",
        textMuted: dark ? "#8B8D98" : "#666870",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        glass: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
        // Navbar: negro neutro fijo, independiente del modo claro/oscuro
        navBg: "rgba(10,10,12,0.96)",
        navText: "#FFFFFF",
        navTextMuted: "rgba(255,255,255,0.62)",
        navBorder: "rgba(255,255,255,0.10)",
        navSurface: "rgba(255,255,255,0.07)",
    }
}

const SCALE_COLORS: Record<string, string> = {
    auxiliares: "#3B82F6",
    administrativos: "#E8543A",
    gestion: "#10B981",
    superiores: "#8B5CF6",
}
const ESCALAS = [
    { id: "auxiliares", label: "Auxiliar Administrativo" },
    { id: "administrativos", label: "Administrativo" },
    { id: "gestion", label: "Técnico de Gestión" },
    { id: "superiores", label: "Técnico Superior" },
]

// Exámenes premium disponibles
const TITULOS: Record<string, string> = {
    // ── BLOQUE COMÚN (temas 1-14, compartidos en las 4 escalas) ──────────────
    c00: "Simulacro Parte General — Temas 1 al 14",
    c01: "T.1 — Constitución: derechos, libertades y garantías. Deberes. Principios constitucionales de la actuación administrativa",
    c02: "T.2 — Organización territorial del Estado. Comunidades Autónomas y Estatutos de Autonomía",
    c03: "T.3 — Derecho de la Unión Europea. Instituciones. Reglamentos y Directivas",
    c04: "T.4 — Organización política y administrativa de la CAE. Parlamento, Gobierno Vasco y Lehendakari",
    c05: "T.5 — Distribución de competencias CAE–Territorios Históricos. Concierto Económico. Instituciones Locales",
    c06: "T.6 — Normativa vasca para la igualdad de mujeres y hombres y vidas libres de violencia machista en la CAE",
    c07: "T.7 — Administración Electrónica. Sede electrónica. Identificación y firma electrónica. Archivo y expediente electrónico",
    c08: "T.8 — Normalización lingüística del euskera en la Administración. Perfil lingüístico. Planes de normalización",
    c09: "T.9 — Personal al servicio de las AAPP vascas: clases, derechos, código ético y régimen disciplinario",
    c10: "T.10 — Protección de datos personales: conceptos, principios, bases de legitimación, derechos y categorías especiales",
    c11: "T.11 — Prevención de riesgos laborales: derechos, obligaciones, principios preventivos, plan y evaluación de riesgos",
    c12: "T.12 — Prevención de riesgos laborales: pantallas de visualización de datos",
    c13: "T.13 — Nociones básicas de primeros auxilios",
    c14: "T.14 — Gobierno abierto: concepto y principios. Acceso a la información pública y buen gobierno",

    // ── AUXILIARES ADMINISTRATIVOS ────────────────────────────────────────────
    aux15: "T.15 — Gestión de la documentación en archivos de oficina. Documentación electrónica. Sistema de Archivo de la CAE",
    aux16: "T.16 — Registros electrónicos de entrada y salida en la CAE. Sistema de intercambio registral. Interoperabilidad",
    aux17: "T.17 — El documento y el expediente administrativo. Copias, certificaciones y acceso al expediente",
    aux18: "T.18 — Legalizaciones de firmas. Validación en la administración electrónica. Certificado electrónico",
    aux19: "T.19 — Administración educativa no universitaria. Principios generales y organización de centros docentes",
    aux20: "T.20 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos y registros",
    aux21: "T.21 — La ciudadanía como destinataria de servicios. Atención al público, quejas, discapacidad e interculturalidad",
    aux22: "T.22 — Comunicación escrita en la Administración. Lenguaje administrativo no sexista. Tipos de documentos",
    aux23: "T.23 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
    aux24: "T.24 — Fuentes del derecho administrativo. Ley y reglamento. Jerarquía normativa. Principio de legalidad",
    aux25: "T.25 — La organización administrativa. Órganos administrativos. Órganos colegiados",
    aux26: "T.26 — El acto administrativo: concepto, producción, motivación y forma. Eficacia. Silencio. Nulidad y anulabilidad",
    aux27: "T.27 — Procedimiento administrativo: principios generales. Personas interesadas. Abstención y recusación",
    aux28: "T.28 — Fases del procedimiento administrativo",
    aux29: "T.29 — Revisión de los actos: recursos, revisión de oficio, revocación y rectificación de errores",
    aux30: "T.30 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",
    aux31: "T.31 — Correspondencia y paquetería. Certificados, acuses de recibo, telegramas, notificaciones y envíos oficiales",
    sim_aux1: "Simulacro completo Auxiliares Administrativos — 60 preguntas",
    sim_aux2: "Simulacro Parte General + Procedimiento — 50 preguntas",
    sim_aux3: "Test rápido Atención Ciudadanía + Documentos — 30 preguntas",

    // ── ADMINISTRATIVOS ───────────────────────────────────────────────────────
    adm15: "T.15 — Presupuesto de gastos: fases de ejecución, créditos, residuos de gastos y fondos anticipados",
    adm16: "T.16 — Presupuesto de ingresos: tipos, fases de ejecución y devolución de ingresos indebidos",
    adm17: "T.17 — Estructura y organización del empleo en las AAPP vascas. Relación de puestos de trabajo. Cuerpos y Escalas",
    adm18: "T.18 — Acceso al empleo público y provisión de puestos en las AAPP vascas. Situaciones administrativas",
    adm19: "T.19 — Gestión de la documentación en archivos de oficina. Sistema de Archivo de la CAE",
    adm20: "T.20 — Registros electrónicos de entrada y salida en la CAE. Interoperabilidad",
    adm21: "T.21 — El documento y el expediente administrativo. Copias, certificaciones y acceso",
    adm22: "T.22 — Legalizaciones de firmas. Validación en la administración electrónica. Certificado electrónico",
    adm23: "T.23 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos y registros",
    adm24: "T.24 — La ciudadanía como destinataria de servicios. Información, atención al público, quejas e interculturalidad",
    adm25: "T.25 — Comunicación escrita. Lenguaje administrativo no sexista. Tipos de documentos escritos",
    adm26: "T.26 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
    adm27: "T.27 — Centros de documentación y bibliotecas: concepto, funciones y servicios. Sistemas y redes bibliotecarias",
    adm28: "T.28 — Fuentes del derecho administrativo. Ley y reglamento. Jerarquía normativa. Principio de legalidad",
    adm29: "T.29 — La organización administrativa. Órganos administrativos. Órganos colegiados",
    adm30: "T.30 — El acto administrativo: concepto, producción, motivación y forma. Eficacia. Silencio. Nulidad y anulabilidad",
    adm31: "T.31 — Procedimiento administrativo: principios. Personas interesadas. Abstención y recusación",
    adm32: "T.32 — Fases del procedimiento administrativo",
    adm33: "T.33 — Revisión de los actos: recursos, revisión de oficio, revocación y rectificación de errores",
    adm34: "T.34 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",
    sim_adm1: "Simulacro completo Administrativos — 70 preguntas",
    sim_adm2: "Simulacro Parte General + Procedimiento — 50 preguntas",
    sim_adm3: "Test Presupuestos + Personal — 30 preguntas",

    // ── TÉCNICOS DE GESTIÓN ───────────────────────────────────────────────────
    ges15: "T.15 — El documento y el expediente administrativo. Copias, certificaciones y acceso al expediente",
    ges16: "T.16 — Legalizaciones de firmas. Validación en la administración electrónica. Certificado electrónico",
    ges17: "T.17 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos y registros",
    ges18: "T.18 — Comunicación escrita en la Administración. Lenguaje administrativo no sexista. Tipos de documentos",
    ges19: "T.19 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
    ges20: "T.20 — Fuentes del derecho administrativo. Ley y reglamento. Jerarquía normativa. Principio de legalidad",
    ges21: "T.21 — La organización administrativa. Órganos administrativos. Órganos colegiados",
    ges22: "T.22 — El acto administrativo: concepto, producción, motivación y forma. Eficacia. Silencio. Nulidad y anulabilidad",
    ges23: "T.23 — Procedimiento administrativo: principios. Personas interesadas. Abstención y recusación",
    ges24: "T.24 — Fases del procedimiento administrativo",
    ges25: "T.25 — Revisión de los actos: recursos, revisión de oficio, revocación y rectificación de errores",
    ges26: "T.26 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",
    ges_pronto: "Temario específico Técnicos de Gestión — En preparación",
    sim_ges1: "Simulacro Parte General Técnicos de Gestión — 60 preguntas",
    sim_ges2: "Simulacro Procedimiento Administrativo — 40 preguntas",

    // ── TÉCNICOS SUPERIORES — PARTE GENERAL ──────────────────────────────────
    sup15: "T.15 — El documento y el expediente administrativo. Copias, certificaciones y acceso",
    sup16: "T.16 — Legalizaciones de firmas. Validación electrónica. Certificado electrónico",
    sup17: "T.17 — Derechos de la ciudadanía en sus relaciones con las AAPP. Acceso a archivos",
    sup18: "T.18 — Comunicación escrita. Lenguaje administrativo no sexista. Tipos de documentos",
    sup19: "T.19 — Comunicación oral. Atención en persona y por teléfono. Comunicación no verbal",
    sup20: "T.20 — Fuentes del derecho administrativo. Ley y reglamento. Jerarquía normativa",
    sup21: "T.21 — La organización administrativa. Órganos administrativos. Órganos colegiados",
    sup22: "T.22 — El acto administrativo: concepto, producción, motivación y forma. Eficacia. Silencio. Nulidad y anulabilidad",
    sup23: "T.23 — Procedimiento administrativo: principios. Personas interesadas. Abstención y recusación",
    sup24: "T.24 — Fases del procedimiento administrativo",
    sup25: "T.25 — Revisión de los actos: recursos, revisión de oficio, revocación y rectificación de errores",
    sup26: "T.26 — La responsabilidad de las Administraciones Públicas, sus autoridades y personal",

    // ── TÉCNICOS SUPERIORES — TEMARIO ESPECÍFICO ─────────────────────────────
    supe01: "E.T.1 — Derechos y deberes fundamentales. Garantías de libertades y derechos",
    supe02: "E.T.2 — Organización política de la CAE. Competencias Estado–CAE–Municipios",
    supe03: "E.T.3 — Administración General de la CAE e Institucional. Gobierno Vasco. Potestad reglamentaria",
    supe04: "E.T.4 — Fuentes del derecho administrativo. Jerarquía normativa. Autotutela de la Administración",
    supe05: "E.T.5 — Órganos administrativos. Órganos colegiados. Competencia. Delegación. Avocación",
    supe06: "E.T.6 — Encomienda de gestión. Convenios interadministrativos",
    supe07: "E.T.7 — Capacidad de obrar e interesados. Representación. Derechos en las relaciones con la Administración",
    supe08: "E.T.8 — El acto administrativo: producción, contenido, motivación. Notificación y publicación",
    supe09: "E.T.9 — Nulidad y anulabilidad del acto administrativo. Conversión, conservación y convalidación",
    supe10: "E.T.10 — Revisión de los actos. Recursos. Revisión de oficio. Revocación. Rectificación de errores",
    supe11: "E.T.11 — Obligación de resolver. Suspensión y ampliación de plazos. Silencio administrativo. Términos y plazos",
    supe12: "E.T.12 — Procedimiento administrativo: principios. Interesados y sus derechos. Abstención y recusación",
    supe13: "E.T.13 — Fases del procedimiento: iniciación, ordenación, instrucción, finalización y ejecución. Tramitación simplificada",
    supe14: "E.T.14 — Responsabilidad patrimonial de la Administración: principios y procedimiento",
    supe15: "E.T.15 — La estructuración de las organizaciones. Diseño organizacional. Características de la Administración Pública",
    supe16: "E.T.16 — Cultura de la organización. Esquema de Mintzberg. Cambio organizativo. Modernización administrativa",
    supe17: "E.T.17 — Administración General de la CAE: estructura y organización. Dimensionamiento de plantilla. Valoración de puestos",
    supe18: "E.T.18 — Gobernanza pública. Atención integral y multicanal a la ciudadanía. Tramitación electrónica en la CAE",
    supe19: "E.T.19 — Expediente electrónico. Documentos. Copias. Identificación y firma electrónica. Archivo electrónico",
    supe20: "E.T.20 — Servicio público. Formas de gestión: gestión directa y concesión",
    supe21: "E.T.21 — Contratos del Sector Público: tipos, regulación armonizada, preparación, adjudicación y extinción",
    supe22: "E.T.22 — Autorizaciones y licencias administrativas. Potestad sancionadora: principios y procedimiento",
    supe23: "E.T.23 — Personal empleado público vasco: clases, estructura, RPT, Oferta de Empleo Público. Negociación colectiva",
    supe24: "E.T.24 — Adquisición y pérdida de la condición de empleado público. Selección. Bolsas de trabajo",
    supe25: "E.T.25 — Provisión definitiva y temporal de puestos. Concursos, libre designación y comisiones de servicios",
    supe26: "E.T.26 — Derechos y deberes del empleado público vasco. Retribuciones. Situaciones administrativas. Régimen disciplinario",
    supe27: "E.T.27 — Personal laboral: selección, derechos, contrato laboral, modalidades, provisión y movilidad",
    supe28: "E.T.28 — Seguridad Social: régimen general, afiliación, cotización, contingencias y prestaciones",
    supe29: "E.T.29 — El perfil lingüístico y su acreditación. Euskera en procesos de selección y provisión",
    supe30: "E.T.30 — Hacienda General del País Vasco: concepto, normativa, prerrogativas. Presupuestos Generales de Euskadi",
    supe31: "E.T.31 — Presupuestos Generales CAE: ámbito, estructura funcional, orgánica, económica y territorial",
    supe32: "E.T.32 — Procedimiento de elaboración presupuestaria. Modificaciones presupuestarias",
    supe33: "E.T.33 — Ejecución de los presupuestos: ejecución del ingreso y del gasto",
    supe34: "E.T.34 — Contabilidad Pública CAE: marco conceptual, principios contables y criterios de valoración",
    supe35: "E.T.35 — Régimen de ayudas y subvenciones de la CAE: normas reguladoras y competencia",
    supe36: "E.T.36 — Subvenciones: objeto, requisitos, beneficiarios, procedimientos de concesión y reintegro",
    supe37: "E.T.37 — Gestión Pública Avanzada. Sistemas, elementos y tipos de contraste: diagnóstico y contraste externo",
    supe38: "E.T.38 — Los procesos en la Administración. Gestión por procesos: diseño, mapa, mejora continua y reingeniería",
    supe39: "E.T.39 — Gestión por objetivos basada en datos. Indicadores. Gobernanza de datos en la Administración de la CAE",
    supe40: "E.T.40 — Planificación y gestión de proyectos: ciclo de vida, roles, dirección, riesgos, calidad y evaluación",
    supe41: "E.T.41 — Satisfacción de la ciudadanía y calidad de los servicios. Estudios de satisfacción. Técnicas de investigación social",
    supe42: "E.T.42 — Gobierno Abierto: transparencia, publicidad activa, protección de datos. Comisión Vasca de Acceso a la Información",
    supe43: "E.T.43 — Igualdad: organización institucional. Evaluación de impacto de género. Medidas en personal, contratación y subvenciones",
    supe44: "E.T.44 — Protección de datos: ejercicio de derechos. Registro de Actividades. DPD. Autoridad Vasca de Protección de Datos",
    supe45: "E.T.45 — Departamentos del Gobierno Vasco con competencias en políticas educativas",
    supe46: "E.T.46 — Departamentos con competencias en comercio y consumo. Kontsumobide-Instituto Vasco de Consumo",
    supe47: "E.T.47 — Docencia y formación en salud. Acreditación de tutores. Formación especializada y continuada",

    // ── SIMULACROS TÉCNICOS SUPERIORES ───────────────────────────────────────
    sim_sup1: "Simulacro Parte General Técnicos Superiores — 50 preguntas",
    sim_sup2: "Simulacro Específico Parte I (E.T.1–E.T.14) — 60 preguntas",
    sim_sup3: "Simulacro Específico Parte II (E.T.15–E.T.29) — 60 preguntas",
    sim_sup4: "Simulacro Hacienda General del País Vasco — 40 preguntas",
    sim_sup5: "Simulacro Gestión Pública Avanzada — 40 preguntas",
    sim_sup6: "Simulacro completo Cuerpo Superior — 90 preguntas",

    // ── ALEATORIO ─────────────────────────────────────────────────────────────
    random: "Test Aleatorio — OPE Gobierno Vasco 2026",
    premium_demo: "Examen Sopela — Administrativos 2023",
}

const EXAMENES_PREMIUM = [
    {
        id: "premium_demo",
        titulo: "Examen Sopela — Administrativos 2023",
        preguntas: 60,
        escala: "administrativos",
        badge: "OFICIAL",
    },
    {
        id: "sim_adm1",
        titulo: "Simulacro completo Administrativos",
        preguntas: 70,
        escala: "administrativos",
        badge: "SIMULACRO",
    },
    {
        id: "sim_aux1",
        titulo: "Simulacro completo Auxiliares",
        preguntas: 60,
        escala: "auxiliares",
        badge: "SIMULACRO",
    },
    {
        id: "sim_ges1",
        titulo: "Simulacro Técnicos de Gestión",
        preguntas: 60,
        escala: "gestion",
        badge: "SIMULACRO",
    },
    {
        id: "sim_sup6",
        titulo: "Simulacro completo Cuerpo Superior",
        preguntas: 90,
        escala: "superiores",
        badge: "SIMULACRO",
    },
    {
        id: "sim_sup2",
        titulo: "Simulacro Específico Parte I (E.T.1–14)",
        preguntas: 60,
        escala: "superiores",
        badge: "SIMULACRO",
    },
]

function SunIcon() {
    return (
        <svg
            width="15"
            height="15"
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
            width="15"
            height="15"
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
function IconCheck({
    size = 14,
    color = "currentColor",
}: {
    size?: number
    color?: string
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
function IconRefresh({
    size = 14,
    color = "currentColor",
}: {
    size?: number
    color?: string
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
    )
}

function formatFecha(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    } catch {
        return iso
    }
}
function calcularRacha(resultados: any[]): number {
    if (!resultados.length) return 0
    const fechas = [
        ...new Set(
            resultados.map((r) => new Date(r.completado_at).toDateString())
        ),
    ]
        .map((d) => new Date(d))
        .sort((a, b) => b.getTime() - a.getTime())
    let racha = 0,
        fecha = new Date()
    fecha.setHours(0, 0, 0, 0)
    for (const f of fechas) {
        const diff = Math.round((fecha.getTime() - f.getTime()) / 86400000)
        if (diff > 1) break
        racha++
        fecha = f
    }
    return racha
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
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
            {/* Avatar botón */}
            <button
                onClick={() => setOpen((o) => !o)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    background: "none",
                    border: `1px solid ${open ? accent : t.navBorder}`,
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
                        color: t.navText,
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
                        stroke={t.navTextMuted}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* Dropdown panel */}
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
                        {/* Email header */}
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

                        {/* Items de perfil */}
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

                        {/* Salir */}
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
                                transition: "background 0.1s",
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

function Navbar({
    accent: _scaleAccent,
    dark,
    onToggleDark,
    homeUrl,
    user,
    onSignOut,
    mobileOpen,
    setMobileOpen,
    isMobile,
    avatarOpen,
    setAvatarOpen,
    avatarRef,
}: {
    accent: string
    dark: boolean
    onToggleDark: () => void
    homeUrl: string
    user?: any
    onSignOut?: () => void
    mobileOpen: boolean
    setMobileOpen: (v: boolean) => void
    isMobile: boolean
    avatarOpen: boolean
    setAvatarOpen: (v: boolean | ((p: boolean) => boolean)) => void
    avatarRef: React.RefObject<HTMLDivElement | null>
}) {
    const t = getTheme(dark)
    const accent = HEADER_ACCENT // el acento del header SIEMPRE es fijo, ignora el prop dinámico de escala
    const links = [
        {
            label: "Fechas OPE",
            href: "/fechas-opes",
        },
        { label: "Ley 39/2015", href: "/ley-39-2015" },
        { label: "Constitución", href: "/constitucion" },
    ]
    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backdropFilter: "blur(16px)",
                backgroundColor: t.navBg,
                borderBottom: `1px solid ${t.navBorder}`,
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "0 20px",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                }}
            >
                <a
                    href={homeUrl}
                    style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        letterSpacing: "-0.5px",
                        textDecoration: "none",
                        color: t.navText,
                        flexShrink: 0,
                    }}
                >
                    gain<span style={{ color: accent }}>ditu</span>.
                </a>
                {!isMobile && (
                    <div
                        style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_self"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: t.navTextMuted,
                                    textDecoration: "none",
                                    padding: "6px 10px",
                                    borderRadius: "8px",
                                    whiteSpace: "nowrap",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.target as HTMLElement
                                    el.style.color = accent
                                    el.style.background = `${accent}10`
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.target as HTMLElement
                                    el.style.color = t.navTextMuted
                                    el.style.background = "transparent"
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0,
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={onToggleDark}
                        style={{
                            background: t.navSurface,
                            border: `1px solid ${t.navBorder}`,
                            borderRadius: "8px",
                            padding: "6px 7px",
                            cursor: "pointer",
                            color: t.navTextMuted,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {dark ? <SunIcon /> : <MoonIcon />}
                    </motion.button>
                    {!isMobile && user && (
                        <AvatarDropdown
                            user={user}
                            accent={accent}
                            dark={dark}
                            onSignOut={onSignOut}
                            open={avatarOpen}
                            setOpen={setAvatarOpen}
                            dropdownRef={avatarRef}
                        />
                    )}
                    {!isMobile && !user && (
                        <a
                            href={homeUrl}
                            style={{
                                padding: "7px 16px",
                                borderRadius: "8px",
                                background: "#FFFFFF",
                                color: "#0A0A0C",
                                fontSize: "13px",
                                fontWeight: 700,
                                textDecoration: "none",
                            }}
                        >
                            Entrar
                        </a>
                    )}
                    {isMobile && (
                        <a
                            href={homeUrl}
                            style={{
                                padding: "6px 8px",
                                borderRadius: "7px",
                                border: `1px solid ${t.navBorder}`,
                                color: t.navTextMuted,
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "16px",
                            }}
                        >
                            Inicio
                        </a>
                    )}
                    {isMobile && (
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{
                                background: t.navSurface,
                                border: `1px solid ${t.navBorder}`,
                                borderRadius: "8px",
                                width: "36px",
                                height: "36px",
                                cursor: "pointer",
                                color: t.navText,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "5px",
                                padding: 0,
                            }}
                        >
                            <motion.span
                                animate={{
                                    rotate: mobileOpen ? 45 : 0,
                                    y: mobileOpen ? 8 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    display: "block",
                                    width: "16px",
                                    height: "2px",
                                    background: "currentColor",
                                    borderRadius: "2px",
                                    transformOrigin: "center",
                                }}
                            />
                            <motion.span
                                animate={{ opacity: mobileOpen ? 0 : 1 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    display: "block",
                                    width: "16px",
                                    height: "2px",
                                    background: "currentColor",
                                    borderRadius: "2px",
                                }}
                            />
                            <motion.span
                                animate={{
                                    rotate: mobileOpen ? -45 : 0,
                                    y: mobileOpen ? -8 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    display: "block",
                                    width: "16px",
                                    height: "2px",
                                    background: "currentColor",
                                    borderRadius: "2px",
                                    transformOrigin: "center",
                                }}
                            />
                        </motion.button>
                    )}
                </div>
            </div>
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{
                            overflow: "hidden",
                            borderTop: `1px solid ${t.navBorder}`,
                            backgroundColor: t.navBg,
                        }}
                    >
                        {/* ── BLOQUE 1: Navegación del sitio ── */}
                        <div style={{ padding: "14px 20px 10px" }}>
                            <a
                                href={homeUrl}
                                style={{
                                    display: "block",
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    color: accent,
                                    textDecoration: "none",
                                    padding: "10px 4px",
                                    marginBottom: "4px",
                                }}
                            >
                                ← Volver al inicio
                            </a>
                            <div
                                style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    color: t.navTextMuted,
                                    letterSpacing: "0.6px",
                                    textTransform: "uppercase",
                                    margin: "6px 0 6px",
                                    padding: "0 4px",
                                }}
                            >
                                Navegación
                            </div>
                            {links.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_self"
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileOpen(false)}
                                    style={{
                                        display: "block",
                                        fontSize: "15px",
                                        fontWeight: 500,
                                        color: t.navText,
                                        textDecoration: "none",
                                        padding: "10px 4px",
                                    }}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* ── BLOQUE 2: Cuenta del usuario, visualmente separado ── */}
                        {user ? (
                            <div
                                style={{
                                    background: t.navSurface,
                                    padding: "14px 20px 16px",
                                    borderTop: `1px solid ${t.navBorder}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "13px",
                                        color: t.navTextMuted,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {user.email}
                                </span>
                                <button
                                    onClick={() => {
                                        onSignOut && onSignOut()
                                        setMobileOpen(false)
                                    }}
                                    style={{
                                        padding: "8px 14px",
                                        borderRadius: "8px",
                                        background: "none",
                                        border: "none",
                                        color: "#EF4444",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        fontFamily:
                                            "Inter, system-ui, sans-serif",
                                        flexShrink: 0,
                                    }}
                                >
                                    → Salir
                                </button>
                            </div>
                        ) : (
                            <div style={{ padding: "10px 20px 18px" }}>
                                <a
                                    href={homeUrl}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "10px",
                                        background: "#FFFFFF",
                                        color: "#0A0A0C",
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        textAlign: "center",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    Entrar
                                </a>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function FooterHome({ dark, accent }: { dark: boolean; accent: string }) {
    const t = getTheme(dark)
    const year = new Date().getFullYear()
    return (
        <footer
            style={{
                borderTop: `1px solid ${t.border}`,
                marginTop: "80px",
                backgroundColor: dark ? "#080910" : "#EBEBED",
                fontFamily: "Inter, system-ui, sans-serif",
            }}
        >
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
                <div>
                    <div
                        style={{
                            fontSize: "20px",
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
                            margin: "0 0 14px",
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
                        ["Auxiliares Administrativos", "/?escala=auxiliares"],
                        ["Administrativos", "/?escala=administrativos"],
                        ["Técnicos de Gestión", "/?escala=gestion"],
                        ["Técnicos Superiores", "/?escala=superiores"],
                        ["Exámenes Oficiales", "/payment"],
                    ].map(([l, h]) => (
                        <a
                            key={l}
                            href={h}
                            style={{
                                display: "block",
                                fontSize: "13px",
                                color: t.textMuted,
                                textDecoration: "none",
                                marginBottom: "8px",
                            }}
                            onMouseEnter={(e) =>
                                ((e.target as HTMLElement).style.color = accent)
                            }
                            onMouseLeave={(e) =>
                                ((e.target as HTMLElement).style.color =
                                    t.textMuted)
                            }
                        >
                            {l}
                        </a>
                    ))}
                </div>
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
                        ["T.1 — Constitución Española", "/test?id=c01"],
                        ["T.4 — Organización CAE", "/test?id=c04"],
                        ["T.5 — Concierto Económico", "/test?id=c05"],
                        ["T.9 — Empleo público vasco", "/test?id=c09"],
                        ["Ley 39/2015", "/ley-39-2015"],
                    ].map(([l, h]) => (
                        <a
                            key={l}
                            href={h}
                            style={{
                                display: "block",
                                fontSize: "13px",
                                color: t.textMuted,
                                textDecoration: "none",
                                marginBottom: "8px",
                            }}
                            onMouseEnter={(e) =>
                                ((e.target as HTMLElement).style.color = accent)
                            }
                            onMouseLeave={(e) =>
                                ((e.target as HTMLElement).style.color =
                                    t.textMuted)
                            }
                        >
                            {l}
                        </a>
                    ))}
                </div>
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
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "13px",
                            color: t.textMuted,
                            textDecoration: "none",
                            marginBottom: "12px",
                        }}
                        onMouseEnter={(e) =>
                            ((e.target as HTMLElement).style.color = t.textMain)
                        }
                        onMouseLeave={(e) =>
                            ((e.target as HTMLElement).style.color =
                                t.textMuted)
                        }
                    >
                        @gainditu en Instagram
                    </a>
                    <div
                        style={{
                            padding: "12px 14px",
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
                                lineHeight: 1.6,
                            }}
                        >
                            Convocatoria: sep 2026
                            <br />
                            Primera prueba: ene 2027
                        </div>
                    </div>
                </div>
            </div>
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
                        gap: "10px",
                    }}
                >
                    <span style={{ fontSize: "12px", color: t.textMuted }}>
                        © {year} Gainditu · Todos los derechos reservados
                    </span>
                    <div style={{ display: "flex", gap: "20px" }}>
                        {[
                            ["Política de privacidad", "/privacidad"],
                            ["Aviso legal", "/aviso-legal"],
                            ["Cookies", "/cookies"],
                        ].map(([l, h]) => (
                            <a
                                key={l}
                                href={h}
                                style={{
                                    fontSize: "12px",
                                    color: t.textMuted,
                                    textDecoration: "none",
                                }}
                            >
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

// ─── BADGE PREMIUM ────────────────────────────────────────────────────────────
function PremiumBadge({ type }: { type: string }) {
    const isAdmin = type === "admin"
    const bg = isAdmin
        ? "linear-gradient(135deg, #F59E0B, #EF4444)"
        : "linear-gradient(135deg, #8B5CF6, #3B82F6)"
    const label = isAdmin ? "Admin" : "Premium"
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: bg,
                borderRadius: "100px",
                padding: "3px 12px",
            }}
        >
            <span
                style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "0.3px",
                }}
            >
                {label}
            </span>
        </div>
    )
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function PerfilOPE({
    accent = "#E8543A",
    darkMode = true,
    homeUrl = "/",
    testPageUrl = "/test",
}: {
    accent?: string
    darkMode?: boolean
    homeUrl?: string
    testPageUrl?: string
}) {
    const isCanvas = false
    const [dark, setDark] = useState(darkMode)
    const t = getTheme(dark)

    // Estados del navbar (en el principal — Framer no acepta useState en subcomponentes)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(true)
    const rootRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        let ro: ResizeObserver | null = null
        let rafId: number
        let cancelled = false
        const measure = (w: number) => setIsMobile(w < 640)
        // El elemento del ref puede no existir aún en el primer tick (el componente
        // puede mostrar otro return antes del layout final). Reintentamos hasta encontrarlo.
        const tryAttach = () => {
            if (cancelled) return
            const el = rootRef.current
            if (!el) {
                rafId = requestAnimationFrame(tryAttach)
                return
            }
            measure(el.getBoundingClientRect().width)
            if (typeof ResizeObserver === "undefined") {
                const fn = () => measure(el.getBoundingClientRect().width)
                window.addEventListener("resize", fn)
                ;(tryAttach as any)._cleanup = () =>
                    window.removeEventListener("resize", fn)
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
    }, [])

    // Estados del AvatarDropdown (Framer no acepta useState en subcomponentes)
    const [avatarOpen, setAvatarOpen] = useState(false)
    const avatarRef = useRef<HTMLDivElement>(null)
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

    // Leer tab inicial desde URL ?tab= (llegamos aquí desde el dropdown del navbar)
    const initialTab = (() => {
        try {
            const p = new URLSearchParams(window.location.search).get("tab")
            if (
                p === "stats" ||
                p === "examenes" ||
                p === "historial" ||
                p === "ajustes"
            )
                return p
        } catch {}
        return "stats"
    })()
    const [tab, setTab] = useState<
        "stats" | "examenes" | "historial" | "ajustes"
    >(initialTab as any)
    const [resultados, setResultados] = useState<any[]>([])
    const [progress, setProgress] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [nombre, setNombre] = useState("")
    const [escala, setEscala] = useState("administrativos")
    const [isPremium, setIsPremium] = useState(false)
    const [premiumType, setPremiumType] = useState("free")
    const [guardando, setGuardando] = useState(false)
    const [guardado, setGuardado] = useState(false)

    const cargarDatos = useCallback(
        async (isInitialLoad = false) => {
            if (isCanvas) {
                setLoading(false)
                return
            }
            let s = await getSessionAsync()
            if (!s) {
                if (isInitialLoad) {
                    setLoading(false)
                    setTimeout(() => {
                        window.location.href = homeUrl
                    }, 150)
                }
                return
            }
            if (isInitialLoad) {
                const meta =
                    s.user?.user_metadata?.full_name ||
                    s.user?.user_metadata?.name ||
                    ""
                if (meta) setNombre(meta)
            } else {
                setIsRefreshing(true)
            }

            const fetchAuth = async (url: string) => {
                const r = await fetchWithAuth(url, s!.token)
                if (!r.ok) {
                    if (r.status === 401) throw new Error("EXPIRED_TOKEN")
                    return Promise.reject(r)
                }
                return r.json()
            }

            try {
                const [res, prog, prof] = await Promise.all([
                    // Historial completo para premium, limitado para free
                    fetchAuth(
                        `${SUPABASE_URL}/rest/v1/test_results?user_id=eq.${s.user.id}&order=completado_at.desc&select=*`
                    ),
                    fetchAuth(
                        `${SUPABASE_URL}/rest/v1/test_progress?user_id=eq.${s.user.id}&select=*`
                    ),
                    fetchAuth(
                        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${s.user.id}&select=*`
                    ),
                ])
                if (Array.isArray(res)) setResultados(res)
                if (Array.isArray(prog)) {
                    const map: Record<string, any> = {}
                    prog.forEach((p: any) => {
                        map[p.test_id] = p
                    })
                    setProgress(map)
                }
                if (Array.isArray(prof) && prof[0]) {
                    if (prof[0].full_name && isInitialLoad)
                        setNombre(prof[0].full_name)
                    if (prof[0].escala_objetivo && isInitialLoad)
                        setEscala(prof[0].escala_objetivo)
                    setIsPremium(!!prof[0].is_premium)
                    setPremiumType(prof[0].premium_type || "free")
                }
            } catch (error: any) {
                if (error.message === "EXPIRED_TOKEN") {
                    // Último intento: refrescar token explícitamente antes de cerrar sesión
                    const refreshed = await refreshSession()
                    if (refreshed) {
                        setIsRefreshing(false)
                        cargarDatos(isInitialLoad)
                        return
                    }
                    limpiarSesion(homeUrl)
                    return
                }
            } finally {
                setLoading(false)
                setTimeout(() => setIsRefreshing(false), 500)
            }
        },
        [homeUrl, isCanvas]
    )

    useEffect(() => {
        if (isCanvas) return
        // Detectar redirección post-pago de Stripe → polling agresivo 2s durante 15s
        const params = new URLSearchParams(window.location.search)
        if (params.get("checkout") === "success") {
            history.replaceState(null, "", window.location.pathname)
            const pollPago = setInterval(() => cargarDatos(false), 2000)
            setTimeout(() => clearInterval(pollPago), 15000)
        }
        cargarDatos(true)
        const handleFocus = () => cargarDatos(false)
        window.addEventListener("focus", handleFocus)
        const id = setInterval(() => {
            if (document.visibilityState === "visible") cargarDatos(false)
        }, 15000)
        return () => {
            window.removeEventListener("focus", handleFocus)
            clearInterval(id)
        }
    }, [cargarDatos, isCanvas])

    const session = getSession()

    async function guardarAjustes() {
        if (!session || isCanvas) return
        setGuardando(true)
        await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
            method: "POST",
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${session.token}`,
                "Content-Type": "application/json",
                Prefer: "resolution=merge-duplicates",
            },
            body: JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                full_name: nombre,
                escala_objetivo: escala,
                updated_at: new Date().toISOString(),
            }),
        })
        setGuardando(false)
        setGuardado(true)
        setTimeout(() => setGuardado(false), 2500)
    }

    async function handleSignOut() {
        limpiarSesion(homeUrl)
    }

    if (isCanvas) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: t.bg,
                    borderRadius: "12px",
                    flexDirection: "column",
                    gap: "12px",
                    fontFamily: "Inter, system-ui, sans-serif",
                    border: `2px dashed ${t.borderStrong}`,
                }}
            >
                <div style={{ fontSize: "36px" }}></div>
                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: t.textMain,
                    }}
                >
                    Área Privada (Editor)
                </div>
                <div
                    style={{
                        fontSize: "13px",
                        color: t.textMuted,
                        textAlign: "center",
                        maxWidth: "250px",
                    }}
                >
                    El componente está protegido para no redirigir mientras
                    diseñas.
                </div>
            </div>
        )
    }

    if (!session && !loading) {
        return (
            <div
                ref={rootRef}
                style={{
                    width: "100%",
                    minHeight: "100svh",
                    backgroundColor: t.bg,
                    color: t.textMain,
                    fontFamily: "Inter, system-ui, sans-serif",
                }}
            >
                <Navbar
                    accent={accent}
                    dark={dark}
                    onToggleDark={() => setDark((d) => !d)}
                    homeUrl={homeUrl}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                    isMobile={isMobile}
                    avatarOpen={avatarOpen}
                    setAvatarOpen={setAvatarOpen}
                    avatarRef={avatarRef}
                />
                <div style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div
                        style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            marginBottom: "8px",
                        }}
                    >
                        Área privada
                    </div>
                    <div style={{ fontSize: "13px", color: t.textMuted }}>
                        Inicia sesión para ver tu progreso
                    </div>
                </div>
                <FooterHome dark={dark} accent={accent} />
            </div>
        )
    }

    const totalTests = Object.keys(progress).length
    const totalPreguntas = resultados.reduce(
        (a, r) => a + (r.total_preguntas || 0),
        0
    )
    const mediaAcierto =
        totalTests > 0
            ? Math.round(
                  Object.values(progress).reduce(
                      (a: number, p: any) => a + p.mejor_porcentaje,
                      0
                  ) / totalTests
              )
            : 0
    const racha = calcularRacha(resultados)
    const accentColor = SCALE_COLORS[escala] || accent
    const iniciales = (nombre || session?.user?.email || "OP")
        .substring(0, 2)
        .toUpperCase()
    const xpPorNivel = 50
    const nivelActual = Math.floor(totalPreguntas / xpPorNivel) + 1
    const xpNivelActual = totalPreguntas % xpPorNivel
    const progresoNivel = (xpNivelActual / xpPorNivel) * 100

    // Estadísticas avanzadas premium
    const testsPorEscala = Object.entries(progress).reduce(
        (acc: Record<string, number>, [id]) => {
            const e = id.startsWith("aux")
                ? "auxiliares"
                : id.startsWith("adm")
                  ? "administrativos"
                  : id.startsWith("ges")
                    ? "gestion"
                    : id.startsWith("sup")
                      ? "superiores"
                      : "comun"
            acc[e] = (acc[e] || 0) + 1
            return acc
        },
        {}
    )
    const temasFlaqueza = Object.entries(progress)
        .filter(([, p]: any) => p.mejor_porcentaje < 50)
        .sort(
            ([, a]: any, [, b]: any) => a.mejor_porcentaje - b.mejor_porcentaje
        )
        .slice(0, 3)
    const temasFuerza = Object.entries(progress)
        .filter(([, p]: any) => p.mejor_porcentaje >= 70)
        .sort(
            ([, a]: any, [, b]: any) => b.mejor_porcentaje - a.mejor_porcentaje
        )
        .slice(0, 3)

    // Historial: premium = todos, free = últimos 10
    const historialVisible = isPremium ? resultados : resultados.slice(0, 10)

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "10px",
        border: `1.5px solid ${t.border}`,
        background: t.glass,
        color: t.textMain,
        fontSize: "14px",
        fontFamily: "Inter, system-ui, sans-serif",
        outline: "none",
        boxSizing: "border-box",
    }

    // Tabs: premium tiene tab de exámenes
    const tabs = [
        { id: "stats", label: "Progreso" },
        ...(isPremium ? [{ id: "examenes", label: "Mis Exámenes" }] : []),
        { id: "historial", label: "Historial" },
        { id: "ajustes", label: "Ajustes" },
    ] as const

    return (
        <div
            ref={rootRef}
            style={{
                width: "100%",
                minHeight: "100svh",
                backgroundColor: t.bg,
                color: t.textMain,
                fontFamily: "Inter, system-ui, sans-serif",
                boxSizing: "border-box",
            }}
        >
            <Navbar
                accent={accentColor}
                dark={dark}
                onToggleDark={() => setDark((d) => !d)}
                homeUrl={homeUrl}
                user={session?.user}
                onSignOut={handleSignOut}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                isMobile={isMobile}
                avatarOpen={avatarOpen}
                setAvatarOpen={setAvatarOpen}
                avatarRef={avatarRef}
            />

            <div
                style={{
                    maxWidth: "820px",
                    margin: "0 auto",
                    padding: "40px 20px 60px",
                }}
            >
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "36px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: "20px",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    borderRadius: "50%",
                                    background: t.border,
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "150px",
                                        height: "24px",
                                        borderRadius: "6px",
                                        background: t.border,
                                    }}
                                />
                                <div
                                    style={{
                                        width: "100px",
                                        height: "14px",
                                        borderRadius: "4px",
                                        background: t.border,
                                    }}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(160px, 1fr))",
                                gap: "12px",
                            }}
                        >
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: "100px",
                                        borderRadius: "14px",
                                        background: t.surface,
                                        border: `1px solid ${t.border}`,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* ── HEADER PERFIL ── */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "20px",
                                marginBottom: "36px",
                                flexWrap: "wrap",
                            }}
                        >
                            <div
                                style={{
                                    width: "72px",
                                    height: "72px",
                                    borderRadius: "50%",
                                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "26px",
                                    fontWeight: 800,
                                    color: "#fff",
                                    flexShrink: 0,
                                    boxShadow: `0 4px 24px ${accentColor}50`,
                                    position: "relative",
                                }}
                            >
                                {iniciales}
                                {isPremium && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "-4px",
                                            right: "-4px",
                                            background:
                                                premiumType === "admin"
                                                    ? "#F59E0B"
                                                    : "#8B5CF6",
                                            borderRadius: "50%",
                                            width: "22px",
                                            height: "22px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                            border: `2px solid ${t.bg}`,
                                        }}
                                    >
                                        {premiumType === "admin" ? "" : ""}
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1, minWidth: "200px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        flexWrap: "wrap",
                                        marginBottom: "4px",
                                    }}
                                >
                                    <h1
                                        style={{
                                            fontSize: "24px",
                                            fontWeight: 800,
                                            letterSpacing: "-0.5px",
                                            margin: 0,
                                        }}
                                    >
                                        {nombre || "Aspirante"}
                                    </h1>
                                    {isPremium && (
                                        <PremiumBadge type={premiumType} />
                                    )}
                                </div>
                                <div
                                    style={{
                                        fontSize: "13px",
                                        color: t.textMuted,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        flexWrap: "wrap",
                                        marginBottom: "14px",
                                    }}
                                >
                                    <span>{session?.user?.email}</span>
                                    <span>·</span>
                                    <div
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            background: `${accentColor}15`,
                                            border: `1px solid ${accentColor}30`,
                                            borderRadius: "100px",
                                            padding: "2px 10px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "6px",
                                                height: "6px",
                                                borderRadius: "50%",
                                                background: accentColor,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                color: accentColor,
                                            }}
                                        >
                                            {ESCALAS.find(
                                                (e) => e.id === escala
                                            )?.label || "Sin escala"}
                                        </span>
                                    </div>
                                </div>

                                {/* Barra de nivel */}
                                <div
                                    style={{
                                        background: t.glass,
                                        padding: "10px 14px",
                                        borderRadius: "12px",
                                        border: `1px solid ${t.border}`,
                                        display: "inline-block",
                                        minWidth: "220px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: "11px",
                                            fontWeight: 700,
                                            marginBottom: "6px",
                                        }}
                                    >
                                        <span style={{ color: t.textMain }}>
                                            Nivel {nivelActual}
                                        </span>
                                        <span style={{ color: t.textMuted }}>
                                            {xpNivelActual} / {xpPorNivel} exp
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "6px",
                                            background: t.borderStrong,
                                            borderRadius: "100px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${progresoNivel}%`,
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                ease: "easeOut",
                                            }}
                                            style={{
                                                height: "100%",
                                                background: accentColor,
                                                borderRadius: "100px",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Banner premium si NO es premium */}
                                {!isPremium && (
                                    <div
                                        style={{
                                            marginTop: "14px",
                                            padding: "12px 16px",
                                            borderRadius: "12px",
                                            background:
                                                "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))",
                                            border: "1px solid rgba(139,92,246,0.3)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "12px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    color: "#8B5CF6",
                                                    marginBottom: "2px",
                                                }}
                                            >
                                                Desbloquea el acceso completo
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "11px",
                                                    color: t.textMuted,
                                                }}
                                            >
                                                Exámenes oficiales, simulacros y
                                                estadísticas avanzadas
                                            </div>
                                        </div>
                                        <a
                                            href="/payment"
                                            style={{
                                                padding: "7px 14px",
                                                borderRadius: "8px",
                                                background: "#8B5CF6",
                                                color: "#fff",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                textDecoration: "none",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            Ver oferta →
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Botón refresh */}
                            <motion.button
                                onClick={() => cargarDatos(false)}
                                whileTap={{ scale: 0.95 }}
                                disabled={isRefreshing}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "7px 12px",
                                    borderRadius: "8px",
                                    background: t.glass,
                                    border: `1px solid ${t.border}`,
                                    color: isRefreshing
                                        ? accentColor
                                        : t.textMuted,
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    flexShrink: 0,
                                }}
                            >
                                <motion.div
                                    animate={{ rotate: isRefreshing ? 360 : 0 }}
                                    transition={{
                                        duration: 1,
                                        repeat: isRefreshing ? Infinity : 0,
                                        ease: "linear",
                                    }}
                                >
                                    <IconRefresh size={14} />
                                </motion.div>
                            </motion.button>
                        </div>

                        {/* ── TABS ── */}
                        <div
                            style={{
                                display: "flex",
                                gap: "4px",
                                marginBottom: "28px",
                                borderBottom: `1px solid ${t.border}`,
                                overflowX: "auto",
                                scrollbarWidth: "none",
                            }}
                        >
                            {tabs.map((tb) => (
                                <button
                                    key={tb.id}
                                    onClick={() => setTab(tb.id as any)}
                                    style={{
                                        padding: "10px 18px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontFamily:
                                            "Inter, system-ui, sans-serif",
                                        fontSize: "14px",
                                        fontWeight: tab === tb.id ? 700 : 500,
                                        color:
                                            tab === tb.id
                                                ? accentColor
                                                : t.textMuted,
                                        borderBottom: `2px solid ${tab === tb.id ? accentColor : "transparent"}`,
                                        marginBottom: "-1px",
                                        transition: "color 0.15s",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {tb.label}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {/* ── TAB: ESTADÍSTICAS ── */}
                            {tab === "stats" && (
                                <motion.div
                                    key="stats"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {/* Stats cards */}
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fit, minmax(150px, 1fr))",
                                            gap: "12px",
                                            marginBottom: "24px",
                                        }}
                                    >
                                        {[
                                            {
                                                label: "Tests completados",
                                                value: totalTests,
                                                color: accentColor,
                                                icon: "",
                                            },
                                            {
                                                label: "Media de acierto",
                                                value: `${mediaAcierto}%`,
                                                color:
                                                    mediaAcierto >= 70
                                                        ? t.success
                                                        : mediaAcierto >= 50
                                                          ? t.warning
                                                          : t.error,
                                                icon: "",
                                            },
                                            {
                                                label: "Racha actual",
                                                value: `${racha} días`,
                                                color:
                                                    racha >= 3
                                                        ? "#F59E0B"
                                                        : t.textMuted,
                                                icon: "",
                                            },
                                            {
                                                label: "Preguntas hechas",
                                                value: totalPreguntas,
                                                color: t.textMain,
                                                icon: "",
                                            },
                                        ].map((m, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    background: t.surface,
                                                    border: `1px solid ${t.border}`,
                                                    borderRadius: "14px",
                                                    padding: "18px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems: "center",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: t.textMuted,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {m.label}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        {m.icon}
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "28px",
                                                        fontWeight: 800,
                                                        color: m.color,
                                                        letterSpacing: "-1px",
                                                    }}
                                                >
                                                    {m.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mejor resultado por test */}
                                    {Object.keys(progress).length > 0 && (
                                        <div
                                            style={{
                                                background: t.surface,
                                                border: `1px solid ${t.border}`,
                                                borderRadius: "16px",
                                                padding: "24px",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    fontSize: "15px",
                                                    fontWeight: 700,
                                                    color: t.textMain,
                                                    margin: "0 0 20px",
                                                    borderLeft: `3px solid ${accentColor}`,
                                                    paddingLeft: "12px",
                                                }}
                                            >
                                                Tu mejor resultado por test
                                            </h3>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "12px",
                                                }}
                                            >
                                                {Object.entries(progress)
                                                    .sort(
                                                        (
                                                            [, a]: any,
                                                            [, b]: any
                                                        ) =>
                                                            b.mejor_porcentaje -
                                                            a.mejor_porcentaje
                                                    )
                                                    .slice(
                                                        0,
                                                        isPremium ? 10 : 5
                                                    )
                                                    .map(
                                                        ([testId, p]: [
                                                            string,
                                                            any,
                                                        ]) => {
                                                            const pct =
                                                                Math.round(
                                                                    p.mejor_porcentaje
                                                                )
                                                            const barColor =
                                                                pct >= 70
                                                                    ? t.success
                                                                    : pct >= 50
                                                                      ? t.warning
                                                                      : t.error
                                                            return (
                                                                <div
                                                                    key={testId}
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: "12px",
                                                                    }}
                                                                >
                                                                    <div
                                                                        title={
                                                                            TITULOS[
                                                                                testId
                                                                            ] ||
                                                                            testId
                                                                        }
                                                                        style={{
                                                                            fontSize:
                                                                                "11px",
                                                                            fontWeight: 600,
                                                                            color: t.textMuted,
                                                                            width: "90px",
                                                                            flexShrink: 0,
                                                                            overflow:
                                                                                "hidden",
                                                                            whiteSpace:
                                                                                "nowrap",
                                                                            textOverflow:
                                                                                "ellipsis",
                                                                            cursor: "help",
                                                                        }}
                                                                    >
                                                                        {TITULOS[
                                                                            testId
                                                                        ]
                                                                            ? TITULOS[
                                                                                  testId
                                                                              ]
                                                                                  .replace(
                                                                                      /^T\.\d+\s*—\s*/,
                                                                                      ""
                                                                                  )
                                                                                  .replace(
                                                                                      /^E\.T\.\d+\s*—\s*/,
                                                                                      ""
                                                                                  )
                                                                            : testId.toUpperCase()}
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            flex: 1,
                                                                            height: "6px",
                                                                            background:
                                                                                t.borderStrong,
                                                                            borderRadius:
                                                                                "100px",
                                                                            overflow:
                                                                                "hidden",
                                                                        }}
                                                                    >
                                                                        <motion.div
                                                                            initial={{
                                                                                width: 0,
                                                                            }}
                                                                            animate={{
                                                                                width: `${pct}%`,
                                                                            }}
                                                                            transition={{
                                                                                duration: 0.6,
                                                                            }}
                                                                            style={{
                                                                                height: "100%",
                                                                                background:
                                                                                    barColor,
                                                                                borderRadius:
                                                                                    "100px",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            fontSize:
                                                                                "12px",
                                                                            fontWeight: 700,
                                                                            color: barColor,
                                                                            width: "36px",
                                                                            textAlign:
                                                                                "right",
                                                                            flexShrink: 0,
                                                                        }}
                                                                    >
                                                                        {pct}%
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── ESTADÍSTICAS AVANZADAS (solo premium) ── */}
                                    {isPremium && (
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "16px",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            {/* Temas flaqueza */}
                                            <div
                                                style={{
                                                    background: t.surface,
                                                    border: `1px solid ${t.border}`,
                                                    borderRadius: "14px",
                                                    padding: "20px",
                                                }}
                                            >
                                                <h4
                                                    style={{
                                                        fontSize: "13px",
                                                        fontWeight: 700,
                                                        color: t.error,
                                                        margin: "0 0 14px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                    }}
                                                >
                                                    Temas a reforzar
                                                </h4>
                                                {temasFlaqueza.length === 0 ? (
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: t.textMuted,
                                                        }}
                                                    >
                                                        ¡Ninguno por ahora! 
                                                    </div>
                                                ) : (
                                                    temasFlaqueza.map(
                                                        ([id, p]: any) => (
                                                            <div
                                                                key={id}
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    alignItems:
                                                                        "center",
                                                                    gap: "10px",
                                                                    padding:
                                                                        "8px 0",
                                                                    borderBottom: `1px solid ${t.border}`,
                                                                }}
                                                            >
                                                                <a
                                                                    href={`${testPageUrl}?id=${id}`}
                                                                    title={
                                                                        TITULOS[
                                                                            id
                                                                        ] || id
                                                                    }
                                                                    style={{
                                                                        fontSize:
                                                                            "12px",
                                                                        color: t.textMain,
                                                                        textDecoration:
                                                                            "none",
                                                                        fontWeight: 500,
                                                                        lineHeight: 1.4,
                                                                        overflow:
                                                                            "hidden",
                                                                        display:
                                                                            "-webkit-box",
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient:
                                                                            "vertical",
                                                                        minWidth: 0,
                                                                    }}
                                                                >
                                                                    {TITULOS[
                                                                        id
                                                                    ] ||
                                                                        id.toUpperCase()}
                                                                </a>
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        fontWeight: 700,
                                                                        color: t.error,
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    {Math.round(
                                                                        p.mejor_porcentaje
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                        )
                                                    )
                                                )}
                                            </div>
                                            {/* Temas fuertes */}
                                            <div
                                                style={{
                                                    background: t.surface,
                                                    border: `1px solid ${t.border}`,
                                                    borderRadius: "14px",
                                                    padding: "20px",
                                                }}
                                            >
                                                <h4
                                                    style={{
                                                        fontSize: "13px",
                                                        fontWeight: 700,
                                                        color: t.success,
                                                        margin: "0 0 14px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                    }}
                                                >
                                                    Tus puntos fuertes
                                                </h4>
                                                {temasFuerza.length === 0 ? (
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: t.textMuted,
                                                        }}
                                                    >
                                                        Sigue practicando 
                                                    </div>
                                                ) : (
                                                    temasFuerza.map(
                                                        ([id, p]: any) => (
                                                            <div
                                                                key={id}
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    alignItems:
                                                                        "center",
                                                                    gap: "10px",
                                                                    padding:
                                                                        "8px 0",
                                                                    borderBottom: `1px solid ${t.border}`,
                                                                }}
                                                            >
                                                                <a
                                                                    href={`${testPageUrl}?id=${id}`}
                                                                    title={
                                                                        TITULOS[
                                                                            id
                                                                        ] || id
                                                                    }
                                                                    style={{
                                                                        fontSize:
                                                                            "12px",
                                                                        color: t.textMain,
                                                                        textDecoration:
                                                                            "none",
                                                                        fontWeight: 500,
                                                                        lineHeight: 1.4,
                                                                        overflow:
                                                                            "hidden",
                                                                        display:
                                                                            "-webkit-box",
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient:
                                                                            "vertical",
                                                                        minWidth: 0,
                                                                    }}
                                                                >
                                                                    {TITULOS[
                                                                        id
                                                                    ] ||
                                                                        id.toUpperCase()}
                                                                </a>
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            "11px",
                                                                        fontWeight: 700,
                                                                        color: t.success,
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    {Math.round(
                                                                        p.mejor_porcentaje
                                                                    )}
                                                                    %
                                                                </span>
                                                            </div>
                                                        )
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tests por escala — solo premium */}
                                    {isPremium &&
                                        Object.keys(testsPorEscala).length >
                                            0 && (
                                            <div
                                                style={{
                                                    background: t.surface,
                                                    border: `1px solid ${t.border}`,
                                                    borderRadius: "14px",
                                                    padding: "20px",
                                                    marginBottom: "20px",
                                                }}
                                            >
                                                <h4
                                                    style={{
                                                        fontSize: "13px",
                                                        fontWeight: 700,
                                                        color: t.textMain,
                                                        margin: "0 0 14px",
                                                        borderLeft: `3px solid ${accentColor}`,
                                                        paddingLeft: "10px",
                                                    }}
                                                >
                                                    Tests completados por escala
                                                </h4>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    {Object.entries(
                                                        testsPorEscala
                                                    ).map(([e, count]) => (
                                                        <div
                                                            key={e}
                                                            style={{
                                                                padding:
                                                                    "8px 14px",
                                                                borderRadius:
                                                                    "10px",
                                                                background: `${SCALE_COLORS[e] || accentColor}15`,
                                                                border: `1px solid ${SCALE_COLORS[e] || accentColor}30`,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "18px",
                                                                    fontWeight: 800,
                                                                    color:
                                                                        SCALE_COLORS[
                                                                            e
                                                                        ] ||
                                                                        accentColor,
                                                                }}
                                                            >
                                                                {count}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                    color: t.textMuted,
                                                                    textTransform:
                                                                        "capitalize",
                                                                }}
                                                            >
                                                                {e}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    {totalTests === 0 && (
                                        <div
                                            style={{
                                                textAlign: "center",
                                                padding: "48px 20px",
                                                color: t.textMuted,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "40px",
                                                    marginBottom: "12px",
                                                }}
                                            >
                                                
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "16px",
                                                    fontWeight: 600,
                                                    marginBottom: "8px",
                                                    color: t.textMain,
                                                }}
                                            >
                                                Aún no has hecho ningún test
                                            </div>
                                            <a
                                                href={homeUrl}
                                                style={{
                                                    display: "inline-block",
                                                    padding: "12px 24px",
                                                    borderRadius: "10px",
                                                    background: accentColor,
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    fontSize: "14px",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Ir a los tests →
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* ── TAB: MIS EXÁMENES (solo premium) ── */}
                            {tab === "examenes" && isPremium && (
                                <motion.div
                                    key="examenes"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div style={{ marginBottom: "20px" }}>
                                        <h3
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: 800,
                                                color: t.textMain,
                                                margin: "0 0 6px",
                                                letterSpacing: "-0.3px",
                                            }}
                                        >
                                            Tus exámenes oficiales
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                color: t.textMuted,
                                                margin: 0,
                                            }}
                                        >
                                            Acceso completo sin límite de
                                            preguntas. Tu progreso se guarda
                                            automáticamente.
                                        </p>
                                    </div>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fill, minmax(260px, 1fr))",
                                            gap: "12px",
                                        }}
                                    >
                                        {EXAMENES_PREMIUM.map((ex) => {
                                            const prog = progress[ex.id]
                                            const pct = prog
                                                ? Math.round(
                                                      prog.mejor_porcentaje
                                                  )
                                                : null
                                            const exColor =
                                                SCALE_COLORS[ex.escala]
                                            return (
                                                <motion.a
                                                    key={ex.id}
                                                    href={`${testPageUrl}?id=${ex.id}&accent=${encodeURIComponent(exColor)}`}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{
                                                        background: t.surface,
                                                        border: `1.5px solid ${exColor}40`,
                                                        borderRadius: "14px",
                                                        padding: "18px",
                                                        textDecoration: "none",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "10px",
                                                        position: "relative",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {/* Barra top + progreso si existe */}
                                                    <div
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: "3px",
                                                            background: pct
                                                                ? `linear-gradient(to right, ${exColor} ${pct}%, ${t.border} ${pct}%)`
                                                                : exColor,
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "flex-start",
                                                            paddingTop: "4px",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize: "9px",
                                                                fontWeight: 800,
                                                                color: exColor,
                                                                letterSpacing:
                                                                    "0.5px",
                                                                background: `${exColor}18`,
                                                                padding:
                                                                    "2px 7px",
                                                                borderRadius:
                                                                    "100px",
                                                            }}
                                                        >
                                                            {ex.badge}
                                                        </span>
                                                        {pct !== null && (
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                    fontWeight: 700,
                                                                    color:
                                                                        pct >=
                                                                        70
                                                                            ? t.success
                                                                            : pct >=
                                                                                50
                                                                              ? t.warning
                                                                              : t.error,
                                                                }}
                                                            >
                                                                {pct}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "13px",
                                                            fontWeight: 700,
                                                            color: t.textMain,
                                                            lineHeight: 1.35,
                                                        }}
                                                    >
                                                        {ex.titulo}
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
                                                                background: `${t.border}`,
                                                                padding:
                                                                    "2px 8px",
                                                                borderRadius:
                                                                    "100px",
                                                            }}
                                                        >
                                                            {ex.preguntas}{" "}
                                                            preguntas
                                                        </span>
                                                        <span
                                                            style={{
                                                                color: exColor,
                                                                fontSize:
                                                                    "14px",
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            →
                                                        </span>
                                                    </div>
                                                </motion.a>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── TAB: HISTORIAL ── */}
                            {tab === "historial" && (
                                <motion.div
                                    key="historial"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {!isPremium && resultados.length > 10 && (
                                        <div
                                            style={{
                                                marginBottom: "16px",
                                                padding: "12px 16px",
                                                borderRadius: "10px",
                                                background:
                                                    "rgba(139,92,246,0.08)",
                                                border: "1px solid rgba(139,92,246,0.2)",
                                                fontSize: "12px",
                                                color: t.textMuted,
                                            }}
                                        >
                                            Mostrando los últimos 10
                                            resultados.{" "}
                                            <a
                                                href="/payment"
                                                style={{
                                                    color: "#8B5CF6",
                                                    fontWeight: 700,
                                                    textDecoration: "none",
                                                }}
                                            >
                                                Hazte premium
                                            </a>{" "}
                                            para ver el historial completo (
                                            {resultados.length} resultados).
                                        </div>
                                    )}
                                    {historialVisible.length === 0 ? (
                                        <div
                                            style={{
                                                textAlign: "center",
                                                padding: "48px 20px",
                                                color: t.textMuted,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "40px",
                                                    marginBottom: "12px",
                                                }}
                                            >
                                                
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "15px",
                                                    color: t.textMain,
                                                    fontWeight: 600,
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                Sin historial todavía
                                            </div>
                                            <div style={{ fontSize: "13px" }}>
                                                Aquí aparecerán tus tests
                                                completados
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "10px",
                                            }}
                                        >
                                            {historialVisible.map((r, i) => {
                                                const pct = Math.round(
                                                    r.porcentaje || 0
                                                )
                                                const color =
                                                    pct >= 70
                                                        ? t.success
                                                        : pct >= 50
                                                          ? t.warning
                                                          : t.error
                                                const min = Math.floor(
                                                    (r.tiempo_segundos || 0) /
                                                        60
                                                )
                                                const seg =
                                                    (r.tiempo_segundos || 0) %
                                                    60
                                                return (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            background:
                                                                t.surface,
                                                            border: `1px solid ${t.border}`,
                                                            borderRadius:
                                                                "12px",
                                                            padding:
                                                                "14px 16px",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "14px",
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: "44px",
                                                                height: "44px",
                                                                borderRadius:
                                                                    "50%",
                                                                background: `${color}15`,
                                                                border: `2px solid ${color}`,
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "12px",
                                                                    fontWeight: 800,
                                                                    color,
                                                                }}
                                                            >
                                                                {pct}%
                                                            </span>
                                                        </div>
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                minWidth:
                                                                    "140px",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "13px",
                                                                    fontWeight: 600,
                                                                    color: t.textMain,
                                                                    marginBottom:
                                                                        "3px",
                                                                    lineHeight: 1.3,
                                                                }}
                                                            >
                                                                {r.test_titulo ||
                                                                    r.test_id}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontSize:
                                                                        "11px",
                                                                    color: t.textMuted,
                                                                }}
                                                            >
                                                                {formatFecha(
                                                                    r.completado_at
                                                                )}{" "}
                                                                · {min}m {seg}s
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: "16px",
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {[
                                                                {
                                                                    v: r.correctas,
                                                                    c: t.success,
                                                                    s: "✓",
                                                                },
                                                                {
                                                                    v: r.incorrectas,
                                                                    c: t.error,
                                                                    s: "✗",
                                                                },
                                                                {
                                                                    v:
                                                                        r.sin_responder ||
                                                                        0,
                                                                    c: t.textMuted,
                                                                    s: "—",
                                                                },
                                                            ].map((s, j) => (
                                                                <div
                                                                    key={j}
                                                                    style={{
                                                                        textAlign:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            fontSize:
                                                                                "14px",
                                                                            fontWeight: 700,
                                                                            color: s.c,
                                                                        }}
                                                                    >
                                                                        {s.v}
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            fontSize:
                                                                                "10px",
                                                                            color: t.textMuted,
                                                                            fontWeight: 700,
                                                                        }}
                                                                    >
                                                                        {s.s}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <a
                                                            href={`${testPageUrl}?id=${r.test_id}`}
                                                            style={{
                                                                padding:
                                                                    "8px 14px",
                                                                borderRadius:
                                                                    "8px",
                                                                background:
                                                                    t.glass,
                                                                border: `1px solid ${t.border}`,
                                                                color: t.textMain,
                                                                fontSize:
                                                                    "11px",
                                                                fontWeight: 600,
                                                                textDecoration:
                                                                    "none",
                                                                whiteSpace:
                                                                    "nowrap",
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            Repetir →
                                                        </a>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* ── TAB: AJUSTES ── */}
                            {tab === "ajustes" && (
                                <motion.div
                                    key="ajustes"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px",
                                            maxWidth: "520px",
                                        }}
                                    >
                                        <div>
                                            <label
                                                style={{
                                                    display: "block",
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    color: t.textMuted,
                                                    marginBottom: "8px",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px",
                                                }}
                                            >
                                                Nombre
                                            </label>
                                            <input
                                                value={nombre}
                                                onChange={(e) =>
                                                    setNombre(e.target.value)
                                                }
                                                placeholder="Tu nombre"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                style={{
                                                    display: "block",
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    color: t.textMuted,
                                                    marginBottom: "8px",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px",
                                                }}
                                            >
                                                Email
                                            </label>
                                            <input
                                                value={
                                                    session?.user?.email || ""
                                                }
                                                readOnly
                                                style={{
                                                    ...inputStyle,
                                                    opacity: 0.5,
                                                    cursor: "not-allowed",
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                style={{
                                                    display: "block",
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    color: t.textMuted,
                                                    marginBottom: "8px",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px",
                                                }}
                                            >
                                                Escala objetivo
                                            </label>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "8px",
                                                }}
                                            >
                                                {ESCALAS.map((e) => (
                                                    <div
                                                        key={e.id}
                                                        onClick={() =>
                                                            setEscala(e.id)
                                                        }
                                                        style={{
                                                            padding:
                                                                "14px 16px",
                                                            borderRadius:
                                                                "12px",
                                                            border: `1.5px solid ${escala === e.id ? SCALE_COLORS[e.id] : t.border}`,
                                                            background:
                                                                escala === e.id
                                                                    ? `${SCALE_COLORS[e.id]}12`
                                                                    : t.glass,
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "space-between",
                                                            transition:
                                                                "all 0.15s",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "14px",
                                                                fontWeight:
                                                                    escala ===
                                                                    e.id
                                                                        ? 700
                                                                        : 500,
                                                                color:
                                                                    escala ===
                                                                    e.id
                                                                        ? SCALE_COLORS[
                                                                              e
                                                                                  .id
                                                                          ]
                                                                        : t.textMain,
                                                            }}
                                                        >
                                                            {e.label}
                                                        </span>
                                                        {escala === e.id && (
                                                            <IconCheck
                                                                color={
                                                                    SCALE_COLORS[
                                                                        e.id
                                                                    ]
                                                                }
                                                                size={18}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={guardarAjustes}
                                            disabled={guardando}
                                            style={{
                                                padding: "14px",
                                                borderRadius: "12px",
                                                background: guardado
                                                    ? t.success
                                                    : accentColor,
                                                color: "#fff",
                                                border: "none",
                                                fontSize: "14px",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                fontFamily:
                                                    "Inter, system-ui, sans-serif",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "8px",
                                                transition: "background 0.2s",
                                                marginTop: "10px",
                                            }}
                                        >
                                            {guardado ? (
                                                <>
                                                    <IconCheck
                                                        color="#fff"
                                                        size={16}
                                                    />{" "}
                                                    Guardado
                                                </>
                                            ) : guardando ? (
                                                "Guardando…"
                                            ) : (
                                                "Guardar cambios"
                                            )}
                                        </motion.button>
                                        {/* Info estado premium */}
                                        <div
                                            style={{
                                                padding: "16px",
                                                borderRadius: "12px",
                                                background: isPremium
                                                    ? `${accentColor}10`
                                                    : t.glass,
                                                border: `1px solid ${isPremium ? accentColor + "30" : t.border}`,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    color: isPremium
                                                        ? accentColor
                                                        : t.textMuted,
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                {isPremium
                                                    ? premiumType === "admin"
                                                        ? "Cuenta Admin"
                                                        : "Cuenta Premium"
                                                    : "Plan gratuito"}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: t.textMuted,
                                                }}
                                            >
                                                {isPremium
                                                    ? "Acceso completo a todos los exámenes, simulacros e historial ilimitado."
                                                    : "Acceso a tests de temario. Actualiza para desbloquear exámenes oficiales."}
                                            </div>
                                            {!isPremium && (
                                                <a
                                                    href="/payment"
                                                    style={{
                                                        display: "inline-block",
                                                        marginTop: "10px",
                                                        padding: "6px 14px",
                                                        borderRadius: "8px",
                                                        background: "#8B5CF6",
                                                        color: "#fff",
                                                        fontSize: "12px",
                                                        fontWeight: 700,
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    Ver planes →
                                                </a>
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                paddingTop: "24px",
                                                borderTop: `1px solid ${t.border}`,
                                            }}
                                        >
                                            <button
                                                onClick={handleSignOut}
                                                style={{
                                                    width: "100%",
                                                    padding: "14px",
                                                    borderRadius: "12px",
                                                    background: "transparent",
                                                    border: `1px solid ${t.border}`,
                                                    color: t.textMuted,
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    fontFamily:
                                                        "Inter, system-ui, sans-serif",
                                                    transition: "all 0.2s",
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.color =
                                                        t.error
                                                    e.currentTarget.style.borderColor =
                                                        t.error
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.color =
                                                        t.textMuted
                                                    e.currentTarget.style.borderColor =
                                                        t.border
                                                }}
                                            >
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>

            <FooterHome dark={dark} accent={accentColor} />
            <style
                dangerouslySetInnerHTML={{
                    __html: `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`,
                }}
            />
        </div>
    )
}
