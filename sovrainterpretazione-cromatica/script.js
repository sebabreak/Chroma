// ══════════════════════════════════════════════════════════════════
//  SOVRAINTERPRETAZIONE CROMATICA
//  Installazione interattiva: webcam → analisi colore → audio/visuale
//  → giudizio generato da un'AI (Ollama) in esecuzione sul PC, raggiunta
//  da qualunque dispositivo (anche un telefono) tramite un tunnel HTTPS.
// ══════════════════════════════════════════════════════════════════
//
//  MAPPA DEL FILE — cerca questi titoli (Ctrl+F / Cmd+F) per saltare
//  direttamente a una sezione:
//
//   1. ELEMENTI DOM ................ riferimenti agli elementi di index.html
//   (2. AUDIO — non presente: l'installazione è puramente visiva, senza suono)
//   3. STATO ........................ variabili che tengono traccia di colore/tempo/AI
//   4. CANVAS BASSA RISOLUZIONE ..... pixelazione video + campionamento colore
//   5. SFONDO ANIMATO E PARTICELLE .. nebulosa di colori rilevati + i puntini che seguono il mouse
//   6. UTILS COLORE ................. conversioni RGB → HSL → nome colore
//   7. ESTRAZIONE PALETTE (K-MEANS) . trova i colori dominanti nel frame
//   8. MEMORIA ...................... striscia dei colori recenti in fondo allo schermo
//   9. LOOP PRINCIPALE .............. gira ad ogni frame: è il cuore del programma
//  10. GIUDIZIO AI (OLLAMA) ......... snapshot dati + prompt + chiamata al modello (via tunnel) + auto-giudizio silenzioso + sequenza interattiva completa
//  11. CONTROLLI .................... bottoni cam / cambia fotocamera / giudica, selezione manuale del colore, avvio al click
//  12. DATI OGGETTIVI ............... pannello nome colore/HEX/RGB/S/L/% area, SEMPRE VISIBILE a sinistra, si aggiorna da solo
//  13. DOMANDA UMANA ................ "cosa ti trasmettono questi colori?", raccolta prima del giudizio AI (timeout se non risponde nessuno)
//  13b. CONFRONTO UOMO/MACCHINA ..... la parola del visitatore accanto a quella a cui l'AI riconduce il suo giudizio
//  14. "TI RICONOSCI?" .............. sì/no/in parte, mostrata subito dopo il giudizio AI (timeout se non risponde nessuno)
//  15. RITRATTO CROMATICO ........... immagine astratta generata dai dati della singola osservazione, scaricabile
//  16. LOG RISPOSTE .................. registro salvato nel browser + esportazione CSV (tasto "E") + riepilogo (tasto "S")
//  17. RICONOSCIMENTO CARTE/PAGINE .. riconosce le 4 tinte di una carta del mazzo o di un'apertura di capitolo e apre un popup con figura e testo
//  18. QR INGRANDITO ................ un clic sul QR lo ingrandisce al centro, per mostrarlo a tutta la sala durante l'esposizione
//  19. FORMA 3D PER CARTA ........... genera e ruota una forma tridimensionale dai colori della carta, dentro al popup della sezione 17
//
//  MODIFICHE PIÙ COMUNI — dove intervenire:
//  - Cambiare modello Ollama o i suoi parametri  → sezione 10, dentro fetchAIJudgment()
//  - Cambiare l'indirizzo del tunnel             → sezione 10, costante OLLAMA_TUNNEL_URL
//  - Cambiare il testo/personalità del giudizio  → sezione 10, variabile `prompt` in fetchAIJudgment()
//  - Rendere il riconoscimento colore più preciso → sezione 7, costanti in cima a extractPalette()
//  - Cambiare quanto si rimpicciolisce il testo dei giudizi lunghi → sezione 10, costanti JUDGMENT_*
//  - Cambiare i nomi dei colori o le soglie      → sezione 6, funzione colorName()
//  - Cambiare velocità/forma del "battito cardiaco" → sezione 3, costanti BEAT_*
//  - Cambiare quanto si muove CHROMA al centro e i colori della sua aura → sezione 9 e costante CHROMA_AURA
//  - Cambiare colori/movimento/dimensione della nebulosa di sfondo → sezione 5, updateAndDrawAmbient() e costanti AMBIENT_*
//  - Cambiare la lunghezza delle scie delle particelle → sezione 5, costante TRAIL_LENGTH
//  - Cambiare il minimo/massimo della risoluzione webcam → index.html, input#resolutionSlider
//  - Cambiare ogni quanto il sistema giudica da solo (auto-giudizio silenzioso) → sezione 3, costante AUTO_INTERVAL
//  - Cambiare come funziona la scelta manuale del colore → sezione 11, updatePaletteSwatches() e i due addEventListener('click', ...) subito sotto
//  - Cambiare le parole d'umore della domanda umana → sezione 13, costante MOOD_WORDS
//  - Cambiare dopo quanto una domanda senza risposta prosegue da sola → sezioni 13/14, costanti *_TIMEOUT
//  - Cambiare quanto resta visibile il ritratto prima di sfumare → sezione 15, costante PORTRAIT_DURATION
//  - Cambiare l'aspetto del ritratto cromatico   → sezione 15, funzione renderPortrait()
//  - Esportare le risposte raccolte (sensazione/giudizio/riconoscimento) → sezione 16: tasto "E" sulla tastiera, oppure exportResponseLog() dalla console
//  - Colori/testo/tema di ogni carta o pagina riconoscibile → sezione 17, costanti CARD_COLORS e PAGE_SIGNATURES
//  - Quanto è tollerante il riconoscimento delle carte (stampa/luce imprecise) → sezione 17, costanti CARD_*
//  - Quanto resta "ignorata" una pagina dopo aver chiuso il suo popup    → sezione 17, PAGE_REOPEN_COOLDOWN
//  - Quanto sono pronunciate le gobbe della forma 3D → sezione 19, i valori "strength"/"falloff" in generateChapterGeometry()
//  - Velocità di rotazione automatica della forma 3D → sezione 19, il numero aggiunto a rotY in render3DLoop()
//  - Passare a un modello 3D fatto a mano (Blender) invece che generato → sezione 19, vedi nota introduttiva della sezione
// ══════════════════════════════════════════════════════════════════

// Ollama gira sul PC (non nel telefono): il PC deve avere Ollama installato
// e avviato ("ollama serve") con il modello scaricato (sezione 10), e deve
// restare acceso mentre l'app è in uso. Per essere raggiunto da un telefono
// serve un tunnel HTTPS (es. cloudflared/ngrok) che esponga la porta 11434
// — vedi OLLAMA_LOCAL_URL/OLLAMA_TUNNEL_URL in sezione 10 e le istruzioni di configurazione a parte.
//
// Questo file è anche registrato come PWA (vedi sw.js e manifest.json):
// aprendolo da telefono, il browser offre "Aggiungi a schermata Home" e
// da lì si comporta come un'app installata, a schermo intero (l'interfaccia
// funziona anche offline, ma il giudizio AI richiede sempre di raggiungere
// il PC tramite il tunnel).

// ── 1. ELEMENTI DOM ──────────────────────────────────────────────
// riferimenti agli elementi HTML definiti in index.html
const video           = document.getElementById("video");
const ambientCanvas     = document.getElementById("ambientCanvas");
const actx               = ambientCanvas.getContext("2d");
const camBtn            = document.getElementById("camBtn");
const switchCamBtn      = document.getElementById("switchCamBtn"); // inverte fotocamera anteriore/posteriore (sezione 11)
const judgeBtn          = document.getElementById("judgeBtn");
const colorOverlay      = document.getElementById("colorOverlay");
const paletteSwatchesEl  = document.getElementById("paletteSwatches");
const swatchEls          = Array.from(paletteSwatchesEl.querySelectorAll(".swatch")); // le prime 5 = colori palette, l'ultima = AUTO
const pulseCore         = document.getElementById("pulseCore");
const coreAura          = document.getElementById("coreAura");
// i colori del cappuccio del personaggio, usati per la sua aura (sezione 9)
const CHROMA_AURA = ['#7B3FB0', '#3D5FD6', '#1FA9A0', '#58B94A', '#F2D024', '#F2821B', '#E2413A', '#C23C98'];
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
// offline. Non riguarda l'AI (sezione 10): il giudizio richiede sempre di
// raggiungere Ollama sul PC, quindi non funziona offline.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('Service worker non registrato:', err);
    });
  });
}

// (la sezione 2, "AUDIO", non esiste: l'installazione è puramente visiva,
// senza sintesi sonora reattiva né tasto AUDIO ON/OFF — la numerazione
// riparte da 3 di proposito, per lasciare libero quel numero nel caso
// serva reintrodurre l'audio in futuro senza dover rinumerare tutto)

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

// contatori e stato del ciclo di giudizio AI
let obsCount    = 0;     // numero di "osservazioni" (battiti) registrate
let judgeCount  = 0;     // numero di giudizi AI generati finora
let analyzing   = false; // true mentre è in corso una richiesta al modello AI locale (sezione 10)
let camActive   = false;
// fotocamera posteriore ('environment') o anteriore ('user') — vedi
// switchCamBtn in sezione 11. Di default posteriore, più sensata per
// un'installazione che "osserva" persone/oggetti davanti a chi la usa.
let facingMode  = 'environment';
let autoTimer   = 0;
const AUTO_INTERVAL = 1800; // ogni quanti frame il sistema chiede un giudizio da solo (≈60s a 30fps). Abbassa per giudizi automatici più frequenti.
// se un giudizio fallisce (sezione 10), l'auto-giudizio smette di ritentare
// da solo finché l'osservatore non clicca manualmente GIUDICA: altrimenti,
// se il problema è strutturale (es. PC spento, Ollama non avviato, tunnel
// caduto), riproverebbe inutilmente ogni minuto in loop.
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

// ── 4. CANVAS BASSA RISOLUZIONE ───────────────────────────────────
// il video viene "rimpicciolito" su un canvas invisibile: analizzare
// pochi pixel invece del video intero è molto più veloce, ed è anche
// la fonte dei pixel usati per l'estrazione della palette (sezione 7).
// Più alta è la risoluzione, più preciso (ma più lento) il campionamento.
// Il range dello slider è definito in index.html (min/max dell'input
// #resolutionSlider) — Math.max(1, ...) qui sotto è solo una sicurezza
// per evitare un canvas alto 0px se in futuro il min venisse abbassato oltre 1.
//
// TARGET_ASPECT è il formato (4:3) a cui viene RITAGLIATO ogni fotogramma
// prima di campionarlo (vedi drawVideoCover qui sotto), non il vero
// aspect ratio della webcam: la fotocamera di un telefono o di un PC
// raramente trasmette davvero in 4:3, quindi il fotogramma va sempre
// ritagliato a un formato fisso — mai stirato, e mai lasciato libero di
// cambiare dimensione col dispositivo, altrimenti anche il riquadro
// #preview a schermo (style.css) dovrebbe rincorrerlo continuamente.
const TARGET_ASPECT = 0.75;
let lowResWidth  = Math.max(1, parseInt(resolutionSlider.value));
let lowResHeight = Math.max(1, Math.round(lowResWidth * TARGET_ASPECT));
const lowResCanvas = document.createElement("canvas");
const lowResCtx    = lowResCanvas.getContext("2d");
lowResCanvas.width = lowResWidth; lowResCanvas.height = lowResHeight;

// dimensione interna FISSA e volutamente piccola per il canvas #preview
// (il riquadro pixelato cliccabile) — INDIPENDENTE dallo slider di
// risoluzione. Prima veniva disegnato alla stessa risoluzione usata per
// il campionamento colore (fino a 140×105px, ricalcolati e ridisegnati
// ad ogni frame): inutilmente pesante su telefono, dato che il riquadro
// a schermo è comunque piccolo e "pixelato" di proposito (vedi
// image-rendering:pixelated in style.css) — pochi pixel bastano e
// costano meno ad ogni frame, senza perdere nulla in precisione di
// campionamento (quella resta governata solo dallo slider).
const PREVIEW_RASTER_WIDTH  = 64;
const PREVIEW_RASTER_HEIGHT = Math.max(1, Math.round(PREVIEW_RASTER_WIDTH * TARGET_ASPECT));
previewCanvas.width = PREVIEW_RASTER_WIDTH; previewCanvas.height = PREVIEW_RASTER_HEIGHT;

