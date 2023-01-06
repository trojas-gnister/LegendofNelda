const background = new Image()
background.src = '../../assets/img/sprites/map.png'




export default class PlayScene extends Phaser.Scene {
    constructor() {
      super('PlayScene');
    }
  
    preload() {
      this.load.image('background', background);
      // this.load.image('ship', './assets/img/spaceship.png');
      // this.load.image('asteroid', './assets/img/asteroid.png');
    }
  
    create() {
      this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.6);
      this.add.image(0, 400, 'background').setOrigin(0, 0).setScale(0.6);
  
      // this.ship = this.physics.add.image(400, 300, 'ship').setScale(0.1);
  
      // this.asteroid = this.physics.add.image(225, 550, 'asteroid').setScale(0.03);
      // this.asteroid1 = this.physics.add.image(225, 250, 'asteroid').setScale(0.03);
      // this.asteroid2 = this.physics.add.image(525, 250, 'asteroid').setScale(0.03);
   }
    update() {
  
    }
  }