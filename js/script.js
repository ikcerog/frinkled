/**
 * Simpsons Episode Guessing Game - Full JS (UPDATED for [S#] markers + Warmup + Clue)
 *
 * ✅ NEW INPUT FORMAT SUPPORTED:
 *   [S1] Ep | Ep | Ep [S2] Ep | Ep | Ep ... [S11] Ep | Ep
 * - No trailing pipe required.
 * - Season boundaries come from [S#] markers (more reliable than counting).
 * - Episode numbers are assigned by position within each season (Ep1, Ep2, ...).
 *
 * ✅ UI/UX:
 * - Typeahead shows ONLY plain titles (no S##E## in dropdown)
 * - Placeholder/spinner while image loads
 * - Clue button: disabled until 3 wrong guesses; reveals S##E## on click
 * - Warmup/soft landing overlay on first visit per session; prevents early "error-y" tone
 *
 * HTML assumptions (IDs present):
 * - #image-frame
 * - #image-placeholder (contains .spinner and .placeholder-text)
 * - #screenshot
 * - #guess-input
 * - #episode-list (datalist)  <-- still used for desktop; mobile datalist behavior varies
 * - #guess-button
 * - #refresh-button
 * - #clue-button
 * - #feedback
 * - #guess-list
 * - #remaining-guesses
 * - #notification
 */

