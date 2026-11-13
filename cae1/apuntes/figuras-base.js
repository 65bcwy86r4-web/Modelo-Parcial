// Motor de figuras en canvas para los apuntes.
// Cada figura se define con FIG.def(id, spec) y se dibuja en coordenadas lógicas
// de ancho W = 640 (el alto lo fija spec.h); el canvas se escala al ancho disponible.
//
// spec = {
//   title, caption, h,
//   controls: [ {type:"range", key, label, min, max, step, value, fmt},
//               {type:"seg", key, label, options:[[valor, texto], ...], value},
//               {type:"toggle", key, label, value} ],
//   anim: bool,                 // redibuja en cada frame mientras la figura es visible
//   draw(g, s, t),              // g: helpers de dibujo; s: estado de los controles; t: segundos
//   info(s) -> html,            // valores calculados que se muestran debajo
// }

const C = {
  bg: "#151515",
  ink: "#ededeb",
  dim: "#9a9a97",
  faint: "#5c5c59",
  grid: "#262626",
  line: "#3a3a3a",
  accent: "#c17f3e",
  accent2: "#e0a868",
  blue: "#6fa8dc",
  blueD: "#2b4a66",
  green: "#7fb88f",
  red: "#d97c86",
  purple: "#a990dd",
  teal: "#5fc4b8",
  yellow: "#e8cf6a",
  metal: "#8d96a0",
  metalD: "#4a5058",
};

