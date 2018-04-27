const RuleConstants = require('./rule-constants');
const Cards = require('../cards/card-list');
const ComparisonTree = require('./comparison-tree');
const GetResult = ComparisonTree.result;
const otherP = ComparisonTree.otherP;

const P = ['p0', 'p1'];

module.exports = function (prev, input, fps) {
  let next = Object.assign({}, prev);
  next.phase.counter++;
  if (next.phase.id === 'start') {
    if (next.phase.counter >= RuleConstants.START_TIME * fps) {
      next.phase.counter = 0;
      next.phase.id = 'select';
    }
  } else if (next.phase.id === 'select') {
    P.forEach(p => {
      if (input[p].type === 'my_card_clicked' && next.cardsInHand[p].indexOf(input[p].data) > -1) {
        if (next.selected[p]) {
          next.cardsInHand[p].push(next.selected[p]);
        }
        console.log(p, 'selected card', input[p].data);
        next.selected[p] = input[p].data;
        next.cardsInHand[p] = next.cardsInHand[p].filter(c => c !== input[p].data);
        console.log('new hand', next.cardsInHand[p]);
      }
    });
    if (next.phase.counter >= RuleConstants.SELECT_TIME * fps) {
      next.phase.counter = 0;
      next.phase.id = 'compare';
    }
  } else if (next.phase.id === 'compare') {
    if (next.phase.counter === 1) {
      next.played.push(next.selected);
      // figure out who won right here
      const p0Card = next.selected.p0 === null ? Cards[0] : Cards[next.selected.p0];
      const p1Card = next.selected.p1 === null ? Cards[0] : Cards[next.selected.p1];

      const Result = GetResult(p0Card, p1Card);

      next.winner = Result.winner;
      P.forEach(p => {
        next.health[p] -= Result.damage[p];
      });
      next.advantage = Result.advantage;

    }

    if (next.phase.counter === (RuleConstants.COMPARE_TIME * fps) - 1) {
      P.forEach(p => {
        // IMPLEMENT ADVANTAGE HERE:
        if (next.advantage === p) {
          next.cardsInHand[p] = [4, 2, 5];
        } else {
          next.cardsInHand[p] = [1, 2, 3];
        }
      });
      next.selected = { p0: null, p1: null };
    }

    if (next.phase.counter >= RuleConstants.COMPARE_TIME * fps) {
      next.phase.counter = 0;
      P.forEach(p => {
        if (next.health[p] <= 0) {
          next.rounds[otherP(p)]++;
          if (otherP(p).rounds >= RuleConstants.ROUNDS_TO_WIN) {
            next.phase.id = 'gameOver';
          } else {
            next.phase.id = 'roundOver';
          }
        }
      });
      if (next.phase.id === 'compare') {
        next.phase.id = 'select';
      }
    }
  } else if (next.phase.id === 'roundOver') {

    if (next.phase.counter === 1) {

      P.forEach(p => {
        // reset round
        next.health[p] = RuleConstants.START_HEALTH;
        next.cardsInHand[p] = [1, 2, 3];
      });
    }

    if (next.phase.counter === RuleConstants.ROUND_OVER_TIME * fps) {
      next.phase.counter = 0;
      next.phase.id = 'select';
    }
  } else if (next.phase.id === 'gameOver') {
    next.phase.counter = 0;
  }


  return next;
};
