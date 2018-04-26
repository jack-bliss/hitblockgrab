import { findGame, GameFoundResponse } from './matchmaking/find-game';
import { awaitOpponent } from './matchmaking/await-opponent';
import { listenForState } from './requests/listen-for-state';

declare function io(): any;

const socket = io();
let my_id: string = null;

findGame(socket)
  .then(({ players, socket_id }: GameFoundResponse) => {
    console.log(players, socket_id);
    my_id = socket_id;
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
    listenForState(socket);
  });

