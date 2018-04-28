export interface LocalState {

  played: { me: number; op: number; }[];
  opponentCards: number;
  myHand: number[];
  advantage: number;
  health: { me: number; op: number; };
  selected: { me: number; op: boolean; };
  phase: 'start' | 'select' | 'compare' | 'roundOver' | 'gameOver';
  winner: 'me' | 'op' | 'tie';
  rounds: { me: number; op: number; };
  timer: { target: number; current: number; };

}
