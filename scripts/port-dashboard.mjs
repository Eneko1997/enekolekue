import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

const SRC = "../DASHBOARD.txt"
const OUT = "components/dashboard/DashboardClient.tsx"

const raw = readFileSync(SRC, "utf8")
const lines = raw.split("\n")

const idxOf = (pred) => lines.findIndex(pred)

const framerIdx = idxOf((l) => l.includes('from "framer"'))
const helperStart = idxOf((l) => l.startsWith("const SUPABASE_URL"))
const typesIdx = idxOf((l) => l.includes("─── TIPOS"))
const addPropIdx = idxOf((l) => l.startsWith("addPropertyControls("))

if (framerIdx < 0 || helperStart < 0 || typesIdx < 0 || addPropIdx < 0) {
    console.error("Marcadores no encontrados", { framerIdx, helperStart, typesIdx, addPropIdx })
    process.exit(1)
}

// Cabecera: imports (sin framer) + nuestros imports
const headerImports = lines
    .slice(0, framerIdx)
    .concat(lines.slice(framerIdx + 1, helperStart))

const newHelpers = `const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
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
            redirectTo: \`\${window.location.origin}/auth/callback?next=/dashboard\`,
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
            emailRedirectTo: \`\${window.location.origin}/auth/callback?next=/dashboard\`,
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
        redirectTo: \`\${window.location.origin}/auth/callback?next=/reset-password\`,
    })
    if (error) return { ok: false, error: translateAuthError(error.message) }
    return { ok: true }
}

async function signOut(_token: string) {
    await supabase.auth.signOut()
}
`

const body = lines.slice(typesIdx, addPropIdx)

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

mkdirSync("components/dashboard", { recursive: true })
writeFileSync(OUT, out, "utf8")
console.log(`OK → ${OUT} (${out.split("\n").length} líneas)`)
