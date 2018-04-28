const RuleConstants = require('./rule-constants');

module.exports = function (state, n) {
  let m = 'p' + n;
  let o = 'p' + (1 - n);

  return {
    played: state.played.map(played => {
      return {
        me: played[m],
        op: played[o],
      }
    }),
    opponentCards: state.cardsInHand[o].length,
    myHand: state.cardsInHand[m],
    advantage: (() => {
      if (state.advantage === m) {
        return 'me';
      } else if (state.advantage === o) {
        return 'op';
      } else {
        return state.advantage;
      }
    })(),
    health: {
      me: state.health[m],
      op: state.health[o],
    },
    selected: {
      me: state.selected[m],
      op: state.selected[o] !== null,
    },
    phase: state.phase.id,
    winner: (() => {
      if (state.winner === m) {
        return 'me';
      } else if (state.winner === o) {
        return 'op';
      } else {
        return state.winner;
      }
    })(),
    rounds: {
      me: state.rounds[m],
      op: state.rounds[o],
    },
    timer: {
      target: {
        'start': RuleConstants.START_TIME,
        'select': RuleConstants.SELECT_TIME,
        'compare': RuleConstants.COMPARE_TIME,
        'roundOver': RuleConstants.ROUND_OVER_TIME,
        'gameOver': 0,
      }[state.phase.id],
      current: state.phase.counter / RuleConstants.FPS,
    }
  }
};