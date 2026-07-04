const STORAGE_KEYS = {
  theme: 'recycle:theme',
  duration: 'recycle:duration',
  sound: 'recycle:sound',
};

const SOUND_FILES = {
  nihao: 'assets/nihao.mp3',
  itakimo: 'assets/itakimo.mp3',
  fahhhh: 'assets/fahhhh.mp3',
  ding: 'assets/ding.mp3',
};

const durationSelect = document.getElementById('durationSelect');
const soundSelect = document.getElementById('soundSelect');
const timerDisplay = document.getElementById('timerDisplay');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const soundAudio = document.getElementById('soundAudio');
const themeButtons = document.querySelectorAll('.theme-btn');

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
}

function applyTheme(theme) {
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  themeButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeChoice === theme);
  });
}

function setTheme(theme) {
  applyTheme(theme);
  writeStorage(STORAGE_KEYS.theme, theme);
}

themeButtons.forEach((btn) => {
  btn.addEventListener('click', () => setTheme(btn.dataset.themeChoice));
});

applyTheme(readStorage(STORAGE_KEYS.theme) || 'system');

function restoreSelectValue(select, storageKey) {
  const stored = readStorage(storageKey);
  const validValues = Array.from(select.options).map((o) => o.value);
  if (stored !== null && validValues.includes(stored)) {
    select.value = stored;
  }
}

restoreSelectValue(durationSelect, STORAGE_KEYS.duration);
restoreSelectValue(soundSelect, STORAGE_KEYS.sound);

soundAudio.src = SOUND_FILES[soundSelect.value];

let durationSeconds = parseInt(durationSelect.value, 10);
let remaining = durationSeconds;
let running = false;
let intervalId = null;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateDisplay() {
  const text = formatTime(remaining);
  timerDisplay.textContent = text;
  document.title = running ? `${text} · Recycle` : 'Recycle';
}

function tick() {
  remaining -= 1;
  if (remaining <= 0) {
    soundAudio.currentTime = 0;
    soundAudio.play();
    remaining = durationSeconds;
  }
  updateDisplay();
}

function start() {
  running = true;
  startPauseBtn.textContent = 'Pause';
  startPauseBtn.classList.add('running');
  intervalId = setInterval(tick, 1000);
}

function pause() {
  running = false;
  startPauseBtn.textContent = 'Start';
  startPauseBtn.classList.remove('running');
  clearInterval(intervalId);
  intervalId = null;
  updateDisplay();
}

function reset() {
  pause();
  remaining = durationSeconds;
  updateDisplay();
}

startPauseBtn.addEventListener('click', () => {
  if (running) {
    pause();
  } else {
    start();
  }
});

resetBtn.addEventListener('click', reset);

durationSelect.addEventListener('change', () => {
  durationSeconds = parseInt(durationSelect.value, 10);
  writeStorage(STORAGE_KEYS.duration, durationSelect.value);
  reset();
});

soundSelect.addEventListener('change', () => {
  writeStorage(STORAGE_KEYS.sound, soundSelect.value);
  soundAudio.src = SOUND_FILES[soundSelect.value];
});

updateDisplay();
