export interface Card {
  
  name: string;
  type: 'hit' | 'block' | 'grab' | 'special';
  tags: CardTag[];
  
}

export enum CardTag {

  REVERSE = 'reverse',
  CLASH_BREAK = 'clashBreak',

}