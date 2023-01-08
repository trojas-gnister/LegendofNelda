var scene = new Phaser.Scene("game");

const config = {
  width: 680,
  height: 430,
  type: Phaser.AUTO,
  scene : scene,
  parent: 'gameCanvas',
  audio: {
    disableWebAudio: true
  },
};
 
const game = new Phaser.Game(config)

scene.init = function() {
	this.score = 0;
	this.lives = 3;
	this.speed= 1.5;
    this.shroom_move = 1;
	this.score_text;
	this.lives_text;
};

scene.preload = function() {
	this.load.image('background', './assets/img/sprites/map.png');
	this.load.image('player', './assets/img/sprites/adventurer-idle.png');
	this.load.image('shroom', './assets/img/sprites/shroom.png');
};

scene.create = function() {
   var bg = this.add.sprite(0, 0, 'background');
   bg.setOrigin(0,0);

   this.scoreText = this.add.text(100, 16, 'score: '+this.score, { fontSize: '32px', fill: '#000' });
   this.liveText = this.add.text(16, this.sys.game.config.height-50, 'Lives: ' + this.lives, {fontSize: '32px', fill: '#000'});

   this.player = this.add.sprite(110, 210, 'player');
   this.player.setScale(2.9);


   this.shroom = this.add.sprite(350, 235, 'shroom');
   this.shroom.setScale(2.1);
};




scene.update = function() {
  var cursors = this.input.keyboard.createCursorKeys();
  if (cursors.right.isDown) {
    this.player.x += this.speed;
  }

  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.shroom.getBounds())) {
    this.lives--;
  	this.liveText.setText("Lives: " + this.lives);
  	this.end();
  }

};


scene.end = function() {
	if(this.lives <= 0) {
		this.scene.restart();
	} else {
		this.create();
	}
};