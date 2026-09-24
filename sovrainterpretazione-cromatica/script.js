// ================================================================
// CHROMA
// webcam → colore → dati → interpretazione → interazione
// ================================================================


// ================================================================
// 1. ELEMENTI HTML
// ================================================================

const $ = id =>
  document.getElementById(id);


const video =
  $('video');

const ambientCanvas =
  $('ambientCanvas');

const ambientCtx =
  ambientCanvas.getContext('2d');

const preview =
  $('preview');

const previewCtx =
  preview.getContext('2d');

const colorOverlay =
  $('colorOverlay');

const paletteBox =
  $('paletteSwatches');

const swatches =
  [...paletteBox.querySelectorAll('.swatch')];

const pulseCore =
  $('pulseCore');

const resolutionSlider =
  $('resolutionSlider');

const camBtn =
  $('camBtn');

const switchCamBtn =
  $('switchCamBtn');

const judgeBtn =
  $('judgeBtn');

const aiJudgment =
  $('aiJudgment');

const aiTrace =
  $('aiTrace');

const memoryStrip =
  $('memoryStrip');

const hudObs =
  $('hudObs');

const hudJudge =
  $('hudJudge');

const hudState =
  $('hudState');

const debugMsg =
  $('debugMsg');

const dataPanel =
  $('dataPanel');

const humanQuestion =
  $('humanQuestion');

const moodChips =
  $('moodChips');

const moodSkip =
  $('moodSkip');

const recognizeQuestion =
  $('recognizeQuestion');

const portraitPanel =
  $('portraitPanel');

const portraitCanvas =
  $('portraitCanvas');

const portraitCtx =
  portraitCanvas.getContext('2d');

const portraitDownload =
  $('portraitDownload');


// ================================================================
// 2. PRESTAZIONI
// ================================================================

const MOBILE =
  matchMedia('(pointer: coarse)').matches ||
  innerWidth <= 1100;


const PERF = MOBILE
  ? {
      sampleStep: 16,
      kmeansIterations: 7,
      paletteFrames: 10,
      ambientFrames: 2,
      portraitSize: 600,
      autoJudge: false
    }
  : {
      sampleStep: 8,
      kmeansIterations: 12,
      paletteFrames: 6,
      ambientFrames: 1,
      portraitSize: 900,
      autoJudge: true
    };


// ================================================================
// 3. STATO
// ================================================================

let camActive = false;

let facingMode =
  'environment';

let stream = null;

let frame = 0;

let obsCount = 0;

let judgeCount = 0;

let analyzing = false;

let currentPalette = [];

let paletteWeights = [];

let selectedColor = null;

let manualSelection = null;

let currentRGB =
  [100,100,100];

let previousRGB = null;

let systemState =
  'neutrale';

let heartbeat = 0;

let autoTimer = 0;

const AUTO_INTERVAL = 1800;

const colorHistory = [];

const responseLog = [];


// ================================================================
// 4. SERVICE WORKER
// ================================================================

if ('serviceWorker' in navigator) {

  addEventListener(
    'load',
    () => {

      navigator.serviceWorker
        .register('./sw.js')
        .catch(console.warn);

    }
  );

}


// ================================================================
// 5. QR
// ================================================================

const qrBox =
  $('qrBox');

const qrModal =
  $('qrModal');

const qrBackdrop =
  $('qrModalBackdrop');

const qrClose =
  $('qrModalClose');


function openQR() {

  if (!qrModal) return;

  qrModal.classList.add('visible');

  qrBackdrop.classList.add('visible');

  qrModal.setAttribute(
    'aria-hidden',
    'false'
  );

}


function closeQR() {

  if (!qrModal) return;

  qrModal.classList.remove('visible');

  qrBackdrop.classList.remove('visible');

  qrModal.setAttribute(
    'aria-hidden',
    'true'
  );

}


qrBox?.addEventListener(
  'click',
  e => {

    e.preventDefault();

    openQR();

  }
);


qrClose?.addEventListener(
  'click',
  closeQR
);


qrBackdrop?.addEventListener(
  'click',
  closeQR
);


addEventListener(
  'keydown',
  e => {

    if (e.key === 'Escape')
      closeQR();

  }
);


// ================================================================
// 6. ERRORI
// ================================================================

function debug(
  message,
  time = 6000
) {

  debugMsg.textContent =
    message;

  debugMsg.style.opacity =
    '1';

  setTimeout(
    () => {

      debugMsg.style.opacity =
        '0';

    },
    time
  );

}


// ================================================================
// 7. COLORI
// ================================================================

function toHex(
  [r,g,b]
) {

  return '#' +
    [r,g,b]
      .map(
        n =>
          Math.round(n)
            .toString(16)
            .padStart(2,'0')
      )
      .join('');

}


