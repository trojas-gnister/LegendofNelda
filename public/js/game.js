var scene = new Phaser.Scene("game");

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

// fetch current user score
let score = await fetch("/api/users/current")
  .then((response) => response.json())
  .then((data) => {
    return { score: data.score, id: data.id };
  })
  .catch((error) => console.error("Error fetching user name:", error));

// create new game
const game = new Phaser.Game(config);

// sets player stats and renders them on page.
scene.init = function () {
  document.getElementById("score").innerHTML = score.score;
  this.lives = 3;
  document.getElementById("lives").innerHTML = this.lives;
  this.speed = 3.5;
  this.score_text;
  this.lives_text;
};

// import assets
scene.preload = function () {
  this.load.image("background", "./img/sprites/map.png");
  this.load.image("ground", "./img/sprites/ground.png");
  this.load.image("shroom", "./img/sprites/shroom1.png");
  this.load.atlas("adventurer", "adventurer.png", "adventurer.json");
};

// creates the scene. this is where most of the game functionality is
scene.create = function () {
  // renders background
  var bg = this.add.sprite(0, 0, "background");
  bg.setOrigin(0, 0);

  // renders ground
  this.ground = this.add.sprite(320, 220, "ground");

  // renders score and lives
  this.scoreText = this.add.text(100, 16, "Score: " + score.score, {
    fontSize: "32px",
    fill: "#fff",
  });
  this.liveText = this.add.text(
    16,
    this.sys.game.config.height - 50,
    "Lives: " + this.lives,
    { fontSize: "32px", fill: "#fff" }
  );

  // creates idle animation
  this.anims.create({
    key: "idle",
    frameRate: 7,
    frames: this.anims.generateFrameNames("adventurer", {
      prefix: "idle",
      suffix: ".png",
      start: 0,
      end: 2,
      zeroPad: 1,
    }),
    repeat: -1,
  });

  // creates run animation
  this.anims.create({
    key: "run",
    frameRate: 7,
    frames: this.anims.generateFrameNames("adventurer", {
      prefix: "run",
      suffix: ".png",
      start: 0,
      end: 4,
      zeroPad: 1,
    }),
    repeat: 0,
  });

  // creates attack animation
  this.anims.create({
    key: "attack",
    frameRate: 7,
    frames: this.anims.generateFrameNames("adventurer", {
      prefix: "attack",
      suffix: ".png",
      start: 20,
      end: 25,
      zeroPad: 2,
    }),
    repeat: 0,
  });

  // spawns player and plays default animation
  this.player = this.physics.add.sprite(50, 195, "adventurer");
  this.player.play("idle");

  // spawns shroom
  this.enemy = this.add.sprite(500, 195, "shroom");

  // sets player physics
  this.player.setScale(1.1);
  this.enemy.setScale(1.9);
};

scene.update = function () {
  // resets the scene. called when player is out of bounds.
  const resetScene = () => {
    this.player.x = 50;
    this.player.y = 195;
  };

  // sets default value for isAttacking
  var isAttacking = false;

  function respawn(enemy) {
    enemy.x = 500;
    enemy.y = 195;
    enemy.setVisible(true);
  }
  // out of bounds check
  if (this.player.x > this.sys.game.config.width) {
    resetScene();
    respawn(this.enemy);
    this.enemy.setVisible(true);
  }

  // updates this.player score. uses fetch PUT request to update score in database.
  const updateScore = (score, id) => {
    console.log(score);
    this.scoreText.setText("Score: " + score);
    document.getElementById("score").innerHTML = score;
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
        enemy.y += 500;
        score.score += 1;
        updateScore(score.score, score.id);
      }
    }
    this.player.on("animationcomplete", () => {
      isAttacking = false;
    });
  };

  // creates cursors variable to use cursor keys
  var cursors = this.input.keyboard.createCursorKeys();
  // this.player movement
  if (cursors.right.isDown) {
    this.player.x += this.speed;
    this.player.play("run", true);
  }
  if (cursors.space.isDown) {
    console.log(this.player.body);
    this.player.anims.play("attack", true);
  }

  // animation complete event listeners
  this.player.on("animationcomplete", (animation, frame) => {
    if (animation.key === "run") {
      this.player.play("idle");
    }

    if (animation.key === "attack") {
      playerAttack(this.player, this.enemy);
      this.player.play("idle");
    }
  });
};

// gameover
scene.end = function () {
  if (this.lives <= 0) {
    this.scene.restart();
  } else {
    this.create();
  }
};
