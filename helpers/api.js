import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:9876');
var opp_id;

var api = function() {

  function init(onFoundPlayerCallback, onUpdateCallback, onCheckMateCallback) {
    // Set up callbacks before starting search
    socket.on('found player', data => {
      opp_id = data.opp_id;
      onFoundPlayerCallback(data.color);
    });
    socket.on('update', board => onUpdateCallback(board));
    socket.on('checkmate', () => onCheckMateCallback());

    // start search
    socket.emit('searching');
  }

  function update(board) {
    socket.emit('update', { opp_id, board });
  }

  function checkmate() {
    socket.emit('checkmate', opp_id);
  }

  return {
    search: search,
    update: update,
    checkmate: checkmate,
  }
}();

export { subscribeToTimer };
