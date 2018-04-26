const RuleConstants = require('./rule-constants');

module.exports = function(socket_id) {
    return {
        loop: null,
        players: [socket_id],
        state: {
            selected: {
                p0: null,
                p1: null,
            },
            played: [],
            cardsInHand: {
                p0: [0, 1, 2],
                p1: [0, 1, 2],
            },
            advantage: -1,
            health: {
                p0: RuleConstants.START_HEALTH,
                p1: RuleConstants.START_HEALTH,
            },
            phase: {
                id: 'start',
                counter: 0,
            }
        },
        id: (Date.now() * 10000) + Math.floor(Math.random() * 10000),
        inputs: {
            p0: {},
            p1: {},
        }
    };
};
