import { getScores } from './game-board-state';
import { getGameScreenTheme } from './game-settings';
import {
  GAME_FINISHED_EVENT_NAME,
  getWinner,
  type GameFinishedEventDetail,
  type PlayerScores,
} from './game-results';

type FinishGameOptions = Pick<GameFinishedEventDetail, 'skipDelay'>;

/** Loest das Spielende aus und uebergibt Theme, Punkte und Gewinner. */
export function finishGame(gameScreen: HTMLElement, options: FinishGameOptions = {}): void {
  const scores = getScores();
  const detail = createGameFinishedDetail(gameScreen, scores, options);

  dispatchGameFinishedEvent(gameScreen, detail);
}

/** Erstellt die Nutzdaten fuer das Spielende-Event. */
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

/** Sendet das Spielende-Event am Game Screen. */
function dispatchGameFinishedEvent(
  gameScreen: HTMLElement,
  detail: GameFinishedEventDetail,
): void {
  gameScreen.dispatchEvent(new CustomEvent<GameFinishedEventDetail>(GAME_FINISHED_EVENT_NAME, { detail }));
}
