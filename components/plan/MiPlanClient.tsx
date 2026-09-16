"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const ACCENT = "#10B981"

// ── Cuestionario (genérico: sirve para cualquier examen u oposición) ────────
type Respuestas = {
    tipo: string
    meses: number
    horas: number
    extension: string
    nivel: string
    experiencia: string
    objetivo: string
    reto: string
    estilo: string[]
}

const TIPOS = [
    { id: "administrativo", label: "Administrativo / Gestión" },
    { id: "justicia", label: "Justicia" },
    { id: "policia", label: "Policía / Seguridad" },
    { id: "sanidad", label: "Sanidad" },
    { id: "educacion", label: "Educación" },
    { id: "hacienda", label: "Hacienda / Economía" },
    { id: "otro", label: "Otra" },
]
// Qué práctica priorizar según el formato real del examen.
const PRACTICA_TIPO: Record<string, string> = {
    administrativo: "Tu examen es sobre todo tipo test: prioriza hacer muchísimos test por temas y exámenes oficiales cronometrados. La velocidad y el acierto se entrenan con volumen.",
    justicia: "Además del test, entrena los supuestos y casos prácticos y acostúmbrate a localizar artículos en el código con soltura: en el examen el tiempo es oro.",
    policia: "Combina el test teórico con la preparación específica (ortografía, psicotécnicos y, si aplica, las pruebas físicas). Reserva sesiones semanales para cada parte.",
    sanidad: "Tu examen suele ser un test extenso: dale prioridad a los test por temas y a los exámenes de convocatorias anteriores, muy repetitivos entre sí.",
    educacion: "Prepara desde pronto la parte de desarrollo (temas escritos) y, si aplica, la programación: redactar bien y con estructura se entrena escribiendo, no releyendo.",
    hacienda: "Tu examen combina test con supuestos prácticos numéricos: alterna teoría con resolución de casos y ejercicios, que es donde se decide la nota.",
    otro: "Adapta la práctica al formato real de tu examen (test, supuestos o desarrollo) y dedica tiempo específico a entrenar exactamente ese formato, no solo a leer teoría.",
}
const EXPERIENCIAS = [
    { id: "nunca", label: "Nunca me he presentado" },
    { id: "pocos", label: "A alguno, pocos" },
    { id: "experto", label: "Tengo experiencia" },
]
const OBJETIVOS = [
    { id: "aprobar", label: "Aprobar" },
    { id: "plaza", label: "Sacar plaza" },
    { id: "top", label: "Quedar entre los mejores" },
]

const MESES = [2, 3, 4, 6, 9, 12]
const HORAS = [5, 10, 15, 20]
const EXTENSIONES = [
    { id: "corto", label: "Corto (menos de 20 temas)", temas: 18 },
    { id: "medio", label: "Medio (unos 30–40 temas)", temas: 35 },
    { id: "extenso", label: "Extenso (unos 50–60 temas)", temas: 55 },
    { id: "muy", label: "Muy extenso (70 o más)", temas: 78 },
]
const NIVELES = [
    { id: "cero", label: "Empiezo de cero" },
    { id: "retomo", label: "Retomo, ya estudié antes" },
    { id: "avanzado", label: "Voy avanzado" },
]
const RETOS = [
    {
        id: "memoria",
        label: "Memorizar tanto contenido",
        titulo: "Memoriza con repaso espaciado",
        desc: "Resume cada tema con tus propias palabras y repásalo a intervalos crecientes (1 día, 3 días, 1 semana). Recordar de memoria, en vez de releer, es lo que fija el contenido a largo plazo.",
    },
    {
        id: "practica",
        label: "Los ejercicios o casos prácticos",
        titulo: "Aprende practicando",
        desc: "Dedica más tiempo a resolver ejercicios y exámenes de años anteriores que a releer teoría. Se aprende a aplicar aplicando: cuantos más casos hagas, más suelto irás.",
    },
    {
        id: "constancia",
        label: "Mantener la constancia",
        titulo: "Gana con la rutina",
        desc: "Fija un horario y metas semanales pequeñas y concretas. Este plan te marca el ritmo: cúmplelo aunque algún día avances poco. La constancia siempre le gana a los sprints.",
    },
    {
        id: "nervios",
        label: "Los nervios del examen",
        titulo: "Normaliza el examen",
        desc: "Haz simulacros en condiciones reales (cronometrados y del tirón) desde pronto. Cuanto más normalices la situación de examen, menos te pesarán los nervios el día importante.",
    },
]
const ESTILOS = [
    { id: "cortos", label: "A ratos cortos, me despisto fácil" },
    { id: "largos", label: "Sesiones largas de concentración" },
    { id: "visual", label: "Necesito esquematizarlo todo" },
    { id: "repaso", label: "Repitiendo y autoevaluándome" },
]
const TECNICAS: Record<string, { nombre: string; desc: string }> = {
    cortos: {
        nombre: "Técnica Pomodoro (25/5)",
        desc: "Estudia en bloques de 25 minutos con 5 de descanso, y uno más largo cada cuatro. Como te despistas con facilidad, la meta de cada bloque es pequeña y alcanzable: mantiene la cabeza fresca.",
    },
    largos: {
        nombre: "Bloques largos de concentración (60–90 min)",
        desc: "Aprovecha que aguantas concentrado: sesiones de 60–90 minutos sin interrupciones (móvil fuera), con un descanso real entre ellas. Cierra cada bloque repasando lo que acabas de estudiar.",
    },
    visual: {
        nombre: "Esquemas y recuerdo activo",
        desc: "Convierte cada tema en un esquema o mapa mental con tus palabras y luego repásalo tapándolo, intentando reconstruirlo de memoria. Ver la estructura y forzar el recuerdo fija mucho más que releer.",
    },
    repaso: {
        nombre: "Repetición espaciada + autoevaluación",
        desc: "Repasa cada tema a intervalos crecientes (1 día, 3 días, 1 semana) y ponte a prueba a menudo. Recordar en vez de releer es lo que de verdad consolida para el examen.",
    },
}

