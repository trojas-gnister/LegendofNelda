var scene = new Phaser.Scene("game");
var player;

const updateDatabase = (score, id) => {
  var updatedGame = {
    score: score,
  };
  $.ajax({
    method: "PUT",
    url: "/game/" + id,
    data: updatedGame,
  })
    .then((data) => {
      location.assign("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

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

scene.init = function () {
  if (localStorage.getItem("score") === null) {
    localStorage.setItem("score", 0);
    this.score = 0;
  } else {
    this.score = localStorage.getItem("score");
  }
  document.getElementById("score").innerHTML = this.score;
  this.lives = 3;
  document.getElementById("lives").innerHTML = this.lives;
  this.speed = 1.5;
  this.shroom_move = 1;
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
      end: 5,
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
      start: 0,
      end: 5,
      zeroPad: 1,
    }),
    repeat: 0,
  });

  player = this.add.sprite(50, 238, "adventurer");

  player.play("idle");

  this.shroom = this.add.sprite(500, 250, "shroom");
  this.shroom.setScale(3.3);
};

scene.update = function () {
  var cursors = this.input.keyboard.createCursorKeys();
  if (cursors.right.isDown) {
    player.x += this.speed;
    player.play("run", true);
  }
  if (cursors.up.isDown) {
    player.play("attack", true);
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        player.getBounds(),
        this.shroom.getBounds()
      )
    ) {
      this.shroom.x -= 300;
      this.shroom.destroy();
      this.score++;
      localStorage.setItem("score", this.score);
      this.scoreText.setText("Score: " + this.score);
      document.getElementById("score").innerHTML = this.score;
    }
  }
};

scene.end = function () {
  if (this.lives <= 0) {
    this.scene.restart();
  } else {
    this.create();
  }
};
