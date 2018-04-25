import { Game } from '../client/interfaces/game.interface';

export function NewGame(socket_id: string): Game {
    return {
        players: [socket_id],
        state: {
        },
        id: (Date.now() * 10000) + Math.floor(Math.random() * 10000)
    }
}