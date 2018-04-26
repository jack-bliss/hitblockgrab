import { createSVGElement } from './create-svg-element';
import { Card } from '../interfaces/card.interface';
import { RenderConstants } from './render-constants';
const Cards: Card[] = require('../../cards/card-list.js');

export function drawCardFace(card_id: number, id: string, x: number, y: number): SVGElement {
  
  const card: Card = Cards[card_id];
  
  const g: SVGElement = createSVGElement('svg');
  g.setAttribute('x', x + '');
  g.setAttribute('y', y + '');
  
  const rect: SVGRectElement = createSVGElement('rect') as SVGRectElement;
  rect.setAttribute('fill', 'white');
  rect.setAttribute('stroke', RenderConstants.cardStroke);
  rect.setAttribute('width', RenderConstants.cardWidth + '');
  rect.setAttribute('height', RenderConstants.cardHeight + '');
  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  
  const text: SVGTextElement = createSVGElement('text') as SVGTextElement;
  text.textContent = card.name;
  text.setAttribute('fill', RenderConstants.typeColourMap[card.type]);
  text.setAttribute('width', RenderConstants.cardWidth + '');
  text.setAttribute('height', RenderConstants.cardNameSize + '');
  text.setAttribute('x', RenderConstants.cardNameX + '');
  text.setAttribute('y', RenderConstants.cardNameY + '');
  
  g.appendChild(rect);
  g.appendChild(text);
  
  g.setAttribute('data-card', card_id + '');
  g.setAttribute('data-owner', 'me');
  g.setAttribute('id', 'card-face-' + id);
  
  return g;

}
