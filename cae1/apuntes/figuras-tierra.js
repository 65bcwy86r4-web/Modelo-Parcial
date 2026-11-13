// Figuras de los temas 6 y 7: la Tierra, sus movimientos y las leyes de Kepler.

// Esfera con eje inclinado `tilt` (grados, positivo = polo norte hacia la izquierda/Sol).
// bands: [[latMin, latMax, color, alpha]] ; lines: [[lat, color, label]]
function drawTiltedEarth(g, x, y, R, tilt, o = {}) {
  const c = g.ctx;
  c.save(); c.translate(x, y); c.rotate((-tilt * Math.PI) / 180);
  c.beginPath(); c.arc(0, 0, R, 0, Math.PI * 2); c.save(); c.clip();
  const gr = c.createRadialGradient(-R * 0.3, -R * 0.3, R * 0.1, 0, 0, R);
  gr.addColorStop(0, "#4f8cc6"); gr.addColorStop(1, "#1d4a77");
  c.fillStyle = gr; c.fillRect(-R, -R, 2 * R, 2 * R);
  (o.bands || []).forEach(([a, b, col, al]) => {
    const y1 = -R * Math.sin((b * Math.PI) / 180), y2 = -R * Math.sin((a * Math.PI) / 180);
    c.globalAlpha = al ?? 0.35; c.fillStyle = col; c.fillRect(-R, y1, 2 * R, y2 - y1); c.globalAlpha = 1;
  });
  c.restore();
  (o.lines || []).forEach(([lat, col, lab, dash]) => {
    const yy = -R * Math.sin((lat * Math.PI) / 180), hw = R * Math.cos((lat * Math.PI) / 180);
    c.strokeStyle = col; c.lineWidth = 1.4; c.setLineDash(dash || []);
    c.beginPath(); c.moveTo(-hw, yy); c.lineTo(hw, yy); c.stroke(); c.setLineDash([]);
    if (lab) {
      c.save(); c.translate(hw + 6, yy); c.rotate((tilt * Math.PI) / 180);
      c.fillStyle = col; c.font = `500 11px Inter, system-ui, sans-serif`; c.textBaseline = "middle"; c.fillText(lab, 0, 0); c.restore();
    }
  });
  c.strokeStyle = C.ink; c.lineWidth = 1.4; c.setLineDash([4, 3]);
  c.beginPath(); c.moveTo(0, -R - 26); c.lineTo(0, R + 26); c.stroke(); c.setLineDash([]);
  c.fillStyle = C.ink; c.font = "700 11px Inter, system-ui, sans-serif"; c.textAlign = "center";
  c.fillText("N", 0, -R - 34); c.fillText("S", 0, R + 40);
  c.restore();
  if (o.night) { // mitad nocturna a la derecha (Sol a la izquierda)
    c.save(); c.beginPath(); c.arc(x, y, R + 0.5, -Math.PI / 2, Math.PI / 2); c.fillStyle = "rgba(0,0,0,0.55)"; c.fill(); c.restore();
  }
}

/* ======================= TEMA 6 ======================= */
FIG.def("traslacion", {
  title: "Traslación: perihelio y afelio (excentricidad exagerada)",
  h: 320, anim: true,
  draw(g, s, t) {
    const a = 150, e = 0.28, b = a * Math.sqrt(1 - e * e), cx = 320, cy = 160, fx = cx - a * e;
    g.ellipse(cx, cy, a, b, 0, { c: C.faint, w: 1.4 });
    g.sun(fx, cy, 18);
    g.text("Sol", fx, cy + 34, { c: C.yellow, size: 11, align: "center" });
    const peri = [cx - a, cy], afe = [cx + a, cy];
    g.circle(...peri, 7, { fill: C.blue }); g.circle(...afe, 7, { fill: C.blue });
    g.text("Perihelio\nprincipios de enero\n~147 millones de km\n30,3 km/s", peri[0] - 14, cy, { size: 11, align: "right" });
    g.text("Afelio\nprincipios de julio\n~152 millones de km\n29,3 km/s", afe[0] + 14, cy, { size: 11 });
    const M = (t * 0.7) % (2 * Math.PI), E = GEO.kepler(M, e);
    const px = cx - a * Math.cos(E), py = cy + b * Math.sin(E);
    g.earth(px, py, 10, { land: false });
    const tx = a * Math.sin(E), ty = b * Math.cos(E), tl = Math.hypot(tx, ty);
    const r = Math.hypot(px - fx, py - cy), v = Math.sqrt(2 / r - 1 / a) * Math.sqrt(a) * 26;
    g.arrow(px, py, px + (tx / tl) * v, py + (ty / tl) * v, { c: C.accent2, w: 2 });
    g.text("365,25 días por vuelta (año bisiesto cada 4)", 320, 312, { c: C.dim, size: 11, align: "center" });
    g.text("Rotación: de oeste a este, 24 h", 22, 24, { c: C.dim, size: 11 });
  },
  caption: "Órbita casi circular (e ≈ 0,017; aquí exagerada). Por la 2.ª ley de Kepler la Tierra va más rápido en el perihelio que en el afelio, y por eso las estaciones no duran exactamente lo mismo.",
});

