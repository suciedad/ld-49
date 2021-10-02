import { Scene, Math } from 'phaser';
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

    this.sequence = generateArrowSequence(5);
    this.enteredSequence = [];
  }

  preload() {}

  isEnteredValid() {
    return this.enteredSequence.every(
      (arrow, index) => arrow === this.sequence[index],
    );
  }

  create() {
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

    upKey.on(DOWN, () => {
      this.enteredSequence.push(ARROW.UP);
      console.log(this.enteredSequence);
      console.log(this.isEnteredValid());
    });
    downKey.on(DOWN, () => {
      this.enteredSequence.push(ARROW.DOWN);
      console.log(this.enteredSequence);
      console.log(this.isEnteredValid());
    });
    leftKey.on(DOWN, () => {
      this.enteredSequence.push(ARROW.LEFT);
      console.log(this.enteredSequence);
      console.log(this.isEnteredValid());
    });
    rightKey.on(DOWN, () => {
      this.enteredSequence.push(ARROW.RIGHT);
      console.log(this.enteredSequence);
      console.log(this.isEnteredValid());
    });

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
