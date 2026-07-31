import { THEME_PREVIEW_ALT_TEXTS, THEME_PREVIEW_IMAGES } from '../themes/theme-previews';
import { isGameTheme, type GameTheme } from '../themes/themes';

type SettingName = 'theme' | 'player' | 'board-size';

type FooterInfo = {
  footer: HTMLElement;
  theme: HTMLElement;
  player: HTMLElement;
  boardSize: HTMLElement;
  playerSeparator: SVGSVGElement;
  boardSizeSeparator: SVGSVGElement;
  startButton: HTMLButtonElement;
};

const REQUIRED_SETTINGS: SettingName[] = ['theme', 'player', 'board-size'];
const FOOTER_WIDTH_TRANSITION_DURATION = 250;
const MIN_WIDTH_CHANGE = 1;

let footerResizeTimeout: number | undefined;

/** Sets up theme, player and card selection on the home screen. */
export function setupHomeScreen(homeScreen: HTMLElement): void {
  const previewImage = getHomeElement<HTMLImageElement>(homeScreen, '.home-screen__preview-image');
  const footerInfo = getFooterInfo(homeScreen);

  homeScreen.addEventListener('change', event => {
    handleHomeScreenChange(event, homeScreen, previewImage, footerInfo);
  });

  showInitialFooterState(homeScreen, previewImage, footerInfo);
}

/** Updates all footer details after a selection change. */
function handleHomeScreenChange(
  event: Event,
  homeScreen: HTMLElement,
  previewImage: HTMLImageElement,
  footerInfo: FooterInfo,
): void {
  updateThemePreview(event, previewImage, footerInfo);
  updatePlayerInfo(event, footerInfo);
  updateBoardSizeInfo(event, footerInfo);
  animateFooterWidth(footerInfo.footer, () => updateSeparatorStates(homeScreen, footerInfo));
  updateStartButtonState(homeScreen, footerInfo.startButton);
}

/** Sets the initial values for preview, separators and start button. */
function showInitialFooterState(
  homeScreen: HTMLElement,
  previewImage: HTMLImageElement,
  footerInfo: FooterInfo,
): void {
  showSelectedTheme(homeScreen, previewImage, footerInfo);
  updateSeparatorStates(homeScreen, footerInfo);
  updateStartButtonState(homeScreen, footerInfo.startButton);
}

/** Updates the theme image when a theme was selected. */
function updateThemePreview(
  event: Event,
  previewImage: HTMLImageElement,
  footerInfo: FooterInfo,
): void {
  const themeInput = getChangedRadioInput(event, 'theme');

  if (themeInput) {
    showThemePreview(themeInput, previewImage, footerInfo);
  }
}

/** Shows the preview image and theme name in the footer. */
function showThemePreview(
  input: HTMLInputElement,
  previewImage: HTMLImageElement,
  footerInfo: FooterInfo,
  animateLabel = true,
): void {
  if (!isGameTheme(input.value)) {
    return;
  }

  updateThemePreviewImage(previewImage, input.value);
  setFooterText(footerInfo.footer, footerInfo.theme, getOptionText(input), animateLabel);
}

/** Updates the source and alt text of the theme preview image. */
function updateThemePreviewImage(previewImage: HTMLImageElement, selectedTheme: GameTheme): void {
  previewImage.src = THEME_PREVIEW_IMAGES[selectedTheme];
  previewImage.alt = THEME_PREVIEW_ALT_TEXTS[selectedTheme];
}

/** Updates the selected player in the footer. */
function updatePlayerInfo(event: Event, footerInfo: FooterInfo): void {
  const playerInput = getChangedRadioInput(event, 'player');

  if (playerInput) {
    setFooterText(footerInfo.footer, footerInfo.player, `${getOptionText(playerInput)} Player`);
  }
}

/** Updates the selected board size in the footer. */
function updateBoardSizeInfo(event: Event, footerInfo: FooterInfo): void {
  const boardSizeInput = getChangedRadioInput(event, 'board-size');

  if (boardSizeInput) {
    setFooterText(footerInfo.footer, footerInfo.boardSize, `Board ${getOptionText(boardSizeInput)}`);
  }
}

/** Applies an already selected theme to the preview on load. */
function showSelectedTheme(
  homeScreen: HTMLElement,
  previewImage: HTMLImageElement,
  footerInfo: FooterInfo,
): void {
  const checkedTheme = homeScreen.querySelector<HTMLInputElement>('input[name="theme"]:checked');

  if (checkedTheme) {
    showThemePreview(checkedTheme, previewImage, footerInfo, false);
  }
}

/** Collects all footer elements that are updated together. */
function getFooterInfo(homeScreen: HTMLElement): FooterInfo {
  return {
    footer: getHomeElement(homeScreen, '.home-screen__footer'),
    theme: getHomeElement(homeScreen, '#game-theme-info'),
    player: getHomeElement(homeScreen, '#player-info'),
    boardSize: getHomeElement(homeScreen, '#board-size-info'),
    playerSeparator: getHomeElement<SVGSVGElement>(homeScreen, '#player-separator'),
    boardSizeSeparator: getHomeElement<SVGSVGElement>(homeScreen, '#board-size-separator'),
    startButton: getHomeElement(homeScreen, '.home-screen__footer-button--start'),
  };
}

