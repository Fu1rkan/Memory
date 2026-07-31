import { THEME_PREVIEW_ALT_TEXTS, THEME_PREVIEW_IMAGES } from '../themes/theme-previews';
import { isGameTheme, type GameTheme } from '../themes/themes';

type SettingName = 'theme' | 'player' | 'board-size';

type FooterInfo = {
  theme: HTMLElement;
  player: HTMLElement;
  boardSize: HTMLElement;
  playerSeparator: SVGSVGElement;
  boardSizeSeparator: SVGSVGElement;
  startButton: HTMLButtonElement;
};

const REQUIRED_SETTINGS: SettingName[] = ['theme', 'player', 'board-size'];

/** Sets up theme, player and card selection on the home screen. */
export function setupHomeScreen(homeScreen: HTMLElement): void {
  const previewImage = getHomeElement<HTMLImageElement>(homeScreen, '.home-screen__preview-image');
  const footerInfo = getFooterInfo(homeScreen);

  homeScreen.addEventListener('change', event => {
    handleHomeScreenChange(event, homeScreen, previewImage, footerInfo);
  });

  homeScreen.addEventListener('pointerover', event => {
    showThemePreviewOnHover(event, previewImage);
  });

  homeScreen.addEventListener('pointerout', event => {
    restoreSelectedThemePreview(event, homeScreen, previewImage);
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
  updateSeparatorStates(homeScreen, footerInfo);
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
): void {
  if (!isGameTheme(input.value)) {
    return;
  }

  updateThemePreviewImage(previewImage, input.value);
  setFooterText(footerInfo.theme, getOptionText(input));
}

/** Updates the source and alt text of the theme preview image. */
function updateThemePreviewImage(previewImage: HTMLImageElement, selectedTheme: GameTheme): void {
  previewImage.src = THEME_PREVIEW_IMAGES[selectedTheme];
  previewImage.alt = THEME_PREVIEW_ALT_TEXTS[selectedTheme];
}

/** Temporarily shows the preview of the hovered theme option. */
function showThemePreviewOnHover(event: Event, previewImage: HTMLImageElement): void {
  const themeInput = getThemeInputFromTarget(event.target);

  if (themeInput && isGameTheme(themeInput.value)) {
    updateThemePreviewImage(previewImage, themeInput.value);
  }
}

/** Restores the selected preview after leaving a theme option. */
function restoreSelectedThemePreview(
  event: PointerEvent,
  homeScreen: HTMLElement,
  previewImage: HTMLImageElement,
): void {
  if (didLeaveThemeOption(event)) {
    showSelectedThemeImage(homeScreen, previewImage);
  }
}

/** Checks whether the pointer moved out of a theme option. */
function didLeaveThemeOption(event: PointerEvent): boolean {
  const leftThemeInput = getThemeInputFromTarget(event.target);
  const enteredThemeInput = getThemeInputFromTarget(event.relatedTarget);

  return Boolean(leftThemeInput && leftThemeInput !== enteredThemeInput);
}

/** Shows the image that belongs to the selected theme. */
function showSelectedThemeImage(homeScreen: HTMLElement, previewImage: HTMLImageElement): void {
  const checkedTheme = getSelectedThemeInput(homeScreen);

  if (checkedTheme && isGameTheme(checkedTheme.value)) {
    updateThemePreviewImage(previewImage, checkedTheme.value);
  }
}

/** Updates the selected player in the footer. */
function updatePlayerInfo(event: Event, footerInfo: FooterInfo): void {
  const playerInput = getChangedRadioInput(event, 'player');

  if (playerInput) {
    setFooterText(footerInfo.player, `${getOptionText(playerInput)} Player`);
  }
}

/** Updates the selected board size in the footer. */
function updateBoardSizeInfo(event: Event, footerInfo: FooterInfo): void {
  const boardSizeInput = getChangedRadioInput(event, 'board-size');

  if (boardSizeInput) {
    setFooterText(footerInfo.boardSize, `Board ${getOptionText(boardSizeInput)}`);
  }
}

/** Applies an already selected theme to the preview on load. */
function showSelectedTheme(
  homeScreen: HTMLElement,
  previewImage: HTMLImageElement,
  footerInfo: FooterInfo,
): void {
  const checkedTheme = getSelectedThemeInput(homeScreen);

  if (checkedTheme) {
    showThemePreview(checkedTheme, previewImage, footerInfo);
  }
}

/** Returns the currently selected theme input. */
function getSelectedThemeInput(homeScreen: HTMLElement): HTMLInputElement | null {
  return homeScreen.querySelector<HTMLInputElement>('input[name="theme"]:checked');
}

/** Returns the theme input inside the hovered option. */
function getThemeInputFromTarget(target: EventTarget | null): HTMLInputElement | null {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest('label')?.querySelector<HTMLInputElement>('input[name="theme"]') ?? null;
}

/** Collects all footer elements that are updated together. */
function getFooterInfo(homeScreen: HTMLElement): FooterInfo {
  return {
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

/** Updates a footer label directly. */
function setFooterText(footerLabel: HTMLElement, text: string): void {
  footerLabel.innerText = text;
}
