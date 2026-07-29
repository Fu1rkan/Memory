import { getClosestElement, getDialogById } from './dom';
import { cardImages } from './card-images';
import { getNextPlayer, isPlayerColor, type PlayerColor, updateCurrentPlayerIndicator } from './current-player';
import { exitButtonVisuals, quitDialogButtonVisuals, type ButtonVisuals } from './button-visuals';
import { isGameTheme, type GameTheme } from './game-themes';
import { renderButtonVisuals } from './render-button-visuals';
import { setupPlayerStatus, updatePlayerScores, updatePlayerStatusVisuals } from './player-status';
import { showScreen } from './screen-navigation';

const boardSizes = [16, 24, 36] as const;
const cardMismatchDelay = 600;
const quitDialogClosingClass = 'game-screen__quit-dialog--closing';
const quitDialogBackdropClosingClass = 'game-screen__quit-dialog--backdrop-closing';
const revealingCardsClass = 'game-screen--revealing-cards';
const daQuitDialogCloseAnimationDelay = 250;
const codeVibesQuitDialogBackdropCloseAnimationDelay = 250;
export const gameFinishedEventName = 'memory:game-finished';
export type PlayerScores = Record<PlayerColor, number>;
export type WinnerResult = PlayerColor | 'draw';
export type GameFinishedEventDetail = {
    skipDelay?: boolean;
    theme: GameTheme;
    scores: PlayerScores;
    winner: WinnerResult;
};

type BoardSize = typeof boardSizes[number];
type BoardState = {
    currentPlayer: PlayerColor;
    scores: PlayerScores;
    selectedCards: HTMLButtonElement[];
    isLocked: boolean;
};

const boardState: BoardState = {
    currentPlayer: 'blue',
    scores: createInitialPlayerScores(),
    selectedCards: [],
    isLocked: false,
};

export function setupGameScreen(gameScreen: HTMLElement, homeScreen: HTMLElement, startScreen: HTMLElement) {
    const quitGameDialog = getDialogById('quit-game-dialog');

    setupPlayerStatus(gameScreen);
    setupHomeStartButton(gameScreen, homeScreen, startScreen);
    setupQuitDialog(gameScreen, homeScreen, quitGameDialog);
    setupDevButtons(gameScreen);
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
            closeQuitGameDialog(gameScreen, quitGameDialog);
        }

        if (confirmExitButton) {
            quitGameDialog.close();
            showScreen(homeScreen, gameScreen);
        }
    });
}

function setupDevButtons(gameScreen: HTMLElement) {
    gameScreen.addEventListener('click', event => {
        const devFinishButton = getClosestElement(event, '.game-screen__dev-finish-button');
        const devRevealButton = getClosestElement(event, '.game-screen__dev-reveal-button');

        if (devFinishButton) {
            finishGame(gameScreen, { skipDelay: true });
        }

        if (devRevealButton instanceof HTMLElement) {
            toggleCardRevealMode(gameScreen, devRevealButton);
        }
    });
}

function toggleCardRevealMode(gameScreen: HTMLElement, devRevealButton: HTMLElement) {
    const isRevealingCards = gameScreen.classList.toggle(revealingCardsClass);

    devRevealButton.textContent = isRevealingCards ? 'Hide cards' : 'Show cards';
    devRevealButton.setAttribute('aria-pressed', String(isRevealingCards));
}

function showQuitGameDialog(quitGameDialog: HTMLDialogElement) {
    if (!quitGameDialog.open) {
        quitGameDialog.classList.remove(quitDialogClosingClass, quitDialogBackdropClosingClass);
        quitGameDialog.showModal();
    }
}

function closeQuitGameDialog(gameScreen: HTMLElement, quitGameDialog: HTMLDialogElement) {
    if (
        !quitGameDialog.open ||
        quitGameDialog.classList.contains(quitDialogClosingClass) ||
        quitGameDialog.classList.contains(quitDialogBackdropClosingClass)
    ) {
        return;
    }

    if (prefersReducedMotion()) {
        quitGameDialog.close();
        return;
    }

    if (gameScreen.dataset.theme === 'code-vibes') {
        closeCodeVibesQuitGameDialog(quitGameDialog);
        return;
    }

    if (gameScreen.dataset.theme === 'da-projects') {
        closeQuitGameDialogAfterAnimation(quitGameDialog, [quitDialogClosingClass], daQuitDialogCloseAnimationDelay);
        return;
    }

    quitGameDialog.close();
}

function closeCodeVibesQuitGameDialog(quitGameDialog: HTMLDialogElement) {
    quitGameDialog.classList.add(quitDialogBackdropClosingClass);

    window.setTimeout(() => {
        if (!quitGameDialog.open) {
            return;
        }

        quitGameDialog.classList.remove(quitDialogBackdropClosingClass);
        quitGameDialog.close();
    }, codeVibesQuitDialogBackdropCloseAnimationDelay);
}

function closeQuitGameDialogAfterAnimation(quitGameDialog: HTMLDialogElement, classNames: string[], animationDelay: number) {
    let didClose = false;

    const finishCloseAfterAnimation = (event: AnimationEvent) => {
        if (event.target !== quitGameDialog || event.pseudoElement) {
            return;
        }

        finishClose();
    };

    const finishClose = () => {
        if (didClose) {
            return;
        }

        didClose = true;
        quitGameDialog.removeEventListener('animationend', finishCloseAfterAnimation);
        quitGameDialog.classList.remove(...classNames);
        quitGameDialog.close();
    };

    quitGameDialog.classList.add(...classNames);
    quitGameDialog.addEventListener('animationend', finishCloseAfterAnimation);
    window.setTimeout(finishClose, animationDelay + 100);
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    const selectedPlayer = getSelectedPlayer(homeScreen);
    const boardSize = getSelectedBoardSize(homeScreen);
    const board = getMemoryBoard(gameScreen);
    const cards = createShuffledCardImages(selectedTheme, boardSize)
        .map((imageSrc, index) => createMemoryCard(imageSrc, index));

    resetBoardState(selectedPlayer);
    resetCardRevealMode(gameScreen);
    updateCurrentPlayerIndicator(gameScreen, selectedTheme, boardState.currentPlayer);
    updatePlayerScores(gameScreen, selectedTheme, boardState.scores);
    gameScreen.dataset.boardSize = String(boardSize);
    board.replaceChildren(...cards);
}