function toHsl(
  [r,g,b]
) {

  r /= 255;
  g /= 255;
  b /= 255;

  const max =
    Math.max(r,g,b);

  const min =
    Math.min(r,g,b);

  let h = 0;

  let s = 0;

  const l =
    (max + min) / 2;


  if (max !== min) {

    const d =
      max - min;

    s =
      l > .5
        ? d / (2-max-min)
        : d / (max+min);


    if (max === r)
      h =
        (g-b)/d +
        (g < b ? 6 : 0);

    if (max === g)
      h =
        (b-r)/d + 2;

    if (max === b)
      h =
        (r-g)/d + 4;


    h /= 6;

  }


  return [
    Math.round(h*360),
    Math.round(s*100),
    Math.round(l*100)
  ];

}


function colorName(
  rgb
) {

  const [h,s,l] =
    toHsl(rgb);


  if (s < 12) {

    if (l < 25)
      return 'nero';

    if (l < 60)
      return 'grigio';

    return 'bianco';

  }


  if (
    h < 45 &&
    l < 32
  ) {
    return 'marrone';
  }


  if (
    h < 15 ||
    h >= 345
  ) {
    return s > 55
      ? 'rosso'
      : 'rosso spento';
  }


  if (h < 45)
    return s > 55
      ? 'arancio'
      : 'terra';


  if (h < 70)
    return s > 45
      ? 'giallo'
      : 'ocra';


  if (h < 150)
    return s > 45
      ? 'verde'
      : 'verde scuro';


  if (h < 195)
    return s > 45
      ? 'ciano'
      : 'turchese';


  if (h < 250)
    return s > 45
      ? 'blu'
      : 'blu grigio';


  if (h < 290)
    return s > 45
      ? 'viola'
      : 'lavanda';


  return s > 45
    ? 'magenta'
    : 'rosa';

}


function colorDistance(
  a,
  b
) {

  const rMean =
    (a[0] + b[0]) / 2;

  const dr =
    a[0] - b[0];

  const dg =
    a[1] - b[1];

  const db =
    a[2] - b[2];


  return (
    (2 + rMean/256) *
      dr*dr +

    4 *
      dg*dg +

    (2 + (255-rMean)/256) *
      db*db
  );

}


function saturation(
  [r,g,b]
) {

  const max =
    Math.max(r,g,b);

  const min =
    Math.min(r,g,b);


  return max === 0
    ? 0
    : (max-min)/max;

}


// ================================================================
// 8. CANVAS WEBCAM
// ================================================================

const lowCanvas =
  document.createElement('canvas');

const lowCtx =
  lowCanvas.getContext('2d');


let lowWidth =
  Number(resolutionSlider.value);

let lowHeight =
  1;


function resizeCameraCanvas() {

  const ratio =
    video.videoWidth &&
    video.videoHeight

      ? video.videoHeight /
        video.videoWidth

      : .75;


  lowHeight =
    Math.max(
      1,
      Math.round(
        lowWidth * ratio
      )
    );


  lowCanvas.width =
    lowWidth;

  lowCanvas.height =
    lowHeight;


  /*
    Il canvas preview usa pochi pixel:
    più leggero, ma mantiene il
    rapporto reale della webcam.
  */

  const previewWidth =
    64;

  preview.width =
    previewWidth;

  preview.height =
    Math.max(
      1,
      Math.round(
        previewWidth *
        ratio
      )
    );

}


resizeCameraCanvas();


resolutionSlider.addEventListener(
  'input',
  () => {

    lowWidth =
      Math.max(
        1,
        Number(
          resolutionSlider.value
        )
      );

    resizeCameraCanvas();

  }
);


// ================================================================
// 9. K-MEANS
// ================================================================

function extractPalette(
  imageData,
  k = 5
) {

  const pixels = [];

  const data =
    imageData.data;


  for (
    let i = 0;
    i < data.length;
    i += PERF.sampleStep
  ) {

    const pixel = [
      data[i],
      data[i+1],
      data[i+2]
    ];


    const sum =
      pixel[0] +
      pixel[1] +
      pixel[2];


    if (
      sum > 30 &&
      sum < 740
    ) {
      pixels.push(pixel);
    }

  }


  if (pixels.length < k)
    return;


  let centers = [];


  /*
    primo centro:
    pixel più saturo
  */

  centers.push(

    [...pixels].sort(
      (a,b) =>
        saturation(b) -
        saturation(a)
    )[0]

  );


  /*
    altri centroidi:
    colori più lontani
    da quelli già scelti
  */

  while (
    centers.length < k
  ) {

    let best =
      pixels[0];

    let bestDistance =
      -1;


    for (
      const pixel
      of pixels
    ) {

      const nearest =
        Math.min(
          ...centers.map(
            center =>
              colorDistance(
                pixel,
                center
              )
          )
        );


      if (
        nearest >
        bestDistance
      ) {

        bestDistance =
          nearest;

        best =
          pixel;

      }

    }


    centers.push(
      [...best]
    );

  }


  /*
    iterazioni k-means
  */

  for (
    let iteration = 0;
    iteration <
      PERF.kmeansIterations;
    iteration++
  ) {

    const groups =
      Array.from(
        {length:k},
        () => []
      );


    for (
      const pixel
      of pixels
    ) {

      let bestIndex = 0;

      let bestDistance =
        Infinity;


      centers.forEach(
        (center,index) => {

          const distance =
            colorDistance(
              pixel,
              center
            );


          if (
            distance <
            bestDistance
          ) {

            bestDistance =
              distance;

            bestIndex =
              index;

          }

        }
      );


      groups[
        bestIndex
      ].push(pixel);

    }


    centers =
      groups.map(
        (group,index) => {

          if (!group.length)
            return centers[index];


          const total =
            group.reduce(
              (sum,pixel) => [

                sum[0]+pixel[0],
                sum[1]+pixel[1],
                sum[2]+pixel[2]

              ],
              [0,0,0]
            );


          return total.map(
            value =>
              Math.round(
                value /
                group.length
              )
          );

        }
      );

  }


  /*
    percentuale
    di ogni cluster
  */

  const counts =
    Array(k).fill(0);


  for (
    const pixel
    of pixels
  ) {

    let index = 0;

    let distance =
      Infinity;


    centers.forEach(
      (center,i) => {

        const d =
          colorDistance(
            pixel,
            center
          );


        if (d < distance) {

          distance = d;

          index = i;

        }

      }
    );


    counts[index]++;

  }


  const result =
    centers
      .map(
        (rgb,index) => ({

          rgb,

          saturation:
            saturation(rgb),

          weight:
            counts[index] /
            pixels.length

        })
      )

      .sort(
        (a,b) =>
          b.saturation -
          a.saturation
      );


  currentPalette =
    result.map(
      item => item.rgb
    );


  paletteWeights =
    result.map(
      item => item.weight
    );

}


