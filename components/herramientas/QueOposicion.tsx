"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"
import Link from "next/link"
import { CONVOCATORIAS } from "@/lib/data/convocatorias"
import { getOrganismo } from "@/lib/data/organismos"
import { useSession } from "@/lib/supabase/use-session"
import { createClient } from "@/lib/supabase/client"
import { logFunnelEvent } from "@/lib/funnel"
import GoogleIcon from "@/components/auth/GoogleIcon"

const QO_KEY = "gainditu_qo_answers"
const QO_RESULT_KEY = "gainditu_qo_result"
const QO_REDIRECT = "/herramientas/que-oposicion-elegir"

const ACCENT = "#10B981"

// Simulacro gratis que se ofrece según la titulación cuando el área es Administración.
const SIM_POR_TIT: Record<string, { path: string; nombre: string }> = {
    e: { path: "/simulacro-personal-apoyo-gobierno-vasco", nombre: "Personal de Apoyo" },
    c2: { path: "/simulacro-administrativo-gobierno-vasco", nombre: "Administrativo" },
    c1: { path: "/simulacro-administrativo-gobierno-vasco", nombre: "Administrativo" },
    a: { path: "/simulacro-tecnico-superior-gobierno-vasco", nombre: "Técnico Superior" },
}

type Area = "administracion" | "sanidad" | "seguridad" | "bomberos" | "educacion"
type TitId = "e" | "c2" | "c1" | "a"
type EuskId = "ninguno" | "b1" | "b2" | "c1"

const AREA_ORGANISMOS: Record<Area, string[]> = {
    administracion: ["gobierno-vasco", "diputaciones-forales", "administracion-local"],
    sanidad: ["osakidetza"],
    seguridad: ["ertzaintza", "policia-local"],
    bomberos: ["bomberos"],
    educacion: ["educacion"],
}

const TITULACIONES: { id: TitId; label: string }[] = [
    { id: "e", label: "Sin titulación / EGB" },
    { id: "c2", label: "Graduado ESO" },
    { id: "c1", label: "Bachiller o FP superior" },
    { id: "a", label: "Grado universitario" },
]

// A qué plazas da acceso cada titulación (art. 76 EBEP): siempre las de tu nivel
// y todas las de nivel inferior. "plano" es la explicación en cristiano; "codigo"
// es la etiqueta oficial. Tracks = tests de Gainditu que le corresponden.
const TITULACION_INFO: Record<
    TitId,
    { plano: string; codigo: string; tracks: { label: string; href: string }[] }
> = {
    e: {
        plano: "Plazas que no piden ningún título: subalterno, conserje, ordenanza, personal de servicios y apoyo.",
        codigo: "las Agrupaciones Profesionales (AP)",
        tracks: [{ label: "Tests de Personal de Apoyo", href: "/oposiciones/personal-de-apoyo" }],
    },
    c2: {
        plano: "Auxiliar administrativo/a y todas las plazas que no piden título (subalterno, conserje…). El Graduado en ESO es el título mínimo para el auxiliar.",
        codigo: "los grupos C2 y AP",
        tracks: [{ label: "Tests de Personal de Apoyo", href: "/oposiciones/personal-de-apoyo" }],
    },
    c1: {
        plano: "Administrativo/a y todas las plazas de nivel inferior (auxiliar administrativo, subalterno…). Bachiller o FP de grado superior es el título que pide el administrativo.",
        codigo: "los grupos C1, C2 y AP",
        tracks: [{ label: "Tests de Administrativo", href: "/oposiciones/administrativo" }],
    },
    a: {
        plano: "Técnico/a de gestión, técnico/a superior y todas las plazas de nivel inferior. Es la titulación que más opciones abre (para docente hace falta, además, Magisterio o el Máster de Profesorado).",
        codigo: "los grupos A1, A2 y todos los inferiores",
        tracks: [
            { label: "Tests de Técnico de Gestión", href: "/oposiciones/tecnico-gestion" },
            { label: "Tests de Técnico Superior", href: "/oposiciones/tecnico-superior" },
        ],
    },
}

const EUSKERAS: { id: EuskId; label: string }[] = [
    { id: "ninguno", label: "Ninguno" },
    { id: "b1", label: "B1 (PL1)" },
    { id: "b2", label: "B2 (PL2)" },
    { id: "c1", label: "C1 o más (PL3/PL4)" },
]

// Qué desbloquea cada nivel en el sistema de perfiles lingüísticos de Euskadi.
const EUSKERA_INFO: Record<EuskId, string> = {
    ninguno:
        "Sin perfil acreditado solo puedes presentarte a las plazas sin perfil lingüístico preceptivo, y el euskera no te sumará como mérito. Acreditar un PL amplía mucho tus opciones.",
    b1: "Con B1 (PL1) cumples el perfil en las plazas de PL1 preceptivo. En plazas con PL2 o superior, si el euskera no es preceptivo, te puntúa como mérito.",
    b2: "Con B2 (PL2) cumples el perfil en las plazas de PL1 y PL2 preceptivo, que son la mayoría de las administrativas. En PL3/PL4 te cuenta como mérito si no es preceptivo.",
    c1: "Con C1 o más (PL3/PL4) cumples el perfil en prácticamente cualquier plaza, incluidas las de perfil alto. Es el nivel que más puertas abre.",
}

const AREAS: { id: Area; label: string }[] = [
    { id: "administracion", label: "Administración" },
    { id: "sanidad", label: "Sanidad" },
    { id: "seguridad", label: "Seguridad" },
    { id: "bomberos", label: "Bomberos" },
    { id: "educacion", label: "Educación" },
]

// Encaje REAL por área + titulación (la recomendación depende del área elegida, no
// solo de la titulación). El nivel de titulación decide a qué plazas de ESA área
// puedes optar. Solo Administración tiene tests propios en Gainditu por ahora.
const AREA_ENCAJE: Record<Area, Record<TitId, string>> = {
    administracion: {
        e: "Plazas de personal de apoyo y subalterno (conserje, ordenanza, servicios), que no piden titulación.",
        c2: "Auxiliar administrativo/a (grupo C2) y todas las plazas de nivel inferior.",
        c1: "Administrativo/a (grupo C1) y todas las de nivel inferior (auxiliar administrativo, subalterno…).",
        a: "Técnico/a de gestión (A2) y técnico/a superior (A1), y todas las de nivel inferior.",
    },
    sanidad: {
        e: "En Osakidetza, categorías sin titulación (celador/a, personal de servicios), que son limitadas.",
        c2: "En Osakidetza, técnico/a en cuidados auxiliares de enfermería (TCAE) y auxiliar administrativo/a (grupo C2).",
        c1: "En Osakidetza, para administrativo/a (C1) te vale el Bachiller. Ojo: las categorías de técnico/a especialista sanitario (laboratorio, radiodiagnóstico, anatomía patológica…) exigen la FP superior sanitaria concreta de esa rama; un Bachiller genérico no da acceso a ellas.",
        a: "En Osakidetza, categorías de grupos A1/A2 según tu titulación (facultativo/a, enfermería, técnico/a superior…), cada una con su especialidad.",
    },
    seguridad: {
        e: "El acceso a la Ertzaintza (escala básica) pide Bachiller o FP superior, así que aún no cumplirías. Algunas plazas de policía local piden solo Graduado en ESO según el municipio.",
        c2: "La Ertzaintza (escala básica) pide Bachiller o FP superior, así que aún no cumplirías. Mira plazas de policía local, que en algunos municipios piden Graduado en ESO.",
        c1: "Escala básica de la Ertzaintza y policía local (Udaltzaingoa): con Bachiller o FP de grado superior cumples el requisito de titulación.",
        a: "Escalas de la Ertzaintza (incluidas las que exigen grado) y policía local, además de puestos técnicos asociados.",
    },
    bomberos: {
        e: "El acceso a bomberos pide, por lo general, Bachiller o FP de grado superior, así que con tu titulación aún no cumplirías el requisito.",
        c2: "Bomberos suele exigir Bachiller o FP de grado superior; con tu titulación aún no cumplirías el requisito de acceso.",
        c1: "Bombero/a en los servicios forales y municipales de Euskadi, y también en los aeropuertos (AENA: Bilbao-Loiu, San Sebastián-Hondarribia y Vitoria). Con Bachiller o FP de grado superior cumples el requisito de titulación.",
        a: "Bombero/a en los servicios forales, municipales y de aeropuerto (AENA), y con tu grado, además, a puestos técnicos y de prevención e inspección de incendios (a las escalas de mando se promociona con carrera).",
    },
    educacion: {
        e: "La docencia exige titulación universitaria específica, así que con tu titulación aún no cumplirías el requisito.",
        c2: "La docencia exige titulación universitaria específica, así que con tu titulación aún no cumplirías el requisito.",
        c1: "La docencia exige titulación universitaria específica, así que con tu titulación aún no cumplirías el requisito.",
        a: "Cuerpos docentes según tu especialidad, siempre que tengas Magisterio (Infantil/Primaria) o tu grado más el Máster de Profesorado (Secundaria/FP).",
    },
}

