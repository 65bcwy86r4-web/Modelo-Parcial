// Figuras de los temas 1 a 5: bases de lanzamiento, cohete, mecánica orbital,
// vehículos espaciales y Sistema Solar.

// Cohete genérico: (x, y) = centro, L = largo, ang = grados desde la vertical (horario +)
function drawRocket(g, x, y, L, ang = 0, o = {}) {
  const c = g.ctx, w = L * 0.17;
  c.save(); c.translate(x, y); c.rotate((ang * Math.PI) / 180);
  if (o.flame) {
    const fl = L * (0.28 + 0.06 * Math.sin((o.t || 0) * 30));
    const gr = c.createLinearGradient(0, L / 2, 0, L / 2 + fl);
    gr.addColorStop(0, "#ffe9a8"); gr.addColorStop(0.5, "#f0a040"); gr.addColorStop(1, "rgba(240,90,40,0)");
    c.fillStyle = gr; c.beginPath();
    c.moveTo(-w * 0.38, L / 2); c.quadraticCurveTo(0, L / 2 + fl * 1.2, w * 0.38, L / 2); c.fill();
  }
  c.fillStyle = "#d9d9d6"; c.strokeStyle = "#8d8d8a"; c.lineWidth = 1.2;
  c.beginPath();
  c.moveTo(0, -L / 2);
  c.quadraticCurveTo(w * 0.55, -L / 2 + L * 0.12, w / 2, -L / 2 + L * 0.24);
  c.lineTo(w / 2, L / 2); c.lineTo(-w / 2, L / 2); c.lineTo(-w / 2, -L / 2 + L * 0.24);
  c.quadraticCurveTo(-w * 0.55, -L / 2 + L * 0.12, 0, -L / 2);
  c.fill(); c.stroke();
  c.fillStyle = C.accent;
  [-1, 1].forEach((s) => {
    c.beginPath(); c.moveTo(s * w / 2, L / 2 - L * 0.2); c.lineTo(s * w * 1.15, L / 2 + L * 0.02); c.lineTo(s * w / 2, L / 2); c.fill();
  });
  if (o.stages) { c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-w / 2, 0); c.lineTo(w / 2, 0); c.stroke(); }
  c.restore();
}

/* ======================= TEMA 1 ======================= */
FIG.def("latitud", {
  title: "Velocidad “gratuita” por la rotación terrestre según la latitud",
  h: 300,
  controls: [{ type: "range", key: "lat", label: "Latitud φ", min: 0, max: 90, step: 1, value: 28, fmt: (v) => v + "°" }],
  draw(g, s) {
    const cx = 150, cy = 158, R = 105, phi = (s.lat * Math.PI) / 180;
    g.earth(cx, cy, R, { land: false });
    g.line(cx, cy - R - 22, cx, cy + R + 22, { c: C.dim, w: 1.2, dash: [4, 4] });
    g.text("eje", cx + 6, cy - R - 16, { c: C.dim, size: 11 });
    g.ellipse(cx, cy, R, R * 0.18, 0, { c: "rgba(255,255,255,0.35)", w: 1 });
    g.text("ecuador", cx - R + 4, cy + 18, { c: C.ink, size: 11 });
    const py = cy - R * Math.sin(phi), rr = R * Math.cos(phi);
    g.ellipse(cx, py, rr, rr * 0.18, 0, { c: C.accent2, w: 1.6 });
    g.line(cx, cy, cx + rr, py, { c: C.ink, w: 1.2 });
    g.line(cx, cy, cx + R, cy, { c: C.dim, w: 1 });
    g.arcArrow(cx, cy, 30, 0, phi, { c: C.accent2, w: 1.3, head: 6 });
    g.text("φ", cx + 38 * Math.cos(phi / 2) + 2, cy - 38 * Math.sin(phi / 2), { c: C.accent2, size: 13, bold: true });
    g.circle(cx + rr, py, 4, { fill: C.accent2 });
    const v = 465 * Math.cos(phi);
    g.arrow(cx + rr, py, cx + rr + 8 + v * 0.12, py + rr * 0.18 * 0.25 + 4, { c: C.accent, w: 2.2 });
    g.text("Este", cx + rr + 14 + v * 0.12, py + 14, { c: C.accent, size: 11 });
    g.arcArrow(cx, cy - R - 6, 22, 3.6, 5.8, { c: C.dim, w: 1.2 });
    // gráfico v(φ)
    const P = g.plot([360, 46, 240, 190], [0, 90], [0, 500], { xt: [0, 30, 60, 90], yt: [0, 100, 200, 300, 400, 500], fx: (v) => v + "°", xl: "φ", yl: "v [m/s]" });
    const pts = []; for (let a = 0; a <= 90; a += 2) pts.push([P.X(a), P.Y(465 * Math.cos((a * Math.PI) / 180))]);
    g.path(pts, { c: C.blue, w: 2 });
    [["Kourou", 5.2], ["Kennedy", 28.5], ["C. E. Manuel Belgrano", 38.9], ["Baikonur", 45.9]].forEach(([n, a], i) => {
      const x = P.X(a), y = P.Y(465 * Math.cos((a * Math.PI) / 180));
      g.circle(x, y, 3, { fill: C.ink });
      g.text(n, i === 3 ? x - 6 : x + 5, i === 3 ? y + 12 : y - 10, { c: C.dim, size: 10.5, align: i === 3 ? "right" : "left" });
    });
    g.circle(P.X(s.lat), P.Y(v), 6, { fill: C.accent });
  },
  info(s) {
    const v = 465 * Math.cos((s.lat * Math.PI) / 180);
    return `<span>v = ω·R·cos φ = <b>${fmt.n(v)} m/s</b> (${fmt.n(v * 3.6)} km/h)</span><span>${s.lat === 90 ? "En el polo no hay ayuda de la rotación." : s.lat === 0 ? "Máximo en el ecuador." : `Pierde el ${fmt.n(100 - (v / 465) * 100)} % respecto del ecuador.`}</span>`;
  },
  caption: "Lanzando hacia el Este el cohete suma la velocidad de la superficie terrestre, máxima en el ecuador (~465 m/s) y nula en los polos. Por eso conviene una latitud baja.",
});