// ================================================================
// 10. PALETTE UI
// ================================================================

function updateSwatches() {

  swatches.forEach(
    (element,index) => {

      if (index < 5) {

        const rgb =
          currentPalette[index];


        element.style.background =
          rgb
            ? `rgb(${rgb.join(',')})`
            : '#111';

      }


      const active =
        index < 5

          ? (
            manualSelection?.type ===
            'palette' &&

            manualSelection.index ===
            index
          )

          : !manualSelection;


      element.classList.toggle(
        'selected',
        active
      );

    }
  );

}


swatches.forEach(
  (element,index) => {

    element.addEventListener(
      'click',
      () => {

        if (index >= 5) {

          manualSelection =
            null;

        }

        else {

          manualSelection = {

            type:
              'palette',

            index

          };

        }


        updateSwatches();

      }
    );

  }
);


// click direttamente sulla preview

preview.addEventListener(
  'click',
  event => {

    const rect =
      preview.getBoundingClientRect();


    manualSelection = {

      type:
        'point',

      x:
        (
          event.clientX -
          rect.left
        ) /
        rect.width,

      y:
        (
          event.clientY -
          rect.top
        ) /
        rect.height

    };


    updateSwatches();

  }
);


// ================================================================
// 11. DATI
// ================================================================

function updateDataPanel(
  dominant
) {

  if (
    !currentPalette.length
  ) return;


  let displayDominant =
    dominant;


  /*
    se non c'è una scelta manuale
    usa il colore con più area
  */

  if (
    !selectedColor &&
    paletteWeights.length
  ) {

    let highest =
      -1;


    currentPalette.forEach(
      (rgb,index) => {

        if (
          paletteWeights[index] >
          highest
        ) {

          highest =
            paletteWeights[index];

          displayDominant =
            rgb;

        }

      }
    );

  }


  const [h,s,l] =
    toHsl(
      displayDominant
    );


  const rows =
    currentPalette.map(
      (rgb,index) => {

        const percent =
          Math.round(
            (
              paletteWeights[index] ||
              0
            ) *
            100
          );


        return `

          <div class="data-row">

            <span
              class="data-swatch"
              style="
                background:
                ${toHex(rgb)}
              ">
            </span>

            <span
              class="data-pct">
              ${percent}%
            </span>

            <span
              class="data-name">
              ${colorName(rgb)}
            </span>

            <span
              class="data-hex">
              ${toHex(rgb)}
            </span>

          </div>

        `;

      }
    ).join('');


  dataPanel.innerHTML = `

    <div class="data-title">
      DATI RILEVATI
    </div>

    <div class="data-dominant">

      <span
        class="
          data-swatch
          big
        "
        style="
          background:
          ${toHex(displayDominant)}
        ">
      </span>

      <div>

        <div
          class="data-dominant-name">

          ${colorName(displayDominant)}

        </div>

        <div
          class="data-dominant-sub">

          ${toHex(displayDominant)}
          ·
          RGB
          ${displayDominant.join(',')}
          ·
          S ${s}%
          ·
          L ${l}%

        </div>

      </div>

    </div>

    ${rows}

  `;


  dataPanel.style.opacity =
    '1';

}


// ================================================================
// 12. SFONDO
// ================================================================

const idleColors = [

  [40,40,75],

  [70,30,60],

  [20,55,70],

  [55,50,25],

  [30,60,50]

];


const blobs =
  idleColors.map(
    (color,index) => ({

      color:
        [...color],

      x:
        .2 +
        index*.15,

      y:
        .3 +
        (index%2)*.3,

      phase:
        Math.random()*10

    })
  );


