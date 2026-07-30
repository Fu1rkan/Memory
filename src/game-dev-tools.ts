import { getClosestElement } from './dom';
import { finishGame } from './game-finish';

const REVEALING_CARDS_CLASS = 'game-screen--revealing-cards';

/** Aktiviert die temporaeren Testbuttons im Game Screen. */
export function setupDevButtons(gameScreen: HTMLElement): void {
  gameScreen.addEventListener('click', event => handleDevButtonClick(event, gameScreen));
}

/** Setzt den Karten-Anzeigemodus wieder auf den Standard zurueck. */
export function resetCardRevealMode(gameScreen: HTMLElement): void {
  const revealButton = gameScreen.querySelector<HTMLElement>('.game-screen__dev-reveal-button');

  gameScreen.classList.remove(REVEALING_CARDS_CLASS);
  revealButton?.setAttribute('aria-pressed', 'false');
  updateRevealButtonText(revealButton, false);
}

/** Reagiert auf Klicks der temporaeren Testbuttons. */
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

/** Schaltet die Kartenrueckseiten testweise sichtbar oder unsichtbar. */
function toggleCardRevealMode(gameScreen: HTMLElement, revealButton: HTMLElement): void {
  const isRevealingCards = gameScreen.classList.toggle(REVEALING_CARDS_CLASS);

  revealButton.setAttribute('aria-pressed', String(isRevealingCards));
  updateRevealButtonText(revealButton, isRevealingCards);
}

/** Aktualisiert den Text des Reveal-Testbuttons. */
function updateRevealButtonText(button: HTMLElement | null | undefined, isRevealingCards: boolean): void {
  if (button) {
    button.textContent = isRevealingCards ? 'Hide cards' : 'Show cards';
  }
}
