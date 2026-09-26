document.querySelectorAll("img[data-a]").forEach(img => setImg(img, img.dataset.a));
function setImg(img, name) {
  img.classList.remove("img-missing");
  img.onload = () => img.classList.remove("img-missing");
  img.onerror = () => img.classList.add("img-missing");
  img.src = "assets/" + name;
}

const LESSONS = [
  {
    id: "blu", title: "Il significato del blu", img: "lezione-blu.png",
    body: [
      "Il blu è uno dei colori più apprezzati e utilizzati nel design. È associato al cielo e all'acqua e trasmette sensazioni di calma, fiducia e stabilità.",
      "Nella psicologia del colore viene spesso utilizzato da aziende tecnologiche e istituzioni perché comunica professionalità e affidabilità.",
      "Le tonalità più chiare evocano tranquillità e serenità, mentre quelle più scure trasmettono autorevolezza ed eleganza."
    ],
    fact: "Molti social network e aziende tecnologiche utilizzano il blu nel proprio logo per trasmettere fiducia e sicurezza agli utenti.",
    quiz: [
      { q: "Quali sensazioni trasmette principalmente il blu?", a: ["A) Calma e fiducia", "B) Rabbia e urgenza", "C) Fame ed energia"], ok: 0 },
      { q: "Perché molte aziende tecnologiche usano il blu?", a: ["A) Perché è economico da stampare", "B) Perché comunica affidabilità", "C) Perché attira l'attenzione sui saldi"], ok: 1 },
      { q: "Cosa trasmettono le tonalità scure del blu?", a: ["A) Allegria e gioco", "B) Pericolo", "C) Autorevolezza ed eleganza"], ok: 2 }
    ]
  },
  {
    id: "arancione", title: "Il significato dell’arancione", img: "lezione-arancione.png",
    body: [
      "L'arancione nasce dall'unione di rosso e giallo e ne eredita l'energia e la luminosità. È un colore caldo, vivace e socievole.",
      "Nella psicologia del colore è legato all'entusiasmo, alla creatività e all'ottimismo: invita all'azione senza l'aggressività del rosso.",
      "Nel design viene usato per pulsanti e inviti all'azione, perché cattura lo sguardo e comunica accessibilità e divertimento."
    ],
    fact: "L'arancione prende il nome dal frutto: prima che l'arancia arrivasse in Europa, questo colore veniva chiamato semplicemente “giallo-rosso”.",
    quiz: [
      { q: "Da quali colori nasce l'arancione?", a: ["A) Rosso e Giallo", "B) Blu e Giallo", "C) Rosso e Blu"], ok: 0 },
      { q: "Quale emozione è associata all'arancione?", a: ["A) Tristezza", "B) Entusiasmo", "C) Freddezza"], ok: 1 },
      { q: "Dove viene usato spesso l'arancione nel design?", a: ["A) Negli sfondi dei documenti legali", "B) Nei testi lunghi", "C) Nei pulsanti di invito all'azione"], ok: 2 }
    ]
  },
  {
    id: "viola", title: "Il significato del viola", img: "lezione-viola.png",
    body: [
      "Il viola unisce la stabilità del blu all'energia del rosso. È un colore raro in natura e per questo è stato a lungo considerato prezioso.",
      "Nella psicologia del colore è associato alla creatività, alla spiritualità e al mistero, ma anche al lusso e alla regalità.",
      "Le tonalità chiare come il lilla risultano delicate e romantiche, mentre quelle profonde comunicano ricchezza e ambizione."
    ],
    fact: "Nell'antica Roma la porpora era così costosa da produrre che solo l'imperatore poteva indossare una toga interamente viola.",
    quiz: [
      { q: "Da quali colori nasce il viola?", a: ["A) Giallo e Blu", "B) Rosso e Blu", "C) Verde e Rosso"], ok: 1 },
      { q: "A cosa è storicamente associato il viola?", a: ["A) Alla regalità e al lusso", "B) Al lavoro nei campi", "C) Alla segnaletica stradale"], ok: 0 },
      { q: "Cosa comunicano le tonalità chiare come il lilla?", a: ["A) Pericolo", "B) Aggressività", "C) Delicatezza e romanticismo"], ok: 2 }
    ]
  },
  {
    id: "rosso", title: "Il significato del rosso", grad: "linear-gradient(135deg,#ff6b6b,#b0001e)",
    body: [
      "Il rosso è il colore con la lunghezza d'onda più lunga tra quelli visibili ed è il primo che l'occhio nota. È legato al fuoco, al sangue e alla passione.",
      "Nella psicologia del colore trasmette energia, urgenza e desiderio: aumenta l'attenzione e può perfino far percepire il tempo come più veloce.",
      "Nel design si usa con misura, per avvisi, saldi e pulsanti importanti, perché se abusato può risultare aggressivo."
    ],
    fact: "Molte catene di fast food usano il rosso nel logo perché stimola l'appetito e invita a decidere in fretta.",
    quiz: [
      { q: "Qual è una sensazione tipica del rosso?", a: ["A) Energia e urgenza", "B) Calma e riposo", "C) Freddezza"], ok: 0 },
      { q: "Perché il rosso va usato con misura nel design?", a: ["A) Perché è poco visibile", "B) Perché può risultare aggressivo", "C) Perché non si stampa bene"], ok: 1 },
      { q: "Dove si usa spesso il rosso?", a: ["A) Negli sfondi dei testi lunghi", "B) Nelle app per dormire", "C) In avvisi, saldi e pulsanti importanti"], ok: 2 }
    ]
  },
  {
    id: "giallo", title: "Il significato del giallo", grad: "linear-gradient(135deg,#ffe86b,#f2b705)",
    body: [
      "Il giallo è il colore più luminoso dello spettro: richiama il sole, la luce e l'estate e cattura lo sguardo più di ogni altro.",
      "È associato all'ottimismo, alla creatività e alla curiosità, ma in grandi quantità può affaticare la vista e creare ansia.",
      "Abbinato al nero crea il contrasto più leggibile a distanza: per questo è usato nella segnaletica e negli avvisi di pericolo."
    ],
    fact: "I taxi di New York sono gialli perché il giallo è il colore che si nota più facilmente anche nel traffico.",
    quiz: [
      { q: "A cosa è associato il giallo?", a: ["A) Al lutto", "B) All'ottimismo e alla luce", "C) Al silenzio"], ok: 1 },
      { q: "Con quale colore il giallo è più leggibile a distanza?", a: ["A) Con il nero", "B) Con il bianco", "C) Con l'arancione"], ok: 0 },
      { q: "Cosa può provocare troppo giallo?", a: ["A) Sonno", "B) Fame", "C) Affaticamento e ansia"], ok: 2 }
    ]
  },
  {
    id: "verde", title: "Il significato del verde", grad: "linear-gradient(135deg,#8be36a,#1c7c3c)",
    body: [
      "Il verde è il colore della natura, della crescita e del rinnovamento. L'occhio umano distingue più sfumature di verde che di qualsiasi altro colore.",
      "Trasmette equilibrio, salute e tranquillità: è un colore riposante che aiuta la concentrazione.",
      "Nel design indica spesso qualcosa di positivo o permesso, come un'operazione riuscita o un semaforo che dà il via libera."
    ],
    fact: "Le luci di emergenza delle uscite di sicurezza sono verdi perché il verde è associato alla sicurezza e al “via libera”.",
    quiz: [
      { q: "Quale concetto esprime il verde?", a: ["A) Pericolo", "B) Lusso", "C) Natura e crescita"], ok: 2 },
      { q: "Cosa indica il verde nelle interfacce?", a: ["A) Un'operazione riuscita", "B) Un errore grave", "C) Un contenuto vietato"], ok: 0 },
      { q: "Che effetto ha il verde sulla mente?", a: ["A) Agitazione", "B) Equilibrio e riposo", "C) Fame"], ok: 1 }
    ]
  },
  {
    id: "bianco", title: "Il significato del bianco", grad: "linear-gradient(135deg,#ffffff,#d9d9d9)",
    body: [
      "Il bianco contiene tutti i colori della luce. Nella cultura occidentale rappresenta purezza, pulizia e nuovi inizi.",
      "Nel design è fondamentale come spazio vuoto: dà respiro ai contenuti e comunica ordine, semplicità ed eleganza.",
      "Il suo significato cambia con la cultura: in molti paesi asiatici il bianco è il colore del lutto."
    ],
    fact: "Molti marchi di tecnologia usano grandi spazi bianchi nei negozi e nelle confezioni per comunicare semplicità e qualità.",
    quiz: [
      { q: "Cosa contiene la luce bianca?", a: ["A) Nessun colore", "B) Tutti i colori", "C) Solo il blu"], ok: 1 },
      { q: "A cosa serve il bianco nel design?", a: ["A) A dare respiro ai contenuti", "B) A nascondere il testo", "C) Ad aumentare il caos"], ok: 0 },
      { q: "In molti paesi asiatici il bianco rappresenta…", a: ["A) La festa", "B) La ricchezza", "C) Il lutto"], ok: 2 }
    ]
  },
  {
    id: "nero", title: "Il significato del nero", grad: "linear-gradient(135deg,#4a4a55,#0b0b0f)",
    body: [
      "Il nero è l'assenza di luce. Trasmette forza, eleganza e mistero, ma anche serietà e, in alcune culture, lutto.",
      "Nella moda e nel lusso è il colore della raffinatezza: fa sembrare gli oggetti più preziosi e senza tempo.",
      "Nel design dà contrasto e peso: un testo nero su fondo chiaro è la combinazione più leggibile in assoluto."
    ],
    fact: "Coco Chanel rese celebre il “piccolo abito nero”, trasformando un colore del lutto in un simbolo di eleganza.",
    quiz: [
      { q: "Il nero è…", a: ["A) L'assenza di luce", "B) La somma di tutti i colori della luce", "C) Un colore caldo"], ok: 0 },
      { q: "In quale settore il nero comunica raffinatezza?", a: ["A) Nei giochi per bambini", "B) Nella moda e nel lusso", "C) Nella segnaletica stradale"], ok: 1 },
      { q: "Qual è la combinazione più leggibile?", a: ["A) Giallo su bianco", "B) Blu su viola", "C) Testo nero su fondo chiaro"], ok: 2 }
    ]
  }
];