// Match: oposición IDEAL (concreta, personalizada) + ALTERNATIVA estratégica
// (más genérica pero lógica, compartiendo temario). El % de coincidencia se calcula
// según área + titulación (si cumples el requisito) y se modula por el euskera.
type Reco = { ideal: string; alt: string; altMotivo: string; cumple: boolean }

const RECO: Record<Area, Record<TitId, Reco>> = {
    administracion: {
        e: { ideal: "Personal de Apoyo (AP) del Gobierno Vasco", alt: "Personal de servicios de ayuntamientos", altMotivo: "mismo nivel de acceso, sin exigir titulación, repartido por la administración local", cumple: true },
        c2: { ideal: "Auxiliar Administrativo del Gobierno Vasco (C2)", alt: "Auxiliar Administrativo de ayuntamientos y Diputaciones", altMotivo: "comparte gran parte del temario y hay más plazas repartidas por el territorio", cumple: true },
        c1: { ideal: "Administrativo del Gobierno Vasco (C1)", alt: "Auxiliar Administrativo (C2) de Corporaciones Locales", altMotivo: "comparte gran parte del temario y es una vía de entrada más accesible", cumple: true },
        a: { ideal: "Técnico Superior (A1) o Técnico de Gestión (A2) del Gobierno Vasco", alt: "Administrativo del Gobierno Vasco (C1)", altMotivo: "nivel inferior que comparte el bloque común; buena vía para entrar antes", cumple: true },
    },
    sanidad: {
        e: { ideal: "Celador/a de Osakidetza", alt: "Personal de Apoyo del Gobierno Vasco", altMotivo: "mismo nivel de acceso, con más plazas convocadas", cumple: true },
        c2: { ideal: "TCAE o Auxiliar Administrativo de Osakidetza (C2)", alt: "Auxiliar Administrativo del Gobierno Vasco (C2)", altMotivo: "comparte la parte común de normativa vasca", cumple: true },
        c1: { ideal: "Administrativo o Técnico especialista de Osakidetza (C1)", alt: "Administrativo del Gobierno Vasco (C1)", altMotivo: "exige la misma titulación y gran parte de la legislación general (procedimiento administrativo, igualdad) es idéntica", cumple: true },
        a: { ideal: "Categoría A1/A2 de Osakidetza (según tu especialidad)", alt: "Técnico del Gobierno Vasco (A1/A2)", altMotivo: "comparte el bloque común y no depende de una especialidad sanitaria concreta", cumple: true },
    },
    seguridad: {
        e: { ideal: "Policía Local (municipios que la convocan con Graduado en ESO)", alt: "Personal de Apoyo del Gobierno Vasco", altMotivo: "vía de entrada mientras consigues el Bachiller/FP que pide la Ertzaintza", cumple: false },
        c2: { ideal: "Policía Local (municipios que piden Graduado en ESO)", alt: "Auxiliar Administrativo del Gobierno Vasco", altMotivo: "más plazas y accesible; con Bachiller o FP superior tendrías la Ertzaintza", cumple: false },
        c1: { ideal: "Ertzaintza (escala básica)", alt: "Policía Local", altMotivo: "misma familia de seguridad, con pruebas físicas y temario parecidos", cumple: true },
        a: { ideal: "Ertzaintza (escala básica) o escalas que exigen grado", alt: "Policía Local", altMotivo: "misma familia de seguridad; también puedes optar a puestos técnicos", cumple: true },
    },
    bomberos: {
        e: { ideal: "Bombero/a (servicios que puntualmente piden menos titulación)", alt: "Policía Local o Personal de Apoyo del Gobierno Vasco", altMotivo: "vía de entrada mientras consigues el Bachiller/FP que pide bomberos", cumple: false },
        c2: { ideal: "Bombero/a de servicios forales o municipales", alt: "Policía Local o Auxiliar Administrativo del Gobierno Vasco", altMotivo: "más accesible; con Bachiller o FP superior tendrías bomberos", cumple: false },
        c1: { ideal: "Bombero/a de los servicios forales o municipales de Euskadi", alt: "Policía Local o Ertzaintza", altMotivo: "misma familia de seguridad, con pruebas físicas y parte del temario en común", cumple: true },
        a: { ideal: "Bombero/a, con opción a escalas técnicas y de mando", alt: "Ertzaintza o Policía Local (escalas que exigen grado)", altMotivo: "misma familia de seguridad; también puedes optar a puestos técnicos", cumple: true },
    },
    educacion: {
        e: { ideal: "Cuerpos docentes", alt: "Administrativo o Auxiliar del Gobierno Vasco (según tu titulación)", altMotivo: "vía de entrada mientras consigues Magisterio o el Máster de Profesorado", cumple: false },
        c2: { ideal: "Cuerpos docentes", alt: "Auxiliar Administrativo del Gobierno Vasco (C2)", altMotivo: "vía accesible mientras consigues la titulación docente", cumple: false },
        c1: { ideal: "Cuerpos docentes", alt: "Administrativo del Gobierno Vasco (C1)", altMotivo: "vía accesible mientras consigues Magisterio o el Máster de Profesorado", cumple: false },
        a: { ideal: "Cuerpos docentes (Maestros o Secundaria) de tu especialidad", alt: "Técnico del Gobierno Vasco (A1/A2)", altMotivo: "comparte el bloque común y no exige el Máster de Profesorado", cumple: true },
    },
}

type MatchReco = Reco & {
    idealPct: number
    altPct: number
    // La situación (prisa + poco tiempo) puede reordenar: poner la opción accesible
    // como principal y la aspiracional como alternativa a medio plazo.
    reordenado: boolean
    ordenNota: string | null
    provNota: string | null
}

// Puntos que aporta el euskera y cuánto pesa según el área (en Educación/Sanidad es
// casi decisivo; en Administración/Seguridad suma como mérito).
const EUSK_PTS: Record<EuskId, number> = { ninguno: -7, b1: 3, b2: 10, c1: 16 }
const AREA_EUSK_W: Record<Area, number> = { educacion: 1.5, sanidad: 1.4, seguridad: 1.1, bomberos: 1.1, administracion: 1.0 }
// Ajuste fino por titulación (a más nivel, encaje algo mayor con la plaza ideal).
const TIT_ADJ: Record<TitId, number> = { e: -4, c2: -1, c1: 2, a: 5 }

// La recomendación NO depende solo de área+titulación+euskera: el tiempo, la urgencia
// y la provincia mueven la aguja de verdad (reordenan y ajustan los porcentajes).
function calcMatch(snap: Snap, provConv: boolean): MatchReco {
    const { area, titulacion: tit, euskera: eusk, tiempo, urg, prov } = snap
    const r = RECO[area][tit]
    const clamp = (n: number) => Math.max(28, Math.min(98, Math.round(n)))
    const base = r.cumple ? 73 : 43
    const euskContrib = EUSK_PTS[eusk] * AREA_EUSK_W[area]
    let idealPct = base + euskContrib + TIT_ADJ[tit]
    // Hueco con la alternativa: mayor si no cumples el requisito (la alt es un rodeo)
    // y algo más amplio donde el perfil de la ideal es más exigente.
    const gap =
        (r.cumple ? 9 : 4) +
        (area === "educacion" ? 3 : area === "seguridad" || area === "bomberos" ? 2 : area === "sanidad" ? 1 : 0)
    let altPct = idealPct - gap

    // Prisa ("cuanto antes") + poco/medio tiempo: la ideal (más exigente) se aleja y la
    // opción accesible gana peso. Es lo que acerca la herramienta a un análisis real.
    if (urg === "ya" && (tiempo === "poco" || tiempo === "medio")) {
        // "poco" reordena de verdad (empuja la accesible); "medio" solo mueve los números.
        const pen = tiempo === "poco" ? 15 : 5
        const boost = tiempo === "poco" ? 11 : 3
        idealPct -= pen
        altPct += boost
    }

    // Provincia con convocatoria específica abierta que encaja: recomendación más "viva".
    let provNota: string | null = null
    if (provConv && prov && prov !== "cualquiera") {
        idealPct += 3
        altPct += 3
        const label = PROVINCIAS.find((p) => p.id === prov)?.label ?? "tu provincia"
        provNota = `Tu provincia (${label}) tiene convocatoria abierta que encaja con tu perfil — la tienes en el listado de abajo.`
    }

    idealPct = clamp(idealPct)
    altPct = clamp(altPct)

    // Reordenar: si la situación hace que la accesible supere a la ideal, se recomienda
    // esa primero y la aspiracional pasa a "alternativa" (meta a medio plazo).
    let ideal = r.ideal
    let alt = r.alt
    let altMotivo = r.altMotivo
    let reordenado = false
    let ordenNota: string | null = null
    if (altPct > idealPct) {
        reordenado = true
        ;[ideal, alt] = [alt, ideal]
        ;[idealPct, altPct] = [altPct, idealPct]
        altMotivo = r.cumple
            ? "es tu meta de fondo, pero exige más nivel y preparación: mejor plantearla a medio plazo"
            : "es tu meta de fondo, pero primero necesitas la titulación que exige: déjala para más adelante"
        ordenNota =
            tiempo === "poco"
                ? "Con prisa y poco tiempo, te recomendamos empezar por la opción más accesible: más plazas y antes dentro. La otra queda como meta a medio plazo."
                : "Como tienes prisa, priorizamos la opción más accesible para entrar antes; la otra queda como meta a medio plazo."
    }

    return { ideal, alt, altMotivo, cumple: r.cumple, idealPct, altPct, reordenado, ordenNota, provNota }
}

