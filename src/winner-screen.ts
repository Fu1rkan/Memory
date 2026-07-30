import { getClosestElement } from './dom';
import { END_SCREEN_SHOWN_EVENT_NAME, type EndScreenShownEventDetail } from './end-screen';
import type { GameTheme } from './game-themes';
import type { WinnerResult } from './game-results';
import { runScreenEnterAnimation } from './screen-animation';
import { showScreen } from './screen-navigation';

type WinnerScreenElements = {
  intro: HTMLElement;
  player: HTMLElement;
  image: HTMLImageElement;
  button: HTMLButtonElement;
};

const WINNER_SCREEN_DELAY = 3000;
const WINNER_SCREEN_ANIMATION_FALLBACK_DELAY = 1100;
const WINNER_SCREEN_ENTERING_CLASS = 'winner-screen--entering';

const WINNER_IMAGES: Record<GameTheme, Record<WinnerResult, string>> = {
  'code-vibes': {
    blue: './img/winner_imgs/code_vibes_player_blue.png',
    orange: './img/winner_imgs/code_vibes_player_orange.png',
    draw: './img/winner_imgs/code_vibes_draw.png',
  },
  gaming: {
    blue: './img/winner_imgs/game_theme_pockal.png',
    orange: './img/winner_imgs/game_theme_pockal.png',
    draw: './img/winner_imgs/game_theme_draw.png',
  },
  'da-projects': {
    blue: './img/winner_imgs/da_theme_player_blue.png',
    orange: './img/winner_imgs/da_theme_player_orange.png',
    draw: './img/winner_imgs/da_theme_draw.png',
  },
  foods: {
    blue: './img/winner_imgs/food_theme_player_blue.png',
    orange: './img/winner_imgs/food_theme_player_orange.png',
    draw: './img/winner_imgs/food_theme_draw.png',
  },
};

const WINNER_BUTTON_LABELS: Record<GameTheme, string> = {
  'code-vibes': 'Back to start',
  gaming: 'Home',
  'da-projects': 'Home',
  foods: 'HOME',
};

let showWinnerScreenTimeout: number | undefined;

/** Richtet den Winnerscreen nach dem Endscreen ein. */
export function setupWinnerScreen(
  winnerScreen: HTMLElement,
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
): void {
  setupEndScreenShownListener(winnerScreen, endScreen);
  setupWinnerBackButton(winnerScreen, endScreen, gameScreen, homeScreen);
}

/** Reagiert darauf, dass der Endscreen komplett sichtbar ist. */
function setupEndScreenShownListener(winnerScreen: HTMLElement, endScreen: HTMLElement): void {
  endScreen.addEventListener(END_SCREEN_SHOWN_EVENT_NAME, event => {
    const detail = getEndScreenShownDetail(event);

    renderWinnerScreen(winnerScreen, detail);
    scheduleWinnerScreen(winnerScreen, endScreen);
  });
}

/** Plant den Winnerscreen nach kurzer Ergebnis-Anzeige ein. */
function scheduleWinnerScreen(winnerScreen: HTMLElement, endScreen: HTMLElement): void {
  window.clearTimeout(showWinnerScreenTimeout);
  showWinnerScreenTimeout = window.setTimeout(() => {
    showWinnerScreenIfEndScreenIsVisible(winnerScreen, endScreen);
  }, WINNER_SCREEN_DELAY);
}

/** Zeigt den Winnerscreen nur, wenn der Endscreen noch aktiv ist. */
function showWinnerScreenIfEndScreenIsVisible(winnerScreen: HTMLElement, endScreen: HTMLElement): void {
  if (!endScreen.classList.contains('d_none')) {
    showWinnerScreen(winnerScreen, endScreen);
  }
}

/** Fuehrt den Back-to-start-Button zum Home Screen zurueck. */
function setupWinnerBackButton(
  winnerScreen: HTMLElement,
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
): void {
  winnerScreen.addEventListener('click', event => {
    goHomeWhenBackButtonWasClicked(event, winnerScreen, endScreen, gameScreen, homeScreen);
  });
}

