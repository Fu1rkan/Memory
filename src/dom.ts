/** Returns an element by its ID or throws a clear error. */
export function getElementById(id: string): HTMLElement {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Element with id "${id}" was not found.`);
  }

  return element;
}

/** Returns a dialog element by its ID. */
export function getDialogById(id: string): HTMLDialogElement {
  const element = getElementById(id);

  if (!(element instanceof HTMLDialogElement)) {
    throw new Error(`Dialog with id "${id}" was not found.`);
  }

  return element;
}

/** Returns the closest matching element from the event target. */
export function getClosestElement(event: Event, selector: string): Element | null {
  const target = event.target;

  return target instanceof Element ? target.closest(selector) : null;
}
