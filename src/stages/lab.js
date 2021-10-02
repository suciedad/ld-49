import { Scene, Math } from 'phaser';

import { ACCIDENT_EVENT } from '../constants/accidentEvents';
import { APP_SIZE } from '../constants/app';
import { DOWN } from '../constants/keyboardEvents';
import { SCENE_KEY } from '../constants/scene-key';

import { Circle } from './circle';
import { Sine } from './sine';
import { ArrowSequence } from './arrowSequence';

const PLAYER_SPEED = 5;
const PLAYER_JUMP_VELOCITY = 350;
const PLAYER_STATUS = {
  WALKING: 'walking',
  SOLVING: 'solving',
};

const ZONE_SIZE = {
  WIDTH: 60,
  HEIGHT: 80,
};

const rollChance = (chance, multiplier = 1) =>
  Math.FloatBetween(0, 100 * multiplier) <= chance;

export class Lab extends Scene {
  constructor() {
    super({ key: SCENE_KEY.LAB });

    this.circleComp = null;
    this.sineComp = null;
    this.sequenceComp = null;

    this.player = null;
    this.playerStatus = PLAYER_STATUS.WALKING;

    this.isElectricityOn = true;

    // Chances to events, in percents
    this.chance = {
      electricityOff: 1,
      electricityTurnOn: 20,
    };
  }

  electricityTurnOn() {
    this.isElectricityOn = true;
  }

  electricityTurnOff() {
    this.isElectricityOn = false;
  }

  tryTurnOnElectricity() {
    const isSuccess = rollChance(this.chance.electricityTurnOn);

    isSuccess && this.electricityTurnOn();
  }

  stopSolving(scene) {
    scene.remove();
    this.playerStatus = PLAYER_STATUS.WALKING;
  }

  create() {
    // TIMER
    this.phaseTimer = this.time.addEvent({
      delay: 60000,
      loop: false,
    });

    this.phaseTimerText = this.add.text(50, 50);

    // SPRITES
    this.platforms = this.physics.add.staticGroup();
    this.floor = this.add.tileSprite(
      APP_SIZE.WIDTH * 0.5,
      380,
      APP_SIZE.WIDTH,
      40,
      'block-stone-sample',
    );
    this.platforms.add(this.floor);

    this.circleComp = this.add.sprite(
      200,
      APP_SIZE.HEIGHT * 0.5,
      'block-ice-sample',
    );
    this.sineComp = this.add.sprite(
      400,
      APP_SIZE.HEIGHT * 0.5,
      'block-ice-sample',
    );
    this.sequenceComp = this.add.sprite(
      600,
      APP_SIZE.HEIGHT * 0.5,
      'block-ice-sample',
    );
    this.electricitySwitcher = this.add
      .sprite(20, APP_SIZE.HEIGHT * 0.5 + 10, 'block-ice-sample')
      .setScale(0.5);

    this.sequenceCompBang = this.add.sprite(600, APP_SIZE.HEIGHT * 0.5, 'bang');

    this.circleCompX = this.add.sprite(
      200,
      APP_SIZE.HEIGHT * 0.5 - 50,
      'key-x',
    );
    this.sineCompX = this.add.sprite(400, APP_SIZE.HEIGHT * 0.5 - 50, 'key-x');
    this.sequenceCompX = this.add.sprite(
      600,
      APP_SIZE.HEIGHT * 0.5 - 50,
      'key-x',
    );
    this.electricitySwitcherX = this.add.sprite(
      20,
      APP_SIZE.HEIGHT * 0.5 - 35,
      'key-x',
    );

    this.player = this.physics.add.sprite(
      30,
      APP_SIZE.HEIGHT * 0.5,
      'yellow-player',
    );
    this.player.setCollideWorldBounds(true);

    // KEYBOARD
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
    this.xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    this.physics.add.collider(this.player, this.platforms);

    // ZONES
    this.electricitySwitcherZone = this.add.zone(20, 330).setSize(25, 25);
    this.circleCompZone = this.add
      .zone(200, 320)
      .setSize(ZONE_SIZE.WIDTH, ZONE_SIZE.HEIGHT);
    this.sineCompZone = this.add
      .zone(400, 320)
      .setSize(ZONE_SIZE.WIDTH, ZONE_SIZE.HEIGHT);
    this.sequenceCompZone = this.add
      .zone(600, 320)
      .setSize(ZONE_SIZE.WIDTH, ZONE_SIZE.HEIGHT);

    this.physics.world.enable([
      this.electricitySwitcherZone,
      this.circleCompZone,
      this.sineCompZone,
      this.sequenceCompZone,
    ]);

    this.electricitySwitcherZone.body.setAllowGravity(false);
    this.circleCompZone.body.setAllowGravity(false);
    this.sineCompZone.body.setAllowGravity(false);
    this.sequenceCompZone.body.setAllowGravity(false);
    this.electricitySwitcherZone.body.moves = false;
    this.circleCompZone.body.moves = false;
    this.sineCompZone.body.moves = false;
    this.sequenceCompZone.body.moves = false;

    this.physics.add.overlap(this.player, [
      this.electricitySwitcherZone,
      this.circleCompZone,
      this.sineCompZone,
      this.sequenceCompZone,
    ]);

    // KEYBOARD PROCESS
    this.xKey.on(DOWN, () => {
      if (this.playerStatus === PLAYER_STATUS.WALKING) {
        if (!this.circleCompZone.body.touching.none && this.isElectricityOn) {
          this.playerStatus = PLAYER_STATUS.SOLVING;

          const circleScene = this.scene.add(SCENE_KEY.CIRCLE, Circle, true, {
            x: 1000,
            y: 1000,
          });

          circleScene.events.on(ACCIDENT_EVENT.PASSED, () => {
            setTimeout(() => this.stopSolving(circleScene.scene), 500);
          });

          circleScene.events.on(ACCIDENT_EVENT.FAILED, () => {
            setTimeout(() => this.stopSolving(circleScene.scene), 500);
          });

          return;
        }

        if (!this.sineCompZone.body.touching.none && this.isElectricityOn) {
          this.playerStatus = PLAYER_STATUS.SOLVING;

          const sineScene = this.scene.add(SCENE_KEY.SINE, Sine, true, {
            x: 400,
            y: 300,
          });

          sineScene.events.on(ACCIDENT_EVENT.PASSED, () => {
            setTimeout(() => this.stopSolving(sineScene.scene), 500);
          });

          sineScene.events.on(ACCIDENT_EVENT.FAILED, () => {
            setTimeout(() => this.stopSolving(sineScene.scene), 500);
          });

          return;
        }

        if (!this.sequenceCompZone.body.touching.none && this.isElectricityOn) {
          this.playerStatus = PLAYER_STATUS.SOLVING;

          const sequenceScene = this.scene.add(
            SCENE_KEY.ARROW_SEQUENCE,
            ArrowSequence,
            true,
            {
              x: 400,
              y: 300,
            },
          );

          sequenceScene.events.on(ACCIDENT_EVENT.PASSED, () => {
            setTimeout(() => this.stopSolving(sequenceScene.scene), 500);
          });

          sequenceScene.events.on(ACCIDENT_EVENT.FAILED, () => {
            setTimeout(() => this.stopSolving(sequenceScene.scene), 500);
          });

          return;
        }

        if (
          !this.isElectricityOn &&
          !this.electricitySwitcherZone.body.touching.none
        ) {
          this.tryTurnOnElectricity();

          return;
        }
      }
    });
  }