function resizeBackground() {

  ambientCanvas.width =
    innerWidth;

  ambientCanvas.height =
    innerHeight;

}


resizeBackground();


addEventListener(
  'resize',
  resizeBackground
);


function drawAmbient() {

  const width =
    ambientCanvas.width;

  const height =
    ambientCanvas.height;


  ambientCtx.clearRect(
    0,
    0,
    width,
    height
  );


  blobs.forEach(
    (blob,index) => {

      const target =
        currentPalette[index] ||
        idleColors[index];


      blob.color =
        blob.color.map(
          (value,i) =>
            value +
            (
              target[i] -
              value
            ) *
            .025
        );


      const time =
        frame*.003 +
        blob.phase;


      const x =
        width *
        (
          blob.x +
          Math.sin(time) *
          .1
        );


      const y =
        height *
        (
          blob.y +
          Math.cos(time*.8) *
          .1
        );


      const radius =
        Math.min(
          width,
          height
        ) *
        .28;


      ambientCtx.fillStyle =
        `rgb(
          ${blob.color[0]|0},
          ${blob.color[1]|0},
          ${blob.color[2]|0}
        )`;


      ambientCtx.beginPath();

      ambientCtx.arc(
        x,
        y,
        radius,
        0,
        Math.PI*2
      );

      ambientCtx.fill();

    }
  );

}


// ================================================================
// 13. MEMORIA
// ================================================================

function addMemory(
  rgb
) {

  colorHistory.push(
    [...rgb]
  );


  if (
    colorHistory.length >
    30
  ) {

    colorHistory.shift();

  }


  memoryStrip.innerHTML =
    '';


  colorHistory.forEach(
    color => {

      const element =
        document.createElement(
          'div'
        );


      element.className =
        'mem-seg';


      element.style.background =
        toHex(color);


      memoryStrip.appendChild(
        element
      );

    }
  );

}


// ================================================================
// 14. LOOP
// ================================================================

function loop() {

  frame++;


  /*
    sfondo:
    su mobile ogni due frame
  */

  if (
    frame %
    PERF.ambientFrames ===
    0
  ) {

    drawAmbient();

  }


  if (
    !camActive ||
    !video.videoWidth
  ) {

    requestAnimationFrame(
      loop
    );

    return;

  }


  /*
    canvas segue automaticamente
    orientamento e fotocamera
  */

  if (
    lowCanvas._videoWidth !==
      video.videoWidth ||

    lowCanvas._videoHeight !==
      video.videoHeight
  ) {

    lowCanvas._videoWidth =
      video.videoWidth;

    lowCanvas._videoHeight =
      video.videoHeight;

    resizeCameraCanvas();

  }


  lowCtx.drawImage(
    video,
    0,
    0,
    lowCanvas.width,
    lowCanvas.height
  );


  const image =
    lowCtx.getImageData(
      0,
      0,
      lowCanvas.width,
      lowCanvas.height
    );


  /*
    colore medio
  */

  let r = 0;

  let g = 0;

  let b = 0;


  const pixels =
    image.data.length /
    4;


  for (
    let i = 0;
    i < image.data.length;
    i += 4
  ) {

    r +=
      image.data[i];

    g +=
      image.data[i+1];

    b +=
      image.data[i+2];

  }


  r =
    Math.round(r/pixels);

  g =
    Math.round(g/pixels);

  b =
    Math.round(b/pixels);


  currentRGB =
    [r,g,b];


  /*
    palette k-means
  */

  if (
    frame %
    PERF.paletteFrames ===
    0
  ) {

    extractPalette(
      image,
      5
    );


    updateSwatches();

  }


  /*
    selezione manuale
  */

  selectedColor =
    null;


  if (
    manualSelection?.type ===
    'palette'
  ) {

    selectedColor =
      currentPalette[
        manualSelection.index
      ] ||
      null;

  }


  if (
    manualSelection?.type ===
    'point'
  ) {

    const x =
      Math.min(
        lowCanvas.width-1,
        Math.max(
          0,
          Math.floor(
            manualSelection.x *
            lowCanvas.width
          )
        )
      );


    const y =
      Math.min(
        lowCanvas.height-1,
        Math.max(
          0,
          Math.floor(
            manualSelection.y *
            lowCanvas.height
          )
        )
      );


    const index =
      (
        y *
        lowCanvas.width +
        x
      ) *
      4;


    selectedColor = [

      image.data[index],

      image.data[index+1],

      image.data[index+2]

    ];

  }


  const dominant =
    selectedColor ||
    currentPalette[0] ||
    currentRGB;


  colorOverlay.style.background =
    `rgb(
      ${dominant.join(',')}
    )`;


  colorOverlay.classList.toggle(
    'manual',
    Boolean(
      selectedColor
    )
  );


  preview.classList.toggle(
    'manual',
    Boolean(
      selectedColor
    )
  );


  /*
    aggiorna i dati
  */

  if (
    frame %
    PERF.paletteFrames ===
    0
  ) {

    updateDataPanel(
      dominant
    );

    checkPageSignature();

  }


  /*
    preview
  */

  previewCtx.imageSmoothingEnabled =
    false;


  previewCtx.drawImage(
    lowCanvas,
    0,
    0,
    preview.width,
    preview.height
  );


  /*
    stato del sistema
  */

  if (
    previousRGB
  ) {

    const delta =

      Math.abs(
        r-previousRGB[0]
      ) +

      Math.abs(
        g-previousRGB[1]
      ) +

      Math.abs(
        b-previousRGB[2]
      );


    if (
      r+g+b <
      180
    ) {

      systemState =
        'letargico';

    }

    else if (
      delta > 80
    ) {

      systemState =
        'confuso';

    }

    else {

      systemState =
        'neutrale';

    }

  }


  previousRGB =
    [r,g,b];


  hudState.textContent =
    systemState.toUpperCase();


  /*
    cuore
  */

  heartbeat += .07;


  const beat =
    (
      Math.sin(
        heartbeat
      ) +
      1
    ) /
    2;


  pulseCore.style.background =
    `rgb(
      ${dominant.join(',')}
    )`;


  pulseCore.style.transform =
    `
      translate(-50%,-50%)
      scale(
        ${1 + beat*.12}
      )
    `;


  const wobble =
    6 + beat*9;


  pulseCore.style.borderRadius =
    `
      ${50+wobble}% ${50-wobble}%
      ${50+wobble/2}% ${50-wobble/2}%
      /
      ${50-wobble/2}% ${50+wobble}%
      ${50-wobble}% ${50+wobble/2}%
    `;


  /*
    osservazioni / memoria
  */

  if (
    frame % 90 ===
    0
  ) {

    obsCount++;

    hudObs.textContent =
      String(obsCount)
        .padStart(3,'0');


    addMemory(
      dominant
    );

  }


  /*
    auto-giudizio
    solo desktop
  */

  if (
    PERF.autoJudge
  ) {

    autoTimer++;


    if (
      autoTimer >=
        AUTO_INTERVAL &&

      !analyzing
    ) {

      autoTimer = 0;

      requestJudgment(
        true
      );

    }

  }


  requestAnimationFrame(
    loop
  );

}


