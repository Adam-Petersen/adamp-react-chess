const Rules = (() => {
  var board;
  var turn;

  function playerPutsSelfInCheck(move) {
    var putsSelfInCheck = false;

    move.futureMoves.forEach((futureMove) => {
      if (futureMove.targetTile.piece
          && futureMove.targetTile.piece.name === 'king'
          && futureMove.targetTile.piece.color === turn) {
        putsSelfInCheck = true;
      }
    });

    return putsSelfInCheck;
  }

  function setsCheck(move) {
    var check = false;

    move.futureMoves.forEach((futureMove) => {
      if (futureMove.targetTile.piece
        && futureMove.targetTile.piece.name === 'king'
        && futureMove.targetTile.piece.color !== turn) {
        check = true;
      }
    });
    return check;
  }

  // PIECE RULES

  function isValidTile(row, col) {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7;
  }

  function traversePath(startTile, incRow, incCol) {
    let moves = [];
    let tile = startTile;

    while (isValidTile(incRow(tile.row), incCol(tile.col))) {
      tile = board[incRow(tile.row)][incCol(tile.col)];
      if (tile.piece) {
        if (tile.piece.color !== startTile.piece.color) {
          moves.push({
            startTile,
            targetTile: tile,
          });
        }
      } else {
        moves.push({
          startTile,
          targetTile: tile,
        });
      }
    }

    return moves;
  }

  function getLivingPieces(pieceType) {
    var livingPieces = [];

    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.piece && tile.piece.name === pieceType && (tile.piece.color === turn || turn === 'both')) {
          livingPieces.push(tile);
        }
      });
    });

    return livingPieces;
  }

  function generateValidBishopMoves() {
    var livingBishops = getLivingPieces('bishop');
    var moves = [];

    livingBishops.forEach((bishopTile) => {
      let downRight = traversePath(bishopTile, row => row + 1, col => col + 1);
      let downLeft = traversePath(bishopTile, row => row + 1, col => col - 1);
      let upRight = traversePath(bishopTile, row => row - 1, col => col + 1);
      let upLeft = traversePath(bishopTile, row => row - 1, col => col - 1);

      moves = moves.concat(downRight, downLeft, upRight, upLeft);
    });

    return moves;
  }

  function generateValidKingMoves() {
    var kings = getLivingPieces('king');
    var moves = [];

    kings.forEach((kingTile) => {
      [-1, 0, 1].forEach((rowInc) => {
        [-1, 0, 1].forEach((colInc) => {
          if ((rowInc !== 0 || colInc !== 0)
              && isValidTile(kingTile.row + rowInc, kingTile.col + colInc)) {
            let tile = board[kingTile.row + rowInc][kingTile.col + colInc];

            if (!tile.piece || tile.piece.color !== kingTile.piece.color) {
              moves.push({
                startTile: kingTile,
                targetTile: tile,
              });
            }
          }
        });
      });
    });

    return moves;
  }

  function generateValidKnightMoves() {
    var livingKnights = getLivingPieces('knight');
    var moves = [];

    livingKnights.forEach((knight) => {
      [-2, -1, 1, 2].forEach((rowInc) => {
        [-2, -1, 1, 2].forEach((colInc) => {
          if (Math.abs(rowInc) + Math.abs(colInc) === 3
              && isValidTile(knight.row + rowInc, knight.col + colInc)) {
            let tile = board[knight.row + rowInc][knight.col + colInc];
            if (!tile.piece || tile.piece.color !== knight.piece.color) {
              moves.push({
                startTile: knight,
                targetTile: tile,
              });
            }
          }
        });
      });
    });

    return moves;
  }

  function generateValidPawnMoves() {
    var livingPawns = getLivingPieces('pawn');
    var moves = [];

    livingPawns.forEach(function(pawnTile){
      let rowInc = pawnTile.piece.color === 'white' ? -1 : 1;
      let startRow = pawnTile.piece.color === 'white' ? 6 : 1;
      let nextTile = isValidTile(pawnTile.row + rowInc, pawnTile.col) ? board[pawnTile.row + rowInc][pawnTile.col] : null;
      let diagLeftTile = isValidTile(pawnTile.row + rowInc, pawnTile.col - 1) ? board[pawnTile.row + rowInc][pawnTile.col - 1] : null;
      let diagRightTile = isValidTile(pawnTile.row + rowInc, pawnTile.col + 1) ? board[pawnTile.row + rowInc][pawnTile.col + 1] : null;

      if (nextTile && !nextTile.piece) {
        moves.push({
          startTile: pawnTile,
          targetTile: nextTile,
        });

        let pastNextTile = isValidTile(nextTile.row + rowInc, nextTile.col) ? board[nextTile.row + rowInc][nextTile.col] : null;
        if (pastNextTile && !pastNextTile.piece && pawnTile.row === startRow) {
          moves.push({
            startTile: pawnTile,
            targetTile: pastNextTile,
          });
        }
      }
      if (diagLeftTile && diagLeftTile.piece && diagLeftTile.piece.color !== pawnTile.piece.color) {
        moves.push({
          startTile: pawnTile,
          targetTile: diagLeftTile,
        });
      }
      if (diagRightTile && diagRightTile.piece && diagRightTile.piece.color !== pawnTile.piece.color) {
        moves.push({
          startTile: pawnTile,
          targetTile: diagRightTile,
        });
      }
    });

    return moves;
  }

  function generateValidQueenMoves() {
    var livingQueens = getLivingPieces('queen');
    var moves = [];

    livingQueens.forEach(function(queenTile){
      let up = traversePath(queenTile, (row) => row - 1, (col) => col);
      let down = traversePath(queenTile, (row) => row + 1, (col) => col);
      let left = traversePath(queenTile, (row) => row, (col) => col - 1);
      let right = traversePath(queenTile, (row) => row, (col) => col + 1);
      let downRight = traversePath(queenTile, (row) => row + 1, (col) => col + 1);
      let downLeft = traversePath(queenTile, (row) => row + 1, (col) => col - 1);
      let upRight = traversePath(queenTile, (row) => row - 1, (col) => col + 1);
      let upLeft = traversePath(queenTile, (row) => row - 1, (col) => col - 1);

      moves = moves.concat(up, down, left, right, downRight, downLeft, upRight, upLeft);
    });

    return moves;
  }

  function generateValidRookMoves() {
    var livingRooks = getLivingPieces('rook');
    var moves = [];

    livingRooks.forEach(function(rookTile){
      let up = traversePath(rookTile, (row) => row - 1, (col) => col);
      let down = traversePath(rookTile, (row) => row + 1, (col) => col);
      let left = traversePath(rookTile, (row) => row, (col) => col - 1);
      let right = traversePath(rookTile, (row) => row, (col) => col + 1);

      moves = moves.concat(up, down, left, right);
    });

    return moves;
  }

  function generateValidMoves(isFutureMove) {
    var moves = generateValidBishopMoves().concat(
           generateValidKingMoves()).concat(
           generateValidKnightMoves()).concat(
           generateValidPawnMoves()).concat(
           generateValidQueenMoves()).concat(
           generateValidRookMoves());

    if (!isFutureMove) {
      moves.forEach(move => move.futureMoves = generateFutureMoves(move));
      moves = moves.filter(move => !playerPutsSelfInCheck(move));
      moves.forEach(move => move.setsCheck = setsCheck(move));
      moves = moves.map(move => ({...move, futureMoves: null}))
    }
    return moves;
  }

  function generateFutureMoves(move) {
    // Set varaibles to generate future moves
    board[move.startTile.row][move.startTile.col] = { ...move.startTile, piece: null };
    board[move.targetTile.row][move.targetTile.col] = {
      ...move.targetTile,
      piece: move.startTile.piece,
    };
    let oldTurn = turn;
    turn = 'both';

    let futureMoves = generateValidMoves(true);

    // Reset variables to what they were
    board[move.startTile.row][move.startTile.col] = move.startTile;
    board[move.targetTile.row][move.targetTile.col] = move.targetTile;
    turn = oldTurn;

    return futureMoves;
  }

  function getMoves(newBoard, newTurn) {
    board = newBoard;
    turn = newTurn;

    return generateValidMoves();
  }

  function findMove(moves, startTile, targetTile) {
    var foundMove = null;
    moves.forEach((move) => {
      if (move.startTile.id === startTile.id && move.targetTile.id === targetTile.id) {
        foundMove = move;
      }
    });
    return foundMove;
  }

  return {
    getMoves,
    findMove,
  };
})();

export default Rules;
