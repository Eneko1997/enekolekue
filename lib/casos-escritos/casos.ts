import type { CasoEscrito } from "./corrector"

// Piloto: examen práctico del Ayuntamiento de Ondarroa (bolsa de administrativos,
// 26/11/2018). Rúbrica calcada de la solución oficial (40 puntos). Sinónimos y
// variantes eus/es añadidos para no penalizar la paráfrasis.

const ONDARROA_2018: CasoEscrito = {
    id: "ondarroa-admin-2018",
    titulo: "Ayuntamiento de Ondarroa — Administrativo (2018)",
    entidad: "Ayuntamiento de Ondarroa",
    escala: "administrativos",
    fecha: "2018-11-26",
    leyesClave: [
        "Ley 40/2015 (RJSP), art. 32 — responsabilidad patrimonial",
        "Ley 39/2015 (LPAC), art. 66 — contenido de las solicitudes",
        "Ley 39/2015 (LPAC), art. 16 — registro de entrada",
    ],
    ejercicios: [
        {
            titulo: "Ejercicio 1 — Responsabilidad patrimonial",
            contexto:
                "El Sr. Odriozola aparcó su vehículo el 2 de noviembre de 2018 en los aparcamientos exteriores del campo de fútbol de Ondarroa. Esa noche se celebró un concierto con fuegos artificiales y, a la mañana siguiente, encontró desperfectos en el vehículo causados por los fuegos. Queda probado que no se balizó una zona de seguridad para el aparcamiento.",
            preguntas: [
                {
                    n: "1",
                    enunciado: "¿Tiene derecho el Sr. Odriozola a reclamar los hechos citados? ¿Ante quién?",
                    ley: "Ley 40/2015, art. 32",
                    modelo: "Sí. Ante el Ayuntamiento (la Administración responsable).",
                    comentario: "Ante un daño causado por el funcionamiento de un servicio público, se reclama a la Administración titular. Aquí es el Ayuntamiento de Ondarroa, responsable de balizar y dar seguridad a la zona de aparcamiento. Es la responsabilidad patrimonial del art. 32 de la Ley 40/2015.",
                    conceptos: [
                        { label: "Sí, tiene derecho a reclamar", puntos: 2.5, patrones: ["si", "tiene derecho", "puede reclamar", "cabe reclamar", "derecho a reclamar", "bai"] },
                        { label: "Ante el Ayuntamiento / la Administración", puntos: 2.5, patrones: ["ayuntamiento", "administracion", "udala", "udal", "consistorio", "municipio", "ente local", "entidad local"] },
                    ],
                },
                {
                    n: "2",
                    enunciado: "¿Qué requisitos habrá de cumplir el daño para poder ser reclamado?",
                    ley: "Ley 40/2015, art. 32",
                    modelo: "El daño debe ser efectivo, evaluable económicamente, individualizado y existir relación de causalidad.",
                    comentario: "El art. 32 de la Ley 40/2015 exige que el daño sea efectivo (real, no hipotético), evaluable económicamente e individualizado en una persona o grupo, y que exista relación de causalidad entre el servicio público y el daño. Si falta uno de los cuatro, no procede la indemnización.",
                    conceptos: [
                        { label: "Daño efectivo (real)", puntos: 1.25, patrones: ["efectivo", "real", "cierto"] },
                        { label: "Evaluable económicamente", puntos: 1.25, patrones: ["evaluable economicamente", "economicamente evaluable", "evaluable", "cuantificable", "valorable economicamente", "valorable"] },
                        { label: "Individualizado", puntos: 1.25, patrones: ["individualizado", "individual", "determinada persona", "persona o grupo", "singularizado"] },
                        { label: "Relación causal (nexo causal)", puntos: 1.25, patrones: ["relacion causal", "nexo causal", "relacion de causalidad", "causa efecto", "causalidad"] },
                    ],
                },
                {
                    n: "3",
                    enunciado: "¿Podría la Administración excusarse de responder en este supuesto?",
                    ley: "Ley 39/2015, art. 21 (obligación de resolver)",
                    modelo: "No. La Administración no puede excusarse; está obligada a resolver.",
                    comentario: "No. La Administración está obligada a resolver expresamente (art. 21 de la Ley 39/2015): no puede eludir su responsabilidad guardando silencio o dejando de contestar.",
                    conceptos: [
                        { label: "No puede excusarse (obligación de resolver)", puntos: 5, tipo: "negacion", patrones: ["no puede excusar", "no puede eximir", "no puede negar", "no cabe", "obligacion de resolver", "obligada a resolver", "debe responder", "tiene que responder", "ez"] },
                    ],
                },
                {
                    n: "4",
                    enunciado: "¿De qué tipo de responsabilidad estaríamos hablando?",
                    ley: "Ley 40/2015, art. 32",
                    modelo: "Responsabilidad patrimonial (de la Administración).",
                    comentario: "Es la responsabilidad patrimonial de la Administración: responde de las lesiones que sufran los particulares por el funcionamiento normal o anormal de los servicios públicos (art. 32 de la Ley 40/2015).",
                    conceptos: [
                        { label: "Responsabilidad patrimonial", puntos: 5, patrones: ["responsabilidad patrimonial", "ondare erantzukizun", "patrimonial de la administracion"] },
                    ],
                },
            ],
        },
        {
            titulo: "Ejercicio 2 — Solicitud y registro",
            contexto:
                "Ainhoa Garmendia presenta un escrito en el ayuntamiento: «Yo, Ainhoa Garmendia Etxebarria, DNI 15.798.513, EXPRESO QUE: habiendo tenido conocimiento de la convocatoria del Ayuntamiento de Ondarroa para una bolsa de administrativos, y reuniendo las condiciones exigidas, SOLICITO ser admitida al mismo. En Ispaster, a 2 de noviembre de 2018.»",
            preguntas: [
                {
                    n: "1",
                    enunciado: "Explica si la solicitud está bien realizada o mal.",
                    ley: "Ley 39/2015, art. 66",
                    modelo: "NO está bien: faltan el medio o lugar a efectos de notificaciones (domicilio, teléfono…), la firma del solicitante y el órgano al que se dirige.",
                    comentario: "La solicitud está incompleta. El art. 66 de la Ley 39/2015 exige, entre otros datos, el medio o lugar a efectos de notificaciones (domicilio, teléfono, email), la firma del solicitante y el órgano al que se dirige. Aquí faltan esos tres.",
                    conceptos: [
                        { label: "Está MAL / incompleta", puntos: 2, tipo: "negacion", patrones: ["mal", "no esta bien", "incorrecta", "incompleta", "no bien", "faltan datos", "gaizki"] },
                        { label: "Falta el medio/lugar de notificaciones (domicilio, teléfono)", puntos: 2, patrones: ["medio de notificacion", "lugar de notificacion", "efectos de notificacion", "notificaciones", "domicilio", "telefono", "direccion", "helbide"] },
                        { label: "Falta la firma del solicitante", puntos: 2, patrones: ["firma", "firmar", "sinadura", "rubrica"] },
                        { label: "Falta el órgano al que se dirige", puntos: 2, patrones: ["a quien se dirige", "organo", "destinatario", "dirigido a", "organo al que", "nori zuzentzen"] },
                    ],
                },
                {
                    n: "2",
                    enunciado: "Una vez registrada la hoja de solicitud, ¿qué anotarías en la misma?",
                    ley: "Ley 39/2015, art. 16",
                    modelo: "La fecha, la entrada y el número de orden.",
                    comentario: "Al presentar un documento en el registro se anotan la fecha de entrada, el asiento de entrada y el número de orden correlativo que le corresponde (art. 16 de la Ley 39/2015).",
                    conceptos: [
                        { label: "Fecha", puntos: 1, patrones: ["fecha", "data"] },
                        { label: "Entrada (registro de entrada)", puntos: 1, patrones: ["entrada", "registro de entrada", "sarrera"] },
                        { label: "Número de orden", puntos: 1, patrones: ["numero de orden", "n de orden", "num de orden", "numero de registro", "orden", "order zenbaki"] },
                    ],
                },
                {
                    n: "3",
                    enunciado: "¿Qué le darías para que pueda probar que ingresó el documento en el Registro?",
                    ley: "Ley 39/2015, art. 66.3",
                    modelo: "Un recibo con el día y hora de presentación, número de entrada y referencia del asunto; o una copia sellada del documento.",
                    comentario: "Como prueba de la presentación se entrega un recibo con el día y hora, el número de entrada y la referencia del asunto; como alternativa, una copia sellada del propio documento (art. 66.3 de la Ley 39/2015).",
                    conceptos: [
                        { label: "Un recibo / justificante", puntos: 4, patrones: ["recibo", "erreziboa", "justificante", "resguardo"] },
                        { label: "Con día/hora, nº de entrada y referencia del asunto", puntos: 2, patrones: ["dia y hora", "hora", "numero de entrada", "referencia del asunto", "asunto", "fecha y hora"] },
                        { label: "O una copia sellada del documento", puntos: 3, patrones: ["copia sellada", "copia con sello", "documento sellado", "sello", "copia del documento", "zigilu"] },
                    ],
                },
            ],
        },
    ],
}

export const CASOS_ESCRITOS: CasoEscrito[] = [ONDARROA_2018]

export function getCasoEscrito(id: string): CasoEscrito | undefined {
    return CASOS_ESCRITOS.find((c) => c.id === id)
}
