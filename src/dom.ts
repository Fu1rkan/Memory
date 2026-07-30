/** Gibt ein Element anhand seiner ID zurueck oder wirft einen klaren Fehler. */
export function getElementById(id: string): HTMLElement {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Element with id "${id}" was not found.`);
  }

  return element;
}

/** Gibt ein Dialog-Element anhand seiner ID zurueck. */
export function getDialogById(id: string): HTMLDialogElement {
  const element = getElementById(id);

  if (!(element instanceof HTMLDialogElement)) {
    throw new Error(`Dialog with id "${id}" was not found.`);
  }

  return element;
}

/** Gibt das naechste passende Element zum Event-Target zurueck. */
export function getClosestElement(event: Event, selector: string): Element | null {
  const target = event.target;

  return target instanceof Element ? target.closest(selector) : null;
}
