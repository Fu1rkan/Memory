import { getNextPlayer, type PlayerColor } from './current-player';
import type { PlayerScores } from './game-results';

type BoardState = {
  currentPlayer: PlayerColor;
  scores: PlayerScores;
  selectedCards: HTMLButtonElement[];
  isLocked: boolean;
};

const boardState: BoardState = createInitialBoardState();

/** Returns the player whose turn is active. */
export function getCurrentPlayer(): PlayerColor {
  return boardState.currentPlayer;
}

/** Returns a copy of the current scores. */
export function getScores(): PlayerScores {
  return { ...boardState.scores };
}

/** Resets the board state for a new game. */
export function resetBoardState(currentPlayer: PlayerColor): void {
  boardState.currentPlayer = currentPlayer;
  boardState.scores = createInitialPlayerScores();
  boardState.selectedCards = [];
  boardState.isLocked = false;
}

/** Checks whether the board is currently locked. */
export function isBoardLocked(): boolean {
  return boardState.isLocked;
}

/** Locks the board while a mismatched pair is visible. */
export function lockBoard(): void {
  boardState.isLocked = true;
}

/** Unlocks the board again. */
export function unlockBoard(): void {
  boardState.isLocked = false;
}

/** Stores an opened card for the pair comparison. */
export function addSelectedCard(card: HTMLButtonElement): void {
  boardState.selectedCards.push(card);
}

/** Returns the currently selected cards. */
export function getSelectedCards(): HTMLButtonElement[] {
  return boardState.selectedCards;
}

/** Removes all currently selected cards from the comparison. */
export function clearSelectedCards(): void {
  boardState.selectedCards = [];
}

/** Increases the current player's score and returns the updated scores. */
export function increaseCurrentPlayerScore(): PlayerScores {
  boardState.scores[boardState.currentPlayer] += 1;

  return getScores();
}

/** Switches to the next player and returns that player. */
export function switchCurrentPlayer(): PlayerColor {
  boardState.currentPlayer = getNextPlayer(boardState.currentPlayer);

  return boardState.currentPlayer;
}

/** Creates the initial board state. */
function createInitialBoardState(): BoardState {
  return {
    currentPlayer: 'blue',
    scores: createInitialPlayerScores(),
    selectedCards: [],
    isLocked: false,
  };
}

/** Creates empty scores for both players. */
function createInitialPlayerScores(): PlayerScores {
  return {
    blue: 0,
    orange: 0,
  };
}
