export interface Card {
  
  name: string;
  type: 'hit' | 'block' | 'grab' | 'special';
  tags: CardTag[];
  
}

export enum CardTag {
  // change who wins
  CLASH_BREAK = 'clashBreak', // wins ties
  REVERSE = 'reverse', // reverses the order of success
  FEINT = 'feint', // always beats a block (should never be put on a block)

  // change damage dealt
  ARMOUR = 'armour', // takes no damage
  HEAVY = 'heavy', // deals double damage
  PARRY = 'parry', // deals 1 damage (on block type cards)
}
