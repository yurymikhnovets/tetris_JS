import Game from './modules/game.js';
import View from './modules/view.js';
import Controller from './modules/controller.js';
import Sound from './modules/sound.js';

const root = document.getElementById('root');
const options = {
  width: 240,
  height: 320,
  rows: 20,
  colums: 10,
};

const sound = new Sound(root);
const game = new Game(sound);
const view = new View(root, options);
const controller = new Controller(game, view, sound);