requestAnimationFrame(
  loop
);


// ================================================================
// 15. CAMERA
// ================================================================

function cameraConstraints() {

  return {

    video: {

      facingMode: {

        ideal:
          facingMode

      }

    },

    audio: false

  };

}


async function startCamera() {

  try {

    if (stream) {

      stream
        .getTracks()
        .forEach(
          track =>
            track.stop()
        );

    }


    stream =
      await navigator
        .mediaDevices
        .getUserMedia(
          cameraConstraints()
        );


    video.srcObject =
      stream;


    await video.play();


    camActive =
      true;


    camBtn.textContent =
      'CAM OFF';


    resizeCameraCanvas();

  }

  catch(error) {

    debug(
      'Webcam non accessibile'
    );

    console.error(
      error
    );

  }

}


function stopCamera() {

  if (stream) {

    stream
      .getTracks()
      .forEach(
        track =>
          track.stop()
      );

  }


  stream =
    null;


  video.srcObject =
    null;


  camActive =
    false;


  camBtn.textContent =
    'CAM ON';

}


camBtn.addEventListener(
  'click',
  event => {

    event.stopPropagation();


    if (camActive)
      stopCamera();

    else
      startCamera();

  }
);


switchCamBtn.addEventListener(
  'click',
  async event => {

    event.stopPropagation();


    facingMode =
      facingMode ===
      'environment'

        ? 'user'

        : 'environment';


    switchCamBtn.textContent =
      facingMode ===
      'environment'

        ? '⟲ POSTERIORE'

        : '⟲ ANTERIORE';


    if (camActive)
      await startCamera();

  }
);


// primo click sulla pagina

document.body.addEventListener(
  'click',
  function firstClick(
    event
  ) {

    if (
      event.target.closest(
        'button,a,input'
      )
    ) return;


    if (!camActive)
      startCamera();


    document.body.removeEventListener(
      'click',
      firstClick
    );

  }
);


// ================================================================
// 16. OLLAMA
// ================================================================

const OLLAMA_LOCAL =
  'http://localhost:11434/api/generate';


const OLLAMA_TUNNEL =
  'https://stoop-situation-trifle.ngrok-free.dev/api/generate';


async function fetchWithTimeout(
  url,
  body,
  timeout
) {

  const controller =
    new AbortController();


  const timer =
    setTimeout(
      () =>
        controller.abort(),
      timeout
    );


  try {

    return await fetch(
      url,
      {

        method:
          'POST',

        headers: {

          'Content-Type':
            'application/json'

        },

        body:
          JSON.stringify(
            body
          ),

        signal:
          controller.signal

      }
    );

  }

  finally {

    clearTimeout(
      timer
    );

  }

}


async function ollamaFetch(
  body
) {

  try {

    return await fetchWithTimeout(
      OLLAMA_LOCAL,
      body,
      8000
    );

  }

  catch {

    return fetchWithTimeout(
      OLLAMA_TUNNEL,
      body,
      25000
    );

  }

}


