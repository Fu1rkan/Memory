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
import { resetCardRevealMode } from './game-dev-tools';
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

/** Verbindet Klicks auf Memory-Karten mit der Spiellogik. */
export function setupMemoryCards(gameScreen: HTMLElement): void {
  gameScreen.addEventListener('click', event => {
    const card = getClosestElement(event, '.game-screen__card');

    if (card instanceof HTMLButtonElement) {
      handleMemoryCardClick(card, gameScreen);
    }
  });
}

/** Rendert das Board passend zu den gewaehlten Startoptionen neu. */
export function renderSelectedBoard(gameScreen: HTMLElement, homeScreen: HTMLElement): void {
  const selectedTheme = getSelectedTheme(homeScreen);
  const boardSize = getSelectedBoardSize(homeScreen);
  const selectedPlayer = getSelectedPlayer(homeScreen);
  const cards = createBoardCards(selectedTheme, boardSize);

  resetBoardState(selectedPlayer);
  resetCardRevealMode(gameScreen);
  updateBoardHeader(gameScreen, selectedTheme);
  setBoardSize(gameScreen, boardSize);
  getMemoryBoard(gameScreen).replaceChildren(...cards);
}

/** Erstellt alle Karten fuer das aktuelle Board. */
function createBoardCards(selectedTheme: GameTheme, boardSize: BoardSize): HTMLButtonElement[] {
  return createShuffledCardImages(selectedTheme, boardSize)
    .map((imageSrc, index) => createMemoryCard(imageSrc, index));
}

/** Aktualisiert Spieleranzeige und Punkte im Header. */
function updateBoardHeader(gameScreen: HTMLElement, selectedTheme: GameTheme): void {
  updateCurrentPlayerIndicator(gameScreen, selectedTheme, getCurrentPlayer());
  updatePlayerScores(gameScreen, selectedTheme, getScores());
}

/** Schreibt die Board-Groesse fuer das Styling ans DOM. */
function setBoardSize(gameScreen: HTMLElement, boardSize: BoardSize): void {
  gameScreen.dataset.boardSize = String(boardSize);
}

/** Verarbeitet den Klick auf eine einzelne Memory-Karte. */
function handleMemoryCardClick(card: HTMLButtonElement, gameScreen: HTMLElement): void {
  if (isBoardLocked() || isCardOpen(card)) {
    return;
  }

  openMemoryCard(card);
  addSelectedCard(card);
  compareCardsWhenPairIsSelected(gameScreen);
}

/** Vergleicht die Karten, sobald zwei Karten offen sind. */
function compareCardsWhenPairIsSelected(gameScreen: HTMLElement): void {
  if (getSelectedCards().length === 2) {
    checkSelectedCards(gameScreen);
  }
}

/** Entscheidet, ob die ausgewaehlten Karten gleich sind. */
function checkSelectedCards(gameScreen: HTMLElement): void {
  const [firstCard, secondCard] = getSelectedCards();

  if (haveSameCardImage(firstCard, secondCard)) {
    handleMatchingCards(gameScreen, firstCard, secondCard);
  } else {
    handleMismatchedCards(gameScreen, firstCard, secondCard);
  }
}

/** Prueft, ob zwei Karten dasselbe Bild tragen. */
function haveSameCardImage(firstCard: HTMLButtonElement, secondCard: HTMLButtonElement): boolean {
  return firstCard.dataset.cardImage === secondCard.dataset.cardImage;
}

/** Wertet ein richtiges Kartenpaar aus. */
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

/** Wertet ein falsches Kartenpaar aus. */
function handleMismatchedCards(
  gameScreen: HTMLElement,
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  lockBoard();
  window.setTimeout(() => resetMismatchedCards(gameScreen, firstCard, secondCard), CARD_MISMATCH_DELAY);
}

/** Setzt ein falsches Paar zurueck und wechselt den Spieler. */
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

/** Erhoeht die Punkte des aktuellen Spielers im State und UI. */
function updateScoreForCurrentPlayer(gameScreen: HTMLElement): void {
  const scores = increaseCurrentPlayerScore();

  updatePlayerScores(gameScreen, getGameScreenTheme(gameScreen), scores);
}

/** Wechselt nach einem falschen Paar die Spieleranzeige. */
function updateCurrentPlayerAfterMismatch(gameScreen: HTMLElement): void {
  const currentPlayer = switchCurrentPlayer();

  updateCurrentPlayerIndicator(gameScreen, getGameScreenTheme(gameScreen), currentPlayer);
}

/** Beendet das Spiel, sobald alle Karten gefunden wurden. */
function finishGameWhenBoardIsComplete(gameScreen: HTMLElement): void {
  if (isGameFinished(gameScreen)) {
    finishGame(gameScreen);
  }
}

/** Markiert Karten als dauerhaft gefunden. */
function markCardsAsMatched(...cards: HTMLButtonElement[]): void {
  cards.forEach(card => {
    card.classList.add('game-screen__card--matched');
    card.disabled = true;
    card.setAttribute('aria-pressed', 'true');
  });
}

/** Oeffnet eine Karte visuell und fuer Assistive Technology. */
function openMemoryCard(card: HTMLButtonElement): void {
  card.classList.add('game-screen__card--flipped');
  card.setAttribute('aria-pressed', 'true');
}

/** Schliesst eine Karte visuell und fuer Assistive Technology. */
function closeMemoryCard(card: HTMLButtonElement): void {
  card.classList.remove('game-screen__card--flipped');
  card.setAttribute('aria-pressed', 'false');
}

/** Prueft, ob eine Karte schon offen oder gefunden ist. */
function isCardOpen(card: HTMLButtonElement): boolean {
  return card.classList.contains('game-screen__card--flipped')
    || card.classList.contains('game-screen__card--matched');
}

/** Prueft, ob alle Karten gefunden wurden. */
function isGameFinished(gameScreen: HTMLElement): boolean {
  const cards = [...gameScreen.querySelectorAll<HTMLButtonElement>('.game-screen__card')];

  return cards.length > 0 && cards.every(isMatchedCard);
}

/** Prueft, ob eine Karte bereits gefunden wurde. */
function isMatchedCard(card: HTMLButtonElement): boolean {
  return card.classList.contains('game-screen__card--matched');
}

/** Gibt das Board-Element zurueck oder meldet einen Strukturfehler. */
function getMemoryBoard(gameScreen: HTMLElement): HTMLElement {
  const board = gameScreen.querySelector<HTMLElement>('#memory-board');

  if (!board) {
    throw new Error('Memory board was not found.');
  }

  return board;
}
