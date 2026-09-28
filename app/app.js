const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const PSY = () => LESSONS.filter(l => !l.track);
const DIG = () => LESSONS.filter(l => l.track === "digitale");
const COLOR_BY = Object.fromEntries(COLORS.map(c => [c.id, c]));
const SCALE = FAMILIES.flatMap(f => f[1]);
const byHue = ids => [...ids].sort((a, b) => SCALE.indexOf(a) - SCALE.indexOf(b));
const familyOf = id => (FAMILIES.find(f => f[1].includes(id)) || ["Neutri"])[0];
const colorOf = x => x && x[0] === "#" ? { id: x, n: x.toUpperCase(), h: x } : COLOR_BY[x];
const MAX_LEVEL = LEVEL_TITLES.length;
MISSIONS.forEach(m => { if (m.color) COLOR_BY[m.color].mission = m; });

const LANGS = { it: "Italiano", uk: "Українська" };
let LANG = "it";
function t(text, vars) {
  const out = LANG === "uk" && UK[text] || text;
  return vars ? out.replace(/\{(\w+)\}/g, (_, k) => vars[k]) : out;
}
const locale = () => LANG === "uk" ? "uk-UA" : "it-IT";
const hintOf = c => c.mission ? t(c.mission.type === "serie" ? "Serie: {m}" : "Missione: {m}", { m: t(c.mission.title) }) : t(c.hint);
const langOfName = name => /[\u0400-\u04ff]/.test(name) ? "uk" : /[a-zà-ÿ]/i.test(name) ? "it" : null;
const originals = new WeakMap();
function translateDOM() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node; (node = walker.nextNode());) {
    if (!originals.has(node)) {
      const key = node.parentElement.dataset.t || node.nodeValue.trim();
      if (!key || !(key in UK)) continue;
      originals.set(node, [node.nodeValue, key]);
    }
    const [src, key] = originals.get(node);
    node.nodeValue = LANG === "it" ? src : src.replace(src.trim(), t(key));
  }
  $$("[placeholder], [aria-label], [title], img[alt]").forEach(el => {
    if (!originals.has(el)) originals.set(el, Object.fromEntries(["placeholder", "aria-label", "title", "alt"].filter(a => el.hasAttribute(a)).map(a => [a, el.getAttribute(a)])));
    Object.entries(originals.get(el)).forEach(([a, v]) => el.setAttribute(a, t(v)));
  });
}
function setLang(lang) {
  if (!LANGS[lang]) return;
  const changed = lang !== LANG;
  LANG = S.lang = lang;
  document.documentElement.lang = lang;
  $$("[data-lang-seg] button").forEach(b => b.classList.toggle("on", b.dataset.lang === lang));
  translateDOM();
  if (!changed) return;
  save();
  $$("[data-lessons]").forEach(list => list.innerHTML = "");
  buildLessonLists(); renderPalettes(); render(); drawLab(); showVersion();
}
function langFromName(name) {
  const lang = langOfName(name);
  if (lang && !S.langManual) setLang(lang);
}

const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgbToHex = rgb => "#" + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();
const mix = (a, b, k) => rgbToHex(hexToRgb(a).map((v, i) => v + (hexToRgb(b)[i] - v) * k));
const lum = h => {
  const [r, g, b] = hexToRgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  return .2126 * r + .7152 * g + .0722 * b;
};
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const onColor = h => contrast(h, "#ffffff") >= contrast(h, "#111111") ? "#fff" : "#111";
function ensure(c, against, min, toward) {
  let out = c;
  for (let i = 1; i <= 20 && contrast(out, against) < min; i++) out = mix(c, toward, i * .05);
  return out;
}
function levelColor(l) {
  if (l >= MAX_LEVEL) return "conic-gradient(#e3242b, #ff7a00, #ffd000, #2fa84f, #12c4c0, #1f5fe0, #8a2be2, #e3242b)";
  const h = (l - 1) * (285 / 19);
  return `hsl(${h.toFixed(0)} 78% ${h > 40 && h < 190 ? 42 : 52}%)`;
}

const DEF = {
  xp: 0, level: 1, xpTotal: 0, streak: 1, bestStreak: 1, lastDay: null, quizzes: 0, lessonsTotal: 0, missionsDone: 0, time: 0,
  onboarded: false, name: "", dark: "auto", lang: null, langManual: false, theme: null, secret: null, secretSeen: false, avatar: null, titles: [], shownTitle: null,
  done: [], best: {}, redeemed: [], combosRead: [], claimed: [], badges: [], owned: ["perla", "ardesia"], myPalettes: [],
  games: {}, labSaved: false, photoDone: false, hist: {},
  day: { d: "", lessons: 0, quiz: 0, perfect: 0, time: 0, claimed: [] }
};
let S = (() => {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem("chroma")) || {}; } catch {}
  const s = { ...structuredClone(DEF), ...saved };
  for (const k of Object.keys(DEF)) {
    const d = DEF[k];
    if (Array.isArray(d) && !Array.isArray(s[k])) s[k] = [...d];
    else if (d && typeof d === "object" && !Array.isArray(d) && (typeof s[k] !== "object" || !s[k] || Array.isArray(s[k]))) s[k] = structuredClone(d);
  }
  s.owned = [...new Set(["perla", "ardesia", ...s.owned, ...s.redeemed.map(id => QUIZ_COLOR[id])].filter(id => COLOR_BY[id]))];
  if (!COLOR_BY[s.theme]) s.theme = null;
  s.myPalettes.forEach(p => p.c = p.c.filter(id => COLOR_BY[id] || /^#[0-9a-f]{6}$/i.test(id)));
  s.bestStreak = Math.max(s.bestStreak, s.streak);
  return s;
})();
const save = () => { try { localStorage.setItem("chroma", JSON.stringify(S)); } catch {} };

const dayKey = () => new Date().toDateString();
const isoDay = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
function day() {
  if (S.day.d !== dayKey()) {
    if (S.day.d) {
      S.hist[isoDay(S.day.d)] = { t: S.day.time, q: S.day.quiz, l: S.day.lessons };
      Object.keys(S.hist).sort().slice(0, -60).forEach(k => delete S.hist[k]);
    }
    S.day = { d: dayKey(), lessons: 0, quiz: 0, perfect: 0, time: 0, claimed: [] };
  }
  return S.day;
}
function updateStreak() {
  const today = dayKey();
  if (S.lastDay === today) return;
  const yesterday = new Date(Date.now() - 864e5).toDateString();
  S.streak = S.lastDay === yesterday ? S.streak + 1 : 1;
  S.bestStreak = Math.max(S.bestStreak, S.streak);
  S.lastDay = today;
  day(); save();
}

const levelTitle = l => t(LEVEL_TITLES[Math.min(Math.max(1, l), MAX_LEVEL) - 1]);
const shownTitle = () => levelTitle(S.shownTitle && S.shownTitle <= S.level ? S.shownTitle : S.level);
const onceMissions = () => MISSIONS.filter(m => m.type !== "giornaliera");
const totalXP = () => LESSONS.length * 50 + (LESSONS.length + COMBOS.length) * 100 + onceMissions().reduce((a, m) => a + m.xp, 0);
const NEEDS = (() => {
  const T = totalXP(), w = Array.from({ length: MAX_LEVEL - 1 }, (_, i) => 1 + .12 * i), sw = w.reduce((a, b) => a + b);
  const n = w.map(x => Math.round(x * T / sw));
  n[n.length - 1] += T - n.reduce((a, b) => a + b);
  return n;
})();
const xpNeed = l => NEEDS[Math.min(Math.max(l, 1), MAX_LEVEL - 1) - 1];
function progressParts() {
  const all = [...LESSONS, ...COMBOS].map(x => x.id), once = onceMissions();
  return [
    [S.done.length, LESSONS.length], [all.filter(id => S.best[id] === 3).length, all.length],
    [all.filter(id => S.redeemed.includes(id)).length, all.length], [S.combosRead.length, COMBOS.length],
    [once.filter(m => S.claimed.includes(m.id)).length, once.length]
  ];
}
const completion = () => { const p = progressParts(); return p.reduce((a, [d]) => a + d, 0) / p.reduce((a, [, t]) => a + t, 0); };
const allComplete = () => progressParts().every(([d, t]) => d >= t);
function addXP(n) {
  S.xp += n; S.xpTotal += n;
  while (S.level < MAX_LEVEL && S.xp >= xpNeed(S.level)) {
    if (S.level === MAX_LEVEL - 1 && !allComplete()) { S.xp = xpNeed(S.level); break; }
    S.xp -= xpNeed(S.level); S.level++; onLevelUp();
  }
  if (S.level >= MAX_LEVEL) { S.level = MAX_LEVEL; S.xp = xpNeed(MAX_LEVEL); }
  save(); render();
}