FIG.def("plataforma", {
  title: "Plataforma de lanzamiento y sistema de agua",
  h: 310, anim: true, still: 0.8,
  draw(g, s, t) {
    const gy = 250;
    g.rect(0, gy, 640, 60, { fill: "#1d1d1b", c: null });
    // base de hormigón con fosa de llamas
    g.path([[190, gy], [230, 200], [410, 200], [450, gy]], { fill: "#3b3b38", c: "#5a5a56", close: true });
    g.path([[290, 200], [300, gy], [340, gy], [350, 200]], { fill: "#151515", c: "#5a5a56" });
    g.text("base fija de hormigón", 455, 238, { c: C.dim, size: 11.5 });
    g.text("fosa de llamas", 320, gy + 18, { c: C.dim, size: 11, align: "center" });
    // torre de servicio retirándose
    const off = FIG.reduced ? 40 : (Math.sin(t * 0.6) * 0.5 + 0.5) * 60;
    const tx = 120 - off;
    for (let y = 70; y < 200; y += 22) {
      g.line(tx, y, tx + 34, y + 22, { c: C.metal, w: 1 }); g.line(tx + 34, y, tx, y + 22, { c: C.metal, w: 1 });
    }
    g.rect(tx, 70, 34, 130, { c: C.metal, w: 1.6 });
    g.rect(tx + 34, 92, 270 - tx - 34 - 10 + off * 0, 4, { fill: C.metal, c: null, fillAlpha: 0.6 });
    g.rect(tx + 8, 74, 16, 24, { c: C.accent2, w: 1.2 });
    g.text("ascensor", tx - 6, 86, { c: C.accent2, size: 10.5, align: "right" });
    g.line(40, 200, 200, 200, { c: C.dim, w: 2 });
    [60, 90, 120, 150, 180].forEach((x) => g.line(x, 197, x, 203, { c: C.dim, w: 2 }));
    g.arrow(tx + 10, 214, tx - 40, 214, { c: C.accent, w: 1.6 });
    g.text("la torre se retira sobre vías", 40, 232, { c: C.accent, size: 11 });
    // cohete
    drawRocket(g, 320, 120, 160, 0, {});
    // agua
    for (let i = 0; i < 9; i++) {
      const ph = (t * 1.4 + i * 0.37) % 1;
      [[-1, 250], [1, 390]].forEach(([d, x0]) => {
        const x = x0 + d * -ph * 50, y = 180 + ph * 26 + ph * ph * 10;
        g.circle(x - d * 0, y, 1.8, { fill: C.blue, fillAlpha: 1 - ph * 0.5 });
      });
    }
    g.rect(238, 172, 18, 8, { fill: C.blue, c: null });
    g.rect(384, 172, 18, 8, { fill: C.blue, c: null });
    g.text("rociadores de agua", 470, 168, { c: C.blue, size: 11.5 });
    g.line(404, 176, 466, 168, { c: C.blue, w: 1, alpha: 0.6 });
    // vapor
    for (let i = 0; i < 6; i++) {
      const ph = (t * 0.25 + i / 6) % 1;
      g.circle(330 + (i % 2 ? 1 : -1) * (40 + ph * 140), gy + 4 - ph * 40, 14 + ph * 28, { fill: "#cfd6dc", fillAlpha: 0.12 * (1 - ph), c: null });
    }
    g.text("vapor (la “humareda”)", 560, 292, { c: C.dim, size: 11, align: "right" });
    g.callout("refrigera y amortigua\nvibraciones y ruido", 320, 205, 470, 200, { c: C.ink, size: 11 });
  },
  caption: "Antes del despegue la torre con ascensores se aleja del cohete. El agua refrigera la plataforma y absorbe la energía acústica de los motores; casi todo lo que se ve en el despegue es su vapor.",
});

FIG.def("vanallen", {
  title: "Entorno espacial: radiación, cinturones de Van Allen y contraste térmico",
  h: 320,
  draw(g) {
    const cx = 390, cy = 160, R = 26;
    // viento solar
    g.sun(18, cy, 34);
    g.text("Sol", 18, cy + 52, { c: C.yellow, size: 12, align: "center" });
    for (let i = -4; i <= 4; i++) g.arrow(70, cy + i * 30, 150, cy + i * 30 * 0.95, { c: C.yellow, w: 1.2, alpha: 0.6 });
    g.text("viento solar", 72, 22, { c: C.yellow, size: 11.5 });
    // magnetopausa
    const mp = []; for (let a = -1.25; a <= 1.25; a += 0.05) mp.push([cx - 125 * Math.cos(a) + 0 * Math.abs(a) * 40 + Math.abs(a) ** 2 * 70, cy + 150 * Math.sin(a)]);
    g.smooth(mp, { c: C.purple, w: 1.4, dash: [5, 4] });
    g.text("magnetosfera: desvía\nel viento solar", cx - 132, 28, { c: C.purple, size: 11, align: "center" });
    // cinturones
    const belt = (L1, L2, lam) => {
      const P = [];
      for (let l = -lam; l <= lam; l += 0.04) { const r = L2 * Math.cos(l) ** 2; P.push([r * Math.cos(l), r * Math.sin(l)]); }
      for (let l = lam; l >= -lam; l -= 0.04) { const r = L1 * Math.cos(l) ** 2; P.push([r * Math.cos(l), r * Math.sin(l)]); }
      return P;
    };
    [-1, 1].forEach((sd) => {
      g.path(belt(R * 1.4, R * 2.1, 0.75).map(([x, y]) => [cx + sd * x, cy + y]), { fill: C.red, fillAlpha: 0.35, c: null, close: true });
      g.path(belt(R * 3.3, R * 5.4, 0.8).map(([x, y]) => [cx + sd * x, cy + y]), { fill: C.accent, fillAlpha: 0.28, c: null, close: true });
      [1.6, 2.6, 4, 6.2].forEach((L) => {
        const P = []; for (let l = -1.4; l <= 1.4; l += 0.04) { const r = L * R * Math.cos(l) ** 2; P.push([cx + sd * r * Math.cos(l), cy + r * Math.sin(l)]); }
        g.path(P, { c: C.purple, w: 0.8, alpha: 0.4 });
      });
    });
    g.earth(cx, cy, R);
    // día y noche
    g.ctx.save(); g.ctx.beginPath(); g.ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2); g.ctx.fillStyle = "rgba(0,0,0,0.5)"; g.ctx.fill(); g.ctx.restore();
    g.callout("cinturón interior", cx + R * 1.75, cy - 10, 510, 110, { c: C.red });
    g.callout("cinturón exterior", cx + R * 4.3, cy + 40, 510, 236, { c: C.accent2 });
    g.text("partículas atrapadas por\nel campo magnético", 514, 268, { c: C.dim, size: 10.5 });
    g.arrow(560, 40, 500, 72, { c: C.ink, w: 1.2 });
    g.text("radiación cósmica", 630, 30, { c: C.ink, size: 11, align: "right" });
    g.text("lado al sol:\nmuy caliente", 250, 286, { c: C.yellow, size: 11, align: "center" });
    g.text("lado a la sombra:\nmuy frío", 470, 300, { c: C.blue, size: 11, align: "center" });
  },
  caption: "En el vacío el calor solo se intercambia por radiación: el lado iluminado se calienta y el de sombra se enfría. La radiación (viento solar, Van Allen, rayos cósmicos) degrada la electrónica y exige blindaje.",
});

/* ======================= TEMA 2 ======================= */
FIG.def("fuerzasCohete", {
  title: "Fuerzas sobre el cohete en vuelo propulsado",
  h: 330,
  controls: [{ type: "range", key: "th", label: "Ángulo θ desde la vertical", min: 0, max: 80, step: 1, value: 30, fmt: (v) => v + "°" }],
  draw(g, s) {
    const x = 250, y = 170, th = (s.th * Math.PI) / 180;
    const ux = Math.sin(th), uy = -Math.cos(th); // dirección de vuelo
    g.line(x, y + 120, x, y - 140, { c: C.faint, w: 1, dash: [4, 4] });
    g.text("vertical", x + 4, y - 140, { c: C.dim, size: 10.5 });
    g.line(x - ux * 120, y - uy * 120, x + ux * 150, y + uy * 150, { c: C.faint, w: 1, dash: [2, 5] });
    drawRocket(g, x, y, 130, s.th, { flame: true, t: 0.3 });
    if (s.th > 2) { g.arcArrow(x, y, 80, Math.PI / 2, Math.PI / 2 - th, { c: C.accent2, w: 1.2, head: 6 }); g.text("θ", x + 86 * Math.sin(th / 2) + 6, y - 86 * Math.cos(th / 2), { c: C.accent2, bold: true }); }
    g.arrow(x + ux * 66, y + uy * 66, x + ux * 150, y + uy * 150, { c: C.accent, w: 3 });
    g.text("T  empuje", x + ux * 156 + 8, y + uy * 156, { c: C.accent, bold: true });
    g.arrow(x - ux * 66, y - uy * 66, x - ux * 120, y - uy * 120, { c: C.red, w: 2.6 });
    g.text("D = q·S·C_D", x - ux * 128 - 6, y - uy * 128 + 14, { c: C.red, align: "right", bold: true });
    const mg = 100;
    g.arrow(x, y, x, y + mg, { c: C.blue, w: 2.6 });
    g.text("m·g", x + 8, y + mg + 4, { c: C.blue, bold: true });
    const comp = mg * Math.cos(th);
    g.arrow(x, y, x - ux * comp, y - uy * comp, { c: C.blue, w: 1.6, dash: [5, 4] });
    g.line(x - ux * comp, y - uy * comp, x, y + mg, { c: C.blue, w: 0.8, dash: [2, 3], alpha: 0.6 });
    g.text("m·g·cos θ", x - ux * comp - 8, y - uy * comp + 4, { c: C.blue, size: 12, align: "right" });
    // ecuación
    g.rect(420, 40, 200, 120, { fill: C.grid, c: C.line, r: 10 });
    g.text("2.ª ley sobre la trayectoria", 520, 60, { c: C.dim, size: 11, align: "center" });
    g.text("T − D − m·g·cos θ = m·dV/dt", 520, 88, { size: 12.5, align: "center", bold: true });
    g.text("3.ª ley:  T = −ṁ·Vₑ", 520, 118, { size: 12.5, align: "center" });
    g.text("(ṁ < 0: la masa disminuye)", 520, 140, { c: C.dim, size: 10.5, align: "center" });
    g.text("Peso que frena al cohete:", 420, 200, { c: C.dim, size: 11.5 });
    g.rect(420, 212, 200, 14, { fill: C.grid, c: null, r: 7 });
    g.rect(420, 212, 200 * Math.cos(th), 14, { fill: C.blue, c: null, r: 7 });
    g.text(fmt.n(Math.cos(th) * 100) + " % de m·g", 520, 244, { c: C.blue, size: 12, align: "center", bold: true });
    g.text("Vertical (θ = 0): pérdida por\ngravedad máxima.", 420, 280, { c: C.dim, size: 11 });
  },
  caption: "El empuje sale de la 3.ª ley (reacción a la cantidad de movimiento de los gases); la 2.ª ley suma empuje, resistencia y la componente del peso sobre la dirección de vuelo.",
});

