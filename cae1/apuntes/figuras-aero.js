// Figuras de los temas 8 a 13: aeronaves, materiales, ala, fabricación, fuselaje y cola.

/* ---------- Dibujos reutilizables ---------- */
// Perfil alar relleno. x0,y0 = borde de ataque; deg > 0 = nariz arriba.
function drawAirfoil(g, x0, y0, chord, deg = 0, o = {}) {
  const f = GEO.naca(o.m ?? 0.04, o.p ?? 0.4, o.t ?? 0.12);
  const up = GEO.place(f.up, x0, y0, chord, deg), lo = GEO.place(f.lo, x0, y0, chord, deg);
  g.path(up.concat(lo.slice().reverse()), { fill: o.fill || "#2c3440", c: o.c || C.metal, w: o.w || 1.4, close: true });
  return { up, lo };
}

// Vista en planta de un avión de transporte (nariz arriba). s = escala (largo del fuselaje).
const PLANE = {
  wingLE: (x) => -0.05 + 0.2 * ((x - 0.05) / 0.45),
  wingTE: (x) => 0.17 + 0.05 * ((x - 0.05) / 0.45),
  P(cx, cy, s, x, y) { return [cx + x * s, cy + y * s]; },
  // franja de borde de fuga entre x1 y x2 (semienvergadura derecha), profundidad d (fracción de cuerda)
  teStrip(x1, x2, d, side = 1) {
    const pt = (x, frac) => [side * x, PLANE.wingTE(x) - frac * (PLANE.wingTE(x) - PLANE.wingLE(x))];
    return [pt(x1, 0), pt(x2, 0), pt(x2, d), pt(x1, d)];
  },
  leStrip(x1, x2, d, side = 1) {
    const pt = (x, frac) => [side * x, PLANE.wingLE(x) + frac * (PLANE.wingTE(x) - PLANE.wingLE(x))];
    return [pt(x1, 0), pt(x2, 0), pt(x2, d), pt(x1, d)];
  },
  midStrip(x1, x2, a, b, side = 1) {
    const pt = (x, frac) => [side * x, PLANE.wingLE(x) + frac * (PLANE.wingTE(x) - PLANE.wingLE(x))];
    return [pt(x1, a), pt(x2, a), pt(x2, b), pt(x1, b)];
  },
  top(g, cx, cy, s, hl = {}) {
    const T = (pts) => pts.map(([x, y]) => PLANE.P(cx, cy, s, x, y));
    const body = "#2a3038", edge = C.metal;
    [-1, 1].forEach((sd) => {
      g.path(T([[sd * 0.05, -0.06], [sd * 0.5, 0.15], [sd * 0.5, 0.22], [sd * 0.05, 0.17]]), { fill: body, c: edge, close: true, w: 1.2 });
      g.path(T([[sd * 0.03, 0.36], [sd * 0.18, 0.43], [sd * 0.18, 0.47], [sd * 0.03, 0.46]]), { fill: body, c: edge, close: true, w: 1.2 });
      g.rect(...PLANE.P(cx, cy, s, sd * 0.17 - 0.022, -0.08), 0.044 * s, 0.12 * s, { fill: "#3a424c", c: edge, w: 1, r: 3 });
    });
    const F = []; for (let k = 0; k <= 40; k++) { const u = k / 40, y = -0.5 + u; const w = 0.055 * Math.min(1, Math.sqrt((u + 0.001) / 0.12)) * (u > 0.75 ? 1 - ((u - 0.75) / 0.25) * 0.75 : 1); F.push([w, y]); }
    g.path(T(F.concat(F.slice().reverse().map(([w, y]) => [-w, y]))), { fill: "#323a44", c: edge, close: true, w: 1.2 });
    g.path(T([[0, 0.3], [0.012, 0.36], [0.012, 0.5], [-0.012, 0.5], [-0.012, 0.36]]), { fill: "#3a424c", c: edge, close: true, w: 1 });
    const surf = {
      alerones: [(sd) => PLANE.teStrip(0.34, 0.48, 0.3, sd), C.accent],
      flaps: [(sd) => PLANE.teStrip(0.07, 0.32, 0.3, sd), C.blue],
      slats: [(sd) => PLANE.leStrip(0.1, 0.48, 0.14, sd), C.green],
      spoilers: [(sd) => PLANE.midStrip(0.12, 0.3, 0.5, 0.66, sd), C.red],
      elevador: [(sd) => [[sd * 0.03, 0.44], [sd * 0.18, 0.455], [sd * 0.18, 0.47], [sd * 0.03, 0.46]], C.purple],
      timon: [() => [[-0.012, 0.44], [0.012, 0.44], [0.012, 0.5], [-0.012, 0.5]], C.yellow],
    };
    Object.entries(surf).forEach(([k, [fn, col]]) => {
      if (!hl[k]) return;
      [-1, 1].forEach((sd) => g.path(T(fn(sd)), { fill: col, fillAlpha: hl[k] === "dim" ? 0.25 : 0.9, c: null, close: true }));
    });
  },
};

// Vista frontal: ubicación del ala ("alta", "media", "baja", "parasol"); rot en grados (rolido)
function drawPlaneFront(g, cx, cy, s, pos = "baja", rot = 0, o = {}) {
  const c = g.ctx; c.save(); c.translate(cx, cy); c.rotate((-rot * Math.PI) / 180);
  const R = s * 0.11, dih = o.dihedral ?? (pos === "baja" ? 5 : pos === "media" ? 2 : 0);
  const wy = pos === "alta" ? -R * 0.8 : pos === "media" ? 0 : pos === "baja" ? R * 0.75 : -R * 1.9;
  const half = s * 0.5, d = Math.tan((dih * Math.PI) / 180) * half;
  const gg = new G(c, 0, 0);
  // estabilizador y deriva
  gg.line(-s * 0.18, -R * 0.2, s * 0.18, -R * 0.2, { c: C.metal, w: 3 });
  gg.path([[-R * 0.12, -R * 0.3], [0, -R * 3], [R * 0.12, -R * 0.3]], { fill: "#3a424c", c: C.metal, close: true, w: 1 });
  gg.path([[-half, wy - d], [0, wy], [half, wy - d]], { c: o.wingColor || C.ink, w: 4.5 });
  if (pos === "parasol") { gg.line(-R * 0.9, -R * 0.7, -R * 0.4, wy, { c: C.metal, w: 1.6 }); gg.line(R * 0.9, -R * 0.7, R * 0.4, wy, { c: C.metal, w: 1.6 }); }
  gg.circle(0, 0, R, { fill: "#323a44", c: C.metal, w: 1.4 });
  if (o.engines) [-1, 1].forEach((sd) => gg.circle(sd * half * 0.38, wy + R * 0.45 - (sd ? d * 0.38 : 0), R * 0.38, { fill: "#3a424c", c: C.metal, w: 1 }));
  if (o.gear !== false) { gg.line(-R * 0.6, R, -R * 0.75, R * 1.9, { c: C.faint, w: 1.6 }); gg.line(R * 0.6, R, R * 0.75, R * 1.9, { c: C.faint, w: 1.6 }); }
  c.restore();
}

// Vista lateral simple (nariz a la derecha). pitch en grados (nariz arriba +)
function drawPlaneSide(g, cx, cy, s, pitch = 0, o = {}) {
  const c = g.ctx; c.save(); c.translate(cx, cy); c.rotate((-pitch * Math.PI) / 180);
  const gg = new G(c, 0, 0), L = s / 2, H = s * 0.06;
  gg.path([[L, 0], [L * 0.86, -H], [-L * 0.6, -H], [-L, -H * 0.5], [-L, H * 0.1], [-L * 0.6, H], [L * 0.82, H]], { fill: "#323a44", c: C.metal, close: true, w: 1.2 });
  gg.path([[-L * 0.62, -H], [-L * 0.92, -H * 4.4], [-L * 1.02, -H * 4.4], [-L * 0.96, -H * 0.6]], { fill: "#3a424c", c: C.metal, close: true, w: 1 });
  if (!o.noTail) gg.path([[-L * 0.78, -H * 0.2], [-L * 1.02, -H * 0.4], [-L * 1.02, H * 0.1], [-L * 0.8, H * 0.2]], { fill: C.purple, fillAlpha: 0.7, c: null, close: true });
  gg.path([[L * 0.12, H * 0.4], [-L * 0.2, H * 0.55], [-L * 0.28, H * 0.55], [-L * 0.04, H * 0.35]], { fill: "#4a5058", c: C.metal, close: true, w: 1 });
  c.restore();
}

/* ======================= TEMA 8 ======================= */
FIG.def("arbolAeronaves", {
  title: "Clasificación de las aeronaves según su sustentación",
  h: 290,
  draw(g) {
    const box = (x, y, w, t, col, sub) => {
      g.rect(x - w / 2, y - 18, w, sub ? 46 : 36, { fill: C.grid, c: col, w: 1.4, r: 9 });
      g.text(t, x, y, { c: col, size: 12, bold: true, align: "center" });
      if (sub) g.text(sub, x, y + 17, { c: C.dim, size: 10.5, align: "center" });
    };
    const link = (x1, y1, x2, y2) => { g.path([[x1, y1], [x1, (y1 + y2) / 2], [x2, (y1 + y2) / 2], [x2, y2]], { c: C.faint, w: 1.2 }); };
    link(320, 46, 150, 92); link(320, 46, 460, 92);
    box(320, 30, 140, "Aeronave", C.ink);
    link(150, 128, 90, 176); link(150, 128, 210, 176);
    link(460, 128, 370, 176); link(460, 128, 550, 176);
    box(150, 104, 220, "Más livianas que el aire", C.teal, "aerostatos · flotabilidad (Arquímedes)");
    box(460, 104, 230, "Más pesadas que el aire", C.accent, "aerodinos · acción dinámica");
    box(90, 192, 100, "Globos", C.teal); box(210, 192, 110, "Dirigibles", C.teal);
    box(370, 192, 120, "Ala fija", C.accent); box(550, 192, 130, "Ala rotativa", C.accent);
    g.text("planeador · avión\nhidroavión · anfibio", 370, 246, { c: C.ink, size: 11, align: "center" });
    g.text("autogiro · helicóptero", 550, 240, { c: C.ink, size: 11, align: "center" });
    g.text("aire caliente\ngas · híbrido", 90, 246, { c: C.dim, size: 10.5, align: "center" });
    g.text("no rígido\nsemirrígido · rígido", 214, 246, { c: C.dim, size: 10.5, align: "center" });
  },
  caption: "Aeronave: todo aparato capaz de llevar peso y diseñado para sustentarse en el aire, por flotabilidad o por acción dinámica.",
});

