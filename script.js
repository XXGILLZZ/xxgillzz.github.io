// -------------------- Helpers --------------------
const $ = (sel) => document.querySelector(sel);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function show(idToShow){
  const screens = ["#screenIntro", "#screenStory", "#screenAsk", "#screenYes"];
  for (const s of screens) $(s).hidden = (s !== idToShow);
}

// -------------------- Elements --------------------
const beginBtn = $("#beginBtn");
const softPopBtn = $("#softPopBtn");
const introHint = $("#introHint");

const backHomeBtn = $("#backHomeBtn");
const openLetterBtn = $("#openLetterBtn");
const letterBody = $("#letterBody");
const loveText = $("#loveText");
const toQuestionBtn = $("#toQuestionBtn");

const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");
const arena = $("#arena");
const noCounter = $("#noCounter");
const secretBox = $("#secretBox");
const loveNote = $("#loveNote");

const replayBtn = $("#replayBtn");

const musicBtn = $("#musicBtn");
const bgm = $("#bgm");

// -------------------- Love letter + messages --------------------
const loveLetter = [
  "Hi my love,",
  "",
  "I don’t know how you do it, but you make ordinary days feel like something I want to remember.",
  "You’re my calm, my excitement, my favorite thought, I love you meri shona, for everything you have done for me.",
  "",
  "If I could give you one thing, it would be the ability to see yourself through my eyes,",
  "because you’re genuinely incredible. You are the most beautiful girl in the entire universe, and you know that.",
  "I love you meri jaan. And you're gonna be mine forever and ever for eternity and every lifetime.",
  "",
  "Happy Valentine’s",
  "I love you. Always. From your Angu❤️"
].join("\n");

const secretMessageLines = [
  "You can click ‘No’ all you want… it’s still a yes whether you like it or not. 💘",
  "Plot twist: the only correct answer is YES 🥰",
  "you're mine no matter what so nuh uh uhhhh 😭"
];

// -------------------- Intro --------------------
beginBtn.addEventListener("click", () => {
  show("#screenStory");
  pop(22);
});

softPopBtn.addEventListener("click", () => {
  introHint.hidden = !introHint.hidden;
  pop(24);
});

// -------------------- Story screen actions --------------------
backHomeBtn.addEventListener("click", () => show("#screenIntro"));

openLetterBtn.addEventListener("click", () => {
  letterBody.hidden = false;
  typeMultiline(loveText, loveLetter);
  pop(28);
});

toQuestionBtn.addEventListener("click", () => {
  // Prime the secret note on the next screen
  loveNote.textContent = secretMessageLines[Math.floor(Math.random() * secretMessageLines.length)];

  show("#screenAsk");
  pop(30);

  // Ensure positioning happens AFTER the screen is visible
  setTimeout(() => moveNoButton(), 50);
});

// -------------------- The “No” button mechanics --------------------
let noAttempts = 0;
let noHardMode = false;

