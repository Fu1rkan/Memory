import { isGameTheme, type GameTheme } from './game-themes';

type SettingName = 'theme' | 'player' | 'board-size';

type FooterInfo = {
    footer: HTMLElement;
    theme: HTMLElement;
    player: HTMLElement;
    boardSize: HTMLElement;
    playerSeparator: SVGSVGElement;
    boardSizeSeparator: SVGSVGElement;
    startButton: HTMLButtonElement;
};

const themeImageFolder = `${import.meta.env.BASE_URL}img/themes`;
const requiredSettings: SettingName[] = ['theme', 'player', 'board-size'];
const footerWidthTransitionDuration = 250;
let footerResizeTimeout: number | undefined;

const themePreviewImages: Record<GameTheme, string> = {
    'code-vibes': `${themeImageFolder}/code_vibes.png`,
    gaming: `${themeImageFolder}/gaming_theme.png`,
    'da-projects': `${themeImageFolder}/da_theme.png`,
    foods: `${themeImageFolder}/food_theme.png`,
};

export function setupHomeScreen(homeScreen: HTMLElement) {
    const previewImage = getHomeElement<HTMLImageElement>(homeScreen, '.home-screen__preview-image');
    const footerInfo = getFooterInfo(homeScreen);

    homeScreen.addEventListener('change', event => {
        updateThemePreview(event, previewImage, footerInfo);
        updatePlayerInfo(event, footerInfo);
        updateBoardSizeInfo(event, footerInfo);
        animateFooterWidth(footerInfo.footer, () => updateSeparatorStates(homeScreen, footerInfo));
        updateStartButtonState(homeScreen, footerInfo.startButton);
    });

    showSelectedTheme(homeScreen, previewImage, footerInfo);
    updateSeparatorStates(homeScreen, footerInfo);
    updateStartButtonState(homeScreen, footerInfo.startButton);
}

function updateThemePreview(event: Event, previewImage: HTMLImageElement, footerInfo: FooterInfo) {
    const themeInput = getChangedRadioInput(event, 'theme');

    if (themeInput) {
        showThemePreview(themeInput, previewImage, footerInfo);
    }
}

function showThemePreview(input: HTMLInputElement, previewImage: HTMLImageElement, footerInfo: FooterInfo, animateLabel = true) {
    if (!isGameTheme(input.value)) {
        return;
    }

    previewImage.src = themePreviewImages[input.value];
    setFooterText(footerInfo.footer, footerInfo.theme, getOptionText(input), animateLabel);
}

function updatePlayerInfo(event: Event, footerInfo: FooterInfo) {
    const playerInput = getChangedRadioInput(event, 'player');

    if (playerInput) {
        setFooterText(footerInfo.footer, footerInfo.player, `${getOptionText(playerInput)} Player`);
    }
}

function updateBoardSizeInfo(event: Event, footerInfo: FooterInfo) {
    const boardSizeInput = getChangedRadioInput(event, 'board-size');

    if (boardSizeInput) {
        setFooterText(footerInfo.footer, footerInfo.boardSize, `Board ${getOptionText(boardSizeInput)}`);
    }
}

function showSelectedTheme(homeScreen: HTMLElement, previewImage: HTMLImageElement, footerInfo: FooterInfo) {
    const checkedTheme = homeScreen.querySelector<HTMLInputElement>('input[name="theme"]:checked');

    if (checkedTheme) {
        showThemePreview(checkedTheme, previewImage, footerInfo, false);
    }
}

function getFooterInfo(homeScreen: HTMLElement): FooterInfo {
    return {
        footer: getHomeElement(homeScreen, '.home-screen__footer'),
        theme: getHomeElement(homeScreen, '#game-theme-info'),
        player: getHomeElement(homeScreen, '#player-info'),
        boardSize: getHomeElement(homeScreen, '#board-size-info'),
        playerSeparator: getHomeElement<SVGSVGElement>(homeScreen, '#player-separator'),
        boardSizeSeparator: getHomeElement<SVGSVGElement>(homeScreen, '#board-size-separator'),
        startButton: getHomeElement(homeScreen, '.home-screen__footer-button--start'),
    };
}

function updateSeparatorStates(homeScreen: HTMLElement, footerInfo: FooterInfo) {
    setSeparatorState(footerInfo.playerSeparator, hasSelectedOption(homeScreen, 'player'));
    setSeparatorState(footerInfo.boardSizeSeparator, hasSelectedOption(homeScreen, 'board-size'));
}

function setSeparatorState(separator: SVGSVGElement, isActive: boolean) {
    separator.classList.toggle('home-screen__footer-separator--active', isActive);
}

function updateStartButtonState(homeScreen: HTMLElement, startButton: HTMLButtonElement) {
    startButton.disabled = !hasSelectedAllSettings(homeScreen);
}

function hasSelectedAllSettings(homeScreen: HTMLElement) {
    return requiredSettings.every(settingName => hasSelectedOption(homeScreen, settingName));
}

function hasSelectedOption(homeScreen: HTMLElement, inputName: SettingName) {
    return Boolean(homeScreen.querySelector(`input[name="${inputName}"]:checked`));
}

function getChangedRadioInput(event: Event, inputName: string) {
    const target = event.target;

    if (!(target instanceof HTMLInputElement) || target.name !== inputName) {
        return null;
    }

    return target;
}

function getHomeElement<T extends Element = HTMLElement>(homeScreen: HTMLElement, selector: string) {
    const element = homeScreen.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Home screen element "${selector}" was not found.`);
    }

    return element;
}

function getOptionText(input: HTMLInputElement) {
    return input.closest('label')?.textContent?.trim() || '';
}

function setFooterTextNow(footerLabel: HTMLElement, text: string) {
    footerLabel.innerText = text;
}

function setFooterText(footer: HTMLElement, footerLabel: HTMLElement, text: string, animate = true) {
    if (footerLabel.innerText === text) {
        return;
    }

    if (!animate) {
        setFooterTextNow(footerLabel, text);
        return;
    }

    animateFooterWidth(footer, () => setFooterTextNow(footerLabel, text));
}

function animateFooterWidth(footer: HTMLElement, updateContent: () => void) {
    const startWidth = footer.getBoundingClientRect().width;

    footer.style.width = `${startWidth}px`;
    updateContent();

    const endWidth = getFooterNaturalWidth(footer);

    if (Math.abs(startWidth - endWidth) < 1) {
        footer.style.width = '';
        return;
    }

    window.clearTimeout(footerResizeTimeout);
    footer.style.width = `${startWidth}px`;
    footer.getBoundingClientRect();
    footer.style.width = `${endWidth}px`;

    footerResizeTimeout = window.setTimeout(() => {
        footer.style.width = '';
    }, footerWidthTransitionDuration);
}

function getFooterNaturalWidth(footer: HTMLElement) {
    const previousTransition = footer.style.transition;
    const previousWidth = footer.style.width;

    footer.style.transition = 'none';
    footer.style.width = 'max-content';

    const width = footer.getBoundingClientRect().width;

    footer.style.width = previousWidth;
    footer.style.transition = previousTransition;

    return width;
}
