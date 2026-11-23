// App del modelo de parcial de Ingeniería y Sociedad — sin frameworks, un pequeño router de vistas manual.
// Cada modelo muestra primero las preguntas a desarrollar (con la guía de respuesta desplegable)
// y después el cuestionario multiple choice, con el mismo formato que las otras materias.
const app = document.getElementById("app");

const state = {
  view: "home", // home | reference | quiz | results
  modelId: null,
  order: [], // índices de las preguntas en el orden en que se muestran
  currentQuestion: 0,
  answers: {}, // { posición: letra elegida }
};

function getModel(id) {
  return MODELS.find((m) => m.id === id);
}

function shuffled(n) {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz(model) {
  const n = model.questions.length;
  state.order = model.shuffle ? shuffled(n) : [...Array(n).keys()];
  state.answers = {};
  state.currentQuestion = 0;
  state.view = "quiz";
  render();
}

function header() {
  return `
    <header class="site-header">
      <a class="brand" href="../index.html"><span class="mark">IS</span> Modelo de Parcial</a>
      <span class="badge">Ingeniería y Sociedad</span>
    </header>
  `;
}

function footer() {
  return `<footer class="site-footer">Material de práctica — Ingeniería y Sociedad · UTN FRH</footer>`;
}

/* ---------------- HOME ---------------- */
function renderHome() {
  const totalD = (m) => m.desarrollo.reduce((s, d) => s + d.items.length, 0);
  app.innerHTML = `
    ${header()}
    <div class="card hero">
      <h1>Elegí un modelo para practicar</h1>
      <p>Cada modelo tiene las preguntas a desarrollar de sus temas (respondelas en voz alta y después abrí la guía de respuesta) y un cuestionario multiple choice con corrección y justificación inmediata.</p>
      <div class="model-grid">
        ${MODELS.map(
          (m, i) => `
          <button class="model-card" data-model="${m.id}" style="animation-delay:${i * 70}ms">
            <span class="num">${m.id}</span>
            ${m.tag ? `<span class="tag">${m.tag}</span>` : ""}
            <h3>${m.title}</h3>
            <p>${m.subtitle}</p>
            <p>${totalD(m)} a desarrollar · ${m.questions.length} multiple choice</p>
          </button>
        `
        ).join("")}
      </div>
    </div>
    <div class="card">
      <span class="section-label">Teoría</span>
      <a class="model-card as-link apuntes-card" href="apuntes.html">
        <span class="num">📖</span>
        <span class="tag">11 objetivos · Clases 17-28</span>
        <h3>Apuntes</h3>
        <p>Apunte teórico completo para leer, un objetivo de examen por pestaña.</p>
      </a>
    </div>
    ${footer()}
  `;

  app.querySelectorAll("button.model-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.modelId = Number(btn.dataset.model);
      state.answers = {};
      state.view = "reference";
      render();
    });
  });
}

/* ---------------- REFERENCE (preguntas a desarrollar) ---------------- */
function renderReference() {
  const model = getModel(state.modelId);
  let k = 0;
  const devHtml = model.desarrollo
    .map(
      (d) => `
    <div class="card">
      <div class="dev-head">
        <span class="section-label">Objetivo ${d.tema}</span>
      </div>
      <h2><a href="apuntes.html#tema-${d.tema}" target="_blank" rel="noopener">${d.title}</a></h2>
      ${d.items
        .map(
          (it) => `
        <div class="dev-item">
          <p class="dev-q"><span class="qn">D${++k}</span><span>${it.text}</span></p>
          <details class="resolution-box">
            <summary>Ver guía de respuesta</summary>
            <div class="inner">${it.guide}</div>
          </details>
        </div>`
        )
        .join("")}
    </div>`
    )
    .join("");

  app.innerHTML = `
    ${header()}
    <div class="top-nav">
      <button class="link-btn" id="backHome">&larr; Elegir otro modelo</button>
      ${model.tag ? `<span class="tag">${model.tag}</span>` : ""}
    </div>

    <div class="card">
      <span class="section-label">Parte 1 · Preguntas a desarrollar</span>
      <h2>${model.title}</h2>
      <p>Respondé cada pregunta en voz alta y después abrí <strong>Ver guía de respuesta</strong> para comprobar si vas por buen camino.</p>
    </div>

    ${devHtml}

    <div class="card" style="text-align:center;">
      <span class="section-label">Parte 2 · Multiple choice</span>
      <h2>¿Listo para las ${model.questions.length} preguntas?</h2>
      <p>Seleccioná una opción por pregunta. Vas a ver al instante si es correcta, con su justificación.</p>
      <div class="btn-row">
        <button class="btn btn-primary" id="startQuiz">Comenzar cuestionario</button>
      </div>
    </div>
    ${footer()}
  `;

  document.getElementById("backHome").addEventListener("click", () => {
    state.view = "home";
    render();
  });
  document.getElementById("startQuiz").addEventListener("click", () => startQuiz(model));
}

/* ---------------- QUIZ ---------------- */
function verdictHtml(isOk, q) {
  return `<div class="verdict">${isOk ? "✅ ¡Correcto!" : "❌ Incorrecto — la respuesta correcta es la " + q.correct + ")"}</div>
    <div class="justification">${q.justification}</div>`;
}

