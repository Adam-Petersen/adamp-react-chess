import rules from './rules';
import pieces from './pieces';


var helper = (function() {

  function movePiece(board, moves, highlightedTile, clickedTile, newState) {
    if(rules.findMove(moves, highlightedTile, clickedTile)) {
      newState.board = getNewBoard(board, highlightedTile, clickedTile);
      newState.highlightedTile = null;
      return true;
    } else {
      newState.highlightedTile = null;
      return false;
    }
  };

  function getNewBoard(oldBoard, startTile, targetTile) {
    var newBoard = copyBoard(oldBoard);
    newBoard[startTile.row][startTile.col] = {...startTile, piece: null};
    newBoard[targetTile.row][targetTile.col] = {...targetTile, piece: startTile.piece }
    return newBoard;
  };

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

    return newBoard;
  };

  function getInitialPiecesArray() {
    var board = [];

    for(let i = 0; i < 8; i++) {
      board.push(new Array(8));
    };

    board[0][0] = pieces.rook_black;
    board[0][1] = pieces.knight_black;
    board[0][2] = pieces.bishop_black;
    board[0][3] = pieces.queen_black;
    board[0][4] = pieces.king_black;
    board[0][5] = pieces.bishop_black;
    board[0][6] = pieces.knight_black;
    board[0][7] = pieces.rook_black;

    board[7][0] = pieces.rook_white;
    board[7][1] = pieces.knight_white;
    board[7][2] = pieces.bishop_white;
    board[7][3] = pieces.queen_white;
    board[7][4] = pieces.king_white;
    board[7][5] = pieces.bishop_white;
    board[7][6] = pieces.knight_white;
    board[7][7] = pieces.rook_white;

    for(let i = 0; i < 8; i++) {
      board[1][i] = pieces.pawn_black;
      board[6][i] = pieces.pawn_white;
    }

    return board;
  }

  function initializeBoard() {
    var board = [];
    var pieceLocations = getInitialPiecesArray();

    for(let i = 0; i < 8; i++) {
      let column = [];

      for(let j = 0; j < 8; j++) {
        column.push({
          id: `${i}${j}`,
          tileColor: (i + j) % 2 !== 0 ? 'dark' : 'light',
          row: i,
          col: j,
          piece: pieceLocations[i][j],
          possibleTarget: false,
        });
      }

      board.push(column);
    }

    return board;
  }

  function setTargetHighlights(board, moves, highlightedTile) {
    board.forEach((row, i) => row.forEach((col, j) => board[i][j].possibleTarget = false));

    moves.forEach(move => {
      if (highlightedTile && move.startTile.id === highlightedTile.id) {
        board[move.targetTile.row][move.targetTile.col].possibleTarget = true;
      }
    });
  }

  function nextTurn(turn) {
    return turn === 'white' ? 'black' : 'white';
  }

  return {
    movePiece: movePiece,
    getNewBoard: getNewBoard,
    copyBoard: copyBoard,
    initializeBoard: initializeBoard,
    setTargetHighlights: setTargetHighlights,
    nextTurn: nextTurn,
  }
})();

export default helper;