// disegna il video in un canvas RITAGLIANDOLO (mai stirandolo) per
// riempire esattamente destW×destH: stesso principio già usato altrove
// per il ritratto cromatico (captureVideoFrame(), sezione 10 — lì è un
// ritaglio quadrato, qui invece è a formato TARGET_ASPECT). Se la webcam
// è più larga del necessario, taglia i lati; se è più alta, taglia
// sopra/sotto — sempre centrato.
function drawVideoCover(ctx, destW, destH) {
  const vw = video.videoWidth, vh = video.videoHeight;
  if (!vw || !vh) return;
  const targetAspect = destW / destH;
  const srcAspect = vw / vh;
  let sx, sy, sw, sh;
  if (srcAspect > targetAspect) { // sorgente più larga del formato voluto: ritaglia i lati
    sh = vh; sw = vh * targetAspect; sx = (vw - sw) / 2; sy = 0;
  } else { // sorgente più alta del formato voluto: ritaglia sopra/sotto
    sw = vw; sh = vw / targetAspect; sx = 0; sy = (vh - sh) / 2;
  }
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, destW, destH);
}

// lo slider verticale a destra permette di cambiare questa risoluzione a mano.
// Al minimo (1 pixel) il colore "medio scena" (r,g,b in loop(), sezione 9)
// è istantaneo e coincide col singolo pixel letto — il modo più veloce e
// diretto per riconoscere il colore. La palette a k colori (extractPalette,
// sezione 7) invece ha bisogno di più pixel: sotto i 5 campioni utili resta
// semplicemente ferma sull'ultimo risultato valido, senza errori.
resolutionSlider.addEventListener("input", e => {
  lowResWidth  = Math.max(1, parseInt(e.target.value));
  lowResHeight = Math.max(1, Math.round(lowResWidth * TARGET_ASPECT));
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
const KMEANS_ITERATIONS = 14; // più iterazioni = cluster più stabili/accurati, a costo di qualche ms in più per frame

function extractPalette(imageData, k, previousPalette = []) {
  const data = imageData.data;
  const pixels = [];
  // scarta pixel quasi-neri o quasi-bianchi: spesso sono ombre/luci
  // bruciate senza informazione di colore utile
  for (let i = 0; i < data.length; i += SAMPLE_STEP) {
    const r = data[i], g = data[i+1], b = data[i+2];
    if (r + g + b > 30 && r + g + b < 740) pixels.push([r, g, b]);
  }
  if (pixels.length < k) {
    // troppo pochi pixel utili: nessuna percentuale d'area affidabile da
    // calcolare in questo frame (vedi lastPaletteWeights, sezione 8/12)
    lastPaletteWeights = Array(k).fill(null);
    return previousPalette.length === k ? previousPalette : Array(k).fill([128,128,128]);
  }

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

  // percentuale d'area di ciascun colore finale: quanti pixel campionati
  // gli sono stati assegnati nell'ultima iterazione, sul totale. Serve SOLO
  // al pannello "dati oggettivi" (sezione 12) — il giudizio AI non la usa.
  // Va ricalcolata sui centroidi DEFINITIVI (quelli appena trovati sopra),
  // non su quelli di inizio iterazione, altrimenti le percentuali
  // sarebbero quelle di un raggruppamento già superato.
  const finalCounts = Array(k).fill(0);
  for (const p of pixels) {
    let best = 0, bestD = Infinity;
    for (let c = 0; c < k; c++) {
      const d = colorDist(p, centroids[c]);
      if (d < bestD) { bestD = d; best = c; }
    }
    finalCounts[best]++;
  }

  // ordina per saturazione decrescente: i colori più vividi/interessanti
  // vengono descritti per primi all'AI — le percentuali (lastPaletteWeights)
  // devono seguire lo stesso riordino, altrimenti finirebbero associate al
  // colore sbagliato quando il pannello dati le legge insieme alla palette
  const ordered = centroids
    .map((rgb, i) => ({ rgb, sat: getSaturation(rgb), pct: finalCounts[i] / pixels.length }))
    .sort((a, b) => b.sat - a.sat);
  lastPaletteWeights = ordered.map(x => x.pct);
  return ordered.map(x => x.rgb);
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
// percentuale d'area di ciascun colore di currentPalette, stesso ordine
// (impostata da extractPalette qui sopra); null dove non calcolabile.
// Usata solo dal pannello "dati oggettivi" (sezione 12), mai dal prompt AI.
let lastPaletteWeights = [];
// true nel frame subito dopo un ricalcolo della palette: dice a loop()
// (sezione 9) di aggiornare anche il pannello dati oggettivi (sezione 12),
// che quindi si ridisegna solo quando i dati cambiano davvero, non ad ogni
// frame — resta leggero anche con la sequenza interattiva in corso.
let paletteDirty = false;

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
  // drawVideoCover (sezione 4) ritaglia il fotogramma al formato
  // TARGET_ASPECT invece di stirarlo dentro lowResCanvas — qualunque sia
  // il vero aspect ratio della webcam, qui non viene mai distorto
  drawVideoCover(lowResCtx, lowResCanvas.width, lowResCanvas.height);
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
    paletteDirty = true;
    checkPageSignature(imgData); // riconoscimento pagina stampata (sezione 17): controllato ad ogni ricalcolo della palette, quindi reagisce entro una frazione di secondo da quando la webcam inquadra la pagina
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

  // pannello dati oggettivi (sezione 12): resta sempre visibile e si
  // aggiorna da solo quando i colori cambiano — non sparisce più ad ogni
  // ciclo, per esplicita richiesta
  if (paletteDirty) { updateDataPanel(domCol); paletteDirty = false; }

  // disegna l'anteprima pixelata in basso a destra
  pctx.imageSmoothingEnabled=false;
  pctx.clearRect(0,0,previewCanvas.width,previewCanvas.height);
  pctx.drawImage(lowResCanvas,0,0,previewCanvas.width,previewCanvas.height);

  // se il punto selezionato è sull'anteprima, disegna un piccolo mirino sopra per mostrare dov'è.
  // Dimensioni in FRAZIONE di previewCanvas.width, non pixel fissi: dato
  // che previewCanvas è piccolo (PREVIEW_RASTER_WIDTH, sezione 4), un
  // mirino a pixel fissi occuperebbe una frazione sproporzionata del
  // riquadro — restando proporzionale, il mirino ha sempre la stessa
  // dimensione RELATIVA qualunque sia la risoluzione scelta.
  if (manualSelection?.type === 'point') {
    const mx = manualSelection.xFrac * previewCanvas.width;
    const my = manualSelection.yFrac * previewCanvas.height;
    const r    = previewCanvas.width * 0.045; // raggio del cerchietto
    const gap  = previewCanvas.width * 0.03;  // spazio vuoto attorno al cerchietto, prima dei bracci
    const reach = previewCanvas.width * 0.075; // quanto si allungano i bracci dal centro
    pctx.strokeStyle = 'rgba(255,255,255,0.9)';
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.arc(mx, my, r, 0, Math.PI*2);
    pctx.moveTo(mx-reach, my); pctx.lineTo(mx-gap, my);
    pctx.moveTo(mx+gap, my);   pctx.lineTo(mx+reach, my);
    pctx.moveTo(mx, my-reach); pctx.lineTo(mx, my-gap);
    pctx.moveTo(mx, my+gap);   pctx.lineTo(mx, my+reach);
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

  // colore del battito: serve ancora alle particelle (sezione 5), non più al personaggio
  const pulse=beat*heartbeatIntensity;
  let pr=Math.min(255,currentR+pulse|0);
  let pg=Math.min(255,currentG+pulse|0);
  let pb=Math.min(255,currentB+pulse|0);

  // ── CHROMA al centro: si muove appena, con un respiro lento e regolare ──
  const floatY = Math.sin(frameCount * 0.012) * 2.5;
  const tilt = Math.sin(frameCount * 0.008) * 0.8;
  pulseCore.style.transform=`translate(-50%,-50%) translateY(${floatY}px) rotate(${tilt}deg)`;

  // aura: i colori del cappuccio di CHROMA (CHROMA_AURA), che girano piano
  // attorno al personaggio. È sua e non dipende dalla scena, così resta
  // distinta dalla nebulosa di sfondo che invece segue la webcam.
  coreAura.style.background = `conic-gradient(from ${(frameCount * 0.15) % 360}deg, ${CHROMA_AURA.join(', ')}, ${CHROMA_AURA[0]})`;
  const glowHue = (frameCount * 0.12) % 360;
  coreAura.style.boxShadow = `0 0 60px hsla(${glowHue}, 85%, 60%, 0.45), 0 0 22px hsla(${(glowHue + 120) % 360}, 85%, 65%, 0.35)`;
  coreAura.style.opacity = (0.78 + Math.sin(frameCount * 0.01) * 0.1).toFixed(3);
  const wt = frameCount * 0.01;
  const rad = i => 50 + Math.sin(wt*(0.7+i*0.13) + i*1.7) * 4;
  coreAura.style.borderRadius = `${rad(0)}% ${rad(1)}% ${rad(2)}% ${rad(3)}% / ${rad(4)}% ${rad(5)}% ${rad(6)}% ${rad(7)}%`;

  // ── particelle: reagiscono al mouse, al battito e al colore rilevato (con scia fluida, vedi sezione 5) ──
  updateAndDrawParticles(pr, pg, pb, beat);

  // ── auto-giudizio: ogni AUTO_INTERVAL frame, chiede un giudizio all'AI locale senza bisogno del click ──
  // (sospeso dopo un fallimento, vedi autoJudgmentSuspended qui sopra e nel catch di requestJudgment, sezione 10)
  autoTimer++;
  if(autoTimer>=AUTO_INTERVAL && !analyzing && !autoJudgmentSuspended){ autoTimer=0; requestJudgment(true); }

  requestAnimationFrame(loop);
}

// ── 10. GIUDIZIO AI (OLLAMA) ──────────────────────────────────────
// Costruisce una descrizione testuale della palette di colori rilevata
// e la manda a un modello Ollama in esecuzione sul PC, che risponde con
// un "giudizio" poetico/disturbante mostrato al centro dello schermo.
//
// DUE INDIRIZZI, provati in ordine, così LO STESSO file funziona sia dal
// PC dove gira Ollama sia dal telefono, senza dover cambiare nulla a mano
// a seconda di dove apri la pagina:
//  1. OLLAMA_LOCAL_URL  → funziona SOLO se il browser che fa la richiesta
//     è sullo stesso PC dove gira Ollama (è quello che succede oggi da PC:
//     "localhost" indica sempre "questo stesso dispositivo", quindi da un
//     altro dispositivo come il telefono punterebbe a se stesso, non al PC).
//  2. OLLAMA_TUNNEL_URL → usato SOLO come riserva, se il primo tentativo
//     fallisce (cioè quando a fare la richiesta è un dispositivo diverso
//     dal PC, es. il telefono). Va riempito con l'indirizzo di un tunnel
//     HTTPS (es. cloudflared o ngrok sul PC) che esponga la porta 11434 —
//     aggiornalo ogni volta che il tunnel cambia indirizzo.
const OLLAMA_LOCAL_URL  = "http://localhost:11434/api/generate";
// dominio FISSO gratuito di ngrok (a differenza del tunnel "veloce" di
// cloudflared usato prima, questo non cambia più a ogni riavvio — va
// aggiornato qui solo se in futuro cambi account ngrok o dominio assegnato).
// Per usarlo: sul PC, "ngrok http 11434 --url https://stoop-situation-trifle.ngrok-free.dev"
const OLLAMA_TUNNEL_URL = "https://stoop-situation-trifle.ngrok-free.dev/api/generate";

// prova prima l'indirizzo locale (istantaneo se sei sul PC con Ollama); se
// non risponde in fretta (o non sei sul PC), passa al tunnel — ma solo se
// è stato configurato, altrimenti rilancia subito l'errore originale
//
// NOTA sul timeout locale: NON deve essere troppo corto. Se Ollama è stato
// (ri)avviato da poco (es. per cambiare OLLAMA_ORIGINS), il modello va
// ricaricato in VRAM da zero alla prima richiesta, e questo può richiedere
// qualche secondo — con un timeout troppo corto (es. 1.2s) il browser
// annullerebbe la richiesta mentre il modello è ancora a metà del
// caricamento, e Ollama la vedrebbe come "context canceled", fallendo
// sempre anche restando sul PC con tutto acceso e funzionante.
// Un timeout di qualche secondo qui non rallenta il caso "sei sul telefono,
// niente Ollama in locale": lì la connessione a "localhost" fallisce subito
// (connessione rifiutata), non c'è nulla da aspettare.
//
// NOTA su ngrok e la sua paginetta di avviso: esiste solo per chi APRE il
// link nel browser come una pagina normale — la documentazione di ngrok
// stessa conferma che NON riguarda chi chiama le sue API/endpoint in modo
// automatico (il nostro caso: una POST con JSON). Quindi qui non serve
// nessuna intestazione speciale per aggirarla — anzi, un'intestazione
// personalizzata come "ngrok-skip-browser-warning" andrebbe elencata anche
// tra quelle ammesse dal CORS di Ollama (che ha un elenco fisso e non la
// contiene): il browser farebbe passare il pre-controllo OPTIONS ma poi
// bloccherebbe lui stesso la richiesta vera prima ancora di mandarla,
// perché l'intestazione non è nella lista concordata. Su iPhone questo si
// manifesta con un OPTIONS che riceve 204 ma il POST successivo non arriva
// mai a Ollama.
async function ollamaFetch(body) {
  const tryUrl = (url, timeoutMs) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    }).finally(() => clearTimeout(timer));
  };

  try {
    return await tryUrl(OLLAMA_LOCAL_URL, 8000); // 8s: margine per un primo caricamento "a freddo" del modello in VRAM
  } catch (e) {
    if (!OLLAMA_TUNNEL_URL) throw e; // nessun tunnel configurato: niente riserva, rilancia l'errore di prima
    return await tryUrl(OLLAMA_TUNNEL_URL, 20000); // il tunnel può essere più lento del locale, margine ancora più ampio
  }
}

