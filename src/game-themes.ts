export const GAME_THEMES = ['code-vibes', 'gaming', 'da-projects', 'foods'] as const;

export type GameTheme = typeof GAME_THEMES[number];

/** Prueft, ob ein String ein bekanntes Game Theme ist. */
export function isGameTheme(value: string | undefined): value is GameTheme {
  return GAME_THEMES.includes(value as GameTheme);
}
