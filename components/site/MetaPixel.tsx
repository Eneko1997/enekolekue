"use client"

// Píxel de Meta (Facebook/Instagram) para medición de anuncios. Se carga para
// todas las visitas (decisión de negocio del propietario). El evento de compra
// se dispara en PaymentSuccessClient. La política de cookies (/cookies) refleja
// este uso.

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "941873635655408"

export default function MetaPixel() {
    const pathname = usePathname()
    const first = useRef(true)

    // El snippet base ya dispara el primer PageView; en las navegaciones SPA
    // posteriores lo lanzamos a mano.
    useEffect(() => {
        if (first.current) {
            first.current = false
            return
        }
        const w = window as unknown as { fbq?: (...args: unknown[]) => void }
        if (typeof w.fbq === "function") w.fbq("track", "PageView")
    }, [pathname])

    if (!PIXEL_ID) return null

    return (
        <>
            <Script
                id="meta-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`,
                }}
            />
            <noscript>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    alt=""
                    src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
                />
            </noscript>
        </>
    )
}
