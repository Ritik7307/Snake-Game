const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-restart');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');

const highScoreEel = document.querySelector('#high-score');
const scoreEel = document.querySelector('#score');
const timerEel = document.querySelector('#time');

const blockHeight = 50;
const blockWidth = 50;

const blocks = {};
let snake = [];
let food = null;

let direction = 'right';
let gameLoop = null;
let timerLoop = null;

let score = 0;
let seconds = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;

highScoreEel.innerText = highScore;

const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

/* ---------- FOOD GENERATOR ---------- */
function generateFood() {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
}

/* ---------- CREATE GRID ---------- */
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

/* ---------- CLEAR BOARD ---------- */
function clearBoard() {
    Object.values(blocks).forEach(block => {
        block.classList.remove('fill', 'food');
    });
}

/* ---------- RENDER ---------- */
function render() {
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`]?.classList.add('fill');
    });
    blocks[`${food.x}-${food.y}`]?.classList.add('food');
}

/* ---------- TIMER ---------- */
function startTimer() {
    clearInterval(timerLoop);
    seconds = 0;
    timerEel.innerText = "00:00";

    timerLoop = setInterval(() => {
        seconds++;
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        timerEel.innerText = `${min}:${sec}`;
    }, 1000);
}

/* ---------- START / RESTART GAME ---------- */
function startGame() {
    clearInterval(gameLoop);
    clearInterval(timerLoop);

    clearBoard();

    snake = [{ x: 1, y: 3 }];
    direction = 'right';
    food = generateFood();

    score = 0;
    scoreEel.innerText = score;

    modal.style.display = 'none';
    startGameModal.style.display = 'none';
    gameOverModal.style.display = 'none';

    render();
    startTimer();

    gameLoop = setInterval(gameTick, 400);
}

/* ---------- GAME LOOP ---------- */
function gameTick() {
    let head;

    if (direction === 'left') head = { x: snake[0].x, y: snake[0].y - 1 };
    else if (direction === 'right') head = { x: snake[0].x, y: snake[0].y + 1 };
    else if (direction === 'up') head = { x: snake[0].x - 1, y: snake[0].y };
    else if (direction === 'down') head = { x: snake[0].x + 1, y: snake[0].y };

    /* ---- WALL COLLISION ---- */
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= rows ||
        head.y >= cols
    ) {
        endGame();
        return;
    }

    /* ---- SELF COLLISION ---- */
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        endGame();
        return;
    }

    /* ---- CLEAR OLD STATE ---- */
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`]?.classList.remove('fill');
    });
    blocks[`${food.x}-${food.y}`]?.classList.remove('food');

    /* ---- EAT FOOD ---- */
    const ateFood = head.x === food.x && head.y === food.y;
    snake.unshift(head);

    if (ateFood) {
        food = generateFood();
        score += 10;
        scoreEel.innerText = score;

        if (score > highScore) {
            highScore = score;
            highScoreEel.innerText = highScore;
            localStorage.setItem("highScore", highScore.toString());
        }
    } else {
        snake.pop();
    }

    render();
}

/* ---------- END GAME ---------- */
function endGame() {
    clearInterval(gameLoop);
    clearInterval(timerLoop);
    gameLoop = null;

    modal.style.display = 'flex';
    startGameModal.style.display = 'none';
    gameOverModal.style.display = 'flex';
}

/* ---------- BUTTONS ---------- */
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

/* ---------- KEYBOARD ---------- */
addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    else if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    else if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    else if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});
