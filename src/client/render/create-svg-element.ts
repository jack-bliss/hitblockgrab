export function createSVGElement(tag: string): SVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}
