type ScreenEnterAnimationOptions = {
  element: HTMLElement;
  enteringClass: string;
  fallbackDelay: number;
  onFinished: () => void;
};

type AnimationState = {
  isFinished: boolean;
};

/** Wartet auf die Enter-Animation eines Screens und fuehrt danach Cleanup aus. */
export function runScreenEnterAnimation(options: ScreenEnterAnimationOptions): void {
  const finishAnimation = createAnimationFinisher(options);

  options.element.addEventListener('animationend', finishAnimation, { once: true });
  window.setTimeout(finishAnimation, getMotionAwareDelay(options.fallbackDelay));
}

/** Erstellt einen Finisher, der nur einmal ausgefuehrt werden kann. */
function createAnimationFinisher(options: ScreenEnterAnimationOptions): () => void {
  const state: AnimationState = { isFinished: false };

  return () => finishAnimationOnce(options, state);
}

/** Schliesst die Animation ab, falls sie noch nicht abgeschlossen wurde. */
function finishAnimationOnce(options: ScreenEnterAnimationOptions, state: AnimationState): void {
  if (state.isFinished) {
    return;
  }

  state.isFinished = true;
  options.element.classList.remove(options.enteringClass);
  options.onFinished();
}

/** Gibt bei reduzierter Bewegung sofort zurueck, sonst den Fallback-Wert. */
function getMotionAwareDelay(fallbackDelay: number): number {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 0;
  }

  return fallbackDelay;
}