const RETRASO_TXT =
    "Si un tema se te atraganta y pierdes días, no arrastres el retraso repasándolo sin fin: sigue el calendario y recupera lo que falte en la segunda vuelta. Cumplir el plan general pesa más que rematar cada tema."
const ERRORES: [string, string][] = [
    ["No subrayarlo todo igual", "Usa un código de colores: un color para las palabras clave, otro para los números y plazos, y otro para las leyes y artículos. Si lo pintas todo del mismo color no resalta nada; así repasas de un vistazo."],
    ["No hacer tests a ciegas", "Ponte con los tests de un tema cuando ya lo has leído, no antes: fallarlo todo sin base desespera. Pero tampoco los dejes para el final; en cuanto entiendas un tema, pruébate con él."],
    ["No estudiar a costa del sueño", "Dormir es parte del estudio: es cuando el cerebro consolida lo aprendido."],
]

// ── Tu semana ideal ─────────────────────────────────────────────────────────
// Reparte las horas semanales en un calendario de lunes a domingo, con un día de
// descanso y una mezcla de teoría, repaso y test. Se adapta al estilo de estudio.
type DiaPlan = { dia: string; horas: number; act: string }
function semanaIdeal(horas: number, estilos: string[]): DiaPlan[] {
    const cortos = estilos.includes("cortos")
    const largos = estilos.includes("largos")
    let pesos: Record<string, number> = { Lunes: 0.13, Martes: 0.13, Miércoles: 0, Jueves: 0.15, Viernes: 0.12, Sábado: 0.24, Domingo: 0.23 }
    if (largos) pesos = { Lunes: 0.1, Martes: 0.1, Miércoles: 0, Jueves: 0.12, Viernes: 0.1, Sábado: 0.3, Domingo: 0.28 }
    if (cortos) pesos = { Lunes: 0.15, Martes: 0.15, Miércoles: 0.08, Jueves: 0.16, Viernes: 0.14, Sábado: 0.16, Domingo: 0.16 }
    const act: Record<string, string> = { Lunes: "Teoría", Martes: "Teoría", Miércoles: "Descanso", Jueves: "Teoría + test", Viernes: "Repaso", Sábado: "Estudio profundo", Domingo: "Repaso + simulacro" }
    const orden = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    return orden.map((d) => {
        const h = Math.round(pesos[d] * horas * 2) / 2
        let a = act[d]
        if (d === "Miércoles") a = h > 0 ? "Repaso ligero" : "Descanso"
        return { dia: d, horas: h, act: h === 0 ? "Descanso" : a }
    })
}
const fmtH = (h: number) => (h === 0 ? "Descanso" : `${String(h).replace(".", ",")} h`)

