const LESSONS = [
  {
    id: "blu", title: "Il significato del blu", img: "lezione-blu.png",
    body: [
      "Il blu è uno dei colori più apprezzati: in molti sondaggi internazionali risulta il preferito. È associato al cielo e all'acqua e, nella cultura occidentale, viene collegato a calma, fiducia e stabilità.",
      "Per questo è molto usato da banche, aziende tecnologiche e istituzioni, che vogliono comunicare professionalità e affidabilità.",
      "Le tonalità più chiare tendono a evocare tranquillità e serenità, mentre quelle più scure vengono associate ad autorevolezza ed eleganza."
    ],
    fact: "Molti social network e aziende tecnologiche hanno un logo blu: è un colore che il pubblico associa facilmente a fiducia e sicurezza.",
    quiz: [
      { q: "A quali sensazioni viene associato più spesso il blu?", a: ["A) Calma e fiducia", "B) Rabbia e urgenza", "C) Fame ed energia"], ok: 0 },
      { q: "Perché molte aziende tecnologiche usano il blu?", a: ["A) Perché è economico da stampare", "B) Perché viene associato all'affidabilità", "C) Perché attira l'attenzione sui saldi"], ok: 1 },
      { q: "A cosa vengono associate le tonalità scure del blu?", a: ["A) Allegria e gioco", "B) Pericolo", "C) Autorevolezza ed eleganza"], ok: 2 }
    ]
  },
  {
    id: "arancione", title: "Il significato dell’arancione", img: "lezione-arancione.jpg",
    body: [
      "L'arancione si ottiene mescolando rosso e giallo e sulla ruota cromatica si trova tra questi due colori. È un colore caldo e molto luminoso.",
      "Nella psicologia del colore viene associato all'entusiasmo, alla creatività e all'ottimismo: richiama l'attenzione in modo meno aggressivo del rosso.",
      "Nel design viene usato spesso per pulsanti e inviti all'azione, perché cattura lo sguardo e comunica un tono amichevole e informale."
    ],
    fact: "Il nome del colore viene da quello del frutto. In inglese antico, prima che l'arancia fosse conosciuta, questa tinta si chiamava geoluhread, cioè “giallo-rosso”.",
    quiz: [
      { q: "Da quali colori nasce l'arancione?", a: ["A) Rosso e Giallo", "B) Blu e Giallo", "C) Rosso e Blu"], ok: 0 },
      { q: "Quale emozione viene associata all'arancione?", a: ["A) Tristezza", "B) Entusiasmo", "C) Freddezza"], ok: 1 },
      { q: "Dove viene usato spesso l'arancione nel design?", a: ["A) Negli sfondi dei documenti legali", "B) Nei testi lunghi", "C) Nei pulsanti di invito all'azione"], ok: 2 }
    ]
  },
  {
    id: "viola", title: "Il significato del viola", img: "lezione-viola.png",
    body: [
      "Il viola si ottiene mescolando rosso e blu. Nell'antichità le tinture viola erano rarissime e costose, e per questo è stato a lungo considerato un colore prezioso.",
      "Nella cultura occidentale viene associato alla creatività, alla spiritualità e al mistero, ma anche al lusso e alla regalità.",
      "Le tonalità chiare come il lilla vengono percepite come delicate e romantiche, mentre quelle profonde richiamano ricchezza e ambizione."
    ],
    fact: "Nell'antica Roma la porpora di Tiro si ricavava da migliaia di molluschi ed era costosissima: la toga interamente purpurea era riservata ai generali durante il trionfo e, più tardi, agli imperatori.",
    quiz: [
      { q: "Da quali colori nasce il viola?", a: ["A) Giallo e Blu", "B) Rosso e Blu", "C) Verde e Rosso"], ok: 1 },
      { q: "A cosa è storicamente associato il viola?", a: ["A) Alla regalità e al lusso", "B) Al lavoro nei campi", "C) Alla segnaletica stradale"], ok: 0 },
      { q: "Come vengono percepite spesso le tonalità chiare come il lilla?", a: ["A) Pericolo", "B) Aggressività", "C) Delicatezza e romanticismo"], ok: 2 }
    ]
  },
  {
    id: "rosso", title: "Il significato del rosso", img: "lezione-rosso.jpg",
    body: [
      "Il rosso è il colore visibile con la lunghezza d'onda più lunga ed è tra quelli che attirano più rapidamente lo sguardo. È legato al fuoco, al sangue e alla passione.",
      "Nella cultura occidentale viene associato a energia, urgenza e desiderio, ed è il colore più usato per segnalare pericoli e divieti.",
      "Nel design si usa con misura, per avvisi, saldi e pulsanti importanti, perché in grandi quantità può risultare aggressivo."
    ],
    fact: "Molte catene di fast food hanno il rosso nel logo: è un colore che si nota subito e che viene spesso associato al cibo e all'energia.",
    quiz: [
      { q: "Quali sensazioni vengono associate al rosso?", a: ["A) Energia e urgenza", "B) Calma e riposo", "C) Freddezza"], ok: 0 },
      { q: "Perché il rosso va usato con misura nel design?", a: ["A) Perché è poco visibile", "B) Perché può risultare aggressivo", "C) Perché non si stampa bene"], ok: 1 },
      { q: "Dove si usa spesso il rosso?", a: ["A) Negli sfondi dei testi lunghi", "B) Nelle app per dormire", "C) In avvisi, saldi e pulsanti importanti"], ok: 2 }
    ]
  },
  {
    id: "giallo", title: "Il significato del giallo", img: "lezione-giallo.jpg",
    body: [
      "Tra i colori puri, il giallo è quello che appare più luminoso: richiama il sole, la luce e l'estate e cattura facilmente lo sguardo.",
      "Viene associato all'ottimismo, alla creatività e alla curiosità; usato su grandi superfici, però, può risultare abbagliante e stancare la vista.",
      "Abbinato al nero crea un contrasto molto forte, leggibile anche a distanza: per questo è usato nella segnaletica e negli avvisi di pericolo."
    ],
    fact: "Dal 1967 i taxi autorizzati di New York devono essere gialli: un colore che si riconosce subito, anche nel traffico.",
    quiz: [
      { q: "A cosa viene associato il giallo?", a: ["A) Al lutto", "B) All'ottimismo e alla luce", "C) Al silenzio"], ok: 1 },
      { q: "Con quale colore il giallo è più leggibile a distanza?", a: ["A) Con il nero", "B) Con il bianco", "C) Con l'arancione"], ok: 0 },
      { q: "Cosa può succedere usando troppo giallo?", a: ["A) Il testo diventa più leggibile", "B) Scompare il contrasto con il nero", "C) Può abbagliare e stancare la vista"], ok: 2 }
    ]
  },
  {
    id: "verde", title: "Il significato del verde", img: "lezione-verde.jpg",
    body: [
      "Il verde è il colore della natura, della crescita e del rinnovamento. L'occhio umano è particolarmente sensibile alla luce verde-gialla, che percepisce come molto luminosa.",
      "Viene associato a equilibrio, salute e tranquillità ed è considerato un colore riposante.",
      "Nel design indica spesso qualcosa di positivo o permesso, come un'operazione riuscita o un semaforo che dà il via libera."
    ],
    fact: "In Europa i cartelli delle uscite di emergenza sono verdi, perché il verde indica sicurezza e “via libera”. Negli Stati Uniti, invece, le scritte EXIT sono spesso rosse.",
    quiz: [
      { q: "Quale concetto viene associato al verde?", a: ["A) Pericolo", "B) Lusso", "C) Natura e crescita"], ok: 2 },
      { q: "Cosa indica il verde nelle interfacce?", a: ["A) Un'operazione riuscita", "B) Un errore grave", "C) Un contenuto vietato"], ok: 0 },
      { q: "Che effetto viene attribuito al verde?", a: ["A) Agitazione", "B) Equilibrio e riposo", "C) Fame"], ok: 1 }
    ]
  },
  {
    id: "bianco", title: "Il significato del bianco", img: "lezione-bianco.jpg",
    body: [
      "La luce bianca contiene tutti i colori dello spettro visibile, come mostra un prisma. Nella cultura occidentale il bianco rappresenta purezza, pulizia e nuovi inizi.",
      "Nel design è fondamentale come spazio vuoto: dà respiro ai contenuti e comunica ordine, semplicità ed eleganza.",
      "Il suo significato cambia con la cultura: in diversi paesi asiatici, come Cina, Giappone e India, il bianco è tradizionalmente il colore del lutto."
    ],
    fact: "Molti marchi di tecnologia usano grandi spazi bianchi nei negozi e nelle confezioni per comunicare semplicità e qualità.",
    quiz: [
      { q: "Cosa contiene la luce bianca?", a: ["A) Nessun colore", "B) Tutti i colori dello spettro visibile", "C) Solo il blu"], ok: 1 },
      { q: "A cosa serve il bianco nel design?", a: ["A) A dare respiro ai contenuti", "B) A nascondere il testo", "C) Ad aumentare il caos"], ok: 0 },
      { q: "In diversi paesi asiatici il bianco rappresenta tradizionalmente…", a: ["A) La festa", "B) La ricchezza", "C) Il lutto"], ok: 2 }
    ]
  },
  {
    id: "nero", title: "Il significato del nero", img: "lezione-nero.jpg",
    body: [
      "Il nero corrisponde all'assenza di luce. Viene associato a forza, eleganza e mistero, ma anche a serietà e, in molte culture occidentali, al lutto.",
      "Nella moda e nel lusso è il colore della raffinatezza: fa apparire gli oggetti più preziosi e senza tempo.",
      "Nel design dà contrasto e peso: il testo nero su fondo bianco ha il contrasto massimo possibile (21:1) ed è tra le combinazioni più leggibili."
    ],
    fact: "Nel 1926 la rivista Vogue presentò il “piccolo abito nero” di Coco Chanel come un capo adatto a tutte le donne: un colore legato al lutto diventò un simbolo di eleganza.",
    quiz: [
      { q: "Il nero è…", a: ["A) L'assenza di luce", "B) La somma di tutti i colori della luce", "C) Un colore caldo"], ok: 0 },
      { q: "In quale settore il nero viene associato alla raffinatezza?", a: ["A) Nei giochi per bambini", "B) Nella moda e nel lusso", "C) Nella segnaletica stradale"], ok: 1 },
      { q: "Quale di queste combinazioni è la più leggibile?", a: ["A) Giallo su bianco", "B) Blu su viola", "C) Testo nero su fondo bianco"], ok: 2 }
    ]
  },
  { id: "rgb", track: "digitale", title: "RGB: i colori della luce", grad: "linear-gradient(135deg,#ff2d2d,#2dff6a 50%,#2d6bff)",
    body: [
      "Gli schermi creano i colori con la luce: ogni pixel è formato da tre piccole luci, rossa (Red), verde (Green) e blu (Blue). Per questo il modello si chiama RGB.",
      "È un modello additivo: più luce aggiungi, più il colore si schiarisce. Rosso e verde danno il giallo, verde e blu il ciano, rosso e blu il magenta; tutte e tre al massimo danno il bianco.",
      "Ogni canale va da 0 a 255: rgb(255, 0, 0) è il rosso puro, rgb(0, 0, 0) il nero e rgb(255, 255, 255) il bianco. In tutto si ottengono più di 16 milioni di colori."
    ],
    fact: "Se guardi uno schermo con una lente d'ingrandimento vedi i piccoli punti rossi, verdi e blu che, da lontano, l'occhio fonde in un unico colore.",
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
      "Il modello HSL descrive i colori in un modo vicino a come li descriviamo a parole. La tinta (Hue) è la posizione sulla ruota cromatica, da 0° a 360°: il rosso è a 0°, il verde a 120°, il blu a 240°.",
      "La saturazione dice quanto il colore è intenso: al 100% è vivo, allo 0% diventa grigio. La luminosità va dal nero (0%) al bianco (100%), con il colore pieno al 50%.",
      "HSL è comodo per creare palette: tenendo ferma la tinta e cambiando saturazione e luminosità ottieni tante sfumature armoniche dello stesso colore."
    ],
    fact: "Le armonie si calcolano sulla tinta: il complementare è a 180°, una triade a 120°. Attenzione: sulla ruota digitale (RGB e HSL) il complementare del blu è il giallo, mentre sulla ruota tradizionale dei pittori (rosso, giallo, blu), usata nelle lezioni sulle combinazioni, è l'arancione.",
    quiz: [
      { q: "Cosa indica la tinta (Hue)?", a: ["A) La posizione del colore sulla ruota", "B) Quanto il colore è chiaro", "C) Quanto costa stamparlo"], ok: 0 },
      { q: "Un colore con saturazione 0% appare…", a: ["A) Più vivo", "B) Grigio", "C) Fluorescente"], ok: 1 },
      { q: "A quanti gradi di distanza si trova il complementare?", a: ["A) 90°", "B) 120°", "C) 180°"], ok: 2 }
    ] },
  { id: "cmyk", track: "digitale", title: "RGB e CMYK: schermo e stampa", grad: "linear-gradient(135deg,#00b7eb,#ff2fa0 50%,#ffe600)",
    body: [
      "Le stampanti non usano la luce ma gli inchiostri: ciano (Cyan), magenta, giallo (Yellow) e nero (Key). È il modello CMYK.",
      "È un modello sottrattivo: ogni inchiostro assorbe una parte della luce, quindi più inchiostro aggiungi, più il colore si scurisce. Il nero si aggiunge a parte perché mescolando ciano, magenta e giallo si ottiene un marrone scuro, non un nero pieno.",
      "Alcuni colori molto accesi dello schermo non si possono stampare: per questo un colore può apparire più spento su carta che sul monitor, e chi progetta per la stampa controlla i colori in CMYK già durante il lavoro."
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
      "Circa l'8% degli uomini e lo 0,5% delle donne di origine europea ha una forma di daltonismo: per questo non bisogna affidare un'informazione solo al colore, ma aggiungere anche testo, icone o forme."
    ],
    fact: "Anche CHROMA controlla il contrasto: quando scegli un tema, l'app corregge da sola i colori perché testi e pulsanti restino leggibili.",
    quiz: [
      { q: "Qual è il contrasto minimo AA per un testo normale?", a: ["A) 2:1", "B) 4,5:1", "C) 21:1"], ok: 1 },
      { q: "Quale combinazione ha il contrasto più alto?", a: ["A) Nero su bianco", "B) Giallo su bianco", "C) Grigio su grigio"], ok: 0 },
      { q: "Come aiuti chi è daltonico?", a: ["A) Usando solo rosso e verde", "B) Usando colori più chiari", "C) Affiancando al colore testo, icone o forme"], ok: 2 }
    ] }
];

