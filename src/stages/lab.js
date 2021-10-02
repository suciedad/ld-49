import { Scene, Math } from 'phaser';
import { APP_SIZE } from '../constants/app';
import { DOWN } from '../constants/keyboardEvents';
import { SCENE_KEY } from '../constants/scene-key';

const PLAYER_SPEED = 4;
const PLAYER_JUMP_VELOCITY = 350;

export class Lab extends Scene {
  constructor() {
    super({ key: SCENE_KEY.LAB });

    this.circleComp = null;
    this.sineComp = null;
    this.sequenceComp = null;

    this.player = null;
  }

  preload() {}

  create() {
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
      100,
      APP_SIZE.HEIGHT * 0.5,
      'block-ice-sample',
    );
    this.sineComp = this.add.sprite(
      300,
      APP_SIZE.HEIGHT * 0.5,
      'block-ice-sample',
    );
    this.sequenceComp = this.add.sprite(
      500,
      APP_SIZE.HEIGHT * 0.5,
      'block-ice-sample',
    );

    this.circleCompX = this.add.sprite(
      100,
      APP_SIZE.HEIGHT * 0.5 - 50,
      'key-x',
    );
    this.sineCompX = this.add.sprite(300, APP_SIZE.HEIGHT * 0.5 - 50, 'key-x');
    this.sequenceCompX = this.add.sprite(
      500,
      APP_SIZE.HEIGHT * 0.5 - 50,
      'key-x',
    );

    this.player = this.physics.add.sprite(
      30,
      APP_SIZE.HEIGHT * 0.5,
      'yellow-player',
    );
    this.player.setCollideWorldBounds(true);

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

    this.physics.add.collider(this.player, this.platforms);

    this.zone = this.add.zone(100, 320).setSize(60, 80);
    this.physics.world.enable(this.zone);
    this.zone.body.setAllowGravity(false);
    this.zone.body.moves = false;

    this.physics.add.overlap(this.player, this.zone);
  }

  update() {
    if (this.leftKey.isDown) {
      this.player.x -= PLAYER_SPEED;
      this.player.flipX = true;
    }

    if (this.rightKey.isDown) {
      this.player.x += PLAYER_SPEED;
      this.player.flipX = false;
    }

    // TODO - сделать одиночным
    if (this.upKey.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-PLAYER_JUMP_VELOCITY);
    }

    this.zone.body.debugBodyColor = this.zone.body.touching.none
      ? 0x00ffff
      : 0xffff00;

    if (this.zone.body.touching.none) {
      this.circleCompX.visible = false;
    } else {
      this.circleCompX.visible = true;
    }
  }
}
