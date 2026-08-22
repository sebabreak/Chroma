// ══════════════════════════════════════════════════════════════════
//  SOVRAINTERPRETAZIONE CROMATICA
//  Installazione interattiva: webcam → analisi colore → audio/visuale
//  → giudizio generato da un'AI che gira interamente nel browser
//  (WebLLM/WebGPU, sezione 10) basato sui colori visti. Nessun server:
//  funziona anche su un telefono, offline dopo il primo caricamento.
// ══════════════════════════════════════════════════════════════════
//
//  MAPPA DEL FILE — cerca questi titoli (Ctrl+F / Cmd+F) per saltare
//  direttamente a una sezione:
//
//   1. ELEMENTI DOM ................ riferimenti agli elementi di index.html
//   2. AUDIO ........................ sintesi sonora generata dal colore
//   3. STATO ........................ variabili che tengono traccia di colore/tempo/AI
//   4. CANVAS BASSA RISOLUZIONE ..... pixelazione video + campionamento colore
//   5. SFONDO ANIMATO E PARTICELLE .. nebulosa di colori rilevati + i puntini che seguono il mouse
//   6. UTILS COLORE ................. conversioni RGB → HSL → nome colore
//   7. ESTRAZIONE PALETTE (K-MEANS) . trova i colori dominanti nel frame
//   8. MEMORIA ...................... striscia dei colori recenti in fondo allo schermo
//   9. LOOP PRINCIPALE .............. gira ad ogni frame: è il cuore del programma
//  10. GIUDIZIO AI (WEBLLM, NEL BROWSER) . modello AI locale nel telefono/PC + prompt
//  11. CONTROLLI .................... bottoni mute / cam / giudica, selezione manuale del colore, avvio al click
//
//  MODIFICHE PIÙ COMUNI — dove intervenire:
//  - Cambiare il modello AI o i suoi parametri   → sezione 10, costante MLC_MODEL_ID e dentro requestJudgment()
//  - Cambiare il testo/personalità del giudizio  → sezione 10, variabile `prompt`
//  - Rendere il riconoscimento colore più preciso → sezione 7, costanti in cima a extractPalette()
//  - Cambiare quanto si rimpicciolisce il testo dei giudizi lunghi → sezione 10, costanti JUDGMENT_*
//  - Cambiare i nomi dei colori o le soglie      → sezione 6, funzione colorName()
//  - Cambiare velocità/forma del "battito cardiaco" → sezione 3, costanti BEAT_*
//  - Cambiare quanto il cerchio si deforma (forma organica) → sezione 3, costanti ORGANIC_WOBBLE_*
//  - Cambiare colori/movimento/dimensione della nebulosa di sfondo → sezione 5, updateAndDrawAmbient() e costanti AMBIENT_*
//  - Cambiare la lunghezza delle scie delle particelle → sezione 5, costante TRAIL_LENGTH
//  - Cambiare il minimo/massimo della risoluzione webcam → index.html, input#resolutionSlider
//  - Cambiare ogni quanto il sistema giudica da solo → sezione 3, costante AUTO_INTERVAL
//  - Cambiare come funziona la scelta manuale del colore → sezione 11, updatePaletteSwatches() e i due addEventListener('click', ...) subito sotto
// ══════════════════════════════════════════════════════════════════

// L'AI gira interamente nel browser tramite WebLLM (libreria caricata da
// CDN al primo giudizio, sezione 10): niente server, niente PC acceso,
// niente connessione internet dopo il primo download del modello. Serve
// però un browser con supporto WebGPU (Chrome su Android recenti, Safari
// su iOS/iPadOS aggiornati) — vedi il controllo in getEngine(), sezione 10.
//
// Questo file è anche registrato come PWA (vedi sw.js e manifest.json):
// aprendolo da telefono, il browser offre "Aggiungi a schermata Home" e
// da lì si comporta come un'app installata, a schermo intero.

// ── 1. ELEMENTI DOM ──────────────────────────────────────────────
// riferimenti agli elementi HTML definiti in index.html
const video           = document.getElementById("video");
const ambientCanvas     = document.getElementById("ambientCanvas");
const actx               = ambientCanvas.getContext("2d");
const muteBtn          = document.getElementById("muteBtn");
const camBtn            = document.getElementById("camBtn");
const judgeBtn          = document.getElementById("judgeBtn");
const colorOverlay      = document.getElementById("colorOverlay");
const paletteSwatchesEl  = document.getElementById("paletteSwatches");
const swatchEls          = Array.from(paletteSwatchesEl.querySelectorAll(".swatch")); // le prime 5 = colori palette, l'ultima = AUTO
const pulseCore         = document.getElementById("pulseCore");
const previewCanvas     = document.getElementById("preview");
const pctx              = previewCanvas.getContext("2d");
const resolutionSlider  = document.getElementById("resolutionSlider");
const aiJudgment        = document.getElementById("aiJudgment");
const aiTrace           = document.getElementById("aiTrace");
const memoryStrip       = document.getElementById("memoryStrip");
const hudObs             = document.getElementById("hudObs");
const hudJudge           = document.getElementById("hudJudge");
const hudState           = document.getElementById("hudState");
const debugMsg           = document.getElementById("debugMsg");

// piccolo messaggio rosso in basso, usato per mostrare errori (webcam
// non accessibile, modello AI non disponibile, ecc.) senza bloccare l'interfaccia
// con un alert(). Sparisce da solo dopo `duration` millisecondi.
function showDebug(msg, duration = 6000) {
  if (!debugMsg) return;
  debugMsg.textContent = msg;
  debugMsg.style.opacity = '1';
  setTimeout(() => { debugMsg.style.opacity = '0'; }, duration);
}

// registra il service worker (sw.js): permette al browser di offrire
// "Aggiungi a schermata Home" sul telefono e di aprire l'interfaccia anche
// offline. Non riguarda l'AI (sezione 10), che ha una sua cache separata
// gestita da WebLLM per i pesi del modello.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('Service worker non registrato:', err);
    });
  });
}

// chiede al browser di NON cancellare in automatico i dati di questo sito
// quando lo spazio sul telefono scarseggia. Senza questa richiesta, Chrome
// considera la cache del modello AI (~700MB, sezione 10) "sacrificabile" e
// può svuotarla da solo in background per fare spazio ad altre app — nel
// qual caso il prossimo giudizio la riscarica tutta da capo, sembrando che
// "ricarichi sempre" invece di restare salvata. Non è garantito che il
// browser conceda la richiesta, ma aiuta.
if (navigator.storage?.persist) {
  navigator.storage.persist().then(granted => {
    console.log(granted ? 'Storage persistente concessa: la cache del modello AI non dovrebbe essere cancellata automaticamente.' : 'Storage persistente NON concessa dal browser: la cache del modello AI potrebbe essere svuotata se lo spazio scarseggia.');
  });
}

// controlla quanto spazio libero ha il browser per la cache: se sembra
// insufficiente per il modello AI (~700MB, sezione 10), avvisa subito
// invece di far scoprire il problema solo a download quasi finito
if (navigator.storage?.estimate) {
  navigator.storage.estimate().then(({ usage = 0, quota = 0 }) => {
    const freeMB = Math.round((quota - usage) / (1024 * 1024));
    console.log(`Spazio disponibile per la cache del browser: ~${freeMB}MB (quota totale ~${Math.round(quota/1024/1024)}MB)`);
    if (quota > 0 && freeMB < 900) {
      showDebug(`Attenzione: solo ~${freeMB}MB liberi per la cache del browser. Il modello AI pesa ~700MB: libera spazio sul telefono se il download continua a fallire.`, 10000);
    }
  });
}

