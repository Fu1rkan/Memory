import type { ButtonVisual, ButtonVisuals } from './button-visuals';

let inlineSvgId = 0;

export function renderButtonVisuals(button: HTMLElement, visuals: ButtonVisuals, visualClassName: string) {
    button.replaceChildren(
        createButtonVisualElement(visuals.default, `${visualClassName} ${visualClassName}--default`),
        createButtonVisualElement(visuals.hover, `${visualClassName} ${visualClassName}--hover`),
    );
}

function createButtonVisualElement(visual: ButtonVisual, className: string) {
    const visualElement = document.createElement('span');
    visualElement.className = className;
    visualElement.setAttribute('aria-hidden', 'true');

    if (visual.type === 'text') {
        visualElement.classList.add('game-screen__button-text-visual');
        visualElement.textContent = visual.label;

        return visualElement;
    }

    visualElement.innerHTML = visual.markup;
    const svg = visualElement.querySelector('svg');
    svg?.setAttribute('focusable', 'false');

    if (svg) {
        namespaceSvgIds(svg, `button-svg-${inlineSvgId}`);
        inlineSvgId += 1;
    }

    return visualElement;
}

function namespaceSvgIds(svg: SVGSVGElement, namespace: string) {
    const idMap = new Map<string, string>();

    svg.querySelectorAll<SVGElement>('[id]').forEach(element => {
        const newId = `${namespace}-${element.id}`;
        idMap.set(element.id, newId);
        element.id = newId;
    });

    svg.querySelectorAll<SVGElement>('*').forEach(element => {
        Array.from(element.attributes).forEach(attribute => {
            let nextValue = attribute.value;

            idMap.forEach((newId, oldId) => {
                nextValue = nextValue
                    .replaceAll(`url(#${oldId})`, `url(#${newId})`)
                    .replaceAll(`#${oldId}`, `#${newId}`);
            });

            if (nextValue !== attribute.value) {
                element.setAttribute(attribute.name, nextValue);
            }
        });
    });
}
