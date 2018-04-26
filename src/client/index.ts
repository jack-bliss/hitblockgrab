import { findGame, GameFoundResponse } from './matchmaking/find-game';
import { awaitOpponent } from './matchmaking/await-opponent';
import { renderState } from './render/render';
import { LocalState } from './interfaces/local-state.interface';

declare function io(): any;

const socket = io();
let my_id: string = null;
let my_game_id: number = null;

findGame(socket)
  .then(({ players, socket_id, game_id }: GameFoundResponse) => {
    console.log(players, socket_id, my_game_id);
    my_id = socket_id;
    my_game_id = game_id;
    if (players < 2) {
      console.log('awaiting opponent. . . ');
      return awaitOpponent(socket);
    } else {
      console.log('found a game with an opponent');
      return Promise.resolve(true);
    }
  })
  .then(() => {
    console.log('ready to play! have an opponent!');
    socket.on('state', (state: LocalState) => {
      renderState(state, {
        socket,
        game_id: my_game_id,
        socket_id: my_id,
      });
    });
  });

