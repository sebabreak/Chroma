document.querySelectorAll("img[data-a]").forEach(img => setImg(img, img.dataset.a));
function setImg(img, name) {
  img.classList.remove("img-missing");
  img.onload = () => img.classList.remove("img-missing");
  img.onerror = () => img.classList.add("img-missing");
  img.src = "assets/" + name;
}

const PSY = () => LESSONS.filter(l => !l.track);
const DIG = () => LESSONS.filter(l => l.track === "digitale");
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
  },
  { id: "rgb", track: "digitale", title: "RGB: i colori della luce", grad: "linear-gradient(135deg,#ff2d2d,#2dff6a 50%,#2d6bff)",
    body: [
      "Gli schermi creano i colori con la luce: ogni pixel è formato da tre piccole luci, rossa (Red), verde (Green) e blu (Blue). Per questo il modello si chiama RGB.",
      "È un modello additivo: più luce aggiungi, più il colore si schiarisce. Rosso e verde danno il giallo, verde e blu il ciano, rosso e blu il magenta; tutte e tre al massimo danno il bianco.",
      "Ogni canale va da 0 a 255: rgb(255, 0, 0) è il rosso puro, rgb(0, 0, 0) il nero e rgb(255, 255, 255) il bianco. In tutto si ottengono più di 16 milioni di colori."
    ],
    fact: "Se guardi uno schermo con una lente d'ingrandimento vedi davvero i puntini rossi, verdi e blu che, da lontano, l'occhio mescola in un unico colore.",
    quiz: [
      { q: "Che cosa significa RGB?", a: ["A) Rosso, Giallo, Blu", "B) Red, Green, Blue: rosso, verde, blu", "C) Rosa, Grigio, Bianco"], ok: 1 },
      { q: "Cosa ottieni sommando luce rossa e luce verde?", a: ["A) Giallo", "B) Marrone", "C) Viola"], ok: 0 },
      { q: "Quale valore rappresenta il bianco?", a: ["A) rgb(0, 0, 0)", "B) rgb(255, 0, 0)", "C) rgb(255, 255, 255)"], ok: 2 }
    ] },
  { id: "hex", track: "digitale", title: "Il codice HEX", grad: "linear-gradient(135deg,#fa42fa,#6a2aa8)",
    body: [
      "Il codice HEX è un modo compatto di scrivere un colore RGB: un cancelletto seguito da sei caratteri, come #FF7A00.",
      "I sei caratteri sono tre coppie: la prima indica il rosso, la seconda il verde, la terza il blu. Ogni coppia va da 00 (niente) a FF (massimo), cioè da 0 a 255 in numerazione esadecimale.",
      "È il formato più usato nel web e nel design: basta copiarlo per avere esattamente lo stesso colore in un sito, in Figma o in un'app."
    ],
    fact: "Il sistema esadecimale usa 16 simboli: le cifre da 0 a 9 e le lettere da A a F. Così FF vale 15 × 16 + 15 = 255.",
    quiz: [
      { q: "Quale di questi è un codice HEX valido?", a: ["A) #1F5FE0", "B) rgb#12", "C) 1F-5F-E0"], ok: 0 },
      { q: "Nel codice #FF0000, quale canale è al massimo?", a: ["A) Il verde", "B) Il rosso", "C) Il blu"], ok: 1 },
      { q: "Che colore è #000000?", a: ["A) Bianco", "B) Grigio", "C) Nero"], ok: 2 }
    ] },
  { id: "hsl", track: "digitale", title: "Tinta, saturazione e luminosità", grad: "linear-gradient(90deg,#ff3030,#ffd000,#30d060,#30b0ff,#8040ff,#ff30a0)",
    body: [
      "Il modello HSL descrive i colori come li pensiamo noi. La tinta (Hue) è la posizione sulla ruota cromatica, da 0° a 360°: il rosso è a 0°, il verde a 120°, il blu a 240°.",
      "La saturazione dice quanto il colore è intenso: al 100% è vivo, allo 0% diventa grigio. La luminosità va dal nero (0%) al bianco (100%), con il colore pieno al 50%.",
      "HSL è comodo per creare palette: tenendo ferma la tinta e cambiando saturazione e luminosità ottieni tante sfumature armoniche dello stesso colore."
    ],
    fact: "Le combinazioni che hai studiato si calcolano sulla tinta: il complementare di un colore è sempre a 180° di distanza, una triade a 120°.",
    quiz: [
      { q: "Cosa indica la tinta (Hue)?", a: ["A) La posizione del colore sulla ruota", "B) Quanto il colore è chiaro", "C) Quanto costa stamparlo"], ok: 0 },
      { q: "Un colore con saturazione 0% appare…", a: ["A) Più vivo", "B) Grigio", "C) Fluorescente"], ok: 1 },
      { q: "A quanti gradi di distanza si trova il complementare?", a: ["A) 90°", "B) 120°", "C) 180°"], ok: 2 }
    ] },
  { id: "cmyk", track: "digitale", title: "RGB e CMYK: schermo e stampa", grad: "linear-gradient(135deg,#00b7eb,#ff2fa0 50%,#ffe600)",
    body: [
      "Le stampanti non usano la luce ma gli inchiostri: ciano (Cyan), magenta, giallo (Yellow) e nero (Key). È il modello CMYK.",
      "È un modello sottrattivo: ogni inchiostro assorbe una parte della luce, quindi più inchiostro aggiungi, più il colore si scurisce. Il nero si aggiunge a parte per avere neri profondi e risparmiare inchiostro.",
      "Alcuni colori molto accesi dello schermo non si possono stampare: per questo un colore può apparire più spento su carta che sul monitor. Chi progetta per la stampa lavora in CMYK fin dall'inizio."
    ],
    fact: "La K di CMYK viene da Key plate, la lastra “chiave” che nella stampa tipografica portava i dettagli in nero.",
    quiz: [
      { q: "Quale modello usano le stampanti?", a: ["A) CMYK", "B) RGB", "C) HEX"], ok: 0 },
      { q: "Nel modello sottrattivo, aggiungendo inchiostro il colore diventa…", a: ["A) Più chiaro", "B) Più scuro", "C) Trasparente"], ok: 1 },
      { q: "Perché un colore acceso può sembrare spento su carta?", a: ["A) Perché la carta è bianca", "B) Perché lo schermo è rotto", "C) Perché alcuni colori RGB non sono stampabili in CMYK"], ok: 2 }
    ] },
  { id: "contrasto", track: "digitale", title: "Contrasto e accessibilità", grad: "linear-gradient(135deg,#ffffff 50%,#111111 50%)",
    body: [
      "Un testo è leggibile quando c'è abbastanza differenza di luminosità tra testo e sfondo. Questa differenza si misura con il rapporto di contrasto, da 1:1 (nessuna differenza) a 21:1 (nero su bianco).",
      "Le linee guida internazionali WCAG chiedono almeno 4,5:1 per il testo normale e 3:1 per i testi grandi e le icone: è il livello AA. Il livello AAA chiede 7:1.",
      "Circa l'8% degli uomini ha una forma di daltonismo: per questo non bisogna affidare un'informazione solo al colore, ma aggiungere anche testo, icone o forme."
    ],
    fact: "Anche CHROMA controlla il contrasto: quando scegli un tema, l'app corregge da sola i colori perché testi e pulsanti restino leggibili.",
    quiz: [
      { q: "Qual è il contrasto minimo AA per un testo normale?", a: ["A) 2:1", "B) 4,5:1", "C) 21:1"], ok: 1 },
      { q: "Quale combinazione ha il contrasto più alto?", a: ["A) Nero su bianco", "B) Giallo su bianco", "C) Grigio su grigio"], ok: 0 },
      { q: "Come aiuti chi è daltonico?", a: ["A) Usando solo rosso e verde", "B) Usando colori più chiari", "C) Affiancando al colore testo, icone o forme"], ok: 2 }
    ] }
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
  $("[data-combo-name]").textContent = c.id + (S.combosRead.includes(c.id) ? "  ·  ✓ Letta" : "");
  setImg($("[data-combo-img]"), c.img);
  $("[data-combo-intro]").textContent = c.intro;
  $("[data-combo-how]").textContent = c.how;
  $("[data-combo-when]").textContent = c.when;
  $("[data-combo-extra1]").textContent = c.extra[0];
  $("[data-combo-extra2]").textContent = c.extra[1];
  const p1 = $("[data-combo-p1]"), p2 = $("[data-combo-p2]"), btn = $("[data-combo-next]");
  p1.hidden = false; p2.hidden = true; btn.textContent = "avanti";
  btn.onclick = () => {
    if (p2.hidden) { p1.hidden = true; p2.hidden = false; btn.textContent = "Quiz"; scr.querySelector(".scroll").scrollTo(0, 0);
      if (!S.combosRead.includes(c.id)) { S.combosRead.push(c.id); addXP(0); } }
    else openQuiz(c.id);
  };
  go("combo");
}

