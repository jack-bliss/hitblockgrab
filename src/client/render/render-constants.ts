const cW = 600;
const cH = 500;

const cardBackFill = 'rgb(150, 150, 250)';
const cardStroke = 'black';

const cardWidth = 100;
const cardHeight = 140;
const cardSpacing = 30;
const cardIndent = 135;

const opYPos = 30;
const myYPos = cH - cardHeight - opYPos;

const cardNameY = 25;
const cardNameX = 10;
const cardNameSize = 20;
const typeColourMap: { [key: string]: string } = {
  'hit': 'red',
  'block': 'blue',
  'grab': 'green',
};

export const RenderConstants = {
  cW,
  cH,
  cardBackFill,
  cardStroke,
  cardWidth,
  cardHeight,
  cardSpacing,
  opYPos,
  myYPos,
  cardNameY,
  cardNameX,
  cardNameSize,
  typeColourMap,
  cardIndent,
};