FIG.def("aerostatos", {
  title: "Más livianas que el aire: empuje de Arquímedes y tipos de dirigibles",
  h: 300,
  draw(g) {
    // globo
    const bx = 110, by = 120;
    g.smooth([[bx, by + 70], [bx - 52, by + 10], [bx - 62, by - 40], [bx - 30, by - 82], [bx, by - 88], [bx + 30, by - 82], [bx + 62, by - 40], [bx + 52, by + 10], [bx, by + 70]], { fill: C.accent, fillAlpha: 0.35, c: C.accent, w: 1.5 });
    g.line(bx - 14, by + 66, bx - 10, by + 96, { c: C.metal }); g.line(bx + 14, by + 66, bx + 10, by + 96, { c: C.metal });
    g.rect(bx - 14, by + 96, 28, 18, { fill: "#6b4c2a", c: null, r: 3 });
    g.arrow(bx, by - 20, bx, by - 120 + 10, { c: C.green, w: 3 });
    g.text("E = ρ_aire·V·g", bx + 10, 18, { c: C.green, bold: true });
    g.arrow(bx, by + 50, bx, by + 150, { c: C.red, w: 3 });
    g.text("W (gas + estructura + carga)", bx + 8, 278, { c: C.red, size: 11 });
    g.text("Sube si W < E", 22, 252, { c: C.dim, size: 11 });
    // dirigibles
    const blimp = (y, lab, sub, kind) => {
      const x = 480;
      g.ellipse(x, y, 140, 30, 0, { fill: "#2c3440", c: C.metal, w: 1.3 });
      g.path([[x - 128, y - 12], [x - 160, y - 30], [x - 156, y], [x - 128, y]], { fill: "#3a424c", c: C.metal, close: true, w: 1 });
      g.rect(x - 20, y + 28, 40, 12, { fill: "#3a424c", c: C.metal, r: 3, w: 1 });
      if (kind === "semi") g.line(x - 120, y + 26, x + 120, y + 26, { c: C.accent, w: 3 });
      if (kind === "rigido") {
        for (let i = -5; i <= 5; i++) { const xx = x + i * 24, h = 30 * Math.sqrt(1 - (i * 24 / 140) ** 2); g.line(xx, y - h, xx, y + h, { c: C.accent, w: 1.2 }); }
        g.line(x - 138, y, x + 138, y, { c: C.accent, w: 1 });
        for (let i = -2; i <= 2; i++) g.ellipse(x + i * 48, y, 20, 18, 0, { fill: C.teal, fillAlpha: 0.25, c: null });
      }
      if (kind === "no") g.text("forma por la presión del gas", x, y, { c: C.dim, size: 10.5, align: "center" });
      g.text(lab, 206, y - 8, { bold: true, size: 12 });
      g.text(sub, 206, y + 10, { c: C.dim, size: 10 });
    };
    blimp(52, "No rígido", "sin estructura", "no");
    blimp(150, "Semirrígido", "quilla o armadura", "semi");
    blimp(248, "Rígido", "marco + bolsas", "rigido");
  },
  caption: "Los globos controlan la altitud pero no tienen propulsión; los dirigibles son globos de gas con hélices y comandos direccionales.",
});

FIG.def("planeo", {
  title: "Vuelo planeado: finura L/D y distancia recorrida",
  h: 250,
  controls: [{ type: "range", key: "ld", label: "Finura L/D", min: 5, max: 50, step: 1, value: 30 }],
  draw(g, s) {
    const h = 1000, d = h * s.ld, maxD = 50000;
    const x0 = 40, y0 = 50, gy = 200, sc = 560 / maxD;
    g.line(20, gy, 620, gy, { c: C.dim, w: 1.4 });
    g.line(x0, y0, x0 + d * sc, gy, { c: C.accent, w: 2.4, dash: [7, 4] });
    g.dim(x0 - 16, y0, x0 - 16, gy, "", {});
    g.text("1 000 m", x0 - 10, (y0 + gy) / 2, { c: C.dim, size: 11, rot: Math.PI / 2, align: "center" });
    g.dim(x0, gy + 22, x0 + d * sc, gy + 22, fmt.n(d / 1000, 0) + " km", { c: C.ink });
    // planeador
    const c = g.ctx; c.save(); c.translate(x0 + 10, y0 - 4); c.rotate(Math.atan2(gy - y0, d * sc));
    const gg = new G(c);
    gg.path([[24, 0], [-26, -2], [-34, -12], [-36, -12], [-32, 2], [24, 3]], { fill: "#3a424c", c: C.metal, close: true, w: 1 });
    gg.line(-6, 0, 10, 0, { c: C.ink, w: 3 });
    c.restore();
    g.text("Por cada metro que desciende avanza " + s.ld + " m", 330, 30, { c: C.ink, size: 12, align: "center" });
  },
  info(s) { return `<span>Desde 1 000 m de altura recorre <b>${fmt.n(s.ld)} km</b> sin corrientes ascendentes.</span>`; },
  caption: "Vuelo planeado: pierde altura de forma continua y la finura define cuánto avanza. En el vuelo a vela aprovecha térmicas u orográficas que suben más rápido de lo que el planeador desciende.",
});

FIG.def("plantaAlar", {
  title: "Formas en planta del ala",
  h: 200,
  draw(g) {
    const items = [
      ["Rectangular", (x, y) => [[x - 52, y - 14], [x + 52, y - 14], [x + 52, y + 14], [x - 52, y + 14]]],
      ["Trapezoidal", (x, y) => [[x - 54, y - 4], [x - 8, y - 18], [x + 8, y - 18], [x + 54, y - 4], [x + 54, y + 6], [x - 54, y + 6]].map(([a, b], i) => [a, i < 4 ? b : b + 6])],
      ["Elíptica", null],
      ["Delta", (x, y) => [[x, y - 40], [x + 50, y + 26], [x - 50, y + 26]]],
      ["Mixta", (x, y) => [[x, y - 40], [x + 12, y - 4], [x + 54, y + 20], [x + 54, y + 26], [x - 54, y + 26], [x - 54, y + 20], [x - 12, y - 4]]],
    ];
    items.forEach(([n, fn], i) => {
      const x = 68 + i * 126, y = 92;
      g.rect(x - 7, y - 50, 14, 90, { fill: "#323a44", c: C.metal, r: 7, w: 1 });
      if (fn) g.path(fn(x, y), { fill: C.accent, fillAlpha: 0.75, c: C.accent2, close: true, w: 1 });
      else g.ellipse(x, y, 56, 16, 0, { fill: C.accent, fillAlpha: 0.75, c: C.accent2, w: 1 });
      g.text(n, x, 160, { bold: true, size: 12, align: "center" });
    });
    g.text("simple y barata", 68, 180, { c: C.dim, size: 10, align: "center" });
    g.text("más liviana", 194, 180, { c: C.dim, size: 10, align: "center" });
    g.text("mejor rendimiento", 320, 180, { c: C.dim, size: 10, align: "center" });
    g.text("alta velocidad", 446, 180, { c: C.dim, size: 10, align: "center" });
  },
  caption: "Rectangular: buen control y pérdida por la raíz. Trapezoidal: menos torbellinos de punta. Elíptica: la de mejor rendimiento aerodinámico pero cara. Delta: excelente a alta velocidad y mala a baja.",
});

FIG.def("simetria", {
  title: "Configuración polar (avión) vs. cartesiana o cruciforme (cohete/misil)",
  h: 250,
  draw(g) {
    drawPlaneFront(g, 170, 140, 250, "baja", 0, { engines: true });
    g.line(170, 30, 170, 230, { c: C.accent, w: 1.6, dash: [6, 4] });
    g.text("plano XZ", 178, 34, { c: C.accent, size: 11 });
    g.text("Polar: un solo plano de simetría", 170, 236, { bold: true, size: 12, align: "center" });
    const x = 480, y = 130, r = 22;
    [0, 1, 2, 3].forEach((k) => { const a = (k * Math.PI) / 2; g.path([[x + r * 0.5 * Math.cos(a - 0.3), y - r * 0.5 * Math.sin(a - 0.3)], [x + 80 * Math.cos(a), y - 80 * Math.sin(a)], [x + r * 0.5 * Math.cos(a + 0.3), y - r * 0.5 * Math.sin(a + 0.3)]], { fill: "#3a424c", c: C.metal, close: true, w: 1 }); });
    g.circle(x, y, r, { fill: "#323a44", c: C.metal, w: 1.4 });
    g.line(x, 30, x, 230 - 10, { c: C.accent, w: 1.6, dash: [6, 4] });
    g.line(x - 110, y, x + 110, y, { c: C.blue, w: 1.6, dash: [6, 4] });
    g.text("Cruciforme: dos planos", x, 236, { bold: true, size: 12, align: "center" });
    g.text("responde más rápido,\nsolo maniobras simétricas", x + 70, 70, { c: C.dim, size: 10.5 });
  },
  caption: "El avión permite maniobras simétricas y asimétricas. Configuraciones especiales: canard, sin fuselaje, empenaje en V y geometría variable.",
});

FIG.def("partesAvion", {
  title: "Partes componentes del avión",
  h: 380,
  draw(g) {
    const cx = 220, cy = 172, s = 300;
    PLANE.top(g, cx, cy, s, { alerones: 1, flaps: 1, elevador: 1, timon: 1 });
    const P = (x, y) => PLANE.P(cx, cy, s, x, y);
    const L = (lab, x, y, tx, ty, col, al) => { const [a, b] = P(x, y); g.callout(lab, a, b, tx, ty, { c: col || C.ink, size: 11.5, align: al }); };
    L("Fuselaje: aloja carga y une las partes", 0.02, -0.3, 300, 30);
    L("Ala (superficie sustentadora)", 0.3, 0.08, 470, 92);
    L("Sistema propulsor", 0.17, -0.06, 470, 64);
    L("Alerón", 0.42, 0.2, 470, 132, C.accent);
    L("Flap", 0.2, 0.18, 470, 170, C.blue);
    L("Estabilizador horizontal", 0.12, 0.4, 470, 214);
    L("Elevador", 0.14, 0.46, 470, 246, C.purple);
    L("Deriva y timón de dirección", 0.0, 0.48, 470, 286, C.yellow);
    g.text("Además: tren de aterrizaje, fuentes de energía interna (baterías, APU),\nsistemas auxiliares y equipos especiales (presurización, oxígeno…)", 20, 352, { c: C.dim, size: 10.5 });
  },
  caption: "Si los equipos especiales fallan no impiden el vuelo, pero lo limitan.",
});

FIG.def("ejes", {
  title: "Ejes del avión y movimientos de rolido, cabeceo y guiñada",
  h: 280, anim: true, still: 0.6,
  draw(g, s, t) {
    const a = Math.sin(t * 1.4);
    const panel = (x, title, sub, col) => {
      g.rect(x - 98, 14, 196, 252, { fill: "#181818", c: C.line, r: 10, w: 1 });
      g.text(title, x, 34, { c: col, bold: true, size: 13, align: "center" });
      g.text(sub, x, 236, { c: C.dim, size: 10.5, align: "center" });
    };
    panel(110, "Rolido · eje X", "alerones · palanca a los lados\nestabilidad lateral (diedro)", C.accent);
    drawPlaneFront(g, 110, 130, 170, "baja", a * 25, { gear: false });
    g.circle(110, 130, 4, { fill: C.accent });
    g.text("X (sale de la hoja)", 110, 196, { c: C.accent, size: 10.5, align: "center" });
    g.arcArrow(110, 130, 70, Math.PI * 0.35, Math.PI * 0.65, { c: C.accent, w: 1.6 });
    panel(320, "Cabeceo · eje Y", "elevador · palanca adelante/atrás\nestabilidad longitudinal", C.purple);
    drawPlaneSide(g, 320, 130, 170, a * 14);
    g.circle(320, 130, 4, { fill: C.purple });
    g.text("Y (envergadura)", 320, 196, { c: C.purple, size: 10.5, align: "center" });
    g.arcArrow(320, 130, 70, Math.PI * 0.15, Math.PI * 0.4, { c: C.purple, w: 1.6 });
    panel(530, "Guiñada · eje Z", "timón de dirección · pedales\nestabilidad direccional", C.yellow);
    const c = g.ctx; c.save(); c.translate(530, 128); c.rotate(a * 0.3); PLANE.top(new G(c), 0, 0, 120, { timon: 1 }); c.restore();
    g.circle(530, 128, 4, { fill: C.yellow });
    g.text("Z (vertical)", 530, 196, { c: C.yellow, size: 10.5, align: "center" });
    g.arcArrow(530, 128, 70, Math.PI * 0.6, Math.PI * 0.85, { c: C.yellow, w: 1.6 });
  },
  caption: "Sistema cartesiano ligado al avión con origen en el centro de gravedad: seis grados de libertad (tres traslaciones y tres rotaciones).",
});

