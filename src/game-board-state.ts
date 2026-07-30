import { getNextPlayer, type PlayerColor } from './current-player';
import type { PlayerScores } from './game-results';

type BoardState = {
  currentPlayer: PlayerColor;
  scores: PlayerScores;
  selectedCards: HTMLButtonElement[];
  isLocked: boolean;
};

const boardState: BoardState = createInitialBoardState();

/** Gibt den Spieler zurueck, der aktuell am Zug ist. */
export function getCurrentPlayer(): PlayerColor {
  return boardState.currentPlayer;
}

/** Gibt eine Kopie der aktuellen Punkte zurueck. */
export function getScores(): PlayerScores {
  return { ...boardState.scores };
}

/** Setzt den Board-State fuer ein neues Spiel zurueck. */
export function resetBoardState(currentPlayer: PlayerColor): void {
  boardState.currentPlayer = currentPlayer;
  boardState.scores = createInitialPlayerScores();
  boardState.selectedCards = [];
  boardState.isLocked = false;
}

/** Prueft, ob gerade keine weiteren Karten geoeffnet werden duerfen. */
export function isBoardLocked(): boolean {
  return boardState.isLocked;
}

/** Sperrt das Board, solange ein falsches Paar sichtbar ist. */
export function lockBoard(): void {
  boardState.isLocked = true;
}

/** Hebt die Board-Sperre wieder auf. */
export function unlockBoard(): void {
  boardState.isLocked = false;
}

/** Merkt sich eine aufgedeckte Karte fuer den Paarvergleich. */
export function addSelectedCard(card: HTMLButtonElement): void {
  boardState.selectedCards.push(card);
}

/** Gibt die aktuell ausgewaehlten Karten zurueck. */
export function getSelectedCards(): HTMLButtonElement[] {
  return boardState.selectedCards;
}

/** Entfernt alle aktuell ausgewaehlten Karten aus dem Vergleich. */
export function clearSelectedCards(): void {
  boardState.selectedCards = [];
}

/** Erhoeht die Punkte des aktuellen Spielers und gibt die neuen Punkte zurueck. */
export function increaseCurrentPlayerScore(): PlayerScores {
  boardState.scores[boardState.currentPlayer] += 1;

  return getScores();
}

/** Wechselt zum naechsten Spieler und gibt ihn zurueck. */
export function switchCurrentPlayer(): PlayerColor {
  boardState.currentPlayer = getNextPlayer(boardState.currentPlayer);

  return boardState.currentPlayer;
}

/** Erstellt den initialen Board-State. */
function createInitialBoardState(): BoardState {
  return {
    currentPlayer: 'blue',
    scores: createInitialPlayerScores(),
    selectedCards: [],
    isLocked: false,
  };
}

/** Erstellt leere Punkte fuer beide Spieler. */
function createInitialPlayerScores(): PlayerScores {
  return {
    blue: 0,
    orange: 0,
  };
}
