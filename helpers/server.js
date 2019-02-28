const io = require('socket.io')();


var games = [];
var queue = [];

function handleDisconnect(id) {

  // Remove frome queue if they haven't found game
  for(let i = 0; i < queue.length; i++) {
    if (queue[i] === id) {
      queue.splice(i,1);
      console.log('Removing frome queue. New queue length: ' + queue.length);
    }
  }

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

setInterval(() => {
  while(queue.length >= 2) {
    var white = queue.shift();
    var black = queue.shift();
    console.log('found game: ' + white + ' vs ' + black);
    games.push([white, black]);

    io.to(white).emit('found player', {opp_id: black, color: 'white'});
    io.to(black).emit('found player', {opp_id: white, color: 'black'});
  }
}, 2000);

io.on('connection', socket => {
  console.log(socket.id + ' connected');

  socket.on('disconnect', function(data) {
    console.log(socket.id + ' disconnected');
    handleDisconnect(socket.id);
  });

  socket.on('searching', () => {
    queue.push(socket.id);
  });

  socket.on('update', data => {
    io.to(data.opp_id).emit('update', data.board);
  });

  socket.on('checkmate', opp_id => {
    io.to(opp_id).emit('checkmate');
  });
});

const port = 9876;
io.listen(port);
console.log('listening on port ', port);