const COMBOS = [
  { id: "Complementari", img: "complementari.png",
    intro: "I colori complementari sono posizionati uno di fronte all'altro nella ruota cromatica. Creano il massimo contrasto possibile e attirano immediatamente l'attenzione.",
    how: "La combinazione utilizza due colori opposti, come blu e arancione oppure rosso e verde.",
    when: "Ideale per evidenziare elementi importanti, creare energia visiva e ottenere composizioni dinamiche. Esempi: Blu + Arancione, Rosso + Verde, Viola + Giallo.",
    extra: ["Questa combinazione è molto utilizzata nel cinema, nella pubblicità e nel design per evidenziare elementi importanti. Alcuni esempi famosi sono il blu con l'arancione oppure il rosso con il verde.",
            "I colori complementari possono essere usati per creare immagini energiche e dinamiche, ma devono essere bilanciati per evitare un effetto troppo aggressivo."],
    quiz: [
      { q: "Dove si trovano i colori complementari sulla ruota cromatica?", a: ["A) Uno accanto all'altro", "B) Uno di fronte all'altro", "C) A 90° uno dall'altro"], ok: 1 },
      { q: "Quale di queste è una coppia complementare?", a: ["A) Blu e Arancione", "B) Blu e Azzurro", "C) Rosso e Arancione"], ok: 0 },
      { q: "A cosa bisogna fare attenzione usando i complementari?", a: ["A) Sono troppo spenti", "B) Non si notano", "C) Vanno bilanciati per non risultare aggressivi"], ok: 2 } ] },
  { id: "Analoghi", img: "analoghi.png",
    intro: "I colori analoghi sono colori vicini tra loro sulla ruota cromatica. Generano armonia e continuità visiva.",
    how: "Si scelgono generalmente tre colori adiacenti che condividono caratteristiche simili.",
    when: "Perfetta per creare ambienti rilassanti, design equilibrati e palette naturali. Esempi: Blu + Azzurro + Verde, Rosso + Arancione + Giallo.",
    extra: ["Questa combinazione è molto utilizzata per paesaggi, interfacce rilassanti e composizioni che devono trasmettere equilibrio.",
            "Poiché il contrasto è limitato, i colori analoghi aiutano a creare una sensazione di continuità e fluidità visiva."],
    quiz: [
      { q: "Come sono disposti i colori analoghi?", a: ["A) Vicini tra loro sulla ruota", "B) Opposti tra loro", "C) Ai vertici di un quadrato"], ok: 0 },
      { q: "Quale palette è analoga?", a: ["A) Rosso + Verde", "B) Blu + Azzurro + Verde", "C) Giallo + Viola"], ok: 1 },
      { q: "Che effetto trasmettono i colori analoghi?", a: ["A) Tensione e conflitto", "B) Massimo contrasto", "C) Armonia e continuità"], ok: 2 } ] },
  { id: "Triade", img: "triade.png",
    intro: "La combinazione triadica utilizza tre colori equidistanti sulla ruota cromatica.",
    how: "I colori formano un triangolo perfetto e mantengono un buon equilibrio tra contrasto e armonia.",
    when: "Ottima per progetti creativi, illustrazioni e interfacce vivaci ma bilanciate. Esempi: Rosso + Giallo + Blu.",
    extra: ["Questo schema crea palette vivaci e bilanciate, mantenendo un buon equilibrio tra contrasto e armonia.",
            "Molti loghi e illustrazioni utilizzano combinazioni triadiche per ottenere design accattivanti senza risultare disordinati."],
    quiz: [
      { q: "Quanti colori usa una triade?", a: ["A) Due", "B) Tre", "C) Quattro"], ok: 1 },
      { q: "Che forma disegnano i colori di una triade sulla ruota?", a: ["A) Un triangolo", "B) Un quadrato", "C) Una linea"], ok: 0 },
      { q: "Quale di queste è una triade?", a: ["A) Blu + Azzurro + Verde", "B) Rosso + Verde", "C) Rosso + Giallo + Blu"], ok: 2 } ] },
  { id: "Split complementari", img: "split-complementari.png",
    intro: "Questa combinazione parte da un colore principale e utilizza i due colori adiacenti al suo complementare.",
    how: "Offre un contrasto elevato ma meno aggressivo rispetto ai complementari diretti.",
    when: "Ideale per chi desidera creare tensione visiva mantenendo una maggiore armonia. Esempi: Blu con Giallo-Arancio e Rosso-Arancio.",
    extra: ["Questo sistema mantiene un forte contrasto ma risulta più equilibrato rispetto ai complementari diretti.",
            "È molto apprezzato nel design perché offre varietà cromatica senza creare tensioni visive eccessive."],
    quiz: [
      { q: "Da cosa parte uno schema split complementare?", a: ["A) Da un colore e dai due vicini al suo complementare", "B) Da quattro colori equidistanti", "C) Da tre colori adiacenti"], ok: 0 },
      { q: "Rispetto ai complementari diretti, il contrasto è…", a: ["A) Nullo", "B) Meno aggressivo", "C) Più aggressivo"], ok: 1 },
      { q: "Quale esempio è split complementare?", a: ["A) Rosso + Verde", "B) Blu + Azzurro", "C) Blu con Giallo-Arancio e Rosso-Arancio"], ok: 2 } ] },
  { id: "Rettangolo", img: "rettangolo.png",
    intro: "La combinazione rettangolare utilizza quattro colori organizzati in due coppie complementari.",
    how: "I colori formano un rettangolo sulla ruota cromatica, offrendo una palette ricca e versatile.",
    when: "Perfetta per progetti complessi che richiedono varietà cromatica mantenendo equilibrio. Esempi: Blu, Verde, Arancione e Rosso.",
    extra: ["Questo schema offre molta varietà cromatica e permette di creare composizioni ricche e dinamiche.",
            "Per ottenere un buon risultato è consigliabile scegliere un colore dominante e usare gli altri come supporto."],
    quiz: [
      { q: "Come sono organizzati i quattro colori del rettangolo?", a: ["A) In due coppie complementari", "B) Tutti adiacenti", "C) In un triangolo"], ok: 0 },
      { q: "Qual è un buon consiglio per usare questo schema?", a: ["A) Usare tutti i colori in parti uguali", "B) Scegliere un colore dominante", "C) Evitare i colori caldi"], ok: 1 },
      { q: "Per quali progetti è adatto il rettangolo?", a: ["A) Solo per il bianco e nero", "B) Per palette monocromatiche", "C) Per progetti complessi con molta varietà"], ok: 2 } ] },
  { id: "Quadrato", img: "quadrato.png",
    intro: "La combinazione quadrata utilizza quattro colori equidistanti tra loro sulla ruota cromatica.",
    how: "I colori formano un quadrato e distribuiscono uniformemente il contrasto.",
    when: "Ideale per creare design energici, moderni e molto colorati. Esempi: Rosso, Giallo, Verde e Blu.",
    extra: ["Produce palette molto vivaci e dinamiche grazie alla distribuzione uniforme dei colori.",
            "È uno schema ideale per progetti creativi, illustrazioni e design che vogliono trasmettere energia e movimento."],
    quiz: [
      { q: "Come sono disposti i colori del quadrato?", a: ["A) Equidistanti tra loro", "B) Tutti vicini", "C) Solo due opposti"], ok: 0 },
      { q: "Quanti colori usa lo schema quadrato?", a: ["A) Tre", "B) Quattro", "C) Sei"], ok: 1 },
      { q: "Che tipo di design produce?", a: ["A) Spento e neutro", "B) Monocromatico", "C) Energico e molto colorato"], ok: 2 } ] }
];
COMBOS.forEach(c => c.title = c.id);