/** Updates the visibility state of the footer separators. */
function updateSeparatorStates(homeScreen: HTMLElement, footerInfo: FooterInfo): void {
  setSeparatorState(footerInfo.playerSeparator, hasSelectedOption(homeScreen, 'player'));
  setSeparatorState(footerInfo.boardSizeSeparator, hasSelectedOption(homeScreen, 'board-size'));
}

/** Marks a footer separator as active or inactive. */
function setSeparatorState(separator: SVGSVGElement, isActive: boolean): void {
  separator.classList.toggle('home-screen__footer-separator--active', isActive);
}

/** Enables the start button only after all settings are selected. */
function updateStartButtonState(homeScreen: HTMLElement, startButton: HTMLButtonElement): void {
  startButton.disabled = !hasSelectedAllSettings(homeScreen);
}

/** Checks whether theme, player and board size were selected. */
function hasSelectedAllSettings(homeScreen: HTMLElement): boolean {
  return REQUIRED_SETTINGS.every(settingName => hasSelectedOption(homeScreen, settingName));
}

/** Checks whether a specific radio group has a selection. */
function hasSelectedOption(homeScreen: HTMLElement, inputName: SettingName): boolean {
  return Boolean(homeScreen.querySelector(`input[name="${inputName}"]:checked`));
}

/** Returns the changed radio input when it belongs to the requested group. */
function getChangedRadioInput(event: Event, inputName: SettingName): HTMLInputElement | null {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || target.name !== inputName) {
    return null;
  }

  return target;
}

/** Returns a home screen element or reports a structure error. */
function getHomeElement<T extends Element = HTMLElement>(homeScreen: HTMLElement, selector: string): T {
  const element = homeScreen.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Home screen element "${selector}" was not found.`);
  }

  return element;
}

/** Reads the visible text from an option. */
function getOptionText(input: HTMLInputElement): string {
  return input.closest('label')?.textContent?.trim() || '';
}

/** Sets footer text without animation. */
function setFooterTextNow(footerLabel: HTMLElement, text: string): void {
  footerLabel.innerText = text;
}

/** Sets footer text with width animation when needed. */
function setFooterText(
  footer: HTMLElement,
  footerLabel: HTMLElement,
  text: string,
  animate = true,
): void {
  if (footerLabel.innerText === text) {
    return;
  }

  updateFooterText(footer, footerLabel, text, animate);
}

/** Decides whether footer text is animated or set directly. */
function updateFooterText(
  footer: HTMLElement,
  footerLabel: HTMLElement,
  text: string,
  animate: boolean,
): void {
  if (animate) {
    animateFooterWidth(footer, () => setFooterTextNow(footerLabel, text));
  } else {
    setFooterTextNow(footerLabel, text);
  }
}

/** Animates the footer width around changed content. */
function animateFooterWidth(footer: HTMLElement, updateContent: () => void): void {
  const startWidth = setFixedFooterWidth(footer);

  updateContent();
  animateToNaturalFooterWidth(footer, startWidth);
}

/** Fixes the current footer width and returns it. */
function setFixedFooterWidth(footer: HTMLElement): number {
  const startWidth = footer.getBoundingClientRect().width;

  footer.style.width = `${startWidth}px`;

  return startWidth;
}

/** Animates the footer to its natural width. */
function animateToNaturalFooterWidth(footer: HTMLElement, startWidth: number): void {
  const endWidth = getFooterNaturalWidth(footer);

  if (hasTinyWidthChange(startWidth, endWidth)) {
    resetFooterWidth(footer);
    return;
  }

  animateFooterToWidth(footer, startWidth, endWidth);
}

/** Checks whether the width change is too small for a visible animation. */
function hasTinyWidthChange(startWidth: number, endWidth: number): boolean {
  return Math.abs(startWidth - endWidth) < MIN_WIDTH_CHANGE;
}

/** Starts the actual CSS transition for the footer width. */
function animateFooterToWidth(footer: HTMLElement, startWidth: number, endWidth: number): void {
  window.clearTimeout(footerResizeTimeout);
  footer.style.width = `${startWidth}px`;
  footer.getBoundingClientRect();
  footer.style.width = `${endWidth}px`;
  footerResizeTimeout = window.setTimeout(resetFooterWidth, FOOTER_WIDTH_TRANSITION_DURATION, footer);
}

/** Removes the fixed footer width after the animation. */
function resetFooterWidth(footer: HTMLElement): void {
  footer.style.width = '';
}

/** Measures the natural footer width without an active transition. */
function getFooterNaturalWidth(footer: HTMLElement): number {
  const previousTransition = footer.style.transition;
  const previousWidth = footer.style.width;

  footer.style.transition = 'none';
  footer.style.width = 'max-content';

  return restoreFooterAfterMeasurement(footer, previousWidth, previousTransition);
}

/** Restores previous styles and returns the measured width. */
function restoreFooterAfterMeasurement(
  footer: HTMLElement,
  previousWidth: string,
  previousTransition: string,
): number {
  const width = footer.getBoundingClientRect().width;

  footer.style.width = previousWidth;
  footer.style.transition = previousTransition;

  return width;
}
