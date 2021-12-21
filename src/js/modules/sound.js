export default class Sound {
    constructor(parentNode) {
      this.sounds = {
        'main': 'tetrisMain',
        'pause': 'pause',
        'rotate': 'blockRotate',
        'whoosh': 'whoosh',
        'fall': 'fall',
        'clear': 'clear',
        'gameover': 'gameover',
        'success': 'success'
      };
      this.parentNode = parentNode;
      const soundCol = Object.keys(this.sounds);
      soundCol.forEach(function (sound) {
        this.handleAudio(this.parentNode, this.sounds[sound]);
      }, this);
    }
    getSoundState() {
      const soundState = {};
      soundState.isSoundOn = Boolean(JSON.parse(localStorage.getItem('isSoundOn')));
      soundState.isMusicOn = Boolean(JSON.parse(localStorage.getItem('isMusicOn')));
      return soundState;
    }
    getSound() {
      const soundtrack = {};
      const sounds = document.querySelectorAll('audio');
      sounds.forEach((sound) => {
        const name = sound.getAttribute('id').substring(6);
        soundtrack[name] = sound;
      });
      return soundtrack;
    }
    handleAudio(parent, sound) {
      const audio = document.createElement('audio');
      audio.setAttribute('id', `audio-${ sound }`);
      if (sound.includes('Main')) {
        audio.setAttribute('loop', 'loop');
      }
      audio.setAttribute('preload', 'auto');
      const soundSrc = document.createElement('source');
      soundSrc.setAttribute('src', `./sounds/${ sound }.mp3`);
      audio.appendChild(soundSrc);
      parent.appendChild(audio);
    }
  }