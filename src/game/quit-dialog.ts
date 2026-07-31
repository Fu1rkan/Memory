import { getClosestElement } from '../ui/dom';
import { showScreen } from '../ui/screen-navigation';

const ANIMATION_FALLBACK_BUFFER = 100;
const CLOSING_CLASS = 'game-screen__quit-dialog--closing';
const BACKDROP_CLOSING_CLASS = 'game-screen__quit-dialog--backdrop-closing';
const DA_CLOSE_ANIMATION_DELAY = 250;
const CODE_VIBES_BACKDROP_CLOSE_DELAY = 250;

/** Connects the exit, back and confirm buttons with the quit dialog. */
export function setupQuitDialog(
  gameScreen: HTMLElement,
  homeScreen: HTMLElement,
  quitGameDialog: HTMLDialogElement,
): void {
  gameScreen.addEventListener('click', event => {
    handleQuitDialogClick(event, gameScreen, homeScreen, quitGameDialog);
  });
}

/** Handles all clicks related to the quit dialog. */
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

/** Opens the dialog when the header exit button was clicked. */
function openDialogWhenExitWasClicked(event: Event, dialog: HTMLDialogElement): void {
  if (getClosestElement(event, '.game-screen__exit-button')) {
    showQuitGameDialog(dialog);
  }
}

/** Closes the dialog when the back-to-game button was clicked. */
function closeDialogWhenBackWasClicked(
  event: Event,
  gameScreen: HTMLElement,
  dialog: HTMLDialogElement,
): void {
  if (getClosestElement(event, '.game-screen__quit-dialog-button--back')) {
    closeQuitGameDialog(gameScreen, dialog);
  }
}

/** Goes back to the home screen when leaving was confirmed. */
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

/** Opens the quit dialog when it is not already open. */
function showQuitGameDialog(dialog: HTMLDialogElement): void {
  if (!dialog.open) {
    dialog.classList.remove(CLOSING_CLASS, BACKDROP_CLOSING_CLASS);
    dialog.showModal();
  }
}

/** Closes the quit dialog with the matching theme animation. */
function closeQuitGameDialog(gameScreen: HTMLElement, dialog: HTMLDialogElement): void {
  if (shouldIgnoreCloseRequest(dialog)) {
    return;
  }

  closeDialogForTheme(gameScreen.dataset.theme, dialog);
}

/** Checks whether the dialog is already closing or not open. */
function shouldIgnoreCloseRequest(dialog: HTMLDialogElement): boolean {
  return !dialog.open
    || dialog.classList.contains(CLOSING_CLASS)
    || dialog.classList.contains(BACKDROP_CLOSING_CLASS);
}

/** Closes the dialog based on the active theme. */
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

/** Closes the backdrop first and then the dialog for the Code Vibes theme. */
function closeCodeVibesQuitGameDialog(dialog: HTMLDialogElement): void {
  dialog.classList.add(BACKDROP_CLOSING_CLASS);
  window.setTimeout(() => closeDialogNow(dialog, [BACKDROP_CLOSING_CLASS]), CODE_VIBES_BACKDROP_CLOSE_DELAY);
}

/** Closes the dialog after the DA fade animation. */
function closeQuitGameDialogAfterAnimation(dialog: HTMLDialogElement): void {
  /** Passes the animation end event to the dialog cleanup. */
  const closeOnAnimationEnd = (event: AnimationEvent): void => closeAfterDialogAnimation(event, dialog);

  dialog.classList.add(CLOSING_CLASS);
  dialog.addEventListener('animationend', closeOnAnimationEnd, { once: true });
  window.setTimeout(() => closeDialogNow(dialog, [CLOSING_CLASS]), DA_CLOSE_ANIMATION_DELAY + ANIMATION_FALLBACK_BUFFER);
}

/** Closes the dialog only after its own animation. */
function closeAfterDialogAnimation(event: AnimationEvent, dialog: HTMLDialogElement): void {
  if (event.target === dialog && !event.pseudoElement) {
    closeDialogNow(dialog, [CLOSING_CLASS]);
  }
}

/** Removes closing classes and closes the dialog immediately. */
function closeDialogNow(dialog: HTMLDialogElement, classNames: string[]): void {
  if (dialog.open) {
    dialog.classList.remove(...classNames);
    dialog.close();
  }
}

/** Checks whether the user prefers reduced motion. */
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
