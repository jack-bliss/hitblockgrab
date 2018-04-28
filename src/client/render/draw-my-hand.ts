import { RenderConstants } from './render-constants';
import { removeIfExists } from './remove-if-exists';
import { drawCardFace } from './draw-card-face';

export function drawMyHand(canvas: HTMLElement, cards: number[], prevHandSize: number) {
  for (let i = 0; i < prevHandSize; i++) {
    removeIfExists('card-face-my-hand-' + i);
  }
  cards.forEach((card_index: number, i: number) => {
    canvas.appendChild(drawCardFace(
      card_index,
      'my-hand-' + i,
      RenderConstants.cardIndent + (i * RenderConstants.cardWidth) + (i * RenderConstants.cardSpacing),
      RenderConstants.myYPos,
    ));
  });
}