/* ======================= TEMA 9 ======================= */
FIG.def("sandwich", {
  title: "Estructura sándwich con alma de panal de abeja",
  h: 290,
  draw(g) {
    const x0 = 60, x1 = 400, yT = 70, yB = 170, sk = 8;
    g.rect(x0, yT - sk, x1 - x0, sk, { fill: C.metal, c: null });
    g.rect(x0, yB, x1 - x0, sk, { fill: C.metal, c: null });
    const c = g.ctx; c.save(); c.beginPath(); c.rect(x0, yT, x1 - x0, yB - yT); c.clip();
    const hw = 22, hh = 19;
    for (let row = -1; row < 7; row++) for (let col = -1; col < 18; col++) {
      const x = x0 + col * hw * 1.5, y = yT + row * hh * 2 + (col % 2 ? hh : 0);
      const P = []; for (let k = 0; k < 6; k++) P.push([x + hw * Math.cos((k * Math.PI) / 3), y + hh * Math.sin((k * Math.PI) / 3)]);
      g.path(P, { c: C.accent2, w: 1.1, close: true, alpha: 0.8 });
    }
    c.restore();
    g.callout("piel (aluminio o compuesto)", x0 + 300, yT - 4, 420, 40, {});
    g.callout("alma de panal de abeja\n(baja densidad)", x0 + 260, (yT + yB) / 2, 420, 120, { c: C.accent2 });
    g.callout("piel", x0 + 300, yB + 4, 420, 196, {});
    g.arrow(x0 + 40, yT - 30, x0 + 90, yT - 30, { c: C.red, w: 2 }); g.arrow(x1 - 40, yT - 30, x1 - 90, yT - 30, { c: C.red, w: 2 });
    g.text("compresión", (x0 + x1) / 2, yT - 30, { c: C.red, size: 11.5, align: "center" });
    g.arrow(x0 + 90, yB + 30, x0 + 40, yB + 30, { c: C.blue, w: 2 }); g.arrow(x1 - 90, yB + 30, x1 - 40, yB + 30, { c: C.blue, w: 2 });
    g.text("tracción", (x0 + x1) / 2, yB + 30, { c: C.blue, size: 11.5, align: "center" });
    g.text("el alma toma el corte y evita que las pieles pandeen", (x0 + x1) / 2, 236, { c: C.accent2, size: 11, align: "center" });
    g.dim(x0 - 22, yT - sk, x0 - 22, yB + sk, "", {});
    g.text("h", x0 - 34, (yT + yB) / 2, { c: C.dim, italic: true });
    g.text("Separar las pieles del eje neutro (h) multiplica la rigidez a flexión casi sin agregar peso.", 320, 272, { c: C.dim, size: 11, align: "center" });
  },
  caption: "Usos: interiores, superficies de control, winglets, timones y capots.",
});

FIG.def("tps", {
  title: "Sistemas de protección térmica",
  h: 260,
  controls: [{ type: "seg", key: "k", options: [["abl", "Ablativo"], ["los", "Losetas cerámicas"], ["mli", "MLI"]], value: "abl" }],
  draw(g, s) {
    const x0 = 170, w = 340;
    if (s.k === "abl") {
      g.rect(x0, 70, w, 26, { fill: "#2b2b2b", c: null }); g.text("capa carbonizada (aislante, se erosiona)", x0 + w / 2, 83, { c: C.ink, size: 11, align: "center" });
      g.rect(x0, 96, w, 30, { fill: "#6b4c2a", c: null }); g.text("zona de pirólisis: la resina se descompone (endotérmica)", x0 + w / 2, 111, { c: C.ink, size: 11, align: "center" });
      g.rect(x0, 126, w, 40, { fill: "#8a6a3a", c: null }); g.text("material ablativo virgen", x0 + w / 2, 146, { c: C.ink, size: 11, align: "center" });
      g.rect(x0, 166, w, 24, { fill: C.metal, c: null }); g.text("estructura", x0 + w / 2, 178, { c: C.bg, size: 11, align: "center", bold: true });
      for (let i = 0; i < 6; i++) g.arrow(x0 + 30 + i * 48, 20, x0 + 30 + i * 48, 64, { c: C.red, w: 2 });
      g.text("> 1 500 °C", x0 - 10, 40, { c: C.red, bold: true, align: "right" });
      for (let i = 0; i < 4; i++) g.arrow(x0 + w + 6, 82 - i * 2, x0 + w + 50, 50 - i * 10, { c: C.dim, w: 1.2 });
      g.text("material de sacrificio:\nse lleva el calor", x0 + w + 20, 210, { c: C.dim, size: 11 });
    } else if (s.k === "los") {
      for (let i = 0; i < 6; i++) g.rect(x0 + i * 50 + 1, 70, 48, 50, { fill: "#d9d6cf", c: "#8d8d8a", r: 2 });
      g.rect(x0, 120, w, 24, { fill: "#5a5a56", c: null }); g.text("aislante", x0 + w / 2, 132, { c: C.ink, size: 11, align: "center" });
      g.rect(x0, 144, w, 26, { fill: C.metal, c: null }); g.text("estructura (fría)", x0 + w / 2, 157, { c: C.bg, size: 11, align: "center", bold: true });
      for (let i = 0; i < 6; i++) g.arrow(x0 + 25 + i * 50, 20, x0 + 25 + i * 50, 64, { c: C.red, w: 2 });
      for (let i = 0; i < 6; i++) g.arrow(x0 + 35 + i * 50, 66, x0 + 55 + i * 50, 26, { c: C.yellow, w: 1.4 });
      g.text("calentamiento", x0 - 10, 40, { c: C.red, align: "right" });
      g.text("la superficie muy caliente\nirradia el calor de vuelta", x0 + w + 12, 40, { c: C.yellow, size: 11 });
      g.text("Gran capacidad térmica y baja conductividad (transbordador espacial).\nFuturo: cerámicas UHTC (HfB₂, ZrB₂, SiC).", 320, 214, { c: C.dim, size: 11, align: "center" });
    } else {
      for (let i = 0; i < 8; i++) {
        const y = 62 + i * 12;
        g.line(x0, y, x0 + w, y, { c: i % 2 ? "#c9b26a" : "#d9d9d6", w: 2.4 });
      }
      for (let i = 0; i < 5; i++) g.arrow(x0 + 40 + i * 55, 16, x0 + 50 + i * 55, 56, { c: C.yellow, w: 1.8 });
      for (let i = 0; i < 5; i++) g.arrow(x0 + 56 + i * 55, 58, x0 + 70 + i * 55, 22, { c: C.yellow, w: 1.2, alpha: 0.6 });
      g.rect(x0, 160, w, 30, { fill: "#2c3440", c: C.metal }); g.text("electrónica del satélite", x0 + w / 2, 175, { c: C.ink, size: 11, align: "center" });
      g.text("radiación solar", x0 - 10, 30, { c: C.yellow, align: "right", size: 11 });
      g.text("capas de película plástica\nmetalizada + separadores\nde baja conductividad", x0 + w + 14, 100, { c: C.dim, size: 11 });
      g.text("En el vacío el calor viaja casi solo por radiación: las capas la reflejan.", 320, 222, { c: C.dim, size: 11, align: "center" });
    }
  },
  caption: "Todo se verifica con ensayos térmicos de vacío: ciclos térmicos en cámara entre las temperaturas típicas de una misión LEO, MEO o GEO.",
});

const DESIG = {
  "4130": [["4", "acero al cromo-molibdeno", C.accent], ["1", "~1 % de aleante", C.teal], ["30", "0,30 % de carbono", C.blue]],
  "2024-T3": [["2", "Al-Cu (duraluminio)", C.accent], ["024", "identifican la aleación", C.teal], ["T3", "solución + trabajo en frío", C.purple]],
  "7075-T6": [["7", "Al-Zn", C.accent], ["075", "identifican la aleación", C.teal], ["T6", "solución + envejecimiento artificial", C.purple]],
};
const desigSpec = (val) => ({
  title: "Lectura de las designaciones SAE y de aluminio",
  h: 230,
  controls: [{ type: "seg", key: "k", options: [["4130", "SAE 4130"], ["2024-T3", "Al 2024-T3"], ["7075-T6", "Al 7075-T6"]], value: val }],
  draw(g, s) {
    const parts = DESIG[s.k];
    const widths = parts.map(([t]) => g.measure(t, 44, true) + 18);
    const total = widths.reduce((a, b) => a + b, 0);
    let x = 320 - total / 2;
    parts.forEach(([t, lab, col], i) => {
      g.rect(x, 30, widths[i] - 8, 66, { fill: col, fillAlpha: 0.18, c: col, w: 1.5, r: 10 });
      g.text(t, x + (widths[i] - 8) / 2, 64, { c: col, size: 44, bold: true, align: "center" });
      const lx = 70 + i * 180;
      g.path([[x + (widths[i] - 8) / 2, 98], [x + (widths[i] - 8) / 2, 120], [lx + 80, 140], [lx + 80, 150]], { c: col, w: 1.2 });
      g.text(lab, lx + 80, 168, { c: C.ink, size: 11.5, align: "center" });
      x += widths[i];
    });
    const use = { "4130": "Fuselajes reticulados soldados y ferretería aeronáutica", "2024-T3": "Revestimientos y subestructuras (buena resistencia a la fatiga)", "7075-T6": "Piezas muy cargadas (de las más resistentes)" };
    g.text("Uso: " + use[s.k], 320, 210, { c: C.dim, size: 11.5, align: "center" });
  },
});
FIG.def("sae", Object.assign(desigSpec("4130"), { caption: "Acero SAE: 1.er dígito = aleante principal, 2.º = % aproximado de ese aleante, 3.º y 4.º = carbono en centésimas de %." }));
FIG.def("aluminio", Object.assign(desigSpec("2024-T3"), { caption: "Aluminio: el 1.er dígito indica el aleante principal; los demás solo identifican la aleación. Después va el tratamiento (temple)." }));

FIG.def("tratamientos", {
  title: "Tratamientos térmicos del acero (esquema temperatura–tiempo)",
  h: 270,
  controls: [{ type: "seg", key: "k", options: [["temple", "Temple"], ["revenido", "Temple + revenido"], ["recocido", "Recocido / normalizado"]], value: "temple" }],
  draw(g, s) {
    const P = g.plot([70, 40, 520, 180], [0, 10], [0, 1000], { xt: [], yt: [850], fy: () => "~850 °C", xl: "tiempo", yl: "T", grid: true });
    const heat = [[0, 20], [2, 850], [3.4, 850]];
    let pts, col, note;
    if (s.k === "temple") { pts = heat.concat([[3.6, 60], [10, 30]]); col = C.blue; note = "enfriamiento rápido (agua o aceite):\nmucha dureza, pero frágil (tensiones internas)"; }
    else if (s.k === "revenido") { pts = heat.concat([[3.6, 60], [5, 40], [6, 450], [7.6, 450], [9, 40], [10, 30]]); col = C.green; note = "segundo calentamiento moderado después del\ntemple: reduce la fragilidad, pierde algo de dureza"; }
    else { pts = heat.concat([[10, 120]]); col = C.accent; note = "enfriamiento lento: elimina tensiones y dureza\nexcesiva; deja el material apto para mecanizar"; }
    g.path(pts.map(([x, y]) => [P.X(x), P.Y(y)]), { c: col, w: 2.6 });
    g.text(note, P.X(4.2), P.Y(760), { c: col, size: 11.5 });
    g.text("calentar hasta T uniforme", P.X(1.2), P.Y(930), { c: C.dim, size: 10.5 });
  },
  caption: "Termoquímicos (cementación, nitruración, cianuración, sulfinización): modifican la superficie para dar dureza superficial y resistencia al desgaste con un núcleo tenaz. Temperaturas del revenido, ilustrativas.",
});

