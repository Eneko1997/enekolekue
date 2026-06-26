// Contenedor de estilo para páginas legales.
export default function LegalShell({
    title,
    updated,
    children,
}: {
    title: string
    updated: string
    children: React.ReactNode
}) {
    return (
        <main className="mx-auto max-w-3xl px-5 py-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                {title}
            </h1>
            <p className="mt-2 text-xs text-white/40">
                Última actualización: {updated}
            </p>
            <div className="legal-prose mt-8 space-y-5 text-sm leading-relaxed text-white/65 [&_a]:font-semibold [&_a]:text-white [&_a:hover]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_strong]:text-white/85 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                {children}
            </div>
        </main>
    )
}
