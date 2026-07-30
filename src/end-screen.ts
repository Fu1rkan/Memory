import { GAME_FINISHED_EVENT_NAME, type GameFinishedEventDetail } from './game-results';
import { runScreenEnterAnimation } from './screen-animation';

const END_SCREEN_DELAY = 2000;
const END_SCREEN_ANIMATION_FALLBACK_DELAY = 1100;
const END_SCREEN_ENTERING_CLASS = 'game-over-screen--entering';

let showEndScreenTimeout: number | undefined;

export const END_SCREEN_SHOWN_EVENT_NAME = 'memory:end-screen-shown';
export type EndScreenShownEventDetail = GameFinishedEventDetail;

/** Richtet den Game-over-Screen fuer das Spielende ein. */
export function setupEndScreen(
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
): void {
  gameScreen.addEventListener(GAME_FINISHED_EVENT_NAME, event => {
    handleGameFinished(event, endScreen, gameScreen, homeScreen, startScreen);
  });
}

/** Verarbeitet das Spielende-Event und plant den Endscreen. */
function handleGameFinished(
  event: Event,
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
): void {
  const gameFinishedDetail = getGameFinishedDetail(event);

  prepareEndScreen(endScreen, gameScreen, gameFinishedDetail);
  scheduleEndScreen(endScreen, gameScreen, homeScreen, startScreen, gameFinishedDetail);
}

/** Aktualisiert Theme und finale Punkte vor dem Anzeigen. */
function prepareEndScreen(
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  detail: GameFinishedEventDetail,
): void {
  endScreen.dataset.theme = detail.theme;
  renderFinalScore(endScreen, gameScreen);
}

/** Wartet den passenden Delay ab und zeigt dann den Endscreen. */
function scheduleEndScreen(
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
  detail: GameFinishedEventDetail,
): void {
  window.clearTimeout(showEndScreenTimeout);
  showEndScreenTimeout = window.setTimeout(() => {
    showEndScreenIfGameIsVisible(endScreen, gameScreen, homeScreen, startScreen, detail);
  }, getEndScreenDelay(detail));
}

/** Zeigt den Endscreen nur, wenn der Game Screen noch aktiv ist. */
function showEndScreenIfGameIsVisible(
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
  detail: GameFinishedEventDetail,
): void {
  if (!gameScreen.classList.contains('d_none')) {
    showEndScreen(endScreen, gameScreen, homeScreen, startScreen, detail);
  }
}

/** Startet den Endscreen mit passender Enter-Animation. */
function showEndScreen(
  endScreen: HTMLElement, gameScreen: HTMLElement, homeScreen: HTMLElement, startScreen: HTMLElement,
  detail: GameFinishedEventDetail,
): void {
  showEndScreenLayer(endScreen, homeScreen, startScreen);
  runScreenEnterAnimation({
    element: endScreen,
    enteringClass: END_SCREEN_ENTERING_CLASS,
    fallbackDelay: END_SCREEN_ANIMATION_FALLBACK_DELAY,
    onFinished: () => finishEndScreenAnimation(endScreen, gameScreen, detail),
  });
}

/** Macht den Endscreen sichtbar und versteckt nicht benoetigte Screens. */
function showEndScreenLayer(
  endScreen: HTMLElement,
  homeScreen: HTMLElement,
  startScreen: HTMLElement,
): void {
  startScreen.classList.add('d_none');
  homeScreen.classList.add('d_none');
  endScreen.classList.add(END_SCREEN_ENTERING_CLASS);
  endScreen.classList.remove('d_none');
}

/** Raeumt nach der Enter-Animation auf und meldet den sichtbaren Endscreen. */
function finishEndScreenAnimation(
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  detail: GameFinishedEventDetail,
): void {
  gameScreen.classList.add('d_none');
  dispatchEndScreenShownEvent(endScreen, detail);
}

/** Sendet die Daten fuer den folgenden Winnerscreen weiter. */
function dispatchEndScreenShownEvent(endScreen: HTMLElement, detail: GameFinishedEventDetail): void {
  endScreen.dispatchEvent(new CustomEvent<EndScreenShownEventDetail>(END_SCREEN_SHOWN_EVENT_NAME, {
    detail,
  }));
}

/** Gibt den Spielende-Delay zurueck oder ueberspringt ihn fuer Dev-Tools. */
function getEndScreenDelay(detail: GameFinishedEventDetail): number {
  return detail.skipDelay ? 0 : END_SCREEN_DELAY;
}

/** Holt die Detail-Daten aus dem Game-finished-Event. */
function getGameFinishedDetail(event: Event): GameFinishedEventDetail {
  if (!(event instanceof CustomEvent) || !event.detail) {
    throw new Error('Game finished detail is missing.');
  }

  return event.detail as GameFinishedEventDetail;
}

/** Rendert den finalen Score anhand der aktuellen Spieleranzeige. */
function renderFinalScore(endScreen: HTMLElement, gameScreen: HTMLElement): void {
  const finalScoreElement = getFinalScoreElement(endScreen);
  const finalScore = createFinalScoreElement(gameScreen);

  finalScoreElement.replaceChildren(finalScore);
}

/** Gibt den Zielcontainer fuer den finalen Score zurueck. */
function getFinalScoreElement(endScreen: HTMLElement): HTMLElement {
  const finalScoreElement = endScreen.querySelector<HTMLElement>('[data-final-score]');

  if (!finalScoreElement) {
    throw new Error('Final score container was not found.');
  }

  return finalScoreElement;
}

/** Erstellt eine Kopie der Spieleranzeige fuer den Endscreen. */
function createFinalScoreElement(gameScreen: HTMLElement): HTMLElement {
  const playerStatusElement = getPlayerStatusElement(gameScreen);
  const finalScore = playerStatusElement.cloneNode(true);

  if (!(finalScore instanceof HTMLElement)) {
    throw new Error('Final score markup could not be created.');
  }

  return finalScore;
}

/** Gibt die aktuelle Spieleranzeige aus dem Game Screen zurueck. */
function getPlayerStatusElement(gameScreen: HTMLElement): HTMLElement {
  const playerStatusElement = gameScreen.querySelector<HTMLElement>('.game-screen__player-status');

  if (!playerStatusElement) {
    throw new Error('Player status could not be found.');
  }

  return playerStatusElement;
}
