import { Game } from 'phaser';

import {
  APP_BACKGROUND_COLOR,
  APP_CONTAINER_ID,
  APP_SIZE,
} from './constants/app';

import { Loading } from './stages/loading';
import { MainMenu } from './stages/main-menu';
import { Circle } from './stages/circle';
import { ArrowSequence } from './stages/arrowSequence';
import { Sine } from './stages/sine';

const GAME_SETTINGS = {
  width: APP_SIZE.WIDTH,
  height: APP_SIZE.HEIGHT,
  parent: APP_CONTAINER_ID,
  backgroundColor: APP_BACKGROUND_COLOR,
  scene: [Loading, MainMenu, Circle, ArrowSequence, Sine],
  physics: {
    default: 'arcade',
  },
};

new Game(GAME_SETTINGS);