function renderQuiz() {
  const model = getModel(state.modelId);
  const idx = state.currentQuestion ?? 0;
  const q = model.questions[state.order[idx]];
  const total = model.questions.length;
  const answered = state.answers[idx];

  const optionsHtml = Object.entries(q.options)
    .map(([letter, text]) => {
      let cls = "option-btn";
      if (answered) {
        if (letter === q.correct) cls += " is-correct";
        else if (letter === answered) cls += " is-incorrect";
      }
      return `
        <button class="${cls}" data-letter="${letter}" ${answered ? "disabled" : ""}>
          <span class="letter">${letter}</span>
          <span>${text}</span>
        </button>
      `;
    })
    .join("");

  const feedbackHtml = answered
    ? `<div class="feedback ${answered === q.correct ? "ok" : "bad"}">${verdictHtml(answered === q.correct, q)}</div>`
    : "";

  app.innerHTML = `
    ${header()}
    <div class="top-nav">
      <button class="link-btn" id="backHome">&larr; Elegir otro modelo</button>
      ${model.tag ? `<span class="tag">${model.tag}</span>` : ""}
    </div>
    <div class="card">
      <div class="progress-meta">
        <span>Pregunta ${idx + 1} de ${total}</span>
        <span>${model.title}</span>
      </div>
      <div class="progress-bar"><div class="fill" style="width:${(idx / total) * 100}%"></div></div>
      ${q.unit ? `<span class="tag">${q.unit}</span>` : ""}
      <p class="question-text">${idx + 1}. ${q.text}</p>
      <div class="options${answered ? " answered" : ""}">${optionsHtml}</div>
      ${feedbackHtml}
      <div class="quiz-footer">
        <button class="btn btn-primary" id="nextBtn" ${answered ? "" : "disabled"}>
          ${idx + 1 === total ? "Ver resultado final" : "Siguiente pregunta"}
        </button>
      </div>
    </div>
    ${footer()}
  `;

  document.getElementById("backHome").addEventListener("click", () => {
    state.view = "home";
    render();
  });

  app.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.answers[idx]) return;
      state.answers[idx] = btn.dataset.letter;
      revealAnswer(idx, q);
    });
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (idx + 1 === total) state.view = "results";
    else state.currentQuestion = idx + 1;
    render();
  });
}

// Actualiza la pregunta ya renderizada en el lugar (sin re-render completo)
// para que solo animen la opción elegida y el cuadro de feedback.
function revealAnswer(idx, q) {
  const optionsEl = app.querySelector(".options");
  const selectedLetter = state.answers[idx];
  optionsEl.classList.add("answered");

  optionsEl.querySelectorAll(".option-btn").forEach((btn) => {
    const letter = btn.dataset.letter;
    btn.disabled = true;
    if (letter === q.correct) btn.classList.add("is-correct");
    else if (letter === selectedLetter) btn.classList.add("is-incorrect");
  });

  const isOk = selectedLetter === q.correct;
  const feedback = document.createElement("div");
  feedback.className = `feedback ${isOk ? "ok" : "bad"}`;
  feedback.innerHTML = verdictHtml(isOk, q);
  optionsEl.insertAdjacentElement("afterend", feedback);

  document.getElementById("nextBtn").disabled = false;
}

/* ---------------- RESULTS ---------------- */
function renderResults() {
  const model = getModel(state.modelId);
  const total = model.questions.length;
  let correctCount = 0;

  const reviewHtml = state.order
    .map((qi, i) => {
      const q = model.questions[qi];
      const isOk = state.answers[i] === q.correct;
      if (isOk) correctCount++;
      return `
        <div class="review-item ${isOk ? "ok" : "bad"}">
          <span class="icon">${isOk ? "✅" : "❌"}</span>
          <span>${i + 1}. ${q.text} <strong>(Correcta: ${q.correct})</strong></span>
        </div>
      `;
    })
    .join("");

  const pct = Math.round((correctCount / total) * 100);

  app.innerHTML = `
    ${header()}
    <div class="card">
      <div class="result-score">
        <div class="big">${correctCount}/${total}</div>
        <div class="sub">${pct}% de respuestas correctas</div>
      </div>
      <div class="result-grid">
        <div class="stat"><div class="n">${correctCount}</div><div class="l">Correctas</div></div>
        <div class="stat"><div class="n">${total - correctCount}</div><div class="l">Incorrectas</div></div>
        <div class="stat"><div class="n">${pct}%</div><div class="l">Puntaje</div></div>
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" id="retryBtn">Reintentar este modelo</button>
        <button class="btn btn-primary" id="homeBtn">Elegir otro modelo</button>
      </div>
      <div class="review-list">${reviewHtml}</div>
    </div>
    ${footer()}
  `;

  document.getElementById("retryBtn").addEventListener("click", () => startQuiz(model));
  document.getElementById("homeBtn").addEventListener("click", () => {
    state.view = "home";
    state.modelId = null;
    state.answers = {};
    render();
  });
}

/* ---------------- ROUTER ---------------- */
function render() {
  window.scrollTo(0, 0);
  if (state.view === "home") renderHome();
  else if (state.view === "reference") renderReference();
  else if (state.view === "quiz") renderQuiz();
  else if (state.view === "results") renderResults();
}

render();
