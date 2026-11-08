// App del quiz — sin frameworks, un pequeño router de vistas manual.
// Adaptado del quiz de CAyE 1: acá no hay ejercicio práctico ni desarrollo
// teórico, los 4 modelos son puramente multiple choice, así que se va
// directo de la portada al cuestionario.
const app = document.getElementById("app");

const state = {
  view: "home", // home | quiz | results
  modelId: null,
  currentQuestion: 0,
  answers: {}, // { questionIndex: selectedLetter }
};

function getModel(id) {
  return MODELS.find((m) => m.id === id);
}

function renderMath(container) {
  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
    });
  }
}

function header() {
  return `
    <header class="site-header">
      <a class="brand" href="../index.html"><span class="mark">SR</span> Modelo de Parcial</a>
      <span class="badge">Sistemas de Representación · 2.º parcial</span>
    </header>
  `;
}

function footer() {
  return `<footer class="site-footer">Material de práctica — 2.º parcial, Sistemas de Representación</footer>`;
}

/* ---------------- HOME ---------------- */
function renderHome() {
  app.innerHTML = `
    ${header()}
    <div class="card hero">
      <h1>Elegí un modelo para practicar</h1>
      <p>Cada modelo es un cuestionario multiple choice de las unidades U4 a U10 (Proyecciones, Dimensionado, Medición/tolerancias/ajustes, Croquis, Representaciones convencionales y Soldaduras), con corrección y justificación inmediata.</p>
      <div class="model-grid">
        ${MODELS.map(
          (m, i) => `
          <button class="model-card" data-model="${m.id}" style="animation-delay:${i * 70}ms">
            <span class="num">${m.id}</span>
            ${m.tag ? `<span class="tag">${m.tag}</span>` : ""}
            <h3>${m.title}</h3>
            <p>${m.subtitle} · ${m.questions.length} preguntas</p>
          </button>
        `
        ).join("")}
      </div>
    </div>
    ${footer()}
  `;

  app.querySelectorAll(".model-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.modelId = Number(btn.dataset.model);
      state.answers = {};
      state.currentQuestion = 0;
      state.view = "quiz";
      render();
    });
  });
}

/* ---------------- QUIZ ---------------- */
function renderQuiz() {
  const model = getModel(state.modelId);
  const idx = state.currentQuestion ?? 0;
  const q = model.questions[idx];
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

  let feedbackHtml = "";
  if (answered) {
    const isOk = answered === q.correct;
    feedbackHtml = `
      <div class="feedback ${isOk ? "ok" : "bad"}">
        <div class="verdict">${isOk ? "✅ ¡Correcto!" : "❌ Incorrecto — la respuesta correcta es " + q.correct}</div>
        <div class="justification">${q.justification}</div>
      </div>
    `;
  }

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
      <div class="progress-bar"><div class="fill" style="width:${((idx) / total) * 100}%"></div></div>
      ${q.unit ? `<span class="tag">${q.unit}</span>` : ""}
      <p class="question-text">${q.n}. ${q.text}</p>
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

  renderMath(app);

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

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.addEventListener("click", () => {
    if (idx + 1 === total) {
      state.view = "results";
    } else {
      state.currentQuestion = idx + 1;
    }
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
  feedback.innerHTML = `
    <div class="verdict">${isOk ? "✅ ¡Correcto!" : "❌ Incorrecto — la respuesta correcta es " + q.correct}</div>
    <div class="justification">${q.justification}</div>
  `;
  optionsEl.insertAdjacentElement("afterend", feedback);
  renderMath(feedback);

  document.getElementById("nextBtn").disabled = false;
}

/* ---------------- RESULTS ---------------- */
function renderResults() {
  const model = getModel(state.modelId);
  const total = model.questions.length;
  let correctCount = 0;

  const reviewHtml = model.questions
    .map((q, i) => {
      const userAnswer = state.answers[i];
      const isOk = userAnswer === q.correct;
      if (isOk) correctCount++;
      return `
        <div class="review-item ${isOk ? "ok" : "bad"}">
          <span class="icon">${isOk ? "✅" : "❌"}</span>
          <span>${q.n}. ${q.text} <strong>(Correcta: ${q.correct})</strong></span>
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

  renderMath(app);

  document.getElementById("retryBtn").addEventListener("click", () => {
    state.answers = {};
    state.currentQuestion = 0;
    state.view = "quiz";
    render();
  });
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
  else if (state.view === "quiz") renderQuiz();
  else if (state.view === "results") renderResults();
}

render();
