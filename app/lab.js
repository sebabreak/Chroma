const q = (s, r = document) => r.querySelector(s);

function hsl2rgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map(v => Math.round(v * 255));
}
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0, s = 0; const l = (mx + mn) / 2;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
const toHex = rgb => "#" + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();
const fromHex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function rgb2cmyk(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255, k = 1 - Math.max(R, G, B);
  if (k >= 1) return [0, 0, 0, 100];
  return [(1 - R - k) / (1 - k), (1 - G - k) / (1 - k), (1 - B - k) / (1 - k), k].map(v => Math.round(v * 100));
}
function rgb2lab(rgb) {
  const [r, g, b] = rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  const x = (r * .4124 + g * .3576 + b * .1805) / .95047, y = r * .2126 + g * .7152 + b * .0722, z = (r * .0193 + g * .1192 + b * .9505) / 1.08883;
  const f = t => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116;
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
function nearest(hex) {
  const L = rgb2lab(fromHex(hex));
  let best = null, bd = 1e9;
  COLORS.forEach(c => { const M = rgb2lab(fromHex(c.h)), d = Math.hypot(L[0] - M[0], L[1] - M[1], L[2] - M[2]); if (d < bd) { bd = d; best = c; } });
  return best;
}
const FAM_EMO = {
  "Rossi": ["passione", "energia", "urgenza"], "Arancioni e terre": ["entusiasmo", "calore", "creatività"],
  "Gialli": ["ottimismo", "luce", "curiosità"], "Verdi-gialli": ["freschezza", "vitalità", "crescita"],
  "Verdi": ["natura", "equilibrio", "calma"], "Ciano": ["freschezza", "chiarezza", "tecnologia"],
  "Blu": ["fiducia", "calma", "stabilità"], "Viola": ["creatività", "mistero", "lusso"],
  "Rosa e magenta": ["gioia", "romanticismo", "originalità"], "Neutri": ["eleganza", "semplicità", "equilibrio"]
};
const familyOf = id => (FAMILIES.find(f => f[1].includes(id)) || ["Neutri"])[0];
const emotionsOf = hex => FAM_EMO[familyOf(nearest(hex).id)];
function colorOf(x) { return x && x[0] === "#" ? { id: x, n: x.toUpperCase(), h: x } : COLOR_BY[x]; }

const CVD = {
  protan: [[.567, .433, 0], [.558, .442, 0], [0, .242, .758]],
  deutan: [[.625, .375, 0], [.7, .3, 0], [0, .3, .7]],
  tritan: [[.95, .05, 0], [0, .433, .567], [0, .475, .525]]
};
const CVD_NOTE = {
  none: "",
  protan: "Protanopia: i rossi appaiono scuri e si confondono con i verdi. Riguarda circa 1 uomo su 100.",
  deutan: "Deuteranopia: verdi e rossi si confondono. È la forma più comune, circa 5 uomini su 100.",
  tritan: "Tritanopia: blu e gialli si confondono. È rara, meno di 1 persona su 10.000."
};
const simulate = (hex, v) => !CVD[v] ? hex : toHex(CVD[v].map(row => row.reduce((a, k, i) => a + k * fromHex(hex)[i], 0)));

const HARM = {
  none: [], comp: [180], anal: [-30, 30], triad: [120, 240], split: [150, 210], rect: [60, 180, 240], square: [90, 180, 270]
};
const HARM_N = { none: "Colore", comp: "Complementari", anal: "Analoghi", triad: "Triade", split: "Split complementari", rect: "Rettangolo", square: "Quadrato" };

const LAB = { h: 215, s: 75, l: 50, harm: "none", cvd: "none" };
const labHex = (h = LAB.h, s = LAB.s, l = LAB.l) => toHex(hsl2rgb(((h % 360) + 360) % 360, s, l));
const labColors = () => [labHex(), ...HARM[LAB.harm].map(d => labHex(LAB.h + d))];

function drawLab() {
  const hex = labHex(), rgb = fromHex(hex), cm = rgb2cmyk(...rgb), near = nearest(hex);
  q("[data-lab-preview]").style.background = simulate(hex, LAB.cvd);
  q("[data-sat]").value = LAB.s; q("[data-lig]").value = LAB.l;
  q("[data-s-val]").textContent = LAB.s + "%"; q("[data-l-val]").textContent = LAB.l + "%";
  q("[data-sat]").style.background = `linear-gradient(90deg, ${labHex(LAB.h, 0, LAB.l)}, ${labHex(LAB.h, 100, LAB.l)})`;
  q("[data-lig]").style.background = `linear-gradient(90deg, #000, ${labHex(LAB.h, LAB.s, 50)}, #fff)`;
  const hi = q("[data-hex]"); if (document.activeElement !== hi) hi.value = hex;
  q("[data-rgb]").textContent = `rgb(${rgb.join(", ")})`;
  q("[data-hsl]").textContent = `hsl(${LAB.h}°, ${LAB.s}%, ${LAB.l}%)`;
  q("[data-cmyk]").textContent = `C ${cm[0]}  M ${cm[1]}  Y ${cm[2]}  K ${cm[3]}`;
  q("[data-near]").innerHTML = `<i style="background:${near.h}"></i>${near.n}`;
  q("[data-emo]").textContent = emotionsOf(hex).join(", ");
  [["[data-ct-white]", "#ffffff"], ["[data-ct-black]", "#111111"]].forEach(([sel, fg]) => {
    const el = q(sel), r = contrast(hex, fg);
    el.style.background = hex; el.style.color = fg;
    el.querySelector("small").textContent = `${r.toFixed(1)}:1 · ${r >= 7 ? "AAA ✓" : r >= 4.5 ? "AA ✓" : r >= 3 ? "Solo testi grandi" : "Poco leggibile ✗"}`;
  });
  const wheel = q("[data-wheel]"), L = LAB.l;
  wheel.style.background = `radial-gradient(circle closest-side, hsl(0 0% ${L}%) 40%, hsl(0 0% ${L}% / 0) 100%), conic-gradient(${Array.from({ length: 13 }, (_, i) => `hsl(${i * 30} 100% ${L}%)`).join(",")})`;
  const marks = q("[data-wheel-marks]"), rr = 20 + 30 * LAB.s / 100;
  marks.innerHTML = [0, ...HARM[LAB.harm]].map((d, i) => {
    const a = (LAB.h + d) * Math.PI / 180;
    return `<i class="${i ? "" : "main"}" style="left:${50 + rr * Math.sin(a)}%;top:${50 - rr * Math.cos(a)}%;background:${simulate(labHex(LAB.h + d), LAB.cvd)}"></i>`;
  }).join("");
  q("[data-harm-row]").innerHTML = labColors().map(c => {
    const sc = simulate(c, LAB.cvd);
    return `<button class="hsw" data-copyhex="${c}"><i style="background:${sc};color:${onColor(sc)}">${c}</i><small>${nearest(c).n}</small></button>`;
  }).join("");
  q("[data-cvd-note]").textContent = CVD_NOTE[LAB.cvd];
}
function openLab(hex) {
  if (hex) { const [h, s, l] = rgb2hsl(...fromHex(hex)); Object.assign(LAB, { h, s, l }); }
  drawLab(); go("lab");
}
(() => {
  const wheel = q("[data-wheel]");
  const pick = e => {
    const r = wheel.getBoundingClientRect(), p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - r.left - r.width / 2, dy = p.clientY - r.top - r.height / 2;
    const d = Math.hypot(dx, dy) / r.width;
    if (e.type === "pointerdown" && d < .2) return false;
    LAB.h = Math.round((Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360);
    LAB.s = Math.round(Math.max(0, Math.min(1, (d - .2) / .3)) * 100);
    drawLab();
  };
  let drag = false;
  wheel.addEventListener("pointerdown", e => { if (pick(e) === false) return; drag = true; wheel.setPointerCapture(e.pointerId); });
  wheel.addEventListener("pointermove", e => { if (drag) pick(e); });
  wheel.addEventListener("pointerup", () => drag = false);
  wheel.addEventListener("pointercancel", () => drag = false);
  q("[data-sat]").addEventListener("input", e => { LAB.s = +e.target.value; drawLab(); });
  q("[data-lig]").addEventListener("input", e => { LAB.l = +e.target.value; drawLab(); });
  q("[data-hex]").addEventListener("input", e => {
    let v = e.target.value.trim(); if (v[0] !== "#") v = "#" + v;
    if (/^#[0-9a-f]{6}$/i.test(v)) { const [h, s, l] = rgb2hsl(...fromHex(v)); Object.assign(LAB, { h, s, l }); drawLab(); }
  });
  const copy = t => { try { navigator.clipboard.writeText(t); toast("Copiato: " + t); } catch { toast(t); } };
  q("[data-copy]").onclick = () => copy(labHex());
  q("[data-harm-row]").addEventListener("click", e => { const b = e.target.closest("[data-copyhex]"); if (b) copy(b.dataset.copyhex); });
  const chips = (sel, key, attr) => q(sel).addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    q(sel).querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
    LAB[key] = b.dataset[attr]; drawLab();
  });
  chips("[data-harm]", "harm", "h"); chips("[data-cvd]", "cvd", "v");
  q("[data-lab-save]").onclick = () => {
    const cols = LAB.harm === "none" ? [labHex(LAB.h, LAB.s, Math.min(90, LAB.l + 25)), labHex(), labHex(LAB.h, LAB.s, Math.max(10, LAB.l - 25))] : labColors();
    const name = `${HARM_N[LAB.harm]} · ${nearest(labHex()).n}`;
    S.myPalettes.push({ id: "p" + Date.now(), n: name, c: cols });
    if (LAB.harm !== "none") S.labSaved = true;
    save(); renderPalettes(); addXP(0);
    toast(LAB.harm === "none" ? "Palette di sfumature salvata" : "Armonia salvata in Le mie palette");
  };
})();

drawLab();

const PHOTO = { cols: [], cvd: "none" };
function kmeans(px, k) {
  let cent = [px[0]];
  while (cent.length < k) {
    let far = null, fd = -1;
    for (let i = 0; i < px.length; i += 7) {
      const d = Math.min(...cent.map(c => (c[0] - px[i][0]) ** 2 + (c[1] - px[i][1]) ** 2 + (c[2] - px[i][2]) ** 2));
      if (d > fd) { fd = d; far = px[i]; }
    }
    cent.push(far.slice());
  }
  let cnt = [];
  for (let it = 0; it < 12; it++) {
    const sum = cent.map(() => [0, 0, 0]); cnt = cent.map(() => 0);
    px.forEach(p => {
      let bi = 0, bd = 1e9;
      cent.forEach((c, i) => { const d = (c[0] - p[0]) ** 2 + (c[1] - p[1]) ** 2 + (c[2] - p[2]) ** 2; if (d < bd) { bd = d; bi = i; } });
      sum[bi][0] += p[0]; sum[bi][1] += p[1]; sum[bi][2] += p[2]; cnt[bi]++;
    });
    cent = cent.map((c, i) => cnt[i] ? sum[i].map(v => v / cnt[i]) : c);
  }
  return cent.map((c, i) => ({ hex: toHex(c), share: cnt[i] / px.length })).filter(c => c.share > .01).sort((a, b) => b.share - a.share);
}
function photoStats(cols) {
  let warm = 0, cool = 0, neutral = 0, sat = 0, lig = 0;
  cols.forEach(({ hex, share }) => {
    const [h, s, l] = rgb2hsl(...fromHex(hex));
    sat += s * share; lig += l * share;
    if (s < 15 || l < 8 || l > 94) neutral += share;
    else if (h < 70 || h >= 300) warm += share;
    else if (h >= 150 && h < 300) cool += share;
    else { neutral += share * .5; warm += share * .25; cool += share * .25; }
  });
  const lums = cols.map(c => lum(c.hex)), light = cols[lums.indexOf(Math.max(...lums))].hex, dark = cols[lums.indexOf(Math.min(...lums))].hex;
  const hues = cols.filter(c => { const [, s, l] = rgb2hsl(...fromHex(c.hex)); return s >= 20 && l > 10 && l < 92; }).map(c => rgb2hsl(...fromHex(c.hex))[0]);
  let spread = 0;
  hues.forEach(a => hues.forEach(b => { const d = Math.abs(a - b) % 360; spread = Math.max(spread, Math.min(d, 360 - d)); }));
  const harm = hues.length < 2 ? ["Neutra", "Pochi colori saturi: domina la luce più della tinta."]
    : spread <= 40 ? ["Monocromatica / analoga", "Le tinte sono vicine sulla ruota: l'insieme è coerente e armonioso."]
    : spread >= 150 ? ["Con contrasto complementare", "Ci sono tinte quasi opposte sulla ruota: l'immagine ha forte contrasto e vivacità."]
    : ["Varia", "Le tinte sono distribuite sulla ruota senza uno schema preciso."];
  return { warm, cool, neutral, sat, lig, light, dark, ratio: contrast(light, dark), harm };
}
function readPhoto(cols, st) {
  const pct = v => Math.round(v * 100) + "%";
  const nm = nearest(cols[0].hex), emo = FAM_EMO[familyOf(nm.id)], parts = [];
  if (st.warm > st.cool && st.warm > st.neutral) parts.push(`Prevalgono i colori caldi (${pct(st.warm)}): l'immagine comunica energia, calore e vicinanza.`);
  else if (st.cool > st.warm && st.cool > st.neutral) parts.push(`Prevalgono i colori freddi (${pct(st.cool)}): l'immagine trasmette calma, distanza e riflessione.`);
  else parts.push(`Prevalgono i toni neutri (${pct(st.neutral)}): l'immagine risulta sobria ed equilibrata, e i pochi colori accesi attirano l'attenzione.`);
  parts.push(st.sat > 55 ? "I colori sono molto saturi: l'effetto è vivace e dinamico." : st.sat > 30 ? "La saturazione è media: l'insieme è armonioso senza essere aggressivo." : "I colori sono tenui: l'atmosfera è delicata, quasi da mezzitoni.");
  parts.push(st.lig > 62 ? "L'immagine è luminosa e leggera." : st.lig > 38 ? "La luminosità è equilibrata." : "L'immagine è scura e raccolta, con un tono più intenso o misterioso.");
  parts.push(`Il colore principale è vicino al tono “${nm.n}” e richiama ${emo.join(", ")}.`);
  return parts.join(" ");
}
function meter(label, value, txt, bg) {
  return `<div class="ph-stat"><div class="ph-sh"><span>${label}</span><b>${txt}</b></div><div class="ph-track" style="background:${bg}"><i style="left:${Math.max(0, Math.min(100, value))}%"></i></div></div>`;
}
function drawPhoto() {
  const v = PHOTO.cvd, st = PHOTO.st;
  q("[data-photo-img]").style.filter = v === "none" ? "" : `url(#cvd-${v})`;
  q("[data-photo-bar]").innerHTML = PHOTO.cols.map(c => `<i style="flex:${c.share};background:${simulate(c.hex, v)}"></i>`).join("");
  q("[data-photo-list]").innerHTML = PHOTO.cols.map((c, k) => {
    const nm = nearest(c.hex), sc = simulate(c.hex, v);
    return `<button class="pc" data-labhex="${c.hex}"><i style="background:${sc}"></i><span><b>${nm.n}${k ? "" : " · principale"}</b><small>${c.hex} · ${FAM_EMO[familyOf(nm.id)].slice(0, 2).join(", ")}</small><u style="width:${Math.max(4, Math.round(c.share * 100))}%;background:${sc}"></u></span><em>${Math.round(c.share * 100)}%</em></button>`;
  }).join("");
  const t = Math.round((st.warm - st.cool + 1) * 50);
  const tr = st.ratio;
  q("[data-photo-stats]").innerHTML =
    meter("Temperatura", 100 - t, st.warm > st.cool + .1 ? "Calda" : st.cool > st.warm + .1 ? "Fredda" : "Equilibrata", "linear-gradient(90deg,#ff7a00,#f2d9b5 50%,#1f5fe0)") +
    meter("Saturazione", st.sat, Math.round(st.sat) + "%", "linear-gradient(90deg,#9a9a9a,#e3242b)") +
    meter("Luminosità", st.lig, Math.round(st.lig) + "%", "linear-gradient(90deg,#111,#888 50%,#fff)") +
    `<div class="ph-stat ph-row"><div class="ph-ct" style="background:${simulate(st.dark, v)};color:${simulate(st.light, v)}">Aa</div><div><div class="ph-sh"><span>Contrasto interno</span><b>${tr.toFixed(1)}:1</b></div><small>${tr >= 7 ? "Molto forte: luci e ombre ben separate." : tr >= 4.5 ? "Buono: la foto ha una chiara gerarchia di luce." : tr >= 2.5 ? "Medio: toni abbastanza ravvicinati." : "Basso: immagine piatta e morbida."}</small></div></div>` +
    `<div class="ph-stat ph-row"><div class="ph-harm">${PHOTO.cols.map(c => `<i style="background:${simulate(c.hex, v)}"></i>`).join("")}</div><div><div class="ph-sh"><span>Armonia</span><b>${st.harm[0]}</b></div><small>${st.harm[1]}</small></div></div>`;
}
function analyze(src, done) {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas"), n = 140, k = Math.min(1, n / Math.max(img.width, img.height));
    c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
    const ctx = c.getContext("2d", { willReadFrequently: true }); ctx.drawImage(img, 0, 0, c.width, c.height);
    const d = ctx.getImageData(0, 0, c.width, c.height).data, px = [];
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) px.push([d[i], d[i + 1], d[i + 2]]);
    if (!px.length) return toast("Immagine non valida");
    PHOTO.cols = kmeans(px, 5); PHOTO.st = photoStats(PHOTO.cols);
    q("[data-photo-img]").src = src;
    q("[data-photo-box]").hidden = false; q("[data-photo-intro]").hidden = true;
    q("[data-photo-read]").textContent = readPhoto(PHOTO.cols, PHOTO.st);
    drawPhoto();
    if (!S.photoDone) { S.photoDone = true; addXP(0); }
    q("#foto .scroll").scrollTo({ top: q("[data-photo-box]").offsetTop - 70, behavior: "smooth" });
    if (done) done();
  };
  img.onerror = () => toast("Non riesco a leggere questa immagine");
  img.src = src;
}
(() => {
  document.querySelectorAll("[data-photo]").forEach(inp => inp.addEventListener("change", e => {
    const file = e.target.files[0]; if (!file) return;
    analyze(URL.createObjectURL(file), () => e.target.value = "");
  }));
  document.querySelectorAll("[data-sample]").forEach(b => b.onclick = () => analyze("assets/" + b.dataset.sample));
  q("[data-photo-again]").onclick = () => { q("[data-photo-box]").hidden = true; q("[data-photo-intro]").hidden = false; q("#foto .scroll").scrollTo({ top: 0, behavior: "smooth" }); };
  q("[data-pcvd]").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    q("[data-pcvd]").querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
    PHOTO.cvd = b.dataset.v; drawPhoto();
  });
  q("[data-photo-list]").addEventListener("click", e => { const b = e.target.closest("[data-labhex]"); if (b) openLab(b.dataset.labhex); });
  q("[data-photo-save]").onclick = () => {
    S.myPalettes.push({ id: "p" + Date.now(), n: "Dalla foto · " + nearest(PHOTO.cols[0].hex).n, c: PHOTO.cols.map(c => c.hex) });
    save(); renderPalettes(); toast("Palette della foto salvata");
  };
})();