// Envoltorio "análisis con IA" al pulsar Ver recomendación: frases con guasa que van
// rotando durante la carga.
function analMensajes(): string[] {
    return [
        "Preguntando al opositor veterano…",
        "Revisando las bibliotecas de tu alrededor…",
        "Consultando el BOPV a horas intempestivas…",
        "Midiendo cuántos temas te sabrás de memoria…",
        "Descartando las oposiciones imposibles para ti…",
        "Buscando esa plaza que tiene tu nombre…",
    ]
}

// ── Provincia (Territorio Histórico) y urgencia: personalizan convocatorias y consejos ──
type ProvId = "araba" | "bizkaia" | "gipuzkoa" | "cualquiera"

const PROVINCIAS: { id: ProvId; label: string }[] = [
    { id: "araba", label: "Álava" },
    { id: "bizkaia", label: "Bizkaia" },
    { id: "gipuzkoa", label: "Gipuzkoa" },
    { id: "cualquiera", label: "Me da igual" },
]

const PROV_KEYWORDS: Record<Exclude<ProvId, "cualquiera">, string[]> = {
    araba: ["alava", "álava", "araba", "vitoria", "gasteiz"],
    bizkaia: ["bizkaia", "vizcaya", "bilbao", "getxo", "leioa", "barakaldo", "portugalete", "basauri", "santurtzi", "durango"],
    gipuzkoa: ["gipuzkoa", "guipuzcoa", "irun", "donostia", "san sebastian", "eibar", "errenteria", "arrasate"],
}

// Texto de provincia para ADMINISTRACIÓN (para seguridad/sanidad/educación se usan
// textos propios en provInfo, sin mezclar organismos de otras áreas).
const PROV_INFO: Record<ProvId, string> = {
    araba: "En Álava, además del Gobierno Vasco (para toda la CAE), tienes la Diputación Foral de Álava y ayuntamientos como Vitoria-Gasteiz.",
    bizkaia: "En Bizkaia, además del Gobierno Vasco (para toda la CAE), tienes la Diputación Foral de Bizkaia y ayuntamientos como Bilbao, Getxo, Leioa o Barakaldo.",
    gipuzkoa: "En Gipuzkoa, además del Gobierno Vasco (para toda la CAE), tienes la Diputación Foral de Gipuzkoa y ayuntamientos como Donostia, Irún o Eibar.",
    cualquiera: "",
}

// Ciudades de referencia por provincia (para el texto de seguridad).
const CIUDADES_PROV: Record<Exclude<ProvId, "cualquiera">, string> = {
    araba: "Vitoria-Gasteiz",
    bizkaia: "Bilbao, Getxo o Barakaldo",
    gipuzkoa: "Donostia, Irún o Eibar",
}

// OSIs (Organizaciones Sanitarias Integradas) de Osakidetza por provincia: en Sanidad
// la provincia no cambia quién te contrata (siempre Osakidetza), sino a qué OSI vas.
const OSI_PROV: Record<Exclude<ProvId, "cualquiera">, string> = {
    araba: "la OSI Araba (Txagorritxu, Santiago)",
    bizkaia: "las OSI Bilbao-Basurto, Ezkerraldea-Enkarterri-Cruces, Barrualde-Galdakao o Uribe",
    gipuzkoa: "las OSI Donostialdea, Bidasoa o Debabarrena",
}

type UrgId = "ya" | "pronto" | "calma"

const URGENCIAS: { id: UrgId; label: string }[] = [
    { id: "ya", label: "Cuanto antes" },
    { id: "pronto", label: "Este año o el próximo" },
    { id: "calma", label: "Sin prisa" },
]

const URG_INFO: Record<UrgId, string> = {
    ya: "Prioriza las convocatorias con examen más cercano y empieza ya por el bloque común, que es lo que más se repite. Mira las fechas en cada ficha de convocatoria.",
    pronto: "Tienes margen para preparar el temario completo con cabeza: plan por temas y tests desde el principio, no solo teoría.",
    calma: "Aprovecha para construir una base sólida: primero el bloque común y luego los específicos. La constancia gana a los atracones.",
}

// Snapshot de las respuestas con las que se generó la recomendación mostrada.
// La recomendación se calcula SIEMPRE de este snapshot, no del estado vivo, para
// que no cambie al tocar los botones hasta pulsar de nuevo "Ver recomendación".
type Snap = {
    titulacion: TitId
    euskera: EuskId
    area: Area
    tiempo: TiempoId | null
    prov: ProvId | null
    urg: UrgId | null
}

// Euskera: en Educación el perfil lingüístico es EXCLUYENTE para casi todas las
// plazas, así que el mensaje cambia (no "abre puertas", es requisito).
function euskeraInfo(area: Area, eusk: EuskId): string {
    if (area === "educacion") {
        if (eusk === "c1")
            return "En Educación, este nivel (PL3/EGA) es tu mayor ventaja: es un requisito indispensable para conseguir plaza y entrar en listas (Ordezkagune) en la inmensa mayoría de especialidades."
        if (eusk === "ninguno")
            return "En Educación el perfil lingüístico (PL2/PL3) es excluyente para casi todas las plazas: sin acreditarlo no podrás conseguir plaza ni entrar en listas de sustituciones. Sería lo primero que deberías sacar."
        if (eusk === "b1")
            return "En Educación el PL1 se queda corto: la mayoría de plazas docentes exigen PL2 como mínimo, y PL3/EGA en las especialidades que se imparten en euskera. Con B1 cumplirías en muy pocas; el siguiente paso claro es el PL2."
        return "Con B2 (PL2) cumples el perfil en la mayoría de plazas docentes y en las listas de sustituciones. Para las especialidades que se imparten en euskera necesitarías el PL3 (EGA), que además suma como mérito."
    }
    if (area === "seguridad" || area === "bomberos") {
        if (eusk === "c1")
            return "En cuerpos de seguridad y bomberos, un C1 (PL3/EGA) es una ventaja abismal: en las OPE de Policía Local, Ertzaintza y bomberos puntúa muchísimo como mérito y te coloca muy por encima de la media."
        if (eusk === "b2")
            return "El euskera pesa mucho en estas OPE: con B2 (PL2) ya sumas buenos méritos; subir al PL3 (EGA) marcaría una diferencia enorme en el baremo."
        if (eusk === "b1")
            return "Aquí el euskera es un mérito muy valorado. Con B1 (PL1) sumas algo; apunta al PL2/PL3, que es lo que de verdad marca diferencias en el baremo."
        return "En estas OPE el euskera puntúa mucho como mérito. Sin acreditar ningún nivel partes con desventaja; sacar un PL te subiría bastante en el baremo."
    }
    if (area === "sanidad") {
        if (eusk === "c1")
            return "En Osakidetza el euskera es una máquina de puntos: en la fase de concurso (méritos), un C1 (PL3) inyecta una cantidad enorme de puntos al baremo. Es lo que permite a gente joven adelantar a interinos con años de antigüedad."
        if (eusk === "b2")
            return "En Osakidetza la fase de concurso lo decide casi todo, y el euskera pesa muchísimo: un B2 (PL2) ya suma un buen bloque de puntos en el baremo. Subir al PL3 marcaría aún más la diferencia."
        if (eusk === "b1")
            return "En Osakidetza el euskera es de los méritos que más puntúan en el concurso. Con B1 (PL1) sumas algo, pero el salto de verdad está en el PL2/PL3."
        return "Sin euskera vas a la fase de concurso en clara desventaja: puedes aprobar el examen con un 10, pero los interinos con experiencia y PL2/PL3 te pasarán por encima en la bolsa de trabajo. Sacar el euskera es lo más rentable que puedes hacer para tu baremo; empieza a por el PL1/PL2 cuanto antes."
    }
    if (area === "administracion") {
        if (eusk === "ninguno")
            return "En administración cada plaza tiene un perfil lingüístico (PL) con una fecha de preceptividad: si ya venció, el euskera es requisito excluyente; si no, solo puntúa como mérito. Sin PL acreditado te quedas fuera de todas las plazas ya preceptivas (cada año son más) y no sumas méritos. Sacar un PL es de lo más rentable."
        if (eusk === "b1")
            return "Con B1 (PL1) cumples el perfil en las plazas de PL1 preceptivo y, donde aún no lo es, te puntúa como mérito. Fíjate en la fecha de preceptividad de cada plaza: marca si el euskera es requisito u opcional. Subir al PL2 te abriría la mayoría de plazas administrativas."
        if (eusk === "b2")
            return "Con B2 (PL2) cubres el perfil de la mayoría de plazas administrativas (PL1 y PL2 preceptivos). En perfiles altos (PL3/PL4) te cuenta como mérito mientras no sea preceptivo. Es un nivel muy cómodo para presentarte a casi todo."
        return "Con C1 o más (PL3/PL4) cumples el perfil en prácticamente cualquier plaza, incluidas las de perfil alto y las ya preceptivas. El euskera deja de ser tu límite: solo dependes del temario."
    }
    return EUSKERA_INFO[eusk]
}

