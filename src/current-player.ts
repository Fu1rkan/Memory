import type { GameTheme } from './game-themes';

export const playerColors = ['blue', 'orange'] as const;
export type PlayerColor = typeof playerColors[number];

const codeVibesPlayerColors: Record<PlayerColor, string> = {
    blue: 'rgba(43, 177, 255, 1)',
    orange: 'rgba(245, 142, 57, 1)',
};

const themedPlayerBackgroundColors: Record<PlayerColor, string> = {
    blue: '#1FAAFC',
    orange: 'rgba(234, 105, 0, 1)',
};

export function updateCurrentPlayerIndicator(gameScreen: HTMLElement, selectedTheme: GameTheme, currentPlayer: PlayerColor) {
    const currentPlayerElement = gameScreen.querySelector<HTMLElement>('.game-screen__current-player');

    if (!currentPlayerElement) {
        throw new Error('Current player indicator was not found.');
    }

    currentPlayerElement.replaceChildren(createSvgElement(getCurrentPlayerSvg(selectedTheme, currentPlayer)));
}

export function getNextPlayer(currentPlayer: PlayerColor): PlayerColor {
    return currentPlayer === 'blue' ? 'orange' : 'blue';
}

export function isPlayerColor(value: string | undefined): value is PlayerColor {
    return playerColors.includes(value as PlayerColor);
}

function getCurrentPlayerSvg(selectedTheme: GameTheme, currentPlayer: PlayerColor) {
    if (selectedTheme === 'code-vibes') {
        return createCodeVibesPlayerSvg(codeVibesPlayerColors[currentPlayer]);
    }

    return createThemedPlayerSvg(themedPlayerBackgroundColors[currentPlayer]);
}

function createCodeVibesPlayerSvg(fill: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 24 20" fill="none" aria-hidden="true"><path d="M2.46154 20C1.78462 20 1.20513 19.7552 0.723077 19.2656C0.241026 18.776 0 18.1875 0 17.5V2.5C0 1.8125 0.241026 1.22396 0.723077 0.734375C1.20513 0.244792 1.78462 0 2.46154 0H16C16.3897 0 16.759 0.0885417 17.1077 0.265625C17.4564 0.442708 17.7436 0.6875 17.9692 1L23.5077 8.5C23.8359 8.9375 24 9.4375 24 10C24 10.5625 23.8359 11.0625 23.5077 11.5L17.9692 19C17.7436 19.3125 17.4564 19.5573 17.1077 19.7344C16.759 19.9115 16.3897 20 16 20H2.46154Z" fill="${fill}"/></svg>`;
}

function createThemedPlayerSvg(backgroundColor: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="41" height="40" viewBox="0 0 41 40" fill="none" aria-hidden="true"><rect width="41" height="40" rx="3" fill="${backgroundColor}"/><path d="M11.125 36C10.2656 36 9.52995 35.6867 8.91797 35.06C8.30599 34.4333 8 33.68 8 32.8V29.64C8 29.1067 8.11719 28.6133 8.35156 28.16C8.58594 27.7067 8.89844 27.32 9.28906 27C11.0859 25.5067 12.4336 24 13.332 22.48C14.2305 20.96 14.862 19.6 15.2266 18.4H12.6875C12.2448 18.4 11.8737 18.2467 11.5742 17.94C11.2747 17.6333 11.125 17.2533 11.125 16.8C11.125 16.3467 11.2747 15.9667 11.5742 15.66C11.8737 15.3533 12.2448 15.2 12.6875 15.2H14.6406C14.276 14.6133 13.9896 13.9867 13.7812 13.32C13.5729 12.6533 13.4688 11.9467 13.4688 11.2C13.4688 9.2 14.1523 7.5 15.5195 6.1C16.8867 4.7 18.5469 4 20.5 4C22.4531 4 24.1133 4.7 25.4805 6.1C26.8477 7.5 27.5312 9.2 27.5312 11.2C27.5312 11.9467 27.4271 12.6533 27.2188 13.32C27.0104 13.9867 26.724 14.6133 26.3594 15.2H28.3125C28.7552 15.2 29.1263 15.3533 29.4258 15.66C29.7253 15.9667 29.875 16.3467 29.875 16.8C29.875 17.2533 29.7253 17.6333 29.4258 17.94C29.1263 18.2467 28.7552 18.4 28.3125 18.4H25.7734C26.138 19.6 26.7695 20.96 27.668 22.48C28.5664 24 29.9141 25.5067 31.7109 27C32.1016 27.32 32.4141 27.7067 32.6484 28.16C32.8828 28.6133 33 29.1067 33 29.64V32.8C33 33.68 32.694 34.4333 32.082 35.06C31.4701 35.6867 30.7344 36 29.875 36H11.125ZM11.125 32.8H29.875V29.6C27.4792 27.68 25.7474 25.7 24.6797 23.66C23.612 21.62 22.8958 19.8667 22.5312 18.4H18.4688C18.1042 19.8667 17.388 21.62 16.3203 23.66C15.2526 25.7 13.5208 27.68 11.125 29.6V32.8ZM20.5 15.2C21.5938 15.2 22.5182 14.8133 23.2734 14.04C24.0286 13.2667 24.4062 12.32 24.4062 11.2C24.4062 10.08 24.0286 9.13333 23.2734 8.36C22.5182 7.58667 21.5938 7.2 20.5 7.2C19.4062 7.2 18.4818 7.58667 17.7266 8.36C16.9714 9.13333 16.5938 10.08 16.5938 11.2C16.5938 12.32 16.9714 13.2667 17.7266 14.04C18.4818 14.8133 19.4062 15.2 20.5 15.2Z" fill="white"/></svg>`;
}

function createSvgElement(markup: string) {
    const template = document.createElement('template');

    template.innerHTML = markup.trim();

    const svg = template.content.firstElementChild;

    if (!(svg instanceof SVGSVGElement)) {
        throw new Error('Current player SVG could not be created.');
    }

    svg.setAttribute('focusable', 'false');

    return svg;
}
