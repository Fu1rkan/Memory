import { getClosestElement, getDialogById } from './dom';
import { cardImages } from './card-images';
import { exitButtonVisuals, quitDialogButtonVisuals, type ButtonVisuals } from './button-visuals';
import { isGameTheme, type GameTheme } from './game-themes';
import { renderButtonVisuals } from './render-button-visuals';
import { setupPlayerStatus, updatePlayerStatusVisuals } from './player-status';
import { showScreen } from './screen-navigation';

const boardSizes = [16, 24, 36] as const;
type BoardSize = typeof boardSizes[number];

export function setupGameScreen(gameScreen: HTMLElement, homeScreen: HTMLElement, startScreen: HTMLElement) {
    const quitGameDialog = getDialogById('quit-game-dialog');

    setupPlayerStatus(gameScreen);
    setupHomeStartButton(gameScreen, homeScreen, startScreen);
    setupQuitDialog(gameScreen, homeScreen, quitGameDialog);
    setupMemoryCards(gameScreen);
    applySelectedTheme(gameScreen, homeScreen);
}

function setupHomeStartButton(gameScreen: HTMLElement, homeScreen: HTMLElement, startScreen: HTMLElement) {
    homeScreen.addEventListener('click', event => {
        const startButton = getClosestElement(event, '.home-screen__footer-button--start');

        if (startButton) {
            showGameScreen(gameScreen, homeScreen, startScreen);
        }
    });
}

function setupQuitDialog(gameScreen: HTMLElement, homeScreen: HTMLElement, quitGameDialog: HTMLDialogElement) {
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
            showScreen(homeScreen, gameScreen);
        }
    });
}

function showQuitGameDialog(quitGameDialog: HTMLDialogElement) {
    if (!quitGameDialog.open) {
        quitGameDialog.showModal();
    }
}

function showGameScreen(gameScreen: HTMLElement, homeScreen: HTMLElement, startScreen: HTMLElement) {
    applySelectedTheme(gameScreen, homeScreen);
    renderSelectedBoard(gameScreen, homeScreen);
    showScreen(gameScreen, homeScreen, startScreen);
}

function applySelectedTheme(gameScreen: HTMLElement, homeScreen: HTMLElement) {
    const selectedTheme = getSelectedTheme(homeScreen);

    gameScreen.dataset.theme = selectedTheme;
    updatePlayerStatusVisuals(gameScreen, selectedTheme);
    updateExitButtonVisuals(gameScreen, selectedTheme);
    updateQuitDialogButtonVisuals(gameScreen, selectedTheme);
}

function updateExitButtonVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme) {
    const exitButton = gameScreen.querySelector<HTMLElement>('.game-screen__exit-button');

    if (!exitButton) {
        throw new Error('Game screen exit button was not found.');
    }

    renderButtonVisuals(exitButton, exitButtonVisuals[selectedTheme], 'game-screen__exit-button-image');
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

    renderButtonVisuals(button, visuals, 'game-screen__quit-dialog-button-image');
}

function getSelectedTheme(homeScreen: HTMLElement): GameTheme {
    const selectedTheme = homeScreen.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value;

    return isGameTheme(selectedTheme) ? selectedTheme : 'code-vibes';
}

function renderSelectedBoard(gameScreen: HTMLElement, homeScreen: HTMLElement) {
    const selectedTheme = getSelectedTheme(homeScreen);
    const boardSize = getSelectedBoardSize(homeScreen);
    const board = getMemoryBoard(gameScreen);
    const cards = createShuffledCardImages(selectedTheme, boardSize)
        .map((imageSrc, index) => createMemoryCard(imageSrc, index));

    gameScreen.dataset.boardSize = String(boardSize);
    board.replaceChildren(...cards);
}

function setupMemoryCards(gameScreen: HTMLElement) {
    gameScreen.addEventListener('click', event => {
        const card = getClosestElement(event, '.game-screen__card');

        if (card) {
            flipMemoryCard(card);
        }
    });
}

function getSelectedBoardSize(homeScreen: HTMLElement): BoardSize {
    const selectedBoardSize = homeScreen.querySelector<HTMLInputElement>('input[name="board-size"]:checked');

    if (!selectedBoardSize) {
        throw new Error('No board size selected.');
    }

    const boardSize = Number(selectedBoardSize.value);

    if (!isBoardSize(boardSize)) {
        throw new Error(`Unsupported board size "${selectedBoardSize.value}".`);
    }

    return boardSize;
}

function isBoardSize(value: number): value is BoardSize {
    return boardSizes.includes(value as BoardSize);
}

function getMemoryBoard(gameScreen: HTMLElement) {
    const board = gameScreen.querySelector<HTMLElement>('#memory-board');

    if (!board) {
        throw new Error('Memory board was not found.');
    }

    return board;
}

function createShuffledCardImages(selectedTheme: GameTheme, boardSize: BoardSize) {
    const pairCount = boardSize / 2;
    const selectedImages = getRandomCardImages(cardImages[selectedTheme], pairCount);
    const cardImagePairs = selectedImages.flatMap(imageSrc => [imageSrc, imageSrc]);

    return shuffle(cardImagePairs);
}

function getRandomCardImages(images: string[], count: number) {
    if (images.length === 0) {
        throw new Error('No card images found for selected theme.');
    }

    const selectedImages = shuffle([...images]).slice(0, count);

    while (selectedImages.length < count) {
        selectedImages.push(images[Math.floor(Math.random() * images.length)]);
    }

    return selectedImages;
}

function shuffle<T>(items: T[]) {
    const shuffledItems = [...items];

    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
    }

    return shuffledItems;
}

function createMemoryCard(imageSrc: string, index: number) {
    const card = document.createElement('button');
    const cardInner = document.createElement('span');
    const cardBack = document.createElement('span');
    const cardFront = document.createElement('span');
    const cardImage = document.createElement('img');

    card.className = 'game-screen__card';
    card.type = 'button';
    card.setAttribute('aria-label', `Memory card ${index + 1}`);
    card.setAttribute('aria-pressed', 'false');
    cardInner.className = 'game-screen__card-inner';
    cardBack.className = 'game-screen__card-face game-screen__card-face--back';
    cardFront.className = 'game-screen__card-face game-screen__card-face--front';
    cardImage.className = 'game-screen__card-image';
    cardImage.src = imageSrc;
    cardImage.alt = '';
    cardImage.draggable = false;
    cardFront.append(cardImage);
    cardInner.append(cardBack, cardFront);
    card.append(cardInner);

    return card;
}

function flipMemoryCard(card: Element) {
    const isFlipped = card.classList.toggle('game-screen__card--flipped');

    card.setAttribute('aria-pressed', String(isFlipped));
}
