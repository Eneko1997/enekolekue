"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { createClient } from "@/lib/supabase/client"

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ougvtcmqmcutrexxrxvz.supabase.co")
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_lfcfMDSYpIDWzy2CWufT_A_NfJbTimc")
const supabase = createClient()

// Caché de sesión para mantener una API síncrona (getSessionToken/getSessionUser),
// poblada por supabase-js (que refresca el token automáticamente).
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

async function fetchPreguntas(testId: string): Promise<any[]> {
    const { data, error } = await supabase
        .from("preguntas")
        .select("*")
        .eq("test_id", testId)
        .order("orden", { ascending: true })
    if (error || !Array.isArray(data)) return []
    return data
}

async function saveResult(payload: object, _token: string) {
    await supabase.from("test_results").insert(payload as any)
}

async function upsertProgress(
    userId: string,
    testId: string,
    porcentaje: number,
    _token: string
) {
    try {
        const { data: existing } = await supabase
            .from("test_progress")
            .select("mejor_porcentaje,num_intentos")
            .eq("user_id", userId)
            .eq("test_id", testId)
        const row = (existing as any)?.[0]
        const mejorActual = row?.mejor_porcentaje ?? 0
        const numIntentos = (row?.num_intentos ?? 0) + 1
        await supabase.from("test_progress").upsert(
            {
                user_id: userId,
                test_id: testId,
                ultimo_intento: new Date().toISOString(),
                mejor_porcentaje: Math.max(mejorActual, porcentaje),
                num_intentos: numIntentos,
            },
            { onConflict: "user_id,test_id" }
        )
    } catch (e) {
        console.error("upsertProgress:", e)
    }
}

function getStoredSession(): { token: string; user: any } | null {
    if (_token && _user) return { token: _token, user: _user }
    return null
}
function getSessionToken(): string | null {
    return _token
}
function getSessionUser(): any {
    return _user
}
function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

function getUrlParam(name: string): string | null {
    try {
        return new URLSearchParams(window.location.search).get(name)
    } catch {
        return null
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAPA DE TÍTULOS — alineado con DashboardOPE v8 (temarios oficiales IVAP)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// TEMA
// ─────────────────────────────────────────────────────────────────────────────
const c = {
    bg: "#0B0C10",
    surface: "rgba(25,26,35,0.7)",
    surfaceHover: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.15)",
    accent: "#E8543A", // color único de marca opobask
    text: "#FFFFFF",
    muted: "#8B8D98",
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",
}

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────
interface Pregunta {
    id: string
    enunciado: string
    opciones: string[]
    correcta: number
    explicacion: string
}
type Modo = "examen" | "repaso"
type Fase =
    | "cargando"
    | "sin_preguntas"
    | "inicio"
    | "config_examen"
    | "test"
    | "examen"
    | "resultados"

// Color del acento: viene del URL param "accent" (lo pasa el Dashboard)
// o se infiere del test_id según la escala
const SCALE_COLORS_TEST: Record<string, string> = {
    auxiliares: "#3B82F6",
    administrativos: "#E8543A",
    gestion: "#10B981",
    superiores: "#8B5CF6",
}

function getAccent(testId: string): string {
    const fromUrl = getUrlParam("accent")
    if (fromUrl) return decodeURIComponent(fromUrl)
    if (testId.startsWith("aux") || testId.startsWith("sim_aux"))
        return SCALE_COLORS_TEST.auxiliares
    if (testId.startsWith("adm") || testId.startsWith("sim_adm"))
        return SCALE_COLORS_TEST.administrativos
    if (testId.startsWith("ges") || testId.startsWith("sim_ges"))
        return SCALE_COLORS_TEST.gestion
    if (
        testId.startsWith("sup") ||
        testId.startsWith("sim_sup") ||
        testId.startsWith("supe")
    )
        return SCALE_COLORS_TEST.superiores
    return SCALE_COLORS_TEST.administrativos
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR Y FOOTER COMPARTIDOS (mismo diseño que el Dashboard)
// ─────────────────────────────────────────────────────────────────────────────
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

// Tema oscuro/claro idéntico al Dashboard
// Color de acento del header — fijo en todas las pantallas, NUNCA cambia con la escala
const HEADER_ACCENT = "#E8E6E1"

function getTheme(dark: boolean) {
    return {
        bg: dark ? "#0B0C10" : "#F5F5F7",
        surface: dark ? "rgba(25,26,35,0.7)" : "rgba(255,255,255,0.85)",
        border: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)",
        borderStrong: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)",
        textMain: dark ? "#FFFFFF" : "#111111",
        textMuted: dark ? "#8B8D98" : "#666870",
        // Navbar: negro neutro fijo, independiente del modo claro/oscuro
        navBg: "rgba(10,10,12,0.96)",
        navText: "#FFFFFF",
        navTextMuted: "rgba(255,255,255,0.62)",
        navBorder: "rgba(255,255,255,0.10)",
        navSurface: "rgba(255,255,255,0.07)",
    }
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
        { label: "📊 Mi progreso", href: "/perfil?tab=stats" },
        { label: "🏆 Mis exámenes", href: "/perfil?tab=examenes" },
        { label: "📋 Mi historial", href: "/perfil?tab=historial" },
        { label: "⚙️ Ajustes", href: "/perfil?tab=ajustes" },
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

function SharedNavbar({
    accent: _scaleAccent,
    dark,
    onToggleDark,
    user,
    onSignOut,
    onShowAuth,
    mobileOpen,
    setMobileOpen,
    isMobile,
    avatarOpen,
    setAvatarOpen,
    avatarRef,
    homeUrl,
}: {
    accent: string
    dark: boolean
    onToggleDark: () => void
    user?: any
    onSignOut?: () => void
    onShowAuth?: () => void
    mobileOpen: boolean
    setMobileOpen: (v: boolean | ((prev: boolean) => boolean)) => void
    isMobile: boolean
    avatarOpen: boolean
    setAvatarOpen: (v: boolean | ((p: boolean) => boolean)) => void
    avatarRef: React.RefObject<HTMLDivElement | null>
    homeUrl: string
}) {
    const t = getTheme(dark)
    const accent = HEADER_ACCENT // el acento del header SIEMPRE es fijo, ignora el prop dinámico de escala

    const links = [
        {
            label: "📅 Fechas OPE",
            href: "https://www.euskadi.eus/oposiciones",
            external: true,
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
                {/* Logo */}
                <a
                    href="/"
                    style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        letterSpacing: "-0.5px",
                        textDecoration: "none",
                        color: t.navText,
                        flexShrink: 0,
                    }}
                >
                    gain
                    <span style={{ color: accent, transition: "color 0.3s" }}>
                        ditu
                    </span>
                    .
                </a>

                {/* Links centro — solo desktop */}
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
                                target={link.external ? "_blank" : "_self"}
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

                {/* Derecha */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0,
                    }}
                >
                    {/* Modo oscuro/claro */}
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

                    {/* Volver al inicio — solo desktop, un único botón */}
                    {!isMobile && (
                        <a
                            href={homeUrl}
                            onClick={(e) => {
                                e.preventDefault()
                                window.location.assign(homeUrl)
                            }}
                            style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                background: "transparent",
                                border: `1px solid ${t.navBorder}`,
                                color: t.navTextMuted,
                                fontSize: "13px",
                                fontWeight: 600,
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                            }}
                        >
                            ← Volver
                        </a>
                    )}

                    {/* Avatar con dropdown — solo desktop */}
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

                    {/* Sin sesión: botón Entrar — solo desktop */}
                    {!isMobile && !user && (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onShowAuth && onShowAuth()}
                            style={{
                                padding: "7px 16px",
                                borderRadius: "8px",
                                background: "#FFFFFF",
                                color: "#0A0A0C",
                                border: "none",
                                fontSize: "13px",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "Inter, system-ui, sans-serif",
                            }}
                        >
                            Entrar
                        </motion.button>
                    )}

                    {/* Volver — mobile: icono casa junto al burger */}
                    {isMobile && (
                        <a
                            href="/"
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
                            aria-label="Volver al inicio"
                        >
                            🏠
                        </a>
                    )}

                    {/* Burger mobile */}
                    {isMobile && (
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setMobileOpen((o) => !o)}
                            aria-label="Menú"
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

            {/* Menú mobile */}
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
                                onClick={(e) => {
                                    e.preventDefault()
                                    window.location.assign(homeUrl)
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
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
                                    target={link.external ? "_blank" : "_self"}
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
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "26px",
                                            height: "26px",
                                            borderRadius: "50%",
                                            background:
                                                "linear-gradient(135deg, #E8E6E1, #E8E6E199)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "10px",
                                            fontWeight: 700,
                                            color: "#0A0A0C",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {(user.full_name ?? user.email ?? "OP")
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: t.navTextMuted,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {user.email}
                                    </div>
                                </div>
                                {[
                                    {
                                        label: "📊 Mi progreso",
                                        href: "/perfil?tab=stats",
                                    },
                                    {
                                        label: "🏆 Mis exámenes",
                                        href: "/perfil?tab=examenes",
                                    },
                                    {
                                        label: "📋 Mi historial",
                                        href: "/perfil?tab=historial",
                                    },
                                    {
                                        label: "⚙️ Ajustes",
                                        href: "/perfil?tab=ajustes",
                                    },
                                ].map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
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
                                        {item.label}
                                    </a>
                                ))}
                                <button
                                    onClick={() => {
                                        onSignOut && onSignOut()
                                        setMobileOpen(false)
                                    }}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        textAlign: "left",
                                        padding: "10px 4px",
                                        background: "none",
                                        border: "none",
                                        fontSize: "15px",
                                        fontWeight: 500,
                                        color: "#EF4444",
                                        cursor: "pointer",
                                        fontFamily:
                                            "Inter, system-ui, sans-serif",
                                        marginTop: "4px",
                                    }}
                                >
                                    → Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <div style={{ padding: "10px 20px 18px" }}>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                        onShowAuth && onShowAuth()
                                        setMobileOpen(false)
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "10px",
                                        background: "#FFFFFF",
                                        color: "#0A0A0C",
                                        border: "none",
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        fontFamily:
                                            "Inter, system-ui, sans-serif",
                                    }}
                                >
                                    Entrar / Registrarse
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

