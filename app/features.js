const $$ = (q, root = document) => root.querySelector(q);

$$("[data-onboarded]").addEventListener("click", () => {
  const v = $$("[data-onb-name]").value.trim();
  if (v) S.name = v;
  save(); render();
});

let tick = 0;
setInterval(() => {
  if (document.hidden || !S.onboarded) return;
  S.time++;
  if (++tick % 15 === 0) { save(); render(); }
}, 1000);
addEventListener("visibilitychange", () => { if (document.hidden) save(); });

function renderPalettes() {
  const list = $$("[data-palettes]");
  list.innerHTML = "";
  const add = (name, hexes, open, menu, mine) => {
    const b = document.createElement("div");
    b.className = "pal-item" + (mine ? " mine" : "");
    b.tabIndex = 0; b.setAttribute("role", "button");
    b.innerHTML = `<div class="n">${name}${mine ? ' <small>personale</small>' : ""}</div>
      <div class="pal-dots">${hexes.map(h => `<i style="background:${h}"></i>`).join("")}</div>
      <button class="more" aria-label="Opzioni">⋮</button>`;
    b.onclick = e => { if (!e.target.closest(".more")) open(); };
    b.querySelector(".more").onclick = e => { e.stopPropagation(); menu(); };
    list.appendChild(b);
  };
  PALETTES.forEach((p, k) => add(p.n, p.c, () => openPalette(k), () => sheet(p.n, [
    ["Apri", () => openPalette(k)],
    ["Crea una palette simile", () => openEditor(null, p.n + " (mia)")]
  ])));
  S.myPalettes.forEach(p => add(p.n, p.c.map(id => COLOR_BY[id]?.h || "#ccc"), () => openMyPalette(p.id), () => sheet(p.n, [
    ["Apri", () => openMyPalette(p.id)],
    ["Modifica", () => openEditor(p.id)],
    ["Usa il primo colore come tema", () => { applyTheme(p.c[0]); toast("Tema “" + COLOR_BY[p.c[0]].n + "” applicato"); }],
    ["Elimina", () => confirmBox("Eliminare la palette?", `“${p.n}” verrà cancellata.`, () => {
      S.myPalettes = S.myPalettes.filter(x => x.id !== p.id); save(); renderPalettes(); toast("Palette eliminata");
    }), "danger"]
  ]), true));
}

const _openPalette = openPalette;
openPalette = k => {
  const scr = $$("#palettedet");
  scr.querySelectorAll(".pal-card")[1].hidden = false;
  $$(".pal-emo-h", scr).textContent = "Emozioni associate";
  $$(".pal-card h3", scr).textContent = "Significato";
  _openPalette(k);
};

function openMyPalette(id) {
  const p = S.myPalettes.find(x => x.id === id), scr = $$("#palettedet");
  const cols = p.c.map(c => COLOR_BY[c]).filter(Boolean);
  $$("[data-pal-title]", scr).textContent = p.n;
  const dots = $$("[data-pal-dots]", scr);
  dots.innerHTML = "";
  cols.forEach(c => {
    const i = document.createElement("button");
    i.className = "pal-dot-btn"; i.style.background = c.h; i.title = "Usa " + c.n + " come tema";
    i.onclick = () => { applyTheme(c.id); toast("Tema “" + c.n + "” applicato"); };
    dots.appendChild(i);
  });
  $$(".pal-card h3", scr).textContent = "La tua palette";
  $$("[data-pal-text]", scr).textContent = `Creata da te con ${cols.length} colori sbloccati. Tocca un colore qui sopra per usarlo come tema dell'app.`;
  $$(".pal-emo-h", scr).textContent = "Colori";
  $$("[data-pal-emo]", scr).innerHTML = cols.map(c => `<span style="background:${c.h};color:${onColor(c.h)}">${c.n}</span>`).join("");
  scr.querySelectorAll(".pal-card")[1].hidden = true;
  go("palettedet");
}

