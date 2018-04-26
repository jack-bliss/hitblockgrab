import { LocalState } from '../interfaces/local-state.interface';
import { Card } from '../interfaces/card.interface';

const Cards: Card[] = require('../../cards/card-list.js');

const canvas = document.getElementById('canvas');

import { RenderConstants } from './render-constants';
import { drawCardFace } from './draw-card-face';
import { drawCardBack } from './draw-card-back';

export function renderState(state: LocalState) {


  canvas.innerHTML = '';
  
  for (let i = 0; i < state.opponentCards; i++) {
    canvas.appendChild(drawCardBack(
      RenderConstants.cardIndent + (i * RenderConstants.cardWidth) + (i * RenderConstants.cardSpacing),
      RenderConstants.opYPos,
    ));
  }
  
  let card: Card;
  state.myHand.forEach((card_index: number, i: number) => {
    card = Cards[card_index];
    canvas.appendChild(drawCardFace(
      card,
      RenderConstants.cardIndent + (i * RenderConstants.cardWidth) + (i * RenderConstants.cardSpacing),
      RenderConstants.myYPos,
    ));
  });
  
  
}
