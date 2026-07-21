import { redirect } from "next/navigation"

// La antigua home/catálogo vivía aquí. Ahora la home es "/" y cada escala tiene
// su propia página en /oposiciones/[slug], por lo que /dashboard ya no se usa:
// redirige a la home para no romper enlaces o marcadores antiguos.
export default function DashboardPage() {
    redirect("/")
}
