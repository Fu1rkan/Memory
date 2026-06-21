export function getElementById(id: string) {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Element with id "${id}" was not found.`);
    }

    return element;
}

export function getDialogById(id: string) {
    const element = getElementById(id);

    if (!(element instanceof HTMLDialogElement)) {
        throw new Error(`Dialog with id "${id}" was not found.`);
    }

    return element;
}

export function getClosestElement(event: Event, selector: string) {
    const target = event.target;

    return target instanceof Element ? target.closest(selector) : null;
}
