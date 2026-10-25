// App del quiz — sin frameworks, un pequeño router de vistas manual.
const app = document.getElementById("app");

const state = {
  view: "home", // home | reference | quiz | results
  modelId: null,
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

function escapeIfNeeded(str) {
  return str; // el contenido es de confianza (datos propios en data.js)
}

function header() {
  return `
    <header class="site-header">
      <div class="brand"><span class="mark">AE</span> Modelo de Parcial</div>
      <span class="badge">CAyE 1 · U6-U14</span>
    </header>
  `;
}

function footer() {
  return `<footer class="site-footer">Material de práctica — Recuperatorio Segundo Parcial, Conocimientos Aeronáuticos y Espaciales 1</footer>`;
}

/* ---------------- HOME ---------------- */
function renderHome() {
  app.innerHTML = `
    ${header()}
    <div class="card hero">
      <h1>Elegí un modelo para practicar</h1>
      <p>Cada modelo incluye el ejercicio práctico y el desarrollo teórico de referencia, y un cuestionario de 18 preguntas multiple choice con corrección y justificación inmediata.</p>
      <div class="model-grid">
        ${MODELS.map(
          (m, i) => `
          <button class="model-card" data-model="${m.id}" style="animation-delay:${i * 70}ms">
            <span class="num">${m.id}</span>
            ${m.tag ? `<span class="tag">${m.tag}</span>` : ""}
            <h3>${m.title}</h3>
            <p>${m.subtitle}</p>
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
      state.view = "reference";
      render();
    });
  });
}

/* ---------------- REFERENCE (ejercicio + teoría) ---------------- */
function renderReference() {
  const model = getModel(state.modelId);
  const p = model.practical;
  const t = model.theoretical;

  const tableHtml = p.table
    ? `
    <table class="data-table">
      <thead><tr>${p.table.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>
        ${p.table.rows
          .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`)
          .join("")}
      </tbody>
    </table>
  `
    : "";

  app.innerHTML = `
    ${header()}
    <div class="top-nav">
      <button class="link-btn" id="backHome">&larr; Elegir otro modelo</button>
      ${model.tag ? `<span class="tag">${model.tag}</span>` : ""}
    </div>

    <div class="card">
      <span class="section-label">Parte 1 · Ejercicio práctico</span>
      <h2>${p.title}</h2>
      <p>${p.statement}</p>
      ${tableHtml}
      <p>${p.payload}</p>
      <ol class="asks">
        ${p.asks.map((a) => `<li>${a}</li>`).join("")}
      </ol>
      <details class="resolution-box">
        <summary>Ver resolución</summary>
        <div class="inner">${p.resolution}</div>
      </details>
    </div>

    <div class="card">
      <span class="section-label">Parte 2 · Desarrollo teórico</span>
      <h2>${t.title}</h2>
      <p>${t.prompt}</p>
      <details class="resolution-box">
        <summary>Ver puntos mínimos esperados</summary>
        <div class="inner">
          <ul class="theory-points">
            ${t.resolution.map((pt) => `<li>${pt}</li>`).join("")}
          </ul>
        </div>
      </details>
    </div>

    <div class="card" style="text-align:center;">
      <span class="section-label">Parte 3 · Multiple choice</span>
      <h2>¿Listo para las 18 preguntas?</h2>
      <p>Seleccioná una opción por pregunta. Vas a ver al instante si es correcta, con su justificación.</p>
      <div class="btn-row">
        <button class="btn btn-primary" id="startQuiz">Comenzar cuestionario</button>
      </div>
    </div>
    ${footer()}
  `;

  renderMath(app);

  document.getElementById("backHome").addEventListener("click", () => {
    state.view = "home";
    render();
  });
  document.getElementById("startQuiz").addEventListener("click", () => {
    state.view = "quiz";
    state.currentQuestion = 0;
    render();
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
      <button class="link-btn" id="backRef">&larr; Volver a la referencia</button>
    </div>
    <div class="card">
      <div class="progress-meta">
        <span>Pregunta ${idx + 1} de ${total}</span>
        <span>${getModel(state.modelId).title}</span>
      </div>
      <div class="progress-bar"><div class="fill" style="width:${((idx) / total) * 100}%"></div></div>
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

  document.getElementById("backRef").addEventListener("click", () => {
    state.view = "reference";
    render();
  });

  app.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.answers[idx]) return;
      state.answers[idx] = btn.dataset.letter;
      render();
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
  const nota = ((correctCount / total) * 6).toFixed(2); // 6 puntos = valor de las MC en el parcial real

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
        <div class="stat"><div class="n">${nota}</div><div class="l">Puntos / 6</div></div>
      </div>
      <p class="note">En el parcial real, las 18 preguntas multiple choice valen 6 puntos sobre un total de 10 (junto con el ejercicio práctico y el desarrollo teórico, 2 puntos cada uno).</p>
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
  else if (state.view === "reference") renderReference();
  else if (state.view === "quiz") renderQuiz();
  else if (state.view === "results") renderResults();
}

render();
