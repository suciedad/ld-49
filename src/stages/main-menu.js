import { Scene } from 'phaser';
import { APP_SIZE } from '../constants/app';
import { SCENE_KEY } from '../constants/scene-key';
import { MAIN } from '../locales/main';

const TEXT_STYLE = {
  fill: '#222',
  fontSize: '24px',
};

export class MainMenu extends Scene {
  constructor() {
    super({ key: SCENE_KEY.MAIN_MENU });

    this.buttons = {
      start: null,
      selectLevel: null,
      protocol: null,
    };

    this.logo = null;
  }

  preload() {}

  create() {
    this.add.sprite(APP_SIZE.WIDTH * 0.5, 250, 'logo');

    this.buttons.start = this.add
      .sprite(
        APP_SIZE.WIDTH * 0.5,
        APP_SIZE.HEIGHT * 0.5 + 120,
        'main-menu-button',
      )
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startClickHandler());

    // this.buttons.selectLevel = this.add
    //   .sprite(
    //     APP_SIZE.WIDTH * 0.5,
    //     APP_SIZE.HEIGHT * 0.5 + 120,
    //     'main-menu-button',
    //   )
    //   .setInteractive({ useHandCursor: true })
    //   .on('pointerdown', () => this.selectLevelHandler());

    const startText = this.add.text(
      0,
      APP_SIZE.HEIGHT * 0.5 + 103,
      MAIN.START_GAME,
      TEXT_STYLE,
    );
    // const selectText = this.add.text(
    //   0,
    //   APP_SIZE.HEIGHT * 0.5 + 103,
    //   MAIN.SELECT_LEVEL,
    //   TEXT_STYLE,
    // );

    startText.x = APP_SIZE.WIDTH * 0.5 - startText.width * 0.5;
    // selectText.x = APP_SIZE.WIDTH * 0.5 - selectText.width * 0.5;
  }

  startClickHandler() {
    this.scene.start(SCENE_KEY.LAB);
  }

  selectLevelHandler() {
    // this.scene.start(SCENE_KEY.LEVEL_SELECTION);
    // this.scene.start(SCENE_KEY.WIN);
  }
}
