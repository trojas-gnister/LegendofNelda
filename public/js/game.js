var scene = new Phaser.Scene("game");
let score = 0;

const config = {
  width: 640,
  height: 410,
  type: Phaser.AUTO,
  scene: scene,
  parent: "gameCanvas",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  audio: {
    disableWebAudio: true,
  },
};

let highScore = await fetch("/api/users/current")
  .then((response) => response.json())
  .then((data) => {
    return { score: data.score, id: data.id };
  })
  .catch((error) => console.error("Error fetching user name:", error));

const updateScore = (score, id) => {
  fetch("/api/update-score", {
    method: "PUT",
    body: JSON.stringify({ score, id }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const game = new Phaser.Game(config);

scene.init = function () {
  document.getElementById("highScore").innerHTML = highScore.score;
  document.getElementById("score").innerHTML = score;
  this.speed = 2.0;
};

scene.preload = function () {
  this.load.image("background", "./img/sprites/map.png");
  this.load.image("ground", "./img/sprites/ground.png");
  this.load.image("shroom", "./img/sprites/shroom1.png");
  this.load.atlas("adventurer", "adventurer.png", "adventurer.json");
};

scene.create = function () {
  var bg = this.add.sprite(0, 0, "background");
  bg.setOrigin(0, 0);

  this.ground = this.add.sprite(320, 220, "ground");

  this.highScoreText = this.add.text(
    100,
    16,
    "High Score: " + highScore.score,
    {
      fontSize: "32px",
      fill: "#fff",
    }
  );

  this.scoreText = this.add.text(100, 45, "Score: " + score, {
    fontSize: "32px",
    fill: "#fff",
  });

  this.anims.create({
    key: "run",
    frameRate: 7,
    frames: this.anims.generateFrameNames("adventurer", {
      prefix: "run",
      suffix: ".png",
      start: 0,
      end: 3,
      zeroPad: 1,
    }),
    repeat: -1,
  });

  this.anims.create({
    key: "attack",
    frameRate: 7,
    frames: this.anims.generateFrameNames("adventurer", {
      prefix: "attack",
      suffix: ".png",
      start: 23,
      end: 25,
      zeroPad: 2,
    }),
    repeat: 0,
  });

  this.player = this.physics.add.sprite(50, 195, "adventurer");
  this.player.play("run", true);
  this.player.setScale(1.6);

  this.enemy = this.add.sprite(500, 185, "shroom");
  this.enemy.setScale(2.9);

  this.time.addEvent({
    delay: 60000,
    callback: () => {
      this.player.destroy();
      this.enemy.destroy();
      let gameOverText = this.add.text(400, 300, "Game Over", {
        font: "64px Arial",
        fill: "#fff",
      });
      gameOverText.setOrigin(0.75);
      gameOverText.y = 180;

      if (score > highScore.score) {
        highScore.score = score;
        this.highScoreText.setText("High Score: " + highScore.score);
        document.getElementById("highScore").innerHTML = highScore.score;
        console.log(score);
        updateScore(highScore.score, highScore.id);
      }
    },
    callbackScope: this,
    repeat: 0,
  });
};

scene.update = function () {
  this.player.x += this.speed;

  const resetScene = () => {
    this.player.x = 50;
    this.player.y = 195; 
    respawn(this.enemy);
  };

  var isAttacking = false;

  function respawn(enemy) {
    enemy.x = 500;
    enemy.y = 185;
    enemy.setVisible(true);
  }

  if (this.player.x > this.sys.game.config.width) {
    resetScene();
  }

  const playerAttack = (player, enemy) => {
    if (!isAttacking) {
      isAttacking = true;
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          player.getBounds(),
          enemy.getBounds()
        )
      ) {
        enemy.y += 500;
        score += 1;
        this.scoreText.setText("Score: " + score);
        document.getElementById("score").innerHTML = score;
        this.speed += 0.1; 
        
        setTimeout(() => {
          resetScene();
        }, 500);
      }
    }
    this.player.on("animationcomplete", () => {
      isAttacking = false;
    });
  };

  this.input.keyboard.once("keydown-SPACE", () => {
    playerAttack(this.player, this.enemy);
    this.player.play("attack", true);
  });

  this.player.once("animationcomplete", (animation, frame) => {
    if (animation.key === "attack") {
      console.log(animation.key);
      this.player.play("run", true);
    }
  });
};
