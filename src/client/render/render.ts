import { LocalState } from '../interfaces/local-state.interface';
import { Input } from '../interfaces/input.interface';

import { RenderConstants } from './render-constants';

import { drawCardFace } from './draw-card-face';
import { drawCardBack } from './draw-card-back';
import { removeIfExists } from './remove-if-exists';
import { writeText } from './write-text';
import { drawMyHand } from './draw-my-hand';

const canvas = document.getElementById('canvas');

let nextInput: Input = {
  type: null,
  data: null,
};

canvas.addEventListener('click', (e: MouseEvent) => {
  let p: HTMLElement = e.target as HTMLElement;
  while (p) {
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
  winner: null,
  rounds: { me: -1, op: -1 },
  timer: { target: -1, current: -1 },
};

export function renderState(state: LocalState, { socket, game_id, socket_id }: RenderDetails) {

  removeIfExists('timer');
  canvas.appendChild(
    writeText(
      state.timer.current.toFixed(2),
      0, (RenderConstants.cH / 2) + 20, 'timer'
    )
  );

  if (state.phase !== prev.phase) {
    removeIfExists('phase-name');
    canvas.appendChild(writeText(state.phase, 0, RenderConstants.cH / 2, 'phase-name'));
  }
  
  if (state.health.me !== prev.health.me) {
    removeIfExists('my-health');
    canvas.appendChild(writeText(state.health.me, 10, RenderConstants.cH - 20, 'my-health'));
  }
  
  if (state.health.op !== prev.health.op) {
    removeIfExists('op-health');
    canvas.appendChild(writeText(state.health.op, 10, 20, 'op-health'));
  }
  
  if (prev.opponentCards !== state.opponentCards) {
    
    for (let i = 0; i < prev.opponentCards; i++) {
      removeIfExists('card-back-op-hand-' + i);
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
    drawMyHand(canvas, state.myHand, prev.myHand.length);
  }
  
  if (state.phase === 'select') {
  
    if (state.selected.op !== prev.selected.op) {
      if (state.selected.op) {
        canvas.appendChild(drawCardBack(
          'op-selected',
          (RenderConstants.cW / 2) - ((3 / 2) * RenderConstants.cardWidth),
          RenderConstants.opYPos + RenderConstants.cardHeight,
        ));
      } else {
        removeIfExists('card-back-op-selected');
      }
    }
  
    if (state.selected.me !== prev.selected.me) {

      drawMyHand(canvas, state.myHand, prev.myHand.length);

      removeIfExists('card-face-me-selected');
      if (state.selected.me !== null) {
        canvas.appendChild(drawCardFace(
          state.selected.me,
          'me-selected',
          (RenderConstants.cW / 2) + ((3 / 2) * RenderConstants.cardWidth),
          RenderConstants.myYPos - RenderConstants.cardHeight,
        ));
      }

    }
    
  } else {
    // remove selected cards when phase ends
    removeIfExists('card-back-op-selected');
    removeIfExists('card-face-me-selected');
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
            (RenderConstants.cW / 2) - ((3 / 2) * RenderConstants.cardWidth),
            RenderConstants.opYPos + RenderConstants.cardHeight,
          ));
        } else {
          removeIfExists('card-face-op-played');
        }
      }
      
      const thisMePlayed = state.played.length ? state.played[state.played.length - 1].me : null;
      const prevMePlayed = prev.played.length ? prev.played[prev.played.length - 1].me : null;

      if (thisMePlayed !== prevMePlayed) {
        if (thisMePlayed !== null) {
          canvas.appendChild(drawCardFace(
            thisMePlayed,
            'me-played',
            (RenderConstants.cW / 2) + ((3 / 2) * RenderConstants.cardWidth),
            RenderConstants.myYPos - RenderConstants.cardHeight,
          ));
        } else {
          removeIfExists('card-face-me-played');
        }
      }
  
    }
  
  } else {
    // remove played cards when phase ends
    removeIfExists('card-face-me-played');
    removeIfExists('card-face-op-played');
  }

  if (state.phase === 'roundOver' && prev.phase !== 'roundOver') {
    canvas.appendChild(
      writeText('KO!', RenderConstants.cW / 2, RenderConstants.cH / 2, 'ko-text')
    );
  } else if (state.phase !== 'roundOver' && prev.phase === 'roundOver') {
    removeIfExists('ko-text');
  }

  if (state.phase === 'gameOver' && prev.phase !== 'gameOver') {
    canvas.appendChild(
      writeText('Game Over!', RenderConstants.cW / 2, RenderConstants.cH / 2, 'ko-text')
    );
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
