import { Scene, Math, ArrayUtils, Utils } from 'phaser';
import { APP_SIZE } from '../constants/app';
import { DOWN } from '../constants/keyboardEvents';
import { SCENE_KEY } from '../constants/scene-key';

const SINE_PIXELS_COUNT = 128;
const SINE_AMP = 70;
const PIXEL_SIZE = 5;

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
  }

  preload() {}

  isSignalMatch() {
    const isCosAmpMatch = this.redSineCosAmp >= -10 && this.redSineCosAmp <= 10;
    const isFreqMatch = this.redSineFreq >= 5.7 && this.redSineFreq <= 6.3;
    // console.log(
    //   `isCosAmpMatch: ${isCosAmpMatch}; isFreqMatch: ${isFreqMatch}; `,
    // );

    return isCosAmpMatch && isFreqMatch;
  }

  create() {
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
    console.log(redData);

    this.blueSine = blueData.sin;
    this.redSine = redData.sin;

    for (let i = 0; i < SINE_PIXELS_COUNT; i += 1) {
      this.blueSinePixels.push(
        this.add.sprite(
          PIXEL_SIZE * i,
          300 + this.blueSine[i],
          'sine-pixel-blue',
        ),
      );
    }

    for (let i = 0; i < SINE_PIXELS_COUNT; i += 1) {
      this.redSinePixels.push(
        this.add.sprite(
          PIXEL_SIZE * i,
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
        this.redSineCosAmp += 0.5;
        this.redrawRedSine();
      }

      if (this.downKey.isDown) {
        this.redSineCosAmp -= 0.5;
        this.redrawRedSine();
      }

      if (this.leftKey.isDown) {
        this.redSineFreq -= 0.01;
        this.redrawRedSine();
      }

      if (this.rightKey.isDown) {
        this.redSineFreq += 0.01;
        this.redrawRedSine();
      }
    }

    if (this.isSignalMatch()) {
      this.useInput = false;
    }
  }
}
