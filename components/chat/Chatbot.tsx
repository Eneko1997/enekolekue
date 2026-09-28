"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { precioActualCent, euros } from "@/lib/precio"

// Asistente de Gainditu. Parece IA: detecta la intención por palabras clave y
// responde al instante. Si no lo tiene claro, ofrece escribir por email SIN
// salir de la página (se envía a soporte con el email del usuario como reply-to).
// Sin emojis, acento verde de marca, sensación de "está escribiendo".

const ACCENT = "#10B981"
const KEY_OPEN = "gainditu_chat_visto"

type Cta = { label: string; href: string }
type Msg = { de: "bot" | "user"; texto: string; cta?: Cta; ofrecerEmail?: boolean }

const norm = (s: string) =>
    s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()

type Intent = { keys: string[]; resp: () => string; cta?: Cta; email?: boolean }

const INTENTS: Intent[] = [
    {
        keys: ["hola", "buenas", "kaixo", "egun on", "hey", "buenos dias", "buenas tardes", "buenas noches"],
        resp: () => "Hola, soy el asistente de Gainditu. Dime qué necesitas: precio, qué incluye el acceso, cómo entrar o recuperar tu contraseña.",
    },
    {
        keys: ["que tal", "como estas", "como andas", "como va", "que haces", "como te llamas", "quien eres", "eres un robot", "eres una ia", "eres humano", "eres real", "eres una persona", "estas ahi"],
        resp: () => "Todo bien por aquí, gracias. Soy el asistente de Gainditu y estoy para echarte una mano con tu oposición: precio, qué incluye el acceso, cómo entrar o cualquier duda de la plataforma. ¿Qué te cuento?",
    },
    {
        keys: ["precio", "cuesta", "cuanto vale", "cuanto cuesta", "coste", "valor", "cuanto es", "cuanto son", "pagar cuanto"],
        resp: () => `El acceso completo es un pago único de ${euros(precioActualCent())} €. Sin cuotas ni suscripción.`,
        cta: { label: "Ver el acceso completo", href: "/payment" },
    },
    {
        keys: ["suscripcion", "cuota", "mensual", "se renueva", "pago unico", "recurrente", "me cobran cada mes", "renovacion"],
        resp: () => "Es un pago único, no una suscripción. No se renueva ni se te vuelve a cobrar nada.",
    },
    {
        keys: ["que incluye", "que tiene", "que ofrece", "contenido", "que hay", "que entra", "acceso completo que", "que es premium", "que dan"],
        resp: () => "El acceso completo incluye tests por tema, exámenes oficiales de OPEs, casos prácticos, simulacros cronometrados, tu plan de estudio a medida, flashcards y seguimiento de tu progreso.",
        cta: { label: "Ver el acceso completo", href: "/payment" },
    },
    {
        keys: ["tarjeta", "paypal", "klarna", "bizum", "metodo de pago", "como pago", "formas de pago", "como se paga", "medios de pago"],
        resp: () => "Puedes pagar con tarjeta, PayPal o Klarna, a través de Stripe (pago 100% seguro).",
        cta: { label: "Ir al pago", href: "/payment" },
    },
    {
        keys: ["entrar", "acceder", "iniciar sesion", "login", "no puedo entrar", "no me deja entrar", "error al entrar", "me da error", "no me funciona el login", "no consigo entrar", "como entro", "contrasena incorrecta", "iniciar", "acceso a mi cuenta"],
        resp: () => "Entra con tu email y tu contraseña, o con Google. Si te da error, revisa que estén bien escritos; y si no recuerdas la contraseña, crea una nueva al momento con un código.",
        cta: { label: "Ir a acceder", href: "/login" },
    },
    {
        keys: ["contrasena", "password", "olvide", "recuperar", "restablecer", "no recuerdo mi", "cambiar contrasena", "clave"],
        resp: () => "Ve a la página de recuperar, pon tu email y te enviamos un código para crear una contraseña nueva al momento.",
        cta: { label: "Recuperar contraseña", href: "/recuperar" },
    },
    {
        keys: ["gratis", "free", "probar", "sin pagar", "plan gratis", "de prueba", "gratuito"],
        resp: () => "Puedes registrarte gratis y hacer tests para probar. Los simulacros y todo el contenido completo están en el acceso premium.",
        cta: { label: "Registrarme gratis", href: "/signup" },
    },
    {
        keys: ["simulacro", "examen completo", "examen cronometrado", "simulacros", "tiene tiempo", "cuanto dura el simulacro", "mismo numero de preguntas", "es con tiempo"],
        resp: () => "Los simulacros reproducen el examen real: el mismo número de preguntas y con tiempo, corregidos al momento con tu nota. Están dentro del acceso completo.",
    },
    {
        keys: ["oposicion", "oposiciones", "gobierno vasco", "ayuntamiento", "diputacion", "osakidetza", "administrativo", "auxiliar", "que preparo", "que oposiciones"],
        resp: () => "Cubrimos oposiciones de Euskadi: Gobierno Vasco, ayuntamientos, diputaciones forales y más, con tests por tema, exámenes oficiales y casos prácticos por escala.",
        cta: { label: "Ver convocatorias", href: "/convocatorias" },
    },
    {
        keys: ["grupo a", "tecnico de gestion", "tecnico superior", "cuerpo superior", "subgrupo a1", "subgrupo a2", "tecnico de administracion", "administracion general grupo a", "solo administrativo o", "incluye tecnico"],
        resp: () => "Sí. Además de Administrativo y Auxiliar (que es el grueso), también tienes tests y exámenes oficiales de Técnico de Gestión y Técnico Superior. Con el acceso completo entras a todo, así que puedes preparar el Grupo A con nosotros.",
        cta: { label: "Ver el acceso completo", href: "/payment" },
    },
    {
        keys: ["herramienta", "herramientas", "que herramientas", "no teneis una herramienta", "teneis herramientas", "utilidades", "que herramientas teneis", "que mas ofreceis gratis"],
        resp: () => "Sí, tenemos herramientas gratis: una calculadora de nota de corte, una calculadora de méritos del Gobierno Vasco y un análisis que te dice qué oposición encaja contigo. Las dos calculadoras ni piden cuenta.",
        cta: { label: "Ver herramientas", href: "/herramientas" },
    },
    {
        keys: ["que escala", "escala cual", "escala elijo", "cual puedo elegir", "que escala elijo", "cual me conviene", "que oposicion me conviene", "que oposicion elijo", "no se que preparar", "que puedo opositar", "cual elijo", "que escala me conviene", "no se a que presentarme", "que oposicion hago", "que opositar", "no se que oposicion"],
        resp: () => "Para eso tenemos un análisis gratis: respondes seis preguntas (tu titulación, tu nivel de euskera y lo que buscas) y te dice qué oposición de Euskadi encaja contigo, y por qué.",
        cta: { label: "Ver qué oposición elegir", href: "/herramientas/que-oposicion-elegir" },
    },
    {
        keys: ["nota de corte", "calcular mi nota", "que nota saco", "nota del examen", "calculadora de nota", "sacar mi nota", "corregir mi examen"],
        resp: () => "Tienes una calculadora de nota de corte gratis: metes aciertos, fallos y la penalización de tu convocatoria y te da tu nota al instante, sin registrarte.",
        cta: { label: "Calcular mi nota", href: "/herramientas/calculadora-nota-corte" },
    },
    {
        keys: ["meritos", "fase de concurso", "concurso oposicion", "baremo", "puntos por experiencia", "puntos de euskera", "calcular meritos", "puntuacion de meritos", "mis meritos"],
        resp: () => "Tienes una calculadora de méritos del Gobierno Vasco gratis: suma tus puntos de la fase de concurso (experiencia, titulaciones y euskera) según el baremo oficial del BOPV.",
        cta: { label: "Calcular mis méritos", href: "/herramientas/calculadora-meritos-gobierno-vasco" },
    },
    {
        keys: ["he pagado", "ya pague", "no me llega", "no tengo acceso", "compre y", "pague y no", "sin acceso tras pagar"],
        resp: () => "Tras el pago te llega un email con el acceso y una contraseña temporal. Si no lo ves, revisa la carpeta de spam. Si sigue sin aparecer, escríbenos y lo resolvemos.",
        cta: { label: "Ir a acceder", href: "/login" },
    },
    {
        keys: ["app", "movil", "aplicacion", "descargar app", "play store", "app store"],
        resp: () => "Gainditu funciona en el navegador del móvil y puedes añadirla a tu pantalla de inicio como una app. La versión para las tiendas llegará más adelante.",
    },
    {
        keys: ["cuando es el examen", "fecha del examen", "fecha de examen", "cuando examen", "convocatoria", "convocatorias", "cuando salen las plazas", "proximas plazas", "cuando es la oposicion", "fechas", "plazo de inscripcion", "inscripcion"],
        resp: () => "Las convocatorias y fechas oficiales las tienes actualizadas en la sección Convocatorias (las sacamos del BOE y el BOPV): plazos de inscripción, plazas y novedades.",
        cta: { label: "Ver convocatorias", href: "/convocatorias" },
    },
    {
        keys: ["temario", "apuntes", "material", "de donde estudio", "hay temario", "teoria", "temario desarrollado", "temario elaborado", "libro", "manual", "temario para estudiar"],
        resp: () => "Te lo digo claro: ahora mismo no incluimos temario teórico elaborado. Gainditu es la parte de práctica: tests organizados por los temas del temario oficial, exámenes oficiales, casos prácticos y simulacros. El temario lo llevas por tu cuenta y con nosotros lo consolidas y lo pones a prueba.",
    },
    {
        keys: ["por donde empiezo", "como empiezo", "primeros pasos", "acabo de registrarme", "y ahora que hago", "por donde empezar"],
        resp: () => "Lo ideal: haz el simulacro gratis para medirte, y con el acceso completo te montamos un plan de estudio a medida. Empieza por los temas comunes, que caen en casi todas.",
    },
    {
        keys: ["cuanto dura", "caduca", "hasta cuando", "vitalicio", "para siempre", "pa siempre", "de por vida", "toda la vida", "es vitalicio", "pierdo el acceso", "acceso permanente", "cuanto tiempo tengo", "duracion del acceso", "se acaba", "se caduca"],
        resp: () => "Es un pago único, sin suscripción. El acceso te dura hasta tu examen, con un mínimo de 12 meses; y si te presentas y no apruebas, te ampliamos el acceso con la garantía (cumpliendo unas condiciones de uso). No se renueva ni se te corta de un mes para otro.",
    },
    {
        keys: ["pasan 12 meses", "pasan los 12 meses", "12 meses y he", "he aprobado", "ya he aprobado", "despues de 12 meses", "despues de los 12 meses", "cuando acaben los 12 meses", "que pasa a los 12 meses", "cuando pase el ano", "cuando termine el ano", "al ano que pasa", "si ya apruebe"],
        resp: () => "Los 12 meses cubren de sobra tu convocatoria. Si para entonces ya has aprobado, enhorabuena: ya no lo necesitas. Y si te presentaste y no aprobaste, te ampliamos el acceso con la garantía para que sigas preparándote.",
    },
    {
        keys: ["actualizan", "nuevo contenido", "meten mas", "se actualiza", "añaden", "novedades contenido"],
        resp: () => "Sí, añadimos nuevos exámenes oficiales, casos prácticos y preguntas cada poco. Por eso el precio sube un poco cada mes: entras al más bajo cuanto antes lo hagas.",
    },
    {
        keys: ["cambia la normativa", "cambio de normativa", "nueva ley", "cambio de ley", "reforma legal", "actualizan las preguntas", "revisais las preguntas", "estan actualizadas", "actualizadas a la ley", "normativa vigente"],
        resp: () => "Sí. Revisamos el banco de preguntas y, cuando cambia la normativa, actualizamos lo que se ve afectado para que estudies con lo vigente.",
    },
    {
        keys: ["es seguro", "seguro pagar", "es fiable", "estafa", "confianza", "pago seguro", "me fio"],
        resp: () => "El pago es 100% seguro a través de Stripe. Nosotros no vemos ni guardamos los datos de tu tarjeta en ningún momento.",
    },
    {
        keys: ["flashcards", "plan de estudio", "mi progreso", "seguimiento", "repaso de fallos", "mi plan"],
        resp: () => "Con el acceso completo tienes flashcards por materia, un plan de estudio a medida y seguimiento de tu progreso, con repaso automático de tus fallos.",
    },
    {
        keys: ["requisitos", "puedo presentarme", "necesito titulo", "titulacion", "requisito para"],
        resp: () => "Los requisitos de cada plaza (titulación, etc.) vienen en su convocatoria oficial. Los tienes en la sección Convocatorias.",
        cta: { label: "Ver convocatorias", href: "/convocatorias" },
    },
    {
        keys: ["descuento", "codigo promocional", "oferta", "cupon", "rebaja", "promo", "mas barato"],
        resp: () => "Ahora mismo no usamos códigos de descuento. El precio de lanzamiento es el más bajo y sube cada mes, así que el mejor momento es ahora.",
        cta: { label: "Ver el acceso completo", href: "/payment" },
    },
    {
        keys: ["euskera", "en euskera", "esta en euskera", "castellano", "idioma", "euskaraz", "perfil linguistico", "preparais el euskera", "examen de euskera", "nivel de euskera", "ega", "habe"],
        resp: () => "El contenido está en castellano. No preparamos el examen de euskera ni los perfiles lingüísticos (EGA, HABE): nos centramos en la parte de oposición.",
    },
    {
        keys: ["factura", "necesito factura", "iva", "facturar", "datos fiscales"],
        resp: () => "Podemos emitirte factura sin problema. Escríbenos con tus datos y te la enviamos.",
        email: true,
    },
    {
        keys: ["devolucion", "reembolso", "me arrepiento", "cancelar compra", "recuperar mi dinero", "devolver", "periodo de prueba", "garantia", "y si no apruebo"],
        resp: () => "Tienes 7 días de devolución si ves que no es para ti. Y antes de pagar puedes probar gratis registrándote, con tests y un simulacro completo. Además, si te presentas y no apruebas, te ampliamos el acceso con la garantía.",
    },
    {
        keys: ["cambiar email", "cambiar mi correo", "cambiar mis datos", "actualizar datos", "cambiar el email"],
        resp: () => "La contraseña puedes cambiarla tú desde tu perfil. Para cambiar el email de la cuenta, escríbenos y lo hacemos nosotros.",
        email: true,
    },
    {
        keys: ["hablar con alguien", "contacto", "atencion al cliente", "persona", "humano", "hablar con vosotros", "quiero hablar", "soporte"],
        resp: () => "Claro, te leemos. Cuéntanos tu duda por email y te respondemos personalmente.",
        email: true,
    },
    {
        keys: ["penalizan", "penalizacion", "restan los fallos", "restan", "como se corrige", "como puntua", "como se puntua", "aciertos y fallos", "los errores restan", "descuentan"],
        resp: () => "Los tests se corrigen al momento con penalización por error, igual que en el examen real: los fallos restan. Ves tu nota y el desglose por áreas.",
    },
    {
        keys: ["cuantas preguntas", "numero de preguntas", "cuantos tests", "cuantas hay por test", "preguntas por test"],
        resp: () => "Cada test tiene 30 preguntas. Los simulacros reproducen el número real de preguntas de cada examen.",
    },
    {
        keys: ["donde veo mi nota", "mis resultados", "mi progreso", "mis notas", "estadisticas", "ver mi evolucion", "donde estan mis resultados"],
        resp: () => "En tu perfil, en Mi Progreso, tienes tus resultados, tu evolución en el tiempo y el mapa por materias con lo que llevas mejor y peor.",
    },
    {
        keys: ["repetir test", "volver a hacer", "reiniciar", "hacer otra vez", "repetir los tests", "puedo repetir"],
        resp: () => "Puedes repetir los tests las veces que quieras. Además, las preguntas y las opciones se barajan para que no te lo aprendas de memoria.",
    },
    {
        keys: ["varios dispositivos", "movil y ordenador", "otro dispositivo", "misma cuenta en", "en el movil y el pc", "cuantos dispositivos"],
        resp: () => "Puedes usar tu cuenta en el móvil y en el ordenador con el mismo email, sin límite de dispositivos.",
    },
    {
        keys: ["sin internet", "offline", "sin conexion", "descargar para usar", "necesito internet"],
        resp: () => "Gainditu funciona online. Puedes añadirla a la pantalla de inicio del móvil como una app, pero necesita conexión.",
    },
    {
        keys: ["avisos", "avisar convocatoria", "notificar", "alerta", "me avisais", "que me aviseis", "aviso de convocatorias"],
        resp: () => "Sí, puedes activar avisos y te avisamos por email cuando salga una convocatoria o cuando esté a punto de cerrarse el plazo.",
        cta: { label: "Ver convocatorias", href: "/convocatorias" },
    },
    {
        keys: ["examenes oficiales", "examenes reales", "examenes anteriores", "examenes de otros años", "examen real"],
        resp: () => "Sí, tienes exámenes oficiales reales de OPEs anteriores, servidos tal y como cayeron, para entrenar con lo de verdad.",
    },
    {
        keys: ["casos practicos", "supuestos practicos", "practico", "supuesto practico", "cuantos casos", "parte b", "cada cuanto", "con que frecuencia"],
        resp: () => "Un caso práctico es un supuesto tipo examen: te plantean una situación real y respondes preguntas sobre ella. Ahora mismo tienes alrededor de 10 (oficiales de exámenes anteriores y propios de Gainditu), y subimos nuevos casi cada semana. Todo dentro del acceso completo.",
    },
    {
        keys: ["quienes sois", "quien esta detras", "sois una academia", "de donde sois", "quien lleva esto"],
        resp: () => "Somos Gainditu: una plataforma para preparar oposiciones de Euskadi de forma autónoma, a tu ritmo y con material de calidad.",
    },
    {
        keys: ["mis datos", "privacidad", "rgpd", "protegidos", "que haceis con mis datos", "proteccion de datos"],
        resp: () => "Tratamos tus datos con cuidado y solo para prestarte el servicio. Tienes el detalle en la política de privacidad, en el pie de la web.",
    },
    {
        keys: ["certificado", "titulo al acabar", "diploma", "acredita", "dais titulo"],
        resp: () => "Gainditu es para prepararte lo mejor posible; no emitimos títulos ni certificados oficiales (eso lo da la administración al aprobar).",
    },
    {
        keys: ["cambiar de oposicion", "otra oposicion", "varias oposiciones", "sirve para otra", "preparar dos"],
        resp: () => "Con el acceso completo entras a todo el contenido, así que puedes preparar la escala que quieras y cambiar cuando te haga falta.",
    },
    {
        keys: ["modo oscuro", "tema oscuro", "modo noche", "poner oscuro", "modo claro", "cambiar el tema"],
        resp: () => "Puedes cambiar entre claro y oscuro con el botón de sol/luna de la barra de arriba.",
    },
    {
        keys: ["no me llega el email", "no recibo el correo", "no me llega el codigo", "no me ha llegado", "no llega el correo", "no me llego"],
        resp: () => "Revisa las carpetas de spam y promociones. Si en unos minutos no aparece, vuelve a pedirlo; y si sigue sin llegar, escríbenos y lo resolvemos.",
        email: true,
    },
    {
        keys: ["darme de baja", "no quiero emails", "dejar de recibir", "unsubscribe", "quitar correos", "baja de correos"],
        resp: () => "Puedes darte de baja de los correos desde el enlace del final de cualquier email que te enviamos.",
    },
    {
        keys: ["nivel", "dificultad", "son dificiles", "nivel real", "que nivel", "muy dificil"],
        resp: () => "Las preguntas siguen el nivel y el estilo de los exámenes oficiales, para que entrenes tal como será el día real.",
    },
    {
        keys: ["explicacion", "explican por que", "por que es correcta", "razona la respuesta", "vienen explicadas", "justificacion", "explicais las preguntas", "solucion explicada"],
        resp: () => "Sí. Cada pregunta lleva su explicación de por qué esa es la respuesta correcta, para que aprendas del fallo y no solo memorices.",
    },
    {
        keys: ["por materia", "una sola materia", "solo una materia", "solo un tema", "elegir materia", "estudiar un tema concreto", "tests por materia", "practicar una ley", "ley 39 sola", "materia concreta"],
        resp: () => "Sí. Puedes practicar por materias y por temas concretos (por ejemplo solo la Ley 39/2015), además de por bloques del temario oficial.",
    },
    {
        keys: ["repasar mis fallos", "repaso de fallos", "solo mis fallos", "donde fallo", "mis errores", "volver a mis fallos", "que fallo mas", "repasar lo que fallo"],
        resp: () => "Sí. Con el acceso completo tienes el repaso de fallos: reagrupa las preguntas que fallaste y te muestra un mapa por materias con lo que llevas mejor y peor.",
    },
    {
        keys: ["reto diario", "test del dia", "micro test", "microtest", "pregunta del dia", "un test gratis al dia", "reto del dia"],
        resp: () => "Sí, tienes el micro-test del día: un reto gratis de 6 preguntas que cambia cada día. Ideal para no perder el ritmo.",
        cta: { label: "Ver herramientas", href: "/herramientas" },
    },
    {
        keys: ["impugnar", "pregunta mal", "esta mal la pregunta", "reclamar una pregunta", "pregunta incorrecta", "creo que esta mal", "error en una pregunta", "pregunta erronea", "respuesta mal", "respuesta esta mal", "esta mal la respuesta", "respuesta incorrecta", "respuesta equivocada", "respuesta erronea", "la correcta esta mal", "no es la respuesta correcta", "la solucion esta mal", "preguntas mal", "estan mal las respuestas", "hay un fallo", "esta equivocada", "el resultado esta mal"],
        resp: () => "Puede pasar, y nos ayuda mucho que lo digas. En cada pregunta tienes un botón para impugnarla: nos la marcas, la revisamos y, si hay error, la corregimos. Gracias por avisar.",
    },
    {
        keys: ["a plazos", "fraccionar", "pagar poco a poco", "financiar", "pago aplazado", "en varios pagos", "dividir el pago", "pagar en cuotas"],
        resp: () => "Sí, con Klarna puedes fraccionar el pago en varias veces. Lo eliges en la pantalla de pago.",
        cta: { label: "Ir al pago", href: "/payment" },
    },
    {
        keys: ["por que sube el precio", "por que sube", "sube de precio", "por que cada mes mas", "por que sube cada mes", "subida de precio", "el precio sube"],
        resp: () => "El precio sube un poco cada mes porque no paramos de añadir contenido (exámenes, casos, preguntas). Como es un pago único, quien entra antes se queda con el precio más bajo para siempre.",
        cta: { label: "Ver el acceso completo", href: "/payment" },
    },
    {
        keys: ["clases", "videos", "video clases", "hay profesor", "clases en directo", "clases grabadas", "teneis clases", "tutorias", "clases online", "profesor que explique"],
        resp: () => "De momento no tenemos clases ni vídeos con profesor. Gainditu es autoestudio con mucha práctica: tests, exámenes oficiales, casos prácticos y simulacros para que domines el examen.",
    },
    {
        keys: ["compartir cuenta", "compartir mi cuenta", "usar entre dos", "dos personas una cuenta", "prestar la cuenta", "compartir el acceso", "cuenta compartida"],
        resp: () => "La cuenta es personal e intransferible. Compartirla va contra las condiciones y puede suponer la suspensión del acceso.",
    },
    {
        keys: ["cuantas preguntas en total", "cuantas preguntas hay", "total de preguntas", "cuantas preguntas teneis", "numero total de preguntas", "banco de preguntas", "cuantas preguntas tiene"],
        resp: () => "Tienes más de 5.000 preguntas de calidad, organizadas por materia y por tema, además de los exámenes oficiales y los casos prácticos.",
    },
    {
        keys: ["examenes escritos", "examen escrito", "de desarrollo", "supuesto de desarrollo", "prueba escrita", "parte escrita", "desarrollar por escrito"],
        resp: () => "Estamos desarrollando exámenes escritos (de desarrollo, no tipo test), con corrección por rúbrica. Están en fase beta y los iremos ampliando.",
    },
    {
        keys: ["adios", "hasta luego", "chao", "me voy", "nos vemos", "agur", "hasta pronto"],
        resp: () => "Hasta pronto. Aquí estaré cuando me necesites. Mucho ánimo con la preparación.",
    },
    {
        keys: ["vale", "de acuerdo", "entendido", "perfecto", "genial", "estupendo", "guay", "vale gracias"],
        resp: () => "Genial. Si te surge cualquier otra duda, aquí me tienes.",
    },
    {
        keys: ["me lo pienso", "lo pensare", "me lo tengo que pensar", "ya vere", "me lo miro", "lo consultare"],
        resp: () => "Claro, sin prisa. Puedes probar gratis registrándote y, cuando lo veas, el precio de hoy es el más bajo. Aquí estaré.",
        cta: { label: "Probar gratis", href: "/signup" },
    },
    {
        keys: ["no se que preguntar", "que me puedes contar", "que puedes hacer", "para que sirves", "en que me ayudas", "que me ofreces", "que sabes hacer"],
        resp: () => "Te ayudo con todo lo de Gainditu: precio, qué incluye, cómo entrar, convocatorias, herramientas o qué oposición elegir. Dime por dónde empezamos.",
    },
    {
        keys: ["eres majo", "me caes bien", "jaja", "jeje", "que gracioso", "eres simpatico", "buen bot", "me gusta hablar contigo"],
        resp: () => "Gracias. Yo a lo mío: ayudarte a sacar tu plaza. ¿Te echo una mano con algo?",
    },
    {
        keys: ["gracias", "eskerrik", "muchas gracias", "perfecto gracias"],
        resp: () => "De nada. Si te surge cualquier otra cosa, dímelo.",
    },
]