const navStack = [];
let current = null;
function go(id, push = true) {
  if (id === current) return;
  if (push && current) navStack.push(current);
  $$(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  const scr = document.getElementById(id), tab = scr.dataset.tab;
  $(".scroll", scr)?.scrollTo(0, 0);
  $("#tabbar").classList.toggle("show", !!tab);
  $$("[data-tab-go]").forEach(b => b.classList.toggle("on", b.dataset.tabGo === tab));
  current = id;
}
function back() {
  if (current === "combo" && !$("[data-combo-p2]").hidden) return comboPage(1);
  go(navStack.pop() || "home", false);
}

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg; el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2000);
}

document.addEventListener("click", e => {
  const el = e.target.closest("button, [data-unlock]");
  if (!el) return;
  const d = el.dataset;
  if ("onboarded" in d) { S.name = $("[data-onb-name]").value.trim() || S.name; S.onboarded = true; save(); render(); }
  if (d.go) { if (d.go === "impostazioni") $("[data-set-name]").value = S.name; go(d.go); }
  else if (d.tabGo) { navStack.length = 0; go(d.tabGo); }
  else if ("back" in d) back();
  else if (d.toast) toast(d.toast);
  else if (d.combo) openCombo(d.combo);
  else if (d.filter) { $$("[data-filter]").forEach(b => b.classList.toggle("on", b === el)); renderBadges(); }
  else if (d.mtab) {
    $$("[data-mtab]").forEach(b => b.classList.toggle("on", b === el));
    $$("[data-mpane]").forEach(p => p.hidden = p.dataset.mpane !== d.mtab);
  }
  else if (d.week) { $$("[data-week]").forEach(b => b.classList.toggle("on", b === el)); renderWeek(); }
  else if (d.unlock) unlockPath(d.unlock);
  else if (d.game) startGame(d.game);
  else if (d.secretId) pickSecret(d.secretId);
  else if ("secretLocked" in d) { toast(t("Completa tutte le lezioni, i quiz e le missioni")); go("missioni"); }
});

function render() {
  const min = Math.floor(S.time / 60), compl = Math.round(completion() * 100) + "%";
  const vals = {
    ...S, xpTotal: S.xpTotal.toLocaleString(locale()), greet: S.name || t("Benvenuto"), name: S.name || t("Ospite"),
    levelTitle: shownTitle(), xpNeed: xpNeed(S.level), completion: compl, titlesN: S.level,
    timeStr: min >= 60 ? `${Math.floor(min / 60)} ${t("h")} ${min % 60} ${t("min")}` : `${min} ${t("min")}`,
    quests: S.quizzes + S.lessonsTotal, ownedN: S.owned.length, totalColors: COLORS.length
  };
  $$("[data-bind]").forEach(el => el.textContent = vals[el.dataset.bind]);
  $("[data-lv-next]").innerHTML = S.level >= MAX_LEVEL ? t("🏆 Livello massimo raggiunto: hai completato tutto CHROMA!")
    : S.level === MAX_LEVEL - 1 && S.xp >= xpNeed(S.level) ? t("Completa tutto il percorso per diventare <b>{t}</b> ({c})", { t: levelTitle(MAX_LEVEL), c: compl })
    : t("Ancora <b>{xp}</b> XP per diventare <b>{t}</b>", { xp: xpNeed(S.level) - S.xp, t: levelTitle(S.level + 1) });
  $$("[data-bind-width=xp]").forEach(el => el.style.width = Math.min(100, S.xp / xpNeed(S.level) * 100) + "%");
  $$("[data-bind-width=completion]").forEach(el => el.style.width = completion() * 100 + "%");
  renderLessonState(); renderMissions(); renderBadges(); renderColors(); renderSecrets();
  renderAvatars(); renderTimeline(); renderWeek(); renderTools();
}

function renderLessonState() {
  $$(".lesson").forEach(el => {
    const id = el.dataset.id, st = $(".qstat", el), col = COLOR_BY[QUIZ_COLOR[id]], best = S.best[id];
    if (!el.closest("[data-quiz-list]")) {
      const done = S.done.includes(id);
      st.className = "qstat" + (done ? " ok" : ""); st.textContent = done ? t("✓ Completata") : "";
      return;
    }
    const open = quizOpen(id);
    el.classList.toggle("qlock", !open);
    if (!open) { st.className = "qstat lock"; st.innerHTML = `<img class="lk" src="assets/lucchetto.png" alt="">${t("Prima la teoria")}`; }
    else if (S.redeemed.includes(id)) { st.className = "qstat ok"; st.innerHTML = `<i style="background:${col.h}"></i>${t("✓ Completato")}`; }
    else if (best === 3) { st.className = "qstat todo"; st.innerHTML = `<i style="background:${col.h}"></i>${t("Colore da riscattare")}`; }
    else if (best) { st.className = "qstat part"; st.textContent = t("Record {n}/3", { n: best }); }
    else { st.className = "qstat"; st.textContent = ""; }
  });
  $$("[data-combo]").forEach(b => b.classList.toggle("read", S.combosRead.includes(b.dataset.combo)));
  const doneOf = list => list.filter(l => S.done.includes(l.id)).length;
  const redeemedOf = list => list.filter(l => S.redeemed.includes(l.id)).length;
  $("[data-combo-read-n]").textContent = t("{a} / {b} lette", { a: S.combosRead.length, b: COMBOS.length });
  $("[data-lessons-done-n]").textContent = t("{a} / {b} completate", { a: doneOf(PSY()), b: PSY().length });
  $("[data-dig-done-n]").textContent = t("{a} / {b} completate", { a: doneOf(DIG()), b: DIG().length });
  $("[data-qprog-colors]").textContent = t("{a} / {b} completati", { a: redeemedOf(PSY()), b: PSY().length });
  $("[data-qprog-dig]").textContent = t("{a} / {b} completati", { a: redeemedOf(DIG()), b: DIG().length });
  $("[data-qprog-combo]").textContent = t("{a} / {b} completati", { a: redeemedOf(COMBOS), b: COMBOS.length });
}

function lessonItem(l, onOpen) {
  const b = document.createElement("button");
  const combo = COMBOS.includes(l);
  b.className = "lesson"; b.dataset.id = l.id;
  const thumb = combo ? `<img class="thumb wheel" src="assets/${l.img}" alt="">`
    : l.img ? `<img class="thumb" src="assets/${l.img}" alt="">` : `<i class="thumb grad" style="background:${l.grad}"></i>`;
  const kind = combo ? "Combinazioni di colori" : l.track ? "Il colore nel digitale" : "Psicologia del colore";
  b.innerHTML = `${thumb}<div class="info"><div class="t">${t(l.title)}</div><div class="s">${t(kind)}</div>
    <div class="m"><img class="clock" src="assets/time-forward.png" alt="">${combo ? 3 : 5} ${t("min")}</div></div>
    <img class="go" src="assets/right-arrow.png" alt=""><span class="qstat"></span>`;
  b.onclick = () => onOpen(l.id);
  return b;
}
function buildLessonLists() {
  $$("[data-lessons]").forEach(list => {
    const kind = list.dataset.lessons, lessons = kind === "combo" ? COMBOS : kind.includes("digitale") ? DIG() : PSY();
    const isQuiz = "quizList" in list.dataset;
    lessons.forEach(l => list.appendChild(lessonItem(l, isQuiz ? openQuiz : openLesson)));
  });
}