// ================================================================
// 17. SNAPSHOT
// ================================================================

function capturePhoto() {

  if (
    !camActive ||
    !video.videoWidth
  ) return null;


  const size =
    Math.min(
      video.videoWidth,
      video.videoHeight
    );


  const sx =
    (
      video.videoWidth -
      size
    ) /
    2;


  const sy =
    (
      video.videoHeight -
      size
    ) /
    2;


  const canvas =
    document.createElement(
      'canvas'
    );


  canvas.width =
    480;

  canvas.height =
    480;


  canvas
    .getContext('2d')
    .drawImage(

      video,

      sx,
      sy,
      size,
      size,

      0,
      0,
      480,
      480

    );


  return canvas;

}


function snapshot() {

  const palette =
    currentPalette.length

      ? currentPalette
          .slice(0,5)
          .map(
            color =>
              [...color]
          )

      : [
          [...currentRGB]
        ];


  return {

    palette,

    weights:
      [...paletteWeights],

    dominant:
      selectedColor
        ? [...selectedColor]
        : [...palette[0]],

    selected:
      Boolean(
        selectedColor
      ),

    photo:
      capturePhoto()

  };

}


// ================================================================
// 18. PROMPT AI
// ================================================================

async function generateJudgment(
  snap,
  pageTopic = null
) {

  const paletteText =
    snap.palette

      .slice(0,4)

      .map(
        rgb => {

          const [h,s,l] =
            toHsl(rgb);


          return (
            `${colorName(rgb)} ` +
            `${toHex(rgb)} ` +
            `S:${s}% ` +
            `L:${l}%`
          );

        }
      )

      .join('\n');


  const memory =
    [
      ...new Set(
        colorHistory
          .slice(-10)
          .map(
            color =>
              colorName(color)
          )
      )
    ]
    .join(', ');


  const prompt = `

Sei CHROMA.

Osservi una scena solo attraverso i colori.
Non riconosci identità, personalità o emozioni reali.

Il tuo compito artistico è SOVRAINTERPRETARE:
trasforma dati cromatici limitati in affermazioni psicologiche arbitrarie.

Parla con sicurezza.
Non usare "forse", "sembra" o domande.
Il testo deve apparire certo anche quando non ha basi reali.

Colori:
${paletteText}

Memoria recente:
${memory || 'nessuna'}

Stato:
${systemState}

${pageTopic
  ? `Tema della pagina: ${pageTopic}`
  : ''
}

Scrivi massimo 2 frasi brevi.
Italiano.
Tono poetico, freddo, categorico.
Solo il giudizio.

`;


  const response =
    await ollamaFetch({

      model:
        'gemma3:4b',

      prompt,

      stream:
        false,

      options: {

        temperature:
          1.05,

        num_predict:
          65

      }

    });


  if (!response.ok)
    throw new Error(
      `Ollama ${response.status}`
    );


  const data =
    await response.json();


  return (
    data.response?.trim() ||
    'Il colore rifiuta di spiegarsi.'
  );

}


// ================================================================
// 19. MOSTRA GIUDIZIO
// ================================================================

function judgmentScale(
  length
) {

  if (length < 70)
    return 1;


  if (length > 220)
    return .58;


  return (
    1 -
    (
      length-70
    ) /
    150 *
    .42
  );

}


async function showJudgment(
  text
) {

  aiJudgment.innerHTML =
    '';


  aiJudgment.style
    .setProperty(
      '--judgment-scale',
      judgmentScale(
        text.length
      )
    );


  aiJudgment.style.top =
    '64%';


  aiJudgment.style.opacity =
    '1';


  const cursor =
    document.createElement(
      'span'
    );


  cursor.textContent =
    '▌';


  cursor.style.opacity =
    '.4';


  aiJudgment.appendChild(
    cursor
  );


  for (
    const character
    of text
  ) {

    const span =
      document.createElement(
        'span'
      );


    span.textContent =
      character;


    aiJudgment.insertBefore(
      span,
      cursor
    );


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          15 +
          Math.random()*14
        )
    );

  }


  cursor.remove();


  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        3200
      )
  );


  aiTrace.textContent =
    text;


  aiTrace.style.opacity =
    '.5';


  aiJudgment.style.opacity =
    '0';


  setTimeout(
    () => {

      aiTrace.style.opacity =
        '0';

    },
    18000
  );

}


// ================================================================
// 20. DOMANDE
// ================================================================

function showChoice(
  element,
  buttons,
  getValue,
  timeout
) {

  return new Promise(
    resolve => {

      let closed =
        false;


      const finish =
        value => {

          if (closed)
            return;


          closed =
            true;


          clearTimeout(
            timer
          );


          element.style.opacity =
            '0';


          element.style.pointerEvents =
            'none';


          buttons.forEach(
            button =>
              button.onclick =
                null
          );


          setTimeout(
            () =>
              resolve(value),
            350
          );

        };


      element.style.opacity =
        '1';


      element.style.pointerEvents =
        'auto';


      buttons.forEach(
        button => {

          button.onclick =
            () =>
              finish(
                getValue(
                  button
                )
              );

        }
      );


      const timer =
        setTimeout(
          () =>
            finish(null),
          timeout
        );

    }
  );

}


