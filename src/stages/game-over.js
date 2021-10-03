import { Scene } from 'phaser';
import { APP_SIZE } from '../constants/app';
import { SCENE_KEY } from '../constants/scene-key';
import { MAIN } from '../locales/main';

const TEXT_STYLE = {
  fill: '#ccc',
  fontSize: '48px',
};

const TEXT_STYLE_SMALL = {
  fill: '#ccc',
  fontSize: '32px',
};

const TEXT_STYLE_BUTTON = {
  fill: '#222',
  fontSize: '30px',
};

export class GameOver extends Scene {
  constructor() {
    super({ key: SCENE_KEY.GAME_OVER });
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

    const gameOverText = this.add.text(
      0,
      APP_SIZE.HEIGHT * 0.5 - 55 - 36,
      MAIN.GAME_OVER,
      TEXT_STYLE,
    );

    const labEquipmentText = this.add.text(
      0,
      APP_SIZE.HEIGHT * 0.5 - 150,
      MAIN.LAB_EQUIPMENT_BROKEN,
      TEXT_STYLE_SMALL,
    );

    const buttonText = this.add.text(
      0,
      APP_SIZE.HEIGHT * 0.5 + 15,
      MAIN.TO_MAIN_MENU,
      TEXT_STYLE_BUTTON,
    );

    gameOverText.x = APP_SIZE.WIDTH * 0.5 - gameOverText.width * 0.5;
    labEquipmentText.x = APP_SIZE.WIDTH * 0.5 - labEquipmentText.width * 0.5;
    buttonText.x = APP_SIZE.WIDTH * 0.5 - buttonText.width * 0.5;
  }

  toMainMenuClickHandler() {
    this.scene.start(SCENE_KEY.MAIN_MENU);
  }
}
