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

function respawn() {

  shroom.setPosition(500, 195);
  shroom.setVisible(true);
}

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

const game = new Phaser.Game(config);

const resetScene = () => {
  player.x = 50;
  player.y = 195;
  respawn();

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
  this.load.image("ground", "./img/sprites/ground.png")
  this.load.image("shroom", "./img/sprites/shroom1.png");
  this.load.atlas("adventurer", "adventurer.png", "adventurer.json");
};

scene.create = function () {
  var bg = this.add.sprite(0, 0, "background");
  
  bg.setOrigin(0, 0);

  this.ground = this.add.sprite(320, 220, 'ground');

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
      start: 20,
      end: 25,
      zeroPad: 2,
    }),
    repeat: 0,
  });

  

  player = this.physics.add.sprite(50, 195, 'adventurer');
  player.play("idle");
  player.setScale(1.1);
  shroom = this.add.sprite(500, 195, "shroom");
  shroom.setScale(1.9);
};

scene.update = function () {
  shroom.Start = new Phaser.Math.Vector2(player.x, player.y);


  var isAttacking = false;

  if (player.x > this.sys.game.config.width) {
    resetScene();
  }

  const updateScore = (score, id) => {
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


  const playerAttack = (player, enemy) => {
    if (!isAttacking) {
      isAttacking = true;
      player.play("attack", true);
      if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), enemy.getBounds())) {
        enemy.destroy();
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);
        updateScore(this.score, 1);
        document.getElementById("score").innerHTML = this.score;
      }
    }
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
  if (cursors.space.isDown) {
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
