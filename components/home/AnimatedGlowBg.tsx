/**
 * Fondo oscuro con glows verde/teal a la deriva (CSS puro, sin librerías).
 * Reutilizable: se pone dentro de cualquier contenedor `relative overflow-hidden`
 * y llena el fondo (inset-0). El contenido debe ir con `relative z-10` por encima.
 * Respeta `prefers-reduced-motion`. Usado en la banda de valor, el CTA final y el footer
 * para marcar el cierre de la home con la misma identidad.
 */
export default function AnimatedGlowBg() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
@keyframes gbandDrift1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,-40px) scale(1.18)}}
@keyframes gbandDrift2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-50px,30px) scale(1.12)}}
@keyframes gbandDrift3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,40px) scale(1.22)}}
.gband-b1{animation:gbandDrift1 18s ease-in-out infinite}
.gband-b2{animation:gbandDrift2 22s ease-in-out infinite}
.gband-b3{animation:gbandDrift3 26s ease-in-out infinite}
@media (prefers-reduced-motion: reduce){.gband-b1,.gband-b2,.gband-b3{animation:none}}`,
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,#101a16_0%,#0B0C10_60%)]" />
            <div className="gband-b1 absolute -left-[10%] top-[-20%] h-[460px] w-[460px] rounded-full bg-emerald-500/20 blur-[120px]" />
            <div className="gband-b2 absolute right-[-8%] top-[10%] h-[420px] w-[420px] rounded-full bg-teal-400/15 blur-[120px]" />
            <div className="gband-b3 absolute bottom-[-25%] left-[35%] h-[400px] w-[400px] rounded-full bg-emerald-400/12 blur-[120px]" />
        </div>
    )
}
