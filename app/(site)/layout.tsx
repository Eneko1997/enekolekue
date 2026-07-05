import LightNavbar from "@/components/site/LightNavbar"
import SiteFooter from "@/components/site/SiteFooter"

// Layout de las páginas públicas / de contenido (ley, constitución, fechas,
// oposiciones, legales) — tema claro. Las páginas de la app (dashboard, test,
// perfil, payment) usan su propio navbar embebido (tema oscuro).
export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-dvh flex-col bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50">
            <LightNavbar />
            <div className="flex-1">{children}</div>
            <SiteFooter />
        </div>
    )
}
