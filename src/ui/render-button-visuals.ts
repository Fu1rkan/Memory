import type { ButtonVisual, ButtonVisuals } from '../themes/button-visuals';

let inlineSvgId = 0;

/** Renders the default and hover visuals of a button. */
export function renderButtonVisuals(
  button: HTMLElement,
  visuals: ButtonVisuals,
  visualClassName: string,
): void {
  button.replaceChildren(
    createButtonVisualElement(visuals.default, `${visualClassName} ${visualClassName}--default`),
    createButtonVisualElement(visuals.hover, `${visualClassName} ${visualClassName}--hover`),
  );
}

/** Creates a visible button visual as a span. */
function createButtonVisualElement(visual: ButtonVisual, className: string): HTMLSpanElement {
  const visualElement = createVisualContainer(className);

  if (visual.type === 'text') {
    renderTextVisual(visualElement, visual.label);
  } else {
    renderSvgVisual(visualElement, visual.markup);
  }

  return visualElement;
}

/** Creates the shared container for button visuals. */
function createVisualContainer(className: string): HTMLSpanElement {
  const visualElement = document.createElement('span');

  visualElement.className = className;
  visualElement.setAttribute('aria-hidden', 'true');

  return visualElement;
}

/** Renders a text visual into the container. */
function renderTextVisual(visualElement: HTMLElement, label: string): void {
  visualElement.classList.add('game-screen__button-text-visual');
  visualElement.textContent = label;
}

/** Renders an SVG visual into the container. */
function renderSvgVisual(visualElement: HTMLElement, markup: string): void {
  visualElement.innerHTML = markup;

  const svg = visualElement.querySelector('svg');

  if (svg) {
    prepareInlineSvg(svg);
  }
}

/** Prepares an inline SVG for being rendered multiple times in the DOM. */
function prepareInlineSvg(svg: SVGSVGElement): void {
  svg.setAttribute('focusable', 'false');
  namespaceSvgIds(svg, `button-svg-${inlineSvgId}`);
  inlineSvgId += 1;
}

/** Adds a unique prefix to all IDs inside an SVG. */
function namespaceSvgIds(svg: SVGSVGElement, namespace: string): void {
  const idMap = createSvgIdMap(svg, namespace);

  updateSvgReferenceAttributes(svg, idMap);
}

/** Creates a map from old SVG IDs to new SVG IDs. */
function createSvgIdMap(svg: SVGSVGElement, namespace: string): Map<string, string> {
  const idMap = new Map<string, string>();

  svg.querySelectorAll<SVGElement>('[id]').forEach(element => {
    addNamespacedSvgId(idMap, element, namespace);
  });

  return idMap;
}

/** Adds one namespaced SVG ID to the map. */
function addNamespacedSvgId(idMap: Map<string, string>, element: SVGElement, namespace: string): void {
  const newId = `${namespace}-${element.id}`;

  idMap.set(element.id, newId);
  element.id = newId;
}

/** Updates all attributes that reference SVG IDs. */
function updateSvgReferenceAttributes(svg: SVGSVGElement, idMap: Map<string, string>): void {
  svg.querySelectorAll<SVGElement>('*').forEach(element => {
    updateElementReferenceAttributes(element, idMap);
  });
}

/** Updates the reference attributes of one SVG element. */
function updateElementReferenceAttributes(element: SVGElement, idMap: Map<string, string>): void {
  Array.from(element.attributes).forEach(attribute => {
    updateAttributeReference(element, attribute, idMap);
  });
}

/** Replaces ID references in one attribute. */
function updateAttributeReference(
  element: SVGElement,
  attribute: Attr,
  idMap: Map<string, string>,
): void {
  const nextValue = replaceSvgIdReferences(attribute.value, idMap);

  if (nextValue !== attribute.value) {
    element.setAttribute(attribute.name, nextValue);
  }
}

/** Replaces all known SVG ID references in one attribute value. */
function replaceSvgIdReferences(value: string, idMap: Map<string, string>): string {
  let nextValue = value;

  idMap.forEach((newId, oldId) => {
    nextValue = nextValue.replaceAll(`url(#${oldId})`, `url(#${newId})`);
    nextValue = nextValue.replaceAll(`#${oldId}`, `#${newId}`);
  });

  return nextValue;
}