FIG.def("perdidas", {
  title: "Del ΔV ideal al ΔV real: pérdidas por gravedad y arrastre",
  h: 300,
  draw(g) {
    // izquierda: trayectoria
    const gx = 40, gy = 260;
    g.line(gx - 20, gy, 280, gy, { c: C.dim, w: 1.4 });
    g.text("1. sube vertical: atraviesa\nrápido el aire denso", gx + 8, 60, { c: C.ink, size: 11 });
    const P = []; for (let i = 0; i <= 40; i++) { const u = i / 40; P.push([gx + 30 + 220 * u ** 2.2, gy - 200 * Math.sin((u * Math.PI) / 2) ** 0.8]); }
    g.smooth(P, { c: C.accent, w: 2.4 });
    g.callout("2. pitch over: se inclina\nhacia la horizontal", P[22][0], P[22][1], 190, 120, { size: 11 });
    g.rect(gx - 20, gy - 70, 300, 70, { fill: C.blue, fillAlpha: 0.08, c: null });
    g.text("aire denso: arrastre alto", gx - 14, gy - 58, { c: C.blue, size: 10.5 });
    drawRocket(g, P[40][0], P[40][1], 26, 90, { flame: true });
    // derecha: barra
    const bx = 330, by = 70, sc = 0.026;
    const parts = [["velocidad orbital LEO ≈ 7 700 m/s", 7700, C.green], ["pérdida por gravedad 1 200–2 500 m/s", 1850, C.blue], ["pérdida por arrastre 100–700 m/s", 400, C.red]];
    let x = bx;
    g.text("ΔV ideal = Vₑ·ln(m₀/m_b)", bx, by - 26, { size: 12.5, bold: true });
    parts.forEach(([n, v, col], i) => {
      const w = v * sc;
      g.rect(x, by, w, 30, { fill: col, fillAlpha: 0.8, c: null });
      g.rect(bx, by + 44 + i * 20, 10, 10, { fill: col, c: null });
      g.text(n, bx + 16, by + 49 + i * 20, { c: col, size: 11 });
      x += w;
    });
    g.dim(bx, by + 118, x, by + 118, "ΔV que debe dar el lanzador ≈ 9 000–10 900 m/s", { c: C.ink, size: 11 });
    g.text("Para reducirlas:", bx, 214, { c: C.dim, size: 11.5, bold: true });
    g.text("• gravedad: menos tiempo de combustión y\n  vuelo casi horizontal fuera de la atmósfera", bx, 242, { c: C.blue, size: 11 });
    g.text("• arrastre: bajo C_D y atravesar rápido el aire denso", bx, 276, { c: C.red, size: 11 });
  },
  caption: "Subir vertical minimiza el tiempo en aire denso (menos arrastre) pero maximiza la pérdida por gravedad: de ahí el compromiso del pitch over.",
});

FIG.def("tsiolkovsky", {
  title: "Ecuación de Tsiolkovsky: ΔV = Vₑ·ln(m₀/m_b)",
  h: 320,
  controls: [
    { type: "range", key: "ve", label: "Vₑ", min: 2000, max: 4500, step: 50, value: 3000, fmt: (v) => fmt.n(v) + " m/s" },
    { type: "range", key: "R", label: "m₀/m_b", min: 1, max: 25, step: 0.1, value: 8, fmt: (v) => fmt.n(v, 1) },
  ],
  draw(g, s) {
    const P = g.plot([70, 40, 520, 230], [1, 25], [0, 12000], { xt: [1, 5, 10, 15, 20, 25], yt: [0, 2000, 4000, 6000, 8000, 10000, 12000], fy: (v) => fmt.n(v / 1000) + " km/s", xl: "relación de masas m₀/m_b", yl: "ΔV ideal" });
    [2500, 3500, 4500].forEach((ve) => {
      const pts = []; for (let r = 1; r <= 25; r += 0.25) pts.push([P.X(r), P.Y(ve * Math.log(r))]);
      g.path(pts, { c: C.faint, w: 1, dash: [3, 4] });
      g.text("Vₑ " + fmt.n(ve), P.X(25) + 4, P.Y(ve * Math.log(25)), { c: C.faint, size: 10 });
    });
    const pts = []; for (let r = 1; r <= 25; r += 0.2) pts.push([P.X(r), P.Y(Math.min(12000, s.ve * Math.log(r)))]);
    g.path(pts, { c: C.accent, w: 2.6 });
    g.line(P.X(1), P.Y(7700), P.X(25), P.Y(7700), { c: C.green, w: 1.4, dash: [6, 4] });
    g.text("≈ velocidad orbital LEO (7,7 km/s)", P.X(1.5), P.Y(7700) - 10, { c: C.green, size: 11 });
    const dv = s.ve * Math.log(s.R);
    g.line(P.X(s.R), P.Y(0), P.X(s.R), P.Y(dv), { c: C.accent2, w: 1, dash: [3, 3] });
    g.circle(P.X(s.R), P.Y(Math.min(dv, 12000)), 6, { fill: C.accent2 });
  },
  info(s) {
    const dv = s.ve * Math.log(s.R), need = Math.exp(7700 / s.ve);
    return `<span>ΔV = <b>${fmt.n(dv)} m/s</b></span><span>Propulsante: <b>${fmt.n((1 - 1 / s.R) * 100)} %</b> de la masa inicial</span><span>Para 7,7 km/s haría falta m₀/m_b = <b>${fmt.n(need, 1)}</b></span>`;
  },
  caption: "ΔV crece solo con el logaritmo de la relación de masas: cada aumento de ΔV exige un aumento exponencial de m₀. Una sola etapa no alcanza la órbita con una estructura construible.",
});

