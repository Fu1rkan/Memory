import { getClosestElement } from './dom';
import { showScreen } from './screen-navigation';

/** Sets up the start screen and opens the home screen after a click. */
export function setupStartScreen(startScreen: HTMLElement, homeScreen: HTMLElement): void {
  startScreen.addEventListener('click', event => {
    showHomeScreenWhenPlayWasClicked(event, startScreen, homeScreen);
  });
}

/** Switches from the start screen to the home screen when play was clicked. */
function showHomeScreenWhenPlayWasClicked(
  event: Event,
  startScreen: HTMLElement,
  homeScreen: HTMLElement,
): void {
  if (getClosestElement(event, '.start-screen__play-button')) {
    showScreen(homeScreen, startScreen);
  }
}