FIG.def("b787", {
  title: "Materiales en el Boeing 777 vs. 787 (% aproximado)",
  h: 220,
  draw(g) {
    const rows = [["B-777", [[12, "compuestos", C.accent], [50, "aluminio", C.metal], [38, "otros (acero, titanio…)", "#4a4f55"]]], ["B-787", [[50, "compuestos", C.accent], [20, "aluminio", C.metal], [30, "otros (acero, titanio…)", "#4a4f55"]]]];
    rows.forEach(([n, parts], i) => {
      const y = 50 + i * 74; let x = 100;
      g.text(n, 86, y + 16, { bold: true, align: "right" });
      parts.forEach(([v, lab, col]) => {
        const w = v * 5;
        g.rect(x, y, w, 32, { fill: col, c: C.bg, w: 2 });
        g.text(v + " %", x + w / 2, y + 16, { c: C.bg === col ? C.ink : "#111", size: 12, bold: true, align: "center" });
        if (i === 0 || lab !== "otros (acero, titanio…)") g.text(lab, x + w / 2, y + 46, { c: C.dim, size: 10.5, align: "center" });
        x += w;
      });
    });
    g.text("Compuestos: estructura de gran superficie (peso). Metales: cargas concentradas y zonas de impacto.", 320, 204, { c: C.dim, size: 11, align: "center" });
  },
  caption: "En el 787: fibra de carbono en láminas en el fuselaje y gran parte de las alas; en sándwich en winglets, elevadores, timón y capots; vidrio en carenados; aluminio en slats y bordes de ataque; Al, acero y Ti en soportes y uniones.",
});

/* ======================= TEMA 10 ======================= */
FIG.def("alaEstructura", {
  title: "Estructura del ala en planta: largueros, costillas y revestimiento",
  h: 330,
  draw(g) {
    const rootX = 60, tipX = 590, LEr = 74, TEr = 244, LEt = 134, TEt = 204;
    const le = (x) => LEr + ((x - rootX) / (tipX - rootX)) * (LEt - LEr), te = (x) => TEr + ((x - rootX) / (tipX - rootX)) * (TEt - TEr);
    g.path([[rootX, LEr], [tipX, LEt], [tipX, TEt], [rootX, TEr]], { fill: "#222830", c: C.metal, close: true, w: 1.5 });
    const sp = (f) => (x) => le(x) + f * (te(x) - le(x));
    const s1 = sp(0.22), s2 = sp(0.68);
    g.line(rootX, s1(rootX), tipX, s1(tipX), { c: C.accent, w: 5 });
    g.line(rootX, s2(rootX), tipX, s2(tipX), { c: C.accent, w: 4 });
    for (let x = rootX + 40; x < tipX; x += 44) g.line(x, le(x), x, te(x), { c: C.blue, w: x < 170 ? 3.2 : 1.6 });
    g.line(rootX + 10, s1(rootX + 10), rootX + 84, s2(rootX + 84), { c: C.teal, w: 2 });
    for (let x = rootX + 22; x < tipX; x += 44) g.line(x, le(x), x, s1(x), { c: C.purple, w: 1.1 });
    for (let f = 0.34; f < 0.66; f += 0.08) { const fn = sp(f); g.line(rootX, fn(rootX), tipX, fn(tipX), { c: C.faint, w: 1, dash: [3, 3] }); }
    g.rect(rootX - 30, 50, 30, 220, { fill: "#323a44", c: C.metal });
    g.text("fuselaje", rootX - 15, 284, { c: C.dim, size: 10.5, align: "center" });
    g.callout("falsa costilla", 286, le(286) + 6, 230, 30, { c: C.purple, align: "right" });
    g.callout("larguero delantero", 420, s1(420), 420, 30, { c: C.accent, align: "center" });
    g.callout("costilla de compresión (diagonal)", 108, s1(108) + 40, 60, 304, { c: C.teal });
    g.callout("costilla maestra", 148, te(148) - 10, 300, 304, { c: C.blue });
    g.callout("larguero trasero", 470, s2(470), 470, 280, { c: C.accent, align: "center" });
    g.callout("larguerillos", 560, sp(0.5)(560), 610, 250, { c: C.dim, align: "center" });
    g.text("borde de ataque ↑", 620, 92, { c: C.dim, size: 10.5, align: "right" });
  },
  caption: "Principales: largueros, costillas maestras, revestimiento y herrajes. Secundarios: falsas costillas, larguerillos y refuerzos.",
});

FIG.def("larguero", {
  title: "Corte del ala bilarguero: esfuerzos en vuelo normal",
  h: 280,
  draw(g) {
    const x0 = 40, y0 = 130, ch = 380;
    const { up, lo } = drawAirfoil(g, x0, y0, ch, 0, { t: 0.15, m: 0.03 });
    const yAt = (arr, x) => { for (let i = 1; i < arr.length; i++) if ((arr[i - 1][0] - x) * (arr[i][0] - x) <= 0) return arr[i][1]; return y0; };
    [0.22, 0.65].forEach((f) => {
      const x = x0 + f * ch, yu = yAt(up, x), yl = yAt(lo, x);
      g.rect(x - 14, yu, 28, 6, { fill: C.red, c: null });
      g.rect(x - 14, yl - 6, 28, 6, { fill: C.blue, c: null });
      g.rect(x - 2.5, yu + 6, 5, yl - yu - 12, { fill: C.yellow, c: null });
    });
    g.path(up.filter(([x]) => x > x0 + 0.22 * ch && x < x0 + 0.65 * ch).concat(lo.filter(([x]) => x > x0 + 0.22 * ch && x < x0 + 0.65 * ch).reverse()), { fill: C.accent, fillAlpha: 0.15, c: null, close: true });
    g.text("cajón", x0 + 0.44 * ch, y0 + 4, { c: C.accent2, size: 11, align: "center" });
    g.callout("platabanda superior: compresión", x0 + 0.22 * ch, yAt(up, x0 + 0.22 * ch), 120, 30, { c: C.red });
    g.callout("alma: corte", x0 + 0.65 * ch, y0 - 4, 440, 70, { c: C.yellow });
    g.callout("platabanda inferior: tracción", x0 + 0.22 * ch, yAt(lo, x0 + 0.22 * ch), 120, 230, { c: C.blue });
    g.callout("revestimiento activo", x0 + 0.8 * ch, yAt(up, x0 + 0.8 * ch), 440, 110, { c: C.ink });
    // viga
    const bx = 470;
    g.text("Semiala en voladizo", 552, 160, { bold: true, size: 12, align: "center" });
    g.rect(bx, 180, 10, 60, { fill: "#4a4f55", c: null });
    g.smooth([[bx + 10, 210], [bx + 60, 206], [bx + 110, 196], [bx + 150, 182]], { c: C.ink, w: 4 });
    for (let i = 0; i < 4; i++) g.arrow(bx + 30 + i * 34, 250, bx + 30 + i * 34, 220 - i * 5, { c: C.green, w: 1.6, head: 7 });
    g.text("L", bx + 160, 236, { c: C.green, bold: true });
    g.text("se flexiona hacia arriba", 552, 268, { c: C.dim, size: 10.5, align: "center" });
  },
  caption: "La sección del larguero es variable, más chica hacia la punta, porque el momento flector disminuye; el alma lleva agujeros de alivianamiento.",
});

FIG.def("alaSecciones", {
  title: "Clasificación estructural del ala: quién toma la flexión y quién la torsión",
  h: 230,
  controls: [{ type: "seg", key: "k", options: [["mono", "Monolarguero"], ["bi", "Bilarguero"], ["multi", "Multilarguero"], ["cajon", "Cajón puro"], ["semi", "Semimonocasco"], ["tanque", "Ala tanque"]], value: "bi" }],
  draw(g, s) {
    const x0 = 60, y0 = 110, ch = 520;
    const { up, lo } = drawAirfoil(g, x0, y0, ch, 0, { t: 0.15, m: 0.03, fill: "#20262e" });
    const yAt = (arr, x) => { for (let i = 1; i < arr.length; i++) if ((arr[i - 1][0] - x) * (arr[i][0] - x) <= 0) return arr[i][1]; return y0; };
    const between = (f1, f2, col, al = 0.3) => {
      const a = x0 + f1 * ch, b = x0 + f2 * ch;
      g.path(up.filter(([x]) => x >= a && x <= b).concat(lo.filter(([x]) => x >= a && x <= b).reverse()), { fill: col, fillAlpha: al, c: null, close: true });
    };
    const spar = (f, w = 4) => { const x = x0 + f * ch; g.line(x, yAt(up, x) + 1, x, yAt(lo, x) - 1, { c: C.accent, w }); };
    const k = s.k;
    if (k === "mono") { between(0, 0.3, C.purple); spar(0.3, 6); }
    if (k === "bi" || k === "tanque") { between(0.2, 0.62, k === "tanque" ? C.blue : C.purple, k === "tanque" ? 0.45 : 0.3); spar(0.2); spar(0.62); }
    if (k === "multi") { between(0.15, 0.7, C.purple, 0.2); [0.15, 0.3, 0.45, 0.6, 0.7].forEach((f) => spar(f, 3)); }
    if (k === "cajon") { [0.15, 0.3, 0.45, 0.6].forEach((f, i) => { if (i < 3) between(f, [0.3, 0.45, 0.6][i], i % 2 ? C.teal : C.purple, 0.35); spar(f, 3); }); }
    if (k === "semi") { between(0.18, 0.65, C.purple, 0.15); spar(0.18, 3); spar(0.65, 3); for (let f = 0.08; f < 0.9; f += 0.06) { const x = x0 + f * ch; g.circle(x, yAt(up, x) + 3, 2.4, { fill: C.green }); g.circle(x, yAt(lo, x) - 3, 2.4, { fill: C.green }); } }
    if (k === "tanque") { g.text("combustible", x0 + 0.41 * ch, y0 + 4, { c: C.ink, size: 12, align: "center", bold: true }); }
    const T = {
      mono: ["Flexión: el único larguero, en el punto de máximo espesor.", "Torsión: el borde de ataque, que forma un cajón con el revestimiento."],
      bi: ["Flexión: los dos largueros (el más común en alas cantiléver).", "Torsión: el cajón entre largueros y revestimiento (cajón interlarguero)."],
      multi: ["Flexión y corte repartidos entre varios largueros.", "Torsión: igual que el bilarguero. Se usa poco (menor rendimiento estructural)."],
      cajon: ["Flexión: largueros y revestimiento.", "Torsión: varias celdas cerradas, que la resisten mejor (celular)."],
      semi: ["Flexión: refuerzos longitudinales de raíz a punta (tracción/compresión).", "Torsión: el revestimiento."],
      tanque: ["Como el cajón, hermetizado como tanque; costillas perforadas = rompeolas.", "Ocupa ~⅓ de la envergadura, lejos del motor y del tren."],
    }[k];
    g.text(T[0], 320, 190, { c: C.accent2, size: 11.5, align: "center" });
    g.text(T[1], 320, 210, { c: C.purple, size: 11.5, align: "center" });
  },
  caption: "Zona sombreada: la celda cerrada que resiste la torsión. En naranja, los largueros.",
});

