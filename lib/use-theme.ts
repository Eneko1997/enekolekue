"use client"

import { useCallback, useEffect, useState } from "react"

// Fuente de verdad única del tema: la clase `.dark` en <html> + localStorage.
// Todos los componentes que llamen a useTheme se sincronizan vía el evento
// "themechange" que dispara toggle().
function readDark(): boolean {
    if (typeof document === "undefined") return false
    return document.documentElement.classList.contains("dark")
}

export function useTheme() {
    const [dark, setDark] = useState(false)

    useEffect(() => {
        setDark(readDark())
        const handler = () => setDark(readDark())
        window.addEventListener("themechange", handler)
        return () => window.removeEventListener("themechange", handler)
    }, [])

    const toggle = useCallback(() => {
        const next = !document.documentElement.classList.contains("dark")
        document.documentElement.classList.toggle("dark", next)
        try {
            localStorage.setItem("theme", next ? "dark" : "light")
        } catch {
            /* ignore */
        }
        window.dispatchEvent(new Event("themechange"))
    }, [])

    return { dark, toggle }
}
