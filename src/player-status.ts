import type { PlayerColor } from './current-player';
import type { GameTheme } from './game-themes';
import type { PlayerScores } from './game-results';
import { createChessPieceSvg } from './player-status-icons';

type PlayerStatusKey = 'orange' | 'blue';

type PlayerStatusItemVisual = {
  iconMarkup: string;
  counterLabel: string;
  counterMarkup?: string;
};

type PlayerStatusElements = {
  icon: HTMLElement;
  counter: HTMLElement;
};

type PlayerStatusVisuals = Record<PlayerStatusKey, PlayerStatusItemVisual>;

const DOUBLE_DIGIT_LIMIT = 9;
const GAMING_CHESS_WIDTH = 22;
const GAMING_CHESS_HEIGHT = 28;
const COMPACT_CHESS_WIDTH = 20;
const COMPACT_CHESS_HEIGHT = 25;
const ORANGE_CHESS_COLOR = 'rgba(234, 105, 0, 1)';
const BLUE_CHESS_COLOR = 'rgba(9, 127, 197, 1)';

const PLAYER_STATUS_SELECTORS: Record<PlayerStatusKey, { icon: string; counter: string }> = {
  orange: {
    icon: '.game-screen__player-status__orange__icon',
    counter: '.game-screen__player-status__orange__counter',
  },
  blue: {
    icon: '.game-screen__player-status__blue__icon',
    counter: '.game-screen__player-status__blue__counter',
  },
};

const GAMING_PLAYER_STATUS_VISUALS = createChessPiecePlayerStatusVisuals(
  GAMING_CHESS_WIDTH,
  GAMING_CHESS_HEIGHT,
);

const COMPACT_PLAYER_STATUS_VISUALS = createChessPiecePlayerStatusVisuals(
  COMPACT_CHESS_WIDTH,
  COMPACT_CHESS_HEIGHT,
);

let codeVibesPlayerStatusVisuals: PlayerStatusVisuals | undefined;

/** Stores the original Code Vibes display as a template. */
export function setupPlayerStatus(gameScreen: HTMLElement): void {
  const defaultPlayerStatusVisuals = getPlayerStatusVisuals(gameScreen);

  codeVibesPlayerStatusVisuals = createCodeVibesPlayerStatusVisuals(defaultPlayerStatusVisuals);
}

/** Replaces icons and counters based on the active theme. */
export function updatePlayerStatusVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme): void {
  const visuals = getThemePlayerStatusVisuals(selectedTheme);

  if (!visuals) {
    throw new Error('Player status visuals were not initialized.');
  }

  updatePlayerStatusItem(gameScreen, 'orange', visuals.orange);
  updatePlayerStatusItem(gameScreen, 'blue', visuals.blue);
}

/** Updates both scores and the container width when needed. */
export function updatePlayerScores(
  gameScreen: HTMLElement,
  selectedTheme: GameTheme,
  scores: PlayerScores,
): void {
  updatePlayerScore(gameScreen, selectedTheme, 'blue', scores.blue);
  updatePlayerScore(gameScreen, selectedTheme, 'orange', scores.orange);
  updatePlayerStatusSize(gameScreen, selectedTheme, scores);
}

/** Returns the display templates for the active theme. */
function getThemePlayerStatusVisuals(selectedTheme: GameTheme): PlayerStatusVisuals | undefined {
  switch (selectedTheme) {
    case 'code-vibes':
      return codeVibesPlayerStatusVisuals;
    case 'gaming':
      return GAMING_PLAYER_STATUS_VISUALS;
    case 'da-projects':
    case 'foods':
      return COMPACT_PLAYER_STATUS_VISUALS;
  }
}

/** Builds the Code Vibes display with text and an absolute number span. */
function createCodeVibesPlayerStatusVisuals(visuals: PlayerStatusVisuals): PlayerStatusVisuals {
  return {
    orange: createCodeVibesStatusVisual(visuals.orange, 'blue'),
    blue: createCodeVibesStatusVisual(visuals.blue, 'orange'),
  };
}

/** Creates a single Code Vibes player display. */
function createCodeVibesStatusVisual(
  visual: PlayerStatusItemVisual,
  playerColor: PlayerColor,
): PlayerStatusItemVisual {
  return {
    ...visual,
    counterLabel: `${getPlayerLabel(playerColor)} 0`,
    counterMarkup: createCodeVibesScoreMarkup(playerColor, 0),
  };
}

/** Updates the icon and counter of one status item. */
function updatePlayerStatusItem(
  gameScreen: HTMLElement,
  statusKey: PlayerStatusKey,
  visual: PlayerStatusItemVisual,
): void {
  const elements = getPlayerStatusElements(gameScreen, statusKey);

  renderPlayerStatusIcon(elements.icon, visual.iconMarkup);
  renderPlayerStatusCounter(elements.counter, visual);
}

/** Renders the icon of a player display. */
function renderPlayerStatusIcon(iconElement: HTMLElement, iconMarkup: string): void {
  iconElement.innerHTML = iconMarkup;
  iconElement.querySelector('svg')?.setAttribute('focusable', 'false');
}

/** Renders the counter of a player display. */
function renderPlayerStatusCounter(
  counterElement: HTMLElement,
  visual: PlayerStatusItemVisual,
): void {
  if (visual.counterMarkup) {
    counterElement.innerHTML = visual.counterMarkup;
  } else {
    counterElement.textContent = visual.counterLabel;
  }
}

