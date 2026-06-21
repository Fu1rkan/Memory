import type { GameTheme } from './game-themes';
import codeThemeBackToGameButtonSvg from './assets/buttons/code_theme_btg_button.svg?raw';
import codeThemeBackToGameHoverButtonSvg from './assets/buttons/code_theme_btg_hover_button.svg?raw';
import codeThemeExitButtonSvg from './assets/buttons/code_theme_exit_button.svg?raw';
import codeThemeExitHoverButtonSvg from './assets/buttons/code_theme_exit_hover_button.svg?raw';
import daThemeBackToGameButtonSvg from './assets/buttons/da_theme_btg_button.svg?raw';
import daThemeBackToGameHoverButtonSvg from './assets/buttons/da_theme_btg_hover_button.svg?raw';
import daThemeDialogExitButtonSvg from './assets/buttons/da_theme_exit2_button.svg?raw';
import daThemeDialogExitHoverButtonSvg from './assets/buttons/da_theme_exit2_hover_button.svg?raw';
import daThemeExitButtonSvg from './assets/buttons/da_theme_exit_button.svg?raw';
import daThemeExitHoverButtonSvg from './assets/buttons/da_theme_exit_hover_button.svg?raw';
import foodThemeBackToGameButtonSvg from './assets/buttons/food_theme_btg_button.svg?raw';
import foodThemeBackToGameHoverButtonSvg from './assets/buttons/food_theme_btg_hover_button.svg?raw';
import foodThemeDialogExitButtonSvg from './assets/buttons/food_theme_dialog_exit_button.svg?raw';
import foodThemeDialogExitHoverButtonSvg from './assets/buttons/food_theme_dialog_exit_hover_button.svg?raw';
import foodThemeExitButtonSvg from './assets/buttons/food_theme_exit_button.svg?raw';
import foodThemeExitHoverButtonSvg from './assets/buttons/food_theme_exit_hover_button.svg?raw';
import gameThemeBackToGameButtonSvg from './assets/buttons/game_theme_btg_button.svg?raw';
import gameThemeBackToGameHoverButtonSvg from './assets/buttons/game_theme_btg_hover_button.svg?raw';
import gameThemeExitButtonSvg from './assets/buttons/game_theme_exit_button.svg?raw';
import gameThemeExitHoverButtonSvg from './assets/buttons/game_theme_exit_hover_button.svg?raw';

export type ButtonVisual = {
    type: 'inline-svg';
    markup: string;
} | {
    type: 'text';
    label: string;
};

export type ButtonVisuals = {
    default: ButtonVisual;
    hover: ButtonVisual;
};

export type QuitDialogButtonVisuals = {
    back: ButtonVisuals;
    exit: ButtonVisuals;
};

const inlineSvgVisual = (markup: string): ButtonVisual => ({
    type: 'inline-svg',
    markup,
});

const textVisual = (label: string): ButtonVisual => ({ type: 'text', label });

export const exitButtonVisuals: Record<GameTheme, ButtonVisuals> = {
    'code-vibes': {
        default: inlineSvgVisual(codeThemeExitButtonSvg),
        hover: inlineSvgVisual(codeThemeExitHoverButtonSvg),
    },
    gaming: {
        default: inlineSvgVisual(gameThemeExitButtonSvg),
        hover: inlineSvgVisual(gameThemeExitHoverButtonSvg),
    },
    'da-projects': {
        default: inlineSvgVisual(daThemeExitButtonSvg),
        hover: inlineSvgVisual(daThemeExitHoverButtonSvg),
    },
    foods: {
        default: inlineSvgVisual(foodThemeExitHoverButtonSvg),
        hover: inlineSvgVisual(foodThemeExitButtonSvg),
    },
};

export const quitDialogButtonVisuals: Record<GameTheme, QuitDialogButtonVisuals> = {
    'code-vibes': {
        back: {
            default: inlineSvgVisual(codeThemeBackToGameButtonSvg),
            hover: inlineSvgVisual(codeThemeBackToGameHoverButtonSvg),
        },
        exit: {
            default: textVisual('Exit game'),
            hover: textVisual('Exit game'),
        },
    },
    gaming: {
        back: {
            default: inlineSvgVisual(gameThemeBackToGameButtonSvg),
            hover: inlineSvgVisual(gameThemeBackToGameHoverButtonSvg),
        },
        exit: {
            default: textVisual('Yes, quit game'),
            hover: textVisual('Yes, quit game'),
        },
    },
    'da-projects': {
        back: {
            default: inlineSvgVisual(daThemeBackToGameButtonSvg),
            hover: inlineSvgVisual(daThemeBackToGameHoverButtonSvg),
        },
        exit: {
            default: inlineSvgVisual(daThemeDialogExitButtonSvg),
            hover: inlineSvgVisual(daThemeDialogExitHoverButtonSvg),
        },
    },
    foods: {
        back: {
            default: inlineSvgVisual(foodThemeBackToGameHoverButtonSvg),
            hover: inlineSvgVisual(foodThemeBackToGameButtonSvg),
        },
        exit: {
            default: inlineSvgVisual(foodThemeDialogExitButtonSvg),
            hover: inlineSvgVisual(foodThemeDialogExitHoverButtonSvg),
        },
    },
};
