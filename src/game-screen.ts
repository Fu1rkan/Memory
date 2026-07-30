import { getClosestElement, getDialogById } from './dom';
import { applySelectedTheme } from './game-theme';
import { renderSelectedBoard, setupMemoryCards } from './memory-board';
import { setupPlayerStatus } from './player-status';
import { setupQuitDialog } from './quit-dialog';
import { showScreen } from './screen-navigation';

/** Sets up the game screen and its interactions. */
export function setupGameScreen(
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
): void {
  const quitGameDialog = getDialogById('quit-game-dialog');

  setupPlayerStatus(gameScreen);
  setupHomeStartButton(gameScreen, homeScreen, startScreen);
  setupQuitDialog(gameScreen, homeScreen, quitGameDialog);
  setupMemoryCards(gameScreen);
  applySelectedTheme(gameScreen, homeScreen);
}

/** Connects the home screen start button to the actual game start. */
function setupHomeStartButton(
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
): void {
  homeScreen.addEventListener('click', event => {
    startGameWhenStartButtonWasClicked(event, gameScreen, homeScreen, startScreen);
  });
}

/** Starts a new game when the start button was clicked. */
function startGameWhenStartButtonWasClicked(
  event: Event,
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
): void {
  if (getClosestElement(event, '.home-screen__footer-button--start')) {
    showGameScreen(gameScreen, homeScreen, startScreen);
  }
}

/** Shows the game screen with a fresh board and current theme selection. */
function showGameScreen(
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
): void {
  applySelectedTheme(gameScreen, homeScreen);
  renderSelectedBoard(gameScreen, homeScreen);
  showScreen(gameScreen, homeScreen, startScreen);
}
