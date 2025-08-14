// ——— Datos base: tono y contenido ———
const state = {
  lastBotText: "",
  premiumUnlocked: false,
  historiaStep: 0,
};

const contenido = {
  predicciones: [
    "Hoy podrías enamorarte de una arepa o perder una discusión con tu gato. Altamente probable que sean ambas.",
    "Si ves el número 7 tres veces, di 'arepa' en voz baja. No sirve de nada, pero te verás misterioso.",
    "Tu destino cambia si giras sobre ti 2 veces. Si te mareas, era el destino original.",
    "Te escribirán un mensaje inesperado. Tal vez sea tu ex, tal vez tu compañía telefónica. Sorpresa garantizada."
  ],
  frases: [
    "A veces la vida brilla… y a veces solo hace ruido. Igual baila.",
    "Si fallas hoy, dilo con confianza: fue un ensayo general para brillar mañana.",
    "No eres tarde: eres edición limitada.",
    "Tu caos también cuenta como coreografía. A tu ritmo."
  ],
  retos: [
    "Escribe un cumplido absurdo para alguien (“tus ideas huelen a éxito con canela”).",
    "Haz un mini baile de 5 segundos y ponle nombre épico.",
    "Dibuja una estrella en un papel y guárdala como talismán secreto.",
    "Envía un mensaje amable a alguien con quien no hablas hace tiempo."
  ],
  trivia: [
    "Si pudieras agregar un sabor nuevo a la arepa, ¿cuál sería y por qué suena épico?",
    "¿Qué superpoder inútil te gustaría tener por 24 horas?",
    "Completa: 'Mi día hoy será legendario porque…'"
  ],
  adivina: [
    { pistas: ["No hablo, pero cuento historias", "Estoy en tu bolsillo", "Me quedo sin energía rápido"], respuesta: "tu teléfono" },
    { pistas: ["Ves el mundo a través de mí", "No soy ventana", "Soy un rectángulo silencioso"], respuesta: "la pantalla" },
    { pistas: ["Me comes de mil formas", "Soy orgullo nacional", "Relleno tu vacío existencial"], respuesta: "la arepa" }
  ],
  premiumPredicciones: [
    "Tu yo alterno en un universo vecino acaba de aplaudirte. Algo hiciste bien aquí.",
    "Un giro pequeño hoy abre una puerta grande mañana. Sí, esa que aún no ves.",
    "La casualidad te está guiñando el ojo. Reguésale con actitud."
  ],
  historias: [
    [
      "Capítulo 1: Te despiertas con el superpoder de entender a los perros. Uno te dice: 'Café, humano. Necesitamos café.'",
      "Capítulo 2: Descubres un mapa en un recibo arrugado. Te indica… una arepera mística.",
      "Capítulo 3: La dueña te ofrece 'La Arepa del Destino'. Un mordisco y entiendes todo. Fin provisional."
    ],
    [
      "Capítulo 1: La nevera canta cada vez que la abres. Desafina, pero tiene corazón.",
      "Capítulo 2: Te pide que no la abandones los lunes. Haces un trato: más vegetales, menos drama.",
      "Capítulo 3: Ahora te da consejos de vida. Sorprendentemente, funcionan."
    ]
  ]
};

// ——— Utilidades ———
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ——— UI: pestañas ———
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  });
});

// ——— Chat ———
const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function addMsg(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `msg ${role}`;
  wrap.innerHTML = `<div class="bubble">${text}</div>`;
  chatWindow.appendChild(wrap);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  if (role === "bot") state.lastBotText = text;
}

