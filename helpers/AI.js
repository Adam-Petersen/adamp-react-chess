import rules from './rules';

var AI = (function() {

  var getMove = function(board) {
    var moves = rules.getMoves(board, 'black');

    if (moves.length === 0) {
      return null;
    }

    var max = moves.length - 1;
    var min = 0;

    return moves[Math.floor(Math.random() * (max - min) + min)];
  }

  return {
    getMove: getMove,
  };
})();

export default AI;