let editing = null, picked = [];
function openEditor(id, suggestedName = "") {
  editing = id;
  const p = id ? S.myPalettes.find(x => x.id === id) : null;
  picked = p ? [...p.c] : [];
  $$("[data-pe-title]").textContent = p ? "Modifica palette" : "Nuova palette";
  $$("[data-pe-name]").value = p ? p.n : suggestedName;
  drawEditor();
  go("paledit");
}
function drawEditor() {
  $$("[data-pe-preview]").innerHTML = Array.from({ length: 6 }, (_, i) =>
    `<i style="background:${picked[i] ? COLOR_BY[picked[i]].h : "transparent"}" class="${picked[i] ? "" : "empty"}"></i>`).join("");
  $$("[data-pe-count]").textContent = `${picked.length} / 6`;
  const g = $$("[data-pe-grid]");
  g.innerHTML = "";
  byHue(S.owned).forEach(id => {
    const c = COLOR_BY[id], b = document.createElement("button");
    b.className = "sw" + (picked.includes(id) ? " cur" : "");
    b.innerHTML = `<i style="background:${c.h}"></i><span>${c.n}</span>`;
    b.onclick = () => {
      if (picked.includes(id)) picked = picked.filter(x => x !== id);
      else if (picked.length < 6) picked.push(id);
      else toast("Massimo 6 colori per palette");
      drawEditor();
    };
    g.appendChild(b);
  });
}
$$("[data-new-palette]").onclick = () => openEditor(null);
$$("[data-pe-save]").onclick = () => {
  const n = $$("[data-pe-name]").value.trim();
  if (!n) return toast("Dai un nome alla palette");
  if (picked.length < 2) return toast("Scegli almeno 2 colori");
  if (editing) Object.assign(S.myPalettes.find(x => x.id === editing), { n, c: [...picked] });
  else S.myPalettes.push({ id: "p" + Date.now(), n, c: [...picked] });
  save(); renderPalettes();
  toast(editing ? "Palette aggiornata" : "Palette creata!");
  navStack.length = 0; go("explore", false); go("palette");
};

function sheet(title, actions) {
  const bg = $$("[data-sheet-bg]"), sh = $$("[data-sheet]");
  sh.innerHTML = `<h3>${title}</h3>`;
  actions.forEach(([label, fn, cls]) => {
    const b = document.createElement("button");
    b.className = "sheet-btn " + (cls || ""); b.textContent = label;
    b.onclick = () => { bg.hidden = true; fn(); };
    sh.appendChild(b);
  });
  const c = document.createElement("button");
  c.className = "sheet-btn cancel"; c.textContent = "Annulla"; c.onclick = () => bg.hidden = true;
  sh.appendChild(c);
  bg.hidden = false;
}
$$("[data-sheet-bg]").onclick = e => { if (e.target.matches("[data-sheet-bg]")) e.target.hidden = true; };

function confirmBox(t, p, yes) {
  const bg = $$("[data-confirm]");
  $$("[data-confirm-t]").textContent = t; $$("[data-confirm-p]").textContent = p;
  $$("[data-confirm-yes]").onclick = () => { bg.hidden = true; yes(); };
  $$("[data-confirm-no]").onclick = () => bg.hidden = true;
  bg.hidden = false;
}

const nameInput = $$("[data-set-name]");
nameInput.addEventListener("change", () => { S.name = nameInput.value.trim(); save(); render(); toast("Nome salvato"); });
document.addEventListener("click", e => { if (e.target.closest('[data-go="impostazioni"]')) nameInput.value = S.name || ""; });

