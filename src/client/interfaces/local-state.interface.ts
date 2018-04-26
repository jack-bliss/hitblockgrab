export interface LocalState {

  played: { me: number; op: number }[];
  
  opponentCards: number;

  myHand: number[];
  
  advantage: number;
  
  health: { me: number; op: number };
  
}