FIG.def("estacionesAnio", {
  title: "Las estaciones: inclinación del eje a lo largo del año",
  h: 330,
  controls: [{ type: "range", key: "d", label: "Día del año", min: 0, max: 364, step: 1, value: 171, fmt: (v) => FIG_fecha(v) }],
  calc(s) {
    const al = Math.PI + (2 * Math.PI * (s.d - 172)) / 365;
    const dec = -23.44 * Math.cos(al);
    return { al, dec };
  },
  draw(g, s) {
    const { al, dec } = this.calc(s);
    // vista superior
    const cx = 150, cy = 165, R = 105;
    g.text("Vista desde el polo norte de la eclíptica", cx, 22, { c: C.dim, size: 10.5, align: "center" });
    g.ellipse(cx, cy, R, R * 0.92, 0, { c: C.faint, w: 1 });
    g.sun(cx, cy, 14);
    [[172, "21 jun"], [266, "23 sep"], [355, "21 dic"], [79, "21 mar"]].forEach(([d, l]) => {
      const a = Math.PI + (2 * Math.PI * (d - 172)) / 365;
      const x = cx + R * Math.cos(a), y = cy - R * 0.92 * Math.sin(a);
      g.circle(x, y, 3, { fill: C.faint });
      g.text(l, cx + (R + 22) * Math.cos(a), cy - (R * 0.92 + 16) * Math.sin(a), { c: C.dim, size: 10.5, align: "center" });
    });
    const ex = cx + R * Math.cos(al), ey = cy - R * 0.92 * Math.sin(al);
    g.earth(ex, ey, 9, { land: false });
    g.arrow(ex, ey, ex + 20, ey, { c: C.ink, w: 1.4, head: 6 });
    g.text("eje (dirección fija)", 22, 312, { c: C.dim, size: 10.5 });
    g.arrow(130, 312, 150, 312, { c: C.ink, w: 1.4, head: 6 });
    // vista lateral
    const sx = 470, sy = 168, ER = 92;
    for (let i = -3; i <= 3; i++) g.arrow(300, sy + i * 26, sx - ER - 12, sy + i * 26, { c: C.yellow, w: 1, alpha: 0.5, head: 6 });
    g.text("rayos solares", 304, sy - 96, { c: C.yellow, size: 10.5 });
    drawTiltedEarth(g, sx, sy, ER, dec, {
      night: true,
      lines: [[0, C.ink, "ecuador"], [23.44, C.accent2, "", [3, 3]], [-23.44, C.accent2, "", [3, 3]], [66.56, C.teal, "", [3, 3]], [-66.56, C.teal, "", [3, 3]], [-34.6, C.red, ""]],
    });
    g.circle(sx - ER, sy, 5, { fill: C.yellow });
    g.text("Sol en el cenit", sx - ER - 10, sy - 14, { c: C.yellow, size: 10.5, align: "right" });
    g.text("- - trópicos", 340, 300, { c: C.accent2, size: 10.5 });
    g.text("- - círculos polares", 340, 318, { c: C.teal, size: 10.5 });
    g.text("— Buenos Aires (34,6° S)", 470, 300, { c: C.red, size: 10.5 });
  },
  info(s) {
    const { dec } = this.calc(s);
    const phi = (-34.6 * Math.PI) / 180, d = (dec * Math.PI) / 180;
    const H = Math.acos(GEO.clamp(-Math.tan(phi) * Math.tan(d), -1, 1));
    const horas = (2 * H * 12) / Math.PI;
    let est;
    if (Math.abs(dec) < 2) est = "Cerca de un equinoccio: día y noche de ~12 h en todo el planeta";
    else if (dec > 0) est = dec > 21 ? "Solsticio de junio: verano en el norte, invierno en el sur" : "El Sol está al norte del ecuador";
    else est = dec < -21 ? "Solsticio de diciembre: verano en el sur, invierno en el norte" : "El Sol está al sur del ecuador";
    return `<span>Declinación solar: <b>${fmt.n(dec, 1)}°</b></span><span>Duración del día en Buenos Aires: <b>${fmt.n(Math.floor(horas))} h ${fmt.n(Math.round((horas % 1) * 60))} min</b></span><span>${est}</span>`;
  },
  caption: "El eje (~23,5°) mantiene su dirección durante la traslación: cambia el ángulo de incidencia de los rayos y la duración del día en cada hemisferio. No es la distancia al Sol (el verano austral coincide con el perihelio).",
});

