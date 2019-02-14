var Rules = (function(){
  var board, currentValidMoves, turn, isFutureMove, check, checkMate;

  var setNewBoard = function (newBoard) {
    turn = turn === 'white' ? 'black' : 'white';
    board = newBoard;
    currentValidMoves = generateValidMoves();
    setCheckMate();
    return currentValidMoves;
  }

  var isValidMove = function (startTile, targetTile) {
    var valid = false;

    currentValidMoves.forEach(move => {
      if (startTile.id === move.startTile.id && targetTile.id === move.targetTile.id) {
        valid = true;
        setCheck(move);
      }
    });

    return valid;
  };

  var isCheck = function () {
    return check;
  }

  function setCheck(move) {
    check = false;
    var futureMoves = generateFutureMoves(move.startTile, move.targetTile);

    futureMoves.forEach(futureMove => {
      if (futureMove.targetTile.piece &&
        futureMove.targetTile.piece.name === 'king'&&
        futureMove.targetTile.piece.color !== turn) {
          check = true;
    }
    });

  }

  var isCheckMate = function (board, validMoves) {
    return checkMate;
  };

  function setCheckMate() {
    checkMate = currentValidMoves.length === 0;
  }

  function generateValidMoves() {
    var moves = generateValidBishopMoves().concat(
           generateValidKingMoves()).concat(
           generateValidKnightMoves()).concat(
           generateValidPawnMoves()).concat(
           generateValidQueenMoves()).concat(
           generateValidRookMoves());

    if (!isFutureMove) {
      moves = moves.filter(move => !playerPutsSelfInCheck(move));
    }
    return moves;
  }

  function generateFutureMoves(startTile, targetTile) {
    //Set varaibles to generate future moves
    board[startTile.row][startTile.col] = {...startTile, piece: null};
    board[targetTile.row][targetTile.col] = {...targetTile, piece: startTile.piece};
    isFutureMove = true;
    var futureMoves = generateValidMoves();

    //Reset variables to what they were
    board[startTile.row][startTile.col] = startTile;
    board[targetTile.row][targetTile.col] = targetTile;
    isFutureMove = false;

    return futureMoves;
  }

  function playerPutsSelfInCheck(move) {
    var futureMoves = generateFutureMoves(move.startTile, move.targetTile);
    var putsSelfInCheck = false;

    futureMoves.forEach(futureMove => {
      if (futureMove.targetTile.piece &&
          futureMove.targetTile.piece.name === 'king'&&
          futureMove.targetTile.piece.color === turn) {
            putsSelfInCheck = true;
      }
    });

    return putsSelfInCheck;
  }

  // PIECE RULES

  function isValidTile(row, col) {
    return row >= 0 && row <= 7 && col >= 0 && col <= 7;
  }

  function traversePath(startTile, incRow, incCol) {
    var moves = [];
    var tile = startTile;

    while (isValidTile(incRow(tile.row), incCol(tile.col))) {
      tile = board[incRow(tile.row)][incCol(tile.col)];
      if (tile.piece) {
        if (tile.piece.color !== startTile.piece.color) {
          moves.push({
            startTile: startTile,
            targetTile: tile
          });
        }
        return moves;
      } else {
        moves.push({
          startTile: startTile,
          targetTile: tile,
        });
      }
    }

    return moves;
  }

  function getLivingPieces(pieceType) {
    var livingPieces = [];

    board.forEach(function(row){
      row.forEach(function(tile){
        if (tile.piece && tile.piece.name === pieceType && (isFutureMove || tile.piece.color === turn)) {
          livingPieces.push(tile);
        }
      });
    });

    return livingPieces
  }

  function generateValidBishopMoves() {
    var livingBishops = getLivingPieces('bishop');
    var moves = [];

    livingBishops.forEach(function(bishopTile){
      let downRight = traversePath(bishopTile, (row) => row + 1, (col) => col + 1);
      let downLeft = traversePath(bishopTile, (row) => row + 1, (col) => col - 1);
      let upRight = traversePath(bishopTile, (row) => row - 1, (col) => col + 1);
      let upLeft = traversePath(bishopTile, (row) => row - 1, (col) => col - 1);

      moves = moves.concat(downRight, downLeft, upRight, upLeft);
    });

    return moves;
  }

  function generateValidKingMoves() {
    var kings = getLivingPieces('king');
    var moves = [];

    kings.forEach(function(kingTile){
      [-1,0,1].forEach(function(rowInc){
        [-1,0,1].forEach(function(colInc){
          if((rowInc !== 0 || colInc !== 0) && isValidTile(kingTile.row + rowInc, kingTile.col + colInc)) {
            let tile = board[kingTile.row + rowInc][kingTile.col + colInc];

            if(!tile.piece || tile.piece.color !== kingTile.piece.color) {
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

    livingKnights.forEach(function(knight){
      [-2,-1,1,2].forEach(function(rowInc){
        [-2,-1,1,2].forEach(function(colInc){
          if (Math.abs(rowInc) + Math.abs(colInc) === 3 && isValidTile(knight.row + rowInc, knight.col + colInc)) {
            let tile = board[knight.row + rowInc][knight.col + colInc];
            if (!tile.piece ||  tile.piece.color !== knight.piece.color) {
              moves.push({
                startTile: knight,
                targetTile: tile
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

  return {
    setNewBoard: setNewBoard,
    isValidMove: isValidMove,
    isCheck: isCheck,
    isCheckMate: isCheckMate,
  };
})();

export default Rules;
