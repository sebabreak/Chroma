(function () {
  "use strict";

  var DICT = { en: typeof EN !== "undefined" ? EN : {}, uk: typeof UK !== "undefined" ? UK : {} };
  var TVD = {
    en: {
      "Home": "Home", "Lezioni": "Lessons", "Combinazioni": "Combinations", "Quiz": "Quiz", "Colori": "Colors", "Palette": "Palettes",
      "Benvenuto in CHROMA": "Welcome to CHROMA",
      "Impara i significati dei colori, ora anche sulla TV.": "Learn the meanings of colors, now on TV too.",
      "Livello {n}": "Level {n}", "{p}% del percorso": "{p}% of the journey",
      "Continua da qui": "Continue from here", "Hai completato tutto!": "You've completed everything!",
      "Psicologia del colore": "Color psychology", "Colore digitale": "Digital color",
      "Letta": "Read", "{n} lezioni": "{n} lessons", "{n} combinazioni": "{n} combinations", "{n} quiz": "{n} quizzes",
      "{a} su {b} sbloccati": "{a} of {b} unlocked", "{n} palette": "{n} palettes",
      "Lo sapevi?": "Did you know?", "Fai il quiz": "Take the quiz", "Rifai il quiz": "Retake the quiz", "Indietro": "Back",
      "Come funziona": "How it works", "Quando usarla": "When to use it",
      "Domanda {n} di {m}": "Question {n} of {m}", "Avanti": "Next", "Vedi il risultato": "See the result",
      "Perfetto!": "Perfect!", "Quasi!": "Almost!", "Si può fare di meglio": "You can do better",
      "Hai risposto bene a {n} domande su 3.": "You answered {n} out of 3 questions correctly.",
      "Fai 3 su 3 per sbloccare il colore {c}.": "Score 3 out of 3 to unlock the color {c}.",
      "Hai sbloccato {c}": "You unlocked {c}", "Nuovo colore nella tua collezione": "New color in your collection",
      "Torna ai quiz": "Back to quizzes", "Riprova": "Try again", "Leggi la teoria": "Read the theory",
      "Miglior risultato: {n}/3": "Best score: {n}/3", "Non ancora fatto": "Not taken yet",
      "Fai 3 su 3: {q}": "Score 3/3: {q}", "Si sblocca nell'app sul telefono": "Unlocks in the phone app",
      "Scorri con ▲ ▼": "Scroll with ▲ ▼", "Sbloccato": "Unlocked",
      "Scegli una lezione e poi mettiti alla prova con il quiz.": "Pick a lesson, then test yourself with the quiz.",
      "Come si accostano i colori tra loro.": "How colors work together.",
      "Ogni quiz perfetto sblocca un colore.": "Every perfect quiz unlocks a color.",
      "La tua collezione di colori.": "Your color collection.",
      "Gruppi di colori ed emozioni che evocano.": "Groups of colors and the emotions they evoke.",
      "Teoria": "Theory"
    },
    uk: {
      "Home": "Головна", "Lezioni": "Уроки", "Combinazioni": "Поєднання", "Quiz": "Вікторини", "Colori": "Кольори", "Palette": "Палітри",
      "Benvenuto in CHROMA": "Ласкаво просимо до CHROMA",
      "Impara i significati dei colori, ora anche sulla TV.": "Вивчай значення кольорів, тепер і на телевізорі.",
      "Livello {n}": "Рівень {n}", "{p}% del percorso": "{p}% шляху",
      "Continua da qui": "Продовжити звідси", "Hai completato tutto!": "Ти все завершив!",
      "Psicologia del colore": "Психологія кольору", "Colore digitale": "Цифровий колір",
      "Letta": "Прочитано", "{n} lezioni": "Уроків: {n}", "{n} combinazioni": "Поєднань: {n}", "{n} quiz": "Вікторин: {n}",
      "{a} su {b} sbloccati": "Відкрито {a} з {b}", "{n} palette": "Палітр: {n}",
      "Lo sapevi?": "Чи знаєш ти?", "Fai il quiz": "Пройти вікторину", "Rifai il quiz": "Пройти ще раз", "Indietro": "Назад",
      "Come funziona": "Як це працює", "Quando usarla": "Коли використовувати",
      "Domanda {n} di {m}": "Питання {n} з {m}", "Avanti": "Далі", "Vedi il risultato": "Побачити результат",
      "Perfetto!": "Чудово!", "Quasi!": "Майже!", "Si può fare di meglio": "Можна краще",
      "Hai risposto bene a {n} domande su 3.": "Правильних відповідей: {n} з 3.",
      "Fai 3 su 3 per sbloccare il colore {c}.": "Відповідай 3 з 3, щоб відкрити колір «{c}».",
      "Hai sbloccato {c}": "Відкрито колір «{c}»", "Nuovo colore nella tua collezione": "Новий колір у твоїй колекції",
      "Torna ai quiz": "До вікторин", "Riprova": "Спробувати ще", "Leggi la teoria": "Читати теорію",
      "Miglior risultato: {n}/3": "Найкращий результат: {n}/3", "Non ancora fatto": "Ще не пройдено",
      "Fai 3 su 3: {q}": "3 з 3: {q}", "Si sblocca nell'app sul telefono": "Відкривається в застосунку на телефоні",
      "Scorri con ▲ ▼": "Гортай ▲ ▼", "Sbloccato": "Відкрито",
      "Scegli una lezione e poi mettiti alla prova con il quiz.": "Обери урок, а потім перевір себе у вікторині.",
      "Come si accostano i colori tra loro.": "Як кольори поєднуються між собою.",
      "Ogni quiz perfetto sblocca un colore.": "Кожна ідеальна вікторина відкриває колір.",
      "La tua collezione di colori.": "Твоя колекція кольорів.",
      "Gruppi di colori ed emozioni che evocano.": "Групи кольорів і емоції, які вони викликають.",
      "Teoria": "Теорія"
    }
  };
  var LANGS = [["it", "IT"], ["en", "EN"], ["uk", "УКР"]];

  var KEY = "chroma-tv";
  var DEF = { lang: null, done: [], best: {}, owned: ["perla", "ardesia"], xp: 0 };
  var S = load();
  var LANG = S.lang || (function () { var l = (navigator.language || "").slice(0, 2).toLowerCase(); return l === "en" || l === "uk" ? l : "it"; })();

  function load() {
    var s = {};
    try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { s = {}; }
    var out = {};
    Object.keys(DEF).forEach(function (k) {
      var d = DEF[k];
      out[k] = s[k] !== undefined && typeof s[k] === typeof d && Array.isArray(s[k]) === Array.isArray(d) ? s[k] : JSON.parse(JSON.stringify(d));
    });
    return out;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  function t(text, vars) {
    var out = (TVD[LANG] && TVD[LANG][text]) || (DICT[LANG] && DICT[LANG][text]) || text;
    return vars ? out.replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; }) : out;
  }

  var COLOR_BY = {};
  COLORS.forEach(function (c) { COLOR_BY[c.id] = c; });
  var PSY = LESSONS.filter(function (l) { return !l.track; });
  var DIG = LESSONS.filter(function (l) { return l.track === "digitale"; });
  var ALLQ = LESSONS.concat(COMBOS);
  var isCombo = function (id) { return COMBOS.some(function (c) { return c.id === id; }); };
  var byId = function (id) { return ALLQ.filter(function (x) { return x.id === id; })[0]; };
  var TOTAL = LESSONS.length * 50 + COMBOS.length * 50 + ALLQ.length * 100;
  var MAXL = LEVEL_TITLES.length;

  function level() { return Math.min(MAXL, 1 + Math.floor(S.xp / (TOTAL / (MAXL - 1)))); }
  function addXP(n) { S.xp = Math.min(TOTAL, S.xp + n); save(); }

  function lum(h) {
    var c = [1, 3, 5].map(function (i) { var v = parseInt(h.slice(i, i + 2), 16) / 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  }
  function onColor(h) { var L = lum(h); return (1.05 / (L + .05)) >= ((L + .05) / .0623) ? "#fff" : "#111"; }

  var stage = document.getElementById("stage");
  var main = document.getElementById("main");
  var navEl = document.getElementById("nav");
  var langEl = document.getElementById("lang");
  var toastTimer = null;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = "scale(" + s + ")";
    stage.style.left = Math.max(0, (window.innerWidth - 1920 * s) / 2) + "px";
    stage.style.top = Math.max(0, (window.innerHeight - 1080 * s) / 2) + "px";
  }
  function toast(msg) {
    var tEl = document.getElementById("toast");
    tEl.textContent = msg; tEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { tEl.hidden = true; }, 2600);
  }
  function img(name) { return "url(\"../assets/" + name + "\")"; }
  function picStyle(node, l) {
    if (l.img) node.style.backgroundImage = img(l.img);
    else if (l.grad) node.style.backgroundImage = l.grad;
  }
  function focusable(node, onPick) {
    node.classList.add("f");
    node.setAttribute("tabindex", "-1");
    node.addEventListener("click", function () { focus(node); onPick(); });
    node.addEventListener("mouseenter", function () { focus(node, true); });
    return node;
  }

  var NAV = [
    { id: "home", label: "Home", icon: "ic-home.png" },
    { id: "lezioni", label: "Lezioni", icon: "ic-lezioni.png" },
    { id: "combinazioni", label: "Combinazioni", icon: "ic-explore.png" },
    { id: "quiz", label: "Quiz", icon: "ic-quest.png" },
    { id: "colori", label: "Colori", dot: "conic-gradient(#e3242b,#ffd000,#2fa84f,#1f5fe0,#8a2be2,#e3242b)" },
    { id: "palette", label: "Palette", dot: "linear-gradient(90deg,#d62828,#f77f00,#fcbf49,#2a9d8f,#1d3557)" }
  ];
  function section(view) {
    if (view === "lezione") return "lezioni";
    if (view === "combo") return "combinazioni";
    if (view === "gioca") return "quiz";
    return view;
  }

  function renderRail(active) {
    navEl.innerHTML = "";
    NAV.forEach(function (n) {
      var b = el("button", "nav-item" + (n.id === active ? " active" : ""));
      b.dataset.zone = "rail";
      var ni = el("span", "ni");
      if (n.icon) { var im = el("img"); im.src = "../assets/" + n.icon; im.alt = ""; ni.appendChild(im); }
      else { var d = el("i"); d.style.background = n.dot; ni.appendChild(d); }
      b.appendChild(ni);
      b.appendChild(el("span", null, t(n.label)));
      focusable(b, function () { go(n.id); });
      navEl.appendChild(b);
    });
    langEl.innerHTML = "";
    LANGS.forEach(function (L) {
      var b = el("button", "lang-btn" + (L[0] === LANG ? " on" : ""), L[1]);
      b.dataset.zone = "rail";
      focusable(b, function () {
        LANG = L[0]; S.lang = LANG; save();
        document.documentElement.lang = LANG;
        route(true);
        var again = langEl.querySelectorAll(".lang-btn");
        for (var i = 0; i < again.length; i++) if (again[i].textContent === L[1]) focus(again[i]);
      });
      langEl.appendChild(b);
    });
  }

  function go(view, arg) { location.hash = view + (arg ? "/" + encodeURIComponent(arg) : ""); }

  var current = null;
  function focus(node, silent) {
    if (!node) return;
    if (current && current !== node) current.classList.remove("focus");
    current = node;
    node.classList.add("focus");
    if (!silent) keepVisible(node);
  }
  function keepVisible(node) {
    var sc = node.closest(".scroller");
    if (!sc) return;
    var r = node.getBoundingClientRect(), s = sc.getBoundingClientRect(), k = s.height / sc.clientHeight;
    var top = (r.top - s.top) / k, bottom = (r.bottom - s.top) / k, pad = 90, y = sc.scrollTop;
    if (top < pad) y = sc.scrollTop + top - pad;
    else if (bottom > sc.clientHeight - pad) y = sc.scrollTop + bottom - sc.clientHeight + pad;
    if (y !== sc.scrollTop) sc.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }

  function candidates() {
    var all = stage.querySelectorAll(".f"), out = [];
    for (var i = 0; i < all.length; i++) {
      var r = all[i].getBoundingClientRect();
      if (r.width && r.height && !all[i].disabled) out.push(all[i]);
    }
    return out;
  }
  function move(dir) {
    if (current && current.dataset.scroll && (dir === "up" || dir === "down")) {
      if (scrollText(current, dir === "down" ? 1 : -1)) return;
    }
    var list = candidates();
    if (!current || list.indexOf(current) < 0) { focus(list.filter(function (n) { return n.dataset.zone !== "rail"; })[0] || list[0]); return; }
    var inRail = current.dataset.zone === "rail";
    list = list.filter(function (n) { return (n.dataset.zone === "rail") === inRail || (!inRail && dir === "left") || (inRail && dir === "right"); });
    var a = current.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    var best = null, bd = Infinity;
    list.forEach(function (n) {
      if (n === current) return;
      var b = n.getBoundingClientRect(), bx = b.left + b.width / 2, by = b.top + b.height / 2;
      var dx = bx - ax, dy = by - ay, main, cross;
      if (dir === "left") { if (b.right > a.left + 4) return; main = a.left - b.right; cross = Math.max(0, Math.max(b.top - a.bottom, a.top - b.bottom)); }
      else if (dir === "right") { if (b.left < a.right - 4) return; main = b.left - a.right; cross = Math.max(0, Math.max(b.top - a.bottom, a.top - b.bottom)); }
      else if (dir === "up") { if (b.bottom > a.top + 4) return; main = a.top - b.bottom; cross = Math.max(0, Math.max(b.left - a.right, a.left - b.right)); }
      else { if (b.top < a.bottom - 4) return; main = b.top - a.bottom; cross = Math.max(0, Math.max(b.left - a.right, a.left - b.right)); }
      var d = Math.max(0, main) + cross * 3 + (cross ? 0 : Math.abs(dir === "left" || dir === "right" ? dy : dx) * .3);
      if (d < bd) { bd = d; best = n; }
    });
    if (best) focus(best);
  }

  function scrollText(node, sign) {
    var inner = node.querySelector(".text-in");
    var max = Math.max(0, inner.offsetHeight - node.clientHeight + 40);
    var y = parseFloat(node.dataset.y || "0");
    var ny = Math.max(0, Math.min(max, y + sign * 260));
    if (ny === y) return false;
    node.dataset.y = ny;
    inner.style.transform = "translateY(" + (-ny) + "px)";
    var hint = node.querySelector(".scrollhint");
    if (hint) hint.hidden = ny >= max;
    return true;
  }

  function view(cls) {
    main.innerHTML = "";
    var v = el("div", cls || "view");
    main.appendChild(v);
    return v;
  }
  function header(box, eyebrow, title, lead) {
    if (eyebrow) box.appendChild(el("div", "eyebrow", eyebrow));
    box.appendChild(el("h1", "h1", title));
    if (lead) box.appendChild(el("p", "lead", lead));
  }
  function button(label, onPick, ghost) {
    var b = el("button", "btn" + (ghost ? " ghost" : ""), label);
    return focusable(b, onPick);
  }

  function nextStep() {
    for (var i = 0; i < ALLQ.length; i++) {
      var x = ALLQ[i];
      if (S.best[x.id] === 3) continue;
      if (S.done.indexOf(x.id) < 0) return { item: x, quiz: false };
      if (S.best[x.id] !== 3) return { item: x, quiz: true };
    }
    return null;
  }

  function pageHome() {
    var v = view("scroller");
    var hero = el("div", "hero");
    var om = el("img", "omino"); om.src = "../assets/chroma-omino.png"; om.alt = "";
    hero.appendChild(om);
    hero.appendChild(el("h1", null, t("Benvenuto in CHROMA")));
    hero.appendChild(el("p", null, t("Impara i significati dei colori, ora anche sulla TV.")));
    var lb = el("div", "levelbox");
    var L = level();
    lb.appendChild(el("b", null, t("Livello {n}", { n: L }) + " · " + t(LEVEL_TITLES[L - 1])));
    var bar = el("div", "bar"), fill = el("i"); fill.style.width = Math.round(S.xp / TOTAL * 100) + "%";
    bar.appendChild(fill); lb.appendChild(bar);
    lb.appendChild(el("small", null, t("{p}% del percorso", { p: Math.round(S.xp / TOTAL * 100) })));
    hero.appendChild(lb);
    v.appendChild(hero);

    var step = nextStep();
    v.appendChild(el("h2", "h2", step ? t("Continua da qui") : t("Hai completato tutto!")));
    var row = el("div", "row");
    if (step) row.appendChild(cardFor(step.item, step.quiz));
    v.appendChild(row);

    v.appendChild(el("h2", "h2", t("Teoria")));
    var tiles = el("div", "row");
    var owned = S.owned.length;
    [
      ["lezioni", "Lezioni", t("{n} lezioni", { n: LESSONS.length }), "linear-gradient(135deg,#7b2482,#a200b8)"],
      ["combinazioni", "Combinazioni", t("{n} combinazioni", { n: COMBOS.length }), "linear-gradient(135deg,#4a6bd0,#1b0a8c)"],
      ["quiz", "Quiz", t("{n} quiz", { n: ALLQ.length }), "linear-gradient(135deg,#b9794e,#8a4619)"],
      ["colori", "Colori", t("{a} su {b} sbloccati", { a: owned, b: COLORS.length }), "conic-gradient(from 200deg,#e3242b,#ff7a00,#ffd000,#2fa84f,#12c4c0,#1f5fe0,#8a2be2,#d6208f,#e3242b)"],
      ["palette", "Palette", t("{n} palette", { n: PALETTES.length }), "linear-gradient(135deg,#2a9d8f,#1d3557)"]
    ].forEach(function (x) {
      var tl = el("button", "tile");
      tl.style.background = x[3];
      tl.appendChild(el("b", null, t(x[1])));
      tl.appendChild(el("small", null, x[2]));
      focusable(tl, function () { go(x[0]); });
      tiles.appendChild(tl);
    });
    v.appendChild(tiles);
  }

  function cardFor(l, quizFirst) {
    var c = el("button", "card");
    var pic = el("div", "pic"); picStyle(pic, l);
    if (S.done.indexOf(l.id) >= 0) pic.appendChild(el("span", "done", S.best[l.id] === 3 ? "3/3" : t("Letta")));
    c.appendChild(pic);
    var m = el("div", "meta");
    m.appendChild(el("b", null, t(l.title)));
    var sub = S.best[l.id] != null ? t("Miglior risultato: {n}/3", { n: S.best[l.id] }) : (quizFirst ? t("Fai il quiz") : t(isCombo(l.id) ? "Combinazioni" : (l.track ? "Colore digitale" : "Psicologia del colore")));
    m.appendChild(el("small", null, sub));
    c.appendChild(m);
    focusable(c, function () {
      if (quizFirst) go("gioca", l.id);
      else go(isCombo(l.id) ? "combo" : "lezione", l.id);
    });
    return c;
  }

  function pageLessons() {
    var v = view("scroller");
    header(v, null, t("Lezioni"), t("Scegli una lezione e poi mettiti alla prova con il quiz."));
    [["Psicologia del colore", PSY], ["Colore digitale", DIG]].forEach(function (g) {
      if (!g[1].length) return;
      v.appendChild(el("h2", "h2", t(g[0])));
      var row = el("div", "row");
      g[1].forEach(function (l) { row.appendChild(cardFor(l)); });
      v.appendChild(row);
    });
  }

  function pageCombos() {
    var v = view("scroller");
    header(v, null, t("Combinazioni"), t("Come si accostano i colori tra loro."));
    var row = el("div", "row"); row.style.marginTop = "40px";
    COMBOS.forEach(function (c) { row.appendChild(cardFor(c)); });
    v.appendChild(row);
  }

  function reader(l, paragraphs) {
    if (S.done.indexOf(l.id) < 0) { S.done.push(l.id); addXP(50); }
    var v = view();
    var wrap = el("div", "reader");
    var side = el("div", "side");
    var pic = el("div", "pic"); picStyle(pic, l);
    side.appendChild(pic);
    var acts = el("div", "actions");
    var quizBtn = button(t(S.best[l.id] != null ? "Rifai il quiz" : "Fai il quiz"), function () { go("gioca", l.id); });
    acts.appendChild(quizBtn);
    acts.appendChild(button(t("Indietro"), function () { history.back(); }, true));
    side.appendChild(acts);
    wrap.appendChild(side);

    var text = el("div", "text");
    text.dataset.scroll = "1";
    focusable(text, function () {});
    var inner = el("div", "text-in");
    inner.appendChild(el("div", "eyebrow", t(isCombo(l.id) ? "Combinazioni" : (l.track ? "Colore digitale" : "Psicologia del colore"))));
    inner.appendChild(el("h1", "h1", t(l.title)));
    paragraphs.forEach(function (p) {
      if (p.h) inner.appendChild(el("h3", null, p.h));
      else inner.appendChild(el("p", null, p));
    });
    if (l.fact) {
      var f = el("div", "fact");
      f.appendChild(el("b", null, t("Lo sapevi?")));
      f.appendChild(el("span", null, t(l.fact)));
      inner.appendChild(f);
    }
    text.appendChild(inner);
    var hint = el("div", "scrollhint", t("Scorri con ▲ ▼"));
    text.appendChild(hint);
    wrap.appendChild(text);
    v.appendChild(wrap);
    requestAnimationFrame(function () { hint.hidden = inner.offsetHeight <= text.clientHeight; });
    return quizBtn;
  }

  function pageLesson(id) {
    var l = byId(id);
    if (!l || isCombo(id)) return go("lezioni");
    return reader(l, l.body.map(function (p) { return t(p); }));
  }
  function pageCombo(id) {
    var c = byId(id);
    if (!c || !isCombo(id)) return go("combinazioni");
    var ps = [t(c.intro), { h: t("Come funziona") }, t(c.how), { h: t("Quando usarla") }, t(c.when)];
    (c.extra || []).forEach(function (p) { ps.push(t(p)); });
    return reader(c, ps);
  }

  function pageQuizList() {
    var v = view("scroller");
    header(v, null, t("Quiz"), t("Ogni quiz perfetto sblocca un colore."));
    [["Psicologia del colore", PSY], ["Colore digitale", DIG], ["Combinazioni", COMBOS]].forEach(function (g) {
      if (!g[1].length) return;
      v.appendChild(el("h2", "h2", t(g[0])));
      var row = el("div", "row");
      g[1].forEach(function (l) {
        var r = el("button", "qrow");
        var sw = el("div", "sw");
        var col = COLOR_BY[QUIZ_COLOR[l.id]];
        if (col) sw.style.background = col.h; else picStyle(sw, l);
        r.appendChild(sw);
        var tx = el("div", "tx");
        tx.appendChild(el("b", null, t(l.title)));
        var best = S.best[l.id];
        tx.appendChild(el("small", best === 3 ? "best" : null, best != null ? t("Miglior risultato: {n}/3", { n: best }) : t("Non ancora fatto")));
        r.appendChild(tx);
        focusable(r, function () { go("gioca", l.id); });
        row.appendChild(r);
      });
      v.appendChild(row);
    });
  }

  function pagePlay(id) {
    var l = byId(id);
    if (!l) return go("quiz");
    var qs = l.quiz, i = 0, picks = [];
    var v = view("quiz");

    function stepBar(box) {
      var st = el("div", "steps");
      qs.forEach(function (_, k) {
        var dot = el("i");
        if (k < picks.length) dot.className = picks[k] === qs[k].ok ? "ok" : "ko";
        else if (k === i) dot.className = "now";
        st.appendChild(dot);
      });
      box.appendChild(st);
    }

    function showQuestion() {
      v.innerHTML = "";
      var top = el("div", "top");
      top.appendChild(el("b", null, t(l.title) + " · " + t("Domanda {n} di {m}", { n: i + 1, m: qs.length })));
      stepBar(top);
      v.appendChild(top);
      var q = qs[i];
      v.appendChild(el("div", "q", t(q.q)));
      var ans = el("div", "answers"), btns = [];
      q.a.forEach(function (a, k) {
        var b = el("button", "answer", t(a));
        focusable(b, function () { pick(k); });
        btns.push(b);
        ans.appendChild(b);
      });
      v.appendChild(ans);
      var acts = el("div", "actions");
      v.appendChild(acts);
      focus(btns[0]);
      var answered = false;
      function pick(k) {
        if (answered) return;
        answered = true;
        picks.push(k);
        btns.forEach(function (b, j) {
          b.disabled = true;
          b.classList.remove("f", "focus");
          if (j === q.ok) b.classList.add("right");
          else if (j === k) b.classList.add("wrong");
          else b.classList.add("dim");
        });
        var last = i === qs.length - 1;
        var next = button(t(last ? "Vedi il risultato" : "Avanti"), function () {
          if (last) showResult(); else { i++; showQuestion(); }
        });
        acts.appendChild(next);
        var old = top.querySelector(".steps"); if (old) old.parentNode.removeChild(old);
        stepBar(top);
        focus(next);
      }
    }

    function showResult() {
      var score = picks.filter(function (p, k) { return p === qs[k].ok; }).length;
      var prev = S.best[l.id];
      S.best[l.id] = Math.max(prev == null ? 0 : prev, score);
      var col = COLOR_BY[QUIZ_COLOR[l.id]];
      var newColor = null;
      if (score === 3 && prev !== 3) {
        addXP(100);
        if (col && S.owned.indexOf(col.id) < 0) { S.owned.push(col.id); newColor = col; }
      }
      save();
      v.innerHTML = "";
      var res = el("div", "result");
      res.appendChild(el("div", "big", score + "/3"));
      var box = el("div");
      box.appendChild(el("h2", null, t(score === 3 ? "Perfetto!" : score === 2 ? "Quasi!" : "Si può fare di meglio")));
      box.appendChild(el("p", null, t("Hai risposto bene a {n} domande su 3.", { n: score }) + (score < 3 && col && S.owned.indexOf(col.id) < 0 ? " " + t("Fai 3 su 3 per sbloccare il colore {c}.", { c: t(col.n) }) : "")));
      if (newColor) {
        var u = el("div", "unlock");
        var sw = el("i"); sw.style.background = newColor.h;
        u.appendChild(sw);
        var ut = el("div");
        ut.appendChild(el("b", null, t("Hai sbloccato {c}", { c: t(newColor.n) })));
        ut.appendChild(el("small", null, t("Nuovo colore nella tua collezione")));
        u.appendChild(ut);
        box.appendChild(u);
      }
      var acts = el("div", "actions");
      var again = button(t("Riprova"), function () { i = 0; picks = []; showQuestion(); });
      var back = button(t("Torna ai quiz"), function () { go("quiz"); });
      if (score === 3) { acts.appendChild(back); acts.appendChild(again); }
      else { acts.appendChild(again); acts.appendChild(button(t("Leggi la teoria"), function () { go(isCombo(l.id) ? "combo" : "lezione", l.id); })); acts.appendChild(back); }
      box.appendChild(acts);
      res.appendChild(box);
      v.appendChild(res);
      focus(acts.firstChild);
    }

    showQuestion();
    return "self";
  }

  function pageColors() {
    var v = view("scroller");
    header(v, t("{a} su {b} sbloccati", { a: S.owned.length, b: COLORS.length }), t("Colori"), t("La tua collezione di colori."));
    var spacer = el("div"); spacer.style.height = "36px"; v.appendChild(spacer);
    FAMILIES.forEach(function (f) {
      var box = el("div", "fam");
      var h = el("h4", null, t(f[0]));
      if (FAM_EMO[f[0]]) h.appendChild(el("span", null, FAM_EMO[f[0]].map(function (e) { return t(e); }).join(" · ")));
      box.appendChild(h);
      var sws = el("div", "swatches");
      f[1].forEach(function (id) {
        var c = COLOR_BY[id]; if (!c) return;
        var owned = S.owned.indexOf(id) >= 0;
        var sw = el("button", "swatch" + (owned ? "" : " locked"));
        var q = ALLQ.filter(function (x) { return QUIZ_COLOR[x.id] === id; })[0];
        if (owned) { sw.style.background = c.h; sw.style.color = onColor(c.h); }
        else { var lk = el("img"); lk.src = "../assets/lucchetto.png"; lk.alt = ""; sw.appendChild(lk); }
        sw.appendChild(el("b", null, t(c.n)));
        sw.appendChild(el("small", null, owned ? c.h.toUpperCase() : (q ? t("Fai 3 su 3: {q}", { q: t(q.title) }) : t("Si sblocca nell'app sul telefono"))));
        focusable(sw, function () {
          if (owned) toast(t(c.n) + " · " + c.h.toUpperCase());
          else if (q) go("gioca", q.id);
          else toast(t("Si sblocca nell'app sul telefono"));
        });
        sws.appendChild(sw);
      });
      box.appendChild(sws);
      v.appendChild(box);
    });
  }

  function pagePalettes() {
    var v = view("scroller");
    header(v, null, t("Palette"), t("Gruppi di colori ed emozioni che evocano."));
    var spacer = el("div"); spacer.style.height = "40px"; v.appendChild(spacer);
    PALETTES.forEach(function (p) {
      var card = el("button", "palette");
      var strip = el("div", "strip");
      p.c.forEach(function (h) { var i = el("i"); i.style.background = h; strip.appendChild(i); });
      card.appendChild(strip);
      var tx = el("div");
      tx.appendChild(el("b", null, t(p.n)));
      tx.appendChild(el("p", null, t(p.t)));
      var chips = el("div", "chips");
      p.e.forEach(function (e) { chips.appendChild(el("span", "chip", t(e))); });
      tx.appendChild(chips);
      card.appendChild(tx);
      focusable(card, function () {});
      v.appendChild(card);
    });
    if (typeof PAL_FACT !== "undefined") {
      var f = el("div", "fact");
      f.appendChild(el("b", null, t("Lo sapevi?")));
      f.appendChild(el("span", null, t(PAL_FACT)));
      v.appendChild(f);
    }
  }

  var lastSection = null;
  function route(keepFocusInRail) {
    var raw = (location.hash || "#home").slice(1).split("/");
    var name = raw[0] || "home", arg = raw[1] ? decodeURIComponent(raw[1]) : null;
    var sec = section(name);
    if (!NAV.some(function (n) { return n.id === sec; })) { name = "home"; sec = "home"; }
    var railFocused = current && current.dataset.zone === "rail" && current.classList.contains("nav-item");
    renderRail(sec);
    current = null;
    var first = null;
    if (name === "home") pageHome();
    else if (name === "lezioni") pageLessons();
    else if (name === "combinazioni") pageCombos();
    else if (name === "quiz") pageQuizList();
    else if (name === "colori") pageColors();
    else if (name === "palette") pagePalettes();
    else if (name === "lezione") first = pageLesson(arg);
    else if (name === "combo") first = pageCombo(arg);
    else if (name === "gioca") first = pagePlay(arg);
    if (first === "self") return;
    if (keepFocusInRail) return;
    if ((railFocused && sec !== lastSection && !arg) ) {
      var items = navEl.querySelectorAll(".nav-item");
      for (var i = 0; i < items.length; i++) if (items[i].classList.contains("active")) focus(items[i]);
    } else if (first && first.classList) focus(first);
    else {
      var c = main.querySelectorAll(".f");
      focus(c[0] || navEl.querySelector(".nav-item"));
    }
    lastSection = sec;
  }

  document.addEventListener("keydown", function (e) {
    var k = e.keyCode;
    if (k === 37) move("left");
    else if (k === 39) move("right");
    else if (k === 38) move("up");
    else if (k === 40) move("down");
    else if (k === 13 || k === 32) { if (current) current.click(); }
    else if (k === 27 || k === 8 || k === 10009 || k === 461) {
      if ((location.hash || "#home") !== "#home") history.back();
      else return;
    }
    else return;
    e.preventDefault();
  });

  window.addEventListener("hashchange", function () { route(false); });
  window.addEventListener("resize", fit);
  document.documentElement.lang = LANG;
  fit();
  route(false);
})();
