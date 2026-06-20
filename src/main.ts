import './styles/style.scss';
import { setupHomeScreen } from './home-screen';

const gameThemes = ['code-vibes', 'gaming', 'da-projects', 'foods'] as const;
type GameTheme = typeof gameThemes[number];

init();

function init() {
    const startScreen = getElementById('start-screen');
    const homeScreen = getElementById('home-screen');
    const gameScreen = getElementById('game-screen');
    // showGameScreen(gameScreen, homeScreen);
    setupPlayButton(startScreen, homeScreen);
    setupStartButton(gameScreen, homeScreen);
    setupExitButton(gameScreen, homeScreen);
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

function setupExitButton(gameScreen: HTMLElement, homeScreen: HTMLElement) {
    gameScreen.addEventListener('click', event => {
        const exitButton = getClosestElement(event, '.game-screen__exit-button');

        if (exitButton) {
            showHomeScreen(gameScreen, homeScreen);
        }
    });
}

function showHomeScreen(currentScreen: HTMLElement, homeScreen: HTMLElement) {
    currentScreen.classList.add('d_none');
    homeScreen.classList.remove('d_none');
}

function showGameScreen(gameScreen: HTMLElement, homeScreen: HTMLElement) {
    //muss nachher entfernt werden
    getElementById('start-screen').classList.add('d_none');

    applySelectedTheme(gameScreen, homeScreen);
    homeScreen.classList.add('d_none');
    gameScreen.classList.remove('d_none');
}

function applySelectedTheme(gameScreen: HTMLElement, homeScreen: HTMLElement) {
    gameScreen.dataset.theme = getSelectedTheme(homeScreen);
}

function getSelectedTheme(homeScreen: HTMLElement): GameTheme {
    const selectedTheme = homeScreen.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value;

    return isGameTheme(selectedTheme) ? selectedTheme : 'code-vibes';
}

function isGameTheme(value: string | undefined): value is GameTheme {
    return gameThemes.includes(value as GameTheme);
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