class G {
  constructor(ctx, W, H) {
    this.ctx = ctx; this.W = W; this.H = H;
  }
  clear() {
    const c = this.ctx;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = C.bg; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    c.restore();
  }
  _stroke(o = {}) {
    const c = this.ctx;
    c.strokeStyle = o.c || C.ink;
    c.lineWidth = o.w || 1.6;
    c.setLineDash(o.dash || []);
    c.lineCap = o.cap || "round";
    c.lineJoin = "round";
    c.globalAlpha = o.alpha ?? 1;
  }
  line(x1, y1, x2, y2, o = {}) {
    const c = this.ctx; c.save(); this._stroke(o);
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore();
  }
  path(pts, o = {}) {
    if (!pts.length) return;
    const c = this.ctx; c.save();
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    if (o.close) c.closePath();
    if (o.fill) { c.globalAlpha = o.fillAlpha ?? 1; c.fillStyle = o.fill; c.fill(); }
    if (o.c !== null && !(o.fill && !o.c)) { this._stroke(o); c.stroke(); }
    c.restore();
  }
  smooth(pts, o = {}) { // curva suave por puntos medios
    if (pts.length < 3) return this.path(pts, o);
    const c = this.ctx; c.save();
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      c.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
    }
    const l = pts[pts.length - 1]; c.lineTo(l[0], l[1]);
    if (o.close) c.closePath();
    if (o.fill) { c.globalAlpha = o.fillAlpha ?? 1; c.fillStyle = o.fill; c.fill(); }
    if (o.c !== null && !(o.fill && !o.c)) { this._stroke(o); c.stroke(); }
    c.restore();
  }
  arrow(x1, y1, x2, y2, o = {}) {
    const c = this.ctx, hd = o.head || 9, a = Math.atan2(y2 - y1, x2 - x1);
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 1) return;
    c.save(); this._stroke(o);
    const ex = x2 - Math.cos(a) * hd * 0.6, ey = y2 - Math.sin(a) * hd * 0.6;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(ex, ey); c.stroke();
    c.setLineDash([]); c.fillStyle = o.c || C.ink;
    c.beginPath(); c.moveTo(x2, y2);
    c.lineTo(x2 - hd * Math.cos(a - 0.42), y2 - hd * Math.sin(a - 0.42));
    c.lineTo(x2 - hd * Math.cos(a + 0.42), y2 - hd * Math.sin(a + 0.42));
    c.closePath(); c.fill();
    if (o.both) {
      c.beginPath(); c.moveTo(x1, y1);
      c.lineTo(x1 + hd * Math.cos(a - 0.42), y1 + hd * Math.sin(a - 0.42));
      c.lineTo(x1 + hd * Math.cos(a + 0.42), y1 + hd * Math.sin(a + 0.42));
      c.closePath(); c.fill();
    }
    c.restore();
  }
  // flecha polar: origen, ángulo (rad, 0 = derecha, positivo = antihorario en pantalla), largo
  arrowA(x, y, ang, len, o = {}) { this.arrow(x, y, x + Math.cos(ang) * len, y - Math.sin(ang) * len, o); }
  arcArrow(cx, cy, r, a1, a2, o = {}) { // ángulos en rad, antihorario en pantalla
    const c = this.ctx; c.save(); this._stroke(o);
    c.beginPath(); c.arc(cx, cy, r, -a1, -a2, a2 > a1); c.stroke();
    const hd = o.head || 8, dir = a2 > a1 ? 1 : -1;
    const ex = cx + r * Math.cos(a2), ey = cy - r * Math.sin(a2);
    const ta = -a2 - dir * Math.PI / 2; // tangente
    c.fillStyle = o.c || C.ink; c.setLineDash([]);
    c.beginPath(); c.moveTo(ex + Math.cos(ta) * 2, ey + Math.sin(ta) * 2);
    c.lineTo(ex - hd * Math.cos(ta - 0.45), ey - hd * Math.sin(ta - 0.45));
    c.lineTo(ex - hd * Math.cos(ta + 0.45), ey - hd * Math.sin(ta + 0.45));
    c.closePath(); c.fill();
    c.restore();
  }
  circle(x, y, r, o = {}) {
    const c = this.ctx; c.save(); c.beginPath(); c.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
    if (o.fill) { c.globalAlpha = o.fillAlpha ?? 1; c.fillStyle = o.fill; c.fill(); }
    if (o.c || !o.fill) { this._stroke(o); c.stroke(); }
    c.restore();
  }
  ellipse(x, y, rx, ry, rot = 0, o = {}) {
    const c = this.ctx; c.save(); c.beginPath(); c.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot, 0, Math.PI * 2);
    if (o.fill) { c.globalAlpha = o.fillAlpha ?? 1; c.fillStyle = o.fill; c.fill(); }
    if (o.c || !o.fill) { this._stroke(o); c.stroke(); }
    c.restore();
  }
  rect(x, y, w, h, o = {}) {
    const c = this.ctx; c.save(); c.beginPath();
    if (o.r) c.roundRect(x, y, w, h, o.r); else c.rect(x, y, w, h);
    if (o.fill) { c.globalAlpha = o.fillAlpha ?? 1; c.fillStyle = o.fill; c.fill(); }
    if (o.c || !o.fill) { this._stroke(o); c.stroke(); }
    c.restore();
  }
  text(s, x, y, o = {}) {
    const c = this.ctx; c.save();
    const size = o.size || 13;
    c.font = `${o.italic ? "italic " : ""}${o.bold ? "700 " : "500 "}${size}px Inter, "Segoe UI", system-ui, sans-serif`;
    c.textAlign = o.align || "left";
    c.textBaseline = o.base || "middle";
    c.globalAlpha = o.alpha ?? 1;
    if (o.rot) { c.translate(x, y); c.rotate(-o.rot); x = 0; y = 0; }
    const lines = String(s).split("\n");
    const lh = size * 1.25;
    const y0 = y - ((lines.length - 1) * lh) / (o.base === "top" ? Infinity : 2);
    // subíndices: "m_b", "C_D", "V_{esc}"
    const fBase = c.font, fSub = fBase.replace(`${size}px`, `${(size * 0.74).toFixed(1)}px`);
    const runs = (l) => {
      const out = []; let last = 0;
      l.replace(/_(\{[^}]*\}|[A-Za-z0-9áéíóúñ]+)/g, (m, sub, i) => {
        if (i > last) out.push([l.slice(last, i), false]);
        out.push([sub.replace(/[{}]/g, ""), true]); last = i + m.length; return m;
      });
      if (last < l.length) out.push([l.slice(last), false]);
      return out;
    };
    const width = (rs) => rs.reduce((w, [t, sb]) => { c.font = sb ? fSub : fBase; const m = c.measureText(t).width; c.font = fBase; return w + m; }, 0);
    const parsed = lines.map(runs);
    if (o.bg) {
      const wMax = Math.max(...parsed.map(width));
      const bx = c.textAlign === "center" ? x - wMax / 2 : c.textAlign === "right" ? x - wMax : x;
      c.fillStyle = o.bg;
      c.fillRect(bx - 4, y0 - size * 0.7, wMax + 8, lh * (lines.length - 1) + size * 1.4);
    }
    c.fillStyle = o.c || C.ink;
    const align = c.textAlign;
    parsed.forEach((rs, i) => {
      const yy = y0 + i * lh;
      if (rs.length === 1 && !rs[0][1]) { c.fillText(rs[0][0], x, yy); return; }
      const w = width(rs);
      let xx = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
      c.textAlign = "left";
      rs.forEach(([t, sb]) => {
        c.font = sb ? fSub : fBase;
        c.fillText(t, xx, yy + (sb ? size * 0.28 : 0));
        xx += c.measureText(t).width;
      });
      c.font = fBase; c.textAlign = align;
    });
    c.restore();
  }
  measure(s, size = 13, bold = false) {
    const c = this.ctx; c.save();
    c.font = `${bold ? "700 " : "500 "}${size}px Inter, "Segoe UI", system-ui, sans-serif`;
    const w = c.measureText(s).width; c.restore(); return w;
  }
  // etiqueta con línea guía
  callout(s, x, y, tx, ty, o = {}) {
    this.line(x, y, tx, ty, { c: o.lc || C.faint, w: 1 });
    this.circle(x, y, 2.2, { fill: o.lc || C.dim });
    this.text(s, tx + (o.align === "right" ? -4 : o.align === "center" ? 0 : 4), ty + (o.dy || 0), { c: o.c || C.ink, size: o.size || 12.5, align: o.align || "left", bold: o.bold });
  }
  // cota con flechas en ambos extremos
  dim(x1, y1, x2, y2, label, o = {}) {
    this.arrow(x1, y1, x2, y2, { c: o.c || C.dim, w: 1.1, head: 7, both: true });
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    this.text(label, mx + (o.dx || 0), my + (o.dy || 0), { c: o.tc || o.c || C.dim, size: o.size || 12, align: "center", bg: C.bg, italic: o.italic });
  }
  // rellena un área entre dos funciones
  fillBetween(top, bot, fill, alpha = 0.25) {
    this.path(top.concat(bot.slice().reverse()), { fill, fillAlpha: alpha, c: null, close: true });
  }
  earth(x, y, r, o = {}) {
    const c = this.ctx; c.save();
    const gr = c.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    gr.addColorStop(0, "#5d9bd6"); gr.addColorStop(1, "#1f4f80");
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = gr; c.fill();
    if (o.land !== false && r > 14) {
      c.clip();
      c.fillStyle = "rgba(127,184,143,0.55)";
      [[-0.3, -0.25, 0.35, 0.22], [0.25, 0.1, 0.28, 0.35], [-0.2, 0.45, 0.22, 0.14], [0.45, -0.45, 0.2, 0.12]].forEach(([a, b, w, h]) => {
        c.beginPath(); c.ellipse(x + a * r, y + b * r, w * r, h * r, 0.5, 0, Math.PI * 2); c.fill();
      });
    }
    c.restore();
  }
  sun(x, y, r) {
    const c = this.ctx; c.save();
    const gr = c.createRadialGradient(x, y, r * 0.2, x, y, r * 2.2);
    gr.addColorStop(0, "rgba(255,214,120,0.55)"); gr.addColorStop(1, "rgba(255,214,120,0)");
    c.fillStyle = gr; c.beginPath(); c.arc(x, y, r * 2.2, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#f3c45a"; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    c.restore();
  }
  // ejes de un gráfico; devuelve funciones de mapeo
  plot(box, xr, yr, o = {}) {
    const [bx, by, bw, bh] = box;
    const X = (v) => bx + ((v - xr[0]) / (xr[1] - xr[0])) * bw;
    const Y = (v) => by + bh - ((v - yr[0]) / (yr[1] - yr[0])) * bh;
    const g = this;
    if (o.grid !== false) {
      (o.xt || []).forEach((v) => g.line(X(v), by, X(v), by + bh, { c: C.grid, w: 1 }));
      (o.yt || []).forEach((v) => g.line(bx, Y(v), bx + bw, Y(v), { c: C.grid, w: 1 }));
    }
    g.arrow(bx, by + bh, bx + bw + 14, by + bh, { c: C.dim, w: 1.3, head: 8 });
    g.arrow(bx, by + bh, bx, by - 14, { c: C.dim, w: 1.3, head: 8 });
    const fx = o.fx || ((v) => v), fy = o.fy || ((v) => v);
    (o.xt || []).forEach((v) => g.text(fx(v), X(v), by + bh + 14, { c: C.dim, size: 11, align: "center" }));
    (o.yt || []).forEach((v) => g.text(fy(v), bx - 7, Y(v), { c: C.dim, size: 11, align: "right" }));
    if (o.xl) g.text(o.xl, bx + bw + 12, by + bh + (o.xlDy ?? 30), { c: C.ink, size: 12.5, align: "right" });
    if (o.yl) g.text(o.yl, bx + 8, by - 16, { c: C.ink, size: 12.5 });
    return { X, Y, inv: (px) => xr[0] + ((px - bx) / bw) * (xr[1] - xr[0]) };
  }
}

