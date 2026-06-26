import type { Metadata } from "next"
import LegalShell from "@/components/site/LegalShell"
import { CONTACT_EMAIL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Política de privacidad",
    description: "Política de privacidad y tratamiento de datos de Gainditu.",
    robots: { index: true, follow: true },
}

export default function PrivacidadPage() {
    return (
        <LegalShell title="Política de privacidad" updated="junio de 2026">
            <p>
                <strong>[PENDIENTE DE COMPLETAR]</strong> Plantilla base conforme
                al RGPD y la LOPDGDD; revisa y completa los datos del responsable
                antes de publicar.
            </p>

            <h2>1. Responsable del tratamiento</h2>
            <p>
                [NOMBRE / RAZÓN SOCIAL], NIF [NIF], domicilio [DIRECCIÓN]. Contacto:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>2. Datos que tratamos</h2>
            <ul>
                <li>
                    <strong>Cuenta:</strong> nombre, email y, si usas Google,
                    los datos básicos de tu perfil de Google.
                </li>
                <li>
                    <strong>Actividad:</strong> resultados y progreso de tus
                    tests para mostrarte estadísticas.
                </li>
                <li>
                    <strong>Pago:</strong> el cobro lo gestiona Stripe; nosotros
                    no almacenamos los datos de tu tarjeta.
                </li>
            </ul>

            <h2>3. Finalidad y base jurídica</h2>
            <p>
                Tratamos tus datos para prestarte el servicio (ejecución del
                contrato), gestionar tu cuenta y, en su caso, cumplir
                obligaciones legales. No vendemos tus datos a terceros.
            </p>

            <h2>4. Encargados y proveedores</h2>
            <p>
                Utilizamos <strong>Supabase</strong> (autenticación y base de
                datos), <strong>Stripe</strong> (pagos) y <strong>Vercel</strong>{" "}
                (alojamiento). Estos proveedores tratan datos por cuenta de
                Gainditu conforme a sus propias garantías.
            </p>

            <h2>5. Conservación</h2>
            <p>
                Conservamos tus datos mientras mantengas tu cuenta y durante los
                plazos legales aplicables tras su baja.
            </p>

            <h2>6. Tus derechos</h2>
            <p>
                Puedes ejercer tus derechos de acceso, rectificación, supresión,
                oposición, limitación y portabilidad escribiendo a{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. También
                puedes reclamar ante la Agencia Española de Protección de Datos.
            </p>
        </LegalShell>
    )
}