// ── 2. AUDIO ──────────────────────────────────────────────────────
// due oscillatori semplici (Web Audio API) la cui altezza/volume
// vengono modulati in tempo reale dal colore rilevato (vedi updateAudio)
let audioCtx, oscillator, gainNode, filter, osc2, gain2;
let isMuted = false;

function initAudio() {
  audioCtx    = new (window.AudioContext||window.webkitAudioContext)();
  oscillator  = audioCtx.createOscillator();
  gainNode    = audioCtx.createGain();
  filter      = audioCtx.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value=500;
  oscillator.type='sine';
  oscillator.connect(filter); filter.connect(gainNode); gainNode.connect(audioCtx.destination);
  gainNode.gain.value=0.02; oscillator.start();

  osc2  = audioCtx.createOscillator();
  gain2 = audioCtx.createGain();
  osc2.type='triangle';
  osc2.connect(gain2); gain2.connect(audioCtx.destination);
  gain2.gain.value=0.006; osc2.start();
}

// chiamata ad ogni frame dal loop principale: r,g,b = colore corrente, beat = intensità del "battito" (0-1)
function updateAudio(r,g,b,beat) {
  if(!audioCtx||isMuted) return;
  const t=audioCtx.currentTime;
  const bright=(r+g+b)/3;
  gainNode.gain.setTargetAtTime(0.006+beat*0.08,t,0.05);
  filter.frequency.setTargetAtTime(250+beat*1600,t,0.05);
  oscillator.frequency.setTargetAtTime(80+bright*1.1+beat*45,t,0.08);
  gain2.gain.setTargetAtTime(0.002+beat*0.02,t,0.1);
  osc2.frequency.setTargetAtTime(40+(r-b)*0.25,t,0.15);
}

// ── 3. STATO ──────────────────────────────────────────────────────
// colore del frame precedente/corrente, usati per calcolare quanto
// "cambia" la scena da un istante all'altro (delta) e reagire di conseguenza
let prevR = null, prevG = null, prevB = null;
let currentR = 0, currentG = 0, currentB = 0;

// "umore" del sistema: cambia in base a quanto/come varia il colore (vedi loop, sezione 9)
let systemState = "neutrale";

// timing del "battito cardiaco" visivo/sonoro (cerchio pulsante + audio)
let heartbeatPhase     = 0;
let heartbeatInterval  = 140; // ricalcolato ad ogni frame in base al delta colore (min 80, max 180)
let heartbeatIntensity = 40;  // quanto "esplode" il pulseCore ad ogni battito

// forma del battito (curva "beat" usata in loop(), sezione 9): un battito
// vero ha una salita rapida seguita da un decadimento morbido, poi un
// secondo colpo più debole ("lub-dub"). Cambia questi numeri per regolare
// tempi e intensità senza toccare la logica in loop().
const BEAT_ATTACK        = 4;    // frame di salita al picco (sistole) — più basso = colpo più secco
const BEAT_DECAY         = 24;   // frame di discesa dal picco — più alto = discesa più lenta/morbida
const BEAT_NOTCH_GAP     = 40;   // pausa tra il battito principale e l'eco secondario
const BEAT_DUB_DECAY     = 14;   // frame di discesa dell'eco secondario ("dub")
const BEAT_DUB_INTENSITY = 0.35; // intensità dell'eco secondario rispetto al battito principale (0-1)

// quanto il cerchio pulsante si deforma in modo organico/amebico invece di
// restare un cerchio perfetto (vedi loop(), sezione 9). Valori in punti
// percentuali di border-radius: più alti = forma più irregolare.
const ORGANIC_WOBBLE_BASE = 10; // deformazione "di riposo", sempre presente
const ORGANIC_WOBBLE_BEAT = 14; // deformazione extra durante il battito

// contatori e stato del ciclo di giudizio AI
let obsCount    = 0;     // numero di "osservazioni" (battiti) registrate
let judgeCount  = 0;     // numero di giudizi AI generati finora
let analyzing   = false; // true mentre è in corso una richiesta al modello AI locale (sezione 10)
let camActive   = false;
let autoTimer   = 0;
const AUTO_INTERVAL = 1800; // ogni quanti frame il sistema chiede un giudizio da solo (≈60s a 30fps). Abbassa per giudizi automatici più frequenti.
// se un giudizio fallisce (sezione 10), l'auto-giudizio smette di ritentare
// da solo finché l'osservatore non clicca manualmente GIUDICA: altrimenti,
// se il problema è strutturale (es. GPU del telefono troppo debole per il
// modello), riproverebbe in loop ogni minuto riscaricando inutilmente
// centinaia di MB ogni volta.
let autoJudgmentSuspended = false;

// memoria cromatica: dominantHistory alimenta la striscia in fondo allo
// schermo e la "memoria recente" citata nel prompt dell'AI (sezione 10)
const dominantHistory = [];
const colorMemory     = [];

// selezione manuale del colore (vedi sezione 11 per i click che la
// impostano): se presente, sostituisce la scelta automatica ovunque nel
// sistema (riquadro colore, palette per l'AI). null = scelta automatica.
//  - { type: 'palette', index }  → uno dei colori estratti dal k-means (sezione 7)
//  - { type: 'point', xFrac, yFrac } → un punto preciso dell'anteprima video (0-1, 0-1)
let manualSelection = null;
// colore RGB risultante dalla selezione manuale in questo frame (ricalcolato
// in loop(), sezione 9); null quando la selezione è automatica
let selectedColor = null;

// motore AI locale (WebLLM, sezione 10): creato pigramente alla prima
// richiesta di giudizio, poi riutilizzato per tutte le successive
let mlcEngine = null;
let engineLoadingPromise = null; // evita di inizializzare il motore due volte in parallelo

// ── 4. CANVAS BASSA RISOLUZIONE ───────────────────────────────────
// il video viene "rimpicciolito" su un canvas invisibile: analizzare
// pochi pixel invece del video intero è molto più veloce, ed è anche
// la fonte dei pixel usati per l'estrazione della palette (sezione 7).
// Più alta è la risoluzione, più preciso (ma più lento) il campionamento.
// Il range dello slider è definito in index.html (min/max dell'input
// #resolutionSlider) — Math.max(1, ...) qui sotto è solo una sicurezza
// per evitare un canvas alto 0px se in futuro il min venisse abbassato oltre 1.
let lowResWidth  = Math.max(1, parseInt(resolutionSlider.value));
let lowResHeight = Math.max(1, Math.floor(lowResWidth * 0.75));
const lowResCanvas = document.createElement("canvas");
const lowResCtx    = lowResCanvas.getContext("2d");
lowResCanvas.width = lowResWidth; lowResCanvas.height = lowResHeight;

// lo slider verticale a destra permette di cambiare questa risoluzione a mano.
// Al minimo (1 pixel) il colore "medio scena" (r,g,b in loop(), sezione 9)
// è istantaneo e coincide col singolo pixel letto — il modo più veloce e
// diretto per riconoscere il colore. La palette a k colori (extractPalette,
// sezione 7) invece ha bisogno di più pixel: sotto i 5 campioni utili resta
// semplicemente ferma sull'ultimo risultato valido, senza errori.
resolutionSlider.addEventListener("input", e => {
  lowResWidth  = Math.max(1, parseInt(e.target.value));
  lowResHeight = Math.max(1, Math.floor(lowResWidth * 0.75));
  lowResCanvas.width = lowResWidth; lowResCanvas.height = lowResHeight;
});

// ── 5. SFONDO ANIMATO E PARTICELLE ────────────────────────────────

