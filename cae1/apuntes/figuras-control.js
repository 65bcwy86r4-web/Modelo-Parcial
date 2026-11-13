// Figuras de los temas 14 a 18: hipersustentadores, alerones, compensación de
// superficies de control, sistemas de mando y dispositivos de control de vuelo.

// Perfil partido en un punto de la cuerda: devuelve las partes en coords locales (0..1, y arriba)
function splitAirfoil(xs, o = {}) {
  const f = GEO.naca(o.m ?? 0.03, o.p ?? 0.4, o.t ?? 0.13, 90);
  const main = f.up.filter(([x]) => x <= xs).concat(f.lo.filter(([x]) => x <= xs).reverse());
  const up = f.up.filter(([x]) => x >= xs), lo = f.lo.filter(([x]) => x >= xs);
  const flap = up.concat(lo.slice().reverse());
  const hinge = [xs, (up[0][1] + lo[0][1]) / 2];
  return { f, main, flap, up, lo, hinge };
}
// rota (en coords locales, y arriba) puntos alrededor de h: deg > 0 = borde de fuga abajo
const rotL = (pts, h, deg) => {
  const a = (-deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y]) => [h[0] + (x - h[0]) * c - (y - h[1]) * s, h[1] + (x - h[0]) * s + (y - h[1]) * c]);
};
const toScr = (pts, x0, y0, ch, deg = 0) => GEO.place(pts, x0, y0, ch, deg);

// Partículas animadas a lo largo de una polilínea
function flowDots(g, pts, t, o = {}) {
  const seg = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  const sp = o.spacing || 34, v = o.speed || 60;
  for (let s0 = (t * v) % sp; s0 < L; s0 += sp) {
    let s = s0, i = 0; while (i < seg.length && s > seg[i]) { s -= seg[i]; i++; }
    if (i >= seg.length) break;
    const u = s / seg[i], x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u;
    g.circle(x, y, o.r || 2, { fill: o.c || C.blue });
  }
}
function offsetLine(pts, d) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [p[0] + (dy / l) * d, p[1] - (dx / l) * d];
  });
}

/* ======================= TEMA 14 ======================= */
FIG.def("hiperSust", {
  title: "Más C_{L,máx} → menor velocidad de pérdida",
  h: 270,
  controls: [{ type: "range", key: "cl", label: "C_{L,máx} con hipersustentadores", min: 1.4, max: 3.2, step: 0.05, value: 2.4, fmt: (v) => fmt.n(v, 2) }],
  draw(g, s) {
    const P = g.plot([70, 40, 500, 180], [0, 100], [0, 2], { xt: [0, 20, 40, 60, 80, 100], yt: [0, 0.5, 1, 1.5, 2], fy: (v) => fmt.n(v, 1), xl: "V [m/s]", yl: "L / W (con C_{L,máx})" });
    const k = 1.225 / (2 * 4000); // ρ/(2·W/S), W/S = 4000 N/m²
    const curve = (cl, col, lab) => {
      const pts = []; for (let v = 0; v <= 100; v += 1) pts.push([P.X(v), P.Y(Math.min(2, k * v * v * cl))]);
      g.path(pts, { c: col, w: 2.2 });
      const vs = Math.sqrt(1 / (k * cl));
      g.line(P.X(vs), P.Y(1), P.X(vs), P.Y(0), { c: col, w: 1, dash: [3, 3] });
      g.circle(P.X(vs), P.Y(1), 5, { fill: col });
      g.text(lab + " ≈ " + fmt.n(vs) + " m/s", P.X(vs) + 8, P.Y(1) + (lab.includes("limpia") ? 18 : -14), { c: col, size: 11.5 });
      return vs;
    };
    g.line(P.X(0), P.Y(1), P.X(100), P.Y(1), { c: C.ink, w: 1.2, dash: [6, 4] });
    g.text("L = W", P.X(100) - 4, P.Y(1) - 10, { c: C.ink, size: 11, align: "right" });
    curve(1.4, C.faint, "V_s ala limpia");
    curve(s.cl, C.accent, "V_s");
  },
  info(s) { const r = Math.sqrt(1.4 / s.cl); return `<span>L = ½·ρ·V²·S·C_L</span><span>V_s ∝ 1/√C_{L,máx} → la velocidad de pérdida baja un <b>${fmt.n((1 - r) * 100)} %</b></span>`; },
  caption: "Ejemplo con carga alar W/S = 4 000 N/m² al nivel del mar y C_{L,máx} = 1,4 sin hipersustentadores. En crucero solo agregan resistencia: van retraídos.",
});

