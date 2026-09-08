import type { Metadata } from "next"
import MiPlanClient from "@/components/plan/MiPlanClient"

export const metadata: Metadata = {
    title: "Tu plan de estudio",
    description: "Tu plan de estudio personalizado hasta el examen, incluido con el acceso completo de Gainditu.",
    robots: { index: false, follow: false },
    alternates: { canonical: "/mi-plan" },
}

export default function Page() {
    return (
        <main className="flex flex-1 flex-col">
            <section className="px-5 pb-6 pt-10">
                <div className="mx-auto max-w-3xl">
                    <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#10B981" }}>
                        Objetivo Plaza · extra exclusivo
                    </div>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                        Tu plan de estudio a medida
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-300">
                        Unas preguntas y te montamos el camino hasta tu examen.
                    </p>
                </div>
            </section>
            <section className="px-5 pb-16">
                <div className="mx-auto max-w-3xl">
                    <MiPlanClient />
                </div>
            </section>
        </main>
    )
}
