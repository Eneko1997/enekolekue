"use client"

import { useEffect, useRef, useState } from "react"

// Anima la entrada de su contenido al entrar en viewport (una sola vez).
export default function Reveal({
    children,
    className = "",
    delay = 0,
    as: Tag = "div",
}: {
    children: React.ReactNode
    className?: string
    delay?: number
    as?: "div" | "section"
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [shown, setShown] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        setShown(true)
                        io.disconnect()
                        break
                    }
                }
            },
            // Se dispara ANTES de que la sección entre del todo (margen inferior
            // positivo), para que la entrada se vea suave y no "caiga" ya visible.
            { threshold: 0, rootMargin: "0px 0px 12% 0px" }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <Tag
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`reveal ${shown ? "in" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </Tag>
    )
}
