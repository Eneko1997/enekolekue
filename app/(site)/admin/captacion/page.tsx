import type { Metadata } from "next"
import CaptacionDashboard from "@/components/admin/CaptacionDashboard"

// Panel interno de captación (solo equipo). El RPC metricas_captacion valida el
// email del solicitante (SECURITY DEFINER); esta página no se indexa.
export const metadata: Metadata = {
    title: "Captación",
    robots: { index: false, follow: false },
}

export default function Page() {
    return (
        <main className="flex flex-1 flex-col px-5 py-12">
            <div className="mx-auto w-full max-w-5xl">
                <CaptacionDashboard />
            </div>
        </main>
    )
}