/* =========================
   1) PASTE YOUR [S#] + PIPE EPISODE BLOCK HERE
   =========================
   Paste the entire string between the backticks.

   Example:
   [S1] Simpsons Roasting on an Open Fire | Bart the Genius | ... [S2] Bart Gets an "F" | ...
*/
const EPISODE_TITLES_PIPE = `
[S1] Simpsons Roasting on an Open Fire | Bart the Genius | Homer's Odyssey | There's No Disgrace Like Home | Bart the General | Moaning Lisa | The Call of the Simpsons | The Telltale Head | Life on the Fast Lane | Homer's Night Out | The Crepes of Wrath | Krusty Gets Busted | Some Enchanted Evening [S2] Bart Gets an "F" | Simpson and Delilah | Treehouse of Horror | Two Cars in Every Garage and Three Eyes on Every Fish | Dancin' Homer | Dead Putting Society | Bart vs. Thanksgiving | Bart the Daredevil | Itchy & Scratchy & Marge | Bart Gets Hit by a Car | One Fish, Two Fish, Blowfish, Blue Fish | The Way We Was | Homer vs. Lisa and the 8th Commandment | Principal Charming | Oh Brother, Where Art Thou? | Bart's Dog Gets an "F" | Old Money | Brush with Greatness | Lisa's Substitute | The War of the Simpsons | Three Men and a Comic Book | Blood Feud [S3] Stark Raving Dad | Mr. Lisa Goes to Washington | When Flanders Failed | Bart the Murderer | Homer Defined | Like Father, Like Clown | Treehouse of Horror II | Lisa's Pony | Saturdays of Thunder | Flaming Moe's | Burns Verkaufen der Kraftwerk | I Married Marge | Radio Bart | Lisa the Greek | Homer Alone | Bart the Lover | Homer at the Bat | Separate Vocations | Dog of Death | Colonel Homer | Black Widower | The Otto Show | Bart's Friend Falls in Love | Brother, Can You Spare Two Dimes? [S4] Kamp Krusty | A Streetcar Named Marge | Homer the Heretic | Lisa the Beauty Queen | Treehouse of Horror III | Itchy & Scratchy: The Movie | Marge Gets a Job | New Kid on the Block | Mr. Plow | Lisa's First Word | Homer's Triple Bypass | Marge vs. the Monorail | Selma's Choice | Brother from the Same Planet | I Love Lisa | Duffless | Last Exit to Springfield | So It's Come to This: A Simpsons Clip Show | The Front | Whacking Day | Marge in Chains | Krusty Gets Kancelled [S5] Homer's Barbershop Quartet | Cape Feare | Homer Goes to College | Rosebud | Treehouse of Horror IV | Marge on the Lam | Bart's Inner Child | Boy-Scoutz 'n the Hood | The Last Temptation of Homer | $pringfield (Or, How I Learned to Stop Worrying and Love Legalized Gambling) | Homer the Vigilante | Bart Gets Famous | Homer and Apu | Lisa vs. Malibu Stacy | Deep Space Homer | Homer Loves Flanders | Bart Gets an Elephant | Burns' Heir | Sweet Seymour Skinner's Baadasssss Song | The Boy Who Knew Too Much | Lady Bouvier's Lover | Secrets of a Successful Marriage [S6] Bart of Darkness | Lisa's Rival | Another Simpsons Clip Show | Itchy & Scratchy Land | Sideshow Bob Roberts | Treehouse of Horror V | Bart's Girlfriend | Lisa on Ice | Homer Badman | Grampa vs. Sexual Inadequacy | Fear of Flying | Homer the Great | And Maggie Makes Three | Bart's Comet | Homie the Clown | Bart vs. Australia | Homer vs. Patty and Selma | A Star Is Burns | Lisa's Wedding | Two Dozen and One Greyhounds | The PTA Disbands | 'Round Springfield | The Springfield Connection | Lemon of Troy | Who Shot Mr. Burns? (Part One) [S7] Who Shot Mr. Burns? (Part Two) | Radioactive Man | Home Sweet Homediddly-Dum-Doodily | Bart Sells His Soul | Lisa the Vegetarian | Treehouse of Horror VI | King-Size Homer | Mother Simpson | Sideshow Bob's Last Gleaming | The 138th Episode Spectacular | Marge Be Not Proud | Team Homer | Two Bad Neighbors | Scenes from the Class Struggle in Springfield | Bart the Fink | Lisa the Iconoclast | Homer the Smithers | The Day the Violence Died | A Fish Called Selma | Bart on the Road | 22 Short Films About Springfield | Raging Abe Simpson and His Grumbling Grandson in "The Curse of the Flying Hellfish" | Much Apu About Nothing | Homerpalooza | Summer of 4 Ft. 2 [S8] Treehouse of Horror VII | You Only Move Twice | The Homer They Fall | Burns, Baby Burns | Bart After Dark | A Milhouse Divided | Lisa's Date with Density | Hurricane Neddy | El Viaje Misterioso de Nuestro Jomer (The Mysterious Voyage of Homer) | The Springfield Files | The Twisted World of Marge Simpson | Mountain of Madness | Simpsoncalifragilisticexpiala(Annoyed Grunt)cious | The Itchy & Scratchy & Poochie Show | Homer's Phobia | Brother from Another Series | My Sister, My Sitter | Homer vs. the Eighteenth Amendment | Grade School Confidential | The Canine Mutiny | The Old Man and the Lisa | In Marge We Trust | Homer's Enemy | The Simpsons Spin-Off Showcase | The Secret War of Lisa Simpson [S9] The City of New York vs. Homer Simpson | The Principal and the Pauper | Lisa's Sax | Treehouse of Horror VIII | The Cartridge Family | Bart Star | The Two Mrs. Nahasapeemapetilons | Lisa the Skeptic | Realty Bites | Miracle on Evergreen Terrace | All Singing, All Dancing | Bart Carny | The Joy of Sect | Das Bus | The Last Temptation of Krust | Dumbbell Indemnity | Lisa the Simpson | This Little Wiggy | Simpson Tide | The Trouble with Trillions | Girly Edition | Trash of the Titans | King of the Hill | Lost Our Lisa | Natural Born Kissers [S10] Lard of the Dance | The Wizard of Evergreen Terrace | Bart the Mother | Treehouse of Horror IX | When You Dish Upon a Star | D'oh-in' in the Wind | Lisa Gets an "A" | Homer Simpson in: "Kidney Trouble" | Mayored to the Mob | Viva Ned Flanders | Wild Barts Can't Be Broken | Sunday, Cruddy Sunday | Homer to the Max | I'm with Cupid | Marge Simpson in: "Screaming Yellow Honkers" | Make Room for Lisa | Maximum Homerdrive | Simpsons Bible Stories | Mom and Pop Art | The Old Man and the "C" Student | Monty Can't Buy Me Love | They Saved Lisa's Brain | Thirty Minutes over Tokyo [S11] Beyond Blunderdome | Brother's Little Helper | Guess Who's Coming to Criticize Dinner? | Treehouse of Horror X | E-I-E-I-(Annoyed Grunt) | Hello Gutter, Hello Fadder | Eight Misbehavin' | Take My Wife, Sleaze | Grift of the Magi | Little Big Mom | Faith Off | The Mansion Family | Saddlesore Galactica | Alone Again, Natura-Diddily | Missionary: Impossible | Pygmoelian | Bart to the Future | Days of Wine and D'oh'ses | Kill the Alligator and Run | Last Tap Dance in Springfield | It's a Mad, Mad, Mad, Mad Marge | Behind the Laughter
`.trim();

