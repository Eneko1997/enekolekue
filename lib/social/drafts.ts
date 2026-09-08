// Generadores de borradores para redes sociales.
// CONVOCATORIAS en X: formato con título en MAYÚSCULAS + 📢/💶/📚/✅/🔗 (validado por el usuario).
// ORGÁNICOS en X: tono natural y CERCANO (no agresivo), con gancho suave y frases cortas.
// LinkedIn (todo): voz de ACADEMIA/marca (Gainditu), institucional e informativa. Nunca primera persona.
import { CONVOCATORIAS } from "@/lib/data/convocatorias"

export const DOMINIO = "https://gaindituoposiciones.com"

export type Conv = { slug: string; nombre: string; plazas: number | null; organismo: string | null }

const SUELDO: Record<string, string> = { A1: "~2.800 €/mes", A2: "~2.400 €/mes", B: "~2.100 €/mes", C1: "~1.900 €/mes", C2: "~1.700 €/mes", E: "~1.500 €/mes" }
const ORG_LABEL: Record<string, string> = {
    "gobierno-vasco": "Gobierno Vasco",
    "osakidetza": "Osakidetza",
    "ertzaintza": "Ertzaintza",
    "diputaciones-forales": "Diputación Foral",
    "administracion-local": "Administración local",
    "educacion": "Educación",
}

function grupoDe(nombre: string): string {
    const s = nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    if (/(peon|operario|limpieza|ayudante de oficios|personal de apoyo|subalterno|sepulturer|enterrador|conserje|ordenanza)/.test(s)) return "E"
    if (/(auxiliar|cuidador|conductor|notificador|vigilante|oficial|celador)/.test(s)) return "C2"
    if (/administrativ/.test(s)) return "C1"
    if (/(arquitecto tecnic|ingenier[oa] tecnic|tecnic[oa] medi|enfermer|trabajador social|educador|graduad|diplomad|fisioterapeuta|tecnic[oa] de gestion|delineante|bibliotecari)/.test(s)) return "A2"
    if (/(arquitecto|ingenier|medico|veterinari|tecnic[oa] superior|letrad|abogad|psicolog|economista|licenciad|inspector|jefe|director|tecnic[oa] de administracion general|analista)/.test(s)) return "A1"
    return "C1"
}
function esfuerzoDe(g: string, plazas: number | null): { nivel: string; motivo: string } {
    let nivel = (g === "A1") ? "alto" : (g === "A2" || g === "B") ? "medio-alto" : (g === "C1") ? "medio" : "bajo"
    let motivo = (g === "A1" || g === "A2") ? "requiere titulación y temario amplio" : (g === "C1") ? "temario asequible con constancia" : "sin titulación alta, muy accesible"
    if (plazas && plazas >= 20) { motivo = "muchas plazas, buenas opciones de entrar"; if (nivel === "alto") nivel = "medio-alto"; else if (nivel === "medio") nivel = "medio-bajo" }
    else if (plazas === 1) { motivo = "1 sola plaza, alta competencia" }
    return { nivel, motivo }
}
function nombreCorto(nombre: string): string {
    let n = String(nombre || "Convocatoria").replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim()
    if (n.length > 90) n = n.slice(0, 87).replace(/\s+\S*$/, "") + "…"
    return n
}
function hashSlug(slug: string): number {
    let h = 0
    for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
    return h
}
function tituloMayus(nombre: string): string {
    return nombreCorto(nombre).toUpperCase().replace(/\b(PLAZAS?)\s+DE\s+/, "$1 de ")
}
// ── Borrador para X (CONVOCATORIAS): formato validado ──────────────────────
export function borradorX(c: Conv): string {
    const g = grupoDe(String(c.nombre || ""))
    const e = esfuerzoDe(g, c.plazas ?? null)
    const link = `${DOMINIO}/convocatorias/${c.slug}`
    return `📢 ${tituloMayus(c.nombre)}\n💶 Sueldo aprox. ${SUELDO[g]} (grupo ${g})\n📚 Esfuerzo: ${e.nivel} · ${e.motivo}\n✅ Inscripción ABIERTA\n🔗 ${link}`
}

// ── Borrador para LinkedIn (CONVOCATORIAS): voz de academia ────────────────
export function borradorLinkedIn(c: Conv): string {
    const g = grupoDe(String(c.nombre || ""))
    const e = esfuerzoDe(g, c.plazas ?? null)
    const link = `${DOMINIO}/convocatorias/${c.slug}`
    const org = ORG_LABEL[c.organismo || ""] || "la Administración vasca"
    const titulo = nombreCorto(c.nombre)
    const cierre = e.nivel === "bajo" || e.nivel === "medio-bajo"
        ? "Es una oposición accesible: con orden y constancia, está al alcance de mucha gente."
        : "Es exigente, pero con un buen plan de estudio y constancia es una meta totalmente alcanzable."
    return [
        `📋 Nueva convocatoria de empleo público en Euskadi: ${titulo} (${org}).`,
        ``,
        `• Grupo ${g} · sueldo aproximado de ${SUELDO[g]}.`,
        `• Nivel de exigencia: ${e.nivel} — ${e.motivo}.`,
        `• Supone una plaza pública estable y con las condiciones del sector público.`,
        ``,
        cierre,
        ``,
        `En Gainditu tienes el temario, tests y simulacros para prepararla paso a paso 👉 ${link}`,
        ``,
        `#oposiciones #empleopúblico #Euskadi #Gainditu`,
    ].join("\n")
}

// ── 30 posts ORGÁNICOS ─────────────────────────────────────────────────────
// X: cercano y natural (sin agresividad). LinkedIn: voz de academia. Todo a mano, sin frases repetidas.
export type PostOrganico = { id: string; tema: string; x: string; linkedin: string; opciones?: string[] }