FIG.def("cargasAla", {
  title: "El ala como viga en voladizo: componentes normal y axial",
  h: 250,
  draw(g) {
    const x0 = 40, y0 = 150;
    g.rect(x0, y0 - 40, 14, 80, { fill: "#4a4f55", c: null });
    g.text("empotrada\nen el fuselaje", x0 + 7, y0 + 62, { c: C.dim, size: 10.5, align: "center" });
    g.rect(x0 + 14, y0 - 6, 320, 12, { fill: "#2c3440", c: C.metal, w: 1.2 });
    for (let i = 0; i <= 8; i++) { const x = x0 + 24 + i * 38, l = 70 * Math.sqrt(1 - (i / 8.6) ** 2); g.arrow(x, y0 - 8, x, y0 - 8 - l, { c: C.green, w: 1.6, head: 7 }); }
    g.text("sustentación (hacia arriba)", x0 + 170, 50, { c: C.green, size: 11.5, align: "center" });
    g.arrow(x0 + 120, y0 + 8, x0 + 120, y0 + 60, { c: C.red, w: 2.4 }); g.text("motor", x0 + 128, y0 + 56, { c: C.red, size: 11 });
    [180, 230, 280].forEach((x) => g.arrow(x0 + x, y0 + 8, x0 + x, y0 + 34, { c: C.blue, w: 1.6, head: 7 }));
    g.text("combustible y peso propio", x0 + 230, y0 + 48, { c: C.blue, size: 11, align: "center" });
    // descomposición
    const cx = 500, cy = 150;
    drawAirfoil(g, cx - 70, cy, 140, 6, { t: 0.12 });
    const a = (6 * Math.PI) / 180, ox = cx - 20, oy = cy - 4;
    const N = [92 * Math.sin(a), -92 * Math.cos(a)], Ax = [34 * Math.cos(a), 34 * Math.sin(a)];
    g.arrow(ox, oy, ox + N[0], oy + N[1], { c: C.teal, w: 1.8, dash: [5, 3] });
    g.text("normal", ox + N[0] - 8, oy + N[1] + 6, { c: C.teal, size: 11, align: "right" });
    g.arrow(ox, oy, ox + Ax[0], oy + Ax[1], { c: C.purple, w: 1.8, dash: [5, 3] });
    g.text("axial", ox + Ax[0] + 6, oy + Ax[1] + 12, { c: C.purple, size: 11 });
    g.arrow(ox, oy, ox + N[0] + Ax[0], oy + N[1] + Ax[1], { c: C.accent, w: 2.6 });
    g.text("fuerza aerodinámica", ox + N[0] + Ax[0] + 6, oy + N[1] + Ax[1] - 6, { c: C.accent, size: 11 });
    g.text("(normal y axial a la estructura)", cx + 20, cy + 40, { c: C.dim, size: 10.5, align: "center" });
    g.text("Cargas: debidas al aire (ráfagas) · maniobras · terrestres · otras", 320, 236, { c: C.dim, size: 11, align: "center" });
  },
  caption: "Las ráfagas dependen de la carga alar W/S, la velocidad, la ráfaga y la forma del ala. Se calcula la carga máxima de cada caso con coeficiente de seguridad; si el ala resulta muy pesada, se fijan límites operativos (peso máximo y g máxima).",
});

FIG.def("flutter", {
  title: "Flutter: acople de flexión y torsión",
  h: 270, anim: true, still: 2.5,
  controls: [{ type: "range", key: "v", label: "V / V_crítica", min: 0.6, max: 1.25, step: 0.01, value: 0.85, fmt: (v) => fmt.n(v, 2) }],
  draw(g, s, t) {
    const cyc = 6, tau = t % cyc, sig = (s.v - 1) * 2.6;
    const env = (tt) => Math.min(3, Math.exp(sig * tt));
    const A = env(tau), w = 6;
    const h = 26 * A * Math.sin(w * tau), th = 9 * A * Math.sin(w * tau + 1.2);
    const cx = 170, cy = 140;
    g.line(40, cy, 300, cy, { c: C.faint, w: 1, dash: [3, 4] });
    for (let i = 0; i < 3; i++) g.arrow(30, cy - 60 + i * 60, 60, cy - 60 + i * 60, { c: C.dim, w: 1, head: 6 });
    g.text("V", 30, cy - 76, { c: C.dim, size: 11 });
    drawAirfoil(g, cx - 90, cy - h, 180, th, { t: 0.12, m: 0.02, fill: A > 2.5 ? "#4a2a2e" : "#2c3440", c: A > 2.5 ? C.red : C.metal });
    g.circle(cx - 20, cy - h, 3, { fill: C.accent });
    g.text("eje elástico", cx - 20, cy + 70, { c: C.accent, size: 10.5, align: "center" });
    g.text("flexión (sube/baja) + torsión (gira)", cx, 250, { c: C.dim, size: 11, align: "center" });
    const P = g.plot([370, 40, 240, 180], [0, cyc], [-3.2, 3.2], { xt: [], yt: [], xl: "tiempo", yl: "amplitud" });
    const pts = []; for (let k = 0; k <= tau * 40; k++) { const tt = k / 40; pts.push([P.X(tt), P.Y(env(tt) * Math.sin(w * tt))]); }
    g.path(pts, { c: s.v > 1 ? C.red : C.green, w: 1.6 });
    g.line(P.X(0), P.Y(0), P.X(cyc), P.Y(0), { c: C.faint, w: 1 });
  },
  info(s) { return s.v > 1 ? `<span><b>Por encima de la velocidad crítica:</b> la oscilación se amplifica (divergente) y puede romper el ala en segundos.</span>` : `<span><b>Por debajo de la velocidad crítica:</b> la perturbación se amortigua.</span>`; },
  caption: "Se evita con rigidez torsional (el cajón), buena distribución de masas (motores y tanques adelante del eje elástico, contrapesos en las superficies de comando) y ensayos para que V crítica quede por encima de la velocidad máxima.",
});

FIG.def("parametrosAla", {
  title: "Parámetros característicos del ala",
  h: 260,
  controls: [
    { type: "range", key: "b", label: "Envergadura b", min: 8, max: 40, step: 0.5, value: 20, fmt: (v) => fmt.n(v, 1) + " m" },
    { type: "range", key: "cr", label: "Cuerda de raíz C_r", min: 1, max: 6, step: 0.1, value: 3, fmt: (v) => fmt.n(v, 1) + " m" },
    { type: "range", key: "lam", label: "Estrechamiento λ", min: 0.2, max: 1, step: 0.05, value: 0.5, fmt: (v) => fmt.n(v, 2) },
  ],
  calc(s) { const cp = s.cr * s.lam, S = (s.b * (s.cr + cp)) / 2; return { cp, S, c: S / s.b, A: (s.b * s.b) / S }; },
  draw(g, s) {
    const k = this.calc(s), sc = Math.min(540 / s.b, 140 / s.cr), cx = 320, y0 = 40;
    const hb = (s.b / 2) * sc, cr = s.cr * sc, cp = k.cp * sc;
    const leSweep = (cr - cp) * 0.25; // cuerda al 25 % recta
    const pts = [[cx - hb, y0 + leSweep], [cx, y0], [cx + hb, y0 + leSweep], [cx + hb, y0 + leSweep + cp], [cx, y0 + cr], [cx - hb, y0 + leSweep + cp]];
    g.path(pts, { fill: C.accent, fillAlpha: 0.25, c: C.accent2, close: true, w: 1.5 });
    g.rect(cx - 10, y0 - 10, 20, cr + 20, { fill: "#323a44", c: null, fillAlpha: 0.6 });
    g.dim(cx - hb, y0 + cr + 30, cx + hb, y0 + cr + 30, "b = " + fmt.n(s.b, 1) + " m", { c: C.ink });
    g.dim(cx + 24, y0, cx + 24, y0 + cr, "C_r", { c: C.teal, dx: 18 });
    g.dim(cx + hb + 12, y0 + leSweep, cx + hb + 12, y0 + leSweep + cp, "", { c: C.teal });
    g.text("C_p", cx + hb + 4, y0 + leSweep + cp + 16, { c: C.teal, size: 12, align: "right" });
    g.text("superficie alar S: incluye la parte cubierta por el fuselaje y las góndolas", cx, y0 + cr + 62, { c: C.dim, size: 10.5, align: "center" });
  },
  info(s) {
    const k = this.calc(s);
    return `<span>C_p = <b>${fmt.n(k.cp, 2)} m</b></span><span>S = <b>${fmt.n(k.S, 1)} m²</b></span><span>c = S/b = <b>${fmt.n(k.c, 2)} m</b></span><span>A = b²/S = <b>${fmt.n(k.A, 1)}</b> ${k.A >= 15 ? "(alto, tipo planeador: menos resistencia inducida)" : k.A <= 5 ? "(bajo, tipo avión veloz: más rígido y liviano)" : ""}</span>`;
  },
  caption: "Alargamiento alto (planeadores, 20 a 30) reduce la resistencia inducida; bajo (aviones veloces, 3 a 4) da más rigidez y menos peso estructural.",
});

FIG.def("ubicacionAla", {
  title: "Ubicación del ala (vista de frente)",
  h: 210,
  draw(g) {
    [["parasol", "Parasol"], ["alta", "Alta"], ["media", "Media"], ["baja", "Baja"]].forEach(([k, n], i) => {
      const x = 82 + i * 158;
      drawPlaneFront(g, x, 92, 140, k, 0, { engines: k !== "parasol" });
      g.text(n, x, 162, { bold: true, align: "center" });
    });
    g.text("estabilidad lateral\nnatural · carga, STOL", 240, 186, { c: C.dim, size: 10, align: "center" });
    g.text("menor interferencia\n· combate", 398, 186, { c: C.dim, size: 10, align: "center" });
    g.text("tren corto\n· más diedro", 556, 186, { c: C.dim, size: 10, align: "center" });
  },
  caption: "El parasol va sobre el fuselaje, unido con montantes. Las razones de cada ubicación son un complemento que no está desarrollado en el apunte.",
});

FIG.def("sigmaEps", {
  title: "Diagrama esfuerzo–deformación (ensayo de tracción)",
  h: 330,
  controls: [{ type: "toggle", key: "fr", label: "Comparar con material frágil", value: false }],
  draw(g, s) {
    const P = g.plot([70, 40, 520, 230], [0, 11], [0, 430], { xt: [], yt: [], xl: "deformación ε", yl: "esfuerzo σ" });
    const zones = [[0, 1.3, "elástica", C.green], [1.3, 3, "fluencia", C.yellow], [3, 8, "endurecimiento", C.accent], [8, 10.5, "estricción", C.red]];
    zones.forEach(([a, b, n, col]) => { g.rect(P.X(a), P.Y(430), P.X(b) - P.X(a), P.Y(0) - P.Y(430), { fill: col, fillAlpha: 0.06, c: null }); g.text(n, (P.X(a) + P.X(b)) / 2, P.Y(415), { c: col, size: 10.5, align: "center" }); });
    const curve = [[0, 0], [1, 250], [1.15, 268], [1.3, 280], [1.6, 272], [2, 282], [2.4, 274], [3, 285], [4, 330], [5.5, 375], [7, 396], [8, 400], [9, 385], [10, 360], [10.5, 340]];
    g.smooth(curve.map(([x, y]) => [P.X(x), P.Y(y)]), { c: C.ink, w: 2.4 });
    const pts = [[1, 250, "Límite de proporcionalidad", 12, 6], [1.15, 268, "Límite de elasticidad", -12, -6], [1.3, 280, "Punto de fluencia", 4, -16], [8, 400, "Esfuerzo máximo (último)", 0, -16], [10.5, 340, "Esfuerzo de rotura", 0, -16]];
    pts.forEach(([x, y, l, dx, dy], i) => {
      g.circle(P.X(x), P.Y(y), 4.5, { fill: C.accent2 });
      g.text(String(i + 1), P.X(x) + dx, P.Y(y) + dy, { size: 11.5, bold: true, c: C.accent2, align: "center" });
      g.text(`${i + 1}. ${l}`, 380, 180 + i * 18, { size: 11 });
    });
    g.text("σ = E·ε (Hooke)", P.X(0.5) + 12, P.Y(120), { c: C.green, size: 11.5, bold: true });
    if (s.fr) { g.path([[P.X(0), P.Y(0)], [P.X(1.6), P.Y(380)]], { c: C.red, w: 2.2, dash: [6, 3] }); g.text("frágil: rompe casi sin deformarse", P.X(1.7), P.Y(380), { c: C.red, size: 11 }); }
  },
  caption: "E (módulo de Young) es la pendiente del tramo recto: cuanto mayor, más rígido. Los dúctiles se deforman mucho antes de romper; los frágiles casi nada.",
});

