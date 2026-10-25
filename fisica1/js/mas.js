/* ===== MAS: cinemática, dinámica/Hooke, energía ===== */
register('mas', (() => {
  let mcC, mcGraphC, mdC, meC, meGraphC;
  let tMC = 0, tMD = 0, tME = 0;

  function drawSpring(c, x1, y, x2, coils = 10) {
    const n = coils, amp = 9;
    c.beginPath(); c.moveTo(x1, y);
    const seg = (x2 - x1) / (n * 2);
    for (let i = 0; i < n * 2; i++) {
      const x = x1 + seg * (i + 1);
      c.lineTo(x, y + (i % 2 === 0 ? -amp : amp));
    }
    c.lineTo(x2, y);
    c.stroke();
  }

  /* ---- Cinemática: círculo de referencia + sombra ---- */
  function mcCalc(dt) {
    const A = val('mc-a'), w = val('mc-w');
    tMC += dt;
    const phi = w * tMC;
    const x = A * Math.sin(phi), v = A * w * Math.cos(phi);
    return { A, w, phi, x, v, T: 2 * Math.PI / w };
  }
  function drawMC(k) {
    const st = mcC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const cx = st.w * 0.22, cy = st.h * 0.5, R = Math.min(st.w * 0.17, st.h * 0.35);
    c.save(); c.strokeStyle = PAL.line; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI*2); c.stroke(); c.restore();
    const nx = cx + R * Math.cos(k.phi - Math.PI/2), ny = cy + R * Math.sin(k.phi - Math.PI/2);
    dot(c, nx, ny, 6, PAL.accent, PAL.sky);
    c.save(); c.strokeStyle = PAL.muted; line(c, cx, cy, nx, ny); c.restore();

    const trackY = st.h * 0.86, trackX0 = cx, trackX1 = st.w * 0.92;
    const sc = (trackX1 - trackX0 - 2*R) / (2 * k.A);
    const shx = cx + k.x * sc;
    c.save(); c.strokeStyle = alpha(PAL.line,0.7); c.setLineDash([3,3]); line(c, nx, ny, nx, trackY); line(c, trackX0, trackY, trackX1, trackY); c.restore();
    dot(c, shx, trackY, 9, PAL.accent2, PAL.sky);
    txt(c, 'sombra = x(t)', shx, trackY + 20, { align:'center', size: 10.5, color: PAL.accent2 });

    const gs = mcGraphC, gc = gs.ctx; if (!gs.w) return; clear(gs, PAL.sky);
    const win = 2 * k.T;
    const b = { x: 34, y: 18, w: gs.w - 46, h: gs.h - 34 };
    const { sx, sy } = plotFrame(gc, b, [0, win], [-1.15, 1.15], { nx: 4, ny: 2, yl: 'normalizado', xl: 't (s)' });
    const px1 = [], px2 = [];
    for (let i = 0; i <= 140; i++) { const t = win*i/140; px1.push([t, Math.sin(k.w*t)]); px2.push([t, Math.cos(k.w*t)]); }
    curve(gc, px1, sx, sy, PAL.accent, 2);
    curve(gc, px2, sx, sy, PAL.accent2, 2, [4,3]);
    const phase = tMC % win;
    dot(gc, sx(phase), sy(Math.sin(k.w*phase)), 4, PAL.accent, PAL.sky);
  }

  /* ---- Dinámica y Ley de Hooke ---- */
  function mdCalc(dt) {
    const k = val('md-k'), m = val('md-m'), x0 = val('md-x0');
    const w = Math.sqrt(k / m);
    tMD += dt;
    const x = x0 * Math.cos(w * tMD);
    const F = -k * x;
    return { k, m, x0, w, T: 2*Math.PI/w, x, F };
  }
  function drawMD(k) {
    const st = mdC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const wallX = st.w * 0.08, y = st.h * 0.5, eq = st.w * 0.55, sc = 300;
    c.save(); c.fillStyle = PAL.metal; c.fillRect(wallX - 8, y - 50, 8, 100); c.restore();
    const bx = eq + k.x * sc;
    c.save(); c.strokeStyle = PAL.muted; c.lineWidth = 2; drawSpring(c, wallX, y, bx - 22); c.restore();
    c.save(); c.strokeStyle = alpha(PAL.line,0.6); c.setLineDash([3,3]); line(c, eq, y-40, eq, y+40); c.restore();
    c.save(); c.fillStyle = PAL.accent; c.fillRect(bx - 22, y - 22, 44, 44); c.restore();
    const flen = clamp(Math.abs(k.F) * 1.2, 10, 80);
    if (Math.abs(k.F) > 0.05) arrow(c, bx, y, bx + Math.sign(k.F)*flen, y, PAL.bad, 2.5, 8);
    txt(c, 'equilibrio', eq, y + 56, { align: 'center', size: 10, color: PAL.muted });

    $('#md-f').textContent = fmt(k.F, 1) + ' N';
    $('#md-w').textContent = fmt(k.w, 2) + ' rad/s';
    $('#md-t').textContent = fmt(k.T, 2) + ' s';
  }

  /* ---- Energía ---- */
  function meCalc(dt) {
    const K = val('me-k'), A = val('me-a'), m = 1;
    const w = Math.sqrt(K / m);
    tME += dt;
    const x = A * Math.cos(w * tME);
    const Em = 0.5 * K * A * A, Ep = 0.5 * K * x * x, Ec = Em - Ep;
    return { K, A, m, w, T: 2*Math.PI/w, x, Em, Ep, Ec };
  }
  function drawME(k) {
    const st = meC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const wallX = st.w * 0.08, y = st.h * 0.3, eq = st.w * 0.55, sc = Math.min(220, (st.w*0.42)/Math.max(k.A,0.01));
    c.save(); c.fillStyle = PAL.metal; c.fillRect(wallX - 8, y - 36, 8, 72); c.restore();
    const bx = eq + k.x * sc;
    c.save(); c.strokeStyle = PAL.muted; c.lineWidth = 2; drawSpring(c, wallX, y, bx - 16); c.restore();
    c.save(); c.fillStyle = PAL.accent; c.fillRect(bx - 16, y - 16, 32, 32); c.restore();

    // barras de energía
    const by = st.h * 0.62, bh = st.h * 0.3, bw = st.w * 0.14;
    const maxE = k.Em || 1;
    const bars = [ ['Ep', k.Ep, PAL.accent2, st.w*0.18], ['Ec', k.Ec, PAL.good, st.w*0.40], ['Em', k.Em, PAL.muted, st.w*0.62] ];
    bars.forEach(([label, val_, color, bx0]) => {
      const h = (val_ / maxE) * bh;
      c.save(); c.fillStyle = alpha(color, 0.85); c.fillRect(bx0, by + bh - h, bw, h); c.restore();
      txt(c, label, bx0 + bw/2, by + bh + 16, { align: 'center', size: 11, color, weight: 700 });
      txt(c, fmt(val_,2)+' J', bx0 + bw/2, by + bh - h - 6, { align: 'center', size: 10, color });
    });

    $('#me-em').textContent = fmt(k.Em, 2) + ' J';
    $('#me-ep').textContent = fmt(k.Ep, 2) + ' J';
    $('#me-ec').textContent = fmt(k.Ec, 2) + ' J';

    const gs = meGraphC, gc = gs.ctx; if (!gs.w) return; clear(gs, PAL.sky);
    const b = { x: 40, y: 18, w: gs.w - 52, h: gs.h - 32 };
    const { sx, sy } = plotFrame(gc, b, [-k.A, k.A], [0, k.Em*1.05], { nx: 4, ny: 3, yl: 'E (J)', xl: 'x (m)' });
    const ep = [], em = [];
    for (let i = 0; i <= 80; i++) { const x = -k.A + 2*k.A*i/80; ep.push([x, 0.5*k.K*x*x]); em.push([x, k.Em]); }
    curve(gc, em, sx, sy, PAL.muted, 1.5, [4,3]);
    curve(gc, ep, sx, sy, PAL.accent2, 2);
    dot(gc, sx(k.x), sy(k.Ep), 4, PAL.accent2, PAL.sky);
    dot(gc, sx(k.x), sy(k.Em), 4, PAL.good, PAL.sky);
  }

  return {
    init() {
      mcC = makeCanvas('mc-canvas', 0.5); mcGraphC = makeCanvas('mc-graph', 0.32);
      mdC = makeCanvas('md-canvas', 0.42);
      meC = makeCanvas('me-canvas', 0.5); meGraphC = makeCanvas('me-graph', 0.42);
    },
    frame(dt) { drawMC(mcCalc(dt)); drawMD(mdCalc(dt)); drawME(meCalc(dt)); }
  };
})());
