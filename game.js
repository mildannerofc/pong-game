const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12;
const paddleHeight = 90;
const ballRadius = 11;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;
const paddleSpeed = 6;
const ballSpeed = 6;

// State
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    vy: ballSpeed * (Math.random() * 2 - 1)
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = ballSpeed * (Math.random() * 2 - 1);
}

function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collision (top/bottom)
    if (ball.y - ballRadius < 0) {
        ball.y = ballRadius;
        ball.vy = -ball.vy;
    }
    if (ball.y + ballRadius > canvas.height) {
        ball.y = canvas.height - ballRadius;
        ball.vy = -ball.vy;
    }

    // Paddle collision (player)
    if (
        ball.x - ballRadius < playerX + paddleWidth &&
        ball.y > playerY &&
        ball.y < playerY + paddleHeight
    ) {
        ball.x = playerX + paddleWidth + ballRadius;
        ball.vx = -ball.vx;

        // Add spin based on where it hits the paddle
        let hitPos = (ball.y - (playerY + paddleHeight / 2)) / (paddleHeight / 2);
        ball.vy = ballSpeed * hitPos;
    }

    // Paddle collision (AI)
    if (
        ball.x + ballRadius > aiX &&
        ball.y > aiY &&
        ball.y < aiY + paddleHeight
    ) {
        ball.x = aiX - ballRadius;
        ball.vx = -ball.vx;

        let hitPos = (ball.y - (aiY + paddleHeight / 2)) / (paddleHeight / 2);
        ball.vy = ballSpeed * hitPos;
    }

    // Out of bounds (left or right)
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }

    // AI paddle movement (simple)
    let aiCenter = aiY + paddleHeight / 2;
    if (ball.y < aiCenter - 15) {
        aiY -= paddleSpeed;
    } else if (ball.y > aiCenter + 15) {
        aiY += paddleSpeed;
    }
    // Keep AI paddle in bounds
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    // Draw paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#fff");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#fff");

    // Draw ball
    drawCircle(ball.x, ball.y, ballRadius, "#fff");

    // Draw net
    for (let i = 20; i < canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 2, i, 4, 18, "#444");
    }
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Player paddle follows mouse Y
canvas.addEventListener('mousemove', function (evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    // Keep in bounds
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Start game
gameLoop();