function responder(input: string): { texto: string; cta?: Cta; email?: boolean } | null {
    const t = norm(input)
    if (!t) return null
    let best: Intent | null = null
    let score = 0
    for (const it of INTENTS) {
        let s = 0
        // Puntúa por número de palabras de la clave: así una frase específica
        // ("cuando es el examen") gana a términos genéricos sueltos ("gobierno vasco").
        for (const k of it.keys) if (t.includes(k)) s += k.split(" ").length
        if (s > score) { score = s; best = it }
    }
    if (!best || score === 0) return null
    return { texto: best.resp(), cta: best.cta, email: best.email }
}

// Clave de conversación (por pestaña) para agrupar los mensajes en Captación.
function chatKey(): string {
    try {
        let k = sessionStorage.getItem("gainditu_chat_key")
        if (!k) {
            k = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2)
            sessionStorage.setItem("gainditu_chat_key", k)
        }
        return k
    } catch {
        return "anon"
    }
}

// Revela el texto poco a poco, como si se estuviera escribiendo.
function Typewriter({ text, onTick, onDone }: { text: string; onTick?: () => void; onDone?: () => void }) {
    const [n, setN] = useState(0)
    const tickRef = useRef(onTick)
    const doneRef = useRef(onDone)
    tickRef.current = onTick
    doneRef.current = onDone
    useEffect(() => {
        const step = Math.max(1, Math.round(text.length / 70))
        let i = 0
        setN(0)
        const id = setInterval(() => {
            i = Math.min(text.length, i + step)
            setN(i)
            tickRef.current?.()
            if (i >= text.length) {
                clearInterval(id)
                doneRef.current?.()
            }
        }, 18)
        return () => clearInterval(id)
    }, [text])
    return <>{text.slice(0, n)}</>
}