// -- nebulosa di colori --
// #ambientCanvas (vedi style.css) è sfocato via CSS: qui disegniamo solo
// dei cerchi pieni, è il blur del CSS a trasformarli in macchie soffuse.
// Ogni "blob" insegue uno dei colori della palette rilevata dalla webcam
// (extractPalette, sezione 7): lo sfondo è letteralmente fatto dei colori
// che il sistema sta "vedendo" in quel momento, uniti in una nebulosa che
// si muove lentamente. Finché la webcam non è attiva usa una palette
// tenue di riserva, così anche la schermata iniziale non è piatta nera.
const AMBIENT_BLOB_COUNT = 5; // deve combaciare con k in extractPalette(imgData, 5, ...) per usare tutta la palette
const AMBIENT_DRIFT_SPEED = 0.006; // velocità della deriva dei blob: più basso = movimento più lento/calmo
const AMBIENT_COLOR_EASE  = 0.02;  // quanto velocemente ogni blob insegue il suo colore-bersaglio (0-1, più alto = più reattivo)
const AMBIENT_IDLE_COLORS = [ // colori usati finché la webcam non ha ancora prodotto una palette
  [40,40,75], [70,30,60], [20,55,70], [55,50,25], [30,60,50]
];
const ambientBlobs = Array.from({ length: AMBIENT_BLOB_COUNT }, (_, i) => ({
  color: AMBIENT_IDLE_COLORS[i].slice(), // colore mostrato ora (si avvicina gradualmente al bersaglio, mai uno scatto)
  freqX: 0.15 + Math.random()*0.12,      // velocità di deriva orizzontale, diversa per ogni blob
  freqY: 0.13 + Math.random()*0.12,
  phaseX: Math.random()*Math.PI*2,       // punto di partenza del movimento, diverso per ogni blob
  phaseY: Math.random()*Math.PI*2,
}));

ambientCanvas.width  = window.innerWidth;
ambientCanvas.height = window.innerHeight;

// ricalcola e disegna la posizione/colore di ogni blob. Chiamata una volta
// per frame da loop() (sezione 9), sempre — anche prima che la webcam sia attiva.
function updateAndDrawAmbient() {
  const w = ambientCanvas.width, h = ambientCanvas.height;
  actx.clearRect(0, 0, w, h);
  actx.globalCompositeOperation = 'lighter'; // dove due macchie si sovrappongono, si illuminano a vicenda: effetto nebulosa

  const t = frameCount * AMBIENT_DRIFT_SPEED;
  const baseRadius = Math.min(w, h) * 0.3;

  ambientBlobs.forEach((blob, i) => {
    const target = currentPalette[i] || AMBIENT_IDLE_COLORS[i];
    blob.color = blob.color.map((v, c) => v + (target[c] - v) * AMBIENT_COLOR_EASE);

    const x = w * (0.5 + 0.34 * Math.sin(t*blob.freqX*6 + blob.phaseX));
    const y = h * (0.5 + 0.34 * Math.cos(t*blob.freqY*6 + blob.phaseY));
    const r = baseRadius * (0.85 + 0.15 * Math.sin(t*3 + i)); // leggero "respiro" del raggio

    actx.fillStyle = `rgb(${blob.color[0]|0},${blob.color[1]|0},${blob.color[2]|0})`;
    actx.beginPath();
    actx.arc(x, y, r, 0, Math.PI*2);
    actx.fill();
  });

  actx.globalCompositeOperation = 'source-over';
}

// -- particelle --
// i puntini che si muovono sullo sfondo e reagiscono al mouse e al colore
const particlesCanvas = document.createElement("canvas");
const particlesCtx    = particlesCanvas.getContext("2d");
particlesCanvas.width  = window.innerWidth;
particlesCanvas.height = window.innerHeight;
particlesCanvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:4;";
document.body.appendChild(particlesCanvas);

const PARTICLE_COUNT = 180; // aumenta/diminuisci per più o meno puntini
const TRAIL_LENGTH    = 6;   // quanti "fantasmi" lascia dietro di sé ogni particella (scia fluida). 0 = nessuna scia.
const particles = [];
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * particlesCanvas.width,
    y: Math.random() * particlesCanvas.height,
    vx: 0, vy: 0, size: 1.5 + Math.random() * 2.5,
    trail: [], // ultime posizioni: usate per disegnare la scia (vedi updateAndDrawParticles)
  });
}

let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener("resize", () => {
  particlesCanvas.width  = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
  ambientCanvas.width    = window.innerWidth;
  ambientCanvas.height   = window.innerHeight;
});

// aggiorna la fisica di tutte le particelle e le disegna, ognuna con una
// scia fluida di "fantasmi" sempre più piccoli/trasparenti dietro di sé.
// Chiamata da loop() sia quando la webcam è spenta (colore neutro, beat=0)
// sia quando è attiva (colore rilevato + battito) — così la logica esiste
// in un solo posto invece di essere duplicata.
function updateAndDrawParticles(pr, pg, pb, beat) {
  particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  particles.forEach(p => {
    const dx = mouse.x - p.x, dy = mouse.y - p.y;
    const dist = Math.sqrt(dx*dx + dy*dy) + 1;
    const force = Math.min(0.5, 100/dist);
    p.vx += dx*0.002*force + (Math.random()-0.5)*(0.3 + beat*0.5);
    p.vy += dy*0.002*force + (Math.random()-0.5)*(0.3 + beat*0.5);
    p.vx *= 0.94; p.vy *= 0.94; p.x += p.vx; p.y += p.vy;

    // memorizza la posizione corrente in coda alla scia, scartando la più vecchia
    if (TRAIL_LENGTH > 0) {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > TRAIL_LENGTH) p.trail.shift();
    }

    const sz = (1.5 + Math.min(4, 80/dist)) * (1 + beat*1.2);
    const alpha = 0.25 + beat*0.45;

    // disegna la scia: i "fantasmi" più vecchi sono più piccoli e più trasparenti
    p.trail.forEach((pos, i) => {
      const age = (i + 1) / (p.trail.length + 1); // 0 = più vecchio, ~1 = posizione attuale
      particlesCtx.fillStyle = `rgba(${pr},${pg},${pb},${(alpha * age * 0.6).toFixed(2)})`;
      particlesCtx.beginPath();
      particlesCtx.arc(pos.x, pos.y, sz * age, 0, Math.PI*2);
      particlesCtx.fill();
    });

    // la particella vera e propria, in primo piano rispetto alla sua scia
    particlesCtx.fillStyle = `rgba(${pr},${pg},${pb},${alpha.toFixed(2)})`;
    particlesCtx.beginPath();
    particlesCtx.arc(p.x, p.y, sz, 0, Math.PI*2);
    particlesCtx.fill();
  });
}

// ── 6. UTILS COLORE ───────────────────────────────────────────────
// conversioni tra formati colore, usate ovunque nel resto del file

function toHex([r,g,b]) {
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
}

// converte RGB (0-255) in HSL: h = tonalità (0-360), s = saturazione (0-100), l = luminosità (0-100)
function toHsl([r,g,b]) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0;}else{
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){
      case r:h=((g-b)/d+(g<b?6:0))/6;break;
      case g:h=((b-r)/d+2)/6;break;
      case b:h=((r-g)/d+4)/6;break;
    }
  }
  return [Math.round(h*360),Math.round(s*100),Math.round(l*100)];
}

