import type { Metadata } from "next"
import LegalShell from "@/components/site/LegalShell"
import { CONTACT_EMAIL } from "@/lib/site"

export const metadata: Metadata = {
    title: "Aviso legal",
    description: "Aviso legal y condiciones de uso de Gainditu.",
    robots: { index: true, follow: true },
}

export default function AvisoLegalPage() {
    return (
        <LegalShell title="Aviso legal" updated="junio de 2026">
            <h2>1. Titular del sitio web</h2>
            <p>
                El presente sitio web <strong>gainditu.com</strong> (en adelante,
                «Gainditu») es titularidad de <strong>Gainditu Oposiciones</strong>.
                Para cualquier consulta puedes contactar en{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>2. Objeto</h2>
            <p>
                Gainditu es una plataforma de preparación de oposiciones que
                ofrece tests y materiales de estudio orientados a la OPE del
                Gobierno Vasco. Se trata de un proyecto independiente, sin
                vinculación oficial con el Gobierno Vasco ni con el IVAP.
            </p>

            <h2>3. Condiciones de uso</h2>
            <p>
                El acceso y uso del sitio implican la aceptación de este aviso
                legal. El usuario se compromete a utilizar los contenidos de
                forma lícita y a no realizar actividades que puedan dañar,
                inutilizar o sobrecargar el servicio.
            </p>

            <h2>4. Propiedad intelectual</h2>
            <p>
                Los contenidos, marca y diseño del sitio están protegidos por los
                derechos de propiedad intelectual e industrial. No se permite su
                reproducción sin autorización previa.
            </p>

            <h2>5. Responsabilidad</h2>
            <p>
                Los resúmenes y materiales tienen carácter divulgativo y
                orientativo. Las fechas y temarios pueden variar; el usuario debe
                verificar siempre la información oficial en las fuentes
                pertinentes (BOPV, euskadi.eus e IVAP).
            </p>

            <h2>6. Legislación aplicable</h2>
            <p>
                Este aviso legal se rige por la legislación española.
            </p>
        </LegalShell>
    )
}