/* =========================
   2) CONFIG
   ========================= */
const MAX_SEASON = 11;
const MAX_GUESSES = 6;
const WRONGS_BEFORE_CLUE = 3;
const THROTTLE_MS = 3000;

// Warmup / soft landing
const SKIP_WARMUP = false;               // set true while developing if you want
const WARMUP_SECONDS = 15;               // recommended 10–20
const WARMUP_SESSION_KEY = 'simpsons_game_warmed';

/* =========================
   3) DOM REFS
   ========================= */
const elements = {
  imageFrame: document.getElementById('image-frame'),
  placeholder: document.getElementById('image-placeholder'),
  img: document.getElementById('screenshot'),
  input: document.getElementById('guess-input'),
  datalist: document.getElementById('episode-list'),
  btnGuess: document.getElementById('guess-button'),
  btnNew: document.getElementById('refresh-button'),
  btnClue: document.getElementById('clue-button'),
  feedback: document.getElementById('feedback'),
  guessList: document.getElementById('guess-list'),
  remaining: document.getElementById('remaining-guesses'),
  notif: document.getElementById('notification')
};

/* =========================
   4) STATE
   ========================= */
let SIMPSONS_EPISODES = [];       // plain titles for datalist + validation
let EPISODES_META = [];           // { title, season, episode, seLabel, canonical }
let currentEpisodeData = null;    // { season, episode, code, timestamp }
let correctTitle = "";

let guessesLeft = MAX_GUESSES;
let wrongGuessCount = 0;
let clueStage = 0; // 0 = unrevealed, 1 = season shown, 2 = full S#E# shown

let lastCallTime = 0;

// Warmup/init gating flags
let initDone = false;
let isWarmingUp = false;
let warmupTimerId = null;
let warmupRemaining = WARMUP_SECONDS;

/* =========================
   5) UTILITIES
   ========================= */
function pad(n) { return n < 10 ? '0' + n : String(n); }

function cleanString(s) {
  return (s || '').normalize('NFKC')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\u200B/g, '')      // zero-width spaces
    .toLowerCase()
    .replace(/[^\w\s]/g, '')     // remove punctuation for canonical compare
    .replace(/\s+/g, ' ')
    .trim();
}

function notify(msg) {
  if (!elements.notif) return;
  elements.notif.innerText = msg;
  elements.notif.classList.remove('hidden');
  setTimeout(() => elements.notif.classList.add('hidden'), 2200);
}

/* =========================
   6) IMAGE PLACEHOLDER / LOADING
   ========================= */
function showPlaceholder(text) {
  if (elements.placeholder) {
    const ptext = elements.placeholder.querySelector('.placeholder-text');
    if (ptext) ptext.innerText = text || 'Loading…';
    elements.placeholder.classList.remove('hidden');
  }
  if (elements.imageFrame) elements.imageFrame.classList.remove('error');
  if (elements.img) elements.img.style.visibility = 'hidden';

  if (elements.btnGuess) elements.btnGuess.disabled = true;
  if (elements.btnClue) elements.btnClue.disabled = true;
}

function hidePlaceholder() {
  if (elements.placeholder) elements.placeholder.classList.add('hidden');
  if (elements.img) elements.img.style.visibility = 'visible';
}

function showImageError(message) {
  if (elements.imageFrame) elements.imageFrame.classList.add('error');
  showPlaceholder(message || "We couldn't load that image. Try a new frame.");
  if (elements.feedback) elements.feedback.innerText = message || "We couldn't load that image.";
  if (elements.btnGuess) elements.btnGuess.disabled = true;
  if (elements.btnClue) elements.btnClue.disabled = true;
}

if (elements.img) {
  elements.img.addEventListener('load', () => {
    hidePlaceholder();
    if (elements.feedback) elements.feedback.innerText = "Ready! Which episode is this?";
    if (elements.btnGuess) elements.btnGuess.disabled = false;
    updateClueButtonState();

    // If warmup is running and the image loads early, end warmup immediately.
    if (isWarmingUp) stopWarmup(true);
  });

  elements.img.addEventListener('error', () => {
    showImageError("That image didn't load. Try a new frame.");
  });
}

/* =========================
   7) [S#] PARSER + META BUILDER
   ========================= */
