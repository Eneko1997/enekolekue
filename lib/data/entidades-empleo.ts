// Portales de empleo público de las entidades convocantes, VERIFICADOS a mano (se
// comprobó que la URL carga y es la sección de empleo/OPE de la entidad, o la ficha real
// de la convocatoria concreta). Se usan como enlace PRINCIPAL en la ficha de las
// convocatorias automáticas, por delante de las bases del boletín (un PDF, menos útil).
//
// Regla de oro: NUNCA enlazar algo sin verificar. Si una entidad no está en este mapa
// (o su web no se pudo comprobar), la ficha se queda con las bases oficiales. Al añadir
// una entidad, comprobar primero que la URL responde y es la página correcta.
//
// `rol` (opcional): palabras clave del PUESTO. Cuando una entidad tiene varias convocatorias
// abiertas con enlaces distintos (p. ej. Mondragón), se pone una entrada por puesto con su
// `rol` y su URL exacta, y una entrada genérica (sin `rol`) al final como respaldo. Se
// devuelve la PRIMERA entrada cuyo `match` (entidad) y `rol` (si lo hay) encajen, así que las
// entradas con `rol` van antes que la genérica de la misma entidad.

export interface EntidadEmpleo {
    /** Palabras clave normalizadas que identifican a la entidad en nombre/resumen. */
    match: string[]
    /** Palabras clave del puesto (normalizadas). Si se define, TODAS deben aparecer. */
    rol?: string[]
    etiqueta: string
    url: string
}

// Verificadas 2026-09-07 (carga OK + es la sección de empleo/OPE o la ficha de la convocatoria).
export const ENTIDADES_EMPLEO: EntidadEmpleo[] = [
    {
        match: ["diputacion foral de gipuzkoa", "gipuzkoako foru aldundia"],
        etiqueta: "Empleo público · Diputación de Gipuzkoa",
        // Listado real de procesos selectivos de la Diputación (no la home de empleo).
        url: "https://egoitza.gipuzkoa.eus/WAS/CORP/LLEHautaketaProzesuakWEB/concursos",
    },
    {
        match: ["diputacion foral de bizkaia", "bizkaiko foru aldundia"],
        etiqueta: "Empleo público · Diputación de Bizkaia",
        url: "https://www.ebizkaia.eus/es/oposiciones1",
    },
    {
        match: ["diputacion foral de alava", "arabako foru aldundia"],
        etiqueta: "Empleo público · Diputación de Álava",
        url: "https://enplegupublikoa.araba.eus/es/",
    },
    {
        match: ["ayuntamiento de getxo", "getxoko udala", "getxo"],
        etiqueta: "Empleo público · Ayuntamiento de Getxo",
        url: "https://www.getxo.eus/ope",
    },
    {
        match: ["ayuntamiento de barakaldo", "barakaldoko udala", "barakaldo"],
        etiqueta: "Empleo público · Ayuntamiento de Barakaldo",
        url: "https://www.barakaldo.eus/portal/es/web/empleo/oferta-publica-de-empleo",
    },
    // Mondragón/Arrasate: dos convocatorias abiertas con fichas distintas -> una entrada por
    // puesto (ficha exacta verificada) y una genérica (índice) de respaldo.
    {
        match: ["arrasate", "mondragon"],
        rol: ["administracion general"],
        etiqueta: "Convocatoria · Ayuntamiento de Arrasate/Mondragón",
        url: "https://www.arrasate.eus/es/baz-tramites/oferta-de-empleo-publico/1326",
    },
    {
        match: ["arrasate", "mondragon"],
        rol: ["medio"],
        etiqueta: "Convocatoria · Ayuntamiento de Arrasate/Mondragón",
        url: "https://www.arrasate.eus/es/baz-tramites/oferta-de-empleo-publico/1226",
    },
    {
        match: ["arrasate", "mondragon"],
        etiqueta: "Empleo público · Ayuntamiento de Arrasate/Mondragón",
        url: "https://www.arrasate.eus/es/baz-tramites/oferta-de-empleo-publico",
    },
    {
        match: ["sopela"],
        rol: ["arquitecto"],
        etiqueta: "Convocatoria · Ayuntamiento de Sopela",
        url: "https://sopela.convoca.online/processDetail.html?id=84f59ae6-facc-492b-6b39-08def85bcd70&type=0",
    },
    {
        match: ["sopela"],
        etiqueta: "Empleo público · Ayuntamiento de Sopela",
        url: "https://udala.sopela.eus/empleo-publico/",
    },
    {
        match: ["cristina enea"],
        etiqueta: "Convocatoria · Fundación Cristina Enea",
        url: "https://www.cristinaenea.eus/es/noticias/11733-tecnico-a-de-proyectos-culturales-y-expositivos",
    },
    {
        match: ["urretxu"],
        etiqueta: "Empleo público · Ayuntamiento de Urretxu",
        url: "https://urretxu.eus/es/ayuntamiento/empleo/",
    },
    {
        match: ["errenteria", "errenteriako"],
        etiqueta: "Empleo público · Ayuntamiento de Errenteria",
        url: "https://errenteria.eus/es/zu/anuncios/ayuntamiento-errenteria/convocatorias/",
    },
    {
        match: ["arrigorriaga"],
        etiqueta: "Empleo público · Ayuntamiento de Arrigorriaga",
        url: "https://www.arrigorriaga.eus/es-ES/Ayuntamiento/Empleo_publico",
    },
    {
        match: ["abanto", "zierbena", "ciervana"],
        etiqueta: "Convocatoria · Ayuntamiento de Abanto-Zierbena",
        url: "https://www.abanto-zierbena.eus/es-ES/Servicios/Trabajo/Paginas/OP_bibliotecario.aspx",
    },
    // Bergara EXCLUIDO: su web carga pero la sección de empleo enseña una convocatoria del
    // Euskaltegi no relacionada -> se queda con las bases (no engañar al usuario).
    // Balmaseda EXCLUIDO: la web del ayuntamiento no responde (enlace roto) -> bases.
]

function norm(s: string): string {
    return String(s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
}

/** Devuelve el portal/ficha de empleo verificado de la entidad convocante, o null. */
export function empleoEntidad(...campos: (string | null | undefined)[]): EntidadEmpleo | null {
    const hay = norm(campos.filter(Boolean).join(" "))
    for (const e of ENTIDADES_EMPLEO) {
        if (!e.match.some((m) => hay.includes(m))) continue
        if (e.rol && !e.rol.every((r) => hay.includes(r))) continue
        return e
    }
    return null
}
