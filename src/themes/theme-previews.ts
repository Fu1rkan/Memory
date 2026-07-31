import type { GameTheme } from './themes';

const THEME_IMAGE_FOLDER = `${import.meta.env.BASE_URL}img/themes`;

/** Maps each theme to its start-screen preview image. */
export const THEME_PREVIEW_IMAGES: Record<GameTheme, string> = {
  'code-vibes': `${THEME_IMAGE_FOLDER}/code_vibes.png`,
  gaming: `${THEME_IMAGE_FOLDER}/gaming_theme.png`,
  'da-projects': `${THEME_IMAGE_FOLDER}/da_theme.png`,
  foods: `${THEME_IMAGE_FOLDER}/food_theme.png`,
};

/** Maps each theme to a descriptive preview image alt text. */
export const THEME_PREVIEW_ALT_TEXTS: Record<GameTheme, string> = {
  'code-vibes': 'Preview of the Code Vibes theme',
  gaming: 'Preview of the Gaming theme',
  'da-projects': 'Preview of the DA Projects theme',
  foods: 'Preview of the Foods theme',
};