FIG.def("slat", {
  title: "Ranura de borde de ataque (slat) a gran ángulo de ataque",
  h: 270, anim: true,
  controls: [{ type: "toggle", key: "on", label: "Slat abierto", value: true }],
  draw(g, s, t) {
    const x0 = 170, y0 = 150, ch = 330, a = 16;
    const f = GEO.naca(0.03, 0.4, 0.13, 90);
    const cut = 0.1;
    const mainUp = f.up.filter(([x]) => x >= cut), mainLo = f.lo.filter(([x]) => x >= 0.0);
    const slatUp = f.up.filter(([x]) => x <= cut + 0.02);
    const off = s.on ? [-0.07, -0.05] : [0, 0];
    const slat = slatUp.concat(slatUp.slice().reverse().map(([x, y]) => [x + 0.015, y - 0.035 * (1 - x / (cut + 0.02))])).map(([x, y]) => [x + off[0], y + off[1]]);
    const main = (s.on ? mainUp.concat(f.lo.filter(([x]) => x >= 0.03).reverse(), [[0.03, f.up.find(([x]) => x >= 0.06)[1] - 0.02]]) : f.up.concat(f.lo.slice().reverse()));
    g.path(toScr(main, x0, y0, ch, a), { fill: "#2c3440", c: C.metal, close: true, w: 1.4 });
    if (s.on) g.path(toScr(slat, x0, y0, ch, a), { fill: C.green, fillAlpha: 0.8, c: C.green, close: true, w: 1 });
    const upS = toScr(f.up, x0, y0, ch, a);
    for (let k = 1; k <= 4; k++) {
      const d = 6 + k * 13;
      let line = offsetLine(upS, d).filter((_, i) => i > 6);
      if (!s.on) line = line.slice(0, 26 + k * 2).concat([[line[25 + k * 2][0] + 160, line[25 + k * 2][1] - 30 + k * 2]]);
      const pre = [[20, line[0][1] - 8 + k * 2], line[0]];
      const post = s.on ? [[line[line.length - 1][0] + 80, line[line.length - 1][1] + 24]] : [];
      const all = pre.concat(line, post);
      g.smooth(all, { c: C.blue, w: 1, alpha: 0.35 });
      flowDots(g, all, t, { c: C.blue, speed: 70, spacing: 30 });
    }
    if (s.on) {
      const P = toScr([[-0.12, -0.1], [-0.03, -0.06], [0.02, 0.0], [0.08, 0.075], [0.25, 0.12]], x0, y0, ch, a);
      g.smooth(P, { c: C.accent2, w: 1.8 });
      flowDots(g, P, t, { c: C.accent2, speed: 90, spacing: 18, r: 2.4 });
      g.text("aire de alta presión del intradós\npasa por la ranura y energiza la capa límite", 330, 250, { c: C.accent2, size: 11, align: "center" });
    } else {
      for (let k = 0; k < 4; k++) {
        const cx = x0 + 160 + k * 46 + ((t * 30) % 46), cy = y0 - 110 + k * 6;
        g.arcArrow(cx, cy, 12, (t * 4 + k) % 6, ((t * 4 + k) % 6) + 4.2, { c: C.red, w: 1.4, head: 6 });
      }
      g.text("sin ranura: la capa límite se desprende → pérdida", 330, 250, { c: C.red, size: 11, align: "center" });
    }
    g.text("α ≈ 16°", 40, 40, { c: C.dim, size: 11 });
  },
  caption: "La ranura no tiene efecto a ángulos bajos: permite llegar a ángulos mucho mayores sin pérdida (más C_{L,máx}). Desventajas: actitud de morro muy alta en el aterrizaje y riesgo de hielo.",
});

FIG.def("flapsBA", {
  title: "Flaps de borde de ataque",
  h: 220,
  controls: [{ type: "seg", key: "k", options: [["sen", "Sencillo (baja la nariz)"], ["kru", "Krueger"]], value: "sen" }],
  draw(g, s) {
    const x0 = 120, y0 = 100, ch = 400;
    if (s.k === "sen") {
      const f = GEO.naca(0.03, 0.4, 0.13, 90), xs = 0.15;
      const rear = f.up.filter(([x]) => x >= xs).concat(f.lo.filter(([x]) => x >= xs).reverse());
      const nose = f.up.filter(([x]) => x <= xs).reverse().concat(f.lo.filter(([x]) => x <= xs));
      const h = [xs, (f.up.find(([x]) => x >= xs)[1] + f.lo.find(([x]) => x >= xs)[1]) / 2];
      g.path(toScr(f.up.concat(f.lo.slice().reverse()), x0, y0, ch), { c: C.faint, w: 1, dash: [3, 3], close: true });
      g.path(toScr(rear, x0, y0, ch), { fill: "#2c3440", c: C.metal, close: true, w: 1.4 });
      g.path(toScr(rotL(nose, h, 18), x0, y0, ch), { fill: C.green, fillAlpha: 0.8, c: C.green, close: true, w: 1.2 });
      g.text("la nariz gira hacia abajo", x0 - 30, 170, { c: C.green, size: 11.5 });
    } else {
      const f = GEO.naca(0.03, 0.4, 0.13, 90);
      g.path(toScr(f.up.concat(f.lo.slice().reverse()), x0, y0, ch), { fill: "#2c3440", c: C.metal, close: true, w: 1.4 });
      const h = toScr([[0.16, f.lo.find(([x]) => x >= 0.16)[1]]], x0, y0, ch)[0];
      const len = 0.15 * ch, ang = (200 * Math.PI) / 180;
      const ex = h[0] + len * Math.cos(ang), ey = h[1] - len * Math.sin(ang);
      g.line(h[0], h[1], ex, ey, { c: C.green, w: 5 });
      g.circle(h[0], h[1], 3.5, { fill: C.ink });
      g.path([[h[0] - 4, h[1] + 2], [h[0] - len * 0.95, h[1] + 4]], { c: C.faint, w: 1, dash: [3, 3] });
      g.text("panel del intradós que gira hacia adelante y abajo", x0 - 60, 176, { c: C.green, size: 11.5 });
    }
    g.text("Aumentan el radio del borde de ataque: el perfil se comporta como uno más grueso → más C_{L,máx}\n(ni la pendiente ni el ángulo de sustentación nula cambian).", 320, 196, { c: C.dim, size: 10.5, align: "center" });
  },
});

