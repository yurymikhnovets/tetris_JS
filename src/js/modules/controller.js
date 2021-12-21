export default class Controller {
    constructor(game, view, sound) {
      this.game = game;
      this.view = view;
      this.sound = sound;
      this.intervalId = null;
      this.isPlaying = false;
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
      document.addEventListener('keyup', this.handleKeyUp.bind(this));
      this.buttons = document.getElementsByTagName('button');
      document.addEventListener('click', this.handleClick.bind(this));
      this.view.renderStartGameScreen();
    }
    update() {
      this.game.moveDown();
      this.updateView();
    }
    updateView() {
      const state = this.game.gameState();
      if (state.isGameOver) {
        this.view.renderGameOverScreen(state);
      } else if (!this.isPlaying) {
        this.view.renderPauseGameScreen();
      } else {
        this.view.renderMainScreen(state);
      }
    }
    play() {
      this.isPlaying = true;
      this.startTimer();
      this.updateView();
    }
    pause() {
      this.isPlaying = false;
      this.game.playSoundIndepended('pause');
      this.stopTimer();
      this.updateView();
    }
    reset() {
      this.game.reset();
      this.game.playMusic(this.game.gameState().isMusicOn);
      this.play();
    }
    startTimer() {
      const speed = 1000 - this.game.gameState().gameLevel * 100;
      if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          this.update();
        }, speed > 0 ? speed : 100);
      }
    }
    stopTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
    handleKeyDown({ keyCode }) {
      const isGameOver = this.game.gameState();
      switch (keyCode) {
        case 37:
          if (this.isPlaying) {
            this.game.moveLeft();
            this.updateView();
          }
          break;
        case 38:
          if (this.isPlaying) {
            this.game.rotate();
            this.updateView();
          }
          break;
        case 39:
          if (this.isPlaying) {
            this.game.moveRight();
            this.updateView();
          }
          break;
        case 40:
          if (this.isPlaying) {
            this.stopTimer();
            this.game.moveDown();
            this.updateView();
          }
          break;
      }
    }
    handleKeyUp({ keyCode }) {
      switch (keyCode) {
        case 40:
          if (this.isPlaying) {
            this.startTimer();
          }
          break;
      }
    }
    handleClick({ target }) {
      const { isSoundOn,isMusicOn,isGameOver } = this.game.gameState();
      const keyId = target.getAttribute('id');
      switch (keyId) {
        case 'keyStart':
          if (isGameOver) {
            this.game.playMusic(isMusicOn);
            this.reset();
          } else if (this.isPlaying) {
            this.game.pauseMusic(isMusicOn);
            this.pause();
          } else {
            this.game.playMusic(isMusicOn);
            this.play();
          }
          break;
        case 'keyMusic':
          if (this.isPlaying && isMusicOn) {
            localStorage.setItem('isMusicOn', false);
            this.game.pauseMusic();
          } else if (this.isPlaying) {
            localStorage.setItem('isMusicOn', true);
            this.game.playMusic();
          }
          break;
        case 'keySound':
          if (this.isPlaying && isSoundOn) {
            localStorage.setItem('isSoundOn', false);
          } else if (this.isPlaying) {
            localStorage.setItem('isSoundOn', true);
          }
          break;
        case 'keyLeft':
          if (this.isPlaying) {
            this.game.moveLeft();
            this.updateView();
          }
          break;
        case 'keyUp':
          if (this.isPlaying) {
            this.game.rotate();
            this.updateView();
          }
          break;
        case 'keyRotate':
          if (this.isPlaying) {
            this.game.rotate();
            this.updateView();
          }
          break;
        case 'keyRight':
          if (this.isPlaying) {
            this.game.moveRight();
            this.updateView();
          }
          break;
        case 'keyDown':
          if (this.isPlaying) {
            this.game.moveDown();
            this.updateView();
          }
          break;
      }
    }
  }