const DEF = { xp: 0, level: 1, xpTotal: 0, streak: 1, quizzes: 0, lessonsTotal: 0, done: [], onboarded: false,
  claimed: [], redeemed: [], lastDay: null, badges: [], best: {}, combosRead: [], bestStreak: 1, games: {}, labSaved: false, photoDone: false,
  day: { d: "", lessons: 0, quiz: 0, perfect: 0, time: 0, claimed: [] },
  owned: ["perla", "ardesia"], theme: null,
  name: "", time: 0, missionsDone: 0, myPalettes: [], dark: "auto" };
let S;
try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem("chroma") || "{}")); } catch { S = { ...DEF }; }
if (!Array.isArray(S.badges)) S.badges = [];
(S.claimed || []).forEach(id => { const b = { lessons: "Badge dello studente", quiz: "Badge dello studioso", days: "Badge sociale" }[id]; if (b && !S.badges.includes(b)) S.badges.push(b); });
S.claimed = (S.claimed || []).filter(id => /^[ps]\d/.test(id));
delete S.m;
S.best = S.best || {}; S.combosRead = S.combosRead || []; S.bestStreak = Math.max(S.bestStreak || 1, S.streak || 1);
if (S.xp >= 200 + 50 * (S.level - 1)) S.xp = 200 + 50 * (S.level - 1) - 1;
function dayKey() { return new Date().toDateString(); }
function day() {
  if (!S.day || S.day.d !== dayKey()) S.day = { d: dayKey(), lessons: 0, quiz: 0, perfect: 0, time: 0, claimed: [] };
  return S.day;
}
const save = () => { try { localStorage.setItem("chroma", JSON.stringify(S)); } catch {} };