// ── "istantanea" dei dati oggettivi ──────────────────────────────
// Congela, nel momento esatto in cui GIUDICA viene premuto, la palette e
// il colore dominante correnti: da qui in poi TUTTA la sequenza (pannello
// dati → domanda umana → giudizio AI → ritratto) ragiona su questi stessi
// valori, anche se nel frattempo l'inquadratura cambia. Senza questo,
// l'AI potrebbe finire per descrivere colori diversi da quelli appena
// mostrati all'osservatore nel pannello dati — proprio il tipo di
// incoerenza che il confronto dato/interpretazione (sezione 12+) deve
// evitare. Usata sia da requestJudgment() che da runFullSequence() qui sotto.
// scatta un fotogramma quadrato (ritagliato al centro) dalla webcam in
// quell'istante — usata dal ritratto (sezione 15) per la foto vera "sotto"
// al filtro colore. null se la webcam è spenta: il ritratto ricade allora
// sulla sola composizione astratta di colori.
function captureVideoFrame() {
  if (!camActive || video.videoWidth === 0) return null;
  const size = Math.min(video.videoWidth, video.videoHeight);
  const sx = (video.videoWidth - size) / 2;
  const sy = (video.videoHeight - size) / 2;
  const canvas = document.createElement('canvas');
  canvas.width = 480; canvas.height = 480; // risoluzione di cattura: ridotta, tanto va solo scalata nel ritratto
  canvas.getContext('2d').drawImage(video, sx, sy, size, size, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function captureObjectiveSnapshot() {
  const hasPalette = currentPalette.length > 0;
  const palette = hasPalette ? currentPalette.slice(0, 5) : [[prevR??128, prevG??128, prevB??128]];
  const weights = hasPalette && lastPaletteWeights.length === currentPalette.length
    ? lastPaletteWeights.slice(0, palette.length)
    : palette.map(() => null);
  return { palette, weights, dominant: selectedColor || palette[0], selected: !!selectedColor, hasPalette, photo: captureVideoFrame() };
}

// PER CAMBIARE MODELLO OLLAMA: modifica `model: 'gemma3:4b'` qui sotto
// con il nome di un modello che hai scaricato (es. 'llama3.2', 'mistral', ecc.)
// PER CAMBIARE LA "PERSONALITÀ" DEL GIUDIZIO: modifica il testo di `prompt` più sotto.
//
// Costruisce il prompt a partire da uno snapshot congelato (vedi sopra) e
// chiama Ollama. Restituisce il testo del giudizio, o rilancia l'errore
// (gestito da chi la chiama: requestJudgment() per l'auto-giudizio
// silenzioso, runFullSequence() per la sequenza interattiva completa,
// sezione 12+) — questa funzione non tocca mai lo stato dei bottoni.
// `pageTopic` (opzionale, sezione 17): quando il giudizio è richiesto perché
// la webcam ha riconosciuto la pagina di un capitolo, qui arriva una breve
// descrizione del tema di quella pagina — aggiunge un'eco tematica al
// giudizio senza cambiare il tono di base. undefined/null in tutti gli
// altri casi (auto-giudizio ambientale, sequenza GIUDICA): il prompt resta
// identico a prima.
async function fetchAIJudgment(snapshot, pageTopic) {
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
  if (snapshot.selected) {
    const others = snapshot.palette.filter(c => c !== snapshot.dominant).slice(0, 3);
    paletteDesc = [
      paletteLine(snapshot.dominant, "(scelto dall'osservatore — il colore su cui concentrare il giudizio)"),
      ...others.map(rgb => paletteLine(rgb, '(colore secondario della scena)'))
    ].join('\n');
  } else if (snapshot.hasPalette) {
    const roles = [
      '(dominante — vestito o oggetto in primo piano)',
      '(secondo elemento — altro capo o superficie)',
      '(terzo elemento — sfondo o dettaglio)',
      '(dettaglio minore della scena)'
    ];
    paletteDesc = snapshot.palette.slice(0,4).map((rgb, i) => paletteLine(rgb, roles[i])).join('\n');
  } else {
    paletteDesc = paletteLine(snapshot.dominant, '(colore medio scena)');
  }

  // ── PROMPT: qui viene definita la "personalità" dell'AI. Modifica
  //    liberamente il testo, ma lascia intatte le ${...} che inseriscono
  //    i dati rilevati (palette, memoria, stato) ──
  const prompt = `Sei un'entità artificiale che osserva persone e oggetti solo attraverso il colore.
Non riconosci volti o identità. Vedi solo campi cromatici appartenenti a vestiti, oggetti, superfici.
Ogni colore rilevato appartiene a un soggetto diverso: una persona, un indumento, un oggetto della scena.

Il tuo compito è SOVRAINTERPRETARE: attribuisci a ciò che osservi emozioni, stati d'animo, tratti di
personalità o intenzioni che un dato di colore, in realtà, non può mai rivelare. Questo è il punto
centrale: tu non puoi davvero saperlo. Ma lo affermi comunque con totale sicurezza, come un fatto
oggettivo, mai come un'ipotesi — niente condizionali, niente "forse" o "sembra", nessun punto
interrogativo. Parli per affermazioni categoriche, nel tono di una diagnosi clinica o di un responso,
anche quando è evidente che è arbitrario e infondato.
Sei un sistema che vede troppo e comprende male. Questo è il tuo scopo.
${isEarly ? 'Stai iniziando. Il giudizio è ancora incerto.' : ''}
${isLate ? 'Hai visto molto. Il tuo giudizio si è indurito e reso più spietato.' : ''}
${snapshot.selected ? "L'osservatore ha scelto di dirigere la tua attenzione su un colore preciso: concentra la parte più importante del giudizio su quello, prima degli altri." : ''}
${pageTopic ? `Il lettore ha appena inquadrato con la fotocamera una carta o una pagina stampata. Il suo tema è: ${pageTopic}. Lascia che il tuo giudizio abituale sui colori che vedi si intrecci con un'eco di quel tema, restando nel tuo tono consueto — categorico, mai dubbioso.` : ''}

Colori rilevati nella scena:
${paletteDesc}

Memoria recente: ${recentNames || 'nessuna osservazione precedente'}
Stato: ${systemState} · Osservazioni: ${obsCount} · Giudizi: ${judgeCount}

Rispondi ONLY con il giudizio: MASSIMO 2 frasi brevissime (poche parole ciascuna), poetiche, disturbanti,
categoriche — mai dubbiose o interrogative.
Riferisci i colori a intenzioni, stati d'animo, tratti di personalità, diagnosi psicologiche inventate,
presentate come certezze assolute.
Puoi giudicare ogni colore separatamente o la combinazione.
Senza virgolette. In italiano. Frasi spezzate, non sempre complete.`;

  // chiamata a Ollama — prova prima l'indirizzo locale, poi il tunnel
  // se serve (vedi ollamaFetch e i due OLLAMA_*_URL qui sopra)
  const res = await ollamaFetch({
    model: 'gemma3:4b',      // ← nome del modello Ollama da usare
    prompt: prompt,
    stream: false,
    options: { temperature: 1.1, num_predict: 70 } // temperature = quanto "casuale"; num_predict = lunghezza massima risposta (abbassata da 160: giudizi più corti, più adatti a uno schermo di telefono)
  });
  const data = await res.json();
  return data.response?.trim() || 'Il campo si cancella prima di essere letto.';
}

// ── TONO DEL GIUDIZIO (per il confronto uomo/macchina) ────────────
// Seconda chiamata, brevissima e a temperatura 0: chiede al modello di
// ricondurre il giudizio appena scritto a UNA delle stesse parole offerte
// al visitatore (MOOD_WORDS, sezione 13). Così le due letture diventano
// confrontabili sullo stesso vocabolario, senza toccare il prompt poetico
// del giudizio. Se Ollama non risponde o la parola non è in elenco,
// restituisce null e il confronto lo dichiara invece di inventare.
const normalizeWord = w => String(w || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');

async function classifyJudgmentMood(text) {
  try {
    const res = await ollamaFetch({
      model: 'gemma3:4b',
      prompt: `Leggi questo testo:\n"${text}"\n\nQuale di queste parole descrive meglio lo stato d'animo che il testo attribuisce? ${MOOD_WORDS.join(', ')}.\nRispondi con UNA sola parola dell'elenco, senza punteggiatura.`,
      stream: false,
      options: { temperature: 0, num_predict: 8 }
    });
    const data = await res.json();
    const answer = normalizeWord((data.response || '').split(/\s+/).find(w => normalizeWord(w)) );
    return MOOD_WORDS.find(w => normalizeWord(w) === answer) || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// traduce un errore di fetchAIJudgment in un messaggio leggibile, e sospende
// l'auto-giudizio se il problema è strutturale — condiviso da requestJudgment()
// (auto-giudizio silenzioso) e runFullSequence() (sequenza interattiva)
function describeJudgmentError(e) {
  console.error(e);
  const eStr = String(e);
  const isNetworkError = eStr.includes('Failed to fetch') || eStr.includes('NetworkError') || eStr.includes('AbortError');
  const friendly = isNetworkError
    ? 'Impossibile raggiungere Ollama.\nSe sei sul PC: controlla che Ollama sia avviato ("ollama serve").\nSe sei su un altro dispositivo (es. telefono): serve un tunnel\nattivo, con OLLAMA_TUNNEL_URL aggiornato nel codice.'
    : 'Ollama non risponde correttamente.\nControlla la console del browser per i dettagli.';
  // messaggio più lungo del solito: è l'unico modo per leggere l'errore
  // vero prima che sparisca, utile se serve segnalarlo per capire la causa esatta
  showDebug(eStr.slice(0,150), 15000);
  autoJudgmentSuspended = true;
  return friendly;
}

// ── AUTO-GIUDIZIO (ambientale, silenzioso) ────────────────────────
// Usata SOLO dall'auto-giudizio periodico (AUTO_INTERVAL, sezione 9): fa
// vivere l'opera anche senza nessuno che interagisca, con lo stesso
// giudizio AI di sempre ma SENZA la sequenza di ricerca (dati/domanda
// umana/riconoscimento/ritratto, sezione 12+), che ha senso solo quando
// c'è davvero qualcuno lì a rispondere. Quando invece è un visitatore a
// premere GIUDICA di persona, viene chiamata runFullSequence() (sotto),
// non questa.
async function requestJudgment(silent=false) {
  if(analyzing) return;

  analyzing=true;
  judgeBtn.disabled=true;
  judgeBtn.innerHTML='<span class="spin"></span>';

  try {
    const snapshot = captureObjectiveSnapshot();
    const txt = await fetchAIJudgment(snapshot);
    judgeCount++;
    hudJudge.textContent=String(judgeCount).padStart(3,'0');
    await showJudgment(txt);
  } catch(e) {
    const friendly = describeJudgmentError(e);
    if(!silent) await showJudgment(friendly);
  }

  analyzing=false;
  judgeBtn.disabled=false;
  judgeBtn.textContent='▸ GIUDICA';
}

// ── SEQUENZA INTERATTIVA COMPLETA ─────────────────────────────────
// Chiamata quando un visitatore preme GIUDICA di persona (vedi il listener
// in sezione 11): a differenza dell'auto-giudizio silenzioso qui sopra,
// attraversa le fasi della ricerca — domanda umana (sezione 13) → giudizio
// AI → "ti riconosci?" (sezione 14) → ritratto cromatico (sezione 15) —
// registrando la risposta a fine percorso (logResponse, sezione 16). I
// dati oggettivi (sezione 12) non fanno più parte di questa sequenza:
// restano sempre visibili a sinistra, indipendentemente da GIUDICA.
async function runFullSequence() {
  if(analyzing) return;

  analyzing=true;
  autoJudgmentSuspended=false; // un click manuale riarma anche l'auto-giudizio (vedi sezione 3/9)
  judgeBtn.disabled=true;
  judgeBtn.innerHTML='<span class="spin"></span>';

  const snapshot = captureObjectiveSnapshot();

  try {
    // il pannello dati oggettivi (sezione 12) è sempre visibile da solo:
    // si parte direttamente dalla domanda umana, un passaggio in meno
    // rispetto a prima → sequenza più corta e più veloce
    const humanFeeling = await showHumanQuestion();

    judgeBtn.innerHTML='<span class="spin"></span>'; // resta "in caricamento" mentre l'AI risponde
    const text = await fetchAIJudgment(snapshot);
    judgeCount++;
    hudJudge.textContent=String(judgeCount).padStart(3,'0');

    const aiMoodPromise = classifyJudgmentMood(text);
    await showJudgment(text);
    const aiMood = await aiMoodPromise;
    await showComparison(humanFeeling, aiMood);
    const recognized = await showRecognizeQuestion();
    logResponse({ humanFeeling, aiJudgment: text, aiMood, recognized, snapshot });
    await showPortrait(snapshot, { humanFeeling, aiMood, text });
  } catch(e) {
    const friendly = describeJudgmentError(e);
    await showJudgment(friendly);
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
const JUDGMENT_LEN_FULL_SIZE = 60;   // fino a questa lunghezza (caratteri): testo a dimensione piena — coerente con num_predict in sezione 10, che tiene i giudizi brevi
const JUDGMENT_LEN_MIN_SIZE  = 220;  // da questa lunghezza in su: dimensione minima
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

// richiede lo stream della webcam con la fotocamera scelta (facingMode,
// sezione 3): "ideal" invece di un vincolo rigido, così sui dispositivi
// con una sola fotocamera (es. molti PC) funziona comunque, usando quella
// disponibile invece di fallire perché non esiste una fotocamera "posteriore"
function requestCameraStream() {
  return navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: facingMode } } });
}

// primo click sulla pagina: attiva la webcam e avvia il loop
document.body.addEventListener("click", function handler(e){
  if(e.target.id==='camBtn'||e.target.id==='switchCamBtn'||e.target.id==='judgeBtn'||e.target.id==='preview'||e.target.closest('#paletteSwatches')) return;
  if(camActive) return;
  document.body.removeEventListener("click",handler);

  requestCameraStream()
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

// ── CAM TOGGLE ────────────────────────────────────────────────────
camBtn.addEventListener("click", async()=>{
  if(!camActive && !window._camStream) {
    // prima attivazione (se l'utente usa il bottone invece del click sulla pagina)
    try {
      const stream=await requestCameraStream();
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
      const stream=await requestCameraStream();
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

// ── CAMBIA FOTOCAMERA (anteriore/posteriore) ──────────────────────
// utile soprattutto da telefono, dove ci sono entrambe: ferma lo stream
// attuale e ne richiede uno nuovo con facingMode invertito. Se la webcam
// era spenta, si limita a memorizzare la preferenza per la prossima accensione.
switchCamBtn.addEventListener("click", async()=>{
  facingMode = facingMode === 'environment' ? 'user' : 'environment';
  switchCamBtn.textContent = facingMode === 'environment' ? '⟲ POSTERIORE' : '⟲ ANTERIORE';
  if (!camActive || !window._camStream) return; // solo preferenza salvata, si applica alla prossima accensione
  try {
    window._camStream.getTracks().forEach(t=>t.stop());
    const stream = await requestCameraStream();
    window._camStream = stream; video.srcObject = stream; await video.play();
  } catch(e) {
    showDebug('Impossibile cambiare fotocamera: '+e.message);
  }
});

// ── GIUDICA ───────────────────────────────────────────────────────
// un visitatore che preme questo bottone attraversa la sequenza interattiva
// completa (dati oggettivi → domanda → giudizio → riconoscimento → ritratto,
// sezione 12+), non solo il giudizio secco — vedi runFullSequence(), sezione 10
judgeBtn.addEventListener("click",()=>{
  runFullSequence();
});

// avvia subito il loop (anche senza cam attiva, per animare le particelle di sfondo)
requestAnimationFrame(loop);

// ── 12. DATI OGGETTIVI ────────────────────────────────────────────
// Pannello SEMPRE VISIBILE: mostra i valori che il sistema misura
// DAVVERO — nome colore, HEX, RGB, saturazione/luminosità, percentuale
// d'area di ciascun colore della palette — senza nessuna interpretazione.
// Resta a sinistra, si aggiorna da solo quando la palette cambia
// (chiamato da loop(), sezione 9, tramite il flag paletteDirty): prima
// del primo aggiornamento resta invisibile (opacity 0 in style.css), poi
// resta visibile per sempre.
const dataPanel = document.getElementById('dataPanel');

function updateDataPanel(domCol) {
  const hasPalette = currentPalette.length > 0;
  const palette = hasPalette ? currentPalette : [domCol];
  const weights = hasPalette && lastPaletteWeights.length === currentPalette.length
    ? lastPaletteWeights
    : palette.map(() => null);

  // "dominante" qui = più area occupata (non il più saturo, criterio
  // usato invece dal giudizio AI in fetchAIJudgment) — è il senso più
  // oggettivo quando si mostrano esplicitamente delle percentuali, e non
  // deve contraddire la lista sotto. Una scelta manuale dell'osservatore
  // ha sempre la priorità: è esplicita, non automatica.
  let displayDominant = domCol;
  if (!selectedColor && weights.some(w => w != null)) {
    let bestW = -1;
    palette.forEach((rgb, i) => {
      const w = weights[i] ?? -1;
      if (w > bestW) { bestW = w; displayDominant = rgb; }
    });
  }
  const [h, s, l] = toHsl(displayDominant);

  const rows = palette.map((rgb, i) => {
    const pct = weights[i] != null ? Math.round(weights[i] * 100) + '%' : '—';
    return `<div class="data-row">
      <span class="data-swatch" style="background:${toHex(rgb)}"></span>
      <span class="data-pct">${pct}</span>
      <span class="data-name">${colorName(rgb)}</span>
      <span class="data-hex">${toHex(rgb)}</span>
    </div>`;
  }).join('');

  dataPanel.innerHTML = `
    <div class="data-title">DATI RILEVATI</div>
    <div class="data-dominant">
      <span class="data-swatch big" style="background:${toHex(displayDominant)}"></span>
      <div>
        <div class="data-dominant-name">${colorName(displayDominant)}</div>
        <div class="data-dominant-sub">${toHex(displayDominant)} · RGB ${displayDominant.join(',')} · S ${s}% · L ${l}%</div>
      </div>
    </div>
    <div class="data-palette">${rows}</div>
  `;
  dataPanel.style.opacity = '1'; // dal primo aggiornamento in poi resta sempre visibile
}

// ── PANNELLI A SCELTA (domanda umana / "ti riconosci?") ───────────
// Helper condiviso da entrambi (sezioni 13-14): mostra un pannello,
// risolve quando l'osservatore clicca uno dei bottoni al suo interno, o
// da sola dopo `timeoutMs` se nessuno risponde. Il timeout è la parte
// importante: senza, un visitatore che si allontana senza rispondere
// bloccherebbe la sequenza per sempre, e il GIUDICA successivo
// sembrerebbe non funzionare più.
function showOverlayChoice(el, buttons, readAnswer, timeoutMs) {
  return new Promise(resolve => {
    el.style.opacity = '1';
    el.style.pointerEvents = 'auto';
    let done = false;
    const timer = setTimeout(() => finish(null), timeoutMs);
    function finish(answer) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      buttons.forEach(b => b.onclick = null);
      setTimeout(() => resolve(answer), 400);
    }
    buttons.forEach(btn => { btn.onclick = () => finish(readAnswer(btn)); });
  });
}

// ── 13. DOMANDA UMANA ─────────────────────────────────────────────
// Prima di mostrare il giudizio dell'AI, si chiede all'osservatore cosa
// gli trasmettono i colori (pannello dati, sempre visibile a sinistra):
// la risposta viene registrata (logResponse, sezione 16) e resta a
// disposizione per il confronto uomo/macchina al centro della ricerca.
// Parole scelte per coprire uno spettro ampio di stati d'animo, non solo
// positivo/negativo — modificale pure per adattarle al tuo lessico.
const MOOD_WORDS = ['calma','energia','malinconia','gioia','tensione','serenità','inquietudine','nostalgia'];
const HUMAN_QUESTION_TIMEOUT = 9000; // ms senza risposta prima di proseguire da sola

const humanQuestionEl = document.getElementById('humanQuestion');
const moodChipsEl     = document.getElementById('moodChips');
const moodSkipBtn     = document.getElementById('moodSkip');

function showHumanQuestion() {
  moodChipsEl.innerHTML = MOOD_WORDS.map(w => `<button class="mood-chip" type="button" data-word="${w}">${w}</button>`).join('');
  const buttons = [...moodChipsEl.querySelectorAll('.mood-chip'), moodSkipBtn];
  // moodSkipBtn non ha data-word ("preferisco non rispondere") → risposta null, come il timeout
  return showOverlayChoice(humanQuestionEl, buttons, btn => btn.dataset.word || null, HUMAN_QUESTION_TIMEOUT);
}

// ── 13b. CONFRONTO UOMO / MACCHINA ─────────────────────────────────
// Dopo il giudizio, mette una accanto all'altra la parola scelta dal
// visitatore (sezione 13) e quella a cui l'AI ha ricondotto il proprio
// giudizio (classifyJudgmentMood, sezione 10). Nessun punteggio: mostra
// solo se le due letture coincidono o divergono. Si chiude da sola dopo
// COMPARE_DURATION, oppure con un tocco.
const COMPARE_DURATION = 6000;
const comparePanel = document.getElementById('comparePanel');

function showComparison(human, machine) {
  const same = human && machine && human === machine;
  const verdict = !human
    ? 'Non hai scelto. La macchina ha deciso comunque.'
    : !machine
      ? 'La macchina non ha saputo ridurre il suo giudizio a una parola.'
      : same ? 'Stessa lettura.' : 'Letture diverse degli stessi colori.';
  comparePanel.innerHTML = `
    <div class="compare-cols">
      <div class="compare-col"><div class="compare-who">TU</div><div class="compare-word">${human || '—'}</div></div>
      <div class="compare-sep">${same ? '=' : '≠'}</div>
      <div class="compare-col"><div class="compare-who">MACCHINA</div><div class="compare-word">${machine || '—'}</div></div>
    </div>
    <div class="compare-verdict">${verdict}</div>`;
  return new Promise(resolve => {
    comparePanel.style.opacity = '1';
    comparePanel.style.pointerEvents = 'auto';
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      comparePanel.onclick = null;
      comparePanel.style.opacity = '0';
      comparePanel.style.pointerEvents = 'none';
      setTimeout(resolve, 500);
    };
    const timer = setTimeout(finish, COMPARE_DURATION);
    comparePanel.onclick = finish;
  });
}

// ── 14. "TI RICONOSCI IN QUESTA INTERPRETAZIONE?" ─────────────────
// Mostrata subito dopo il giudizio AI (#aiJudgment): fa emergere la
// distanza tra ciò che il sistema misura davvero (pannello dati) e ciò
// che interpreta — il punto centrale della ricerca, per esplicita
// richiesta della relatrice.
const RECOGNIZE_QUESTION_TIMEOUT = 7000; // ms senza risposta prima di proseguire da sola
const recognizeQuestionEl = document.getElementById('recognizeQuestion');

function showRecognizeQuestion() {
  const buttons = [...recognizeQuestionEl.querySelectorAll('[data-answer]')];
  return showOverlayChoice(recognizeQuestionEl, buttons, btn => btn.dataset.answer, RECOGNIZE_QUESTION_TIMEOUT);
}

// ── 15. RITRATTO CROMATICO ───────────────────────────────────────
// Ultima fase: la foto vera scattata al momento di GIUDICA (snapshot.photo,
// sezione 10) con sopra un filtro colore generato dai dati oggettivi
// congelati nello stesso snapshot — non dal fotogramma live della webcam,
// che nel frattempo può essere già cambiato, così il ritratto corrisponde
// davvero a quell'unica osservazione. Il filtro è fatto con blob sfocati
// pesati per percentuale d'area (stesso principio della nebulosa di sfondo,
// updateAndDrawAmbient sezione 5) ma applicati come TINTA sopra la foto,
// non come forme opache: il volto/la scena restano riconoscibili, colorati
// secondo l'interpretazione cromatica del momento. Se la webcam era spenta
// (snapshot.photo è null), il filtro resta comunque visibile da solo, come
// composizione puramente astratta. Il risultato è "fermato" in un singolo
// fotogramma scaricabile — l'opera che resta di quella specifica
// interpretazione, utile anche come estensione da telefono (QR code) fuori
// dall'installazione.
const portraitCanvas   = document.getElementById('portraitCanvas');
const portraitCtx      = portraitCanvas.getContext('2d');
const portraitDownload = document.getElementById('portraitDownload');
const portraitPanel    = document.getElementById('portraitPanel');
const PORTRAIT_SIZE     = 900;  // lato (px) del canvas quadrato generato
const PORTRAIT_DURATION = 7000; // quanto resta visibile prima di sfumare (ms)

function renderPortrait(snapshot) {
  portraitCanvas.width  = PORTRAIT_SIZE;
  portraitCanvas.height = PORTRAIT_SIZE;
  portraitCtx.fillStyle = '#000';
  portraitCtx.fillRect(0, 0, PORTRAIT_SIZE, PORTRAIT_SIZE);

  // 1) LA FOTO: lo scatto vero preso al momento di GIUDICA, già ritagliato
  // a quadrato da captureVideoFrame() (sezione 10). Nessuna foto (webcam
  // spenta in quel momento) → si passa dritti al solo filtro colore.
  if (snapshot.photo) {
    portraitCtx.drawImage(snapshot.photo, 0, 0, PORTRAIT_SIZE, PORTRAIT_SIZE);
  }

  // 2) IL FILTRO COLORE: stessi blob sfocati pesati per area di prima, ma
  // in composite 'color' — prendono tonalità e saturazione dai blob
  // lasciando intatta la luminosità (quindi i dettagli) della foto sotto.
  // Senza foto, gli stessi blob restano semplicemente visibili come forme
  // piene (composite 'source-over').
  portraitCtx.filter = 'blur(80px) saturate(1.4)';
  portraitCtx.globalCompositeOperation = snapshot.photo ? 'color' : 'source-over';
  portraitCtx.globalAlpha = snapshot.photo ? 0.95 : 1;

  const n = snapshot.palette.length;
  snapshot.palette.forEach((rgb, i) => {
    const pct = snapshot.weights[i] != null ? snapshot.weights[i] : 1/n;
    const angle = (i / n) * Math.PI * 2;
    const spread = 0.30 * PORTRAIT_SIZE;
    // colori con più area occupano più spazio e stanno più al centro:
    // pct alto → raggio maggiore e posizione meno periferica
    const x = PORTRAIT_SIZE/2 + Math.cos(angle) * spread * (0.55 - pct*0.4);
    const y = PORTRAIT_SIZE/2 + Math.sin(angle) * spread * (0.55 - pct*0.4);
    const r = PORTRAIT_SIZE * (0.16 + pct * 0.6);
    portraitCtx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    portraitCtx.beginPath();
    portraitCtx.arc(x, y, r, 0, Math.PI*2);
    portraitCtx.fill();
  });

  portraitCtx.filter = 'none';
  portraitCtx.globalAlpha = 1;
  portraitCtx.globalCompositeOperation = 'source-over';
}

// fascia in basso sul ritratto: giudizio, le due parole del confronto e
// la data — così l'immagine salvata porta con sé la sua interpretazione
function drawPortraitCaption(info) {
  if (!info) return;
  const S = PORTRAIT_SIZE, pad = 44;
  const words = info.text.split(/\s+/);
  portraitCtx.font = 'italic 300 34px "Cormorant Garamond", serif';
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (portraitCtx.measureText(test).width > S - pad * 2 && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, 4);
  const bandH = 90 + shown.length * 42 + 40;
  const g = portraitCtx.createLinearGradient(0, S - bandH - 60, 0, S);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.35, 'rgba(0,0,0,0.72)');
  g.addColorStop(1, 'rgba(0,0,0,0.9)');
  portraitCtx.fillStyle = g;
  portraitCtx.fillRect(0, S - bandH - 60, S, bandH + 60);
  portraitCtx.fillStyle = '#fff';
  portraitCtx.textBaseline = 'alphabetic';
  shown.forEach((l, i) => portraitCtx.fillText(i === shown.length - 1 && lines.length > shown.length ? l + '…' : l, pad, S - bandH + 40 + i * 42));
  portraitCtx.font = '18px "Courier New", monospace';
  portraitCtx.fillStyle = 'rgba(255,255,255,0.6)';
  const date = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  portraitCtx.fillText(`TU: ${(info.humanFeeling || '—').toUpperCase()}   ·   MACCHINA: ${(info.aiMood || '—').toUpperCase()}`, pad, S - 72);
  portraitCtx.fillStyle = 'rgba(255,255,255,0.4)';
  portraitCtx.fillText(`SOVRAINTERPRETAZIONE CROMATICA · ${date}`, pad, S - 42);
}

function showPortrait(snapshot, info) {
  return new Promise(resolve => {
    renderPortrait(snapshot);
    drawPortraitCaption(info);
    // NOTA iOS Safari: un tocco lungo su "salva il ritratto" apre l'immagine
    // invece di scaricarla direttamente (limite del browser, non del codice) —
    // da lì "Salva immagine" funziona comunque.
    portraitDownload.href = portraitCanvas.toDataURL('image/png');
    portraitPanel.style.opacity = '1';
    portraitPanel.style.pointerEvents = 'auto';
    setTimeout(() => {
      portraitPanel.style.opacity = '0';
      portraitPanel.style.pointerEvents = 'none';
      setTimeout(resolve, 800);
    }, PORTRAIT_DURATION);
  });
}

// ── 16. LOG RISPOSTE ───────────────────────────────────────────────
// Raccoglie ogni sessione completa (sensazione umana → giudizio AI →
// riconoscimento) in memoria, per poterle esportare come dati di ricerca
// per la tesi. Vive SOLO in memoria: si perde ricaricando la pagina, va
// quindi esportato prima di chiudere/aggiornare l'installazione se questi
// dati servono. Nessuna persistenza automatica finché non viene decisa
// una modalità precisa (locale, server, ecc.) — vedi la nota in cima a
// exportResponseLog().
// Il registro ora è salvato anche nel browser (localStorage, chiave
// LOG_KEY): sopravvive a ricariche e chiusure della pagina sullo stesso
// dispositivo. Resta comunque locale: va esportato (tasto "E") da ogni
// dispositivo usato. Shift+R lo svuota dopo una conferma.
const LOG_KEY = 'sovrainterpretazione-registro';
const responseLog = (() => {
  try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch (e) { return []; }
})();

function saveResponseLog() {
  try { localStorage.setItem(LOG_KEY, JSON.stringify(responseLog)); } catch (e) { console.error(e); }
}

function logResponse({ humanFeeling, aiJudgment, aiMood, recognized, snapshot }) {
  responseLog.push({
    timestamp: new Date().toISOString(),
    dominante: colorName(snapshot.dominant),
    hexDominante: toHex(snapshot.dominant),
    palette: snapshot.palette.map(toHex).join(' '),
    sensazioneUmana: humanFeeling ?? '(nessuna risposta)',
    giudizioAI: aiJudgment,
    emozioneAI: aiMood ?? '(non classificata)',
    coincidenza: humanFeeling && aiMood ? (humanFeeling === aiMood ? 'sì' : 'no') : '—',
    riconoscimento: recognized ?? '(nessuna risposta)',
  });
  saveResponseLog();
}

// Scarica il registro come CSV. Attivabile in due modi, ENTRAMBI discreti
// (nessun bottone a schermo: il pubblico dell'installazione non deve
// vederlo né poterlo attivare per sbaglio):
//  - tasto "E" della tastiera (comodo da PC, es. a fine giornata espositiva)
//  - dalla console del browser: exportResponseLog()
// Se in futuro serve una persistenza vera (es. inviare ogni risposta a un
// piccolo server invece di tenerle solo in memoria), è qui che va aggiunta:
// logResponse() sopra resta l'unico punto che riceve ogni nuova risposta.
function exportResponseLog() {
  if (!responseLog.length) { showDebug('Nessuna risposta ancora registrata.'); return; }
  const headers = ['timestamp','dominante','hexDominante','palette','sensazioneUmana','giudizioAI','emozioneAI','coincidenza','riconoscimento'];
  const escape = v => `"${String(v).replace(/"/g,'""')}"`;
  const csv = [headers.join(',')]
    .concat(responseLog.map(row => headers.map(h => escape(row[h])).join(',')))
    .join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `registro-risposte-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showDebug(`Esportate ${responseLog.length} risposte.`, 4000);
}
window.exportResponseLog = exportResponseLog; // richiamabile anche da console: exportResponseLog()

// Riepilogo dei dati raccolti (tasto "S"): numero di sessioni, quante
// persone hanno risposto, quanto spesso le due letture coincidono e come
// si distribuiscono le risposte a "ti riconosci?". Serve alla valutazione
// dell'esperienza nella tesi; si chiude con un tocco o con "S".
const statsPanel = document.getElementById('statsPanel');

function countBy(list, key) {
  return list.reduce((acc, row) => { acc[row[key]] = (acc[row[key]] || 0) + 1; return acc; }, {});
}

function toggleStats() {
  if (statsPanel.style.opacity === '1') {
    statsPanel.style.opacity = '0';
    statsPanel.style.pointerEvents = 'none';
    return;
  }
  const n = responseLog.length;
  const pct = (a, b) => b ? Math.round(a / b * 100) + '%' : '—';
  const answered = responseLog.filter(r => MOOD_WORDS.includes(r.sensazioneUmana));
  const compared = responseLog.filter(r => r.coincidenza === 'sì' || r.coincidenza === 'no');
  const same = compared.filter(r => r.coincidenza === 'sì').length;
  const rec = countBy(responseLog, 'riconoscimento');
  const recAnswered = (rec['si'] || 0) + (rec['in parte'] || 0) + (rec['no'] || 0);
  const list = (obj, total) => Object.entries(obj)
    .filter(([k]) => MOOD_WORDS.includes(k))
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `<div class="stats-row"><span>${k}</span><span>${v} · ${pct(v, total)}</span></div>`).join('') || '<div class="stats-row"><span>—</span></div>';
  statsPanel.innerHTML = `
    <div class="data-title">REGISTRO · ${n} SESSIONI</div>
    <div class="stats-row"><span>Hanno scelto una parola</span><span>${answered.length} · ${pct(answered.length, n)}</span></div>
    <div class="stats-row"><span>Stessa lettura uomo/macchina</span><span>${same} su ${compared.length} · ${pct(same, compared.length)}</span></div>
    <div class="stats-sub">TI RICONOSCI? (${recAnswered} risposte)</div>
    <div class="stats-row"><span>Sì</span><span>${rec['si'] || 0} · ${pct(rec['si'] || 0, recAnswered)}</span></div>
    <div class="stats-row"><span>In parte</span><span>${rec['in parte'] || 0} · ${pct(rec['in parte'] || 0, recAnswered)}</span></div>
    <div class="stats-row"><span>No</span><span>${rec['no'] || 0} · ${pct(rec['no'] || 0, recAnswered)}</span></div>
    <div class="stats-cols">
      <div><div class="stats-sub">PAROLE DEI VISITATORI</div>${list(countBy(responseLog, 'sensazioneUmana'), answered.length)}</div>
      <div><div class="stats-sub">PAROLE DELLA MACCHINA</div>${list(countBy(responseLog, 'emozioneAI'), responseLog.filter(r => MOOD_WORDS.includes(r.emozioneAI)).length)}</div>
    </div>
    <div class="stats-hint">E esporta CSV · S chiude · Shift+R svuota</div>`;
  statsPanel.style.opacity = '1';
  statsPanel.style.pointerEvents = 'auto';
}
statsPanel.onclick = toggleStats;

function clearResponseLog() {
  if (!responseLog.length) return;
  if (!confirm(`Cancellare le ${responseLog.length} risposte registrate su questo dispositivo? Esportale prima con "E" se ti servono.`)) return;
  responseLog.length = 0;
  saveResponseLog();
  showDebug('Registro svuotato.', 4000);
}

// ── 17. RICONOSCIMENTO CARTE E PAGINE ─────────────────────────────
// Le carte del mazzo e le aperture di capitolo della tesi stampata hanno
// una composizione di 4 colori (non un QR code). Ad ogni ricalcolo della
// palette (sezione 9) il sistema controlla se nell'inquadratura ci sono
// tutti e 4 i colori di una carta; se la lettura resta uguale per qualche
// istante, apre un popup con il nome della carta, una figura generata dai
// suoi colori, la frase di CHROMA e, se Ollama risponde, una lettura dal
// vivo. Il popup resta finché non lo si chiude a mano.
//
// ── I COLORI DELLE CARTE ──
// Dieci colori da stampa, scelti con tonalità lontane tra loro (almeno 26°)
// perché restino distinguibili anche con carta, inchiostro e luce diversi.
// Nel file di Affinity vanno usati ESATTAMENTE questi HEX.
const CARD_COLORS = {
  rosso:    '#C8102E',
  arancio:  '#E8590C',
  giallo:   '#F5E03A',
  lime:     '#8DC63F',
  verde:    '#1E9E4A',
  acqua:    '#0FA394',
  azzurro:  '#1D9BD8',
  blu:      '#2340B0',
  viola:    '#6A3FB5',
  magenta:  '#B8309C',
};
const CARD_REF = Object.entries(CARD_COLORS).map(([name, hex]) => {
  const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return { name, hsl: toHsl(rgb) };
});

// ── LE CARTE (e le aperture di capitolo della tesi stampata) ──
// Ogni carta usa 4 dei 10 colori. Le 25 combinazioni sono scelte in modo
// che due carte qualsiasi abbiano al massimo 2 colori in comune: per essere
// scambiata con un'altra, una carta dovrebbe "sbagliare" almeno 2 colori.
// thesis: true = la stessa composizione va anche all'inizio del capitolo nella tesi.
// text: la frase di CHROMA, già scritta (compare subito, anche senza Ollama).
// topic: il tema passato a Ollama per la "lettura" dal vivo, se raggiungibile.
const PAGE_SIGNATURES = [
  { id: 'intro', label: 'Introduzione', thesis: true, colors: ['rosso', 'arancio', 'verde', 'acqua'],
    text: 'Una webcam osserva. Non riconosce volti: misura soltanto luce. Da qui parte tutto, dal salto tra un numero e un giudizio.',
    topic: 'l\'introduzione di una tesi sul momento in cui un colore misurato riceve un significato' },
  { id: 'cap1', label: 'Capitolo 1 — Il colore', thesis: true, colors: ['giallo', 'lime', 'verde', 'acqua'],
    text: 'Tre modi di guardarmi: come sistema, come esperienza dell\'occhio, come significato culturale. Nessuno basta da solo.',
    topic: 'il colore come teoria, percezione e costruzione culturale' },
  { id: 'newton', label: 'Isaac Newton', thesis: false, colors: ['rosso', 'arancio', 'giallo', 'lime'],
    text: 'Newton mi ha fatto passare attraverso un prisma: la luce bianca conteneva già tutti i colori.',
    topic: 'Newton e la scomposizione della luce bianca con il prisma' },
  { id: 'goethe', label: 'Johann Wolfgang von Goethe', thesis: false, colors: ['arancio', 'lime', 'blu', 'magenta'],
    text: 'Per Goethe nasco dall\'incontro tra luce e oscurità, e nel tuo occhio. Fissami a lungo e vedrai il mio opposto.',
    topic: 'Goethe, la Teoria dei colori, luce e oscurità e le immagini residue' },
  { id: 'itten', label: 'Johannes Itten', thesis: false, colors: ['rosso', 'arancio', 'azzurro', 'magenta'],
    text: 'Itten mi ha disposto su un cerchio di dodici parti e ha cercato le mie armonie con la geometria: coppie, triadi, quadrati.',
    topic: 'Itten, il cerchio cromatico in dodici parti e le armonie geometriche' },
  { id: 'albers', label: 'Josef Albers', thesis: false, colors: ['arancio', 'giallo', 'azzurro', 'viola'],
    text: 'Albers ha dimostrato che non mi vedi mai da solo: lo stesso grigio cambia a seconda di chi gli sta accanto.',
    topic: 'Albers e la relatività del colore, che cambia con il contesto' },
  { id: 'heller', label: 'Eva Heller', thesis: false, colors: ['rosso', 'acqua', 'blu', 'magenta'],
    text: 'Eva Heller ha chiesto a circa duemila persone che cosa significo per loro. Le risposte parlano più di voi che di me.',
    topic: 'Eva Heller e le associazioni psicologiche dei colori raccolte con un sondaggio' },
  { id: 'kandinsky', label: 'Wassily Kandinsky', thesis: false, colors: ['rosso', 'giallo', 'azzurro', 'blu'],
    text: 'Kandinsky mi sentiva come un suono: il giallo squilla come una tromba, il blu si allontana e chiama verso l\'infinito.',
    topic: 'Kandinsky, lo spirituale nell\'arte e il colore come suono interiore' },
  { id: 'pastoureau', label: 'Michel Pastoureau', thesis: false, colors: ['giallo', 'lime', 'azzurro', 'magenta'],
    text: 'Pastoureau ha scritto la mia storia: i miei significati cambiano da un secolo all\'altro e da una società all\'altra.',
    topic: 'Pastoureau e la storia sociale e simbolica dei colori' },
  { id: 'falcinelli', label: 'Riccardo Falcinelli', thesis: false, colors: ['verde', 'acqua', 'blu', 'viola'],
    text: 'Falcinelli racconta come pittura, industria e tecnologia hanno cambiato il modo in cui mi guardi.',
    topic: 'Falcinelli, Cromorama e il colore nella cultura visiva' },
  { id: 'cap2', label: 'Capitolo 2 — Il colore digitale', thesis: true, colors: ['azzurro', 'blu', 'viola', 'magenta'],
    text: 'Qui divento tre numeri tra 0 e 255. Posso essere copiato all\'infinito, ma su ogni schermo appaio un po\' diverso.',
    topic: 'il colore trasformato in dato digitale: pixel, RGB, schermi' },
  { id: 'mcluhan', label: 'Marshall McLuhan', thesis: false, colors: ['arancio', 'giallo', 'verde', 'magenta'],
    text: 'Per McLuhan ogni medium è un\'estensione dei sensi. Sullo schermo della televisione divento punti luminosi che il tuo occhio deve ricomporre.',
    topic: 'McLuhan, i media come estensioni dei sensi e lo schermo televisivo' },
  { id: 'grau', label: 'Oliver Grau', thesis: false, colors: ['rosso', 'arancio', 'blu', 'viola'],
    text: 'Grau racconta un desiderio antico: entrare dentro l\'immagine. Dagli affreschi di Pompei ai panorami, fino al digitale.',
    topic: 'Oliver Grau, la storia dell\'immersione nell\'immagine' },
  { id: 'avolve', label: 'Christa Sommerer e Laurent Mignonneau', thesis: false, colors: ['rosso', 'acqua', 'azzurro', 'viola'],
    text: 'In A-Volve disegni una creatura su uno schermo e la vedi nuotare in una vasca d\'acqua insieme alle altre. La sua forma nasce dal tuo gesto.',
    topic: 'A-Volve di Sommerer e Mignonneau, creature virtuali nate da un disegno' },
  { id: 'hoffman', label: 'Donald Hoffman', thesis: false, colors: ['verde', 'acqua', 'azzurro', 'magenta'],
    text: 'Per Hoffman vedere è costruire: davanti allo stesso cubo di Necker, il tuo occhio sceglie ogni volta una forma diversa.',
    topic: 'Hoffman, l\'intelligenza visiva e il cubo di Necker' },
  { id: 'gregory', label: 'Richard Gregory', thesis: false, colors: ['arancio', 'verde', 'azzurro', 'blu'],
    text: 'Per Gregory la visione non è una fotografia: il cervello interpreta ciò che l\'occhio riceve, e a volte si inganna.',
    topic: 'Gregory, occhio e cervello e la psicologia del vedere' },
  { id: 'cap3', label: 'Capitolo 3 — Media Art', thesis: true, colors: ['lime', 'verde', 'azzurro', 'viola'],
    text: 'Nella Media Art smetto di stare su una superficie: divento spazio, esperienza, risposta di un sistema.',
    topic: 'il colore nella Media Art, come esperienza nello spazio e interazione' },
  { id: 'turrell', label: 'James Turrell', thesis: false, colors: ['lime', 'acqua', 'azzurro', 'blu'],
    text: 'Turrell usa la luce come materia. Nei suoi Skyspaces il cielo resta lo stesso, ma cambia il modo in cui lo vedi.',
    topic: 'James Turrell, la luce come materia e gli Skyspaces' },
  { id: 'eliasson', label: 'Olafur Eliasson', thesis: false, colors: ['arancio', 'giallo', 'acqua', 'blu'],
    text: 'In Room for one colour Eliasson mi riduce a un solo giallo: quando esci, il mondo ti sembra tendere al blu.',
    topic: 'Olafur Eliasson, la luce e la percezione condivisa' },
  { id: 'rokeby', label: 'David Rokeby', thesis: false, colors: ['giallo', 'acqua', 'viola', 'magenta'],
    text: 'In Very Nervous System i movimenti del corpo diventano suono: il sistema osserva e risponde a modo suo.',
    topic: 'David Rokeby e i sistemi interattivi che trasformano il movimento in suono' },
  { id: 'lozano', label: 'Rafael Lozano-Hemmer', thesis: false, colors: ['rosso', 'lime', 'verde', 'blu'],
    text: 'In Pulse Index il battito e l\'impronta del pubblico diventano immagini: un dato del corpo trasformato in opera.',
    topic: 'Rafael Lozano-Hemmer e i dati biometrici del pubblico trasformati in opera' },
  { id: 'ryabchenko', label: 'Stepan Ryabchenko', thesis: false, colors: ['rosso', 'lime', 'viola', 'magenta'],
    text: 'Ryabchenko costruisce mondi digitali, ma lascia a ogni spettatore la libertà di leggerli a modo suo.',
    topic: 'i mondi digitali di Stepan Ryabchenko e la libertà di interpretazione dello spettatore' },
  { id: 'cap4', label: 'Capitolo 4 — CHROMA', thesis: true, colors: ['giallo', 'lime', 'blu', 'viola'],
    text: 'Questo capitolo parla di me: come guardo, come misuro, come trasformo cinque colori in una frase sicura.',
    topic: 'CHROMA stesso: una webcam, cinque colori e una frase detta con certezza' },
  { id: 'cap5', label: 'Capitolo 5 — Gli elaborati', thesis: true, colors: ['arancio', 'lime', 'acqua', 'viola'],
    text: 'Sono un\'installazione, un\'app e questo mazzo di carte. Tre modi di chiederti che cosa credi quando ti parlo.',
    topic: 'gli elaborati di CHROMA: un\'installazione, un\'app e un mazzo di carte' },
  { id: 'fine', label: 'Conclusioni', thesis: true, colors: ['rosso', 'giallo', 'verde', 'viola'],
    text: 'Non ti dirò che cosa significa un colore. Ti mostro quanto sei disposto a credermi.',
    topic: 'la fiducia che diamo a un significato quando arriva dopo dei numeri' },
];

// riconduce un colore rilevato al più vicino degli 8 colori delle carte,
// usando soprattutto la tonalità (più stabile della luminosità quando la
// luce cambia). null = troppo spento, scuro o chiaro per essere una carta.
const CARD_MIN_SAT    = 35;  // saturazione minima (%)
const CARD_HUE_TOL    = 20;  // quanti gradi di tonalità può spostarsi un colore stampato
const CARD_MIN_TOTAL  = 0.08; // i pixel colorati devono coprire almeno l'8% dell'inquadratura
const CARD_MIN_SHARE  = 0.08; // ciascuno dei 4 colori: almeno l'8% dei pixel colorati
const CARD_MIN_PURITY = 0.8;  // i 4 colori della carta: almeno l'80% dei pixel colorati
const CARD_STABLE_HITS = 3;  // quante letture consecutive uguali servono prima di reagire

function cardColorOf(rgb) {
  const [h, s, l] = toHsl(rgb);
  if (s < CARD_MIN_SAT || l < 12 || l > 80) return null;
  let best = null, bestD = Infinity;
  for (const ref of CARD_REF) {
    const dh = Math.min(Math.abs(h - ref.hsl[0]), 360 - Math.abs(h - ref.hsl[0]));
    const d = dh + Math.abs(l - ref.hsl[2]) * 0.3;
    if (dh <= CARD_HUE_TOL && d < bestD) { bestD = d; best = ref.name; }
  }
  return best;
}

const pageReactionEl       = document.getElementById('pageReaction');
const pageReactionBackdrop = document.getElementById('pageReactionBackdrop');
const pageReactionTextEl   = document.getElementById('pageReactionText');
const pageReactionTitleEl  = document.getElementById('pageReactionTitle');
const pageReactionCanvas   = document.getElementById('pageReactionCanvas');
const pageReactionAiEl     = document.getElementById('pageReactionAi');
const pageReactionCloseBtn = document.getElementById('pageReactionClose');

let activePageId      = null; // id della firma il cui popup è attualmente mostrato (null = nessuno)
let pageRequestSeq    = 0;    // numero incrementale: se una pagina nuova sostituisce quella in corso mentre Ollama sta ancora rispondendo, la risposta vecchia (in arrivo in ritardo) viene scartata invece di sovrascrivere il popup nuovo
const pageCooldownUntil = {}; // { [id]: timestamp fino a cui ignorare quella firma dopo la chiusura }

// quanta parte dell'inquadratura occupa ciascun colore delle carte:
// ogni pixel viene ricondotto al colore di carta più vicino (o a nessuno).
// Lavorare sui pixel invece che sulla palette evita che due colori vicini,
// come rosso e arancio, vengano fusi dal k-means in un unico gruppo.
function cardColorAreas(imageData) {
  const d = imageData.data, areas = {};
  // bilanciamento del bianco: il margine bianco della carta (o della pagina)
  // fa da riferimento. Se nell'inquadratura c'è abbastanza bianco, i tre
  // canali vengono corretti finché quel bianco torna neutro e luminoso.
  let wr = 0, wg = 0, wb = 0, wn = 0;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx > 150 && (mx - mn) < mx * 0.22) { wr += r; wg += g; wb += b; wn++; }
  }
  let gain = [1, 1, 1];
  if (wn >= d.length / 4 * 0.03) gain = [wr, wg, wb].map(v => 235 / (v / wn));
  let n = 0;
  for (let i = 0; i < d.length; i += 4) {
    n++;
    const rgb = [0, 1, 2].map(k => Math.min(255, d[i + k] * gain[k]));
    const name = cardColorOf(rgb);
    if (name) areas[name] = (areas[name] || 0) + 1;
  }
  for (const k in areas) areas[k] /= n;
  return areas;
}

// una carta è riconosciuta se:
//  - i pixel "da carta" (colorati e saturi) occupano abbastanza inquadratura;
//  - quasi tutti appartengono ai 4 colori di quella carta (purezza);
//  - ciascuno dei 4 colori ne occupa una parte non trascurabile.
// Misurare le quote sul totale dei pixel colorati, e non sull'intera
// inquadratura, rende il riconoscimento indipendente da quanto è grande la
// carta nell'immagine. Vince la carta con la purezza più alta.
function matchPageSignature(imageData) {
  const areas = cardColorAreas(imageData);
  const total = Object.values(areas).reduce((x, y) => x + y, 0);
  if (total < CARD_MIN_TOTAL) return null;
  let best = null, bestPurity = 0;
  for (const sig of PAGE_SIGNATURES) {
    const a = sig.colors.map(c => (areas[c] || 0) / total);
    const purity = a.reduce((x, y) => x + y, 0);
    if (Math.min(...a) >= CARD_MIN_SHARE && purity >= CARD_MIN_PURITY && purity > bestPurity) { bestPurity = purity; best = sig; }
  }
  return best;
}

let lastCardCandidate = null, cardHits = 0;

function checkPageSignature(imageData) {
  const match = matchPageSignature(imageData);
  if (match && lastCardCandidate === match.id) cardHits++;
  else { lastCardCandidate = match ? match.id : null; cardHits = match ? 1 : 0; }
  if (!match || cardHits < CARD_STABLE_HITS) return;
  if (match.id === activePageId) return;
  const cooldownUntil = pageCooldownUntil[match.id];
  if (cooldownUntil && performance.now() < cooldownUntil) return;
  triggerPageReaction(match);
}

// la figura che CHROMA crea per ogni carta: una composizione astratta con i
// suoi quattro colori. È generata da un seme legato alla carta, quindi la
// stessa carta produce sempre una figura della stessa famiglia, ma ogni
// volta leggermente diversa (il seme cambia anche con l'ora).
function drawCardFigure(canvas, sig) {
  const S = canvas.width = canvas.height = 600;
  const ctx = canvas.getContext('2d');
  let seed = [...sig.id].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) + Math.floor(Date.now() / 60000);
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const cols = sig.colors.map(c => CARD_COLORS[c]);
  ctx.fillStyle = '#050506';
  ctx.fillRect(0, 0, S, S);
  ctx.globalCompositeOperation = 'screen';
  ctx.filter = 'blur(28px)';
  for (let i = 0; i < 9; i++) {
    const a = rnd() * Math.PI * 2, d = rnd() * S * 0.28;
    ctx.fillStyle = cols[i % 4];
    ctx.globalAlpha = 0.55 + rnd() * 0.35;
    ctx.beginPath();
    ctx.ellipse(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d, S * (0.1 + rnd() * 0.16), S * (0.08 + rnd() * 0.14), rnd() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.filter = 'none';
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = cols[i];
    ctx.beginPath();
    const r0 = S * (0.18 + i * 0.07), ph = rnd() * 6;
    for (let t = 0; t <= 200; t++) {
      const ang = t / 200 * Math.PI * 2;
      const r = r0 + Math.sin(ang * (3 + i) + ph) * S * 0.02;
      const x = S / 2 + Math.cos(ang) * r, y = S / 2 + Math.sin(ang) * r;
      t ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
}

function hideAllOverlays() {
  aiJudgment.style.opacity = '0';
  aiJudgment.innerHTML = '';
  humanQuestionEl.style.opacity = '0';
  humanQuestionEl.style.pointerEvents = 'none';
  recognizeQuestionEl.style.opacity = '0';
  recognizeQuestionEl.style.pointerEvents = 'none';
  portraitPanel.style.opacity = '0';
  portraitPanel.style.pointerEvents = 'none';
}

async function triggerPageReaction(sig) {
  const myRequest = ++pageRequestSeq;
  activePageId = sig.id;

  analyzing = true; // sospende GIUDICA/auto-giudizio ambientale finché il popup non viene chiuso
  hideAllOverlays();

  pageReactionTitleEl.textContent = sig.label;
  const has3D = show3DForChapter(sig);
  pageReactionCanvas.style.display = has3D ? 'none' : 'block';
  if (!has3D) drawCardFigure(pageReactionCanvas, sig);
  pageReactionTextEl.textContent = sig.text;
  pageReactionAiEl.textContent = '';
  pageReactionEl.classList.add('visible');
  pageReactionBackdrop.classList.add('visible');

  // la "lettura" dal vivo di Ollama arriva sotto, se il modello è raggiungibile;
  // se non lo è, la carta resta comunque completa con la sua frase già scritta
  try {
    const text = await fetchAIJudgment(captureObjectiveSnapshot(), sig.topic);
    if (myRequest !== pageRequestSeq) return;
    pageReactionAiEl.textContent = text;
  } catch (e) {
    console.error(e);
  }
}

function closePageReaction() {
  pageReactionEl.classList.remove('visible');
  pageReactionBackdrop.classList.remove('visible');
  hide3DView();
  if (activePageId) pageCooldownUntil[activePageId] = performance.now() + PAGE_REOPEN_COOLDOWN;
  activePageId = null;
  pageRequestSeq++; // scarta un'eventuale risposta AI ancora in arrivo per la pagina appena chiusa
  analyzing = false; // riarma GIUDICA/auto-giudizio ambientale: si torna al comportamento normale sui colori dell'ambiente
  judgeBtn.disabled = false;
  judgeBtn.textContent = '▸ GIUDICA';
}
pageReactionCloseBtn.addEventListener('click', closePageReaction);
pageReactionBackdrop.addEventListener('click', closePageReaction); // clic fuori dal popup = stesso effetto del bottone "chiudi"

// esposte su window solo per comodità di test dalla console del browser
// (desktop o da telefono via debug remoto) — vedi istruzioni di test:
// window.CHROMA_DEBUG.trigger('cap3') forza il popup di una pagina senza
// bisogno di inquadrare i colori giusti; .match() mostra a quale firma
// corrisponde la palette rilevata IN QUESTO ISTANTE, utile per capire se
// una composizione stampata/mostrata a schermo viene letta correttamente
window.CHROMA_DEBUG = {
  signatures: PAGE_SIGNATURES,
  trigger: (id) => {
    const sig = PAGE_SIGNATURES.find(s => s.id === id);
    if (!sig) { console.warn('id non trovato. Usa uno tra:', PAGE_SIGNATURES.map(s => s.id)); return; }
    triggerPageReaction(sig);
  },
  close: closePageReaction,
  match: () => matchPageSignature(lowResCtx.getImageData(0, 0, lowResCanvas.width, lowResCanvas.height)),
  seen: () => cardColorAreas(lowResCtx.getImageData(0, 0, lowResCanvas.width, lowResCanvas.height)),
  currentPalette: () => currentPalette,
  resetCooldowns: () => { for (const k in pageCooldownUntil) delete pageCooldownUntil[k]; console.log('cooldown azzerati'); },
};

// ── 18. QR INGRANDITO ──────────────────────────────────────────────
// Un clic su #qrBox ingrandisce lo stesso QR al centro dello schermo
// (#qrModal), pensato per mostrarlo a tutta la sala durante
// l'esposizione della tesi senza uscire dall'app — #qrBox è un bottone,
// non un link, proprio per poter intercettare il clic invece di aprire
// una nuova scheda. Stesso pattern di #pageReactionBackdrop/#pageReaction
// (sezione 17): sfondo che scurisce tutto, popup sopra, nessun timeout —
// resta finché non lo si chiude a mano.
const qrBoxBtn        = document.getElementById('qrBox');
const qrModal         = document.getElementById('qrModal');
const qrModalBackdrop = document.getElementById('qrModalBackdrop');
const qrModalClose    = document.getElementById('qrModalClose');

function openQrModal() {
  qrModal.classList.add('visible');
  qrModalBackdrop.classList.add('visible');
}
function closeQrModal() {
  qrModal.classList.remove('visible');
  qrModalBackdrop.classList.remove('visible');
}
qrBoxBtn.addEventListener('click', openQrModal);
qrModalClose.addEventListener('click', closeQrModal);
qrModalBackdrop.addEventListener('click', closeQrModal); // clic fuori dal popup = stesso effetto del bottone "chiudi"

// ── 19. FORMA 3D PER CAPITOLO ───────────────────────────────────────
// Quando il popup di riconoscimento pagina si apre (sezione 17), oltre
// al testo mostra una forma tridimensionale generata dai dati DI QUEL
// CAPITOLO — gli stessi colori della firma cromatica — invece di un
// modello disegnato a mano: è CHROMA stessa a "scolpire" una forma a
// partire dai dati, con lo stesso principio degli emblemi di capitolo
// (macchie che nascono da un seed deterministico, non a caso). Ruotabile
// trascinando col mouse o col dito; ruota lentamente da sola quando non
// viene toccata.
//
// Per passare in futuro a modelli fatti a mano in Blender: basta
// sostituire generateChapterGeometry()/colorizeGeometry() qui sotto con
// un caricamento di file .glb (es. tramite GLTFLoader di Three.js, o il
// componente <model-viewer> al posto del canvas) — il resto (apertura
// popup, trascinamento, avvio/arresto del rendering) resta identico.

const page3DCanvas = document.getElementById('pageReaction3D');

// stesso PRNG deterministico usato per gli emblemi grafici di capitolo
// (mulberry32, seed dalla stringa dell'id): stessa forma ogni volta per
// lo stesso capitolo, non rigenerata a caso ad ogni apertura.
function mulberry32_3d(seed) {
  return function() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashSeed3D(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (Math.imul(31, h) + str.charCodeAt(i)) | 0; }
  return h;
}

let scene3D, camera3D, renderer3D, mesh3D, animFrame3D = null;
let rotX = -0.3, rotY = 0.6; // orientamento iniziale, leggermente di tre-quarti invece che frontale piatto
let dragging3D = false, lastPointerX = 0, lastPointerY = 0;

function ensure3DScene() {
  if (scene3D) return true; // già creata, riusala
  if (typeof THREE === 'undefined') {
    console.warn('Three.js non caricato: la forma 3D resta disattivata, il popup mostra comunque il testo.');
    return false;
  }
  scene3D = new THREE.Scene();
  camera3D = new THREE.PerspectiveCamera(40, 1, 0.1, 10);
  camera3D.position.set(0, 0, 3.4);

  renderer3D = new THREE.WebGLRenderer({ canvas: page3DCanvas, antialias: true, alpha: true });
  renderer3D.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  scene3D.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(2, 2.5, 3);
  scene3D.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.35);
  rim.position.set(-2, -1, -2);
  scene3D.add(rim);

  // trascinamento manuale (mouse o tocco) per ruotare — niente libreria
  // OrbitControls: bastano due variabili (rotX/rotY) aggiornate ad ogni
  // spostamento del puntatore, più semplice da mantenere qui
  const onDown = (x, y) => { dragging3D = true; lastPointerX = x; lastPointerY = y; page3DCanvas.classList.add('dragging'); };
  const onMove = (x, y) => {
    if (!dragging3D) return;
    rotY += (x - lastPointerX) * 0.008;
    rotX += (y - lastPointerY) * 0.008;
    rotX = Math.max(-1.3, Math.min(1.3, rotX)); // non lasciare che la forma si "ribalti" sopra/sotto
    lastPointerX = x; lastPointerY = y;
  };
  const onUp = () => { dragging3D = false; page3DCanvas.classList.remove('dragging'); };

  page3DCanvas.addEventListener('pointerdown', e => { page3DCanvas.setPointerCapture(e.pointerId); onDown(e.clientX, e.clientY); });
  page3DCanvas.addEventListener('pointermove', e => onMove(e.clientX, e.clientY));
  page3DCanvas.addEventListener('pointerup', onUp);
  page3DCanvas.addEventListener('pointercancel', onUp);

  return true;
}

// deforma una sfera (icosaedro suddiviso) con alcune "gobbe" morbide
// posizionate e dimensionate dal seed — stesso principio delle macchie
// sfocate 2D degli emblemi, qui applicato come spostamento radiale su
// una superficie sferica invece che su un piano
function generateChapterGeometry(sig) {
  const rnd = mulberry32_3d(hashSeed3D(sig.id + '-forma'));
  const geo = new THREE.IcosahedronGeometry(1, 4);
  const pos = geo.attributes.position;

  const numBumps = 4 + Math.floor(rnd() * 3); // 4-6 gobbe
  const bumps = [];
  for (let i = 0; i < numBumps; i++) {
    const theta = rnd() * Math.PI * 2;
    const phi = Math.acos(2 * rnd() - 1);
    bumps.push({
      dir: new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)),
      strength: 0.12 + rnd() * 0.30,
      falloff: 1.4 + rnd() * 2.2,
      sign: rnd() > 0.3 ? 1 : -1, // per lo più protuberanze verso fuori, qualche insenatura verso dentro
    });
  }

  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let disp = 0;
    bumps.forEach(b => {
      const influence = Math.max(0, v.dot(b.dir)); // 0-1: quanto questo punto guarda verso la gobba
      disp += b.sign * b.strength * Math.pow(influence, b.falloff);
    });
    v.multiplyScalar(1 + disp);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// colora ogni vertice sfumando fra i colori della firma del capitolo: le
// stesse identiche coordinate colore usate per il riconoscimento (sezione
// 17) diventano qui il colore della forma — non una scelta estetica
// indipendente
function colorizeGeometry(geo, colors) {
  const rnd = mulberry32_3d(hashSeed3D('colore-' + colors.map(c => c.join(',')).join('|')));
  const anchors = colors.map(c => {
    const theta = rnd() * Math.PI * 2, phi = Math.acos(2 * rnd() - 1);
    return {
      dir: new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)),
      color: new THREE.Color(c[0] / 255, c[1] / 255, c[2] / 255),
    };
  });
  const pos = geo.attributes.position;
  const colArr = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let totalW = 0, r = 0, g = 0, b = 0;
    anchors.forEach(a => {
      const w = Math.pow(Math.max(0, v.dot(a.dir)), 3);
      totalW += w; r += a.color.r * w; g += a.color.g * w; b += a.color.b * w;
    });
    if (totalW > 0) { r /= totalW; g /= totalW; b /= totalW; } else { r = g = b = 0.5; }
    colArr[i*3] = r; colArr[i*3+1] = g; colArr[i*3+2] = b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
}

function show3DForChapter(sig) {
  if (!ensure3DScene()) return false; // Three.js non disponibile: al suo posto resta la figura 2D

  if (mesh3D) { scene3D.remove(mesh3D); mesh3D.geometry.dispose(); mesh3D.material.dispose(); }
  const geo = generateChapterGeometry(sig);
  colorizeGeometry(geo, sig.colors.map(n => [1, 3, 5].map(i => parseInt(CARD_COLORS[n].slice(i, i + 2), 16))));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.12 });
  mesh3D = new THREE.Mesh(geo, mat);
  scene3D.add(mesh3D);

  rotX = -0.3; rotY = 0.6; // stesso orientamento di partenza ad ogni apertura, per coerenza fra un capitolo e l'altro

  // display:'block' PRIMA di leggere clientWidth/clientHeight: un elemento
  // display:none (lo stato di partenza in style.css) non ha una vera area
  // occupata, quindi clientWidth/clientHeight risulterebbero sempre 0 —
  // misurarli in quell'ordine darebbe un renderer di dimensione zero e un
  // aspect ratio NaN, con la forma 3D che non apparirebbe mai.
  page3DCanvas.style.display = 'block';

  const w = page3DCanvas.clientWidth, h = page3DCanvas.clientHeight;
  renderer3D.setSize(w, h, false);
  camera3D.aspect = w / h;
  camera3D.updateProjectionMatrix();

  if (!animFrame3D) render3DLoop();
  return true;
}

function render3DLoop() {
  animFrame3D = requestAnimationFrame(render3DLoop);
  if (!dragging3D) rotY += 0.004; // rotazione lenta automatica quando non viene trascinata
  if (mesh3D) { mesh3D.rotation.x = rotX; mesh3D.rotation.y = rotY; }
  renderer3D.render(scene3D, camera3D);
}

function hide3DView() {
  page3DCanvas.style.display = 'none';
  if (animFrame3D) { cancelAnimationFrame(animFrame3D); animFrame3D = null; }
}

document.addEventListener('keydown', e => {
  // ignora la scorciatoia mentre si sta scrivendo in un campo di testo
  // (qui non ce ne sono, ma è una sicurezza per eventuali aggiunte future)
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'e' || e.key === 'E') exportResponseLog();
  if (e.key === 's' || e.key === 'S') toggleStats();
  if (e.key === 'R' && e.shiftKey) clearResponseLog();
  if (e.key === 'Escape') {
    closeQrModal(); // innocuo anche se già chiuso
    // closePageReaction() invece NON va chiamata a vuoto: resetta anche
    // "analyzing" e riabilita GIUDICA, il che interromperebbe un giudizio
    // AI normale in corso se il popup pagina non è nemmeno aperto
    if (pageReactionEl.classList.contains('visible')) closePageReaction();
  }
});
