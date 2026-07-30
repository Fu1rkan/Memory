import { isPlayerColor, type PlayerColor } from './current-player';
import { isGameTheme, type GameTheme } from './game-themes';

const BOARD_SIZES = [16, 24, 36] as const;
const DEFAULT_GAME_THEME: GameTheme = 'code-vibes';

export type BoardSize = typeof BOARD_SIZES[number];

/** Gibt das aktuell gewaehlte Theme der Startauswahl zurueck. */
export function getSelectedTheme(homeScreen: HTMLElement): GameTheme {
  const selectedTheme = getCheckedInputValue(homeScreen, 'theme');

  return isGameTheme(selectedTheme) ? selectedTheme : DEFAULT_GAME_THEME;
}

/** Gibt das Theme zurueck, das aktuell am Game Screen aktiv ist. */
export function getGameScreenTheme(gameScreen: HTMLElement): GameTheme {
  const selectedTheme = gameScreen.dataset.theme;

  return isGameTheme(selectedTheme) ? selectedTheme : DEFAULT_GAME_THEME;
}

/** Gibt den gewaehlten Startspieler zurueck. */
export function getSelectedPlayer(homeScreen: HTMLElement): PlayerColor {
  const selectedPlayer = getCheckedInputValue(homeScreen, 'player');

  if (!isPlayerColor(selectedPlayer)) {
    throw new Error('No player color selected.');
  }

  return selectedPlayer;
}

/** Gibt die gewaehlte Anzahl an Memory-Karten zurueck. */
export function getSelectedBoardSize(homeScreen: HTMLElement): BoardSize {
  const selectedBoardSize = getRequiredCheckedInput(homeScreen, 'board-size');
  const boardSize = Number(selectedBoardSize.value);

  return parseBoardSize(boardSize, selectedBoardSize.value);
}

/** Gibt den Wert eines ausgewaehlten Radio-Inputs zurueck. */
function getCheckedInputValue(root: HTMLElement, inputName: string): string | undefined {
  return root.querySelector<HTMLInputElement>(`input[name="${inputName}"]:checked`)?.value;
}

/** Gibt einen ausgewaehlten Radio-Input zurueck oder bricht bewusst ab. */
function getRequiredCheckedInput(root: HTMLElement, inputName: string): HTMLInputElement {
  const input = root.querySelector<HTMLInputElement>(`input[name="${inputName}"]:checked`);

  if (!input) {
    throw new Error(`No "${inputName}" option selected.`);
  }

  return input;
}

/** Wandelt eine Zahl in eine erlaubte Board-Groesse um. */
function parseBoardSize(boardSize: number, rawValue: string): BoardSize {
  if (!isBoardSize(boardSize)) {
    throw new Error(`Unsupported board size "${rawValue}".`);
  }

  return boardSize;
}

/** Prueft, ob eine Zahl eine erlaubte Board-Groesse ist. */
function isBoardSize(value: number): value is BoardSize {
  return BOARD_SIZES.includes(value as BoardSize);
}
