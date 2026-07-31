import './styles/style.scss';

import { setupEndScreen } from './screens/end-screen';
import { setupGameScreen } from './screens/game-screen';
import { setupHomeScreen } from './screens/home-screen';
import { setupStartScreen } from './screens/start-screen';
import { setupWinnerScreen } from './screens/winner-screen';
import { getElementById } from './ui/dom';

/** Starts the app and connects all screens. */
function init(): void {
  const startScreen = getElementById('start-screen');
  const homeScreen = getElementById('home-screen');
  const gameScreen = getElementById('game-screen');
  const gameOverScreen = getElementById('game-over-screen');
  const winnerScreen = getElementById('winner-screen');

  setupStartScreen(startScreen, homeScreen);
  setupHomeScreen(homeScreen);
  setupEndScreen(gameOverScreen, gameScreen, homeScreen, startScreen);
  setupWinnerScreen(winnerScreen, gameOverScreen, gameScreen, homeScreen);
  setupGameScreen(gameScreen, homeScreen, startScreen);
}

init();
