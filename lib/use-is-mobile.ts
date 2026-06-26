"use client"

import { useEffect, useState, type RefObject } from "react"

/**
 * Detecta viewport móvil midiendo el ancho de un contenedor (o window si no se
 * pasa ref). Portado de los componentes Framer. Breakpoint: < 640px.
 */
export function useIsMobile(containerRef?: RefObject<HTMLElement | null>) {
    const [isMobile, setIsMobile] = useState(true)

    useEffect(() => {
        const measure = (w: number) => setIsMobile(w < 640)

        const el = containerRef?.current
        if (!el) {
            const onResize = () => measure(window.innerWidth)
            measure(window.innerWidth)
            window.addEventListener("resize", onResize)
            return () => window.removeEventListener("resize", onResize)
        }

        measure(el.getBoundingClientRect().width)
        if (typeof ResizeObserver === "undefined") {
            const fn = () => measure(el.getBoundingClientRect().width)
            window.addEventListener("resize", fn)
            return () => window.removeEventListener("resize", fn)
        }
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) measure(entry.contentRect.width)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [containerRef])

    return isMobile
}
