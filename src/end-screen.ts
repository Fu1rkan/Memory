import { gameFinishedEventName } from './game-screen';
import { showScreen } from './screen-navigation';

export function setupEndScreen(
    endScreen: HTMLElement,
    gameScreen: HTMLElement,
    homeScreen: HTMLElement,
    startScreen: HTMLElement,
) {
    gameScreen.addEventListener(gameFinishedEventName, () => {
        endScreen.dataset.theme = gameScreen.dataset.theme ?? 'code-vibes';
        renderFinalScore(endScreen, gameScreen);
        showScreen(endScreen, startScreen, homeScreen, gameScreen);
    });
}

function renderFinalScore(endScreen: HTMLElement, gameScreen: HTMLElement) {
    const finalScoreElement = endScreen.querySelector<HTMLElement>('[data-final-score]');
    const playerStatusElement = gameScreen.querySelector<HTMLElement>('.game-screen__player-status');

    if (!finalScoreElement || !playerStatusElement) {
        throw new Error('Final score could not be rendered.');
    }

    const finalScore = playerStatusElement.cloneNode(true);

    if (!(finalScore instanceof HTMLElement)) {
        throw new Error('Final score markup could not be created.');
    }

    finalScoreElement.replaceChildren(finalScore);
}
