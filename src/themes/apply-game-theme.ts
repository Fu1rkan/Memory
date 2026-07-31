import { EXIT_BUTTON_VISUALS, QUIT_DIALOG_BUTTON_VISUALS, type ButtonVisuals } from './button-visuals';
import type { GameTheme } from './themes';
import { getSelectedTheme } from '../game/game-settings';
import { updatePlayerStatusVisuals } from '../game/player-status';
import { renderButtonVisuals } from '../ui/render-button-visuals';

/** Applies the theme selected on the home screen to the game screen. */
export function applySelectedTheme(gameScreen: HTMLElement, homeScreen: HTMLElement): void {
  const selectedTheme = getSelectedTheme(homeScreen);

  gameScreen.dataset.theme = selectedTheme;
  updatePlayerStatusVisuals(gameScreen, selectedTheme);
  updateExitButtonVisuals(gameScreen, selectedTheme);
  updateQuitDialogButtonVisuals(gameScreen, selectedTheme);
}

/** Updates the visual variant of the header exit button. */
function updateExitButtonVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme): void {
  const exitButton = getRequiredElement(gameScreen, '.game-screen__exit-button');

  renderButtonVisuals(exitButton, EXIT_BUTTON_VISUALS[selectedTheme], 'game-screen__exit-button-image');
}

/** Updates both buttons in the quit dialog. */
function updateQuitDialogButtonVisuals(gameScreen: HTMLElement, selectedTheme: GameTheme): void {
  const visuals = QUIT_DIALOG_BUTTON_VISUALS[selectedTheme];

  updateDialogButtonVisuals(gameScreen, '.game-screen__quit-dialog-button--back', visuals.back);
  updateDialogButtonVisuals(gameScreen, '.game-screen__quit-dialog-button--exit', visuals.exit);
}

/** Updates a single button in the quit dialog. */
function updateDialogButtonVisuals(
  gameScreen: HTMLElement,
  buttonSelector: string,
  visuals: ButtonVisuals,
): void {
  const button = getRequiredElement(gameScreen, buttonSelector);

  renderButtonVisuals(button, visuals, 'game-screen__quit-dialog-button-image');
}

/** Returns an element or reports a clear structure error. */
function getRequiredElement(root: HTMLElement, selector: string): HTMLElement {
  const element = root.querySelector<HTMLElement>(selector);

  if (!element) {
    throw new Error(`Element "${selector}" was not found.`);
  }

  return element;
}
