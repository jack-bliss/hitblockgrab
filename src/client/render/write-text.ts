import { createSVGElement } from './create-svg-element';

export function writeText(text: string | number, x: number, y: number, id: string): SVGTextElement {
    const o = createSVGElement('text') as SVGTextElement;
    o.textContent = String(text);
    o.setAttribute('x', x + '');
    o.setAttribute('y', y + '');
    o.setAttribute('id', id);
    return o;
}