function FIG_fecha(d) {
  const m = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], L = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let i = 0; while (d >= L[i]) { d -= L[i]; i++; }
  return `${d + 1} ${m[i]}`;
}

FIG.def("paralelos", {
  title: "Trópicos y círculos polares según la inclinación del eje",
  h: 320,
  controls: [{ type: "range", key: "eps", label: "Inclinación ε", min: 0, max: 45, step: 0.5, value: 23.5, fmt: (v) => fmt.n(v, 1) + "°" }],
  draw(g, s) {
    const e = s.eps, x = 250, y = 160, R = 112;
    for (let i = -4; i <= 4; i++) g.arrow(20, y + i * 26, x - R - 14, y + i * 26, { c: C.yellow, w: 1, alpha: 0.45, head: 6 });
    g.text("Sol (solsticio de junio)", 24, 22, { c: C.yellow, size: 10.5 });
    drawTiltedEarth(g, x, y, R, e, {
      night: true,
      bands: [[-e, e, C.red, 0.35], [e, 90 - e, C.green, 0.22], [-(90 - e), -e, C.green, 0.22], [90 - e, 90, C.teal, 0.4], [-90, -(90 - e), C.teal, 0.4]],
      lines: [[0, C.ink, ""], [e, C.accent2, ""], [-e, C.accent2, ""], [90 - e, C.teal, ""], [-(90 - e), C.teal, ""]],
    });
    const lx = 410;
    const items = [
      [C.teal, "Círculo polar ártico", `${fmt.n(90 - e, 1)}° N`],
      [C.accent2, "Trópico de Cáncer", `${fmt.n(e, 1)}° N`],
      [C.ink, "Ecuador", "0°"],
      [C.accent2, "Trópico de Capricornio", `${fmt.n(e, 1)}° S`],
      [C.teal, "Círculo polar antártico", `${fmt.n(90 - e, 1)}° S`],
    ];
    items.forEach(([col, n, v], i) => {
      g.line(lx, 52 + i * 34, lx + 18, 52 + i * 34, { c: col, w: 2 });
      g.text(n, lx + 26, 52 + i * 34, { size: 11.5 });
      g.text(v, 630, 52 + i * 34, { size: 11.5, bold: true, align: "right", c: col });
    });
    [[C.red, "zona tórrida"], [C.green, "zonas templadas"], [C.teal, "zonas polares"]].forEach(([col, n], i) => {
      g.rect(lx, 232 + i * 22, 12, 12, { fill: col, fillAlpha: 0.6, c: null, r: 3 });
      g.text(n, lx + 20, 238 + i * 22, { c: C.dim, size: 11 });
    });
  },
  caption: "Trópicos: ±ε, las latitudes máximas donde el Sol llega al cenit. Círculos polares: ±(90° − ε), donde hay al menos un día sin noche y uno sin día. Si cambia la inclinación, se mueven con ella.",
});

