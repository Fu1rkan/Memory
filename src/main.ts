import './styles/style.scss';
import { setupHomeScreen } from './home-screen';
import codeThemeBackToGameButtonSvg from './assets/buttons/code_theme_btg_button.svg?raw';
import codeThemeBackToGameHoverButtonSvg from './assets/buttons/code_theme_btg_hover_button.svg?raw';
import codeThemeExitButtonSvg from './assets/buttons/code_theme_exit_button.svg?raw';
import codeThemeExitHoverButtonSvg from './assets/buttons/code_theme_exit_hover_button.svg?raw';
import daThemeBackToGameButtonSvg from './assets/buttons/da_theme_btg_button.svg?raw';
import daThemeBackToGameHoverButtonSvg from './assets/buttons/da_theme_btg_hover_button.svg?raw';
import daThemeDialogExitButtonSvg from './assets/buttons/da_theme_exit2_button.svg?raw';
import daThemeDialogExitHoverButtonSvg from './assets/buttons/da_theme_exit2_hover_button.svg?raw';
import daThemeExitButtonSvg from './assets/buttons/da_theme_exit_button.svg?raw';
import daThemeExitHoverButtonSvg from './assets/buttons/da_theme_exit_hover_button.svg?raw';
import foodThemeBackToGameButtonSvg from './assets/buttons/food_theme_btg_button.svg?raw';
import foodThemeBackToGameHoverButtonSvg from './assets/buttons/food_theme_btg_hover_button.svg?raw';
import foodThemeDialogExitButtonSvg from './assets/buttons/food_theme_dialog_exit_button.svg?raw';
import foodThemeDialogExitHoverButtonSvg from './assets/buttons/food_theme_dialog_exit_hover_button.svg?raw';
import foodThemeExitButtonSvg from './assets/buttons/food_theme_exit_button.svg?raw';
import foodThemeExitHoverButtonSvg from './assets/buttons/food_theme_exit_hover_button.svg?raw';
import gameThemeBackToGameButtonSvg from './assets/buttons/game_theme_btg_button.svg?raw';
import gameThemeBackToGameHoverButtonSvg from './assets/buttons/game_theme_btg_hover_button.svg?raw';
import gameThemeExitButtonSvg from './assets/buttons/game_theme_exit_button.svg?raw';
import gameThemeExitHoverButtonSvg from './assets/buttons/game_theme_exit_hover_button.svg?raw';

const gameThemes = ['code-vibes', 'gaming', 'da-projects', 'foods'] as const;
type GameTheme = typeof gameThemes[number];
type ButtonVisual = {
    type: 'image';
    src: string;
} | {
    type: 'inline-svg';
    markup: string;
} | {
    type: 'text';
    label: string;
};
type ButtonVisuals = {
    default: ButtonVisual;
    hover: ButtonVisual;
};
type QuitDialogButtonVisuals = {
    back: ButtonVisuals;
    exit: ButtonVisuals;
};
type PlayerStatusKey = 'orange' | 'blue';
type PlayerStatusItemVisual = {
    iconMarkup: string;
    counterLabel: string;
};
type PlayerStatusVisuals = Record<PlayerStatusKey, PlayerStatusItemVisual>;

const inlineSvgVisual = (markup: string): ButtonVisual => ({
    type: 'inline-svg',
    markup,
});
const textVisual = (label: string): ButtonVisual => ({ type: 'text', label });
let inlineSvgId = 0;
let defaultPlayerStatusVisuals: PlayerStatusVisuals | undefined;

const exitButtonVisuals: Record<GameTheme, ButtonVisuals> = {
    'code-vibes': {
        default: inlineSvgVisual(codeThemeExitButtonSvg),
        hover: inlineSvgVisual(codeThemeExitHoverButtonSvg),
    },
    gaming: {
        default: inlineSvgVisual(gameThemeExitButtonSvg),
        hover: inlineSvgVisual(gameThemeExitHoverButtonSvg),
    },
    'da-projects': {
        default: inlineSvgVisual(daThemeExitButtonSvg),
        hover: inlineSvgVisual(daThemeExitHoverButtonSvg),
    },
    foods: {
        default: inlineSvgVisual(foodThemeExitHoverButtonSvg),
        hover: inlineSvgVisual(foodThemeExitButtonSvg),
    },
};