FIG.def("flaps", {
  title: "Flaps de borde de fuga",
  h: 250,
  controls: [
    { type: "seg", key: "k", options: [["sen", "Sencillo"], ["intr", "De intradós"], ["ach", "Intradós acharnelado"], ["ran", "Ranurado"], ["fow", "Fowler"]], value: "fow" },
    { type: "range", key: "d", label: "Deflexión δ", min: 0, max: 40, step: 1, value: 30, fmt: (v) => v + "°" },
  ],
  draw(g, s) {
    const x0 = 80, y0 = 110, ch = 420, xs = 0.72, d = s.d, u = d / 40;
    const A = splitAirfoil(xs);
    const ghost = A.f.up.concat(A.f.lo.slice().reverse());
    g.path(toScr(ghost, x0, y0, ch), { c: C.faint, w: 1, dash: [3, 3], close: true });
    const fill = { fill: C.blue, fillAlpha: 0.75, c: C.blue, close: true, w: 1.2 };
    let note = "";
    if (s.k === "sen") {
      g.path(toScr(A.main, x0, y0, ch), { fill: "#2c3440", c: C.metal, close: true, w: 1.4 });
      g.path(toScr(rotL(A.flap, A.hinge, d), x0, y0, ch), fill);
      note = "gira todo el borde de fuga: más curvatura";
    } else if (s.k === "intr" || s.k === "ach") {
      g.path(toScr(ghost, x0, y0, ch), { fill: "#2c3440", c: C.metal, close: true, w: 1.4 });
      const plate = A.lo.map(([x, y]) => [x, y]);
      const piv = [plate[0][0], plate[0][1]];
      let p = rotL(plate.concat(plate.slice().reverse().map(([x, y]) => [x, y + 0.012])), piv, d);
      if (s.k === "ach") p = p.map(([x, y]) => [x + 0.18 * u, y - 0.01 * u]);
      g.path(toScr(p, x0, y0, ch), fill);
      note = s.k === "intr" ? "baja solo una aleta del intradós; el extradós queda intacto" : "además de bajar se desplaza hacia atrás: más cuerda y más S";
    } else {
      const shift = s.k === "fow" ? [0.26 * u, -0.05 * u] : [0.03 * u, -0.025 * u];
      // el flap tiene nariz redondeada
      const fl = A.flap.map(([x, y]) => [x, y]);
      const moved = rotL(fl, A.hinge, d).map(([x, y]) => [x + shift[0], y + shift[1]]);
      g.path(toScr(A.main, x0, y0, ch), { fill: "#2c3440", c: C.metal, close: true, w: 1.4 });
      g.path(toScr(moved, x0, y0, ch), fill);
      if (d > 4) {
        const P = toScr([[xs - 0.08, -0.09], [xs - 0.01 + shift[0] * 0.5, -0.04 + shift[1]], [xs + 0.05 + shift[0], 0.0 + shift[1] - 0.02 * u], [xs + 0.18 + shift[0], -0.03 + shift[1] - 0.06 * u]], x0, y0, ch);
        g.smooth(P, { c: C.accent2, w: 1.8 });
        g.arrow(P[2][0], P[2][1], P[3][0], P[3][1], { c: C.accent2, w: 1.8 });
        g.text("ranura", P[1][0] - 10, P[1][1] + 26, { c: C.accent2, size: 11 });
      }
      note = s.k === "fow" ? "baja y retrocede: más curvatura, más superficie y control de capa límite (el más efectivo)" : "abre una ranura que energiza la capa límite sobre el flap";
    }
    g.text(note, 320, 226, { c: C.ink, size: 11.5, align: "center" });
  },
  caption: "Efectos: sube C_L a cualquier α (y el C_{L,máx}), el α de sustentación nula se hace más negativo, la pendiente no cambia, más momento de cabeceo negativo y mucha más resistencia.",
});

FIG.def("clAlpha", {
  title: "Curvas C_L(α): ala limpia, ranura, flap y combinación",
  h: 320,
  controls: [
    { type: "toggle", key: "b", label: "Perfil básico", value: true },
    { type: "toggle", key: "r", label: "Ranura abierta", value: true },
    { type: "toggle", key: "f", label: "Flap deflectado", value: true },
    { type: "toggle", key: "c", label: "Combinación", value: true },
  ],
  draw(g, s) {
    const P = g.plot([70, 30, 520, 230], [-12, 28], [-0.6, 3.4], { xt: [-10, 0, 10, 20], yt: [0, 1, 2, 3], fx: (v) => v + "°", fy: (v) => fmt.n(v, 0), xl: "α", yl: "C_L" });
    g.line(P.X(-12), P.Y(0), P.X(28), P.Y(0), { c: C.faint, w: 1 });
    g.line(P.X(0), P.Y(-0.6), P.X(0), P.Y(3.4), { c: C.faint, w: 1 });
    const curve = (shift, aMax, col, lab, on) => {
      if (!on) return;
      const pts = [];
      for (let a = -12; a <= aMax; a += 0.5) pts.push([P.X(a), P.Y(0.1 * (a + 2) + shift)]);
      const top = 0.1 * (aMax + 2) + shift;
      for (let k = 1; k <= 8; k++) { const a = aMax + k * 0.6; pts.push([P.X(a), P.Y(top - 0.012 * k * k)]); }
      g.smooth(pts, { c: col, w: 2.4 });
      g.circle(P.X(aMax), P.Y(top), 4, { fill: col });
      g.text(lab, P.X(aMax) + 6, P.Y(top) - 12, { c: col, size: 11, bold: true });
    };
    curve(0, 23, C.green, "ranura", s.r);
    curve(0.8, 21, C.accent, "ranura + flap", s.c);
    curve(0.8, 12, C.blue, "flap", s.f);
    curve(0, 14, C.ink, "básico", s.b);
  },
  caption: "La ranura aumenta el C_{L,máx} aumentando α (prolonga la misma recta); el flap lo aumenta con la deflexión, para un mismo α (desplaza la recta hacia arriba). Las cuatro curvas tienen la misma pendiente.",
});

