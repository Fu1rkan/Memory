type Theme = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';
type SettingName = 'theme' | 'player' | 'board-size';

type FooterInfo = {
    theme: HTMLElement;
    player: HTMLElement;
    boardSize: HTMLElement;
    playerSeparator: SVGSVGElement;
    boardSizeSeparator: SVGSVGElement;
    startButton: HTMLButtonElement;
};

const imageFolder = `${import.meta.env.BASE_URL}img`;
const requiredSettings: SettingName[] = ['theme', 'player', 'board-size'];

const themePreviewImages: Record<Theme, string> = {
    'code-vibes': `${imageFolder}/code_vibes.png`,
    gaming: `${imageFolder}/gaming_theme.png`,
    'da-projects': `${imageFolder}/da_theme.png`,
    foods: `${imageFolder}/food_theme.png`,
};

export function setupHomeScreen(homeScreen: HTMLElement) {
    const previewImage = getHomeElement<HTMLImageElement>(homeScreen, '.home-screen__preview-image');
    const footerInfo = getFooterInfo(homeScreen);

    homeScreen.addEventListener('change', event => {
        updateThemePreview(event, previewImage, footerInfo.theme);
        updatePlayerInfo(event, footerInfo.player);
        updateBoardSizeInfo(event, footerInfo.boardSize);
        updateSeparatorStates(homeScreen, footerInfo);
        updateStartButtonState(homeScreen, footerInfo.startButton);
    });

    showSelectedTheme(homeScreen, previewImage, footerInfo.theme);
    updateSeparatorStates(homeScreen, footerInfo);
    updateStartButtonState(homeScreen, footerInfo.startButton);
}

function updateThemePreview(event: Event, previewImage: HTMLImageElement, footerLabel: HTMLElement) {
    const themeInput = getChangedRadioInput(event, 'theme');

    if (themeInput) {
        showThemePreview(themeInput, previewImage, footerLabel);
    }
}

function showThemePreview(input: HTMLInputElement, previewImage: HTMLImageElement, footerLabel: HTMLElement, animateLabel = true) {
    if (!isTheme(input.value)) {
        return;
    }

    previewImage.src = themePreviewImages[input.value];
    setFooterText(footerLabel, getOptionText(input), animateLabel);
}

function updatePlayerInfo(event: Event, footerLabel: HTMLElement) {
    const playerInput = getChangedRadioInput(event, 'player');

    if (playerInput) {
        setFooterText(footerLabel, `${getOptionText(playerInput)} Player`);
    }
}

function updateBoardSizeInfo(event: Event, footerLabel: HTMLElement) {
    const boardSizeInput = getChangedRadioInput(event, 'board-size');

    if (boardSizeInput) {
        setFooterText(footerLabel, `Board ${getOptionText(boardSizeInput)}`);
    }
}

function showSelectedTheme(homeScreen: HTMLElement, previewImage: HTMLImageElement, footerLabel: HTMLElement) {
    const checkedTheme = homeScreen.querySelector<HTMLInputElement>('input[name="theme"]:checked');

    if (checkedTheme) {
        showThemePreview(checkedTheme, previewImage, footerLabel, false);
    }
}

function getFooterInfo(homeScreen: HTMLElement): FooterInfo {
    return {
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

function setFooterText(footerLabel: HTMLElement, text: string, animate = true) {
    if (footerLabel.innerText === text) {
        return;
    }

    if (!animate) {
        setFooterTextNow(footerLabel, text);
        return;
    }

    animateFooterText(footerLabel, text);
}

function setFooterTextNow(footerLabel: HTMLElement, text: string) {
    footerLabel.innerText = text;
}

function animateFooterText(footerLabel: HTMLElement, text: string) {
    footerLabel.classList.add('home-screen__footer-info--changing');

    window.setTimeout(() => {
        setFooterTextNow(footerLabel, text);
        footerLabel.classList.remove('home-screen__footer-info--changing');
    }, 120);
}

function isTheme(value: string): value is Theme {
    return value in themePreviewImages;
}