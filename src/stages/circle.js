import { Scene, Math } from 'phaser';
import { APP_SIZE } from '../constants/app';
import { SCENE_KEY } from '../constants/scene-key';

const CIRCLE_STATE = {
  ROTATING: 'rotating',
  PASSED: 'passed',
  FAILED: 'failed',
};

const degRange = {
  min: 0,
  max: 360,
};

const speedRange = {
  min: 0.03,
  max: 0.05,
};

const circlePassedDegRange = {
  min: -7.5,
  max: 7.5,
};

class MazeCircle {
  constructor(subject) {
    this.state = CIRCLE_STATE.ROTATING;
    this.subject = subject;
    this.direction = Math.FloatBetween(0, 1) < 0.5 ? 1 : -1;
    this.speed = Math.FloatBetween(speedRange.min, speedRange.max);

    const angle = Math.Between(degRange.min, degRange.max);

    this.subject.setOrigin(0.5, 0);
    this.subject.setRotation(Math.DegToRad(angle));
  }

  setPassed() {
    this.state = CIRCLE_STATE.PASSED;
  }

  setFailed() {
    this.state = CIRCLE_STATE.FAILED;
  }
}

export class Circle extends Scene {
  constructor() {
    super({ key: SCENE_KEY.CIRCLE });

    this.circles = [];
    this.currentCircleIndex = 0;
  }

  get currentCircle() {
    return this.circles[this.currentCircleIndex]
      ? this.circles[this.currentCircleIndex]
      : null;
  }

  get currentCircleSubject() {
    return this.circles[this.currentCircleIndex]
      ? this.circles[this.currentCircleIndex].subject
      : null;
  }

  preload() {}

  isAllCirclesPassed() {
    return this.circles.every(({ state }) => state === CIRCLE_STATE.PASSED);
  }

  isSomeCirclesFailed() {
    return this.circles.some(({ state }) => state === CIRCLE_STATE.FAILED);
  }

  create() {
    const circle1 = new MazeCircle(
      this.add.rectangle(320, 320, 30, 125, 0x154846),
    );
    const circle2 = new MazeCircle(
      this.add.rectangle(320, 320, 30, 95, 0x945784),
    );
    const circle3 = new MazeCircle(
      this.add.rectangle(320, 320, 30, 65, 0xf2c546),
    );

    this.circles = [circle1, circle2, circle3];

    const spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    const stopCircleHandler = (key, event) => {
      const angle = Math.RadToDeg(this.currentCircleSubject.rotation);

      if (
        angle >= circlePassedDegRange.min &&
        angle <= circlePassedDegRange.max
      ) {
        this.currentCircle.setPassed();
      } else {
        this.currentCircle.setFailed();
      }

      if (this.isAllCirclesPassed()) {
        console.log('CONGRATULATION');
        spaceKey.off('down', stopCircleHandler);

        return;
      }

      if (this.isSomeCirclesFailed()) {
        console.log('YOU FAILED');
        setTimeout(() => {
          this.scene.restart();
        }, 3000);
        spaceKey.off('down', stopCircleHandler);

        return;
      }

      this.currentCircleIndex += 1;
    };

    spaceKey.on('down', stopCircleHandler);

    // For test
    this.add.rectangle(320, 400, 5, 140, 0x00ff00);
    this.add.circle(320, 320, 3, 0xff0000);
  }

  update() {
    this.circles.forEach(({ state, subject, speed, direction }) => {
      if (state === CIRCLE_STATE.ROTATING) {
        subject.rotation += speed * direction;
      }
    });
  }
}