const quitDialogButtonVisuals: Record<GameTheme, QuitDialogButtonVisuals> = {
    'code-vibes': {
        back: {
            default: inlineSvgVisual(codeThemeBackToGameButtonSvg),
            hover: inlineSvgVisual(codeThemeBackToGameHoverButtonSvg),
        },
        exit: {
            default: textVisual('Exit game'),
            hover: textVisual('Exit game'),
        },
    },
    gaming: {
        back: {
            default: inlineSvgVisual(gameThemeBackToGameButtonSvg),
            hover: inlineSvgVisual(gameThemeBackToGameHoverButtonSvg),
        },
        exit: {
            default: textVisual('Yes, quit game'),
            hover: textVisual('Yes, quit game'),
        },
    },
    'da-projects': {
        back: {
            default: inlineSvgVisual(daThemeBackToGameButtonSvg),
            hover: inlineSvgVisual(daThemeBackToGameHoverButtonSvg),
        },
        exit: {
            default: inlineSvgVisual(daThemeDialogExitButtonSvg),
            hover: inlineSvgVisual(daThemeDialogExitHoverButtonSvg),
        },
    },
    foods: {
        back: {
            default: inlineSvgVisual(foodThemeBackToGameHoverButtonSvg),
            hover: inlineSvgVisual(foodThemeBackToGameButtonSvg),
        },
        exit: {
            default: inlineSvgVisual(foodThemeDialogExitButtonSvg),
            hover: inlineSvgVisual(foodThemeDialogExitHoverButtonSvg),
        },
    },
};
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
const gamingPlayerChessPiecePath = 'M2.75 28C1.99375 28 1.34635 27.7258 0.807813 27.1775C0.269271 26.6292 0 25.97 0 25.2V22.435C0 21.9683 0.103125 21.5367 0.309375 21.14C0.515625 20.7433 0.790625 20.405 1.13437 20.125C2.71563 18.8183 3.90156 17.5 4.69219 16.17C5.48281 14.84 6.03854 13.65 6.35938 12.6H4.125C3.73542 12.6 3.40885 12.4658 3.14531 12.1975C2.88177 11.9292 2.75 11.5967 2.75 11.2C2.75 10.8033 2.88177 10.4708 3.14531 10.2025C3.40885 9.93417 3.73542 9.8 4.125 9.8H5.84375C5.52292 9.28667 5.27083 8.73833 5.0875 8.155C4.90417 7.57167 4.8125 6.95333 4.8125 6.3C4.8125 4.55 5.41406 3.0625 6.61719 1.8375C7.82031 0.6125 9.28125 0 11 0C12.7188 0 14.1797 0.6125 15.3828 1.8375C16.5859 3.0625 17.1875 4.55 17.1875 6.3C17.1875 6.95333 17.0958 7.57167 16.9125 8.155C16.7292 8.73833 16.4771 9.28667 16.1562 9.8H17.875C18.2646 9.8 18.5911 9.93417 18.8547 10.2025C19.1182 10.4708 19.25 10.8033 19.25 11.2C19.25 11.5967 19.1182 11.9292 18.8547 12.1975C18.5911 12.4658 18.2646 12.6 17.875 12.6H15.6406C15.9615 13.65 16.5172 14.84 17.3078 16.17C18.0984 17.5 19.2844 18.8183 20.8656 20.125C21.2094 20.405 21.4844 20.7433 21.6906 21.14C21.8969 21.5367 22 21.9683 22 22.435V25.2C22 25.97 21.7307 26.6292 21.1922 27.1775C20.6536 27.7258 20.0063 28 19.25 28H2.75ZM2.75 25.2H19.25V22.4C17.1417 20.72 15.6177 18.9875 14.6781 17.2025C13.7385 15.4175 13.1083 13.8833 12.7875 12.6H9.2125C8.89167 13.8833 8.26146 15.4175 7.32188 17.2025C6.38229 18.9875 4.85833 20.72 2.75 22.4V25.2ZM11 9.8C11.9625 9.8 12.776 9.46167 13.4406 8.785C14.1052 8.10833 14.4375 7.28 14.4375 6.3C14.4375 5.32 14.1052 4.49167 13.4406 3.815C12.776 3.13833 11.9625 2.8 11 2.8C10.0375 2.8 9.22396 3.13833 8.55937 3.815C7.89479 4.49167 7.5625 5.32 7.5625 6.3C7.5625 7.28 7.89479 8.10833 8.55937 8.785C9.22396 9.46167 10.0375 9.8 11 9.8Z';
const gamingPlayerStatusVisuals: PlayerStatusVisuals = {
    orange: {
        iconMarkup: createGamingPlayerChessPieceSvg('rgba(234, 105, 0, 1)'),
        counterLabel: '0',
    },
    blue: {
        iconMarkup: createGamingPlayerChessPieceSvg('rgba(9, 127, 197, 1)'),
        counterLabel: '0',
    },
};

init();

function init() {
    const startScreen = getElementById('start-screen');
    const homeScreen = getElementById('home-screen');
    const gameScreen = getElementById('game-screen');
    const quitGameDialog = getDialogById('quit-game-dialog');
    defaultPlayerStatusVisuals = getPlayerStatusVisuals(gameScreen);
    // showGameScreen(gameScreen, homeScreen);
    setupPlayButton(startScreen, homeScreen);
    setupStartButton(gameScreen, homeScreen);
    setupExitButton(gameScreen, homeScreen, quitGameDialog);
    setupHomeScreen(homeScreen);
    applySelectedTheme(gameScreen, homeScreen);
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

function setupExitButton(gameScreen: HTMLElement, homeScreen: HTMLElement, quitGameDialog: HTMLDialogElement) {
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
            showHomeScreen(gameScreen, homeScreen);
        }
    });
}

