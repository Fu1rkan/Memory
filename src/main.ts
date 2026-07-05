import './styles/style.scss';
import { getElementById } from './dom';
import { setupEndScreen } from './end-screen';
import { setupGameScreen } from './game-screen';
import { setupHomeScreen } from './home-screen';
import { setupStartScreen } from './start-screen';
import { setupWinnerScreen } from './winner-screen';

init();

function init() {
    const startScreen = getElementById('start-screen');
    const homeScreen = getElementById('home-screen');
    const gameScreen = getElementById('game-screen');
    const gameOverScreen = getElementById('game-over-screen');
    const winnerScreen = getElementById('winner-screen');

    setupStartScreen(startScreen, homeScreen);
    setupHomeScreen(homeScreen);
    setupEndScreen(gameOverScreen, gameScreen, homeScreen, startScreen);
    setupWinnerScreen(winnerScreen, gameOverScreen, gameScreen, homeScreen, startScreen);
    setupGameScreen(gameScreen, homeScreen, startScreen);
}