const COMBOS = [
  { id: "Complementari", title: "Complementari", img: "complementari.png",
    intro: "I colori complementari sono posizionati uno di fronte all'altro nella ruota cromatica. Creano il contrasto di tinta più forte e attirano subito l'attenzione.",
    how: "La combinazione utilizza due colori opposti. Sulla ruota tradizionale dei pittori (rosso, giallo, blu) le coppie sono blu e arancione, rosso e verde, giallo e viola.",
    when: "Ideale per evidenziare elementi importanti, creare energia visiva e ottenere composizioni dinamiche. Esempi: Blu + Arancione, Rosso + Verde, Viola + Giallo.",
    extra: ["Questa combinazione è molto utilizzata nel cinema, nella pubblicità e nel design per evidenziare elementi importanti. Alcuni esempi famosi sono il blu con l'arancione oppure il rosso con il verde.",
            "I colori complementari possono essere usati per creare immagini energiche e dinamiche, ma devono essere bilanciati per evitare un effetto troppo aggressivo."],
    quiz: [
      { q: "Dove si trovano i colori complementari sulla ruota cromatica?", a: ["A) Uno accanto all'altro", "B) Uno di fronte all'altro", "C) A 90° uno dall'altro"], ok: 1 },
      { q: "Quale di queste è una coppia complementare?", a: ["A) Blu e Arancione", "B) Blu e Azzurro", "C) Rosso e Arancione"], ok: 0 },
      { q: "A cosa bisogna fare attenzione usando i complementari?", a: ["A) Sono troppo spenti", "B) Non si notano", "C) Vanno bilanciati per non risultare aggressivi"], ok: 2 } ] },
  { id: "Analoghi", title: "Analoghi", img: "analoghi.png",
    intro: "I colori analoghi sono colori vicini tra loro sulla ruota cromatica. Generano armonia e continuità visiva.",
    how: "Si scelgono generalmente tre colori adiacenti che condividono caratteristiche simili.",
    when: "Perfetta per creare ambienti rilassanti, design equilibrati e palette naturali. Esempi: Blu + Blu-verde + Verde, Rosso + Rosso-arancio + Arancione.",
    extra: ["Questa combinazione è molto utilizzata per paesaggi, interfacce rilassanti e composizioni che devono trasmettere equilibrio.",
            "Poiché il contrasto è limitato, i colori analoghi aiutano a creare una sensazione di continuità e fluidità visiva."],
    quiz: [
      { q: "Come sono disposti i colori analoghi?", a: ["A) Vicini tra loro sulla ruota", "B) Opposti tra loro", "C) Ai vertici di un quadrato"], ok: 0 },
      { q: "Quale palette è analoga?", a: ["A) Rosso + Verde", "B) Blu + Blu-verde + Verde", "C) Giallo + Viola"], ok: 1 },
      { q: "Che effetto producono di solito i colori analoghi?", a: ["A) Tensione e conflitto", "B) Massimo contrasto", "C) Armonia e continuità"], ok: 2 } ] },
  { id: "Triade", title: "Triade", img: "triade.png",
    intro: "La combinazione triadica utilizza tre colori equidistanti sulla ruota cromatica.",
    how: "I colori formano un triangolo equilatero e mantengono un buon equilibrio tra contrasto e armonia.",
    when: "Ottima per progetti creativi, illustrazioni e interfacce vivaci ma bilanciate. Esempi: Rosso + Giallo + Blu.",
    extra: ["Questo schema crea palette vivaci e bilanciate, mantenendo un buon equilibrio tra contrasto e armonia.",
            "Molti loghi e illustrazioni utilizzano combinazioni triadiche per ottenere design accattivanti senza risultare disordinati."],
    quiz: [
      { q: "Quanti colori usa una triade?", a: ["A) Due", "B) Tre", "C) Quattro"], ok: 1 },
      { q: "Che forma disegnano i colori di una triade sulla ruota?", a: ["A) Un triangolo", "B) Un quadrato", "C) Una linea"], ok: 0 },
      { q: "Quale di queste è una triade?", a: ["A) Blu + Blu-verde + Verde", "B) Rosso + Verde", "C) Rosso + Giallo + Blu"], ok: 2 } ] },
  { id: "Split complementari", title: "Split complementari", img: "split-complementari.png",
    intro: "Questa combinazione parte da un colore principale e utilizza i due colori adiacenti al suo complementare.",
    how: "Offre un contrasto elevato ma meno aggressivo rispetto ai complementari diretti.",
    when: "Ideale per chi desidera creare tensione visiva mantenendo una maggiore armonia. Esempi: Blu con Giallo-Arancio e Rosso-Arancio.",
    extra: ["Questo sistema mantiene un forte contrasto ma risulta più equilibrato rispetto ai complementari diretti.",
            "È molto apprezzato nel design perché offre varietà cromatica senza creare tensioni visive eccessive."],
    quiz: [
      { q: "Da cosa parte uno schema split complementare?", a: ["A) Da un colore e dai due vicini al suo complementare", "B) Da quattro colori equidistanti", "C) Da tre colori adiacenti"], ok: 0 },
      { q: "Rispetto ai complementari diretti, il contrasto è…", a: ["A) Nullo", "B) Meno aggressivo", "C) Più aggressivo"], ok: 1 },
      { q: "Quale esempio è split complementare?", a: ["A) Rosso + Verde", "B) Blu + Azzurro", "C) Blu con Giallo-Arancio e Rosso-Arancio"], ok: 2 } ] },
  { id: "Rettangolo", title: "Rettangolo", img: "rettangolo.png",
    intro: "La combinazione rettangolare utilizza quattro colori organizzati in due coppie complementari.",
    how: "I colori formano un rettangolo sulla ruota cromatica, offrendo una palette ricca e versatile.",
    when: "Perfetta per progetti complessi che richiedono varietà cromatica mantenendo equilibrio. Esempi: Blu, Verde, Arancione e Rosso.",
    extra: ["Questo schema offre molta varietà cromatica e permette di creare composizioni ricche e dinamiche.",
            "Per ottenere un buon risultato è consigliabile scegliere un colore dominante e usare gli altri come supporto."],
    quiz: [
      { q: "Come sono organizzati i quattro colori del rettangolo?", a: ["A) In due coppie complementari", "B) Tutti adiacenti", "C) In un triangolo"], ok: 0 },
      { q: "Qual è un buon consiglio per usare questo schema?", a: ["A) Usare tutti i colori in parti uguali", "B) Scegliere un colore dominante", "C) Evitare i colori caldi"], ok: 1 },
      { q: "Per quali progetti è adatto il rettangolo?", a: ["A) Solo per il bianco e nero", "B) Per palette monocromatiche", "C) Per progetti complessi con molta varietà"], ok: 2 } ] },
  { id: "Quadrato", title: "Quadrato", img: "quadrato.png",
    intro: "La combinazione quadrata utilizza quattro colori equidistanti tra loro sulla ruota cromatica.",
    how: "I colori formano un quadrato e distribuiscono uniformemente il contrasto.",
    when: "Ideale per creare design energici, moderni e molto colorati. Esempio sulla ruota tradizionale: Giallo, Rosso-arancio, Viola e Blu-verde.",
    extra: ["Produce palette molto vivaci e dinamiche grazie alla distribuzione uniforme dei colori.",
            "È uno schema ideale per progetti creativi, illustrazioni e design che vogliono trasmettere energia e movimento."],
    quiz: [
      { q: "Come sono disposti i colori del quadrato?", a: ["A) Equidistanti tra loro", "B) Tutti vicini", "C) Solo due opposti"], ok: 0 },
      { q: "Quanti colori usa lo schema quadrato?", a: ["A) Tre", "B) Quattro", "C) Sei"], ok: 1 },
      { q: "Che tipo di design produce?", a: ["A) Spento e neutro", "B) Monocromatico", "C) Energico e molto colorato"], ok: 2 } ] }
];

