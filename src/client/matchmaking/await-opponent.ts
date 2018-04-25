import { Game } from '../interfaces/game.interface';

export function awaitOpponent(socket: any): Promise<Game> {
  
  return new Promise((resolve: (n: Game) => void, reject: (n: any) => void) => {
    socket.on('opponent_found', (game: Game) => {
      resolve(game);
    });
  });

}