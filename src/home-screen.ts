import { isGameTheme, type GameTheme } from './game-themes';

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

const THEME_IMAGE_FOLDER = `${import.meta.env.BASE_URL}img/themes`;
const REQUIRED_SETTINGS: SettingName[] = ['theme', 'player', 'board-size'];
const FOOTER_WIDTH_TRANSITION_DURATION = 250;
const MIN_WIDTH_CHANGE = 1;

let footerResizeTimeout: number | undefined;

const THEME_PREVIEW_IMAGES: Record<GameTheme, string> = {
  'code-vibes': `${THEME_IMAGE_FOLDER}/code_vibes.png`,
  gaming: `${THEME_IMAGE_FOLDER}/gaming_theme.png`,
  'da-projects': `${THEME_IMAGE_FOLDER}/da_theme.png`,
  foods: `${THEME_IMAGE_FOLDER}/food_theme.png`,
};

/** Richtet die Theme-, Spieler- und Karten-Auswahl im Home Screen ein. */
export function setupHomeScreen(homeScreen: HTMLElement): void {
  const previewImage = getHomeElement<HTMLImageElement>(homeScreen, '.home-screen__preview-image');
  const footerInfo = getFooterInfo(homeScreen);

  homeScreen.addEventListener('change', event => {
    handleHomeScreenChange(event, homeScreen, previewImage, footerInfo);
  });

  showInitialFooterState(homeScreen, previewImage, footerInfo);
}

/** Aktualisiert alle Footer-Infos nach einer Auswahl-Aenderung. */
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

/** Setzt die Startwerte fuer Preview, Separatoren und Startbutton. */
function showInitialFooterState(
  homeScreen: HTMLElement,
  previewImage: HTMLImageElement,
  footerInfo: FooterInfo,
): void {
  showSelectedTheme(homeScreen, previewImage, footerInfo);
  updateSeparatorStates(homeScreen, footerInfo);
  updateStartButtonState(homeScreen, footerInfo.startButton);
}

/** Aktualisiert das Theme-Bild, wenn ein Theme gewaehlt wurde. */
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

/** Zeigt das Preview-Bild und den Theme-Namen im Footer. */
function showThemePreview(
  input: HTMLInputElement,
  previewImage: HTMLImageElement,
  footerInfo: FooterInfo,
  animateLabel = true,
): void {
  if (!isGameTheme(input.value)) {
    return;
  }

  previewImage.src = THEME_PREVIEW_IMAGES[input.value];
  setFooterText(footerInfo.footer, footerInfo.theme, getOptionText(input), animateLabel);
}

/** Aktualisiert den ausgewaehlten Spieler im Footer. */
function updatePlayerInfo(event: Event, footerInfo: FooterInfo): void {
  const playerInput = getChangedRadioInput(event, 'player');

  if (playerInput) {
    setFooterText(footerInfo.footer, footerInfo.player, `${getOptionText(playerInput)} Player`);
  }
}

/** Aktualisiert die ausgewaehlte Board-Groesse im Footer. */
function updateBoardSizeInfo(event: Event, footerInfo: FooterInfo): void {
  const boardSizeInput = getChangedRadioInput(event, 'board-size');

  if (boardSizeInput) {
    setFooterText(footerInfo.footer, footerInfo.boardSize, `Board ${getOptionText(boardSizeInput)}`);
  }
}

/** Uebernimmt beim Laden ein bereits gesetztes Theme in die Preview. */
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

/** Sammelt alle Footer-Elemente, die gemeinsam aktualisiert werden. */
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

/** Aktualisiert die Sichtbarkeit der Footer-Separatoren. */
function updateSeparatorStates(homeScreen: HTMLElement, footerInfo: FooterInfo): void {
  setSeparatorState(footerInfo.playerSeparator, hasSelectedOption(homeScreen, 'player'));
  setSeparatorState(footerInfo.boardSizeSeparator, hasSelectedOption(homeScreen, 'board-size'));
}

/** Markiert einen Footer-Separator als aktiv oder inaktiv. */
function setSeparatorState(separator: SVGSVGElement, isActive: boolean): void {
  separator.classList.toggle('home-screen__footer-separator--active', isActive);
}