const QUIZ_COLOR = {
  rosso: "rosso", arancione: "arancione", giallo: "giallo", verde: "verde", blu: "blu", viola: "viola", bianco: "bianco", nero: "nero",
  rgb: "neon", hex: "fucsia", hsl: "oltremare", cmyk: "ghiaccio", contrasto: "pesca",
  "Complementari": "turchese", "Analoghi": "lime", "Triade": "magenta",
  "Split complementari": "corallo", "Rettangolo": "oliva", "Quadrato": "petrolio"
};

const COLORS = [
  { id: "perla", n: "Grigio perla", h: "#aab0b8" },
  { id: "ardesia", n: "Grigio ardesia", h: "#4f5763" },
  { id: "rosso", n: "Rosso", h: "#e3242b", hint: "Quiz sul rosso" },
  { id: "arancione", n: "Arancione", h: "#ff7a00", hint: "Quiz sull'arancione" },
  { id: "giallo", n: "Giallo", h: "#ffd000", hint: "Quiz sul giallo" },
  { id: "verde", n: "Verde", h: "#2fa84f", hint: "Quiz sul verde" },
  { id: "blu", n: "Blu", h: "#1f5fe0", hint: "Quiz sul blu" },
  { id: "viola", n: "Viola", h: "#8a2be2", hint: "Quiz sul viola" },
  { id: "bianco", n: "Bianco", h: "#f6f4ee", hint: "Quiz sul bianco" },
  { id: "nero", n: "Nero", h: "#18181d", hint: "Quiz sul nero" },
  { id: "turchese", n: "Turchese", h: "#12c4c0", hint: "Quiz Complementari" },
  { id: "lime", n: "Lime", h: "#a6d62b", hint: "Quiz Analoghi" },
  { id: "magenta", n: "Magenta", h: "#d6208f", hint: "Quiz Triade" },
  { id: "corallo", n: "Corallo", h: "#ff8a7a", hint: "Quiz Split compl." },
  { id: "oliva", n: "Oliva", h: "#76782a", hint: "Quiz Rettangolo" },
  { id: "petrolio", n: "Petrolio", h: "#15707a", hint: "Quiz Quadrato" },
  { id: "carminio", n: "Carminio", h: "#8e1630" },
  { id: "rosa", n: "Rosa", h: "#f5a9c6" },
  { id: "terracotta", n: "Terracotta", h: "#b0623a" },
  { id: "oro", n: "Oro", h: "#b8900f" },
  { id: "bosco", n: "Verde bosco", h: "#1d5530" },
  { id: "salvia", n: "Salvia", h: "#9ab596" },
  { id: "menta", n: "Menta", h: "#a6f0d2" },
  { id: "azzurro", n: "Azzurro", h: "#62b8f2" },
  { id: "notte", n: "Blu notte", h: "#172a5a" },
  { id: "lavanda", n: "Lavanda", h: "#b8a4ec" },
  { id: "prugna", n: "Prugna", h: "#6a2a5b" },
  { id: "marrone", n: "Marrone", h: "#5c3a22" },
  { id: "neon", n: "Verde neon", h: "#06f87f", hint: "Quiz RGB" },
  { id: "fucsia", n: "Fucsia", h: "#fa42fa", hint: "Quiz HEX" },
  { id: "oltremare", n: "Oltremare", h: "#2604ae", hint: "Quiz HSL" },
  { id: "ghiaccio", n: "Ghiaccio", h: "#b4eefd", hint: "Quiz CMYK" },
  { id: "pesca", n: "Pesca", h: "#efbf8f", hint: "Quiz Contrasto" },
  { id: "crema", n: "Crema", h: "#fdfdb4" },
  { id: "lampone", n: "Lampone", h: "#e65572" }
];

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

