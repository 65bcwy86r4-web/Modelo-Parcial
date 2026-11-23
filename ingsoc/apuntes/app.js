// Apuntes de Ingeniería y Sociedad: navegación por temas con barra lateral y ruteo por hash (#tema-N).
(function () {
  const nav = document.getElementById("nav");
  const main = document.getElementById("main");
  const side = document.getElementById("side");
  const toggle = document.getElementById("sideToggle");
  const sideCur = document.getElementById("sideCur");

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
  };
  const seen = new Set(store.get("ingsoc-apuntes-vistos") || []);

  // ---- Barra lateral, agrupada por clase ----
  let lastUnit = null;
  nav.innerHTML = APUNTES.map((t) => {
    const head = t.unidad !== lastUnit ? `<div class="unit">${t.unidad}</div>` : "";
    lastUnit = t.unidad;
    return `${head}<a href="#tema-${t.n}" data-n="${t.n}"><span class="n">${t.n}</span><span>${t.title}</span></a>`;
  }).join("");

  toggle.addEventListener("click", () => {
    const open = !side.classList.contains("open");
    side.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  });

  function show(n, scrollTo) {
    const i = APUNTES.findIndex((t) => t.n === n);
    const t = APUNTES[i] || APUNTES[0];
    const prev = APUNTES[APUNTES.indexOf(t) - 1], next = APUNTES[APUNTES.indexOf(t) + 1];

    main.innerHTML = `
      <div class="ap-head">
        <div class="kicker"><span class="tag">Objetivo ${t.n}</span><span>${t.unidad}</span></div>
        <h1>${t.title}</h1>
        <p class="objetivo"><span class="lbl">Objetivo de examen</span>${t.objetivo}</p>
        <ol class="ap-toc">
          ${t.secciones.map((s, k) => `<li><a href="#${s.id}" data-q="${s.id}"><span class="qn">${k + 1}</span><span>${s.title}</span></a></li>`).join("")}
        </ol>
      </div>
      ${t.html}
      <nav class="ap-pager">
        ${prev ? `<a class="prev" href="#tema-${prev.n}"><span class="dir">← Anterior</span><span class="t">${prev.n}. ${prev.title}</span></a>` : ""}
        ${next ? `<a class="next" href="#tema-${next.n}"><span class="dir">Siguiente →</span><span class="t">${next.n}. ${next.title}</span></a>` : ""}
      </nav>`;

    main.querySelectorAll(".ap-toc a").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(a.dataset.q).scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#" + a.dataset.q);
    }));

    nav.querySelectorAll("a").forEach((a) => {
      const k = Number(a.dataset.n);
      a.classList.toggle("active", k === t.n);
      a.classList.toggle("seen", seen.has(k));
    });
    sideCur.textContent = `${t.n}. ${t.title}`;
    side.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.title = `${t.n}. ${t.title} — Apuntes Ingeniería y Sociedad`;

    seen.add(t.n);
    store.set("ingsoc-apuntes-vistos", [...seen]);
    store.set("ingsoc-apuntes-ultimo", t.n);

    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) { el.scrollIntoView({ block: "start" }); return; }
    }
    window.scrollTo({ top: 0 });
    const active = nav.querySelector("a.active");
    if (active && getComputedStyle(toggle).display === "none") active.scrollIntoView({ block: "nearest" });
  }

  function route() {
    const h = location.hash;
    let m = h.match(/^#tema-(\d+)$/);
    if (m) return show(Number(m[1]));
    m = h.match(/^#t(\d+)-s\d+$/);
    if (m) return show(Number(m[1]), h.slice(1));
    show(store.get("ingsoc-apuntes-ultimo") || 1);
  }

  window.addEventListener("hashchange", route);
  route();
})();
