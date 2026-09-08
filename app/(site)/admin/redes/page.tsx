import type { Metadata } from "next"
import RedesSociales from "@/components/admin/RedesSociales"

// Pantalla interna de Redes Sociales (solo equipo). No se indexa.
export const metadata: Metadata = {
    title: "Redes sociales",
    robots: { index: false, follow: false },
}

export default function Page() {
    return (
        <main className="flex flex-1 flex-col px-5 py-12">
            <div className="mx-auto w-full max-w-5xl">
                <RedesSociales />
            </div>
        </main>
    )
}