const FAM_EMO = {
  "Rossi": ["passione", "energia", "urgenza"], "Arancioni e terre": ["entusiasmo", "calore", "creatività"],
  "Gialli": ["ottimismo", "luce", "curiosità"], "Verdi-gialli": ["freschezza", "vitalità", "crescita"],
  "Verdi": ["natura", "equilibrio", "calma"], "Ciano": ["freschezza", "chiarezza", "tecnologia"],
  "Blu": ["fiducia", "calma", "stabilità"], "Viola": ["creatività", "mistero", "lusso"],
  "Rosa e magenta": ["gioia", "romanticismo", "originalità"], "Neutri": ["eleganza", "semplicità", "equilibrio"]
};

const LEVEL_TITLES = ["Apprendista", "Curioso del colore", "Esploratore del colore", "Osservatore di sfumature",
  "Pittore alle prime armi", "Mescolatore di tinte", "Cacciatore di contrasti", "Pittore sfumato", "Alchimista dei pigmenti",
  "Maestro del colore", "Custode della ruota cromatica", "Architetto delle armonie", "Poeta della luce", "Virtuoso della palette",
  "Visionario cromatico", "Signore delle tonalità", "Guru del colore", "Mago dello spettro", "Oracolo dei colori", "Leggenda cromatica"];

