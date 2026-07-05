import { gameFinishedEventName, type GameFinishedEventDetail } from './game-screen';

const endScreenDelay = 2000;
const endScreenAnimationFallbackDelay = 1100;
let showEndScreenTimeout: number | undefined;
export const endScreenShownEventName = 'memory:end-screen-shown';
export type EndScreenShownEventDetail = GameFinishedEventDetail;

export function setupEndScreen(
    endScreen: HTMLElement,
    gameScreen: HTMLElement,
    homeScreen: HTMLElement,
    startScreen: HTMLElement,
) {
    gameScreen.addEventListener(gameFinishedEventName, event => {
        const gameFinishedDetail = getGameFinishedDetail(event);

        endScreen.dataset.theme = gameFinishedDetail.theme;
        renderFinalScore(endScreen, gameScreen);

        window.clearTimeout(showEndScreenTimeout);
        showEndScreenTimeout = window.setTimeout(() => {
            if (!gameScreen.classList.contains('d_none')) {
                showEndScreen(endScreen, gameScreen, homeScreen, startScreen, gameFinishedDetail);
            }
        }, getEndScreenDelay(event));
    });
}

function showEndScreen(
    endScreen: HTMLElement,
    gameScreen: HTMLElement,
    homeScreen: HTMLElement,
    startScreen: HTMLElement,
    gameFinishedDetail: GameFinishedEventDetail,
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
        endScreen.dispatchEvent(new CustomEvent<EndScreenShownEventDetail>(endScreenShownEventName, {
            detail: gameFinishedDetail,
        }));
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
    const detail = getGameFinishedDetail(event);

    return detail?.skipDelay ? 0 : endScreenDelay;
}

function getGameFinishedDetail(event: Event) {
    if (!(event instanceof CustomEvent) || !event.detail) {
        throw new Error('Game finished detail is missing.');
    }

    return event.detail as GameFinishedEventDetail;
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