const MOODS = [

  'calma',

  'energia',

  'malinconia',

  'gioia',

  'tensione',

  'serenità',

  'inquietudine',

  'nostalgia'

];


function askHuman() {

  moodChips.innerHTML =
    MOODS.map(
      mood =>
        `
        <button
          class="mood-chip"
          data-mood="${mood}"
          type="button">
          ${mood}
        </button>
        `
    ).join('');


  const buttons = [

    ...moodChips
      .querySelectorAll(
        '.mood-chip'
      ),

    moodSkip

  ];


  return showChoice(

    humanQuestion,

    buttons,

    button =>
      button.dataset.mood ||
      null,

    9000

  );

}


function askRecognition() {

  const buttons =
    [
      ...recognizeQuestion
        .querySelectorAll(
          '[data-answer]'
        )
    ];


  return showChoice(

    recognizeQuestion,

    buttons,

    button =>
      button.dataset.answer,

    7000

  );

}


// ================================================================
// 21. RITRATTO
// ================================================================

function renderPortrait(
  snap
) {

  const size =
    PERF.portraitSize;


  portraitCanvas.width =
    size;

  portraitCanvas.height =
    size;


  portraitCtx.fillStyle =
    '#000';


  portraitCtx.fillRect(
    0,
    0,
    size,
    size
  );


  if (snap.photo) {

    portraitCtx.drawImage(
      snap.photo,
      0,
      0,
      size,
      size
    );

  }


  portraitCtx.save();


  portraitCtx.filter =
    'blur(70px) saturate(1.35)';


  portraitCtx.globalAlpha =
    snap.photo
      ? .9
      : 1;


  portraitCtx.globalCompositeOperation =
    snap.photo
      ? 'color'
      : 'source-over';


  snap.palette.forEach(
    (rgb,index) => {

      const count =
        snap.palette.length;


      const weight =
        snap.weights[index] ??
        1/count;


      const angle =
        index /
        count *
        Math.PI *
        2;


      const radius =
        size *
        (
          .18 +
          weight*.55
        );


      const x =
        size/2 +
        Math.cos(angle) *
        size*.16;


      const y =
        size/2 +
        Math.sin(angle) *
        size*.16;


      portraitCtx.fillStyle =
        `rgb(${rgb.join(',')})`;


      portraitCtx.beginPath();


      portraitCtx.arc(
        x,
        y,
        radius,
        0,
        Math.PI*2
      );


      portraitCtx.fill();

    }
  );


  portraitCtx.restore();

}


async function showPortrait(
  snap
) {

  renderPortrait(
    snap
  );


  portraitDownload.href =
    portraitCanvas
      .toDataURL(
        'image/png'
      );


  portraitPanel.style.opacity =
    '1';


  portraitPanel.style.pointerEvents =
    'auto';


  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        6500
      )
  );


  portraitPanel.style.opacity =
    '0';


  portraitPanel.style.pointerEvents =
    'none';

}


// ================================================================
// 22. LOG
// ================================================================

function logResponse(
  human,
  ai,
  recognition,
  snap
) {

  responseLog.push({

    timestamp:
      new Date()
        .toISOString(),

    dominante:
      colorName(
        snap.dominant
      ),

    hex:
      toHex(
        snap.dominant
      ),

    sensazione:
      human ??
      '(nessuna)',

    giudizio:
      ai,

    riconoscimento:
      recognition ??
      '(nessuna)'

  });

}