FIG.def("etapas", {
  title: "Una etapa vs. dos etapas con los mismos recursos (100 t en total)",
  h: 330,
  controls: [
    { type: "range", key: "ml", label: "Carga útil", min: 0.5, max: 5, step: 0.1, value: 1, fmt: (v) => fmt.n(v, 1) + " t" },
    { type: "range", key: "f", label: "Estructura / propulsante", min: 5, max: 20, step: 1, value: 10, fmt: (v) => v + " %" },
  ],
  calc(s) {
    const ML = s.ml, f = s.f / 100, MP = (100 - ML) / (1 + f), MS = f * MP, Ve = 2700;
    const R = 100 / (ML + MS);
    const R1 = 100 / (ML + MP / 2 + MS), R2 = (ML + MP / 2 + MS / 2) / (ML + MS / 2);
    return { ML, MP, MS, R, R1, R2, dv1: Ve * Math.log(R), dv21: Ve * Math.log(R1), dv22: Ve * Math.log(R2) };
  },
  draw(g, s) {
    const k = this.calc(s);
    // cohetes esquemáticos
    const drawStack = (x, y0, parts) => {
      let y = y0;
      parts.forEach(([h, col, lab]) => {
        g.rect(x, y, 46, h, { fill: col, fillAlpha: 0.75, c: C.bg, w: 2 });
        if (lab) g.text(lab, x + 56, y + h / 2, { c: C.dim, size: 10.5 });
        y += h;
      });
      g.path([[x, y0], [x + 23, y0 - 26], [x + 46, y0]], { fill: C.green, c: null, close: true });
    };
    g.text("1 etapa", 60, 30, { bold: true, align: "center" });
    drawStack(37, 70, [[180, C.accent, ""], [20, C.metal, ""]]);
    g.text("arrastra toda la\nestructura hasta\nel final", 60, 300, { c: C.dim, size: 10.5, align: "center" });
    g.text("2 etapas", 225, 30, { bold: true, align: "center" });
    drawStack(202, 70, [[90, C.accent2, "etapa 2"], [10, C.metal, ""], [90, C.accent, "etapa 1"], [10, C.metal, ""]]);
    g.text("la etapa 1 se\ndesprende vacía", 225, 300, { c: C.dim, size: 10.5, align: "center" });
    // barras
    const P = g.plot([380, 50, 220, 220], [0, 2], [0, 10000], { yt: [0, 2000, 4000, 6000, 8000, 10000], fy: (v) => fmt.n(v / 1000) + " km/s", grid: true });
    const bw = 64;
    g.rect(P.X(0.5) - bw / 2, P.Y(k.dv1), bw, P.Y(0) - P.Y(k.dv1), { fill: C.accent, c: null });
    g.text(fmt.n(k.dv1), P.X(0.5), P.Y(k.dv1) - 12, { align: "center", bold: true });
    g.text("1 etapa", P.X(0.5), P.Y(0) + 16, { c: C.dim, size: 11, align: "center" });
    g.rect(P.X(1.4) - bw / 2, P.Y(k.dv21), bw, P.Y(0) - P.Y(k.dv21), { fill: C.accent, c: null });
    g.rect(P.X(1.4) - bw / 2, P.Y(k.dv21 + k.dv22), bw, P.Y(k.dv21) - P.Y(k.dv21 + k.dv22), { fill: C.accent2, c: null });
    g.text(fmt.n(k.dv21 + k.dv22), P.X(1.4), P.Y(k.dv21 + k.dv22) - 12, { align: "center", bold: true });
    g.text("2 etapas", P.X(1.4), P.Y(0) + 16, { c: C.dim, size: 11, align: "center" });
    g.text("ΔV₁", P.X(1.4), (P.Y(0) + P.Y(k.dv21)) / 2, { c: C.bg, size: 11, align: "center", bold: true });
    g.text("ΔV₂", P.X(1.4), (P.Y(k.dv21) + P.Y(k.dv21 + k.dv22)) / 2, { c: C.bg, size: 11, align: "center", bold: true });
    g.line(P.X(0), P.Y(7700), P.X(2), P.Y(7700), { c: C.green, w: 1.2, dash: [5, 4] });
    g.text("órbita", P.X(2) + 4, P.Y(7700), { c: C.green, size: 10.5 });
    g.text("Vₑ = 2 700 m/s", 600, 300, { c: C.dim, size: 10.5, align: "right" });
  },
  info(s) {
    const k = this.calc(s);
    return `<span>M_P = ${fmt.n(k.MP, 1)} t · M_S = ${fmt.n(k.MS, 1)} t</span><span>R = <b>${fmt.n(k.R, 2)}</b></span><span>R₁ = <b>${fmt.n(k.R1, 2)}</b> · R₂ = <b>${fmt.n(k.R2, 2)}</b></span><span>Ganancia: <b>+${fmt.n(((k.dv21 + k.dv22) / k.dv1 - 1) * 100, 1)} %</b></span>`;
  },
  caption: "Con los valores del apunte (1 t de carga, estructura = 10 % del propulsante) da ~6 200 m/s en una etapa y ~7 600 m/s en dos: al soltar la estructura vacía de la etapa 1, el cohete deja de acelerar peso muerto.",
});

/* ======================= TEMA 3 ======================= */
const MU = 398600, RT = 6371; // km³/s², km

FIG.def("orbitaCircular", {
  title: "Órbita circular: V = √(GM/r) y T = 2π√(r³/GM)",
  h: 320, anim: true,
  controls: [{ type: "range", key: "lh", label: "Altitud h", min: 2.3, max: 4.56, step: 0.01, value: 2.6, fmt: (v) => fmt.n(10 ** v) + " km" }],
  draw(g, s, t) {
    const h = 10 ** s.lh, r = RT + h, V = Math.sqrt(MU / r), T = 2 * Math.PI * Math.sqrt(r ** 3 / MU);
    const cx = 160, cy = 165, k = 135 / (RT + 35786);
    g.circle(cx, cy, (RT + 35786) * k, { c: C.faint, w: 1, dash: [3, 4] });
    g.text("GEO", cx, cy - (RT + 35786) * k - 9, { c: C.faint, size: 10.5, align: "center" });
    g.earth(cx, cy, RT * k);
    g.circle(cx, cy, r * k, { c: C.accent, w: 1.6 });
    const a = (t * 2 * Math.PI) * (5520 / T) / 4;
    const sx = cx + r * k * Math.cos(a), sy = cy - r * k * Math.sin(a);
    g.arrowA(sx, sy, a + Math.PI / 2, 14 + V * 4, { c: C.accent2, w: 2 });
    g.circle(sx, sy, 5, { fill: C.ink });
    g.line(cx, cy, sx, sy, { c: C.dim, w: 1, dash: [3, 3] });
    if (r * k > 50) g.text("r = R_T + h", (cx + sx) / 2 + 6, (cy + sy) / 2 - 8, { c: C.dim, size: 10.5 });
    g.text("a escala", 20, 300, { c: C.faint, size: 10.5 });
    const P = g.plot([370, 40, 230, 200], [0, 40000], [0, 8], { xt: [0, 10000, 20000, 30000, 40000], yt: [0, 2, 4, 6, 8], fx: (v) => fmt.n(v / 1000) + "k", xl: "h [km]", yl: "V [km/s]" });
    const pts = []; for (let x = 0; x <= 40000; x += 400) pts.push([P.X(x), P.Y(Math.sqrt(MU / (RT + x)))]);
    g.path(pts, { c: C.accent, w: 2 });
    g.circle(P.X(h), P.Y(V), 6, { fill: C.accent2 });
  },
  info(s) {
    const h = 10 ** s.lh, r = RT + h, V = Math.sqrt(MU / r), T = 2 * Math.PI * Math.sqrt(r ** 3 / MU);
    const Tm = T / 60;
    return `<span>r = <b>${fmt.n(r)} km</b></span><span>V = <b>${fmt.n(V, 2)} km/s</b></span><span>T = <b>${Tm < 180 ? fmt.n(Tm) + " min" : fmt.n(Tm / 60, 1) + " h"}</b></span>`;
  },
  caption: "La velocidad no depende de la masa del satélite. A mayor radio, menor velocidad y mayor período: ~7,7 km/s y ~92 min en LEO (400 km); ~3,1 km/s y un día sideral en GEO.",
});

