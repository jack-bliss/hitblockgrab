
const express = require('express');
const join = require('path').join;

const server = express();
const http = require('http').Server(server);
const io = require('socket.io')(http);

const NewGame = require('./server/new-game');

const DIST = join(process.cwd(), 'dist');

let games = [];

io.on('connection', (socket) => {
  console.log('connected');
  const mySocket = io.sockets.connected[socket.id];

  socket.on('handshake', (info) => {
    console.log('received handshake', info);
    mySocket.emit('response');
  });

  socket.on('disconnect', (reason) => {
    games = games.filter((game) => {
      return game.players.indexOf(socket.id) === -1;
    });
  });

  socket.on('find_game', (info) => {
    console.log('player seeking game', info);
      let game = games.find((g) => {
      return g.players.length < 2;
    });
    if (!game) {
      game = NewGame(socket.id);
      games.push(game);
    } else {
      game.players.push(socket.id);
      io.sockets.connected[game.players[0]].emit('opponent_found', game);
    }
    mySocket.emit('game_found', game);
  });

});

server.get('/', (req, res) => {
  res.sendFile(join(DIST, 'index.html'));
});

server.get('*.*', express.static(DIST));

http.listen(4040, '0.0.0.0', () => {
  console.log('hitblockgrab up on 4040');
});