FIG.def("polar", {
  title: "Polar de Eiffel con flap 0°, 10° y 20°: el punto M",
  h: 330,
  controls: [{ type: "range", key: "cl", label: "C_L requerido", min: 0.2, max: 1.9, step: 0.02, value: 1.3, fmt: (v) => fmt.n(v, 2) }],
  pol: [[0, 0.025, 0.1, 1.45, C.ink, "flap 0°"], [10, 0.045, 0.6, 1.75, C.blue, "flap 10°"], [20, 0.07, 1.0, 2.05, C.accent, "flap 20°"]],
  cd(p, cl) { return p[1] + 0.05 * (cl - p[2]) ** 2; },
  draw(g, s) {
    const P = g.plot([70, 30, 500, 240], [0, 0.18], [0, 2.2], { xt: [0, 0.05, 0.1, 0.15], yt: [0, 0.5, 1, 1.5, 2], fx: (v) => fmt.n(v, 2), fy: (v) => fmt.n(v, 1), xl: "C_D", yl: "C_L" });
    this.pol.forEach((p) => {
      const pts = []; for (let cl = -0.1; cl <= p[3]; cl += 0.02) pts.push([P.X(this.cd(p, cl)), P.Y(Math.max(0, cl))]);
      g.path(pts.filter(([, y]) => y <= P.Y(0)), { c: p[4], w: 2.2 });
      g.text(p[5], P.X(this.cd(p, p[3])) + 6, P.Y(p[3]) - 8, { c: p[4], size: 11, bold: true });
    });
    // M entre 0° y 20°: 0,025+0,05(x−0,1)² = 0,07+0,05(x−1)²
    const xm = (0.07 - 0.025 + 0.05 * (1 - 0.01)) / (0.05 * 2 * 0.9);
    g.circle(P.X(this.cd(this.pol[0], xm)), P.Y(xm), 6, { fill: C.bg, c: C.yellow, w: 2.4 });
    g.text("M", P.X(this.cd(this.pol[0], xm)) + 10, P.Y(xm) + 12, { c: C.yellow, bold: true });
    g.line(P.X(0), P.Y(s.cl), P.X(0.18), P.Y(s.cl), { c: C.dim, w: 1, dash: [4, 4] });
    let best = null;
    this.pol.forEach((p) => {
      if (s.cl > p[3]) return;
      const x = this.cd(p, s.cl);
      g.circle(P.X(x), P.Y(s.cl), 5, { fill: p[4] });
      if (!best || x < best[0]) best = [x, p];
    });
    if (s.cl <= 1.45 && s.cl > xm) {
      g.text("A'", P.X(this.cd(this.pol[0], s.cl)) + 8, P.Y(s.cl) - 12, { c: C.ink, bold: true });
      g.text("A", P.X(this.cd(this.pol[2], s.cl)) + 8, P.Y(s.cl) + 14, { c: C.accent, bold: true });
    }
    this._best = best;
  },
  info(s) {
    const xm = (0.07 - 0.025 + 0.05 * 0.99) / (0.05 * 1.8);
    const ok = this.pol.filter((p) => s.cl <= p[3]).map((p) => [this.cd(p, s.cl), p]).sort((a, b) => a[0] - b[0]);
    if (!ok.length) return "<span>Ningún flap alcanza ese C_L.</span>";
    return `<span>Menor resistencia con <b>${ok[0][1][5]}</b></span><span>${s.cl > xm ? "Por encima de M (velocidad baja): conviene el flap extendido" : "Por debajo de M (velocidad alta): conviene retraer el flap"}</span>`;
  },
  caption: "Retraer o extender flaps es un desplazamiento horizontal (a C_L constante, porque L = W). Después del despegue, a velocidad baja (punto A), retraer los flaps lleva a A': mismo C_L pero más C_D. Al piloto, M se le da como una velocidad.",
});

/* ======================= TEMA 15 ======================= */
FIG.def("alerones", {
  title: "Alerones y guiñada adversa (viraje a la derecha)",
  h: 320,
  controls: [{ type: "toggle", key: "dif", label: "Alerones diferenciales", value: false }],
  draw(g, s) {
    // vista frontal (desde atrás del avión: izquierda del piloto a la izquierda)
    g.text("Vista desde atrás", 170, 20, { c: C.dim, size: 11, align: "center" });
    drawPlaneFront(g, 170, 130, 280, "baja", -8, { gear: false, dihedral: 3 });
    const th = (8 * Math.PI) / 180, tf = (x, y) => [170 + x * Math.cos(th) - y * Math.sin(th), 130 + x * Math.sin(th) + y * Math.cos(th)];
    const [lx0, ly0] = tf(-120, 16), [rx0, ry0] = tf(120, 16);
    g.arrow(lx0, ly0 - 4, lx0, ly0 - 74, { c: C.green, w: 3 }); g.text("más L", lx0 + 8, ly0 - 66, { c: C.green, size: 11 });
    g.arrow(rx0, ry0 - 4, rx0, ry0 - 34, { c: C.green, w: 2 }); g.text("menos L", rx0 + 8, ry0 - 30, { c: C.green, size: 11 });
    g.text("alerón abajo", lx0, ly0 + 22, { c: C.accent, size: 11, align: "center" });
    g.text("alerón arriba", rx0, ry0 + 22, { c: C.accent, size: 11, align: "center" });
    g.arcArrow(170, 130, 70, Math.PI * 0.62, Math.PI * 0.38, { c: C.accent, w: 2 });
    g.text("rolido", 170, 46, { c: C.accent, size: 11, align: "center" });
    // vista en planta
    const cx = 480, cy = 150, sc = 250;
    g.text("Vista en planta", cx, 20, { c: C.dim, size: 11, align: "center" });
    PLANE.top(g, cx, cy, sc, { alerones: 1 });
    const dL = s.dif ? 34 : 46, dR = s.dif ? 32 : 18;
    const lx = cx - 0.42 * sc, rx = cx + 0.42 * sc, ty = cy + 0.22 * sc;
    g.arrow(lx, ty, lx, ty + dL, { c: C.red, w: 3 }); g.arrow(rx, ty, rx, ty + dR, { c: C.red, w: 3 });
    g.text("D", lx - 12, ty + dL - 4, { c: C.red, bold: true });
    g.text("D", rx + 6, ty + dR - 4, { c: C.red, bold: true });
    if (!s.dif) {
      g.arcArrow(cx, cy - 10, 42, Math.PI * 0.62, Math.PI * 0.92, { c: C.red, w: 2.2 });
      g.text("guiña hacia la izquierda\n(contraria al viraje)", cx, 300, { c: C.red, size: 11.5, align: "center", bold: true });
    } else {
      g.text("el alerón que sube se deflecta más:\nsu resistencia compensa la guiñada", cx, 300, { c: C.green, size: 11.5, align: "center", bold: true });
    }
  },
  caption: "Ubicación: borde de fuga cerca de las puntas, del 8 al 10 % de la superficie alar y 35–45 % de la envergadura; 20–25° arriba y 15–20° abajo. También se corrige con alerón Frise, spoilers o coordinando con el timón.",
});

