import type { PlayerColor } from './current-player';
import type { GameTheme } from './game-themes';

export const GAME_FINISHED_EVENT_NAME = 'memory:game-finished';

export type PlayerScores = Record<PlayerColor, number>;
export type WinnerResult = PlayerColor | 'draw';

export type GameFinishedEventDetail = {
  skipDelay?: boolean;
  theme: GameTheme;
  scores: PlayerScores;
  winner: WinnerResult;
};

/** Gibt anhand der Punkte den Gewinner oder ein Unentschieden zurueck. */
export function getWinner(scores: PlayerScores): WinnerResult {
  if (scores.blue === scores.orange) {
    return 'draw';
  }

  return scores.blue > scores.orange ? 'blue' : 'orange';
}
