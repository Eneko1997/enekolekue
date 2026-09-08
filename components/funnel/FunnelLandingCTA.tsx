"use client"

import { useEffect } from "react"
import { logFunnelEvent } from "@/lib/funnel"

export default function FunnelLandingCTA({
    accent,
    testId = "free_sim_adm",
}: {
    accent: string
    testId?: string
}) {
    useEffect(() => {
        void logFunnelEvent("landing_view", { test_id: testId })
    }, [testId])

    const startHref = `/test?id=${testId}&funnel=1&nuevo=1`

    return (
        <div className="flex flex-col items-center gap-3">
            <a
                href={startHref}
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: accent, boxShadow: "0 10px 25px -5px rgba(16,185,129,0.4)" }}
            >
                Empezar el simulacro →
            </a>
            <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Sin registro para empezar · gratis
            </span>
        </div>
    )
}
