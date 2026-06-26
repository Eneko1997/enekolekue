import { redirect } from "next/navigation"

// La home (/) ya es el dashboard. Mantenemos /dashboard como redirección
// para enlaces y marcadores antiguos.
export default function DashboardRedirect() {
    redirect("/")
}