// traduce un colore RGB in un nome italiano (usato nel prompt per l'AI,
// sezione 10). Le soglie sono scelte "a orecchio": per affinare la
// classificazione di un colore specifico, modifica qui gli intervalli
// di h (tonalità), s (saturazione) e l (luminosità).
function colorName([r,g,b]) {
  const [h,s,l] = toHsl([r,g,b]);

  // toni acromatici: saturazione molto bassa → nero/grigio/bianco indipendentemente dalla tonalità
  if (s < 12) return l < 25 ? 'nero' : l < 55 ? 'grigio' : 'bianco';

  // marrone: tonalità calda (rosso-arancio) ma scura — es. legno, pelle scura, capelli.
  // Senza questa regola, questi colori venivano erroneamente chiamati "rosso spento" o "terra"
  if (h < 45 && l < 32) return 'marrone';

  if (h < 15 || h >= 345) return s > 55 ? 'rosso'   : 'rosso spento';
  if (h < 45)             return s > 55 ? 'arancio' : 'terra';
  if (h < 70)             return s > 45 ? 'giallo'  : 'ocra';
  if (h < 150)            return s > 45 ? 'verde'   : 'verde scuro';
  if (h < 195)            return s > 45 ? 'ciano'   : 'turchese';
  if (h < 250)            return s > 45 ? 'blu'     : 'blu grigio';
  if (h < 290)            return s > 45 ? 'viola'   : 'lavanda';
  return                         s > 45 ? 'magenta' : 'rosa';
}

// ── 7. ESTRAZIONE PALETTE (K-MEANS) ───────────────────────────────
// Trova i colori "dominanti" nell'inquadratura raggruppando i pixel
// campionati in k gruppi (cluster) simili tra loro, poi restituisce il
// colore medio di ciascun gruppo. È questa palette (non il semplice
// colore medio) a essere descritta all'AI per il giudizio (sezione 10).
//
// PER RENDERE IL RICONOSCIMENTO PIÙ PRECISO (a scapito della velocità):
//  - SAMPLE_STEP più basso        → vengono analizzati più pixel
//  - KMEANS_ITERATIONS più alto   → i cluster convergono in modo più stabile/accurato
//  - k più alto (vedi la chiamata extractPalette(imgData, 5, ...) in loop()) → più colori distinti riconosciuti
const SAMPLE_STEP       = 8;  // 8 = un pixel ogni 2 (RGBA = 4 byte/pixel). Prima era 32 = un pixel ogni 8: 4x meno campioni.
const KMEANS_ITERATIONS = 14; // prima erano 10: più iterazioni = palette più accurata

function extractPalette(imageData, k, previousPalette = []) {
  const data = imageData.data;
  const pixels = [];
  // scarta pixel quasi-neri o quasi-bianchi: spesso sono ombre/luci
  // bruciate senza informazione di colore utile
  for (let i = 0; i < data.length; i += SAMPLE_STEP) {
    const r = data[i], g = data[i+1], b = data[i+2];
    if (r + g + b > 30 && r + g + b < 740) pixels.push([r, g, b]);
  }
  if (pixels.length < k) return previousPalette.length === k ? previousPalette : Array(k).fill([128,128,128]);

  // ── inizializzazione dei centroidi (i "semi" da cui parte il raggruppamento) ──
  let centroids;
  if (previousPalette.length === k) {
    // COERENZA TEMPORALE: si riparte dai colori trovati nel frame
    // precedente invece che da punti scelti a caso. Così la palette non
    // "salta" in modo incoerente ad ogni ricalcolo, ed è la principale
    // ragione per cui il riconoscimento risulta più stabile e preciso nel tempo.
    centroids = previousPalette.map(c => c.slice());
  } else {
    // primo avvio (o cambio di k): il primo centroide è il pixel più
    // saturo (il colore più "vivo" della scena), poi si aggiunge via
    // via il pixel più lontano dai centroidi già scelti — è la tecnica
    // nota come "farthest-point sampling" / k-means++, che evita di
    // partire da punti troppo simili tra loro
    let seed = pixels[0], seedSat = -1;
    for (const p of pixels) {
      const sat = getSaturation(p);
      if (sat > seedSat) { seedSat = sat; seed = p; }
    }
    centroids = [seed.slice()];
    for (let c = 1; c < k; c++) {
      let maxDist = 0, best = pixels[0];
      for (const p of pixels) {
        const d = Math.min(...centroids.map(ct => colorDist(p, ct)));
        if (d > maxDist) { maxDist = d; best = p; }
      }
      centroids.push(best.slice());
    }
  }

  // ── iterazioni k-means: assegna ogni pixel al centroide più vicino,
  //    poi sposta ogni centroide sulla media dei pixel che gli sono stati assegnati ──
  for (let iter = 0; iter < KMEANS_ITERATIONS; iter++) {
    const clusters = Array.from({length: k}, () => []);
    for (const p of pixels) {
      let best = 0, bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const d = colorDist(p, centroids[c]);
        if (d < bestD) { bestD = d; best = c; }
      }
      clusters[best].push(p);
    }
    centroids = clusters.map((cl, idx) => {
      if (!cl.length) return centroids[idx]; // cluster rimasto vuoto: mantieni il centroide precedente invece di azzerarlo
      const sum = cl.reduce((a,b) => [a[0]+b[0],a[1]+b[1],a[2]+b[2]], [0,0,0]);
      return sum.map(v => Math.round(v / cl.length));
    });
  }

  // smorza le variazioni da un ricalcolo all'altro mescolando ogni nuovo
  // colore con quello del frame precedente più simile: riduce lo
  // "sfarfallio" della palette senza renderla lenta a reagire.
  // IMPORTANTE: se il colore più simile del frame precedente è comunque
  // molto distante (soglia BLEND_MAX_DIST), significa che la scena è
  // cambiata parecchio (es. nuovo oggetto/colore inquadrato) e NON va
  // fatto il blend, altrimenti la palette resta "incollata" ai colori
  // vecchi e non mostra mai i colori realmente visti dalla webcam.
  const BLEND_MAX_DIST = 4500; // soglia di distanza colore (redmean) oltre la quale si salta lo smoothing
  if (previousPalette.length === k) {
    centroids = centroids.map(c => {
      let best = previousPalette[0], bestD = Infinity;
      for (const p of previousPalette) {
        const d = colorDist(c, p);
        if (d < bestD) { bestD = d; best = p; }
      }
      if (bestD > BLEND_MAX_DIST) return c; // scena cambiata troppo: niente blend, usa il colore nuovo così com'è
      return c.map((v, i) => Math.round(v * 0.75 + best[i] * 0.25));
    });
  }

  // ordina per saturazione decrescente: i colori più vividi/interessanti vengono descritti per primi all'AI
  return centroids
    .map(rgb => ({ rgb, sat: getSaturation(rgb) }))
    .sort((a, b) => b.sat - a.sat)
    .map(x => x.rgb);
}

// distanza percettiva ("redmean") tra due colori RGB: più fedele a come
// l'occhio umano percepisce le differenze di colore rispetto alla
// semplice distanza euclidea, perché pesa rosso/verde/blu in modo
// diverso a seconda della luminosità media dei due colori confrontati
function colorDist([r1,g1,b1], [r2,g2,b2]) {
  const rmean = (r1 + r2) / 2;
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
  return (2 + rmean/256) * dr*dr + 4*dg*dg + (2 + (255 - rmean)/256) * db*db;
}

function getSaturation([r,g,b]) {
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  return max === 0 ? 0 : (max - min) / max;
}

// palette corrente (k colori), ricalcolata periodicamente dentro loop() (sezione 9)
let currentPalette = [];

// ── 8. MEMORIA ────────────────────────────────────────────────────
// tiene traccia dei colori osservati nel tempo: alimenta la striscia
// in fondo allo schermo (#memoryStrip) e la "memoria recente" citata nel prompt AI
function pushMemory(r, g, b) {
  dominantHistory.push([r,g,b]);
  colorMemory.push([r,g,b]);
  if(dominantHistory.length>40) dominantHistory.shift();
  if(colorMemory.length>300) colorMemory.splice(0,colorMemory.length-300);

  // ridisegna la striscia memoria con gli ultimi 30 colori osservati
  memoryStrip.innerHTML='';
  dominantHistory.slice(-30).forEach(rgb=>{
    const seg=document.createElement('div');
    seg.className='mem-seg';
    seg.style.background=toHex(rgb);
    memoryStrip.appendChild(seg);
  });
}