function render() {
  const t = Math.floor(S.time / 60);
  const vals = { ...S, xpTotal: S.xpTotal.toLocaleString("it-IT"),
    greet: S.name || "Benvenuto", name: S.name || "Ospite", levelTitle: shownTitle(), levelNext: levelTitle(S.level + 1), xpLeft: xpNeed(S.level) - S.xp, xpNeed: xpNeed(S.level),
    completion: Math.round(completion() * 100) + "%", titlesN: S.level,
    timeStr: t >= 60 ? `${Math.floor(t / 60)} h ${t % 60} min` : `${t} min`,
    quests: S.quizzes + S.lessonsTotal, ownedN: S.owned.length, totalColors: COLORS.length };
  document.querySelectorAll("[data-bind]").forEach(el => el.textContent = vals[el.dataset.bind]);
  const ln = document.querySelector("[data-lv-next]");
  if (ln) ln.innerHTML = S.level >= MAX_LEVEL ? "🏆 Livello massimo raggiunto: hai completato tutto CHROMA!"
    : S.level === MAX_LEVEL - 1 && S.xp >= xpNeed(S.level) ? `Completa tutto il percorso per diventare <b>${levelTitle(MAX_LEVEL)}</b> (${vals.completion})`
    : `Ancora <b>${vals.xpLeft}</b> XP per diventare <b>${vals.levelNext}</b>`;
  document.querySelectorAll("[data-bind-width=xp]").forEach(el => el.style.width = Math.min(100, S.xp / xpNeed(S.level) * 100) + "%");
  document.querySelectorAll("[data-bind-width=completion]").forEach(el => el.style.width = (completion() * 100) + "%");
  document.querySelectorAll(".lesson").forEach(el => {
    const quizList = el.closest('[data-lessons^="quiz"], [data-combo-quiz]');
    if (!quizList) {
      el.classList.remove("done");
      let st = el.querySelector(".qstat");
      if (!st) { st = document.createElement("span"); el.appendChild(st); }
      const d = S.done.includes(el.dataset.id);
      st.className = "qstat" + (d ? " ok" : ""); st.textContent = d ? "✓ Completata" : "";
      return;
    }
    el.classList.remove("done");
    let st = el.querySelector(".qstat");
    if (!st) { st = document.createElement("span"); st.className = "qstat"; el.appendChild(st); }
    const col = COLOR_BY[EV[el.dataset.id]], best = (S.best || {})[el.dataset.id];
    el.classList.toggle("qlock", !quizOpen(el.dataset.id));
    if (!quizOpen(el.dataset.id)) { st.className = "qstat lock"; st.textContent = "🔒 Prima la teoria"; }
    else if (S.redeemed.includes(el.dataset.id)) { st.className = "qstat ok"; st.innerHTML = `<i style="background:${col.h}"></i>✓ Completato`; }
    else if (best === 3) { st.className = "qstat todo"; st.innerHTML = `<i style="background:${col.h}"></i>Colore da riscattare`; }
    else if (best) { st.className = "qstat part"; st.textContent = `Record ${best}/3`; }
    else { st.className = "qstat"; st.textContent = ""; }
  });
  document.querySelectorAll("[data-combo]").forEach(b => {
    const r = S.combosRead.includes(b.dataset.combo);
    b.classList.toggle("read", r);
    b.title = r ? "Teoria letta ✓" : "";
  });
  const cr = document.querySelector("[data-combo-read-n]");
  if (cr) cr.textContent = `${S.combosRead.length} / ${COMBOS.length} lette`;
  const ld = document.querySelector("[data-lessons-done-n]");
  if (ld) ld.textContent = `${PSY().filter(l => S.done.includes(l.id)).length} / ${PSY().length} completate`;
  const ldd = document.querySelector("[data-dig-done-n]");
  if (ldd) ldd.textContent = `${DIG().filter(l => S.done.includes(l.id)).length} / ${DIG().length} completate`;
  const doneIn = ids => ids.filter(id => S.redeemed.includes(id)).length;
  const qc = document.querySelector("[data-qprog-colors]"), qm = document.querySelector("[data-qprog-combo]");
  if (qc) qc.textContent = `${doneIn(PSY().map(l => l.id))} / ${PSY().length} completati`;
  const qd = document.querySelector("[data-qprog-dig]");
  if (qd) qd.textContent = `${doneIn(DIG().map(l => l.id))} / ${DIG().length} completati`;
  if (qm) qm.textContent = `${doneIn(COMBOS.map(c => c.id))} / ${COMBOS.length} completati`;
  renderMissions(); renderBadges(); renderColors();
}

const LEVEL_TITLES = ["Apprendista", "Curioso del colore", "Esploratore del colore", "Osservatore di sfumature",
  "Pittore alle prime armi", "Mescolatore di tinte", "Cacciatore di contrasti", "Pittore sfumato", "Alchimista dei pigmenti",
  "Maestro del colore", "Custode della ruota cromatica", "Architetto delle armonie", "Poeta della luce", "Virtuoso della palette",
  "Visionario cromatico", "Signore delle tonalità", "Guru del colore", "Mago dello spettro", "Oracolo dei colori", "Leggenda cromatica"];
const ROMAN = n => [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]].reduce((r, [v, s]) => { while (n >= v) { r += s; n -= v; } return r; }, "");
function levelTitle(l) { return LEVEL_TITLES[Math.min(Math.max(1, l), LEVEL_TITLES.length) - 1]; }
const MAX_LEVEL = LEVEL_TITLES.length;
function totalXP() {
  return LESSONS.length * 50 + (LESSONS.length + COMBOS.length) * 100 +
    MISSIONS.filter(m => m.type !== "giornaliera").reduce((a, m) => a + m.xp, 0);
}
let NEEDS = null;
function xpNeed(l) {
  if (!NEEDS) {
    const T = totalXP(), w = Array.from({ length: MAX_LEVEL - 1 }, (_, i) => 1 + .12 * i), sw = w.reduce((a, b) => a + b);
    NEEDS = w.map(x => Math.round(x * T / sw));
    NEEDS[NEEDS.length - 1] += T - NEEDS.reduce((a, b) => a + b);
  }
  return NEEDS[Math.min(Math.max(l, 1), MAX_LEVEL - 1) - 1];
}
function progressParts() {
  const all = [...LESSONS, ...COMBOS].map(x => x.id), once = MISSIONS.filter(m => m.type !== "giornaliera");
  return [
    [S.done.length, LESSONS.length], [all.filter(id => S.best[id] === 3).length, all.length],
    [all.filter(id => S.redeemed.includes(id)).length, all.length], [S.combosRead.length, COMBOS.length],
    [once.filter(m => S.claimed.includes(m.id)).length, once.length]
  ];
}
function completion() { const p = progressParts(); return p.reduce((a, [d]) => a + d, 0) / p.reduce((a, [, t]) => a + t, 0); }
const allComplete = () => progressParts().every(([d, t]) => d >= t);
function levelUpLoop() {
  while (S.level < MAX_LEVEL && S.xp >= xpNeed(S.level)) {
    if (S.level === MAX_LEVEL - 1 && !allComplete()) { S.xp = xpNeed(S.level); break; }
    S.xp -= xpNeed(S.level); S.level++; onLevelUp();
  }
  if (S.level >= MAX_LEVEL) { S.level = MAX_LEVEL; S.xp = xpNeed(MAX_LEVEL); }
}
function addXP(n) {
  S.xp += n; S.xpTotal += n;
  levelUpLoop();
  save(); render();
}