FIG.def("factorSeg", {
  title: "Del peso máximo a la carga de diseño",
  h: 230,
  controls: [
    { type: "range", key: "n", label: "Factor de carga n", min: 2, max: 9, step: 0.1, value: 3.8, fmt: (v) => fmt.n(v, 1) },
    { type: "range", key: "fs", label: "Factor de seguridad FS", min: 1.5, max: 3, step: 0.05, value: 1.5, fmt: (v) => fmt.n(v, 2) },
  ],
  draw(g, s) {
    const max = 9 * 3, sc = 360 / max, x0 = 210;
    const rows = [["Peso máximo W", 1, C.metal], ["Carga límite = n·W", s.n, C.accent], ["Carga de diseño = FS·n·W", s.n * s.fs, C.red]];
    rows.forEach(([n, v, col], i) => {
      const y = 40 + i * 54;
      g.text(n, x0 - 10, y + 13, { size: 11.5, align: "right" });
      g.rect(x0, y, Math.max(3, v * sc), 26, { fill: col, fillAlpha: 0.85, c: null, r: 4 });
      g.text(fmt.n(v, 2) + " W", x0 + v * sc + 8, y + 13, { c: col, bold: true, size: 12 });
    });
    g.text("n: cargas reales de maniobra o ráfaga  ·  FS: margen por incertidumbre (≥ 1,5)", 320, 214, { c: C.dim, size: 11, align: "center" });
  },
  info(s) { return `<span>FS = σ_fluencia / σ_diseño</span><span>Con estos valores la estructura se dimensiona para <b>${fmt.n(s.n * s.fs, 2)}</b> veces el peso máximo.</span>`; },
  caption: "En aeronáutica se toma como límite la tensión de fluencia (no debe haber deformación permanente). Si una falla puede costar vidas, se exige un FS mayor.",
});

FIG.def("flector", {
  title: "Momento flector en la semiala, combustible y MZFW",
  h: 340,
  controls: [
    { type: "range", key: "fuel", label: "Combustible en el ala", min: 0, max: 100, step: 1, value: 60, fmt: (v) => v + " %" },
    { type: "range", key: "zfw", label: "Peso sin combustible", min: 80, max: 120, step: 1, value: 100, fmt: (v) => v + " % MZFW" },
  ],
  calc(s) {
    const N = 60, ZFW = s.zfw / 100, F = 0.6 * (s.fuel / 100), Ww = 0.12;
    const L = ZFW + F; // sustentación total de la semiala (unidades del MZFW)
    const lift = (x) => (4 / Math.PI) * Math.sqrt(Math.max(0, 1 - x * x)); // integra 1 en [0,1]
    const fuel = (x) => (x >= 0.15 && x <= 0.8 ? 1 / 0.65 : 0);
    const q = (x) => L * lift(x) - F * fuel(x) - Ww;
    const M = [];
    for (let i = 0; i <= N; i++) {
      const x = i / N; let m = 0;
      for (let j = i; j < N; j++) { const xs = (j + 0.5) / N; m += (xs - x) * q(xs) / N; }
      M.push([x, m]);
    }
    const Mref = (() => { let m = 0; for (let j = 0; j < N; j++) { const xs = (j + 0.5) / N; m += xs * (1 * lift(xs) - Ww) / N; } return m; })();
    return { M, Mroot: M[0][1], Mref, lift, F, L };
  },
  draw(g, s) {
    const k = this.calc(s);
    const x0 = 80, x1 = 600, X = (x) => x0 + x * (x1 - x0), by = 110;
    g.rect(x0 - 16, by - 36, 16, 72, { fill: "#4a4f55", c: null });
    g.text("raíz", x0 - 8, by + 48, { c: C.dim, size: 10.5, align: "center" });
    g.rect(x0, by - 6, x1 - x0, 12, { fill: "#2c3440", c: C.metal, w: 1 });
    for (let i = 0; i <= 12; i++) { const x = i / 12.4; g.arrow(X(x), by - 8, X(x), by - 8 - 24 * k.L * k.lift(x) / 1.27, { c: C.green, w: 1.4, head: 6 }); }
    g.text("sustentación", X(0.02), 30, { c: C.green, size: 11 });
    if (k.F > 0) {
      g.rect(X(0.15), by - 5, X(0.8) - X(0.15), 10, { fill: C.blue, fillAlpha: 0.7, c: null });
      for (let x = 0.2; x < 0.8; x += 0.1) g.arrow(X(x), by + 8, X(x), by + 8 + 30 * (k.F / 0.6), { c: C.blue, w: 1.4, head: 6 });
      g.text("combustible (alivia)", X(0.47), by + 50, { c: C.blue, size: 11, align: "center" });
    }
    const P = g.plot([x0, 190, x1 - x0, 120], [0, 1], [0, 0.6], { xt: [], yt: [], xl: "envergadura →", yl: "M flector", xlDy: 20, grid: false });
    const pts = k.M.map(([x, m]) => [P.X(x), P.Y(Math.max(0, m))]);
    g.fillBetween(pts, k.M.map(([x]) => [P.X(x), P.Y(0)]), k.Mroot > k.Mref * 1.001 ? C.red : C.accent, 0.3);
    g.path(pts, { c: k.Mroot > k.Mref * 1.001 ? C.red : C.accent, w: 2.2 });
    g.line(P.X(0), P.Y(k.Mref), P.X(0.4), P.Y(k.Mref), { c: C.ink, w: 1.4, dash: [6, 4] });
    g.text("M de cálculo (MZFW sin combustible)", P.X(0.41), P.Y(k.Mref), { c: C.ink, size: 10.5 });
  },
  info(s) {
    const k = this.calc(s), r = k.Mroot / k.Mref;
    return `<span>Flector en la raíz: <b>${fmt.n(r * 100)} %</b> del de cálculo</span><span>${r > 1.001 ? "<b>Supera el de cálculo:</b> riesgo de rotura (peso sin combustible > MZFW)" : s.fuel === 0 ? "Caso crítico: sin combustible que alivie" : "El combustible en el ala reduce el flector en la raíz"}</span>`;
  },
  caption: "El momento flector es máximo en la raíz. El caso crítico es el avión con poco combustible: la sustentación sostiene un fuselaje cargado y no hay combustible que alivie. Por eso el peso sin combustible nunca debe superar el MZFW.",
});

/* ======================= TEMA 11 ======================= */
FIG.def("flujoFab", {
  title: "Diagrama de flujo del proceso de fabricación",
  h: 330,
  draw(g) {
    const B = [
      ["Requerimiento", 90, 40], ["Estudios\npreliminares", 250, 40], ["Anteproyecto", 410, 40], ["Proyecto", 560, 40],
      ["Primer prototipo", 560, 160], ["Ensayos en vuelo", 400, 160], ["Homologación", 240, 160], ["Serie", 90, 160],
      ["Servicio", 90, 270],
    ];
    const sub = { 2: "legajo de cálculo", 3: "túnel · planos · Mockup", 4: "estáticos y dinámicos", 5: "manual de vuelo", 6: "Autoridad Aeronáutica" };
    const w = 130, h = 44;
    for (let i = 0; i < B.length - 1; i++) {
      const [, x1, y1] = B[i], [, x2, y2] = B[i + 1];
      if (y1 === y2) g.arrow(x1 + (x2 > x1 ? w / 2 : -w / 2), y1, x2 - (x2 > x1 ? w / 2 : -w / 2), y2, { c: C.dim, w: 1.4 });
      else g.arrow(x1, y1 + h / 2, x2, y2 - h / 2, { c: C.dim, w: 1.4 });
    }
    B.forEach(([t, x, y], i) => {
      g.rect(x - w / 2, y - h / 2, w, h, { fill: i === 8 ? "#2a2017" : C.grid, c: i === 8 ? C.accent : C.line, r: 9, w: 1.3 });
      g.text(t, x, y, { size: 11.5, bold: true, align: "center" });
      if (sub[i]) g.text(sub[i], x, y + h / 2 + 12, { c: C.dim, size: 10, align: "center" });
    });
    g.path([[90 + w / 2, 270], [634, 270], [634, 40]], { c: C.accent, w: 1.6, dash: [6, 4] });
    g.arrow(634, 40, 560 + w / 2 + 1, 40, { c: C.accent, w: 1.6, head: 7 });
    g.text("novedades y estadística de fallas → modificaciones", 340, 288, { c: C.accent, size: 11, align: "center" });
  },
  caption: "El proceso es iterativo: calcular, ensayar, corregir y repetir hasta llegar a la serie. La experiencia en servicio vuelve al proyecto.",
});

FIG.def("tiemposFab", {
  title: "Distribución del tiempo del proceso",
  h: 270,
  draw(g) {
    const d = [["Preparación del trabajo y producción", 41.7, C.accent], ["Cálculo estructural y planos", 35.1, C.accent], ["Estudio aerodinámico", 9.6, C.blue], ["Ensayos estáticos y dinámicos", 4.7, C.blue], ["Discusión del proyecto", 3.8, C.blue], ["Montaje", 3.7, C.blue], ["Inspección", 1.4, C.blue]];
    const x0 = 250, sc = 7.6;
    d.forEach(([n, v, col], i) => {
      const y = 22 + i * 32;
      g.text(n, x0 - 10, y + 11, { size: 11.5, align: "right" });
      g.rect(x0, y, v * sc, 22, { fill: col, fillAlpha: i < 2 ? 0.9 : 0.55, c: null, r: 4 });
      g.text(fmt.n(v, 1) + " %", x0 + v * sc + 8, y + 11, { size: 11.5, bold: true, c: i < 2 ? C.accent2 : C.dim });
    });
    g.text("Las dos primeras ≈ ¾ del tiempo total", x0 + 200, 248, { c: C.accent2, size: 11.5, bold: true, align: "center" });
  },
  caption: "Producción: miles de piezas, herrajes y matrices con tolerancias aeronáuticas. Cálculo y planos: cada pieza se justifica estructuralmente y se documenta, porque eso es lo que se certifica.",
});

