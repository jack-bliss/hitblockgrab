import { createSVGElement } from './create-svg-element';
import { writeText } from './write-text';
import { Card } from '../interfaces/card.interface';
import { RenderConstants } from './render-constants';
const TagData: { [key: string]: string } = require('../../cards/tag-data.js');
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
  
  const name: SVGTextElement = writeText(card.name, RenderConstants.cardNameX, RenderConstants.cardNameY, id + '-name');
  name.setAttribute('fill', RenderConstants.typeColourMap[card.type]);
  name.setAttribute('width', RenderConstants.cardWidth + '');
  name.setAttribute('height', RenderConstants.cardNameSize + '');
  
  g.appendChild(rect);
  g.appendChild(name);
  
  if (card.tags.length) {
    let tag: SVGElement;
    card.tags.forEach((t, i) => {
      tag = writeText(TagData[t], RenderConstants.cardNameX, RenderConstants.cardNameY * (1 + (2 * i)), id + '-tag-' + t);
      tag.setAttribute('fill', RenderConstants.typeColourMap[card.type]);
      tag.setAttribute('width', RenderConstants.cardWidth + '');
      tag.setAttribute('height', (RenderConstants.cardNameY * 2) + '');
      g.appendChild(tag);
    });
  }
  
  g.setAttribute('data-card', card_id + '');
  g.setAttribute('data-owner', 'me');
  g.setAttribute('id', 'card-face-' + id);
  
  return g;

}