FIG.def("frise", {
  title: "Alerón Frise y alerón ranurado",
  h: 250,
  controls: [{ type: "seg", key: "k", options: [["frise", "Frise"], ["ran", "Ranurado"]], value: "frise" }],
  draw(g, s) {
    const A = splitAirfoil(0.7, { t: 0.13, m: 0.02 });
    const aileron = A.up.concat(A.lo.slice().reverse());
    const nose = [[0.66, 0.0], [0.67, 0.025], [0.69, 0.035]].concat(aileron.filter(([x]) => x > 0.7)).concat([[0.69, -0.03], [0.67, -0.022]]);
    const hinge = [0.72, 0.0];
    [["sube", -22, 40], ["baja", 18, 160]].forEach(([lab, d, y0], i) => {
      const x0 = -30, ch = 380;
      const mainCut = A.main.map(([x, y]) => [x, y]);
      g.path(toScr(mainCut, x0, y0 + 20, ch), { fill: "#2c3440", c: C.metal, close: true, w: 1.3 });
      const part = s.k === "frise" ? nose : aileron;
      const moved = rotL(part, s.k === "frise" ? hinge : A.hinge, d).map(([x, y]) => (s.k === "ran" && d > 0 ? [x + 0.02, y - 0.012] : [x, y]));
      g.path(toScr(moved, x0, y0 + 20, ch), { fill: C.accent, fillAlpha: 0.8, c: C.accent2, close: true, w: 1.2 });
      g.circle(...toScr([s.k === "frise" ? hinge : A.hinge], x0, y0 + 20, ch)[0], 3, { fill: C.ink });
      g.text("Alerón " + lab, 380, y0 + 6, { bold: true, size: 12 });
      let t;
      if (s.k === "frise") t = d < 0 ? "la nariz sobresale por debajo del\nintradós: turbulencia y mucha\nresistencia → compensa la\nguiñada adversa" : "forma una superficie\ncontinua con el ala";
      else t = d > 0 ? "abre una ranura: energiza la capa\nlímite y aumenta la sustentación\n(más cupla de rolido a grandes\nángulos de ataque)" : "la ranura se cierra";
      g.text(t, 380, y0 + 26, { c: C.dim, size: 11, base: "top" });
      if (s.k === "frise" && d < 0) { const p = toScr([[0.68, -0.06]], x0, y0 + 20, ch)[0]; for (let k = 0; k < 3; k++) g.arcArrow(p[0] + 20 + k * 22, p[1] + 14, 8, k, k + 4.5, { c: C.red, w: 1.2, head: 5 }); }
    });
  },
  caption: "Frise: charnela retrasada y nariz perfilada, equilibrado estática y dinámicamente. A alta velocidad se equilibra con un tab y, en transporte, se bloquean los alerones exteriores (control con los interiores y los spoilers).",
});

/* ======================= TEMA 16 ======================= */
function drawControlSurface(g, x0, y0, ch, dE, dT, o = {}) {
  // estabilizador (0..0.6), superficie (0.6..0.92), tab (0.92..1)
  const A = splitAirfoil(0.6, { m: 0, t: 0.1 });
  g.path(toScr(A.main, x0, y0, ch), { fill: "#2c3440", c: C.metal, close: true, w: 1.3 });
  const up = A.up, lo = A.lo;
  const surf = up.filter(([x]) => x <= 0.9).concat(lo.filter(([x]) => x <= 0.9).reverse());
  const tab = up.filter(([x]) => x >= 0.9).concat(lo.filter(([x]) => x >= 0.9).reverse());
  const tabH = [0.9, 0];
  const tabR = rotL(rotL(tab, tabH, dT), A.hinge, dE);
  g.path(toScr(rotL(surf, A.hinge, dE), x0, y0, ch), { fill: o.sc || C.purple, fillAlpha: 0.6, c: o.sc || C.purple, close: true, w: 1.2 });
  g.path(toScr(tabR, x0, y0, ch), { fill: o.tc || C.yellow, fillAlpha: 0.85, c: o.tc || C.yellow, close: true, w: 1.2 });
  const hs = toScr([A.hinge], x0, y0, ch)[0];
  g.circle(hs[0], hs[1], 3.5, { fill: C.ink });
  const tabTip = toScr(rotL([[0.97, 0]], A.hinge, dE).map((p) => p), x0, y0, ch)[0];
  const surfMid = toScr(rotL([[0.76, 0]], A.hinge, dE), x0, y0, ch)[0];
  return { hs, tabTip, surfMid };
}

FIG.def("charnela", {
  title: "Momento de charnela: M_h = C_h·½ρV²·S·c",
  h: 280,
  controls: [
    { type: "range", key: "v", label: "Velocidad", min: 100, max: 700, step: 10, value: 300, fmt: (v) => v + " km/h" },
    { type: "range", key: "d", label: "Deflexión δ", min: 0, max: 25, step: 1, value: 12, fmt: (v) => v + "°" },
  ],
  draw(g, s) {
    const r = drawControlSurface(g, 20, 120, 330, s.d, 0, { tc: C.purple });
    const F = 12 + (s.v / 700) ** 2 * 80 * (s.d / 25);
    g.arrow(r.surfMid[0], r.surfMid[1], r.surfMid[0], r.surfMid[1] - F, { c: C.green, w: 2.4 });
    g.text("F", r.surfMid[0] + 8, r.surfMid[1] - F + 6, { c: C.green, bold: true });
    g.dim(r.hs[0], r.hs[1] + 34, r.surfMid[0], r.hs[1] + 34, "brazo", { c: C.dim });
    if (s.d > 0) g.arcArrow(r.hs[0], r.hs[1], 26, -0.4, 0.9, { c: C.red, w: 2 });
    g.text("M_h: tiende a volverla a neutro", r.hs[0] - 70, r.hs[1] - 50, { c: C.red, size: 11 });
    g.text("estabilizador", 120, 168, { c: C.dim, size: 10.5, align: "center" });
    const P = g.plot([410, 40, 190, 180], [0, 700], [0, 1], { xt: [0, 350, 700], yt: [], xl: "V [km/h]", yl: "M_h" });
    const pts = []; for (let v = 0; v <= 700; v += 10) pts.push([P.X(v), P.Y((v / 700) ** 2 * (s.d / 25))]);
    g.path(pts, { c: C.red, w: 2.2 });
    g.circle(P.X(s.v), P.Y((s.v / 700) ** 2 * (s.d / 25)), 5.5, { fill: C.red });
    g.text("∝ V²", P.X(560), P.Y(0.85), { c: C.red, size: 12, bold: true });
  },
  info(s) { return `<span>Esfuerzo del piloto relativo a 100 km/h: <b>×${fmt.n((s.v / 100) ** 2, 1)}</b></span><span>Compensar = reducir M_h sin quitarle autoridad a la superficie.</span>`; },
  caption: "Es lo que el piloto “siente” en los mandos. Crece con V² y con el tamaño de la superficie: en aviones grandes y rápidos sería imposible de vencer a mano.",
});