// ---------- Geometría auxiliar ----------
const GEO = {
  rot(pts, cx, cy, deg) {
    const a = (deg * Math.PI) / 180, co = Math.cos(a), si = Math.sin(a);
    // positivo = horario en pantalla (y hacia abajo) -> "nariz abajo" si se aplica a la parte trasera
    return pts.map(([x, y]) => [cx + (x - cx) * co - (y - cy) * si, cy + (x - cx) * si + (y - cy) * co]);
  },
  // Perfil NACA de 4 dígitos. Devuelve {up, lo} desde el borde de ataque al de fuga en coords locales (0..1)
  naca(m = 0.04, p = 0.4, t = 0.12, n = 60) {
    const up = [], lo = [];
    for (let i = 0; i <= n; i++) {
      const b = (i / n) * Math.PI, x = (1 - Math.cos(b)) / 2;
      const yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4);
      let yc, dy;
      if (x < p) { yc = (m / p ** 2) * (2 * p * x - x * x); dy = (2 * m / p ** 2) * (p - x); }
      else { yc = (m / (1 - p) ** 2) * (1 - 2 * p + 2 * p * x - x * x); dy = (2 * m / (1 - p) ** 2) * (p - x); }
      const th = Math.atan(dy);
      up.push([x - yt * Math.sin(th), yc + yt * Math.cos(th)]);
      lo.push([x + yt * Math.sin(th), yc - yt * Math.cos(th)]);
    }
    return { up, lo };
  },
  // pasa coordenadas locales del perfil (y hacia arriba) a pantalla
  place(pts, x0, y0, chord, deg = 0) {
    const s = pts.map(([x, y]) => [x0 + x * chord, y0 - y * chord]);
    return deg ? GEO.rot(s, x0, y0, deg) : s; // deg > 0: nariz arriba
  },
  lerp: (a, b, t) => a + (b - a) * t,
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  // resuelve la ecuación de Kepler M = E - e sinE
  kepler(M, e) {
    let E = M;
    for (let i = 0; i < 12; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    return E;
  },
};