/** Wechselt zum Home Screen, wenn der Winnerscreen-Button geklickt wurde. */
function goHomeWhenBackButtonWasClicked(
  event: Event,
  winnerScreen: HTMLElement,
  endScreen: HTMLElement,
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
): void {
  if (getClosestElement(event, '.winner-screen__back-button')) {
    window.clearTimeout(showWinnerScreenTimeout);
    showScreen(homeScreen, winnerScreen, endScreen, gameScreen);
  }
}

/** Startet die Enter-Animation des Winnerscreens. */
function showWinnerScreen(winnerScreen: HTMLElement, endScreen: HTMLElement): void {
  winnerScreen.classList.add(WINNER_SCREEN_ENTERING_CLASS);
  winnerScreen.classList.remove('d_none');
  runScreenEnterAnimation({
    element: winnerScreen,
    enteringClass: WINNER_SCREEN_ENTERING_CLASS,
    fallbackDelay: WINNER_SCREEN_ANIMATION_FALLBACK_DELAY,
    onFinished: () => endScreen.classList.add('d_none'),
  });
}

/** Rendert Gewinner, Bild und Buttontext passend zum Ergebnis. */
function renderWinnerScreen(winnerScreen: HTMLElement, detail: EndScreenShownEventDetail): void {
  const elements = getWinnerScreenElements(winnerScreen);

  winnerScreen.dataset.theme = detail.theme;
  winnerScreen.dataset.winner = detail.winner;
  elements.intro.textContent = getWinnerIntro(detail.winner);
  elements.player.textContent = getWinnerLabel(detail.winner);
  elements.image.src = WINNER_IMAGES[detail.theme][detail.winner];
  elements.image.alt = getWinnerImageAlt(detail.winner);
  elements.button.textContent = WINNER_BUTTON_LABELS[detail.theme];
}

/** Sammelt die benoetigten DOM-Elemente des Winnerscreens. */
function getWinnerScreenElements(winnerScreen: HTMLElement): WinnerScreenElements {
  return {
    intro: getWinnerElement(winnerScreen, '.winner-screen__intro'),
    player: getWinnerElement(winnerScreen, '[data-winner-player]'),
    image: getWinnerElement<HTMLImageElement>(winnerScreen, '[data-winner-image]'),
    button: getWinnerElement<HTMLButtonElement>(winnerScreen, '.winner-screen__back-button'),
  };
}

/** Gibt ein Winnerscreen-Element zurueck oder meldet einen Strukturfehler. */
function getWinnerElement<T extends HTMLElement>(winnerScreen: HTMLElement, selector: string): T {
  const element = winnerScreen.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Winner screen element "${selector}" was not found.`);
  }

  return element;
}

/** Gibt die kleine Headline ueber dem Gewinner zurueck. */
function getWinnerIntro(winner: WinnerResult): string {
  return winner === 'draw' ? "It's a" : 'The winner is';
}

/** Gibt den Ergebnistext fuer Gewinner oder Draw zurueck. */
function getWinnerLabel(winner: WinnerResult): string {
  if (winner === 'draw') {
    return 'Draw';
  }

  return `${winner.toUpperCase()} PLAYER`;
}

/** Gibt den Alt-Text fuer das Gewinnerbild zurueck. */
function getWinnerImageAlt(winner: WinnerResult): string {
  if (winner === 'draw') {
    return 'Draw';
  }

  return `${winner} player`;
}

/** Holt die Detail-Daten aus dem Endscreen-Event. */
function getEndScreenShownDetail(event: Event): EndScreenShownEventDetail {
  if (!(event instanceof CustomEvent) || !event.detail) {
    throw new Error('End screen detail is missing.');
  }

  return event.detail as EndScreenShownEventDetail;
}
