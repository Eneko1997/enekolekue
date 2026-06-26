import { readdirSync, statSync, readFileSync } from "node:fs"
import { join, extname } from "node:path"

const exts = new Set([".tsx", ".ts", ".css"])
const emojiRe =
    /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2705}\u{2714}\u{2728}\u{26A1}\u{2666}\u{2756}\u{2190}-\u{21FF}\u{2300}-\u{23FF}]/u

function walk(d) {
    for (const f of readdirSync(d)) {
        if ([".next", "node_modules", ".git"].includes(f)) continue
        const p = join(d, f)
        const s = statSync(p)
        if (s.isDirectory()) walk(p)
        else if (exts.has(extname(p))) {
            readFileSync(p, "utf8")
                .split("\n")
                .forEach((l, i) => {
                    const m = l.match(new RegExp(emojiRe, "gu"))
                    if (m) {
                        const uniq = [...new Set(m)].join(" ")
                        console.log(
                            `${p.replace(/\\/g, "/")}:${i + 1}  [${uniq}]  ${l.trim().slice(0, 64)}`
                        )
                    }
                })
        }
    }
}
walk("app")
walk("components")