function openCombo(id) {
  const c = COMBOS.find(x => x.id === id);
  const scr = document.getElementById("combo");
  const $ = s => scr.querySelector(s);
  $("[data-combo-name]").textContent = c.id;
  setImg($("[data-combo-img]"), c.img);
  $("[data-combo-intro]").textContent = c.intro;
  $("[data-combo-how]").textContent = c.how;
  $("[data-combo-when]").textContent = c.when;
  $("[data-combo-extra1]").textContent = c.extra[0];
  $("[data-combo-extra2]").textContent = c.extra[1];
  const p1 = $("[data-combo-p1]"), p2 = $("[data-combo-p2]"), btn = $("[data-combo-next]");
  p1.hidden = false; p2.hidden = true; btn.textContent = "avanti";
  btn.onclick = () => {
    if (p2.hidden) { p1.hidden = true; p2.hidden = false; btn.textContent = "Quiz"; scr.querySelector(".scroll").scrollTo(0, 0); }
    else openQuiz(c.id);
  };
  go("combo");
}

const DEF = { xp: 0, level: 1, xpTotal: 0, streak: 1, quizzes: 0, lessonsTotal: 0, done: [], onboarded: false,
  m: { lessons: 0, quiz: 0, days: 1, colors: 0 }, claimed: [], redeemed: [], lastDay: null, badges: [],
  owned: ["perla", "ardesia"], theme: null,
  name: "", time: 0, missionsDone: 0, myPalettes: [], dark: "auto" };
