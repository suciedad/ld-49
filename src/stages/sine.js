import { Scene, Math, Utils } from 'phaser';
import { APP_SIZE } from '../constants/app';
import { DOWN } from '../constants/keyboardEvents';
import { SCENE_KEY } from '../constants/scene-key';
import { ACCIDENT_EVENT } from '../constants/accidentEvents';
import { PROGRESS_STYLE } from '../constants/accidentTimerStyle';

import { ProgressBar } from '../components/progress-bar';

const SINE_PIXELS_COUNT = 79;
const SINE_AMP = 45;
const PIXEL_SIZE = 5;
const COS_AMP_CHANGE_SPEED = 1;
const FREQ_CHANGE_SPEED = 0.03;

export class Sine extends Scene {
  constructor() {
    super({ key: SCENE_KEY.SINE });

    this.useInput = true;

    this.blueSine = [];
    this.redSine = [];
    this.blueSinePixels = [];
    this.redSinePixels = [];

    this.redSineCosAmp = 100;
    this.redSineFreq = 4;

    this.passedEventSended = false;
  }

  preload() {}

  isSignalMatch() {
    const isCosAmpMatch = this.redSineCosAmp >= -10 && this.redSineCosAmp <= 10;
    const isFreqMatch = this.redSineFreq >= 5.7 && this.redSineFreq <= 6.3;

    return isCosAmpMatch && isFreqMatch;
  }

  create({ time }) {
    this.add.sprite(320, 320, 'sine-screen');

    const blueData = Math.SinCosTableGenerator(
      SINE_PIXELS_COUNT,
      SINE_AMP,
      1,
      6,
    );
    const redData = Math.SinCosTableGenerator(
      SINE_PIXELS_COUNT,
      SINE_AMP,
      this.redSineCosAmp,
      this.redSineFreq,
    );

    this.blueSine = blueData.sin;
    this.redSine = redData.sin;

    for (let i = 0; i < SINE_PIXELS_COUNT; i += 1) {
      this.blueSinePixels.push(
        this.add.sprite(
          PIXEL_SIZE * i + 125,
          300 + this.blueSine[i],
          'sine-pixel-blue',
        ),
      );
    }

    for (let i = 0; i < SINE_PIXELS_COUNT; i += 1) {
      this.redSinePixels.push(
        this.add.sprite(
          PIXEL_SIZE * i + 125,
          300 + this.redSine[i],
          'sine-pixel-red',
        ),
      );
    }

    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN,
    );
    this.leftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT,
    );
    this.rightKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    );

    // TIMER
    this.timer = this.time.addEvent({
      delay: time,
      loop: false,
      callback: () => {
        // this.spaceKey.off(DOWN, stopCircleHandler);
        // this.progressBar.destroy();
        this.events.emit(ACCIDENT_EVENT.FAILED);
      },
    });

    this.progressBar = new ProgressBar(
      this,
      APP_SIZE.WIDTH * 0.5 - APP_SIZE.WIDTH * 0.35 * 0.5,
      APP_SIZE.HEIGHT * 0.5 - 100,
      0,
      time / 1000,
      time / 1000,
      PROGRESS_STYLE,
    );
  }

  redrawRedSine() {
    const redData = Math.SinCosTableGenerator(
      SINE_PIXELS_COUNT,
      SINE_AMP,
      this.redSineCosAmp,
      this.redSineFreq,
    );

    this.redSine = redData.sin;
  }

  update() {
    const value = this.timer.getOverallRemainingSeconds();
    this.progressBar.setValue(value);

    Utils.Array.RotateLeft(this.blueSine);
    Utils.Array.RotateLeft(this.redSine);

    this.blueSinePixels.forEach((pixel, index) => {
      pixel.y = 300 + this.blueSine[index];
    });

    this.redSinePixels.forEach((pixel, index) => {
      pixel.y = 300 + this.redSine[index];
    });

    if (this.useInput) {
      if (this.upKey.isDown) {
        this.redSineCosAmp += COS_AMP_CHANGE_SPEED;
        this.redrawRedSine();
      }

      if (this.downKey.isDown) {
        this.redSineCosAmp -= COS_AMP_CHANGE_SPEED;
        this.redrawRedSine();
      }

      if (this.leftKey.isDown) {
        this.redSineFreq -= FREQ_CHANGE_SPEED;
        this.redrawRedSine();
      }

      if (this.rightKey.isDown) {
        this.redSineFreq += FREQ_CHANGE_SPEED;
        this.redrawRedSine();
      }
    }

    if (this.isSignalMatch()) {
      this.useInput = false;

      if (!this.passedEventSended) {
        this.passedEventSended = true;
        this.events.emit(ACCIDENT_EVENT.PASSED);
      }
    }
  }
}
