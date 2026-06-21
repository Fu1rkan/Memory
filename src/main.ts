import './styles/style.scss';
import { getElementById } from './dom';
import { setupGameScreen } from './game-screen';
import { setupHomeScreen } from './home-screen';
import { setupStartScreen } from './start-screen';

init();

function init() {
    const startScreen = getElementById('start-screen');
    const homeScreen = getElementById('home-screen');
    const gameScreen = getElementById('game-screen');

    setupStartScreen(startScreen, homeScreen);
    setupHomeScreen(homeScreen);
    setupGameScreen(gameScreen, homeScreen, startScreen);
}
