/** Zeigt einen Screen und versteckt beliebig viele andere Screens. */
export function showScreen(screenToShow: HTMLElement, ...screensToHide: HTMLElement[]): void {
  screensToHide.forEach(screen => screen.classList.add('d_none'));
  screenToShow.classList.remove('d_none');
}