let S;
try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem("chroma") || "{}")); } catch { S = { ...DEF }; }
if (!Array.isArray(S.badges)) S.badges = [];
(S.claimed || []).forEach(id => { const b = { lessons: "Badge dello studente", quiz: "Badge dello studioso", days: "Badge sociale" }[id]; if (b && !S.badges.includes(b)) S.badges.push(b); });
const save = () => { try { localStorage.setItem("chroma", JSON.stringify(S)); } catch {} };

function render() {
  const lessonsDone = Math.min(3, S.m.lessons);
  const t = Math.floor(S.time / 60);
  const vals = { ...S, lessonsDone, xpTotal: S.xpTotal.toLocaleString("it-IT"),
    greet: S.name || "Benvenuto", name: S.name || "Ospite", levelTitle: shownTitle(), levelNext: levelTitle(S.level + 1), xpLeft: 1000 - S.xp, titlesN: S.level,
    timeStr: t >= 60 ? `${Math.floor(t / 60)} h ${t % 60} min` : `${t} min`,
    quests: S.quizzes + S.lessonsTotal, ownedN: S.owned.length, totalColors: COLORS.length };
  document.querySelectorAll("[data-bind]").forEach(el => el.textContent = vals[el.dataset.bind]);
  document.querySelectorAll("[data-bind-width=xp]").forEach(el => el.style.width = (S.xp / 10) + "%");
  document.querySelectorAll("[data-bind-width=mission]").forEach(el => el.style.width = (lessonsDone / 3 * 100) + "%");
  document.querySelectorAll(".lesson").forEach(el => el.classList.toggle("done", S.done.includes(el.dataset.id)));
  renderMissions(); renderBadges(); renderColors();
}

const LEVEL_TITLES = ["Apprendista", "Curioso del colore", "Esploratore del colore", "Osservatore di sfumature",
  "Pittore alle prime armi", "Mescolatore di tinte", "Cacciatore di contrasti", "Pittore sfumato", "Alchimista dei pigmenti",
  "Maestro del colore", "Custode della ruota cromatica", "Architetto delle armonie", "Poeta della luce", "Virtuoso della palette",
  "Visionario cromatico", "Signore delle tonalità", "Guru del colore", "Mago dello spettro", "Oracolo dei colori", "Leggenda cromatica"];
const ROMAN = n => [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]].reduce((r, [v, s]) => { while (n >= v) { r += s; n -= v; } return r; }, "");
function levelTitle(l) { return l <= 20 ? LEVEL_TITLES[Math.max(1, l) - 1] : "Leggenda cromatica " + ROMAN(l - 19); }
function addXP(n) {
  S.xp += n; S.xpTotal += n;
  while (S.xp >= 1000) { S.xp -= 1000; S.level++; onLevelUp(); }
  save(); render();
}

document.querySelectorAll("[data-lessons]").forEach(list => {
  const toQuiz = list.dataset.lessons === "quiz";
  LESSONS.forEach(l => {
    const b = document.createElement("button");
    b.className = "lesson"; b.dataset.id = l.id;
    b.innerHTML = `${l.img ? '<img class="thumb" alt="">' : `<i class="thumb grad" style="background:${l.grad}"></i>`}<div class="info"><div class="t">${l.title}</div>
      <div class="s">Psicologia del colore</div><div class="m"><img class="clock" alt="">5 min</div></div><img class="go" alt="">`;
    if (l.img) setImg(b.querySelector("img.thumb"), l.img);
    setImg(b.querySelector(".clock"), "time-forward.png"); setImg(b.querySelector(".go"), "right-arrow.png");
    b.onclick = () => toQuiz ? openQuiz(l.id) : openLesson(l.id);
    list.appendChild(b);
  });
});

const navStack = [];
let current = null;
function go(id, push = true) {
  if (id === current) return;
  if (push && current) navStack.push(current);
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  const scr = document.getElementById(id);
  scr.querySelector(".scroll")?.scrollTo(0, 0);
  const tab = scr.dataset.tab;
  document.getElementById("tabbar").classList.toggle("show", !!tab);
  document.querySelectorAll("[data-tab-go]").forEach(b => b.classList.toggle("on", b.dataset.tabGo === tab));
  current = id;
}
function back() {
  if (current === "combo") {
    const p2 = document.querySelector("[data-combo-p2]");
    if (!p2.hidden) { p2.hidden = true; document.querySelector("[data-combo-p1]").hidden = false;
      document.querySelector("[data-combo-next]").textContent = "avanti"; return; }
  }
  go(navStack.pop() || "home", false);
}

document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.go) { if (t.hasAttribute("data-onboarded")) { S.onboarded = true; save(); } go(t.dataset.go); }
  else if (t.dataset.tabGo) { navStack.length = 0; go(t.dataset.tabGo); }
  else if (t.hasAttribute("data-back")) back();
  else if (t.dataset.toast) toast(t.dataset.toast);
  else if (t.dataset.combo) openCombo(t.dataset.combo);
  else if (t.dataset.filter) filterBadges(t);
});

let toastT;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg; el.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2000);
}

function openLesson(id) {
  const i = LESSONS.findIndex(l => l.id === id), l = LESSONS[i];
  const scr = document.getElementById("lezione");
  const dimg = scr.querySelector("[data-lesson-img]");
  scr.querySelector(".detail-img").style.background = l.grad || "";
  if (l.img) { dimg.hidden = false; setImg(dimg, l.img); } else dimg.hidden = true;
  scr.querySelector("[data-lesson-title]").textContent = l.title;
  scr.querySelector("[data-lesson-body]").innerHTML = l.body.map(p => `<p>${p}</p>`).join("");
  scr.querySelector("[data-lesson-fact]").textContent = l.fact;
  scr.querySelector("[data-lesson-next]").onclick = () => {
    const first = !S.done.includes(id);
    if (first) { S.done.push(id); S.lessonsTotal++; S.m.lessons++; addXP(50); }
    const lf = document.getElementById("lezfine");
    lf.querySelector("h2").textContent = first ? "Lezione completata!" : "Lezione ripassata!";
    lf.querySelector("p").textContent = first ? "Hai guadagnato" : "Gli XP di questa lezione li hai già ottenuti";
    lf.querySelector("b").textContent = first ? "+ 50 XP" : "";
    go("lezfine");
  };
  scr.querySelector("[data-lesson-quiz]").onclick = () => openQuiz(id);
  if (current === "lezione") { scr.querySelector(".scroll").scrollTo(0, 0); } else go("lezione");
}