function SharedFooter({ dark, accent }: { dark: boolean; accent: string }) {
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
                {/* Marca */}
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
                        {
                            label: "Auxiliares Administrativos",
                            href: "/#auxiliares",
                        },
                        {
                            label: "Administrativos",
                            href: "/#administrativos",
                        },
                        {
                            label: "Técnicos de Gestión",
                            href: "/#gestion",
                        },
                        {
                            label: "Técnicos Superiores",
                            href: "/#superiores",
                        },
                        {
                            label: "Exámenes Oficiales",
                            href: "/#examenes-oficiales",
                        },
                    ].map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
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
                            {l.label}
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
                    ].map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
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
                            {l.label}
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
                        📷 @gainditu en Instagram
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
                            📅 OPE 2026
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

// ─────────────────────────────────────────────────────────────────────────────
// PANTALLA: INICIO
// ─────────────────────────────────────────────────────────────────────────────
function PantallaInicio({
    titulo,
    total,
    onStart,
    onBack,
    accent,
    modo,
    setModo,
}: {
    titulo: string
    total: number
    onStart: (m: Modo) => void
    onBack: () => void
    accent: string
    modo: Modo
    setModo: (m: Modo) => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                maxWidth: "560px",
                margin: "0 auto",
                padding: "40px 20px",
            }}
        >
            <button
                onClick={onBack}
                style={{
                    background: "none",
                    border: "none",
                    color: c.muted,
                    cursor: "pointer",
                    fontSize: "14px",
                    marginBottom: "32px",
                    padding: 0,
                    fontFamily: "Inter,system-ui,sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}
            >
                ← Volver al dashboard
            </button>
            <div
                style={{
                    background: c.surface,
                    border: `1px solid ${c.border}`,
                    borderRadius: "24px",
                    padding: "36px",
                }}
            >
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
                    Test
                </div>
                <h1
                    style={{
                        fontSize: "22px",
                        fontWeight: 800,
                        lineHeight: 1.25,
                        marginBottom: "6px",
                        letterSpacing: "-0.5px",
                    }}
                >
                    {titulo}
                </h1>
                <p
                    style={{
                        color: c.muted,
                        fontSize: "14px",
                        marginBottom: "28px",
                    }}
                >
                    {total} preguntas
                </p>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginBottom: "28px",
                    }}
                >
                    {(["repaso", "examen"] as Modo[]).map((m) => (
                        <motion.div
                            key={m}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setModo(m)}
                            style={{
                                padding: "18px",
                                borderRadius: "16px",
                                border: `2px solid ${modo === m ? accent : c.border}`,
                                background:
                                    modo === m ? `${accent}12` : "transparent",
                                cursor: "pointer",
                                transition: "border-color 0.15s",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "20px",
                                    marginBottom: "8px",
                                }}
                            >
                                {m === "repaso" ? "📖" : "🎓"}
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    color: modo === m ? accent : c.text,
                                    marginBottom: "4px",
                                }}
                            >
                                {m === "repaso" ? "Modo Repaso" : "Modo Examen"}
                            </div>
                            <div
                                style={{
                                    fontSize: "11px",
                                    color: c.muted,
                                    lineHeight: 1.5,
                                }}
                            >
                                {m === "repaso"
                                    ? "Feedback por pregunta. Sin penalización. Aprende de los errores."
                                    : "Sin feedback hasta el final. Elige si penaliza o no."}
                            </div>
                        </motion.div>
                    ))}
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onStart(modo)}
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
                        fontFamily: "Inter,system-ui,sans-serif",
                    }}
                >
                    Empezar {modo === "repaso" ? "repaso" : "examen"} →
                </motion.button>
            </div>
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// PANTALLA: CONFIG EXAMEN
// ─────────────────────────────────────────────────────────────────────────────
function PantallaConfigExamen({
    titulo,
    total,
    onConfirm,
    onBack,
    accent,
    penaliza,
    setPenaliza,
    numConfig,
    setNumConfig,
}: {
    titulo: string
    total: number
    onConfirm: (penaliza: boolean, num: number) => void
    onBack: () => void
    accent: string
    penaliza: boolean
    setPenaliza: (v: boolean) => void
    numConfig: number
    setNumConfig: (v: number) => void
}) {
    const num = numConfig
    const setNum = setNumConfig

    const opciones_num = [
        { label: "25 preguntas", val: 25 },
        { label: "50 preguntas", val: 50 },
        { label: "75 preguntas", val: 75 },
        { label: "100 preguntas", val: 100 },
        { label: `Todas (${total})`, val: 0 },
    ].filter((o) => o.val === 0 || o.val <= total)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                maxWidth: "480px",
                margin: "0 auto",
                padding: "40px 20px",
            }}
        >
            <button
                onClick={onBack}
                style={{
                    background: "none",
                    border: "none",
                    color: c.muted,
                    cursor: "pointer",
                    fontSize: "14px",
                    marginBottom: "32px",
                    padding: 0,
                    fontFamily: "Inter,system-ui,sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                }}
            >
                ← Cambiar modo
            </button>
            <div
                style={{
                    background: c.surface,
                    border: `1px solid ${c.border}`,
                    borderRadius: "24px",
                    padding: "36px",
                }}
            >
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
                    🎓 Modo Examen
                </div>
                <h2
                    style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        lineHeight: 1.25,
                        marginBottom: "6px",
                        letterSpacing: "-0.5px",
                    }}
                >
                    {titulo}
                </h2>
                <p
                    style={{
                        color: c.muted,
                        fontSize: "13px",
                        marginBottom: "28px",
                    }}
                >
                    Sin feedback hasta el final
                </p>

                {/* Número de preguntas */}
                <div
                    style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: c.text,
                        marginBottom: "12px",
                    }}
                >
                    ¿Cuántas preguntas?
                </div>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "24px",
                    }}
                >
                    {opciones_num.map((op) => (
                        <motion.button
                            key={op.val}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setNum(op.val)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "100px",
                                border: `1.5px solid ${num === op.val ? accent : c.border}`,
                                background:
                                    num === op.val
                                        ? `${accent}15`
                                        : "transparent",
                                color: num === op.val ? accent : c.muted,
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "Inter,system-ui,sans-serif",
                                transition: "all 0.15s",
                            }}
                        >
                            {op.label}
                        </motion.button>
                    ))}
                </div>

                {/* Penalización */}
                <div
                    style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: c.text,
                        marginBottom: "12px",
                    }}
                >
                    ¿Penalización por fallo?
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginBottom: "28px",
                    }}
                >
                    {[
                        {
                            val: true,
                            label: "Sí — -0,33 por respuesta incorrecta",
                            desc: "Sistema oficial IVAP. Las incorrectas restan puntos.",
                        },
                        {
                            val: false,
                            label: "No — sin penalización",
                            desc: "Solo suman las correctas. Ideal para practicar.",
                        },
                    ].map((opt) => (
                        <motion.div
                            key={String(opt.val)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setPenaliza(opt.val)}
                            style={{
                                padding: "14px 16px",
                                borderRadius: "14px",
                                border: `2px solid ${penaliza === opt.val ? accent : c.border}`,
                                background:
                                    penaliza === opt.val
                                        ? `${accent}10`
                                        : "transparent",
                                cursor: "pointer",
                                transition: "border-color 0.15s",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    color:
                                        penaliza === opt.val ? accent : c.text,
                                    marginBottom: "3px",
                                }}
                            >
                                {opt.label}
                            </div>
                            <div style={{ fontSize: "11px", color: c.muted }}>
                                {opt.desc}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onConfirm(penaliza, num)}
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
                        fontFamily: "Inter,system-ui,sans-serif",
                    }}
                >
                    Empezar examen →
                </motion.button>
            </div>
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// PANTALLA: PREGUNTA
// ─────────────────────────────────────────────────────────────────────────────
// ─── MODAL IMPUGNAR PREGUNTA ──────────────────────────────────────────────────
function ModalImpugnar({
    pregunta,
    dark,
    accent,
    onClose,
    onConfirm,
}: {
    pregunta: Pregunta
    dark: boolean
    accent: string
    onClose: () => void
    onConfirm: () => void
}) {
    const t = getTheme(dark)
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1200,
                padding: "20px",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                    background: dark ? "#1A1B24" : "#FFFFFF",
                    border: `1px solid ${t.borderStrong}`,
                    borderRadius: "18px",
                    padding: "28px 24px",
                    maxWidth: "380px",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        fontSize: "28px",
                        marginBottom: "10px",
                        textAlign: "center",
                    }}
                >
                    ⚑
                </div>
                <h3
                    style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: t.textMain,
                        margin: "0 0 8px",
                        textAlign: "center",
                    }}
                >
                    ¿Impugnar esta pregunta?
                </h3>
                <p
                    style={{
                        fontSize: "13px",
                        color: t.textMuted,
                        lineHeight: 1.6,
                        margin: "0 0 16px",
                        textAlign: "center",
                    }}
                >
                    Se enviará un email para revisarla. Solo hazlo si crees que
                    hay un error real en la pregunta o la respuesta correcta.
                </p>
                <div
                    style={{
                        background: dark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.05)",
                        border: `1px solid ${t.border}`,
                        borderRadius: "10px",
                        padding: "12px",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "12px",
                            color: t.textMain,
                            lineHeight: 1.6,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {pregunta.enunciado}
                    </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: "10px",
                            background: "transparent",
                            border: `1px solid ${t.border}`,
                            color: t.textMuted,
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: 600,
                            fontFamily: "Inter,system-ui,sans-serif",
                        }}
                    >
                        Cancelar
                    </button>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: "10px",
                            background: "#EF4444",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: 700,
                            fontFamily: "Inter,system-ui,sans-serif",
                        }}
                    >
                        Sí, impugnar
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    )
}