FIG.def("precesion", {
  title: "Precesión, nutación y ciclos de Milankovitch",
  h: 320, anim: true, still: 3,
  draw(g, s, t) {
    const x = 150, y = 180, R = 70, L = 130, tilt = 23.5 * Math.PI / 180;
    const ph = t * 0.6, nut = 0.035 * Math.sin(t * 7);
    // cono
    const top = y - L * Math.cos(tilt), rad = L * Math.sin(tilt);
    g.ellipse(x, top, rad, rad * 0.28, 0, { c: C.purple, w: 1.3, dash: [4, 3] });
    g.line(x, y, x - rad, top, { c: C.faint, w: 1 }); g.line(x, y, x + rad, top, { c: C.faint, w: 1 });
    g.line(x, y + 60, x, top - 30, { c: C.faint, w: 1, dash: [2, 4] });
    g.text("perpendicular a la eclíptica", x + 6, top - 34, { c: C.faint, size: 10 });
    g.ellipse(x, y, R + 4, R * 0.42, 0, { fill: "rgba(232,207,106,0.06)", c: null });
    g.earth(x, y, R);
    g.ellipse(x, y, R, R * 0.2, 0, { c: "rgba(255,255,255,0.45)", w: 1.2 });
    g.callout("abultamiento\necuatorial", x + R - 6, y + 8, x + R + 30, y + 60, { c: C.dim, size: 10.5 });
    const tl = tilt + nut;
    const ax = x + L * Math.sin(tl) * Math.cos(ph), ay = y - L * Math.cos(tl) + L * Math.sin(tl) * Math.sin(ph) * 0.28;
    g.line(x - (ax - x) * 0.7, y - (ay - y) * 0.7, ax, ay, { c: C.ink, w: 2 });
    g.circle(ax, ay, 4, { fill: C.accent2 });
    g.text("eje terrestre", ax + 8, ay - 8, { c: C.accent2, size: 10.5 });
    g.text("Precesión: cono en ~26 000 años", 20, 290, { c: C.purple, size: 11.5, bold: true });
    g.text("Nutación: oscilación de ~18,6 años (Luna)", 20, 308, { c: C.dim, size: 11 });
    // Milankovitch
    const bx = 340, bw = 270;
    g.text("Ciclos de Milankovitch", bx, 28, { bold: true });
    [["Excentricidad", "~100 000 años", 100, C.accent], ["Oblicuidad (22,1°–24,5°)", "~41 000 años", 41, C.teal], ["Precesión", "~26 000 años", 26, C.purple]].forEach(([n, p, per, col], i) => {
      const y0 = 78 + i * 76;
      g.text(n, bx, y0 - 26, { c: col, size: 11.5, bold: true });
      g.text(p, bx + bw, y0 - 26, { c: C.dim, size: 11, align: "right" });
      g.line(bx, y0, bx + bw, y0, { c: C.grid });
      const P = []; for (let k = 0; k <= 200; k++) { const xx = (k / 200) * 400; P.push([bx + (k / 200) * bw, y0 - 16 * Math.sin((2 * Math.PI * xx) / per)]); }
      g.path(P, { c: col, w: 1.8 });
    });
    g.text("Ventana de 400 000 años. Modulan la radiación por\nlatitud y estación: se correlacionan con las glaciaciones.", bx, 284, { c: C.dim, size: 10.5 });
  },
  caption: "El Sol y la Luna atraen el abultamiento ecuatorial intentando alinearlo con la eclíptica; el eje responde como un trompo. La precesión cambia la estrella polar y desplaza los equinoccios.",
});

