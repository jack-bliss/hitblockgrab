import { LocalState } from '../interfaces/local-state.interface';
import { Input } from '../interfaces/input.interface';

import { RenderConstants } from './render-constants';

import { drawCardFace } from './draw-card-face';
import { drawCardBack } from './draw-card-back';
import { createSVGElement } from './create-svg-element';

const canvas = document.getElementById('canvas');

let nextInput: Input = {
  type: null,
  data: null,
};

canvas.addEventListener('click', (e: MouseEvent) => {
  console.log(e);
  let p: HTMLElement = e.target as HTMLElement;
  while (p) {
    console.log(p);
    if (p.hasAttribute('data-card')) {
      nextInput = {
        type: 'my_card_clicked',
        data: parseInt(p.getAttribute('data-card'), 10),
      };
      p = null;
    } else if (p.parentElement) {
      p = p.parentElement;
    } else {
      p = null;
    }
  }
  console.log(nextInput);
});

interface RenderDetails {
  socket: any;
  game_id: number;
  socket_id: string;
}

let prev: LocalState = {
  played: [],
  opponentCards: 0,
  myHand: [],
  advantage: -1,
  health: { me: 0, op: 0 },
  selected: { me: null, op: false },
  phase: null,
};

export function renderState(state: LocalState, { socket, game_id, socket_id }: RenderDetails) {
  
  if (state.phase !== prev.phase) {
    const prevPhase = document.getElementById('phase-name');
    if (prevPhase) {
      prevPhase.parentNode.removeChild(prevPhase);
    }
    
    const phase = createSVGElement('text');
    phase.textContent = state.phase;
    phase.setAttribute('x', '0');
    phase.setAttribute('y', (RenderConstants.cH / 2) + '');
    phase.setAttribute('id', 'phase-name');
    canvas.appendChild(phase);
  }
  
  if (prev.opponentCards !== state.opponentCards) {
    
    for (let i = 0; i < prev.opponentCards; i++) {
      const prevOpHandCard = document.getElementById('card-back-op-hand-' + i);
      prevOpHandCard.parentNode.removeChild(prevOpHandCard);
    }
    
    for (let i = 0; i < state.opponentCards; i++) {
      canvas.appendChild(drawCardBack(
        'op-hand-' + i,
        RenderConstants.cardIndent + (i * RenderConstants.cardWidth) + (i * RenderConstants.cardSpacing),
        RenderConstants.opYPos,
      ));
    }
  }
  
  if (state.myHand.length !== prev.myHand.length) {
  
    for (let i = 0; i < prev.myHand.length; i++) {
      const prevOpHandCard = document.getElementById('card-face-my-hand-' + i);
      prevOpHandCard.parentNode.removeChild(prevOpHandCard);
    }
    
    state.myHand.forEach((card_index: number, i: number) => {
      canvas.appendChild(drawCardFace(
        card_index,
        'my-hand-' + i,
        RenderConstants.cardIndent + (i * RenderConstants.cardWidth) + (i * RenderConstants.cardSpacing),
        RenderConstants.myYPos,
      ));
    });
    
  }
  
  if (state.phase === 'select') {
  
    if (state.selected.op !== prev.selected.op) {
      if (state.selected.op) {
        canvas.appendChild(drawCardBack(
          'op-selected',
          (RenderConstants.cW / 2) - (RenderConstants.cardWidth),
          (RenderConstants.opYPos * 2) + RenderConstants.cardHeight,
        ));
      } else {
        const prevOpSelected = document.getElementById('card-back-op-selected');
        if (prevOpSelected) {
          prevOpSelected.parentNode.removeChild(prevOpSelected);
        }
      }
    }
  
    if (state.selected.me !== prev.selected.me) {
      const prevMeSelected = document.getElementById('card-face-my-selected');
      if (prevMeSelected) {
        prevMeSelected.parentNode.removeChild(prevMeSelected);
      }
      if (state.selected.me !== null) {
        canvas.appendChild(drawCardFace(
          state.selected.me,
          'my-selected',
          (RenderConstants.cW / 2) + (RenderConstants.cardWidth),
          RenderConstants.myYPos - RenderConstants.opYPos - RenderConstants.cardHeight,
        ));
      }
    }
    
  } else {
    // remove selected cards when phase ends
    const prevOpSelected = document.getElementById('card-back-op-selected');
    if (prevOpSelected) {
      prevOpSelected.parentNode.removeChild(prevOpSelected);
    }
    const prevMeSelected = document.getElementById('card-face-my-selected');
    if (prevMeSelected) {
      prevMeSelected.parentNode.removeChild(prevMeSelected);
    }
  }
  
  if (state.phase === 'compare') {
    
    if (state.played.length) {
      
      const thisOpPlayed = state.played.length ? state.played[state.played.length - 1].op : null;
      const prevOpPlayed = prev.played.length ? prev.played[prev.played.length - 1].op : null;
      
      if (thisOpPlayed !== prevOpPlayed) {
        if (thisOpPlayed !== null) {
          canvas.appendChild(drawCardFace(
            thisOpPlayed,
            'op-played',
            (RenderConstants.cW / 2) - (RenderConstants.cardWidth),
            (RenderConstants.opYPos * 2) + RenderConstants.cardHeight,
          ));
        } else {
          const prevOpPlayedE = document.getElementById('card-face-op-played');
          if (prevOpPlayedE) {
            prevOpPlayedE.parentNode.removeChild(prevOpPlayedE);
          }
        }
      }
      
      const thisMePlayed = state.played.length ? state.played[state.played.length - 1].me : null;
      const prevMePlayed = prev.played.length ? prev.played[prev.played.length - 1].me : null;
    
      if (thisMePlayed !== prevMePlayed) {
        if (thisMePlayed !== null) {
          console.log(state.played);
          canvas.appendChild(drawCardFace(
            thisMePlayed,
            'my-played',
            (RenderConstants.cW / 2) + (RenderConstants.cardWidth),
            RenderConstants.myYPos - RenderConstants.opYPos - RenderConstants.cardHeight,
          ));
        } else {
          const prevMePlayedE = document.getElementById('card-face-my-played');
          if (prevMePlayedE) {
            prevMePlayedE.parentNode.removeChild(prevMePlayedE);
          }
        }
      }
  
    }
  
  } else {
    // remove played cards when phase ends
    const prevMePlayed = document.getElementById('card-face-my-played');
    if (prevMePlayed) {
      prevMePlayed.parentNode.removeChild(prevMePlayed);
    }
    const prevOpPlayed = document.getElementById('card-face-op-played');
    if (prevOpPlayed) {
      prevOpPlayed.parentNode.removeChild(prevOpPlayed);
    }
  }
  
  socket.emit('input', {
    game: game_id,
    player: socket_id,
    data: nextInput,
  });
  
  nextInput = {
    type: null,
    data: null,
  };
  
  prev = state;
  
  
}
