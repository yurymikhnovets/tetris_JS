export default class Game {
    constructor(sound) {
      this.sound = sound;
      this.gamePoints = {
        '1': 100,
        '2': 300,
        '3': 700,
        '4': 1500,
      };
      this.reset();
    }
    get gameLevel() {
      return Math.floor(this.lines * 0.1);
    }
    gameState() {
      const playField = this.createPlayField();
      const { x: pieceX, y: pieceY, blocks } = this.activeTetramino;
      for (let y = 0; y < this.playField.length; y += 1) {
        playField[y] = [];
        for (let x = 0; x < this.playField[y].length; x += 1) {
          playField[y][x] = this.playField[y][x];
        }
      }
      for (let y = 0; y < blocks.length; y += 1) {
        for (let x = 0; x < blocks[y].length; x += 1) {
          if (blocks[y][x]) {
            playField[pieceY + y][pieceX + x] = blocks[y][x];
          }
        }
      }
      return {
        gameLevel: this.gameLevel,
        lines: this.lines,
        score: this.score,
        hiscore: this.hiscore,
        nextTetramino: this.nextTetramino,
        playField,
        isGameOver: this.topOut,
        isSoundOn: this.sound.getSoundState().isSoundOn,
        isMusicOn: this.sound.getSoundState().isMusicOn,
      };
    }
    reset() {
      this.score = 0;
      this.hiscore = localStorage.getItem('hiscore') || 0;
      this.lines = 0;
      this.topOut = false;
      this.playField = this.createPlayField();
      this.activeTetramino = this.createTetramino();
      this.nextTetramino = this.createTetramino();
    }
    createPlayField(emptyBlock = 0) {
      const playField = [];
      for (let y = 0; y < 20; y += 1) {
        playField[y] = [];
        for (let x = 0; x < 10; x += 1) {
          playField[y][x] = emptyBlock;
        }
      }
      return playField;
    }
    createTetramino() {
      const index = Math.floor(Math.random() * 7);
      const types = 'IJLOSTZ';
      const type = types[index];
      const piece = {};
      switch (type) {
        case 'I':
          piece.blocks = [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ];
          break;
        case 'J':
          piece.blocks = [
            [0, 0, 0],
            [2, 2, 2],
            [0, 0, 2],
          ];
          break;
        case 'L':
          piece.blocks = [
            [0, 0, 0],
            [3, 3, 3],
            [3, 0, 0],
          ];
          break;
        case 'O':
          piece.blocks = [
            [0, 0, 0, 0],
            [0, 4, 4, 0],
            [0, 4, 4, 0],
            [0, 0, 0, 0]
          ];
          break;
        case 'S':
          piece.blocks = [
            [0, 0, 0],
            [0, 5, 5],
            [5, 5, 0],
          ];
          break;
        case 'T':
          piece.blocks = [
            [0, 0, 0],
            [6, 6, 6],
            [0, 6, 0],
          ];
          break;
        case 'Z':
          piece.blocks = [
            [0, 0, 0],
            [7, 7, 0],
            [0, 7, 7],
          ];
          break;
      }
      piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
      piece.y = -1;
      return piece;
    }
    moveLeft() {
      this.activeTetramino.x -= 1;
      if (this.collisionDetection()) {
        this.activeTetramino.x += 1;
      } else {
        this.playSound('whoosh');
      }
    }
    moveRight() {
      this.activeTetramino.x += 1;
      if (this.collisionDetection()) {
        this.activeTetramino.x -= 1;
      } else {
        this.playSound('whoosh');
      }
    }
    moveDown() {
      if (this.topOut) {
        return;
      }
      this.activeTetramino.y += 1;
      if (this.collisionDetection()) {
        this.activeTetramino.y -= 1;
        this.fixTetramino();
        const numOfClearedLines = this.clearLines();
        this.updateScore(numOfClearedLines);
        this.updateTetramino();
      }
      if (this.collisionDetection()) {
        this.topOut = true;
        this.pauseMusic();
        this.playSoundEndGame(this.gameState());
      }
    }
    rotate() {
      this.rotateTetramino();
      if (this.collisionDetection()) {
        this.rotateTetramino(false);
      }
    }
    rotateTetramino() {
      const blocks = this.activeTetramino.blocks;
        const length = blocks.length;
        const temp = [];
        for(let i = 0; i < length; i++) {
            temp[i] = new Array(length).fill(0);
        }
        for(let y = 0; y < length; y++) {
            for(let x = 0; x < length; x++) {
                temp[x][y] = blocks[length - 1 - y][x];
                this.playSound('blockRotate');
            }
        }
        this.activeTetramino.blocks = temp;
        if(this.collisionDetection()) {
            this.activeTetramino.blocks = blocks;
        }
    }
    collisionDetection() {
      const { x: pieceX, y: pieceY, blocks } = this.activeTetramino;
      for (let y = 0; y < blocks.length; y += 1) {
        for (let x = 0; x < blocks[y].length; x += 1) {
          if (
            blocks[y][x] &&
            ((this.playField[pieceY + y] === undefined ||
                this.playField[pieceY + y][pieceX + x] === undefined) ||
              this.playField[pieceY + y][pieceX + x])
          ) {
            return true;
          }
        }
      }
      return false;
    }
    fixTetramino() {
      const { x: pieceX, y: pieceY, blocks } = this.activeTetramino;
      for (let y = 0; y < blocks.length; y += 1) {
        for (let x = 0; x < blocks[y].length; x += 1) {
          if (blocks[y][x]) {
            this.playField[pieceY + y][pieceX + x] = blocks[y][x];
          }
        }
      }
      this.playSoundIndepended('fall');
    }
    clearLines() {
      const rows = 20;
      const colums = 10;
      let lines = [];
      for (let y = rows - 1; y >= 0; y -= 1) {
        let numberOfBlocks = 0;
        for (let x = 0; x < colums; x += 1) {
          if (this.playField[y][x]) {
            numberOfBlocks += 1;
          }
        }
        if (numberOfBlocks === 0) {
          break;
        } else if (numberOfBlocks < colums) {
          continue;
        } else if (numberOfBlocks === colums) {
          lines.unshift(y);
          this.playSoundIndepended('clear');
        }
      }
      for (let line of lines) {
        this.playField.splice(line, 1);
        this.playField.unshift(new Array(colums).fill(0));
      }
      return lines.length;
    }
    updateScore(clearedLines) {
      if (clearedLines > 0) {
        this.score += this.gamePoints[clearedLines] * (this.gameLevel + 1);
        this.lines += clearedLines;
      }
      if (this.score > this.hiscore) {
        localStorage.setItem('hiscore', this.score);
        this.hiscore = localStorage.getItem('hiscore');
      }
    }
    updateTetramino() {
      this.activeTetramino = this.nextTetramino;
      this.nextTetramino = this.createTetramino();
    }
    playMusic(music = true) {
      if (music) {
        this.sound.getSound().tetrisMain.play();
      }
    }
    pauseMusic(music = true) {
      if (music) {
        this.sound.getSound().tetrisMain.pause();
      }
    }
    playSound(sound) {
      if (this.sound.getSoundState().isSoundOn && !this.collisionDetection()) {
        this.sound.getSound()[sound].play();
      }
    }
    playSoundIndepended(sound) {
      if (this.sound.getSoundState().isSoundOn) {
        this.sound.getSound()[sound].play();
      }
    }
    playSoundEndGame({ score, hiscore }) {
      const { success, gameover } = this.sound.getSound();
      if (this.sound.getSoundState().isSoundOn && score == hiscore) {
        success.play();
      } else if (this.sound.getSoundState().isSoundOn && score != hiscore) {
        gameover.play();
      }
    }
  }