function parseSeasonsFromBracketList(rawText) {
  // Supports: [S1] title | title [S2] title | title ... [S11] ...
  // Returns: { seasonMap: {1:[...],2:[...],...}, seasonsFound:[1,2,...] }

  const text = (rawText || '').trim();
  const re = /\[\s*S\s*(\d{1,2})\s*\]/gi;

  const seasonMap = {};
  const seasonsFound = [];
  const matches = [];

  let m;
  while ((m = re.exec(text)) !== null) {
    matches.push({ season: parseInt(m[1], 10), index: m.index, len: m[0].length });
  }

  if (!matches.length) return { seasonMap, seasonsFound };

  for (let i = 0; i < matches.length; i++) {
    const seasonNum = matches[i].season;
    const start = matches[i].index + matches[i].len;
    const end = (i + 1 < matches.length) ? matches[i + 1].index : text.length;

    if (seasonNum < 1 || seasonNum > 99) continue;

    const chunk = text.slice(start, end).trim();
    const titlesRaw = chunk.split('|');

    const titles = [];
    for (let j = 0; j < titlesRaw.length; j++) {
      const t = (titlesRaw[j] || '').trim();
      if (t) titles.push(t);
    }

    seasonMap[seasonNum] = titles;
    seasonsFound.push(seasonNum);
  }

  return { seasonMap, seasonsFound };
}

function buildEpisodesMetaFromBracketSeasons(rawText) {
  // Returns: EPISODES_META[] in season order, episode order
  // { title, season, episode, seLabel, canonical }

  const parsed = parseSeasonsFromBracketList(rawText);
  const seasonMap = parsed.seasonMap;

  const meta = [];

  // Sort seasons numerically (handles out-of-order input)
  const seasons = Object.keys(seasonMap).map(k => parseInt(k, 10)).sort((a, b) => a - b);

  for (let si = 0; si < seasons.length; si++) {
    const seasonNum = seasons[si];
    const titles = seasonMap[seasonNum] || [];

    for (let ei = 0; ei < titles.length; ei++) {
      const epNum = ei + 1;
      const title = titles[ei];

      meta.push({
        title: title,
        season: seasonNum,
        episode: epNum,
        seLabel: 'S' + pad(seasonNum) + 'E' + pad(epNum),
        canonical: cleanString(title)
      });
    }
  }

  return meta;
}

/* =========================
   8) DATALIST POPULATION (plain titles ONLY)
   ========================= */
function populateAutocompletePlainTitles(titles) {
  if (!elements.datalist) return;
  elements.datalist.innerHTML = '';

  const seen = new Set();
  for (let i = 0; i < titles.length; i++) {
    const t = (titles[i] || '').trim();
    if (!t) continue;

    const key = cleanString(t);
    if (seen.has(key)) continue;
    seen.add(key);

    const opt = document.createElement('option');
    opt.value = t; // plain title only
    elements.datalist.appendChild(opt);
  }
}

/* =========================
   9) FRINKIAC RANDOM FRAME FETCH (proxy for CORS)
   ========================= */
function parseFrinkiacCode(code) {
  if (!code) return null;
  // Accepts S01E01, s1e1, 1x01, etc.
  const re = /(?:S?)(\d{1,2})[EexxX-]*(\d{1,2})/i;
  const m = code.match(re);
  if (!m) return null;
  return { season: parseInt(m[1], 10), episode: parseInt(m[2], 10) };
}

