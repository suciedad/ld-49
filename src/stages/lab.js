import { Scene, Math } from 'phaser';

import { ACCIDENT_EVENT } from '../constants/accidentEvents';
import { APP_SIZE } from '../constants/app';
import { DOWN } from '../constants/keyboardEvents';
import { SCENE_KEY } from '../constants/scene-key';
import { phases } from '../constants/phaseSettings';

import { Circle } from './circle';
import { Sine } from './sine';
import { ArrowSequence } from './arrowSequence';

const PLAYER_SPEED = 5;
const PLAYER_JUMP_VELOCITY = 350;
const PLAYER_STATUS = {
  WALKING: 'walking',
  SOLVING: 'solving',
};
const ACCIDENT_INTERVAL = 1000;

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
    this.isCircleOk = true;
    this.isSineOk = true;
    this.isSequenceOk = true;

    this.currentPhaseIndex = 0;

    // Chances to events, in percents
    this.chance = {
      electricityOff: this.currentPhaseSettings.electricityOff,
      electricityTurnOn: this.currentPhaseSettings.electricityTurnOn,
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

  repairCircle() {
    this.isCircleOk = true;
  }

  brokeCircle() {
    this.isCircleOk = false;
  }

  repairSine() {
    this.isSineOk = true;
  }

  brokeSine() {
    this.isSineOk = false;
  }

  repairSequence() {
    this.isSequenceOk = true;
  }

  brokeSequence() {
    this.isSequenceOk = false;
  }

  stopSolving(scene) {
    scene.remove();
    this.playerStatus = PLAYER_STATUS.WALKING;
  }

  startPhase() {
    this.laser.visible = true;

    this.accidentsInterval = setInterval(() => {
      if (this.isElectricityOn && this.playerStatus === PLAYER_STATUS.WALKING) {
        if (rollChance(this.currentPhaseSettings.electricityOff)) {
          this.electricityTurnOff();
        }
      }

      if (this.isCircleOk && this.playerStatus === PLAYER_STATUS.WALKING) {
        if (rollChance(this.currentPhaseSettings.circleAccident.chance)) {
          this.brokeCircle();
        }
      }

      if (this.isSineOk && this.playerStatus === PLAYER_STATUS.WALKING) {
        if (rollChance(this.currentPhaseSettings.sineAccident.chance)) {
          this.brokeSine();
        }
      }

      if (this.isSequenceOk && this.playerStatus === PLAYER_STATUS.WALKING) {
        if (rollChance(this.currentPhaseSettings.sequenceAccident.chance)) {
          this.brokeSequence();
        }
      }
    }, ACCIDENT_INTERVAL);

    // Последние 10 секунд без аварий, чтобы устранить уже возникнувшие
    setTimeout(() => {
      clearInterval(this.accidentsInterval);
    }, this.currentPhaseSettings.time - 10000);

    // TIMER
    this.phaseTimer = this.time.addEvent({
      delay: this.currentPhaseSettings.time,
      callback: () => this.stopPhase(),
      loop: false,
    });
  }

  stopPhase() {
    console.log(`Phase ${this.currentPhaseIndex + 1} completed!`);

    this.laser.visible = false;

    if (this.accidentsInterval) {
      clearInterval(this.accidentsInterval);
    }

    this.nextPhase();

    if (this.currentPhaseIndex < phases.length) {
      setTimeout(() => this.startPhase(), 3000);
    }
  }

  nextPhase() {
    this.currentPhaseIndex += 1;
  }

  get currentPhaseSettings() {
    return phases[this.currentPhaseIndex] || phases[this.currentPhaseIndex - 1];
  }

  create() {
    setTimeout(() => this.startPhase(), 3000);

    this.phaseTimerText = this.add.text(50, 50);

    // SPRITES
    this.platforms = this.physics.add.staticGroup();

    this.floor1 = this.add
      .tileSprite(APP_SIZE.WIDTH * 0.5, 560, APP_SIZE.WIDTH, 32 * 5, 'floor')
      .setTilePosition(0, 21);
    this.platforms.add(this.floor1);
    this.floor2 = this.add
      .tileSprite(APP_SIZE.WIDTH * 0.5, 440, APP_SIZE.WIDTH, 16 * 5, 'floor')
      .setTilePosition(0, 21);

    this.circleComp = this.add.sprite(APP_SIZE.WIDTH * 0.5, 200, 'crystal');

    // this.circleComp = this.add.sprite(
    //   200,
    //   APP_SIZE.HEIGHT * 0.5,
    //   'block-ice-sample',
    // );
    // this.sineComp = this.add.sprite(
    //   400,
    //   APP_SIZE.HEIGHT * 0.5,
    //   'block-ice-sample',
    // );
    // this.sequenceComp = this.add.sprite(
    //   600,
    //   APP_SIZE.HEIGHT * 0.5,
    //   'block-ice-sample',
    // );

    this.electricitySwitcher = this.add
      .sprite(20, APP_SIZE.HEIGHT * 0.5 + 10, 'block-ice-sample')
      .setScale(0.5);

    this.anims.create({
      key: 'ding',
      frames: this.anims.generateFrameNumbers('bang-animated', {
        frames: [0, 1],
      }),
      frameRate: 9,
      repeat: -1,
    });

    this.anims.create({
      key: 'work',
      frames: this.anims.generateFrameNumbers('comp-animated', {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'sineC',
      frames: this.anims.generateFrameNumbers('sine-animated', {
        frames: [0, 1, 2, 3, 4],
      }),
      frameRate: 9,
      repeat: -1,
    });

    this.anims.create({
      key: 'server',
      frames: this.anims.generateFrameNumbers('server-animated', {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'laser',
      frames: this.anims.generateFrameNumbers('laser-animated', {
        frames: [0, 1, 2],
      }),
      frameRate: 22,
      repeat: -1,
    });

    this.circleComp = this.add.sprite(200, 427).play('work');
    this.sineComp = this.add.sprite(350, 415).play('sineC');
    this.sequenceComp = this.add.sprite(560, 380).play('server');

    this.circleCompBang = this.add.sprite(200, 400).play('ding');
    this.sineCompBang = this.add.sprite(360, 400).play('ding');
    this.sequenceCompBang = this.add.sprite(560, 380).play('ding');

    this.laser = this.add.sprite(APP_SIZE.WIDTH * 0.5, -25).play('laser');
    this.laser.visible = false;

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

    this.player = this.physics.add.sprite(30, APP_SIZE.HEIGHT * 0.5, 'player');
    this.player.setCollideWorldBounds(true);

    this.electricityOffLayout = this.add.sprite(
      APP_SIZE.WIDTH * 0.5,
      APP_SIZE.HEIGHT * 0.5,
      'electricity-off-layout',
    );

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
    this.circleCompZone = this.add.zone(200, 430).setSize(90, 100);
    this.sineCompZone = this.add.zone(350, 415).setSize(120, 130);
    this.sequenceCompZone = this.add.zone(560, 380).setSize(160, 200);

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
            time: this.currentPhaseSettings.circleAccident.time,
          });

          circleScene.events.on(ACCIDENT_EVENT.PASSED, () => {
            setTimeout(() => {
              this.stopSolving(circleScene.scene);
              this.repairCircle();
            }, 500);
          });

          circleScene.events.on(ACCIDENT_EVENT.FAILED, () => {
            setTimeout(() => this.stopSolving(circleScene.scene), 500);
          });

          return;
        }

        if (!this.sineCompZone.body.touching.none && this.isElectricityOn) {
          this.playerStatus = PLAYER_STATUS.SOLVING;

          const sineScene = this.scene.add(SCENE_KEY.SINE, Sine, true);

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
              length: this.currentPhaseSettings.sequenceAccident.length,
              time: this.currentPhaseSettings.sequenceAccident.time,
            },
          );

          sequenceScene.events.on(ACCIDENT_EVENT.PASSED, () => {
            this.stopSolving(sequenceScene.scene);
            this.repairSequence();
            // setTimeout(() => {
            //   this.stopSolving(sequenceScene.scene);
            //   this.repairSequence();
            // }, 500);
          });

          sequenceScene.events.on(ACCIDENT_EVENT.FAILED, () => {
            this.stopSolving(sequenceScene.scene);
            // setTimeout(() => this.stopSolving(sequenceScene.scene), 500);
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

    // TODO - x кнопку показывать только когда сломалось
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

    if (this.isCircleOk) {
      this.circleCompBang.visible = false;
    } else {
      this.circleCompBang.visible = true;
    }

    if (this.isSineOk) {
      this.sineCompBang.visible = false;
    } else {
      this.sineCompBang.visible = true;
    }

    if (this.isSequenceOk) {
      this.sequenceCompBang.visible = false;
    } else {
      this.sequenceCompBang.visible = true;
    }

    if (this.phaseTimer) {
      this.phaseTimerText.setText(this.phaseTimer.getRemainingSeconds());
      if (this.isElectricityOn) {
        this.electricityOffLayout.visible = false;
      } else {
        this.electricityOffLayout.visible = true;
      }
    }
  }
}
