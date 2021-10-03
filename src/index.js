import { Game } from 'phaser';

import {
  APP_BACKGROUND_COLOR,
  APP_CONTAINER_ID,
  APP_SIZE,
} from './constants/app';
import { PHYSICS_ARCADE, PHYSICS_ARCADE_GRAVITY } from './constants/physics';

import { Loading } from './stages/loading';
import { MainMenu } from './stages/main-menu';
import { GameOver } from './stages/game-over';
import { Win } from './stages/win';
import { Circle } from './stages/circle';
import { ArrowSequence } from './stages/arrowSequence';
import { Sine } from './stages/sine';
import { Lab } from './stages/lab';

const GAME_SETTINGS = {
  width: APP_SIZE.WIDTH,
  height: APP_SIZE.HEIGHT,
  parent: APP_CONTAINER_ID,
  backgroundColor: APP_BACKGROUND_COLOR,
  scene: [Loading, MainMenu, Lab, GameOver, Win],
  physics: {
    default: PHYSICS_ARCADE,
    arcade: {
      gravity: { y: PHYSICS_ARCADE_GRAVITY },
      // debug: true,
    },
  },
};

new Game(GAME_SETTINGS);
