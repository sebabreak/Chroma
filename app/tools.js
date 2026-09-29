function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map(v => Math.round(v * 255));
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
const hexToHsl = hex => rgbToHsl(...hexToRgb(hex));
function rgbToCmyk(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255, k = 1 - Math.max(R, G, B);
  if (k >= 1) return [0, 0, 0, 100];
  return [(1 - R - k) / (1 - k), (1 - G - k) / (1 - k), (1 - B - k) / (1 - k), k].map(v => Math.round(v * 100));
}
function rgbToLab(rgb) {
  const [r, g, b] = rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  const x = (r * .4124 + g * .3576 + b * .1805) / .95047, y = r * .2126 + g * .7152 + b * .0722, z = (r * .0193 + g * .1192 + b * .9505) / 1.08883;
  const f = t => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116;
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
const LABS = COLORS.map(c => [c, rgbToLab(hexToRgb(c.h))]);
function nearest(hex) {
  const L = rgbToLab(hexToRgb(hex));
  let best = null, dist = Infinity;
  LABS.forEach(([c, M]) => { const d = Math.hypot(L[0] - M[0], L[1] - M[1], L[2] - M[2]); if (d < dist) { dist = d; best = c; } });
  return best;
}
const emotionsOf = hex => FAM_EMO[familyOf(nearest(hex).id)].map(x => t(x));
const simulate = (hex, v) => CVD[v] ? rgbToHex(CVD[v].map(row => row.reduce((a, k, i) => a + k * hexToRgb(hex)[i], 0))) : hex;
function chips(box, onPick) {
  box.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("button", box).forEach(x => x.classList.toggle("on", x === b));
    onPick(b.dataset);
  });
}
function copy(text) {
  try { navigator.clipboard.writeText(text); toast(t("Copiato: {v}", { v: text })); } catch { toast(text); }
}

