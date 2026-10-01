importScripts('opencv.js');

const cvReady = new Promise(resolve => {
  if (self.cv && self.cv.Mat) resolve();
  else if (self.cv && typeof self.cv.then === 'function') self.cv.then(m => { self.cv = m; resolve(); });
  else self.cv.onRuntimeInitialized = resolve;
});

const REF_FEATURES = 450;
const FRAME_FEATURES = 500;
const HEADER_HEIGHT = 45;

let orb, matcher, refDes;
const owner = [], refPts = [];

function buildReferences(cards) {
  orb = new cv.ORB(REF_FEATURES);
  matcher = new cv.BFMatcher(cv.NORM_HAMMING, false);
  const all = new cv.MatVector();
  cards.forEach((imageData, k) => {
    const rgba = cv.matFromImageData(imageData), gray = new cv.Mat();
    cv.cvtColor(rgba, gray, cv.COLOR_RGBA2GRAY);
    const mask = new cv.Mat(imageData.height, imageData.width, cv.CV_8UC1, new cv.Scalar(255));
    cv.rectangle(mask, new cv.Point(0, 0), new cv.Point(imageData.width, HEADER_HEIGHT), new cv.Scalar(0), -1);
    const kp = new cv.KeyPointVector(), des = new cv.Mat();
    orb.detectAndCompute(gray, mask, kp, des);
    if (des.rows > 0) {
      for (let i = 0; i < kp.size(); i++) {
        const p = kp.get(i).pt;
        refPts.push([p.x, p.y]);
        owner.push(k);
      }
      all.push_back(des);
    }
    rgba.delete(); gray.delete(); mask.delete(); kp.delete(); des.delete();
  });
  refDes = new cv.Mat();
  cv.vconcat(all, refDes);
  all.delete();
  orb.delete();
  orb = new cv.ORB(FRAME_FEATURES);
}

function matchFrame(imageData, cardCount) {
  const rgba = cv.matFromImageData(imageData), gray = new cv.Mat();
  cv.cvtColor(rgba, gray, cv.COLOR_RGBA2GRAY);
  const kp = new cv.KeyPointVector(), des = new cv.Mat(), noMask = new cv.Mat();
  orb.detectAndCompute(gray, noMask, kp, des);
  const perCard = Array.from({ length: cardCount }, () => []);
  if (des.rows > 0) {
    const pairs = new cv.DMatchVectorVector();
    matcher.knnMatch(des, refDes, pairs, 2);
    for (let i = 0; i < pairs.size(); i++) {
      const pr = pairs.get(i);
      if (pr.size() < 2) continue;
      const a = pr.get(0), b = pr.get(1);
      if (a.distance < 0.8 * b.distance) {
        const q = kp.get(a.queryIdx).pt;
        perCard[owner[a.trainIdx]].push([refPts[a.trainIdx], [q.x, q.y]]);
      }
    }
    pairs.delete();
  }
  const candidates = perCard.map((p, k) => [p.length, k]).sort((x, y) => y[0] - x[0]).slice(0, 3);
  const scores = candidates.map(([n, k]) => {
    if (n < 6) return [0, k];
    const src = cv.matFromArray(n, 1, cv.CV_32FC2, perCard[k].flatMap(p => p[0]));
    const dst = cv.matFromArray(n, 1, cv.CV_32FC2, perCard[k].flatMap(p => p[1]));
    const inl = new cv.Mat();
    const h = cv.findHomography(src, dst, cv.RANSAC, 6, inl);
    let count = 0;
    if (!h.empty()) for (let i = 0; i < inl.rows; i++) count += inl.data[i];
    src.delete(); dst.delete(); inl.delete(); h.delete();
    return [count, k];
  }).sort((x, y) => y[0] - x[0]);
  rgba.delete(); gray.delete(); kp.delete(); des.delete(); noMask.delete();
  return { index: scores[0][1], best: scores[0][0], second: scores[1] ? scores[1][0] : 0 };
}

let cardCount = 0;

self.onmessage = async e => {
  await cvReady;
  const msg = e.data;
  try {
    if (msg.type === 'refs') {
      cardCount = msg.cards.length;
      buildReferences(msg.cards);
      self.postMessage({ type: 'ready' });
    } else if (msg.type === 'frame') {
      const t0 = performance.now();
      const res = matchFrame(msg.frame, cardCount);
      self.postMessage({ type: 'result', ...res, color: msg.color, ms: performance.now() - t0 });
    }
  } catch (err) {
    self.postMessage({ type: 'error', message: String(err && err.message || err) });
  }
};
