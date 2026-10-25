/* ===== Rotación: momento de inercia, momento angular, rodadura ===== */
register('rotacion', (() => {
  let inC, anC, roC;
  let anOmega = 0, anAngle = 0;
  let ro = { playing: false, t: 0, s: 0, vFinal: null };
  const TRACK = 2.2; // m

  /* ---- Momento de inercia + Steiner ---- */
  const FORM = {
    varilla: { k: 1/12, label: 'I_CM = (1/12)·m·L²', useL: true },
    disco:   { k: 1/2,  label: 'I_CM = (1/2)·m·R²' },
    aro:     { k: 1,    label: 'I_CM = m·R²' },
    esfera:  { k: 2/5,  label: 'I_CM = (2/5)·m·R²' },
    esferah: { k: 2/3,  label: 'I_CM = (2/3)·m·R²' },
  };
  function inCalc() {
    const forma = seg('in-forma'), m = val('in-m'), r = val('in-r'), d = val('in-d');
    const f = FORM[forma];
    const L = f.useL ? 2 * r : null;
    const icm = f.useL ? f.k * m * L * L : f.k * m * r * r;
    const id = icm + m * d * d;
    return { forma, m, r, d, f, L, icm, id };
  }
  function pivotMark(c, x, y, color) {
    c.save(); c.strokeStyle = color; c.lineWidth = 2;
    c.beginPath(); c.arc(x, y, 5, 0, Math.PI * 2); c.stroke();
    line(c, x - 8, y, x + 8, y); line(c, x, y - 8, x, y + 8);
    c.restore();
  }
  function drawIN(k) {
    const st = inC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const cx = st.w * 0.42, cy = st.h * 0.52;
    const sc = Math.min(st.w, st.h) * 0.3 / Math.max(k.r, k.L ? k.L / 2 : k.r);
    c.save();
    if (k.forma === 'varilla') {
      c.fillStyle = PAL.metal; c.fillRect(cx - k.L/2*sc, cy - 7, k.L*sc, 14);
    } else if (k.forma === 'disco') {
      c.fillStyle = alpha(PAL.metal, 0.9); dot(c, cx, cy, k.r*sc, PAL.metal);
    } else if (k.forma === 'aro') {
      c.strokeStyle = PAL.metal; c.lineWidth = 8; c.beginPath(); c.arc(cx, cy, k.r*sc, 0, Math.PI*2); c.stroke();
    } else if (k.forma === 'esfera') {
      dot(c, cx, cy, k.r*sc, PAL.metal);
      c.fillStyle = alpha('#ffffff', 0.12); c.beginPath(); c.arc(cx - k.r*sc*0.3, cy - k.r*sc*0.3, k.r*sc*0.35, 0, Math.PI*2); c.fill();
    } else if (k.forma === 'esferah') {
      c.fillStyle = alpha(PAL.metal, 0.25); dot(c, cx, cy, k.r*sc, alpha(PAL.metal,0.25));
      c.strokeStyle = PAL.metal; c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, k.r*sc, 0, Math.PI*2); c.stroke();
    }
    c.restore();
    pivotMark(c, cx, cy, PAL.accent);
    txt(c, 'eje por el CM', cx, cy - (k.forma==='varilla'?22:k.r*sc+16), { align: 'center', size: 10.5, color: PAL.accent, weight: 600 });
    if (k.d > 0.01) {
      const dx = cx + k.d * sc;
      pivotMark(c, dx, cy, PAL.accent2);
      txt(c, `eje a d=${fmt(k.d,2)} m`, dx, cy - (k.forma==='varilla'?22:k.r*sc+16) + 16, { align: 'center', size: 10.5, color: PAL.accent2, weight: 600 });
      c.save(); c.strokeStyle = alpha(PAL.accent2, 0.6); c.setLineDash([4,4]); line(c, cx, cy, dx, cy); c.restore();
    }
    $('#in-icm').textContent = fmt(k.icm, 3) + ' kg·m²';
    $('#in-id').textContent = fmt(k.id, 3) + ' kg·m²';
    $('#in-formula').textContent = `${k.f.label}  →  I = I_CM + m·d² = ${fmt(k.id,3)} kg·m²`;
  }

  /* ---- Momento angular y dinámica ---- */
  function anCalc(dt) {
    const F = val('an-f'), r = val('an-r'), I = val('an-i');
    const tau = F * r, alfaV = tau / I;
    anOmega += alfaV * dt; anAngle += anOmega * dt;
    return { F, r, I, tau, alfaV, omega: anOmega };
  }
  function drawAN(k) {
    const st = anC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const cx = st.w * 0.42, cy = st.h * 0.5, R = Math.min(st.w, st.h) * 0.3;
    c.save(); c.strokeStyle = PAL.line; c.fillStyle = alpha(PAL.surface2,1); c.lineWidth = 2;
    c.beginPath(); c.arc(cx, cy, R, 0, Math.PI*2); c.fill(); c.stroke(); c.restore();
    c.save(); c.strokeStyle = alpha(PAL.accent, 0.8); c.lineWidth = 3;
    for (let i = 0; i < 4; i++) { const a = anAngle + i * Math.PI/2; line(c, cx, cy, cx + Math.cos(a)*R, cy + Math.sin(a)*R); }
    c.restore();
    dot(c, cx, cy, 4, PAL.ink, PAL.sky);
    // fuerza tangencial aplicada arriba
    const fx = cx, fy = cy - R;
    arrow(c, fx - 36, fy, fx + 2, fy, PAL.bad, 2.5, 8);
    txt(c, `F = ${fmt(k.F,0)} N`, fx - 40, fy - 8, { align: 'right', size: 11, color: PAL.bad, weight: 600 });
    c.save(); c.strokeStyle = alpha(PAL.accent2,0.7); c.setLineDash([3,3]); line(c, cx, cy, fx, fy); c.restore();
    txt(c, `r = ${fmt(k.r,2)} m`, cx + 6, cy - R/2, { size: 10, color: PAL.accent2 });

    $('#an-tau').textContent = fmt(k.tau, 2) + ' N·m';
    $('#an-alfa').textContent = fmt(k.alfaV, 2) + ' rad/s²';
    $('#an-w').textContent = fmt(k.omega, 2) + ' rad/s';
    $('#an-l').textContent = fmt(k.I * k.omega, 2) + ' kg·m²/s';
  }

  /* ---- Energía y rodadura ---- */
  const ROF = { aro: 1, cilindro: 0.5, esfera: 2/5 };
  function roCalc(dt) {
    const forma = seg('ro-forma'), beta = val('ro-ang') * D2R;
    const factor = ROF[forma];
    const a = G0 * Math.sin(beta) / (1 + factor);
    if (ro.playing) {
      ro.t += dt; ro.s = 0.5 * a * ro.t * ro.t;
      if (ro.s >= TRACK) { ro.s = TRACK; ro.playing = false; ro.vFinal = Math.sqrt(2 * a * TRACK); }
    }
    const v = ro.playing ? a * ro.t : (ro.vFinal ?? 0);
    return { forma, beta, factor, a, v, fracT: 1/(1+factor), fracR: factor/(1+factor) };
  }
  function drawRO(k) {
    const st = roC, c = st.ctx; if (!st.w) return; clear(st, PAL.sky);
    const x0 = st.w * 0.12, y0 = st.h * 0.18, L = Math.min(st.w * 0.74, st.h / Math.sin(k.beta) * 0.7);
    const x1 = x0 + L * Math.cos(k.beta), y1 = y0 + L * Math.sin(k.beta);
    c.save(); c.strokeStyle = PAL.metal; c.lineWidth = 6; c.lineCap = 'round'; line(c, x0, y0, x1, y1); c.restore();
    c.save(); c.strokeStyle = alpha(PAL.line,0.8); c.lineWidth = 1; line(c, x0, y1, x1, y1); c.restore();
    txt(c, `β=${fmt(k.beta*R2D,0)}°`, x0 + 24, y1 - 6, { size: 11, color: PAL.muted });

    const rad = 20;
    const frac = clamp(k.s / TRACK, 0, 1);
    const px = x0 + (x1-x0)*frac + Math.sin(k.beta)*rad, py = y0 + (y1-y0)*frac - Math.cos(k.beta)*rad;
    const spin = k.s / (rad/60); // ángulo visual arbitrario proporcional al recorrido
    c.save(); c.translate(px, py); c.rotate(spin);
    c.fillStyle = alpha(PAL.accent, 0.9); c.beginPath(); c.arc(0,0,rad,0,Math.PI*2); c.fill();
    c.strokeStyle = PAL.sky; c.lineWidth = 2; line(c, -rad, 0, rad, 0); line(c, 0, -rad, 0, rad);
    c.restore();

    $('#ro-a').textContent = fmt(k.a, 2) + ' m/s²';
    $('#ro-v').textContent = (k.vFinal !== undefined && !ro.playing && ro.vFinal != null) ? fmt(ro.vFinal, 2) + ' m/s' : (ro.playing ? fmt(k.v,2) + ' m/s' : '—');
    $('#ro-ect').textContent = fmt(k.fracT * 100, 0) + ' %';
    $('#ro-ecr').textContent = fmt(k.fracR * 100, 0) + ' %';
  }

  return {
    init() {
      inC = makeCanvas('in-canvas', 0.56);
      anC = makeCanvas('an-canvas', 0.56);
      roC = makeCanvas('ro-canvas', 0.5);
      $('#an-reset').addEventListener('click', () => { anOmega = 0; anAngle = 0; });
      $('#ro-play').addEventListener('click', () => { ro = { playing: true, t: 0, s: 0, vFinal: null }; });
    },
    frame(dt) { drawIN(inCalc()); drawAN(anCalc(dt)); drawRO(roCalc(dt)); }
  };
})());
