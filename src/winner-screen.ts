import { getClosestElement } from './dom';
import { endScreenShownEventName, type EndScreenShownEventDetail } from './end-screen';
import type { GameTheme } from './game-themes';
import type { WinnerResult } from './game-screen';
import { showScreen } from './screen-navigation';

const winnerScreenDelay = 3000;
const winnerScreenAnimationFallbackDelay = 1100;

const winnerImages: Record<GameTheme, Record<WinnerResult, string>> = {
    'code-vibes': {
        blue: './img/winner_imgs/code_vibes_player_blue.png',
        orange: './img/winner_imgs/code_vibes_player_orange.png',
        draw: './img/winner_imgs/code_vibes_draw.png',
    },
    gaming: {
        blue: './img/winner_imgs/game_theme_pockal.png',
        orange: './img/winner_imgs/game_theme_pockal.png',
        draw: './img/winner_imgs/game_theme_draw.png',
    },
    'da-projects': {
        blue: './img/winner_imgs/da_theme_player_blue.png',
        orange: './img/winner_imgs/da_theme_player_orange.png',
        draw: './img/winner_imgs/da_theme_draw.png',
    },
    foods: {
        blue: './img/winner_imgs/food_theme_player_blue.png',
        orange: './img/winner_imgs/food_theme_player_orange.png',
        draw: './img/winner_imgs/food_theme_draw.png',
    },
};

const winnerButtonLabels: Record<GameTheme, string> = {
    'code-vibes': 'Back to start',
    gaming: 'Home',
    'da-projects': 'Home',
    foods: 'Back to start',
};

let showWinnerScreenTimeout: number | undefined;

export function setupWinnerScreen(
    winnerScreen: HTMLElement,
    endScreen: HTMLElement,
    gameScreen: HTMLElement,
    homeScreen: HTMLElement,
    startScreen: HTMLElement,
) {
    endScreen.addEventListener(endScreenShownEventName, event => {
        const detail = getEndScreenShownDetail(event);

        renderWinnerScreen(winnerScreen, detail);
        window.clearTimeout(showWinnerScreenTimeout);
        showWinnerScreenTimeout = window.setTimeout(() => {
            if (!endScreen.classList.contains('d_none')) {
                showWinnerScreen(winnerScreen, endScreen);
            }
        }, winnerScreenDelay);
    });

    winnerScreen.addEventListener('click', event => {
        const backButton = getClosestElement(event, '.winner-screen__back-button');

        if (backButton) {
            window.clearTimeout(showWinnerScreenTimeout);
            showScreen(startScreen, winnerScreen, endScreen, gameScreen, homeScreen);
        }
    });
}

function showWinnerScreen(winnerScreen: HTMLElement, endScreen: HTMLElement) {
    let hasFinishedAnimation = false;

    winnerScreen.classList.add('winner-screen--entering');
    winnerScreen.classList.remove('d_none');

    const finishWinnerScreenAnimation = () => {
        if (hasFinishedAnimation) {
            return;
        }

        hasFinishedAnimation = true;
        endScreen.classList.add('d_none');
        winnerScreen.classList.remove('winner-screen--entering');
    };

    winnerScreen.addEventListener('animationend', finishWinnerScreenAnimation, { once: true });
    window.setTimeout(finishWinnerScreenAnimation, getWinnerScreenAnimationFallbackDelay());
}

function getWinnerScreenAnimationFallbackDelay() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 0;
    }

    return winnerScreenAnimationFallbackDelay;
}

function renderWinnerScreen(winnerScreen: HTMLElement, detail: EndScreenShownEventDetail) {
    const winnerIntroElement = winnerScreen.querySelector<HTMLElement>('.winner-screen__intro');
    const winnerTextElement = winnerScreen.querySelector<HTMLElement>('[data-winner-player]');
    const winnerImageElement = winnerScreen.querySelector<HTMLImageElement>('[data-winner-image]');
    const winnerButtonElement = winnerScreen.querySelector<HTMLButtonElement>('.winner-screen__back-button');

    if (!winnerIntroElement || !winnerTextElement || !winnerImageElement || !winnerButtonElement) {
        throw new Error('Winner screen could not be rendered.');
    }

    winnerScreen.dataset.theme = detail.theme;
    winnerScreen.dataset.winner = detail.winner;
    winnerIntroElement.textContent = getWinnerIntro(detail.winner);
    winnerTextElement.textContent = getWinnerLabel(detail.winner);
    winnerImageElement.src = winnerImages[detail.theme][detail.winner];
    winnerImageElement.alt = getWinnerImageAlt(detail.winner);
    winnerButtonElement.textContent = winnerButtonLabels[detail.theme];
}

function getWinnerIntro(winner: WinnerResult) {
    return winner === 'draw' ? "It's a" : 'The winner is';
}

function getWinnerLabel(winner: WinnerResult) {
    if (winner === 'draw') {
        return 'Draw';
    }

    return `${winner.toUpperCase()} PLAYER`;
}

function getWinnerImageAlt(winner: WinnerResult) {
    if (winner === 'draw') {
        return 'Draw';
    }

    return `${winner} player`;
}

function getEndScreenShownDetail(event: Event) {
    if (!(event instanceof CustomEvent) || !event.detail) {
        throw new Error('End screen detail is missing.');
    }

    return event.detail as EndScreenShownEventDetail;
}
