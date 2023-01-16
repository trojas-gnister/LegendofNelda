var scene = new Phaser.Scene("game");
let score = await fetch("/api/users/current")
  .then((response) => response.json())
  .then((data) => {
    console.log(data.score);
    return data.score;
  })
  .catch((error) => console.error("Error fetching user name:", error));

var player;
var shroom;

const config = {
  width: 640,
  height: 430,
  type: Phaser.AUTO,
  scene: scene,
  parent: "gameCanvas",
  audio: {
    disableWebAudio: true,
  },
};

const game = new Phaser.Game(config);

const resetScene = () => {
  player.x = 50;
  player.y = 238;
  shroom.x = 500;
  shroom.y = 238;
};

scene.init = function () {
  this.score = score;
  document.getElementById("score").innerHTML = this.score;
  this.lives = 3;
  document.getElementById("lives").innerHTML = this.lives;
  this.speed = 3.5;
  this.score_text;
  this.lives_text;
};

scene.preload = function () {
  this.load.image("background", "./img/sprites/map.png");
  this.load.image("shroom", "./img/sprites/shroom1.png");
  this.load.atlas("adventurer", "adventurer.png", "adventurer.json");
};

scene.create = function () {
  var bg = this.add.sprite(0, 0, "background");
  bg.setOrigin(0, 0);

  this.scoreText = this.add.text(100, 16, "score: " + this.score, {
    fontSize: "32px",
    fill: "#fff",
  });
  this.liveText = this.add.text(
    16,
    this.sys.game.config.height - 50,
    "Lives: " + this.lives,
    { fontSize: "32px", fill: "#fff" }
  );

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

  this.anims.create({
    key: "attack",
    frameRate: 7,
    frames: this.anims.generateFrameNames("adventurer", {
      prefix: "attack",
      suffix: ".png",
      start: 0,
      end: 5,
      zeroPad: 1,
    }),
    repeat: 0,
  });

  const updateScore = (score, id) => {
    // send a PUT request to update the score in the database
    fetch("/api/update-score", {
      method: "PUT",
      body: JSON.stringify({ score, id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  player = this.add.sprite(50, 238, "adventurer");

  player.play("idle");

  shroom = this.add.sprite(500, 250, "shroom");
  shroom.setScale(3.3);
};

scene.update = function () {
  var isAttacking = false;

  if (player.x > this.sys.game.config.width) {
    resetScene();
  }

  //create a function to handle player attack
  const playerAttack = (player, enemy) => {
    //only attack if the player is not already attacking
    if (!isAttacking) {
      //set isAttacking to true
      isAttacking = true;
      //play the attack animation
      player.play("attack", true);
    }
    //listen for the animation to complete
    player.on("animationcomplete", () => {
      isAttacking = false;
    });
  };

  //in the update function
  var cursors = this.input.keyboard.createCursorKeys();
  if (cursors.right.isDown) {
    player.x += this.speed;
    player.play("run", true);
  }
  if (cursors.up.isDown) {
    playerAttack(player, shroom);
  }

  player.on("animationcomplete", (animation, frame) => {
    if (animation.key === "run") {
      player.play("idle");
    }
    if (animation.key === "attack") {
      player.play("idle");
    }
  });
};

scene.end = function () {
  if (this.lives <= 0) {
    this.scene.restart();
  } else {
    this.create();
  }
};