FIG.def("cornadura", {
  title: "Compensación por cornadura (timón de dirección en planta)",
  h: 290,
  draw(g) {
    const x = 120, y = 260;
    g.path([[x, y], [x + 90, y - 170], [x + 160, y - 170], [x + 150, y - 40], [x + 150, y]], { fill: "#2c3440", c: C.metal, close: true, w: 1.3 });
    g.path([[x + 150, y], [x + 150, y - 150], [x + 128, y - 150], [x + 128, y - 214], [x + 200, y - 214], [x + 214, y - 150], [x + 222, y]], { fill: C.yellow, fillAlpha: 0.4, c: C.yellow, close: true, w: 1.3 });
    g.path([[x + 128, y - 150], [x + 128, y - 214], [x + 150, y - 214], [x + 150, y - 150]], { fill: C.teal, fillAlpha: 0.6, c: null, close: true });
    g.line(x + 150, y + 10, x + 150, y - 228, { c: C.ink, w: 1.2, dash: [5, 4] });
    g.text("eje de charnela", x + 152, y + 20, { c: C.ink, size: 10.5 });
    g.callout("cuerno (delante del eje)", x + 136, y - 196, 30, 34, { c: C.teal });
    g.arrow(x + 138, y - 182, x + 138 + 60, y - 182, { c: C.teal, w: 2.4 });
    g.text("F₁", x + 202, y - 182, { c: C.teal, bold: true });
    g.arrow(x + 186, y - 80, x + 186 + 90, y - 80, { c: C.yellow, w: 2.4 });
    g.text("F₂", x + 282, y - 80, { c: C.yellow, bold: true });
    g.dim(x + 138, y - 160, x + 150, y - 160, "", {});
    g.text("a₁", x + 144, y - 140, { c: C.teal, size: 11, align: "center" });
    g.dim(x + 150, y - 60, x + 186, y - 60, "a₂", { c: C.yellow });
    g.text("Momento neto = F₂·a₂ − F₁·a₁", 470, 70, { bold: true, size: 12.5, align: "center" });
    g.text("Debe cumplirse F₁·a₁ < F₂·a₂", 470, 104, { c: C.green, size: 12, align: "center" });
    g.text("Si el cuerno supera a la parte trasera, la\nsuperficie no vuelve sola a neutro:\nsobrecompensación (peligroso).", 470, 150, { c: C.red, size: 11, align: "center" });
    g.text("Protegida (shielded): cuerno detrás de la\nsuperficie fija. No protegida (unshielded):\ncuerno expuesto a la corriente.", 470, 222, { c: C.dim, size: 11, align: "center" });
  },
  caption: "La parte delantera genera un momento opuesto al de la trasera y reduce el momento neto de charnela.",
});

FIG.def("tabs", {
  title: "Tabs: auxiliar, servo-tab, anti-tab, compensación y de tierra",
  h: 270,
  controls: [{ type: "seg", key: "k", options: [["aux", "Tab auxiliar"], ["servo", "Servo-tab"], ["anti", "Anti-tab"], ["trim", "Trim"], ["tierra", "Tab de tierra"]], value: "aux" }],
  draw(g, s) {
    const cfg = { aux: [14, -26], servo: [14, -26], anti: [14, 22], trim: [10, -20], tierra: [0, -12] }[s.k];
    const r = drawControlSurface(g, 30, 120, 420, cfg[0], cfg[1]);
    const Fs = cfg[0] * 3.4;
    if (cfg[0]) { g.arrow(r.surfMid[0], r.surfMid[1], r.surfMid[0], r.surfMid[1] - Fs, { c: C.green, w: 2.4 }); g.text("F superficie", r.surfMid[0] - 6, r.surfMid[1] - Fs - 10, { c: C.green, size: 11, align: "center" }); }
    const tf = cfg[1] < 0 ? 1 : -1; // tab arriba -> fuerza hacia abajo
    g.arrow(r.tabTip[0], r.tabTip[1], r.tabTip[0], r.tabTip[1] + tf * 44, { c: C.yellow, w: 2.4 });
    g.text("F tab", r.tabTip[0] + 8, r.tabTip[1] + tf * 40, { c: C.yellow, size: 11 });
    g.text("estabilizador (fijo)", 150, 168, { c: C.dim, size: 10.5, align: "center" });
    if (s.k === "servo") { g.line(r.tabTip[0] - 30, r.tabTip[1] + 6, r.tabTip[0] - 60, 220, { c: C.ink, w: 1.4, dash: [4, 3] }); g.text("el piloto mueve solo el tab", r.tabTip[0] - 60, 234, { c: C.ink, size: 11, align: "center" }); }
    if (s.k === "anti") { g.line(r.tabTip[0] - 20, r.tabTip[1] - 4, 250, 80, { c: C.ink, w: 1.4, dash: [4, 3] }); g.text("barra unida al plano fijo", 250, 70, { c: C.ink, size: 11, align: "center" }); }
    const txt = {
      aux: ["Se deflecta en sentido CONTRARIO a la superficie.", "Su momento AYUDA a moverla: reduce el esfuerzo de maniobra."],
      servo: ["El tab arrastra por aerodinámica a la superficie principal.", "Reduce mucho el esfuerzo: para momentos de charnela muy grandes."],
      anti: ["Se deflecta en el MISMO sentido que la superficie.", "Su momento se OPONE: da “sensación” en superficies que se mueven demasiado fácil."],
      trim: ["El piloto lo ajusta hasta que su momento iguala al de la superficie.", "Queda en la posición deseada sin fuerza sostenida en el mando."],
      tierra: ["Aleta metálica fija que se dobla en tierra tras los vuelos de prueba.", "Corrige una tendencia permanente (p. ej., a rolar). No se mueve en vuelo."],
    }[s.k];
    g.text(txt[0], 320, 236, { size: 11.5, align: "center" });
    g.text(txt[1], 320, 256, { c: C.dim, size: 11, align: "center" });
  },
  caption: "Los tabs actúan muy lejos de la charnela: una fuerza chica produce un gran momento.",
});