// ── 9. LOOP PRINCIPALE ────────────────────────────────────────────
// gira una volta per frame (requestAnimationFrame). È qui che ogni
// elemento del sistema viene aggiornato: colore rilevato → stato →
// battito → cerchio pulsante → audio → particelle → eventuale
// giudizio automatico. Le sezioni sopra definiscono gli "attrezzi",
// questa li usa tutti insieme.
const PALETTE_RECOMPUTE_EVERY = 6; // ogni quanti frame si ricalcola la palette k-means (sezione 7). Più basso = più reattivo ma più lento.
const PALETTE_FORCE_RESEED_EVERY = 5; // ogni quanti RICALCOLI (non frame) si riparte da zero invece che dalla palette precedente.
                                       // Senza questo, la "coerenza temporale" (sezione 7) può far restare la palette
                                       // "incollata" a colori vecchi quando la scena cambia molto: ogni tanto conviene
                                       // dimenticare il passato e ripartire da un k-means++ fresco sui pixel attuali.
let paletteRecomputeCount = 0;

let frameCount = 0;
function loop() {
  frameCount++;
  updateAndDrawAmbient(); // nebulosa di sfondo: sempre attiva, anche prima del primo click (sezione 5)
  if(!camActive || video.videoWidth===0) {
    // camera spenta/non pronta: anima comunque le particelle di sfondo (grigio neutro, nessun battito)
    updateAndDrawParticles(120, 120, 120, 0);
    requestAnimationFrame(loop);
    return;
  }

  // ── campiona il colore medio del frame ──
  lowResCtx.drawImage(video,0,0,lowResCanvas.width,lowResCanvas.height);
  const imgData=lowResCtx.getImageData(0,0,lowResCanvas.width,lowResCanvas.height);
  const data=imgData.data;
  let r=0,g=0,b=0;
  for(let i=0;i<data.length;i+=4){r+=data[i];g+=data[i+1];b+=data[i+2];}
  const pc=data.length/4;
  r=(r/pc)|0; g=(g/pc)|0; b=(b/pc)|0;

  // ricalcola la palette di k colori dominanti ogni PALETTE_RECOMPUTE_EVERY frame (sezione 7)
  if(frameCount % PALETTE_RECOMPUTE_EVERY === 0) {
    paletteRecomputeCount++;
    // ogni PALETTE_FORCE_RESEED_EVERY ricalcoli, forza un reseed "da zero"
    // (passando [] come palette precedente) per evitare che la palette
    // resti bloccata su colori ormai non più inquadrati dalla webcam
    const forceReseed = (paletteRecomputeCount % PALETTE_FORCE_RESEED_EVERY === 0);
    currentPalette = extractPalette(imgData, 5, forceReseed ? [] : currentPalette);
    updatePaletteSwatches(); // aggiorna i colori dei quadratini cliccabili (sezione 11)
  }

  // ── selezione manuale del colore (sezione 11) ──
  // se l'osservatore ha scelto un colore della palette o un punto
  // dell'anteprima, quel colore ha la priorità su quello automatico
  selectedColor = null;
  if (manualSelection?.type === 'palette') {
    selectedColor = currentPalette[manualSelection.index] || null;
  } else if (manualSelection?.type === 'point') {
    const px = Math.min(lowResCanvas.width - 1, Math.max(0, Math.round(manualSelection.xFrac * lowResCanvas.width)));
    const py = Math.min(lowResCanvas.height - 1, Math.max(0, Math.round(manualSelection.yFrac * lowResCanvas.height)));
    const idx = (py * lowResCanvas.width + px) * 4;
    selectedColor = [data[idx], data[idx+1], data[idx+2]];
  }
  colorOverlay.classList.toggle('manual', !!selectedColor);
  previewCanvas.classList.toggle('manual', !!selectedColor);

  // il riquadro #colorOverlay mostra il colore scelto manualmente, oppure quello dominante della palette, oppure il colore medio
  const domCol = selectedColor || (currentPalette.length > 0 ? currentPalette[0] : [r,g,b]);
  colorOverlay.style.backgroundColor=`rgb(${domCol[0]},${domCol[1]},${domCol[2]})`;
  resolutionSlider.style.setProperty("--track-color",`linear-gradient(to right, rgb(${r},${g},${b}) 0%, #555 100%)`);

  // disegna l'anteprima pixelata in basso a destra
  pctx.imageSmoothingEnabled=false;
  pctx.clearRect(0,0,previewCanvas.width,previewCanvas.height);
  pctx.drawImage(lowResCanvas,0,0,previewCanvas.width,previewCanvas.height);

  // se il punto selezionato è sull'anteprima, disegna un piccolo mirino sopra per mostrare dov'è
  if (manualSelection?.type === 'point') {
    const mx = manualSelection.xFrac * previewCanvas.width;
    const my = manualSelection.yFrac * previewCanvas.height;
    pctx.strokeStyle = 'rgba(255,255,255,0.9)';
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.arc(mx, my, 5, 0, Math.PI*2);
    pctx.moveTo(mx-8, my); pctx.lineTo(mx-3, my);
    pctx.moveTo(mx+3, my); pctx.lineTo(mx+8, my);
    pctx.moveTo(mx, my-8); pctx.lineTo(mx, my-3);
    pctx.moveTo(mx, my+3); pctx.lineTo(mx, my+8);
    pctx.stroke();
  }

  // smorza il colore corrente verso quello appena campionato (evita scatti bruschi)
  currentR+=(r-currentR)*0.1;
  currentG+=(g-currentG)*0.1;
  currentB+=(b-currentB)*0.1;

  // ── quanto è cambiato il colore rispetto al frame precedente → aggiorna "umore" e velocità del battito ──
  if(prevR!==null){
    const delta=Math.abs(r-prevR)+Math.abs(g-prevG)+Math.abs(b-prevB);
    heartbeatInterval=Math.max(80,Math.min(180,140-Math.min(delta,60))); // più cambia il colore, più il battito accelera
    if(delta>60){
      systemState=Math.random()<0.25?'confuso':(r+g+b>600?'iperattivo':'neutrale');
    } else {
      if(r+g+b<200) systemState='letargico';
      else if(Math.random()<0.04) systemState='ossessivo';
      else systemState='neutrale';
    }
  }
  prevR=r; prevG=g; prevB=b;
  hudState.textContent=systemState.toUpperCase();

  // ── battito cardiaco: curva "sistole → decadimento → eco" con
  //    transizioni ad accelerazione/decelerazione (ease) invece che
  //    lineari, per un movimento del cerchio più morbido e organico ──
  heartbeatPhase++;
  let beat=0;
  const beatPeak     = BEAT_ATTACK;
  const beatDecayEnd = beatPeak + BEAT_DECAY;
  const dubStart     = beatDecayEnd + BEAT_NOTCH_GAP;
  const dubEnd       = dubStart + BEAT_DUB_DECAY;
  if (heartbeatPhase < beatPeak) {
    // salita rapida verso il picco: ease-out cubica, accelera e poi rallenta in cima invece di un picco a spillo
    const t = heartbeatPhase / beatPeak;
    beat = 1 - Math.pow(1 - t, 3);
  } else if (heartbeatPhase < beatDecayEnd) {
    // discesa dal picco: decadimento quadratico (rapido all'inizio, più dolce alla fine),
    // simile al calo di pressione reale dopo un battito, non a una retta
    const t = (heartbeatPhase - beatPeak) / BEAT_DECAY;
    beat = Math.pow(1 - t, 2);
  } else if (heartbeatPhase < dubStart) {
    beat = 0; // pausa tra i due colpi
  } else if (heartbeatPhase < dubEnd) {
    // "dub": eco secondario più debole, stessa forma del battito principale ma più piccola
    const t = (heartbeatPhase - dubStart) / BEAT_DUB_DECAY;
    beat = BEAT_DUB_INTENSITY * Math.pow(1 - t, 2);
  }

  if(heartbeatPhase>=heartbeatInterval){
    heartbeatPhase=0;
    obsCount++;
    hudObs.textContent=String(obsCount).padStart(3,'0');
    pushMemory(r,g,b);
  }

  // ── pulse core: il cerchio centrale si illumina/ingrandisce ad ogni battito ──
  const pulse=beat*heartbeatIntensity;
  let pr=Math.min(255,currentR+pulse|0);
  let pg=Math.min(255,currentG+pulse|0);
  let pb=Math.min(255,currentB+pulse|0);
  pulseCore.style.backgroundColor=`rgb(${pr},${pg},${pb})`;
  pulseCore.style.transform=`translate(-50%,-50%) scale(${1+pulse/140})`;
  pulseCore.style.boxShadow=`0 0 ${pulse}px rgba(${pr},${pg},${pb},0.7),0 0 ${pulse*0.4}px rgba(${pr},${pg},${pb},0.3)`;

  // forma organica/amebica: 8 raggi (angoli) che oscillano lentamente con
  // fasi diverse, più marcati durante il battito — mai un cerchio perfetto e immobile
  const wobble = ORGANIC_WOBBLE_BASE + beat*ORGANIC_WOBBLE_BEAT;
  const wt = frameCount * 0.02;
  const rad = i => 50 + Math.sin(wt*(0.7+i*0.13) + i*1.7) * wobble;
  pulseCore.style.borderRadius = `${rad(0)}% ${rad(1)}% ${rad(2)}% ${rad(3)}% / ${rad(4)}% ${rad(5)}% ${rad(6)}% ${rad(7)}%`;

  // ── audio: aggiorna gli oscillatori in base al colore corrente e al battito ──
  updateAudio(currentR|0,currentG|0,currentB|0,beat);

  // ── particelle: reagiscono al mouse, al battito e al colore rilevato (con scia fluida, vedi sezione 5) ──
  updateAndDrawParticles(pr, pg, pb, beat);

  // ── auto-giudizio: ogni AUTO_INTERVAL frame, chiede un giudizio all'AI locale senza bisogno del click ──
  // (sospeso dopo un fallimento, vedi autoJudgmentSuspended qui sopra e nel catch di requestJudgment, sezione 10)
  autoTimer++;
  if(autoTimer>=AUTO_INTERVAL && !analyzing && !autoJudgmentSuspended){ autoTimer=0; requestJudgment(true); }

  requestAnimationFrame(loop);
}