export const POSTS_ORGANICOS: PostOrganico[] = [
    {
        id: "org-recomendador", tema: "Recomendador de oposición",
        x: `¿Quieres opositar pero no sabes a qué?\n\nEs de lo más normal, y acertar con la elección ya es medio camino.\n\nEn 3 minutos puedes ver qué encaja contigo: tu titulación, las plazas y la dificultad.\n\nTe dejo la herramienta 👇\n${DOMINIO}/herramientas`,
        linkedin: `Una de las decisiones más importantes al opositar es también la primera: ¿a qué te presentas?\n\nElegir sin criterio puede costar meses. Conviene valorar cuatro factores antes de empezar: tu titulación, el número de plazas, la dificultad del temario y el tiempo del que dispones.\n\nEn Gainditu hemos creado un recomendador que, a partir de unas preguntas, te orienta sobre qué oposiciones de Euskadi encajan mejor con tu perfil.\n\nSi estás en ese punto de decisión, puede ayudarte 👉 ${DOMINIO}/herramientas\n\n#oposiciones #empleopúblico #Euskadi`,
    },
    {
        id: "org-examenes-oficiales", tema: "Exámenes oficiales con explicación",
        x: `Releer el temario está bien, pero hacer exámenes oficiales de años anteriores enseña muchísimo más.\n\nVes cómo se pregunta de verdad.\n\nY si cada respuesta viene explicada, aprendes de los fallos sin que te cuesten el examen.`,
        linkedin: `Cuando se lleva medio temario, los exámenes oficiales de convocatorias anteriores son una de las mejores herramientas de preparación.\n\nMuestran cómo se pregunta realmente, qué contenidos se repiten y dónde están las trampas entre opciones parecidas.\n\nLa clave no es solo acertar, sino entender por qué las demás opciones son incorrectas. Por eso en Gainditu cada examen oficial incluye la explicación de todas las preguntas, no solo la solución.\n\nSi preparas una plaza en Euskadi, practicar con exámenes reales marca la diferencia.\n\n#oposiciones #Euskadi #empleopúblico`,
    },
    {
        id: "org-premium", tema: "Premium vs academia",
        x: `Una academia ronda los 120-150 € al mes, y no todo el mundo puede permitírselo.\n\nPor lo que cuesta un mes, en Gainditu tienes un año entero: simulacros, temario y exámenes oficiales.\n\nPara que el dinero no sea la excusa para empezar.`,
        linkedin: `Una academia presencial de oposiciones ronda los 120-150 € mensuales, un coste que deja fuera a mucha gente.\n\nEn Gainditu ofrecemos una alternativa: por el precio de un mes de academia, un año completo de simulacros cronometrados, temario y exámenes oficiales explicados, para estudiar a tu ritmo.\n\nNo sustituye el esfuerzo de cada opositor, pero elimina una de las barreras más habituales para empezar a prepararse.\n\nPuedes ver qué incluye en ${DOMINIO}\n\n#oposiciones #empleopúblico #Euskadi`,
    },
    {
        id: "org-plan-estudio", tema: "Plan de estudio",
        x: `Estudiar sin plan cansa el doble y cunde la mitad.\n\nMuchas veces no es falta de horas, es no tener claro qué toca hoy.\n\nSi quieres, te montamos un plan según tu oposición y tu tiempo 👇\n${DOMINIO}/mi-plan`,
        linkedin: `En la preparación de una oposición, el plan pesa tanto como las horas de estudio.\n\nAvanzar sin un orden claro lleva a repasar de más unos temas y abandonar otros. Un buen plan define qué estudiar cada día y cuándo repasar lo anterior, evitando el desgaste.\n\nEn Gainditu contamos con un generador de plan de estudio que se adapta a cada oposición y al tiempo disponible.\n\nOrganizar el camino antes de empezar cambia los resultados 👉 ${DOMINIO}/mi-plan\n\n#oposiciones #productividad #Euskadi`,
    },
    {
        id: "org-tests-por-tema", tema: "Tests al terminar cada tema",
        x: `Un hábito que ayuda mucho: en cuanto acabes un tema, hazte un test de ese tema.\n\nLeerlo y entenderlo no es lo mismo que recordarlo bajo presión.\n\nMejor descubrir los fallos en casa que el día del examen.`,
        linkedin: `Terminar un tema y pasar al siguiente sin comprobar lo aprendido es uno de los errores más frecuentes al opositar.\n\nReconocer la información al leerla no garantiza poder recuperarla en el examen. La forma más eficaz de comprobarlo es hacer un test del tema justo al terminarlo: los fallos detectados en casa se corrigen a tiempo.\n\nEn Gainditu encontrarás tests por tema para afianzar cada bloque a medida que avanzas.\n\n#oposiciones #estudio #empleopúblico`,
    },
    {
        id: "org-simulacros", tema: "Simulacros cronometrados",
        x: `El día del examen, los nervios y el reloj pesan tanto como el temario.\n\nPor eso ayuda hacer simulacros con tiempo antes.\n\nLa primera vez casi todos vamos justos; entrenarlo le quita el susto al día importante.`,
        linkedin: `En el examen de una oposición no solo se mide el conocimiento, también la gestión del tiempo.\n\nResolver todas las preguntas dentro del límite, decidir cuándo pasar de una duda o mantener la concentración son habilidades que se entrenan.\n\nRecomendamos hacer simulacros cronometrados en las semanas previas, en condiciones similares a las reales. En Gainditu pueden repetirse tantas veces como haga falta.\n\n#oposiciones #Euskadi #empleopúblico`,
    },
    {
        id: "org-tecnica-leyes", tema: "Técnica: memorizar leyes",
        x: `Si te cuesta memorizar artículos, prueba a colorearlos.\n\nPalabras clave de un color, números de otro, leyes de otro.\n\nLa cabeza recuerda mucho mejor por imagen que por repetir mil veces. Pruébalo con un tema.`,
        linkedin: `Memorizar leyes y artículos por pura repetición es poco eficiente: el cerebro retiene mejor mediante imagen y color.\n\nUn método que funciona es subrayar siempre con el mismo criterio. Un color para las palabras clave, otro para los números y plazos, y otro para las referencias legales.\n\nAsí, al repasar, la memoria reconoce la estructura del tema y los datos que más se escapan dejan de mezclarse.\n\nEs un pequeño cambio de técnica con un gran efecto en la retención.\n\n#oposiciones #estudio #tecnicasdeestudio`,
    },
    {
        id: "org-al-dia-convocatorias", tema: "Estar al día de convocatorias",
        x: `En Euskadi salen plazas casi cada mes, y muchas pasan desapercibidas.\n\nEnterarte tarde de la tuya da mucha rabia.\n\nDeja tu email y te avisamos cuando salga 👇\n${DOMINIO}/convocatorias`,
        linkedin: `En Euskadi se publican convocatorias de empleo público prácticamente cada mes: Osakidetza, Gobierno Vasco, Ertzaintza, diputaciones y ayuntamientos.\n\nMuchas pasan desapercibidas hasta que el plazo ya se ha cerrado, y perder una convocatoria por no enterarse a tiempo es especialmente frustrante.\n\nEn Gainditu las recopilamos en un único lugar y avisamos por email cuando sale una nueva, según los intereses de cada persona.\n\nConsulta las convocatorias abiertas 👉 ${DOMINIO}/convocatorias\n\n#oposiciones #empleopúblico #Euskadi`,
    },
    {
        id: "org-nunca-es-tarde", tema: "Motivación: nunca es tarde",
        x: `Si piensas que ya eres mayor para opositar, tranquilo: no lo eres.\n\nCada año saca plaza gente que empezó pasados los 40, con hijos y trabajo.\n\nNo es cuestión de edad, es de método y de no rendirse.`,
        linkedin: `"Ya soy mayor para opositar" es una de las creencias más extendidas y, a la vez, menos ciertas.\n\nCada año aprueban su plaza personas que empezaron pasados los 40, muchas compaginando familia y trabajo. La diferencia no está en la memoria ni en la edad, sino en el método y la constancia.\n\nOpositar no premia al más brillante, sino a quien mantiene el ritmo. Y para eso solo hace falta empezar.\n\nEn Gainditu acompañamos esa preparación desde el primer tema.\n\n#oposiciones #empleopúblico #motivación`,
    },
    {
        id: "org-constancia", tema: "Mentalidad: constancia",
        x: `Buena parte de aprobar una oposición es, simplemente, no dejarlo.\n\nLa mayoría lo abandona en los primeros meses.\n\nSi tú sigues ahí, semana tras semana, ya juegas con ventaja.`,
        linkedin: `La mayoría de quienes empiezan una oposición la abandonan en los primeros meses.\n\nEsto significa que buena parte del éxito consiste, simplemente, en no rendirse. No se necesita un talento excepcional, sino sostener el ritmo cuando otros lo dejan.\n\nEl progreso es discreto: un tema, un test, un repaso. Poco espectacular, pero muy efectivo. Se avanza sumando días constantes, no jornadas heroicas.\n\nEn Gainditu ayudamos a mantener ese ritmo con material y planificación.\n\n#oposiciones #constancia #empleopúblico`,
    },
    {
        id: "org-herramientas-gratis", tema: "Herramientas gratis",
        x: `Para empezar a orientarte no necesitas pagar nada.\n\nQué oposición te encaja, un plan base, tests para probar… todo gratis.\n\nEmpieza por ahí y ya decidirás el siguiente paso 👇\n${DOMINIO}/herramientas`,
        linkedin: `Antes de invertir en preparar una oposición conviene tener claras dos cosas: a qué presentarse y cómo organizarse.\n\nPara eso no hace falta pagar. En Gainditu ofrecemos herramientas gratuitas: un recomendador de oposición, un generador de plan de estudio y tests de prueba.\n\nSon un buen punto de partida para orientarse con criterio antes de dar el siguiente paso.\n\nPuedes usarlas aquí 👉 ${DOMINIO}/herramientas\n\n#oposiciones #Euskadi #empleopúblico`,
    },
    {
        id: "org-plaza-fija", tema: "Por qué merece la pena",
        x: `Una plaza pública no es solo el sueldo.\n\nEs conciliar, planificar tu vida con calma y no depender de cómo le vaya a la empresa.\n\nCuesta sacarla, pero da una tranquilidad difícil de igualar.`,
        linkedin: `Se habla mucho del esfuerzo que exige una oposición y poco de lo que aporta conseguir la plaza.\n\nUna plaza pública supone estabilidad real: continuidad laboral, posibilidad de conciliar y capacidad de planificar a largo plazo sin depender de la situación de una empresa.\n\nRequiere meses de dedicación, sí. Pero pocas decisiones tienen un impacto tan duradero en la tranquilidad del día a día.\n\nEn Gainditu ayudamos a recorrer ese camino con método.\n\n#oposiciones #empleopúblico #Euskadi`,
    },
    {
        id: "org-repaso-espaciado", tema: "Repaso espaciado",
        x: `Estudiar un tema una vez y no volver a él es dejar la mitad del trabajo a medias.\n\nLo que no se repasa, se olvida.\n\nDeja repasos cortos a los pocos días y a la semana. Poco tiempo, mucho efecto.`,
        linkedin: `Uno de los motivos más habituales por los que se olvida el temario es la falta de repaso planificado.\n\nLa memoria funciona por refuerzo: un tema estudiado una sola vez se desvanece en pocos días. Repasarlo de forma espaciada —a los pocos días, a la semana, al mes— consolida lo aprendido con muy poco tiempo.\n\nEn Gainditu la planificación de estudio contempla esos repasos para que no se pierda lo avanzado.\n\n#oposiciones #estudio #empleopúblico`,
    },
    {
        id: "org-cuaderno-errores", tema: "Cuaderno de errores",
        x: `Cuando falles una pregunta en un test, no pases de largo.\n\nApunta el fallo y por qué te equivocaste.\n\nEse cuaderno acaba siendo tu mejor resumen: repasas justo lo que se te escapa, no lo que ya dominas.`,
        linkedin: `Registrar los fallos es una de las prácticas que más rendimiento dan al opositar y de las menos habituales.\n\nCada pregunta fallada en un test señala un punto débil concreto. Anotar el error y el motivo crea, con el tiempo, un resumen personalizado de lo que realmente hay que reforzar.\n\nEstudiar los propios fallos es mucho más eficiente que repasar de nuevo lo que ya se sabe. En Gainditu los tests ayudan a detectar esos puntos débiles a medida que avanzas.\n\n#oposiciones #estudio #empleopúblico`,
    },
    {
        id: "org-estudio-activo", tema: "Estudio activo",
        x: `Subrayar y releer da sensación de estar estudiando, pero se olvida rápido.\n\nLo que fija de verdad es preguntarte a ti mismo.\n\nTápate el tema e intenta contarlo con tus palabras. Cuesta más, pero se queda.`,
        linkedin: `Subrayar y releer son de las técnicas más usadas y, a la vez, de las menos eficaces: generan sensación de dominio sin apenas retención.\n\nLo que consolida el aprendizaje es el estudio activo: cerrar el temario e intentar recuperar la información con tus propias palabras, o resolver preguntas sobre lo estudiado.\n\nEs más exigente, pero fija mucho mejor. En Gainditu los tests y simulacros están pensados precisamente para estudiar de forma activa.\n\n#oposiciones #estudio #tecnicasdeestudio`,
    },
    {
        id: "org-descansos", tema: "Descansos y rendimiento",
        x: `Estudiar seis horas seguidas suena épico, pero rinde poco: el cerebro se satura.\n\nBloques con pequeños descansos cunden más que un maratón.\n\nMenos horas, pero mejor aprovechadas.`,
        linkedin: `Estudiar muchas horas seguidas suele rendir menos de lo que parece: la concentración cae y la retención baja.\n\nTrabajar por bloques con descansos breves —por ejemplo, tramos de estudio seguidos de una pausa corta— mantiene el rendimiento alto durante más tiempo.\n\nNo se trata de estudiar más horas, sino de aprovechar mejor las que se dedican. La planificación de Gainditu tiene en cuenta ese equilibrio.\n\n#oposiciones #productividad #estudio`,
    },
    {
        id: "org-sueno", tema: "Dormir y memoria",
        x: `Estudiar hasta las tantas quitándote horas de sueño suele salir caro.\n\nEl cerebro fija la memoria mientras duermes.\n\nDormir bien no es perder el tiempo: es parte del estudio.`,
        linkedin: `Sacrificar horas de sueño para estudiar más suele ser contraproducente.\n\nDurante el sueño el cerebro consolida lo aprendido durante el día. Dormir poco no solo reduce la concentración al día siguiente, también dificulta que el temario "se asiente".\n\nDescansar bien forma parte de una buena preparación, tanto como las horas de estudio. Merece la pena cuidarlo, sobre todo en las semanas previas al examen.\n\n#oposiciones #estudio #bienestar`,
    },
    {
        id: "org-tecnica-test", tema: "Cómo hacer los tests",
        x: `En un test, muchas veces no sabes la respuesta pero sí puedes descartar dos opciones.\n\nAhí también se ganan puntos.\n\nLee todas las opciones antes de marcar y ten en cuenta la penalización por fallo.`,
        linkedin: `Responder bien un examen tipo test también es una técnica que se entrena.\n\nAlgunas pautas útiles: leer siempre todas las opciones antes de marcar, usar el descarte cuando no se conoce la respuesta directa y tener presente cómo penalizan los fallos, para decidir si conviene arriesgar o dejar en blanco.\n\nPracticar con tests y simulacros permite interiorizar estas estrategias antes del día del examen. En Gainditu se pueden entrenar con material real.\n\n#oposiciones #estudio #empleopúblico`,
    },
    {
        id: "org-organizar-temario", tema: "Organizar el temario",
        x: `Antes de ponerte a empollar, dedica un rato a ver el temario entero.\n\nSaber cuántos temas hay y cómo se relacionan te ahorra agobios.\n\nEmpezar con un mapa cansa menos que ir a ciegas.`,
        linkedin: `Antes de estudiar el primer tema, merece la pena dedicar un rato a conocer el temario completo.\n\nTener una visión de conjunto —cuántos temas hay, cómo se agrupan y qué peso tiene cada bloque— facilita planificar y reduce la sensación de agobio que muchas veces frena al empezar.\n\nEstudiar con un mapa claro del camino rinde más que avanzar sin referencias. En Gainditu el temario está organizado para facilitar esa visión.\n\n#oposiciones #estudio #empleopúblico`,
    },
    {
        id: "org-compaginar", tema: "Compaginar trabajo y estudio",
        x: `Se puede opositar trabajando: mucha gente lo hace.\n\nEl truco no es tener más horas, es proteger las pocas que tienes.\n\nUn rato fijo cada día suma más que un domingo entero de vez en cuando.`,
        linkedin: `Compaginar una oposición con un trabajo a jornada completa es difícil, pero muy común: gran parte de quienes aprueban lo hicieron así.\n\nLa clave no está en encontrar muchas horas, sino en proteger las pocas disponibles y usarlas de forma constante. Un rato diario, sostenido en el tiempo, rinde más que esfuerzos intensos y aislados.\n\nUna planificación realista, ajustada a la vida de cada persona, es lo que hace sostenible esa preparación. En eso ayudamos en Gainditu.\n\n#oposiciones #empleopúblico #conciliación`,
    },
    {
        id: "org-suspender", tema: "Suspender no es el final",
        x: `Suspender una oposición no borra lo que sabes.\n\nCasi nadie aprueba a la primera, y ese temario ya lo tienes medio hecho para la próxima.\n\nNo es empezar de cero, es continuar.`,
        linkedin: `No aprobar una oposición al primer intento es lo más habitual, y conviene recordarlo.\n\nEl trabajo hecho no se pierde: el temario estudiado, la técnica de examen y la experiencia de haberse presentado son una base enorme para la siguiente convocatoria. Quien vuelve a intentarlo no parte de cero, parte con ventaja.\n\nLa constancia entre intentos es, muchas veces, lo que separa a quien acaba consiguiendo la plaza. En Gainditu acompañamos también ese proceso a largo plazo.\n\n#oposiciones #empleopúblico #motivación`,
    },
    {
        id: "org-rutina", tema: "Rutina de estudio",
        x: `La motivación va y viene; la rutina se queda.\n\nEstudiar siempre a la misma hora hace que casi ni te lo pienses: te sientas y arrancas.\n\nEsos días sin ganas, si aun así estudias, son los que marcan la diferencia.`,
        linkedin: `Confiar solo en la motivación es arriesgado, porque va y viene. Lo que sostiene una preparación larga es la rutina.\n\nEstudiar siempre en el mismo horario reduce la resistencia a empezar: el hábito hace que sentarse a estudiar deje de ser una decisión y pase a ser algo automático.\n\nLos días de menos ganas son inevitables; superarlos gracias a la rutina es lo que, sumado, acaba marcando la diferencia. Una planificación estable ayuda a crear ese hábito.\n\n#oposiciones #productividad #constancia`,
    },
    {
        id: "org-no-compararse", tema: "No compararse",
        x: `Que otro opositor vaya por el tema 40 y tú por el 12 no significa gran cosa.\n\nCada uno tiene su vida, su tiempo y su ritmo.\n\nCompite contigo, con el de la semana pasada. Ese es el marcador que importa.`,
        linkedin: `Compararse con otros opositores suele generar más ansiedad que utilidad.\n\nCada persona parte de una situación distinta: tiempo disponible, base previa, responsabilidades. Que alguien avance más rápido no dice nada sobre las propias posibilidades de conseguir la plaza.\n\nLa referencia más útil es uno mismo: comparar el punto en el que se está hoy con el de hace unas semanas. Ese progreso es el que de verdad importa. En Gainditu es fácil seguir tu propio avance.\n\n#oposiciones #estudio #bienestar`,
    },
    {
        id: "org-dia-examen", tema: "El día del examen",
        x: `Los nervios el día del examen son normales; hasta los que van bien preparados los tienen.\n\nHaber hecho simulacros ayuda: tu cuerpo ya conoce la situación.\n\nRespira, lee con calma y ve pregunta a pregunta.`,
        linkedin: `Los nervios el día del examen son inevitables, incluso entre quienes van bien preparados. La clave no es eliminarlos, sino saber gestionarlos.\n\nHaber practicado con simulacros en condiciones similares reduce mucho ese impacto: la situación deja de ser desconocida. Estrategias sencillas como respirar con calma, leer bien cada enunciado y avanzar pregunta a pregunta ayudan a rendir mejor.\n\nEntrenar el examen, y no solo el temario, forma parte de una preparación completa.\n\n#oposiciones #empleopúblico #estudio`,
    },
    {
        id: "org-perfil-linguistico", tema: "Perfil lingüístico (euskera)",
        x: `En muchas plazas de Euskadi, el euskera suma puntos o es requisito según el perfil lingüístico.\n\nAcreditarlo amplía bastante las oposiciones a las que puedes presentarte.\n\nMerece la pena tenerlo en cuenta desde el principio.`,
        linkedin: `En buena parte de las convocatorias de empleo público en Euskadi, el conocimiento de euskera influye: según la plaza, el perfil lingüístico puntúa como mérito o llega a ser requisito.\n\nAcreditar el perfil correspondiente amplía de forma notable el abanico de oposiciones a las que se puede optar y, en muchos casos, mejora la puntuación final.\n\nConviene tenerlo presente al planificar la preparación y revisar siempre las bases de cada convocatoria, donde se detalla el perfil exigido.\n\n#oposiciones #Euskadi #euskera`,
    },
    {
        id: "org-turnos", tema: "Turnos de acceso",
        x: `No todas las plazas van al mismo saco.\n\nSuele haber turno libre, promoción interna y una reserva para personas con discapacidad.\n\nMirar por qué turno encajas puede cambiar mucho tus opciones. Revisa siempre las bases.`,
        linkedin: `Al leer una convocatoria conviene fijarse en cómo se reparten las plazas, no solo en cuántas hay.\n\nHabitualmente existen distintos turnos de acceso: turno libre, promoción interna y una reserva para personas con discapacidad. La competencia y los requisitos varían según el turno, y elegir el adecuado puede mejorar las opciones reales de conseguir plaza.\n\nCada convocatoria detalla estos aspectos en sus bases, por lo que siempre es recomendable revisarlas con calma antes de decidir.\n\n#oposiciones #empleopúblico #Euskadi`,
    },
    {
        id: "org-osakidetza", tema: "Osakidetza / sanidad",
        x: `Osakidetza convoca plazas de muchas categorías, no solo médicas: auxiliares, celadores, administrativos, enfermería…\n\nSi te atrae la sanidad pública, hay más puertas de las que parece.\n\nÉchale un ojo a lo que hay abierto 👇\n${DOMINIO}/convocatorias`,
        linkedin: `Cuando se piensa en oposiciones a Osakidetza suele venir a la mente el ámbito sanitario más conocido, pero la variedad de categorías es mucho mayor: administración, celadores, auxiliares, enfermería y muchas otras.\n\nEsto significa que hay opciones para perfiles y titulaciones muy distintos dentro de la sanidad pública vasca.\n\nEn Gainditu recopilamos las convocatorias a medida que se publican, para que sea fácil ver qué se ajusta a cada perfil 👉 ${DOMINIO}/convocatorias\n\n#oposiciones #Osakidetza #Euskadi`,
    },
    {
        id: "org-ertzaintza", tema: "Ertzaintza / seguridad",
        x: `La Ertzaintza es una de las salidas más buscadas en Euskadi, y se entiende: estabilidad y buenas condiciones.\n\nEs exigente, también en lo físico.\n\nCuanto antes empieces a prepararte, mejor llegarás.`,
        linkedin: `La Ertzaintza es una de las oposiciones con más demanda en Euskadi, por la estabilidad y las condiciones que ofrece el puesto.\n\nEs también un proceso exigente, que combina la parte de conocimientos con pruebas físicas y otras fases. Por eso, una preparación temprana y bien planificada marca la diferencia frente a quien empieza con el plazo encima.\n\nInformarse de los requisitos y organizar el estudio con tiempo es el primer paso para afrontarla con garantías.\n\n#oposiciones #Ertzaintza #Euskadi`,
    },
    {
        id: "org-por-donde-empezar", tema: "Por dónde empezar",
        x: `Si nunca has opositado, el primer paso no es el temario.\n\nEs elegir bien la oposición y montar un plan realista.\n\nEmpieza por ahí, con calma. Lo demás llega solo cuando tienes rumbo.`,
        linkedin: `Una duda muy común entre quienes se plantean opositar por primera vez es por dónde empezar. Y, aunque parezca lo contrario, el primer paso no es abrir el temario.\n\nLo primero es elegir bien la oposición —según titulación, plazas y dificultad— y montar un plan de estudio realista, ajustado al tiempo disponible. Con esa base, el estudio diario resulta mucho más llevadero.\n\nEn Gainditu ofrecemos herramientas para ambas cosas: un recomendador de oposición y un generador de plan 👉 ${DOMINIO}/herramientas\n\n#oposiciones #empleopúblico #Euskadi`,
    },
    {
        id: "org-pequenos-avances", tema: "Sumar pequeños avances",
        x: `No hace falta el día perfecto de ocho horas de estudio.\n\nHace falta el día normal de dos, repetido muchas veces.\n\nLas oposiciones se sacan sumando ratos pequeños, no con hazañas de un solo día.`,
        linkedin: `Existe la idea de que para opositar hay que dedicar jornadas maratonianas de estudio, y suele desanimar más que ayudar.\n\nLa realidad es que las oposiciones se sacan sumando: sesiones moderadas y regulares, repetidas durante meses, rinden mucho más que esfuerzos puntuales e intensos que acaban en agotamiento.\n\nAvanzar un poco cada día, de forma sostenible, es la estrategia más efectiva a largo plazo. Una buena planificación ayuda a mantener ese ritmo sin quemarse.\n\n#oposiciones #constancia #estudio`,
    },
    {
        id: "org-perfil-trabajas", tema: "Perfil · Trabajas y opositas",
        x: `Si opositas trabajando, olvídate de las sesiones de 4 horas: no las vas a tener.\n\nTu técnica es otra: microbloques.\n\n25 minutos en el descanso, 25 antes de cenar. Suena a poco, pero sumado y constante avanza muchísimo.`,
        linkedin: `Para quien prepara una oposición mientras trabaja, la técnica no puede ser la misma que la de alguien con el día libre.\n\nLas sesiones largas simplemente no existen, así que la clave está en los microbloques: tramos cortos de estudio (20-30 minutos) aprovechando los huecos del día. Sumados y sostenidos, avanzan más de lo que parece.\n\nLo importante no es la duración de cada sesión, sino no perder ningún día. En Gainditu la planificación se adapta a ese tipo de agenda.\n\n#oposiciones #conciliación #empleopúblico`,
    },
    {
        id: "org-perfil-retorno", tema: "Perfil · Vuelves tras años sin estudiar",
        x: `¿Hace años que no coges un libro? Normal que al principio cueste arrancar.\n\nLa memoria es como un músculo: se recupera.\n\nEmpieza suave, con temas cortos y repasando a menudo. En unas semanas notarás que vuelves a coger ritmo.`,
        linkedin: `Retomar el estudio después de años fuera intimida, pero es más habitual de lo que parece entre quienes opositan.\n\nAl principio cuesta concentrarse y retener, y es normal: la capacidad de estudio se recupera con la práctica. La clave está en empezar de forma progresiva, con temas cortos y repasos frecuentes, sin exigirse el ritmo del primer día.\n\nEn pocas semanas el hábito vuelve. En Gainditu acompañamos también ese reinicio, paso a paso.\n\n#oposiciones #empleopúblico #Euskadi`,
    },
    {
        id: "org-perfil-graduado", tema: "Perfil · Recién graduado",
        x: `Si vienes de la uni, tienes una ventaja: el hábito de examen aún está caliente.\n\nApróvéchalo antes de que se enfríe.\n\nEl riesgo es relajarse pensando "esto ya sé hacerlo". Ponte rutina desde ya y no la sueltes.`,
        linkedin: `Quien acaba de terminar los estudios parte con una ventaja clara al opositar: el hábito de examen y de estudio todavía está activo.\n\nEs el mejor momento para encadenar con una oposición, aprovechando esa inercia antes de que se enfríe. El principal riesgo es la falsa confianza: dar por hecho que "ya se sabe estudiar" y descuidar la rutina.\n\nMantener desde el inicio un plan constante marca la diferencia. En Gainditu ayudamos a estructurarlo.\n\n#oposiciones #empleopúblico #Euskadi`,
    },
    {
        id: "org-perfil-movil", tema: "Perfil · Te distrae el móvil",
        x: `Si el móvil te secuestra cada 5 minutos, no es falta de fuerza de voluntad. Está diseñado para eso.\n\nLa solución no es resistirte: es quitarlo de en medio.\n\nDéjalo en otra habitación mientras estudias. Simple y brutalmente efectivo.`,
        linkedin: `La dificultad para concentrarse por culpa del móvil no es un problema de fuerza de voluntad: las aplicaciones están diseñadas para captar la atención de forma constante.\n\nPor eso la estrategia más eficaz no es "resistir la tentación", sino eliminarla del entorno: dejar el teléfono en otra habitación o fuera de vista durante las sesiones de estudio.\n\nReducir la fricción funciona mucho mejor que confiar en la disciplina. Un pequeño cambio de entorno con un gran efecto en la concentración.\n\n#oposiciones #estudio #productividad`,
    },
    {
        id: "org-perfil-memorion", tema: "Perfil · Te lo sabes pero fallas el test",
        x: `¿Te sabes el tema pero luego el test te cruje?\n\nSuele pasar por estudiar solo leyendo. Reconocer no es recuperar.\n\nHazte tests desde el primer día. Entrenar la pregunta es lo que sube la nota, no releer diez veces.`,
        linkedin: `Un patrón frecuente: dominar el temario "de leerlo" y, sin embargo, fallar en los tests.\n\nLa causa suele ser estudiar solo de forma pasiva. Reconocer la información al leerla no es lo mismo que recuperarla ante una pregunta con opciones parecidas, que es lo que exige el examen.\n\nLa solución es incorporar tests desde el principio: entrenar el formato real mejora la nota mucho más que releer. En Gainditu los tests por tema están pensados justo para eso.\n\n#oposiciones #estudio #empleopúblico`,
    },
    {
        id: "org-perfil-agobio", tema: "Perfil · Te agobia el temario enorme",
        x: `Mirar el temario entero y agobiarte es de lo más normal. 60 temas asustan a cualquiera.\n\nEl truco: no mires el bloque, mira el de hoy.\n\nUn tema. Solo ese. Mañana el siguiente. Así se come un temario, a bocados.`,
        linkedin: `Ver el temario completo de una oposición puede resultar abrumador, y esa sensación frena a mucha gente antes de empezar.\n\nUna forma sencilla de gestionarlo es cambiar el foco: en lugar de mirar el conjunto, centrarse solo en el tema del día. Dividir un objetivo grande en pasos pequeños y diarios lo hace abordable y reduce la ansiedad.\n\nEl temario se avanza "a bocados", de forma sostenida. Una buena planificación ayuda a ver ese camino con claridad.\n\n#oposiciones #estudio #empleopúblico`,
    },
    {
        id: "org-perfil-visual", tema: "Perfil · Aprendes mejor con imágenes",
        x: `Si retienes mejor lo que ves que lo que lees, usa esa baza.\n\nEsquemas, mapas mentales, colores por tipo de dato.\n\nConvierte el tema en algo que puedas "ver" de un vistazo y lo recordarás el triple.`,
        linkedin: `No todo el mundo estudia igual, y quienes tienen una memoria más visual pueden aprovecharlo a su favor.\n\nTransformar el temario en esquemas, mapas mentales o cuadros con código de color permite "ver" la estructura de un vistazo, en lugar de enfrentarse a bloques de texto. Los datos que más se escapan —fechas, plazos, números— se fijan mucho mejor cuando tienen forma y color asociados.\n\nAdaptar la técnica a cómo funciona tu memoria mejora el rendimiento.\n\n#oposiciones #estudio #tecnicasdeestudio`,
    },
    {
        id: "org-perfil-abandono", tema: "Perfil · Empiezas fuerte y lo dejas",
        x: `¿Empiezas a tope y a las tres semanas lo dejas? No eres tú, es el plan.\n\nArrancar con 5 horas al día no se sostiene.\n\nMejor 1 hora que NO falles ningún día. La cadena de días es la que aprueba, no los arranques épicos.`,
        linkedin: `Empezar con mucha intensidad y abandonar a las pocas semanas es uno de los patrones más comunes al opositar, y casi nunca es un problema de motivación: es de planteamiento.\n\nArrancar con jornadas de cinco horas es insostenible. Resulta mucho más eficaz un objetivo diario modesto pero inquebrantable —por ejemplo, una hora sin fallar ningún día—, porque lo que consolida el hábito es la continuidad, no los arranques intensos.\n\nEn Gainditu ayudamos a diseñar planes realistas, pensados para mantenerse en el tiempo.\n\n#oposiciones #constancia #empleopúblico`,
    },
]