function PantallaPregunta({
    pregunta,
    numero,
    total,
    modo,
    respuesta,
    onRespuesta,
    onSiguiente,
    onFinalizar,
    accent,
    verExp,
    onToggleExp,
    onImpugnar,
}: {
    pregunta: Pregunta
    numero: number
    total: number
    modo: Modo
    respuesta: number | null
    onRespuesta: (i: number) => void
    onSiguiente: () => void
    onFinalizar: () => void
    accent: string
    verExp: boolean
    onToggleExp: () => void
    onImpugnar?: (p: Pregunta) => void
}) {
    const respondida = respuesta !== null
    const mostrarFeedback = modo === "repaso" && respondida
    const fallo = mostrarFeedback && respuesta !== pregunta.correcta

    function bg(i: number) {
        if (!mostrarFeedback)
            return respuesta === i ? `${accent}18` : "transparent"
        if (i === pregunta.correcta) return `${c.success}15`
        if (i === respuesta) return `${c.error}15`
        return "transparent"
    }
    function border(i: number) {
        if (!mostrarFeedback) return respuesta === i ? accent : c.border
        if (i === pregunta.correcta) return c.success
        if (i === respuesta) return c.error
        return c.border
    }
    function icono(i: number) {
        if (!mostrarFeedback) return ["A", "B", "C", "D"][i]
        if (i === pregunta.correcta) return "✓"
        if (i === respuesta) return "✗"
        return ["A", "B", "C", "D"][i]
    }
    function iconoColor(i: number) {
        if (!mostrarFeedback) return c.muted
        if (i === pregunta.correcta) return c.success
        if (i === respuesta) return c.error
        return c.muted
    }

    return (
        <motion.div
            key={pregunta.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            style={{
                maxWidth: "660px",
                margin: "0 auto",
                padding: "28px 20px",
            }}
        >
            <div style={{ marginBottom: "20px" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                    }}
                >
                    <span style={{ fontSize: "12px", color: c.muted }}>
                        {numero} / {total}
                    </span>
                    <span
                        style={{
                            fontSize: "12px",
                            color: accent,
                            fontWeight: 600,
                        }}
                    >
                        {Math.round((numero / total) * 100)}%
                    </span>
                </div>
                <div
                    style={{
                        height: "3px",
                        background: c.border,
                        borderRadius: "100px",
                        overflow: "hidden",
                    }}
                >
                    <motion.div
                        animate={{ width: `${(numero / total) * 100}%` }}
                        transition={{ duration: 0.35 }}
                        style={{
                            height: "100%",
                            background: accent,
                            borderRadius: "100px",
                        }}
                    />
                </div>
            </div>

            <div
                style={{
                    background: c.surface,
                    border: `1px solid ${c.border}`,
                    borderRadius: "18px",
                    padding: "24px",
                    marginBottom: "14px",
                }}
            >
                <div
                    style={{
                        fontSize: "10px",
                        color: accent,
                        fontWeight: 700,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        marginBottom: "6px",
                    }}
                >
                    📖 Repaso
                </div>
                <div
                    style={{
                        fontSize: "11px",
                        color: c.muted,
                        marginBottom: "10px",
                    }}
                >
                    Feedback inmediato en cada respuesta · Sin penalización
                </div>
                <p
                    style={{
                        fontSize: "16px",
                        lineHeight: 1.65,
                        margin: 0,
                        fontWeight: 500,
                    }}
                >
                    {pregunta.enunciado}
                </p>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "9px",
                    marginBottom: "14px",
                }}
            >
                {pregunta.opciones.map((op, i) => (
                    <motion.div
                        key={i}
                        whileHover={!respondida ? { scale: 1.01 } : {}}
                        whileTap={!respondida ? { scale: 0.99 } : {}}
                        onClick={() => !respondida && onRespuesta(i)}
                        style={{
                            padding: "14px 18px",
                            borderRadius: "12px",
                            border: `1.5px solid ${border(i)}`,
                            background: bg(i),
                            cursor: respondida ? "default" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            transition: "border-color 0.15s, background 0.15s",
                        }}
                    >
                        <span
                            style={{
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                border: `1.5px solid ${border(i)}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: 700,
                                flexShrink: 0,
                                color: iconoColor(i),
                                background:
                                    mostrarFeedback && i === pregunta.correcta
                                        ? `${c.success}20`
                                        : mostrarFeedback &&
                                            i === respuesta &&
                                            i !== pregunta.correcta
                                          ? `${c.error}20`
                                          : "transparent",
                            }}
                        >
                            {icono(i)}
                        </span>
                        <span style={{ fontSize: "14px", lineHeight: 1.4 }}>
                            {op}
                        </span>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {fallo && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: "hidden", marginBottom: "14px" }}
                    >
                        <div
                            style={{
                                background: `${c.warning}10`,
                                border: `1px solid ${c.warning}35`,
                                borderRadius: "14px",
                                padding: "16px 18px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: verExp ? "10px" : 0,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: c.warning,
                                    }}
                                >
                                    ✨ Explicación
                                </span>
                                <button
                                    onClick={onToggleExp}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: c.warning,
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        fontFamily:
                                            "Inter,system-ui,sans-serif",
                                    }}
                                >
                                    {verExp ? "Ocultar" : "Ver"}
                                </button>
                            </div>
                            <AnimatePresence>
                                {verExp && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            fontSize: "13px",
                                            lineHeight: 1.7,
                                            margin: 0,
                                            color: c.text,
                                            opacity: 0.88,
                                        }}
                                    >
                                        {pregunta.explicacion}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {respondida && (
                <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={numero === total ? onFinalizar : onSiguiente}
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "12px",
                        background: accent,
                        color: "#fff",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "Inter,system-ui,sans-serif",
                    }}
                >
                    {numero === total ? "Ver resultados →" : "Siguiente →"}
                </motion.button>
            )}

            {/* Botón impugnar — siempre visible, discreto */}
            {onImpugnar && (
                <div style={{ textAlign: "center", marginTop: "28px" }}>
                    <button
                        onClick={() => onImpugnar(pregunta)}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.25)",
                            cursor: "pointer",
                            fontFamily: "Inter,system-ui,sans-serif",
                            textDecoration: "underline",
                            padding: "8px 16px",
                        }}
                    >
                        ⚑ Impugnar esta pregunta
                    </button>
                </div>
            )}
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// PANTALLA: EXAMEN COMPLETO (todas las preguntas en scroll, sin feedback)
// ─────────────────────────────────────────────────────────────────────────────
function PantallaExamen({
    preguntas,
    respuestas,
    onRespuesta,
    onFinalizar,
    accent,
    penalizacion,
}: {
    preguntas: Pregunta[]
    respuestas: (number | null)[]
    onRespuesta: (idx: number, opcion: number) => void
    onFinalizar: () => void
    accent: string
    penalizacion: number
}) {
    const total = preguntas.length
    const respondidas = respuestas.filter((r) => r !== null).length

    return (
        <div
            style={{
                maxWidth: "660px",
                margin: "0 auto",
                padding: "20px 20px 40px",
            }}
        >
            {/* Banner modo examen */}
            <div
                style={{
                    background: `${accent}10`,
                    border: `1px solid ${accent}25`,
                    borderRadius: "12px",
                    padding: "12px 16px",
                    marginBottom: "28px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                }}
            >
                <span style={{ fontSize: "18px" }}>🎓</span>
                <div>
                    <div
                        style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: accent,
                            marginBottom: "2px",
                        }}
                    >
                        Modo Examen
                    </div>
                    <div
                        style={{
                            fontSize: "12px",
                            color: c.muted,
                            lineHeight: 1.4,
                        }}
                    >
                        Responde todas las preguntas y envía al final.{" "}
                        {penalizacion > 0
                            ? "Los fallos restan −0,33 puntos (sistema IVAP)."
                            : "Sin penalización por fallo."}{" "}
                        Sin feedback hasta que termines.
                    </div>
                </div>
            </div>

            {/* Progreso sticky */}
            <div
                style={{
                    position: "sticky",
                    top: "56px",
                    zIndex: 10,
                    background: c.bg,
                    paddingBottom: "12px",
                    marginBottom: "4px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                    }}
                >
                    <span style={{ fontSize: "12px", color: c.muted }}>
                        {respondidas} / {total} respondidas
                    </span>
                    <span
                        style={{
                            fontSize: "12px",
                            color: accent,
                            fontWeight: 600,
                        }}
                    >
                        {Math.round((respondidas / total) * 100)}%
                    </span>
                </div>
                <div
                    style={{
                        height: "3px",
                        background: c.border,
                        borderRadius: "100px",
                        overflow: "hidden",
                    }}
                >
                    <motion.div
                        animate={{ width: `${(respondidas / total) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        style={{
                            height: "100%",
                            background: accent,
                            borderRadius: "100px",
                        }}
                    />
                </div>
            </div>

            {/* Todas las preguntas */}
            {preguntas.map((pregunta, i) => {
                const resp = respuestas[i]
                const respondida = resp !== null
                return (
                    <div key={pregunta.id} style={{ marginBottom: "20px" }}>
                        {/* Número */}
                        <div
                            style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: accent,
                                letterSpacing: "0.5px",
                                marginBottom: "8px",
                            }}
                        >
                            Pregunta {i + 1}
                        </div>

                        {/* Enunciado */}
                        <div
                            style={{
                                background: c.surface,
                                border: `1px solid ${c.border}`,
                                borderRadius: "14px",
                                padding: "18px 20px",
                                marginBottom: "8px",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "15px",
                                    lineHeight: 1.65,
                                    margin: 0,
                                    fontWeight: 500,
                                }}
                            >
                                {pregunta.enunciado}
                            </p>
                        </div>

                        {/* Opciones */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "7px",
                            }}
                        >
                            {pregunta.opciones.map((op, j) => (
                                <div
                                    key={j}
                                    onClick={() => onRespuesta(i, j)}
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: `1.5px solid ${resp === j ? accent : c.border}`,
                                        background:
                                            resp === j
                                                ? `${accent}15`
                                                : "transparent",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        transition:
                                            "border-color 0.12s, background 0.12s",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: "24px",
                                            height: "24px",
                                            borderRadius: "50%",
                                            border: `1.5px solid ${resp === j ? accent : c.border}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "11px",
                                            fontWeight: 700,
                                            flexShrink: 0,
                                            color:
                                                resp === j ? accent : c.muted,
                                            background:
                                                resp === j
                                                    ? `${accent}20`
                                                    : "transparent",
                                        }}
                                    >
                                        {["A", "B", "C", "D"][j]}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {op}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}

            {/* Botón entregar */}
            <div
                style={{
                    position: "sticky",
                    bottom: "20px",
                    marginTop: "16px",
                }}
            >
                {/* Botón terminar anticipado — solo si quedan preguntas */}
                {respondidas < total && respondidas > 0 && (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={onFinalizar}
                        style={{
                            width: "100%",
                            padding: "13px",
                            borderRadius: "12px",
                            background: "transparent",
                            color: c.muted,
                            border: `1px solid ${c.border}`,
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "Inter,system-ui,sans-serif",
                            marginBottom: "10px",
                        }}
                    >
                        Terminar examen ahora ({total - respondidas} sin
                        responder)
                    </motion.button>
                )}
                {/* Botón entregar — destacado cuando todas respondidas */}
                <motion.button
                    whileHover={{
                        scale: 1.02,
                        boxShadow: `0 0 20px ${accent}40`,
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onFinalizar}
                    style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: "12px",
                        background:
                            respondidas === total ? accent : `${accent}80`,
                        color: "#fff",
                        border: "none",
                        fontSize: "15px",
                        fontWeight: 800,
                        cursor: "pointer",
                        fontFamily: "Inter,system-ui,sans-serif",
                    }}
                >
                    {respondidas === total
                        ? "Entregar examen →"
                        : `Entregar (${respondidas}/${total} respondidas)`}
                </motion.button>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// PANTALLA: RESULTADOS
// ─────────────────────────────────────────────────────────────────────────────
function PantallaResultados({
    testId,
    titulo,
    preguntas,
    respuestas,
    penalizacion,
    tiempo,
    modo,
    onRepetir,
    onVolver,
    accent,
}: {
    testId: string
    titulo: string
    preguntas: Pregunta[]
    respuestas: (number | null)[]
    penalizacion: number
    tiempo: number
    modo: Modo
    onRepetir: () => void
    onVolver: () => void
    accent: string
}) {
    const total = preguntas.length
    const correctas = respuestas.filter(
        (r, i) => r === preguntas[i].correcta
    ).length
    const incorrectas = respuestas.filter(
        (r, i) => r !== null && r !== preguntas[i].correcta
    ).length
    const sinResp = respuestas.filter((r) => r === null).length
    const puntos = Math.max(0, correctas - incorrectas * penalizacion)
    const pct = Math.round((puntos / total) * 100)
    const aprobado = pct >= 50
    const colorNota = pct >= 70 ? c.success : pct >= 50 ? c.warning : c.error
    const min = Math.floor(tiempo / 60),
        seg = tiempo % 60
    const esRepaso = modo === "repaso"

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                maxWidth: "640px",
                margin: "0 auto",
                padding: "40px 20px",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
                {esRepaso ? (
                    <div>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                            {correctas === total
                                ? "🎉"
                                : correctas >= total * 0.7
                                  ? "💪"
                                  : "📖"}
                        </div>
                        <h2
                            style={{
                                fontSize: "22px",
                                fontWeight: 800,
                                marginBottom: "8px",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            {correctas === total
                                ? "¡Perfecto, todas correctas!"
                                : correctas >= total * 0.7
                                  ? "¡Muy bien!"
                                  : "Sigue repasando"}
                        </h2>
                        <p
                            style={{
                                color: c.muted,
                                fontSize: "13px",
                                marginBottom: "4px",
                            }}
                        >
                            {titulo} · Modo Repaso · {min}m {seg}s
                        </p>
                        <p style={{ color: c.muted, fontSize: "12px" }}>
                            En repaso los fallos no penalizan — lo importante es
                            aprender.
                        </p>
                    </div>
                ) : (
                    <div>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 18,
                            }}
                            style={{
                                width: "120px",
                                height: "120px",
                                borderRadius: "50%",
                                background: `${colorNota}12`,
                                border: `3px solid ${colorNota}`,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "34px",
                                    fontWeight: 900,
                                    color: colorNota,
                                    lineHeight: 1,
                                }}
                            >
                                {pct}%
                            </span>
                            <span
                                style={{
                                    fontSize: "9px",
                                    color: colorNota,
                                    fontWeight: 700,
                                    letterSpacing: "1px",
                                }}
                            >
                                {aprobado ? "APROBADO" : "SUSPENDIDO"}
                            </span>
                        </motion.div>
                        <h2
                            style={{
                                fontSize: "22px",
                                fontWeight: 800,
                                marginBottom: "6px",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            {aprobado ? "¡Buen trabajo!" : "Sigue practicando"}
                        </h2>
                        <p style={{ color: c.muted, fontSize: "13px" }}>
                            {titulo} · Modo Examen ·{" "}
                            {penalizacion > 0
                                ? `-${penalizacion} por fallo`
                                : "sin penalización"}{" "}
                            · {min}m {seg}s
                        </p>
                    </div>
                )}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: esRepaso
                        ? "repeat(3,1fr)"
                        : "repeat(4,1fr)",
                    gap: "10px",
                    marginBottom: "24px",
                }}
            >
                {[
                    { label: "Correctas", v: correctas, color: c.success },
                    { label: "Incorrectas", v: incorrectas, color: c.error },
                    { label: "En blanco", v: sinResp, color: c.muted },
                    ...(!esRepaso
                        ? [
                              {
                                  label: "Puntos",
                                  v: `${puntos.toFixed(2)}/${total}`,
                                  color: colorNota,
                              },
                          ]
                        : []),
                ].map((s) => (
                    <div
                        key={s.label}
                        style={{
                            background: c.surface,
                            border: `1px solid ${c.border}`,
                            borderRadius: "12px",
                            padding: "14px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "20px",
                                fontWeight: 800,
                                color: s.color,
                            }}
                        >
                            {s.v}
                        </div>
                        <div
                            style={{
                                fontSize: "10px",
                                color: c.muted,
                                marginTop: "2px",
                            }}
                        >
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>

            <h3
                style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    marginBottom: "12px",
                    borderLeft: `3px solid ${accent}`,
                    paddingLeft: "10px",
                }}
            >
                Revisión pregunta a pregunta
            </h3>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "24px",
                }}
            >
                {preguntas.map((p, i) => {
                    const r = respuestas[i]
                    const ok = r === p.correcta
                    const bl = r === null
                    const col = bl ? c.muted : ok ? c.success : c.error
                    return (
                        <div
                            key={p.id}
                            style={{
                                background: c.surface,
                                border: `1px solid ${col}22`,
                                borderRadius: "12px",
                                padding: "12px 14px",
                                display: "flex",
                                gap: "10px",
                                alignItems: "flex-start",
                            }}
                        >
                            <span
                                style={{
                                    width: "22px",
                                    height: "22px",
                                    borderRadius: "50%",
                                    background: `${col}18`,
                                    color: col,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    flexShrink: 0,
                                    marginTop: "1px",
                                }}
                            >
                                {bl ? "—" : ok ? "✓" : "✗"}
                            </span>
                            <div style={{ flex: 1 }}>
                                <p
                                    style={{
                                        fontSize: "12px",
                                        margin: "0 0 4px",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {p.enunciado}
                                </p>
                                {!ok && (
                                    <p
                                        style={{
                                            fontSize: "11px",
                                            color: c.success,
                                            margin: 0,
                                        }}
                                    >
                                        Correcta:{" "}
                                        <strong>
                                            {p.opciones[p.correcta]}
                                        </strong>
                                    </p>
                                )}
                                {!ok && !bl && esRepaso && p.explicacion && (
                                    <p
                                        style={{
                                            fontSize: "11px",
                                            color: c.muted,
                                            margin: "4px 0 0",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {p.explicacion}
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onRepetir}
                    style={{
                        flex: 1,
                        padding: "13px",
                        borderRadius: "12px",
                        background: accent,
                        color: "#fff",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "Inter,system-ui,sans-serif",
                    }}
                >
                    Repetir test
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onVolver}
                    style={{
                        flex: 1,
                        padding: "13px",
                        borderRadius: "12px",
                        background: "transparent",
                        color: c.muted,
                        border: `1px solid ${c.border}`,
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "Inter,system-ui,sans-serif",
                    }}
                >
                    Volver al dashboard
                </motion.button>
            </div>
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// POPUP REGISTRO CADA 3 PREGUNTAS (solo si no hay sesión)
// ─────────────────────────────────────────────────────────────────────────────
function translateAuthError(msg: string): string {
    const m = msg.toLowerCase()
    if (m.includes("is invalid") && m.includes("email"))
        return "Ese email no está permitido. Prueba con otra dirección o contacta con soporte."
    if (m.includes("already registered") || m.includes("already exists"))
        return "Ya existe una cuenta con este email. Prueba a iniciar sesión."
    if (
        m.includes("password") &&
        (m.includes("least") ||
            m.includes("short") ||
            m.includes("6 characters"))
    )
        return "La contraseña debe tener al menos 6 caracteres."
    if (
        m.includes("invalid login credentials") ||
        m.includes("invalid credentials")
    )
        return "Email o contraseña incorrectos."
    if (m.includes("rate limit"))
        return "Demasiados intentos. Espera unos minutos e inténtalo de nuevo."
    if (m.includes("network") || m.includes("fetch"))
        return "Error de conexión. Comprueba tu internet e inténtalo de nuevo."
    return msg
}

function RegisterPopup({
    accent,
    dark,
    onClose,
    tab,
    setTab,
    email,
    setEmail,
    password,
    setPassword,
    nombre,
    setNombre,
    loading,
    setLoading,
    regError,
    setRegError,
    regSuccess,
    setRegSuccess,
}: {
    accent: string
    dark: boolean
    onClose: () => void
    tab: "login" | "register"
    setTab: (v: "login" | "register") => void
    email: string
    setEmail: (v: string) => void
    password: string
    setPassword: (v: string) => void
    nombre: string
    setNombre: (v: string) => void
    loading: boolean
    setLoading: (v: boolean) => void
    regError: string
    setRegError: (v: string) => void
    regSuccess: string
    setRegSuccess: (v: string) => void
}) {
    const t = getTheme(dark)
    const error = regError
    const setError = setRegError
    const success = regSuccess
    const setSuccess = setRegSuccess

    async function handleGoogle() {
        setLoading(true)
        const next = window.location.pathname + window.location.search
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
            },
        })
        if (error) {
            setError(translateAuthError(error.message))
            setLoading(false)
        }
    }

    async function handleSubmit() {
        setError("")
        setSuccess("")
        setLoading(true)
        try {
            if (tab === "register") {
                if (!nombre.trim()) {
                    setError("Introduce tu nombre")
                    return
                }
                if (!email.includes("@") || !email.includes(".")) {
                    setError("Introduce un email válido")
                    return
                }
                if (password.length < 6) {
                    setError("La contraseña debe tener al menos 6 caracteres")
                    return
                }
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: nombre },
                        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname + window.location.search)}`,
                    },
                })
                if (error) {
                    setError(translateAuthError(error.message))
                    return
                }
                if (data.session) {
                    onClose()
                } else {
                    setSuccess(
                        "¡Cuenta creada! Revisa tu email para confirmarla y luego inicia sesión."
                    )
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) {
                    setError(translateAuthError(error.message))
                    return
                }
                onClose()
            }
        } finally {
            setLoading(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 14px",
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
                background: "rgba(0,0,0,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
                padding: "20px",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                style={{
                    background:
                        t.textMain === "#FFFFFF" ? "#141520" : "#FFFFFF",
                    border: `1px solid ${t.border}`,
                    borderRadius: "20px",
                    padding: "32px 28px",
                    maxWidth: "380px",
                    width: "100%",
                    position: "relative",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        background: "none",
                        border: "none",
                        color: t.textMuted,
                        cursor: "pointer",
                        fontSize: "20px",
                    }}
                >
                    ×
                </button>

                {/* Cabecera */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                        🎯
                    </div>
                    <h3
                        style={{
                            fontSize: "18px",
                            fontWeight: 800,
                            color: t.textMain,
                            margin: "0 0 6px",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Guarda tu progreso
                    </h3>
                    <p
                        style={{
                            fontSize: "13px",
                            color: t.textMuted,
                            margin: 0,
                            lineHeight: 1.5,
                        }}
                    >
                        Crea una cuenta gratis para guardar tus resultados y
                        continuar donde lo dejaste.
                    </p>
                </div>

                {/* Tabs login / registro */}
                <div
                    style={{
                        display: "flex",
                        background: dark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.05)",
                        borderRadius: "10px",
                        padding: "3px",
                        marginBottom: "16px",
                    }}
                >
                    {(["register", "login"] as const).map((t2) => (
                        <button
                            key={t2}
                            onClick={() => {
                                setTab(t2)
                                setError("")
                                setSuccess("")
                            }}
                            style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: "8px",
                                border: "none",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "Inter, system-ui, sans-serif",
                                background: tab === t2 ? accent : "transparent",
                                color: tab === t2 ? "#fff" : t.textMuted,
                                transition: "all 0.15s",
                            }}
                        >
                            {t2 === "register"
                                ? "Crear cuenta"
                                : "Ya tengo cuenta"}
                        </button>
                    ))}
                </div>

                {/* Google */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogle}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "11px",
                        borderRadius: "10px",
                        border: `1.5px solid ${t.border}`,
                        background: dark
                            ? "rgba(255,255,255,0.07)"
                            : "rgba(0,0,0,0.04)",
                        color: t.textMain,
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        marginBottom: "12px",
                        fontFamily: "Inter, system-ui, sans-serif",
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 48 48">
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
                    Continuar con Google
                </motion.button>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "12px",
                    }}
                >
                    <div
                        style={{ flex: 1, height: "1px", background: t.border }}
                    />
                    <span style={{ fontSize: "11px", color: t.textMuted }}>
                        o con email
                    </span>
                    <div
                        style={{ flex: 1, height: "1px", background: t.border }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    {tab === "register" && (
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
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    />
                </div>

                {error && (
                    <p
                        style={{
                            color: "#EF4444",
                            fontSize: "12px",
                            margin: "8px 0 0",
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
                            margin: "8px 0 0",
                            textAlign: "center",
                            lineHeight: 1.5,
                        }}
                    >
                        {success}
                    </p>
                )}

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        background: accent,
                        color: "#fff",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "Inter, system-ui, sans-serif",
                        marginTop: "12px",
                    }}
                >
                    {loading
                        ? "…"
                        : tab === "register"
                          ? "Crear cuenta gratis"
                          : "Entrar"}
                </motion.button>

                <p
                    style={{
                        fontSize: "11px",
                        color: t.textMuted,
                        textAlign: "center",
                        margin: "10px 0 0",
                    }}
                >
                    Puedes continuar sin cuenta — perderás el progreso
                </p>
            </motion.div>
        </motion.div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// POPUP PREMIUM
// ─────────────────────────────────────────────────────────────────────────────
function PremiumPopup({
    accent,
    onClose,
    onVolver,
    user,
    onShowAuth,
}: {
    accent: string
    onClose: () => void
    onVolver: () => void
    user?: any
    onShowAuth?: () => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.82)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px",
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                style={{
                    background: "#141520",
                    border: `1px solid ${accent}50`,
                    borderRadius: "24px",
                    padding: "40px 32px",
                    maxWidth: "430px",
                    width: "100%",
                    textAlign: "center",
                }}
            >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏆</div>
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
                        color: "#fff",
                        marginBottom: "8px",
                        letterSpacing: "-0.5px",
                    }}
                >
                    Has llegado al límite gratuito
                </h2>
                <p
                    style={{
                        fontSize: "14px",
                        color: "#8B8D98",
                        lineHeight: 1.6,
                        marginBottom: "22px",
                    }}
                >
                    El examen completo y todos los simulacros oficiales están
                    disponibles con acceso completo.
                </p>
                <div
                    style={{
                        background: `${accent}12`,
                        border: `1px solid ${accent}35`,
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
                            marginBottom: "8px",
                        }}
                    >
                        ⏰ OFERTA — Solo las próximas 48h
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "center",
                            gap: "12px",
                            marginBottom: "4px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "16px",
                                color: "#8B8D98",
                                textDecoration: "line-through",
                            }}
                        >
                            40€
                        </span>
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
                    </div>
                    <div style={{ fontSize: "12px", color: "#8B8D98" }}>
                        Acceso completo · Pago único · Sin suscripción
                    </div>
                </div>
                <div style={{ textAlign: "left", marginBottom: "22px" }}>
                    {[
                        "✓  Exámenes oficiales de convocatorias anteriores",
                        "✓  Simulacros cronometrados con penalización real IVAP",
                        "✓  Técnicas de estudio y memorización",
                        "✓  Actualizaciones gratuitas hasta el examen",
                        "✓  Comunidad privada de opositores vascos",
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                fontSize: "13px",
                                color: "#fff",
                                padding: "7px 0",
                                borderBottom:
                                    i < 4
                                        ? "1px solid rgba(255,255,255,0.07)"
                                        : "none",
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>

                {user ? (
                    /* Usuario logueado → pago directo */
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
                            fontFamily: "Inter,system-ui,sans-serif",
                            marginBottom: "12px",
                        }}
                    >
                        Conseguir acceso completo →
                    </motion.button>
                ) : (
                    /* Sin sesión → primero registrarse */
                    <div>
                        <div
                            style={{
                                background: `${accent}10`,
                                border: `1px solid ${accent}25`,
                                borderRadius: "10px",
                                padding: "12px 16px",
                                marginBottom: "12px",
                                fontSize: "13px",
                                color: "#fff",
                                lineHeight: 1.5,
                            }}
                        >
                            Necesitas una cuenta para completar la compra y
                            activar tu acceso.
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
                                fontFamily: "Inter,system-ui,sans-serif",
                                marginBottom: "8px",
                            }}
                        >
                            Crear cuenta gratis →
                        </motion.button>
                        <div style={{ fontSize: "12px", color: "#8B8D98" }}>
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
                                    fontFamily: "Inter,system-ui,sans-serif",
                                    textDecoration: "underline",
                                }}
                            >
                                iniciar sesión
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={onVolver}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#8B8D98",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontFamily: "Inter,system-ui,sans-serif",
                        textDecoration: "underline",
                        marginTop: "12px",
                        display: "block",
                        width: "100%",
                    }}
                >
                    Ahora no, volver al dashboard
                </button>
            </motion.div>
        </motion.div>
    )
}