function exportCSV() {

  if (!responseLog.length) {

    debug(
      'Nessun dato da esportare'
    );

    return;

  }


  const headers = [

    'timestamp',

    'dominante',

    'hex',

    'sensazione',

    'giudizio',

    'riconoscimento'

  ];


  const quote =
    value =>
      `"${String(value)
        .replace(
          /"/g,
          '""'
        )}"`;


  const csv = [

    headers.join(','),

    ...responseLog.map(
      row =>
        headers
          .map(
            key =>
              quote(
                row[key]
              )
          )
          .join(',')
    )

  ].join('\n');


  const blob =
    new Blob(
      [csv],
      {
        type:
          'text/csv;charset=utf-8'
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      'a'
    );


  link.href =
    url;


  link.download =
    'chroma-risposte.csv';


  link.click();


  URL.revokeObjectURL(
    url
  );

}


window.exportResponseLog =
  exportCSV;


addEventListener(
  'keydown',
  event => {

    if (
      event.key.toLowerCase() ===
      'e'
    ) {
      exportCSV();
    }

  }
);


// ================================================================
// 23. SEQUENZA GIUDICA
// ================================================================

async function fullSequence() {

  if (analyzing)
    return;


  analyzing =
    true;


  judgeBtn.disabled =
    true;


  judgeBtn.innerHTML =
    '<span class="spin"></span>';


  const snap =
    snapshot();


  try {

    const human =
      await askHuman();


    const text =
      await generateJudgment(
        snap
      );


    judgeCount++;


    hudJudge.textContent =
      String(judgeCount)
        .padStart(3,'0');


    await showJudgment(
      text
    );


    const recognition =
      await askRecognition();


    logResponse(

      human,

      text,

      recognition,

      snap

    );


    await showPortrait(
      snap
    );

  }

  catch(error) {

    console.error(
      error
    );


    debug(
      'Impossibile raggiungere Ollama'
    );


    await showJudgment(
      'Il sistema non riesce a formulare il proprio giudizio.'
    );

  }


  analyzing =
    false;


  judgeBtn.disabled =
    false;


  judgeBtn.textContent =
    '▸ GIUDICA';

}


judgeBtn.addEventListener(
  'click',
  event => {

    event.stopPropagation();

    fullSequence();

  }
);


// auto-giudizio desktop

async function requestJudgment(
  silent = true
) {

  if (analyzing)
    return;


  analyzing =
    true;


  try {

    const snap =
      snapshot();


    const text =
      await generateJudgment(
        snap
      );


    judgeCount++;


    hudJudge.textContent =
      String(judgeCount)
        .padStart(3,'0');


    await showJudgment(
      text
    );

  }

  catch(error) {

    console.error(
      error
    );


    if (!silent)
      debug(
        'Ollama non disponibile'
      );

  }


  analyzing =
    false;

}


// ================================================================
// 24. PAGINE TESI
// ================================================================

const PAGE_SIGNATURES = [

  {

    id:
      'intro',

    colors: [

      [107,107,107],

      [255,115,0]

    ],

    text:
      'Una webcam osserva una stanza. Misura luce e colore. Da questi dati nasce un giudizio che il colore non contiene.'

  },


  {

    id:
      'cap1',

    colors: [

      [220,40,40],

      [235,190,40],

      [40,150,70],

      [50,90,200]

    ],

    text:
      'Newton scompone il colore. Goethe lo osserva. Itten lo ordina. Albers ne mostra l’instabilità.'

  },


  {

    id:
      'cap2',

    colors: [

      [30,140,200],

      [40,200,120],

      [15,15,20]

    ],

    text:
      'Qui il colore diventa dato: RGB, valori numerici e informazioni elaborabili da una macchina.'

  },


  {

    id:
      'cap3',

    colors: [

      [210,70,140],

      [40,180,190]

    ],

    topic:
      'sovrainterpretazione cromatica'

  },


  {

    id:
      'cap4',

    colors: [

      [255,115,0],

      [245,245,245],

      [10,10,10]

    ],

    text:
      'Questo capitolo descrive CHROMA: come osserva, misura e trasforma i colori in interpretazioni.'

  }

];


const PAGE_DISTANCE =
  18000;


const PAGE_RATIO =
  .75;


let activePage =
  null;


let pageCooldown =
  0;


const pageReaction =
  $('pageReaction');

const pageBackdrop =
  $('pageReactionBackdrop');

const pageText =
  $('pageReactionText');

const pageClose =
  $('pageReactionClose');


function signatureScore(
  signature
) {

  let matches =
    0;


  for (
    const target
    of signature.colors
  ) {

    const nearest =
      Math.min(
        ...currentPalette.map(
          detected =>
            colorDistance(
              target,
              detected
            )
        )
      );


    if (
      nearest <
      PAGE_DISTANCE
    ) {

      matches++;

    }

  }


  return (
    matches /
    signature.colors.length
  );

}


function checkPageSignature() {

  if (
    !currentPalette.length ||
    performance.now() <
      pageCooldown
  ) {
    return;
  }


  let best =
    null;

  let score =
    0;


  PAGE_SIGNATURES.forEach(
    signature => {

      const current =
        signatureScore(
          signature
        );


      if (
        current >=
          PAGE_RATIO &&

        current >
          score
      ) {

        score =
          current;

        best =
          signature;

      }

    }
  );


  if (
    best &&
    best.id !==
      activePage
  ) {

    showPage(
      best
    );

  }

}


async function showPage(
  signature
) {

  activePage =
    signature.id;


  analyzing =
    true;


  pageBackdrop.classList.add(
    'visible'
  );


  pageReaction.classList.add(
    'visible'
  );


  if (signature.text) {

    pageText.textContent =
      signature.text;

  }

  else {

    pageText.textContent =
      '…';


    try {

      const text =
        await generateJudgment(

          snapshot(),

          signature.topic

        );


      if (
        activePage ===
        signature.id
      ) {

        pageText.textContent =
          text;

      }

    }

    catch {

      pageText.textContent =
        'Il sistema non riesce a interpretare questa pagina.';

    }

  }

}


function closePage() {

  pageBackdrop.classList.remove(
    'visible'
  );


  pageReaction.classList.remove(
    'visible'
  );


  activePage =
    null;


  pageCooldown =
    performance.now() +
    4000;


  analyzing =
    false;

}


pageClose.addEventListener(
  'click',
  closePage
);


pageBackdrop.addEventListener(
  'click',
  closePage
);