const LAB = { h: 215, s: 75, l: 50, harm: "none", cvd: "none" };
const labHex = (h = LAB.h, s = LAB.s, l = LAB.l) => rgbToHex(hslToRgb(((h % 360) + 360) % 360, s, l));
const labColors = () => [labHex(), ...HARM[LAB.harm].map(d => labHex(LAB.h + d))];
function drawLab() {
  const hex = labHex(), rgb = hexToRgb(hex), cmyk = rgbToCmyk(...rgb), near = nearest(hex), scr = $("#lab"), L = LAB.l;
  $("[data-lab-preview]", scr).style.background = simulate(hex, LAB.cvd);
  $("[data-sat]", scr).value = LAB.s; $("[data-lig]", scr).value = L;
  $("[data-s-val]", scr).textContent = LAB.s + "%"; $("[data-l-val]", scr).textContent = L + "%";
  $("[data-sat]", scr).style.background = `linear-gradient(90deg, ${labHex(LAB.h, 0, L)}, ${labHex(LAB.h, 100, L)})`;
  $("[data-lig]", scr).style.background = `linear-gradient(90deg, #000, ${labHex(LAB.h, LAB.s, 50)}, #fff)`;
  const input = $("[data-hex]", scr);
  if (document.activeElement !== input) input.value = hex;
  $("[data-rgb]", scr).textContent = `rgb(${rgb.join(", ")})`;
  $("[data-hsl]", scr).textContent = `hsl(${LAB.h}°, ${LAB.s}%, ${L}%)`;
  $("[data-cmyk]", scr).textContent = `C ${cmyk[0]}  M ${cmyk[1]}  Y ${cmyk[2]}  K ${cmyk[3]}`;
  $("[data-near]", scr).innerHTML = `<i style="background:${near.h}"></i>${t(near.n)}`;
  $("[data-emo]", scr).textContent = emotionsOf(hex).join(", ");
  [["[data-ct-white]", "#ffffff"], ["[data-ct-black]", "#111111"]].forEach(([sel, fg]) => {
    const el = $(sel, scr), r = contrast(hex, fg);
    el.style.background = hex; el.style.color = fg;
    $("small", el).textContent = `${r.toFixed(1)}:1 · ${r >= 7 ? "AAA ✓" : r >= 4.5 ? "AA ✓" : t(r >= 3 ? "Solo testi grandi" : "Poco leggibile ✗")}`;
  });
  $("[data-wheel]", scr).style.background = `radial-gradient(circle closest-side, hsl(0 0% ${L}%) 40%, hsl(0 0% ${L}% / 0) 100%), conic-gradient(${Array.from({ length: 13 }, (_, i) => `hsl(${i * 30} 100% ${L}%)`).join(",")})`;
  const radius = 20 + 30 * LAB.s / 100;
  $("[data-wheel-marks]", scr).innerHTML = [0, ...HARM[LAB.harm]].map((d, i) => {
    const a = (LAB.h + d) * Math.PI / 180;
    return `<i class="${i ? "" : "main"}" style="left:${50 + radius * Math.sin(a)}%;top:${50 - radius * Math.cos(a)}%;background:${simulate(labHex(LAB.h + d), LAB.cvd)}"></i>`;
  }).join("");
  $("[data-harm-row]", scr).innerHTML = labColors().map(c => {
    const sim = simulate(c, LAB.cvd);
    return `<button class="hsw" data-copyhex="${c}"><i style="background:${sim};color:${onColor(sim)}">${c}</i><small>${t(nearest(c).n)}</small></button>`;
  }).join("");
  $("[data-cvd-note]", scr).textContent = t(CVD_NOTE[LAB.cvd]);
}
function openLab(hex) {
  if (hex) [LAB.h, LAB.s, LAB.l] = hexToHsl(hex);
  drawLab(); go("lab");
}
(() => {
  const wheel = $("[data-wheel]");
  let dragging = false;
  const pick = e => {
    const r = wheel.getBoundingClientRect(), dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2, d = Math.hypot(dx, dy) / r.width;
    if (e.type === "pointerdown" && d < .2) return false;
    LAB.h = Math.round((Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360);
    LAB.s = Math.round(Math.max(0, Math.min(1, (d - .2) / .3)) * 100);
    drawLab();
  };
  wheel.addEventListener("pointerdown", e => { if (pick(e) !== false) { dragging = true; wheel.setPointerCapture(e.pointerId); } });
  wheel.addEventListener("pointermove", e => { if (dragging) pick(e); });
  wheel.addEventListener("pointerup", () => dragging = false);
  wheel.addEventListener("pointercancel", () => dragging = false);
  $("[data-sat]").addEventListener("input", e => { LAB.s = +e.target.value; drawLab(); });
  $("[data-lig]").addEventListener("input", e => { LAB.l = +e.target.value; drawLab(); });
  $("[data-hex]").addEventListener("input", e => {
    const v = "#" + e.target.value.trim().replace(/^#/, "");
    if (/^#[0-9a-f]{6}$/i.test(v)) { [LAB.h, LAB.s, LAB.l] = hexToHsl(v); drawLab(); }
  });
  $("[data-copy]").onclick = () => copy(labHex());
  $("[data-harm-row]").addEventListener("click", e => { const b = e.target.closest("[data-copyhex]"); if (b) copy(b.dataset.copyhex); });
  chips($("[data-harm]"), d => { LAB.harm = d.h; drawLab(); });
  chips($("[data-cvd]"), d => { LAB.cvd = d.v; drawLab(); });
  $("[data-lab-save]").onclick = () => {
    const shades = LAB.harm === "none";
    const cols = shades ? [labHex(LAB.h, LAB.s, Math.min(90, LAB.l + 25)), labHex(), labHex(LAB.h, LAB.s, Math.max(10, LAB.l - 25))] : labColors();
    S.myPalettes.push({ id: "p" + Date.now(), n: `${t(HARM_N[LAB.harm])} · ${t(nearest(labHex()).n)}`, c: cols });
    if (!shades) S.labSaved = true;
    renderPalettes(); addXP(0);
    toast(t(shades ? "Palette di sfumature salvata" : "Armonia salvata in Le mie palette"));
  };
})();

const PHOTO = { cols: [], stats: null, cvd: "none" };
const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
function kmeans(px, k) {
  let centers = [px[0]], count = [];
  while (centers.length < k) {
    let far = null, fd = -1;
    for (let i = 0; i < px.length; i += 7) {
      const d = Math.min(...centers.map(c => dist2(c, px[i])));
      if (d > fd) { fd = d; far = px[i]; }
    }
    centers.push(far.slice());
  }
  for (let it = 0; it < 12; it++) {
    const sum = centers.map(() => [0, 0, 0]);
    count = centers.map(() => 0);
    px.forEach(p => {
      let bi = 0, bd = Infinity;
      centers.forEach((c, i) => { const d = dist2(c, p); if (d < bd) { bd = d; bi = i; } });
      sum[bi][0] += p[0]; sum[bi][1] += p[1]; sum[bi][2] += p[2]; count[bi]++;
    });
    centers = centers.map((c, i) => count[i] ? sum[i].map(v => v / count[i]) : c);
  }
  return centers.map((c, i) => ({ hex: rgbToHex(c), share: count[i] / px.length })).filter(c => c.share > .01).sort((a, b) => b.share - a.share);
}
function photoStats(cols) {
  let warm = 0, cool = 0, neutral = 0, sat = 0, lig = 0;
  cols.forEach(({ hex, share }) => {
    const [h, s, l] = hexToHsl(hex);
    sat += s * share; lig += l * share;
    if (s < 15 || l < 8 || l > 94) neutral += share;
    else if (h < 70 || h >= 300) warm += share;
    else if (h >= 150) cool += share;
    else { neutral += share * .5; warm += share * .25; cool += share * .25; }
  });
  const lums = cols.map(c => lum(c.hex)), light = cols[lums.indexOf(Math.max(...lums))].hex, dark = cols[lums.indexOf(Math.min(...lums))].hex;
  const hues = cols.map(c => hexToHsl(c.hex)).filter(([, s, l]) => s >= 20 && l > 10 && l < 92).map(([h]) => h);
  let spread = 0;
  hues.forEach(a => hues.forEach(b => { const d = Math.abs(a - b) % 360; spread = Math.max(spread, Math.min(d, 360 - d)); }));
  const harm = hues.length < 2 ? ["Neutra", "Pochi colori saturi: domina la luce più della tinta."]
    : spread <= 40 ? ["Monocromatica / analoga", "Le tinte sono vicine sulla ruota: l'insieme risulta coerente."]
    : spread >= 150 ? ["Con contrasto complementare", "Ci sono tinte quasi opposte sulla ruota: l'immagine ha un forte contrasto di colore."]
    : ["Varia", "Le tinte sono distribuite sulla ruota senza uno schema preciso."];
  return { warm, cool, neutral, sat, lig, light, dark, ratio: contrast(light, dark), harm };
}
function readPhoto(cols, st) {
  const pct = v => Math.round(v * 100) + "%", main = nearest(cols[0].hex);
  return [
    st.warm > st.cool && st.warm > st.neutral ? t("Prevalgono i colori caldi ({p}), che di solito vengono associati a energia, calore e vicinanza.", { p: pct(st.warm) })
      : st.cool > st.warm && st.cool > st.neutral ? t("Prevalgono i colori freddi ({p}), che di solito vengono associati a calma, distanza e riflessione.", { p: pct(st.cool) })
      : t("Prevalgono i toni neutri ({p}): l'immagine risulta sobria e i pochi colori accesi risaltano di più.", { p: pct(st.neutral) }),
    t(st.sat > 55 ? "I colori sono molto saturi: l'effetto è vivace." : st.sat > 30 ? "La saturazione è media: i colori non sono né spenti né accesi." : "I colori sono tenui e poco saturi."),
    t(st.lig > 62 ? "L'immagine è luminosa." : st.lig > 38 ? "La luminosità è media." : "L'immagine è scura."),
    t("Il colore principale è vicino al tono “{n}”, che nelle lezioni viene associato a {e}.", { n: t(main.n), e: FAM_EMO[familyOf(main.id)].map(x => t(x)).join(", ") })
  ].join(" ");
}
const meter = (label, value, text, bg) =>
  `<div class="ph-stat"><div class="ph-sh"><span>${label}</span><b>${text}</b></div><div class="ph-track" style="background:${bg}"><i style="left:${Math.max(0, Math.min(100, value))}%"></i></div></div>`;
function drawPhoto() {
  const v = PHOTO.cvd, st = PHOTO.stats, sim = hex => simulate(hex, v), r = st.ratio;
  $("[data-photo-img]").style.filter = v === "none" ? "" : `url(#cvd-${v})`;
  $("[data-photo-bar]").innerHTML = PHOTO.cols.map(c => `<i style="flex:${c.share};background:${sim(c.hex)}"></i>`).join("");
  $("[data-photo-list]").innerHTML = PHOTO.cols.map((c, k) => {
    const near = nearest(c.hex), pct = Math.round(c.share * 100);
    return `<button class="pc" data-labhex="${c.hex}"><i style="background:${sim(c.hex)}"></i><span><b>${t(near.n)}${k ? "" : " · " + t("principale")}</b><small>${c.hex} · ${FAM_EMO[familyOf(near.id)].slice(0, 2).map(x => t(x)).join(", ")}</small><u style="width:${Math.max(4, pct)}%;background:${sim(c.hex)}"></u></span><em>${pct}%</em></button>`;
  }).join("");
  $("[data-photo-stats]").innerHTML =
    meter(t("Temperatura"), 100 - Math.round((st.warm - st.cool + 1) * 50), t(st.warm > st.cool + .1 ? "Calda" : st.cool > st.warm + .1 ? "Fredda" : "Equilibrata"), "linear-gradient(90deg,#ff7a00,#f2d9b5 50%,#1f5fe0)") +
    meter(t("Saturazione"), st.sat, Math.round(st.sat) + "%", "linear-gradient(90deg,#9a9a9a,#e3242b)") +
    meter(t("Luminosità"), st.lig, Math.round(st.lig) + "%", "linear-gradient(90deg,#111,#888 50%,#fff)") +
    `<div class="ph-stat ph-row"><div class="ph-ct" style="background:${sim(st.dark)};color:${sim(st.light)}">Aa</div><div><div class="ph-sh"><span>${t("Contrasto interno")}</span><b>${r.toFixed(1)}:1</b></div><small>${t(r >= 7 ? "Molto forte: luci e ombre ben separate." : r >= 4.5 ? "Buono: luci e ombre sono ben distinte." : r >= 2.5 ? "Medio: toni abbastanza ravvicinati." : "Basso: toni molto simili tra loro.")}</small></div></div>` +
    `<div class="ph-stat ph-row"><div class="ph-harm">${PHOTO.cols.map(c => `<i style="background:${sim(c.hex)}"></i>`).join("")}</div><div><div class="ph-sh"><span>${t("Armonia")}</span><b>${t(st.harm[0])}</b></div><small>${t(st.harm[1])}</small></div></div>`;
}
function analyzePhoto(src, done) {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas"), k = Math.min(1, 140 / Math.max(img.width, img.height));
    c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const d = ctx.getImageData(0, 0, c.width, c.height).data, px = [];
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) px.push([d[i], d[i + 1], d[i + 2]]);
    if (!px.length) return toast(t("Immagine non valida"));
    PHOTO.cols = kmeans(px, 5); PHOTO.stats = photoStats(PHOTO.cols);
    $("[data-photo-img]").src = src;
    $("[data-photo-box]").hidden = false; $("[data-photo-intro]").hidden = true;
    $("[data-photo-read]").textContent = readPhoto(PHOTO.cols, PHOTO.stats);
    drawPhoto();
    if (!S.photoDone) { S.photoDone = true; addXP(0); }
    $("#foto .scroll").scrollTo({ top: $("[data-photo-box]").offsetTop - 70, behavior: "smooth" });
    done?.();
  };
  img.onerror = () => toast(t("Non riesco a leggere questa immagine"));
  img.src = src;
}
$$("[data-photo]").forEach(input => input.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) analyzePhoto(URL.createObjectURL(file), () => e.target.value = "");
}));
$$("[data-sample]").forEach(b => b.onclick = () => analyzePhoto("assets/" + b.dataset.sample));
$("[data-photo-again]").onclick = () => {
  $("[data-photo-box]").hidden = true; $("[data-photo-intro]").hidden = false;
  $("#foto .scroll").scrollTo({ top: 0, behavior: "smooth" });
};
chips($("[data-pcvd]"), d => { PHOTO.cvd = d.v; drawPhoto(); });
$("[data-photo-list]").addEventListener("click", e => { const b = e.target.closest("[data-labhex]"); if (b) openLab(b.dataset.labhex); });
$("[data-photo-save]").onclick = () => {
  S.myPalettes.push({ id: "p" + Date.now(), n: t("Dalla foto") + " · " + t(nearest(PHOTO.cols[0].hex).n), c: PHOTO.cols.map(c => c.hex) });
  renderPalettes(); addXP(0); toast(t("Palette della foto salvata"));
};