// ─── STRIPE ──────────────────────────────────────────────────────────────────
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

// Tests con límite de preguntas gratuitas: id → número de preguntas permitidas
const PREMIUM_TESTS: Record<string, number> = {
    premium_demo: 3,
}

export default function TestScreen(props: {
    testId?: string
    onBack?: () => void
}) {
    const testId = props.testId || getUrlParam("id") || "c01"
    const titulo = TITULOS[testId] || `Test ${testId}`
    const accentColor = getAccent(testId)
    const limiteFree = PREMIUM_TESTS[testId] ?? null // null = sin límite

    const [dark, setDark] = useState(true)
    const [sessionUser, setSessionUser] = useState<any>(null)
    const [sessionToken, setSessionToken] = useState<string | null>(null)
    const [numPreguntas, setNumPreguntas] = useState<number>(0)
    // Estados subidos desde subcomponentes (Framer no acepta useState en subcomponentes)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(true)
    const rootRef = useRef<HTMLDivElement>(null)
    const [modoPantalla, setModoPantalla] = useState<Modo>("repaso")
    const [penalizaConfig, setPenalizaConfig] = useState(true)
    const [numConfig, setNumConfig] = useState(0)
    const [regTab, setRegTab] = useState<"login" | "register">("register")
    const [regEmail, setRegEmail] = useState("")
    const [regPassword, setRegPassword] = useState("")
    const [regNombre, setRegNombre] = useState("")
    const [regLoading, setRegLoading] = useState(false)
    const [regError, setRegError] = useState("")
    const [regSuccess, setRegSuccess] = useState("")
    const [impugnarPregunta, setImpugnarPregunta] = useState<any>(null)
    const [impugnarEnviado, setImpugnarEnviado] = useState(false)

    function handleImpugnar(pregunta: any) {
        setImpugnarPregunta(pregunta)
        setImpugnarEnviado(false)
    }

    function confirmarImpugnacion() {
        if (!impugnarPregunta) return
        const p = impugnarPregunta
        const testId =
            new URLSearchParams(window.location.search).get("id") ||
            "desconocido"
        const asunto = encodeURIComponent(
            `[Gainditu] Impugnación pregunta ${p.id} — Test ${testId}`
        )
        const cuerpo = encodeURIComponent(
            `IMPUGNACIÓN DE PREGUNTA\n` +
                `========================\n\n` +
                `ID pregunta: ${p.id}\n` +
                `Test: ${testId}\n` +
                `URL: ${window.location.href}\n\n` +
                `ENUNCIADO:\n${p.enunciado}\n\n` +
                `OPCIONES:\n${p.opciones.map((o: string, i: number) => `${i === p.correcta ? "✓" : " "} ${String.fromCharCode(65 + i)}) ${o}`).join("\n")}\n\n` +
                `RESPUESTA MARCADA COMO CORRECTA: ${String.fromCharCode(65 + p.correcta)}) ${p.opciones[p.correcta]}\n\n` +
                `EXPLICACIÓN ACTUAL:\n${p.explicacion}\n\n` +
                `MOTIVO DE LA IMPUGNACIÓN:\n[El usuario no ha especificado — contactar si es necesario]\n`
        )
        window.location.href = `mailto:hola@gainditu.com?subject=${asunto}&body=${cuerpo}`
        setImpugnarEnviado(true)
        setImpugnarPregunta(null)
    }

    const [fase, setFase] = useState<Fase>("cargando")
    const [preguntas, setPreguntas] = useState<Pregunta[]>([])
    const [modo, setModo] = useState<Modo>("repaso")
    const [penalizacion, setPenalizacion] = useState(0.33)
    const [idx, setIdx] = useState(0)
    const [respuestas, setRespuestas] = useState<(number | null)[]>([])
    const [verExp, setVerExp] = useState(false)
    const [showPremium, setShowPremium] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    // Estados subidos de AvatarDropdown (Framer no acepta useState en subcomponentes)
    const [avatarOpen, setAvatarOpen] = useState(false)
    const avatarRef = useRef<HTMLDivElement>(null)
    const respuestasDesdeUltimoPopup = useRef(0)
    const tiempoRef = useRef<number>(Date.now())
    const [tiempoFinal, setTiempoFinal] = useState(0)

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

    useEffect(() => {
        setFase("cargando")
        fetchPreguntas(testId).then((rows) => {
            if (!rows || rows.length === 0) {
                setFase("sin_preguntas")
                return
            }
            const parsed: Pregunta[] = rows.map((r: any) => ({
                id: r.id,
                enunciado: r.enunciado,
                opciones: Array.isArray(r.opciones)
                    ? r.opciones
                    : JSON.parse(r.opciones),
                correcta: r.correcta,
                explicacion: r.explicacion,
            }))
            const shuffled = shuffleArray(parsed)
            setPreguntas(shuffled)
            setRespuestas(Array(shuffled.length).fill(null))
            setFase("inicio")
        })
    }, [testId])

    function handleStart(m: Modo) {
        setModo(m)
        setModoPantalla(m)
        if (m === "repaso") {
            setPenalizacion(0)
            setIdx(0)
            setRespuestas(Array(preguntas.length).fill(null))
            tiempoRef.current = Date.now()
            setFase("test")
        } else {
            setFase("config_examen")
        }
    }

    function handleConfirmExamen(penaliza: boolean, num: number = 0) {
        setPenalizacion(penaliza ? 0.33 : 0)
        setNumPreguntas(num)
        setIdx(0)
        const n = num > 0 ? Math.min(num, preguntas.length) : preguntas.length
        setRespuestas(Array(n).fill(null))
        tiempoRef.current = Date.now()
        setFase("examen")
    }

    function handleRespuesta(i: number) {
        const n = [...respuestas]
        n[idx] = i
        setRespuestas(n)
        setVerExp(false)
        const token = getSessionToken()
        if (!token) {
            respuestasDesdeUltimoPopup.current += 1
            if (respuestasDesdeUltimoPopup.current >= 3) {
                respuestasDesdeUltimoPopup.current = 0
                // Si es el examen de muestra premium → mostrar modal de pago, no de registro
                if (testId === "premium_demo") {
                    window.setTimeout(() => setShowPremium(true), 350)
                } else {
                    window.setTimeout(() => setShowRegister(true), 350)
                }
            }
        }
    }

    // Respuesta en modo examen (índice de pregunta + opción)
    function handleRespuestaExamen(preguntaIdx: number, opcion: number) {
        const n = [...respuestas]
        n[preguntaIdx] = opcion
        setRespuestas(n)
        const token = getSessionToken()
        if (!token) {
            respuestasDesdeUltimoPopup.current += 1
            if (respuestasDesdeUltimoPopup.current >= 3) {
                respuestasDesdeUltimoPopup.current = 0
                window.setTimeout(() => setShowRegister(true), 350)
            }
        }
    }
    function handleFinalizar() {
        setTiempoFinal(Math.round((Date.now() - tiempoRef.current) / 1000))
        setFase("resultados")
    }
    function handleRepetir() {
        setPreguntas((prev) => shuffleArray([...prev]))
        setIdx(0)
        setNumPreguntas(0)
        setRespuestas(Array(preguntas.length).fill(null))
        setVerExp(false)
        setFase("inicio")
    }
    function handleVolver() {
        if (props.onBack) {
            props.onBack()
            return
        }
        try {
            window.history.back()
        } catch {
            window.location.href = "/"
        }
    }

    // Siguiente con control premium: si el siguiente índice alcanza el límite → popup
    function handleSiguiente() {
        setVerExp(false)
        const siguiente = idx + 1
        if (limiteFree !== null && siguiente >= limiteFree) {
            setShowPremium(true)
            return
        }
        setIdx(siguiente)
    }

    const totalVisible = preguntas.length // siempre el total real, el corte es sorpresa

    const theme = getTheme(dark)

    // Subconjunto para examen — calculado aquí para evitar IIFEs en JSX (Framer no los acepta)
    const _nExamen =
        numPreguntas > 0
            ? Math.min(numPreguntas, preguntas.length)
            : preguntas.length
    const preguntasExamen = preguntas.slice(0, _nExamen)
    const respuestasExamen = respuestas.slice(0, _nExamen)

    // isMobile detector — mide el contenedor (no window), correcto dentro del canvas de Framer
    useEffect(() => {
        let ro: ResizeObserver | null = null
        let rafId: number
        let cancelled = false
        const measure = (w: number) => setIsMobile(w < 640)
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

    // Cargar sesión al montar
    useEffect(() => {
        const token = getSessionToken()
        const user = getSessionUser()
        if (token && user) {
            setSessionToken(token)
            setSessionUser(user)
        }
    }, [])

    // Guardar resultado cuando se llega a la pantalla de resultados
    useEffect(() => {
        if (fase !== "resultados") return
        const token = getSessionToken()
        const user = getSessionUser()
        if (!token || !user) return
        const prgs = preguntasExamen.length > 0 ? preguntasExamen : preguntas
        const resps =
            respuestasExamen.length > 0 ? respuestasExamen : respuestas
        const total = prgs.length
        const correctas = resps.filter((r, i) => r === prgs[i]?.correcta).length
        const incorrectas = resps.filter(
            (r, i) => r !== null && r !== prgs[i]?.correcta
        ).length
        const sinResp = resps.filter((r) => r === null).length
        const pct = Math.round(
            (Math.max(0, correctas - incorrectas * penalizacion) / total) * 100
        )
        const titulo = TITULOS[testId] || testId
        saveResult(
            {
                user_id: user.id,
                test_id: testId,
                test_titulo: titulo,
                total_preguntas: total,
                correctas,
                incorrectas,
                sin_responder: sinResp,
                porcentaje: pct,
                tiempo_segundos: tiempoFinal,
            },
            token
        )
        upsertProgress(user.id, testId, pct, token)
    }, [fase]) // eslint-disable-line

    // handleSignOut
    async function handleSignOut() {
        await supabase.auth.signOut()
        setSessionUser(null)
        setSessionToken(null)
    }

    // Sincronizar el estado de sesión del componente con supabase-js
    // (el intercambio del código OAuth lo gestiona /auth/callback).
    useEffect(() => {
        let mounted = true
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return
            setSessionUser(data.session?.user ?? null)
            setSessionToken(data.session?.access_token ?? null)
        })
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_e, session) => {
            if (!mounted) return
            setSessionUser(session?.user ?? null)
            setSessionToken(session?.access_token ?? null)
        })
        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    return (
        <div
            ref={rootRef}
            style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: theme.bg,
                color: theme.textMain,
                fontFamily: "Inter,system-ui,sans-serif",
                boxSizing: "border-box",
                overflowX: "hidden",
                transition: "background 0.2s",
            }}
        >
            <SharedNavbar
                accent={accentColor}
                dark={dark}
                onToggleDark={() => setDark((d) => !d)}
                user={sessionUser}
                onSignOut={handleSignOut}
                onShowAuth={() => setShowRegister(true)}
                mobileOpen={mobileMenuOpen}
                setMobileOpen={setMobileMenuOpen}
                isMobile={isMobile}
                avatarOpen={avatarOpen}
                setAvatarOpen={setAvatarOpen}
                avatarRef={avatarRef}
                homeUrl="/"
            />

            <AnimatePresence mode="wait">
                {fase === "cargando" && (
                    <motion.div
                        key="cargando"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "60vh",
                            flexDirection: "column",
                            gap: "16px",
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
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                border: `3px solid ${c.border}`,
                                borderTopColor: accentColor,
                            }}
                        />
                        <span style={{ color: c.muted, fontSize: "14px" }}>
                            Cargando preguntas…
                        </span>
                    </motion.div>
                )}
                {fase === "sin_preguntas" && (
                    <motion.div
                        key="vacio"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "60vh",
                            flexDirection: "column",
                            gap: "16px",
                            padding: "40px 20px",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: "40px" }}>🚧</div>
                        <h2
                            style={{
                                fontSize: "20px",
                                fontWeight: 700,
                                margin: 0,
                            }}
                        >
                            Preguntas en preparación
                        </h2>
                        <p
                            style={{
                                color: c.muted,
                                fontSize: "14px",
                                maxWidth: "340px",
                                lineHeight: 1.6,
                                margin: 0,
                            }}
                        >
                            Estamos redactando las preguntas de este tema.
                            Vuelve pronto.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleVolver}
                            style={{
                                padding: "12px 24px",
                                borderRadius: "12px",
                                background: accentColor,
                                color: "#fff",
                                border: "none",
                                fontSize: "14px",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "Inter,system-ui,sans-serif",
                            }}
                        >
                            ← Volver al dashboard
                        </motion.button>
                    </motion.div>
                )}
                {fase === "inicio" && (
                    <PantallaInicio
                        key="inicio"
                        titulo={titulo}
                        total={preguntas.length}
                        onStart={handleStart}
                        onBack={handleVolver}
                        accent={accentColor}
                        modo={modoPantalla}
                        setModo={setModoPantalla}
                    />
                )}
                {fase === "config_examen" && (
                    <PantallaConfigExamen
                        key="config"
                        titulo={titulo}
                        total={preguntas.length}
                        onConfirm={handleConfirmExamen}
                        onBack={() => setFase("inicio")}
                        accent={accentColor}
                        penaliza={penalizaConfig}
                        setPenaliza={setPenalizaConfig}
                        numConfig={numConfig}
                        setNumConfig={setNumConfig}
                    />
                )}
                {fase === "test" && preguntas[idx] && (
                    <PantallaPregunta
                        key={`p-${idx}`}
                        pregunta={preguntas[idx]}
                        numero={idx + 1}
                        total={totalVisible}
                        modo={modo}
                        respuesta={respuestas[idx]}
                        onRespuesta={handleRespuesta}
                        onSiguiente={handleSiguiente}
                        onFinalizar={handleFinalizar}
                        accent={accentColor}
                        verExp={verExp}
                        onToggleExp={() => setVerExp((v) => !v)}
                        onImpugnar={handleImpugnar}
                    />
                )}
                {fase === "examen" && preguntas.length > 0 && (
                    <PantallaExamen
                        key="examen-scroll"
                        preguntas={preguntasExamen}
                        respuestas={respuestasExamen}
                        onRespuesta={handleRespuestaExamen}
                        onFinalizar={handleFinalizar}
                        accent={accentColor}
                        penalizacion={penalizacion}
                    />
                )}
                {fase === "resultados" && (
                    <PantallaResultados
                        key="resultados"
                        testId={testId}
                        titulo={titulo}
                        preguntas={
                            preguntasExamen.length > 0
                                ? preguntasExamen
                                : preguntas
                        }
                        respuestas={
                            respuestasExamen.length > 0
                                ? respuestasExamen
                                : respuestas
                        }
                        penalizacion={penalizacion}
                        tiempo={tiempoFinal}
                        modo={modo}
                        onRepetir={handleRepetir}
                        onVolver={handleVolver}
                        accent={accentColor}
                    />
                )}
            </AnimatePresence>

            {/* Popup premium */}
            <AnimatePresence>
                {showPremium && (
                    <PremiumPopup
                        accent={accentColor}
                        onClose={() => setShowPremium(false)}
                        onVolver={() => {
                            setShowPremium(false)
                            handleVolver()
                        }}
                        user={sessionUser}
                        onShowAuth={() => {
                            setShowPremium(false)
                            setShowRegister(true)
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Popup registro */}
            <AnimatePresence>
                {showRegister && !showPremium && (
                    <RegisterPopup
                        accent={accentColor}
                        dark={dark}
                        onClose={() => {
                            setShowRegister(false)
                            setRegError("")
                            setRegSuccess("")
                        }}
                        tab={regTab}
                        setTab={setRegTab}
                        email={regEmail}
                        setEmail={setRegEmail}
                        password={regPassword}
                        setPassword={setRegPassword}
                        nombre={regNombre}
                        setNombre={setRegNombre}
                        loading={regLoading}
                        setLoading={setRegLoading}
                        regError={regError}
                        setRegError={setRegError}
                        regSuccess={regSuccess}
                        setRegSuccess={setRegSuccess}
                    />
                )}
            </AnimatePresence>

            {/* Modal impugnar pregunta */}
            <AnimatePresence>
                {impugnarPregunta && (
                    <ModalImpugnar
                        pregunta={impugnarPregunta}
                        dark={dark}
                        accent={accentColor}
                        onClose={() => setImpugnarPregunta(null)}
                        onConfirm={confirmarImpugnacion}
                    />
                )}
            </AnimatePresence>

            <SharedFooter dark={dark} accent={accentColor} />
        </div>
    )
}