function openLesson(id) {
  const l = LESSONS.find(x => x.id === id), scr = $("#lezione"), img = $("[data-lesson-img]", scr);
  $(".detail-img", scr).style.background = l.grad || "";
  img.hidden = !l.img;
  if (l.img) img.src = "assets/" + l.img;
  $("[data-lesson-title]", scr).textContent = t(l.title);
  $(".detail-meta", scr).textContent = t("5 min · livello base") + (S.done.includes(id) ? " · " + t("✓ Completata") : "");
  $("[data-lesson-body]", scr).innerHTML = l.body.map(p => `<p>${t(p)}</p>`).join("");
  $("[data-lesson-fact]", scr).textContent = t(l.fact);
  $("[data-lesson-quiz]", scr).onclick = () => openQuiz(id);
  $("[data-lesson-next]", scr).onclick = () => {
    const first = !S.done.includes(id), end = $("#lezfine");
    day().lessons++;
    if (first) { S.done.push(id); S.lessonsTotal++; addXP(50); } else save();
    $("h2", end).textContent = t(first ? "Lezione completata!" : "Lezione ripassata!");
    $("p", end).textContent = t(first ? "Hai guadagnato" : "Gli XP di questa lezione li hai già ottenuti");
    $("b", end).textContent = first ? "+ 50 XP" : "";
    const quiz = $("[data-lf-quiz]", end);
    quiz.textContent = t(S.redeemed.includes(id) ? "Rifai il quiz" : "Fai il quiz");
    quiz.onclick = () => openQuiz(id);
    go("lezfine");
  };
  if (current === "lezione") $(".scroll", scr).scrollTo(0, 0); else go("lezione");
}

function comboPage(n) {
  $("[data-combo-p1]").hidden = n !== 1;
  $("[data-combo-p2]").hidden = n !== 2;
  $("[data-combo-next]").textContent = t(n === 1 ? "avanti" : "Quiz");
}
function openCombo(id) {
  const c = COMBOS.find(x => x.id === id), scr = $("#combo");
  $("[data-combo-name]", scr).textContent = t(c.title) + (S.combosRead.includes(c.id) ? "  ·  " + t("✓ Letta") : "");
  $("[data-combo-img]", scr).src = "assets/" + c.img;
  $("[data-combo-intro]", scr).textContent = t(c.intro);
  $("[data-combo-how]", scr).textContent = t(c.how);
  $("[data-combo-when]", scr).textContent = t(c.when);
  $("[data-combo-extra1]", scr).textContent = t(c.extra[0]);
  $("[data-combo-extra2]", scr).textContent = t(c.extra[1]);
  comboPage(1);
  $("[data-combo-next]", scr).onclick = () => {
    if (!$("[data-combo-p2]", scr).hidden) return openQuiz(c.id);
    comboPage(2);
    $(".scroll", scr).scrollTo(0, 0);
    if (!S.combosRead.includes(c.id)) { S.combosRead.push(c.id); addXP(0); }
  };
  go("combo");
}

const isCombo = id => COMBOS.some(c => c.id === id);
const quizOpen = id => S.best[id] != null || (isCombo(id) ? S.combosRead : S.done).includes(id);
const openTheory = id => isCombo(id) ? openCombo(id) : openLesson(id);
function openQuiz(id) {
  const l = LESSONS.find(x => x.id === id) || COMBOS.find(x => x.id === id);
  if (!quizOpen(id)) {
    if (current === "lezione" || current === "combo") return toast(t("Arriva in fondo alla lezione per sbloccare il quiz"));
    toast(t("Prima studia la teoria: poi il quiz si sblocca"));
    return openTheory(id);
  }
  if (S.best[id] === 3 && !S.redeemed.includes(id)) return showEvent(l, 3, true);
  const scr = $("#quiz"), box = $("[data-quiz-answers]", scr), next = $("[data-quiz-next]", scr);
  let n = 0, score = 0;
  paintWith(scr, COLOR_BY[QUIZ_COLOR[id]].h);
  $("[data-quiz-title]", scr).textContent = t(l.title);
  const show = () => {
    const item = l.quiz[n];
    let answered = false;
    $("[data-quiz-n]", scr).textContent = `${n + 1} / ${l.quiz.length}`;
    $("[data-quiz-q]", scr).textContent = t(item.q);
    $("[data-quiz-feedback]", scr).textContent = "";
    next.hidden = true;
    box.innerHTML = "";
    item.a.forEach((txt, k) => {
      const b = document.createElement("button");
      b.className = "answer";
      b.innerHTML = `<span class="dot"></span>${t(txt)}`;
      b.onclick = () => {
        if (answered) return;
        answered = true;
        const right = k === item.ok;
        if (right) score++;
        b.classList.add(right ? "right" : "wrong");
        box.children[item.ok].classList.add("right");
        $("[data-quiz-feedback]", scr).innerHTML = right ? t("Esatto!") + ' <img class="emo" src="assets/trombetta.png" alt="">' : t("Non proprio… la risposta giusta è evidenziata.");
        next.hidden = false;
      };
      box.appendChild(b);
    });
  };
  next.onclick = () => {
    if (++n < l.quiz.length) return show();
    const d = day(), prev = S.best[id] || 0, perfect = score === l.quiz.length;
    S.quizzes++; d.quiz++; if (perfect) d.perfect++;
    const xp = perfect && prev < score ? 100 - prev * 30 : score > prev ? (score - prev) * 30 : score * 10;
    S.best[id] = Math.max(prev, score);
    showEvent(l, score, false, xp);
  };
  show();
  go("quiz");
}

function showEvent(l, score, replay, gained = 0) {
  const tot = l.quiz.length, perfect = score === tot, col = COLOR_BY[QUIZ_COLOR[l.id]], scr = $("#evento");
  const xp = replay ? 0 : gained;
  if (xp) addXP(xp);
  const light = lum(col.h) > .42;
  scr.style.setProperty("--ev", col.h);
  scr.style.setProperty("--ev-on", onColor(col.h));
  scr.style.setProperty("--ev-link", light ? mix(col.h, "#000000", .55) : col.h);
  scr.classList.toggle("light-ev", light);
  paintWith(scr, col.h);
  $("[data-ev-score]", scr).textContent = `${score} / ${tot}`;
  $("[data-ev-acc]", scr).textContent = Math.round(score / tot * 100) + " %";
  $("[data-ev-xp]", scr).textContent = replay ? t("XP già ottenuti") : `+ ${xp} XP`;
  $("[data-ev-bname]", scr).textContent = t(col.n);
  $("[data-ev-name]", scr).textContent = t(l.title);
  $("[data-ev-badge]", scr).hidden = !perfect;
  $("[data-ev-retry]", scr).hidden = perfect;
  const redeem = $("[data-ev-redeem]", scr), apply = $("[data-ev-apply]", scr), got = S.redeemed.includes(l.id);
  redeem.disabled = got; redeem.textContent = t(got ? "Già riscattato" : "Riscatta");
  apply.hidden = !got;
  apply.textContent = t(S.theme === col.id ? "Tema attivo ✓" : "Usa come tema");
  apply.onclick = () => { applyTheme(col.id); apply.textContent = t("Tema attivo ✓"); toast(t("Tema “{n}” applicato", { n: t(col.n) })); };
  redeem.onclick = () => {
    if (S.redeemed.includes(l.id)) return;
    S.redeemed.push(l.id);
    unlockColor(col.id);
    redeem.disabled = true; redeem.textContent = t("Riscattato ✓"); apply.hidden = false;
    toast(t("Nuovo colore sbloccato: {n}", { n: t(col.n) }));
  };
  $$("[data-ev-back]", scr).forEach(b => b.onclick = () => { navStack.pop(); back(); });
  go("evento");
}

