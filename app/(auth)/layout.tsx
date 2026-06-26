import Link from "next/link"
import { BRAND_ACCENT } from "@/lib/theme"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex flex-1 flex-col items-center justify-center px-5 py-12">
            <Link
                href="/"
                className="mb-8 text-sm text-white/50 transition-colors hover:text-white"
            >
                ← Volver a{" "}
                <span className="font-semibold text-white">
                    gain<span style={{ color: BRAND_ACCENT }}>ditu</span>.
                </span>
            </Link>
            {children}
        </main>
    )
}