async function fetchRandomFrinkiacFrame() {
  const frinkiacUrl = `https://frinkiac.com/api/random?t=${Date.now()}`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(frinkiacUrl)}`;
  const resp = await fetch(proxyUrl);
  if (!resp.ok) throw new Error('proxy fetch failed');
  const proxyData = await resp.json();
  return JSON.parse(proxyData.contents);
}

/* =========================
   10) GAME FLOW: startNewRound
   ========================= */
function findTitleBySeasonEpisode(season, episode) {
  for (let i = 0; i < EPISODES_META.length; i++) {
    const m = EPISODES_META[i];
    if (m.season === season && m.episode === episode) return m.title;
  }
  return '';
}

function softThrottleGuard() {
  if (isWarmingUp) {
    notify("We're getting things ready. One moment…");
    return false;
  }
  if (!initDone) {
    notify("Loading… please try again in a moment.");
    return false;
  }
  return true;
}

async function startNewRound() {
  if (!softThrottleGuard()) return;

  const now = Date.now();
  if (now - lastCallTime < THROTTLE_MS) {
    notify("Give it a second…");
    return;
  }
  lastCallTime = now;

  resetUI();
  if (elements.btnNew) elements.btnNew.disabled = true;
  showPlaceholder("Finding a frame…");

  try {
    let episodeData = null;

    // Try up to N times to find a frame in seasons 1..MAX_SEASON
    for (let attempts = 0; attempts < 10 && !episodeData; attempts++) {
      const data = await fetchRandomFrinkiacFrame();
      const codeRaw = data && data.Frame ? (data.Frame.Episode || data.Frame.EpisodeCode || '') : '';
      const parsed = parseFrinkiacCode(codeRaw);
      if (!parsed) continue;

      if (parsed.season >= 1 && parsed.season <= MAX_SEASON) {
        episodeData = {
          season: parsed.season,
          episode: parsed.episode,
          code: codeRaw,
          timestamp: data.Frame.Timestamp
        };
      }
    }

    if (!episodeData) throw new Error("Couldn't find an appropriate random frame.");

    currentEpisodeData = episodeData;
    correctTitle = findTitleBySeasonEpisode(episodeData.season, episodeData.episode) || '';

    showPlaceholder("Loading the image…");
    if (elements.img) {
      elements.img.src = `https://frinkiac.com/img/${episodeData.code}/${episodeData.timestamp}.jpg`;
    }
  } catch (err) {
    console.error('startNewRound error', err);
    showImageError("We hit a hiccup loading a frame. Try again.");
  } finally {
    if (elements.btnNew) elements.btnNew.disabled = false;
  }
}

/* =========================
   11) GUESS LOGIC
   ========================= */
function isValidTitleLocal(userGuess) {
  const g = cleanString(userGuess);
  if (!g) return false;

  for (let i = 0; i < SIMPSONS_EPISODES.length; i++) {
    if (cleanString(SIMPSONS_EPISODES[i]) === g) return true;
  }
  return false;
}

function handleGuess() {
  if (!softThrottleGuard()) return;

  const userGuess = elements.input ? elements.input.value.trim() : '';
  if (!userGuess || guessesLeft <= 0) return;

  if (!isValidTitleLocal(userGuess)) {
    notify("That doesn't match our Seasons 1–11 list.");
    return;
  }

  if (cleanString(userGuess) === cleanString(correctTitle)) {
    if (elements.feedback) elements.feedback.innerHTML = `<span class="correct">Nice! It was "${correctTitle}"!</span>`;
    if (elements.btnGuess) elements.btnGuess.disabled = true;
    if (elements.btnClue) elements.btnClue.disabled = true;
    if (elements.input) elements.input.value = '';
    return;
  }

  guessesLeft--;
  wrongGuessCount++;

  if (elements.guessList) {
    const li = document.createElement('li');
    li.innerText = userGuess;
    li.className = 'wrong';
    elements.guessList.appendChild(li);
  }

  if (guessesLeft <= 0) {
    if (elements.feedback) elements.feedback.innerHTML = `Out of guesses. The answer was <strong>${correctTitle || 'Unknown'}</strong>.`;
    if (elements.btnGuess) elements.btnGuess.disabled = true;
    if (elements.btnClue) elements.btnClue.disabled = true;
  } else {
    if (elements.feedback) elements.feedback.innerText = 'Not that one — try again.';
  }

  if (elements.remaining) elements.remaining.innerText = `Guesses left: ${guessesLeft}`;
  updateClueButtonState();
  if (elements.input) elements.input.value = '';
}

/* =========================
   12) CLUE BUTTON (enabled after WRONGS_BEFORE_CLUE wrong guesses)
   ========================= */
function getCurrentSELabel() {
  if (!currentEpisodeData) return '';
  return `S${pad(currentEpisodeData.season)}E${pad(currentEpisodeData.episode)}`;
}

function updateClueButtonState() {
  if (!elements.btnClue) return;

  const shouldEnable =
    currentEpisodeData &&
    (wrongGuessCount >= WRONGS_BEFORE_CLUE) &&
    clueStage < 2;

  elements.btnClue.disabled = !shouldEnable;

  if (clueStage === 0) {
    elements.btnClue.textContent = 'Clue';
    elements.btnClue.classList.remove('revealed');
  }
}