function tokens(h, dark) {
  const base = dark ? "#141417" : "#f2f2f2", ink = dark ? "#ffffff" : "#000000";
  const bg = mix(h, base, dark ? .88 : .9);
  const accent = ensure(h, bg, 3, ink);
  const soft = ensure(mix(h, dark ? base : "#ffffff", dark ? .5 : .55), bg, 1.35, ink);
  const card = ensure(mix(h, "#000000", .08), "#ffffff", 3, "#000000");
  return {
    "--bg": bg, "--purple-btn": accent, "--sky-dark": accent, "--mission": accent, "--theme-dot": accent,
    "--link": ensure(accent, bg, 4.5, ink), "--on-accent": onColor(accent), "--on-dark": onColor(accent),
    "--sky-light": soft, "--on-light": onColor(soft), "--blue-card": card, "--on-blue": onColor(card),
    "--brown": ensure(mix(h, "#000000", .28), "#ffffff", 4.5, "#000000"),
    "--darkbrown": ensure(mix(h, "#000000", .48), "#ffffff", 5.5, "#000000"),
    "--teal": ensure(mix(h, "#000000", .4), "#ffffff", 5, "#000000"),
    "--quiz-card": ensure(mix(h, "#ffffff", .7), "#111111", 9, "#ffffff"),
    "--yellow": ensure(mix(h, "#ffffff", .62), "#111111", 8, "#ffffff"),
    "--yellow-top": ensure(mix(h, "#ffffff", .45), "#111111", 6, "#ffffff"),
    "--quiz-purple": ensure(mix(h, "#000000", .12), "#ffffff", 4.5, "#000000"), "--on-quiz-purple": "#fff",
    "--digbg": ensure(mix(h, "#000000", .55), "#ffffff", 7, "#000000")
  };
}
const THEME_PROPS = [...Object.keys(tokens("#888888", false)), "--secret-g", "--secret-on"];
const isDark = () => document.documentElement.dataset.dark === "dark";
const secretsOpen = () => S.level >= MAX_LEVEL;
function paintTheme() {
  const root = document.documentElement, sec = secretsOpen() && SECRETS.find(x => x.id === S.secret);
  const base = sec ? sec.base : S.theme && COLOR_BY[S.theme].h;
  THEME_PROPS.forEach(p => root.style.removeProperty(p));
  delete root.dataset.secret;
  if (base) Object.entries(tokens(base, isDark())).forEach(([k, v]) => root.style.setProperty(k, v));
  if (sec) {
    root.dataset.secret = sec.id;
    root.style.setProperty("--secret-g", sec.g);
    root.style.setProperty("--secret-on", sec.on);
  }
  renderColors(); renderSecrets();
}
function applyTheme(id) {
  S.theme = COLOR_BY[id] ? id : null;
  S.secret = null;
  save(); paintTheme();
}
function pickSecret(id) {
  S.secret = S.secret === id ? null : id;
  S.theme = null;
  save(); paintTheme();
  toast(S.secret ? t("Tema segreto “{n}” attivato", { n: t(SECRETS.find(x => x.id === id).n) }) : t("Tema originale"));
}
function paintWith(el, hex) {
  const vars = tokens(hex, false);
  ["--darkbrown", "--brown", "--quiz-card", "--purple-btn", "--on-accent"].forEach(k => el.style.setProperty(k, vars[k]));
}
function applyDark() {
  const dark = S.dark === "dark" || (S.dark === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.dark = dark ? "dark" : "light";
  $$("[data-dark-seg] button").forEach(b => b.classList.toggle("on", b.dataset.dark === S.dark));
  $('meta[name="theme-color"]').content = dark ? "#141417" : "#7b2482";
  paintTheme();
}
function unlockColor(id) {
  if (!S.owned.includes(id)) S.owned.push(id);
  addXP(0);
}

function renderColors() {
  const home = $("[data-home-swatches]");
  let show = byHue(S.owned).slice(0, 8);
  if (S.theme && S.owned.includes(S.theme) && !show.includes(S.theme)) show = byHue([...show.slice(0, 7), S.theme]);
  home.innerHTML = "";
  show.forEach(id => {
    const c = COLOR_BY[id], b = document.createElement("button");
    b.style.background = c.h; b.title = t(c.n); b.setAttribute("aria-label", t("Tema {n}", { n: t(c.n) }));
    if (S.theme === id) b.className = "cur";
    b.onclick = () => { applyTheme(S.theme === id ? null : id); toast(S.theme ? t("Tema “{n}” applicato", { n: t(c.n) }) : t("Tema originale")); };
    home.appendChild(b);
  });
  const own = $("[data-owned]");
  own.innerHTML = "";
  FAMILIES.forEach(([fam, ids]) => {
    const row = document.createElement("div");
    row.className = "fam";
    row.innerHTML = `<div class="fam-h"><span>${t(fam)}</span><small>${ids.filter(id => S.owned.includes(id)).length} / ${ids.length}</small></div><div class="fam-row"></div>`;
    ids.forEach(id => {
      const c = COLOR_BY[id], has = S.owned.includes(id), el = document.createElement("button");
      el.className = "sw" + (has ? "" : " locked") + (S.theme === id ? " cur" : "");
      el.innerHTML = `<i style="background:${c.h}"></i><span>${t(c.n)}</span>${has ? "" : `<small>${hintOf(c)}</small>`}`;
      if (!has) el.title = t("Come si sblocca: {h}", { h: hintOf(c) });
      el.onclick = () => has ? applyTheme(S.theme === id ? null : id) : unlockPath(id);
      $(".fam-row", row).appendChild(el);
    });
    own.appendChild(row);
  });
  $("[data-scale]").innerHTML = SCALE.map(id => { const has = S.owned.includes(id);
    return `<i data-unlock="${has ? "" : id}" class="${has ? "" : "off"}" style="background:${COLOR_BY[id].h}" title="${t(COLOR_BY[id].n)}"></i>`; }).join("");
  $("[data-owned-n]").textContent = `${S.owned.length} / ${COLORS.length}`;
  const sec = secretsOpen() && SECRETS.find(x => x.id === S.secret);
  $("[data-theme-name]").textContent = sec ? t(sec.n) + " ✨" : S.theme ? t(COLOR_BY[S.theme].n) : t("Tema originale");
  $("[data-theme-reset]").hidden = !S.theme && !sec;
}
$("[data-theme-reset]").onclick = () => { applyTheme(null); toast(t("Tema originale ripristinato")); };

function unlockPath(id) {
  const q = [...LESSONS, ...COMBOS].find(l => QUIZ_COLOR[l.id] === id);
  if (q) {
    if (S.best[q.id] === 3 && !S.redeemed.includes(q.id)) return showEvent(q, 3, true);
    if (!quizOpen(q.id)) { toast(t("Studia “{n}” e fai 3 su 3 nel quiz", { n: t(q.title) })); return openTheory(q.id); }
    toast(t("Fai 3 su 3 in questo quiz per sbloccarlo"));
    return openQuiz(q.id);
  }
  const m = MISSIONS.find(x => x.color === id);
  if (m) return openMission(m.id);
  toast(t("Continua a giocare per sbloccarlo"));
}

function renderSecrets() {
  const box = $("[data-secrets]");
  if (!secretsOpen()) {
    box.innerHTML = `<button class="secret-lock" data-secret-locked><span class="sl-glow"></span><b><img class="lk" src="assets/lucchetto.png" alt="">${t("Colori segreti")}</b><small>${t("Raggiungi il livello {l} completando tutto CHROMA per sbloccare 4 colorazioni animate. Completamento: {p}%", { l: MAX_LEVEL, p: Math.round(completion() * 100) })}</small></button>`;
    return;
  }
  box.innerHTML = `<div class="section-row"><h2 class="section">${t("Colori segreti")} ✨</h2></div><div class="secret-grid">${SECRETS.map(x =>
    `<button class="secret-card${S.secret === x.id ? " cur" : ""}" data-secret-id="${x.id}"><i style="--g:${x.g}"></i><b>${t(x.n)}</b><small>${t(S.secret === x.id ? "Attivo" : x.d)}</small></button>`).join("")}</div>`;
}
function showSecretPop() {
  const r = (a, b) => a + Math.random() * (b - a);
  $("[data-sp-dots]").innerHTML = Array.from({ length: 22 }, (_, i) =>
    `<i style="--x:${Math.round(r(4, 96))}%;--c:hsl(${i * 33 % 360} 85% 60%);--t:${r(0, 2.4).toFixed(2)}s;--s:${Math.round(r(6, 14))}px"></i>`).join("");
  $("[data-secret-pop]").hidden = false;
}
function checkSecret() {
  if (!secretsOpen() || S.secretSeen || !$("[data-levelup]").hidden || ["splash", "onb1", "onb2", "onb3"].includes(current)) return;
  S.secretSeen = true; save(); showSecretPop();
}
$("[data-sp-go]").onclick = () => { $("[data-secret-pop]").hidden = true; go("colori"); };
$("[data-sp-close]").onclick = () => $("[data-secret-pop]").hidden = true;

const perfectIn = ids => ids.filter(id => S.best[id] === 3).length;
const prog = m => Math.min(m.target, m.v());
const isClaimed = m => (m.type === "giornaliera" ? day().claimed : S.claimed).includes(m.id);
const isReady = m => prog(m) >= m.target && !isClaimed(m);
const rewardText = (m, c) => (c ? `<i style="background:${c.h}"></i>${t(c.n)}` : m.badge ? "" : t("Solo XP")) + (m.badge ? (c ? " · " : "") + t(m.badge) : "");

function missionItem(m) {
  const p = prog(m), claimed = isClaimed(m), ready = isReady(m), c = COLOR_BY[m.color];
  const b = document.createElement("button");
  b.className = "m-item" + (ready ? " ready" : "") + (claimed ? " claimed" : "");
  b.innerHTML = `<div class="top"><span>${t(m.title)}</span><b>+ ${m.xp} XP</b></div>
    <div class="m-sub">${c ? `<i style="background:${c.h}"></i>${t(c.n)}` : m.badge ? "" : t("Solo XP")}${m.badge ? ` · ${t(m.badge)}` : ""}<em>${p} / ${m.target}</em></div>
    <div class="mbar"><i style="width:${p / m.target * 100}%"></i></div>
    ${ready ? `<div class="tag">${t("Completata! Tocca per riscattare")}</div>` : claimed ? `<div class="tag">${t("Riscattata ✓")}</div>` : ""}`;
  b.onclick = () => openMission(m.id);
  return b;
}
function renderMissions() {
  ["percorso", "giornaliera", "serie"].forEach(type => {
    const el = $(`[data-missions="${type}"]`);
    el.innerHTML = "";
    MISSIONS.filter(m => m.type === type).sort((a, b) => isClaimed(a) - isClaimed(b)).forEach(m => el.appendChild(missionItem(m)));
  });
  const daily = MISSIONS.filter(m => m.type === "giornaliera"), doneToday = daily.filter(isClaimed).length, ready = MISSIONS.filter(isReady).length;
  $("[data-ch-sub]").textContent = doneToday === daily.length ? t("Hai completato le missioni di oggi!") : t("Missioni di oggi: {a} / {b} completate", { a: doneToday, b: daily.length });
  const badge = $("[data-m-ready]");
  badge.textContent = ready; badge.hidden = !ready;
  const next = MISSIONS.find(m => m.type === "percorso" && !isClaimed(m)), card = $("[data-am]");
  card.hidden = !next;
  if (!next) return;
  card.onclick = () => openMission(next.id);
  $("[data-am-title]").textContent = t(next.title) + (isReady(next) ? " ✓" : "");
  $("[data-am-n]").textContent = `${prog(next)} / ${next.target}`;
  $("[data-am-xp]").textContent = `+ ${next.xp} XP`;
  $("[data-am-bar]").style.width = prog(next) / next.target * 100 + "%";
}
function openMission(id) {
  const m = MISSIONS.find(x => x.id === id), scr = $("#missione");
  const p = prog(m), claimed = isClaimed(m), ready = isReady(m), c = COLOR_BY[m.color], badge = BADGES.find(x => x.n === m.badge);
  $("[data-md-kind]", scr).textContent = t({ percorso: "Missione del percorso", giornaliera: "Missione giornaliera", serie: "Missione speciale" }[m.type]);
  $("[data-md-title]", scr).textContent = t(m.title);
  $("[data-md-desc]", scr).textContent = t(m.desc);
  $("[data-md-n]", scr).textContent = `${p} / ${m.target}`;
  $("[data-md-bar]", scr).style.width = p / m.target * 100 + "%";
  $("[data-md-xp]", scr).textContent = `+ ${m.xp} XP`;
  $("[data-md-extra]", scr).innerHTML = rewardText(m, c);
  $("[data-md-pic]", scr).innerHTML = c ? `<span class="md-swatch${claimed ? "" : " dim"}" style="background:${c.h}"></span>`
    : badge ? `<img class="bimg" src="assets/${badge.img}" alt="">` : `<span class="md-xp">XP</span>`;
  const btn = $("[data-md-btn]", scr);
  btn.disabled = claimed || (m.type === "serie" && !ready);
  btn.textContent = t(claimed ? "Già riscattata" : ready ? "Riscatta reward" : m.cta);
  btn.onclick = () => {
    if (!ready) return go(m.go);
    (m.type === "giornaliera" ? day().claimed : S.claimed).push(id);
    S.missionsDone++;
    if (m.badge && !S.badges.includes(m.badge)) S.badges.push(m.badge);
    if (c) unlockColor(c.id);
    const won = $("[data-ro-color]");
    won.textContent = c ? "+ " + t(c.n) : ""; won.hidden = !c;
    won.style.setProperty("--won", c ? c.h : "transparent");
    addXP(m.xp);
    $("[data-ro-xp]").textContent = `+ ${m.xp} XP`;
    $("[data-ro-badge]").textContent = m.badge ? "+ " + t(m.badge) : "";
    go("rewardok");
  };
  go("missione");
}

function renderBadges() {
  const grid = $("[data-badge-grid]"), filter = $("[data-filter].on").dataset.filter;
  grid.innerHTML = "";
  BADGES.forEach((b, k) => {
    const got = b.got(), el = document.createElement("div");
    el.className = "badge " + (got ? "got" : "locked tap " + (k % 2 ? "brownish" : "violet"));
    el.innerHTML = `<div class="badge-art${got ? "" : " off"}"><img class="bimg" src="assets/${b.img}" alt=""></div><b>${t(b.n)}</b><span>${t(b.d)}</span>`;
    if (!got) el.onclick = () => {
      const m = MISSIONS.find(x => x.badge === b.n);
      if (m) return openMission(m.id);
      toast(t(b.d)); go(b.to);
    };
    if (filter !== "all" && !el.classList.contains(filter)) el.classList.add("hide");
    grid.appendChild(el);
  });
}

const swatches = c => c.map(x => `<i style="background:${x}"></i>`).join("");
function renderPalettes() {
  const list = $("[data-palettes]");
  list.innerHTML = "";
  const add = (name, hexes, open, menu, mine) => {
    const b = document.createElement("div");
    b.className = "pal-item" + (mine ? " mine" : "");
    b.tabIndex = 0; b.setAttribute("role", "button");
    b.innerHTML = `<div class="n">${name}${mine ? ` <small>${t("personale")}</small>` : ""}</div>
      <div class="pal-dots">${swatches(hexes)}</div><button class="more" aria-label="${t("Opzioni")}">⋮</button>`;
    b.onclick = e => { if (!e.target.closest(".more")) open(); };
    $(".more", b).onclick = e => { e.stopPropagation(); menu(); };
    list.appendChild(b);
  };
  PALETTES.forEach((p, k) => add(t(p.n), p.c, () => openPalette(k), () => sheet(t(p.n), [
    [t("Apri"), () => openPalette(k)],
    [t("Crea una palette simile"), () => openEditor(null, t("{n} (mia)", { n: t(p.n) }))],
    [t("Condividi"), () => sharePalette(t(p.n), p.c, p.e.map(x => t(x)))]
  ])));
  S.myPalettes.forEach(p => add(p.n, p.c.map(id => colorOf(id).h), () => openMyPalette(p.id), () => sheet(p.n, [
    [t("Apri"), () => openMyPalette(p.id)],
    [t("Modifica"), () => openEditor(p.id)],
    COLOR_BY[p.c[0]] ? [t("Usa il primo colore come tema"), () => { applyTheme(p.c[0]); toast(t("Tema “{n}” applicato", { n: t(COLOR_BY[p.c[0]].n) })); }]
      : [t("Apri nel Laboratorio"), () => openLab(p.c[0])],
    [t("Condividi"), () => sharePalette(p.n, p.c.map(id => colorOf(id).h))],
    [t("Elimina"), () => confirmBox(t("Eliminare la palette?"), t("“{n}” verrà cancellata.", { n: p.n }), () => {
      S.myPalettes = S.myPalettes.filter(x => x.id !== p.id); save(); renderPalettes(); toast(t("Palette eliminata"));
    }), "danger"]
  ]), true));
}
function palettePage(title, heading, text, emoHead, emoHtml, fact, share) {
  const scr = $("#palettedet"), cards = $$(".pal-card", scr);
  $("[data-pal-title]", scr).textContent = title;
  $(".pal-card h3", scr).textContent = t(heading);
  $("[data-pal-text]", scr).textContent = text;
  $(".pal-emo-h", scr).textContent = t(emoHead);
  $("[data-pal-emo]", scr).innerHTML = emoHtml;
  cards[1].hidden = !fact;
  $("[data-pal-fact]", scr).textContent = fact ? t(fact) : "";
  $("[data-pal-share]", scr).onclick = share;
  go("palettedet");
}
function openPalette(k) {
  const p = PALETTES[k];
  $("[data-pal-dots]").innerHTML = swatches(p.c);
  palettePage(t(p.n), "Significato", t(p.t), "Emozioni associate", p.e.map(x => `<span>${t(x)}</span>`).join(""), PAL_FACT, () => sharePalette(t(p.n), p.c, p.e.map(x => t(x))));
}
function openMyPalette(id) {
  const p = S.myPalettes.find(x => x.id === id), cols = p.c.map(colorOf), own = cols.some(c => COLOR_BY[c.id]);
  const dots = $("[data-pal-dots]");
  dots.innerHTML = "";
  cols.forEach(c => {
    const b = document.createElement("button"), mine = COLOR_BY[c.id];
    b.className = "pal-dot-btn"; b.style.background = c.h;
    b.title = t(mine ? "Usa {n} come tema" : "Apri {n} nel Laboratorio", { n: t(c.n) });
    b.onclick = () => mine ? (applyTheme(c.id), toast(t("Tema “{n}” applicato", { n: t(c.n) }))) : openLab(c.h);
    dots.appendChild(b);
  });
  palettePage(p.n, "La tua palette",
    t(own ? "Creata da te con {n} colori. Tocca un colore sbloccato qui sopra per usarlo come tema dell'app, o un codice per aprirlo nel Laboratorio."
      : "Creata da te con {n} colori. Tocca un colore qui sopra per aprirlo nel Laboratorio e scoprirne i codici.", { n: cols.length }),
    "Colori", cols.map(c => `<span style="background:${c.h};color:${onColor(c.h)}">${t(c.n)}</span>`).join(""), null,
    () => sharePalette(p.n, cols.map(c => c.h)));
}

let editing = null, picked = [];
function openEditor(id, suggestedName = "") {
  const p = S.myPalettes.find(x => x.id === id);
  editing = id; picked = p ? [...p.c] : [];
  $("[data-pe-title]").textContent = t(p ? "Modifica palette" : "Nuova palette");
  $("[data-pe-name]").value = p ? p.n : suggestedName;
  drawEditor();
  go("paledit");
}
function drawEditor() {
  $("[data-pe-preview]").innerHTML = Array.from({ length: 6 }, (_, i) =>
    `<i style="background:${picked[i] ? colorOf(picked[i]).h : "transparent"}" class="${picked[i] ? "" : "empty"}"></i>`).join("");
  $("[data-pe-count]").textContent = `${picked.length} / 6`;
  const grid = $("[data-pe-grid]");
  grid.innerHTML = "";
  [...picked.filter(id => !COLOR_BY[id]), ...byHue(S.owned)].forEach(id => {
    const c = colorOf(id), b = document.createElement("button");
    b.className = "sw" + (picked.includes(id) ? " cur" : "");
    b.innerHTML = `<i style="background:${c.h}"></i><span>${t(c.n)}</span>`;
    b.onclick = () => {
      if (picked.includes(id)) picked = picked.filter(x => x !== id);
      else if (picked.length < 6) picked.push(id);
      else toast(t("Massimo 6 colori per palette"));
      drawEditor();
    };
    grid.appendChild(b);
  });
}
$("[data-new-palette]").onclick = () => openEditor(null);
$("[data-pe-save]").onclick = () => {
  const n = $("[data-pe-name]").value.trim();
  if (!n) return toast(t("Dai un nome alla palette"));
  if (picked.length < 2) return toast(t("Scegli almeno 2 colori"));
  if (editing) Object.assign(S.myPalettes.find(x => x.id === editing), { n, c: [...picked] });
  else S.myPalettes.push({ id: "p" + Date.now(), n, c: [...picked] });
  save(); renderPalettes(); addXP(0);
  toast(t(editing ? "Palette aggiornata" : "Palette creata!"));
  navStack.length = 0; go("explore", false); go("palette");
};

function sheet(title, actions) {
  const bg = $("[data-sheet-bg]"), sh = $("[data-sheet]");
  sh.innerHTML = `<h3>${title}</h3>`;
  [...actions, [t("Annulla"), () => {}, "cancel"]].forEach(([label, fn, cls]) => {
    const b = document.createElement("button");
    b.className = "sheet-btn " + (cls || ""); b.textContent = label;
    b.onclick = () => { bg.hidden = true; fn(); };
    sh.appendChild(b);
  });
  bg.hidden = false;
}
$("[data-sheet-bg]").onclick = e => { if (e.target.matches("[data-sheet-bg]")) e.target.hidden = true; };
function confirmBox(title, text, yes) {
  const bg = $("[data-confirm]");
  $("[data-confirm-t]").textContent = title;
  $("[data-confirm-p]").textContent = text;
  $("[data-confirm-yes]").onclick = () => { bg.hidden = true; yes(); };
  $("[data-confirm-no]").onclick = () => bg.hidden = true;
  bg.hidden = false;
}

$("[data-set-name]").addEventListener("change", e => { S.name = e.target.value.trim(); langFromName(S.name); save(); render(); toast(t("Nome salvato")); });
$("[data-onb-name]").addEventListener("input", e => langFromName(e.target.value));
$("[data-lang-seg]").addEventListener("click", e => {
  const b = e.target.closest("[data-lang]");
  if (b) { S.langManual = true; setLang(b.dataset.lang); }
});
$("[data-dark-seg]").addEventListener("click", e => {
  const b = e.target.closest("[data-dark]");
  if (b) { S.dark = b.dataset.dark; save(); applyDark(); }
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyDark);
function resetAll() {
  try { localStorage.setItem("chroma", JSON.stringify({ ...structuredClone(DEF), dark: S.dark, lang: S.lang, langManual: S.langManual })); } catch {}
  location.reload();
}
$("[data-reset]").onclick = () => confirmBox(t("Azzerare tutto?"), t("XP, livelli, lezioni, colori, badge e palette torneranno a zero e ripartirà l'onboarding."), resetAll);

function fillTitles() {
  for (let l = 1; l <= S.level; l++) if (!S.titles.some(x => x.l === l)) S.titles.push({ l, d: null });
  S.titles = S.titles.filter(x => x.l <= S.level).sort((a, b) => a.l - b.l);
}
const levelUps = [];
function onLevelUp() {
  fillTitles();
  const title = S.titles.find(x => x.l === S.level);
  if (!title.d) title.d = isoDay(Date.now());
  S.shownTitle = null;
  save();
  levelUps.push(S.level);
  if (levelUps.length === 1) showLevelUp();
}
function showLevelUp() {
  const l = levelUps[0];
  $("[data-lu-lv]").textContent = l;
  $("[data-lu-title]").textContent = levelTitle(l);
  $("[data-lu-lv]").parentElement.style.color = levelColor(l);
  $("[data-lu-burst]").innerHTML = Array.from({ length: 18 }, (_, i) =>
    `<i style="--a:${i * 20}deg;--c:hsl(${i * 20} 80% 55%);--d:${(i % 3) * .08}s"></i>`).join("");
  $("[data-levelup]").hidden = false;
}
$("[data-lu-ok]").onclick = () => {
  levelUps.shift();
  if (levelUps.length) return showLevelUp();
  $("[data-levelup]").hidden = true;
  setTimeout(checkSecret, 350);
};
const setShownTitle = l => { S.shownTitle = l === S.level ? null : l; save(); render(); };
$("[data-title-pick]").onclick = () => {
  fillTitles();
  const opts = S.titles.slice().reverse().slice(0, 8).map(x => [
    (levelTitle(x.l) === shownTitle() ? "✓ " : "") + levelTitle(x.l) + "  · Lv " + x.l,
    () => { setShownTitle(x.l); toast(t("Titolo aggiornato")); }
  ]);
  sheet(t("Scegli il titolo da mostrare"), [...opts, [t("Vedi tutti i titoli…"), () => go("titoli")]]);
};
function renderTimeline() {
  const ol = $("[data-timeline]"), next = S.level + 1;
  const date = d => d ? new Date(d).toLocaleDateString(locale(), { day: "numeric", month: "short", year: "numeric" }) : t("prima del registro");
  const order = [...(S.level < MAX_LEVEL ? [next] : []), ...Array.from({ length: S.level }, (_, i) => S.level - i),
    ...Array.from({ length: Math.max(0, MAX_LEVEL - next) }, (_, i) => next + 1 + i)];
  fillTitles();
  ol.innerHTML = "";
  order.forEach(l => {
    const got = l <= S.level, shown = got && levelTitle(l) === shownTitle(), li = document.createElement("li");
    li.className = (got ? "got" : "locked") + (shown ? " shown" : "") + (l === next ? " next" : "");
    li.innerHTML = `<span class="tl-dot" style="--c:${levelColor(l)}">${got ? l : '<img class="lk" src="assets/lucchetto.png" alt="">'}</span>
      <div><b>${got || l === next ? levelTitle(l) : "???"}</b>
      <small>${got ? `${t("Livello {l}", { l })} · ${date(S.titles.find(x => x.l === l)?.d)}` : l === next ? t("Prossimo · mancano {xp} XP", { xp: xpNeed(S.level) - S.xp }) : t("Livello {l}", { l })}</small></div>
      ${shown ? `<em>${t("In mostra")}</em>` : ""}`;
    if (got) li.onclick = () => { setShownTitle(l); toast(t("Ora mostri: {n}", { n: levelTitle(l) })); };
    ol.appendChild(li);
  });
}

function avatarHTML(a = S.avatar || { type: "preset", id: "default" }) {
  if (a.type === "photo") return `<img src="${a.data}" alt="${t("La tua foto")}">`;
  const p = AVATARS.find(x => x.id === a.id) || AVATARS[0];
  if (!p.bg) return `<span class="av-default"><img src="assets/ic-profilo.png" alt=""></span>`;
  if (p.img) return `<span class="av-img${p.full ? " full" : ""}" style="background:${p.bg}"><img src="assets/${p.img}" alt=""></span>`;
  return `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="${p.bg}"/>${p.svg}</svg>`;
}
function renderAvatars() {
  $$("[data-avatar]").forEach(el => el.innerHTML = avatarHTML());
  $(".avatar-ring").style.setProperty("--p", Math.min(100, S.xp / xpNeed(S.level) * 100) + "%");
  const grid = $("[data-av-grid]");
  grid.innerHTML = "";
  AVATARS.forEach(p => {
    const ok = S.level >= p.lv, cur = S.avatar?.type !== "photo" && (S.avatar?.id || "default") === p.id;
    const b = document.createElement("button");
    b.className = "av-opt" + (ok ? "" : " locked") + (cur ? " cur" : "");
    b.innerHTML = `<span class="avatar-pic">${avatarHTML({ type: "preset", id: p.id })}</span><small>${ok ? t(p.n) : "Lv " + p.lv}</small>`;
    b.onclick = () => {
      if (!ok) return toast(t("Si sblocca al livello {l}", { l: p.lv }));
      S.avatar = { type: "preset", id: p.id }; save(); renderAvatars(); toast(t("Avatar aggiornato"));
    };
    grid.appendChild(b);
  });
}
$("[data-av-file]").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image(), url = URL.createObjectURL(file);
  img.onload = () => {
    const c = document.createElement("canvas"), n = 256, k = Math.max(n / img.width, n / img.height), w = img.width * k, h = img.height * k;
    c.width = c.height = n;
    c.getContext("2d").drawImage(img, (n - w) / 2, (n - h) / 2, w, h);
    S.avatar = { type: "photo", data: c.toDataURL("image/jpeg", .85) };
    URL.revokeObjectURL(url); e.target.value = "";
    save(); renderAvatars(); toast(t("Foto del profilo aggiornata"));
  };
  img.onerror = () => toast(t("Immagine non valida"));
  img.src = url;
});