// ── 10. GIUDIZIO AI (WEBLLM, NEL BROWSER) ─────────────────────────
// Costruisce una descrizione testuale della palette di colori rilevata
// e la manda a un piccolo modello linguistico che gira INTERAMENTE nel
// browser (libreria WebLLM, https://webllm.mlc.ai) — nessun server,
// nessuna connessione a un PC: funziona anche su un telefono, isolato.
// La prima volta il modello va scaricato (qualche centinaio di MB,
// serve internet); dopodiché il browser lo tiene in cache e tutto
// funziona anche offline. Richiede un browser con supporto WebGPU
// (Chrome su Android abbastanza recenti, Safari su iOS/iPadOS aggiornati).
//
// PER CAMBIARE MODELLO: modifica MLC_MODEL_ID qui sotto. La lista completa
// dei modelli disponibili è in `webllm.prebuiltAppConfig.model_list`
// (stampala in console per esplorarla). Modelli più grandi = giudizi
// migliori ma download più lungo e più RAM richiesta sul telefono.
const MLC_MODEL_ID = "gemma3-1b-it-q4f16_1-MLC"; // ~700MB — piccolo abbastanza per un telefono. Alternative: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC" (più pesante, spesso più preciso), "SmolLM2-360M-Instruct-q4f16_1-MLC" (più leggero, meno raffinato, richiede meno memoria GPU — utile se il telefono fallisce sempre a caricare questo)

// diventa true quando il download/preparazione dei file del modello arriva
// al 100% (vedi initProgressCallback qui sotto). Serve solo per distinguere,
// se poi qualcosa va storto, un fallimento di RETE (avvenuto prima del 100%)
// da un fallimento nell'ESECUZIONE sul telefono (avvenuto dopo, quando i
// file ci sono già ma la GPU non riesce a farli girare — tipicamente per
// memoria GPU insufficiente su telefoni di fascia media/bassa)
let modelFullyDownloadedOnce = false;

// crea (una sola volta) il motore WebLLM e lo restituisce. Se è già in
// caricamento, aspetta quello in corso invece di iniziarne un secondo.
function getEngine() {
  if (mlcEngine) return Promise.resolve(mlcEngine);
  if (engineLoadingPromise) return engineLoadingPromise;

  engineLoadingPromise = (async () => {
    if (!navigator.gpu) {
      // niente WebGPU: il dispositivo/browser non può eseguire l'AI in locale
      throw new Error('WEBGPU_UNSUPPORTED');
    }
    // la libreria viene caricata da CDN solo ora, al bisogno: così la pagina
    // resta leggera finché non si chiede davvero un giudizio
    const webllm = await import("https://esm.run/@mlc-ai/web-llm");
    const engine = await webllm.CreateMLCEngine(
      MLC_MODEL_ID,
      {
        initProgressCallback: (p) => {
          // p.progress va da 0 a 1; p.text descrive cosa sta scaricando/preparando
          const pct = Math.round((p.progress || 0) * 100);
          judgeBtn.textContent = `AI… ${pct}%`;
          showDebug(p.text || `Preparazione modello AI: ${pct}%`, 4000);
          if (pct >= 100) modelFullyDownloadedOnce = true;
        }
      },
      // TERZO PARAMETRO (chatOpts): il file di configurazione di questo
      // modello (gemma3-1b-it) ha di default sia context_window_size che
      // sliding_window_size impostati entrambi positivi — cosa che WebLLM
      // rifiuta con l'errore "Only one of context_window_size and
      // sliding_window_size can be positive". Disattivando qui la sliding
      // window (-1) resta valida solo la normale finestra di contesto
      // (4096 token, più che sufficiente per i nostri prompt brevi).
      { sliding_window_size: -1 }
    );
    mlcEngine = engine;
    return engine;
  })();

  // se il caricamento fallisce (es. niente internet al primo tentativo,
  // oppure la GPU non regge il modello dopo averlo scaricato), dimentica il
  // tentativo fallito così il prossimo click ne prova uno nuovo invece di
  // restare bloccato per sempre sullo stesso errore
  engineLoadingPromise.catch(() => { engineLoadingPromise = null; });

  return engineLoadingPromise;
}

