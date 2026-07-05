import { gameFinishedEventName, type GameFinishedEventDetail } from './game-screen';

const endScreenDelay = 2000;
const endScreenAnimationFallbackDelay = 650;
let showEndScreenTimeout: number | undefined;

export function setupEndScreen(
    endScreen: HTMLElement,
    gameScreen: HTMLElement,
    homeScreen: HTMLElement,
    startScreen: HTMLElement,
) {
    gameScreen.addEventListener(gameFinishedEventName, event => {
        endScreen.dataset.theme = gameScreen.dataset.theme ?? 'code-vibes';
        renderFinalScore(endScreen, gameScreen);

        window.clearTimeout(showEndScreenTimeout);
        showEndScreenTimeout = window.setTimeout(() => {
            if (!gameScreen.classList.contains('d_none')) {
                showEndScreen(endScreen, gameScreen, homeScreen, startScreen);
            }
        }, getEndScreenDelay(event));
    });
}

function showEndScreen(
    endScreen: HTMLElement,
    gameScreen: HTMLElement,
    homeScreen: HTMLElement,
    startScreen: HTMLElement,
) {
    let hasFinishedAnimation = false;

    startScreen.classList.add('d_none');
    homeScreen.classList.add('d_none');
    endScreen.classList.add('game-over-screen--entering');
    endScreen.classList.remove('d_none');

    const finishEndScreenAnimation = () => {
        if (hasFinishedAnimation) {
            return;
        }

        hasFinishedAnimation = true;
        gameScreen.classList.add('d_none');
        endScreen.classList.remove('game-over-screen--entering');
    };

    endScreen.addEventListener('animationend', finishEndScreenAnimation, { once: true });
    window.setTimeout(finishEndScreenAnimation, getEndScreenAnimationFallbackDelay());
}

function getEndScreenAnimationFallbackDelay() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 0;
    }

    return endScreenAnimationFallbackDelay;
}

function getEndScreenDelay(event: Event) {
    if (!(event instanceof CustomEvent)) {
        return endScreenDelay;
    }

    const detail = event.detail as GameFinishedEventDetail | undefined;

    return detail?.skipDelay ? 0 : endScreenDelay;
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
