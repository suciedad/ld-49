import { Scene } from 'phaser';
import { APP_SIZE } from '../constants/app';
import { SCENE_KEY } from '../constants/scene-key';
import { MAIN } from '../locales/main';

const TEXT_STYLE = {
  fill: '#ccc',
  fontSize: '48px',
};

const TEXT_STYLE_BUTTON = {
  fill: '#222',
  fontSize: '30px',
};

export class Win extends Scene {
  constructor() {
    super({ key: SCENE_KEY.WIN });
  }

  create() {
    this.toMainMenu = this.add
      .sprite(
        APP_SIZE.WIDTH * 0.5,
        APP_SIZE.HEIGHT * 0.5 + 35,
        'main-menu-button',
      )
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.toMainMenuClickHandler());

    const winText1 = this.add.text(
      0,
      APP_SIZE.HEIGHT * 0.5 - 55 - 76,
      MAIN.WIN1,
      TEXT_STYLE,
    );

    const winText2 = this.add.text(
      0,
      APP_SIZE.HEIGHT * 0.5 - 70,
      MAIN.WIN2,
      TEXT_STYLE,
    );

    const buttonText = this.add.text(
      0,
      APP_SIZE.HEIGHT * 0.5 + 15,
      MAIN.TO_MAIN_MENU,
      TEXT_STYLE_BUTTON,
    );

    winText1.x = APP_SIZE.WIDTH * 0.5 - winText1.width * 0.5;
    winText2.x = APP_SIZE.WIDTH * 0.5 - winText2.width * 0.5;
    buttonText.x = APP_SIZE.WIDTH * 0.5 - buttonText.width * 0.5;
  }

  toMainMenuClickHandler() {
    this.scene.start(SCENE_KEY.MAIN_MENU);
  }
}
