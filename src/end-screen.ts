import { GAME_FINISHED_EVENT_NAME, type GameFinishedEventDetail } from './game-results';
import { runScreenEnterAnimation } from './screen-animation';

const END_SCREEN_DELAY = 2000;
const END_SCREEN_ANIMATION_FALLBACK_DELAY = 1100;
const END_SCREEN_ENTERING_CLASS = 'game-over-screen--entering';

let showEndScreenTimeout: number | undefined;

export const END_SCREEN_SHOWN_EVENT_NAME = 'memory:end-screen-shown';
export type EndScreenShownEventDetail = GameFinishedEventDetail;

/** Sets up the game-over screen for the end of the game. */
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

/** Handles the game-finished event and schedules the end screen. */
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

/** Updates the theme and final score before showing the screen. */
function prepareEndScreen(
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  detail: GameFinishedEventDetail,
): void {
  endScreen.dataset.theme = detail.theme;
  renderFinalScore(endScreen, gameScreen);
}

/** Waits for the matching delay and then shows the end screen. */
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

/** Shows the end screen only while the game screen is still active. */
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

/** Starts the end screen with the matching enter animation. */
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

/** Shows the end screen layer and hides screens that are no longer needed. */
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

/** Cleans up after the enter animation and announces the visible end screen. */
function finishEndScreenAnimation(
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  detail: GameFinishedEventDetail,
): void {
  gameScreen.classList.add('d_none');
  dispatchEndScreenShownEvent(endScreen, detail);
}

/** Sends the data for the following winner screen. */
function dispatchEndScreenShownEvent(endScreen: HTMLElement, detail: GameFinishedEventDetail): void {
  endScreen.dispatchEvent(new CustomEvent<EndScreenShownEventDetail>(END_SCREEN_SHOWN_EVENT_NAME, {
    detail,
  }));
}

/** Returns the end-screen delay or skips it for dev tools. */
function getEndScreenDelay(detail: GameFinishedEventDetail): number {
  return detail.skipDelay ? 0 : END_SCREEN_DELAY;
}

/** Reads the detail data from the game-finished event. */
function getGameFinishedDetail(event: Event): GameFinishedEventDetail {
  if (!(event instanceof CustomEvent) || !event.detail) {
    throw new Error('Game finished detail is missing.');
  }

  return event.detail as GameFinishedEventDetail;
}

/** Renders the final score from the current player status. */
function renderFinalScore(endScreen: HTMLElement, gameScreen: HTMLElement): void {
  const finalScoreElement = getFinalScoreElement(endScreen);
  const finalScore = createFinalScoreElement(gameScreen);

  finalScoreElement.replaceChildren(finalScore);
}

/** Returns the target container for the final score. */
function getFinalScoreElement(endScreen: HTMLElement): HTMLElement {
  const finalScoreElement = endScreen.querySelector<HTMLElement>('[data-final-score]');

  if (!finalScoreElement) {
    throw new Error('Final score container was not found.');
  }

  return finalScoreElement;
}

/** Creates a copy of the player status for the end screen. */
function createFinalScoreElement(gameScreen: HTMLElement): HTMLElement {
  const playerStatusElement = getPlayerStatusElement(gameScreen);
  const finalScore = playerStatusElement.cloneNode(true);

  if (!(finalScore instanceof HTMLElement)) {
    throw new Error('Final score markup could not be created.');
  }

  return finalScore;
}

/** Returns the current player status from the game screen. */
function getPlayerStatusElement(gameScreen: HTMLElement): HTMLElement {
  const playerStatusElement = gameScreen.querySelector<HTMLElement>('.game-screen__player-status');

  if (!playerStatusElement) {
    throw new Error('Player status could not be found.');
  }

  return playerStatusElement;
}
