import { Scene, Math } from 'phaser';
import { ACCIDENT_EVENT } from '../constants/accidentEvents';
import { APP_SIZE } from '../constants/app';
import { DOWN } from '../constants/keyboardEvents';
import { SCENE_KEY } from '../constants/scene-key';
import { PROGRESS_STYLE } from '../constants/accidentTimerStyle';

import { ProgressBar } from '../components/progress-bar';

const TEXT_STYLE = {
  fill: '#fff',
  fontSize: '24px',
};

const ARROW = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

const arrowsMap = [ARROW.UP, ARROW.DOWN, ARROW.LEFT, ARROW.RIGHT];

const arrowsViewMap = {
  up: '▲',
  down: '▼',
  left: '◀',
  right: '▶',
};

const arrowsSpriteMap = {
  up: 'arrow-up',
  down: 'arrow-down',
  left: 'arrow-left',
  right: 'arrow-right',
};

const arrowsPressedSpriteMap = {
  up: 'arrow-up-pressed',
  down: 'arrow-down-pressed',
  left: 'arrow-left-pressed',
  right: 'arrow-right-pressed',
};

const getRandomArrow = () => arrowsMap[Math.Between(0, 3)];

const generateArrowSequence = (length) => {
  let result = [];

  for (let index = 0; index < length; index += 1) {
    result.push(getRandomArrow());
  }

  return result;
};

export class ArrowSequence extends Scene {
  constructor() {
    super({ key: SCENE_KEY.ARROW_SEQUENCE });

    this.sequence = [];
    this.enteredSequence = [];
    this.arrowKeys = [];
  }

  preload() {}

  isEnteredValid() {
    return this.enteredSequence.every(
      (arrow, index) => arrow === this.sequence[index],
    );
  }

  isAllArowsEntered() {
    return this.enteredSequence.length === this.sequence.length;
  }

  create({ length, time }) {
    this.sequence = generateArrowSequence(length);
    this.enteredSequence = [];
    this.arrowKeys = [];

    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const downKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN,
    );
    const leftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT,
    );
    const rightKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    );

    const arrowKeyboardPushHandler = (key, event) => {
      let keyCode = '';

      switch (event.code) {
        case 'ArrowUp':
          keyCode = ARROW.UP;
          break;

        case 'ArrowDown':
          keyCode = ARROW.DOWN;
          break;

        case 'ArrowLeft':
          keyCode = ARROW.LEFT;
          break;

        case 'ArrowRight':
          keyCode = ARROW.RIGHT;
          break;
      }

      this.enteredSequence.push(keyCode);

      if (this.isAllArowsEntered() && this.isEnteredValid()) {
        upKey.off(DOWN, arrowKeyboardPushHandler);
        downKey.off(DOWN, arrowKeyboardPushHandler);
        leftKey.off(DOWN, arrowKeyboardPushHandler);
        rightKey.off(DOWN, arrowKeyboardPushHandler);

        this.progressBar.destroy();

        this.events.emit(ACCIDENT_EVENT.PASSED);

        return;
      }

      if (!this.isEnteredValid()) {
        upKey.off(DOWN, arrowKeyboardPushHandler);
        downKey.off(DOWN, arrowKeyboardPushHandler);
        leftKey.off(DOWN, arrowKeyboardPushHandler);
        rightKey.off(DOWN, arrowKeyboardPushHandler);

        this.progressBar.destroy();

        this.events.emit(ACCIDENT_EVENT.FAILED);

        return;
      }
    };

    upKey.on(DOWN, arrowKeyboardPushHandler);
    downKey.on(DOWN, arrowKeyboardPushHandler);
    leftKey.on(DOWN, arrowKeyboardPushHandler);
    rightKey.on(DOWN, arrowKeyboardPushHandler);

    // ▲▼◀▶
    this.sequence.forEach((arrow, index) => {
      this.arrowKeys.push(
        this.add.sprite(
          50 + index * 70,
          APP_SIZE.HEIGHT * 0.5,
          arrowsSpriteMap[arrow],
        ),
      );
    });

    // TIMER
    this.timer = this.time.addEvent({
      delay: time,
      loop: false,
      callback: () => {
        upKey.off(DOWN, arrowKeyboardPushHandler);
        downKey.off(DOWN, arrowKeyboardPushHandler);
        leftKey.off(DOWN, arrowKeyboardPushHandler);
        rightKey.off(DOWN, arrowKeyboardPushHandler);

        this.progressBar.destroy();

        this.events.emit(ACCIDENT_EVENT.FAILED);
      },
    });

    this.progressBar = new ProgressBar(
      this,
      APP_SIZE.WIDTH * 0.5 - APP_SIZE.WIDTH * 0.35 * 0.5,
      APP_SIZE.HEIGHT * 0.5 + 25 - 35,
      0,
      time / 1000,
      time / 1000,
      PROGRESS_STYLE,
    );
  }

  update() {
    const value = this.timer.getOverallRemainingSeconds();

    this.progressBar.setValue(value);

    // this.sequence.forEach((arrow, index) => {
    //   this.arrowKeys = this.add.sprite(
    //     50 + index * 70,
    //     APP_SIZE.HEIGHT * 0.5,
    //     arrowsSpriteMap[arrow],
    //   );
    // });

    this.enteredSequence.forEach((arrow, index) => {
      // this.arrowKeys[index] = this.add.sprite(
      //   50 + index * 70,
      //   APP_SIZE.HEIGHT * 0.5,
      //   arrowsPressedSpriteMap[arrow],
      // );
      this.arrowKeys[index].setTexture(arrowsPressedSpriteMap[arrow]);
    });
  }
}
