/* ===== Cuerpo rígido: cinemática + equilibrio estático ===== */
register('cuerpo', (() => {
  let crC, esC, angle = 0;

  /* ---- Cinemática ---- */
  function crCalc() {
    const tipo = seg('cr-tipo');
    let v0 = val('cr-v0'), w = val('cr-w');
    if (tipo === 'trasl') w = 0;
    if (tipo === 'rot') v0 = 0;
    return { tipo, v0, w };
  }
  function velAt(rWorld, v0, w) {
    // v = v0(x) + w x r  (2D, w en z)
    return [v0 - w * rWorld[1], w * rWorld[0]];
  }
  function drawCR(k, dt) {
    const st = crC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    angle += k.w * dt;
    const cx = st.w * 0.38, cy = st.h * 0.52, sc = Math.min(st.w, st.h) * 0.28;
    const bodyPts = { A: [-0.9, -0.55], B: [0.9, 0.4], C: [0, 0] };
    const world = {};
    for (const key in bodyPts) world[key] = rot(bodyPts[key], 0, 0, angle);

    // placa
    c.save();
    c.fillStyle = alpha(PAL.surface2, 1); c.strokeStyle = PAL.line; c.lineWidth = 1.5;
    const poly4 = [[-0.9,-0.55],[0.9,-0.55],[0.9,0.4],[-0.9,0.4]].map(p => rot(p,0,0,angle));
    poly(c, poly4.map(p => [cx + p[0]*sc, cy + p[1]*sc]), true); c.fill(); c.stroke();
    c.restore();

    // puntos + vectores velocidad
    const scaleV = 22;
    ['A','B','C'].forEach(key => {
      const wp = world[key];
      const px = cx + wp[0]*sc, py = cy + wp[1]*sc;
      const v = velAt(wp, k.v0, k.w);
      dot(c, px, py, 4, PAL.ink, PAL.sky);
      txt(c, key, px + 8, py - 8, { size: 11, weight: 700, color: PAL.ink });
      const vLen = Math.hypot(v[0], v[1]);
      if (vLen > 0.02) arrow(c, px, py, px + v[0]*scaleV, py - v[1]*scaleV, PAL.accent, 2.5, 8);
    });

    // CIR
    let cirTxt = 'en el infinito (traslación pura)';
    if (Math.abs(k.w) > 1e-3) {
      const ry = k.v0 / k.w; // relativo a C, en marco mundo (no rota con el cuerpo)
      const px = cx + 0 * sc, py = cy - ry * sc;
      if (Math.abs(ry) * sc < Math.max(st.w, st.h) * 1.2) {
        dot(c, px, py, 5, PAL.accent2, PAL.sky);
        txt(c, 'CIR', px + 8, py + 4, { size: 11, weight: 700, color: PAL.accent2 });
      }
      cirTxt = `a ${fmt(Math.abs(ry), 2)} m de C`;
    }

    $('#cr-va').textContent = fmt(Math.hypot(...velAt(world.A, k.v0, k.w)), 2) + ' m/s';
    $('#cr-vb').textContent = fmt(Math.hypot(...velAt(world.B, k.v0, k.w)), 2) + ' m/s';
    $('#cr-vc').textContent = fmt(k.v0, 2) + ' m/s';
    $('#cr-cir').textContent = cirTxt;
    const labels = { trasl: 'Traslación pura: todos los puntos tienen la misma velocidad.', rot: 'Rotación pura: existe un punto del eje con velocidad nula (el CIR coincide con C).', general: 'Rototraslación general: el CIR existe en cada instante pero se desplaza.' };
    $('#cr-status').textContent = labels[k.tipo];
  }

  /* ---- Equilibrio estático ---- */
  function esCalc() {
    const xPct = val('es-x') / 100, W = val('es-w'), ang = val('es-ang') * D2R;
    const barL = 3;
    const xw = xPct * barL;
    const T = (W * xw) / (barL * Math.sin(ang));
    const Ax = T * Math.cos(ang);
    const Ay = W - T * Math.sin(ang);
    return { xPct, W, ang, barL, xw, T, Ax, Ay };
  }
  function drawES(k) {
    const st = esC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const Ax0 = st.w * 0.12, Bx0 = st.w * 0.82, y0 = st.h * 0.55;
    const toX = f => Ax0 + f * (Bx0 - Ax0);

    // techo
    c.save(); c.strokeStyle = PAL.line; c.lineWidth = 1.5;
    line(c, 0, 8, st.w, 8);
    c.restore();

    // cable de B hacia el techo
    const bx = Bx0, by = y0;
    const cableLen = by - 8;
    const topx = bx - cableLen / Math.tan(k.ang);
    c.save(); c.strokeStyle = PAL.accent2; c.lineWidth = 2.5; line(c, topx, 8, bx, by); c.restore();

    // barra
    c.save(); c.strokeStyle = PAL.metal; c.lineWidth = 8; c.lineCap = 'round'; line(c, Ax0, y0, Bx0, y0); c.restore();

    // pivote en A (triángulo)
    c.save(); c.fillStyle = PAL.ink;
    poly(c, [[Ax0, y0], [Ax0 - 12, y0 + 20], [Ax0 + 12, y0 + 20]], true); c.fill();
    c.restore();
    txt(c, 'A', Ax0 - 4, y0 - 14, { weight: 700, size: 12, color: PAL.ink });
    txt(c, 'B', Bx0 - 4, y0 - 14, { weight: 700, size: 12, color: PAL.ink });

    // peso
    const wx = toX(k.xPct);
    c.save(); c.strokeStyle = PAL.line; c.lineWidth = 1.5; line(c, wx, y0, wx, y0 + 26); c.restore();
    dot(c, wx, y0 + 34, 9, PAL.bad, PAL.sky);
    arrow(c, wx, y0 + 34, wx, y0 + 34 + clamp(k.W * 0.3, 20, 90), PAL.bad, 2.5, 8);
    txt(c, `W=${fmt(k.W,0)} N`, wx, y0 + 34 + clamp(k.W*0.3,20,90) + 14, { align:'center', size: 11, color: PAL.bad, weight: 600 });

    // tensión (a lo largo del cable, desde B)
    const tLen = clamp(k.T * 0.3, 20, 90);
    const dirx = (topx - bx), diry = (8 - by), dl = Math.hypot(dirx, diry);
    arrow(c, bx, by, bx + dirx/dl*tLen, by + diry/dl*tLen, PAL.accent, 2.5, 8);
    txt(c, `T=${fmt(k.T,0)} N`, bx + dirx/dl*tLen + 6, by + diry/dl*tLen, { size: 11, color: PAL.accent, weight: 600 });

    // reacciones en A
    const axLen = clamp(k.Ax * 0.3, 14, 70);
    arrow(c, Ax0, y0, Ax0 - axLen, y0, PAL.good, 2.5, 7);
    const ayLen = clamp(k.Ay * 0.3, 14, 70);
    arrow(c, Ax0, y0, Ax0, y0 - ayLen, PAL.good, 2.5, 7);
    txt(c, 'reacciones en A', clamp(Ax0 - axLen - 6, 4, st.w - 4), y0 - ayLen - 12, { size: 10, color: PAL.good, align: 'left' });

    $('#es-t').textContent = fmt(k.T, 0) + ' N';
    $('#es-ax').textContent = fmt(k.Ax, 0) + ' N';
    $('#es-ay').textContent = fmt(k.Ay, 0) + ' N';
  }

  return {
    init() { crC = makeCanvas('cr-canvas', 0.56); esC = makeCanvas('es-canvas', 0.5); },
    frame(dt) { drawCR(crCalc(), dt); drawES(esCalc()); }
  };
})());