FIG.def("resorte", {
  title: "Tab con resorte: la ayuda crece con la velocidad",
  h: 250,
  draw(g) {
    const P = g.plot([80, 30, 480, 170], [0, 1], [0, 1], { xt: [], yt: [], xl: "velocidad", yl: "ayuda / deflexión del tab" });
    const v1 = 0.35;
    const mh = []; for (let v = 0; v <= 1; v += 0.02) mh.push([P.X(v), P.Y(v * v)]);
    g.path(mh, { c: C.red, w: 1.6, dash: [6, 4] });
    g.text("M_h ∝ V²", P.X(1) - 4, P.Y(1) - 10, { c: C.red, size: 11.5, align: "right" });
    const tab = []; for (let v = 0; v <= 1; v += 0.01) tab.push([P.X(v), P.Y(v < v1 ? 0 : 0.92 * ((v * v - v1 * v1) / (1 - v1 * v1)))]);
    g.path(tab, { c: C.yellow, w: 2.6 });
    g.text("deflexión del tab (contraria)", P.X(0.62), P.Y(0.5) + 26, { c: C.yellow, size: 11.5 });
    g.rect(P.X(0), P.Y(1), P.X(v1) - P.X(0), P.Y(0) - P.Y(1), { fill: C.blue, fillAlpha: 0.08, c: null });
    g.text("baja velocidad:\nel resorte no cede,\nel tab acompaña rígido", P.X(v1 / 2), P.Y(0.62), { c: C.blue, size: 10.5, align: "center" });
  },
  caption: "Servo-tab movido a través de un resorte de torsión: a alta velocidad M_h vence al resorte y el tab se deflecta cada vez más en sentido contrario. La ayuda aparece justo cuando más se necesita.",
});

/* ======================= TEMA 17 ======================= */
FIG.def("mandos", {
  title: "Sistemas de mando según cómo llega la fuerza a la superficie",
  h: 330,
  draw(g) {
    const box = (x, y, w, t, col) => { g.rect(x, y - 17, w, 34, { fill: C.grid, c: col, r: 8, w: 1.3 }); g.text(t, x + w / 2, y, { c: col, size: 11.5, bold: true, align: "center" }); };
    const rows = [
      ["Convencional", "reversible · el piloto aporta toda la fuerza · aviones livianos", 52],
      ["Ayudado", "reversible · el piloto aporta una parte de la fuerza", 152],
      ["Operado con potencia", "irreversible · el piloto solo comanda · necesita sensación artificial", 252],
    ];
    rows.forEach(([n, sub, y], i) => {
      g.text(n, 20, y - 30, { bold: true, size: 12.5, c: C.accent2 });
      g.text(sub, 20 + g.measure(n, 12.5, true) + 12, y - 30, { c: C.dim, size: 10.5 });
      box(20, y, 90, "Piloto", C.ink);
      box(510, y, 110, "Superficie", C.purple);
      if (i === 0) {
        box(200, y, 200, "cables · varillas · poleas", C.metal);
        g.arrow(110, y, 200, y, { c: C.ink, w: 2.4 }); g.arrow(400, y, 510, y, { c: C.ink, w: 2.4 });
        g.arrow(510, y + 12, 112, y + 12, { c: C.red, w: 1.2, dash: [4, 3] });
        g.text("siente la carga aerodinámica", 310, y + 24, { c: C.red, size: 10, align: "center" });
      } else if (i === 1) {
        box(200, y, 200, "cables + actuador en paralelo", C.metal);
        g.arrow(110, y, 200, y, { c: C.ink, w: 1.6 }); g.arrow(400, y, 510, y, { c: C.ink, w: 2.4 });
        g.arrow(300, y + 40, 300, y + 18, { c: C.blue, w: 2 }); g.text("potencia (resto de la fuerza)", 310, y + 40, { c: C.blue, size: 10.5 });
      } else {
        box(150, y, 110, "señal", C.metal); box(320, y, 150, "actuador hidráulico", C.blue);
        g.arrow(110, y, 150, y, { c: C.ink, w: 1.2 }); g.arrow(260, y, 320, y, { c: C.ink, w: 1.2 }); g.arrow(470, y, 510, y, { c: C.blue, w: 2.6 });
        g.arrow(150, y + 30, 66, y + 18, { c: C.yellow, w: 1.4 }); g.text("sensación artificial ∝ δ y V²", 160, y + 34, { c: C.yellow, size: 10.5 });
        g.text("≥ 2 sistemas hidráulicos (redundancia)", 470, y + 34, { c: C.dim, size: 10, align: "center" });
      }
    });
  },
  caption: "El sistema de mando convierte los movimientos del piloto en deflexiones de las superficies mediante dispositivos mecánicos, hidráulicos y eléctricos.",
});

FIG.def("lazo", {
  title: "Piloto automático y SAS como lazos de control",
  h: 270,
  draw(g) {
    const box = (x, y, w, t, col, sub) => { g.rect(x, y - 22, w, 44, { fill: C.grid, c: col, r: 9, w: 1.4 }); g.text(t, x + w / 2, y - (sub ? 7 : 0), { c: col, size: 12, bold: true, align: "center" }); if (sub) g.text(sub, x + w / 2, y + 10, { c: C.dim, size: 10, align: "center" }); };
    const y = 80;
    g.text("rumbo / altitud\ndeseados", 50, y, { c: C.ink, size: 11, align: "center" });
    g.circle(118, y, 12, { c: C.ink, w: 1.4 }); g.text("−", 112, y + 16, { c: C.ink, size: 12 });
    box(150, y, 130, "Computadora", C.accent, "compara y corrige");
    box(320, y, 120, "Actuadores", C.blue, "servos");
    box(480, y, 120, "Avión", C.ink, "superficies");
    g.arrow(90, y, 106, y, { c: C.ink }); g.arrow(130, y, 150, y, { c: C.ink }); g.arrow(280, y, 320, y, { c: C.ink }); g.arrow(440, y, 480, y, { c: C.ink });
    box(300, 190, 160, "Sensores", C.green, "actitud, rumbo, altitud, V");
    g.path([[600, y], [620, y], [620, 190], [460, 190]], { c: C.ink, w: 1.6 }); g.arrow(490, 190, 460, 190, { c: C.ink });
    g.path([[300, 190], [118, 190], [118, y + 12]], { c: C.green, w: 1.6 }); g.arrow(118, 120, 118, y + 13, { c: C.green });
    g.text("realimentación", 210, 204, { c: C.green, size: 10.5, align: "center" });
    g.path([[560, y + 22], [560, 140], [380, 140], [380, y + 22]], { c: C.purple, w: 1.4, dash: [5, 3] });
    g.arrow(380, 130, 380, y + 23, { c: C.purple, w: 1.4 });
    g.text("SAS: amortigua oscilaciones", 470, 152, { c: C.purple, size: 10.5, align: "center" });
    g.text("Niveles: 1 eje (rolido) · 3 ejes · acoplado a la navegación con director de vuelo · integrado en fly-by-wire", 320, 248, { c: C.dim, size: 10.5, align: "center" });
  },
  caption: "Siempre tiene desconexión de seguridad, manual o automática. El SAS mejora artificialmente la estabilidad sin que el piloto intervenga.",
});