function revealClue() {
  if (!elements.btnClue || elements.btnClue.disabled) return;
  if (!currentEpisodeData) return;

  if (clueStage === 0) {
    // First click: show season only; briefly disable to prevent immediate double-advance
    clueStage = 1;
    elements.btnClue.textContent = `S${pad(currentEpisodeData.season)}`;
    elements.btnClue.classList.add('revealed');
    elements.btnClue.disabled = true;
    setTimeout(function () {
      if (clueStage === 1) elements.btnClue.disabled = false;
    }, 400);
  } else if (clueStage === 1) {
    // Second click: show full S#E#
    clueStage = 2;
    elements.btnClue.textContent = getCurrentSELabel();
    elements.btnClue.disabled = true;
  }
}

/* =========================
   13) LIVE VETTING (optional)
   ========================= */
function findMetaByTitle(title) {
  const t = cleanString(title);
  for (let i = 0; i < EPISODES_META.length; i++) {
    if (EPISODES_META[i].canonical === t) return EPISODES_META[i];
  }
  return null;
}

if (elements.input) {
  elements.input.addEventListener('input', function (ev) {
    const v = (ev.target && ev.target.value) ? ev.target.value : '';
    if (!v || !currentEpisodeData) return;

    const meta = findMetaByTitle(v);
    if (!meta) return;

    const curLabel = `S${pad(currentEpisodeData.season)}E${pad(currentEpisodeData.episode)}`;
    if (meta.season === currentEpisodeData.season && meta.episode === currentEpisodeData.episode) {
      if (elements.feedback) elements.feedback.innerText = `That title matches the current frame (${curLabel}).`;
    } else {
      if (elements.feedback) elements.feedback.innerText = `That title is ${meta.seLabel}.`;
    }
  });
}

/* =========================
   14) RESET UI
   ========================= */
function resetUI() {
  guessesLeft = MAX_GUESSES;
  wrongGuessCount = 0;
  clueStage = 0;
  correctTitle = '';
  currentEpisodeData = null;

  if (elements.guessList) elements.guessList.innerHTML = '';
  if (elements.remaining) elements.remaining.innerText = `Guesses left: ${MAX_GUESSES}`;
  if (elements.btnGuess) elements.btnGuess.disabled = true;
  if (elements.input) elements.input.value = '';
  if (elements.feedback) elements.feedback.innerText = '';
  if (elements.imageFrame) elements.imageFrame.classList.remove('error');

  updateClueButtonState();
}

/* =========================
   15) WIRING
   ========================= */
if (elements.btnNew) elements.btnNew.addEventListener('click', startNewRound);
if (elements.btnGuess) elements.btnGuess.addEventListener('click', handleGuess);
if (elements.btnClue) elements.btnClue.addEventListener('click', revealClue);

if (elements.input) {
  elements.input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') handleGuess();
  });
}

/* =========================
   15.5) WARMUP / SOFT LANDING
   ========================= */
function setControlsEnabled(enabled) {
  const controls = [elements.input, elements.btnGuess, elements.btnNew, elements.btnClue];
  controls.forEach(c => { if (c) c.disabled = !enabled; });
}

function showWarmupOverlay(show) {
  const el = document.getElementById('warmup-overlay');
  if (!el) return;
  el.style.display = show ? 'flex' : 'none';
}

