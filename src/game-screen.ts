import { getClosestElement, getDialogById } from './dom';
import { exitButtonVisuals, quitDialogButtonVisuals, type ButtonVisuals } from './button-visuals';
import { isGameTheme, type GameTheme } from './game-themes';
import { renderButtonVisuals } from './render-button-visuals';
import { setupPlayerStatus, updatePlayerStatusVisuals } from './player-status';
import { showScreen } from './screen-navigation';

export function setupGameScreen(gameScreen: HTMLElement, homeScreen: HTMLElement, startScreen: HTMLElement) {
    const quitGameDialog = getDialogById('quit-game-dialog');

    setupPlayerStatus(gameScreen);
    setupHomeStartButton(gameScreen, homeScreen, startScreen);
    setupQuitDialog(gameScreen, homeScreen, quitGameDialog);
    applySelectedTheme(gameScreen, homeScreen);
}

function setupHomeStartButton(gameScreen: HTMLElement, homeScreen: HTMLElement, startScreen: HTMLElement) {
    homeScreen.addEventListener('click', event => {
        const startButton = getClosestElement(event, '.home-screen__footer-button--start');

        if (startButton) {
            showGameScreen(gameScreen, homeScreen, startScreen);
        }
    });
}

function setupQuitDialog(gameScreen: HTMLElement, homeScreen: HTMLElement, quitGameDialog: HTMLDialogElement) {
    gameScreen.addEventListener('click', event => {
        const exitButton = getClosestElement(event, '.game-screen__exit-button');
        const backToGameButton = getClosestElement(event, '.game-screen__quit-dialog-button--back');
        const confirmExitButton = getClosestElement(event, '.game-screen__quit-dialog-button--exit');

        if (exitButton) {
            showQuitGameDialog(quitGameDialog);
        }

        if (backToGameButton) {
            quitGameDialog.close();
        }

        if (confirmExitButton) {
            quitGameDialog.close();
            showScreen(homeScreen, gameScreen);
        }
    });
}

function showQuitGameDialog(quitGameDialog: HTMLDialogElement) {
    if (!quitGameDialog.open) {
        quitGameDialog.showModal();
    }
}

function showGameScreen(gameScreen: HTMLElement, homeScreen: HTMLElement, startScreen: HTMLElement) {
    applySelectedTheme(gameScreen, homeScreen);
    showScreen(gameScreen, homeScreen, startScreen);
}

function applySelectedTheme(gameScreen: HTMLElement, homeScreen: HTMLElement) {
    const selectedTheme = getSelectedTheme(homeScreen);

    gameScreen.dataset.theme = selectedTheme;
    updatePlayerStatusVisuals(gameScreen, selectedTheme);
    updateExitButtonVisuals(gameScreen, selectedTheme);
    updateQuitDialogButtonVisuals(gameScreen, selectedTheme);
}

function updateExitButtonVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme) {
    const exitButton = gameScreen.querySelector<HTMLElement>('.game-screen__exit-button');

    if (!exitButton) {
        throw new Error('Game screen exit button was not found.');
    }

    renderButtonVisuals(exitButton, exitButtonVisuals[selectedTheme], 'game-screen__exit-button-image');
}

function updateQuitDialogButtonVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme) {
    updateDialogButtonVisuals(gameScreen, '.game-screen__quit-dialog-button--back', quitDialogButtonVisuals[selectedTheme].back);
    updateDialogButtonVisuals(gameScreen, '.game-screen__quit-dialog-button--exit', quitDialogButtonVisuals[selectedTheme].exit);
}

function updateDialogButtonVisuals(gameScreen: HTMLElement, buttonSelector: string, visuals: ButtonVisuals) {
    const button = gameScreen.querySelector<HTMLElement>(buttonSelector);

    if (!button) {
        throw new Error(`Button "${buttonSelector}" was not found.`);
    }

    renderButtonVisuals(button, visuals, 'game-screen__quit-dialog-button-image');
}

function getSelectedTheme(homeScreen: HTMLElement): GameTheme {
    const selectedTheme = homeScreen.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value;

    return isGameTheme(selectedTheme) ? selectedTheme : 'code-vibes';
}