  update() {
    if (this.leftKey.isDown && this.playerStatus === PLAYER_STATUS.WALKING) {
      this.player.x -= PLAYER_SPEED;
      this.player.flipX = true;
    }

    if (this.rightKey.isDown && this.playerStatus === PLAYER_STATUS.WALKING) {
      this.player.x += PLAYER_SPEED;
      this.player.flipX = false;
    }

    // TODO - сделать одиночным
    // FIXME - прыжки в зоне
    if (
      this.upKey.isDown &&
      this.player.body.touching.down &&
      this.playerStatus === PLAYER_STATUS.WALKING
    ) {
      this.player.setVelocityY(-PLAYER_JUMP_VELOCITY);
    }

    if (this.isElectricityOn && this.playerStatus === PLAYER_STATUS.WALKING) {
      if (rollChance(this.chance.electricityOff, 8)) {
        this.electricityTurnOff();
      }
    }

    this.electricitySwitcherZone.body.debugBodyColor = this
      .electricitySwitcherZone.body.touching.none
      ? 0x00ffff
      : 0xffff00;
    this.circleCompZone.body.debugBodyColor = this.circleCompZone.body.touching
      .none
      ? 0x00ffff
      : 0xffff00;
    this.sineCompZone.body.debugBodyColor = this.sineCompZone.body.touching.none
      ? 0x00ffff
      : 0xffff00;
    this.sequenceCompZone.body.debugBodyColor = this.sequenceCompZone.body
      .touching.none
      ? 0x00ffff
      : 0xffff00;

    if (this.electricitySwitcherZone.body.touching.none) {
      this.electricitySwitcherX.visible = false;
    } else {
      this.electricitySwitcherX.visible = true;
    }

    if (this.circleCompZone.body.touching.none) {
      this.circleCompX.visible = false;
    } else {
      this.circleCompX.visible = true;
    }

    if (this.sineCompZone.body.touching.none) {
      this.sineCompX.visible = false;
    } else {
      this.sineCompX.visible = true;
    }

    if (this.sequenceCompZone.body.touching.none) {
      this.sequenceCompX.visible = false;
    } else {
      this.sequenceCompX.visible = true;
    }

    this.phaseTimerText.setText(this.phaseTimer.getRemainingSeconds());
    if (this.isElectricityOn) {
      this.cameras.main.backgroundColor.setTo(0xf6cea1);
    } else {
      this.cameras.main.backgroundColor.setTo(0x000000);
    }
  }
}