FIG.def("elipse", {
  title: "Órbita elíptica: perigeo, apogeo y velocidad variable",
  h: 330, anim: true,
  controls: [{ type: "range", key: "e", label: "Excentricidad e", min: 0, max: 0.8, step: 0.01, value: 0.5, fmt: (v) => fmt.n(v, 2) }],
  draw(g, s, t) {
    const a = 150, e = s.e, b = a * Math.sqrt(1 - e * e), c = a * e;
    const cx = 320, cy = 160, fx = cx + c; // foco a la derecha -> perigeo a la derecha
    g.ellipse(cx, cy, a, b, 0, { c: C.accent, w: 1.8 });
    g.line(cx - a, cy, cx + a, cy, { c: C.faint, w: 1, dash: [3, 4] });
    g.earth(fx, cy, 16);
    if (e > 0.02) { g.circle(cx - c, cy, 3, { c: C.faint, w: 1 }); g.text("foco vacío", cx - c, cy + 16, { c: C.faint, size: 10, align: "center" }); }
    g.text("Perigeo", cx + a + 8, cy - 12, { c: C.ink, size: 12, bold: true });
    g.text("Apogeo", cx - a - 8, cy - 12, { c: C.ink, size: 12, bold: true, align: "right" });
    g.dim(fx, cy + 28, cx + a, cy + 28, "r_P", { c: C.green, italic: true });
    g.dim(cx - a, cy + 52, fx, cy + 52, "r_A", { c: C.blue, italic: true });
    if (cy + b + 20 < 322) g.dim(cx - a, cy + b + 16, cx + a, cy + b + 16, "2a = r_A + r_P", { c: C.dim });
    // satélite (Kepler)
    const M = (t * 0.9) % (2 * Math.PI), E = GEO.kepler(M, e);
    const px = cx + a * Math.cos(E), py = cy - b * Math.sin(E);
    const r = Math.hypot(px - fx, py - cy);
    const v = Math.sqrt(2 / r - 1 / a) * Math.sqrt(a) * 34; // vis-viva escalada
    const tx = -a * Math.sin(E), ty = -b * Math.cos(E), tl = Math.hypot(tx, ty);
    g.line(fx, cy, px, py, { c: C.dim, w: 1, dash: [2, 3] });
    g.arrow(px, py, px + (tx / tl) * v, py + (ty / tl) * v, { c: C.accent2, w: 2.2 });
    g.circle(px, py, 5, { fill: C.ink });
  },
  info(s) {
    const e = s.e, rp = 1 - e, ra = 1 + e;
    return `<span>r_A / r_P = <b>${fmt.n(ra / rp, 2)}</b></span><span>v_P / v_A = r_A / r_P = <b>${fmt.n(ra / rp, 2)}</b></span><span>E = −GMm / 2a (igual para todo e con el mismo a)</span>`;
  },
  caption: "La flecha es la velocidad (ecuación de energía, V = √(GM(2/r − 1/a))): máxima en el perigeo y mínima en el apogeo, con r_P·v_P = r_A·v_A.",
});

FIG.def("compOrbitas", {
  title: "Velocidad a lo largo de una vuelta: circular vs. elíptica (mismo semieje)",
  h: 260,
  draw(g) {
    const P = g.plot([70, 30, 520, 180], [0, 1], [0, 2.4], { xt: [0, 0.25, 0.5, 0.75, 1], yt: [0, 0.5, 1, 1.5, 2], fx: (v) => (v === 0 ? "perigeo" : v === 0.5 ? "apogeo" : v === 1 ? "perigeo" : fmt.n(v, 2) + "T"), fy: (v) => fmt.n(v, 1), xl: "tiempo", yl: "V / V_circ" });
    g.line(P.X(0), P.Y(1), P.X(1), P.Y(1), { c: C.blue, w: 2.4 });
    g.text("circular: V constante", P.X(0.02), P.Y(1) - 12, { c: C.blue, size: 11.5 });
    const e = 0.6, pts = [];
    for (let i = 0; i <= 200; i++) {
      const M = (i / 200) * 2 * Math.PI, E = GEO.kepler(M, e), r = 1 - e * Math.cos(E);
      pts.push([P.X(i / 200), P.Y(Math.sqrt(2 / r - 1))]);
    }
    g.path(pts, { c: C.accent, w: 2.4 });
    g.text("elíptica (e = 0,6)", P.X(0.08), P.Y(2.0), { c: C.accent, size: 11.5 });
    g.rect(P.X(0.25), P.Y(2.4), P.X(0.75) - P.X(0.25), P.Y(0) - P.Y(2.4), { fill: C.accent, fillAlpha: 0.07, c: null });
    g.text("pasa la mayor parte del tiempo lenta,\ncerca del apogeo (útil para Molniya)", P.X(0.5), P.Y(1.75), { c: C.dim, size: 11, align: "center" });
  },
  caption: "En las dos órbitas la energía vale −GMm/2a. En la circular el reparto entre cinética y potencial es fijo; en la elíptica se intercambian continuamente.",
});

FIG.def("conicas", {
  title: "Velocidad de escape: de la elipse a la hipérbola",
  h: 340,
  controls: [{ type: "range", key: "k", label: "V / V_circ", min: 0.6, max: 1.7, step: 0.01, value: 1.2, fmt: (v) => fmt.n(v, 2) }],
  draw(g, s) {
    const ex = 400, ey = 175, Rp = 32, r0 = 80, px = ex - r0, py = ey;
    const conic = (kv, col, w, dash) => {
      const k = kv * kv, e = Math.abs(k - 1), p = r0 * k, dir = k >= 1 ? Math.PI : 0; // perigeo
      const pts = [];
      const nuMax = e >= 1 ? Math.acos(-1 / e) - 0.02 : Math.PI;
      for (let nu = -nuMax; nu <= nuMax; nu += 0.01) {
        const r = p / (1 + e * Math.cos(nu));
        if (r < Rp - 1 || r > 900) { if (pts.length) { if (r < Rp) break; } continue; }
        const ang = dir + nu;
        pts.push([ex + r * Math.cos(ang), ey + r * Math.sin(ang)]);
      }
      // ordenar desde el punto de partida en sentido del movimiento (hacia arriba)
      g.path(pts, { c: col, w, dash });
    };
    conic(1, C.faint, 1, [3, 4]);
    conic(Math.SQRT2, C.faint, 1, [3, 4]);
    const kind = s.k < 0.999 ? (r0 * s.k ** 2 / (2 - s.k ** 2) < Rp ? "cae" : "elipse") : Math.abs(s.k - 1) < 0.01 ? "circular" : Math.abs(s.k - Math.SQRT2) < 0.012 ? "parábola" : s.k < Math.SQRT2 ? "elipse" : "hipérbola";
    const col = kind === "hipérbola" ? C.red : kind === "parábola" ? C.yellow : kind === "cae" ? C.metal : C.accent;
    conic(s.k, col, 2.6);
    g.earth(ex, ey, Rp);
    g.arrow(px, py, px, py - 20 - s.k * 34, { c: C.ink, w: 2.2 });
    g.circle(px, py, 5, { fill: C.ink });
    g.text("V", px - 12, py - 40, { bold: true });
    g.text("circular (V_circ)", ex + 88, ey + 2, { c: C.faint, size: 10.5 });
    g.text("parábola (√2·V_circ)", 18, 20, { c: C.faint, size: 10.5 });
    g.text(kind === "cae" ? "Trayectoria balística: choca con la Tierra" : kind.charAt(0).toUpperCase() + kind.slice(1), 18, 318, { c: col, size: 14, bold: true });
  },
  info(s) {
    const E = s.k * s.k / 2 - 1; // energía por unidad de masa en unidades de GM/r0
    const t = E < -0.001 ? "E < 0 → órbita cerrada" : E > 0.001 ? "E > 0 → escapa con velocidad sobrante" : "E = 0 → llega al infinito con V = 0";
    return `<span>V = <b>${fmt.n(s.k, 2)}·V_circ</b></span><span><b>${t}</b></span><span>V_esc = √2·V_circ ≈ 1,41·V_circ</span>`;
  },
  caption: "Para la Tierra, en la superficie: V_esc = √(2GM/r) ≈ 11,2 km/s (~40 000 km/h). No depende de la masa del objeto.",
});

