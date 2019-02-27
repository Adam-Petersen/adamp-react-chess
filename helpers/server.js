const io = require('socket.io')();

// io.on('connection', (client) => {
//   client.on('subscribeToTimer', (interval) => {
//     console.log('client is subscribing to timer with interval ', interval);
//     setInterval(() => {
//       client.emit('timer', new Date());
//     }, interval);
//   });
// });

var queue = [];

setInterval(() => {
  while(queue.length >= 2) {
    var first = queue.shift();
    var second = queue.shift();
    io.to(first).emit('found player', {opp_id: second, color: 'white'});
    io.to(second).emit('found player', {opp_id: first, color: 'black'});
  }
}, 2000);

io.on('connection', socket => {
  socket.on('searching', () => {
    queue.push(socket.id);
  });

  socket.on('update', data => {
    io.to(data.opp_id).emit('update', data.board);
  });

  socket.on('checkmate', opp_id => {
    io.to(opp_id).emit('checkmate');
  }
});

const port = 9876;
io.listen(port);
console.log('listening on port ', port);
