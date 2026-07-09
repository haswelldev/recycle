const STORAGE_KEYS = {
  theme: 'recycle:theme',
  duration: 'recycle:duration',
  sound: 'recycle:sound',
  volume: 'recycle:volume',
};

const LOW_VOLUME_THRESHOLD = 30;

const ICON_PLAY =
  '<svg class="icon" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';
const ICON_PAUSE =
  '<svg class="icon" viewBox="0 0 320 512" fill="currentColor" aria-hidden="true"><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>';

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
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const volumeWarning = document.getElementById('volumeWarning');
const previewBtn = document.getElementById('previewBtn');

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

function applyVolume(value) {
  soundAudio.volume = value / 100;
  volumeValue.textContent = `${value}%`;
  volumeWarning.hidden = value > LOW_VOLUME_THRESHOLD;
}

function loadVolume() {
  const stored = parseInt(readStorage(STORAGE_KEYS.volume), 10);
  if (!Number.isNaN(stored) && stored >= 0 && stored <= 100) {
    return stored;
  }
  return parseInt(volumeSlider.value, 10);
}

const initialVolume = loadVolume();
volumeSlider.value = String(initialVolume);
applyVolume(initialVolume);

volumeSlider.addEventListener('input', () => {
  const value = parseInt(volumeSlider.value, 10);
  writeStorage(STORAGE_KEYS.volume, String(value));
  applyVolume(value);
});

previewBtn.addEventListener('click', () => {
  soundAudio.currentTime = 0;
  soundAudio.play();
});

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
  startPauseBtn.innerHTML = ICON_PAUSE + '<span>Pause</span>';
  startPauseBtn.classList.add('running');
  intervalId = setInterval(tick, 1000);
}

function pause() {
  running = false;
  startPauseBtn.innerHTML = ICON_PLAY + '<span>Start</span>';
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
