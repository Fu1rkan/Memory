type Theme = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';

type FooterInfo = {
    theme: HTMLElement;
    player: HTMLElement;
    boardSize: HTMLElement;
};

const imageFolder = `${import.meta.env.BASE_URL}img`;

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
    });

    showSelectedTheme(homeScreen, previewImage, footerInfo.theme);
}

function updateThemePreview(event: Event, previewImage: HTMLImageElement, footerLabel: HTMLElement) {
    const themeInput = getChangedRadioInput(event, 'theme');

    if (themeInput) {
        showThemePreview(themeInput, previewImage, footerLabel);
    }
}

function showThemePreview(input: HTMLInputElement, previewImage: HTMLImageElement, footerLabel: HTMLElement) {
    if (!isTheme(input.value)) {
        return;
    }

    previewImage.src = themePreviewImages[input.value];
    footerLabel.innerText = getOptionText(input);
}

function updatePlayerInfo(event: Event, footerLabel: HTMLElement) {
    const playerInput = getChangedRadioInput(event, 'player');

    if (playerInput) {
        footerLabel.innerText = `${getOptionText(playerInput)} Player`;
    }
}

function updateBoardSizeInfo(event: Event, footerLabel: HTMLElement) {
    const boardSizeInput = getChangedRadioInput(event, 'board-size');

    if (boardSizeInput) {
        footerLabel.innerText = `Board ${getOptionText(boardSizeInput)}`;
    }
}

function showSelectedTheme(homeScreen: HTMLElement, previewImage: HTMLImageElement, footerLabel: HTMLElement) {
    const checkedTheme = homeScreen.querySelector<HTMLInputElement>('input[name="theme"]:checked');

    if (checkedTheme) {
        showThemePreview(checkedTheme, previewImage, footerLabel);
    }
}

function getFooterInfo(homeScreen: HTMLElement): FooterInfo {
    return {
        theme: getHomeElement(homeScreen, '#game-theme-info'),
        player: getHomeElement(homeScreen, '#player-info'),
        boardSize: getHomeElement(homeScreen, '#board-size-info'),
    };
}

function getChangedRadioInput(event: Event, inputName: string) {
    const target = event.target;

    if (!(target instanceof HTMLInputElement) || target.name !== inputName) {
        return null;
    }

    return target;
}

function getHomeElement<T extends HTMLElement>(homeScreen: HTMLElement, selector: string) {
    const element = homeScreen.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Home screen element "${selector}" was not found.`);
    }

    return element;
}

function getOptionText(input: HTMLInputElement) {
    return input.closest('label')?.textContent?.trim() || '';
}

function isTheme(value: string): value is Theme {
    return value in themePreviewImages;
}
