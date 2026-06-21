import type { GameTheme } from './game-themes';
import { createChessPieceSvg } from './player-status-icons';

type PlayerStatusKey = 'orange' | 'blue';

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
            counterMarkup: 'Blue <span class="game-screen__player-status-number">0</span>',
        },
        blue: {
            ...visuals.blue,
            counterLabel: 'Orange 6',
            counterMarkup: 'Orange <span class="game-screen__player-status-number">6</span>',
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