function openQuiz(id) {
  const l = LESSONS.find(x => x.id === id) || COMBOS.find(x => x.id === id);
  const scr = document.getElementById("quiz");
  const $ = s => scr.querySelector(s);
  let n = 0, score = 0;
  $("[data-quiz-title]").textContent = l.title;

  function show() {
    const item = l.quiz[n];
    $(".quiz-h").textContent = "Quiz";
    $("[data-quiz-n]").textContent = `${n + 1} / ${l.quiz.length}`;
    $("[data-quiz-q]").textContent = item.q;
    $("[data-quiz-feedback]").textContent = "";
    $("[data-quiz-next]").hidden = true;
    const box = $("[data-quiz-answers]");
    box.innerHTML = "";
    item.a.forEach((txt, k) => {
      const b = document.createElement("button");
      b.className = "answer";
      b.innerHTML = `<span class="dot"></span>${txt}`;
      b.onclick = () => {
        if (box.dataset.locked) return;
        box.dataset.locked = 1;
        const right = k === item.ok;
        if (right) score++;
        b.classList.add(right ? "right" : "wrong");
        box.children[item.ok].classList.add("right");
        $("[data-quiz-feedback]").textContent = right ? "Esatto! 🎉" : "Non proprio… la risposta giusta è evidenziata.";
        $("[data-quiz-next]").hidden = false;
      };
      box.appendChild(b);
    });
    delete box.dataset.locked;
  }
  $("[data-quiz-next]").onclick = () => { n++; n < l.quiz.length ? show() : finish(); };

  function finish() {
    S.quizzes++; S.m.quiz++;
    showEvent(l, score);
  }

  $("[data-quiz-next]").textContent = "avanti";
  show();
  go("quiz");
}

const EV = {
  rosso: "rosso", arancione: "arancione", giallo: "giallo", verde: "verde", blu: "blu", viola: "viola", bianco: "bianco", nero: "nero",
  "Complementari": "turchese", "Analoghi": "lime", "Triade": "magenta",
  "Split complementari": "corallo", "Rettangolo": "oliva", "Quadrato": "petrolio"
};
function showEvent(l, score) {
  const tot = l.quiz.length, perfect = score === tot;
  const colr = COLOR_BY[EV[l.id]] || COLOR_BY.blu, name = colr.n, col = colr.h;
  const xp = perfect ? 100 : score * 30;
  addXP(xp);
  const scr = document.getElementById("evento"), $ = q => scr.querySelector(q);
  scr.style.setProperty("--ev", col);
  scr.style.setProperty("--ev-on", onColor(col));
  const lightEv = lum(col) > .42;
  scr.classList.toggle("light-ev", lightEv);
  scr.style.setProperty("--ev-link", lightEv ? mix(col, "#000000", .55) : col);
  $("[data-ev-name]").textContent = name;
  $("[data-ev-score]").textContent = `${score} / ${tot}`;
  $("[data-ev-acc]").textContent = Math.round(score / tot * 100) + " %";
  $("[data-ev-xp]").textContent = "+ " + xp + " XP";
  $("[data-ev-bname]").textContent = name;
  $("[data-ev-name]").textContent = l.title;
  $("[data-ev-badge]").hidden = !perfect;
  $("[data-ev-retry]").hidden = perfect;
  const r = $("[data-ev-redeem]"), ap = $("[data-ev-apply]"), got = S.redeemed.includes(l.id);
  r.disabled = got; r.textContent = got ? "Già riscattato" : "Riscatta";
  ap.hidden = !got;
  ap.textContent = S.theme === colr.id ? "Tema attivo ✓" : "Usa come tema";
  ap.onclick = () => { applyTheme(colr.id); ap.textContent = "Tema attivo ✓"; toast("Tema “" + name + "” applicato"); };
  r.onclick = () => {
    if (S.redeemed.includes(l.id)) return;
    S.redeemed.push(l.id);
    unlockColor(colr.id);
    r.disabled = true; r.textContent = "Riscattato ✓"; ap.hidden = false;
    toast("Nuovo colore sbloccato: " + name);
  };
  scr.querySelectorAll("[data-ev-back]").forEach(b => b.onclick = () => { navStack.pop(); back(); });
  go("evento");
}

const COLORS = [
  { id: "perla", n: "Grigio perla", h: "#aab0b8", src: "base" },
  { id: "ardesia", n: "Grigio ardesia", h: "#4f5763", src: "base" },
  { id: "rosso", n: "Rosso", h: "#e3242b", src: "quiz", hint: "Quiz sul rosso" },
  { id: "arancione", n: "Arancione", h: "#ff7a00", src: "quiz", hint: "Quiz sull'arancione" },
  { id: "giallo", n: "Giallo", h: "#ffd000", src: "quiz", hint: "Quiz sul giallo" },
  { id: "verde", n: "Verde", h: "#2fa84f", src: "quiz", hint: "Quiz sul verde" },
  { id: "blu", n: "Blu", h: "#1f5fe0", src: "quiz", hint: "Quiz sul blu" },
  { id: "viola", n: "Viola", h: "#8a2be2", src: "quiz", hint: "Quiz sul viola" },
  { id: "bianco", n: "Bianco", h: "#f6f4ee", src: "quiz", hint: "Quiz sul bianco" },
  { id: "nero", n: "Nero", h: "#18181d", src: "quiz", hint: "Quiz sul nero" },
  { id: "turchese", n: "Turchese", h: "#12c4c0", src: "quiz", hint: "Quiz Complementari" },
  { id: "lime", n: "Lime", h: "#a6d62b", src: "quiz", hint: "Quiz Analoghi" },
  { id: "magenta", n: "Magenta", h: "#d6208f", src: "quiz", hint: "Quiz Triade" },
  { id: "corallo", n: "Corallo", h: "#ff8a7a", src: "quiz", hint: "Quiz Split compl." },
  { id: "oliva", n: "Oliva", h: "#76782a", src: "quiz", hint: "Quiz Rettangolo" },
  { id: "petrolio", n: "Petrolio", h: "#15707a", src: "quiz", hint: "Quiz Quadrato" },
  { id: "carminio", n: "Carminio", h: "#8e1630", src: "reward", hint: "Reward missioni" },
  { id: "rosa", n: "Rosa", h: "#f5a9c6", src: "reward", hint: "Reward missioni" },
  { id: "terracotta", n: "Terracotta", h: "#b0623a", src: "reward", hint: "Reward missioni" },
  { id: "oro", n: "Oro", h: "#b8900f", src: "reward", hint: "Reward missioni" },
  { id: "bosco", n: "Verde bosco", h: "#1d5530", src: "reward", hint: "Reward missioni" },
  { id: "salvia", n: "Salvia", h: "#9ab596", src: "reward", hint: "Reward missioni" },
  { id: "menta", n: "Menta", h: "#a6f0d2", src: "reward", hint: "Reward missioni" },
  { id: "azzurro", n: "Azzurro", h: "#62b8f2", src: "reward", hint: "Reward missioni" },
  { id: "notte", n: "Blu notte", h: "#172a5a", src: "reward", hint: "Reward missioni" },
  { id: "lavanda", n: "Lavanda", h: "#b8a4ec", src: "reward", hint: "Reward missioni" },
  { id: "prugna", n: "Prugna", h: "#6a2a5b", src: "reward", hint: "Reward missioni" },
  { id: "marrone", n: "Marrone", h: "#5c3a22", src: "reward", hint: "Reward missioni" }
];
const OLD_COLORS = { arancio: "arancione", ottanio: "petrolio", cobalto: "blu", ametista: "viola", scarlatto: "rosso",
  limone: "giallo", giada: "verde", avorio: "bianco", ossidiana: "nero", ambra: "oro", indaco: "notte", fucsia: "magenta", smeraldo: "bosco" };

