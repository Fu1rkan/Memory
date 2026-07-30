import { CARD_IMAGES } from './card-images';
import type { BoardSize } from './game-settings';
import type { GameTheme } from './game-themes';

type MemoryCardElements = {
  card: HTMLButtonElement;
  cardInner: HTMLSpanElement;
  cardBack: HTMLSpanElement;
  cardFront: HTMLSpanElement;
  cardImage: HTMLImageElement;
};

const CARDS_PER_PAIR = 2;
const FIRST_CARD_NUMBER = 1;

/** Creates shuffled image pairs for the current memory game. */
export function createShuffledCardImages(selectedTheme: GameTheme, boardSize: BoardSize): string[] {
  const pairCount = boardSize / CARDS_PER_PAIR;
  const selectedImages = getRandomCardImages(CARD_IMAGES[selectedTheme], pairCount);
  const cardImagePairs = selectedImages.flatMap(imageSrc => [imageSrc, imageSrc]);

  return shuffle(cardImagePairs);
}

/** Creates a clickable memory card element. */
export function createMemoryCard(imageSrc: string, index: number): HTMLButtonElement {
  const elements = createMemoryCardElements();

  configureMemoryCard(elements.card, imageSrc, index);
  configureCardImage(elements.cardImage, imageSrc);
  elements.cardFront.append(elements.cardImage);
  elements.cardInner.append(elements.cardBack, elements.cardFront);
  elements.card.append(elements.cardInner);

  return elements.card;
}

/** Selects random images for the needed card pairs. */
function getRandomCardImages(images: string[], count: number): string[] {
  assertHasCardImages(images);
  const selectedImages = shuffle([...images]).slice(0, count);

  fillMissingCardImages(selectedImages, images, count);

  return selectedImages;
}

/** Fails when a theme has no card images. */
function assertHasCardImages(images: string[]): void {
  if (images.length === 0) {
    throw new Error('No card images found for selected theme.');
  }
}

/** Fills missing images when a theme has too few motifs. */
function fillMissingCardImages(selectedImages: string[], images: string[], count: number): void {
  while (selectedImages.length < count) {
    selectedImages.push(images[getRandomIndex(images)]);
  }
}

/** Returns a random array index. */
function getRandomIndex(items: string[]): number {
  return Math.floor(Math.random() * items.length);
}

/** Shuffles an array with the Fisher-Yates algorithm. */
function shuffle<T>(items: T[]): T[] {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    swapWithRandomPreviousItem(shuffledItems, index);
  }

  return shuffledItems;
}

/** Swaps one item with a random previous item. */
function swapWithRandomPreviousItem<T>(items: T[], index: number): void {
  const randomIndex = Math.floor(Math.random() * (index + 1));

  [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
}

/** Creates the DOM elements of a memory card. */
function createMemoryCardElements(): MemoryCardElements {
  return {
    card: document.createElement('button'),
    cardInner: createCardSpan('game-screen__card-inner'),
    cardBack: createCardSpan('game-screen__card-face game-screen__card-face--back'),
    cardFront: createCardSpan('game-screen__card-face game-screen__card-face--front'),
    cardImage: document.createElement('img'),
  };
}

/** Creates a span element with the given class name. */
function createCardSpan(className: string): HTMLSpanElement {
  const spanElement = document.createElement('span');

  spanElement.className = className;

  return spanElement;
}

/** Sets attributes and data for a memory card. */
function configureMemoryCard(card: HTMLButtonElement, imageSrc: string, index: number): void {
  card.className = 'game-screen__card';
  card.type = 'button';
  card.dataset.cardImage = imageSrc;
  card.setAttribute('aria-label', `Memory card ${index + FIRST_CARD_NUMBER}`);
  card.setAttribute('aria-pressed', 'false');
}

/** Sets image source and drag behavior for a card image. */
function configureCardImage(cardImage: HTMLImageElement, imageSrc: string): void {
  cardImage.className = 'game-screen__card-image';
  cardImage.src = imageSrc;
  cardImage.alt = '';
  cardImage.draggable = false;
}
