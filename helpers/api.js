import openSocket from 'socket.io-client';

var opp_id, socket;

var api = function() {

  function init(onUpdateCallback, onCheckMateCallback, onOpponentDisconnectCallback) {
    socket = openSocket('http://adam-petersen.com:9876/');

    // Set up callbacks before starting search
    socket.on('update', board => onUpdateCallback(board));
    socket.on('checkmate', () => onCheckMateCallback());
    socket.on('opponent disconnected', () => onOpponentDisconnectCallback());
    //socket.on('bad host', () => onHostExistsCallback());
    //socket.on('not hosted', () => onNotHostedCallback());

    // start search
  }

  function hostGame(gameID, matchFoundCallback, hostExistsCallback) {
    socket.on('bad host', () => hostExistsCallback());

    socket.on('found player', data => {
      opp_id = data.opp_id;
      matchFoundCallback(data);
    });

    socket.emit('host game', gameID);
  }

  function removeHost(gameID) {
    socket.emit('remove host');
  }

  function joinGame(gameID, matchFoundCallback, gameNotFoundCallback) {
    socket.on('game not found', () => gameNotFoundCallback());

    socket.on('found player', data => {
      opp_id = data.opp_id;
      matchFoundCallback(data);
    });

    socket.emit('join game', gameID);
  }

  function search(onFoundPlayerCallback) {
    socket.on('found player', data => {
      opp_id = data.opp_id;
      onFoundPlayerCallback(data);
    });
    socket.emit('searching');
  }

  function removeSearch() {
    socket.emit('remove search');
  }

  function update(board) {
    socket.emit('update', { opp_id, board });
  }

  function checkmate() {
    socket.emit('checkmate', opp_id);
  }

  return {
    init: init,
    hostGame: hostGame,
    removeHost: removeHost,
    joinGame: joinGame,
    search: search,
    removeSearch: removeSearch,
    update: update,
    checkmate: checkmate,
  }
}();

export default api;
