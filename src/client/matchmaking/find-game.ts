export interface GameFoundResponse {
  players: number;
  socket_id: string;
};

export function findGame(socket: any): Promise<GameFoundResponse> {
  socket.emit('find_game', { });
  return new Promise((resolve: (n: GameFoundResponse) => void, reject: (n: any) => void) => {
    socket.on('game_found', (players: GameFoundResponse) => {
      resolve(players);
    });
  });
}