const weekday = (d, format) => d.toLocaleDateString(locale(), { weekday: format });
function lastDays(n = 7) {
  const today = day();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (n - 1 - i));
    const h = i === n - 1 ? { t: today.time, q: today.quiz, l: today.lessons } : S.hist[isoDay(d)] || { t: 0, q: 0, l: 0 };
    return { date: d, min: Math.floor(h.t / 60), quiz: h.q, lessons: h.l, today: i === n - 1 };
  });
}
function renderWeek() {
  const key = $("[data-week].on").dataset.week, unit = t({ min: "min", quiz: "quiz", lessons: "lezioni" }[key]);
  const days = lastDays(), max = Math.max(1, ...days.map(d => d[key])), top = days.reduce((a, d) => d[key] > a[key] ? d : a, days[0]);
  $("[data-week-bars]").innerHTML = days.map(d => {
    const v = d[key], label = d.today || (d === top && v) ? `<em>${v}</em>` : "";
    return `<div class="wb${d.today ? " today" : ""}" title="${weekday(d.date, "long")}: ${v} ${unit}">${label}<i style="height:${Math.max(v ? 6 : 2, v / max * 100)}%"></i><span>${weekday(d.date, "short").slice(0, 2)}</span></div>`;
  }).join("");
  const sum = days.reduce((a, d) => a + d[key], 0), active = days.filter(d => d.min || d.quiz || d.lessons).length;
  $("[data-week-sum]").innerHTML = `<div><b>${sum}</b><span>${t("{u} in 7 giorni", { u: unit })}</span></div>
    <div><b>${key === "min" ? Math.round(sum / 7) : (sum / 7).toFixed(1).replace(".", ",")}</b><span>${t("media al giorno")}</span></div>
    <div><b>${active}/7</b><span>${t("giorni attivi")}</span></div>` + (top[key] ? `<p>${t("Il tuo giorno migliore: <b>{d}</b> ({v} {u})", { d: weekday(top.date, "long"), v: top[key], u: unit })}</p>` : "");
}

