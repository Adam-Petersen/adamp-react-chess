import rules from './rules';
import helper from './boardHelper';

const AI = (() => {
  var maxDepth = 3;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function value(board) {
    var val = 0;
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.piece) {
          let { name } = tile.piece;
          let pieceVal;

          if (name === 'pawn') {
            pieceVal = 1;
          } else if (name === 'knight') {
            pieceVal = 3;
          } else if (name === 'bishop') {
            pieceVal = 3;
          } else if (name === 'rook') {
            pieceVal = 5;
          } else if (name === 'queen') {
            pieceVal = 9;
          } else if (name === 'king') {
            pieceVal = 100;
          } else {
            throw new Error('error in value function');
          }

          if (tile.piece.color === 'white') {
            val -= pieceVal;
          } else {
            val += pieceVal;
          }
        }
      });
    });

    return val;
  }

  function minimax(board, depth, isMaximizer, a, b) {
    let alpha = a;
    let beta = b;
    let moves = rules.getMoves(board, isMaximizer ? 'black' : 'white');
    moves = shuffle(moves.filter(move => move.targetTile.piece));
    moves = moves.concat(shuffle(moves.filter(move => !move.targetTile.piece)));

    if (moves.length === 0) {
      let val = isMaximizer ? -10000 : 10000;
      return { move: null, val };
    }
    if (depth === maxDepth) {
      return { move: null, val: value(board) };
    }

    let bestMove;

    if (isMaximizer) {
      bestMove = {
        move: null,
        val: Number.NEGATIVE_INFINITY,
      };

      for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let newBoard = helper.copyBoard(board);
        newBoard[move.startTile.row][move.startTile.col] = { ...move.startTile, piece: null };
        newBoard[move.targetTile.row][move.targetTile.col] = {
          ...move.targetTile,
          piece: move.startTile.piece,
        };

        let newMove = minimax(newBoard, depth + 1, !isMaximizer, alpha, beta);

        if (newMove.val > bestMove.val || (newMove.val === bestMove.val && Math.random() > 0.5)) {
          bestMove = {
            move,
            val: newMove.val,
          };
        }

        alpha = Math.max(alpha, bestMove.val);
        if (beta <= alpha) {
          break;
        }
      }
    } else {
      bestMove = {
        move: null,
        val: Number.POSITIVE_INFINITY,
      };

      for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let newBoard = helper.copyBoard(board);
        newBoard[move.startTile.row][move.startTile.col] = { ...move.startTile, piece: null };
        newBoard[move.targetTile.row][move.targetTile.col] = {
          ...move.targetTile,
          piece: move.startTile.piece,
        };

        let newMove = minimax(newBoard, depth + 1, !isMaximizer, alpha, beta);
        if (newMove.val < bestMove.val || (newMove.val === bestMove.val && Math.random() > 0.5)) {
          bestMove = {
            move,
            val: newMove.val,
          };
        }
        beta = Math.min(beta, bestMove.val);

        if (beta <= alpha) {
          break;
        }
      }
    }

    return bestMove;
  }

  const getAIMove = board => minimax(board, 0, true, Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY).move;

  return {
    getAIMove,
  };
})();

export default AI;
