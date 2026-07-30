type ScreenEnterAnimationOptions = {
  element: HTMLElement;
  enteringClass: string;
  fallbackDelay: number;
  onFinished: () => void;
};

type AnimationState = {
  isFinished: boolean;
};

/** Waits for a screen enter animation and runs cleanup afterward. */
export function runScreenEnterAnimation(options: ScreenEnterAnimationOptions): void {
  const finishAnimation = createAnimationFinisher(options);

  options.element.addEventListener('animationend', finishAnimation, { once: true });
  window.setTimeout(finishAnimation, getMotionAwareDelay(options.fallbackDelay));
}

/** Creates a finisher that can only run once. */
function createAnimationFinisher(options: ScreenEnterAnimationOptions): () => void {
  const state: AnimationState = { isFinished: false };

  return () => finishAnimationOnce(options, state);
}

/** Finishes the animation if it has not already finished. */
function finishAnimationOnce(options: ScreenEnterAnimationOptions, state: AnimationState): void {
  if (state.isFinished) {
    return;
  }

  state.isFinished = true;
  options.element.classList.remove(options.enteringClass);
  options.onFinished();
}

/** Returns immediately for reduced motion, otherwise returns the fallback value. */
function getMotionAwareDelay(fallbackDelay: number): number {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 0;
  }

  return fallbackDelay;
}
