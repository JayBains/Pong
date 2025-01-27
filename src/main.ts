import "/styles/style.scss";
import bounceSound from "../assets/bounce.mp3";

let home = document.querySelector<HTMLDivElement>(".home");
let button = document.querySelector<HTMLButtonElement>(".home__button");
let container = document.querySelector<HTMLDivElement>(".container");
let game = document.querySelector<HTMLDivElement>(".game");
let scoreCounter =
  document.querySelector<HTMLParagraphElement>(".scoreboard__score");
let highscoreCounter = document.querySelector<HTMLParagraphElement>(
  ".scoreboard__highscore"
);
let ball = document.querySelector<HTMLDivElement>(".game__ball");
let paddle = document.querySelector<HTMLDivElement>(".game__paddle");
let prect: DOMRect;
let rect: DOMRect;

if (
  !home ||
  !button ||
  !container ||
  !game ||
  !scoreCounter ||
  !highscoreCounter ||
  !ball ||
  !paddle
) {
  throw new Error("HTML error: Missing elements");
}

window.addEventListener("resize", (event) => {
  prect = paddle.getBoundingClientRect();
  rect = game.getBoundingClientRect();
  return event;
});

const run = () => {
  home.style.display = "none";
  container.style.display = "flex";

  const audio = new Audio(bounceSound);
  prect = paddle.getBoundingClientRect();
  rect = game.getBoundingClientRect();

  const newX = 150;
  const newY = 20;
  const StartSpd = 3;
  const acceleration = 1.02;
  let x = newX;
  let y = newY;
  let speedX = Math.round(Math.random()) ? -1 * StartSpd : StartSpd;
  let speedY = Math.round(Math.random()) ? -1 * StartSpd : StartSpd;
  let paddleX = 0;
  let score = 0;
  let highscore = 0;

  document.addEventListener("mousemove", (event) => {
    let mouseX = event.clientX - rect.left;
    if (mouseX > 0 && mouseX < rect.right - rect.left) {
      paddleX = mouseX - (prect.right - prect.left) / 2;
      paddle.style.left = paddleX + "px";
    }
  });

  document.addEventListener("touchmove", (event) => {
    event.preventDefault();
    let mouseX = event.touches[0].clientX - rect.left;
    if (mouseX > 0 && mouseX < rect.right - rect.left) {
      paddleX = mouseX - (prect.right - prect.left) / 2;
      paddle.style.left = paddleX + "px";
    }
  });

  function animate() {
    if (!ball || !paddle || !scoreCounter) {
      throw new Error("animate() error: Cannot find ball, paddle or score");
    }
    x += speedX;
    y += speedY;
    if (x - 5 <= 0 && speedX < 0) {
      speedX = -speedX;
    } else if (x + 25 >= rect.right - rect.left && speedX > 0) {
      speedX = -speedX;
    } else if (y - 5 <= 0 && speedY < 0) {
      speedY = -speedY;
    } else if (y + 25 >= rect.bottom - rect.top && speedY > 0) {
      if (x + 15 > paddleX && x + 5 < paddleX + prect.right - prect.left) {
        audio.play();
        speedY = -speedY;
        score++;
        scoreCounter.textContent = `Score: ${score}`;
        speedX *= acceleration;
        speedY *= acceleration;
      } else {
        respawn();
      }
    }
    ball.style.left = x + "px";
    ball.style.top = y + "px";
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function respawn() {
    if (!highscoreCounter || !scoreCounter || !ball) {
      throw new Error("respawn() error: cannot find scores or ball");
    }
    speedX = 0;
    speedY = 0;
    ball.style.backgroundColor = "red";
    sleep(200).then(() => {
      if (score > highscore) {
        highscore = score;
        highscoreCounter.textContent = `Highscore: ${highscore}`;
        alert(`New high score! You got: ${highscore}!`);
      }

      sleep(1000).then(() => {
        ball.style.backgroundColor = "white";
        score = 0;
        scoreCounter.textContent = `Score: ${score}`;
        x = newX;
        y = newY;
        speedX = Math.round(Math.random()) ? -1 * StartSpd : StartSpd;
        speedY = Math.round(Math.random()) ? -1 * StartSpd : StartSpd;
      });
    });
  }

  function gameLoop() {
    animate();
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
};

button.addEventListener("click", () => {
  run();
});
