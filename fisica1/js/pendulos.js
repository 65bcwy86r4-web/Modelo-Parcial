/* ===== Péndulo simple y péndulo físico ===== */
register('pendulos', (() => {
  let psC, psGraphC, pfC;
  let tPS = 0, tPF = 0;

  /* ---- Péndulo simple ---- */
  function psCalc(dt) {
    const l = val('ps-l'), a0 = val('ps-a') * D2R;
    const w = Math.sqrt(G0 / l), T = 2 * Math.PI / w;
    tPS += dt;
    const theta = a0 * Math.sin(w * tPS);
    return { l, a0, w, T, theta };
  }
  function drawPS(k) {
    const st = psC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const ox = st.w * 0.5, oy = st.h * 0.1;
    const Lpx = Math.min(st.h * 0.75, st.w * 0.42);
    const bx = ox + Lpx * Math.sin(k.theta), by = oy + Lpx * Math.cos(k.theta);
    dot(c, ox, oy, 4, PAL.ink);
    c.save(); c.strokeStyle = PAL.muted; c.lineWidth = 2; line(c, ox, oy, bx, by); c.restore();
    dot(c, bx, by, 14, PAL.accent, PAL.sky);
    // arco de amplitud
    c.save(); c.strokeStyle = alpha(PAL.accent2, 0.5); c.setLineDash([3,3]); c.lineWidth = 1.5;
    c.beginPath(); c.arc(ox, oy, Lpx, Math.PI/2 - k.a0, Math.PI/2 + k.a0); c.stroke(); c.restore();
    txt(c, `θ = ${fmt(k.theta*R2D,1)}°`, bx + 20, by, { size: 11, color: PAL.ink, weight: 600 });

    $('#ps-t').textContent = fmt(k.T, 2) + ' s';
    $('#ps-f').textContent = fmt(1/k.T, 2) + ' Hz';
    $('#ps-w').textContent = fmt(k.w, 2) + ' rad/s';

    // gráfico θ(t)
    const gs = psGraphC, gc = gs.ctx; if (!gs.w) return; clear(gs, PAL.sky);
    const win = 2 * k.T;
    const b = { x: 34, y: 18, w: gs.w - 46, h: gs.h - 34 };
    const { sx, sy } = plotFrame(gc, b, [0, win], [-k.a0*R2D, k.a0*R2D], { nx: 4, ny: 2, yl: 'θ (°)', xl: 't (s)' });
    const pts = []; for (let i = 0; i <= 120; i++) { const t = win * i / 120; pts.push([t, k.a0*R2D*Math.sin(k.w*t)]); }
    curve(gc, pts, sx, sy, PAL.accent, 2);
    const phase = tPS % win;
    dot(gc, sx(phase), sy(k.theta*R2D), 4, PAL.accent2, PAL.sky);
  }

  /* ---- Péndulo físico: varilla + lenteja (disco) ---- */
  function pfCalc(dt) {
    const L = val('pf-l'), dDisc = val('pf-d'), a0 = val('pf-a') * D2R;
    const mRod = 1, mDisc = 1, rDisc = 0.07;
    const IrodO = (1/3) * mRod * L * L;
    const IdiscO = mDisc * dDisc * dDisc + 0.5 * mDisc * rDisc * rDisc; // Steiner, disco como masa casi puntual
    const Io = IrodO + IdiscO;
    const M = mRod + mDisc;
    const dcm = (mRod * (L/2) + mDisc * dDisc) / M;
    const w = Math.sqrt(M * G0 * dcm / Io), T = 2 * Math.PI / w;
    const leq = Io / (M * dcm);
    tPF += dt;
    const theta = a0 * Math.sin(w * tPF);
    return { L, dDisc, a0, Io, M, dcm, w, T, leq, theta };
  }
  function drawPF(k) {
    const st = pfC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const ox = st.w * 0.5, oy = st.h * 0.1;
    const sc = Math.min(st.h * 0.78, st.w * 0.42) / Math.max(k.L, k.dDisc);
    const rodEnd = rot([0, k.L*sc], 0, 0, k.theta);
    const discPos = rot([0, k.dDisc*sc], 0, 0, k.theta);
    const cmPos = rot([0, k.dcm*sc], 0, 0, k.theta);
    dot(c, ox, oy, 4, PAL.ink);
    c.save(); c.strokeStyle = PAL.metal; c.lineWidth = 6; c.lineCap='round'; line(c, ox, oy, ox+rodEnd[0], oy+rodEnd[1]); c.restore();
    dot(c, ox+discPos[0], oy+discPos[1], 16, PAL.accent, PAL.sky);
    dot(c, ox+cmPos[0], oy+cmPos[1], 5, PAL.accent2, PAL.sky);
    txt(c, 'CM', ox+cmPos[0]+10, oy+cmPos[1], { size: 10.5, color: PAL.accent2, weight: 600 });
    c.save(); c.strokeStyle = alpha(PAL.accent2, 0.5); c.setLineDash([3,3]); c.lineWidth = 1.5;
    c.beginPath(); c.arc(ox, oy, k.L*sc, Math.PI/2 - k.a0, Math.PI/2 + k.a0); c.stroke(); c.restore();

    $('#pf-io').textContent = fmt(k.Io, 3) + ' kg·m²';
    $('#pf-t').textContent = fmt(k.T, 2) + ' s';
    $('#pf-leq').textContent = fmt(k.leq, 2) + ' m';
  }

  return {
    init() { psC = makeCanvas('ps-canvas', 0.75); psGraphC = makeCanvas('ps-graph', 0.32); pfC = makeCanvas('pf-canvas', 0.75); },
    frame(dt) { drawPS(psCalc(dt)); drawPF(pfCalc(dt)); }
  };
})());