/* ======================= TEMA 4 ======================= */
FIG.def("estacionesSeg", {
  title: "Red de estaciones de seguimiento: cobertura distribuida",
  h: 320, anim: true,
  draw(g, s, t) {
    const cx = 230, cy = 160, R = 70, rs = 118;
    const rot = t * 0.15;
    // órbita
    g.circle(cx, cy, rs, { c: C.faint, w: 1, dash: [3, 4] });
    const sa = t * 0.6, sx = cx + rs * Math.cos(sa), sy = cy - rs * Math.sin(sa);
    const sts = [0, 2.1, 4.2].map((d) => d + rot);
    let seen = -1;
    sts.forEach((a, i) => {
      const x = cx + R * Math.cos(a), y = cy - R * Math.sin(a);
      // horizonte local
      const h = Math.acos(R / rs); // semiángulo de visibilidad
      const diff = Math.atan2(Math.sin(sa - a), Math.cos(sa - a));
      const vis = Math.abs(diff) < h;
      if (vis) seen = i;
      const P = [[x, y]];
      for (let u = -h; u <= h + 1e-6; u += h / 20) P.push([cx + rs * Math.cos(a + u), cy - rs * Math.sin(a + u)]);
      g.path(P, { fill: vis ? C.green : C.accent, fillAlpha: vis ? 0.22 : 0.08, c: null, close: true });
    });
    g.earth(cx, cy, R);
    sts.forEach((a, i) => {
      const x = cx + R * Math.cos(a), y = cy - R * Math.sin(a);
      g.circle(x, y, 5, { fill: i === seen ? C.green : C.accent2 });
    });
    g.arcArrow(cx, cy, R + 10, 0.6, 1.4, { c: C.dim, w: 1.2 });
    g.rect(sx - 5, sy - 3, 10, 6, { fill: C.ink, c: null });
    g.line(sx - 12, sy, sx + 12, sy, { c: C.blue, w: 2 });
    if (seen >= 0) {
      const a = sts[seen];
      g.line(cx + R * Math.cos(a), cy - R * Math.sin(a), sx, sy, { c: C.green, w: 1.4, dash: [4, 3] });
    }
    g.text("Funciones:", 410, 50, { bold: true });
    ["rastrear posición y órbita", "enviar comandos", "recibir telemetría y datos", "monitorear la salud", "corregir la órbita"].forEach((l, i) => g.text("• " + l, 410, 78 + i * 22, { c: C.dim, size: 11.5 }));
    g.text(seen >= 0 ? "Hay enlace con una estación" : "Sin visibilidad en este instante", 410, 210, { c: seen >= 0 ? C.green : C.red, size: 12, bold: true });
    g.text("Con estaciones en distintas longitudes\nsiempre hay alguna con visibilidad:\nseguimiento continuo.", 410, 256, { c: C.dim, size: 11 });
  },
  caption: "Un satélite en LEO pasa sobre una estación solo unos minutos por vuelta; con la rotación terrestre cada estación pierde de vista al vehículo. Las redes distribuidas cubren ese hueco.",
});

FIG.def("trayectoria", {
  title: "Fases de la trayectoria de un lanzador",
  h: 340, anim: true,
  draw(g, s, t) {
    const cx = 320, R = 2600, cy = 262 + R;
    const c = g.ctx;
    c.save(); c.beginPath(); c.arc(cx, cy, R + 70, 0, Math.PI * 2); c.fillStyle = "rgba(111,168,220,0.08)"; c.fill();
    c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fillStyle = "#1c2430"; c.fill(); c.strokeStyle = C.metal; c.lineWidth = 1.2; c.stroke(); c.restore();
    g.text("atmósfera densa", 620, 214, { c: C.blue, size: 10.5, align: "right" });
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const u = i / 100;
      pts.push([80 + 500 * u ** 1.7, 258 - 190 * Math.sin(Math.min(1, u * 1.5) * Math.PI / 2) ** 0.75]);
    }
    c.save(); c.beginPath(); c.arc(cx, cy, cy - 68, -Math.PI / 2 - 0.2, -Math.PI / 2 + 0.2); c.strokeStyle = C.green; c.setLineDash([6, 4]); c.lineWidth = 1.5; c.stroke(); c.restore();
    g.smooth(pts, { c: C.accent, w: 2.4 });
    const marks = [[0, "1. Despegue", 12, 14], [9, "2. Ascenso vertical", 12, 0], [22, "3. Pitch over", 12, 0], [42, "4. Separación de etapas", -20, -24], [72, "5. Vuelo orbital\ncasi horizontal", 0, 28], [100, "6. Inserción", 0, 26]];
    marks.forEach(([i, l, dx, dy], k) => {
      const [x, y] = pts[i];
      g.circle(x, y, 5, { fill: C.bg, c: C.accent2, w: 2 });
      g.text(l, x + dx, y + dy, { size: 11.5, align: k >= 3 ? "center" : "left" });
    });
    const [sx, sy] = pts[42];
    g.arrow(sx + 4, sy + 8, sx + 14, sy + 34, { c: C.metal, w: 1, head: 6 });
    g.circle(sx + 16, sy + 38, 4, { fill: C.metal });
    g.text("etapa agotada: se descarta\no aterriza en vertical", sx + 26, sy + 48, { c: C.dim, size: 10.5 });
    const u = (t * 0.12) % 1.15;
    const idx = Math.min(100, Math.floor(u * 100));
    const [rx, ry] = pts[idx], [nx, ny] = pts[Math.min(100, idx + 2)];
    const ang = idx >= 100 ? 90 : (Math.atan2(nx - rx, -(ny - ry)) * 180) / Math.PI;
    drawRocket(g, rx, ry, 22, idx === 0 ? 0 : ang, { flame: idx < 100, t });
    g.text("Ventana de lanzamiento: intervalo en que la geometría sitio–órbita–destino permite la trayectoria prevista.", 20, 300, { c: C.dim, size: 11 });
    g.text("Un retraso exige una nueva trayectoria (más propelente) o esperar la próxima ventana.", 20, 320, { c: C.dim, size: 11 });
  },
  caption: "La trayectoria se calcula antes del lanzamiento y programa la computadora de a bordo (encendidos, separaciones, orientación del chorro). El vuelo es automático y se sigue desde tierra.",
});