document.querySelectorAll("[data-lessons]").forEach(list => {
  const kind = list.dataset.lessons || "", toQuiz = kind.startsWith("quiz");
  const digital = kind.includes("digitale");
  LESSONS.filter(l => digital ? l.track === "digitale" : !l.track).forEach(l => {
    const b = document.createElement("button");
    b.className = "lesson"; b.dataset.id = l.id;
    b.innerHTML = `${l.img ? '<img class="thumb" alt="">' : `<i class="thumb grad" style="background:${l.grad}"></i>`}<div class="info"><div class="t">${l.title}</div>
      <div class="s">${l.track ? "Il colore nel digitale" : "Psicologia del colore"}</div><div class="m"><img class="clock" alt="">5 min</div></div><img class="go" alt="">`;
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
  scr.querySelector(".detail-meta").textContent = "5 min · livello base" + (S.done.includes(id) ? " · ✓ Completata" : "");
  scr.querySelector("[data-lesson-body]").innerHTML = l.body.map(p => `<p>${p}</p>`).join("");
  scr.querySelector("[data-lesson-fact]").textContent = l.fact;
  scr.querySelector("[data-lesson-next]").onclick = () => {
    const first = !S.done.includes(id);
    day().lessons++;
    if (first) { S.done.push(id); S.lessonsTotal++; addXP(50); } else save();
    const lf = document.getElementById("lezfine");
    lf.querySelector("h2").textContent = first ? "Lezione completata!" : "Lezione ripassata!";
    lf.querySelector("p").textContent = first ? "Hai guadagnato" : "Gli XP di questa lezione li hai già ottenuti";
    lf.querySelector("b").textContent = first ? "+ 50 XP" : "";
    const qb = lf.querySelector("[data-lf-quiz]");
    qb.textContent = S.redeemed.includes(id) ? "Rifai il quiz" : "Fai il quiz";
    qb.onclick = () => openQuiz(id);
    go("lezfine");
  };
  scr.querySelector("[data-lesson-quiz]").onclick = () => openQuiz(id);
  if (current === "lezione") { scr.querySelector(".scroll").scrollTo(0, 0); } else go("lezione");
}

const isCombo = id => COMBOS.some(c => c.id === id);
const quizOpen = id => (S.best || {})[id] != null || (isCombo(id) ? S.combosRead.includes(id) : S.done.includes(id));
function openTheory(id) { isCombo(id) ? openCombo(id) : openLesson(id); }
function openQuiz(id) {
  const l = LESSONS.find(x => x.id === id) || COMBOS.find(x => x.id === id);
  if (!quizOpen(id)) {
    if (current === "lezione" || current === "combo") return toast("Arriva in fondo alla lezione per sbloccare il quiz");
    toast("🔒 Prima studia la teoria: poi il quiz si sblocca");
    return openTheory(id);
  }
  if ((S.best || {})[id] === 3 && !S.redeemed.includes(id)) return showEvent(l, 3, true);
  const scr = document.getElementById("quiz");
  const $ = s => scr.querySelector(s);
  let n = 0, score = 0;
  paintWith(scr, (COLOR_BY[EV[id]] || COLOR_BY.blu).h);
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
        if (box.dataset.answered) return;
        box.dataset.answered = 1;
        const right = k === item.ok;
        if (right) score++;
        b.classList.add(right ? "right" : "wrong");
        box.children[item.ok].classList.add("right");
        $("[data-quiz-feedback]").textContent = right ? "Esatto! 🎉" : "Non proprio… la risposta giusta è evidenziata.";
        $("[data-quiz-next]").hidden = false;
      };
      box.appendChild(b);
    });
    delete box.dataset.answered;
  }
  $("[data-quiz-next]").onclick = () => { n++; n < l.quiz.length ? show() : finish(); };

  function finish() {
    S.quizzes++;
    const d = day(); d.quiz++; if (score === l.quiz.length) d.perfect++;
    const prev = S.best[l.id] || 0;
    const xp = score === l.quiz.length && prev < score ? 100 - prev * 30 : score > prev ? (score - prev) * 30 : score * 10;
    S.best[l.id] = Math.max(prev, score);
    showEvent(l, score, false, xp);
  }

  $("[data-quiz-next]").textContent = "avanti";
  show();
  go("quiz");
}

