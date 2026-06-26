import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

const SRC = "../PROFILE.txt"
const OUT = "components/profile/ProfileClient.tsx"

const lines = readFileSync(SRC, "utf8").split("\n")
const idxOf = (pred) => lines.findIndex(pred)

const framerIdx = idxOf((l) => l.includes('from "framer"'))
const helperStart = idxOf((l) => l.startsWith("const SUPABASE_URL"))
const bodyStart = idxOf((l) => l.includes("Color de acento del header"))
const addPropIdx = idxOf((l) => l.startsWith("addPropertyControls("))

if ([framerIdx, helperStart, bodyStart, addPropIdx].some((i) => i < 0)) {
    console.error("Marcadores no encontrados", { framerIdx, helperStart, bodyStart, addPropIdx })
    process.exit(1)
}

const headerImports = lines
    .slice(0, framerIdx)
    .concat(lines.slice(framerIdx + 1, helperStart))

const newHelpers = `const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
            Authorization: \`Bearer \${token}\`,
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
                    Authorization: \`Bearer \${refreshed.token}\`,
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
`

const body = lines.slice(bodyStart, addPropIdx)

const out = [
    '"use client"',
    "",
    ...headerImports,
    'import { createClient } from "@/lib/supabase/client"',
    "",
    newHelpers,
    ...body,
].join("\n")

mkdirSync("components/profile", { recursive: true })
writeFileSync(OUT, out, "utf8")
console.log(`OK → ${OUT} (${out.split("\n").length} líneas)`)
