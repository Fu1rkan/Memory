export function showScreen(screenToShow: HTMLElement, ...screensToHide: HTMLElement[]) {
    screensToHide.forEach(screen => screen.classList.add('d_none'));
    screenToShow.classList.remove('d_none');
}
