// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player = { x: 220, y: 600, width: 40, height: 20, speed: 5, bullets: [] };
const enemies = [];
let score = 0;

function drawPlayer() {
    ctx.fillStyle = '#0f0';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = '#ff0';
    player.bullets.forEach((b) => {
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });
}

function drawEnemies() {
    ctx.fillStyle = '#f00';
    enemies.forEach((e) => {
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });
}

function movePlayer(dir) {
    player.x += dir * player.speed;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function shoot() {
    player.bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, speed: 7 });
}

function updateBullets() {
    player.bullets.forEach((b) => b.y -= b.speed);
    player.bullets = player.bullets.filter((b) => b.y + b.height > 0);
}

function createEnemy() {
    const x = Math.random() * (canvas.width - 40);
    enemies.push({ x, y: -20, width: 40, height: 20, speed: 2 });
}

function updateEnemies() {
    enemies.forEach((e) => e.y += e.speed);
    enemies = enemies.filter((e) => e.y < canvas.height);
}

function checkCollisions() {
    player.bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            if (
                b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y
            ) {
                // Remove enemy and bullet
                enemies.splice(ei, 1);
                player.bullets.splice(bi, 1);
                score++;
            }
        });
    });
}

function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();
    updateBullets();
    updateEnemies();
    checkCollisions();
}

// Player controls
let left = false, right = false;
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') left = true;
    if (e.code === 'ArrowRight') right = true;
    if (e.code === 'Space') shoot();
});
document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') left = false;
    if (e.code === 'ArrowRight') right = false;
});

// Enemies spawn periodically
setInterval(() => {
    createEnemy();
}, 1000);

// Update player movement
function updatePlayerMove() {
    if (left) movePlayer(-1);
    if (right) movePlayer(1);
}

function mainLoop() {
    updatePlayerMove();
    gameLoop();
    requestAnimationFrame(mainLoop);
}

mainLoop();