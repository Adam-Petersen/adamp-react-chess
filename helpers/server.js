const io = require('socket.io')();


var games = [];
var queue = [];
var hostedGames = [];

function hostGame(socket, gameId) {
  for(let i = 0; i < hostedGames.length; i++) {
    if (hostedGames[i].gameId === gameId) {
      console.log('bad host');
      socket.emit('bad host');
      return;
    }
  }

  hostedGames.push({socketId: socket.id, gameId: gameId});
  console.log('good host');
  socket.emit('good host');
}

function removeHost(id) {
  for(let i = 0; i < hostedGames.length; i++) {
    if (hostedGames[i].socketId === id) {
      hostedGames.splice(i,1);
      console.log('Removing frome hostedGames. New length: ' + hostedGames.length);
      break;
    }
  }
}

function joinGame(socket, gameId) {
  for(let i = 0; i < hostedGames.length; i++) {
    if (hostedGames[i].gameId === gameId && !hostedGames[i].started) {
      console.log('found player');
      hostedGames[i].started = true;
      emitGameFound(hostedGames[i].socketId, socket.id);
      return;
    }
  }

  console.log('game not found');
  socket.emit('game not found');
}

function handleDisconnect(id) {

  // Remove frome queue if they haven't found game
  for(let i = 0; i < queue.length; i++) {
    if (queue[i] === id) {
      queue.splice(i,1);
      console.log('Removing frome queue. New queue length: ' + queue.length);
    }
  }

  // Remove from hostedGames if they're hosting a game
  removeHost(id);

  // Signal their opponent if they are in a game
  for(let i = 0; i < games.length; i++) {
    if (games[i][0] === id || games[i][1] === id) {
      let stillConnected = games[i][0] === id ? games[i][1] : games[i][0];
      io.to(stillConnected).emit('opponent disconnected');
      games.splice(i,1);
      console.log('Removing game. New game size: ' + games.length);
      return;
    }
  }
}

function emitGameFound(white, black) {
  console.log('found game: ' + white + ' vs ' + black);
  io.to(white).emit('found player', {opp_id: black, color: 'white'});
  io.to(black).emit('found player', {opp_id: white, color: 'black'});
  games.push([white, black]);
}

function search(id) {
  queue.push(id);
  console.log('queue length after pushing: ' + queue.length);
}

function removeSearch(id) {
  queue.splice(queue.indexOf(id), 1);
  console.log('removing search from queue, new length: ' + queue.length);
}

setInterval(() => {
  while(queue.length >= 2) {
    var white = queue.shift();
    var black = queue.shift();
    emitGameFound(white, black);
    console.log('queue length after game found: ' + queue.length);
  }
}, 2000);

io.on('connection', socket => {
  console.log(socket.id + ' connected');

  socket.on('disconnect', function(data) {
    console.log(socket.id + ' disconnected');
    handleDisconnect(socket.id);
  });

  socket.on('host game', gameId => hostGame(socket, gameId));
  socket.on('remove host', () => removeHost(socket.id));
  socket.on('join game', gameId => joinGame(socket, gameId));
  socket.on('searching', () => search(socket.id));
  socket.on('remove search', () => removeSearch(socket.id));
  socket.on('update', data => io.to(data.opp_id).emit('update', data.board));
  socket.on('checkmate', opp_id => io.to(opp_id).emit('checkmate'));

});

const port = 9876;
io.listen(port);
console.log('listening on port ', port);
