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

const inlineSvgVisual = (markup: string): ButtonVisual => ({
    type: 'inline-svg',
    markup,
});
const textVisual = (label: string): ButtonVisual => ({ type: 'text', label });
let inlineSvgId = 0;

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

init();

function init() {
    const startScreen = getElementById('start-screen');
    const homeScreen = getElementById('home-screen');
    const gameScreen = getElementById('game-screen');
    const quitGameDialog = getDialogById('quit-game-dialog');
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
    updateExitButtonVisuals(gameScreen, selectedTheme);
    updateQuitDialogButtonVisuals(gameScreen, selectedTheme);
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