/** Aktiviert den Startbutton erst, wenn alle Einstellungen gesetzt sind. */
function updateStartButtonState(homeScreen: HTMLElement, startButton: HTMLButtonElement): void {
  startButton.disabled = !hasSelectedAllSettings(homeScreen);
}

/** Prueft, ob Theme, Spieler und Board-Groesse gewaehlt wurden. */
function hasSelectedAllSettings(homeScreen: HTMLElement): boolean {
  return REQUIRED_SETTINGS.every(settingName => hasSelectedOption(homeScreen, settingName));
}

/** Prueft, ob eine bestimmte Radio-Gruppe eine Auswahl hat. */
function hasSelectedOption(homeScreen: HTMLElement, inputName: SettingName): boolean {
  return Boolean(homeScreen.querySelector(`input[name="${inputName}"]:checked`));
}

/** Gibt den geaenderten Radio-Input zurueck, falls er zur Gruppe passt. */
function getChangedRadioInput(event: Event, inputName: SettingName): HTMLInputElement | null {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || target.name !== inputName) {
    return null;
  }

  return target;
}

/** Gibt ein Home-Screen-Element zurueck oder meldet einen Strukturfehler. */
function getHomeElement<T extends Element = HTMLElement>(homeScreen: HTMLElement, selector: string): T {
  const element = homeScreen.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Home screen element "${selector}" was not found.`);
  }

  return element;
}

/** Liest den sichtbaren Text der Option aus. */
function getOptionText(input: HTMLInputElement): string {
  return input.closest('label')?.textContent?.trim() || '';
}

/** Setzt einen Footer-Text ohne Animation. */
function setFooterTextNow(footerLabel: HTMLElement, text: string): void {
  footerLabel.innerText = text;
}

/** Setzt einen Footer-Text bei Bedarf mit Breitenanimation. */
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

/** Entscheidet, ob der Footer-Text animiert oder direkt gesetzt wird. */
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

/** Animiert die Footer-Breite um geaenderte Inhalte herum. */
function animateFooterWidth(footer: HTMLElement, updateContent: () => void): void {
  const startWidth = setFixedFooterWidth(footer);

  updateContent();
  animateToNaturalFooterWidth(footer, startWidth);
}

/** Fixiert die aktuelle Footer-Breite und gibt sie zurueck. */
function setFixedFooterWidth(footer: HTMLElement): number {
  const startWidth = footer.getBoundingClientRect().width;

  footer.style.width = `${startWidth}px`;

  return startWidth;
}

/** Animiert den Footer auf seine natuerliche Breite. */
function animateToNaturalFooterWidth(footer: HTMLElement, startWidth: number): void {
  const endWidth = getFooterNaturalWidth(footer);

  if (hasTinyWidthChange(startWidth, endWidth)) {
    resetFooterWidth(footer);
    return;
  }

  animateFooterToWidth(footer, startWidth, endWidth);
}

/** Prueft, ob die Breite zu klein fuer eine sichtbare Animation ist. */
function hasTinyWidthChange(startWidth: number, endWidth: number): boolean {
  return Math.abs(startWidth - endWidth) < MIN_WIDTH_CHANGE;
}

/** Startet die eigentliche CSS-Transition fuer die Footer-Breite. */
function animateFooterToWidth(footer: HTMLElement, startWidth: number, endWidth: number): void {
  window.clearTimeout(footerResizeTimeout);
  footer.style.width = `${startWidth}px`;
  footer.getBoundingClientRect();
  footer.style.width = `${endWidth}px`;
  footerResizeTimeout = window.setTimeout(resetFooterWidth, FOOTER_WIDTH_TRANSITION_DURATION, footer);
}

/** Entfernt die fixe Footer-Breite nach der Animation. */
function resetFooterWidth(footer: HTMLElement): void {
  footer.style.width = '';
}

/** Misst die natuerliche Footer-Breite ohne laufende Transition. */
function getFooterNaturalWidth(footer: HTMLElement): number {
  const previousTransition = footer.style.transition;
  const previousWidth = footer.style.width;

  footer.style.transition = 'none';
  footer.style.width = 'max-content';

  return restoreFooterAfterMeasurement(footer, previousWidth, previousTransition);
}

/** Stellt alte Styles wieder her und gibt die gemessene Breite zurueck. */
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
