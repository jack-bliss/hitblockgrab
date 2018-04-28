const BeatsMap = {
  'hit': ['grab', 'special'],
  'block': ['hit', 'special'],
  'grab': ['block', 'special'],
  'special': [],
};

// damage dealt on a win
const DamageMap = {
  'hit': {
    'win': 1,
    'tie': 1,
    'lose': 0,
  },
  'block': {
    'win': 0,
    'tie': 0,
    'lose': 0,
  },
  'grab': {
    'win': 1,
    'tie': 1,
    'lose': 0,
  },
  'special': {
    'win': 1,
    'tie': 0,
    'lose': 0,
  }
};

const P = ['p0', 'p1'];
const otherP = (p) => P[(1 - P.indexOf(p))];
const hasTag = (card, tag) => card.tags.indexOf('tag') > -1;

// returns the id of the winning player
const winner = (p0, p1) => {
  const cardOf = { p0, p1 };
  let w;
  if (p0.type === p1.type) {
    // round is a tie, unless one player played a clashBreak
    w = 'tie';
    P.forEach(p => {
      if (hasTag(cardOf[p], 'clashBreak') && !hasTag(cardOf[otherP(p)], 'clashBreak')) {
        w = p;
      }
    })
  } else {
    // round is won by the person who won the RPS,
    // unless one player played a feint and the other played a block
    w = BeatsMap[p0.type].indexOf(p1.type) > -1 ? 'p0' : 'p1';
    P.forEach(p => {
      if (hasTag(cardOf[p], 'feint') && !hasTag(cardOf[otherP(p)], 'feint')) {
        if (cardOf[otherP(p)].type === 'block') {
          w = p;
        }
      }
    });
  }
  // if exactly one player played a reverse card, flip the win
  if (w !== 'tie') {
    if (hasTag(p0, 'reverse') ? !hasTag(p1, 'reverse') : hasTag(p1, 'reverse')) {
      w = otherP(w);
    }
  }
  return w;
};

const result = (p0, p1) => {

  const w = winner(p0, p1);
  const resultMap = {};
  const damage = {};
  const cardOf = { p0, p1 };
  // first pass to establish who won and determine base damage
  P.forEach((p) => {
    if (w === p) {
      resultMap[p] = 'win';
    } else if (w === 'tie') {
      resultMap[p] = 'tie';
    } else {
      resultMap[p] = 'lose';
    }
    // damage is looked up by map
    damage[otherP(p)] = DamageMap[cardOf[p].type][resultMap[p]];
    // heavy cards do double damage
    if (hasTag(cardOf[p], 'heavy')) {
      damage[otherP(p)] = 2 * damage[otherP(p)];
    }
  });

  // second pass to resolve tag effects and advantage
  let advantage = 'none';
  P.forEach(p => {
    // armoured cards take no damage
    if (hasTag(cardOf[p], 'armour')) {
      damage[p] = 0;
    }
    // blocking a hit gains advantage on win
    if (cardOf[p].type === 'block' && cardOf[otherP(p)].type === 'hit' && w === p) {
      advantage = p;
    }
  });

  return {
    winner, // player who won
    damage, // damage dealt TO player
    advantage, // player with advantage
  }

};

module.exports = {

  otherP,
  hasTag,
  winner,
  result,

};