function showQuitGameDialog(quitGameDialog: HTMLDialogElement) {
    if (!quitGameDialog.open) {
        quitGameDialog.showModal();
    }
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
    updatePlayerStatusVisuals(gameScreen, selectedTheme);
    updateExitButtonVisuals(gameScreen, selectedTheme);
    updateQuitDialogButtonVisuals(gameScreen, selectedTheme);
}

function updatePlayerStatusVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme) {
    const visuals = selectedTheme === 'gaming' ? gamingPlayerStatusVisuals : defaultPlayerStatusVisuals;

    if (!visuals) {
        throw new Error('Default player status visuals were not initialized.');
    }

    updatePlayerStatusItem(gameScreen, 'orange', visuals.orange);
    updatePlayerStatusItem(gameScreen, 'blue', visuals.blue);
}

function updatePlayerStatusItem(gameScreen: HTMLElement, statusKey: PlayerStatusKey, visual: PlayerStatusItemVisual) {
    const iconElement = gameScreen.querySelector<HTMLElement>(playerStatusSelectors[statusKey].icon);
    const counterElement = gameScreen.querySelector<HTMLElement>(playerStatusSelectors[statusKey].counter);

    if (!iconElement || !counterElement) {
        throw new Error(`Player status "${statusKey}" was not found.`);
    }

    iconElement.innerHTML = visual.iconMarkup;
    iconElement.querySelector('svg')?.setAttribute('focusable', 'false');
    counterElement.textContent = visual.counterLabel;
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

function createGamingPlayerChessPieceSvg(fill: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="28" viewBox="0 0 22 28" fill="none" aria-hidden="true"><path d="${gamingPlayerChessPiecePath}" fill="${fill}"/></svg>`;
}

function updateExitButtonVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme) {
    const exitButton = gameScreen.querySelector<HTMLElement>('.game-screen__exit-button');

    if (!exitButton) {
        throw new Error('Game screen exit button was not found.');
    }

    updateButtonVisuals(exitButton, exitButtonVisuals[selectedTheme], 'game-screen__exit-button-image');
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

    updateButtonVisuals(button, visuals, 'game-screen__quit-dialog-button-image');
}

function updateButtonVisuals(button: HTMLElement, visuals: ButtonVisuals, visualClassName: string) {
    button.replaceChildren(
        createButtonVisualElement(visuals.default, `${visualClassName} ${visualClassName}--default`),
        createButtonVisualElement(visuals.hover, `${visualClassName} ${visualClassName}--hover`),
    );
}

function createButtonVisualElement(visual: ButtonVisual, className: string) {
    const visualElement = document.createElement('span');
    visualElement.className = className;
    visualElement.setAttribute('aria-hidden', 'true');

    if (visual.type === 'inline-svg') {
        visualElement.innerHTML = visual.markup;
        const svg = visualElement.querySelector('svg');
        svg?.setAttribute('focusable', 'false');

        if (svg) {
            namespaceSvgIds(svg, `button-svg-${inlineSvgId}`);
            inlineSvgId += 1;
        }

        return visualElement;
    }

    if (visual.type === 'text') {
        visualElement.classList.add('game-screen__button-text-visual');
        visualElement.textContent = visual.label;

        return visualElement;
    }

    const imageElement = document.createElement('img');
    imageElement.src = visual.src;
    imageElement.alt = '';
    imageElement.draggable = false;
    visualElement.append(imageElement);

    return visualElement;
}

function namespaceSvgIds(svg: SVGSVGElement, namespace: string) {
    const idMap = new Map<string, string>();

    svg.querySelectorAll<SVGElement>('[id]').forEach(element => {
        const newId = `${namespace}-${element.id}`;
        idMap.set(element.id, newId);
        element.id = newId;
    });

    svg.querySelectorAll<SVGElement>('*').forEach(element => {
        Array.from(element.attributes).forEach(attribute => {
            let nextValue = attribute.value;

            idMap.forEach((newId, oldId) => {
                nextValue = nextValue
                    .replaceAll(`url(#${oldId})`, `url(#${newId})`)
                    .replaceAll(`#${oldId}`, `#${newId}`);
            });

            if (nextValue !== attribute.value) {
                element.setAttribute(attribute.name, nextValue);
            }
        });
    });
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

    return target instanceof Element ? target.closest(selector) : null;
}

function getElementById(id: string) {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Element with id "${id}" was not found.`);
    }

    return element;
}

function getDialogById(id: string) {
    const element = getElementById(id);

    if (!(element instanceof HTMLDialogElement)) {
        throw new Error(`Dialog with id "${id}" was not found.`);
    }

    return element;
}
