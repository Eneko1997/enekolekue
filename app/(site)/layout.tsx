import Navbar from "@/components/site/Navbar"
import Footer from "@/components/site/Footer"

// Layout de las páginas públicas / de contenido (landing, ley, constitución,
// fechas, legales). Las páginas de la app (dashboard, test, perfil, payment)
// usan su propio navbar embebido.
export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
        </>
    )
}
