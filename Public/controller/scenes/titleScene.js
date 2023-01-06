
const background = new Image()
background.src = '../../assets/img/sprites/map.png'

class titleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  preload() {
    this.load.image('background', background);
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.6);
  }
}

export default titleScene;
