// initializes phaser game scene
var scene = new Phaser.Scene("game");
// sets session score
let score = 0;

// phaser config
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

// fetches high score from database
let highScore = await fetch("/api/users/current")
  .then((response) => response.json())
  .then((data) => {
    return { score: data.score, id: data.id };
  })
  .catch((error) => console.error("Error fetching user name:", error));

// updates high score in database
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

// creates phaser game
const game = new Phaser.Game(config);

// inits score and high score on page load. sets speed of player.
scene.init = function () {
  document.getElementById("highScore").innerHTML = highScore.score;
  document.getElementById("score").innerHTML = score;
  this.speed = 2.0;
};

// preloads assets
scene.preload = function () {
  this.load.image("background", "./img/sprites/map.png");
  this.load.image("ground", "./img/sprites/ground.png");
  this.load.image("shroom", "./img/sprites/shroom1.png");
  this.load.atlas("adventurer", "adventurer.png", "adventurer.json");
};

// creates game objects
scene.create = function () {

  // creates background
  var bg = this.add.sprite(0, 0, "background");
  bg.setOrigin(0, 0);

  // creates ground where player and enemy stand
  this.ground = this.add.sprite(320, 220, "ground");

  // adds high score text to game screen
  this.highScoreText = this.add.text(
    100,
    65,
    "High Score: " + highScore.score,
    {
      fontSize: "32px",
      fill: "#fff",
    }
  );

  // adds score text to game screen
  this.scoreText = this.add.text(100, 95, "Score: " + score, {
    fontSize: "32px",
    fill: "#fff",
  });

  // creates player animations
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


  // spawns character
  this.player = this.physics.add.sprite(50, 195, "adventurer");
  this.player.play("run", true);
  this.player.setScale(1.6);

  // spawns enemy
  this.enemy = this.add.sprite(500, 185, "shroom");
  this.enemy.setScale(2.9);

  // timed event for 60 seconds until game over
  this.time.addEvent({
    delay: 60000,
    callback: () => {
      // destroys game objects
      this.player.destroy();
      this.enemy.destroy();

      // creates game over text
      let gameOverText = this.add.text(400, 300, "Game Over", {
        font: "64px Arial",
        fill: "#fff",
      });
      gameOverText.setOrigin(0.75);
      gameOverText.y = 180;

      // updates high score if score is higher than current high score
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

// updates game objects
scene.update = function () {
  // moves player
  this.player.x += this.speed;

  // resets scene and respawns enemy
  const resetScene = () => {
    this.player.x = 50;
    this.player.y = 195; 
    respawn(this.enemy);
  };

  // default value for player attacking
  var isAttacking = false;

  // respawns enemy
  function respawn(enemy) {
    enemy.x = 500;
    enemy.y = 185;
    enemy.setVisible(true);
  }

  // resets scene when player is out of bounds
  if (this.player.x > this.sys.game.config.width) {
    resetScene();
  }

  // player attack functionality
  const playerAttack = (player, enemy) => {
    if (!isAttacking) {
      isAttacking = true;
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          player.getBounds(),
          enemy.getBounds()
        )
      ) {
        // enemy disappears when hit
        enemy.y += 500;

        // updates score
        score += 1;
        this.scoreText.setText("Score: " + score);
        document.getElementById("score").innerHTML = score;
        this.speed += 0.1; 
      }
    }
    // resets isAttacking to false after attack animation is complete
    this.player.on("animationcomplete", () => {
      isAttacking = false;
    });
  };

  // player attack when spacebar is pressed
  this.input.keyboard.once("keydown-SPACE", () => {
    playerAttack(this.player, this.enemy);
    this.player.play("attack", true);
  });

  // plays run animation after attack animation is complete
  this.player.once("animationcomplete", (animation, frame) => {
    if (animation.key === "attack") {
      console.log(animation.key);
      this.player.play("run", true);
    }
  });
};
