import { RenderConstants } from './render-constants';
import { createSVGElement } from './create-svg-element';

export function drawCardBack(x: number, y: number): SVGRectElement {
  
  const rect: SVGRectElement = createSVGElement('rect') as SVGRectElement;
  rect.setAttribute('fill', RenderConstants.cardBackFill);
  rect.setAttribute('stroke', RenderConstants.cardStroke);
  rect.setAttribute('x', x + '');
  rect.setAttribute('y', y + '');
  rect.setAttribute('width', RenderConstants.cardWidth + '');
  rect.setAttribute('height', RenderConstants.cardHeight + '');
  
  return rect;
  
}