function lunaticaReply(userText) {
  const t = userText.trim().toLowerCase();

  // “Intenciones” simples
  if (/(predic|destin|suerte|día)/.test(t)) {
    return "Predicción de hoy: " + rand(contenido.predicciones);
  }
  if (/(frase|motiv)/.test(t)) {
    return "Tu frase del día: " + rand(contenido.frases);
  }
  if (/(reto|challenge)/.test(t)) {
    return "Reto rápido: " + rand(contenido.retos);
  }
  if (/(juego|trivia|adivina)/.test(t)) {
    return "Te reto en 'Trivia loca': " + rand(contenido.trivia);
  }
  if (/(premium|exclusivo)/.test(t)) {
    return state.premiumUnlocked
      ? "Premium activo. Aquí va una predicción extra: " + rand(contenido.premiumPredicciones)
      : "Veo que quieres caos de lujo… Desbloquea Premium con el botón en la pestaña Premium.";
  }

  // Respuesta libre con tono “Lunática”
  const remates = [
    "Y si sale raro, dilo con estilo. Cuenta.",
    "Yo solo transmito energía caóticamente positiva.",
    "Confía: tu versión épica ya despertó.",
    "Si dudas, baila 5 segundos. Funciona el 63% de las veces."
  ];
  return `${capitalize(userText)}… interesante elección. ${rand(remates)}`;
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addMsg("user", text);
  setTimeout(() => addMsg("bot", lunaticaReply(text)), 300);
  chatInput.value = "";
});

// ——— Compartir ———
async function share(text) {
  const shareData = { title: "Lunática", text, url: location.href };
  try {
    if (navigator.share) await navigator.share(shareData);
    else {
      const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}%20%23Lun%C3%A1tica`;
      window.open(tweet, "_blank");
    }
  } catch {}
}

document.getElementById("shareLast").addEventListener("click", () => {
  if (state.lastBotText) share(state.lastBotText);
});

// ——— Juegos ———
document.getElementById("playTrivia").addEventListener("click", () => {
  const q = rand(contenido.trivia);
  document.getElementById("triviaOut").textContent = q;
});

document.getElementById("playAdivina").addEventListener("click", () => {
  const item = rand(contenido.adivina);
  const pistas = item.pistas.map((p, i) => `${i + 1}. ${p}`).join("  |  ");
  document.getElementById("adivinaOut").textContent = `Pistas: ${pistas}  → Respuesta en 5s…`;
  setTimeout(() => {
    document.getElementById("adivinaOut").textContent = `Respuesta: ${capitalize(item.respuesta)}. ¿Lo adivinaste?`;
  }, 5000);
});

// ——— Reto del día y frase ———
function loadReto() {
  const idx = new Date().getDate() % contenido.retos.length;
  document.getElementById("retoText").textContent = contenido.retos[idx];
}
function loadFrase() {
  const idx = new Date().getDate() % contenido.frases.length;
  document.getElementById("fraseText").textContent = contenido.frases[idx];
}
loadReto(); loadFrase();

document.getElementById("shareReto").addEventListener("click", () => {
  share("Mi reto de hoy con Lunática: " + document.getElementById("retoText").textContent);
});
document.getElementById("shareFrase").addEventListener("click", () => {
  share("Frase del día con Lunática: " + document.getElementById("fraseText").textContent);
});

// ——— Premium ———
const premiumCodes = ["LUNA-TEST"]; // Sustituye con tu verificación real (suscripción/pago)
document.getElementById("unlockPremium").addEventListener("click", () => {
  const code = document.getElementById("premiumCode").value.trim();
  if (premiumCodes.includes(code)) {
    state.premiumUnlocked = true;
    document.getElementById("premiumLocked").classList.add("hidden");
    document.getElementById("premiumContent").classList.remove("hidden");
    // Inicializa contenido premium
    state.historiaStep = 0;
    document.getElementById("historia").textContent = contenido.historias[0][0];
    document.getElementById("prediccionPro").textContent = rand(contenido.premiumPredicciones);
  } else {
    alert("Código inválido. Pista: LUNA-TEST (demo).");
  }
});

document.getElementById("historiaNext").addEventListener("click", () => {
  const saga = contenido.historias[0];
  state.historiaStep = (state.historiaStep + 1) % saga.length;
  document.getElementById("historia").textContent = saga[state.historiaStep];
});
document.getElementById("newPrediccionPro").addEventListener("click", () => {
  document.getElementById("prediccionPro").textContent = rand(contenido.premiumPredicciones);
});