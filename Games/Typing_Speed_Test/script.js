const quotes = [
  // Easy level (Level 1)
  [
    "The quick brown fox jumps over the lazy dog.",
    "Hello world, this is a simple typing test.",
    "Programming is fun when you practice daily.",
    "Keep calm and code on with confidence.",
    "Practice makes perfect in everything you do."
  ],
  // Medium level (Level 2)
  [
    "Technology is best when it brings people together. Innovation distinguishes between a leader and follower.",
    "Programming is not about typing, it's about thinking. Code is poetry written in logic and creativity.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts in life.",
    "The only way to do great work is to love what you do. Stay hungry, stay foolish, and keep learning.",
    "Artificial intelligence will not replace humans, but humans with AI will replace humans without AI."
  ],
  // Hard level (Level 3)
  [
    "The complexity of modern software development requires not only technical expertise but also collaborative skills, creative problem-solving abilities, and continuous learning mindset.",
    "Quantum computing represents a paradigm shift in computational capabilities, potentially revolutionizing fields like cryptography, optimization, and machine learning through quantum entanglement and superposition.",
    "Blockchain technology fundamentally transforms how we conceptualize trust, decentralization, and digital ownership by creating immutable, distributed ledgers that eliminate intermediaries.",
    "Machine learning algorithms continuously evolve through iterative training processes, analyzing vast datasets to identify patterns, make predictions, and optimize decision-making frameworks.",
    "Cybersecurity professionals must constantly adapt to emerging threats, implementing multi-layered defense strategies while balancing user accessibility with robust protection mechanisms."
  ]
];

const timeLimits = [90, 60, 45]; // seconds for each level
const levelNames = ["Easy", "Medium", "Hard"];

let currentLevel = 0;
let currentQuote = '';
let charIndex = 0;
let mistakes = 0;
let timer = 90;
let isTyping = false;
let timerInterval;
let startTime;

const quoteEl = document.getElementById('quote');
const inputEl = document.getElementById('input');
const wpmEl = document.getElementById('wpm');
const cpmEl = document.getElementById('cpm');
const mistakesEl = document.getElementById('mistakes');
const timeEl = document.getElementById('time');
const restartBtn = document.getElementById('restart');

// Add level display
const levelEl = document.createElement('div');
levelEl.className = 'level-display';
levelEl.innerHTML = `<span class="level-label">Level:</span> <span class="level-value" id="level">${levelNames[currentLevel]}</span>`;
document.querySelector('.header').appendChild(levelEl);

// Add level buttons
const levelButtonsEl = document.createElement('div');
levelButtonsEl.className = 'level-buttons';
levelButtonsEl.innerHTML = levelNames.map((name, index) => 
  `<button class="btn level-btn ${index === currentLevel ? 'active' : ''}" data-level="${index}">${name}</button>`
).join('');
document.querySelector('.content-area').insertBefore(levelButtonsEl, document.querySelector('.stats-panel'));

function initGame() {
  const levelQuotes = quotes[currentLevel];
  currentQuote = levelQuotes[Math.floor(Math.random() * levelQuotes.length)];
  charIndex = 0;
  mistakes = 0;
  timer = timeLimits[currentLevel];
  isTyping = false;
  startTime = null;
  
  clearInterval(timerInterval);
  
  inputEl.value = '';
  updateStats();
  displayQuote();
  updateLevelDisplay();
}

function displayQuote() {
  quoteEl.innerHTML = currentQuote.split('').map((char, index) => {
    let className = '';
    if (index < charIndex) {
      className = inputEl.value[index] === char ? 'correct' : 'incorrect';
    } else if (index === charIndex) {
      className = 'active';
    }
    return `<span class="${className}">${char}</span>`;
  }).join('');
}

function updateStats() {
  const currentTime = Date.now();
  const timeElapsed = startTime ? (currentTime - startTime) / 1000 : 0;
  const wpm = timeElapsed > 0 ? Math.round(((charIndex - mistakes) / 5) / (timeElapsed / 60)) : 0;
  const cpm = timeElapsed > 0 ? Math.round((charIndex - mistakes) / (timeElapsed / 60)) : 0;
  
  wpmEl.textContent = wpm > 0 ? wpm : 0;
  cpmEl.textContent = cpm > 0 ? cpm : 0;
  mistakesEl.textContent = mistakes;
  timeEl.textContent = timer;
}

function updateLevelDisplay() {
  document.getElementById('level').textContent = levelNames[currentLevel];
  document.querySelectorAll('.level-btn').forEach((btn, index) => {
    btn.classList.toggle('active', index === currentLevel);
  });
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    timer--;
    updateStats();
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  inputEl.blur();

  const timeElapsed = (Date.now() - startTime) / 1000;
  const wpm = Math.round(((charIndex - mistakes) / 5) / (timeElapsed / 60));
  const accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100) || 0;

  setTimeout(() => {
    alert(`Game Over!\nLevel: ${levelNames[currentLevel]}\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nTime: ${Math.round(timeElapsed)}s`);

    initGame(); 
  }, 100);
}


inputEl.addEventListener('input', (e) => {
  if (!isTyping) {
    isTyping = true;
    startTimer();
  }
  
  const typedChar = e.target.value[charIndex];
  const currentChar = currentQuote[charIndex];
  
  if (typedChar == null) {
    charIndex--;
    if (currentQuote[charIndex] !== inputEl.value[charIndex]) {
      mistakes--;
    }
  } else {
    if (typedChar !== currentChar) {
      mistakes++;
    }
    charIndex++;
  }
  
  if (charIndex >= currentQuote.length) {
    endGame();
    return;
  }
  
  if (timer <= 0) {
    endGame();
    return;
  }
  
  displayQuote();
  updateStats();
});

// Level button event listeners
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('level-btn')) {
    currentLevel = parseInt(e.target.dataset.level);
    initGame();
  }
});

quoteEl.addEventListener('click', () => inputEl.focus());
document.addEventListener('keydown', () => inputEl.focus());

restartBtn.addEventListener('click', initGame);

// Initialize game
initGame();
