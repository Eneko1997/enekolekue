import { SITE_URL, SITE_NAME } from "@/lib/site"
import { convocatoriasOrdenadas, ESTADOS } from "@/lib/data/convocatorias"
import { NORMATIVAS } from "@/lib/data/temario/normativas"
import { HERRAMIENTAS } from "@/lib/data/herramientas"

// llms.txt: índice en texto plano pensado para modelos de IA (estándar
// emergente). Se genera de las mismas fuentes que el resto de la web, así que
// se mantiene solo. No lo ve el usuario; lo consumen (si acaso) los crawlers.
export const dynamic = "force-static"

const ESCALAS: [string, string][] = [
    ["Personal de Apoyo (grupo E)", "/oposiciones/personal-de-apoyo"],
    ["Administrativo (subgrupo C1)", "/oposiciones/administrativo"],
    ["Técnico de Gestión (grupo B)", "/oposiciones/tecnico-gestion"],
    ["Técnico Superior (grupo A)", "/oposiciones/tecnico-superior"],
]

export function GET() {
    const abs = (p: string) => `${SITE_URL}${p}`
    const L: string[] = []

    L.push(`# ${SITE_NAME} — Oposiciones de Euskadi`)
    L.push("")
    L.push(
        "> El portal de las oposiciones de Euskadi: tests por temario oficial, convocatorias con fechas y plazas, temario y herramientas. Cubre Gobierno Vasco, Osakidetza, Ertzaintza, Educación, Diputaciones Forales, Ayuntamientos, Policía Local y Bomberos."
    )
    L.push("")
    L.push(
        "Gainditu ofrece tests tipo examen organizados por el temario oficial de cada convocatoria, con explicación de por qué cada opción es correcta o falla, simulacros con penalización real y seguimiento del progreso. Los datos de convocatorias se contrastan con fuentes oficiales (BOPV, euskadi.eus, IVAP y boletines forales BOB, BOG y BOTHA)."
    )
    L.push("")

    L.push("## Tests por escala (OPE del Gobierno Vasco)")
    for (const [label, path] of ESCALAS) L.push(`- [${label}](${abs(path)})`)
    L.push("")

    L.push("## Convocatorias de oposiciones de Euskadi")
    for (const c of convocatoriasOrdenadas()) {
        const estado = ESTADOS[c.estado].label
        const plazas = c.plazas != null ? `${c.plazas} plazas` : "plazas por confirmar"
        L.push(`- [${c.nombre}](${abs(`/convocatorias/${c.slug}`)}): ${estado}; ${plazas}.`)
    }
    L.push("")

    L.push("## Temario")
    L.push(`- [La Constitución Española](${abs("/constitucion")}): bloque común, derechos y organización del Estado.`)
    L.push(`- [Ley 39/2015 — Procedimiento Administrativo Común](${abs("/ley-39-2015")})`)
    for (const n of NORMATIVAS) L.push(`- [${n.titulo}](${abs(`/temario/${n.slug}`)}): ${n.ley}`)
    L.push("")

    L.push("## Herramientas")
    for (const h of HERRAMIENTAS) L.push(`- [${h.titulo}](${abs(`/herramientas/${h.slug}`)}): ${h.subtitulo}`)
    L.push("")

    L.push("## Otras páginas")
    L.push(`- [Inicio](${abs("/")})`)
    L.push(`- [Todas las convocatorias](${abs("/convocatorias")})`)
    L.push(`- [Herramientas](${abs("/herramientas")})`)
    L.push(`- [Profesores particulares](${abs("/profesores")})`)
    L.push("")

    return new Response(L.join("\n"), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    })
}
