import Phaser from './phaser'

import PlayScene from './scenes/playScenes.js'
import TitleScene from './scenes/TitleScene.js'

const config = {
  width: 1000,
  height: 500,
  type: Phaser.AUTO,
  parent: 'gameCanvas',
  audio: {
    disableWebAudio: true
  },
  physics: {
    default: 'ninja',
    ninja: {
      fps: 60,
      gravity: {y : 0},
    }
  },
};

const game = new Phaser.Game(config)

game.scene.add('PlayScene', PlayScene)
game.scene.add('TitleScene', PreloadScene)