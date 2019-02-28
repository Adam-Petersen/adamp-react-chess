import openSocket from 'socket.io-client';

var opp_id, socket;

var api = function() {

  function init(onFoundPlayerCallback, onUpdateCallback, onCheckMateCallback, onOpponentDisconnectCallback) {
    socket = openSocket('http://adam-petersen.com:9876/');

    // Set up callbacks before starting search
    socket.on('found player', data => {
      opp_id = data.opp_id;
      onFoundPlayerCallback(data);
    });
    socket.on('update', board => onUpdateCallback(board));
    socket.on('checkmate', () => onCheckMateCallback());
    socket.on('opponent disconnected', () => onOpponentDisconnectCallback());

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
    init: init,
    update: update,
    checkmate: checkmate,
  }
}();

export default api;