const MISSIONS = [
  { id: "p1", type: "percorso", title: "Primi passi", desc: "Completa la tua prima lezione.", target: 1, v: () => S.done.length, xp: 50, color: "rosa", go: "lezioni", cta: "Vai alle lezioni" },
  { id: "p2", type: "percorso", title: "A metà strada", desc: "Completa 4 lezioni.", target: 4, v: () => S.done.length, xp: 150, color: "terracotta", go: "lezioni", cta: "Vai alle lezioni" },
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
  { id: "s1", type: "serie", title: "2 giorni di fila", desc: "Apri CHROMA per 2 giorni consecutivi. Colore speciale!", target: 2, v: () => S.bestStreak, xp: 100, color: "oro", go: "home", cta: "Torna domani" },
  { id: "s2", type: "serie", title: "3 giorni di fila", desc: "Apri CHROMA per 3 giorni consecutivi. Colore speciale!", target: 3, v: () => S.bestStreak, xp: 200, color: "lavanda", badge: "Badge sociale", go: "home", cta: "Torna domani" },
  { id: "s3", type: "serie", title: "4 giorni di fila", desc: "Apri CHROMA per 4 giorni consecutivi. Colore speciale!", target: 4, v: () => S.bestStreak, xp: 400, color: "notte", go: "home", cta: "Torna domani" },
  { id: "d1", type: "giornaliera", title: "Completa o ripassa 1 lezione", desc: "Oggi completa una lezione nuova o ripassane una già fatta.", target: 1, v: () => day().lessons, xp: 40, go: "lezioni", cta: "Vai alle lezioni" },
  { id: "d2", type: "giornaliera", title: "Rispondi a 2 quiz", desc: "Oggi completa due quiz qualsiasi, anche già fatti.", target: 2, v: () => day().quiz, xp: 60, go: "quizhub", cta: "Vai ai quiz" },
  { id: "d3", type: "giornaliera", title: "Fai un quiz perfetto", desc: "Oggi rispondi correttamente a tutte le domande di un quiz.", target: 1, v: () => day().perfect, xp: 80, go: "quizhub", cta: "Vai ai quiz" },
  { id: "d4", type: "giornaliera", title: "Studia 5 minuti", desc: "Resta nell'app a studiare almeno 5 minuti oggi.", target: 5, v: () => Math.floor(day().time / 60), xp: 50, go: "lezioni", cta: "Studia ora" }
];

