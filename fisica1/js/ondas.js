/* ===== Ondas mecánicas: viajera y estacionaria ===== */
register('ondas', (() => {
  let ovC, oeC;
  let tOV = 0, tOE = 0;
  const XMAX = 6; // m, ventana visible para la onda viajera
  const L = 2;    // m, longitud de la cuerda para ondas estacionarias

  /* ---- Onda viajera ---- */
  function ovCalc(dt) {
    const tipo = seg('ov-tipo'), A = val('ov-a'), lam = val('ov-lam'), v = val('ov-v');
    const k = 2 * Math.PI / lam, w = k * v;
    tOV += dt;
    return { tipo, A, lam, v, k, w, T: 2*Math.PI/w, f: w/(2*Math.PI) };
  }
  function drawOV(kk) {
    const st = ovC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const x0 = st.w * 0.06, x1 = st.w * 0.96, y0 = st.h * 0.5;
    const sc = (x1 - x0) / XMAX, ysc = Math.min(st.h * 0.35, 70);
    c.save(); c.strokeStyle = alpha(PAL.line, 0.6); line(c, x0, y0, x1, y0); c.restore();

    if (kk.tipo === 'transversal') {
      const pts = []; for (let i = 0; i <= 200; i++) { const x = XMAX*i/200; pts.push([x0 + x*sc, y0 - kk.A*Math.sin(kk.k*x - kk.w*tOV)*ysc]); }
      c.save(); c.strokeStyle = PAL.accent; c.lineWidth = 2.5; c.beginPath();
      pts.forEach((p,i) => i===0? c.moveTo(...p) : c.lineTo(...p)); c.stroke(); c.restore();
      // punto P marcado
      const xp = XMAX*0.3, yp = y0 - kk.A*Math.sin(kk.k*xp - kk.w*tOV)*ysc;
      dot(c, x0+xp*sc, yp, 7, PAL.accent2, PAL.sky);
      arrow(c, x0+xp*sc, y0, x0+xp*sc, yp, alpha(PAL.accent2,0.7), 1.5, 6);
      txt(c, 'P', x0+xp*sc+12, yp, { size: 11, weight: 700, color: PAL.accent2 });
    } else {
      const n = 46;
      c.save(); c.fillStyle = PAL.metal;
      for (let i = 0; i <= n; i++) {
        const x = XMAX*i/n;
        const dxw = kk.A*Math.sin(kk.k*x - kk.w*tOV) * 0.6;
        const px = x0 + (x+dxw)*sc;
        dot(c, px, y0, 4, PAL.metal);
      }
      c.restore();
      txt(c, 'compresión / rarefacción de las espiras', (x0+x1)/2, y0 + 50, { align:'center', size: 11, color: PAL.muted });
    }
    txt(c, `λ = ${fmt(kk.lam,1)} m`, x0, 18, { size: 11, color: PAL.muted });

    $('#ov-t').textContent = fmt(kk.T, 2) + ' s';
    $('#ov-f').textContent = fmt(kk.f, 2) + ' Hz';
    $('#ov-k').textContent = fmt(kk.k, 2) + ' rad/m';
    $('#ov-w').textContent = fmt(kk.w, 2) + ' rad/s';
  }

  /* ---- Onda estacionaria ---- */
  function oeCalc(dt) {
    const n = val('oe-n'), v = val('oe-v');
    const lam = 2 * L / n, f = n * v / (2 * L), w = 2 * Math.PI * f, k = 2 * Math.PI / lam;
    tOE += dt;
    return { n, v, lam, f, w, k };
  }
  function drawOE(kk) {
    const st = oeC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const x0 = st.w * 0.06, x1 = st.w * 0.94, y0 = st.h * 0.5;
    const sc = (x1 - x0) / L, ysc = Math.min(st.h * 0.36, 80);
    const Avis = 1;
    c.save(); c.strokeStyle = PAL.ink; c.lineWidth = 3; c.beginPath(); c.arc(x0, y0, 4, 0, Math.PI*2); c.fill(); c.arc(x1, y0, 4, 0, Math.PI*2); c.fill(); c.restore();

    const pts = []; for (let i = 0; i <= 160; i++) { const x = L*i/160; pts.push([x0 + x*sc, y0 - Avis*Math.sin(kk.k*x)*Math.cos(kk.w*tOE)*ysc]); }
    c.save(); c.strokeStyle = PAL.accent; c.lineWidth = 2.5; c.beginPath(); pts.forEach((p,i)=> i===0?c.moveTo(...p):c.lineTo(...p)); c.stroke(); c.restore();
    // envolvente
    c.save(); c.strokeStyle = alpha(PAL.muted, 0.35); c.setLineDash([3,3]);
    const env1 = [], env2 = []; for (let i=0;i<=160;i++){ const x=L*i/160; env1.push([x0+x*sc, y0-Avis*Math.sin(kk.k*x)*ysc]); env2.push([x0+x*sc, y0+Avis*Math.sin(kk.k*x)*ysc]); }
    c.beginPath(); env1.forEach((p,i)=>i===0?c.moveTo(...p):c.lineTo(...p)); c.stroke();
    c.beginPath(); env2.forEach((p,i)=>i===0?c.moveTo(...p):c.lineTo(...p)); c.stroke();
    c.restore();

    // nodos y antinodos
    for (let i = 0; i <= kk.n; i++) { const x = i * L / kk.n; dot(c, x0 + x*sc, y0, 5, PAL.bad, PAL.sky); }
    for (let i = 0; i < kk.n; i++) { const x = (i + 0.5) * L / kk.n; dot(c, x0 + x*sc, y0, 5, PAL.good, PAL.sky); }
    txt(c, `n = ${kk.n}`, x0, 18, { size: 12, weight: 700, color: PAL.ink });
    const legendY = st.h - 10;
    txt(c, '● nodo', x0, legendY, { size: 10.5, color: PAL.bad });
    txt(c, '● antinodo', x0 + 60, legendY, { size: 10.5, color: PAL.good });

    $('#oe-lam').textContent = fmt(kk.lam, 2) + ' m';
    $('#oe-f').textContent = fmt(kk.f, 2) + ' Hz';
    $('#oe-nodos').textContent = (kk.n - 1);
  }

  return {
    init() { ovC = makeCanvas('ov-canvas', 0.5); oeC = makeCanvas('oe-canvas', 0.5); },
    frame(dt) { drawOV(ovCalc(dt)); drawOE(oeCalc(dt)); }
  };
})());