/* ======================= TEMA 12 ======================= */
FIG.def("fuselajeSecciones", {
  title: "Secciones del fuselaje de un avión de transporte",
  h: 250,
  draw(g) {
    const y = 110, H = 44, x0 = 40, x1 = 600;
    const top = (x) => (x < 110 ? y - H * Math.sqrt(Math.max(0, (x - x0) / 70)) * 0.95 : x > 470 ? y - H + ((x - 470) / 130) * H * 0.6 : y - H);
    const bot = (x) => (x < 110 ? y + H * Math.sqrt(Math.max(0, (x - x0) / 70)) * 0.95 : x > 470 ? y + H - ((x - 470) / 130) * H * 1.3 : y + H);
    const seg = (a, b, col, al) => {
      const T = [], Bt = []; for (let x = a; x <= b; x += 2) { T.push([x, top(x)]); Bt.push([x, bot(x)]); }
      g.path(T.concat(Bt.reverse()), { fill: col, fillAlpha: al, c: null, close: true });
    };
    seg(x0, 75, C.purple, 0.6); seg(75, 125, C.teal, 0.6); seg(125, 470, C.accent, 0.35); seg(470, x1, C.metal, 0.5);
    g.rect(125, y + 8, 345, H - 10, { fill: C.blue, fillAlpha: 0.35, c: null });
    g.line(125, y + 8, 470, y + 8, { c: C.ink, w: 1.4 });
    for (let x = 140; x < 460; x += 16) g.rect(x, y - 24, 7, 10, { fill: "#cfd8e3", fillAlpha: 0.7, c: null, r: 2 });
    const T = [], Bt = []; for (let x = x0; x <= x1; x += 2) { T.push([x, top(x)]); Bt.push([x, bot(x)]); }
    g.path(T.concat(Bt.reverse()), { c: C.metal, w: 1.4, close: true });
    g.path([[520, y - H + 18], [560, y - 110], [590, y - 110], [585, y - H * 0.5]], { fill: "#3a424c", c: C.metal, close: true, w: 1 });
    g.callout("compartimiento delantero\n(radar meteorológico)", 55, y, 30, 205, { c: C.purple });
    g.callout("cabina de tripulantes", 100, y - 20, 30, 28, { c: C.teal });
    g.callout("cabina de pasajeros (~1,7 m³ por pasajero)", 300, y - 10, 250, 28, { c: C.accent2 });
    g.callout("compartimiento de carga (bajo el piso)", 300, y + 26, 220, 205, { c: C.blue });
    g.callout("empenaje y cono de cola", 540, y + 4, 630, 232, { c: C.dim, align: "right" });
  },
  caption: "Funciones: transportar la carga útil, unir ala, empenaje y comandos, proteger del clima y dar una forma aerodinámica de baja resistencia.",
});

FIG.def("leyAreas", {
  title: "Ley de las áreas (vuelo supersónico)",
  h: 320,
  controls: [{ type: "toggle", key: "on", label: "Aplicar ley de las áreas (cintura de avispa)", value: false }],
  draw(g, s) {
    const x0 = 60, x1 = 580, cy = 90;
    const fusW = (u) => { const base = 22 * Math.sin(Math.PI * Math.min(1, u * 1.15)) ** 0.6; const waist = s.on ? 9 * Math.exp(-(((u - 0.55) / 0.1) ** 2)) + 6 * Math.exp(-(((u - 0.88) / 0.05) ** 2)) : 0; return Math.max(2, base - waist); };
    const T = [], B = []; for (let i = 0; i <= 100; i++) { const u = i / 100, x = x0 + u * (x1 - x0); T.push([x, cy - fusW(u)]); B.push([x, cy + fusW(u)]); }
    g.path([[x0 + 0.42 * 520, cy - 16], [x0 + 0.68 * 520, cy - 74], [x0 + 0.74 * 520, cy - 74], [x0 + 0.7 * 520, cy - 16]], { fill: C.accent, fillAlpha: 0.5, c: C.accent2, close: true, w: 1 });
    g.path([[x0 + 0.42 * 520, cy + 16], [x0 + 0.68 * 520, cy + 74], [x0 + 0.74 * 520, cy + 74], [x0 + 0.7 * 520, cy + 16]], { fill: C.accent, fillAlpha: 0.5, c: C.accent2, close: true, w: 1 });
    g.path(T.concat(B.reverse()), { fill: "#323a44", c: C.metal, close: true, w: 1.3 });
    const P = g.plot([x0, 190, x1 - x0, 100], [0, 1], [0, 1.6], { xt: [], yt: [], xl: "posición a lo largo del eje", yl: "área de la sección transversal", xlDy: 20, grid: false });
    const area = (u) => { const f = fusW(u) / 22; let a = f * f; a += 0.42 * Math.exp(-(((u - 0.56) / 0.09) ** 2)); a += 0.12 * Math.exp(-(((u - 0.9) / 0.04) ** 2)); return a; };
    const pts = []; for (let i = 0; i <= 120; i++) { const u = i / 120; pts.push([P.X(u), P.Y(area(u))]); }
    g.path(pts, { c: s.on ? C.green : C.red, w: 2.4 });
    const ideal = []; for (let i = 0; i <= 120; i++) { const u = i / 120; ideal.push([P.X(u), P.Y(1.02 * Math.exp(-(((u - 0.52) / 0.24) ** 2)))]); }
    g.path(ideal, { c: C.faint, w: 1.2, dash: [5, 4] });
    g.text(s.on ? "curva suave, tipo campana de Gauss" : "salto brusco donde se suman las alas", P.X(0.98), P.Y(1.45), { c: s.on ? C.green : C.red, size: 11.5, align: "right", bold: true });
  },
  caption: "Graficando el área de cada sección transversal del avión completo (fuselaje, alas y cola), la curva tiene que ser suave. Por eso el fuselaje se estrecha donde se unen las alas y la cola.",
});

FIG.def("seccionesCd", {
  title: "Forma de la sección transversal y coeficiente de resistencia",
  h: 210,
  draw(g) {
    const d = [["Elíptica", "0,07–0,09", 0.08, (x, y) => g.ellipse(x, y, 34, 24, 0, { fill: "#323a44", c: C.green, w: 1.6 })], ["Circular", "0,10–0,13", 0.115, (x, y) => g.circle(x, y, 28, { fill: "#323a44", c: C.accent2, w: 1.6 })], ["Rectangular", "0,15–0,20", 0.175, (x, y) => g.rect(x - 30, y - 26, 60, 52, { fill: "#323a44", c: C.red, w: 1.6, r: 8 })]];
    d.forEach(([n, r, v, draw], i) => {
      const x = 110 + i * 210;
      draw(x, 64);
      g.text(n, x, 112, { bold: true, align: "center" });
      g.rect(x - 60, 132, 120, 12, { fill: C.grid, c: null, r: 6 });
      g.rect(x - 60, 132, 120 * (v / 0.2), 12, { fill: [C.green, C.accent2, C.red][i], c: null, r: 6 });
      g.text("C_D " + r, x, 164, { c: C.dim, size: 11.5, align: "center" });
    });
    g.text("Con presurización la sección circular o elíptica es obligatoria; si es rectangular, las esquinas se redondean.", 320, 196, { c: C.dim, size: 10.5, align: "center" });
  },
  caption: "Sección longitudinal: en subsónico, forma currentilínea; en supersónico, ley de las áreas. Los carenados reducen la resistencia de interferencia.",
});

FIG.def("reticulado", {
  title: "Fuselajes reticulados: Pratt y Warren (carga en la cola hacia abajo)",
  h: 300,
  controls: [{ type: "seg", key: "k", options: [["pratt", "Pratt"], ["warren", "Warren"]], value: "pratt" }],
  draw(g, s) {
    const x0 = 60, n = 7, dx = 70, yT = 70, yB = 170;
    const T = C.blue, Cc = C.red;
    g.rect(x0 - 24, yT - 30, 24, yB - yT + 60, { fill: "#4a4f55", c: null });
    g.text("unión al ala", x0 - 12, yB + 44, { c: C.dim, size: 10.5, align: "center" });
    g.line(x0, yT, x0 + n * dx, yT, { c: T, w: 4 });
    g.line(x0, yB, x0 + n * dx, yB, { c: Cc, w: 4 });
    for (let i = 0; i < n; i++) {
      const a = x0 + i * dx, b = a + dx;
      if (s.k === "pratt") { g.line(b, yT, b, yB, { c: Cc, w: 3 }); g.line(a, yT, b, yB, { c: T, w: 2.2 }); }
      else { if (i % 2 === 0) g.line(a, yT, b, yB, { c: T, w: 3 }); else g.line(a, yB, b, yT, { c: Cc, w: 3 }); }
    }
    if (s.k === "pratt") g.line(x0, yT, x0, yB, { c: Cc, w: 3 });
    for (let i = 0; i <= n; i++) { g.circle(x0 + i * dx, yT, 3.4, { fill: C.ink }); g.circle(x0 + i * dx, yB, 3.4, { fill: C.ink }); }
    g.arrow(x0 + n * dx, yB + 4, x0 + n * dx, yB + 60, { c: C.yellow, w: 3 });
    g.text("P (cola)", x0 + n * dx + 8, yB + 50, { c: C.yellow, bold: true });
    g.rect(80, 262, 26, 5, { fill: T, c: null }); g.text("tracción", 114, 265, { c: T, size: 11.5 });
    g.rect(200, 262, 26, 5, { fill: Cc, c: null }); g.text("compresión", 234, 265, { c: Cc, size: 11.5 });
    g.text(s.k === "pratt" ? "Pratt: verticales + diagonales; las diagonales son tensores (solo tracción)." : "Warren: solo diagonales (tubos) a tracción o compresión; se invierte si se invierte la carga.", 320, 30, { size: 11.5, align: "center" });
    g.text("4 largueros principales · recubrimiento de tela (no resistente) · tubos de acero SAE 4130 soldados", 320, 290, { c: C.dim, size: 10.5, align: "center" });
  },
  caption: "Simple y fácil de reparar, pero pesado y no aprovecha el recubrimiento. La Warren es más rígida.",
});

FIG.def("semimonocasco", {
  title: "Sección transversal de un fuselaje semimonocasco",
  h: 340,
  draw(g) {
    const cx = 200, cy = 170, R = 130;
    g.circle(cx, cy, R + 8, { fill: "#2c3440", c: null });
    g.circle(cx, cy, R, { fill: C.bg, c: null });
    g.circle(cx, cy, R + 8, { c: C.metal, w: 2.4 });
    g.circle(cx, cy, R - 8, { c: C.accent, w: 6, alpha: 0.6 });
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * Math.PI * 2;
      if ([0, 7, 14, 21].includes(k)) continue;
      const x = cx + (R - 1) * Math.cos(a), y = cy - (R - 1) * Math.sin(a);
      const c = g.ctx; c.save(); c.translate(x, y); c.rotate(-a + Math.PI / 2);
      c.fillStyle = C.green; c.fillRect(-3, 0, 6, 3); c.fillRect(-1, 0, 2, 9); c.fillRect(-1, 7, 5, 2); c.restore();
    }
    [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].forEach((a) => {
      const x = cx + (R - 4) * Math.cos(a), y = cy - (R - 4) * Math.sin(a);
      const c = g.ctx; c.save(); c.translate(x, y); c.rotate(-a + Math.PI / 2);
      c.fillStyle = C.red; c.fillRect(-9, 0, 18, 5); c.fillRect(-2.5, 0, 5, 18); c.fillRect(-9, 15, 18, 5); c.restore();
    });
    g.line(cx - R * 0.94, cy + 36, cx + R * 0.94, cy + 36, { c: C.ink, w: 4 });
    g.line(cx, cy + 36, cx, cy + R - 10, { c: C.faint, w: 2 });
    g.text("pasajeros", cx, cy - 10, { c: C.dim, size: 11, align: "center" });
    g.text("carga", cx - 50, cy + 80, { c: C.dim, size: 11, align: "center" });
    g.callout("recubrimiento: torsión, corte y tracción", cx + R * 0.95, cy - R * 0.32, 360, 40, { c: C.metal });
    g.callout("cuaderna: forma, corte, cargas concentradas", cx + (R - 8) * 0.2, cy - (R - 8) * 0.98, 360, 78, { c: C.accent });
    g.callout("larguerillo: rigidiza, evita el pandeo", cx + (R - 6) * Math.cos(0.45), cy - (R - 6) * Math.sin(0.45), 360, 120, { c: C.green });
    g.callout("larguero: flexión general (4 principales)", cx + (R - 12) * Math.cos(Math.PI / 4), cy - (R - 12) * Math.sin(Math.PI / 4), 360, 160, { c: C.red });
    g.callout("piso", cx + R * 0.6, cy + 36, 360, 206, { c: C.ink });
    g.text("Mamparo: cuaderna fuerte que limita la\nzona presurizada y dispersa cargas.", 360, 262, { c: C.dim, size: 11 });
  },
  caption: "El semimonocasco es el estándar actual: el recubrimiento trabaja junto con los refuerzos. Es el mejor compromiso entre peso, rigidez y reparabilidad, y admite aberturas grandes.",
});

