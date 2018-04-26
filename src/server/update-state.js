const RuleConstants = require('./rule-constants');
const Cards = require('../cards/card-list');

const P = ['p0', 'p1'];

module.exports = function(prev, input, fps) {
    let next = Object.assign({}, prev);
    next.phase.counter++;
    if (next.phase.id === 'start') {
        if (next.phase.counter >= RuleConstants.START_TIME * fps) {
            next.phase.counter = 0;
            next.phase.id = 'select';
        }
    } else if (next.phase.id === 'select') {
        P.forEach(p => {
            if (
                input[p].type === 'my_card_clicked' &&
                next.cardsInHand[p].indexOf(input[p].data) > -1
            ) {
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

            const p0Card = Cards[next.selected.p0];
            const p1Card = Cards[next.selected.p1];

            const thisRound = {
                p0: p0Card,
                p1: p1Card,
            };

            // some kind of iterative thing - dont want to have to duplicate for both sides

        }
        if (next.phase.counter === (RuleConstants.COMPARE_TIME * fps) - 1) {
            P.forEach(p => {
                if (next.selected[p] !== null) {
                    next.cardsInHand[p].push(next.selected[p]);
                }
            });
            next.selected = { p0: null, p1: null };
        }
        if (next.phase.counter >= RuleConstants.COMPARE_TIME * fps) {
            next.phase.counter = 0;
            next.phase.id = 'select';
        }
    }
    return next;
}