function moveNoButton(){
  const pad = 12;
  const rect = arena.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  const maxX = rect.width - noRect.width - pad;
  const maxY = rect.height - noRect.height - pad;

  let x = Math.random() * maxX + pad;
  let y = Math.random() * maxY + pad;

  if(noHardMode){
    const yes = yesBtn.getBoundingClientRect();
    const noFuture = { x: rect.left + x, y: rect.top + y };
    const dist = Math.hypot((noFuture.x - yes.left), (noFuture.y - yes.top));
    if(dist < 140){
      x = clamp(x + 150, pad, maxX);
      y = clamp(y + 80, pad, maxY);
    }
  }

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

function incrementNo(){
  noAttempts++;
  noCounter.textContent = `No attempts: ${noAttempts}`;

  // Make YES more tempting
  const scale = clamp(1 + noAttempts * 0.06, 1, 1.45);
  yesBtn.style.transform = `scale(${scale})`;

  // Reveal secret after a few tries
  if(noAttempts >= 1){
    secretBox.hidden = false;
    loveNote.textContent = secretMessageLines[Math.floor(Math.random() * secretMessageLines.length)];
  }

  // Hard mode after 6 tries
  if(noAttempts >= 6) noHardMode = true;
}

noBtn.addEventListener("mouseenter", () => {
  incrementNo();
  moveNoButton();
  pop(10);
});

noBtn.addEventListener("click", () => {
  incrementNo();
  moveNoButton();
  pop(14);
});

// -------------------- YES flow --------------------
yesBtn.addEventListener("click", () => {
  show("#screenYes");
  celebrate(220);
  typeLine($("#finalLine"), "Okay, it’s official. You’re my Valentine 💖");
});

// -------------------- Replay --------------------
replayBtn.addEventListener("click", () => {
  noAttempts = 0;
  noHardMode = false;
  noCounter.textContent = "No attempts: 0";
  yesBtn.style.transform = "scale(1)";
  secretBox.hidden = true;
  introHint.hidden = true;
  letterBody.hidden = true;
  loveText.textContent = "";
  show("#screenIntro");
  pop(18);
});

// -------------------- Music toggle --------------------
musicBtn.addEventListener("click", async () => {
  try{
    if(bgm.paused){
      await bgm.play();
      musicBtn.textContent = "🔊 Music: On";
      musicBtn.setAttribute("aria-pressed", "true");
      pop(12);
    }else{
      bgm.pause();
      musicBtn.textContent = "🔊 Music: Off";
      musicBtn.setAttribute("aria-pressed", "false");
    }
  }catch{
    musicBtn.textContent = "🔇 Music unavailable";
    setTimeout(() => musicBtn.textContent = "🔊 Music: Off", 1400);
  }
});

// -------------------- Typewriter --------------------
function typeLine(el, text){
  el.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    el.textContent += text[i++] ?? "";
    if(i >= text.length) clearInterval(t);
  }, 22);
}

function typeMultiline(el, text){
  el.textContent = "";
  const chars = [...text];
  let i = 0;
  const t = setInterval(() => {
    el.textContent += chars[i++] ?? "";
    if(i >= chars.length) clearInterval(t);
  }, 14);
}

// -------------------- Canvas FX --------------------
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
let W = 0, H = 0;

function resize(){
  const dpr = window.devicePixelRatio || 1;
  W = Math.floor(window.innerWidth);
  H = Math.floor(window.innerHeight);
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const particles = [];

function spawnParticle(x, y, kind){
  const angle = Math.random() * Math.PI * 2;
  const speed = 1.5 + Math.random() * 4;
  particles.push({
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - (Math.random() * 1.5),
    life: 70 + Math.random() * 40,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.18,
    size: 10 + Math.random() * 10,
    kind
  });
}

function pop(n=14){
  const x = W * (0.25 + Math.random() * 0.5);
  const y = H * (0.18 + Math.random() * 0.35);
  for(let i=0;i<n;i++) spawnParticle(x, y, Math.random() < 0.55 ? "heart" : "dot");
}

function celebrate(n=200){
  const x = W * 0.5;
  const y = H * 0.25;
  for(let i=0;i<n;i++) spawnParticle(x, y, Math.random() < 0.6 ? "heart" : "dot");
}

function drawHeart(x, y, s, r){
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(r);
  ctx.scale(s/18, s/18);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(0, -2, -10, -2, -10, 6);
  ctx.bezierCurveTo(-10, 14, 0, 18, 0, 22);
  ctx.bezierCurveTo(0, 18, 10, 14, 10, 6);
  ctx.bezierCurveTo(10, -2, 0, -2, 0, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function tick(){
  ctx.clearRect(0,0,W,H);

  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.life -= 1;
    p.vy += 0.06;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    const a = clamp(p.life / 110, 0, 1);
    ctx.globalAlpha = a;

    if(p.kind === "heart"){
      ctx.fillStyle = `hsl(${320 + Math.random()*40} 85% ${60 + Math.random()*10}%)`;
      drawHeart(p.x, p.y, p.size, p.rot);
    }else{
      ctx.fillStyle = `hsl(${260 + Math.random()*120} 85% ${60 + Math.random()*10}%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size/6, 0, Math.PI*2);
      ctx.fill();
    }

    if(p.life <= 0 || p.y > H + 60) particles.splice(i,1);
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(tick);
}
tick();

setTimeout(() => pop(18), 400);
setTimeout(() => moveNoButton(), 300);
