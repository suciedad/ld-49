import { Scene, Math } from 'phaser';
import { ACCIDENT_EVENT } from '../constants/accidentEvents';
import { APP_SIZE } from '../constants/app';
import { DOWN } from '../constants/keyboardEvents';
import { SCENE_KEY } from '../constants/scene-key';

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

  create() {
    this.sequence = generateArrowSequence(5);
    this.enteredSequence = [];

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

        this.events.emit(ACCIDENT_EVENT.PASSED);

        return;
      }

      if (!this.isEnteredValid()) {
        // setTimeout(() => {
        //   this.scene.restart();
        // }, 2000);

        upKey.off(DOWN, arrowKeyboardPushHandler);
        downKey.off(DOWN, arrowKeyboardPushHandler);
        leftKey.off(DOWN, arrowKeyboardPushHandler);
        rightKey.off(DOWN, arrowKeyboardPushHandler);

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
      this.add.text(
        50 + index * 30,
        APP_SIZE.HEIGHT * 0.5,
        arrowsViewMap[arrow],
        TEXT_STYLE,
      );
    });
  }

  update() {}
}