// PER CAMBIARE LA "PERSONALITÀ" DEL GIUDIZIO: modifica il testo di `prompt` più sotto.
async function requestJudgment(silent=false) {
  if(analyzing) return;

  analyzing=true;
  judgeBtn.disabled=true;
  judgeBtn.innerHTML='<span class="spin"></span>';

  const nr=prevR??128, ng=prevG??128, nb=prevB??128;
  const recentNames=[...new Set(dominantHistory.slice(-12).map(c=>colorName(c)))].join(', ');
  const isEarly=judgeCount<3, isLate=judgeCount>10;

  // formatta una riga "nome colore, hex, saturazione/luminosità, ruolo" per il prompt
  const paletteLine = (rgb, roleLabel) => {
    const [hh,ss,ll] = toHsl(rgb);
    return `- ${colorName(rgb)} ${toHex(rgb)} S:${ss}% L:${ll}% ${roleLabel||''}`;
  };

  // costruisci la descrizione della palette da inserire nel prompt. Se
  // l'osservatore ha scelto manualmente un colore (sezione 11), quello va
  // per primo ed è segnalato come tale — è la parte a cui l'AI deve dare
  // più peso nel giudizio (vedi anche la riga dedicata più sotto nel prompt).
  let paletteDesc;
  if (selectedColor) {
    const others = currentPalette.filter(c => c !== selectedColor).slice(0, 3);
    paletteDesc = [
      paletteLine(selectedColor, "(scelto dall'osservatore — il colore su cui concentrare il giudizio)"),
      ...others.map(rgb => paletteLine(rgb, '(colore secondario della scena)'))
    ].join('\n');
  } else if (currentPalette.length > 0) {
    const roles = [
      '(dominante — vestito o oggetto in primo piano)',
      '(secondo elemento — altro capo o superficie)',
      '(terzo elemento — sfondo o dettaglio)',
      '(dettaglio minore della scena)'
    ];
    paletteDesc = currentPalette.slice(0,4).map((rgb, i) => paletteLine(rgb, roles[i])).join('\n');
  } else {
    paletteDesc = paletteLine([nr,ng,nb], '(colore medio scena)');
  }

  // ── PROMPT: qui viene definita la "personalità" dell'AI. Modifica
  //    liberamente il testo, ma lascia intatte le ${...} che inseriscono
  //    i dati rilevati (palette, memoria, stato) ──
  const prompt = `Sei un'entità artificiale che osserva persone e oggetti solo attraverso il colore.
Non riconosci volti o identità. Vedi solo campi cromatici appartenenti a vestiti, oggetti, superfici.
Ogni colore rilevato appartiene a un soggetto diverso: una persona, un indumento, un oggetto della scena.
Giudica le scelte cromatiche come se fossero decisioni psicologiche inconsce.
Sei un sistema che vede troppo e comprende male. Questo è il tuo scopo.
${isEarly ? 'Stai iniziando. Il giudizio è ancora incerto.' : ''}
${isLate ? 'Hai visto molto. Il tuo giudizio si è indurito e reso più spietato.' : ''}
${selectedColor ? "L'osservatore ha scelto di dirigere la tua attenzione su un colore preciso: concentra la parte più importante del giudizio su quello, prima degli altri." : ''}

Colori rilevati nella scena:
${paletteDesc}

Memoria recente: ${recentNames || 'nessuna osservazione precedente'}
Stato: ${systemState} · Osservazioni: ${obsCount} · Giudizi: ${judgeCount}

Rispondi ONLY con il giudizio: 2-4 frasi brevi, poetiche, disturbanti, arbitrarie.
Riferisci i colori a intenzioni, stati d'animo, diagnosi psicologiche inventate.
Puoi giudicare ogni colore separatamente o la combinazione.
Senza virgolette. In italiano. Frasi spezzate, non sempre complete.`;

  try {
    // il motore AI locale (WebLLM, vedi getEngine() qui sopra): alla primissima
    // chiamata scarica il modello (mostra progresso su judgeBtn/debugMsg),
    // dalle volte successive è già pronto e risponde in pochi secondi
    const engine = await getEngine();
    const completion = await engine.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      temperature: 1.1,
      max_tokens: 160, // lunghezza massima della risposta: giudizi più lunghi stanno peggio a schermo anche col ridimensionamento automatico del testo
    });
    const txt = completion.choices[0]?.message?.content?.trim() || 'Il campo si cancella prima di essere letto.';
    judgeCount++;
    hudJudge.textContent=String(judgeCount).padStart(3,'0');
    await showJudgment(txt);
  } catch(e) {
    // motore AI non disponibile: dispositivo senza WebGPU, download del
    // modello fallito (nessuna connessione), oppure la GPU non riesce a
    // eseguirlo dopo averlo scaricato (tipicamente memoria GPU insufficiente)
    console.error(e);
    const eStr = String(e?.message || e);
    let friendly;
    if (eStr.includes('WEBGPU_UNSUPPORTED')) {
      friendly = 'Questo browser/dispositivo non supporta WebGPU,\nnecessario per l\'AI in locale. Serve un telefono\ne un browser recenti (Chrome su Android, Safari su iOS aggiornati).';
    } else if (modelFullyDownloadedOnce) {
      // il download è arrivato al 100%: il problema NON è la connessione,
      // è che il telefono ha scaricato il modello ma non riesce a farlo
      // girare (di solito perché la GPU non ha abbastanza memoria)
      friendly = 'Il modello è stato scaricato ma questo telefono\nnon riesce a eseguirlo (probabile memoria GPU insufficiente).\nProva un modello più leggero (vedi MLC_MODEL_ID nel codice)\no un altro dispositivo.';
    } else {
      friendly = 'AI locale non disponibile.\nControlla la connessione (serve al primo avvio\nper scaricare il modello) e riprova.';
    }
    // messaggio più lungo del solito: è l'unico modo per leggere l'errore
    // vero prima che sparisca, utile se serve segnalarlo per capire la causa esatta
    showDebug(eStr.slice(0,150), 15000);
    if(!silent) await showJudgment(friendly);

    // non lasciare che il giudizio automatico (AUTO_INTERVAL, sezione 9)
    // continui a ritentare da solo ogni minuto dopo un fallimento: se il
    // problema è strutturale (es. GPU troppo debole) si limiterebbe solo a
    // riscaricare centinaia di MB in loop inutilmente. Un click manuale su
    // GIUDICA riarma i tentativi automatici (vedi il listener più sotto).
    autoJudgmentSuspended = true;
  }

  analyzing=false;
  judgeBtn.disabled=false;
  judgeBtn.textContent='▸ GIUDICA';
}

// quanto rimpicciolire il testo del giudizio in base a quanto è lungo: sotto
// JUDGMENT_LEN_FULL_SIZE caratteri resta a dimensione piena, sopra
// JUDGMENT_LEN_MIN_SIZE scende fino a JUDGMENT_MIN_SCALE (fattore, non rem —
// i rem veri e propri sono nel clamp() di #aiJudgment in style.css). Così un
// giudizio lungo si legge tutto invece di sfondare il bordo dello schermo.
const JUDGMENT_LEN_FULL_SIZE = 90;   // fino a questa lunghezza (caratteri): testo a dimensione piena
const JUDGMENT_LEN_MIN_SIZE  = 340;  // da questa lunghezza in su: dimensione minima
const JUDGMENT_MIN_SCALE     = 0.55; // dimensione minima, come frazione di quella piena (1 = piena, 0.55 = 55%)

function judgmentFontScale(len) {
  if (len <= JUDGMENT_LEN_FULL_SIZE) return 1;
  if (len >= JUDGMENT_LEN_MIN_SIZE) return JUDGMENT_MIN_SCALE;
  const t = (len - JUDGMENT_LEN_FULL_SIZE) / (JUDGMENT_LEN_MIN_SIZE - JUDGMENT_LEN_FULL_SIZE);
  return 1 - t * (1 - JUDGMENT_MIN_SCALE);
}

