import './styles/style.scss';
import { setupHomeScreen } from './home-screen';

const gameThemes = ['code-vibes', 'gaming', 'da-projects', 'foods'] as const;
type GameTheme = typeof gameThemes[number];
type ExitButtonImages = {
    default: string;
    hover: string;
};

const buttonImageFolder = `${import.meta.env.BASE_URL}img/buttons`;
const exitButtonImages: Record<GameTheme, ExitButtonImages> = {
    'code-vibes': {
        default: `${buttonImageFolder}/code_theme_exit_button.png`,
        hover: `${buttonImageFolder}/code_theme_exit_hover_button.png`,
    },
    gaming: {
        default: `${buttonImageFolder}/game_theme_exit_button.png`,
        hover: `${buttonImageFolder}/game_theme_exit_hover_button.png`,
    },
    'da-projects': {
        default: `${buttonImageFolder}/da_theme_exit_button.png`,
        hover: `${buttonImageFolder}/da_theme_exit_hover_button.png`,
    },
    foods: {
        default: `${buttonImageFolder}/food_theme_exit_hover_button.png`,
        hover: `${buttonImageFolder}/food_theme_exit_button.png`,
    },
};

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
    const selectedTheme = getSelectedTheme(homeScreen);

    gameScreen.dataset.theme = selectedTheme;
    updateExitButtonImages(gameScreen, selectedTheme);
}

function updateExitButtonImages(gameScreen: HTMLElement, selectedTheme: GameTheme) {
    const defaultImage = gameScreen.querySelector<HTMLImageElement>('.game-screen__exit-button-image--default');
    const hoverImage = gameScreen.querySelector<HTMLImageElement>('.game-screen__exit-button-image--hover');

    if (!defaultImage || !hoverImage) {
        throw new Error('Game screen exit button images were not found.');
    }

    defaultImage.src = exitButtonImages[selectedTheme].default;
    hoverImage.src = exitButtonImages[selectedTheme].hover;
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
