import { getClosestElement } from './dom';
import { finishGame } from './game-finish';

const REVEALING_CARDS_CLASS = 'game-screen--revealing-cards';

/** Enables the temporary test buttons on the game screen. */
export function setupDevButtons(gameScreen: HTMLElement): void {
  gameScreen.addEventListener('click', event => handleDevButtonClick(event, gameScreen));
}

/** Resets the card reveal mode to its default state. */
export function resetCardRevealMode(gameScreen: HTMLElement): void {
  const revealButton = gameScreen.querySelector<HTMLElement>('.game-screen__dev-reveal-button');

  gameScreen.classList.remove(REVEALING_CARDS_CLASS);
  revealButton?.setAttribute('aria-pressed', 'false');
  updateRevealButtonText(revealButton, false);
}

/** Handles clicks on the temporary test buttons. */
function handleDevButtonClick(event: Event, gameScreen: HTMLElement): void {
  const finishButton = getClosestElement(event, '.game-screen__dev-finish-button');
  const revealButton = getClosestElement(event, '.game-screen__dev-reveal-button');

  if (finishButton) {
    finishGame(gameScreen, { skipDelay: true });
  }

  if (revealButton instanceof HTMLElement) {
    toggleCardRevealMode(gameScreen, revealButton);
  }
}

/** Toggles the card backs for testing. */
function toggleCardRevealMode(gameScreen: HTMLElement, revealButton: HTMLElement): void {
  const isRevealingCards = gameScreen.classList.toggle(REVEALING_CARDS_CLASS);

  revealButton.setAttribute('aria-pressed', String(isRevealingCards));
  updateRevealButtonText(revealButton, isRevealingCards);
}

/** Updates the text of the reveal test button. */
function updateRevealButtonText(button: HTMLElement | null | undefined, isRevealingCards: boolean): void {
  if (button) {
    button.textContent = isRevealingCards ? 'Hide cards' : 'Show cards';
  }
}
