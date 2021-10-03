import { Scene } from 'phaser';

import { APP_SIZE } from '../constants/app';
import { SCENE_KEY } from '../constants/scene-key';

import { MAIN } from '../locales/main';

import player from '../assets/player.png';
import redPlayer from '../assets/red-player.png';
import greenPlayer from '../assets/green-player.png';
import bluePlayer from '../assets/blue-player.png';
import yellowPlayer from '../assets/yellow-player.png';
import mainMenuButton from '../assets/main-menu-button-2.png';
import sinePixelBlue from '../assets/sine-pixel-blue.png';
import sinePixelRed from '../assets/sine-pixel-red.png';
import crystal from '../assets/crystal.png';
import warningLine from '../assets/warning-line.png';
import sineScreen from '../assets/sine-screen.png';

import circle1 from '../assets/circle-1.png';
import circle2 from '../assets/circle-2.png';
import circle3 from '../assets/circle-3.png';
import ring1 from '../assets/ring-1.png';
import ring2 from '../assets/ring-2.png';
import ring3 from '../assets/ring-3.png';
import ring1Passed from '../assets/ring-1-passed.png';
import ring2Passed from '../assets/ring-2-passed.png';
import ring3Passed from '../assets/ring-3-passed.png';
import synapseConnector from '../assets/synapse-connector.png';

import arrowUp from '../assets/arrow-up.png';
import arrowDown from '../assets/arrow-down.png';
import arrowLeft from '../assets/arrow-left.png';
import arrowRight from '../assets/arrow-right.png';
import arrowUpPressed from '../assets/arrow-up-pressed.png';
import arrowDownPressed from '../assets/arrow-down-pressed.png';
import arrowLeftPressed from '../assets/arrow-left-pressed.png';
import arrowRightPressed from '../assets/arrow-right-pressed.png';

import blockIceSample from '../assets/samples/block-ice-5x.png';
import blockStoneSample from '../assets/samples/block-stone-5x.png';
// import floor from '../assets/floor.png';
// import floor from '../assets/floor-dark.png';
import floor from '../assets/floor-white.png';
import electricityOffLayout from '../assets/electricity-off-layout.png';

import keyX from '../assets/key-x.png';
import bang from '../assets/bang.png';
import bangAnim from '../assets/bang-animated.png';
import compAnim from '../assets/comp-animated.png';
import serverAnim from '../assets/server-anim.png';
import sineAnim from '../assets/sine-anim.png';
// import laserAnim from '../assets/laser-anim.png';
import laserAnim from '../assets/laser-anim-2.png';
import plateAnim from '../assets/plate-anim.png';
import generatorAnim from '../assets/generator.png';

import { ProgressBar } from '../components/progress-bar';

const PROGRESS_STYLE = {
  bgColor: 0xbdbdbd,
  barColor: 0x3db7e3,
  width: APP_SIZE.WIDTH * 0.35,
  height: 30,
  padding: 3,
  borderRadius: 5,
};

export class Loading extends Scene {
  constructor() {
    super({ key: SCENE_KEY.LOADING });
  }

  preload() {
    const loadingText = this.add.text(0, 0, MAIN.LOADING, {
      fill: '#ccc',
      fontSize: '18px',
    });

    // Images
    this.load.image('player', player);
    this.load.image('red-player', redPlayer);
    this.load.image('green-player', greenPlayer);
    this.load.image('blue-player', bluePlayer);
    this.load.image('yellow-player', yellowPlayer);
    this.load.image('main-menu-button', mainMenuButton);
    this.load.image('sine-pixel-blue', sinePixelBlue);
    this.load.image('sine-pixel-red', sinePixelRed);
    this.load.image('electricity-off-layout', electricityOffLayout);
    this.load.image('crystal', crystal);
    this.load.image('warning-line', warningLine);
    this.load.image('sine-screen', sineScreen);

    this.load.image('arrow-up', arrowUp);
    this.load.image('arrow-down', arrowDown);
    this.load.image('arrow-left', arrowLeft);
    this.load.image('arrow-right', arrowRight);
    this.load.image('arrow-up-pressed', arrowUpPressed);
    this.load.image('arrow-down-pressed', arrowDownPressed);
    this.load.image('arrow-left-pressed', arrowLeftPressed);
    this.load.image('arrow-right-pressed', arrowRightPressed);

    // this.load.image('circle-1', circle1);
    // this.load.image('circle-2', circle2);
    // this.load.image('circle-3', circle3);
    this.load.image('circle-1', ring1);
    this.load.image('circle-2', ring2);
    this.load.image('circle-3', ring3);
    this.load.image('synapse-connector', synapseConnector);

    this.load.image('block-ice-sample', blockIceSample);
    this.load.image('block-stone-sample', blockStoneSample);
    this.load.image('floor', floor);

    // this.load.image('bang', bang);
    this.load.image('key-x', keyX);

    // Animations
    this.load.spritesheet('bang-animated', 'bang-animated.png', {
      frameWidth: 25,
      frameHeight: 45,
    });
    this.load.spritesheet('comp-animated', 'comp-animated.png', {
      frameWidth: 90,
      frameHeight: 105,
    });
    this.load.spritesheet('server-animated', 'server-anim.png', {
      frameWidth: 160,
      frameHeight: 200,
    });
    this.load.spritesheet('sine-animated', 'sine-anim.png', {
      frameWidth: 120,
      frameHeight: 130,
    });
    // this.load.spritesheet('laser-animated', 'laser-anim.png', {
    //   frameWidth: 35,
    //   frameHeight: 160,
    // });
    this.load.spritesheet('laser-animated', 'laser-anim-2.png', {
      frameWidth: 15,
      frameHeight: 320,
    });
    this.load.spritesheet('plate-animated', 'plate-anim.png', {
      frameWidth: 200,
      frameHeight: 105,
    });
    this.load.spritesheet('generator-animated', 'generator.png', {
      frameWidth: 85,
      frameHeight: 140,
    });

    const progressBar = new ProgressBar(
      this,
      APP_SIZE.WIDTH * 0.5 - APP_SIZE.WIDTH * 0.35 * 0.5,
      APP_SIZE.HEIGHT * 0.5 + 25 - 35,
      0,
      1,
      0,
      PROGRESS_STYLE,
    );

    loadingText.x = APP_SIZE.WIDTH * 0.5 - loadingText.width * 0.5;
    loadingText.y = APP_SIZE.HEIGHT * 0.5 - loadingText.height * 0.5 - 35;

    this.load.on('progress', (value) => progressBar.setValue(value));

    this.load.on('complete', () => {
      progressBar.destroy();

      this.scene.start(SCENE_KEY.MAIN_MENU);
      // this.scene.start(SCENE_KEY.CIRCLE);
      // this.scene.start(SCENE_KEY.ARROW_SEQUENCE);
      // this.scene.start(SCENE_KEY.SINE);
      // this.scene.start(SCENE_KEY.LAB);
    });
  }
}