// ── Generador del plan (determinista, por reglas) ──────────────────────────
function generarPlan(r: Respuestas) {
    const ext = EXTENSIONES.find((e) => e.id === r.extension) ?? EXTENSIONES[1]
    const weeks = Math.max(4, Math.round(r.meses * 4.3))
    const totalHoras = weeks * r.horas
    const temas = ext.temas
    const objetivo = r.objetivo ?? "plaza"
    const experiencia = r.experiencia ?? "pocos"
    const tipo = TIPOS.find((t) => t.id === r.tipo) ?? TIPOS[0]

    // Cuándo arrancan los simulacros: según la experiencia en exámenes oficiales.
    const simFrac = experiencia === "nunca" ? 0.5 : experiencia === "experto" ? 0.68 : 0.6
    const simWeek = Math.min(weeks - 1, Math.max(3, Math.round(weeks * simFrac)))
    const preSim = Math.max(2, simWeek - 1)
    const s1 = Math.max(1, Math.round(preSim * 0.55))
    const s2 = Math.max(1, preSim - s1)
    const s3 = Math.max(1, weeks - s1 - s2)

    const nivelTxt = r.nivel === "cero" ? "Empiezas de cero" : r.nivel === "retomo" ? "Retomas tras un tiempo" : "Ya vas avanzado"
    let feas = "es un ritmo sostenible: la clave es la constancia semana a semana."
    if (totalHoras < 150) feas = "es un plan ajustado: prioriza lo esencial y no te disperses."
    else if (totalHoras > 420) feas = "tienes margen de sobra: aprovéchalo para dar más vueltas y afinar."
    const intensidad =
        objetivo === "aprobar"
            ? "Como tu meta es aprobar, el plan prioriza cubrir bien lo esencial sin sobrecargarte."
            : objetivo === "top"
              ? "Como quieres estar entre los mejores, el plan aprieta: más vueltas, más simulacros y foco en subir nota."
              : "Como vas a por plaza, el plan busca cubrir todo el temario con solvencia y mucha práctica."
    const diagnostico = `Preparas ${tipo.label}. Tienes ${r.meses} meses (unas ${weeks} semanas) y ${r.horas} h a la semana: alrededor de ${totalHoras} horas de estudio. ${nivelTxt}, ${feas} ${intensidad}`

    // Desglose por bloques de ~4-6 semanas (tipo "mes a mes"), no semana a semana.
    function bloquesFase(startWeek: number, len: number) {
        const nb = Math.max(1, Math.round(len / 5))
        const base = Math.floor(len / nb)
        const extra = len % nb
        const out: { desde: number; hasta: number; label: string }[] = []
        let w = startWeek
        for (let i = 0; i < nb; i++) {
            const l = base + (i < extra ? 1 : 0)
            const desde = w
            const hasta = w + l - 1
            out.push({ desde, hasta, label: desde === hasta ? `Semana ${desde}` : `Semanas ${desde}–${hasta}` })
            w += l
        }
        return out
    }
    const rangoTemas = (i: number, tpb: number) => {
        const desde = i * tpb + 1
        const hasta = Math.min(temas, (i + 1) * tpb)
        return desde >= hasta ? `Tema ${Math.min(desde, temas)}` : `Temas ${desde}–${hasta}`
    }

    const bl1 = bloquesFase(1, s1)
    const bl2 = bloquesFase(s1 + 1, s2)
    const bl3 = bloquesFase(s1 + s2 + 1, s3)
    const tpb1 = Math.ceil(temas / bl1.length)
    const tpb2 = Math.ceil(temas / bl2.length)

    const fases = [
        {
            n: 1,
            nombre: "Cimientos",
            foco: "Primera vuelta a todo el temario, tema a tema. Entender antes de memorizar.",
            bloques: bl1.map((b, i) => ({ semanas: b.label, foco: `${rangoTemas(i, tpb1)} · primera vuelta` })),
        },
        {
            n: 2,
            nombre: "Consolidación",
            foco: "Segunda vuelta y práctica intensiva, cargando en lo que peor llevas.",
            bloques: bl2.map((b, i) => ({ semanas: b.label, foco: `Repaso ${rangoTemas(i, tpb2).toLowerCase()} + práctica` })),
        },
        {
            n: 3,
            nombre: "Simulacros y repaso",
            foco: "Exámenes de práctica completos y repaso final. Nada nuevo.",
            bloques: bl3.map((b, i) => ({
                semanas: b.label,
                foco: i === bl3.length - 1 ? "Repaso final ligero y descanso" : "Simulacros y repaso de fallos",
            })),
        },
    ]

    const estilosSel = Array.isArray(r.estilo) ? r.estilo : [r.estilo]
    const tecnicas = estilosSel.map((e) => TECNICAS[e]).filter(Boolean)
    if (tecnicas.length === 0) tecnicas.push(TECNICAS.repaso)
    const reto = RETOS.find((x) => x.id === r.reto) ?? RETOS[2]

    const practica = PRACTICA_TIPO[tipo.id] ?? PRACTICA_TIPO.otro
    const simulacros = `Empieza los simulacros hacia la semana ${simWeek}. Hazlos como el examen de verdad: cronometrados y del tirón. ${objetivo === "top" ? "Apunta a nota alta y repite los que peor te salgan." : "Te sirven para ver qué te falta por repasar y para perder el miedo al día clave."}`

    // Perfil de estudio (efecto WOW: le devuelve una lectura de su situación).
    const horasPorTema = totalHoras / temas
    const margenAlto = r.meses >= 9 || horasPorTema >= 9
    const margenJusto = totalHoras < 150 || (r.meses <= 3 && horasPorTema < 5)
    const perfilNombre =
        ({ memoria: "Memorización intensiva", practica: "Teórico que necesita ruedo", constancia: "Constante intermitente", nervios: "Sólido con nervios de examen" } as Record<string, string>)[r.reto] ?? "Preparación equilibrada"
    const nivelFrase =
        r.nivel === "cero"
            ? "Partes desde cero, así que tu primera vuelta al temario será la fase más larga y decisiva"
            : r.nivel === "retomo"
              ? "Ya conoces parte del temario, así que tu riesgo no es la dificultad del contenido, sino perder regularidad"
              : "Ya vas avanzado, así que puedes cargar antes en práctica y simulacros"
    const margenFrase = margenAlto ? "Tienes tiempo suficiente para preparar el examen con calma" : margenJusto ? "Vas con el tiempo justo, hay que priorizar sin dispersarse" : "El tiempo da para una preparación completa si no pierdes semanas"
    const prioridadFrase =
        ({
            constancia: "Tu prioridad estos meses no es estudiar más horas, sino estudiar todas las semanas",
            memoria: "Tu prioridad es repasar lo ya estudiado para que no se te olvide",
            practica: "Tu prioridad es pasar de la teoría a los ejercicios cuanto antes",
            nervios: "Tu prioridad es familiarizarte con el examen real desde pronto",
        } as Record<string, string>)[r.reto] ?? "Tu prioridad es avanzar con constancia y repasar lo estudiado"
    let prob = horasPorTema >= 8 ? "Alta" : horasPorTema >= 4.5 ? "Media-alta" : "Media"
    if (objetivo === "top" && prob === "Alta") prob = "Media-alta"
    if (margenJusto) prob = prob === "Alta" ? "Media-alta" : "Media"
    const perfil = { nombre: perfilNombre, texto: `${nivelFrase}. ${margenFrase}. ${prioridadFrase}.`, prob }

    // Tu principal riesgo (le hace sentir que el plan "le entiende").
    let riesgo: { titulo: string; texto: string; tips: string[] }
    if (margenJusto) {
        riesgo = {
            titulo: "Quedarte sin tiempo para las últimas vueltas",
            texto: "Con el margen justo, el error típico es estancarse en los primeros temas y llegar sin repasar ni hacer simulacros suficientes.",
            tips: ["Fija un tope de días por tema y respétalo.", "Empieza los test desde la primera vuelta, no al final.", "Reserva sí o sí las últimas 2-3 semanas para repaso y simulacros."],
        }
    } else if (margenAlto && r.reto === "constancia") {
        const m1 = Math.max(2, Math.round(r.meses * 0.35))
        const m2 = Math.max(m1 + 1, Math.round(r.meses * 0.7))
        riesgo = {
            titulo: `Mantener la motivación durante los meses ${m1}-${m2}`,
            texto: "Es habitual que quien dispone de mucho margen temporal relaje el ritmo antes de terminar la primera vuelta.",
            tips: ["Márcate objetivos semanales concretos.", "Haz un test cada domingo.", "Registra las horas que estudias cada semana."],
        }
    } else {
        riesgo =
            ({
                memoria: {
                    titulo: "Olvidar lo estudiado al principio",
                    texto: "Sin repaso, los primeros temas se evaporan justo cuando llegas al final del temario.",
                    tips: ["Repasa a intervalos crecientes (1 día, 3 días, 1 semana).", "Hazte preguntas en vez de releer.", "Dedica el domingo a repasar lo de la semana."],
                },
                practica: {
                    titulo: "Dominar la teoría pero fallar en la práctica",
                    texto: "Saberse el temario no basta si no entrenas el formato real del examen.",
                    tips: ["Haz ejercicios y casos desde que entiendas cada tema.", "Corrige los fallos y anota por qué fallaste.", "Cronometra la práctica para ganar velocidad."],
                },
                nervios: {
                    titulo: "Bloquearte el día del examen",
                    texto: "Los nervios pesan menos cuanto más normal te resulte la situación de examen.",
                    tips: ["Haz simulacros reales, cronometrados y del tirón.", "Ensaya tu rutina del día (descanso, material, horario).", "Practica técnicas de respiración antes de empezar."],
                },
                constancia: {
                    titulo: "Perder semanas por falta de rutina",
                    texto: "El mayor enemigo no es la dificultad, es dejar de estudiar unos días y no volver.",
                    tips: ["Fija un horario y trátalo como una cita.", "Metas semanales pequeñas y alcanzables.", "Un test cada domingo para medir el avance."],
                },
            } as Record<string, { titulo: string; texto: string; tips: string[] }>)[r.reto] ?? {
                titulo: "Perder el ritmo a mitad de camino",
                texto: "Lo más habitual es relajar la constancia cuando el examen aún se ve lejos.",
                tips: ["Objetivos semanales concretos.", "Un test cada domingo.", "Registra tus horas de estudio."],
            }
    }

    const semana = semanaIdeal(r.horas, estilosSel)

    const hitos = [
        { semana: s1, texto: "Primera vuelta al temario completa." },
        { semana: simWeek, texto: "Arrancan los simulacros en condiciones reales." },
        { semana: weeks, texto: "Solo repaso y simulacros. A por ello." },
    ]

    return { weeks, totalHoras, diagnostico, fases, tecnicas, reto, practica, simulacros, perfil, riesgo, semana, hitos, tipo }
}

