import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

const SRC = "../TEST.txt"
const OUT = "components/test/TestClient.tsx"

const lines = readFileSync(SRC, "utf8").split("\n")
const idxOf = (pred) => lines.findIndex(pred)

const framerIdx = idxOf((l) => l.includes('from "framer"'))
const helperStart = idxOf((l) => l.startsWith("const SUPABASE_URL"))
const endIdx = idxOf((l) => l.includes("MAPA DE TÍTULOS"))
const addPropIdx = idxOf((l) => l.startsWith("addPropertyControls("))

if ([framerIdx, helperStart, endIdx, addPropIdx].some((i) => i < 0)) {
    console.error("Marcadores no encontrados", { framerIdx, helperStart, endIdx, addPropIdx })
    process.exit(1)
}

// "MAPA DE TÍTULOS" va precedido de una línea de comentario de separación; retrocede
// hasta incluir ese bloque de comentario en el cuerpo.
let bodyStart = endIdx
while (bodyStart > 0 && lines[bodyStart - 1].trim().startsWith("//")) bodyStart--

const headerImports = lines
    .slice(0, framerIdx)
    .concat(lines.slice(framerIdx + 1, helperStart))

const newHelpers = `const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
function getUrlParam(name: string): string | null {
    try {
        return new URLSearchParams(window.location.search).get(name)
    } catch {
        return null
    }
}
`

const body = lines.slice(bodyStart, addPropIdx)

const out = [
    '"use client"',
    "",
    ...headerImports,
    'import { createClient } from "@/lib/supabase/client"',
    'import { translateAuthError } from "@/lib/auth-errors"',
    "",
    newHelpers,
    ...body,
].join("\n")

mkdirSync("components/test", { recursive: true })
writeFileSync(OUT, out, "utf8")
console.log(`OK → ${OUT} (${out.split("\n").length} líneas)`)
