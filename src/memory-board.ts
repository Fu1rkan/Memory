import { getClosestElement } from './dom';
import {
  addSelectedCard,
  clearSelectedCards,
  getCurrentPlayer,
  getScores,
  getSelectedCards,
  increaseCurrentPlayerScore,
  isBoardLocked,
  lockBoard,
  resetBoardState,
  switchCurrentPlayer,
  unlockBoard,
} from './game-board-state';
import { finishGame } from './game-finish';
import {
  getGameScreenTheme,
  getSelectedBoardSize,
  getSelectedPlayer,
  getSelectedTheme,
  type BoardSize,
} from './game-settings';
import type { GameTheme } from './game-themes';
import { updateCurrentPlayerIndicator } from './current-player';
import { createMemoryCard, createShuffledCardImages } from './memory-card';
import { updatePlayerScores } from './player-status';

const CARD_MISMATCH_DELAY = 600;

/** Connects memory card clicks with the game logic. */
export function setupMemoryCards(gameScreen: HTMLElement): void {
  gameScreen.addEventListener('click', event => {
    const card = getClosestElement(event, '.game-screen__card');

    if (card instanceof HTMLButtonElement) {
      handleMemoryCardClick(card, gameScreen);
    }
  });
}

/** Renders the board again based on the selected start options. */
export function renderSelectedBoard(gameScreen: HTMLElement, homeScreen: HTMLElement): void {
  const selectedTheme = getSelectedTheme(homeScreen);
  const boardSize = getSelectedBoardSize(homeScreen);
  const selectedPlayer = getSelectedPlayer(homeScreen);
  const cards = createBoardCards(selectedTheme, boardSize);

  resetBoardState(selectedPlayer);
  updateBoardHeader(gameScreen, selectedTheme);
  setBoardSize(gameScreen, boardSize);
  getMemoryBoard(gameScreen).replaceChildren(...cards);
}

/** Creates all cards for the current board. */
function createBoardCards(selectedTheme: GameTheme, boardSize: BoardSize): HTMLButtonElement[] {
  return createShuffledCardImages(selectedTheme, boardSize)
    .map((imageSrc, index) => createMemoryCard(imageSrc, index));
}

/** Updates the player indicator and scores in the header. */
function updateBoardHeader(gameScreen: HTMLElement, selectedTheme: GameTheme): void {
  updateCurrentPlayerIndicator(gameScreen, selectedTheme, getCurrentPlayer());
  updatePlayerScores(gameScreen, selectedTheme, getScores());
}

/** Writes the board size to the DOM for styling. */
function setBoardSize(gameScreen: HTMLElement, boardSize: BoardSize): void {
  gameScreen.dataset.boardSize = String(boardSize);
}

/** Handles the click on a single memory card. */
function handleMemoryCardClick(card: HTMLButtonElement, gameScreen: HTMLElement): void {
  if (isBoardLocked() || isCardOpen(card)) {
    return;
  }

  openMemoryCard(card);
  addSelectedCard(card);
  compareCardsWhenPairIsSelected(gameScreen);
}

/** Compares the cards as soon as two cards are open. */
function compareCardsWhenPairIsSelected(gameScreen: HTMLElement): void {
  if (getSelectedCards().length === 2) {
    checkSelectedCards(gameScreen);
  }
}

/** Decides whether the selected cards match. */
function checkSelectedCards(gameScreen: HTMLElement): void {
  const [firstCard, secondCard] = getSelectedCards();

  if (haveSameCardImage(firstCard, secondCard)) {
    handleMatchingCards(gameScreen, firstCard, secondCard);
  } else {
    handleMismatchedCards(gameScreen, firstCard, secondCard);
  }
}

/** Checks whether two cards use the same image. */
function haveSameCardImage(firstCard: HTMLButtonElement, secondCard: HTMLButtonElement): boolean {
  return firstCard.dataset.cardImage === secondCard.dataset.cardImage;
}

/** Resolves a matching card pair. */
function handleMatchingCards(
  gameScreen: HTMLElement,
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  updateScoreForCurrentPlayer(gameScreen);
  markCardsAsMatched(firstCard, secondCard);
  clearSelectedCards();
  finishGameWhenBoardIsComplete(gameScreen);
}

/** Resolves a mismatched card pair. */
function handleMismatchedCards(
  gameScreen: HTMLElement,
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  lockBoard();
  window.setTimeout(() => resetMismatchedCards(gameScreen, firstCard, secondCard), CARD_MISMATCH_DELAY);
}

/** Resets a mismatched pair and switches the player. */
function resetMismatchedCards(
  gameScreen: HTMLElement,
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  closeMemoryCard(firstCard);
  closeMemoryCard(secondCard);
  clearSelectedCards();
  unlockBoard();
  updateCurrentPlayerAfterMismatch(gameScreen);
}

/** Increases the current player's score in state and UI. */
function updateScoreForCurrentPlayer(gameScreen: HTMLElement): void {
  const scores = increaseCurrentPlayerScore();

  updatePlayerScores(gameScreen, getGameScreenTheme(gameScreen), scores);
}

/** Updates the active player indicator after a mismatch. */
function updateCurrentPlayerAfterMismatch(gameScreen: HTMLElement): void {
  const currentPlayer = switchCurrentPlayer();

  updateCurrentPlayerIndicator(gameScreen, getGameScreenTheme(gameScreen), currentPlayer);
}

/** Finishes the game once all cards were matched. */
function finishGameWhenBoardIsComplete(gameScreen: HTMLElement): void {
  if (isGameFinished(gameScreen)) {
    finishGame(gameScreen);
  }
}

/** Marks cards as permanently matched. */
function markCardsAsMatched(...cards: HTMLButtonElement[]): void {
  cards.forEach(card => {
    card.classList.add('game-screen__card--matched');
    card.disabled = true;
    card.setAttribute('aria-pressed', 'true');
  });
}

/** Opens a card visually and for assistive technology. */
function openMemoryCard(card: HTMLButtonElement): void {
  card.classList.add('game-screen__card--flipped');
  card.setAttribute('aria-pressed', 'true');
}

/** Closes a card visually and for assistive technology. */
function closeMemoryCard(card: HTMLButtonElement): void {
  card.classList.remove('game-screen__card--flipped');
  card.setAttribute('aria-pressed', 'false');
}

/** Checks whether a card is already open or matched. */
function isCardOpen(card: HTMLButtonElement): boolean {
  return card.classList.contains('game-screen__card--flipped')
    || card.classList.contains('game-screen__card--matched');
}

/** Checks whether all cards were matched. */
function isGameFinished(gameScreen: HTMLElement): boolean {
  const cards = [...gameScreen.querySelectorAll<HTMLButtonElement>('.game-screen__card')];

  return cards.length > 0 && cards.every(isMatchedCard);
}

/** Checks whether a card has already been matched. */
function isMatchedCard(card: HTMLButtonElement): boolean {
  return card.classList.contains('game-screen__card--matched');
}

/** Returns the board element or reports a structure error. */
function getMemoryBoard(gameScreen: HTMLElement): HTMLElement {
  const board = gameScreen.querySelector<HTMLElement>('#memory-board');

  if (!board) {
    throw new Error('Memory board was not found.');
  }

  return board;
}