const rnd = (a, b) => a + Math.random() * (b - a);
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const GAMES = {
  guess: {
    title: "Indovina il colore", prompt: "Quale colore corrisponde a questo codice HEX?",
    round() {
      const h = rnd(0, 360), s = rnd(55, 90), l = rnd(35, 62), ok = labHex(h, s, l);
      const opts = [ok, labHex(h + rnd(50, 90), s, l), labHex(h - rnd(50, 90), s, l), labHex(h + rnd(150, 210), s, Math.min(80, l + rnd(0, 15)))];
      return { target: `<b class="g-hex">${ok}</b>`, opts: shuffle(opts), ok };
    }
  },
  comp: {
    title: "Trova il complementare", prompt: "Quale colore sta dalla parte opposta della ruota?",
    round() {
      const h = rnd(0, 360), s = rnd(60, 90), l = rnd(40, 58), ok = labHex(h + 180, s, l);
      const opts = [ok, labHex(h + 90, s, l), labHex(h + 130, s, l), labHex(h + 240, s, l)];
      return { target: `<i class="g-sw" style="background:${labHex(h, s, l)}"></i>`, opts: shuffle(opts), ok };
    }
  },
  order: {
    title: "Dal chiaro allo scuro", prompt: "Tocca i colori dal più chiaro al più scuro.",
    round() {
      let cols;
      do cols = Array.from({ length: 4 }, () => labHex(rnd(0, 360), rnd(40, 90), rnd(20, 80)));
      while (cols.map(lum).sort((a, b) => a - b).some((v, i, a) => i && v - a[i - 1] < .05));
      return { opts: shuffle(cols), order: [...cols].sort((a, b) => lum(b) - lum(a)) };
    }
  }
};
const HORN = '<img class="emo" src="assets/trombetta.png" alt="">';
function startGame(g) {
  const game = GAMES[g], scr = $("#gioco"), next = $("[data-g-next]", scr), box = $("[data-g-opts]", scr);
  const set = (sel, html) => $(sel, scr).innerHTML = html;
  let n = 0, score = 0, round, taps = [];
  const finishRound = right => {
    if (right) score++;
    set("[data-g-score]", t("Punti {n}", { n: score }));
    next.hidden = false;
  };
  const answer = b => {
    if (!next.hidden) return;
    const right = b.dataset.c === round.ok;
    b.classList.add(right ? "right" : "wrong");
    $(`[data-c="${round.ok}"]`, box).classList.add("right");
    set("[data-g-feedback]", right ? t("Esatto!") + " " + HORN : t("Non proprio: quello giusto è evidenziato."));
    finishRound(right);
  };
  const tap = b => {
    if (!next.hidden || b.dataset.n) return;
    taps.push(b.dataset.c);
    b.dataset.n = b.textContent = taps.length;
    b.style.color = onColor(b.dataset.c);
    if (taps.length < round.opts.length) return;
    const right = taps.every((c, i) => c === round.order[i]);
    $$(".g-opt", box).forEach(x => x.classList.add(x.dataset.c === round.order[x.dataset.n - 1] ? "right" : "wrong"));
    set("[data-g-feedback]", right ? t("Ordine perfetto!") + " " + HORN : t("Quasi: l'ordine giusto è {o} (posizioni da sinistra).", { o: round.order.map(c => round.opts.indexOf(c) + 1).join(" → ") }));
    finishRound(right);
  };
  const show = () => {
    round = game.round(); taps = [];
    set("[data-g-round]", t("Round {n} / 5", { n: n + 1 }));
    set("[data-g-score]", t("Punti {n}", { n: score }));
    $("[data-g-prompt]", scr).textContent = t(game.prompt);
    set("[data-g-target]", round.target || "");
    set("[data-g-feedback]", "");
    next.hidden = true;
    box.className = "g-opts" + (g === "order" ? " order" : "");
    box.innerHTML = "";
    round.opts.forEach(c => {
      const b = document.createElement("button");
      b.className = "g-opt"; b.style.background = c; b.dataset.c = c;
      b.onclick = () => g === "order" ? tap(b) : answer(b);
      box.appendChild(b);
    });
  };
  next.textContent = t("avanti");
  next.onclick = () => {
    if (++n < 5) return show();
    S.games[g] = Math.max(S.games[g] || 0, score);
    const d = day(); d.quiz++; if (score === 5) d.perfect++;
    set("[data-g-round]", t("Fine!"));
    $("[data-g-prompt]", scr).textContent = t("Hai fatto {n} su 5.", { n: score }) + " " + t(score >= 4 ? "Ottimo occhio!" : "Riprova per allenarti ancora.");
    set("[data-g-target]", `<b class="g-hex">${score} / 5</b>`);
    box.innerHTML = "";
    set("[data-g-feedback]", t("Record: {n} / 5", { n: S.games[g] }) + ` · + ${score * 5} XP`);
    addXP(score * 5);
    next.textContent = t("Rigioca");
    next.onclick = () => startGame(g);
  };
  $("[data-g-title]", scr).textContent = t(game.title);
  show();
  if (current !== "gioco") go("gioco");
}

