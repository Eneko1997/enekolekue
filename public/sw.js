// Service worker de Gainditu (PWA). Objetivo: instalable + offline básico.
// Estrategia conservadora para no servir HTML rancio:
//  - Navegaciones (páginas): network-first; si no hay red, se sirve /offline.html.
//  - Estáticos de Next e imágenes (mismo origen): stale-while-revalidate.
//  - Nunca se cachea nada que no sea GET del mismo origen (auth/API/Supabase intactos).
const VERSION = "gainditu-v1"
const STATIC_CACHE = `${VERSION}-static`
const OFFLINE_URL = "/offline.html"

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) =>
            cache.addAll([OFFLINE_URL, "/icon-192.png", "/icon-512.png"])
        )
    )
    self.skipWaiting()
})

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
            )
            .then(() => self.clients.claim())
    )
})

function esEstaticoCacheable(url) {
    if (url.origin !== self.location.origin) return false
    return (
        url.pathname.startsWith("/_next/static/") ||
        url.pathname.startsWith("/icon") ||
        url.pathname === "/apple-touch-icon.png" ||
        /\.(?:png|jpg|jpeg|webp|avif|gif|svg|ico|woff2?|ttf)$/.test(url.pathname)
    )
}

self.addEventListener("fetch", (event) => {
    const req = event.request
    if (req.method !== "GET") return
    const url = new URL(req.url)

    // Páginas: network-first con fallback offline (solo para el propio origen).
    if (req.mode === "navigate") {
        event.respondWith(
            fetch(req).catch(() =>
                caches.match(req).then((cached) => cached || caches.match(OFFLINE_URL))
            )
        )
        return
    }

    // Estáticos: stale-while-revalidate.
    if (esEstaticoCacheable(url)) {
        event.respondWith(
            caches.open(STATIC_CACHE).then(async (cache) => {
                const cached = await cache.match(req)
                const red = fetch(req)
                    .then((res) => {
                        if (res && res.status === 200) cache.put(req, res.clone())
                        return res
                    })
                    .catch(() => cached)
                return cached || red
            })
        )
    }
})