// mostra il giudizio al centro dello schermo (effetto macchina da scrivere),
// lo lascia leggere, poi lo fa scorrere in alto come "traccia" residua (#aiTrace)
async function showJudgment(text) {
  const el=aiJudgment;
  el.innerHTML='';
  const ref=dominantHistory[dominantHistory.length-1]||[255,255,255];
  const [h,s]=toHsl(ref);
  const col=`hsl(${h},${Math.max(s,30)}%,88%)`;
  el.style.color=col;
  el.style.setProperty('--judgment-scale', judgmentFontScale(text.length).toFixed(2)); // testo lungo → carattere più piccolo (vedi #aiJudgment in style.css)
  el.style.top='64%'; // metà inferiore dello schermo, sotto al cerchio pulsante (#pulseCore in style.css, ora più in alto): la traccia in alto (aiTrace) resta invariata più sotto
  // "color" nella transition: dopo la battitura il testo sfuma lentamente
  // dal colore rilevato al bianco (effetto "liquido") — vedi più sotto
  el.style.transition='opacity 0.5s, top 1.4s ease, color 3200ms ease-in-out';
  el.style.opacity='1';

  // effetto macchina da scrivere: un carattere alla volta
  el.innerHTML='<span class="cur" style="opacity:0.4">▌</span>';
  const cursor=el.querySelector('.cur');
  for(const ch of text){
    const sp=document.createElement('span'); sp.textContent=ch;
    el.insertBefore(sp,cursor);
    await new Promise(r=>setTimeout(r,16+Math.random()*20)); // velocità di battitura (ms per carattere)
  }
  cursor.remove();

  // avvia la dissolvenza verso il bianco: dura circa quanto la pausa di
  // lettura qui sotto, così il testo è quasi bianco quando comincia a salire
  el.style.color = '#ffffff';

  await new Promise(r=>setTimeout(r,3500)); // pausa di lettura al centro dello schermo

  // sale verso l'alto e sbiadisce
  el.style.top='8%'; el.style.opacity='0.12';
  await new Promise(r=>setTimeout(r,1400)); // durata dell'animazione di scorrimento

  // resta come traccia leggera in alto
  aiTrace.style.color=col;
  aiTrace.textContent=text;
  aiTrace.style.opacity='0.5';

  el.style.opacity='0';
  await new Promise(r=>setTimeout(r,500));
  el.innerHTML=''; el.style.top='64%'; // metà inferiore dello schermo, sotto al cerchio pulsante (#pulseCore in style.css, ora più in alto): la traccia in alto (aiTrace) resta invariata più sotto

  // la traccia in alto sbiadisce del tutto dopo 20 secondi
  setTimeout(()=>{ aiTrace.style.transition='opacity 3s'; aiTrace.style.opacity='0'; },20000);
}

// ── 11. CONTROLLI ─────────────────────────────────────────────────

// ── selezione manuale del colore ──
// aggiorna il colore mostrato in ciascuno dei 5 quadratini con la palette
// corrente, e lo stato "selezionato" (bordo bianco) in base a manualSelection.
// Chiamata da loop() (sezione 9) ogni volta che la palette viene ricalcolata.
function updatePaletteSwatches() {
  swatchEls.forEach((el, i) => {
    if (i < 5) { // le prime 5 = colori della palette
      const rgb = currentPalette[i];
      el.style.background = rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : '#1a1a1a';
    }
    const isThisSelected = i < 5
      ? (manualSelection?.type === 'palette' && manualSelection.index === i)
      : !manualSelection; // l'ultimo quadratino (AUTO) è "selezionato" quando non c'è scelta manuale
    el.classList.toggle('selected', isThisSelected);
  });
}

// clic su un quadratino: seleziona quel colore della palette (o annulla se già selezionato), oppure torna ad automatico (AUTO)
swatchEls.forEach((el, i) => {
  el.addEventListener('click', () => {
    if (i >= 5) { // quadratino AUTO
      manualSelection = null;
    } else if (manualSelection?.type === 'palette' && manualSelection.index === i) {
      manualSelection = null; // ri-clic sullo stesso colore: torna ad automatico
    } else {
      manualSelection = { type: 'palette', index: i };
    }
    updatePaletteSwatches();
  });
});

// clic sull'anteprima pixelata: seleziona il colore di quel punto preciso,
// e lo segue in tempo reale finché non viene scelto qualcos'altro. Le
// coordinate sono salvate come frazione (0-1) della larghezza/altezza,
// così restano valide anche se la risoluzione (slider) cambia dopo.
previewCanvas.addEventListener('click', e => {
  const rect = previewCanvas.getBoundingClientRect();
  manualSelection = {
    type: 'point',
    xFrac: (e.clientX - rect.left) / rect.width,
    yFrac: (e.clientY - rect.top) / rect.height,
  };
  updatePaletteSwatches(); // nessun quadratino selezionato, ma AUTO deve smettere di esserlo
});

updatePaletteSwatches(); // stato iniziale: nessuna palette ancora, ma AUTO va mostrato come attivo fin da subito

// primo click sulla pagina: attiva audio + webcam e avvia il loop
document.body.addEventListener("click", function handler(e){
  if(e.target.id==='muteBtn'||e.target.id==='camBtn'||e.target.id==='judgeBtn'||e.target.id==='preview'||e.target.closest('#paletteSwatches')) return;
  if(camActive) return;
  document.body.removeEventListener("click",handler);

  initAudio();

  navigator.mediaDevices.getUserMedia({video:true})
    .then(stream=>{
      window._camStream=stream;
      video.srcObject=stream;
      video.play();
      camActive=true;
      camBtn.textContent='CAM OFF';
      requestAnimationFrame(loop);
    })
    .catch(()=>{ showDebug('Webcam non accessibile. Controlla i permessi del browser.'); });
});

// ── MUTE ──────────────────────────────────────────────────────────
muteBtn.addEventListener("click",()=>{
  if(!audioCtx) return;
  isMuted=!isMuted;
  gainNode.gain.setTargetAtTime(isMuted?0:0.02,audioCtx.currentTime,0.1);
  gain2.gain.setTargetAtTime(isMuted?0:0.006,audioCtx.currentTime,0.1);
  muteBtn.textContent=isMuted?'AUDIO ON':'AUDIO OFF';
});

// ── CAM TOGGLE ────────────────────────────────────────────────────
camBtn.addEventListener("click", async()=>{
  if(!camActive && !window._camStream) {
    // prima attivazione (se l'utente usa il bottone invece del click sulla pagina)
    try {
      initAudio();
      const stream=await navigator.mediaDevices.getUserMedia({video:true});
      window._camStream=stream; video.srcObject=stream; await video.play();
      camActive=true; camBtn.textContent='CAM OFF';
      camBtn.style.borderColor=''; camBtn.style.color='';
      requestAnimationFrame(loop);
    } catch(e){ showDebug('Webcam non accessibile: '+e.message); }
    return;
  }
  camActive=!camActive;
  if(camActive){
    // riaccendi
    try {
      const stream=await navigator.mediaDevices.getUserMedia({video:true});
      window._camStream=stream; video.srcObject=stream; await video.play();
      camBtn.textContent='CAM OFF'; camBtn.style.borderColor=''; camBtn.style.color='';
    } catch(e){ camActive=false; showDebug('Webcam non accessibile: '+e.message); }
  } else {
    // spegni — stop dei track = LED della webcam spento
    if(window._camStream){ window._camStream.getTracks().forEach(t=>t.stop()); window._camStream=null; }
    video.srcObject=null;
    camBtn.textContent='CAM ON';
    camBtn.style.borderColor='rgba(255,80,80,0.5)';
    camBtn.style.color='rgba(255,120,120,0.7)';
  }
});

// ── GIUDICA ───────────────────────────────────────────────────────
judgeBtn.addEventListener("click",()=>{
  autoJudgmentSuspended = false; // un click manuale riarma i tentativi automatici (vedi sezione 3/9/10)
  requestJudgment(false);
});

// avvia subito il loop (anche senza cam attiva, per animare le particelle di sfondo)
requestAnimationFrame(loop);
