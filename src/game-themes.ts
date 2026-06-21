export const gameThemes = ['code-vibes', 'gaming', 'da-projects', 'foods'] as const;

export type GameTheme = typeof gameThemes[number];

export function isGameTheme(value: string | undefined): value is GameTheme {
    return gameThemes.includes(value as GameTheme);
}