function colorOfTheDay() {
  const n = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
  return COLOR_BY[SCALE[n % SCALE.length]];
}
$("[data-cotd]").onclick = () => openLab(colorOfTheDay().h);
function renderTools() {
  const c = colorOfTheDay();
  $("[data-cotd-sw]").style.background = c.h;
  $("[data-cotd-name]").textContent = t(c.n);
  $("[data-cotd-hex]").textContent = c.h.toUpperCase();
  $("[data-cotd-emo]").textContent = FAM_EMO[familyOf(c.id)].map(x => t(x)).join(" · ");
  $$("[data-best]").forEach(el => { const v = S.games[el.dataset.best]; el.textContent = v != null ? t("Record {n}/5", { n: v }) : t("Da provare"); });
}

const loadImage = src => new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = src; });
const FONT = "Inter, Roboto, system-ui, sans-serif";
function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }
function fitText(ctx, text, max, size, weight = 700) {
  do ctx.font = `${weight} ${size--}px ${FONT}`; while (ctx.measureText(text).width > max && size > 20);
}
function spectrum(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  ["#e3242b", "#ff7a00", "#ffd000", "#2fa84f", "#12c4c0", "#1f5fe0", "#8a2be2"].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
  ctx.fillStyle = g; roundRect(ctx, x, y, w, h, h / 2); ctx.fill();
}
async function cardBase(w, h) {
  await Promise.all([400, 500, 600, 700].map(w => document.fonts.load(`${w} 20px Inter`, "Aa Бб")));
  const c = document.createElement("canvas"), ctx = c.getContext("2d");
  c.width = w; c.height = h;
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#1b1830"); bg.addColorStop(1, "#0d0c14");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w * .85, h * .08, 0, w * .85, h * .08, w * .8);
  glow.addColorStop(0, "rgba(138,43,226,.35)"); glow.addColorStop(1, "rgba(138,43,226,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
  const logo = await loadImage("assets/chroma-lettering.png");
  ctx.drawImage(logo, (w - 380) / 2, 70, 380, 100);
  ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.font = `500 30px ${FONT}`;
  ctx.fillText("sebabreak.github.io/Chroma/app", w / 2, h - 60);
  return { c, ctx };
}
async function drawAvatar(ctx, x, y, r) {
  const a = S.avatar || { type: "preset", id: "default" }, p = AVATARS.find(v => v.id === a.id) || AVATARS[0];
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = a.type === "photo" ? "#ddd" : p.bg || "#d9d9d9"; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  try {
    if (a.type === "photo") ctx.drawImage(await loadImage(a.data), x - r, y - r, r * 2, r * 2);
    else if (p.img) { const s = p.full ? 2 * r : 1.36 * r; ctx.drawImage(await loadImage("assets/" + p.img), x - s / 2, y - s / 2, s, s); }
    else if (p.svg) ctx.drawImage(await loadImage("data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${p.svg}</svg>`)), x - r, y - r, r * 2, r * 2);
    else ctx.drawImage(await loadImage("assets/ic-profilo.png"), x - r * .6, y - r * .6, r * 1.2, r * 1.2);
  } catch {}
  ctx.restore();
}
async function shareProfile() {
  toast(t("Preparo la tua card…"));
  const W = 1080, H = 1920, { c, ctx } = await cardBase(W, H), cx = W / 2;
  const ring = ctx.createConicGradient ? ctx.createConicGradient(0, cx, 470, 210) : null;
  if (ring) ["#e3242b", "#ff7a00", "#ffd000", "#2fa84f", "#12c4c0", "#1f5fe0", "#8a2be2", "#e3242b"].forEach((col, i, a) => ring.addColorStop(i / (a.length - 1), col));
  ctx.fillStyle = ring || "#8a2be2"; ctx.beginPath(); ctx.arc(cx, 470, 210, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#16142a"; ctx.beginPath(); ctx.arc(cx, 470, 194, 0, Math.PI * 2); ctx.fill();
  await drawAvatar(ctx, cx, 470, 180);
  ctx.fillStyle = "#fff"; roundRect(ctx, cx - 100, 640, 200, 64, 32); ctx.fill();
  ctx.fillStyle = "#16142a"; ctx.font = `700 34px ${FONT}`; ctx.fillText("Lv " + S.level, cx, 684);
  const name = S.name || t("Ospite");
  ctx.fillStyle = "#fff"; fitText(ctx, name, 900, 92); ctx.fillText(name, cx, 820);
  ctx.fillStyle = "#cfc9ff"; fitText(ctx, shownTitle(), 900, 48, 500); ctx.fillText(shownTitle(), cx, 885);
  const pct = Math.round(completion() * 100);
  ctx.fillStyle = "rgba(255,255,255,.12)"; roundRect(ctx, 140, 950, 800, 22, 11); ctx.fill();
  ctx.save(); roundRect(ctx, 140, 950, Math.max(22, 800 * pct / 100), 22, 11); ctx.clip(); spectrum(ctx, 140, 950, 800, 22); ctx.restore();
  ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.font = `500 30px ${FONT}`; ctx.fillText(t("{p}% di CHROMA completato", { p: pct }), cx, 1020);
  const min = Math.floor(S.time / 60);
  const stats = [["#ff7a00", S.streak, t("giorni di fila")], ["#1f5fe0", S.done.length, t("lezioni")], ["#2fa84f", S.quizzes, t("quiz")], ["#8a2be2", min >= 60 ? Math.floor(min / 60) + " " + t("h") : min + " " + t("min"), t("di studio")]];
  stats.forEach(([col, v, l], i) => {
    const x = 90 + (i % 2) * 460, y = 1080 + Math.floor(i / 2) * 170;
    ctx.fillStyle = "rgba(255,255,255,.08)"; roundRect(ctx, x, y, 440, 150, 28); ctx.fill();
    ctx.fillStyle = col; roundRect(ctx, x + 32, y + 35, 12, 80, 6); ctx.fill();
    ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = `700 54px ${FONT}`; ctx.fillText(v, x + 70, y + 78);
    ctx.fillStyle = "rgba(255,255,255,.65)"; ctx.font = `500 28px ${FONT}`; ctx.fillText(l, x + 70, y + 118);
  });
  ctx.textAlign = "center"; ctx.fillStyle = "#fff"; ctx.font = `600 34px ${FONT}`;
  ctx.fillText(t("I miei colori · {a}/{b}", { a: S.owned.length, b: COLORS.length }), cx, 1460);
  const owned = byHue(S.owned), per = Math.min(owned.length, 12), size = 62, gap = 14;
  owned.forEach((id, i) => {
    const row = Math.floor(i / per), inRow = Math.min(per, owned.length - row * per);
    const x = cx - (inRow * size + (inRow - 1) * gap) / 2 + (i % per) * (size + gap) + size / 2, y = 1530 + row * (size + gap);
    ctx.fillStyle = COLOR_BY[id].h; ctx.beginPath(); ctx.arc(x, y, size / 2, 0, Math.PI * 2); ctx.fill();
  });
  const badges = BADGES.filter(b => b.got()).slice(0, 8);
  const by = 1530 + Math.ceil(owned.length / per) * (size + gap) + 40, bs = 96;
  for (const [i, b] of badges.entries()) {
    try { ctx.drawImage(await loadImage("assets/" + b.img), cx - (badges.length * (bs + 12) - 12) / 2 + i * (bs + 12), by, bs, bs); } catch {}
  }
  showShare(c, "chroma-profilo.png", t("Il mio profilo CHROMA"));
}
async function sharePalette(name, hexes, emotions) {
  const W = 1080, H = 1350, { c, ctx } = await cardBase(W, H), cx = W / 2;
  ctx.fillStyle = "#fff"; fitText(ctx, name, 900, 76); ctx.fillText(name, cx, 280);
  ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.font = `500 30px ${FONT}`; ctx.fillText(t("Palette creata con CHROMA"), cx, 330);
  const top = 390, bottom = emotions ? 1110 : 1180, h = (bottom - top) / hexes.length;
  hexes.forEach((hex, i) => {
    const y = top + i * h, on = onColor(hex) === "#fff" ? "#ffffff" : "#111111";
    ctx.fillStyle = hex; roundRect(ctx, 90, y, 900, h - 14, 26); ctx.fill();
    ctx.fillStyle = on; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.font = `700 ${Math.min(46, h * .34)}px ${FONT}`;
    ctx.fillText(t(nearest(hex).n), 130, y + h / 2 + 2);
    ctx.textAlign = "right"; ctx.font = `600 ${Math.min(38, h * .3)}px ui-monospace, Menlo, monospace`;
    ctx.fillText(hex.toUpperCase(), 950, y + h / 2 + 2);
  });
  ctx.textBaseline = "alphabetic";
  if (emotions) {
    ctx.textAlign = "center"; ctx.fillStyle = "#cfc9ff"; ctx.font = `500 34px ${FONT}`;
    ctx.fillText(emotions.join(" · "), cx, 1165);
  }
  showShare(c, "chroma-palette.png", name);
}
function showShare(canvas, filename, title) {
  const box = $("[data-share]"), url = canvas.toDataURL("image/png");
  $("[data-share-img]").src = url;
  const saveLink = $("[data-share-save]");
  saveLink.href = url; saveLink.download = filename;
  const send = $("[data-share-send]");
  send.hidden = !navigator.canShare;
  send.onclick = () => canvas.toBlob(async blob => {
    const file = new File([blob], filename, { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) { try { await navigator.share({ files: [file], title }); } catch {} }
    else saveLink.click();
  });
  box.hidden = false;
}
$("[data-share-close]").onclick = () => $("[data-share]").hidden = true;
$("[data-share]").onclick = e => { if (e.target.matches("[data-share]")) e.target.hidden = true; };
$("[data-share-profile]").onclick = shareProfile;

drawLab();