// Provincia: cada área menciona SOLO sus organismos (nada de mezclar Osakidetza con
// seguridad, etc.). Educación es 100% autonómica; en Osakidetza la provincia es el
// destino; en seguridad, Ertzaintza (autonómica) + bomberos forales + policía local.
function provInfo(area: Area, prov: ProvId | null): string | null {
    const provLabel =
        prov && prov !== "cualquiera"
            ? PROVINCIAS.find((p) => p.id === prov)?.label ?? null
            : null
    if (area === "educacion") {
        return `En Educación pública las oposiciones las convoca en exclusiva el Gobierno Vasco (Departamento de Educación) para toda Euskadi; no dependen de la provincia. Lo que eliges por zona es el destino: en las adjudicaciones puedes pedir centros de tu Territorio Histórico${provLabel ? ` (${provLabel})` : ""}.`
    }
    if (area === "sanidad") {
        if (!prov || prov === "cualquiera")
            return "En Osakidetza no te contrata una diputación ni un ayuntamiento: es un servicio único para toda Euskadi. Lo que decide la provincia es a qué OSI (Organización Sanitaria Integrada) te incorporas. Elige provincia para verlo."
        return `En Osakidetza no te contrata la provincia (siempre es el mismo servicio), pero sí decide tu OSI (Organización Sanitaria Integrada): tu hospital y centros de referencia. En ${provLabel} optarías a destino en ${OSI_PROV[prov]}.`
    }
    if (area === "seguridad") {
        if (!prov || prov === "cualquiera")
            return "La Ertzaintza es autonómica (para toda Euskadi) y la policía local (Udaltzaingoa) es de cada ayuntamiento. Elige provincia para afinar las opciones."
        return `En ${provLabel}, además de la Ertzaintza (autonómica, para toda Euskadi), tienes la policía local (Udaltzaingoa) de municipios como ${CIUDADES_PROV[prov]}.`
    }
    if (area === "bomberos") {
        if (!prov || prov === "cualquiera")
            return "Los bomberos en Euskadi son forales (uno por Diputación) o municipales: Bilbao, Donostia y Vitoria-Gasteiz tienen servicio propio. Elige provincia para ver los tuyos."
        const muni = prov === "araba" ? "Vitoria-Gasteiz" : prov === "bizkaia" ? "Bilbao" : "Donostia"
        return `En ${provLabel} tienes los bomberos forales de la Diputación de ${provLabel} y el servicio municipal de ${muni}. Cada uno convoca por su cuenta, así que puedes presentarte a varios.`
    }
    if (area === "administracion") {
        if (!prov || prov === "cualquiera")
            return "Administración general es la que más plazas saca de Euskadi: Gobierno Vasco (toda la CAE), las tres Diputaciones Forales y más de 250 ayuntamientos. Y el bloque común de temario (Ley 39/2015, EBEP, Estatuto de Autonomía…) se repite en casi todas: preparándolo una vez te presentas a muchas."
        return `${PROV_INFO[prov]} Como el bloque común de temario (Ley 39/2015, EBEP, Estatuto de Autonomía…) se repite en casi todas, preparándolo una vez puedes presentarte a las tres a la vez.`
    }
    return prov && prov !== "cualquiera" ? PROV_INFO[prov] : null
}

// Nota estratégica según área + titulación (toque "insider").
function notaEstrategica(area: Area, tit: TitId): string | null {
    if (area === "seguridad" && tit === "a")
        return "Con un grado, tu titulación te abre las escalas de la Ertzaintza que exigen estudios universitarios y facilita la promoción interna. Lo habitual es entrar por la escala básica y ascender desde dentro (a mando se llega con carrera y sus propios procesos, no de entrada), pero tu grado juega claramente a favor."
    if (area === "bomberos" && tit === "a")
        return "Con un grado, tu titulación te vale para puestos técnicos y de prevención e inspección de incendios, y facilita la promoción dentro del servicio. A las escalas de mando (suboficial, oficial) se llega con carrera y sus propios procesos, no de entrada, pero tu grado juega a favor."
    if (area === "administracion" && (tit === "e" || tit === "c2"))
        return "Una vía muy usada: entrar por un grupo inferior (AP/C2), que tiene más plazas y notas de corte más bajas, y promocionar internamente después. El temario común se solapa, así que el esfuerzo se reaprovecha casi entero."
    if (area === "administracion" && tit === "a")
        return "Con un grado puedes opositar directo a A1/A2, pero plantéate también entrar por C1: hay más plazas y las notas de corte suelen ser más bajas, y desde dentro promocionas con el mismo bloque común ya estudiado."
    if (area === "educacion" && tit === "a")
        return "No pienses solo en la plaza: presentarte ya te mete en las listas de sustituciones (Ordezkagune) y puedes empezar a dar clase como interino/a. Esa experiencia docente es de lo que más puntúa en el concurso de la siguiente OPE, así que cada convocatoria suma aunque no saques plaza a la primera."
    if (area === "educacion" && tit !== "a")
        return "Mientras sacas Magisterio o el Máster de Profesorado, preparar el bloque común de administración no es tiempo perdido: te da un plan B con sueldo y ese temario general (Ley 39/2015, EBEP…) también reaparece en otras oposiciones."
    return null
}

// Realidad del proceso selectivo (lo que quien viene solo del estudio subestima).
// Devuelve párrafos (para no soltar una chapa de una sola tirada).
function notaProceso(area: Area): string[] | null {
    if (area === "seguridad")
        return [
            "Aprobar el examen es solo una parte: hay pruebas físicas eliminatorias, psicotécnicos, entrevista y reconocimiento médico. Quien viene solo del estudio suele subestimar la preparación física, que es donde más gente cae.",
            "Si sacas plaza, te forma la Academia de Arkaute con sueldo. Y ojo a la edad máxima de acceso y a tu pico físico: en seguridad, cuanto antes te presentes, mejor.",
        ]
    if (area === "bomberos")
        return [
            "Bomberos es, físicamente, de las oposiciones más duras: pruebas físicas muy exigentes y eliminatorias (fuerza, resistencia, natación, trepa), psicotécnicos y reconocimiento médico. Suele pedir carnés de conducir (B y a menudo C), y las convocatorias forales o municipales son escasas y muy competidas.",
            "Una vía menos conocida: los bomberos de aeropuerto (AENA) —en Euskadi, Bilbao-Loiu, San Sebastián-Hondarribia y Vitoria—, que son otro empleador con su propio proceso y a menudo menos competencia. En todos, trabaja la parte física con la misma seriedad que el temario.",
        ]
    return null
}

// La dimensión local (ayuntamientos + Diputaciones) dentro de administración.
function notaLocal(area: Area): string[] | null {
    if (area === "administracion")
        return [
            "En administración conviven dos mundos: el Gobierno Vasco (OPEs grandes y centralizadas) y la administración local. Lo local añade su propio bloque de temario (Ley 2/2016 de Instituciones Locales de Euskadi, Bases de Régimen Local, haciendas locales), pero a cambio saca muchas convocatorias pequeñas y frecuentes, con notas de corte a menudo más bajas en los municipios pequeños, y suele dejar bolsas de trabajo que dan interinidades rápidas.",
            "Aparte van las Diputaciones Forales: sus exámenes son de los más exigentes, pero a cambio ofrecen de las mejores condiciones y sueldos de toda la administración vasca.",
            "Ojo con el euskera: en los ayuntamientos euskaldunes el perfil lingüístico es preceptivo en casi todo, así que tu nivel decide a qué municipios puedes optar de verdad.",
        ]
    return null
}

