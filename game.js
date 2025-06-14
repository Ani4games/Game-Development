const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// background image
// const bgImage = new Image();
// bgImage.src = 'assets/background.jpg';
const player = {
  x: 180,
  y: 550,
  width: 40,
  height: 40,
  speed: 5,
  dx: 0
};
// const bgMusic = new Audio('assets/bg.mp3');
// bgMusic.loop = true;
// bgMusic.volume = 0.5;

const hitSound = new Audio('assets/hit.ogg');
hitSound.volume = 0.5;

const meteors = [];
const meteorSpeed = 3;
let score = 0;
let gameOver = false;

const playerImg = new Image();
playerImg.src = 'assets/player.png';

const meteorImg = new Image();
meteorImg.src = 'assets/meteor.png';

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}


function drawMeteors() {
  meteors.forEach(meteor => {
    ctx.drawImage(meteorImg, meteor.x, meteor.y, meteor.size, meteor.size);
  });
}

function updateMeteors() {
  for (let i = meteors.length - 1; i >= 0; i--) {
    meteors[i].y += meteorSpeed;

    // Collision detection
    if (
      meteors[i].x < player.x + player.width &&
      meteors[i].x + meteors[i].size > player.x &&
      meteors[i].y < player.y + player.height &&
      meteors[i].y + meteors[i].size > player.y
    ) {
      gameOver = true;
        hitSound.play();
    }

    // Remove off-screen meteors
    if (meteors[i].y > canvas.height) {
      meteors.splice(i, 1);
      score++;
    }
  }
}

function spawnMeteor() {
  const size = Math.random() * 30 + 20;
  const x = Math.random() * (canvas.width - size);
  meteors.push({ x, y: -size, size });
}

function movePlayer() {
  player.x += player.dx;
  // Prevent going out of bounds
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function drawGameOver() {
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText("Game Over", 120, 300);
  ctx.font = '16px Arial';
  ctx.fillText("Refresh to restart", 130, 340);
}

function update() {
  if (gameOver) {
    drawGameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  updateMeteors();
  drawPlayer();
  drawMeteors();
  drawScore();

  requestAnimationFrame(update);
}

function keyDown(e) {
  if (e.key === "ArrowRight") {
    player.dx = player.speed;
  } else if (e.key === "ArrowLeft") {
    player.dx = -player.speed;
  }
}

function keyUp(e) {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    player.dx = 0;
  }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

setInterval(spawnMeteor, 1000);
update();
