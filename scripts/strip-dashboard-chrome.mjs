import { readFileSync, writeFileSync } from "node:fs"

const FILE = "components/dashboard/DashboardClient.tsx"
const lines = readFileSync(FILE, "utf8").split("\n")

const navStart = lines.findIndex((l) => l.includes("── NAVBAR ──"))
let navEnd = -1
for (let i = navStart; i < lines.length; i++) {
    if (lines[i].trim() === "</nav>") {
        navEnd = i
        break
    }
}
const footerIdx = lines.findIndex((l) => l.includes("{/* FOOTER */}"))
// La línea siguiente es <Footer ... />
const footerEnd = footerIdx + 1

if (navStart < 0 || navEnd < 0 || footerIdx < 0) {
    console.error("Marcadores no encontrados", { navStart, navEnd, footerIdx })
    process.exit(1)
}
if (!lines[footerEnd].includes("<Footer")) {
    console.error("La línea tras {/* FOOTER */} no es <Footer:", lines[footerEnd])
    process.exit(1)
}

const remove = new Set()
for (let i = navStart; i <= navEnd; i++) remove.add(i)
remove.add(footerIdx)
remove.add(footerEnd)

const out = lines.filter((_, i) => !remove.has(i)).join("\n")
writeFileSync(FILE, out, "utf8")
console.log(
    `Quitado navbar (${navStart + 1}-${navEnd + 1}) y footer (${footerIdx + 1}-${footerEnd + 1}). Nuevas líneas: ${out.split("\n").length}`
)
