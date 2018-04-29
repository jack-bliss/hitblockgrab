
const express = require('express');
const join = require('path').join;

const server = express();
const http = require('http').Server(server);
const io = require('socket.io')(http);

const NewGame = require('./server/new-game');
const UpdateState = require('./server/update-state');
const LocaliseState = require('./server/localise-state');
const RuleConstants = require('./server/rule-constants');

const FPS = RuleConstants.FPS;

const DIST = join(process.cwd(), 'dist');

let games = [];

io.on('connection', (socket) => {
  const mySocket = io.sockets.connected[socket.id];

  socket.on('disconnect', (reason) => {
    let g;
    let opp;
    for (let i = 0; i < games.length; i++) {
      g = games[i];
      if (g.players.indexOf(mySocket) > -1) {
        clearInterval(g.loop);
        opp = g.players.filter(sid => sid !== socket.id);
        if (io.sockets.connected[opp]) {
          io.sockets.connected[opp].emit('opponent_left');
        }
        games.splice(i, 1);
        i--;
      }
    }
  });

  socket.on('find_game', () => {
    console.log('player seeking game');
    let game = games.find((g) => {
      return g.players.length < 2;
    });
    if (!game) {
      console.log('creating new pending game');
      game = NewGame(socket.id);
      games.push(game);
    } else {
      console.log('starting game');
      game.players.push(socket.id);
      io.sockets.connected[game.players[0]].emit('opponent_found');
      game.loop = setInterval(() => {

        game.state = UpdateState(game.state, game.inputs);
        game.inputs = { p0: {}, p1: {} };

        game.players.forEach((ps, i) => {
          if (io.sockets.connected[ps]) {
            io.sockets.connected[ps].emit('state', LocaliseState(game.state, i));
          }
        });

      }, (1000 / FPS));
    }
    mySocket.emit('game_found', {
      players: game.players.length,
      game_id: game.id,
      socket_id: socket.id,
    });
  });

  socket.on('input', (input) => {
    if (input.data.type !== null) {
      let game = games.find(g => g.id === input.game);
      let player = 'p' + game.players.indexOf(input.player);
      game.inputs[player] = input.data;
    }
  });

});

server.get('/', (req, res) => {
  res.sendFile(join(DIST, 'index.html'));
});

server.get('*.*', express.static(DIST));

const PORT = process.env.PORT || 4040;

http.listen(PORT, '0.0.0.0', () => {
  console.log('hitblockgrab up on ' + PORT);
});