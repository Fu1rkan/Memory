import { EXIT_BUTTON_VISUALS, QUIT_DIALOG_BUTTON_VISUALS, type ButtonVisuals } from './button-visuals';
import { getSelectedTheme } from './game-settings';
import type { GameTheme } from './game-themes';
import { renderButtonVisuals } from './render-button-visuals';
import { updatePlayerStatusVisuals } from './player-status';

/** Uebernimmt das im Home Screen gewaehlte Theme fuer den Game Screen. */
export function applySelectedTheme(gameScreen: HTMLElement, homeScreen: HTMLElement): void {
  const selectedTheme = getSelectedTheme(homeScreen);

  gameScreen.dataset.theme = selectedTheme;
  updatePlayerStatusVisuals(gameScreen, selectedTheme);
  updateExitButtonVisuals(gameScreen, selectedTheme);
  updateQuitDialogButtonVisuals(gameScreen, selectedTheme);
}

/** Aktualisiert die visuelle Variante des Header-Exit-Buttons. */
function updateExitButtonVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme): void {
  const exitButton = getRequiredElement(gameScreen, '.game-screen__exit-button');

  renderButtonVisuals(exitButton, EXIT_BUTTON_VISUALS[selectedTheme], 'game-screen__exit-button-image');
}

/** Aktualisiert die beiden Buttons im Quit-Dialog. */
function updateQuitDialogButtonVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme): void {
  const visuals = QUIT_DIALOG_BUTTON_VISUALS[selectedTheme];

  updateDialogButtonVisuals(gameScreen, '.game-screen__quit-dialog-button--back', visuals.back);
  updateDialogButtonVisuals(gameScreen, '.game-screen__quit-dialog-button--exit', visuals.exit);
}

/** Aktualisiert einen einzelnen Button im Quit-Dialog. */
function updateDialogButtonVisuals(
  gameScreen: HTMLElement,
  buttonSelector: string,
  visuals: ButtonVisuals,
): void {
  const button = getRequiredElement(gameScreen, buttonSelector);

  renderButtonVisuals(button, visuals, 'game-screen__quit-dialog-button-image');
}

/** Gibt ein Element zurueck oder meldet einen klaren Strukturfehler. */
function getRequiredElement(root: HTMLElement, selector: string): HTMLElement {
  const element = root.querySelector<HTMLElement>(selector);

  if (!element) {
    throw new Error(`Element "${selector}" was not found.`);
  }

  return element;
}
