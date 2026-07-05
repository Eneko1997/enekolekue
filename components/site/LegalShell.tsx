// Contenedor de estilo para páginas legales (tema claro).
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
        <main className="mx-auto max-w-3xl px-5 py-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                {title}
            </h1>
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                Última actualización: {updated}
            </p>
            <div className="legal-prose mt-8 space-y-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 [&_a]:font-semibold [&_a]:text-zinc-950 dark:[&_a]:text-zinc-50 [&_a:hover]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-zinc-950 dark:[&_h2]:text-zinc-50 [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-100 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                {children}
            </div>
        </main>
    )
}