// Méritos por área: qué suma en la fase de concurso/baremo. Devuelve título del
// bloque + párrafos, porque el mérito estrella cambia según el área (IT Txartelak en
// administración, experiencia y euskera en Osakidetza y Educación…).
function notaMeritos(area: Area): { titulo: string; paras: string[] } | null {
    if (area === "administracion")
        return {
            titulo: "El concurso también cuenta: experiencia, títulos y euskera",
            paras: [
                "El acceso a la administración vasca (Personal de Apoyo, Administrativo…) es concurso-oposición: además del examen, hay una fase de concurso que puede decidir tu plaza. En la convocatoria en vigor, la oposición vale hasta 100 puntos y el concurso hasta 45.",
                "Lo que más puntúa en el concurso: la experiencia previa en cualquier administración pública (se valora por meses trabajados, y es el bloque de más peso), determinadas titulaciones de FP relacionadas con el puesto, y el euskera acreditado (un perfil lingüístico suma bastantes puntos donde no sea ya requisito). Guarda desde ya todos tus certificados de trabajo y formación: en el baremo cada mes y cada título cuentan.",
                "Un apunte sobre las IT Txartelak (competencias informáticas del Gobierno Vasco): en esta convocatoria no puntúan en el baremo, pero conviene tenerlas, porque en ciertos puestos y en otras convocatorias pueden pedirse como requisito.",
            ],
        }
    if (area === "sanidad")
        return {
            titulo: "El concurso lo decide: qué puntúa en Osakidetza",
            paras: [
                "En Osakidetza el acceso es concurso-oposición y la fase de concurso (méritos) pesa muchísimo: puedes aprobar el examen con buena nota y aun así quedar por detrás de quien acumula méritos. Por eso conviene entrar cuanto antes en la bolsa de trabajo y empezar a sumar experiencia.",
                "Lo que más puntúa: la experiencia previa trabajando en Osakidetza o en otro servicio público de salud, el euskera acreditado (PL2/PL3) y la formación continuada acreditada (cursos homologados de tu categoría, docencia y publicaciones). Guarda desde ya todos los certificados: en el baremo cada curso y cada día trabajado cuenta.",
            ],
        }
    if (area === "educacion")
        return {
            titulo: "Los méritos en la oposición docente",
            paras: [
                "En Educación el acceso es concurso-oposición: superada la fase de oposición, la de concurso (méritos) puede decidir tu plaza y tu puesto en las listas. La experiencia docente previa es el mérito estrella —cada curso impartido como interino/a en la pública puntúa fuerte—, así que entrar pronto en las listas de sustituciones (Ordezkagune) es clave.",
                "Además puntúan la formación académica (máster, doctorado u otra titulación), los cursos de formación homologados y el euskera (PL2/PL3), que en la mayoría de especialidades es requisito. Ve reuniendo y registrando los certificados desde el principio: en el baremo docente todo suma.",
            ],
        }
    if (area === "seguridad" || area === "bomberos")
        return {
            titulo: "Méritos y requisitos que suelen pesar",
            paras: [
                "Además del examen y las pruebas físicas, aquí suelen puntuar como mérito los permisos de conducir (en bomberos el C es a menudo requisito, no solo mérito), el euskera acreditado, otras titulaciones y los cursos específicos del cuerpo. Sácate los carnés y el euskera con tiempo: no se improvisan a última hora.",
            ],
        }
    return null
}

type TiempoId = "poco" | "medio" | "mucho"

const TIEMPOS: { id: TiempoId; label: string }[] = [
    { id: "poco", label: "Menos de 2h al día" },
    { id: "medio", label: "Entre 2 y 4h al día" },
    { id: "mucho", label: "Más de 4h al día" },
]

const TIEMPO_INFO: Record<TiempoId, string> = {
    poco:
        "Con menos de 2h al día, prioriza la constancia sobre la velocidad: mejor 30 preguntas cada día que atracones sueltos. Empieza por el bloque común, que se repite en casi todas las oposiciones.",
    medio:
        "Con 2-4h al día llevas un ritmo sólido para preparar el temario completo en unos meses. Alterna teoría y tests desde el principio, no dejes los tests para el final.",
    mucho:
        "Con más de 4h al día puedes apuntar a convocatorias cercanas. Cuida el descanso y repasa con tests a diario para fijar y no quemarte.",
}

// Aviso cuando la titulación no alcanza el requisito típico del área.
function avisoArea(area: Area, tit: TitId): string | null {
    if (area === "educacion") {
        if (tit !== "a")
            return "Ser docente exige titulación universitaria específica: el grado de Magisterio para Infantil/Primaria, o un grado más el Máster de Profesorado (antiguo CAP) para Secundaria y FP. Con tu titulación todavía no cumplirías el requisito."
        return "Un grado universitario por sí solo no habilita para dar clase. Para Infantil/Primaria necesitas el grado de Magisterio; para Secundaria y FP, tu grado más el Máster de Profesorado (antiguo CAP). Comprueba que tu titulación habilita para la especialidad que quieres opositar."
    }
    if (area === "seguridad" && (tit === "e" || tit === "c2"))
        return "El ingreso en la Ertzaintza (escala básica) exige Bachiller o FP de grado superior. Con tu titulación no cumplirías el requisito de acceso todavía."
    if (area === "bomberos" && (tit === "e" || tit === "c2"))
        return "El acceso a bomberos exige, por lo general, Bachiller o FP de grado superior. Con tu titulación no cumplirías el requisito de acceso todavía."
    if (area === "sanidad" && tit === "e")
        return "La mayoría de categorías de Osakidetza pide como mínimo el Graduado en ESO (grupo C2); las plazas de personal subalterno son limitadas."
    return null
}

function Grupo<T extends string>({
    opciones,
    value,
    onChange,
}: {
    opciones: { id: T; label: string }[]
    value: T | null
    onChange: (v: T) => void
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {opciones.map((o) => (
                <button
                    key={o.id}
                    type="button"
                    onClick={() => onChange(o.id)}
                    className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 text-[13px] font-semibold text-zinc-700 dark:text-zinc-200 transition-colors hover:border-zinc-300"
                    style={value === o.id ? { background: ACCENT, borderColor: ACCENT, color: "#fff" } : undefined}
                >
                    {o.label}
                </button>
            ))}
        </div>
    )
}