$$("[data-dark-seg]").addEventListener("click", e => {
  const b = e.target.closest("[data-dark]"); if (!b) return;
  S.dark = b.dataset.dark; save(); applyDark();
});
function applyDark() {
  const sys = matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = S.dark === "dark" || (S.dark === "auto" && sys);
  document.documentElement.dataset.dark = dark ? "dark" : "light";
  document.querySelectorAll("[data-dark-seg] button").forEach(b => b.classList.toggle("on", b.dataset.dark === S.dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? "#141417" : "#7b2482";
  applyTheme(S.theme);
}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyDark);

const FRESH = () => ({ ...JSON.parse(JSON.stringify(DEF)), dark: S.dark });
function resetAll() {
  try { localStorage.setItem("chroma", JSON.stringify(FRESH())); } catch {}
  location.reload();
}
$$("[data-reset]").onclick = () => confirmBox("Azzerare tutto?",
  "XP, livelli, lezioni, colori, badge e palette torneranno a zero e ripartirà l'onboarding.", resetAll);

function today() { return new Date().toISOString().slice(0, 10); }
function fillTitles() {
  if (!Array.isArray(S.titles)) S.titles = [];
  for (let l = 1; l <= S.level; l++) if (!S.titles.some(t => t.l === l)) S.titles.push({ l, d: null });
  S.titles.sort((a, b) => a.l - b.l);
}
function shownTitle() {
  return S.shownTitle && S.shownTitle <= S.level ? levelTitle(S.shownTitle) : levelTitle(S.level);
}
let luQueue = [];
function onLevelUp() {
  fillTitles();
  const t = S.titles.find(x => x.l === S.level); if (t && !t.d) t.d = today();
  S.shownTitle = null;
  save();
  luQueue.push(S.level);
  if (luQueue.length === 1) showLevelUp();
}
function showLevelUp() {
  const l = luQueue[0], bg = $$("[data-levelup]");
  $$("[data-lu-lv]").textContent = l;
  $$("[data-lu-title]").textContent = levelTitle(l);
  const burst = $$("[data-lu-burst]");
  burst.innerHTML = Array.from({ length: 18 }, (_, i) =>
    `<i style="--a:${i * 20}deg;--c:hsl(${i * 20} 80% 55%);--d:${(i % 3) * .08}s"></i>`).join("");
  $$("[data-lu-lv]").parentElement.style.color = l > 20 ? "" : levelColor(l);
  bg.hidden = false;
}
$$("[data-lu-ok]").onclick = () => {
  luQueue.shift();
  if (luQueue.length) showLevelUp(); else $$("[data-levelup]").hidden = true;
};
$$("[data-title-pick]").onclick = () => {
  fillTitles();
  const opts = S.titles.slice().reverse().slice(0, 8).map(t => [
    (levelTitle(t.l) === shownTitle() ? "✓ " : "") + levelTitle(t.l) + "  · Lv " + t.l,
    () => { S.shownTitle = t.l === S.level ? null : t.l; save(); render(); toast("Titolo aggiornato") }
  ]);
  opts.push(["Vedi tutti i titoli…", () => go("titoli")]);
  sheet("Scegli il titolo da mostrare", opts);
};
function renderTimeline() {
  const ol = $$("[data-timeline]"); if (!ol) return;
  fillTitles();
  const max = Math.max(20, S.level + 1);
  const fmt = d => d ? new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" }) : "prima del registro";
  ol.innerHTML = "";
  const order = [S.level + 1, ...Array.from({ length: S.level }, (_, i) => S.level - i),
    ...Array.from({ length: Math.max(0, max - S.level - 1) }, (_, i) => S.level + 2 + i)];
  for (const l of order) {
    const got = l <= S.level, t = S.titles.find(x => x.l === l);
    const li = document.createElement("li");
    li.className = (got ? "got" : "locked") + (got && levelTitle(l) === shownTitle() ? " shown" : "") + (l === S.level + 1 ? " next" : "");
    li.innerHTML = `<span class="tl-dot" style="--c:${levelColor(l)}">${got ? l : "🔒"}</span>
      <div><b>${got || l === S.level + 1 ? levelTitle(l) : "???"}</b>
      <small>${got ? "Livello " + l + " · " + fmt(t?.d) : l === S.level + 1 ? `Prossimo · mancano ${1000 - S.xp} XP` : "Livello " + l}</small></div>
      ${got && levelTitle(l) === shownTitle() ? '<em>In mostra</em>' : ""}`;
    if (got) li.onclick = () => { S.shownTitle = l === S.level ? null : l; save(); render(); toast("Ora mostri: " + levelTitle(l)); };
    ol.appendChild(li);
  }
}

const AV_ICONS = {
  palette: '<path d="M50 22c-17 0-30 12-30 27 0 10 7 15 14 15 5 0 6 3 6 6 0 5 4 8 10 8 17 0 30-13 30-29S67 22 50 22z" fill="#fff"/><circle cx="37" cy="44" r="5" fill="#e11d1d"/><circle cx="50" cy="35" r="5" fill="#ffbf00"/><circle cx="63" cy="42" r="5" fill="#1434e0"/><circle cx="64" cy="57" r="5" fill="#00a86b"/>',
  brush: '<path d="M70 20l10 10-30 30-10-10z" fill="#fff"/><path d="M38 52l10 10c-2 10-12 16-24 14 6-4 4-12 14-24z" fill="#ffbf00"/>',
  drop: '<path d="M50 18c12 18 22 28 22 42a22 22 0 0 1-44 0c0-14 10-24 22-42z" fill="#fff"/><circle cx="42" cy="56" r="3.5" fill="#222"/><circle cx="58" cy="56" r="3.5" fill="#222"/><path d="M43 66q7 6 14 0" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/>',
  prism: '<path d="M50 22l26 46H24z" fill="#fff" opacity=".95"/><path d="M8 52l30-4" stroke="#fff" stroke-width="3"/><path d="M64 46l30-10M65 50l30-2M66 54l30 6M66 58l30 14" stroke-width="4" stroke="#fff"/><path d="M64 46l30-10" stroke="#e11d1d" stroke-width="4"/><path d="M65 50l30-2" stroke="#ffbf00" stroke-width="4"/><path d="M66 54l30 6" stroke="#00a86b" stroke-width="4"/><path d="M66 58l30 14" stroke="#6b3fb8" stroke-width="4"/>',
  sun: '<circle cx="50" cy="50" r="15" fill="#fff"/>' + Array.from({ length: 8 }, (_, i) => `<rect x="47" y="16" width="6" height="12" rx="3" fill="#fff" transform="rotate(${i * 45} 50 50)"/>`).join(""),
  moon: '<path d="M60 20a30 30 0 1 0 20 50A24 24 0 0 1 60 20z" fill="#fff"/><circle cx="72" cy="30" r="3" fill="#fff"/><circle cx="80" cy="44" r="2" fill="#fff"/>',
  leaf: '<path d="M26 74C26 40 50 24 78 24c0 30-18 50-52 50z" fill="#fff"/><path d="M28 72C44 56 56 44 70 32" stroke="#1f9d55" stroke-width="3" fill="none"/>',
  eye: '<path d="M16 50q34-34 68 0-34 34-68 0z" fill="#fff"/><circle cx="50" cy="50" r="12" fill="#22919e"/><circle cx="50" cy="50" r="5" fill="#111"/>',
  crown: '<path d="M22 66l-4-32 18 14 14-22 14 22 18-14-4 32z" fill="#fff"/><rect x="22" y="70" width="56" height="8" rx="3" fill="#fff"/><circle cx="50" cy="56" r="4" fill="#d0112b"/>',
  rainbow: '<path d="M14 70a36 36 0 0 1 72 0" stroke="#e11d1d" stroke-width="7" fill="none"/><path d="M22 70a28 28 0 0 1 56 0" stroke="#ffbf00" stroke-width="7" fill="none"/><path d="M30 70a20 20 0 0 1 40 0" stroke="#00a86b" stroke-width="7" fill="none"/><path d="M38 70a12 12 0 0 1 24 0" stroke="#1434e0" stroke-width="7" fill="none"/>'
};
const AVATARS = [
  { id: "default", lv: 1, n: "Classico" }, { id: "chroma", lv: 1, n: "Chroma" },
  { id: "palette", lv: 1, bg: "#7b2482", n: "Tavolozza" }, { id: "brush", lv: 1, bg: "#1f4fb8", n: "Pennello" },
  { id: "drop", lv: 2, bg: "#22919e", n: "Goccia" }, { id: "prism", lv: 3, bg: "#2b2b33", n: "Prisma" },
  { id: "sun", lv: 5, bg: "#f2a900", n: "Sole" }, { id: "moon", lv: 5, bg: "#4b3fcf", n: "Luna" },
  { id: "leaf", lv: 8, bg: "#1f9d55", n: "Foglia" }, { id: "eye", lv: 10, bg: "#d0112b", n: "Occhio" },
  { id: "crown", lv: 15, bg: "#c9960f", n: "Corona" }, { id: "rainbow", lv: 20, bg: "#101018", n: "Arcobaleno" }
];
function avatarHTML(a) {
  a = a || S.avatar || { type: "preset", id: "default" };
  if (a.type === "photo") return `<img src="${a.data}" alt="La tua foto">`;
  if (a.id === "default") return `<span class="av-default"><img src="assets/ic-profilo.png" alt=""></span>`;
  if (a.id === "chroma") return `<span class="av-chroma"><img src="assets/chroma-faccia.png" alt=""></span>`;
  const p = AVATARS.find(x => x.id === a.id) || AVATARS[0];
  return `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="${p.bg}"/>${AV_ICONS[p.id] || ""}</svg>`;
}
function renderAvatars() {
  document.querySelectorAll("[data-avatar]").forEach(el => el.innerHTML = avatarHTML());
  const ring = $$(".avatar-ring");
  if (ring) ring.style.setProperty("--p", (S.xp / 10) + "%");
  const g = $$("[data-av-grid]"); if (!g) return;
  g.innerHTML = "";
  AVATARS.forEach(p => {
    const ok = S.level >= p.lv, cur = (S.avatar?.type !== "photo") && (S.avatar?.id || "default") === p.id;
    const b = document.createElement("button");
    b.className = "av-opt" + (ok ? "" : " locked") + (cur ? " cur" : "");
    b.innerHTML = `<span class="avatar-pic">${avatarHTML({ type: "preset", id: p.id })}</span><small>${ok ? p.n : "Lv " + p.lv}</small>`;
    b.onclick = () => {
      if (!ok) return toast(`Si sblocca al livello ${p.lv}`);
      S.avatar = { type: "preset", id: p.id }; save(); renderAvatars(); toast("Avatar aggiornato");
    };
    g.appendChild(b);
  });
}
$$("[data-av-file]").addEventListener("change", e => {
  const file = e.target.files[0]; if (!file) return;
  const img = new Image(), url = URL.createObjectURL(file);
  img.onload = () => {
    const c = document.createElement("canvas"), n = 256; c.width = c.height = n;
    const k = Math.max(n / img.width, n / img.height), w = img.width * k, h = img.height * k;
    c.getContext("2d").drawImage(img, (n - w) / 2, (n - h) / 2, w, h);
    S.avatar = { type: "photo", data: c.toDataURL("image/jpeg", .85) };
    URL.revokeObjectURL(url); e.target.value = "";
    save(); renderAvatars(); toast("Foto del profilo aggiornata");
  };
  img.onerror = () => toast("Immagine non valida");
  img.src = url;
});

const _render = render;
render = function () { _render(); renderAvatars(); renderTimeline(); };

function secretTaps(el) {
  let n = 0, t;
  el.addEventListener("click", () => {
    clearTimeout(t); t = setTimeout(() => n = 0, 1200);
    if (++n >= 5) { n = 0; $$("[data-demo]").hidden = false; }
    else if (n >= 3) toast(`Ancora ${5 - n}…`);
  });
}
secretTaps($$("[data-version]"));
secretTaps($$(".home-face"));
$$("[data-demo-close]").onclick = () => $$("[data-demo]").hidden = true;
$$("[data-demo]").onclick = e => { if (e.target.matches("[data-demo]")) e.target.hidden = true; };

const SIM = {
  xp: () => { addXP(100); return "+100 XP"; },
  level: () => { S.level++; onLevelUp(); save(); render(); return ""; },
  time: () => { S.time += 3600; save(); render(); return "+1 ora di studio"; },
  day: () => { S.streak++; S.m.days++; save(); render(); return "Streak: " + S.streak + " giorni"; },
  lessons: () => {
    let n = 0;
    LESSONS.forEach(l => { if (!S.done.includes(l.id)) { S.done.push(l.id); S.lessonsTotal++; S.m.lessons++; n++; } });
    addXP(n * 50); return n ? `${n} lezioni completate (+${n * 50} XP)` : "Lezioni già tutte completate";
  },
  quiz: () => { S.quizzes += 5; S.m.quiz += 5; save(); render(); return "+5 quiz completati"; },
  missions: () => {
    S.m.lessons = Math.max(S.m.lessons, 3); S.m.quiz = Math.max(S.m.quiz, 5); S.m.days = Math.max(S.m.days, 5);
    COLORS.slice(0, 10).forEach(c => { if (!S.owned.includes(c.id)) S.owned.push(c.id); });
    S.claimed = []; save(); render(); return "Missioni pronte da riscattare!";
  },
  colors: () => { S.owned = COLORS.map(c => c.id); save(); render(); return "Tutti i " + COLORS.length + " colori sbloccati"; },
  badges: () => {
    S.badges = ["Badge dello studente", "Badge dello studioso", "Badge sociale"];
    S.owned = COLORS.map(c => c.id); if (S.level < 10) S.level = 10;
    save(); render(); return "Tutti i badge sbloccati";
  },
  expert: () => {
    Object.assign(S, {
      level: 12, xp: 450, xpTotal: 12450, time: 30 * 3600 + 25 * 60, streak: 21, quizzes: 42, lessonsTotal: 24,
      missionsDone: 25, done: LESSONS.map(l => l.id), badges: ["Badge dello studente", "Badge dello studioso", "Badge sociale"],
      m: { lessons: 2, quiz: 4, days: 5, colors: 0 }, claimed: [], onboarded: true, name: S.name || "Luca", shownTitle: null
    });
    fillTitles();
    COLORS.slice(0, 22).forEach(c => { if (!S.owned.includes(c.id)) S.owned.push(c.id); });
    save(); render(); return "Profilo da utente esperto caricato";
  },
  fresh: () => { confirmBox("Nuovo utente?", "Tutti i progressi verranno azzerati e ripartirà l'onboarding.", resetAll); return ""; }
};
$$("[data-demo]").addEventListener("click", e => {
  const b = e.target.closest("[data-sim]"); if (!b) return;
  const msg = SIM[b.dataset.sim]();
  if (msg) toast(msg);
});

const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isMobile = matchMedia("(max-width: 500px)").matches || /android|iphone|ipad|ipod/i.test(navigator.userAgent);
let installEvt = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; showInstallBar(); });
function showInstallBar() {
  let off = false; try { off = localStorage.getItem("chroma-install-off") === "1"; } catch {}
  $$("[data-install]").hidden = standalone || off || !isMobile || !(installEvt || isIOS);
}
function doInstall() {
  if (standalone) return toast("CHROMA è già installata");
  if (installEvt) { installEvt.prompt(); installEvt.userChoice.then(() => { installEvt = null; showInstallBar(); }); return; }
  const sh = $$("[data-sheet]");
  sh.innerHTML = isIOS
    ? `<h3>Installa CHROMA su iPhone</h3><ol class="ios-steps"><li>Apri questa pagina con <b>Safari</b></li><li>Tocca il tasto <b>Condividi</b> (il quadrato con la freccia ↑)</li><li>Scegli <b>Aggiungi a Home</b> e poi <b>Aggiungi</b></li><li>Apri CHROMA dall'icona: sarà a schermo intero</li></ol>`
    : `<h3>Installa CHROMA</h3><ol class="ios-steps"><li>Apri il menu del browser <b>⋮</b></li><li>Scegli <b>Installa app</b> o <b>Aggiungi a schermata Home</b></li><li>Apri CHROMA dall'icona: sarà a schermo intero</li></ol>`;
  const c = document.createElement("button"); c.className = "sheet-btn cancel"; c.textContent = "Ho capito";
  c.onclick = () => $$("[data-sheet-bg]").hidden = true; sh.appendChild(c);
  $$("[data-sheet-bg]").hidden = false;
}
document.querySelectorAll("[data-install-go]").forEach(b => b.onclick = doInstall);
$$("[data-install-x]").onclick = () => { try { localStorage.setItem("chroma-install-off", "1"); } catch {} $$("[data-install]").hidden = true; };
showInstallBar();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

if (!Array.isArray(S.owned)) S.owned = [...DEF.owned];
S.owned = [...new Set(["perla", "ardesia", ...S.owned.map(id => OLD_COLORS[id] || id)].filter(id => COLOR_BY[id]))];
if (S.theme) S.theme = COLOR_BY[OLD_COLORS[S.theme] || S.theme] ? (OLD_COLORS[S.theme] || S.theme) : null;
(S.myPalettes || []).forEach(p => p.c = [...new Set(p.c.map(id => OLD_COLORS[id] || id).filter(id => COLOR_BY[id]))]);
if (!Array.isArray(S.myPalettes)) S.myPalettes = [];
fillTitles();
S.redeemed.forEach(q => { const c = EV[q]; if (c && !S.owned.includes(c)) S.owned.push(c); });
applyDark();
renderPalettes();
render();
go("splash", false);
setTimeout(() => { if (current === "splash") go(S.onboarded ? "home" : "onb1", false); }, 2000);