FIG.def("geoide", {
  title: "Forma real de la Tierra y variación de g",
  h: 300,
  draw(g) {
    const x = 170, y = 150, a = 120, b = 96; // achatamiento exagerado
    g.circle(x, y, a, { c: C.faint, w: 1, dash: [4, 4] });
    g.ellipse(x, y, a, b, 0, { fill: "#1d4a77", c: C.blue, w: 1.5 });
    const P = []; for (let k = 0; k <= 120; k++) { const th = (k / 120) * Math.PI * 2; const r = 1 + 0.05 * Math.sin(3 * th) + 0.03 * Math.cos(5 * th); P.push([x + a * r * 0.97 * Math.cos(th), y + b * r * 0.97 * Math.sin(th)]); }
    g.smooth(P, { c: C.green, w: 1.6 });
    g.dim(x, y, x + a, y, "6 378 km", { c: C.ink, dy: -10 });
    g.dim(x, y, x, y - b, "6 357 km", { c: C.ink, dx: 36 });
    g.arrow(x, y - b - 4, x, y - b + 40, { c: C.red, w: 3 });
    g.text("g mayor", x + 10, y - b - 14, { c: C.red, size: 11.5, bold: true });
    g.arrow(x - a - 4, y, x - a + 26, y, { c: C.red, w: 2 });
    g.arrow(x - a + 4, y + 12, x - a - 26, y + 12, { c: C.purple, w: 2 });
    g.text("g menor\n+ fuerza centrífuga", x - a - 6, y + 46, { c: C.dim, size: 10.5 });
    g.text("esfera", x + a * 0.72, y - a * 0.75, { c: C.faint, size: 10.5 });
    g.text("elipsoide (achatado en los polos)", 360, 70, { c: C.blue, size: 12, bold: true });
    g.text("Radio medio de cálculo: 6 371 km", 360, 92, { c: C.dim, size: 11 });
    g.text("geoide", 360, 130, { c: C.green, size: 12, bold: true });
    g.text("superficie equipotencial = nivel medio del mar\nprolongado bajo los continentes; se aparta\nhasta ±100 m del elipsoide (exagerado acá)", 360, 168, { c: C.dim, size: 11 });
    g.text("g = GM/r² varía con:", 360, 222, { c: C.ink, size: 12, bold: true });
    g.text("1. latitud (radio y fuerza centrífuga)\n2. altitud (1/r²)\n3. densidad local de la corteza", 360, 260, { c: C.dim, size: 11 });
  },
  caption: "Achatamiento y ondulaciones exagerados para que se vean. En los polos el radio es menor y no hay fuerza centrífuga: g es mayor que en el ecuador.",
});

FIG.def("gravedad", {
  title: "Campo gravitatorio y energía potencial con la distancia",
  h: 280,
  controls: [{ type: "range", key: "h", label: "Altitud h", min: 0, max: 36000, step: 100, value: 400, fmt: (v) => fmt.n(v) + " km" }],
  draw(g, s) {
    const r = (RT + s.h) / RT;
    const P = g.plot([60, 40, 230, 180], [1, 7], [0, 10], { xt: [1, 2, 3, 4, 5, 6, 7], yt: [0, 2, 4, 6, 8, 10], fx: (v) => v + "R", xl: "r", yl: "g [m/s²]" });
    const pts = []; for (let x = 1; x <= 7; x += 0.05) pts.push([P.X(x), P.Y(9.81 / (x * x))]);
    g.path(pts, { c: C.blue, w: 2.2 });
    if (r <= 7) g.circle(P.X(r), P.Y(9.81 / (r * r)), 6, { fill: C.accent2 });
    const Q = g.plot([370, 40, 230, 180], [1, 7], [-1, 0], { xt: [1, 2, 3, 4, 5, 6, 7], yt: [-1, -0.5, 0], fx: (v) => v + "R", fy: (v) => (v === 0 ? "0" : v === -1 ? "−GMm/R" : ""), xl: "r", yl: "E_p", xlDy: 30 });
    const p2 = []; for (let x = 1; x <= 7; x += 0.05) p2.push([Q.X(x), Q.Y(-1 / x)]);
    g.path(p2, { c: C.purple, w: 2.2 });
    if (r <= 7) g.circle(Q.X(r), Q.Y(-1 / r), 6, { fill: C.accent2 });
    g.text("cero en el infinito", Q.X(7), Q.Y(0) - 10, { c: C.dim, size: 10.5, align: "right" });
  },
  info(s) {
    const r = RT + s.h;
    return `<span>r = ${fmt.n(r)} km</span><span>g = 9,81·(R/r)² = <b>${fmt.n(9.81 * (RT / r) ** 2, 2)} m/s²</b></span><span>E_p = <b>${fmt.n(-RT / r, 3)}</b>·GMm/R</span>`;
  },
  caption: "g = GM/r² disminuye con el cuadrado de la distancia; E_p = −GMm/r es negativa y aumenta (se hace menos negativa) al alejarse. Cerca de la superficie: ΔE_p ≈ m·g·h.",
});

