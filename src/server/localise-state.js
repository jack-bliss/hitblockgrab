module.exports = function(state, p) {
    return {
        played: state.played.map(played => {
            return {
                me: played['p' + p],
                op: played['p' + (1 - p)],
            }
        }),
        opponentCards: state.cardsInHand['p' + (1 - p)].length,
        myHand: state.cardsInHand['p' + p],
        advantage: state.advantage,
        health: {
            me: state.health['p' + p],
            op: state.health['p' + (1 - p)],
        },
        selected: {
            me: state.selected['p' + p],
            op: state.selected['p' + (1 - p)] !== null,
        },
        phase: state.phase.id,
        winner: (() => {
            if (state.winner === 'p' + p) {
                return 'me';
            } else if (state.winner === 'p' + (1 - p)) {
                return 'op';
            } else {
                return state.winner;
            }
        })(),
    }
};