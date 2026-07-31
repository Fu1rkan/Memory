import { getScores } from './game-board-state';
import { getGameScreenTheme } from './game-settings';
import {
  GAME_FINISHED_EVENT_NAME,
  getWinner,
  type GameFinishedEventDetail,
  type PlayerScores,
} from './game-results';

type FinishGameOptions = Pick<GameFinishedEventDetail, 'skipDelay'>;

/** Triggers the end of the game and passes theme, scores and winner. */
export function finishGame(gameScreen: HTMLElement, options: FinishGameOptions = {}): void {
  const scores = getScores();
  const detail = createGameFinishedDetail(gameScreen, scores, options);

  dispatchGameFinishedEvent(gameScreen, detail);
}

/** Creates the payload for the game-finished event. */
function createGameFinishedDetail(
  gameScreen: HTMLElement,
  scores: PlayerScores,
  options: FinishGameOptions,
): GameFinishedEventDetail {
  return {
    ...options,
    theme: getGameScreenTheme(gameScreen),
    scores,
    winner: getWinner(scores),
  };
}

/** Dispatches the game-finished event on the game screen. */
function dispatchGameFinishedEvent(
  gameScreen: HTMLElement,
  detail: GameFinishedEventDetail,
): void {
  gameScreen.dispatchEvent(new CustomEvent<GameFinishedEventDetail>(GAME_FINISHED_EVENT_NAME, { detail }));
}