export default function QueOposicion() {
    const [titulacion, setTitulacion] = useState<TitId | null>(null)
    const [euskera, setEuskera] = useState<EuskId | null>(null)
    const [area, setArea] = useState<Area | null>(null)
    const [tiempo, setTiempo] = useState<TiempoId | null>(null)
    const [prov, setProv] = useState<ProvId | null>(null)
    const [urg, setUrg] = useState<UrgId | null>(null)
    const [mostrar, setMostrar] = useState(false)
    const [snap, setSnap] = useState<Snap | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [analizando, setAnalizando] = useState(false)
    const [analMsg, setAnalMsg] = useState("")
    const analTimers = useRef<{
        msg?: ReturnType<typeof setInterval>
        done?: ReturnType<typeof setTimeout>
    }>({})
    const analRef = useRef<HTMLDivElement | null>(null)
    const { user } = useSession()

    // Lista de espera (áreas que aún no tienen simulacro gratis)
    const [wlEmail, setWlEmail] = useState("")
    const [wlConsent, setWlConsent] = useState(false)
    const [wlLoading, setWlLoading] = useState(false)
    const [wlError, setWlError] = useState("")
    const [wlDone, setWlDone] = useState(false)
    const loggedRef = useRef(false)

    // Para habilitar el botón (estado VIVO).
    const completo = titulacion && euskera && area

    // Fija la recomendación a partir de un snapshot, la persiste (para restaurarla al
    // volver atrás) y, opcionalmente, registra la métrica.
    function aplicarRecomendacion(s: Snap, log = false) {
        setSnap(s)
        setMostrar(true)
        try {
            sessionStorage.setItem(QO_RESULT_KEY, JSON.stringify(s))
        } catch {}
        if (log && !loggedRef.current) {
            loggedRef.current = true
            void logFunnelEvent("orientacion_result", s)
        }
    }

    // Derivados de la recomendación: SIEMPRE del snapshot (no del estado vivo).
    const areaLabel = snap ? AREAS.find((a) => a.id === snap.area)?.label ?? snap.area : ""
    // Simulacro gratis recomendado según la titulación (solo Administración tiene).
    // e/c2 → Auxiliar · c1 → Administrativo · a → Técnico de Gestión.
    const simReco =
        snap && snap.area === "administracion"
            ? SIM_POR_TIT[snap.titulacion] ?? null
            : null
    const encaje = snap ? AREA_ENCAJE[snap.area][snap.titulacion] : null
    const mostrarTracks = snap?.area === "administracion"
    // ¿La provincia elegida tiene una convocatoria ESPECÍFICA (no autonómica) que encaja?
    const provConvocatoria = useMemo(() => {
        if (!snap || !snap.prov || snap.prov === "cualquiera") return false
        const slugs = AREA_ORGANISMOS[snap.area]
        const kws = PROV_KEYWORDS[snap.prov]
        const auton = new Set(["gobierno-vasco", "osakidetza", "ertzaintza", "educacion"])
        return CONVOCATORIAS.some(
            (c) =>
                slugs.includes(c.organismo) &&
                !auton.has(c.organismo) &&
                kws.some((k) => `${c.slug} ${c.nombre}`.toLowerCase().includes(k))
        )
    }, [snap])
    const reco = snap ? calcMatch(snap, provConvocatoria) : null
    // Veredicto que se "escribe" (efecto IA) al mostrar la recomendación.
    const resumenIA = reco
        ? `Para tu perfil, tu mejor opción es ${reco.ideal}, con un ${reco.idealPct}% de encaje. Como alternativa estratégica te encaja ${reco.alt}.`
        : ""
    const [qoTyped, setQoTyped] = useState("")
    useEffect(() => {
        if (!mostrar || !resumenIA) {
            setQoTyped("")
            return
        }
        let i = 0
        setQoTyped("")
        const id = setInterval(() => {
            i += 2
            setQoTyped(resumenIA.slice(0, i))
            if (i >= resumenIA.length) {
                setQoTyped(resumenIA)
                clearInterval(id)
            }
        }, 20)
        return () => clearInterval(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mostrar, resumenIA])
    // ¿Has cambiado respuestas desde la recomendación mostrada?
    const cambiado =
        !!snap &&
        (snap.titulacion !== titulacion ||
            snap.euskera !== euskera ||
            snap.area !== area ||
            snap.tiempo !== tiempo ||
            snap.prov !== prov ||
            snap.urg !== urg)

    async function enviarWaitlist(e: FormEvent) {
        e.preventDefault()
        setWlError("")
        const mail = wlEmail.trim().toLowerCase()
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
            setWlError("Introduce un email válido.")
            return
        }
        if (!wlConsent) {
            setWlError("Marca la casilla para poder avisarte.")
            return
        }
        setWlLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase.functions.invoke("captar-aviso", {
            body: { tipo: "interes", email: mail, interes: areaLabel, area: snap?.area, origen: "que-oposicion-elegir", meta: snap ?? {} },
        })
        setWlLoading(false)
        if (error || !(data as { ok?: boolean })?.ok) {
            setWlError("No se ha podido registrar. Inténtalo de nuevo.")
            return
        }
        void logFunnelEvent("orientacion_waitlist", { interes: areaLabel, email: mail })
        setWlDone(true)
    }

    // Simula un análisis (~5,4s con frases rotativas) antes de fijar la recomendación.
    // Da la sensación de que una IA está cruzando el perfil con las convocatorias.
    function analizarYRecomendar(s: Snap, log = false) {
        if (analTimers.current.msg) clearInterval(analTimers.current.msg)
        if (analTimers.current.done) clearTimeout(analTimers.current.done)
        const msgs = analMensajes()
        setMostrar(false)
        setAnalMsg(msgs[0])
        setAnalizando(true)
        let i = 0
        analTimers.current.msg = setInterval(() => {
            i = Math.min(i + 1, msgs.length - 1)
            setAnalMsg(msgs[i])
        }, 900)
        analTimers.current.done = setTimeout(() => {
            if (analTimers.current.msg) clearInterval(analTimers.current.msg)
            setAnalizando(false)
            aplicarRecomendacion(s, log)
        }, 5400)
        setTimeout(
            () => analRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
            60
        )
    }

    function verRecomendacion() {
        if (!titulacion || !euskera || !area) return
        if (!user) {
            setShowModal(true)
            return
        }
        analizarYRecomendar({ titulacion, euskera, area, tiempo, prov, urg }, true)
    }

    // Guarda las respuestas antes de irse a registrarse/Google, para restaurarlas al volver.
    function persistAnswers() {
        try {
            sessionStorage.setItem(
                QO_KEY,
                JSON.stringify({ titulacion, euskera, area, tiempo, prov, urg })
            )
        } catch {}
    }

    async function handleGoogle() {
        persistAnswers()
        try {
            localStorage.setItem(
                "gainditu_post_auth_next",
                JSON.stringify({ next: QO_REDIRECT, ts: Date.now() })
            )
        } catch {}
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(QO_REDIRECT)}`,
            },
        })
    }

    // Al volver de Google/registro ya con sesión: restaura las respuestas guardadas
    // antes del redirect y muestra la recomendación.
    useEffect(() => {
        if (!user) return
        try {
            const raw = sessionStorage.getItem(QO_KEY)
            if (!raw) return
            const a = JSON.parse(raw)
            sessionStorage.removeItem(QO_KEY)
            if (a && a.titulacion && a.euskera && a.area) {
                setTitulacion(a.titulacion)
                setEuskera(a.euskera)
                setArea(a.area)
                setTiempo(a.tiempo ?? null)
                setProv(a.prov ?? null)
                setUrg(a.urg ?? null)
                analizarYRecomendar(
                    {
                        titulacion: a.titulacion,
                        euskera: a.euskera,
                        area: a.area,
                        tiempo: a.tiempo ?? null,
                        prov: a.prov ?? null,
                        urg: a.urg ?? null,
                    },
                    true
                )
            }
        } catch {}
    }, [user])

    // Limpia los temporizadores del análisis al desmontar.
    useEffect(
        () => () => {
            if (analTimers.current.msg) clearInterval(analTimers.current.msg)
            if (analTimers.current.done) clearTimeout(analTimers.current.done)
        },
        []
    )

    // Al montar (volver atrás desde una convocatoria, recargar…): si ya se mostró una
    // recomendación en esta sesión, se restaura tal cual (sin re-registrar métrica).
    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(QO_RESULT_KEY)
            if (!raw) return
            const s = JSON.parse(raw)
            if (s && s.titulacion && s.euskera && s.area) {
                setTitulacion(s.titulacion)
                setEuskera(s.euskera)
                setArea(s.area)
                setTiempo(s.tiempo ?? null)
                setProv(s.prov ?? null)
                setUrg(s.urg ?? null)
                aplicarRecomendacion(s, false)
            }
        } catch {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const recomendadas = useMemo(() => {
        if (!snap) return []
        const slugs = AREA_ORGANISMOS[snap.area]
        const base = CONVOCATORIAS.filter((c) => slugs.includes(c.organismo))
        // Filtro ESTRICTO por provincia: solo autonómicas (Gobierno Vasco, Osakidetza,
        // Ertzaintza, Educación — valen para toda Euskadi) + las específicas de tu
        // Territorio Histórico. Las de otras provincias se descartan.
        if (!snap.prov || snap.prov === "cualquiera") return base
        const kws = PROV_KEYWORDS[snap.prov]
        const auton = new Set(["gobierno-vasco", "osakidetza", "ertzaintza", "educacion"])
        return base.filter((c) => {
            if (auton.has(c.organismo)) return true
            const s = `${c.slug} ${c.nombre}`.toLowerCase()
            return kws.some((k) => s.includes(k))
        })
    }, [snap])

    const tit = snap ? TITULACION_INFO[snap.titulacion] : null
    const aviso = snap ? avisoArea(snap.area, snap.titulacion) : null

    // Descarga la recomendación en PDF: abre una ventana con el contenido maquetado
    // y lanza el diálogo de impresión (el usuario elige "Guardar como PDF"). Sin libs.
    function descargarPDF() {
        if (!snap || !reco || !tit) return
        const esc = (s: string) =>
            (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        const fecha = new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        const sec = (titulo: string, cuerpo: string) =>
            `<div class="sec"><div class="h">${esc(titulo)}</div><div class="p">${esc(cuerpo)}</div></div>`
        const provTxt = provInfo(snap.area, snap.prov)
        const conv = recomendadas.length
            ? `<div class="sec"><div class="h">Convocatorias de tu área</div><ul>${recomendadas
                  .map((c) => `<li>${esc(getOrganismo(c.organismo)?.corto ?? "")} — ${esc(c.nombre)}</li>`)
                  .join("")}</ul>${snap.area === "educacion" ? `<div class="nota">Nota: el Gobierno Vasco alterna convocatorias — un año Cuerpo de Maestros y al siguiente Secundaria/FP. Tu cuerpo suele salir solo cada dos años.</div>` : ""}</div>`
            : ""
        const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Tu recomendación — Gainditu</title><style>
body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#18181b;max-width:720px;margin:0 auto;padding:40px 32px}
.brand{font-weight:800;font-size:20px}.brand span{color:#10B981}
h1{font-size:24px;margin:14px 0 2px}.date{color:#71717a;font-size:12px;margin-bottom:20px}
.cards{display:flex;gap:12px;margin:16px 0}.card{flex:1;border:1px solid #e4e4e7;border-radius:12px;padding:14px}
.card.ideal{border-color:#10B98155;background:#10B98110}.tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#10B981}
.card.alt .tag{color:#71717a}.pct{float:right;font-weight:800;color:#10B981}.card.alt .pct{color:#3f3f46}
.name{font-weight:800;font-size:15px;margin-top:4px}.motivo{font-size:12px;color:#71717a;margin-top:6px}
.sec{margin:14px 0}.sec .h{font-weight:700;font-size:13px}.sec .p{font-size:13px;color:#3f3f46;margin-top:2px;line-height:1.5}
.aviso{border:1px solid #f59e0b55;background:#f59e0b12;border-radius:8px;padding:10px 12px;font-size:12px;margin:12px 0}
ul{margin:6px 0 0;padding-left:18px;font-size:13px;color:#3f3f46}.nota{font-size:12px;color:#71717a;margin-top:6px}
.foot{margin-top:28px;border-top:1px solid #e4e4e7;padding-top:12px;font-size:11px;color:#a1a1aa}
</style></head><body>
<div class="brand">gain<span>ditu</span>.</div>
<h1>Tu recomendación</h1><div class="date">${fecha} · orientación, no dictamen oficial</div>
<div class="cards">
<div class="card ideal"><span class="pct">${reco.idealPct}%</span><div class="tag">Tu oposición ideal</div><div class="name">${esc(reco.ideal)}</div></div>
<div class="card alt"><span class="pct">${reco.altPct}%</span><div class="tag">Alternativa estratégica</div><div class="name">${esc(reco.alt)}</div><div class="motivo">${esc(reco.altMotivo)}</div></div>
</div>
${reco.ordenNota ? `<div class="sec"><div class="h">Por tu situación</div><div class="p">${esc(reco.ordenNota)}</div></div>` : ""}
${reco.provNota ? `<div class="sec"><div class="p">${esc(reco.provNota)}</div></div>` : ""}
${aviso ? `<div class="aviso"><b>Ojo:</b> ${esc(aviso)}</div>` : ""}
${sec("A qué plazas puedes presentarte", `${encaje ?? ""} (tu titulación es de ${tit.codigo}).`)}
${notaEstrategica(snap.area, snap.titulacion) ? sec("Tu ventaja táctica", notaEstrategica(snap.area, snap.titulacion)!) : ""}
${notaProceso(snap.area) ? sec("El proceso, por dentro", notaProceso(snap.area)!.join(" ")) : ""}
${notaLocal(snap.area) ? sec("Autonómica vs. local", notaLocal(snap.area)!.join(" ")) : ""}
${notaMeritos(snap.area) ? sec(notaMeritos(snap.area)!.titulo, notaMeritos(snap.area)!.paras.join(" ")) : ""}
${sec("Qué te aporta tu nivel de euskera", euskeraInfo(snap.area, snap.euskera))}
${snap.tiempo ? sec("Tu ritmo de estudio", TIEMPO_INFO[snap.tiempo]) : ""}
${provTxt ? sec(snap.area === "educacion" ? "Provincia y destino" : "En tu provincia", provTxt) : ""}
${snap.urg ? sec("Cuándo presentarte", URG_INFO[snap.urg]) : ""}
${conv}
<div class="foot">Generado en gaindituoposiciones.com · Orientativo: cada plaza fija sus propios requisitos; confírmalos en la ficha oficial de cada convocatoria.</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`
        const w = window.open("", "_blank")
        if (!w) return
        w.document.write(html)
        w.document.close()
    }

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
            <div className="space-y-5">
                <div>
                    <div className="mb-2 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">1. ¿Qué titulación tienes?</div>
                    <Grupo opciones={TITULACIONES} value={titulacion} onChange={setTitulacion} />
                </div>
                <div>
                    <div className="mb-2 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">2. ¿Qué nivel de euskera tienes?</div>
                    <Grupo opciones={EUSKERAS} value={euskera} onChange={setEuskera} />
                </div>
                <div>
                    <div className="mb-2 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">3. ¿Qué área te interesa?</div>
                    <Grupo opciones={AREAS} value={area} onChange={setArea} />
                </div>
                <div>
                    <div className="mb-2 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">
                        4. ¿Cuánto tiempo puedes dedicar?{" "}
                        <span className="font-normal text-zinc-400 dark:text-zinc-500">(opcional)</span>
                    </div>
                    <Grupo opciones={TIEMPOS} value={tiempo} onChange={setTiempo} />
                </div>
                <div>
                    <div className="mb-2 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">
                        5. ¿En qué provincia quieres tu plaza?{" "}
                        <span className="font-normal text-zinc-400 dark:text-zinc-500">(opcional)</span>
                    </div>
                    <Grupo opciones={PROVINCIAS} value={prov} onChange={setProv} />
                </div>
                <div>
                    <div className="mb-2 text-[14px] font-bold text-zinc-900 dark:text-zinc-100">
                        6. ¿Para cuándo?{" "}
                        <span className="font-normal text-zinc-400 dark:text-zinc-500">(opcional)</span>
                    </div>
                    <Grupo opciones={URGENCIAS} value={urg} onChange={setUrg} />
                </div>
            </div>

            <button
                type="button"
                onClick={verRecomendacion}
                disabled={!completo || analizando}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-transform disabled:opacity-50 enabled:hover:scale-[1.02] sm:w-auto"
                style={{ background: ACCENT }}
            >
                {analizando && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {analizando
                    ? "Analizando…"
                    : mostrar
                      ? "Actualizar recomendación"
                      : "Ver recomendación"}
            </button>
            {analizando && (
                <div
                    ref={analRef}
                    className="mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-10 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                    <div
                        className="h-9 w-9 animate-spin rounded-full border-[3px] border-zinc-200 dark:border-zinc-700"
                        style={{ borderTopColor: ACCENT }}
                    />
                    <div>
                        <div className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                            Analizando tu perfil
                        </div>
                        <div
                            key={analMsg}
                            className="mt-1 text-[13px] text-zinc-500 transition-opacity dark:text-zinc-400"
                        >
                            {analMsg}
                        </div>
                    </div>
                </div>
            )}
            {!completo && !analizando && (
                <p className="mt-2 text-[12px] text-zinc-400 dark:text-zinc-500">
                    Responde las tres primeras preguntas para ver tu recomendación.
                </p>
            )}
            {cambiado && !analizando && (
                <p className="mt-2 text-[12px] font-medium" style={{ color: ACCENT }}>
                    Has cambiado tus respuestas · pulsa «Actualizar recomendación» para verla actualizada.
                </p>
            )}

            {mostrar && snap && tit && (
                <div className="mt-6 space-y-5 border-t border-zinc-100 dark:border-zinc-800 pt-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Nuestra recomendación</h3>
                            <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
                                Es una orientación para ayudarte a decidir, no un dictamen oficial. Cada plaza pone sus propios requisitos.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={descargarPDF}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 px-3.5 py-1.5 text-[12px] font-semibold text-zinc-700 transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-200"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            PDF
                        </button>
                    </div>

                    {reco && (
                        <p className="text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-200">
                            {qoTyped}
                            {qoTyped.length < resumenIA.length && (
                                <span
                                    className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse align-text-bottom"
                                    style={{ background: ACCENT }}
                                    aria-hidden
                                />
                            )}
                        </p>
                    )}

                    {reco && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {/* Oposición ideal */}
                            <div className="rounded-xl p-4" style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}44` }}>
                                <div className="flex items-center justify-between">
                                    <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>
                                        Tu oposición ideal
                                    </div>
                                    <div className="text-[15px] font-extrabold" style={{ color: ACCENT }}>
                                        {reco.idealPct}%
                                    </div>
                                </div>
                                <p className="mt-1 text-[15px] font-bold leading-snug text-zinc-950 dark:text-zinc-50">
                                    {reco.ideal}
                                </p>
                                <div className="mt-2 h-1.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800">
                                    <div className="h-full rounded-full" style={{ width: `${reco.idealPct}%`, background: ACCENT }} />
                                </div>
                                <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">coincidencia con tu perfil</div>
                            </div>

                            {/* Alternativa estratégica */}
                            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        Alternativa estratégica
                                    </div>
                                    <div className="text-[15px] font-extrabold text-zinc-700 dark:text-zinc-300">
                                        {reco.altPct}%
                                    </div>
                                </div>
                                <p className="mt-1 text-[15px] font-bold leading-snug text-zinc-950 dark:text-zinc-50">
                                    {reco.alt}
                                </p>
                                <div className="mt-2 h-1.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800">
                                    <div className="h-full rounded-full bg-zinc-400 dark:bg-zinc-500" style={{ width: `${reco.altPct}%` }} />
                                </div>
                                <div className="mt-1.5 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    {reco.altMotivo}
                                </div>
                            </div>
                        </div>
                    )}

                    {reco?.ordenNota && (
                        <div
                            className="rounded-xl px-4 py-3 text-[13px] leading-relaxed"
                            style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}33` }}
                        >
                            <span className="font-bold" style={{ color: ACCENT }}>
                                Por tu situación:{" "}
                            </span>
                            {reco.ordenNota}
                        </div>
                    )}

                    {reco?.provNota && (
                        <p className="text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                            {reco.provNota}
                        </p>
                    )}

                    {aviso && (
                        <div
                            className="rounded-xl border px-4 py-3 text-[13px] leading-relaxed"
                            style={{ borderColor: "#f59e0b55", background: "#f59e0b12", color: "inherit" }}
                        >
                            <span className="font-bold" style={{ color: "#b45309" }}>
                                Ojo:{" "}
                            </span>
                            {aviso}
                        </div>
                    )}

                    {/* Grupo según titulación */}
                    <div>
                        <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                            A qué plazas puedes presentarte
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                                {encaje}
                            </span>{" "}
                            <span className="text-zinc-500 dark:text-zinc-400">
                                (tu titulación es de {tit.codigo}).
                            </span>
                        </p>
                    </div>

                    {/* Nota estratégica (toque insider) */}
                    {notaEstrategica(snap.area, snap.titulacion) && (
                        <div
                            className="rounded-xl px-4 py-3 text-[13px] leading-relaxed"
                            style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}33` }}
                        >
                            <span className="font-bold" style={{ color: ACCENT }}>
                                Tu ventaja táctica:{" "}
                            </span>
                            {notaEstrategica(snap.area, snap.titulacion)}
                        </div>
                    )}

                    {/* Realidad del proceso (seguridad / bomberos) */}
                    {(() => {
                        const paras = notaProceso(snap.area)
                        if (!paras) return null
                        return (
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
                                {paras.map((p, i) => (
                                    <p key={i} className={i === 0 ? "" : "mt-2"}>
                                        {i === 0 && (
                                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                                El proceso, por dentro:{" "}
                                            </span>
                                        )}
                                        {p}
                                    </p>
                                ))}
                            </div>
                        )
                    })()}

                    {/* Dimensión local (administración) */}
                    {(() => {
                        const paras = notaLocal(snap.area)
                        if (!paras) return null
                        return (
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
                                {paras.map((p, i) => (
                                    <p key={i} className={i === 0 ? "" : "mt-2"}>
                                        {i === 0 && (
                                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                                Autonómica vs. local:{" "}
                                            </span>
                                        )}
                                        {p}
                                    </p>
                                ))}
                            </div>
                        )
                    })()}

                    {/* Méritos / baremo por área (IT Txartelak, experiencia, euskera…) */}
                    {(() => {
                        const m = notaMeritos(snap.area)
                        if (!m) return null
                        return (
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[13px] leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
                                {m.paras.map((p, i) => (
                                    <p key={i} className={i === 0 ? "" : "mt-2"}>
                                        {i === 0 && (
                                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                                {m.titulo}:{" "}
                                            </span>
                                        )}
                                        {p}
                                    </p>
                                ))}
                            </div>
                        )
                    })()}

                    {/* Euskera */}
                    <div>
                        <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                            Qué te aporta tu nivel de euskera
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {euskeraInfo(snap.area, snap.euskera)}
                        </p>
                    </div>

                    {/* Ritmo de estudio */}
                    {snap.tiempo && (
                        <div>
                            <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                                Tu ritmo de estudio
                            </div>
                            <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                                {TIEMPO_INFO[snap.tiempo]}
                            </p>
                        </div>
                    )}

                    {/* Provincia / destino (en Educación es autonómico) */}
                    {provInfo(snap.area, snap.prov) && (
                        <div>
                            <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                                {snap.area === "educacion" ? "Provincia y destino" : "En tu provincia"}
                            </div>
                            <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                                {provInfo(snap.area, snap.prov)}
                            </p>
                        </div>
                    )}

                    {/* Cuándo presentarte */}
                    {snap.urg && (
                        <div>
                            <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                                Cuándo presentarte
                            </div>
                            <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                                {URG_INFO[snap.urg]}
                            </p>
                        </div>
                    )}

                    {/* Aviso de realidad: A1/A2 de Administración con prisa y poco tiempo */}
                    {snap.area === "administracion" &&
                        snap.titulacion === "a" &&
                        snap.urg === "ya" &&
                        (snap.tiempo === "medio" || snap.tiempo === "poco") && (
                            <div
                                className="rounded-xl border px-4 py-3 text-[13px] leading-relaxed"
                                style={{ borderColor: "#f59e0b55", background: "#f59e0b12", color: "inherit" }}
                            >
                                <span className="font-bold" style={{ color: "#b45309" }}>
                                    Sé realista:{" "}
                                </span>
                                sacar un Técnico de Gestión (A2) o Superior (A1) con{" "}
                                {snap.tiempo === "poco" ? "menos de 2h" : "2-4h"} al día y con prisa es un
                                esfuerzo de medio plazo, no un sprint. Usa las convocatorias de Administrativo
                                (C1) a corto plazo como entrenamiento real mientras preparas la tuya.
                            </div>
                        )}

                    {/* Bifurcación por cobertura: simulacro de la escala recomendada o lista de espera */}
                    {simReco ? (
                        <div className="rounded-xl p-4" style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}44` }}>
                            <div className="text-[14px] font-bold text-zinc-950 dark:text-zinc-50">
                                Da el primer paso: mídete gratis
                            </div>
                            <p className="mt-1 text-[13px] text-zinc-600 dark:text-zinc-300">
                                Tenemos un simulacro real de {simReco.nombre} del Gobierno Vasco. Haz las 60
                                preguntas y descubre tu nota al momento.
                            </p>
                            <Link
                                href={simReco.path}
                                onClick={() => void logFunnelEvent("orientacion_to_simulacro", { area: snap.area, titulacion: snap.titulacion })}
                                className="mt-3 inline-flex rounded-full px-5 py-2.5 text-[14px] font-bold text-white transition-transform hover:scale-[1.03]"
                                style={{ background: ACCENT }}
                            >
                                Empezar el simulacro gratis →
                            </Link>
                        </div>
                    ) : snap.area === "administracion" ? null : wlDone ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                            <div className="text-[14px] font-bold text-emerald-800 dark:text-emerald-300">
                                Estás en la lista de espera
                            </div>
                            <p className="mt-1 text-[13px] text-emerald-700/90 dark:text-emerald-200/80">
                                Te avisamos en cuanto tengamos tests de {areaLabel}.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={enviarWaitlist} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                            <div className="text-[14px] font-bold text-zinc-950 dark:text-zinc-50">
                                Aún no tenemos tests de {areaLabel}
                            </div>
                            <p className="mt-1 text-[13px] text-zinc-600 dark:text-zinc-300">
                                Déjanos tu correo y te avisamos en cuanto los tengamos listos.
                            </p>
                            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="email"
                                    value={wlEmail}
                                    onChange={(e) => setWlEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-[14px] text-zinc-900 outline-none focus:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                                />
                                <button
                                    type="submit"
                                    disabled={wlLoading}
                                    className="rounded-xl px-5 py-2.5 text-[14px] font-bold text-white transition-transform hover:scale-[1.03] disabled:opacity-70"
                                    style={{ background: ACCENT }}
                                >
                                    {wlLoading ? "…" : "Avísame"}
                                </button>
                            </div>
                            <label className="mt-2.5 flex items-start gap-2 text-[12px] text-zinc-500 dark:text-zinc-400">
                                <input
                                    type="checkbox"
                                    checked={wlConsent}
                                    onChange={(e) => setWlConsent(e.target.checked)}
                                    className="mt-0.5 h-4 w-4 shrink-0"
                                    style={{ accentColor: ACCENT }}
                                />
                                <span>
                                    Acepto recibir el aviso por correo. Consulta la{" "}
                                    <Link href="/privacidad" target="_blank" className="underline">
                                        política de privacidad
                                    </Link>
                                    .
                                </span>
                            </label>
                            {wlError && <div className="mt-2 text-[12px] text-red-500">{wlError}</div>}
                        </form>
                    )}

                    {/* Tests por los que empezar — solo Administración tiene tests propios */}
                    {mostrarTracks && (
                        <div>
                            <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                                Empieza a practicar
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {tit.tracks.map((t) => (
                                    <Link
                                        key={t.href}
                                        href={t.href}
                                        className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.03]"
                                        style={{ background: ACCENT }}
                                    >
                                        {t.label} →
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Convocatorias del área — cierre informativo */}
                    {recomendadas.length > 0 && (
                        <div>
                            <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">
                                Convocatorias de tu área en Euskadi
                            </div>
                            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {recomendadas.map((c) => (
                                    <Link
                                        key={c.slug}
                                        href={`/convocatorias/${c.slug}`}
                                        className="group flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 transition-colors hover:border-zinc-300"
                                    >
                                        <div>
                                            <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                                                {getOrganismo(c.organismo)?.corto}
                                            </div>
                                            <div className="text-[12px] text-zinc-500 dark:text-zinc-400">{c.nombre}</div>
                                        </div>
                                        <span className="text-[13px] font-semibold transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }}>
                                            →
                                        </span>
                                    </Link>
                                ))}
                            </div>
                            {snap.area === "educacion" && (
                                <p className="mt-2 text-[12px] text-zinc-500 dark:text-zinc-400">
                                    Nota: el Gobierno Vasco alterna convocatorias — un año Cuerpo de
                                    Maestros (Infantil/Primaria) y al siguiente Secundaria/FP. Tu cuerpo
                                    suele salir solo cada dos años, así que conviene no fallar la ventana.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            <p className="mt-5 text-[12px] text-zinc-500 dark:text-zinc-400">
                Orientativo. Los grupos de titulación siguen el EBEP y las equivalencias de euskera
                (PL) el sistema de perfiles de Euskadi; cada plaza fija sus propios requisitos y su
                fecha de preceptividad. Confírmalos siempre en la ficha oficial de cada convocatoria.
            </p>

            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                            Regístrate para ver tu recomendación
                        </h3>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                            Crea tu cuenta gratis y te decimos qué oposición encaja contigo. Tardas
                            menos de un minuto.
                        </p>
                        <div className="mt-5 space-y-3">
                            <button
                                type="button"
                                onClick={handleGoogle}
                                className="flex w-full items-center justify-center gap-2.5 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-[14px] font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
                            >
                                <GoogleIcon />
                                Continuar con Google
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                                <span className="text-[11px] text-zinc-400">o con email</span>
                                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <Link
                                    href={`/signup?redirect=${encodeURIComponent(QO_REDIRECT)}`}
                                    onClick={persistAnswers}
                                    className="inline-flex rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03]"
                                    style={{ background: ACCENT }}
                                >
                                    Crear cuenta gratis →
                                </Link>
                                <Link
                                    href={`/login?redirect=${encodeURIComponent(QO_REDIRECT)}`}
                                    onClick={persistAnswers}
                                    className="inline-flex rounded-full border border-zinc-200 px-5 py-2.5 text-[14px] font-semibold text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-200"
                                >
                                    Entrar
                                </Link>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="mt-4 text-[12px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