const BADGES = [
  { n: "Color Explorer", d: "Raccogli 10 colori", img: "badge-color-explorer.png", to: "colori", got: () => S.owned.length >= 10 },
  { n: "Badge dello studente", d: "Completa le 8 lezioni di psicologia del colore", img: "badge-studente.png", got: () => S.badges.includes("Badge dello studente") },
  { n: "Badge dello studioso", d: "3/3 in tutti gli 8 quiz di psicologia del colore", img: "badge-studioso.png", got: () => S.badges.includes("Badge dello studioso") },
  { n: "Badge sociale", d: "3 giorni di fila", img: "badge-sociale.png", got: () => S.badges.includes("Badge sociale") },
  { n: "Maestro del colore", d: "Raggiungi il livello 10", img: "badge-maestro.png", to: "titoli", got: () => S.level >= 10 },
  { n: "Badge digitale", d: "Completa le lezioni sul digitale", img: "badge-digitale.png", got: () => S.badges.includes("Badge digitale") },
  { n: "Occhio allenato", d: "4/5 in tutti i giochi", img: "badge-occhio.png", got: () => S.badges.includes("Occhio allenato") },
  { n: "Collezionista", d: "Sblocca tutti i colori", img: "badge-collezionista.png", to: "colori", got: () => S.owned.length >= COLORS.length }
];

