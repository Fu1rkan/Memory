import { getClosestElement } from './dom';
import { showScreen } from './screen-navigation';

/** Richtet den Startscreen ein und oeffnet nach Klick den Home Screen. */
export function setupStartScreen(startScreen: HTMLElement, homeScreen: HTMLElement): void {
  startScreen.addEventListener('click', event => {
    showHomeScreenWhenPlayWasClicked(event, startScreen, homeScreen);
  });
}

/** Wechselt vom Startscreen zum Home Screen, wenn Play geklickt wurde. */
function showHomeScreenWhenPlayWasClicked(
  event: Event,
  startScreen: HTMLElement,
  homeScreen: HTMLElement,
): void {
  if (getClosestElement(event, '.start-screen__play-button')) {
    showScreen(homeScreen, startScreen);
  }
}
