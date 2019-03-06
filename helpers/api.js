import openSocket from 'socket.io-client';

var oppId;
var socket;

const api = (() => {
  function init(onUpdateCallback, onCheckMateCallback, onOpponentDisconnectCallback) {
    socket = openSocket('http://adam-petersen.com:9876/');

    // Set up callbacks before starting search
    socket.on('update', board => onUpdateCallback(board));
    socket.on('checkmate', () => onCheckMateCallback());
    socket.on('opponent disconnected', () => onOpponentDisconnectCallback());

    // ready to search
  }

  function hostGame(gameID, matchFoundCallback, hostExistsCallback) {
    socket.on('bad host', () => hostExistsCallback());

    socket.on('found player', (data) => {
      ({ oppId } = data);
      matchFoundCallback(data);
    });

    socket.emit('host game', gameID);
  }

  function removeHost() {
    socket.emit('remove host');
  }

  function joinGame(gameID, matchFoundCallback, gameNotFoundCallback) {
    socket.on('game not found', () => gameNotFoundCallback());

    socket.on('found player', (data) => {
      ({ oppId } = data);
      matchFoundCallback(data);
    });

    socket.emit('join game', gameID);
  }

  function search(onFoundPlayerCallback) {
    socket.on('found player', (data) => {
      ({ oppId } = data);
      onFoundPlayerCallback(data);
    });
    socket.emit('searching');
  }

  function removeSearch() {
    socket.emit('remove search');
  }

  function update(board) {
    socket.emit('update', { oppId, board });
  }

  function checkmate() {
    socket.emit('checkmate', oppId);
  }

  return {
    init,
    hostGame,
    removeHost,
    joinGame,
    search,
    removeSearch,
    update,
    checkmate,
  };
})();

export default api;
