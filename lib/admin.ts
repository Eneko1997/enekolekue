// Emails del equipo con acceso a las pantallas internas (admin).
export const ADMIN_EMAILS = ["enekolekue16@gmail.com", "info@gaindituoposiciones.com"]

export function esAdminEmail(email?: string | null): boolean {
    return !!email && ADMIN_EMAILS.includes(email.toLowerCase())
}