const EV = {
  rosso: "rosso", arancione: "arancione", giallo: "giallo", verde: "verde", blu: "blu", viola: "viola", bianco: "bianco", nero: "nero",
  rgb: "neon", hex: "fucsia", hsl: "oltremare", cmyk: "ghiaccio", contrasto: "pesca",
  "Complementari": "turchese", "Analoghi": "lime", "Triade": "magenta",
  "Split complementari": "corallo", "Rettangolo": "oliva", "Quadrato": "petrolio"
};
function showEvent(l, score, replay, gained) {
  const tot = l.quiz.length, perfect = score === tot;
  const colr = COLOR_BY[EV[l.id]] || COLOR_BY.blu, name = colr.n, col = colr.h;
  const xp = replay ? 0 : gained ?? (perfect ? 100 : score * 30);
  if (xp) addXP(xp);
  const scr = document.getElementById("evento"), $ = q => scr.querySelector(q);
  scr.style.setProperty("--ev", col);
  scr.style.setProperty("--ev-on", onColor(col));
  const lightEv = lum(col) > .42;
  scr.classList.toggle("light-ev", lightEv);
  scr.style.setProperty("--ev-link", lightEv ? mix(col, "#000000", .55) : col);
  paintWith(scr, col);
  $("[data-ev-score]").textContent = `${score} / ${tot}`;
  $("[data-ev-acc]").textContent = Math.round(score / tot * 100) + " %";
  $("[data-ev-xp]").textContent = replay ? "XP già ottenuti" : "+ " + xp + " XP";
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
  { id: "marrone", n: "Marrone", h: "#5c3a22", src: "reward", hint: "Reward missioni" },
  { id: "neon", n: "Verde neon", h: "#06f87f", src: "quiz", hint: "Quiz RGB" },
  { id: "fucsia", n: "Fucsia", h: "#fa42fa", src: "quiz", hint: "Quiz HEX" },
  { id: "oltremare", n: "Oltremare", h: "#2604ae", src: "quiz", hint: "Quiz HSL" },
  { id: "ghiaccio", n: "Ghiaccio", h: "#b4eefd", src: "quiz", hint: "Quiz CMYK" },
  { id: "pesca", n: "Pesca", h: "#efbf8f", src: "quiz", hint: "Quiz Contrasto" },
  { id: "crema", n: "Crema", h: "#fdfdb4", src: "reward", hint: "Reward missioni" },
  { id: "lampone", n: "Lampone", h: "#e65572", src: "reward", hint: "Reward missioni" }
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
const FAMILIES = [
  ["Rossi", ["corallo", "lampone", "rosso", "carminio"]],
  ["Arancioni e terre", ["pesca", "arancione", "terracotta", "marrone"]],
  ["Gialli", ["crema", "giallo", "oro"]],
  ["Verdi-gialli", ["lime", "oliva"]],
  ["Verdi", ["menta", "neon", "salvia", "verde", "bosco"]],
  ["Ciano", ["ghiaccio", "turchese", "petrolio"]],
  ["Blu", ["azzurro", "blu", "oltremare", "notte"]],
  ["Viola", ["lavanda", "viola", "prugna"]],
  ["Rosa e magenta", ["rosa", "fucsia", "magenta"]],
  ["Neutri", ["bianco", "perla", "ardesia", "nero"]]
];
const SCALE = FAMILIES.flatMap(f => f[1]);
const byHue = ids => [...ids].sort((a, b) => SCALE.indexOf(a) - SCALE.indexOf(b));

function levelColor(l) {
  if (l >= 20) return "conic-gradient(#e3242b, #ff7a00, #ffd000, #2fa84f, #12c4c0, #1f5fe0, #8a2be2, #e3242b)";
  const h = (l - 1) * (285 / 19), s = 78, li = h > 40 && h < 190 ? 42 : 52;
  return `hsl(${h.toFixed(0)} ${s}% ${li}%)`;
}
const COLOR_BY = Object.fromEntries(COLORS.map(c => [c.id, c]));

const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = a => "#" + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => rgb2hex(hex2rgb(a).map((v, i) => v + (hex2rgb(b)[i] - v) * t));
const lum = h => { const [r, g, b] = hex2rgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const onColor = h => contrast(h, "#ffffff") >= contrast(h, "#111111") ? "#fff" : "#111";
function ensure(c, against, min, toward) {
  let out = c;
  for (let i = 1; i <= 20 && contrast(out, against) < min; i++) out = mix(c, toward, i * .05);
  return out;
}
function tokens(h, dark) {
  const base = dark ? "#141417" : "#f2f2f2";
  const bg = mix(h, base, dark ? .88 : .9);
  const accent = ensure(h, bg, 3, dark ? "#ffffff" : "#000000");
  const soft = ensure(mix(h, dark ? base : "#ffffff", dark ? .5 : .55), bg, 1.35, dark ? "#ffffff" : "#000000");
  const card = ensure(mix(h, "#000000", .08), "#ffffff", 3, "#000000");
  const pageMid = ensure(mix(h, "#000000", .28), "#ffffff", 4.5, "#000000");
  const pageDeep = ensure(mix(h, "#000000", .48), "#ffffff", 5.5, "#000000");
  const pageAlt = ensure(mix(h, "#000000", .4), "#ffffff", 5, "#000000");
  const tint = ensure(mix(h, "#ffffff", .7), "#111111", 9, "#ffffff");
  const tint2 = ensure(mix(h, "#ffffff", .62), "#111111", 8, "#ffffff");
  const tint3 = ensure(mix(h, "#ffffff", .45), "#111111", 6, "#ffffff");
  const strong = ensure(mix(h, "#000000", .12), "#ffffff", 4.5, "#000000");
  return {
    "--bg": bg, "--purple-btn": accent, "--sky-dark": accent, "--mission": accent, "--theme-dot": accent, "--link": ensure(accent, bg, 4.5, dark ? "#ffffff" : "#000000"),
    "--on-accent": onColor(accent), "--on-dark": onColor(accent),
    "--sky-light": soft, "--on-light": onColor(soft),
    "--blue-card": card, "--on-blue": onColor(card),
    "--brown": pageMid, "--darkbrown": pageDeep, "--teal": pageAlt,
    "--quiz-card": tint, "--yellow": tint2, "--yellow-top": tint3,
    "--quiz-purple": strong, "--on-quiz-purple": "#fff",
    "--digbg": ensure(mix(h, "#000000", .55), "#ffffff", 7, "#000000")
  };
}
const THEME_PROPS = Object.keys(tokens("#888888", false));
const isDark = () => document.documentElement.dataset.dark === "dark";
function applyTheme(id) {
  S.theme = id && COLOR_BY[id] ? id : null; save();
  const root = document.documentElement.style;
  if (!S.theme) { THEME_PROPS.forEach(p => root.removeProperty(p)); renderColors(); return; }
  Object.entries(tokens(COLOR_BY[S.theme].h, isDark())).forEach(([k, v]) => root.setProperty(k, v));
  renderColors();
}
function paintWith(el, hex) {
  const t = tokens(hex, false);
  ["--darkbrown", "--brown", "--quiz-card", "--purple-btn", "--on-accent"].forEach(k => el.style.setProperty(k, t[k]));
}
function unlockColor(id) {
  if (!S.owned.includes(id)) S.owned.push(id);
  addXP(0);
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
  own.innerHTML = "";
  FAMILIES.forEach(([fam, ids]) => {
    const row = document.createElement("div");
    row.className = "fam";
    const got = ids.filter(id => S.owned.includes(id)).length;
    row.innerHTML = `<div class="fam-h"><span>${fam}</span><small>${got} / ${ids.length}</small></div><div class="fam-row"></div>`;
    ids.forEach(id => {
      const c = COLOR_BY[id], has = S.owned.includes(id);
      const el = document.createElement("button");
      el.className = "sw" + (has ? "" : " locked") + (S.theme === id ? " cur" : "");
      el.innerHTML = `<i style="background:${c.h}"></i><span>${c.n}</span>${has ? "" : `<small>${c.hint}</small>`}`;
      el.onclick = has ? () => { applyTheme(S.theme === id ? null : id); } : () => unlockPath(id);
      if (!has) el.title = "Come si sblocca: " + c.hint;
      row.querySelector(".fam-row").appendChild(el);
    });
    own.appendChild(row);
  });
  const strip = document.querySelector("[data-scale]");
  if (strip) strip.innerHTML = SCALE.map(id => `<i data-unlock="${S.owned.includes(id) ? "" : id}" class="${S.owned.includes(id) ? "" : "off"}" style="background:${COLOR_BY[id].h}" title="${COLOR_BY[id].n}"></i>`).join("");
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

const perfectIn = ids => ids.filter(id => S.best[id] === 3).length;
const MISSIONS = [
  { id: "p1", type: "percorso", title: "Primi passi", desc: "Completa la tua prima lezione di psicologia del colore.", target: 1, v: () => S.done.length, xp: 50, color: "rosa", go: "lezioni", cta: "Vai alle lezioni" },
  { id: "p2", type: "percorso", title: "A metà strada", desc: "Completa 4 lezioni del percorso guidato.", target: 4, v: () => S.done.length, xp: 150, color: "terracotta", go: "lezioni", cta: "Vai alle lezioni" },
  { id: "p3", type: "percorso", title: "Studente dei colori", desc: "Completa tutte le 8 lezioni di psicologia del colore.", target: 8, v: () => PSY().filter(l => S.done.includes(l.id)).length, xp: 300, color: "carminio", badge: "Badge dello studente", go: "lezioni", cta: "Vai alle lezioni" },
  { id: "p4", type: "percorso", title: "Primo 3 su 3", desc: "Rispondi correttamente a tutte le domande di un quiz.", target: 1, v: () => perfectIn(Object.keys(S.best)), xp: 100, color: "azzurro", go: "quizhub", cta: "Vai ai quiz" },
  { id: "p5", type: "percorso", title: "Esperto di psicologia", desc: "Fai 3 su 3 in tutti gli 8 quiz sui colori.", target: 8, v: () => perfectIn(PSY().map(l => l.id)), xp: 400, color: "prugna", badge: "Badge dello studioso", go: "quizcat", cta: "Vai ai quiz" },
  { id: "p6", type: "percorso", title: "Teorico delle armonie", desc: "Leggi la teoria di tutte le 6 combinazioni di colori, fino alla seconda pagina.", target: 6, v: () => S.combosRead.length, xp: 200, color: "salvia", go: "explore", cta: "Vai alle combinazioni" },
  { id: "p7", type: "percorso", title: "Armonia perfetta", desc: "Fai 3 su 3 in tutti i 6 quiz sulle combinazioni.", target: 6, v: () => perfectIn(COMBOS.map(c => c.id)), xp: 400, color: "bosco", go: "quizcomb", cta: "Vai ai quiz" },
  { id: "p8", type: "percorso", title: "Creativo", desc: "Crea la tua prima palette personale con i colori sbloccati.", target: 1, v: () => S.myPalettes.length, xp: 100, color: "menta", go: "palette", cta: "Vai alle palette" },
  { id: "p9", type: "percorso", title: "Grande collezione", desc: "Sblocca 15 colori tra quiz e missioni.", target: 15, v: () => S.owned.length, xp: 300, color: "marrone", go: "colori", cta: "I tuoi colori" },
  { id: "p10", type: "percorso", title: "Nativo digitale", desc: "Completa le 5 lezioni del percorso “Il colore nel digitale”.", target: 5, v: () => DIG().filter(l => S.done.includes(l.id)).length, xp: 250, badge: "Badge digitale", go: "lezioni", cta: "Vai alle lezioni" },
  { id: "p11", type: "percorso", title: "Occhio digitale", desc: "Fai 3 su 3 in tutti i 5 quiz sul colore digitale.", target: 5, v: () => perfectIn(DIG().map(l => l.id)), xp: 300, go: "quizdig", cta: "Vai ai quiz" },
  { id: "p12", type: "percorso", title: "Sperimentatore", desc: "Crea un'armonia nel Laboratorio e salvala come palette.", target: 1, v: () => S.labSaved ? 1 : 0, xp: 100, color: "crema", go: "lab", cta: "Apri il Laboratorio" },
  { id: "p13", type: "percorso", title: "Detective del colore", desc: "Analizza i colori di una tua foto con “Colori da una foto”.", target: 1, v: () => S.photoDone ? 1 : 0, xp: 100, color: "lampone", go: "foto", cta: "Analizza una foto" },
  { id: "p14", type: "percorso", title: "Occhio allenato", desc: "Fai almeno 4 su 5 in tutti e 3 i giochi dell'allenamento.", target: 3, v: () => ["guess", "order", "comp"].filter(g => (S.games || {})[g] >= 4).length, xp: 200, badge: "Occhio allenato", go: "quizhub", cta: "Vai ai giochi" },
  { id: "s1", type: "serie", title: "3 giorni di fila", desc: "Apri CHROMA per 3 giorni consecutivi. Colore speciale!", target: 3, v: () => S.bestStreak, xp: 100, color: "oro", go: "home", cta: "Torna domani" },
  { id: "s2", type: "serie", title: "7 giorni di fila", desc: "Apri CHROMA per 7 giorni consecutivi. Colore speciale!", target: 7, v: () => S.bestStreak, xp: 200, color: "lavanda", badge: "Badge sociale", go: "home", cta: "Torna domani" },
  { id: "s3", type: "serie", title: "14 giorni di fila", desc: "Apri CHROMA per 14 giorni consecutivi. Colore speciale!", target: 14, v: () => S.bestStreak, xp: 400, color: "notte", go: "home", cta: "Torna domani" },
  { id: "d1", type: "giornaliera", title: "Completa o ripassa 1 lezione", desc: "Oggi completa una lezione nuova o ripassane una già fatta.", target: 1, v: () => day().lessons, xp: 40, go: "lezioni", cta: "Vai alle lezioni" },
  { id: "d2", type: "giornaliera", title: "Rispondi a 2 quiz", desc: "Oggi completa due quiz qualsiasi, anche già fatti.", target: 2, v: () => day().quiz, xp: 60, go: "quizhub", cta: "Vai ai quiz" },
  { id: "d3", type: "giornaliera", title: "Fai un quiz perfetto", desc: "Oggi rispondi correttamente a tutte le domande di un quiz.", target: 1, v: () => day().perfect, xp: 80, go: "quizhub", cta: "Vai ai quiz" },
  { id: "d4", type: "giornaliera", title: "Studia 5 minuti", desc: "Resta nell'app a studiare almeno 5 minuti oggi.", target: 5, v: () => Math.floor(day().time / 60), xp: 50, go: "lezioni", cta: "Studia ora" }
];
MISSIONS.forEach(m => { if (m.color) COLOR_BY[m.color].hint = (m.type === "serie" ? "Serie: " : "Missione: ") + m.title; });
const prog = m => Math.min(m.target, m.v());
const isClaimed = m => m.type === "giornaliera" ? day().claimed.includes(m.id) : S.claimed.includes(m.id);
const isReady = m => prog(m) >= m.target && !isClaimed(m);

function missionItem(m) {
  const p = prog(m), claimed = isClaimed(m), ready = isReady(m), c = m.color && COLOR_BY[m.color];
  const b = document.createElement("button");
  b.className = "m-item" + (ready ? " ready" : "") + (claimed ? " claimed" : "");
  b.innerHTML = `<div class="top"><span>${m.title}</span><b>+ ${m.xp} XP</b></div>
    <div class="m-sub">${c ? `<i style="background:${c.h}"></i>${c.n}` : m.badge ? "" : "Solo XP"}${m.badge ? ` · ${m.badge}` : ""}<em>${p} / ${m.target}</em></div>
    <div class="mbar"><i style="width:${p / m.target * 100}%"></i></div>
    ${ready ? '<div class="tag">Completata! Tocca per riscattare</div>' : claimed ? '<div class="tag">Riscattata ✓</div>' : ""}`;
  b.onclick = () => openMission(m.id);
  return b;
}
function renderMissions() {
  const pane = t => document.querySelector(`[data-missions="${t}"]`);
  if (!pane("percorso")) return;
  ["percorso", "giornaliera", "serie"].forEach(t => {
    const el = pane(t); el.innerHTML = "";
    MISSIONS.filter(m => m.type === t).sort((a, b) => isClaimed(a) - isClaimed(b)).forEach(m => el.appendChild(missionItem(m)));
  });
  const daily = MISSIONS.filter(m => m.type === "giornaliera");
  const doneToday = daily.filter(isClaimed).length, readyAll = MISSIONS.filter(isReady).length;
  const ch = document.querySelector("[data-ch-sub]");
  if (ch) ch.textContent = doneToday === daily.length ? "Hai completato le missioni di oggi! 🎉" : `Missioni di oggi: ${doneToday} / ${daily.length} completate`;
  const badge = document.querySelector("[data-m-ready]");
  if (badge) { badge.textContent = readyAll; badge.hidden = !readyAll; }
  const next = MISSIONS.find(m => m.type === "percorso" && !isClaimed(m));
  const am = document.querySelector("[data-am]");
  if (am) {
    am.hidden = !next;
    if (next) {
      am.onclick = () => openMission(next.id);
      document.querySelector("[data-am-title]").textContent = next.title + (isReady(next) ? " ✓" : "");
      document.querySelector("[data-am-n]").textContent = `${prog(next)} / ${next.target}`;
      document.querySelector("[data-am-xp]").textContent = `+ ${next.xp} XP`;
      document.querySelector("[data-am-bar]").style.width = (prog(next) / next.target * 100) + "%";
    }
  }
}
function openMission(id) {
  const m = MISSIONS.find(x => x.id === id), scr = document.getElementById("missione"), $ = q => scr.querySelector(q);
  const p = prog(m), claimed = isClaimed(m), ready = isReady(m), c = m.color && COLOR_BY[m.color];
  $("[data-md-kind]").textContent = { percorso: "Missione del percorso", giornaliera: "Missione giornaliera", serie: "Missione speciale" }[m.type];
  $("[data-md-title]").textContent = m.title;
  $("[data-md-desc]").textContent = m.desc;
  $("[data-md-n]").textContent = `${p} / ${m.target}`;
  $("[data-md-bar]").style.width = (p / m.target * 100) + "%";
  $("[data-md-xp]").textContent = `+ ${m.xp} XP`;
  $("[data-md-extra]").innerHTML = c ? `<i style="background:${c.h}"></i>${c.n}` : m.badge ? "" : "Solo XP";
  if (m.badge) $("[data-md-extra]").innerHTML += (c ? " · " : "") + m.badge;
  const pic = $("[data-md-pic]"), bdef = m.badge && BADGES.find(x => x.n === m.badge);
  pic.innerHTML = c ? `<span class="md-swatch${claimed ? "" : " dim"}" style="background:${c.h}"></span>` : bdef ? badgeArt(bdef.icon, bdef.c) : `<span class="md-xp">XP</span>`;
  const btn = $("[data-md-btn]");
  btn.disabled = claimed || (m.type === "serie" && !ready);
  btn.textContent = claimed ? "Già riscattata" : ready ? "Riscatta reward" : m.cta;
  btn.onclick = () => {
    if (!ready) return go(m.go);
    if (m.type === "giornaliera") day().claimed.push(id); else S.claimed.push(id);
    S.missionsDone++;
    if (m.badge && !S.badges.includes(m.badge)) S.badges.push(m.badge);
    if (c) unlockColor(c.id);
    const rc = document.querySelector("[data-ro-color]");
    rc.textContent = c ? "+ " + c.n : "";
    rc.hidden = !c;
    rc.style.setProperty("--won", c ? c.h : "transparent");
    addXP(m.xp);
    document.querySelector("[data-ro-xp]").textContent = `+ ${m.xp} XP`;
    document.querySelector("[data-ro-badge]").textContent = m.badge ? `+ ${m.badge}` : "";
    go("rewardok");
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
  { n: "Badge dello studente", d: "Completa tutte le lezioni", icon: "book", c: "#e07a2c", got: () => S.badges.includes("Badge dello studente") },
  { n: "Badge dello studioso", d: "3/3 in tutti i quiz sui colori", icon: "check", c: "#6b3fb8", got: () => S.badges.includes("Badge dello studioso") },
  { n: "Badge sociale", d: "7 giorni di fila", icon: "flame", c: "#d0112b", got: () => S.badges.includes("Badge sociale") },
  { n: "Maestro del colore", d: "Raggiungi il livello 10", icon: "crown", c: "#c9960f", got: () => S.level >= 10 },
  { n: "Badge digitale", d: "Completa le lezioni sul digitale", icon: "pixel", c: "#2604ae", got: () => S.badges.includes("Badge digitale") },
  { n: "Occhio allenato", d: "4/5 in tutti i giochi", icon: "eye", c: "#15707a", got: () => S.badges.includes("Occhio allenato") },
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
    if (!got) { setImg(el.querySelector("img"), "badge-bloccato.svg"); el.classList.add("tap"); el.onclick = () => badgePath(b); }
    if (f !== "all" && !el.classList.contains(f)) el.classList.add("hide");
    grid.appendChild(el);
  });
}

function badgeArt(icon, c) {
  const pts = Array.from({ length: 32 }, (_, i) => { const r = i % 2 ? 40 : 46, a = Math.PI * i / 16;
    return `${(60 + r * Math.sin(a)).toFixed(1)},${(56 - r * Math.cos(a)).toFixed(1)}`; }).join(" ");
  const I = {
    pixel: '<rect x="42" y="38" width="10" height="10" fill="#fff"/><rect x="55" y="38" width="10" height="10" fill="#e3242b"/><rect x="68" y="38" width="10" height="10" fill="#fff"/><rect x="42" y="51" width="10" height="10" fill="#2fa84f"/><rect x="55" y="51" width="10" height="10" fill="#fff"/><rect x="68" y="51" width="10" height="10" fill="#1f5fe0"/><rect x="42" y="64" width="10" height="10" fill="#fff"/><rect x="55" y="64" width="10" height="10" fill="#fff"/><rect x="68" y="64" width="10" height="10" fill="#fff"/>',
    eye: '<path d="M38 56q22-22 44 0-22 22-44 0z" fill="#fff"/><circle cx="60" cy="56" r="8" fill="' + c + '"/><circle cx="60" cy="56" r="3.5" fill="#111"/>',
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
  const t = dayKey();
  if (S.lastDay === t) return;
  const y = new Date(Date.now() - 864e5).toDateString();
  if (S.lastDay === y) S.streak++;
  else if (S.lastDay) S.streak = 1;
  S.bestStreak = Math.max(S.bestStreak || 1, S.streak);
  S.lastDay = t; day(); save();
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

function unlockPath(id) {
  const q = [...LESSONS, ...COMBOS].find(l => EV[l.id] === id);
  if (q) {
    if (S.best[q.id] === 3 && !S.redeemed.includes(q.id)) return showEvent(q, 3, true);
    if (!quizOpen(q.id)) { toast("Studia “" + q.title + "” e fai 3 su 3 nel quiz"); return openTheory(q.id); }
    toast("Fai 3 su 3 in questo quiz per sbloccarlo"); return openQuiz(q.id);
  }
  const m = MISSIONS.find(x => x.color === id);
  if (m) return openMission(m.id);
  toast("Continua a giocare per sbloccarlo");
}
function badgePath(b) {
  const m = MISSIONS.find(x => x.badge === b.n);
  if (m) return openMission(m.id);
  if (b.icon === "crown") return go("titoli");
  toast(b.d); go("colori");
}
document.addEventListener("click", e => { const t = e.target.closest("[data-unlock]"); if (t && t.dataset.unlock) unlockPath(t.dataset.unlock); });