FIG.def("tiposOrbita", {
  title: "Tipos de órbita",
  h: 330,
  controls: [{ type: "seg", key: "o", options: [["LEO", "LEO"], ["MEO", "MEO"], ["GEO", "GEO"], ["HEO", "HEO / Molniya"], ["SSO", "Heliosincrónica"], ["POL", "Polar"]], value: "GEO" }],
  draw(g, s) {
    const cx = 175, cy = 165, k = 120 / 42164;
    const on = (id) => s.o === id;
    const col = (id, c) => (on(id) ? c : C.faint);
    g.text("Plano ecuatorial (a escala)", cx, 20, { c: C.dim, size: 11, align: "center" });
    // Molniya: rp 6 900, ra 46 000
    const rp = 6900, ra = 46000, a = (rp + ra) / 2, e = (ra - rp) / (ra + rp), b = a * Math.sqrt(1 - e * e);
    g.ellipse(cx - (a - rp) * k, cy, a * k, b * k, 0, { c: col("HEO", C.purple), w: on("HEO") ? 2.4 : 1 });
    g.circle(cx, cy, 42164 * k, { c: col("GEO", C.accent), w: on("GEO") ? 2.4 : 1 });
    g.circle(cx, cy, 26560 * k, { c: col("MEO", C.green), w: on("MEO") ? 2.4 : 1 });
    g.circle(cx, cy, 24, { c: col("LEO", C.blue), w: on("LEO") ? 2.4 : 1 });
    g.earth(cx, cy, RT * k);
    g.text("GEO", cx + 42164 * k * 0.71 + 4, cy - 42164 * k * 0.71, { c: col("GEO", C.accent), size: 11 });
    g.text("MEO", cx + 26560 * k * 0.71 + 2, cy - 26560 * k * 0.71, { c: col("MEO", C.green), size: 11 });
    g.text("LEO", cx + 20, cy + 26, { c: col("LEO", C.blue), size: 11 });
    g.text("Molniya", cx - (a - rp) * k - a * k * 0.55, cy - b * k * 0.83 - 12, { c: col("HEO", C.purple), size: 11, align: "center" });
    // vista lateral: polar y SSO
    const ex = 470, ey = 165, R = 60;
    g.text("Vista lateral", ex, 20, { c: C.dim, size: 11, align: "center" });
    g.earth(ex, ey, R);
    g.line(ex, ey - R - 14, ex, ey + R + 14, { c: C.dim, w: 1, dash: [3, 3] });
    g.text("N", ex, ey - R - 22, { c: C.dim, size: 10.5, align: "center" });
    g.ellipse(ex, ey, R + 30, 12, 0, { c: col("LEO", C.blue), w: on("LEO") || on("GEO") || on("MEO") ? 2 : 1 });
    g.ellipse(ex, ey, 12, R + 30, 0, { c: col("POL", C.red), w: on("POL") ? 2.4 : 1 });
    g.ellipse(ex, ey, 18, R + 28, -0.14, { c: col("SSO", C.yellow), w: on("SSO") ? 2.4 : 1 });
    g.text("polar", ex + 14, ey - R - 34, { c: col("POL", C.red), size: 11 });
    g.text("SSO (~98°)", ex + 36, ey + R + 34, { c: col("SSO", C.yellow), size: 11 });
    g.text("ecuatorial", ex + R + 34, ey + 4, { c: C.faint, size: 10.5 });
  },
  info(s) {
    const d = {
      LEO: "De unos cientos de km a ~2 000 km. Período ~90 min, alta resolución y poca latencia: ISS, observación terrestre, constelaciones.",
      MEO: "De ~2 000 a 35 786 km. Navegación (GPS) y comunicaciones.",
      GEO: "35 786 km sobre el ecuador, período = día sideral: el satélite parece fijo sobre un punto. Comunicaciones y meteorología.",
      HEO: "Muy elíptica: perigeo bajo y apogeo mayor que GEO. Por la 2.ª ley de Kepler pasa mucho tiempo cerca del apogeo: cubre latitudes altas (Rusia).",
      SSO: "LEO casi polar que pasa sobre cada región a la misma hora solar local: iluminación comparable entre pasadas.",
      POL: "Pasa sobre los polos y la Tierra gira por debajo: cobertura global.",
    };
    return `<span>${d[s.o]}</span>`;
  },
  caption: "Izquierda: radios a escala real (LEO casi pegada a la Tierra). Derecha: inclinación de las órbitas polar y heliosincrónica.",
});

FIG.def("reentrada", {
  title: "Ángulo de reentrada y corredor de reentrada",
  h: 300,
  draw(g) {
    const cx = 320, cy = 1260, R = 1100;
    g.ctx.save(); g.ctx.beginPath(); g.ctx.arc(cx, cy, R + 90, 0, Math.PI * 2); g.ctx.fillStyle = "rgba(111,168,220,0.10)"; g.ctx.fill();
    g.ctx.beginPath(); g.ctx.arc(cx, cy, R, 0, Math.PI * 2); g.ctx.fillStyle = "#1c2b38"; g.ctx.fill(); g.ctx.restore();
    g.text("atmósfera", 610, 98, { c: C.blue, size: 11, align: "right" });
    const startX = 40, startY = 40;
    g.smooth([[startX, startY], [150, 110], [220, 175], [250, 225]], { c: C.red, w: 2.4 });
    g.text("muy empinado: desaceleración brusca,\npicos de calor y de fuerzas g", 260, 210, { c: C.red, size: 11 });
    g.smooth([[startX, startY], [200, 95], [360, 135], [470, 175], [540, 205]], { c: C.green, w: 2.6 });
    g.text("corredor de reentrada", 470, 156, { c: C.green, size: 12, bold: true });
    g.smooth([[startX, startY], [210, 80], [330, 100], [420, 86], [560, 40], [630, 22]], { c: C.yellow, w: 2.2, dash: [6, 4] });
    g.text("muy plano: recorre más atmósfera o “rebota”;\ncalentamiento largo, aterrizaje impreciso", 250, 32, { c: C.yellow, size: 11 });
    g.circle(startX, startY, 6, { fill: C.ink });
    g.text("nave", startX + 4, startY - 16, { size: 11 });
    g.text("Factores críticos: precisión de la trayectoria · carga térmica · cargas mecánicas (g)\n· control de la velocidad · sistemas de aterrizaje · elección del sitio", 20, 272, { c: C.dim, size: 10.5 });
  },
  caption: "Se busca un ángulo intermedio entre los dos extremos: el corredor de reentrada.",
});

/* ======================= TEMA 5 ======================= */
FIG.def("universo", {
  title: "Big Bang: expansión y composición del universo",
  h: 280,
  draw(g) {
    const cx = 120, cy = 140, R = 92, r = 56;
    const parts = [[0.68, C.purple, "Energía oscura ~68 %"], [0.27, C.blue, "Materia oscura ~27 %"], [0.05, C.accent, "Materia ordinaria ~5 %"]];
    let a0 = -Math.PI / 2;
    parts.forEach(([f, col]) => {
      const a1 = a0 + f * Math.PI * 2;
      const c = g.ctx; c.save(); c.beginPath(); c.arc(cx, cy, R, a0, a1); c.arc(cx, cy, r, a1, a0, true); c.closePath(); c.fillStyle = col; c.globalAlpha = 0.85; c.fill(); c.restore();
      a0 = a1 + 0.0;
    });
    g.text("13 800", cx, cy - 8, { size: 15, bold: true, align: "center" });
    g.text("millones de años", cx, cy + 12, { c: C.dim, size: 10, align: "center" });
    parts.forEach(([, col, l], i) => {
      g.rect(250, 70 + i * 26, 12, 12, { fill: col, c: null, r: 3 });
      g.text(l, 270, 76 + i * 26, { c: C.ink, size: 11.5 });
    });
    g.text("Solo ~5 % es materia\nordinaria; la materia\noscura se detecta por\nsu gravedad y la energía\noscura acelera la\nexpansión.", 250, 196, { c: C.dim, size: 10.5 });
    // ley de expansión
    const P = g.plot([420, 40, 190, 150], [0, 10], [0, 10], { xt: [], yt: [], xl: "distancia", yl: "velocidad de alejamiento" });
    const pts = [[1.2, 1.5], [2.1, 1.8], [3, 3.4], [4.2, 3.9], [5.1, 5.3], [6, 5.8], [7.2, 7.4], [8.1, 7.9], [9, 9.2]];
    g.line(P.X(0), P.Y(0), P.X(10), P.Y(10), { c: C.accent, w: 1.6, dash: [6, 4] });
    pts.forEach(([x, y]) => g.ellipse(P.X(x), P.Y(y), 6, 3, -0.4, { fill: C.red, fillAlpha: 0.9 }));
    g.text("corrimiento al rojo: cuanto más\nlejos, más rápido se alejan", 420, 256, { c: C.red, size: 11 });
  },
  caption: "Evidencias del Big Bang: la expansión (corrimiento al rojo), la radiación cósmica de fondo y la abundancia de H y He primordiales.",
});

