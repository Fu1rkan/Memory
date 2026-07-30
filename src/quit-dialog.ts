import { getClosestElement } from './dom';
import { showScreen } from './screen-navigation';

const ANIMATION_FALLBACK_BUFFER = 100;
const CLOSING_CLASS = 'game-screen__quit-dialog--closing';
const BACKDROP_CLOSING_CLASS = 'game-screen__quit-dialog--backdrop-closing';
const DA_CLOSE_ANIMATION_DELAY = 250;
const CODE_VIBES_BACKDROP_CLOSE_DELAY = 250;

/** Verbindet Exit-, Back- und Confirm-Button mit dem Quit-Dialog. */
export function setupQuitDialog(
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  quitGameDialog: HTMLDialogElement,
): void {
  gameScreen.addEventListener('click', event => {
    handleQuitDialogClick(event, gameScreen, homeScreen, quitGameDialog);
  });
}

/** Reagiert auf alle Klicks, die den Quit-Dialog betreffen. */
function handleQuitDialogClick(
  event: Event,
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  quitGameDialog: HTMLDialogElement,
): void {
  openDialogWhenExitWasClicked(event, quitGameDialog);
  closeDialogWhenBackWasClicked(event, gameScreen, quitGameDialog);
  leaveGameWhenConfirmed(event, homeScreen, gameScreen, quitGameDialog);
}

/** Oeffnet den Dialog, wenn der Header-Exit-Button geklickt wurde. */
function openDialogWhenExitWasClicked(event: Event, dialog: HTMLDialogElement): void {
  if (getClosestElement(event, '.game-screen__exit-button')) {
    showQuitGameDialog(dialog);
  }
}

/** Schliesst den Dialog, wenn der Back-to-game-Button geklickt wurde. */
function closeDialogWhenBackWasClicked(
  event: Event,
  gameScreen: HTMLElement,
  dialog: HTMLDialogElement,
): void {
  if (getClosestElement(event, '.game-screen__quit-dialog-button--back')) {
    closeQuitGameDialog(gameScreen, dialog);
  }
}

/** Wechselt zurueck zum Home Screen, wenn das Verlassen bestaetigt wurde. */
function leaveGameWhenConfirmed(
  event: Event,
  homeScreen: HTMLElement,
  gameScreen: HTMLElement,
  dialog: HTMLDialogElement,
): void {
  if (getClosestElement(event, '.game-screen__quit-dialog-button--exit')) {
    dialog.close();
    showScreen(homeScreen, gameScreen);
  }
}

/** Oeffnet den Quit-Dialog, wenn er noch nicht offen ist. */
function showQuitGameDialog(dialog: HTMLDialogElement): void {
  if (!dialog.open) {
    dialog.classList.remove(CLOSING_CLASS, BACKDROP_CLOSING_CLASS);
    dialog.showModal();
  }
}

/** Schliesst den Quit-Dialog je nach Theme mit der passenden Animation. */
function closeQuitGameDialog(gameScreen: HTMLElement, dialog: HTMLDialogElement): void {
  if (shouldIgnoreCloseRequest(dialog)) {
    return;
  }

  closeDialogForTheme(gameScreen.dataset.theme, dialog);
}

/** Prueft, ob der Dialog schon schliesst oder gar nicht offen ist. */
function shouldIgnoreCloseRequest(dialog: HTMLDialogElement): boolean {
  return !dialog.open
    || dialog.classList.contains(CLOSING_CLASS)
    || dialog.classList.contains(BACKDROP_CLOSING_CLASS);
}

/** Schliesst den Dialog passend zum aktiven Theme. */
function closeDialogForTheme(theme: string | undefined, dialog: HTMLDialogElement): void {
  if (prefersReducedMotion()) {
    dialog.close();
  } else if (theme === 'code-vibes') {
    closeCodeVibesQuitGameDialog(dialog);
  } else if (theme === 'da-projects') {
    closeQuitGameDialogAfterAnimation(dialog);
  } else {
    dialog.close();
  }
}

/** Schliesst beim Code-Vibes-Theme erst den Backdrop und dann den Dialog. */
function closeCodeVibesQuitGameDialog(dialog: HTMLDialogElement): void {
  dialog.classList.add(BACKDROP_CLOSING_CLASS);
  window.setTimeout(() => closeDialogNow(dialog, [BACKDROP_CLOSING_CLASS]), CODE_VIBES_BACKDROP_CLOSE_DELAY);
}

/** Schliesst den Dialog nach der DA-Fade-Animation. */
function closeQuitGameDialogAfterAnimation(dialog: HTMLDialogElement): void {
  /** Leitet das Animation-Ende an den Dialog-Cleanup weiter. */
  const closeOnAnimationEnd = (event: AnimationEvent): void => closeAfterDialogAnimation(event, dialog);

  dialog.classList.add(CLOSING_CLASS);
  dialog.addEventListener('animationend', closeOnAnimationEnd, { once: true });
  window.setTimeout(() => closeDialogNow(dialog, [CLOSING_CLASS]), DA_CLOSE_ANIMATION_DELAY + ANIMATION_FALLBACK_BUFFER);
}

/** Schliesst den Dialog nur nach seiner eigenen Animation. */
function closeAfterDialogAnimation(event: AnimationEvent, dialog: HTMLDialogElement): void {
  if (event.target === dialog && !event.pseudoElement) {
    closeDialogNow(dialog, [CLOSING_CLASS]);
  }
}

/** Entfernt Schliessklassen und schliesst den Dialog sofort. */
function closeDialogNow(dialog: HTMLDialogElement, classNames: string[]): void {
  if (dialog.open) {
    dialog.classList.remove(...classNames);
    dialog.close();
  }
}

/** Prueft, ob Nutzer Animationen reduziert haben moechten. */
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
