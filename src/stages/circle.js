import { Scene, Math } from 'phaser';
import { ACCIDENT_EVENT } from '../constants/accidentEvents';
import { PROGRESS_STYLE } from '../constants/accidentTimerStyle';
import { APP_SIZE } from '../constants/app';
import { DOWN } from '../constants/keyboardEvents';
import { SCENE_KEY } from '../constants/scene-key';

import { ProgressBar } from '../components/progress-bar';

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
  min: 0.02,
  max: 0.05,
};

const circlePassedDegRange = {
  min: -12,
  max: 12,
};

class MazeCircle {
  constructor(subject) {
    this.state = CIRCLE_STATE.ROTATING;
    this.subject = subject;
    this.direction = Math.FloatBetween(0, 1) < 0.5 ? 1 : -1;
    this.speed = Math.FloatBetween(speedRange.min, speedRange.max);

    const angle = Math.Between(degRange.min, degRange.max);

    // this.subject.setOrigin(0.5, 0);
    this.subject.setRotation(Math.DegToRad(angle));
  }

  setPassed() {
    this.state = CIRCLE_STATE.PASSED;
  }

  setFailed() {
    this.state = CIRCLE_STATE.FAILED;
  }
}

// TODO - Круги сделать больше, расстояние между ними больше, отрегулировать скорость
export class Circle extends Scene {
  constructor() {
    super({ key: SCENE_KEY.CIRCLE });

    this.circles = [];
    this.currentCircleIndex = 0;
    this.status = 'rotating';
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

  isAllCirclesPassed() {
    return this.circles.every(({ state }) => state === CIRCLE_STATE.PASSED);
  }

  isSomeCirclesFailed() {
    return this.circles.some(({ state }) => state === CIRCLE_STATE.FAILED);
  }

  create({ time }) {
    this.add.sprite(320, 320, 'sine-screen');

    this.currentCircleIndex = 0;
    this.status = 'rotating';

    const circle1 = new MazeCircle(
      this.add.sprite(APP_SIZE.WIDTH * 0.5, APP_SIZE.HEIGHT * 0.5, 'circle-1'),
    );
    const circle2 = new MazeCircle(
      this.add.sprite(APP_SIZE.WIDTH * 0.5, APP_SIZE.HEIGHT * 0.5, 'circle-2'),
    );
    const circle3 = new MazeCircle(
      this.add.sprite(APP_SIZE.WIDTH * 0.5, APP_SIZE.HEIGHT * 0.5, 'circle-3'),
    );

    this.circles = [circle1, circle2, circle3];

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X,
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
        this.spaceKey.off(DOWN, stopCircleHandler);
        // this.progressBar.destroy();
        this.events.emit(ACCIDENT_EVENT.PASSED);

        return;
      }

      if (this.isSomeCirclesFailed()) {
        this.spaceKey.off(DOWN, stopCircleHandler);
        // this.progressBar.destroy();
        this.events.emit(ACCIDENT_EVENT.FAILED);

        return;
      }

      this.currentCircleIndex += 1;
    };

    this.spaceKey.on(DOWN, stopCircleHandler);

    // TIMER
    this.timer = this.time.addEvent({
      delay: time,
      loop: false,
      callback: () => {
        this.status = 'stopped';
        this.spaceKey.off(DOWN, stopCircleHandler);
        // this.progressBar.destroy();
        this.events.emit(ACCIDENT_EVENT.FAILED);
      },
    });

    this.progressBar = new ProgressBar(
      this,
      APP_SIZE.WIDTH * 0.5 - APP_SIZE.WIDTH * 0.35 * 0.5,
      APP_SIZE.HEIGHT * 0.5 - 130,
      0,
      time / 1000,
      time / 1000,
      PROGRESS_STYLE,
    );

    this.add.sprite(
      APP_SIZE.WIDTH * 0.5,
      APP_SIZE.HEIGHT * 0.5 + 55,
      'synapse-connector',
    );
  }

  update() {
    const value = this.timer.getOverallRemainingSeconds();

    this.progressBar.setValue(value);

    if (this.status === 'rotating') {
      this.circles.forEach(({ state, subject, speed, direction }) => {
        if (state === CIRCLE_STATE.ROTATING) {
          subject.rotation += speed * direction;
        }
      });
    }
  }
}
