// Fondo "cuaderno suave": rejilla fina + degradado esmeralda abajo. Se coloca dentro
// de una sección `relative overflow-hidden`; el contenido debe ir en `relative z-10`.
export default function NotebookBg({ fade = false }: { fade?: boolean }) {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 text-zinc-900 opacity-[0.05] dark:text-zinc-100 dark:opacity-[0.06] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:44px_44px]" />
            {fade && (
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-emerald-50/70 to-transparent dark:from-emerald-950/25" />
            )}
        </div>
    )
}