function hueKey(hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (sat < .18 || l < .1 || l > .93) return 1000 + (1 - l) * 100;
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  if (h > 345) h -= 360;
  return h + (1 - l) * 8;
}
const byHue = ids => [...ids].sort((a, b) => hueKey(COLOR_BY[a].h) - hueKey(COLOR_BY[b].h));

function levelColor(l) {
  if (l > 20) return "conic-gradient(#e3242b, #ff7a00, #ffd000, #2fa84f, #12c4c0, #1f5fe0, #8a2be2, #e3242b)";
  const h = (l - 1) * (285 / 19), s = 78, li = h > 40 && h < 190 ? 42 : 52;
  return `hsl(${h.toFixed(0)} ${s}% ${li}%)`;
}
const COLOR_BY = Object.fromEntries(COLORS.map(c => [c.id, c]));

const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = a => "#" + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => rgb2hex(hex2rgb(a).map((v, i) => v + (hex2rgb(b)[i] - v) * t));
const lum = h => { const [r, g, b] = hex2rgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
const onColor = h => lum(h) > .42 ? "#111" : "#fff";

const isDark = () => document.documentElement.dataset.dark === "dark";
function applyTheme(id) {
  S.theme = id && COLOR_BY[id] ? id : null; save();
  const root = document.documentElement.style;
  const props = ["--purple-btn", "--sky-dark", "--sky-light", "--mission", "--blue-card", "--bg", "--on-accent", "--on-dark", "--on-light", "--on-blue", "--theme-dot"];
  if (!S.theme) { props.forEach(p => root.removeProperty(p)); renderColors(); return; }
  const h = COLOR_BY[S.theme].h;
  const dark = lum(h) > .42 ? mix(h, "#000000", .25) : h;
  const light = mix(h, "#ffffff", .55);
  const set = {
    "--purple-btn": dark, "--sky-dark": dark, "--sky-light": light, "--mission": dark,
    "--blue-card": mix(h, "#000000", .08), "--bg": mix(h, isDark() ? "#141417" : "#f2f2f2", isDark() ? .88 : .9),
    "--on-accent": onColor(dark), "--on-dark": onColor(dark), "--on-light": onColor(light),
    "--on-blue": onColor(mix(h, "#000000", .08)), "--theme-dot": dark
  };
  Object.entries(set).forEach(([k, v]) => root.setProperty(k, v));
  renderColors();
}
function unlockColor(id) {
  if (!S.owned.includes(id)) S.owned.push(id);
  save(); render();
}
function renderColors() {

  const hs = document.querySelector("[data-home-swatches]");
  if (hs) {
    hs.innerHTML = "";
    let show = byHue(S.owned).slice(0, 8);
    if (S.theme && S.owned.includes(S.theme) && !show.includes(S.theme)) show = byHue([...show.slice(0, 7), S.theme]);
    show.forEach(id => {
      const c = COLOR_BY[id], b = document.createElement("button");
      b.style.background = c.h; b.title = c.n; b.setAttribute("aria-label", "Tema " + c.n);
      if (S.theme === id) b.className = "cur";
      b.onclick = () => { applyTheme(S.theme === id ? null : id); toast(S.theme ? "Tema “" + c.n + "” applicato" : "Tema originale"); };
      hs.appendChild(b);
    });
  }
  const own = document.querySelector("[data-owned]");
  if (!own) return;
  own.innerHTML = ""; document.querySelector("[data-locked]").innerHTML = "";
  byHue(COLORS.map(c => c.id)).map(id => COLOR_BY[id]).forEach(c => {
    const has = S.owned.includes(c.id);
    const el = document.createElement(has ? "button" : "div");
    el.className = "sw" + (has ? "" : " locked") + (S.theme === c.id ? " cur" : "");
    el.innerHTML = `<i style="background:${c.h}"></i><span>${c.n}</span>${has ? "" : `<small>${c.hint}</small>`}`;
    if (has) el.onclick = () => { applyTheme(S.theme === c.id ? null : c.id); };
    document.querySelector(has ? "[data-owned]" : "[data-locked]").appendChild(el);
  });
  document.querySelector("[data-owned-n]").textContent = `${S.owned.length} / ${COLORS.length}`;
  document.querySelector("[data-theme-name]").textContent = S.theme ? COLOR_BY[S.theme].n : "Tema originale";
  document.querySelector("[data-theme-reset]").hidden = !S.theme;
}
document.querySelector("[data-theme-reset]").onclick = () => { applyTheme(null); toast("Tema originale ripristinato"); };

(() => {
  const list = document.querySelector("[data-combo-quiz]");
  const imgs = { "Complementari": "complementari.png", "Analoghi": "analoghi.png", "Triade": "triade.png",
    "Split complementari": "split-complementari.png", "Rettangolo": "rettangolo.png", "Quadrato": "quadrato.png" };
  COMBOS.forEach(c => {
    const b = document.createElement("button");
    b.className = "lesson"; b.dataset.id = c.id;
    b.innerHTML = `<img class="thumb wheel" alt=""><div class="info"><div class="t">${c.id}</div>
      <div class="s">Combinazioni di colori</div><div class="m"><img alt="">3 min</div></div><img class="go" alt="">`;
    const [thumb, clock, go_] = b.querySelectorAll("img");
    setImg(thumb, imgs[c.id]); setImg(clock, "time-forward.png"); setImg(go_, "right-arrow.png");
    b.onclick = () => openQuiz(c.id);
    list.appendChild(b);
  });
})();

const MISSIONS = [
  { id: "lessons", title: "Completa 3 lezioni", target: 3, xp: 100, badge: "Badge dello studente", go: "lezioni", cta: "Vai alle lezioni",
    desc: "Completa 3 lezioni di qualsiasi argomento per ottenere nuovi badge e XP per poter sbloccare nuovi colori." },
  { id: "quiz", title: "Rispondi a 5 quiz", target: 5, xp: 50, badge: "Badge dello studioso", go: "quizhub", cta: "Vai ai quiz",
    desc: "Completa 5 quiz sui colori o sulle combinazioni per mettere alla prova quello che hai imparato e guadagnare XP." },
  { id: "days", title: "Accedi 5 giorni di fila", target: 5, xp: 150, badge: "Badge sociale", go: "home", cta: "Torna domani!",
    desc: "Apri CHROMA per 5 giorni consecutivi: ogni giorno di fila fa crescere la tua streak e ti avvicina al badge." },
  { id: "colors", title: "Colleziona 10 colori", target: 10, xp: 200, badge: null, go: "quizhub", cta: "Sblocca colori",
    desc: "Ottieni un punteggio perfetto nei quiz e riscatta i colori: arrivato a 10 colori collezionati ricevi la ricompensa." }
];
const prog = m => Math.min(m.target, m.id === "colors" ? S.owned.length : (S.m[m.id] || 0));

function renderMissions() {
  const list = document.querySelector("[data-missions]"), rw = document.querySelector("[data-rewards]");
  if (!list) return;
  list.innerHTML = ""; rw.innerHTML = "";
  MISSIONS.forEach(m => {
    const p = prog(m), claimed = S.claimed.includes(m.id), ready = p >= m.target && !claimed;
    const item = () => {
      const b = document.createElement("button");
      b.className = "m-item" + (ready ? " ready" : "") + (claimed ? " claimed" : "");
      b.innerHTML = `<div class="top"><span>${m.title}</span><b>+ ${m.xp} XP</b></div>
        <div class="mbar"><i style="width:${p / m.target * 100}%"></i></div>
        ${ready ? '<div class="tag">Completata! Tocca per riscattare</div>' : claimed ? '<div class="tag">Riscattata ✓</div>' : ""}`;
      b.onclick = () => openMission(m.id);
      return b;
    };
    list.appendChild(item());
    if (m.badge) {
      const wrap = document.createElement("div");
      wrap.appendChild(item());
      const bd = document.createElement("div");
      bd.className = "rw-badge";
      const hasB = S.badges.includes(m.badge);
      const bdef = BADGES.find(x => x.n === m.badge);
      bd.innerHTML = `<div class="rw-tile${hasB ? " got" : ""}">${hasB ? badgeArt(bdef.icon, bdef.c) : '<img alt="">'}</div><span>${m.badge}<small>${hasB ? "Ottenuto" : `${p} / ${m.target}`}</small></span>`;
      if (!hasB) setImg(bd.querySelector("img"), "badge-bloccato.svg");
      wrap.appendChild(bd);
      rw.appendChild(wrap);
    }
  });
}
function openMission(id) {
  const m = MISSIONS.find(x => x.id === id), scr = document.getElementById("missione"), $ = q => scr.querySelector(q);
  const p = prog(m), claimed = S.claimed.includes(id), ready = p >= m.target && !claimed;
  $("[data-md-title]").textContent = m.title;
  $("[data-md-desc]").textContent = m.desc;
  $("[data-md-n]").textContent = `${p} / ${m.target}`;
  $("[data-md-bar]").style.width = (p / m.target * 100) + "%";
  $("[data-md-xp]").textContent = `+ ${m.xp} XP`;
  const btn = $("[data-md-btn]");
  btn.disabled = claimed || (m.id === "days" && !ready);
  btn.textContent = claimed ? "Già riscattata" : ready ? "Riscatta reward" : m.cta;
  btn.onclick = () => {
    if (ready) {
      S.claimed.push(id); S.missionsDone++;
      if (m.badge && !S.badges.includes(m.badge)) S.badges.push(m.badge);
      const pool = COLORS.filter(c => c.src === "reward" && !S.owned.includes(c.id));
      const won = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
      if (won) unlockColor(won.id);
      const rc = document.querySelector("[data-ro-color]");
      rc.textContent = won ? "+ " + won.n : "+ colore casuale";
      rc.style.setProperty("--won", won ? won.h : "transparent");
      addXP(m.xp);
      document.querySelector("[data-ro-xp]").textContent = `+ ${m.xp} XP`;
      document.querySelector("[data-ro-badge]").textContent = m.badge ? `+ ${m.badge}` : "";
      go("rewardok");
    } else go(m.go);
  };
  go("missione");
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-mtab]");
  if (!t) return;
  document.querySelectorAll("[data-mtab]").forEach(b => b.classList.toggle("on", b === t));
  document.querySelectorAll("[data-mpane]").forEach(p => p.hidden = p.dataset.mpane !== t.dataset.mtab);
});

