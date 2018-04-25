import { Game } from '../interfaces/game.interface';

export function findGame(socket: any): Promise<Game> {
  socket.emit('find_game', { });
  return new Promise((resolve: (n: Game) => void, reject: (n: any) => void) => {
    socket.on('game_found', (game: Game) => {
      resolve(game);
    });
  });
}