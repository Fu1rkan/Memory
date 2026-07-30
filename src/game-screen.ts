import { getClosestElement, getDialogById } from './dom';
import { setupDevButtons } from './game-dev-tools';
import { applySelectedTheme } from './game-theme';
import { renderSelectedBoard, setupMemoryCards } from './memory-board';
import { setupPlayerStatus } from './player-status';
import { setupQuitDialog } from './quit-dialog';
import { showScreen } from './screen-navigation';

/** Richtet den Game Screen und seine Interaktionen ein. */
export function setupGameScreen(
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
): void {
  const quitGameDialog = getDialogById('quit-game-dialog');

  setupPlayerStatus(gameScreen);
  setupHomeStartButton(gameScreen, homeScreen, startScreen);
  setupQuitDialog(gameScreen, homeScreen, quitGameDialog);
  setupDevButtons(gameScreen);
  setupMemoryCards(gameScreen);
  applySelectedTheme(gameScreen, homeScreen);
}

/** Verbindet den Startbutton im Home Screen mit dem eigentlichen Spielstart. */
function setupHomeStartButton(
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
): void {
  homeScreen.addEventListener('click', event => {
    startGameWhenStartButtonWasClicked(event, gameScreen, homeScreen, startScreen);
  });
}

/** Startet ein neues Spiel, wenn der Startbutton geklickt wurde. */
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

/** Zeigt den Game Screen mit frischem Board und aktueller Theme-Auswahl. */
function showGameScreen(
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
): void {
  applySelectedTheme(gameScreen, homeScreen);
  renderSelectedBoard(gameScreen, homeScreen);
  showScreen(gameScreen, homeScreen, startScreen);
}