const BADGES = [
  { n: "Color Explorer", d: "Sblocca 10 colori", icon: "palette", c: "#2e9fc0", got: () => S.owned.length >= 10 },
  { n: "Badge dello studente", d: "Completa 3 lezioni", icon: "book", c: "#e07a2c", got: () => S.badges.includes("Badge dello studente") },
  { n: "Badge dello studioso", d: "Rispondi a 5 quiz", icon: "check", c: "#6b3fb8", got: () => S.badges.includes("Badge dello studioso") },
  { n: "Badge sociale", d: "Accedi 5 giorni di fila", icon: "flame", c: "#d0112b", got: () => S.badges.includes("Badge sociale") },
  { n: "Maestro del colore", d: "Raggiungi il livello 10", icon: "crown", c: "#c9960f", got: () => S.level >= 10 },
  { n: "Collezionista", d: "Sblocca tutti i colori", icon: "gem", c: "#1f9d55", got: () => S.owned.length >= COLORS.length }
];
function renderBadges() {
  const grid = document.querySelector("[data-badge-grid]");
  if (!grid) return;
  const f = document.querySelector("[data-filter].on")?.dataset.filter || "all";
  grid.innerHTML = "";
  BADGES.forEach((b, k) => {
    const got = b.got(), el = document.createElement("div");
    el.className = "badge " + (got ? "got" : "locked " + (k % 2 ? "brownish" : "violet"));
    el.innerHTML = got ? `<div class="badge-art">${badgeArt(b.icon, b.c)}</div><b>${b.n}</b><span>${b.d}</span>`
                       : `<img alt="Badge bloccato"><b>${b.n}</b><span>${b.d}</span>`;
    if (!got) setImg(el.querySelector("img"), "badge-bloccato.svg");
    if (f !== "all" && !el.classList.contains(f)) el.classList.add("hide");
    grid.appendChild(el);
  });
}