const rnd = (a, b) => a + Math.random() * (b - a);
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const GAMES = {
  guess: { t: "Indovina il colore", p: "Quale colore corrisponde a questo codice HEX?",
    round() {
      const h = rnd(0, 360), s = rnd(55, 90), l = rnd(35, 62), ok = labHex(h, s, l);
      const opts = [ok, labHex(h + rnd(50, 90), s, l), labHex(h - rnd(50, 90), s, l), labHex(h + rnd(150, 210), s, Math.min(80, l + rnd(0, 15)))];
      return { target: `<b class="g-hex">${ok}</b>`, opts: shuffle(opts), ok };
    } },
  comp: { t: "Trova il complementare", p: "Quale colore sta dalla parte opposta della ruota?",
    round() {
      const h = rnd(0, 360), s = rnd(60, 90), l = rnd(40, 58), base = labHex(h, s, l), ok = labHex(h + 180, s, l);
      const opts = [ok, labHex(h + 90, s, l), labHex(h + 130, s, l), labHex(h + 240, s, l)];
      return { target: `<i class="g-sw" style="background:${base}"></i>`, opts: shuffle(opts), ok };
    } },
  order: { t: "Dal chiaro allo scuro", p: "Tocca i colori dal più chiaro al più scuro.",
    round() {
      let cols;
      do { cols = Array.from({ length: 4 }, () => labHex(rnd(0, 360), rnd(40, 90), rnd(20, 80))); }
      while (cols.map(c => lum(c)).sort((a, b) => a - b).some((v, i, a) => i && v - a[i - 1] < .05));
      return { opts: shuffle(cols), order: [...cols].sort((a, b) => lum(b) - lum(a)) };
    } }
};
function startGame(g) {
  const G = GAMES[g], scr = q("#gioco");
  let n = 0, score = 0, cur, taps = [];
  q("[data-g-title]", scr).textContent = G.t;
  const next = q("[data-g-next]", scr);
  const show = () => {
    cur = G.round(); taps = [];
    q("[data-g-round]", scr).textContent = `Round ${n + 1} / 5`;
    q("[data-g-score]", scr).textContent = `Punti ${score}`;
    q("[data-g-prompt]", scr).textContent = G.p;
    q("[data-g-target]", scr).innerHTML = cur.target || "";
    q("[data-g-feedback]", scr).textContent = "";
    next.hidden = true;
    const box = q("[data-g-opts]", scr);
    box.className = "g-opts" + (g === "order" ? " order" : "");
    box.innerHTML = "";
    cur.opts.forEach(c => {
      const b = document.createElement("button");
      b.className = "g-opt"; b.style.background = c; b.dataset.c = c;
      b.onclick = () => g === "order" ? tapOrder(b) : answer(b);
      box.appendChild(b);
    });
  };
  const done = right => {
    if (right) score++;
    q("[data-g-score]", scr).textContent = `Punti ${score}`;
    next.hidden = false;
  };
  const answer = b => {
    if (!next.hidden) return;
    const right = b.dataset.c === cur.ok;
    b.classList.add(right ? "right" : "wrong");
    q(`[data-c="${cur.ok}"]`, scr).classList.add("right");
    q("[data-g-feedback]", scr).textContent = right ? "Esatto! 🎉" : "Non proprio: quello giusto è evidenziato.";
    done(right);
  };
  const tapOrder = b => {
    if (!next.hidden || b.dataset.n) return;
    taps.push(b.dataset.c); b.dataset.n = taps.length; b.textContent = taps.length;
    b.style.color = onColor(b.dataset.c);
    if (taps.length < cur.opts.length) return;
    const right = taps.every((c, i) => c === cur.order[i]);
    q("[data-g-opts]", scr).querySelectorAll(".g-opt").forEach(x => { x.classList.add(x.dataset.c === cur.order[+x.dataset.n - 1] ? "right" : "wrong"); });
    q("[data-g-feedback]", scr).textContent = right ? "Ordine perfetto! 🎉" : "Quasi: l'ordine giusto è " + cur.order.map(c => cur.opts.indexOf(c) + 1).join(" → ") + " (posizioni da sinistra).";
    done(right);
  };
  next.onclick = () => {
    n++;
    if (n < 5) return show();
    const prev = (S.games || {})[g] || 0;
    S.games = S.games || {}; S.games[g] = Math.max(prev, score);
    const d = day(); d.quiz++; if (score === 5) d.perfect++;
    q("[data-g-round]", scr).textContent = "Fine!";
    q("[data-g-prompt]", scr).textContent = `Hai fatto ${score} su 5. ${score >= 4 ? "Ottimo occhio!" : "Riprova per allenarti ancora."}`;
    q("[data-g-target]", scr).innerHTML = `<b class="g-hex">${score} / 5</b>`;
    q("[data-g-opts]", scr).innerHTML = "";
    q("[data-g-feedback]", scr).textContent = `Record: ${S.games[g]} / 5 · + ${score * 5} XP`;
    addXP(score * 5);
    next.textContent = "Rigioca"; next.onclick = () => { next.textContent = "avanti"; startGame(g); };
  };
  next.textContent = "avanti";
  show();
  if (current !== "gioco") go("gioco");
}
document.addEventListener("click", e => { const b = e.target.closest("[data-game]"); if (b) startGame(b.dataset.game); });

function cotd() {
  const n = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
  return COLOR_BY[SCALE[n % SCALE.length]];
}
q("[data-cotd]").onclick = () => openLab(cotd().h);
const _renderBase = render;
render = function () {
  _renderBase();
  const c = cotd();
  if (q("[data-cotd-sw]")) {
    q("[data-cotd-sw]").style.background = c.h;
    q("[data-cotd-name]").textContent = c.n;
    q("[data-cotd-hex]").textContent = c.h.toUpperCase();
    q("[data-cotd-emo]").textContent = FAM_EMO[familyOf(c.id)].join(" · ");
  }
  document.querySelectorAll("[data-best]").forEach(el => { const v = (S.games || {})[el.dataset.best]; el.textContent = v != null ? `Record ${v}/5` : "Da provare"; });
};
