/**
 * MENTE / CEREBRO — Base de datos pedagógica y filosófica
 * Contenidos, textos, preguntas, retroalimentaciones y rúbricas.
 */

const PHILOSOPHY_DATA = {
  phases: [
    { id: 1, title: "El Dilema", subtitle: "Tus pensamientos y tu cerebro" },
    { id: 2, title: "Descubre el Fisicalismo", subtitle: "Mente, cerebro y psicología popular" },
    { id: 3, title: "La Analogía Astronómica", subtitle: "Geocentrismo, lenguaje y cambio teórico" },
    { id: 4, title: "Tres Posiciones Filosóficas", subtitle: "Fisicalismo, Churchland y Dennett" },
    { id: 5, title: "Laboratorio de Ideas", subtitle: "Evaluación formativa y pensamiento crítico" },
    { id: 6, title: "Tu Informe de Aprendizaje", subtitle: "Síntesis personalizada y argumentación" }
  ],

  // Fase 1: Dilema inicial
  phase1: {
    title: "¿Eres tu cerebro?",
    subtitle: "Tus pensamientos parecen íntimos, subjetivos y propios. Pero ¿qué son exactamente?",
    caseStudy: {
      headline: "El caso del examen de mañana",
      text: "Imagina esta situación cotidiana: Mañana tienes un examen decisivo. Miras tus apuntes y piensas que no has estudiado lo suficiente. Sientes una punzada de preocupación, deseas con fuerza aprobar y decides conscientemente estudiar una hora más."
    },
    questions: [
      {
        id: "p1_q1",
        prompt: "1. Cuando dices «creo que suspenderé», ¿dónde y cómo existe esa creencia?",
        options: [
          {
            id: "a",
            text: "En un ámbito mental inmaterial o subjetivo; no es un objeto físico localizable en el espacio.",
            stanceHint: "dualista / intuitiva"
          },
          {
            id: "b",
            text: "Es estrictamente un patrón de activación electroquímica entre redes de neuronas en mi cerebro.",
            stanceHint: "fisicalista"
          },
          {
            id: "c",
            text: "Es solo una forma lingüística práctica que uso para describir mi conducta, no una 'cosa' dentro de mi cabeza.",
            stanceHint: "instrumentalista / eliminativista"
          }
        ]
      },
      {
        id: "p1_q2",
        prompt: "2. Tu deseo de aprobar, ¿es algo ontológicamente diferente del cerebro o es pura actividad cerebral?",
        options: [
          {
            id: "a",
            text: "Es idéntico a una configuración neuroquímica (dopamina, conexiones sinápticas en la corteza prefrontal y el sistema límbico).",
            stanceHint: "fisicalismo de la identidad"
          },
          {
            id: "b",
            text: "Es una vivencia consciente de naturaleza no física, aunque influida por el estado biológico del cuerpo.",
            stanceHint: "dualismo de sustancias o propiedades"
          },
          {
            id: "c",
            text: "Es una etiqueta de nuestra psicología cotidiana para predecir lo que haré a continuación.",
            stanceHint: "postura intencional"
          }
        ]
      },
      {
        id: "p1_q3",
        prompt: "3. Pregunta abierta: Si una máquina superavanzada pudiera escanear y registrar con precisión atómica todos los procesos físicos de tu cerebro en este instante, ¿crees que sabría absolutamente todo lo necesario para explicar tu mente y lo que sientes? Justifica brevemente tu respuesta.",
        placeholder: "Escribe tu reflexión inicial aquí (mínimo 2-3 líneas). No hay respuesta errónea en este punto: buscamos tu intuición filosófica de partida..."
      }
    ]
  },

  // Fase 2: Fisicalismo y Psicología Popular
  phase2: {
    centralDefinition: {
      title: "La Tesis Central del Fisicalismo",
      statement: "El fisicalismo sostiene que todo lo que existe es físico y que los fenómenos mentales deben entenderse en relación con la realidad física.",
      clarification: "En la filosofía contemporánea, el fisicalismo no afirma simplemente que 'el cerebro influye en la mente' (eso ya lo admitía Descartes), sino algo mucho más radical: los estados mentales no constituyen una dimensión mágica o inmaterial al margen de la naturaleza física."
    },
    modules: [
      {
        id: "relacion_mente_cerebro",
        title: "1. La relación mente-cerebro",
        icon: "brain",
        summary: "Cada pensamiento, emoción o decisión se corresponde con cambios fisiológicos mensurables.",
        detail: "Si administras un fármaco que altera los neurotransmisores, la vivencia subjetiva cambia de inmediato. Si una lesión destruye el área de Broca, la capacidad de producir lenguaje articulado desaparece. Para el fisicalismo, esto indica que la mente no flota sobre el cuerpo: está indisolublemente anclada en —o constituida por— procesos biológicos y físicos."
      },
      {
        id: "estados_intencionales",
        title: "2. Creencias, deseos e intenciones",
        icon: "compass",
        summary: "La mente se caracteriza por la 'intencionalidad': apuntar hacia el mundo o referirse a algo.",
        detail: "Cuando piensas, piensas *sobre* algo (el examen, el clima, tus amigos). Estos estados se denominan 'estados intencionales'. Durante siglos, la filosofía consideró que la física no podía albergar significado o intencionalidad. El gran desafío del fisicalismo es explicar cómo un puñado de neuronas físicas puede llegar a tener un contenido que signifique 'mañana lloverá'."
      },
      {
        id: "psicologia_popular",
        title: "3. La Psicología Popular (Folk Psychology)",
        icon: "users",
        summary: "La teoría intuitiva y cotidiana que todos usamos para predecir y explicar la conducta humana.",
        detail: "Cuando dices: «Juan bebió agua porque *creía* que había agua en la nevera y *deseaba* calmar su sed», estás utilizando la 'psicología popular'. Es un marco conceptual basado en razones, creencias y deseos. Funciona extraordinariamente bien en el día a día, pero ¿es una teoría científica rigurosa sobre cómo funciona de verdad el cerebro humano?"
      }
    ],
    matchingActivity: {
      instruction: "Relaciona cada afirmación con el concepto filosófico correspondiente. Selecciona el concepto para cada tarjeta:",
      items: [
        {
          id: "m1",
          statement: "«Todo lo que existe en el universo está compuesto por entidades físicas y gobernado por leyes físicas; no existen almas inmateriales».",
          correctConcept: "Fisicalismo",
          feedback: "¡Exacto! Esta es la tesis ontológica básica del fisicalismo: el rechazo de sustancias no físicas separadas del orden natural."
        },
        {
          id: "m2",
          statement: "«Explicamos que María no fue a la fiesta porque 'creía que su ex estaría allí' y 'deseaba evitar un momento incómodo'».",
          correctConcept: "Psicología Popular",
          feedback: "¡Correcto! Usar 'creencias' y 'deseos' como causas cotidianas de la conducta es la esencia de la psicología popular (folk psychology)."
        },
        {
          id: "m3",
          statement: "«El miedo que siento ante un peligro se corresponde de manera directa con la activación de mi amígdala cerebral y la liberación de adrenalina».",
          correctConcept: "Dependencia Psicofísica",
          feedback: "¡Muy bien! Muestra cómo los estados subjetivos están directamente vinculados o determinados por mecanismos neurobiológicos."
        },
        {
          id: "m4",
          statement: "«La propiedad por la cual un pensamiento se dirige hacia algo externo (por ejemplo, pensar *sobre* las vacaciones)».",
          correctConcept: "Intencionalidad",
          feedback: "¡Brillante! La intencionalidad es la propiedad de los estados mentales de tratar sobre cosas, tener significado o representar objetos."
        }
      ],
      conceptOptions: [
        "Fisicalismo",
        "Psicología Popular",
        "Dependencia Psicofísica",
        "Intencionalidad"
      ]
    }
  },

  // Fase 3: La Analogía Astronómica
  phase3: {
    astronomicalContext: {
      title: "De Ptolomeo a Copérnico: Las trampas de las apariencias",
      geocentricText: "Durante más de mil años, la humanidad observó el cielo y vio cómo el Sol se elevaba por el este y se ponía por el oeste. El modelo geocéntrico de Ptolomeo formalizó esta intuición: la Tierra inmóvil en el centro y las esferas celestes girando a su alrededor.",
      heliocentricText: "Copérnico, Galileo y Kepler demostraron que la apariencia era engañosa: es la Tierra la que rota sobre su propio eje y orbita alrededor del Sol. La teoría geocéntrica no solo fue corregida; fue radicalmente superada y eliminada de la ciencia moderna.",
      analogyCore: "Fíjate en este detalle lingüístico crucial: Hoy en día, todos los astrónomos y nosotros mismos seguimos diciendo frases como «el Sol sale a las 7:15» o «la puesta de sol fue preciosa». Sin embargo, nadie deduce literalmente de esa frase cotidiana que el Sol esté dando vueltas alrededor de una Tierra estática."
    },
    reflectionQuestion: {
      prompt: "«Si seguimos hablando a diario de 'creencias', 'deseos' e 'intenciones', ¿significa necesariamente que existen como entidades mentales independientes dentro de la cabeza, o podría ser una convención lingüística similar a 'la salida del sol'?»",
      options: [
        {
          id: "opt_a",
          text: "Nuestra forma de hablar demuestra con certeza que las creencias y deseos son entidades inmateriales reales.",
          validity: "inadecuada",
          feedback: "Cuidado: el ejemplo astronómico demuestra precisamente lo contrario. El hecho de que usemos una expresión cotidiana («el sol sale») no garantiza la existencia real del fenómeno físico tal como lo describe el lenguaje común."
        },
        {
          id: "opt_b",
          text: "El lenguaje cotidiano de la psicología popular puede sobrevivir por utilidad práctica, aunque la neurociencia demuestre que el cerebro no funciona mediante 'creencias' y 'deseos' aislados.",
          validity: "acertada",
          feedback: "¡Excelente análisis filosófico! Esta es la clave de la analogía: las herramientas conceptuales cotidianas pueden ser útiles para comunicarnos sin que por ello constituyan una descripción científica exacta de la arquitectura cerebral."
        },
        {
          id: "opt_c",
          text: "La analogía demuestra automáticamente y de forma indiscutible que la mente no existe en absoluto.",
          validity: "exagerada",
          feedback: "Precaución metodológica: la analogía ilustra cómo el lenguaje puede sobrevivir a un cambio teórico, pero NO demuestra por sí sola que la mente sea una ilusión total. Es un modelo comparativo, no una prueba empírica concluyente."
        }
      ],
      openPrompt: "Justifica con tus propias palabras: ¿Crees que la neurociencia terminará sustituyendo palabras como «creencia» o «deseo» por términos neurobiológicos, o seguiremos usándolas siempre en la vida cotidiana? ¿Por qué?"
    }
  },

  // Fase 4: Tres Posiciones Filosóficas
  phase4: {
    cards: [
      {
        id: "fisicalismo_general",
        badge: "Marco General",
        title: "A. Fisicalismo General",
        author: "Propuesta ontológica amplia",
        avatar: "atom",
        color: "#3b82f6",
        coreIdea: "La mente no constituye una realidad separada de la física. Los fenómenos mentales deben explicarse en relación con los procesos físicos cerebrales.",
        theses: [
          "Rechazo tajante del dualismo de sustancias de Descartes (no hay *res cogitans* inmaterial).",
          "Admite diversas corrientes: algunos piensan que cada estado mental es idéntico a un estado cerebral; otros admiten que los conceptos mentales son propiedades emergentes o funcionales.",
          "IMPORTANTE: No todo fisicalista sostiene que debamos borrar o eliminar los conceptos de la psicología popular."
        ],
        quote: "«No hay nada en el universo que no sea físico; la conciencia debe encontrar su lugar dentro del orden natural o ser explicada por él»."
      },
      {
        id: "churchland_eliminativismo",
        badge: "Postura Radical",
        title: "B. Paul y Patricia Churchland",
        author: "Materialismo Eliminativo",
        avatar: "flame",
        color: "#ef4444",
        coreIdea: "La psicología popular es una teoría falsa, estancada e inadecuada. Conceptos como 'creencia' o 'deseo' no serán reducidos: serán eliminados por la neurobiología madura.",
        theses: [
          "Comparan la psicología popular con viejas teorías científicas erróneas como el 'flogisto' (sustancia del fuego), el 'calórico' o los 'espíritus animales'.",
          "El flogisto no se redujo a oxígeno; simplemente se descartó porque no existía nada semejante.",
          "De igual modo, cuando la neurociencia se desarrolle por completo, descubriremos que en el cerebro hay redes neuronales recurrentes, patrones sinápticos y vectores de activación, pero no 'creencias' ni 'deseos' discretos."
        ],
        quote: "«Nuestra concepción de sentido común de los fenómenos psicológicos constituye una teoría radicalmente falsa que finalmente será desplazada por la neurociencia»."
      },
      {
        id: "dennett_interfaz",
        badge: "Postura Pragmática / Evolutiva",
        title: "C. Daniel Dennett",
        author: "Postura Intencional y la Metáfora del Escritorio",
        avatar: "monitor",
        color: "#00e5ff",
        coreIdea: "La mente y la conciencia deben entenderse desde la evolución y la física. Nuestra mente consciente funciona como la 'interfaz de usuario' de un ordenador.",
        theses: [
          "La metáfora del escritorio: En tu pantalla ves iconos, carpetas y una papelera. Haces clic y arrastras un archivo a la papelera. ¿Hay en el microprocesador carpetas físicas o camiones de basura diminutos? ¡No!",
          "Debajo solo hay transistores de silicio, conmutaciones de voltaje y unos y ceros. La interfaz oculta la inmensa complejidad del hardware para permitir al usuario actuar eficazmente.",
          "Nuestra mente consciente es una 'ilusión de usuario' evolucionada: una simplificación biológica admirable que nos permite interactuar con el entorno y con otros cerebros.",
          "Dennett NO afirma simplemente que 'la conciencia sea irreal', sino que nuestra imagen intuitiva (el 'Teatro Cartesiano' donde un 'yo' contempla una pantalla interior) es un error categorial."
        ],
        quote: "«La interfaz del escritorio no es una mentira: es una abstracción útil. La conciencia es la forma en que el cerebro se representa a sí mismo sus propios procesos»."
      }
    ],

    desktopMetaphorDetails: {
      title: "La Metáfora del Escritorio Informático de Dennett",
      items: [
        {
          element: "Carpetas e Iconos en Pantalla",
          meaning: "Nuestras creencias, deseos, sensaciones conscientes y el 'yo' intuitivo.",
          role: "Son abstracciones útiles que nos permiten tomar decisiones y navegar la realidad sin tener que calcular millones de impulsos neuronales."
        },
        {
          element: "El Hardware, Microchips y Bits",
          meaning: "La neurofisiología cerebral real: 86.000 millones de neuronas, sinapsis y potenciales de acción.",
          role: "Es el soporte causal físico y evolutivo que hace posible la experiencia, aunque no se parece en nada visual a la interfaz."
        },
        {
          element: "La Ilusión de Usuario (*User-Illusion*)",
          meaning: "La conciencia cotidiana.",
          role: "No es una falsedad sin valor, sino una herramienta indispensable diseñada por la selección natural para interactuar con el mundo."
        }
      ]
    },

    comparativeQuiz: [
      {
        id: "comp_1",
        statement: "«Las 'creencias' y los 'deseos' son como el flogisto o los demonios: conceptos vacíos de una teoría arcaica que la neurociencia acabará borrando del mapa conceptual».",
        correct: "churchland",
        explanation: "Paul y Patricia Churchland defienden el eliminativismo radical: la psicología del sentido común no será traducida o explicada, sino eliminada y reemplazada por la neurobiología."
      },
      {
        id: "comp_2",
        statement: "«Atribuir creencias y deseos a alguien es una 'estrategia de interpretación' sumamente eficaz (la postura intencional), equivalente a usar la interfaz de un sistema operativo, aunque no haya iconos dentro del chip».",
        correct: "dennett",
        explanation: "Es la postura característica de Daniel Dennett: la mente cotidiana es una interfaz pragmática evolucionada (*user-illusion*) que nos permite predecir conductas sin confundir el icono con el hardware."
      },
      {
        id: "comp_3",
        statement: "«Todo fenómeno mental se asienta en procesos físicos y biológicos del cuerpo humano, sin recurrir a sustancias espirituales inmateriales, aunque podamos debatir si los conceptos cotidianos se mantienen o no».",
        correct: "fisicalismo",
        explanation: "Esta es la posición compartida del Fisicalismo General: establece el principio naturalista y materialista básico, sobre el cual luego debaten eliminativistas y funcionalistas."
      },
      {
        id: "comp_4",
        statement: "«No todos los que defienden que la mente es física creen que debamos dejar de decir 'tengo frío' o 'deseo un café' para hablar exclusivamente de potenciales de acción en el tálamo».",
        correct: "fisicalismo",
        explanation: "¡Muy importante distinción! Muchos fisicalistas (fisicalismo no reduccionista, funcionalismo) consideran perfectamente legítimos los conceptos mentales funcionales sin necesidad de eliminarlos."
      }
    ]
  },

  // Fase 5: Laboratorio de Ideas (Evaluación Formativa)
  phase5: {
    exercise1: {
      title: "Ejercicio 1: El Clasificador de Teorías (Laboratorio de Muestras)",
      instructions: "Examina cada 'Muestra Conceptual' en la consola y arrástrala o deposítala en la bandeja teórica que le corresponde:",
      trays: [
        {
          id: "Fisicalismo General",
          classKey: "fisicalismo",
          icon: "⚛️",
          title: "Fisicalismo General",
          tagline: "Compromiso ontológico: todo lo que existe es físico y biológico."
        },
        {
          id: "Psicología Popular",
          classKey: "psicopop",
          icon: "👥",
          title: "Psicología Popular",
          tagline: "Marco cotidiano de razones, creencias y deseos conscientes."
        },
        {
          id: "Materialismo Eliminativo",
          classKey: "churchland",
          icon: "🔥",
          title: "Materialismo Eliminativo",
          tagline: "Reemplazo radical: la psicología popular es falsa como el flogisto."
        },
        {
          id: "Daniel Dennett",
          classKey: "dennett",
          icon: "💻",
          title: "Daniel Dennett",
          tagline: "La mente como interfaz evolutiva y postura intencional pragmática."
        }
      ],
      cases: [
        {
          id: "ex1_c3",
          text: "«En el cerebro maduro investigado por la ciencia del siglo XXI no encontraremos 'creencias', del mismo modo que la química no encontró 'flogisto' en la combustión».",
          correct: "Materialismo Eliminativo",
          rationale: "Tesis de eliminación radical de Paul y Patricia Churchland: la psicología popular será reemplazada como el flogisto."
        },
        {
          id: "ex1_c4",
          text: "«La conciencia es como el entorno gráfico del escritorio de Windows o macOS: nos permite usar el cerebro sin conocer su programación de bajo nivel».",
          correct: "Daniel Dennett",
          rationale: "La célebre metáfora de la interfaz de usuario de Daniel Dennett: abstracción pragmática necesaria."
        },
        {
          id: "ex1_c1",
          text: "«La mente es idéntica a o superveniente sobre los procesos físicos del cerebro; la naturaleza es enteramente material».",
          correct: "Fisicalismo General",
          rationale: "Fisicalismo ontológico básico: compromiso con la naturaleza puramente física del universo."
        },
        {
          id: "ex1_c2",
          text: "«Mi amigo no come pizza porque 'desea adelgazar' y 'cree que la masa tiene demasiados carbohidratos'».",
          correct: "Psicología Popular",
          rationale: "Explicación cotidiana basada en la atribución ordinaria de deseos y creencias conscientes."
        }
      ]
    },

    exercise2: {
      title: "Ejercicio 2: Estudio de Caso Aplicado",
      caseText: "«Marta se asoma al balcón, observa nubes oscuras en el horizonte, CREE que va a llover, DESEA no mojarse en el camino hacia la universidad y DECIDE coger el paraguas».",
      tasks: [
        {
          id: "ex2_t1",
          question: "¿Cómo interpretaría esta misma situación un fisicalista no eliminativo (estándar)?",
          options: [
            {
              id: "a",
              text: "Marta posee un alma inmaterial que toma la decisión libre e independiente del cerebro.",
              feedback: "Incorrecto: el fisicalismo rechaza el alma inmaterial."
            },
            {
              id: "b",
              text: "La creencia y el deseo de Marta son estados mentales reales causados por procesos físicos y cerebrales (visión de nubes procesada en la corteza occipital, conexiones hacia la memoria y áreas motoras). El vocabulario de creencias y deseos sigue siendo explicativamente válido.",
              feedback: "¡Exacto! El fisicalismo estándar preserva el valor descriptivo de los estados mentales reconociendo su base física.",
              correct: true
            },
            {
              id: "c",
              text: "Marta no existe y el paraguas es una alucinación cuántica.",
              feedback: "Incorrecto: esto es un solipsismo absurdo ajeno a la discusión.",
              correct: false
            }
          ]
        },
        {
          id: "ex2_t2",
          question: "¿Cómo interpretaría esta misma situación el materialismo eliminativo de Paul y Patricia Churchland?",
          options: [
            {
              id: "a",
              text: "Decir que Marta 'cree' y 'desea' es solo un mito precientífico. Lo que realmente ocurre es una compleja activación de vectores en redes neuronales sensoriales y motoras. En una ciencia madura, las palabras 'creencia' y 'deseo' no figurarán en la explicación.",
              feedback: "¡Brillante aplicación! Para los Churchland, la psicología popular es un esquema caduco que será sustituido por la neurodinámica precisa.",
              correct: true
            },
            {
              id: "b",
              text: "Los Churchland dirían que Marta tiene poderes telepáticos con las nubes.",
              feedback: "Incorrecto: los Churchland son materialistas científicos rigurosos.",
              correct: false
            },
            {
              id: "c",
              text: "Los Churchland afirmarían que la creencia es inmaterial pero el deseo es físico.",
              feedback: "Incorrecto: los Churchland rechazan cualquier noción inmaterial y eliminan ambos conceptos.",
              correct: false
            }
          ]
        }
      ]
    },

    exercise3: {
      title: "Ejercicio 3: Desarmando la Metáfora del Escritorio",
      instruction: "Analiza los componentes de la metáfora de Dennett y demuestra que comprendes su alcance filosófico:",
      questions: [
        {
          id: "ex3_q1",
          prompt: "En la metáfora de Dennett, ¿qué representan los iconos y carpetas del escritorio?",
          options: [
            { id: "a", text: "Neuronas microscópicas aisladas.", correct: false },
            { id: "b", text: "Nuestros estados conscientes accesibles (creencias, sensaciones, emociones subjetivas).", correct: true },
            { id: "c", text: "Errores del programador biológico que deben eliminarse inmediatamente.", correct: false }
          ],
          feedback: "Los iconos representan la interfaz cognitiva accesible al sujeto: una representación simplificada y funcional."
        },
        {
          id: "ex3_q2",
          prompt: "¿Por qué el microprocesador no necesita tener 'carpetas diminutas' en su interior?",
          options: [
            { id: "a", text: "Porque el nivel físico opera mediante voltajes y circuitos binarios; la 'carpeta' es un nivel de abstracción de la interfaz para el usuario.", correct: true },
            { id: "b", text: "Porque las carpetas son mágicas y no dependen de la electricidad.", correct: false },
            { id: "c", text: "Porque el ordenador no puede procesar información visual.", correct: false }
          ],
          feedback: "¡Fundamental! Confundir el contenido de la interfaz con la estructura del hardware físico es lo que Gilbert Ryle y Dennett llamarían un 'error categorial'."
        },
        {
          id: "ex3_q3",
          prompt: "¿Concluye Dennett que la conciencia 'no existe en ningún sentido'?",
          options: [
            { id: "a", text: "Sí, Dennett afirma que todos somos zombis filosóficos y que nadie tiene ninguna experiencia.", correct: false },
            { id: "b", text: "No: Dennett sostiene que la conciencia existe como interfaz evolutiva real, pero rechaza la fantasía de un 'teatro interno' donde un homúnculo mira la pantalla.", correct: true }
          ],
          feedback: "¡Precisión esencial! Dennett no niega la experiencia, sino la explicación mitológica cartesiana que solemos darle."
        }
      ]
    },

    exercise4: {
      title: "Ejercicio 4: Pensamiento Crítico con Thomas Nagel",
      reading: {
        author: "Thomas Nagel",
        source: "Reseña crítica sobre Daniel Dennett (The New York Review of Books)",
        quote: "«Dennett lleva 50 años en un proyecto de desencantamiento del mundo humano, usando la ciencia para liberarnos de lo que él considera que son ilusiones. Este desencantamiento es la expulsión de todo espíritu fuera de la máquina biológica, de todo fenómeno (principalmente la conciencia) que no encaje con la visión científica materialista. Dennett, como Dawkins [otro filósofo fisicalista], considera que nos está liberando de la ignorancia y del pensamiento mágico; otra lectura diría que su desencantamiento nos deja en un mundo sin ningún encanto, sin ningún significado, simplemente como robots o, usando sus propios términos, como ilusiones del usuario, inexistentes fabricaciones de la maquinaria cerebral»."
      },
      criticalQuestions: [
        {
          id: "nagel_q1",
          prompt: "1. ¿Está de acuerdo Thomas Nagel con el proyecto de Daniel Dennett sobre la mente humana?",
          options: [
            { id: "a", text: "Sí, coincide plenamente en que la conciencia es una ilusión prescindible y que somos máquinas sin significado.", correct: false },
            { id: "b", text: "No, discrepa con firmeza: denuncia que el proyecto de Dennett reduce a los seres humanos a meros robots o ficciones mecánicas vacías de significado.", correct: true }
          ],
          feedback: "Nagel señala la gravedad del reduccionismo de Dennett: al expulsar la conciencia de la realidad, nos despoja de aquello que otorga sentido a la vida humana."
        },
        {
          id: "nagel_q2",
          prompt: "2. ¿Qué aspecto fundamental de la posición de Dennett está criticando Nagel en este pasaje?",
          options: [
            { id: "a", text: "Critica que Dennett reduzca la conciencia a 'ilusiones del usuario' e 'inexistentes fabricaciones' de la maquinaria biológica, tratándonos como robots.", correct: true },
            { id: "b", text: "Critica que Dennett no sea un científico de laboratorio.", correct: false },
            { id: "c", text: "Critica que Dennett defienda la existencia de un alma religiosa inmaterial.", correct: false }
          ],
          feedback: "Nagel ataca directamente el núcleo de Dennett: la pretensión de que la conciencia no es real, sino solo una 'ilusión de usuario' o un truco evolutivo de la máquina cerebral."
        },
        {
          id: "nagel_q3",
          prompt: "3. Rigor conceptual: ¿Podemos concluir que Thomas Nagel es DUALISTA basándonos exclusivamente en este fragmento?",
          options: [
            {
              id: "a",
              text: "Sí, cualquiera que critique el fisicalismo o a Dennett tiene que ser obligatoriamente un dualista cartesiano que cree en almas inmateriales.",
              correct: false,
              feedback: "¡Cuidado con la falacia del falso dilema! Criticar una teoría fisicalista reduccionista no te convierte automáticamente en creyente del alma cartesiana."
            },
            {
              id: "b",
              text: "No. Criticar el reduccionismo o señalar los límites del fisicalismo actual no equivale a abrazar el dualismo de sustancias. Nagel plantea un enigma epistemológico y ontológico sobre la subjetividad, sin afirmar necesariamente una sustancia espiritual separada.",
              correct: true,
              feedback: "¡Brillante rigor filosófico! Nagel no propone un alma inmaterial separada; de hecho, en obras posteriores explora el monismo de doble aspecto o un naturalismo no mecanicista."
            }
          ]
        },
        {
          id: "nagel_q4_text",
          prompt: "4. Pregunta argumentativa: ¿Qué argumentos o pruebas adicionales necesitaríamos examinar en los textos de un filósofo para determinar con exactitud su postura (por ejemplo, si defiende un dualismo de propiedades, un monismo neutral o un fisicalismo no reduccionista)?",
          rubric: [
            "Criterio 1: Reconoce que existen múltiples alternativas entre el materialismo estricto y el dualismo religioso (ej. monismo de aspecto dual, emergentismo).",
            "Criterio 2: Señala la necesidad de comprobar si el autor admite o rechaza el cierre causal del mundo físico.",
            "Criterio 3: Exige ver cómo explica el autor la interacción causal entre la mente y el cuerpo."
          ],
          placeholder: "Redacta tu justificación filosófica aquí. Explica por qué rechazar a Dennett no implica automáticamente creer en fantasmas o almas..."
        }
      ]
    }
  },

  // Mapa conceptual para Fase 6
  conceptualMap: {
    nodes: [
      { id: "fisicalismo", label: "Fisicalismo", category: "ontologia", desc: "Todo lo que existe es físico; la mente se fundamenta en la naturaleza material." },
      { id: "psico_pop", label: "Psicología Popular", category: "lenguaje", desc: "Marco cotidiano que explica acciones mediante creencias, deseos e intenciones." },
      { id: "eliminativismo", label: "Materialismo Eliminativo\n(P. y P. Churchland)", category: "teoria_radical", desc: "La psicología popular es falsa: será erradicada y reemplazada por la neurociencia." },
      { id: "dennett", label: "Daniel Dennett\n(Interfaz y Postura Intencional)", category: "teoria_funcional", desc: "La mente cotidiana es una 'ilusión de usuario' evolutiva útil, no un teatro cartesiano." },
      { id: "conciencia", label: "El Problema de la Conciencia\n(T. Nagel)", category: "problema", desc: "El misterio de la subjetividad: 'lo que se siente' en primera persona frente a la descripción física." }
    ],
    links: [
      { from: "fisicalismo", to: "eliminativismo", label: "Variante radical: rechaza conceptos mentales" },
      { from: "fisicalismo", to: "dennett", label: "Variante evolutiva: reinterpreta como interfaz" },
      { from: "psico_pop", to: "eliminativismo", label: "Considerada por Churchland una teoría errónea a eliminar" },
      { from: "psico_pop", to: "dennett", label: "Considerada por Dennett una abstracción pragmática necesaria" },
      { from: "dennett", to: "conciencia", label: "Cuestionada por Nagel por omitir el carácter subjetivo" }
    ]
  }
};

window.PHILOSOPHY_DATA = PHILOSOPHY_DATA;
