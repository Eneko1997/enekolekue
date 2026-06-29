"use client"

import { useRef, useState } from "react"

// Envoltura con reacción magnética: el contenido se inclina/desplaza hacia el
// cursor cuando se acerca, y vuelve suavemente a su sitio al salir.
// La posición/flotación va en el contenedor externo (className/style); aquí
// solo aplicamos el transform magnético a una capa interior para no pisar la
// animación de flotación.
export default function MagneticIcon({
    children,
    className = "",
    style,
    strength = 0.4,
}: {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    strength?: number
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [t, setT] = useState({ x: 0, y: 0, r: 0 })

    function onMove(e: React.MouseEvent) {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        setT({ x: dx * strength, y: dy * strength, r: Math.max(-12, Math.min(12, dx * 0.12)) })
    }
    function reset() {
        setT({ x: 0, y: 0, r: 0 })
    }

    return (
        <div
            ref={ref}
            className={className}
            style={{ ...style, padding: 22, margin: -22 }}
            onMouseMove={onMove}
            onMouseLeave={reset}
            aria-hidden
        >
            <div
                style={{
                    transform: `translate(${t.x}px, ${t.y}px) rotate(${t.r}deg)`,
                    transition:
                        t.x === 0 && t.y === 0
                            ? "transform 0.5s cubic-bezier(0.22,1,0.36,1)"
                            : "transform 0.12s ease-out",
                    willChange: "transform",
                }}
            >
                {children}
            </div>
        </div>
    )
}
