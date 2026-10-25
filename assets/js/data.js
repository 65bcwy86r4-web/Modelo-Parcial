// Datos de los 3 modelos de parcial — Recuperatorio Segundo Parcial (U6-U14)
// Conocimientos Aeronáuticos y Espaciales 1
const MODELS = [
  {
    id: 1,
    title: "Modelo de Parcial 1",
    tag: "Práctica",
    subtitle: "Cohete 1 vs. 2 etapas · Tabs",
    practical: {
      title: "Ejercicio práctico: cohete de una etapa vs. dos etapas (mismos recursos)",
      statement: `<p>Se dispone de los siguientes recursos totales para construir un lanzador:</p>
        <ul class="data-list">
          <li>Masa de carga útil: $M_L = 2\\,000\\ \\text{kg}$.</li>
          <li>Masa total de propulsante disponible: $M_P = 180\\,000\\ \\text{kg}$.</li>
          <li>Masa total de estructura disponible: $M_S = 20\\,000\\ \\text{kg}$.</li>
          <li>Velocidad efectiva de escape del propulsante: $V_e = 2\\,950\\ \\text{m/s}$ (igual en cualquier configuración).</li>
        </ul>`,
      table: null,
      payload: "",
      asks: [
        "Calcular el $\\Delta V$ que se obtiene si <strong>todo</strong> el propulsante y <strong>toda</strong> la estructura se usan en un cohete de <strong>una sola etapa</strong> (monolítico), que luego de quemar todo el propulsante queda con $M_b = M_L + M_S$.",
        "Calcular el $\\Delta V$ total si, con los <strong>mismos recursos totales</strong>, el cohete se divide en <strong>dos etapas iguales</strong> (cada una con la mitad del propulsante y la mitad de la estructura). Calcular $R_1$, $R_2$, $\\Delta V_1$, $\\Delta V_2$ y el $\\Delta V$ total.",
        "Comparar los resultados de a) y b): ¿qué ganancia porcentual en $\\Delta V$ se obtiene al dividir el vehículo en dos etapas, usando exactamente la misma masa total de propulsante, estructura y carga útil? Justifique físicamente por qué ocurre esa diferencia.",
      ],
      resolution: `
        <p><strong>a) Una sola etapa:</strong></p>
        <p>$$\\begin{aligned}M_0 &= M_L+M_P+M_S\\\\&= 2\\,000+180\\,000+20\\,000\\\\&= 202\\,000\\ \\text{kg}\\\\[4pt]M_b &= M_L+M_S = 2\\,000+20\\,000\\\\&= 22\\,000\\ \\text{kg}\\end{aligned}$$</p>
        <p>$$R = \\frac{202\\,000}{22\\,000} = 9{,}182$$</p>
        <p>$$\\begin{aligned}\\Delta V_{1\\ etapa} &= 2950\\cdot\\ln(9{,}182)\\\\&= 2950\\cdot 2{,}2173\\\\&= \\boxed{6\\,541\\ \\text{m/s}}\\end{aligned}$$</p>
        <p><strong>b) Dos etapas iguales</strong> (mitad de propulsante y mitad de estructura en cada una):</p>
        <p>$$\\begin{aligned}R_1 &= \\frac{M_L+M_P+M_S}{M_L+\\frac{M_P}{2}+M_S}\\\\&= \\frac{202\\,000}{2\\,000+90\\,000+20\\,000}\\\\&= \\frac{202\\,000}{112\\,000}\\\\&= 1{,}804\\end{aligned}$$</p>
        <p>$$\\begin{aligned}R_2 &= \\frac{M_L+\\frac{M_P}{2}+\\frac{M_S}{2}}{M_L+\\frac{M_S}{2}}\\\\&= \\frac{2\\,000+90\\,000+10\\,000}{2\\,000+10\\,000}\\\\&= \\frac{102\\,000}{12\\,000}\\\\&= 8{,}50\\end{aligned}$$</p>
        <p>$$\\begin{aligned}\\Delta V_1 &= 2950\\cdot\\ln(1{,}804) = 1\\,740\\ \\text{m/s}\\\\\\Delta V_2 &= 2950\\cdot\\ln(8{,}50) = 6\\,313\\ \\text{m/s}\\end{aligned}$$</p>
        <p>$$\\Delta V_{2\\ etapas} = 1\\,740+6\\,313 = \\boxed{8\\,053\\ \\text{m/s}}$$</p>
        <p><strong>c) Comparación:</strong></p>
        <p>$$\\begin{aligned}\\frac{\\Delta V_{2\\ etapas}-\\Delta V_{1\\ etapa}}{\\Delta V_{1\\ etapa}} &= \\frac{8\\,053-6\\,541}{6\\,541}\\\\&= 23{,}1\\ \\%\\end{aligned}$$</p>
        <p class="note">Con exactamente los mismos recursos (misma masa total de propulsante, estructura y carga útil), <strong>dividir el cohete en dos etapas da un 23&nbsp;% más de $\\Delta V$</strong>. La razón física: al quemarse la primera etapa, su estructura (ya vacía) se <strong>descarta</strong>, de modo que la segunda etapa solo tiene que seguir acelerando su propia estructura y la carga útil, no la estructura "muerta" de la primera. En el cohete monolítico, en cambio, toda la estructura (incluida la que ya cumplió su función) se sigue acelerando hasta el final.</p>
      `,
    },
    theoretical: {
      title: "Desarrollo teórico",
      prompt: "Explique de manera completa y detallada la clasificación de los <strong>tabs</strong> en las superficies de mando. Desarrolle la clasificación por <strong>modo de mando</strong> (tab de mando directo e indirecto), la clasificación por <strong>función</strong> (tab auxiliar de control y tab de compensación), y el <strong>tab ajustable en tierra</strong>, el <strong>anti-tab</strong>, el <strong>servo-tab</strong> y el <strong>tab con resorte</strong>, explicando en qué caso se usa cada uno y cómo varía su efecto con la velocidad de vuelo. Incluya esquemas ilustrativos de al menos dos de estas variantes.",
      resolution: [
        "<strong>Modo de mando:</strong> indirecto (el tab está ligado al plano fijo; el piloto mueve la superficie principal y esto hace girar el tab) vs. directo (el piloto se conecta al tab, que arrastra a la superficie principal).",
        "<strong>Función:</strong> tab auxiliar de control (ayuda a mover la superficie principal, generando un momento de charnela favorable) vs. tab de compensación (anula la fuerza que el piloto debe ejercer para sostener una condición de vuelo).",
        "<strong>Tab ajustable en tierra:</strong> aleta fija, calibrada después de los vuelos de prueba, para corregir una tendencia no deseada del avión.",
        "<strong>Anti-tab:</strong> variante de mando indirecto cuya barra se liga a la parte superior del plano fijo; el tab se mueve en el mismo sentido que la superficie principal, <strong>aumentando</strong> (no reduciendo) el esfuerzo del piloto — usado para dar más \"sensación\" en mandos demasiado ligeros.",
        "<strong>Servo-tab:</strong> el piloto se conecta directamente al tab (mando directo), útil cuando los momentos de charnela de la superficie principal son muy grandes.",
        "<strong>Tab con resorte:</strong> un servo-tab con un resorte de torsión en su propio eje; a baja velocidad se comporta como rígido (sigue a la superficie principal); a alta velocidad el resorte se deja deformar y el tab aporta un momento de charnela creciente con $V^2$, justo cuando más se necesita.",
      ],
    },
    questions: [
      { n: 1, text: "La velocidad de escape de un cuerpo celeste depende principalmente de:", options: { A: "La masa del objeto que escapa.", B: "La masa y el radio del cuerpo celeste (no de la masa del objeto que escapa).", C: "Únicamente de la velocidad orbital circular.", D: "La forma del objeto que escapa." }, correct: "B", justification: "$V_{esc} = \\sqrt{2GM/r}$: depende de la masa y el radio del cuerpo, no de la masa del objeto." },
      { n: 2, text: "Una órbita geoestacionaria (GEO) se caracteriza por:", options: { A: "Ser polar, con período igual al día solar.", B: "Ser ecuatorial, con período igual al día sideral terrestre (≈ 35 786 km de altura).", C: "Tener la mayor excentricidad de todas las órbitas terrestres.", D: "Estar siempre por debajo de la órbita LEO." }, correct: "B", justification: "GEO: ecuatorial, período = día sideral terrestre, ≈ 35 786 km de altura." },
      { n: 3, text: "La ventana de lanzamiento de una misión es:", options: { A: "El tiempo total que dura el vuelo orbital.", B: "El período limitado (minutos, horas o días) en el que se puede lanzar sin necesitar más propelente del previsto.", C: "La altura máxima alcanzable por el lanzador.", D: "El tiempo de la cuenta regresiva completa." }, correct: "B", justification: "Ventana de lanzamiento: período acotado sin costo extra de propelente." },
      { n: 4, text: "Un ángulo de reentrada atmosférica más empinado que el óptimo genera:", options: { A: "Menor calentamiento y menores fuerzas g.", B: "Mayor calentamiento y mayores fuerzas g sobre la cápsula.", C: "Ningún cambio relevante en la carga térmica.", D: "Un aterrizaje automáticamente más preciso." }, correct: "B", justification: "Ángulo de reentrada más empinado: más calor y más fuerzas g." },
      { n: 5, text: "El ala bilarguero, la configuración más común en alas cantiléver, forma:", options: { A: "Un cajón resistente a la torsión entre ambos largueros.", B: "Una estructura que no resiste torsión.", C: "Un único larguero central con revestimiento no resistente.", D: "Una estructura exclusiva de alas arriostradas." }, correct: "A", justification: "Bilarguero: cajón resistente a la torsión." },
      { n: 6, text: "Según el apunte, los agujeros de alivianamiento en el alma de un larguero de alma llena deben tener un diámetro no inferior a:", options: { A: "50 mm.", B: "80 mm.", C: "120 mm.", D: "200 mm." }, correct: "C", justification: "Agujeros de alivianamiento: diámetro mínimo ≈ 120 mm." },
      { n: 7, text: "Entre las ventajas citadas de los materiales compuestos (fibra de carbono) frente a los metales se destaca:", options: { A: "Costo de producción siempre menor.", B: "Reducción de peso y de costo de mantenimiento (hasta un 30 %), buena moldeabilidad y resistencia a la corrosión y la fatiga.", C: "Procesos de manufactura totalmente estandarizados.", D: "Mayor densidad que el aluminio." }, correct: "B", justification: "Compuestos: reducción de peso/mantenimiento hasta 30 %, moldeabilidad, resistencia a corrosión y fatiga." },
      { n: 8, text: "La deriva (estabilizador vertical) del grupo de cola tiene como función principal:", options: { A: "Dar estabilidad direccional y asegurar el vuelo recto.", B: "Controlar el cabeceo del avión.", C: "Reemplazar al timón de profundidad.", D: "Aumentar la sustentación en despegue." }, correct: "A", justification: "Deriva: estabilidad direccional, vuelo recto." },
      { n: 9, text: "El timón de dirección de un avión convencional puede desplazarse lateralmente, a cada lado, aproximadamente:", options: { A: "10°.", B: "30°.", C: "45°.", D: "60°." }, correct: "B", justification: "Timón de dirección: ≈ 30° a cada lado." },
      { n: 10, text: "En un fuselaje presurizado, la forma de sección transversal que resulta obligatoria es:", options: { A: "Rectangular con esquinas vivas.", B: "Circular o elíptica.", C: "Trapezoidal.", D: "Cualquier forma, sin restricciones." }, correct: "B", justification: "Fuselaje presurizado: sección circular o elíptica obligatoria." },
      { n: 11, text: "La \"ley de las áreas\", aplicable en vuelo supersónico, busca:", options: { A: "Maximizar el área frontal del fuselaje.", B: "Que la distribución total del área de sección transversal (fuselaje + ala + cola) no presente cambios bruscos a lo largo del eje longitudinal.", C: "Minimizar exclusivamente el área del ala.", D: "Igualar el área del fuselaje en toda su longitud." }, correct: "B", justification: "Ley de las áreas: distribución total de área sin cambios bruscos (curva tipo campana de Gauss)." },
      { n: 12, text: "Entre las fuerzas que obran sobre el fuselaje, la acción de la deriva y el timón de dirección produce principalmente:", options: { A: "Torsión y flexión combinadas.", B: "Solo tracción pura.", C: "Solo corte en el tren de aterrizaje.", D: "Ninguna carga relevante en vuelo recto." }, correct: "A", justification: "Deriva + timón de dirección: torsión y flexión combinadas." },
      { n: 13, text: "A diferencia de los spoilers, los frenos aerodinámicos:", options: { A: "Siempre se ubican en el ala.", B: "Cortan la capa límite del extradós del ala para frenar.", C: "No cortan la capa límite del ala; solo exponen una superficie a la corriente para generar resistencia.", D: "Solo se usan en aviones de transporte comercial." }, correct: "C", justification: "Frenos aerodinámicos: no cortan la capa límite del ala, a diferencia de los spoilers." },
      { n: 14, text: "En un sistema de mando de vuelo \"ayudado\":", options: { A: "El piloto no tiene ninguna conexión mecánica con la superficie.", B: "El piloto aporta solo parte de la fuerza necesaria, con ayuda de un sistema de potencia en paralelo; sigue siendo reversible.", C: "Se requiere siempre sensación artificial.", D: "Es sinónimo de sistema de potencia completa." }, correct: "B", justification: "Sistema ayudado: el piloto aporta parte de la fuerza, sigue siendo reversible." },
      { n: 15, text: "En un sistema de mando de potencia completa (irreversible), la fuerza de sensación artificial es:", options: { A: "Constante, independiente de la velocidad.", B: "Proporcional a la velocidad.", C: "Proporcional al cuadrado de la velocidad.", D: "Inversamente proporcional a la deflexión de la superficie." }, correct: "C", justification: "Sensación artificial: proporcional a $V^2$." },
      { n: 16, text: "El flap Krueger (de borde de ataque) aumenta considerablemente el $C_{L,max}$ mientras:", options: { A: "Cambia fuertemente el ángulo de sustentación nula.", B: "El ángulo de sustentación nula y la pendiente de la curva $C_L(\\alpha)$ permanecen prácticamente inalterados.", C: "Disminuye la pendiente de la curva $C_L(\\alpha)$ a la mitad.", D: "Elimina la necesidad de slats." }, correct: "B", justification: "Flap Krueger: sube $C_{L,max}$ sin cambiar casi el ángulo de sustentación nula ni la pendiente de $C_L(\\alpha)$." },
      { n: 17, text: "Un Boletín de Servicio (Service Bulletin), a diferencia de una modificación mandatoria:", options: { A: "Es siempre obligatorio para el operador.", B: "Es una modificación recomendada, no obligatoria, para aviones ya en servicio.", C: "Condiciona por sí solo la renovación del certificado de aeronavegabilidad.", D: "Solo se emite durante la producción en serie, nunca después." }, correct: "B", justification: "Boletín de Servicio: recomendado, no obligatorio (a diferencia de una modificación mandatoria)." },
      { n: 18, text: "Los ensayos estáticos y dinámicos del primer prototipo (paso 9 del proceso de fabricación) se realizan en tierra, típicamente con:", options: { A: "Túneles de viento exclusivamente.", B: "Prensas hidráulicas, simulando condiciones de vuelo normales y severas.", C: "Vuelos de prueba tripulados.", D: "Simulaciones por computadora únicamente, sin ensayo físico." }, correct: "B", justification: "Ensayos del primer prototipo: con prensas hidráulicas, en tierra." },
    ],
  },
  {
    id: 2,
    title: "Modelo de Parcial 2",
    tag: "Práctica",
    subtitle: "Cohete 1 vs. 2 etapas · Fabricación del avión",
    practical: {
      title: "Ejercicio práctico: cohete de una etapa vs. dos etapas (mismos recursos)",
      statement: `<p>Se dispone de los siguientes recursos totales para construir un lanzador:</p>
        <ul class="data-list">
          <li>Masa de carga útil: $M_L = 2\\,500\\ \\text{kg}$.</li>
          <li>Masa total de propulsante disponible: $M_P = 200\\,000\\ \\text{kg}$.</li>
          <li>Masa total de estructura disponible: $M_S = 24\\,000\\ \\text{kg}$.</li>
          <li>Velocidad efectiva de escape del propulsante: $V_e = 3\\,100\\ \\text{m/s}$ (igual en cualquier configuración).</li>
        </ul>`,
      table: null,
      payload: "",
      asks: [
        "Calcular el $\\Delta V$ que se obtiene si <strong>todo</strong> el propulsante y <strong>toda</strong> la estructura se usan en un cohete de <strong>una sola etapa</strong> (monolítico), que luego de quemar todo el propulsante queda con $M_b = M_L + M_S$.",
        "Calcular el $\\Delta V$ total si, con los <strong>mismos recursos totales</strong>, el cohete se divide en <strong>dos etapas iguales</strong> (cada una con la mitad del propulsante y la mitad de la estructura). Calcular $R_1$, $R_2$, $\\Delta V_1$, $\\Delta V_2$ y el $\\Delta V$ total.",
        "Comparar los resultados de a) y b): ¿qué ganancia porcentual en $\\Delta V$ se obtiene al dividir el vehículo en dos etapas, usando exactamente la misma masa total de propulsante, estructura y carga útil? Justifique físicamente por qué ocurre esa diferencia.",
      ],
      resolution: `
        <p><strong>a) Una sola etapa:</strong></p>
        <p>$$\\begin{aligned}M_0 &= M_L+M_P+M_S\\\\&= 2\\,500+200\\,000+24\\,000\\\\&= 226\\,500\\ \\text{kg}\\\\[4pt]M_b &= M_L+M_S = 2\\,500+24\\,000\\\\&= 26\\,500\\ \\text{kg}\\end{aligned}$$</p>
        <p>$$R = \\frac{226\\,500}{26\\,500} = 8{,}547$$</p>
        <p>$$\\begin{aligned}\\Delta V_{1\\ etapa} &= 3100\\cdot\\ln(8{,}547)\\\\&= 3100\\cdot 2{,}1456\\\\&= \\boxed{6\\,651\\ \\text{m/s}}\\end{aligned}$$</p>
        <p><strong>b) Dos etapas iguales</strong> (mitad de propulsante y mitad de estructura en cada una):</p>
        <p>$$\\begin{aligned}R_1 &= \\frac{M_L+M_P+M_S}{M_L+\\frac{M_P}{2}+M_S}\\\\&= \\frac{226\\,500}{2\\,500+100\\,000+24\\,000}\\\\&= \\frac{226\\,500}{126\\,500}\\\\&= 1{,}791\\end{aligned}$$</p>
        <p>$$\\begin{aligned}R_2 &= \\frac{M_L+\\frac{M_P}{2}+\\frac{M_S}{2}}{M_L+\\frac{M_S}{2}}\\\\&= \\frac{2\\,500+100\\,000+12\\,000}{2\\,500+12\\,000}\\\\&= \\frac{114\\,500}{14\\,500}\\\\&= 7{,}897\\end{aligned}$$</p>
        <p>$$\\begin{aligned}\\Delta V_1 &= 3100\\cdot\\ln(1{,}791) = 1\\,806\\ \\text{m/s}\\\\\\Delta V_2 &= 3100\\cdot\\ln(7{,}897) = 6\\,406\\ \\text{m/s}\\end{aligned}$$</p>
        <p>$$\\Delta V_{2\\ etapas} = 1\\,806+6\\,406 = \\boxed{8\\,212\\ \\text{m/s}}$$</p>
        <p><strong>c) Comparación:</strong></p>
        <p>$$\\begin{aligned}\\frac{\\Delta V_{2\\ etapas}-\\Delta V_{1\\ etapa}}{\\Delta V_{1\\ etapa}} &= \\frac{8\\,212-6\\,651}{6\\,651}\\\\&= 23{,}5\\ \\%\\end{aligned}$$</p>
        <p class="note">Con exactamente los mismos recursos (misma masa total de propulsante, estructura y carga útil), <strong>dividir el cohete en dos etapas da un 23,5&nbsp;% más de $\\Delta V$</strong>. La razón física: al quemarse la primera etapa, su estructura (ya vacía) se <strong>descarta</strong>, de modo que la segunda etapa solo tiene que seguir acelerando su propia estructura y la carga útil, no la estructura "muerta" de la primera. En el cohete monolítico, en cambio, toda la estructura se sigue acelerando hasta el final.</p>
      `,
    },
    theoretical: {
      title: "Desarrollo teórico",
      prompt: "Explique de manera completa y detallada las <strong>etapas del proceso de fabricación de un avión</strong>, desde la definición de requerimientos hasta el comportamiento en servicio. Desarrolle, para cada etapa, su objetivo principal, qué validaciones se realizan entre una etapa y la siguiente (ensayos en túnel aerodinámico, Mockup, ensayos estáticos y dinámicos del prototipo, ensayos en vuelo y certificación de aeronavegabilidad) y qué documentos técnicos se generan. Incluya un diagrama de bloques del proceso completo (requerimiento → anteproyecto → proyecto → prototipo → serie → servicio).",
      resolution: [
        "<strong>Requerimientos y anteproyecto:</strong> se definen las especificaciones y se hace un cálculo preliminar de performance comparando con aviones análogos.",
        "<strong>Ensayo en túnel aerodinámico y revisión de cálculos:</strong> se verifican y ajustan los cálculos del anteproyecto antes de avanzar al diseño definitivo.",
        "<strong>Proyecto del avión y selección de componentes:</strong> diseño definitivo y elección de sistemas/proveedores.",
        "<strong>Mockup:</strong> maqueta a escala real para validar integración, accesos y mantenibilidad de sistemas, antes de construir el prototipo.",
        "<strong>Fabricación de componentes y vendors:</strong> se definen y fabrican las piezas, propias y de proveedores externos.",
        "<strong>Primer prototipo y ensayos estáticos/dinámicos:</strong> se construye el primer avión real y se somete a ensayos estructurales (estáticos y dinámicos, con prensas hidráulicas) antes de volar.",
        "<strong>Prototipos modificados, ensayos en vuelo y certificación:</strong> se corrigen fallas detectadas, se ensaya en vuelo y se certifica la aeronavegabilidad ante la autoridad aeronáutica, paso habilitante para la venta.",
        "<strong>Producción en serie:</strong> fabricación repetitiva de unidades ya certificadas, con matrices y moldes definitivos en acero; cada unidad se ensaya antes de entregarse.",
        "<strong>Comportamiento en servicio:</strong> seguimiento posventa, Boletines de Servicio (recomendados) y modificaciones mandatorias (obligatorias, condicionan la renovación del certificado de aeronavegabilidad).",
        "El proceso es <strong>iterativo</strong> (cálculo ⇄ ensayo ⇄ rediseño, varias veces antes de llegar a la serie), no estrictamente lineal.",
      ],
    },
    questions: [
      { n: 1, text: "¿De qué depende la velocidad de escape de un cuerpo celeste?", options: { A: "De la masa del objeto que intenta escapar.", B: "Únicamente de la velocidad orbital circular en ese punto.", C: "De la masa y el radio del cuerpo celeste, no de la masa del objeto.", D: "De la forma aerodinámica del objeto." }, correct: "C", justification: "$V_{esc} = \\sqrt{2GM/r}$: depende de la masa y el radio del cuerpo, no de la masa del objeto." },
      { n: 2, text: "Una órbita GEO (geoestacionaria):", options: { A: "Es ecuatorial y su período coincide con el día sideral terrestre (≈ 35 786 km de altura).", B: "Es polar y de período menor a 2 horas.", C: "Tiene la mayor excentricidad posible.", D: "Se ubica siempre por debajo de la órbita LEO." }, correct: "A", justification: "GEO: ecuatorial, período = día sideral terrestre, ≈ 35 786 km de altura." },
      { n: 3, text: "La \"ventana de lanzamiento\" de una misión espacial es:", options: { A: "La duración total del vuelo orbital planificado.", B: "La altura máxima que puede alcanzar el lanzador.", C: "El período acotado (minutos, horas o días) en que se puede lanzar sin requerir propelente adicional.", D: "El tiempo completo de la cuenta regresiva previa al lanzamiento." }, correct: "C", justification: "Ventana de lanzamiento: período acotado sin costo extra de propelente." },
      { n: 4, text: "Si el ángulo de reentrada atmosférica es más empinado que el óptimo:", options: { A: "Se reducen el calentamiento y las fuerzas g sobre la cápsula.", B: "Aumentan el calentamiento y las fuerzas g que debe soportar la cápsula.", C: "No hay ningún efecto apreciable sobre la carga térmica.", D: "El aterrizaje resulta automáticamente más preciso." }, correct: "B", justification: "Ángulo de reentrada más empinado: más calor y más fuerzas g." },
      { n: 5, text: "La configuración bilarguero, la más usada en alas cantiléver, se caracteriza porque:", options: { A: "No resiste esfuerzos de torsión.", B: "Es exclusiva de alas arriostradas.", C: "Usa un único larguero central sin revestimiento resistente.", D: "Forma, junto con el revestimiento, un cajón resistente a la torsión." }, correct: "D", justification: "Bilarguero: cajón resistente a la torsión." },
      { n: 6, text: "El diámetro mínimo recomendado para los agujeros de alivianamiento del alma de un larguero de alma llena es de aproximadamente:", options: { A: "200 mm.", B: "120 mm.", C: "80 mm.", D: "50 mm." }, correct: "B", justification: "Agujeros de alivianamiento: diámetro mínimo ≈ 120 mm." },
      { n: 7, text: "Entre las ventajas de los materiales compuestos de fibra de carbono frente a los metales, el apunte destaca:", options: { A: "Procesos de manufactura totalmente estandarizados.", B: "Mayor densidad que el aluminio.", C: "Un costo de producción siempre menor al de los metales.", D: "Reducción de peso y de costo de mantenimiento (hasta un 30 %), con buena resistencia a la corrosión y a la fatiga." }, correct: "D", justification: "Compuestos: reducción de peso/mantenimiento hasta 30 %, moldeabilidad, resistencia a corrosión y fatiga." },
      { n: 8, text: "La función principal de la deriva (estabilizador vertical) es:", options: { A: "Controlar el cabeceo del avión.", B: "Dar estabilidad direccional y mantener el vuelo recto.", C: "Aumentar la sustentación en el despegue.", D: "Reemplazar al elevador." }, correct: "B", justification: "Deriva: estabilidad direccional, vuelo recto." },
      { n: 9, text: "El timón de dirección puede desplazarse lateralmente, a cada lado, aproximadamente:", options: { A: "45°.", B: "10°.", C: "60°.", D: "30°." }, correct: "D", justification: "Timón de dirección: ≈ 30° a cada lado." },
      { n: 10, text: "En un fuselaje presurizado, la sección transversal obligatoria es:", options: { A: "Rectangular, con esquinas vivas.", B: "Trapezoidal.", C: "Circular o elíptica.", D: "Sin restricción de forma." }, correct: "C", justification: "Fuselaje presurizado: sección circular o elíptica obligatoria." },
      { n: 11, text: "La \"ley de las áreas\", aplicada en vuelo supersónico, tiene como objetivo:", options: { A: "Minimizar exclusivamente el área del ala.", B: "Maximizar el área frontal del fuselaje.", C: "Mantener igual el área del fuselaje en toda su longitud.", D: "Evitar cambios bruscos en la distribución total del área de sección transversal (fuselaje + ala + cola) a lo largo del eje longitudinal." }, correct: "D", justification: "Ley de las áreas: distribución total de área sin cambios bruscos (curva tipo campana de Gauss)." },
      { n: 12, text: "Entre las fuerzas sobre el fuselaje, la carga combinada de torsión y flexión proviene principalmente de:", options: { A: "La acción de la deriva y el timón de dirección.", B: "El peso propio del fuselaje en reposo.", C: "Únicamente las reacciones del tren de aterrizaje.", D: "La presión estática a nivel del mar." }, correct: "A", justification: "Deriva + timón de dirección: torsión y flexión combinadas." },
      { n: 13, text: "Los frenos aerodinámicos, a diferencia de los spoilers:", options: { A: "Solo se instalan en el ala.", B: "No cortan la capa límite del ala; generan resistencia exponiendo una superficie a la corriente.", C: "Cortan la capa límite del extradós del ala para frenar.", D: "Se usan exclusivamente en aviones comerciales de transporte." }, correct: "B", justification: "Frenos aerodinámicos: no cortan la capa límite del ala, a diferencia de los spoilers." },
      { n: 14, text: "Un sistema de mando de vuelo \"ayudado\" se caracteriza porque:", options: { A: "Es sinónimo de sistema de potencia completa.", B: "Requiere siempre sensación artificial.", C: "El piloto no tiene conexión mecánica alguna con la superficie.", D: "El piloto aporta solo parte de la fuerza necesaria, con ayuda de un sistema de potencia en paralelo, y el sistema sigue siendo reversible." }, correct: "D", justification: "Sistema ayudado: el piloto aporta parte de la fuerza, sigue siendo reversible." },
      { n: 15, text: "En un sistema de mando de potencia completa (irreversible), la fuerza de sensación artificial es:", options: { A: "Inversamente proporcional a la deflexión de la superficie.", B: "Constante, independiente de la velocidad.", C: "Proporcional al cuadrado de la velocidad.", D: "Proporcional linealmente a la velocidad." }, correct: "C", justification: "Sensación artificial: proporcional a $V^2$." },
      { n: 16, text: "El flap Krueger (de borde de ataque) aumenta considerablemente el $C_{L,max}$, mientras que:", options: { A: "Elimina la necesidad de usar slats.", B: "El ángulo de sustentación nula y la pendiente de $C_L(\\alpha)$ permanecen prácticamente inalterados.", C: "Cambia fuertemente el ángulo de sustentación nula.", D: "La pendiente de $C_L(\\alpha)$ se reduce a la mitad." }, correct: "B", justification: "Flap Krueger: sube $C_{L,max}$ sin cambiar casi el ángulo de sustentación nula ni la pendiente de $C_L(\\alpha)$." },
      { n: 17, text: "Un Boletín de Servicio (Service Bulletin):", options: { A: "Condiciona por sí solo la renovación del certificado de aeronavegabilidad.", B: "Solo puede emitirse durante la etapa de producción en serie.", C: "Es una modificación recomendada (no obligatoria) para aviones ya en servicio.", D: "Es siempre de cumplimiento obligatorio para el operador." }, correct: "C", justification: "Boletín de Servicio: recomendado, no obligatorio (a diferencia de una modificación mandatoria)." },
      { n: 18, text: "Los ensayos estáticos y dinámicos del primer prototipo (paso 9 del proceso de fabricación) se realizan en tierra, típicamente con:", options: { A: "Simulaciones por computadora exclusivamente, sin ensayo físico.", B: "Vuelos de prueba tripulados.", C: "Túneles de viento exclusivamente.", D: "Prensas hidráulicas, simulando condiciones de vuelo normales y severas." }, correct: "D", justification: "Ensayos del primer prototipo: con prensas hidráulicas, en tierra." },
    ],
  },
  {
    id: 3,
    title: "Modelo de Parcial 3",
    tag: "Práctica",
    subtitle: "Momento flector en el ala · Fuselajes",
    practical: {
      title: "Ejercicio práctico: momento flector en la raíz del ala",
      statement: `<p>Un avión liviano tiene una masa total $M = 1200\\ \\text{kg}$. Para el dimensionado estructural del ala se considera un factor de carga límite $n = 3{,}5$ y un factor de seguridad $FS = 1{,}5$. La envergadura es $b = 11\\ \\text{m}$ y se adopta una distribución de sustentación <strong>elíptica</strong> a lo largo de la semiala.</p>`,
      table: null,
      payload: "Cada semiala aloja combustible que pesa 480 N, ubicado a 3,0 m de la raíz.",
      asks: [
        "Calcular la carga de diseño total y la carga de diseño por semiala.",
        "Calcular el brazo del centroide de la distribución elíptica de sustentación respecto de la raíz ($y = \\dfrac{4}{3\\pi}\\cdot\\dfrac{b}{2}$) y el momento flector de diseño en la raíz de la semiala (sin considerar el alivio por combustible).",
        "Si cada semiala aloja combustible que pesa 480 N, ubicado a 3,0 m de la raíz, calcular el alivio de momento flector que produce ese combustible (bajo el mismo $n$ y $FS$) y el momento flector neto en la raíz. Indique, con una frase, por qué el caso estructuralmente más exigente para el ala es con <strong>poco</strong> combustible a bordo y no con los tanques llenos.",
      ],
      resolution: `
        <p>$W = M\\cdot g = 1200\\cdot 9{,}81 = 11\\,772\\ \\text{N}$.</p>
        <p><strong>a)</strong> Carga de diseño total $= W\\cdot n\\cdot FS = 11\\,772\\cdot 3{,}5\\cdot 1{,}5 = 61\\,803\\ \\text{N}$. Por semiala: $61\\,803/2 = 30\\,901{,}5\\ \\text{N}$.</p>
        <p><strong>b)</strong> Brazo del centroide elíptico: $y = \\dfrac{4}{3\\pi}\\cdot\\dfrac{11}{2} = \\dfrac{4}{3\\pi}\\cdot 5{,}5 = 2{,}334\\ \\text{m}$.</p>
        <p>Momento flector en la raíz (sin combustible):</p>
        <p>$$\\begin{aligned}M_{raíz} &= 30\\,901{,}5\\ \\text{N}\\times 2{,}334\\ \\text{m}\\\\&= 72{,}13\\ \\text{kN·m}\\end{aligned}$$</p>
        <p><strong>c)</strong> Alivio por combustible:</p>
        <p>$$\\begin{aligned}F_{comb}\\cdot y_{comb}\\cdot n\\cdot FS &= 480\\times 3{,}0\\times 3{,}5\\times 1{,}5\\\\&= 7{,}56\\ \\text{kN·m}\\end{aligned}$$</p>
        <p>$$M_{neto} = 72{,}13-7{,}56 = \\boxed{64{,}57\\ \\text{kN·m}}$$</p>
        <p class="note">Esto representa una reducción del 10,5 % respecto del momento sin alivio.</p>
        <p class="note">El caso crítico es con <strong>poco combustible</strong> porque el peso del combustible en el ala genera un momento de sentido <strong>opuesto</strong> al de la sustentación (alivia el flector); con los tanques llenos ese alivio es máximo y la raíz del ala trabaja más aliviada. Vacíos los tanques, desaparece ese alivio y la raíz soporta el flector máximo: por eso el ala se dimensiona pensando en el <strong>peso máximo sin combustible (MZFW)</strong>.</p>
      `,
    },
    theoretical: {
      title: "Desarrollo teórico",
      prompt: "Explique de manera completa los tipos estructurales de fuselaje: <strong>reticulado</strong> (Pratt y Warren), <strong>geodésico</strong>, <strong>monocasco</strong>, <strong>monocasco reforzado</strong> y <strong>semimonocasco</strong>. Para el semimonocasco, describa los componentes estructurales (cuadernas, larguerillos, largueros, revestimiento y mamparos) indicando qué tipo de esfuerzo resiste principalmente cada uno. Incluya un esquema de la sección transversal señalando cada componente, y compare brevemente ventajas y desventajas de cada tipo de fuselaje en términos de peso, rigidez y facilidad de reparación.",
      resolution: [
        "<strong>Reticulado Pratt:</strong> cuatro largueros con diagonales que trabajan solo a tracción (tensores).",
        "<strong>Reticulado Warren:</strong> diagonales que trabajan a tracción y compresión (sin tensores), más rígida.",
        "<strong>Geodésico:</strong> miembros longitudinales y transversales autoequilibrados (tracción/compresión) en cada intersección de una superficie curva.",
        "<strong>Monocasco:</strong> toda la carga la resiste el revestimiento (con cuadernas), sin largueros importantes; muy liviano pero sensible al pandeo local y a daños puntuales.",
        "<strong>Monocasco reforzado / semimonocasco:</strong> se agregan larguerillos y largueros que comparten la carga con el revestimiento (cuaderna: corte; larguerillo: flexión/rigidiza al corte-compresión; larguero: flexión principal; revestimiento: torsión, corte y tracción; mamparo: cuaderna reforzada, límite de zona presurizada). Es la solución más usada en aviación comercial por su buena relación resistencia/peso y tolerancia al daño.",
      ],
    },
    questions: [
      { n: 1, text: "En la ecuación de Tsiolkovski, para un $\\Delta V$ dado, si la velocidad efectiva de escape $V_e$ aumenta:", options: { A: "La relación de masas necesaria $m_0/m_b$ debe aumentar.", B: "El $\\Delta V$ ideal disminuye.", C: "La relación de masas necesaria $m_0/m_b$ puede ser menor.", D: "No cambia la relación de masas necesaria." }, correct: "C", justification: "Mayor $V_e$ ⇒ se necesita menor relación de masas para el mismo $\\Delta V$, ya que $\\Delta V = V_e\\ln(m_0/m_b)$." },
      { n: 2, text: "La principal ventaja de un cohete multietapa frente a uno monolítico de igual masa total es:", options: { A: "Reducir el empuje total disponible.", B: "Descartar la estructura ya vacía, de modo que se acelera menos masa inerte y se logra mayor $\\Delta V$.", C: "Eliminar la necesidad de propulsante en la segunda etapa.", D: "Aumentar la masa estructural total." }, correct: "B", justification: "Ventaja del multietapaje: se descarta estructura vacía, se acelera menos masa inerte." },
      { n: 3, text: "El radio (relación) de masa $R = M_0/M_b$ de una etapa:", options: { A: "Cuanto mayor es, menor es la eficiencia.", B: "Es independiente de la masa de propulsante.", C: "Cuanto mayor es, mayor es la eficiencia (más $\\Delta V$ para esa etapa).", D: "Siempre es menor a 1." }, correct: "C", justification: "Mayor $R$ = mayor eficiencia." },
      { n: 4, text: "Por el efecto de Coriolis, un cuerpo en movimiento sobre la superficie terrestre se desvía:", options: { A: "Hacia la izquierda en ambos hemisferios.", B: "Hacia la derecha en el hemisferio norte y hacia la izquierda en el hemisferio sur.", C: "Hacia la derecha en ambos hemisferios.", D: "No se desvía; es una fuerza real centrípeta." }, correct: "B", justification: "Coriolis: derecha en el HN, izquierda en el HS — fuerza aparente, no centrípeta." },
      { n: 5, text: "Los husos horarios de la Tierra son:", options: { A: "12, de 30° cada uno.", B: "24, de 15° cada uno.", C: "36, de 10° cada uno.", D: "24, de 10° cada uno." }, correct: "B", justification: "24 husos de 15°, $360°/24$." },
      { n: 6, text: "El año sidéreo, comparado con el año trópico:", options: { A: "Es más corto, por la nutación.", B: "Es igual, por definición.", C: "Es más largo, en aproximadamente 20 minutos, por efecto de la precesión.", D: "No tiene relación con la precesión." }, correct: "C", justification: "Año sidéreo ≈ 20 min más largo que el trópico, por la precesión." },
      { n: 7, text: "El temple del acero (calentamiento y enfriamiento rápido):", options: { A: "Reduce la dureza y aumenta la tenacidad.", B: "Aumenta la dureza, pero genera tensiones internas que producen fragilidad.", C: "No afecta la estructura cristalina.", D: "Es siempre el último paso del proceso, sin revenido posterior." }, correct: "B", justification: "Temple: dureza + fragilidad por tensiones internas; requiere revenido posterior." },
      { n: 8, text: "Los tratamientos termoquímicos (cementación, nitruración, cianuración, sulfinización) se aplican principalmente para:", options: { A: "Reducir el peso de la pieza.", B: "Dar dureza superficial y resistencia al desgaste.", C: "Eliminar tensiones internas.", D: "Cambiar el color superficial sin efecto mecánico." }, correct: "B", justification: "Termoquímicos: dureza superficial y resistencia al desgaste." },
      { n: 9, text: "El Mockup (maqueta a escala real) en la fabricación de un avión se usa para:", options: { A: "Ensayos de fatiga estructural.", B: "Validar integración, accesos y mantenibilidad de sistemas, en 3D físico, antes de construir prototipos.", C: "Certificar la aeronavegabilidad final.", D: "Reemplazar los ensayos en túnel aerodinámico." }, correct: "B", justification: "Mockup: integración, accesos, mantenibilidad en 3D físico." },
      { n: 10, text: "Los ensayos en túnel aerodinámico, dentro del proceso de fabricación de un avión, se realizan para:", options: { A: "Verificar el comportamiento en servicio una vez entregado el avión.", B: "Revisar y ajustar los cálculos del anteproyecto antes de avanzar al proyecto definitivo.", C: "Reemplazar los ensayos estáticos y dinámicos del prototipo.", D: "Certificar exclusivamente la resistencia a fatiga." }, correct: "B", justification: "Ensayos en túnel: revisión y ajuste de los cálculos del anteproyecto, etapa previa al proyecto definitivo." },
      { n: 11, text: "La diferencia principal entre un fuselaje monocasco y uno semimonocasco es que:", options: { A: "El monocasco no tiene revestimiento.", B: "El monocasco resiste las cargas principalmente con el revestimiento y cuadernas, sin largueros importantes; el semimonocasco suma larguerillos y largueros que comparten la carga con el revestimiento.", C: "El semimonocasco es exclusivamente de materiales compuestos.", D: "No hay diferencia estructural entre ambos." }, correct: "B", justification: "Monocasco: carga en revestimiento+cuadernas; semimonocasco: suma larguerillos/largueros." },
      { n: 12, text: "Una configuración de cola en V combina:", options: { A: "Las funciones del estabilizador horizontal y la deriva en dos superficies inclinadas.", B: "Dos derivas sin estabilizador horizontal.", C: "Elevones con spoilers.", D: "Un canard con deriva doble." }, correct: "A", justification: "Cola en V: combina estabilizador horizontal y deriva en dos superficies inclinadas." },
      { n: 13, text: "El estabilizador horizontal, en una cola convencional, tiene como función principal:", options: { A: "Dar control lateral (alabeo).", B: "Proveer estabilidad y control longitudinal (cabeceo).", C: "Controlar exclusivamente la guiñada.", D: "Sostener el tren de cola." }, correct: "B", justification: "Estabilizador horizontal: estabilidad y control longitudinal/cabeceo." },
      { n: 14, text: "El piloto automático de 3 ejes controla:", options: { A: "Solo el rumbo (guiñada).", B: "Alabeo, cabeceo y guiñada.", C: "Únicamente la altitud.", D: "Solo la velocidad." }, correct: "B", justification: "Piloto automático de 3 ejes: alabeo, cabeceo y guiñada." },
      { n: 15, text: "El SAS (sistema de aumento de estabilidad) tiene como función:", options: { A: "Reemplazar completamente al piloto.", B: "Aumentar la estabilidad dinámica del avión, amortiguando oscilaciones, sin necesariamente mantener un rumbo u altitud fijos.", C: "Controlar únicamente el tren de aterrizaje.", D: "Sustituir a los spoilers en el frenado." }, correct: "B", justification: "SAS: amortigua oscilaciones, aumenta estabilidad dinámica, sin ser necesariamente un autopiloto de mantenimiento de rumbo/altitud." },
      { n: 16, text: "Los spoilers, a diferencia de los alerones, para el control lateral producen:", options: { A: "Guiñada adversa, igual que los alerones.", B: "Guiñada favorable (en el mismo sentido del giro deseado).", C: "Ninguna guiñada en ningún caso.", D: "Solo efecto de freno, sin aporte al control lateral." }, correct: "B", justification: "Spoilers: guiñada favorable, a diferencia de la adversa de los alerones." },
      { n: 17, text: "La compensación aerodinámica tipo cornadura (horn balance) reduce el esfuerzo del piloto porque:", options: { A: "Agrega un resorte de torsión en el eje de la superficie.", B: "Conecta el piloto directamente a un tab.", C: "Adelanta una porción de superficie respecto del eje de charnela, generando un momento que ayuda al giro.", D: "Elimina la necesidad de eje de charnela." }, correct: "C", justification: "Cornadura: porción de superficie adelantada al eje de charnela, generando momento de ayuda." },
      { n: 18, text: "Respecto del punto M en la polar con y sin flaps, en vuelo por debajo de esa velocidad:", options: { A: "Conviene retraer los flaps para reducir resistencia.", B: "Conviene extender los flaps, porque dan menor resistencia que sin ellos a esa velocidad.", C: "Los flaps no tienen ningún efecto sobre la resistencia.", D: "Es indistinto extender o retraer los flaps." }, correct: "B", justification: "Por debajo del punto M conviene tener los flaps extendidos, porque allí dan menor resistencia que retraídos." },
    ],
  },
  {
    id: 4,
    title: "Modelo de Parcial 4",
    tag: "Original · Tema 2",
    subtitle: "Parcial real (01/11/25) · Carga útil 1000 kg",
    practical: {
      title: "Ejercicio práctico: cohete de dos etapas",
      statement: `<p>Un cohete de dos etapas debe colocar una carga útil en órbita terrestre. A continuación, se detallan las masas estructurales, las masas de propulsante y las velocidades efectivas de escape de cada etapa:</p>`,
      table: {
        headers: ["Concepto", "Etapa 1", "Etapa 2"],
        rows: [
          ["Masa estructural ($M_S$)", "20 000 kg", "4 000 kg"],
          ["Masa de propulsante ($M_P$)", "180 000 kg", "30 000 kg"],
          ["Velocidad efectiva de escape ($V_e$)", "2 950 m/s", "4 500 m/s"],
        ],
      },
      payload: "La carga útil tiene una masa de <strong>1 000 kg</strong>.",
      asks: [
        "Calcular el incremento de velocidad ($\\Delta v$) que proporciona la etapa 1, considerando que impulsa también la masa total de la etapa 2 y la carga útil.",
        "Calcular el $\\Delta v$ que proporciona la etapa 2, considerando únicamente su masa estructural, el propulsante y la carga útil.",
        "Determinar el $\\Delta v$ total del vehículo, como suma de los incrementos de velocidad obtenidos en ambas etapas.",
      ],
      resolution: `
        <p>$$\\begin{aligned}M_{0,1} &= 20\\,000+180\\,000+4\\,000\\\\&\\quad{}+30\\,000+1\\,000\\\\&= 235\\,000\\ \\text{kg}\\\\[4pt]M_{b,1} &= 4\\,000+30\\,000+1\\,000+20\\,000\\\\&= 55\\,000\\ \\text{kg}\\end{aligned}$$</p>
        <p class="note">(al quemarse el propulsante de la etapa 1, su estructura aún no se descarta y sigue cargando toda la etapa 2 completa más la carga útil).</p>
        <p>$$\\begin{aligned}\\Delta v_1 &= 2950\\cdot\\ln\\left(\\frac{235\\,000}{55\\,000}\\right)\\\\&= 2950\\cdot\\ln(4{,}2727)\\\\&= 2950\\cdot 1{,}4524\\\\&= 4284\\ \\text{m/s}\\end{aligned}$$</p>
        <p>$$\\begin{aligned}M_{0,2} &= 4\\,000+30\\,000+1\\,000 = 35\\,000\\ \\text{kg}\\\\M_{b,2} &= 4\\,000+1\\,000 = 5\\,000\\ \\text{kg}\\end{aligned}$$</p>
        <p>$$\\begin{aligned}\\Delta v_2 &= 4500\\cdot\\ln\\left(\\frac{35\\,000}{5\\,000}\\right)\\\\&= 4500\\cdot\\ln 7\\\\&= 4500\\cdot 1{,}9459\\\\&= 8757\\ \\text{m/s}\\end{aligned}$$</p>
        <p>$$\\Delta v_{total} = 4284+8757 = \\boxed{13\\,041\\ \\text{m/s}}$$</p>
        <p class="note">La etapa 2, con mucha menos estructura "muerta" respecto de su propulsante, aporta aproximadamente el doble del $\\Delta v$ que la etapa 1 — la ventaja central del multietapaje.</p>
      `,
    },
    theoretical: {
      title: "Desarrollo teórico",
      prompt: "Explique de manera completa y detallada los Slats/Flaps de borde de ataque y flaps de borde de fuga. Indique sus diferentes tipos, describa su funcionamiento y operación, e incluya esquemas o gráficos ilustrativos. Además, represente y analice la curva $C_L(\\alpha)$, la polar de Eiffel (relación $C_L$-$C_D$) y el punto M correspondiente para la operación con y sin flaps.",
      resolution: [
        "<strong>Slats:</strong> dispositivo de borde de ataque que inyecta aire de alta energía del intradós al extradós, retrasando la separación de la capa límite; aumenta $C_{L,max}$ y el ángulo de pérdida, prácticamente sin cambiar la resistencia ni el momento de cabeceo.",
        "<strong>Flaps de borde de ataque</strong> (simple, Krueger, Betz): aumentan $C_{L,max}$ redondeando la nariz del perfil, sin cambiar demasiado el ángulo de sustentación nula ni la pendiente $C_L(\\alpha)$.",
        "<strong>Flaps de borde de fuga</strong> (simple, intradós, intradós acharnelado, ranurado, Fowler): aumentan $C_L$ a todo ángulo, aumentan el momento de cabeceo negativo, aumentan la resistencia (la polar se desplaza a la derecha); el Fowler y el de intradós acharnelado además aumentan la cuerda/superficie efectiva.",
        "<strong>Punto M en la polar:</strong> por debajo de esa velocidad conviene <em>extender</em> flaps (menor resistencia que sin ellos); por encima, conviene <em>retraerlos</em>. En el aterrizaje y el despegue se opera en la zona por debajo de M.",
      ],
    },
    questions: [
      { n: 1, text: "En un ensayo tensión-deformación, el límite de proporcionalidad es el punto hasta el cual:", options: { A: "Se alcanza el esfuerzo último.", B: "Se cumple la ley de Hooke ($\\sigma$ proporcional a $\\varepsilon$).", C: "El material se deforma plásticamente con recuperación parcial.", D: "Comienza la estricción." }, correct: "B", justification: "Límite de proporcionalidad: hasta donde vale la ley de Hooke, $\\sigma = E\\varepsilon$." },
      { n: 2, text: "La ley de Hooke en el tramo elástico lineal se expresa como:", options: { A: "$\\sigma = \\varepsilon/E$", B: "$\\sigma = E/\\varepsilon$", C: "$\\sigma = E\\varepsilon$", D: "$\\sigma = \\sqrt{E\\varepsilon}$" }, correct: "C", justification: "$\\sigma = E\\varepsilon$, ley de Hooke." },
      { n: 3, text: "En alas cantiléver, el esfuerzo de flexión lo toma principalmente:", options: { A: "Las costillas falsas.", B: "El larguero (o conjunto de largueros).", C: "Los larguerillos del revestimiento.", D: "Los herrajes de los flaps." }, correct: "B", justification: "El larguero (elemento principal) toma la flexión; los larguerillos son secundarios." },
      { n: 4, text: "¿Cuál es la función principal del revestimiento resistente (activo) del ala?", options: { A: "Disminuir el rozamiento en el intradós.", B: "Contribuir a resistir tracción, compresión, corte y torsión, integrándose estructuralmente.", C: "Únicamente dar forma aerodinámica.", D: "Aumentar la sustentación con el mismo perfil." }, correct: "B", justification: "El revestimiento activo colabora estructuralmente con tracción, compresión, corte y torsión." },
      { n: 5, text: "El cajón interlarguero (estructura tipo monocasco entre dos largueros) tiene como misión principal:", options: { A: "Resistir torsión y repartir esfuerzos entre los largueros.", B: "Reducir el peso del combustible.", C: "Aumentar el alargamiento del ala.", D: "Eliminar la necesidad de costillas." }, correct: "A", justification: "El cajón interlarguero resiste torsión y reparte esfuerzos entre largueros." },
      { n: 6, text: "En fuselaje semimonocasco, los larguerillos cumplen principalmente con:", options: { A: "Sostener las ventanillas.", B: "Ser elementos de unión para sistemas.", C: "Aumentar la rigidez del recubrimiento (compresión y corte), auxiliando a las cuadernas.", D: "Soportar cargas concentradas de tren." }, correct: "C", justification: "Larguerillos: rigidizan el revestimiento frente a compresión y corte, auxiliando a las cuadernas." },
      { n: 7, text: "La presurización agrega al fuselaje una carga que se modela como:", options: { A: "Momento de flexión puro.", B: "Presión interna sobre un \"tanque a presión\" que solicita recubrimiento y cuadernas.", C: "Carga puntual en mamparos.", D: "Sólo cizalla en cuadernas extremas." }, correct: "B", justification: "Fuselaje a presión = tanque a presión: fuerzas tangenciales en cuadernas + flexión del revestimiento." },
      { n: 8, text: "El factor de seguridad mínimo típico citado para la industria aeroespacial es:", options: { A: "2,50.", B: "≥ 1,50.", C: "1,20.", D: "1,05." }, correct: "B", justification: "≥ 1,50 — factor de seguridad normativo mínimo habitual." },
      { n: 9, text: "El flutter se caracteriza por:", options: { A: "Oscilaciones amortiguadas siempre.", B: "Movimiento aeroelástico divergente por interacción de flexión y torsión, asociado a una velocidad crítica.", C: "Que aparece únicamente a bajas velocidades.", D: "Un fenómeno sólo del fuselaje." }, correct: "B", justification: "Flutter: inestabilidad aeroelástica divergente flexión-torsión con velocidad crítica." },
      { n: 10, text: "Los alerones Frise ayudan a mitigar la guiñada adversa porque:", options: { A: "Disminuyen la curvatura del perfil.", B: "Aumentan el alargamiento del ala.", C: "La nariz del alerón sobresale al intradós generando resistencia en el ala que sube.", D: "Cierran una ranura superior." }, correct: "C", justification: "Frise: nariz sobresale al intradós del ala que sube, agregando resistencia para compensar la guiñada adversa." },
      { n: 11, text: "Los slats (ranuras de borde de ataque) logran:", options: { A: "Reducir el coeficiente de arrastre a todo ángulo.", B: "Energizar la capa límite del extradós permitiendo mayor $C_{L,max}$ y mayor ángulo de ataque sin pérdida.", C: "Eliminar la necesidad de flaps.", D: "Disminuir el ángulo de pérdida." }, correct: "B", justification: "Slats: energizan la capa límite, suben $C_{L,max}$ y retrasan la pérdida." },
      { n: 12, text: "Un servo-tab es:", options: { A: "Un compensador solo de timón.", B: "Un anti-tab que aumenta el esfuerzo del piloto.", C: "Una aleta que el piloto acciona directamente para mover aerodinámicamente la superficie principal.", D: "Un tab fijo ajustable sólo en tierra." }, correct: "C", justification: "Servo-tab: piloto conectado directamente al tab, que arrastra aerodinámicamente a la superficie principal." },
      { n: 13, text: "En fabricación de un avión, la Mockup (maqueta a escala real) sirve para:", options: { A: "Ensayo estructural estático.", B: "Ensayo de fatiga.", C: "Validar integración, accesos y mantenibilidad de sistemas en 3D físico.", D: "Ensayo aerodinámico de túnel." }, correct: "C", justification: "Mockup: integración, accesos, mantenibilidad en 3D físico, antes de prototipos reales." },
      { n: 14, text: "Según la norma SAE para aceros, el 4130 corresponde a:", options: { A: "Acero al Ni-Cr-Mo.", B: "Acero al Si-Mn.", C: "Acero al Cr-Mo (serie 4xxx), ~1 % aleante, ~0,30 % C.", D: "Acero al carbono con 0,30 % C." }, correct: "C", justification: "SAE 4130: Cr-Mo, ≈1 % aleante, 0,30 % C." },
      { n: 15, text: "En estructuras sándwich, la alma de baja densidad (ej. honeycomb) aporta principalmente:", options: { A: "Resistencia a cortante despreciable.", B: "Separación de pieles para aumentar rigidez a flexión con mínimo peso.", C: "Masa para inercia.", D: "Conductividad térmica." }, correct: "B", justification: "Alma honeycomb: separa las pieles, aumentando rigidez a flexión con poco peso añadido." },
      { n: 16, text: "Perihelio de la Tierra ocurre aproximadamente:", options: { A: "21 de septiembre.", B: "Inicios de julio.", C: "Primeros días de enero.", D: "21 de marzo." }, correct: "C", justification: "Perihelio: principios de enero." },
      { n: 17, text: "La inclinación del eje terrestre (~23,5°) explica principalmente:", options: { A: "La excentricidad orbital.", B: "Las estaciones.", C: "La duración del año sideral.", D: "El día sideral de 23 h 56 m." }, correct: "B", justification: "La inclinación del eje explica las estaciones, no el día ni el año sideral." },
      { n: 18, text: "La distribución de combustible en semiala:", options: { A: "Sólo afecta la resistencia parásita.", B: "Siempre aumenta el momento flector en raíz.", C: "No afecta momentos en maniobra.", D: "Puede reducir el momento flector en raíz si está más cerca de punta." }, correct: "D", justification: "Combustible cerca de la punta alivia el flector en raíz; el caso crítico es con poco combustible." },
    ],
  },
  {
    id: 5,
    title: "Modelo de Parcial 5",
    tag: "Original · Tema 1",
    subtitle: "Parcial real · Carga útil 2000 kg",
    practical: {
      title: "Ejercicio práctico: cohete de dos etapas",
      statement: `<p>Un cohete de dos etapas debe colocar una carga útil en órbita terrestre. A continuación, se detallan las masas estructurales, las masas de propulsante y las velocidades efectivas de escape de cada etapa:</p>`,
      table: {
        headers: ["Concepto", "Etapa 1", "Etapa 2"],
        rows: [
          ["Masa estructural ($M_S$)", "20 000 kg", "4 000 kg"],
          ["Masa de propulsante ($M_P$)", "180 000 kg", "30 000 kg"],
          ["Velocidad efectiva de escape ($V_e$)", "2 950 m/s", "4 500 m/s"],
        ],
      },
      payload: "La carga útil tiene una masa de <strong>2 000 kg</strong>.",
      asks: [
        "Calcular el incremento de velocidad ($\\Delta v$) que proporciona la etapa 1, considerando que impulsa también la masa total de la etapa 2 y la carga útil.",
        "Calcular el $\\Delta v$ que proporciona la etapa 2, considerando únicamente su masa estructural, el propulsante y la carga útil.",
        "Determinar el $\\Delta v$ total del vehículo, como suma de los incrementos de velocidad obtenidos en ambas etapas.",
      ],
      resolution: `
        <p>$$\\begin{aligned}M_{0,1} &= 20\\,000+180\\,000+4\\,000\\\\&\\quad{}+30\\,000+2\\,000\\\\&= 236\\,000\\ \\text{kg}\\\\[4pt]M_{b,1} &= 4\\,000+30\\,000+2\\,000+20\\,000\\\\&= 56\\,000\\ \\text{kg}\\end{aligned}$$</p>
        <p class="note">(al quemarse el propulsante de la etapa 1, su estructura aún no se descarta y sigue cargando toda la etapa 2 completa más la carga útil).</p>
        <p>$$\\begin{aligned}\\Delta v_1 &= 2950\\cdot\\ln\\left(\\frac{236\\,000}{56\\,000}\\right)\\\\&= 2950\\cdot\\ln(4{,}2143)\\\\&= 2950\\cdot 1{,}4383\\\\&= 4244\\ \\text{m/s}\\end{aligned}$$</p>
        <p>$$\\begin{aligned}M_{0,2} &= 4\\,000+30\\,000+2\\,000 = 36\\,000\\ \\text{kg}\\\\M_{b,2} &= 4\\,000+2\\,000 = 6\\,000\\ \\text{kg}\\end{aligned}$$</p>
        <p>$$\\begin{aligned}\\Delta v_2 &= 4500\\cdot\\ln\\left(\\frac{36\\,000}{6\\,000}\\right)\\\\&= 4500\\cdot\\ln 6\\\\&= 4500\\cdot 1{,}7918\\\\&= 8063\\ \\text{m/s}\\end{aligned}$$</p>
        <p>$$\\Delta v_{total} = 4244+8063 = \\boxed{12\\,306\\ \\text{m/s}}$$</p>
        <p class="note">Comparado con el Tema 2 (carga útil menor, 1000 kg), el $\\Delta v$ total es algo menor: una mayor carga útil penaliza más a la etapa 2, que es la de menor masa estructural y propulsante.</p>
      `,
    },
    theoretical: {
      title: "Desarrollo teórico",
      prompt: "Explique de manera completa y detallada los Slats/Flaps de borde de ataque y flaps de borde de fuga. Indique sus diferentes tipos, describa su funcionamiento y operación, e incluya esquemas o gráficos ilustrativos. Además, represente y analice la curva $C_L(\\alpha)$, la polar de Eiffel (relación $C_L$-$C_D$) y el punto M correspondiente para la operación con y sin flaps.",
      resolution: [
        "Mismos puntos mínimos esperados que en el Modelo de Parcial 4 (slats, flaps de borde de ataque, flaps de borde de fuga, curva $C_L(\\alpha)$, polar de Eiffel, punto M).",
        "<strong>Slats:</strong> energizan la capa límite del extradós, aumentan $C_{L,max}$ y retrasan la pérdida, sin afectar demasiado la resistencia ni el momento de cabeceo.",
        "<strong>Flaps de borde de ataque</strong> (simple, Krueger, Betz): aumentan $C_{L,max}$ redondeando la nariz del perfil.",
        "<strong>Flaps de borde de fuga</strong> (simple, intradós, ranurado, Fowler): aumentan $C_L$ a todo ángulo, aumentan el momento de cabeceo negativo y la resistencia; el Fowler aumenta además la cuerda efectiva.",
        "<strong>Punto M:</strong> por debajo de esa velocidad conviene extender flaps (menor resistencia); por encima, retraerlos.",
      ],
    },
    questions: [
      { n: 1, text: "Esfuerzo es:", options: { A: "Energía por unidad de volumen.", B: "Fuerza por unidad de área.", C: "Longitud por fuerza.", D: "Cambio de longitud por longitud inicial." }, correct: "B", justification: "$\\sigma = F/A$." },
      { n: 2, text: "La deformación elástica se caracteriza por:", options: { A: "Ser independiente de $E$.", B: "Recuperarse al retirar la carga dentro de límites.", C: "Ser permanente.", D: "Ocurrir sólo en plásticos." }, correct: "B", justification: "Deformación elástica: recuperable dentro de límites." },
      { n: 3, text: "En vuelo normal, en un ala metálica:", options: { A: "Platabanda superior a compresión y la inferior a tracción.", B: "Ambas al corte.", C: "Ambas platabandas a tracción.", D: "El alma solo a torsión." }, correct: "A", justification: "En vuelo normal el ala se flexiona hacia arriba: platabanda superior a compresión, inferior a tracción." },
      { n: 4, text: "En fuselaje reticulado Pratt, los tensores (diagonales):", options: { A: "No trabajan.", B: "Trabajan a tracción.", C: "Son cuadernas circulares.", D: "Trabajan a compresión exclusivamente." }, correct: "B", justification: "Pratt: diagonales/tensores solo a tracción." },
      { n: 5, text: "Fuselaje geodésico:", options: { A: "Estructura monocasco sin cuadernas.", B: "Retícula que equilibra tracción y compresión en intersecciones sobre superficies curvadas.", C: "Superficie plana sin refuerzos.", D: "Exclusivo de material compuesto." }, correct: "B", justification: "Geodésico: tracción y compresión autoequilibradas en cada intersección sobre superficie curva." },
      { n: 6, text: "Un mamparo (bulkhead) suele:", options: { A: "Solo guiar cableado.", B: "Limitar zonas presurizadas; dispersar cargas concentradas.", C: "Ser un elemento no estructural.", D: "No admitir sellado." }, correct: "B", justification: "Mamparo: límite de zona presurizada, dispersa cargas concentradas." },
      { n: 7, text: "En control lateral a altas velocidades, suele emplearse:", options: { A: "Solo alerones exteriores.", B: "Alerones interiores + spoilers diferenciales.", C: "Elevones.", D: "Timón de profundidad." }, correct: "B", justification: "A alta velocidad se prefieren alerones interiores + spoilers diferenciales, para reducir la torsión que un alerón exterior grande induciría en el ala." },
      { n: 8, text: "Un anti-tab:", options: { A: "Es un trim fijo.", B: "Solo existe en el timón de dirección.", C: "Aumenta la fuerza requerida para dar \"sensación\" a los mandos.", D: "Reduce los esfuerzos del piloto." }, correct: "C", justification: "Anti-tab: aumenta deliberadamente el esfuerzo del piloto, dando más \"sensación\"." },
      { n: 9, text: "El flap Fowler logra:", options: { A: "Disminuir $C_L$ a bajo ángulo.", B: "Eliminar ranuras.", C: "Aumentar curvatura y la cuerda efectiva (S).", D: "Solo aumentar curvatura." }, correct: "C", justification: "Fowler: aumenta curvatura y cuerda/superficie efectiva." },
      { n: 10, text: "En despegue, muchos grados de flap:", options: { A: "No cambian la resistencia.", B: "Eliminarían los vórtices de punta.", C: "Acortan la carrera, pero suelen reducir el ángulo inicial de ascenso por mayor $C_D$.", D: "Siempre maximizan el ángulo de ascenso." }, correct: "C", justification: "Muchos grados de flap acortan la carrera de despegue pero, por el aumento de $C_D$, suelen reducir el ángulo inicial de ascenso." },
      { n: 11, text: "En el proceso de diseño, el anteproyecto incorpora:", options: { A: "Solo maquetas 1:1.", B: "Estimaciones de performance con datos de aviones análogos.", C: "Exclusivamente planos de producción.", D: "Únicamente resultados de túnel." }, correct: "B", justification: "El anteproyecto se apoya en estimaciones de performance por comparación con aviones análogos." },
      { n: 12, text: "El acero SAE 4340 es:", options: { A: "Al Si-Mn.", B: "Al Cr-Ni-Mo.", C: "Al Cromo.", D: "Al W." }, correct: "B", justification: "SAE 4340: acero Cr-Ni-Mo." },
      { n: 13, text: "En el aluminio 7075 T6:", options: { A: "Serie 5xxx al Mg; recocido.", B: "Serie 6xxx Al-Mg-Si; T3.", C: "Serie 7xxx al Zn; T6: solución + envejecimiento artificial.", D: "Serie 2xxx al Cu." }, correct: "C", justification: "7075-T6: serie 7xxx al Zn, solución + envejecimiento artificial." },
      { n: 14, text: "El día sideral dura ~:", options: { A: "12 h.", B: "25 h.", C: "23 h 56 min 4 s.", D: "24 h exactas." }, correct: "C", justification: "Día sideral: 23 h 56 min 4 s." },
      { n: 15, text: "El equinoccio implica:", options: { A: "El día más largo del año.", B: "El Sol sobre el Trópico de Capricornio.", C: "Día y noche de duración similar globalmente.", D: "El Sol sobre el Trópico de Cáncer." }, correct: "C", justification: "Equinoccio: día y noche de duración similar en todo el planeta." },
      { n: 16, text: "El solsticio de junio:", options: { A: "Equilibrio día-noche.", B: "Afelio garantizado.", C: "Invierno en el hemisferio norte.", D: "Verano en el hemisferio norte; invierno en el hemisferio sur." }, correct: "D", justification: "Solsticio de junio: verano boreal, invierno austral." },
      { n: 17, text: "El MZFW (peso máximo de combustible cero) se relaciona con:", options: { A: "La verificación de momento flector en raíz sin combustible.", B: "La carga máxima de combustible en puntas.", C: "El peso máximo de aterrizaje.", D: "Solo aviones no presurizados." }, correct: "A", justification: "MZFW: caso crítico de momento flector en raíz, con el avión sin combustible." },
      { n: 18, text: "En vibraciones del ala, las dos formas propias citadas son:", options: { A: "Torsión y cabeceo.", B: "Cabeceo y guiñada.", C: "Flexión y torsión.", D: "Flexión y guiñada." }, correct: "C", justification: "Flexión y torsión." },
    ],
  },
];
