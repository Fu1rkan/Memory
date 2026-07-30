import type { ButtonVisual, ButtonVisuals } from './button-visuals';

let inlineSvgId = 0;

/** Rendert Default- und Hover-Visual eines Buttons. */
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

/** Erstellt ein sichtbares Button-Visual als Span. */
function createButtonVisualElement(visual: ButtonVisual, className: string): HTMLSpanElement {
  const visualElement = createVisualContainer(className);

  if (visual.type === 'text') {
    renderTextVisual(visualElement, visual.label);
  } else {
    renderSvgVisual(visualElement, visual.markup);
  }

  return visualElement;
}

/** Erstellt den gemeinsamen Container fuer Button-Visuals. */
function createVisualContainer(className: string): HTMLSpanElement {
  const visualElement = document.createElement('span');

  visualElement.className = className;
  visualElement.setAttribute('aria-hidden', 'true');

  return visualElement;
}

/** Rendert ein Text-Visual in den Container. */
function renderTextVisual(visualElement: HTMLElement, label: string): void {
  visualElement.classList.add('game-screen__button-text-visual');
  visualElement.textContent = label;
}

/** Rendert ein SVG-Visual in den Container. */
function renderSvgVisual(visualElement: HTMLElement, markup: string): void {
  visualElement.innerHTML = markup;

  const svg = visualElement.querySelector('svg');

  if (svg) {
    prepareInlineSvg(svg);
  }
}

/** Bereitet ein Inline-SVG fuer mehrfaches Rendern im DOM vor. */
function prepareInlineSvg(svg: SVGSVGElement): void {
  svg.setAttribute('focusable', 'false');
  namespaceSvgIds(svg, `button-svg-${inlineSvgId}`);
  inlineSvgId += 1;
}

/** Versieht alle IDs eines SVGs mit einem eindeutigen Prefix. */
function namespaceSvgIds(svg: SVGSVGElement, namespace: string): void {
  const idMap = createSvgIdMap(svg, namespace);

  updateSvgReferenceAttributes(svg, idMap);
}

/** Erstellt eine Map aus alter und neuer SVG-ID. */
function createSvgIdMap(svg: SVGSVGElement, namespace: string): Map<string, string> {
  const idMap = new Map<string, string>();

  svg.querySelectorAll<SVGElement>('[id]').forEach(element => {
    addNamespacedSvgId(idMap, element, namespace);
  });

  return idMap;
}

/** Fuegt eine einzelne SVG-ID mit Namespace zur Map hinzu. */
function addNamespacedSvgId(idMap: Map<string, string>, element: SVGElement, namespace: string): void {
  const newId = `${namespace}-${element.id}`;

  idMap.set(element.id, newId);
  element.id = newId;
}

/** Aktualisiert alle Attribute, die auf SVG-IDs verweisen. */
function updateSvgReferenceAttributes(svg: SVGSVGElement, idMap: Map<string, string>): void {
  svg.querySelectorAll<SVGElement>('*').forEach(element => {
    updateElementReferenceAttributes(element, idMap);
  });
}

/** Aktualisiert die Referenzattribute eines SVG-Elements. */
function updateElementReferenceAttributes(element: SVGElement, idMap: Map<string, string>): void {
  Array.from(element.attributes).forEach(attribute => {
    updateAttributeReference(element, attribute, idMap);
  });
}

/** Ersetzt ID-Referenzen in einem einzelnen Attribut. */
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

/** Ersetzt alle bekannten SVG-ID-Referenzen in einem Attributwert. */
function replaceSvgIdReferences(value: string, idMap: Map<string, string>): string {
  let nextValue = value;

  idMap.forEach((newId, oldId) => {
    nextValue = nextValue.replaceAll(`url(#${oldId})`, `url(#${newId})`);
    nextValue = nextValue.replaceAll(`#${oldId}`, `#${newId}`);
  });

  return nextValue;
}
