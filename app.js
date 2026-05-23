const styleUrls = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
];

let currentStyleIndex = 0;
let score = 0;
let highScore = 0;
let timeLeft = 30;
let gameInterval = null;
let countdownInterval = null;
let isPlaying = false;

const styleImg = document.getElementById("style-image");
const imageLoader = document.getElementById("image-loader");
const nextStyleBtn = document.getElementById("next-style-btn");

const scoreVal = document.getElementById("score-val");
const timerVal = document.getElementById("timer-val");
const highScoreVal = document.getElementById("high-score-val");
const gameCanvas = document.getElementById("game-canvas");
const startGameBtn = document.getElementById("start-game-btn");
const targetOodle = document.getElementById("target-oodle");

if (localStorage.getItem("oodle_highscore")) {
    highScore = parseInt(localStorage.getItem("oodle_highscore"), 10);
    highScoreVal.textContent = highScore;
}

nextStyleBtn.addEventListener("click", () => {
    imageLoader.classList.remove("hidden");
    currentStyleIndex = (currentStyleIndex + 1) % styleUrls.length;
    styleImg.src = styleUrls[currentStyleIndex];
});

styleImg.addEventListener("load", () => {
    imageLoader.classList.add("hidden");
});

function moveTarget() {
    const canvasWidth = gameCanvas.clientWidth;
    const canvasHeight = gameCanvas.clientHeight;
    
    const maxX = canvasWidth - 50;
    const maxY = canvasHeight - 50;
    
    const randomX = Math.max(0, Math.floor(Math.random() * maxX));
    const randomY = Math.max(0, Math.floor(Math.random() * maxY));
    
    targetOodle.style.left = randomX + "px";
    targetOodle.style.top = randomY + "px";
}

function startGame() {
    if (isPlaying) return;
    
    isPlaying = true;
    score = 0;
    timeLeft = 30;
    
    scoreVal.textContent = score;
    timerVal.textContent = timeLeft;
    
    startGameBtn.classList.add("hidden");
    targetOodle.classList.remove("hidden");
    
    moveTarget();
    
    gameInterval = setInterval(moveTarget, 1000);
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        timerVal.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    
    targetOodle.classList.add("hidden");
    startGameBtn.classList.remove("hidden");
    startGameBtn.textContent = "Play Again";
    
    if (score > highScore) {
        highScore = score;
        highScoreVal.textContent = highScore;
        localStorage.setItem("oodle_highscore", highScore);
    }
}

targetOodle.addEventListener("click", () => {
    if (!isPlaying) return;
    score++;
    scoreVal.textContent = score;
    moveTarget();
    clearInterval(gameInterval);
    gameInterval = setInterval(moveTarget, 1000);
});

startGameBtn.addEventListener("click", startGame);