FIG.def("planetas", {
  title: "Planetas del Sistema Solar (tamaños a escala)",
  h: 230,
  draw(g) {
    const pl = [["Mercurio", 2440, C.metal, "t"], ["Venus", 6052, "#d9b77c", "t"], ["Tierra", 6371, C.blue, "t"], ["Marte", 3390, "#c66a4a", "t"], ["Júpiter", 69911, "#d1a77a", "g"], ["Saturno", 58232, "#e3cd8f", "g"], ["Urano", 25362, C.teal, "h"], ["Neptuno", 24622, "#4f79c9", "h"], ["Plutón", 1188, "#a89a8a", "e"]];
    const k = 50 / 69911, y = 110, pos = [];
    let x = 14;
    pl.forEach(([n, r, col, grp]) => {
      const rr = Math.max(1.5, r * k), half = Math.max(n === "Saturno" ? rr * 1.8 : rr, 18);
      x += half;
      if (n === "Saturno") g.ellipse(x, y, rr * 1.8, rr * 0.42, -0.25, { c: "#cdb98a", w: 2 });
      g.circle(x, y, rr, { fill: col });
      g.text(n, x, y + 74, { c: C.ink, size: 10.5, align: "center" });
      pos.push([x, grp]);
      x += half + 4;
    });
    const span = (grp) => { const xs = pos.filter((p) => p[1] === grp).map((p) => p[0]); return [Math.min(...xs) - 18, Math.max(...xs) + 18]; };
    [["t", "Terrestres: rocosos y metálicos", C.dim], ["g", "Gigantes gaseosos: H y He", "#d1a77a"], ["h", "Gigantes de hielo", C.teal], ["e", "Enano", "#a89a8a"]].forEach(([k2, l, col]) => {
      const [a1, b1] = span(k2);
      g.line(a1, 198, b1, 198, { c: col });
      g.text(l, (a1 + b1) / 2, 214, { c: col, size: 10.5, align: "center" });
    });
    g.text("Se formó hace ~4 600 millones de años por el colapso de una nube molecular.", 20, 20, { c: C.dim, size: 11 });
  },
  caption: "Planetas enanos (Plutón, Ceres, Eris, Makemake, Haumea): esféricos pero no despejaron su órbita. 1 UA ≈ 150 millones de km; la luz del Sol tarda 8,3 min en llegar a la Tierra.",
});

FIG.def("viaLactea", {
  title: "Ubicación del Sistema Solar en la Vía Láctea",
  h: 320, anim: true, still: 0,
  draw(g, s, t) {
    const cx = 260, cy = 160, R = 140;
    const rot = t * 0.03;
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let arm = 0; arm < 4; arm++) {
      for (let i = 0; i < 160; i++) {
        const u = i / 160, th = arm * Math.PI / 2 + u * 3.6 + rot;
        const r = 18 + u * (R - 18);
        const j = (rnd() - 0.5) * 18 * (0.4 + u), jj = (rnd() - 0.5) * 18 * (0.4 + u);
        g.circle(cx + r * Math.cos(th) + j, cy + r * Math.sin(th) * 0.55 + jj * 0.55, 0.8 + rnd() * 1.4, { fill: arm % 2 ? "#cfd8ff" : "#ffe9c7", fillAlpha: 0.55 });
      }
    }
    const gr = g.ctx.createRadialGradient(cx, cy, 2, cx, cy, 40);
    gr.addColorStop(0, "rgba(255,230,180,0.9)"); gr.addColorStop(1, "rgba(255,230,180,0)");
    g.ctx.fillStyle = gr; g.ctx.beginPath(); g.ctx.ellipse(cx, cy, 40, 24, 0, 0, Math.PI * 2); g.ctx.fill();
    g.circle(cx, cy, 3, { fill: "#000", c: C.ink, w: 1 });
    g.callout("agujero negro central", cx, cy, 440, 66, {});
    // Sol en el brazo de Orión
    const ths = 1.1 + rot, rS = R * 0.52;
    const sx = cx + rS * Math.cos(ths), sy = cy + rS * Math.sin(ths) * 0.55;
    g.circle(sx, sy, 5, { fill: C.yellow });
    g.circle(sx, sy, 10, { c: C.yellow, w: 1.2 });
    g.line(cx, cy, sx, sy, { c: C.yellow, w: 1, dash: [3, 3] });
    g.callout("Sistema Solar (brazo de Orión)\n~25 800 años luz del núcleo", sx, sy, 440, 150, { c: C.yellow });
    g.dim(cx - R, 300, cx + R, 300, "~100 000 años luz", { c: C.dim });
    g.text("Galaxia espiral", 440, 222, { bold: true });
    g.text("Gira a ~230 km/s: una vuelta\nen ~225 millones de años\n(año galáctico)", 440, 260, { c: C.dim, size: 11 });
  },
  caption: "La Vía Láctea es una galaxia espiral; el Sistema Solar está en un brazo exterior, a mitad de camino entre el centro y el borde.",
});

FIG.def("escalaSolar", {
  title: "Cinturón de asteroides, cinturón de Kuiper y nube de Oort (escala logarítmica)",
  h: 260,
  draw(g) {
    const x0 = 40, x1 = 610, lo = -0.5, hi = 5.3; // log10(UA)
    const X = (au) => x0 + ((Math.log10(au) - lo) / (hi - lo)) * (x1 - x0);
    const y = 120;
    g.sun(X(0.32) - 14, y, 9);
    g.arrow(x0, y, x1 + 14, y, { c: C.dim, w: 1.2 });
    [0.1, 1, 10, 100, 1000, 10000, 100000].forEach((v) => {
      if (Math.log10(v) < lo) return;
      g.line(X(v), y - 4, X(v), y + 4, { c: C.dim });
      g.text(fmt.n(v) + " UA", X(v), y + 92, { c: C.dim, size: 10.5, align: "center" });
      g.line(X(v), y + 8, X(v), y + 80, { c: C.grid, w: 1 });
    });
    const band = (a, b, col, lab, yy, sub) => {
      g.rect(X(a), y - 14, X(b) - X(a), 28, { fill: col, fillAlpha: 0.3, c: col, w: 1 });
      g.text(lab, (X(a) + X(b)) / 2, yy, { c: col, size: 11.5, bold: true, align: "center" });
      if (sub) g.text(sub, (X(a) + X(b)) / 2, yy + 9, { c: C.dim, size: 10.5, align: "center", base: "top" });
    };
    band(2.2, 3.3, C.metal, "Asteroides", 54, "rocosos y metálicos");
    band(30, 100, C.teal, "Kuiper", 22, "helados · Plutón, Eris…\ncometas de período corto");
    band(2000, 126000, C.purple, "Nube de Oort", 40, "esfera de cuerpos helados\ncometas de período largo");
    [[0.39, "Me"], [0.72, "V"], [1, "T"], [1.52, "Ma"], [5.2, "J"], [9.5, "S"], [19.2, "U"], [30.1, "N"]].forEach(([a, n]) => {
      g.circle(X(a), y, n === "J" || n === "S" ? 5 : 3.2, { fill: C.ink });
      g.text(n, X(a), y + 24, { c: C.ink, size: 10, align: "center" });
    });
    g.line(X(100), y - 30, X(100), y + 30, { c: C.yellow, w: 1.5, dash: [3, 3] });
    g.text("heliopausa\n(~100 UA)", X(100) + 4, y + 50, { c: C.yellow, size: 10.5 });
    g.text("1 año luz ≈ 63 000 UA", x1, 248, { c: C.faint, size: 10.5, align: "right" });
  },
  caption: "Escala logarítmica: cada marca es 10 veces más lejos que la anterior. La heliopausa es el límite del viento solar; la nube de Oort, el límite gravitatorio.",
});
