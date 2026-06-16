import './styles/style.scss';
import { setupHomeScreen } from './home-screen';

init();

function init() {
    const startScreen = getElementById('start-screen');
    const homeScreen = getElementById('home-screen');
    const gameScreen = getElementById('game-screen');
    showGameScreen(gameScreen, homeScreen);
    setupPlayButton(startScreen, homeScreen);
    setupStartButton(gameScreen, homeScreen);
    setupHomeScreen(homeScreen);
}

function setupPlayButton(startScreen: HTMLElement, homeScreen: HTMLElement) {
    startScreen.addEventListener('click', event => {
        const playButton = getClosestElement(event, '.start-screen__play-button');

        if (playButton) {
            showHomeScreen(startScreen, homeScreen);
        }
    });
}

function setupStartButton(gameScreen: HTMLElement, homeScreen: HTMLElement) {
    homeScreen.addEventListener('click', event => {
        const playButton = getClosestElement(event, '.home-screen__footer-button--start');

        if (playButton) {
            showGameScreen(gameScreen, homeScreen);
        }
    });
}

function showHomeScreen(startScreen: HTMLElement, homeScreen: HTMLElement) {
    startScreen.classList.add('d_none');
    homeScreen.classList.remove('d_none');
}

function showGameScreen(gameScreen: HTMLElement, homeScreen: HTMLElement) {
    //muss nachher entfernt werden
    getElementById('start-screen').classList.add('d_none');

    homeScreen.classList.add('d_none');
    gameScreen.classList.remove('d_none');
}

function getClosestElement(event: Event, selector: string) {
    const target = event.target;

    return target instanceof HTMLElement ? target.closest(selector) : null;
}

function getElementById(id: string) {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Element with id "${id}" was not found.`);
    }

    return element;
}
