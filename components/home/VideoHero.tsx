"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Hero full-screen con vídeo de fondo en loop y fades JS (sin transiciones CSS):
// fade-in de 500ms al cargar/reiniciar, fade-out de 500ms cuando quedan 0,55s.
// fadingOutRef evita re-disparar el fade-out desde timeupdate repetidos; cada
// fade cancela el requestAnimationFrame anterior y arranca desde la opacidad
// actual (nunca salta).
const FADE_MS = 500
const FADE_OUT_BEFORE_END_S = 0.55
const PLAYBACK_RATE = 0.7 // cámara lenta sutil

export default function VideoHero() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const posterRef = useRef<HTMLVideoElement>(null)
    const rafRef = useRef<number | null>(null)
    const fadingOutRef = useRef(false)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        video.playbackRate = PLAYBACK_RATE

        // Capa "póster": el mismo vídeo congelado en el primer fotograma, detrás.
        // Al fundirse el principal se revela este fotograma (no la pantalla en
        // blanco) y, como el principal reinicia justo en ese fotograma, el bucle
        // se percibe continuo.
        const poster = posterRef.current
        if (poster) {
            poster.pause()
            try {
                poster.currentTime = 0.001
            } catch {
                /* aún sin metadata; el frame llega al cargar */
            }
        }

        const fadeTo = (target: number, duration = FADE_MS) => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
            const from = parseFloat(video.style.opacity || "0")
            const start = performance.now()
            const step = (now: number) => {
                const p = Math.min((now - start) / duration, 1)
                video.style.opacity = String(from + (target - from) * p)
                if (p < 1) {
                    rafRef.current = requestAnimationFrame(step)
                } else {
                    rafRef.current = null
                }
            }
            rafRef.current = requestAnimationFrame(step)
        }

        const onPlaying = () => {
            if (!fadingOutRef.current) fadeTo(1)
        }
        const onTimeUpdate = () => {
            if (fadingOutRef.current) return
            if (!video.duration) return
            if (video.duration - video.currentTime <= FADE_OUT_BEFORE_END_S) {
                fadingOutRef.current = true
                fadeTo(0)
            }
        }
        const onEnded = () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
            video.style.opacity = "0"
            setTimeout(() => {
                video.currentTime = 0
                video.playbackRate = PLAYBACK_RATE
                void video.play()
                fadingOutRef.current = false
                fadeTo(1)
            }, 100)
        }

        video.style.opacity = "0"
        video.addEventListener("playing", onPlaying)
        video.addEventListener("timeupdate", onTimeUpdate)
        video.addEventListener("ended", onEnded)
        void video.play().catch(() => {})

        // Red de seguridad: cubre tanto el autoplay bloqueado como el caso en que
        // "playing" disparó antes de registrar el listener (el vídeo quedaría
        // reproduciéndose con opacity 0).
        const fallback = window.setTimeout(() => {
            const op = parseFloat(video.style.opacity || "0")
            if (!fadingOutRef.current && op < 1) fadeTo(1)
        }, 600)

        return () => {
            window.clearTimeout(fallback)
            video.removeEventListener("playing", onPlaying)
            video.removeEventListener("timeupdate", onTimeUpdate)
            video.removeEventListener("ended", onEnded)
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    return (
        <section className="relative flex min-h-screen flex-col overflow-hidden bg-white">
            {/* Capa póster: primer fotograma congelado, detrás del vídeo principal */}
            <video
                ref={posterRef}
                className="absolute inset-0 h-full w-full translate-y-[17%] object-cover"
                src="/hero.mp4"
                muted
                playsInline
                preload="auto"
                aria-hidden
                tabIndex={-1}
            />

            {/* Vídeo principal: desplazado un 17% hacia abajo (la parte alta queda recortada) */}
            <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full translate-y-[17%] object-cover"
                src="/hero.mp4"
                muted
                playsInline
                autoPlay
                preload="auto"
                aria-hidden
            />

            {/* Scrim: claro tras el bloque de texto para garantizar legibilidad */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(60% 58% at 50% 34%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0.12) 72%, transparent 88%)",
                }}
                aria-hidden
            />

            {/* Contenido */}
            <div className="relative z-10 flex flex-1 -translate-y-[8%] flex-col items-center justify-center px-6 py-12 text-center">
                <h1
                    className="mb-6 text-[2.6rem] leading-[1.04] tracking-tight text-black sm:text-6xl lg:text-7xl"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 800 }}
                >
                    Aprueba tu plaza
                    <br />
                    en el Gobierno Vasco.
                </h1>

                <div className="w-full max-w-xl space-y-5">
                    <p className="mx-auto max-w-lg px-2 text-base font-medium leading-relaxed text-black/80 sm:text-lg">
                        La plataforma técnica para preparar tu oposición: tests por
                        el temario oficial del IVAP, simulacros reales y tu progreso
                        medido al detalle.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/signup"
                            aria-label="Crear cuenta gratis en Gainditu"
                            className="liquid-glass inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-semibold text-black shadow-sm transition-colors hover:bg-white/50"
                        >
                            Empieza gratis
                            <ArrowRight size={17} aria-hidden />
                        </Link>
                        <Link
                            href="/dashboard"
                            aria-label="Ver el catálogo de tests"
                            className="liquid-glass inline-flex items-center rounded-full px-8 py-3.5 text-[15px] font-semibold text-black shadow-sm transition-colors hover:bg-white/50"
                        >
                            Ver los tests
                        </Link>
                    </div>

                    <p className="px-4 text-[13px] font-medium text-black/70">
                        Gratis para empezar · Sin tarjeta · Temario oficial IVAP
                    </p>
                </div>
            </div>
        </section>
    )
}
