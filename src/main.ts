import './styles/style.scss';
import { setupHomeScreen } from './home-screen';

init();

function init() {
    const startScreen = getElementById('start-screen');
    const homeScreen = getElementById('home-screen');

    setupStartButton(startScreen, homeScreen);
    setupHomeScreen(homeScreen);
    // showHomeScreen(startScreen, homeScreen);
}

function setupStartButton(startScreen: HTMLElement, homeScreen: HTMLElement) {
    startScreen.addEventListener('click', event => {
        const playButton = getClosestElement(event, '.start-screen__play-button');

        if (playButton) {
            showHomeScreen(startScreen, homeScreen);
        }
    });
}

function showHomeScreen(startScreen: HTMLElement, homeScreen: HTMLElement) {
    startScreen.classList.add('d_none');
    homeScreen.classList.remove('d_none');
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