// ---------- Utilidades de formato ----------
const fmt = {
  // separador de miles con espacio fino, decimales con coma (como en el apunte)
  n(v, d = 0) {
    const s = Math.abs(v).toFixed(d).split(".");
    const ent = s[0].length > 3 ? s[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f") : s[0];
    return (v < 0 && Number(s.join(".")) !== 0 ? "−" : "") + ent + (s[1] ? "," + s[1] : "");
  },
};

// ---------- Registro y montaje ----------
const FIG = {
  specs: {},
  W: 640,
  def(id, spec) { this.specs[id] = spec; },
  reduced: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  // "m_b" -> m<sub>b</sub> en textos HTML
  sub: (h) => h.replace(/_(\{[^}]*\}|[A-Za-z0-9áéíóúñ]+)/g, (m, x) => `<sub>${x.replace(/[{}]/g, "")}</sub>`),

  mount(slot) {
    const id = slot.dataset.fig, spec = this.specs[id];
    if (!spec) { slot.remove(); return; }
    const W = this.W, H = spec.h || 320;
    const state = {};
    (spec.controls || []).forEach((c) => (state[c.key] = c.value));

    const fig = document.createElement("figure");
    fig.className = "fig";
    const interactive = (spec.controls || []).length > 0;
    const kind = interactive ? "Interactivo" : spec.anim ? "Animado" : "Esquema";
    fig.innerHTML = `<div class="fig-title"><span class="kind${interactive || spec.anim ? " live" : ""}">${kind}</span><span>${FIG.sub(spec.title)}</span></div>`;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", spec.title + (spec.caption ? ". " + spec.caption : ""));
    fig.appendChild(canvas);

    let ctrlBox = null, infoBox = null;
    if (interactive) {
      ctrlBox = document.createElement("div");
      ctrlBox.className = "fig-controls";
      spec.controls.forEach((c) => {
        if (c.type === "range") {
          const lab = document.createElement("label");
          lab.className = "rng";
          const show = (v) => (c.fmt ? c.fmt(v) : v);
          lab.innerHTML = `<span>${FIG.sub(c.label)}</span><input type="range" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${c.value}"><output>${show(c.value)}</output>`;
          const inp = lab.querySelector("input"), out = lab.querySelector("output");
          inp.addEventListener("input", () => { state[c.key] = Number(inp.value); out.textContent = show(state[c.key]); redraw(); });
          ctrlBox.appendChild(lab);
        } else if (c.type === "seg") {
          const box = document.createElement("div");
          box.className = "seg";
          box.innerHTML = (c.label ? `<span>${c.label}</span>` : "") +
            c.options.map(([v, t]) => `<button type="button" data-v="${v}" class="${v === c.value ? "on" : ""}">${t}</button>`).join("");
          box.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
            const v = c.options.find(([x]) => String(x) === b.dataset.v)[0];
            state[c.key] = v;
            box.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
            redraw();
          }));
          ctrlBox.appendChild(box);
        } else if (c.type === "toggle") {
          const b = document.createElement("button");
          b.type = "button"; b.className = "tgl" + (c.value ? " on" : ""); b.textContent = c.label;
          b.addEventListener("click", () => { state[c.key] = !state[c.key]; b.classList.toggle("on", state[c.key]); redraw(); });
          ctrlBox.appendChild(b);
        }
      });
      fig.appendChild(ctrlBox);
    }
    if (spec.info) { infoBox = document.createElement("div"); infoBox.className = "fig-info"; fig.appendChild(infoBox); }
    if (spec.caption) { const cap = document.createElement("figcaption"); cap.innerHTML = FIG.sub(spec.caption); fig.appendChild(cap); }
    slot.replaceWith(fig);

    const ctx = canvas.getContext("2d");
    const g = new G(ctx, W, H);
    let t0 = performance.now(), visible = false, raf = 0;

    function size() {
      const cssW = fig.clientWidth || W;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssW * (H / W) * dpr);
      canvas.style.height = cssW * (H / W) + "px";
      ctx.setTransform((cssW / W) * dpr, 0, 0, (cssW / W) * dpr, 0, 0);
    }
    function redraw() {
      const t = FIG.reduced ? (spec.still ?? 1.2) : (performance.now() - t0) / 1000;
      g.clear();
      try { spec.draw(g, state, t); } catch (e) { console.error("figura", id, e); }
      if (infoBox) infoBox.innerHTML = FIG.sub(spec.info(state, t));
    }
    function loop() {
      redraw();
      raf = visible && spec.anim && !FIG.reduced ? requestAnimationFrame(loop) : 0;
    }
    size(); redraw();
    if ("ResizeObserver" in window) {
      let lastW = fig.clientWidth;
      new ResizeObserver(() => { if (fig.clientWidth !== lastW) { lastW = fig.clientWidth; size(); redraw(); } }).observe(fig);
    }
    if (spec.anim && "IntersectionObserver" in window) {
      new IntersectionObserver((ents) => {
        visible = ents[0].isIntersecting;
        if (visible && !raf) loop();
      }, { rootMargin: "100px" }).observe(fig);
    }
  },
};