function badgeArt(icon, c) {
  const pts = Array.from({ length: 32 }, (_, i) => { const r = i % 2 ? 40 : 46, a = Math.PI * i / 16;
    return `${(60 + r * Math.sin(a)).toFixed(1)},${(56 - r * Math.cos(a)).toFixed(1)}`; }).join(" ");
  const I = {
    palette: '<circle cx="60" cy="56" r="17" fill="#fff"/><circle cx="52" cy="50" r="4" fill="#e11d1d"/><circle cx="62" cy="46" r="4" fill="#ffbf00"/><circle cx="69" cy="54" r="4" fill="#1434e0"/><circle cx="55" cy="62" r="4.5" fill="' + c + '"/>',
    book: '<path d="M42 44h14c3 0 4 2 4 4v24c0-2-1.5-3-4-3H42z M78 44H64c-3 0-4 2-4 4v24c0-2 1.5-3 4-3h14z" fill="#fff"/>',
    check: '<path d="M44 57l10 10 22-22" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>',
    flame: '<path d="M60 36c4 9 14 14 14 26a14 14 0 0 1-28 0c0-6 3-10 6-13 0 5 3 8 6 8-3-7-1-15 2-21z" fill="#fff"/>',
    crown: '<path d="M42 66l-3-22 12 10 9-14 9 14 12-10-3 22z" fill="#fff"/><rect x="42" y="68" width="36" height="5" rx="2" fill="#fff"/>',
    gem: '<path d="M48 44h24l8 10-20 22-20-22z" fill="#fff"/><path d="M40 54h40M52 44l-4 10 12 22 12-22-4-10" fill="none" stroke="' + c + '" stroke-width="2"/>'
  };
  return `<svg viewBox="0 0 120 120" aria-hidden="true">
    <path d="M40 86l-10 28 14-6 8 12 10-30z" fill="${mixHex(c, "#000000", .25)}"/><path d="M80 86l10 28-14-6-8 12-10-30z" fill="${mixHex(c, "#000000", .25)}"/>
    <polygon points="${pts}" fill="${c}"/><circle cx="60" cy="56" r="32" fill="${mixHex(c, "#ffffff", .25)}"/>
    <circle cx="60" cy="56" r="32" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>${I[icon] || ""}</svg>`;
}
function mixHex(a, b, t) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const x = p(a), y = p(b); return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join(""); }

const PALETTES = [
  { n: "Colori caldi", c: ["#d62828", "#ef4a23", "#f77f00", "#fcbf49", "#ffd23f", "#e85d75"],
    t: "I colori caldi comprendono principalmente le tonalità di rosso, arancione e giallo. Sono associati al sole, al fuoco e all'energia, e trasmettono sensazioni di vitalità, entusiasmo e dinamismo.",
    e: ["Passione", "Rabbia", "Calore", "Negatività", "Energia"] },
  { n: "Colori freddi", c: ["#1d3557", "#2a6fdb", "#48cae4", "#2a9d8f", "#52b788", "#7b2cbf"],
    t: "I colori freddi comprendono principalmente le tonalità di blu, verde e viola. Sono associati a elementi naturali come l'acqua, il cielo e la vegetazione, e trasmettono sensazioni di calma, equilibrio e serenità.",
    e: ["Calma", "Stabilità", "Fiducia", "Serenità", "Relax"] },
  { n: "Mezzitoni", c: ["#a3968b", "#8d9f87", "#9b8aa6", "#b5a48a", "#7f9aa8", "#c09a92"],
    t: "I mezzitoni sono colori ottenuti dalla combinazione equilibrata tra tonalità calde e fredde, oppure dall'aggiunta di grigio a un colore puro. Risultano generalmente meno intensi e più morbidi rispetto ai colori saturi, creando un effetto visivo armonioso ed equilibrato.",
    e: ["Equilibrio", "Stabilità", "Armonia", "Relax"] }
];
const PAL_FACT = "Nel film “The Grand Budapest Hotel” viene usata la psicologia dei colori, con l’interpolazione dei colori caldi e dei colori freddi.";
const dots = c => c.map(x => `<i style="background:${x}"></i>`).join("");
(() => {
  const list = document.querySelector("[data-palettes]");
  PALETTES.forEach((p, k) => {
    const b = document.createElement("button");
    b.className = "pal-item";
    b.innerHTML = `<div class="n">${p.n}</div><div class="pal-dots">${dots(p.c)}</div><span class="more">⋮</span>`;
    b.onclick = () => openPalette(k);
    list.appendChild(b);
  });
})();
function openPalette(k) {
  const p = PALETTES[k], scr = document.getElementById("palettedet"), $ = q => scr.querySelector(q);
  $("[data-pal-title]").textContent = p.n;
  $("[data-pal-dots]").innerHTML = dots(p.c);
  $("[data-pal-text]").textContent = p.t;
  $("[data-pal-emo]").innerHTML = p.e.map(x => `<span>${x}</span>`).join("");
  $("[data-pal-fact]").textContent = PAL_FACT;
  go("palettedet");
}

(() => {
  const today = new Date().toDateString();
  if (S.lastDay === today) return;
  const y = new Date(Date.now() - 864e5).toDateString();
  if (S.lastDay === y) { S.m.days++; S.streak++; }
  else if (S.lastDay) { S.m.days = 1; S.streak = 1; }
  if (S.lastDay) {
    S.m.lessons = 0; S.m.quiz = 0;
    S.claimed = S.claimed.filter(x => x !== "lessons" && x !== "quiz");
  }
  S.lastDay = today; save();
})();

function filterBadges(btn) {
  document.querySelectorAll("[data-filter]").forEach(b => b.classList.toggle("on", b === btn));
  renderBadges();
}

function fit() {
  document.documentElement.style.setProperty("--app-h", innerHeight + "px");
  document.documentElement.style.setProperty("--app-w", innerWidth + "px");
}
addEventListener("resize", fit);
addEventListener("orientationchange", () => setTimeout(fit, 250));
fit();
