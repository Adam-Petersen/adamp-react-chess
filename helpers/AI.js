import rules from './rules';

var AI = (function() {
  var maxDepth = 3;
  var timesCalled = 0;
  var leaves = 0;
  var nodes = 0;


  var getAIMove = function(board){
    timesCalled = 0;
    board.moves = [];
    let ret = minimax(board, 0, true, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    console.log("times called: " + timesCalled);
    console.log(ret);
    return ret.move;
  }

  function minimax(board, depth, isMaximizer, alpha, beta) {
    timesCalled++;
    let moves = rules.getMoves(board, isMaximizer ? 'black' : 'white');
    if (moves.length == 0) {
      let val = isMaximizer ? -10000 : 10000;
      return {move: null, val: 10000};
    } else if (depth == maxDepth) {
      leaves++;
      return { move: null, val: value(board) };
    }


    nodes++;

    if (isMaximizer) {
      let bestMove = {
        move: null,
        val: Number.NEGATIVE_INFINITY
      };

      for(let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let newBoard = copyBoard(board);
        newBoard[move.startTile.row][move.startTile.col] = {...move.startTile, piece: null};
        newBoard[move.targetTile.row][move.targetTile.col] = {...move.targetTile, piece: move.startTile.piece};
        newBoard.moves.push(move);

        let newMove = minimax(newBoard, depth+1, !isMaximizer, alpha, beta);

        if (newMove.val > bestMove.val || (newMove.val === bestMove.val && Math.random() < 0.5)) {
          bestMove = {
            move: move,
            val: newMove.val,
          }
        }

        alpha = Math.max(alpha, bestMove.val);
        if (beta <= alpha) {
          //console.log('breaking');
          break;
        }
      }

      return bestMove;

    } else {
      let bestMove = {
        move: null,
        val: Number.POSITIVE_INFINITY
      };

      for(let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let newBoard = copyBoard(board);
        newBoard[move.startTile.row][move.startTile.col] = {...move.startTile, piece: null};
        newBoard[move.targetTile.row][move.targetTile.col] = {...move.targetTile, piece: move.startTile.piece};
        newBoard.moves.push(move);

        let newMove = minimax(newBoard, depth+1, !isMaximizer, alpha, beta);
        if (newMove.val < bestMove.val || (newMove.val === bestMove.val && Math.random() < 0.5)) {
          //console.log("setting best move in minimizer");
          bestMove = {
            move: move,
            val: newMove.val,
          }
        }
        beta = Math.min(beta, bestMove.val);

        if (beta <= alpha) {
          //console.log('breaking');
          //break;
        }
      }
      return bestMove;
    }
  }

  function value(board) {
    var val = 0;
    board.forEach(function(row) {
      row.forEach(function(tile) {
        if (tile.piece) {
          let name = tile.piece.name;
          let pieceVal;

          if (name == 'pawn') {
            pieceVal = 1;
          } else if (name == 'knight') {
            pieceVal = 3;
          } else if (name == 'bishop') {
            pieceVal = 3;
          } else if (name == 'rook') {
            pieceVal = 5;
          } else if (name == 'queen') {
            pieceVal = 9;
          } else if (name == 'king') {
            pieceVal = 100;
          } else {
            console.log('error in value function');
          }

          if (tile.piece.color == 'white') {
            val -= pieceVal;
          } else {
            val += pieceVal;
          }
        }
      });
    });

    return val;
  }

  function copyBoard(oldBoard) {
    var newBoard = [];

    for(let i = 0; i < 8; i++) {
      newBoard.push(new Array(8));
    };

    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 8; j++) {
        newBoard[i][j] = {...oldBoard[i][j]};
        if (oldBoard[i][j].piece) {
          newBoard[i][j].piece = {...oldBoard[i][j].piece};
        }
      }
    }

    newBoard.moves = [];
    for(let i = 0; i < oldBoard.moves.length; i++) {
      newBoard.moves.push(oldBoard.moves[i])
    }

    return newBoard;
  }


  return {
    getAIMove: getAIMove,
  };
})();

export default AI;
