import type { Metadata } from "next"
import LegalShell from "@/components/site/LegalShell"
import { CONTACT_EMAIL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Política de cookies",
    description: "Información sobre el uso de cookies en Gainditu.",
    robots: { index: true, follow: true },
}

export default function CookiesPage() {
    return (
        <LegalShell title="Política de cookies" updated="junio de 2026">
            <p>
                <strong>[PENDIENTE DE COMPLETAR]</strong> Plantilla base; ajusta
                el listado según las cookies reales que utilices.
            </p>

            <h2>1. ¿Qué son las cookies?</h2>
            <p>
                Las cookies son pequeños archivos que se almacenan en tu
                dispositivo al navegar. Permiten recordar información, como tu
                sesión iniciada.
            </p>

            <h2>2. Cookies que utilizamos</h2>
            <ul>
                <li>
                    <strong>Técnicas / necesarias:</strong> mantener tu sesión
                    iniciada (autenticación de Supabase). Son imprescindibles
                    para el funcionamiento del servicio.
                </li>
                <li>
                    <strong>De pago:</strong> Stripe puede usar cookies durante
                    el proceso de pago para prevención de fraude.
                </li>
            </ul>
            <p>
                Actualmente no utilizamos cookies publicitarias ni de
                seguimiento de terceros con fines de marketing.
            </p>

            <h2>3. Gestión de cookies</h2>
            <p>
                Puedes configurar o eliminar las cookies desde los ajustes de tu
                navegador. Ten en cuenta que desactivar las cookies técnicas
                puede impedir iniciar sesión.
            </p>

            <h2>4. Contacto</h2>
            <p>
                Para cualquier duda sobre esta política, escríbenos a{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
        </LegalShell>
    )
}