// Burbuja del bot: escribe el texto y, al terminar, muestra el botón (si lo hay).
function BotBubble({ m, onEmail, scroll }: { m: Msg; onEmail: () => void; scroll: () => void }) {
    const [done, setDone] = useState(false)
    return (
        <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-3.5 py-2.5 text-[13.5px] leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                <Typewriter text={m.texto} onTick={scroll} onDone={() => { setDone(true); scroll() }} />
                {done && m.cta && (
                    <a href={m.cta.href} className="mt-2 block w-fit rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-white" style={{ background: ACCENT }}>
                        {m.cta.label} →
                    </a>
                )}
                {done && m.ofrecerEmail && (
                    <button type="button" onClick={onEmail} className="mt-2 block w-fit rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-white" style={{ background: ACCENT }}>
                        Escribirnos por email
                    </button>
                )}
            </div>
        </div>
    )
}

const CHIPS = ["¿Cuánto cuesta?", "¿Qué incluye?", "No puedo entrar", "Recuperar contraseña"]

export default function Chatbot() {
    const pathname = usePathname() || "/"
    const [open, setOpen] = useState(false)
    const [msgs, setMsgs] = useState<Msg[]>([])
    const [input, setInput] = useState("")
    const [typing, setTyping] = useState(false)
    const [modo, setModo] = useState<"chat" | "form">("chat")
    const [fNombre, setFNombre] = useState("")
    const [fEmail, setFEmail] = useState("")
    const [fMsg, setFMsg] = useState("")
    const [enviando, setEnviando] = useState(false)
    const [fError, setFError] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    // No mostrar durante un test (distrae) ni en el panel admin.
    const oculto = pathname.startsWith("/test") || pathname.startsWith("/admin")

    useEffect(() => {
        if (open && msgs.length === 0) {
            setMsgs([{ de: "bot", texto: "Hola, soy el asistente de Gainditu. Cuéntame tu duda y te ayudo." }])
        }
    }, [open, msgs.length])

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [msgs, typing, modo])

    if (oculto) return null

    function empujar(m: Msg) {
        setMsgs((prev) => [...prev, m])
    }

    function scrollAhora() {
        const el = scrollRef.current
        if (el) el.scrollTop = el.scrollHeight
    }

    // Guarda la conversación para poder verla en Captación (no bloquea el chat).
    function logChat(pregunta: string, respuesta: string, sinMatch: boolean) {
        try {
            createClient()
                .rpc("chat_log", { p_key: chatKey(), p_pregunta: pregunta, p_respuesta: respuesta, p_sin_match: sinMatch, p_path: pathname })
                .then(() => {}, () => {})
        } catch { /* noop */ }
    }

    function enviar(texto: string) {
        const t = texto.trim()
        if (!t || typing) return
        empujar({ de: "user", texto: t })
        setInput("")
        setTyping(true)
        const r = responder(t)
        const respTexto = r
            ? r.texto
            : "Perdona, eso no lo tengo del todo claro. Estoy sobre todo para ayudarte con Gainditu: precio, qué incluye el acceso, cómo entrar, convocatorias… Si es otra cosa o prefieres que lo vea una persona, te ayudamos por email."
        // Pequeña pausa de "pensando" antes de empezar a escribir.
        const delay = 450 + Math.min(650, respTexto.length * 6)
        setTimeout(() => {
            setTyping(false)
            empujar({ de: "bot", texto: respTexto, cta: r?.cta, ofrecerEmail: r ? r.email : true })
            logChat(t, respTexto, !r)
        }, delay)
    }

    function abrirFormulario() {
        // Prefill el mensaje con la última pregunta del usuario.
        const ultima = [...msgs].reverse().find((m) => m.de === "user")
        setFMsg(ultima?.texto ? `${ultima.texto}\n` : "")
        setModo("form")
        setFError("")
    }

    async function enviarEmail(e: React.FormEvent) {
        e.preventDefault()
        setFError("")
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fEmail)) return setFError("Escribe un email válido.")
        if (fMsg.trim().length < 2) return setFError("Cuéntanos tu duda.")
        setEnviando(true)
        try {
            const supabase = createClient()
            await supabase.functions.invoke("soporte-email", {
                body: { nombre: fNombre, email: fEmail, mensaje: fMsg, contexto: pathname },
            })
            setModo("chat")
            empujar({ de: "bot", texto: "Recibido. Te responderemos a tu email lo antes posible." })
            logChat(fMsg.trim(), "[Consulta enviada por email desde el chat]", false)
        } catch {
            setFError("No se pudo enviar. Inténtalo de nuevo en un momento.")
        }
        setEnviando(false)
    }

    return (
        <>
            {/* Burbuja */}
            {!open && (
                <button
                    type="button"
                    onClick={() => { setOpen(true); try { localStorage.setItem(KEY_OPEN, "1") } catch {} }}
                    aria-label="Abrir el asistente de Gainditu"
                    className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl shadow-emerald-900/25 transition-transform hover:scale-105"
                    style={{ background: ACCENT }}
                >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
                    </svg>
                </button>
            )}

            {/* Panel */}
            {open && (
                <div className="fixed bottom-0 right-0 z-50 flex h-[100dvh] w-full flex-col bg-white shadow-2xl dark:bg-zinc-900 sm:bottom-4 sm:right-4 sm:h-[560px] sm:max-h-[calc(100dvh-2rem)] sm:w-[380px] sm:rounded-3xl sm:border sm:border-zinc-200 sm:dark:border-zinc-800">
                    {/* Cabecera */}
                    <div className="flex items-center justify-between rounded-none px-4 py-3.5 sm:rounded-t-3xl" style={{ background: "#0B0C10", paddingTop: "calc(0.875rem + env(safe-area-inset-top))" }}>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: ACCENT }}>
                                <span className="text-[15px] font-extrabold text-white">g</span>
                            </span>
                            <div className="leading-tight">
                                <div className="text-[14px] font-bold text-white">Asistente Gainditu</div>
                                <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
                                    Normalmente responde al momento
                                </div>
                            </div>
                        </div>
                        <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 px-4 py-4 dark:bg-zinc-950/40">
                        {msgs.map((m, i) =>
                            m.de === "user" ? (
                                <div key={i} className="flex justify-end">
                                    <div className="max-w-[82%] rounded-2xl rounded-br-md px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white" style={{ background: ACCENT }}>
                                        {m.texto}
                                    </div>
                                </div>
                            ) : (
                                <BotBubble key={i} m={m} onEmail={abrirFormulario} scroll={scrollAhora} />
                            )
                        )}

                        {typing && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-3.5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.2s]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.1s]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                                </div>
                            </div>
                        )}

                        {/* Sugerencias iniciales */}
                        {modo === "chat" && msgs.length <= 1 && !typing && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {CHIPS.map((c) => (
                                    <button key={c} type="button" onClick={() => enviar(c)} className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[12.5px] font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Zona inferior: chat o formulario de email */}
                    {modo === "chat" ? (
                        <form
                            onSubmit={(e) => { e.preventDefault(); enviar(input) }}
                            className="flex items-center gap-2 border-t border-zinc-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-zinc-900"
                            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu duda…"
                                className="flex-1 rounded-full border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                            />
                            <button type="submit" aria-label="Enviar" disabled={!input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40" style={{ background: ACCENT }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={enviarEmail} className="space-y-2 border-t border-zinc-200 bg-white px-3.5 py-3 dark:border-zinc-800 dark:bg-zinc-900" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
                            <div className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">Te respondemos por email</div>
                            <input value={fNombre} onChange={(e) => setFNombre(e.target.value)} placeholder="Nombre (opcional)" className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                            <input value={fEmail} onChange={(e) => setFEmail(e.target.value)} type="email" placeholder="Tu email" className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                            <textarea value={fMsg} onChange={(e) => setFMsg(e.target.value)} rows={3} placeholder="Tu duda" className="w-full resize-none rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100" />
                            {fError && <p className="text-[12px] text-red-500">{fError}</p>}
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setModo("chat")} className="rounded-full border border-zinc-300 px-3 py-2 text-[12.5px] font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
                                    Volver
                                </button>
                                <button type="submit" disabled={enviando} className="flex-1 rounded-full px-3 py-2 text-[12.5px] font-bold text-white disabled:opacity-60" style={{ background: ACCENT }}>
                                    {enviando ? "Enviando…" : "Enviar"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </>
    )
}