// ── Descarga del plan (documento imprimible / guardar como PDF) ─────────────
function esc(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function buildPlanHTML(plan: ReturnType<typeof generarPlan>) {
    const fases = plan.fases
        .map(
            (f) => `<div class="fase"><div class="fh"><span class="num">${f.n}</span><b>${esc(f.nombre)}</b></div>
      <p class="muted">${esc(f.foco)}</p>
      <ul class="bloques">${f.bloques.map((b) => `<li><span class="pill">${esc(b.semanas)}</span> ${esc(b.foco)}</li>`).join("")}</ul></div>`,
        )
        .join("")
    const tecnicas = plan.tecnicas.map((t) => `<div class="card"><b>${esc(t.nombre)}</b><p>${esc(t.desc)}</p></div>`).join("")
    const errores = ERRORES.map(([t, d]) => `<div class="card"><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join("")
    const hitos = plan.hitos.map((h) => `<li><span class="pill">Sem ${h.semana}</span> ${esc(h.texto)}</li>`).join("")
    const semana = plan.semana.map((d) => `<li><span class="pill">${esc(d.dia)}</span> <b>${esc(fmtH(d.horas))}</b>${d.horas ? ` · ${esc(d.act)}` : ""}</li>`).join("")
    const tips = plan.riesgo.tips.map((t) => `<li>${esc(t)}</li>`).join("")
    return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tu plan de estudio · Gainditu</title>
<style>
  :root{--a:#10B981}
  *{box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#18181b;margin:0;padding:32px;max-width:760px;margin:0 auto;line-height:1.5}
  header{border-bottom:2px solid var(--a);padding-bottom:14px;margin-bottom:24px}
  .brand{font-size:13px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:var(--a)}
  h1{font-size:26px;margin:4px 0 0}
  h2{font-size:12px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:#71717a;margin:26px 0 10px}
  .lead{background:#10B9810d;border:1px solid #10B98155;border-radius:12px;padding:14px 16px;font-size:15px;margin:0}
  .perfil{border:1px solid #10B98155;border-radius:12px;padding:14px 16px}
  .perfil .n{font-size:17px;font-weight:800}
  .perfil .prob{font-size:13px;color:#059669;font-weight:700;margin-top:6px}
  .warn{background:#fff7ed;border:1px solid #fdba7455;border-radius:12px;padding:14px 16px}
  .warn b{color:#9a3412}
  .warn ul{margin:8px 0 0;padding-left:18px;font-size:13px}
  .fase{margin-bottom:14px}
  .fh{display:flex;align-items:center;gap:8px;font-size:15px}
  .num{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--a);color:#fff;font-weight:800;font-size:13px}
  .muted{color:#71717a;font-size:13px;margin:4px 0 6px 32px}
  ul.bloques{list-style:none;padding:0 0 0 32px;margin:0}
  ul.bloques li{font-size:13.5px;margin:4px 0}
  ul.sem{list-style:none;padding:0;margin:0}
  ul.sem li{font-size:13.5px;margin:4px 0;border:1px solid #e4e4e7;border-radius:8px;padding:6px 10px}
  .pill{display:inline-block;background:#10B98118;color:var(--a);font-weight:700;font-size:11px;border-radius:6px;padding:1px 7px;margin-right:6px}
  .card{border:1px solid #e4e4e7;border-radius:12px;padding:12px 14px;margin:8px 0}
  .card b{font-size:14.5px}
  .card p{font-size:13px;color:#52525b;margin:4px 0 0}
  section>p{font-size:14px}
  ul.hitos{list-style:none;padding:0;margin:0}
  ul.hitos li{border:1px solid #e4e4e7;border-radius:10px;padding:8px 12px;margin:6px 0;font-size:13.5px}
  footer{margin-top:30px;padding-top:14px;border-top:1px solid #e4e4e7;font-size:12px;color:#a1a1aa}
  @media print{body{padding:0}.fase,.card,ul.hitos li,ul.sem li,section{page-break-inside:avoid}}
</style></head><body>
<header><div class="brand">Gainditu · Método Gainditu</div><h1>Tu plan de estudio</h1></header>
<section><h2>Tu plan de un vistazo</h2><p class="lead">${esc(plan.diagnostico)}</p></section>
<section><h2>Tu perfil de estudio</h2><div class="perfil"><div class="n">${esc(plan.perfil.nombre)}</div><p>${esc(plan.perfil.texto)}</p><div class="prob">Probabilidad de éxito si mantienes el ritmo: ${esc(plan.perfil.prob)}.</div></div></section>
<section><h2>Tu principal riesgo</h2><div class="warn"><b>⚠ ${esc(plan.riesgo.titulo)}</b><p>${esc(plan.riesgo.texto)}</p><ul>${tips}</ul></div></section>
<section><h2>Cómo organizarte, fase a fase</h2>${fases}</section>
<section><h2>Tu semana ideal</h2><ul class="sem">${semana}</ul></section>
<section><h2>${plan.tecnicas.length > 1 ? "Tus técnicas de estudio" : "Tu técnica de estudio"}</h2>${tecnicas}</section>
<section><h2>La práctica según tu examen</h2><p>${esc(plan.practica)}</p></section>
<section><h2>Tu punto a reforzar</h2><div class="card"><b>${esc(plan.reto.titulo)}</b><p>${esc(plan.reto.desc)}</p></div></section>
<section><h2>Los simulacros</h2><p>${esc(plan.simulacros)}</p></section>
<section><h2>Si te retrasas</h2><p>${esc(RETRASO_TXT)}</p></section>
<section><h2>Errores que evitar</h2>${errores}</section>
<section><h2>Tus hitos</h2><ul class="hitos">${hitos}</ul></section>
<footer>Plan orientativo generado con tus respuestas. Ajústalo a tu ritmo y a tu convocatoria · gaindituoposiciones.com</footer>
</body></html>`
}
function descargarPlan(plan: ReturnType<typeof generarPlan>) {
    const w = window.open("", "_blank")
    if (!w) {
        alert("Permite las ventanas emergentes para descargar el plan.")
        return
    }
    w.document.write(buildPlanHTML(plan))
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 350)
}

// ── UI ─────────────────────────────────────────────────────────────────────
export default function MiPlanClient() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [isPremium, setIsPremium] = useState(false)
    const [preview, setPreview] = useState(false)
    const [saved, setSaved] = useState<Respuestas | null>(null)
    const [guardando, setGuardando] = useState(false)

    const [tipo, setTipo] = useState("administrativo")
    const [meses, setMeses] = useState(6)
    const [horas, setHoras] = useState(10)
    const [extension, setExtension] = useState("medio")
    const [nivel, setNivel] = useState("retomo")
    const [experiencia, setExperiencia] = useState("pocos")
    const [objetivo, setObjetivo] = useState("plaza")
    const [reto, setReto] = useState("constancia")
    const [estilo, setEstilo] = useState<string[]>(["repaso"])
    const [editando, setEditando] = useState(false)

    // Efecto "IA": piensa un momento y luego escribe el diagnóstico antes de revelar el resto
    const [iaActivo, setIaActivo] = useState(false)
    const [pensando, setPensando] = useState(false)
    const [typedDiag, setTypedDiag] = useState("")
    const [revelado, setRevelado] = useState(false)

    function toggleEstilo(id: string) {
        setEstilo((prev) => {
            if (prev.includes(id)) {
                const next = prev.filter((x) => x !== id)
                return next.length ? next : prev
            }
            if (prev.length >= 2) return [prev[1], id]
            return [...prev, id]
        })
    }

    // Acceso privado por link (solo para pruebas): ?k=PLAN-ENEKO-7KD92MX4
    useEffect(() => {
        try {
            if (new URLSearchParams(window.location.search).get("k") === "PLAN-ENEKO-7KD92MX4") {
                setPreview(true)
            }
        } catch {}
    }, [])

    useEffect(() => {
        const supabase = createClient()
        let cancel = false
        supabase.auth.getUser().then(async ({ data }) => {
            if (cancel) return
            const u = data.user ?? null
            setUser(u)
            if (u) {
                const { data: prof } = await supabase
                    .from("profiles")
                    .select("is_premium, plan_respuestas")
                    .eq("id", u.id)
                    .single()
                if (!cancel) {
                    setIsPremium(!!prof?.is_premium)
                    if (prof?.plan_respuestas && (prof.plan_respuestas as any).extension) {
                        setSaved(prof.plan_respuestas as Respuestas)
                    }
                }
            }
            if (!cancel) setLoading(false)
        })
        return () => {
            cancel = true
        }
    }, [])

    const plan = useMemo(() => (saved ? generarPlan(saved) : null), [saved])

    // Secuencia del efecto IA: pensar → escribir el diagnóstico → revelar el resto
    useEffect(() => {
        if (!iaActivo || !plan) return
        let iv: ReturnType<typeof setInterval> | undefined
        setPensando(true)
        setTypedDiag("")
        setRevelado(false)
        const t1 = setTimeout(() => {
            setPensando(false)
            const full = plan.diagnostico
            let i = 0
            iv = setInterval(() => {
                i += 2
                setTypedDiag(full.slice(0, i))
                if (i >= full.length) {
                    if (iv) clearInterval(iv)
                    setRevelado(true)
                }
            }, 18)
        }, 1900)
        return () => {
            clearTimeout(t1)
            if (iv) clearInterval(iv)
        }
    }, [iaActivo, plan])

    async function generar() {
        const r: Respuestas = { tipo, meses, horas, extension, nivel, experiencia, objetivo, reto, estilo }
        setGuardando(true)
        try {
            if (user) {
                const supabase = createClient()
                await supabase.rpc("guardar_plan_respuestas", { r })
            }
            setIaActivo(true)
            setSaved(r)
            setEditando(false)
        } finally {
            setGuardando(false)
        }
    }

    function rehacer() {
        setIaActivo(false)
        if (saved) {
            setTipo(saved.tipo ?? "administrativo")
            setMeses(saved.meses)
            setHoras(saved.horas)
            setExtension(saved.extension)
            setNivel(saved.nivel)
            setExperiencia(saved.experiencia ?? "pocos")
            setObjetivo(saved.objetivo ?? "plaza")
            setReto(saved.reto)
            setEstilo(Array.isArray(saved.estilo) ? saved.estilo : [saved.estilo])
        }
        setEditando(true)
    }

    if (loading) return <div className="py-20 text-center text-zinc-400">Cargando…</div>

    if (!user && !preview) {
        return (
            <Gate
                titulo="Tu plan de estudio te espera"
                texto="Inicia sesión con la cuenta con la que compraste tu acceso para crear tu plan personalizado."
                cta="Iniciar sesión"
                href="/login?redirect=/mi-plan"
            />
        )
    }
    if (!isPremium && !preview) {
        return (
            <Gate
                titulo="El plan de estudio personalizado es un extra del acceso completo"
                texto="Responde unas preguntas y te montamos un plan a medida hasta tu examen: cómo organizarte por fases, tu técnica de estudio y tus hitos. Incluido con el Método Gainditu."
                cta="Conseguir mi acceso →"
                href="/payment"
            />
        )
    }

    // Plan generado
    if (saved && plan && !editando) {
        const diagText = iaActivo ? typedDiag : plan.diagnostico
        const typing = iaActivo && !pensando && typedDiag.length < plan.diagnostico.length
        const mostrarResto = iaActivo ? revelado : true
        return (
            <div className="flex flex-col gap-8">
                {/* Diagnóstico */}
                <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}0d` }}>
                    <div className="text-[12px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>Tu plan de un vistazo</div>
                    {iaActivo && pensando ? (
                        <div className="mt-2 flex items-center gap-2 text-[14px] text-zinc-500 dark:text-zinc-400">
                            <span>Analizando tus respuestas y montando tu plan</span>
                            <span className="flex gap-1">
                                <span className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: ACCENT, animationDelay: "0ms" }} />
                                <span className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: ACCENT, animationDelay: "150ms" }} />
                                <span className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: ACCENT, animationDelay: "300ms" }} />
                            </span>
                        </div>
                    ) : (
                        <p className="mt-1.5 text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                            {diagText}
                            {typing && <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse align-middle" style={{ background: ACCENT }} />}
                        </p>
                    )}
                </div>

                {mostrarResto && (
                  <>
                {/* Perfil de estudio */}
                <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: `${ACCENT}55` }}>
                    <div className="text-[12px] font-bold uppercase tracking-wide" style={{ color: ACCENT }}>Tu perfil de estudio</div>
                    <div className="mt-1 text-[19px] font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">{plan.perfil.nombre}</div>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300">{plan.perfil.texto}</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12.5px] font-bold" style={{ background: `${ACCENT}18`, color: ACCENT }}>
                        Probabilidad de éxito si mantienes el ritmo: {plan.perfil.prob}
                    </div>
                </div>

                {/* Tu principal riesgo */}
                <div className="rounded-2xl border border-amber-300/60 bg-amber-50/70 p-5 dark:border-amber-500/30 dark:bg-amber-500/5 sm:p-6">
                    <div className="text-[12px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-500">Tu principal riesgo</div>
                    <div className="mt-1 text-[16px] font-bold text-zinc-950 dark:text-zinc-50">⚠️ {plan.riesgo.titulo}</div>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-zinc-700 dark:text-zinc-300">{plan.riesgo.texto}</p>
                    <div className="mt-3 text-[12px] font-bold uppercase tracking-wide text-zinc-500">Para evitarlo</div>
                    <ul className="mt-1.5 flex flex-col gap-1.5">
                        {plan.riesgo.tips.map((t) => (
                            <li key={t} className="flex items-start gap-2 text-[13.5px] text-zinc-700 dark:text-zinc-300">
                                <span className="mt-0.5 shrink-0 font-bold" style={{ color: ACCENT }}>·</span>
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Fases (línea de tiempo) */}
                <Seccion titulo="Cómo organizarte, fase a fase">
                    <div className="flex flex-col gap-4">
                        {plan.fases.map((f) => (
                            <div key={f.n} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-white" style={{ background: ACCENT }}>{f.n}</div>
                                    {f.n < 3 && <div className="mt-1 w-px flex-1" style={{ background: `${ACCENT}40` }} />}
                                </div>
                                <div className="flex-1 pb-2">
                                    <div className="text-[16px] font-bold text-zinc-950 dark:text-zinc-50">{f.nombre}</div>
                                    <p className="mt-0.5 text-[13.5px] text-zinc-500 dark:text-zinc-400">{f.foco}</p>
                                    <div className="mt-2.5 flex flex-col gap-2">
                                        {f.bloques.map((b, i) => (
                                            <div key={i} className="flex items-baseline gap-3">
                                                <span
                                                    className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold"
                                                    style={{ background: `${ACCENT}18`, color: ACCENT }}
                                                >
                                                    {b.semanas}
                                                </span>
                                                <span className="text-[13.5px] text-zinc-700 dark:text-zinc-300">{b.foco}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Seccion>

                {/* Tu semana ideal */}
                <Seccion titulo="Tu semana ideal">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {plan.semana.map((d) => (
                            <div
                                key={d.dia}
                                className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5"
                                style={{ borderWidth: 1, borderStyle: "solid", borderColor: d.horas ? "rgba(120,120,130,0.2)" : "rgba(120,120,130,0.12)", background: d.horas ? "transparent" : "rgba(120,120,130,0.05)" }}
                            >
                                <div>
                                    <div className="text-[13.5px] font-bold text-zinc-950 dark:text-zinc-50">{d.dia}</div>
                                    <div className="text-[12.5px] text-zinc-500 dark:text-zinc-400">{d.horas ? d.act : "Descanso"}</div>
                                </div>
                                <span className="shrink-0 rounded-md px-2 py-0.5 text-[12px] font-bold" style={d.horas ? { background: `${ACCENT}18`, color: ACCENT } : { background: "rgba(120,120,130,0.12)", color: "#71717a" }}>
                                    {fmtH(d.horas)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-2 text-[12px] text-zinc-400">Reparto orientativo de tus {horas} h semanales. Muévelo a los días que mejor te vengan; lo importante es cumplir el total y no saltarte los test.</p>
                </Seccion>

                {/* Técnica */}
                <Seccion titulo={plan.tecnicas.length > 1 ? "Tus técnicas de estudio" : "Tu técnica de estudio"}>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900">
                        {plan.tecnicas.map((t, i) => (
                            <div key={t.nombre} className={i > 0 ? "mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800" : ""}>
                                <div className="text-[15px] font-bold text-zinc-950 dark:text-zinc-50">{t.nombre}</div>
                                <p className="mt-1 text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-300">{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </Seccion>

                {/* Práctica según el tipo de examen */}
                <Seccion titulo="La práctica según tu examen">
                    <Tarjeta titulo={plan.tipo.label} texto={plan.practica} />
                </Seccion>

                {/* Reto / punto a reforzar */}
                <Seccion titulo="Tu punto a reforzar">
                    <Tarjeta titulo={plan.reto.titulo} texto={plan.reto.desc} />
                </Seccion>

                {/* Simulacros */}
                <Seccion titulo="Los simulacros">
                    <p className="text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300">{plan.simulacros}</p>
                </Seccion>

                {/* Si te retrasas */}
                <Seccion titulo="Si te retrasas">
                    <p className="text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300">{RETRASO_TXT}</p>
                </Seccion>

                {/* Errores que evitar */}
                <Seccion titulo="Errores que evitar">
                    <div className="flex flex-col gap-2">
                        {ERRORES.map(([t, d]) => (
                            <div key={t} className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="text-[13.5px] font-bold text-zinc-950 dark:text-zinc-50">{t}</div>
                                <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{d}</p>
                            </div>
                        ))}
                    </div>
                </Seccion>

                {/* Hitos */}
                <Seccion titulo="Tus hitos">
                    <div className="flex flex-col gap-2">
                        {plan.hitos.map((h) => (
                            <div key={h.semana} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[13.5px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                                <span className="flex h-7 w-16 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ background: ACCENT }}>Sem {h.semana}</span>
                                {h.texto}
                            </div>
                        ))}
                    </div>
                </Seccion>

                <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                    <button onClick={rehacer} className="rounded-full border border-zinc-200 px-6 py-3 text-[14px] font-semibold text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                        Rehacer el plan
                    </button>
                    <button onClick={() => descargarPlan(plan)} className="rounded-full border border-zinc-200 px-6 py-3 text-[14px] font-semibold text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                        Descargar el plan
                    </button>
                    <Link href="/perfil?tab=examenes" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold text-white" style={{ background: ACCENT }}>
                        Empezar a practicar →
                    </Link>
                </div>
                <p className="text-[12px] text-zinc-400">Plan orientativo generado con tus respuestas. Ajústalo a tu ritmo y a las condiciones de tu convocatoria.</p>
                  </>
                )}
            </div>
        )
    }

    // Cuestionario
    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
            <Campo label="¿Qué preparas?">
                <Chips opciones={TIPOS.map((t) => ({ id: t.id, label: t.label }))} valor={tipo} onPick={(v) => setTipo(v as string)} />
            </Campo>
            <Campo label="¿Cuánto tiempo tienes hasta el examen?">
                <Chips opciones={MESES.map((m) => ({ id: m, label: `${m} meses` }))} valor={meses} onPick={(v) => setMeses(v as number)} />
            </Campo>
            <Campo label="¿Cuántas horas puedes estudiar a la semana?">
                <Chips opciones={HORAS.map((h) => ({ id: h, label: h === 20 ? "20+ h" : `${h} h` }))} valor={horas} onPick={(v) => setHoras(v as number)} />
            </Campo>
            <Campo label="¿Cómo de extenso es tu temario?">
                <Chips opciones={EXTENSIONES.map((e) => ({ id: e.id, label: e.label }))} valor={extension} onPick={(v) => setExtension(v as string)} />
            </Campo>
            <Campo label="¿De dónde partes?">
                <Chips opciones={NIVELES.map((n) => ({ id: n.id, label: n.label }))} valor={nivel} onPick={(v) => setNivel(v as string)} />
            </Campo>
            <Campo label="¿Te has presentado ya a algún examen oficial?">
                <Chips opciones={EXPERIENCIAS.map((e) => ({ id: e.id, label: e.label }))} valor={experiencia} onPick={(v) => setExperiencia(v as string)} />
            </Campo>
            <Campo label="¿Cuál es tu objetivo?">
                <Chips opciones={OBJETIVOS.map((o) => ({ id: o.id, label: o.label }))} valor={objetivo} onPick={(v) => setObjetivo(v as string)} />
            </Campo>
            <Campo label="¿Qué es lo que más te cuesta?">
                <Chips opciones={RETOS.map((x) => ({ id: x.id, label: x.label }))} valor={reto} onPick={(v) => setReto(v as string)} />
            </Campo>
            <Campo label="¿Cómo estudias mejor? (puedes elegir una o dos)">
                <div className="flex flex-wrap gap-2">
                    {ESTILOS.map((o) => {
                        const activo = estilo.includes(o.id)
                        return (
                            <button
                                key={o.id}
                                type="button"
                                onClick={() => toggleEstilo(o.id)}
                                className="rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors"
                                style={
                                    activo
                                        ? { background: ACCENT, borderColor: ACCENT, color: "#fff" }
                                        : { borderColor: "rgba(120,120,130,0.3)", color: "inherit" }
                                }
                            >
                                {o.label}
                            </button>
                        )
                    })}
                </div>
            </Campo>
            <button
                onClick={generar}
                disabled={guardando}
                className="mt-2 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
                style={{ background: ACCENT }}
            >
                {guardando ? "Generando tu plan…" : "Generar mi plan de estudio →"}
            </button>
        </div>
    )
}

function Gate({ titulo, texto, cta, href }: { titulo: string; texto: string; cta: string; href: string }) {
    return (
        <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50">{titulo}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">{texto}</p>
            <Link href={href} className="mt-5 inline-flex items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold text-white" style={{ background: ACCENT }}>
                {cta}
            </Link>
        </div>
    )
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">{titulo}</h2>
            {children}
        </div>
    )
}

function Tarjeta({ titulo, texto }: { titulo: string; texto: string }) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-[15px] font-bold text-zinc-950 dark:text-zinc-50">{titulo}</div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-300">{texto}</p>
        </div>
    )
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="mb-2 text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">{label}</div>
            {children}
        </div>
    )
}

function Chips({
    opciones,
    valor,
    onPick,
}: {
    opciones: { id: string | number; label: string }[]
    valor: string | number
    onPick: (v: string | number) => void
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {opciones.map((o) => {
                const activo = valor === o.id
                return (
                    <button
                        key={o.id}
                        type="button"
                        onClick={() => onPick(o.id)}
                        className="rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors"
                        style={
                            activo
                                ? { background: ACCENT, borderColor: ACCENT, color: "#fff" }
                                : { borderColor: "rgba(120,120,130,0.3)", color: "inherit" }
                        }
                    >
                        {o.label}
                    </button>
                )
            })}
        </div>
    )
}