const AVATARS = [
  { id: "default", lv: 1, n: "Classico" },
  { id: "chroma", lv: 1, n: "Chroma", img: "avatar-chroma.png", full: true, bg: "#111" },
  { id: "palette", lv: 1, n: "Tavolozza", img: "avatar-tavolozza.png", bg: "#7b2482" },
  { id: "brush", lv: 1, n: "Pennello", img: "avatar-pennello.png", bg: "#1f4fb8" },
  { id: "drop", lv: 2, n: "Goccia", bg: "#22919e", svg: '<path d="M50 18c12 18 22 28 22 42a22 22 0 0 1-44 0c0-14 10-24 22-42z" fill="#fff"/><circle cx="42" cy="56" r="3.5" fill="#222"/><circle cx="58" cy="56" r="3.5" fill="#222"/><path d="M43 66q7 6 14 0" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/>' },
  { id: "prism", lv: 3, n: "Prisma", img: "avatar-prisma.png", full: true, bg: "#2b2b33" },
  { id: "sun", lv: 5, n: "Sole", bg: "#f2a900", svg: '<circle cx="50" cy="50" r="15" fill="#fff"/>' + Array.from({ length: 8 }, (_, i) => `<rect x="47" y="16" width="6" height="12" rx="3" fill="#fff" transform="rotate(${i * 45} 50 50)"/>`).join("") },
  { id: "moon", lv: 5, n: "Luna", img: "avatar-luna.png", bg: "#4b3fcf" },
  { id: "leaf", lv: 8, n: "Foglia", img: "avatar-foglia.png", bg: "#1f9d55" },
  { id: "eye", lv: 10, n: "Occhio", img: "avatar-occhio.png", bg: "#d0112b" },
  { id: "crown", lv: 15, n: "Corona", img: "avatar-corona.png", bg: "#c9960f" },
  { id: "rainbow", lv: 20, n: "Arcobaleno", img: "avatar-arcobaleno.png", bg: "#101018" }
];

