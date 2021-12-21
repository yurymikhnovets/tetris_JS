export default class View {
    constructor(element, { width, height, rows, colums }, sound) {
      this.element = element;
      this.sound = sound;
      this.width = width;
      this.height = height;
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx = this.canvas.getContext('2d');
      this.playFieldBorderWidth = 2;
      this.playFieldX = this.playFieldBorderWidth;
      this.playFieldY = this.playFieldBorderWidth;
      this.playFieldWidth = this.width * 2 / 3;
      this.playFieldHeight = this.height;
      this.playFieldInnerWidth = this.playFieldWidth - this.playFieldBorderWidth * 2;
      this.playFieldInnerHeight = this.playFieldHeight - this.playFieldBorderWidth * 2;
      this.blockWidth = this.playFieldInnerWidth / colums;
      this.blockHeight = this.playFieldInnerHeight / rows;
      this.panelX = this.playFieldWidth + 5;
      this.panelY = 0;
      this.panelWidth = this.width / 3;
      this.panelHeight = this.height;
      this.blockColor = 'black';
      this.element.appendChild(this.canvas);
    }
    renderMainScreen(state) {
      this.clearScreen();
      this.renderPlayField(state);
      this.renderSidePanel(state);
    }
    renderStartGameScreen() {
      this.ctx.fillStyle = 'black';
      this.ctx.font = '34px Technology';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('Press "Start"', this.width / 2, this.height / 2 - 18);
      this.ctx.fillText('to Play', this.width / 2, this.height / 2 + 18);
    }
    renderPauseGameScreen() {
      this.ctx.fillStyle = 'black';
      this.ctx.font = '20px Technology';
      this.ctx.fillText(`Pause`, this.panelX, this.panelY + 211);
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
    }
    renderGameOverScreen({ score,hiscore }) {
      this.clearScreen();
      this.ctx.fillStyle = 'black';
      this.ctx.font = '34px Technology';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      if (score == hiscore && hiscore != 0) {
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 36);
        this.ctx.fillText(`New hi-score`, this.width / 2, this.height / 2);
        this.ctx.fillText(`${hiscore}`, this.width / 2, this.height / 2 + 36);
      } else {
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 18);
        this.ctx.fillText(`Score:${score}`, this.width / 2, this.height / 2 + 18);
      }
    }
    clearScreen() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    renderPlayField({ playField }) {
      for (let y = 0; y < playField.length; y += 1) {
        const line = playField[y];
        for (let x = 0; x < line.length; x += 1) {
          const block = line[x];
          if (block) {
            this.renderBlock(
              this.playFieldX + (x * this.blockWidth),
              this.playFieldY + (y * this.blockHeight),
              this.blockWidth,
              this.blockHeight,
              this.blockColor
            );
          }
        }
      }
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = this.playFieldBorderWidth;
      this.ctx.strokeRect(0, 0, this.playFieldWidth, this.playFieldHeight);
    }
    renderSidePanel({ gameLevel, score, hiscore, nextTetramino, isSoundOn, isMusicOn }) {
      this.ctx.textAlign = 'start';
      this.ctx.textBaseline = 'top';
      this.ctx.fillStyle = 'black';
      this.ctx.font = '20px Technology';
      this.ctx.fillText(`Score`, this.panelX, this.panelY + 5);
      this.ctx.fillText(`${score}`, this.panelX, this.panelY + 25);
      this.ctx.fillText(`Hi-score`, this.panelX, this.panelY + 45);
      this.ctx.fillText(`${hiscore}`, this.panelX, this.panelY + 65);
      this.ctx.fillText(`Level`, this.panelX, this.panelY + 85);
      this.ctx.fillText(`${gameLevel}`, this.panelX, this.panelY + 105);
      this.ctx.font = '18px Technology';
      if (isMusicOn) {
        this.ctx.fillText(`Music On`, this.panelX, this.panelY + 280);
      } else {
        this.ctx.fillText(`Music Off`, this.panelX, this.panelY + 280);
      }
      if (isSoundOn) {
        this.ctx.fillText(`Sound On`, this.panelX, this.panelY + 300);
      } else {
        this.ctx.fillText(`Sound Off`, this.panelX, this.panelY + 300);
      }
      for (let y = 0; y < nextTetramino.blocks.length; y += 1) {
        for (let x = 0; x < nextTetramino.blocks[y].length; x += 1) {
          const block = nextTetramino.blocks[y][x];
          if (block) {
            this.renderBlock(
              this.panelX + (x * this.blockWidth),
              this.panelY + 110 + (y * this.blockHeight),
              this.blockWidth,
              this.blockHeight,
              this.blockColor
            );
          }
        }
      }
    }
    renderBlock(x, y, width, height, blockColor) {
      this.ctx.fillStyle = blockColor;
      this.ctx.strokeStyle = 'grey';
      this.ctx.lineWidth = 1;
      this.ctx.fillRect(x, y, width, height);
      this.ctx.strokeRect(x, y, width, height);
    }
  }