/* ======================= TEMA 7 ======================= */
FIG.def("keplerAreas", {
  title: "1.ª y 2.ª ley de Kepler: elipse con el Sol en un foco, áreas iguales en tiempos iguales",
  h: 330, anim: true,
  controls: [{ type: "range", key: "e", label: "Excentricidad e", min: 0, max: 0.8, step: 0.01, value: 0.55, fmt: (v) => fmt.n(v, 2) }],
  draw(g, s, t) {
    const a = 148, e = s.e, b = a * Math.sqrt(1 - e * e), cx = 320, cy = 160, fx = cx - a * e;
    const pos = (M) => { const E = GEO.kepler(M, e); return [cx - a * Math.cos(E), cy - b * Math.sin(E)]; };
    const N = 12;
    for (let i = 0; i < N; i += 2) {
      const P = [[fx, cy]];
      for (let k = 0; k <= 20; k++) P.push(pos(((i + k / 20) / N) * 2 * Math.PI));
      g.path(P, { fill: i % 4 === 0 ? C.accent : C.blue, fillAlpha: 0.35, c: null, close: true });
    }
    g.ellipse(cx, cy, a, b, 0, { c: C.ink, w: 1.4 });
    for (let i = 0; i < N; i++) { const [x, y] = pos((i / N) * 2 * Math.PI); g.line(fx, cy, x, y, { c: C.faint, w: 0.8 }); g.circle(x, y, 2.4, { fill: C.dim }); }
    g.sun(fx, cy, 12);
    g.text("Perihelio", cx - a - 8, cy, { c: C.ink, size: 11.5, align: "right", bold: true });
    g.text("Afelio", cx + a + 8, cy, { c: C.ink, size: 11.5, bold: true });
    const M = (t * 0.5) % (2 * Math.PI); const [px, py] = pos(M);
    g.line(fx, cy, px, py, { c: C.accent2, w: 1.5 });
    g.circle(px, py, 6, { fill: C.accent2 });
    g.text("Cada sector se barre en el mismo tiempo (1/12 del período)", 320, 320, { c: C.dim, size: 11, align: "center" });
  },
  info(s) {
    const e = s.e;
    return `<span>v_P / v_A = (1 + e)/(1 − e) = <b>${fmt.n((1 + e) / (1 - e), 2)}</b></span><span>r_P·v_P = r_A·v_A (se conserva el momento angular)</span>`;
  },
  caption: "La gravedad es una fuerza central: no produce momento y se conserva el momento angular. Por eso el planeta va más rápido cerca del perihelio (sectores cortos y anchos) y más lento cerca del afelio.",
});

FIG.def("kepler3", {
  title: "3.ª ley de Kepler: T² / a³ = cte (escala logarítmica)",
  h: 300,
  draw(g) {
    const pl = [["Mercurio", 0.387, 0.241], ["Venus", 0.723, 0.615], ["Tierra", 1, 1], ["Marte", 1.524, 1.881], ["Júpiter", 5.203, 11.86], ["Saturno", 9.537, 29.46], ["Urano", 19.19, 84.01], ["Neptuno", 30.07, 164.8]];
    const lx = (v) => Math.log10(v), P = g.plot([80, 30, 480, 210], [-0.6, 1.6], [-0.8, 2.4], { xt: [-0.5, 0, 0.5, 1, 1.5], yt: [-0.5, 0, 0.5, 1, 1.5, 2], fx: (v) => fmt.n(10 ** v, v < 0 ? 2 : v < 1 ? 1 : 0), fy: (v) => fmt.n(10 ** v, v < 0 ? 2 : v < 1 ? 1 : 0), xl: "a [UA]", yl: "T [años]" });
    g.line(P.X(-0.6), P.Y(-0.9), P.X(1.6), P.Y(2.4), { c: C.accent, w: 1.6, dash: [6, 4] });
    pl.forEach(([n, a, T], i) => {
      g.circle(P.X(lx(a)), P.Y(lx(T)), 5, { fill: C.blue });
      g.text(n, P.X(lx(a)) + (i % 2 ? 10 : -10), P.Y(lx(T)) + (i % 2 ? 10 : -10), { c: C.ink, size: 10.5, align: i % 2 ? "left" : "right" });
    });
    g.text("pendiente 3/2:  T² = a³", 110, 40, { c: C.accent, size: 12, bold: true });
    g.text("(T en años, a en UA)", 110, 60, { c: C.dim, size: 10.5 });
  },
  caption: "Todos los planetas caen sobre la misma recta porque comparten la constante 4π²/GM, que depende solo de la masa del Sol. Ejemplo: Marte (a = 1,52 UA) tarda 1,88 años.",
});