// ── INTERACCIÓN: presentación + encuestas + preguntas a la comunidad ───────
// Tono cercano y con chispa (nada de rollo institucional aburrido). Las encuestas llevan `opciones`
// que hay que crear como encuesta NATIVA en X/LinkedIn (no se pueden pre-rellenar por enlace).
export const POSTS_INTERACCION: PostOrganico[] = [
    {
        id: "int-presentacion", tema: "Post de presentación (fíjalo)",
        x: `Hola 👋 Somos Gainditu.\n\nUna forma distinta de preparar oposiciones en Euskadi: tests, simulacros, exámenes oficiales explicados y convocatorias al día.\n\nSin rollo de academia rancia.\n\nSi vas a por tu plaza, quédate por aquí 👇\n${DOMINIO}`,
        linkedin: `Nos presentamos: somos Gainditu 👋\n\nUna plataforma para preparar oposiciones en Euskadi de forma más accesible y ordenada. Reunimos en un solo sitio lo que necesita un opositor: temario, tests por tema, simulacros cronometrados, exámenes oficiales con la explicación de cada respuesta y todas las convocatorias al día.\n\nNuestro objetivo es sencillo: que conseguir una plaza pública dependa de tu esfuerzo y tu método, no de cuánto puedas gastar en una academia.\n\nSi estás opositando o te lo estás planteando, te acompañamos desde el primer tema 👉 ${DOMINIO}\n\n#oposiciones #empleopúblico #Euskadi #Gainditu`,
    },
    {
        id: "int-enc-enemigo", tema: "Encuesta · Enemigo del estudio",
        x: `El mayor enemigo cuando te sientas a estudiar es… 👇`,
        opciones: ["El móvil", "La cama", "La nevera", "«Solo un capítulo»"],
        linkedin: `Encuesta rápida para opositores: ¿cuál es tu mayor distracción al ponerte a estudiar?`,
    },
    {
        id: "int-enc-horario", tema: "Encuesta · Mejor hora",
        x: `¿A qué hora rindes de verdad estudiando?`,
        opciones: ["Por la mañana", "Por la tarde", "De noche", "Yo no rindo 😅"],
        linkedin: `¿En qué franja del día rendís más estudiando? Nos interesa vuestra experiencia.`,
    },
    {
        id: "int-enc-cuesta", tema: "Encuesta · Lo que más cuesta",
        x: `Lo que más te cuesta de opositar:`,
        opciones: ["La constancia", "Los nervios del examen", "Memorizar leyes", "Sacar tiempo"],
        linkedin: `De todo lo que implica opositar, ¿qué es lo que más se os atraganta?`,
    },
    {
        id: "int-enc-formato", tema: "Encuesta · Papel o pantalla",
        x: `Para estudiar el temario: ¿papel o pantalla?`,
        opciones: ["Papel de toda la vida", "Todo digital", "Una mezcla de los dos"],
        linkedin: `El debate eterno del opositor: ¿estudiáis en papel o en digital?`,
    },
    {
        id: "int-enc-horas", tema: "Encuesta · Horas al día",
        x: `Sé sincero: ¿cuántas horas estudias al día?`,
        opciones: ["Menos de 1", "Entre 1 y 3", "Entre 3 y 5", "Más de 5"],
        linkedin: `¿Cuántas horas dedicáis de media al estudio cada día?`,
    },
    {
        id: "int-enc-temario", tema: "Encuesta · Cómo llevas el temario",
        x: `¿Cómo llevas el temario ahora mismo?`,
        opciones: ["Voy sobrado", "A mi ritmo", "Regulero…", "¿Qué temario?"],
        linkedin: `¿En qué punto estáis con el temario de vuestra oposición?`,
    },
    {
        id: "int-q-oposicion", tema: "Pregunta · Tu oposición",
        x: `Cuéntanos: ¿qué oposición estás preparando y en qué punto vas?\n\nTe leemos 👇 (igual no eres el único por aquí)`,
        linkedin: `¿Qué oposición estás preparando y en qué punto del camino te encuentras? Nos encanta conocer a la comunidad; cuéntanoslo en comentarios.`,
    },
    {
        id: "int-q-truco", tema: "Pregunta · Tu mejor truco",
        x: `El truco de estudio que más te ha funcionado. Uno. El mejor. 👇`,
        linkedin: `Compartamos técnicas: ¿cuál es el truco de estudio que mejor os ha funcionado preparando una oposición?`,
    },
    {
        id: "int-q-frase", tema: "Pregunta · Completa la frase",
        x: `Completa la frase:\n\n«Estoy opositando y ya casi no sé lo que es ___»`,
        linkedin: `Para quienes estáis en plena preparación: completad la frase «Estoy opositando y ya casi no sé lo que es ___». Se admiten risas.`,
    },
    {
        id: "int-q-lunes", tema: "Pregunta · El lunes ya sí",
        x: `Momento confesión 😅\n\n¿Cuántas veces has dicho «el lunes ya sí que empiezo en serio»?`,
        linkedin: `Confesión de opositor: ¿cuántas veces habéis pospuesto el arranque «hasta el lunes»? Sin juzgar a nadie.`,
    },
    {
        id: "int-q-motivo", tema: "Pregunta · Por qué opositas",
        x: `¿Por qué decidiste opositar?\n\nEstabilidad, conciliación, hartazgo del sector privado… cuéntanoslo 👇`,
        linkedin: `Cada opositor tiene su motivo: estabilidad, conciliación, vocación de servicio público… ¿Cuál es el vuestro?`,
    },
]

// Convocatorias curadas abiertas (OPEs grandes del GV, están en código no en la BD)
export function convocatoriasCuradas(): Conv[] {
    return CONVOCATORIAS
        .filter((c) => c.estado === "inscripcion-abierta")
        .map((c) => ({ slug: c.slug, nombre: c.nombre, plazas: c.plazas, organismo: c.organismo }))
}