(function createWarmupOverlay() {
  if (document.getElementById('warmup-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'warmup-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.6)';
  overlay.style.display = 'none';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '99999';
  overlay.style.color = '#fff';
  overlay.style.fontSize = '1.05rem';
  overlay.style.padding = '20px';
  overlay.style.textAlign = 'center';
  overlay.style.backdropFilter = 'blur(3px)';

  overlay.innerHTML = `
    <div style="max-width:760px">
      <div style="font-size:1.4rem; font-weight:700; margin-bottom:8px">Preparing Springfield…</div>
      <div style="margin-bottom:12px; opacity:0.95">
        Loading a few things so the game runs smoothly. This only takes a moment.
      </div>
      <div id="warmup-count" style="font-weight:700; font-size:1.25rem; margin-bottom:14px">
        Starting in ${WARMUP_SECONDS} seconds…
      </div>
      <div style="font-size:0.95rem; color:#f3f3f3; margin-bottom:14px">
        You can skip now; or hide this message for the rest of this browser session.
      </div>
      <div style="display:flex; gap:8px; justify-content:center;">
        <button id="warmup-skip" style="padding:8px 12px; font-weight:700; cursor:pointer">Skip now</button>
        <button id="warmup-dontshow" style="padding:8px 12px; cursor:pointer">Don't show again this session</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const skipBtn = document.getElementById('warmup-skip');
  const dontBtn = document.getElementById('warmup-dontshow');

  if (skipBtn) skipBtn.addEventListener('click', function () {
    stopWarmup(true);
  });

  if (dontBtn) dontBtn.addEventListener('click', function () {
    sessionStorage.setItem(WARMUP_SESSION_KEY, '1');
    stopWarmup(true);
  });
})();

function startWarmupIfNeeded(onDone) {
  if (SKIP_WARMUP || sessionStorage.getItem(WARMUP_SESSION_KEY) === '1') {
    if (typeof onDone === 'function') onDone();
    return;
  }

  isWarmingUp = true;
  warmupRemaining = WARMUP_SECONDS;

  showWarmupOverlay(true);
  setControlsEnabled(false);

  const countEl = document.getElementById('warmup-count');
  if (countEl) countEl.innerText = `Starting in ${warmupRemaining} seconds…`;

  warmupTimerId = setInterval(function () {
    warmupRemaining--;
    if (countEl) {
      countEl.innerText = warmupRemaining > 0
        ? `Starting in ${warmupRemaining} seconds…`
        : 'Starting now…';
    }

    if (warmupRemaining <= 0) {
      stopWarmup(false);
      if (typeof onDone === 'function') onDone();
    }
  }, 1000);
}

function stopWarmup(immediately) {
  if (warmupTimerId) {
    clearInterval(warmupTimerId);
    warmupTimerId = null;
  }

  isWarmingUp = false;
  showWarmupOverlay(false);

  setControlsEnabled(initDone);

  if (immediately) {
    // Optional: mark as warmed for this session when they skip manually
    // (They can also choose "Don't show again this session" which sets sessionStorage.)
  }
}

/* =========================
   16) INIT
   ========================= */
(function init() {
  startWarmupIfNeeded(function () {
    // 1) Build meta from [S#] markers
    EPISODES_META = buildEpisodesMetaFromBracketSeasons(EPISODE_TITLES_PIPE);

    // Basic sanity: ensure we found seasons and titles
    if (!EPISODES_META.length) {
      notify('Paste your [S#] episode block into EPISODE_TITLES_PIPE.');
    }

    // 2) Derive plain titles list from meta (ensures alignment)
    SIMPSONS_EPISODES = EPISODES_META.map(m => m.title);

    // 3) Populate datalist (plain titles only)
    populateAutocompletePlainTitles(SIMPSONS_EPISODES);
    function initCustomAutocomplete() {
  if (!elements.input) return;

  // stop native datalist behaviour
  try { elements.input.removeAttribute('list'); } catch (e) {}

  // hide original datalist so it doesn't show in some browsers
  if (elements.datalist && elements.datalist.style) elements.datalist.style.display = 'none';

  // Inject minimal styles (you can move to CSS file)
  if (!document.getElementById('custom-typeahead-styles')) {
    const style = document.createElement('style');
    style.id = 'custom-typeahead-styles';
    style.innerHTML = `
      .typeahead-container { position: relative; }
      .typeahead-list {
        position: absolute;
        z-index: 9999;
        left: 0;
        right: 0;
        max-height: 220px;
        overflow-y: auto;
        border: 1px solid rgba(0,0,0,0.12);
        background: white;
        box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        border-radius: 6px;
        margin-top: 6px;
        -webkit-overflow-scrolling: touch;
      }
      .typeahead-item {
        padding: 10px 12px;
        cursor: pointer;
        font-size: 14px;
      }
      .typeahead-item:hover, .typeahead-item.active {
        background: rgba(0,0,0,0.06);
      }
      .typeahead-empty {
        padding: 8px 12px;
        color: #666;
        font-size: 13px;
      }
      @media (max-width: 480px) {
        .typeahead-list { max-height: 180px; }
      }
    `;
    document.head.appendChild(style);
  }

  // Wrap input in a container if not already
  let container = elements.input.parentElement;
  if (!container || !container.classList.contains('typeahead-container')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'typeahead-container';
    elements.input.parentNode.insertBefore(wrapper, elements.input);
    wrapper.appendChild(elements.input);
    container = wrapper;
  }

  // Create list container
  let list = document.createElement('div');
  list.className = 'typeahead-list';
  list.style.display = 'none';
  container.appendChild(list);

  // Config
  const MAX_RESULTS = 12;
  const DEBOUNCE_MS = 160;

  // Precompute canonical titles for faster matches
  const indexed = SIMPSONS_EPISODES.map(title => ({ title, canonical: cleanString(title) }));

  // Utility: simple substring and token overlap scoring
  function scoreCandidate(inputCanon, candidateCanon) {
    if (candidateCanon.indexOf(inputCanon) === 0) return 1.0; // startsWith highest
    if (candidateCanon.indexOf(inputCanon) > -1) return 0.9;  // contains
    // token overlap fallback
    const inTok = inputCanon.split(' ').filter(Boolean);
    const candTok = candidateCanon.split(' ').filter(Boolean);
    const inter = inTok.filter(t => candTok.indexOf(t) !== -1).length;
    const union = (new Set(inTok.concat(candTok))).size || 1;
    return inter / union; // 0..1
  }

  // Debounce helper
  let debounceTimer = null;
  function debounce(fn, ms) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, ms);
  }

  // Render suggestions (array of titles)
  let activeIndex = -1;
  function renderSuggestions(results, show) {
    activeIndex = -1;
    list.innerHTML = '';
    if (!show || !results || !results.length) {
      // show a friendly empty state when focused but no results
      if (show) {
        const empty = document.createElement('div');
        empty.className = 'typeahead-empty';
        empty.innerText = 'No matches';
        list.appendChild(empty);
        list.style.display = 'block';
      } else {
        list.style.display = 'none';
      }
      return;
    }

    const slice = results.slice(0, MAX_RESULTS);
    for (let i = 0; i < slice.length; i++) {
      const item = document.createElement('div');
      item.className = 'typeahead-item';
      item.setAttribute('data-index', String(i));
      item.innerText = slice[i];
      item.addEventListener('click', function () {
        chooseSuggestion(slice[i]);
      });
      list.appendChild(item);
    }
    list.style.display = 'block';
  }

  function chooseSuggestion(title) {
    elements.input.value = title;
    hideSuggestions();
    elements.input.focus();
    // optionally trigger input event to let other listeners run
    const ev = new Event('input', { bubbles: true });
    elements.input.dispatchEvent(ev);
  }

  function hideSuggestions() {
    list.style.display = 'none';
    activeIndex = -1;
  }

  function showSuggestionsFor(value) {
    const v = (value || '').trim();
    if (!v) {
      renderSuggestions([], true);
      return;
    }
    const vc = cleanString(v);
    // compute scores
    const scored = indexed.map(it => {
      return { title: it.title, canonical: it.canonical, score: scoreCandidate(vc, it.canonical) };
    }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);
    const titles = scored.map(s => s.title);
    renderSuggestions(titles, true);
  }

  // Input attributes to reduce native keyboard suggestions (helps mobile)
  elements.input.setAttribute('autocomplete', 'off');
  elements.input.setAttribute('autocorrect', 'off');
  elements.input.setAttribute('autocapitalize', 'off');
  elements.input.setAttribute('spellcheck', 'false');

  // Events
  elements.input.addEventListener('input', function (ev) {
    const v = ev.target.value || '';
    debounce(function () { showSuggestionsFor(v); }, DEBOUNCE_MS);
  });

  elements.input.addEventListener('focus', function () {
    // show empty suggestions list so user knows they can tap
    renderSuggestions([], true);
  });

  elements.input.addEventListener('blur', function () {
    // small timeout so click events on list can register
    setTimeout(hideSuggestions, 150);
  });

  // Keyboard navigation
  elements.input.addEventListener('keydown', function (ev) {
    if (list.style.display === 'none') return;
    const items = list.querySelectorAll('.typeahead-item');
    if (!items.length) return;

    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      items.forEach((it, idx) => it.classList.toggle('active', idx === activeIndex));
      const el = items[activeIndex];
      if (el) el.scrollIntoView({ block: 'nearest' });
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      items.forEach((it, idx) => it.classList.toggle('active', idx === activeIndex));
      const el = items[activeIndex];
      if (el) el.scrollIntoView({ block: 'nearest' });
    } else if (ev.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < items.length) {
        ev.preventDefault();
        chooseSuggestion(items[activeIndex].innerText);
      }
    } else if (ev.key === 'Escape') {
      hideSuggestions();
    }
  });

  // click outside closes
  document.addEventListener('click', function (e) {
    if (!container.contains(e.target)) hideSuggestions();
  }, true);
}

    // 4) Mark init complete, enable controls, start first round
    initDone = true;
    setControlsEnabled(true);

    showPlaceholder('Initializing…');
    startNewRound();
  });
})();