/** Updates the score of a single player. */
function updatePlayerScore(
  gameScreen: HTMLElement,
  selectedTheme: GameTheme,
  playerColor: PlayerColor,
  score: number,
): void {
  const statusKey = getStatusKeyForPlayer(selectedTheme, playerColor);
  const counterElement = getPlayerStatusCounterElement(gameScreen, statusKey);

  setPlayerScoreText(counterElement, selectedTheme, playerColor, score);
}

/** Sets the visible score text based on the theme. */
function setPlayerScoreText(
  counterElement: HTMLElement,
  selectedTheme: GameTheme,
  playerColor: PlayerColor,
  score: number,
): void {
  if (selectedTheme === 'code-vibes') {
    counterElement.innerHTML = createCodeVibesScoreMarkup(playerColor, score);
  } else {
    counterElement.textContent = String(score);
  }
}

/** Expands the player display when the relevant score becomes double-digit. */
function updatePlayerStatusSize(
  gameScreen: HTMLElement,
  selectedTheme: GameTheme,
  scores: PlayerScores,
): void {
  const playerStatusElement = gameScreen.querySelector<HTMLElement>('.game-screen__player-status');

  if (playerStatusElement) {
    toggleExpandedScoreClass(playerStatusElement, selectedTheme, scores);
  }
}

/** Toggles the class for larger double-digit scores. */
function toggleExpandedScoreClass(
  playerStatusElement: HTMLElement,
  selectedTheme: GameTheme,
  scores: PlayerScores,
): void {
  const scoreThatNeedsMoreSpace = selectedTheme === 'code-vibes' ? scores.orange : scores.blue;

  playerStatusElement.classList.toggle(
    'game-screen__player-status--expanded-score',
    scoreThatNeedsMoreSpace > DOUBLE_DIGIT_LIMIT,
  );
}

/** Maps the player to the visible status item. */
function getStatusKeyForPlayer(selectedTheme: GameTheme, playerColor: PlayerColor): PlayerStatusKey {
  if (selectedTheme === 'code-vibes') {
    return playerColor === 'blue' ? 'orange' : 'blue';
  }

  return playerColor;
}

/** Creates the Code Vibes score with a separate number span. */
function createCodeVibesScoreMarkup(playerColor: PlayerColor, score: number): string {
  return `${getPlayerLabel(playerColor)} <span class="game-screen__player-status-number">${score}</span>`;
}

/** Returns the visible player label. */
function getPlayerLabel(playerColor: PlayerColor): string {
  return playerColor === 'blue' ? 'Blue' : 'Orange';
}

/** Returns the counter element of a player status. */
function getPlayerStatusCounterElement(
  gameScreen: HTMLElement,
  statusKey: PlayerStatusKey,
): HTMLElement {
  return getPlayerStatusElements(gameScreen, statusKey).counter;
}

/** Reads the current player status templates from the DOM. */
function getPlayerStatusVisuals(gameScreen: HTMLElement): PlayerStatusVisuals {
  return {
    orange: getPlayerStatusItemVisual(gameScreen, 'orange'),
    blue: getPlayerStatusItemVisual(gameScreen, 'blue'),
  };
}

/** Reads icon and counter text from one player status. */
function getPlayerStatusItemVisual(
  gameScreen: HTMLElement,
  statusKey: PlayerStatusKey,
): PlayerStatusItemVisual {
  const elements = getPlayerStatusElements(gameScreen, statusKey);

  return {
    iconMarkup: elements.icon.innerHTML,
    counterLabel: elements.counter.textContent ?? '',
  };
}

/** Returns the icon and counter of a player status. */
function getPlayerStatusElements(gameScreen: HTMLElement, statusKey: PlayerStatusKey): PlayerStatusElements {
  const iconElement = getPlayerStatusElement(gameScreen, statusKey, 'icon');
  const counterElement = getPlayerStatusElement(gameScreen, statusKey, 'counter');

  return {
    icon: iconElement,
    counter: counterElement,
  };
}

/** Returns a single element from a player status. */
function getPlayerStatusElement(
  gameScreen: HTMLElement,
  statusKey: PlayerStatusKey,
  elementKey: keyof PlayerStatusElements,
): HTMLElement {
  const selector = PLAYER_STATUS_SELECTORS[statusKey][elementKey];
  const element = gameScreen.querySelector<HTMLElement>(selector);

  if (!element) {
    throw new Error(`Player status "${statusKey}" ${elementKey} was not found.`);
  }

  return element;
}

/** Creates the chess piece display for one theme. */
function createChessPiecePlayerStatusVisuals(width: number, height: number): PlayerStatusVisuals {
  return {
    orange: createChessPiecePlayerStatusVisual(ORANGE_CHESS_COLOR, width, height),
    blue: createChessPiecePlayerStatusVisual(BLUE_CHESS_COLOR, width, height),
  };
}

/** Creates a single chess piece template. */
function createChessPiecePlayerStatusVisual(
  fill: string,
  width: number,
  height: number,
): PlayerStatusItemVisual {
  return {
    iconMarkup: createChessPieceSvg(fill, width, height),
    counterLabel: '0',
  };
}