const SIM = {
  xp: () => { addXP(100); return "+100 XP"; },
  level: () => {
    if (S.level >= MAX_LEVEL - 1 && !allComplete()) return t("Il livello {l} si sblocca solo completando tutto", { l: MAX_LEVEL });
    S.level++; onLevelUp(); save(); render(); return "";
  },
  time: () => { S.time += 3600; day().time += 3600; save(); render(); return t("+1 ora di studio"); },
  day: () => { S.streak++; S.bestStreak = Math.max(S.bestStreak, S.streak); save(); render(); return t("Streak: {n} giorni", { n: S.streak }); },
  lessons: () => {
    const todo = LESSONS.filter(l => !S.done.includes(l.id));
    todo.forEach(l => S.done.push(l.id));
    S.lessonsTotal += todo.length; day().lessons++;
    addXP(todo.length * 50);
    return todo.length ? t("{n} lezioni completate (+{xp} XP)", { n: todo.length, xp: todo.length * 50 }) : t("Lezioni già tutte completate");
  },
  quiz: () => { S.quizzes += 5; day().quiz += 5; day().perfect++; save(); render(); return t("+5 quiz completati"); },
  missions: () => {
    LESSONS.forEach(l => { if (!S.done.includes(l.id)) { S.done.push(l.id); S.lessonsTotal++; } });
    [...LESSONS, ...COMBOS].forEach(l => {
      S.best[l.id] = 3;
      if (!S.redeemed.includes(l.id)) S.redeemed.push(l.id);
      if (!S.owned.includes(QUIZ_COLOR[l.id])) S.owned.push(QUIZ_COLOR[l.id]);
    });
    if (!S.myPalettes.length) S.myPalettes.push({ id: "demo", n: "Palette demo", c: ["perla", "ardesia"] });
    Object.assign(S, { combosRead: COMBOS.map(c => c.id), games: { guess: 5, order: 5, comp: 5 }, labSaved: true, photoDone: true, streak: 4, bestStreak: 4 });
    Object.assign(day(), { lessons: 1, quiz: 2, perfect: 1, time: 300 });
    save(); renderPalettes(); render(); return t("Tutte le missioni sono pronte da riscattare!");
  },
  colors: () => { S.owned = COLORS.map(c => c.id); save(); render(); return t("Tutti i {n} colori sbloccati", { n: COLORS.length }); },
  badges: () => {
    S.badges = ["Badge dello studente", "Badge dello studioso", "Badge sociale", "Badge digitale", "Occhio allenato"];
    S.owned = COLORS.map(c => c.id); S.level = Math.max(S.level, 10); fillTitles();
    save(); render(); return t("Tutti i badge sbloccati");
  },
  expert: () => {
    Object.assign(S, {
      level: 12, xp: Math.round(xpNeed(12) * .6), xpTotal: 3200, time: 30 * 3600 + 25 * 60, streak: 21, bestStreak: 21, quizzes: 42, lessonsTotal: 24,
      missionsDone: 25, done: LESSONS.map(l => l.id), badges: ["Badge dello studente", "Badge dello studioso", "Badge sociale"],
      claimed: ["p1", "p2", "p3", "p4", "s1", "s2"], onboarded: true, name: S.name || "Luca", shownTitle: null,
      games: { guess: 4, order: 3, comp: 5 }, labSaved: true, photoDone: true
    });
    COLORS.slice(0, 22).forEach(c => { if (!S.owned.includes(c.id)) S.owned.push(c.id); });
    [6, 5, 4, 3, 2, 1].forEach((n, i) => { const d = new Date(); d.setDate(d.getDate() - n); S.hist[isoDay(d)] = { t: [1500, 600, 0, 2400, 900, 1800][i], q: [3, 1, 0, 5, 2, 4][i], l: [2, 1, 0, 3, 1, 2][i] }; });
    fillTitles(); save(); render(); return t("Profilo da utente esperto caricato");
  },
  secret: () => {
    SIM.missions();
    Object.assign(S, { owned: COLORS.map(c => c.id), level: MAX_LEVEL, xp: xpNeed(MAX_LEVEL), secretSeen: false });
    fillTitles(); save(); render(); checkSecret(); return "";
  },
  fresh: () => { confirmBox(t("Nuovo utente?"), t("Tutti i progressi verranno azzerati e ripartirà l'onboarding."), resetAll); return ""; }
};
function secretTaps(el) {
  let n = 0, timer;
  el.addEventListener("click", () => {
    clearTimeout(timer); timer = setTimeout(() => n = 0, 1200);
    if (++n >= 5) { n = 0; $("[data-demo]").hidden = false; }
    else if (n >= 3) toast(t("Ancora {n}…", { n: 5 - n }));
  });
}
secretTaps($("[data-version]"));
secretTaps($(".home-face"));
$("[data-demo-close]").onclick = () => $("[data-demo]").hidden = true;
$("[data-demo]").addEventListener("click", e => {
  if (e.target.matches("[data-demo]")) return e.target.hidden = true;
  const b = e.target.closest("[data-sim]");
  const msg = b && SIM[b.dataset.sim]();
  if (msg) toast(msg);
});

