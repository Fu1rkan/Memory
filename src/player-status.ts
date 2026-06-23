import type { PlayerColor } from './current-player';
import type { GameTheme } from './game-themes';
import { createChessPieceSvg } from './player-status-icons';

type PlayerStatusKey = 'orange' | 'blue';
type PlayerScores = Record<PlayerColor, number>;

type PlayerStatusItemVisual = {
    iconMarkup: string;
    counterLabel: string;
    counterMarkup?: string;
};

type PlayerStatusVisuals = Record<PlayerStatusKey, PlayerStatusItemVisual>;

const playerStatusSelectors: Record<PlayerStatusKey, { icon: string; counter: string }> = {
    orange: {
        icon: '.game-screen__player-status__orange__icon',
        counter: '.game-screen__player-status__orange__counter',
    },
    blue: {
        icon: '.game-screen__player-status__blue__icon',
        counter: '.game-screen__player-status__blue__counter',
    },
};

const gamingPlayerStatusVisuals = createChessPiecePlayerStatusVisuals(22, 28);
const compactPlayerStatusVisuals = createChessPiecePlayerStatusVisuals(20, 25);

let codeVibesPlayerStatusVisuals: PlayerStatusVisuals | undefined;

export function setupPlayerStatus(gameScreen: HTMLElement) {
    const defaultPlayerStatusVisuals = getPlayerStatusVisuals(gameScreen);

    codeVibesPlayerStatusVisuals = createCodeVibesPlayerStatusVisuals(defaultPlayerStatusVisuals);
}

export function updatePlayerStatusVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme) {
    const visuals = getThemePlayerStatusVisuals(selectedTheme);

    if (!visuals) {
        throw new Error('Player status visuals were not initialized.');
    }

    updatePlayerStatusItem(gameScreen, 'orange', visuals.orange);
    updatePlayerStatusItem(gameScreen, 'blue', visuals.blue);
}

export function updatePlayerScores(gameScreen: HTMLElement, selectedTheme: GameTheme, scores: PlayerScores) {
    updatePlayerScore(gameScreen, selectedTheme, 'blue', scores.blue);
    updatePlayerScore(gameScreen, selectedTheme, 'orange', scores.orange);
}

function getThemePlayerStatusVisuals(selectedTheme: GameTheme) {
    switch (selectedTheme) {
        case 'code-vibes':
            return codeVibesPlayerStatusVisuals;
        case 'gaming':
            return gamingPlayerStatusVisuals;
        case 'da-projects':
        case 'foods':
            return compactPlayerStatusVisuals;
    }
}

function createCodeVibesPlayerStatusVisuals(visuals: PlayerStatusVisuals): PlayerStatusVisuals {
    return {
        orange: {
            ...visuals.orange,
            counterLabel: 'Blue 0',
            counterMarkup: createCodeVibesScoreMarkup('blue', 0),
        },
        blue: {
            ...visuals.blue,
            counterLabel: 'Orange 0',
            counterMarkup: createCodeVibesScoreMarkup('orange', 0),
        },
    };
}

function updatePlayerStatusItem(gameScreen: HTMLElement, statusKey: PlayerStatusKey, visual: PlayerStatusItemVisual) {
    const iconElement = gameScreen.querySelector<HTMLElement>(playerStatusSelectors[statusKey].icon);
    const counterElement = gameScreen.querySelector<HTMLElement>(playerStatusSelectors[statusKey].counter);

    if (!iconElement || !counterElement) {
        throw new Error(`Player status "${statusKey}" was not found.`);
    }

    iconElement.innerHTML = visual.iconMarkup;
    iconElement.querySelector('svg')?.setAttribute('focusable', 'false');

    if (visual.counterMarkup) {
        counterElement.innerHTML = visual.counterMarkup;
    } else {
        counterElement.textContent = visual.counterLabel;
    }
}

function updatePlayerScore(
    gameScreen: HTMLElement,
    selectedTheme: GameTheme,
    playerColor: PlayerColor,
    score: number,
) {
    const statusKey = getStatusKeyForPlayer(selectedTheme, playerColor);
    const counterElement = getPlayerStatusCounterElement(gameScreen, statusKey);

    if (selectedTheme === 'code-vibes') {
        counterElement.innerHTML = createCodeVibesScoreMarkup(playerColor, score);
        return;
    }

    counterElement.textContent = String(score);
}

function getStatusKeyForPlayer(selectedTheme: GameTheme, playerColor: PlayerColor): PlayerStatusKey {
    if (selectedTheme === 'code-vibes') {
        return playerColor === 'blue' ? 'orange' : 'blue';
    }

    return playerColor;
}

function createCodeVibesScoreMarkup(playerColor: PlayerColor, score: number) {
    const playerLabel = playerColor === 'blue' ? 'Blue' : 'Orange';

    return `${playerLabel} <span class="game-screen__player-status-number">${score}</span>`;
}

function getPlayerStatusCounterElement(gameScreen: HTMLElement, statusKey: PlayerStatusKey) {
    const counterElement = gameScreen.querySelector<HTMLElement>(playerStatusSelectors[statusKey].counter);

    if (!counterElement) {
        throw new Error(`Player status "${statusKey}" counter was not found.`);
    }

    return counterElement;
}

function getPlayerStatusVisuals(gameScreen: HTMLElement): PlayerStatusVisuals {
    return {
        orange: getPlayerStatusItemVisual(gameScreen, 'orange'),
        blue: getPlayerStatusItemVisual(gameScreen, 'blue'),
    };
}

function getPlayerStatusItemVisual(gameScreen: HTMLElement, statusKey: PlayerStatusKey): PlayerStatusItemVisual {
    const iconElement = gameScreen.querySelector<HTMLElement>(playerStatusSelectors[statusKey].icon);
    const counterElement = gameScreen.querySelector<HTMLElement>(playerStatusSelectors[statusKey].counter);

    if (!iconElement || !counterElement) {
        throw new Error(`Player status "${statusKey}" was not found.`);
    }

    return {
        iconMarkup: iconElement.innerHTML,
        counterLabel: counterElement.textContent ?? '',
    };
}

function createChessPiecePlayerStatusVisuals(width: number, height: number): PlayerStatusVisuals {
    return {
        orange: {
            iconMarkup: createChessPieceSvg('rgba(234, 105, 0, 1)', width, height),
            counterLabel: '0',
        },
        blue: {
            iconMarkup: createChessPieceSvg('rgba(9, 127, 197, 1)', width, height),
            counterLabel: '0',
        },
    };
}