const PALETTES = [
  { n: "Colori caldi", c: ["#d62828", "#ef4a23", "#f77f00", "#fcbf49", "#ffd23f", "#e85d75"],
    t: "I colori caldi comprendono principalmente le tonalità di rosso, arancione e giallo. Richiamano il sole e il fuoco e vengono associati a vitalità, entusiasmo e dinamismo.",
    e: ["Passione", "Energia", "Calore", "Entusiasmo", "Urgenza"] },
  { n: "Colori freddi", c: ["#1d3557", "#2a6fdb", "#48cae4", "#2a9d8f", "#52b788", "#7b2cbf"],
    t: "I colori freddi comprendono principalmente le tonalità di blu, verde e viola. Richiamano l'acqua, il cielo e la vegetazione e vengono associati a calma, equilibrio e serenità.",
    e: ["Calma", "Stabilità", "Fiducia", "Serenità", "Relax"] },
  { n: "Mezzitoni", c: ["#a3968b", "#8d9f87", "#9b8aa6", "#b5a48a", "#7f9aa8", "#c09a92"],
    t: "Qui con “mezzitoni” intendiamo colori smorzati: tinte a cui è stato aggiunto del grigio, meno sature e più morbide dei colori puri. Accostati tra loro creano un effetto armonioso ed equilibrato.",
    e: ["Equilibrio", "Stabilità", "Armonia", "Relax"] }
];
const PAL_FACT = "Nel film “Grand Budapest Hotel” (2014) di Wes Anderson ogni epoca ha la sua palette: rosa e pastelli per gli anni Trenta, toni più spenti e freddi per gli anni Sessanta.";

const SECRETS = [
  { id: "arcobaleno", n: "Arcobaleno", d: "Tutto lo spettro in movimento", base: "#7b2cbf", on: "#fff", g: "linear-gradient(90deg,#c81d25,#d9480f,#a07800,#2b8a3e,#0b7285,#1c4fd8,#7b2cbf,#c81d25)" },
  { id: "aurora", n: "Aurora boreale", d: "Verdi e viola che danzano", base: "#0e7c70", on: "#fff", g: "linear-gradient(120deg,#0b5d57,#0e8f7e,#4b3fc4,#7a2bb8,#0e8f7e,#0b5d57)" },
  { id: "tramonto", n: "Tramonto", d: "Dall'arancio al magenta", base: "#c2255c", on: "#fff", g: "linear-gradient(120deg,#d9480f,#d6336c,#862e9c,#d6336c,#d9480f)" },
  { id: "olografico", n: "Olografico", d: "Riflessi iridescenti", base: "#7a8cff", on: "#1a1a2e", g: "linear-gradient(120deg,#ffc6ec,#bfe9ff,#c9ffd0,#fff1a8,#e3c8ff,#ffc6ec)" }
];

const CVD = {
  protan: [[.567, .433, 0], [.558, .442, 0], [0, .242, .758]],
  deutan: [[.625, .375, 0], [.7, .3, 0], [0, .3, .7]],
  tritan: [[.95, .05, 0], [0, .433, .567], [0, .475, .525]]
};

const CVD_NOTE = {
  none: "",
  protan: "Protanopia: i rossi appaiono più scuri e si confondono con i verdi. Riguarda circa 1 uomo su 100. La simulazione è un'approssimazione.",
  deutan: "Deuteranopia: verdi e rossi si confondono. Le difficoltà rosso-verde sono la forma più comune: contando le forme lievi riguardano circa 6 uomini su 100. La simulazione è un'approssimazione.",
  tritan: "Tritanopia: blu e gialli si confondono. È molto rara e riguarda allo stesso modo uomini e donne. La simulazione è un'approssimazione."
};

const HARM = {
  none: [], comp: [180], anal: [-30, 30], triad: [120, 240], split: [150, 210], rect: [60, 180, 240], square: [90, 180, 270]
};
const HARM_N = { none: "Colore", comp: "Complementari", anal: "Analoghi", triad: "Triade", split: "Split complementari", rect: "Rettangolo", square: "Quadrato" };
