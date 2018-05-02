const BeatsMap = {
  'hit': ['grab', 'special'],
  'block': ['hit'],
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
  let w, p0beatsp1, p1beatsp0;
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
    p0beatsp1 = BeatsMap[p0.type].indexOf(p1.type) > -1;
    p1beatsp0 = BeatsMap[p1.type].indexOf(p0.type) > -1;
    if (p0beatsp1) {
      w = 'p0';
    } else if (p1beatsp0) {
      w = 'p1';
    } else {
      w = 'tie';
    }
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
  let advantage = 'none';
  // check each player on a first pass
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
    // parry cards deal 1 damage on a win
    if (hasTag(cardOf[p], 'parry') && w === p) {
      damage[otherP(p)] = 1;
    }
    // heavy cards do double damage regardless of outcome
    if (hasTag(cardOf[p], 'heavy')) {
      damage[otherP(p)] = 2 * damage[otherP(p)];
    }
    // winning with a block grants advantage
    if (cardOf[p].type === 'block' && w === p) {
      advantage = p;
    }
  });
  // initial damage/advantage set, now correct
  P.forEach(p => {
    // armour cards neutralise damage
    if (hasTag(cardOf[p], 'armour')) {
      damage[p] = 0;
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