/// <reference path="../typings/phaser.d.ts" />
import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import TitleScene from './scenes/Title';
import EndScene from './scenes/End';

new Phaser.Game(Object.assign(config, {
  scene: [TitleScene, GameScene, EndScene],
}));
