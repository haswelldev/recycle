const durationSelect = document.getElementById('durationSelect');
const soundSelect = document.getElementById('soundSelect');
const timerDisplay = document.getElementById('timerDisplay');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const nihaoAudio = document.getElementById('nihaoAudio');

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
    nihaoAudio.currentTime = 0;
    nihaoAudio.play();
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
  reset();
});

updateDisplay();
