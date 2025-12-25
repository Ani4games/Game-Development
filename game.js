
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
const playerImg = new Image();
playerImg.src = 'assets/player.png';

const meteorImg = new Image();
meteorImg.src = 'assets/meteor.png';
const ufoImg = new Image();
ufoImg.src = 'assets/ufo.png';

const STATES = {
  DRIFT: "DRIFT",
  TARGET: "TARGET",
  FEINT: "FEINT"
};

const obstacles = []
const OBSTACLE_TYPES = {
  METEOR: {
    type:"METEOR",
    img: meteorImg,
    speed: 3,
    size: () => Math.random() * 30 + 20,
    targetRange: 30,
    feintChance: 0.02,
    feintDuration: 30
  },
  UFO: {
    type:"UFO",
    img: ufoImg,
    speed: 4,
    size: () => Math.random() * 50 + 30,
    targetRange: 50,
    feintChance: 0.05,
    feintDuration: 60
  }
};
let directorMode = "CALM"; // CALM | PRESSURE | RELIEF
let survivalTime = 0;
let nearMisses = 0;

let score = 0;
const UFO_SCORE_THRESHOLD = 5;
let gameOver = false;

 // adjust filename if needed


function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}


function drawObstacles() {
  obstacles.forEach(o => {
    ctx.drawImage(o.img, o.x, o.y, o.size, o.size);
  });
}

function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];

    // FSM
    if (o.state === STATES.DRIFT) {
      o.y += o.speed;
      if (Math.abs(o.x - player.x) < o.targetRange) {
        o.state = STATES.TARGET;
      }
    }

    else if (o.state === STATES.TARGET) {
      o.y += o.speed + 1;
      o.x += o.x < player.x ? 2 : -2;

      if (Math.random() < o.feintChance) {
        o.state = STATES.FEINT;
        o.feintTimer = o.feintDuration;
      }
    }

    else if (o.state === STATES.FEINT) {
      o.y += o.speed;
      o.x += Math.random() > 0.5 ? 4 : -4;
      o.feintTimer--;

      if (o.feintTimer <= 0) {
        o.state = STATES.DRIFT;
      }
    }

    // Collision
    if (
      o.x < player.x + player.width &&
      o.x + o.size > player.x &&
      o.y < player.y + player.height &&
      o.y + o.size > player.y
    ) {
      gameOver = true;
      hitSound.play();
    }

    if (o.y > canvas.height) {
      obstacles.splice(i, 1);
      score++;
    }
  }
}

function spawnObstacle(typeKey) {
  const t = OBSTACLE_TYPES[typeKey];
  const size = t.size();

  obstacles.push({
    x: Math.random() * (canvas.width - size),
    y: -size,
    size,
    img: t.img,
    speed: t.speed,
    targetRange: t.targetRange,
    feintChance: t.feintChance,
    feintDuration: t.feintDuration,
    state: STATES.DRIFT,
    type: t.type
  });
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
function spawnDirector() {
  let ufoChance = 0;

  if (score >= UFO_SCORE_THRESHOLD) {
    ufoChance = directorMode === "PRESSURE" ? 0.7 : 0.2;
  }

  const roll = Math.random();

  if (roll < ufoChance) {
    spawnObstacle("UFO");
  } else {
    spawnObstacle("METEOR");
  }
}

function updateDirector() {
  survivalTime += 1 / 60;

  if (survivalTime > 30 && nearMisses < 5) {
    directorMode = "PRESSURE";
  } else if (survivalTime < 15) {
    directorMode = "CALM";
  } else {
    directorMode = "RELIEF";
  }
}

function drawDebug() {
  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.fillText(`Director: ${directorMode}`, 10, 50);

  if (obstacles[0]) {
    ctx.fillText(`Threat: ${obstacles[0].type} | State: ${obstacles[0].state}`, 10, 70);
  }
}

function update() {
  if (gameOver) {
    drawGameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  updateDirector();
  updateObstacles();
  drawPlayer();
  drawObstacles();
  drawScore();
  drawDebug();

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

setInterval(() => {
  spawnDirector();
}, 1000);

update();