/* ======================= TEMA 18 ======================= */
FIG.def("superficies", {
  title: "Superficies de control de un avión de transporte",
  h: 340,
  controls: [{ type: "seg", key: "k", options: [["todas", "Todas"], ["prim", "Primarias"], ["sec", "Secundarias"]], value: "todas" }],
  draw(g, s) {
    const prim = s.k !== "sec", sec = s.k !== "prim";
    const D = (on) => (on ? 1 : "dim");
    PLANE.top(g, 220, 168, 300, { alerones: D(prim), elevador: D(prim), timon: D(prim), flaps: D(sec), slats: D(sec), spoilers: D(sec) });
    const items = [
      [C.accent, "Alerones", "rolido", prim], [C.purple, "Timón de profundidad", "cabeceo", prim], [C.yellow, "Timón de dirección", "guiñada", prim],
      [C.blue, "Flaps", "hipersustentador", sec], [C.green, "Slats", "hipersustentador", sec], [C.red, "Spoilers", "hiposustentador", sec],
    ];
    items.forEach(([col, n, f, on], i) => {
      const y = 50 + i * 40, x = 430;
      g.rect(x, y - 7, 14, 14, { fill: col, fillAlpha: on ? 0.9 : 0.25, c: null, r: 3 });
      g.text(n, x + 24, y - 3, { c: on ? C.ink : C.faint, size: 12, bold: true });
      g.text(f, x + 24, y + 13, { c: on ? C.dim : C.faint, size: 10.5 });
    });
    g.text("+ empuje (acelerador) y\n   compensadores (tabs)", 430, 300, { c: C.dim, size: 10.5 });
  },
  caption: "Las superficies de comando cambian la actitud (orientación respecto de los tres ejes), y con ella las fuerzas que curvan la trayectoria del centro de gravedad. Se accionan coordinadas y junto con el empuje.",
});

FIG.def("spoiler", {
  title: "Spoilers: hiposustentadores",
  h: 280, anim: true, still: 1,
  controls: [{ type: "seg", key: "k", options: [["perfil", "Efecto en el perfil"], ["asim", "Uso asimétrico"], ["sim", "Uso simétrico"]], value: "perfil" }],
  draw(g, s, t) {
    if (s.k === "perfil") {
      const x0 = 80, y0 = 140, ch = 420;
      const { up } = drawAirfoil(g, x0, y0, ch, 3, { t: 0.13, m: 0.03 });
      const i0 = up.findIndex(([x]) => x > x0 + 0.58 * ch);
      const p = up[i0];
      g.line(p[0], p[1], p[0] + 56 * Math.cos(-0.75), p[1] + 56 * Math.sin(-0.75), { c: C.red, w: 5 });
      for (let k = 0; k < 4; k++) { const cx = p[0] + 60 + k * 40 + ((t * 25) % 40), cy = p[1] - 14 + k * 4; g.arcArrow(cx, cy, 10, (t * 5 + k) % 6, ((t * 5 + k) % 6) + 4.3, { c: C.red, w: 1.3, head: 5 }); }
      g.arrow(x0 + 0.3 * ch, y0 - 30, x0 + 0.3 * ch, y0 - 60, { c: C.green, w: 2.4 }); g.text("menos L", x0 + 0.3 * ch + 8, y0 - 58, { c: C.green, size: 11.5 });
      g.arrow(x0 + ch + 10, y0 + 10, x0 + ch + 70, y0 + 10, { c: C.red, w: 2.4 }); g.text("más D", x0 + ch + 40, y0 + 28, { c: C.red, size: 11.5, align: "center" });
      g.text("placa sobre el extradós que corta la capa límite", 320, 240, { c: C.ink, size: 12, align: "center" });
    } else if (s.k === "asim") {
      drawPlaneFront(g, 230, 140, 330, "baja", 0, { gear: false, dihedral: 3 });
      g.line(300, 140 + 26, 340, 140 + 6, { c: C.red, w: 4 });
      g.arrow(320, 130, 320, 160, { c: C.red, w: 2.4 }); g.text("spoiler arriba:\nesa semiala baja", 360, 110, { c: C.red, size: 11.5 });
      g.text("Control lateral a alta velocidad, donde los alerones exteriores\npierden eficacia. Produce guiñada favorable, con cierto retraso.", 320, 240, { c: C.dim, size: 11.5, align: "center" });
    } else {
      drawPlaneFront(g, 230, 140, 330, "baja", 0, { gear: true, dihedral: 3 });
      [[300, 340], [160, 120]].forEach(([a, b]) => g.line(a, 140 + 26, b, 140 + 6, { c: C.red, w: 4 }));
      g.text("En vuelo: aerofreno (empina el descenso sin acelerar).\nEn tierra: anula la sustentación, carga las ruedas y mejora el frenado.", 320, 240, { c: C.dim, size: 11.5, align: "center" });
    }
  },
  caption: "Frenos aerodinámicos: superficies que solo agregan resistencia, sin cortar la capa límite del ala (en la cola, el fuselaje o el ala).",
});
