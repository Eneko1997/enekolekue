import type { Metadata } from "next"
import FlashcardsClient from "@/components/flashcards/FlashcardsClient"

export const metadata: Metadata = {
    title: "Flashcards",
    description: "Memoriza el temario con flashcards y repetición espaciada, incluido con el acceso completo de Gainditu.",
    robots: { index: false, follow: false },
    alternates: { canonical: "/flashcards" },
}

export default function Page() {
    return (
        <main className="flex flex-1 flex-col">
            <section className="px-5 pb-6 pt-10">
                <div className="mx-auto max-w-3xl">
                    <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#10B981" }}>
                        Método Gainditu · premium
                    </div>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                        Flashcards
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-300">
                        Memoriza el temario con repetición espaciada. Cada día repasas solo lo que toca.
                    </p>
                </div>
            </section>
            <section className="px-5 pb-16">
                <div className="mx-auto max-w-3xl">
                    <FlashcardsClient />
                </div>
            </section>
        </main>
    )
}
