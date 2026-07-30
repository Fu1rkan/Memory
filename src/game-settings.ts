import { isPlayerColor, type PlayerColor } from './current-player';
import { isGameTheme, type GameTheme } from './game-themes';

const BOARD_SIZES = [16, 24, 36] as const;
const DEFAULT_GAME_THEME: GameTheme = 'code-vibes';

export type BoardSize = typeof BOARD_SIZES[number];

/** Returns the currently selected theme from the start options. */
export function getSelectedTheme(homeScreen: HTMLElement): GameTheme {
  const selectedTheme = getCheckedInputValue(homeScreen, 'theme');

  return isGameTheme(selectedTheme) ? selectedTheme : DEFAULT_GAME_THEME;
}

/** Returns the theme currently active on the game screen. */
export function getGameScreenTheme(gameScreen: HTMLElement): GameTheme {
  const selectedTheme = gameScreen.dataset.theme;

  return isGameTheme(selectedTheme) ? selectedTheme : DEFAULT_GAME_THEME;
}

/** Returns the selected starting player. */
export function getSelectedPlayer(homeScreen: HTMLElement): PlayerColor {
  const selectedPlayer = getCheckedInputValue(homeScreen, 'player');

  if (!isPlayerColor(selectedPlayer)) {
    throw new Error('No player color selected.');
  }

  return selectedPlayer;
}

/** Returns the selected number of memory cards. */
export function getSelectedBoardSize(homeScreen: HTMLElement): BoardSize {
  const selectedBoardSize = getRequiredCheckedInput(homeScreen, 'board-size');
  const boardSize = Number(selectedBoardSize.value);

  return parseBoardSize(boardSize, selectedBoardSize.value);
}

/** Returns the value of a checked radio input. */
function getCheckedInputValue(root: HTMLElement, inputName: string): string | undefined {
  return root.querySelector<HTMLInputElement>(`input[name="${inputName}"]:checked`)?.value;
}

/** Returns a checked radio input or fails intentionally. */
function getRequiredCheckedInput(root: HTMLElement, inputName: string): HTMLInputElement {
  const input = root.querySelector<HTMLInputElement>(`input[name="${inputName}"]:checked`);

  if (!input) {
    throw new Error(`No "${inputName}" option selected.`);
  }

  return input;
}

/** Converts a number into an allowed board size. */
function parseBoardSize(boardSize: number, rawValue: string): BoardSize {
  if (!isBoardSize(boardSize)) {
    throw new Error(`Unsupported board size "${rawValue}".`);
  }

  return boardSize;
}

/** Checks whether a number is an allowed board size. */
function isBoardSize(value: number): value is BoardSize {
  return BOARD_SIZES.includes(value as BoardSize);
}