FIG.def("tanquePresion", {
  title: "Fuselaje presurizado como tanque a presión",
  h: 230,
  draw(g) {
    const y0 = 60, y1 = 170, xs = [80, 200, 320, 440, 560];
    xs.forEach((x) => g.rect(x - 4, y0 - 6, 8, y1 - y0 + 12, { fill: C.accent, c: null }));
    for (let i = 0; i < xs.length - 1; i++) {
      const a = xs[i], b = xs[i + 1];
      g.smooth([[a, y0], [(a + b) / 2, y0 - 16], [b, y0]], { c: C.metal, w: 2.4 });
      g.smooth([[a, y1], [(a + b) / 2, y1 + 16], [b, y1]], { c: C.metal, w: 2.4 });
      g.line(a, y0, b, y0, { c: C.faint, w: 1, dash: [3, 3] });
      for (let k = 0; k < 3; k++) { const x = a + 26 + k * 34; g.arrow(x, y0 + 40, x, y0 + 6, { c: C.blue, w: 1.4, head: 6 }); g.arrow(x, y1 - 40, x, y1 - 6, { c: C.blue, w: 1.4, head: 6 }); }
    }
    g.text("Δp interior", 320, (y0 + y1) / 2, { c: C.blue, bold: true, align: "center", bg: C.bg });
    g.text("cuadernas: fuerzas tangenciales concentradas", 320, 206, { c: C.accent2, size: 11, align: "center" });
    g.text("el recubrimiento se “infla” entre cuadernas", 320, 26, { c: C.dim, size: 11, align: "center" });
  },
  caption: "Δp es chico pero actúa sobre un área enorme: las fuerzas son muy grandes. Las cubiertas flotantes dejan que el recubrimiento se expanda uniformemente.",
});

FIG.def("presionForma", {
  title: "Influencia de la presurización en la forma de la sección",
  h: 250,
  draw(g) {
    const cx = 160, cy = 120, R = 74;
    g.circle(cx, cy, R, { fill: "#232a33", c: C.green, w: 3 });
    for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; g.arrow(cx + 30 * Math.cos(a), cy - 30 * Math.sin(a), cx + (R - 6) * Math.cos(a), cy - (R - 6) * Math.sin(a), { c: C.blue, w: 1.3, head: 6 }); }
    g.arcArrow(cx, cy, R + 14, 0.3, 1.2, { c: C.green, w: 1.8 });
    g.text("tracción uniforme,\nsin flexión", cx, cy + R + 32, { c: C.green, size: 11.5, align: "center" });
    const x = 470, y = 120, h = 66;
    g.smooth([[x - h, y - h], [x, y - h - 18], [x + h, y - h]], { c: C.red, w: 3 });
    g.smooth([[x + h, y - h], [x + h + 18, y], [x + h, y + h]], { c: C.red, w: 3 });
    g.smooth([[x + h, y + h], [x, y + h + 18], [x - h, y + h]], { c: C.red, w: 3 });
    g.smooth([[x - h, y + h], [x - h - 18, y], [x - h, y - h]], { c: C.red, w: 3 });
    g.rect(x - h, y - h, 2 * h, 2 * h, { c: C.faint, w: 1, dash: [3, 3] });
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => g.circle(x + a * h, y + b * h, 7, { fill: C.red, fillAlpha: 0.5, c: C.red }));
    for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 2; g.arrow(x + 16 * Math.cos(a), y - 16 * Math.sin(a), x + (h - 8) * Math.cos(a), y - (h - 8) * Math.sin(a), { c: C.blue, w: 1.3, head: 6 }); }
    g.text("las paredes planas se flexionan;\nlas esquinas concentran tensiones", x, y + h + 40, { c: C.red, size: 11.5, align: "center" });
  },
  caption: "Con presurización la sección circular o elíptica es obligatoria. Además tiene menos resistencia (C_D ≈ 0,07–0,13 contra 0,15–0,20 de la rectangular).",
});

/* ======================= TEMA 13 ======================= */
FIG.def("colaConv", {
  title: "Grupo de cola convencional",
  h: 290,
  draw(g) {
    // vista lateral: deriva + timón
    const x = 70, y = 230;
    g.text("Vista lateral", 170, 22, { c: C.dim, size: 11, align: "center" });
    g.path([[x, y], [x + 80, y - 170], [x + 150, y - 170], [x + 140, y], ], { fill: "#2c3440", c: C.metal, close: true, w: 1.3 });
    g.path([[x + 140, y], [x + 150, y - 170], [x + 200, y - 170], [x + 210, y]], { fill: C.yellow, fillAlpha: 0.45, c: C.yellow, close: true, w: 1.3 });
    g.line(x + 140, y + 6, x + 152, y - 178, { c: C.ink, w: 1, dash: [3, 3] });
    g.text("deriva", x + 84, y - 80, { size: 11.5, align: "center", bold: true });
    g.text("perfil biconvexo\nsimétrico", x + 84, y - 54, { c: C.dim, size: 10, align: "center" });
    g.text("timón de\ndirección", x + 176, y - 90, { c: C.yellow, size: 11.5, align: "center", bold: true });
    g.text("±30°", x + 176, y - 54, { c: C.yellow, size: 11, align: "center" });
    g.text("0,25 a 0,5 de la superficie del plano vertical", 170, y + 22, { c: C.dim, size: 10.5, align: "center" });
    // vista en planta: estabilizador + elevador
    const cx = 470, cy = 140;
    g.text("Vista en planta", cx, 22, { c: C.dim, size: 11, align: "center" });
    [-1, 1].forEach((sd) => {
      g.path([[cx + sd * 10, cy - 40], [cx + sd * 140, cy + 10], [cx + sd * 140, cy + 34], [cx + sd * 10, cy + 30]], { fill: "#2c3440", c: C.metal, close: true, w: 1.3 });
      g.path([[cx + sd * 10, cy + 30], [cx + sd * 140, cy + 34], [cx + sd * 140, cy + 56], [cx + sd * 10, cy + 66]], { fill: C.purple, fillAlpha: 0.5, c: C.purple, close: true, w: 1.3 });
    });
    g.rect(cx - 10, cy - 80, 20, 170, { fill: "#323a44", c: C.metal, r: 6, w: 1 });
    g.text("estabilizador horizontal", cx + 80, cy - 34, { size: 11.5, bold: true, align: "center" });
    g.text("elevador", cx + 90, cy + 84, { c: C.purple, size: 11.5, bold: true, align: "center" });
    g.text("hasta 25° arriba (excep. 40°) · 20° abajo", cx, 266, { c: C.dim, size: 10.5, align: "center" });
  },
  caption: "La deriva da estabilidad direccional y el estabilizador, longitudinal. Buffeting: se previene con equilibrado estático (contrapesos) y un estabilizador rígido.",
});

FIG.def("colaConfigs", {
  title: "Configuraciones no convencionales",
  h: 290,
  controls: [{ type: "seg", key: "k", options: [["delta", "Ala delta sin cola"], ["v", "Cola en V"], ["canard", "Canard"]], value: "canard" }],
  draw(g, s) {
    if (s.k === "delta") {
      const cx = 230, cy = 140;
      g.path([[cx, cy - 110], [cx + 150, cy + 90], [cx - 150, cy + 90]], { fill: "#2c3440", c: C.metal, close: true, w: 1.3 });
      [-1, 1].forEach((sd) => g.path([[cx + sd * 20, cy + 90], [cx + sd * 140, cy + 90], [cx + sd * 132, cy + 72], [cx + sd * 24, cy + 72]], { fill: C.accent, fillAlpha: 0.8, c: null, close: true }));
      g.rect(cx - 12, cy - 110, 24, 210, { fill: "#323a44", c: C.metal, r: 10, w: 1 });
      g.text("elevones", cx + 160, cy + 80, { c: C.accent, bold: true });
      g.text("Rolar: elevones en sentidos opuestos (como alerones)", 420, 90, { size: 11.5 });
      g.text("Cabecear: los dos juntos, arriba o abajo", 420, 120, { size: 11.5 });
    } else if (s.k === "v") {
      const cx = 200, cy = 170;
      g.circle(cx, cy, 26, { fill: "#323a44", c: C.metal, w: 1.3 });
      [-1, 1].forEach((sd) => {
        g.path([[cx + sd * 10, cy - 18], [cx + sd * 130, cy - 110], [cx + sd * 120, cy - 120], [cx + sd * 4, cy - 26]], { fill: "#2c3440", c: C.metal, close: true, w: 1.3 });
        g.path([[cx + sd * 70, cy - 64], [cx + sd * 130, cy - 110], [cx + sd * 136, cy - 102], [cx + sd * 76, cy - 56]], { fill: C.purple, fillAlpha: 0.8, c: null, close: true });
      });
      g.text("vista desde atrás", cx, 270, { c: C.dim, size: 10.5, align: "center" });
      g.text("4 planos en vez de 6 (2 fijos + 2 móviles)", 360, 60, { size: 11.5 });
      g.text("Cabecear: móviles juntos · Guiñar: opuestos", 360, 88, { size: 11.5 });
      g.text("+ menos resistencia, peso y altura;\n  planos fuera de la estela del ala", 360, 134, { c: C.green, size: 11.5 });
      g.text("− mucha más torsión sobre el fuselaje", 360, 182, { c: C.red, size: 11.5 });
    } else {
      const y = 120, X = 70;
      g.text("Convencional", 20, 30, { bold: true });
      drawPlaneSide(g, 170 + X, y - 40, 240, 0);
      g.arrow(186 + X, y - 40, 186 + X, y - 100, { c: C.green, w: 2.6 }); g.text("ala", 194 + X, y - 96, { c: C.green, size: 11 });
      g.arrow(64 + X, y - 46, 64 + X, y - 6, { c: C.red, w: 2.6 }); g.text("cola empuja\nhacia abajo (resta)", 74 + X, y - 2, { c: C.red, size: 10.5 });
      g.circle(170 + X, y - 40, 4, { fill: C.yellow }); g.text("CG", 170 + X, y - 26, { c: C.yellow, size: 10, align: "center" });
      const y2 = 240;
      g.text("Canard", 20, 150, { bold: true });
      drawPlaneSide(g, 170 + X, y2 - 30, 240, 0, { noTail: true });
      g.path([[262 + X, y2 - 32], [246 + X, y2 - 40], [236 + X, y2 - 40], [248 + X, y2 - 30]], { fill: C.accent, c: null, close: true });
      g.arrow(150 + X, y2 - 30, 150 + X, y2 - 84, { c: C.green, w: 2.6 }); g.text("ala", 158 + X, y2 - 80, { c: C.green, size: 11 });
      g.arrow(250 + X, y2 - 34, 250 + X, y2 - 74, { c: C.green, w: 2.6 }); g.text("canard empuja\nhacia arriba (suma)", 200 + X, y2 + 14, { c: C.green, size: 10.5 });
      g.circle(190 + X, y2 - 30, 4, { fill: C.yellow });
      g.text("El canard tiene más ángulo de\nataque: entra en pérdida primero,\nel morro baja solo y el ala\nprincipal no llega a la pérdida.", 440, 120, { c: C.ink, size: 11.5 });
      g.text("Ejemplos: Gripen,\nEurofighter Typhoon", 440, 210, { c: C.dim, size: 11 });
    }
  },
  caption: "Ala delta: elevones. Cola en V: superficies combinadas. Canard: plano de control adelante del ala que suma sustentación y no queda en la estela del ala.",
});
