import { findGame } from './matchmaking/find-game';
import { awaitOpponent } from './matchmaking/await-opponent';
import { Game } from './interfaces/game.interface';

declare function io(): any;

const socket = io();

findGame(socket)
  .then((game: Game) => {
    if (game.players.length < 2) {
      console.log('awaiting opponent. . . ');
      return awaitOpponent(socket);
    } else {
      console.log('found a game with an opponent');
      return Promise.resolve(game);
    }
  })
  .then((game: Game) => {
    console.log('ready to play! have an opponent:', game);
  });

