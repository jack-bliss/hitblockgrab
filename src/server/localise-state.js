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
    }
};