/** Shows one screen and hides any number of other screens. */
export function showScreen(screenToShow: HTMLElement, ...screensToHide: HTMLElement[]): void {
  screensToHide.forEach(screen => screen.classList.add('d_none'));
  screenToShow.classList.remove('d_none');
}