const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isMobile = matchMedia("(max-width: 500px)").matches || /android|iphone|ipad|ipod/i.test(navigator.userAgent);
let installEvent = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvent = e; showInstallBar(); });
function showInstallBar() {
  let off = false;
  try { off = localStorage.getItem("chroma-install-off") === "1"; } catch {}
  $("[data-install]").hidden = standalone || off || !isMobile || !(installEvent || isIOS);
}
function install() {
  if (standalone) return toast(t("CHROMA è già installata"));
  if (installEvent) { installEvent.prompt(); installEvent.userChoice.then(() => { installEvent = null; showInstallBar(); }); return; }
  const sh = $("[data-sheet]");
  const steps = isIOS
    ? ["Apri questa pagina con <b>Safari</b>", "Tocca il tasto <b>Condividi</b> (il quadrato con la freccia ↑)", "Scegli <b>Aggiungi a Home</b> e poi <b>Aggiungi</b>", "Apri CHROMA dall'icona: sarà a schermo intero"]
    : ["Apri il menu del browser <b>⋮</b>", "Scegli <b>Installa app</b> o <b>Aggiungi a schermata Home</b>", "Apri CHROMA dall'icona: sarà a schermo intero"];
  sh.innerHTML = `<h3>${t(isIOS ? "Installa CHROMA su iPhone" : "Installa CHROMA")}</h3><ol class="ios-steps">${steps.map(s => `<li>${t(s)}</li>`).join("")}</ol>`;
  const ok = document.createElement("button");
  ok.className = "sheet-btn cancel"; ok.textContent = t("Ho capito");
  ok.onclick = () => $("[data-sheet-bg]").hidden = true;
  sh.appendChild(ok);
  $("[data-sheet-bg]").hidden = false;
}
$$("[data-install-go]").forEach(b => b.onclick = install);
$("[data-install-x]").onclick = () => { try { localStorage.setItem("chroma-install-off", "1"); } catch {} $("[data-install]").hidden = true; };

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  let hadController = !!navigator.serviceWorker.controller, reloading = false;
  navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then(reg => {
    const check = () => reg.update().catch(() => {});
    check();
    document.addEventListener("visibilitychange", () => { if (!document.hidden) check(); });
    addEventListener("focus", check);
    setInterval(check, 15 * 60 * 1000);
  }).catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) { hadController = true; return; }
    if (reloading) return;
    const reload = () => { reloading = true; save(); try { sessionStorage.setItem("chroma-updated", "1"); } catch {} location.reload(); };
    if (["quiz", "paledit", "onb3"].includes(current)) sheet(t("È disponibile una nuova versione di CHROMA"), [[t("Aggiorna ora"), reload]]);
    else reload();
  });
}
async function forceUpdate() {
  toast(t("Aggiornamento in corso…"));
  save();
  try {
    const regs = await navigator.serviceWorker?.getRegistrations?.() || [];
    await Promise.all(regs.map(r => r.unregister()));
    const keys = await caches?.keys?.() || [];
    await Promise.all(keys.map(k => caches.delete(k)));
  } catch {}
  location.reload();
}
$("[data-force-update]").onclick = () => confirmBox(t("Aggiornare l'app?"), t("Scarico l'ultima versione di CHROMA. I tuoi progressi restano salvati."), forceUpdate);
const showVersion = () => (window.caches ? caches.keys() : Promise.resolve([])).then(keys => {
  const v = keys.filter(k => k.startsWith("chroma-v")).sort().pop();
  $("[data-version]").textContent = `CHROMA ${v ? v.replace("chroma-", "") : "v1"} · ${t("Tesi magistrale")}`;
}).catch(() => {});