function resetCardRevealMode(gameScreen: HTMLElement) {
    const devRevealButton = gameScreen.querySelector<HTMLElement>('.game-screen__dev-reveal-button');

    gameScreen.classList.remove(revealingCardsClass);
    devRevealButton?.setAttribute('aria-pressed', 'false');

    if (devRevealButton) {
        devRevealButton.textContent = 'Show cards';
    }
}

function setupMemoryCards(gameScreen: HTMLElement) {
    gameScreen.addEventListener('click', event => {
        const card = getClosestElement(event, '.game-screen__card');

        if (card instanceof HTMLButtonElement) {
            handleMemoryCardClick(card, gameScreen);
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
    card.dataset.cardImage = imageSrc;
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

function handleMemoryCardClick(card: HTMLButtonElement, gameScreen: HTMLElement) {
    if (boardState.isLocked || isCardOpen(card)) {
        return;
    }

    openMemoryCard(card);
    boardState.selectedCards.push(card);

    if (boardState.selectedCards.length === 2) {
        checkSelectedCards(gameScreen);
    }
}

function checkSelectedCards(gameScreen: HTMLElement) {
    const [firstCard, secondCard] = boardState.selectedCards;

    if (firstCard.dataset.cardImage === secondCard.dataset.cardImage) {
        increaseCurrentPlayerScore(gameScreen);
        markCardsAsMatched(firstCard, secondCard);
        boardState.selectedCards = [];

        if (isGameFinished(gameScreen)) {
            finishGame(gameScreen);
        }

        return;
    }

    boardState.isLocked = true;

    window.setTimeout(() => {
        closeMemoryCard(firstCard);
        closeMemoryCard(secondCard);
        boardState.selectedCards = [];
        boardState.isLocked = false;
        switchCurrentPlayer(gameScreen);
    }, cardMismatchDelay);
}

function markCardsAsMatched(...cards: HTMLButtonElement[]) {
    cards.forEach(card => {
        card.classList.add('game-screen__card--matched');
        card.disabled = true;
        card.setAttribute('aria-pressed', 'true');
    });
}

function openMemoryCard(card: HTMLButtonElement) {
    card.classList.add('game-screen__card--flipped');
    card.setAttribute('aria-pressed', 'true');
}

function closeMemoryCard(card: HTMLButtonElement) {
    card.classList.remove('game-screen__card--flipped');
    card.setAttribute('aria-pressed', 'false');
}

function isCardOpen(card: HTMLButtonElement) {
    return card.classList.contains('game-screen__card--flipped')
        || card.classList.contains('game-screen__card--matched');
}

function isGameFinished(gameScreen: HTMLElement) {
    const cards = [...gameScreen.querySelectorAll<HTMLButtonElement>('.game-screen__card')];

    return cards.length > 0 && cards.every(card => card.classList.contains('game-screen__card--matched'));
}

function finishGame(gameScreen: HTMLElement, detail: Pick<GameFinishedEventDetail, 'skipDelay'> = {}) {
    const scores = { ...boardState.scores };

    gameScreen.dispatchEvent(new CustomEvent<GameFinishedEventDetail>(gameFinishedEventName, {
        detail: {
            ...detail,
            theme: getGameScreenTheme(gameScreen),
            scores,
            winner: getWinner(scores),
        },
    }));
}

function getWinner(scores: PlayerScores): WinnerResult {
    if (scores.blue === scores.orange) {
        return 'draw';
    }

    return scores.blue > scores.orange ? 'blue' : 'orange';
}

function switchCurrentPlayer(gameScreen: HTMLElement) {
    boardState.currentPlayer = getNextPlayer(boardState.currentPlayer);
    updateCurrentPlayerIndicator(gameScreen, getGameScreenTheme(gameScreen), boardState.currentPlayer);
}

function increaseCurrentPlayerScore(gameScreen: HTMLElement) {
    boardState.scores[boardState.currentPlayer] += 1;
    updatePlayerScores(gameScreen, getGameScreenTheme(gameScreen), boardState.scores);
}

function getSelectedPlayer(homeScreen: HTMLElement): PlayerColor {
    const selectedPlayer = homeScreen.querySelector<HTMLInputElement>('input[name="player"]:checked')?.value;

    if (!isPlayerColor(selectedPlayer)) {
        throw new Error('No player color selected.');
    }

    return selectedPlayer;
}

function getGameScreenTheme(gameScreen: HTMLElement): GameTheme {
    const selectedTheme = gameScreen.dataset.theme;

    return isGameTheme(selectedTheme) ? selectedTheme : 'code-vibes';
}

function resetBoardState(currentPlayer: PlayerColor) {
    boardState.currentPlayer = currentPlayer;
    boardState.scores = createInitialPlayerScores();
    boardState.selectedCards = [];
    boardState.isLocked = false;
}

function createInitialPlayerScores(): PlayerScores {
    return {
        blue: 0,
        orange: 0,
    };
}
