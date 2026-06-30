import Link from "next/link"
import { BRAND_ACCENT } from "@/lib/theme"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-white px-5 py-12 text-zinc-950">
            <Link
                href="/"
                className="mb-8 text-sm text-zinc-500 transition-colors hover:text-zinc-950"
            >
                ← Volver a{" "}
                <span className="font-semibold text-zinc-950">
                    gain<span style={{ color: BRAND_ACCENT }}>ditu</span>.
                </span>
            </Link>
            {children}
        </main>
    )
}