function fit() {
  document.documentElement.style.setProperty("--app-h", innerHeight + "px");
  document.documentElement.style.setProperty("--app-w", innerWidth + "px");
}
addEventListener("resize", fit);
addEventListener("orientationchange", () => setTimeout(fit, 250));

let ticks = 0;
setInterval(() => {
  if (document.hidden || !S.onboarded) return;
  S.time++; day().time++;
  if (++ticks % 15 === 0) save();
  if (ticks % 60 === 0) render();
}, 1000);
addEventListener("visibilitychange", () => { if (document.hidden) save(); });

document.addEventListener("DOMContentLoaded", () => {
  fit();
  LANG = S.lang || (navigator.language?.toLowerCase().startsWith("uk") ? "uk" : "it");
  setLang(LANG);
  updateStreak();
  fillTitles();
  buildLessonLists();
  applyDark();
  renderPalettes();
  render();
  showInstallBar();
  showVersion(); setTimeout(showVersion, 3000);
  try {
    if (sessionStorage.getItem("chroma-updated")) {
      sessionStorage.removeItem("chroma-updated");
      setTimeout(() => toast(t("CHROMA aggiornata all'ultima versione ✨")), 2600);
    }
  } catch {}
  go("splash", false);
  setTimeout(() => {
    if (current !== "splash") return;
    go(S.onboarded ? "home" : "onb1", false);
    checkSecret();
  }, 2000);
});
