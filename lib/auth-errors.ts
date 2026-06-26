// Traduce los mensajes de error de Supabase Auth al español (portado de los componentes).
export function translateAuthError(msg: string): string {
    const m = (msg || "").toLowerCase()
    if (m.includes("is invalid") && m.includes("email"))
        return "Ese email no está permitido. Prueba con otra dirección o contacta con soporte."
    if (m.includes("already registered") || m.includes("already exists") || m.includes("user already"))
        return "Ya existe una cuenta con este email. Prueba a iniciar sesión."
    if (
        m.includes("password") &&
        (m.includes("least") || m.includes("short") || m.includes("6 characters"))
    )
        return "La contraseña debe tener al menos 6 caracteres."
    if (m.includes("invalid login credentials") || m.includes("invalid credentials"))
        return "Email o contraseña incorrectos."
    if (m.includes("email not confirmed"))
        return "Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada."
    if (m.includes("rate limit") || m.includes("too many"))
        return "Demasiados intentos. Espera unos minutos e inténtalo de nuevo."
    if (m.includes("network") || m.includes("fetch"))
        return "Error de conexión. Comprueba tu internet e inténtalo de nuevo."
    return msg || "Ha ocurrido un error. Inténtalo de nuevo."
}
