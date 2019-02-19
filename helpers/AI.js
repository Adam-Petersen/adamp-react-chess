import rules from './rules';

var AI = (function() {
  var maxDepth = 3;

  var curState = {
    move: null,
    board: null,
    subStates: [],
    turn: 'white',
    optimalSubState: null,
    depth: 0,
    value: null,
  }

  var init = function(board, moves) {
    curState.board = copyBoard(board)
    moves.forEach(move => curState.subStates.push(initializeSubStates(1, move, board, 'white')));
    //console.log("substates set");
    setOptimalSubStates(curState);
    //console.log("initialized state: ");
    //console.log(curState);
  };

  var getAIMove = function(){
    var bestMove = curState.optimalSubState.move;

    curState = getNewState(curState, bestMove);
    updateSubStates(curState);
    setOptimalSubStates(curState);

    return bestMove;
  }

  var setPlayerMove = function(move){
    curState = getNewState(curState, move);

    updateSubStates(curState);
    setOptimalSubStates(curState);
    //console.log("done moving player");
    //console.log(curState);
  }

  function initializeSubStates(depth, move, board, turn) {
    if (depth > maxDepth) {
      return;
    }

    var newBoard = copyBoard(board);
    newBoard[move.startTile.row][move.startTile.col] = {...move.startTile, piece: null};
    newBoard[move.targetTile.row][move.targetTile.col] = {...move.targetTile, piece: move.startTile.piece}
    var newTurn = oppositeTurn(turn);
    var newState = {
      move: move,
      board: newBoard,
      turn: newTurn,
      subStates: [],
      depth: depth,
      value: value(newBoard),
      optimalSubState: null,
    }

    if (depth == maxDepth) {
      return newState;
    } else {
      var newMoves = rules.getMoves(newBoard, newTurn);
      newMoves.forEach(newMove => newState.subStates.push(initializeSubStates(depth+1, newMove, newBoard, newTurn)));
      return newState;
    }
  }

  function updateSubStates(state) {
    state.depth--;
    if (state.subStates.length == 0) {
      let moves = rules.getMoves(state.board, state.turn);
      moves.forEach(move => state.subStates.push(initializeSubStates(state.depth + 1, move, state.board, state.turn)));
    } else {
      state.subStates.forEach(subState => updateSubStates(subState));
    }
  }

  function setOptimalSubStates(state) {
    if(state.subStates.length == 0) {
      return;
    }

    state.subStates.forEach(subState => setOptimalSubStates(subState));

    var findMax = state.turn == 'black';
    var bestState = state.subStates[0];
    for(let i = 1; i < state.subStates.length; i++) {
      if ((findMax && state.subStates[i].value > bestState.value) ||
          (!findMax && state.subStates[i].value < bestState.value)) {
        bestState = state.subStates[i];
      } else if ((findMax && state.subStates[i].value == bestState.value) ||
          (!findMax && state.subStates[i].value == bestState.value)) {
        bestState = Math.random() < 0.5 ? bestState : state.subStates[i];
      }
    }

    state.optimalSubState = bestState;
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
            pieceVal = 5;
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

    return newBoard;
  }

  function getNewState(state, move) {
    //console.log("getNewState")
    var newState;
    for(let i = 0; i < state.subStates.length; i++) {
      let subState = state.subStates[i];
      if (move.startTile.id == subState.move.startTile.id && move.targetTile.id == subState.move.targetTile.id) {
        newState = subState;
        break;
      }
    }

    if (!newState) {
      console.log("error in movePlayer");
      return null;
    } else {
      return newState;
    }
  }

  function oppositeTurn(turn) {
    return turn === 'white' ? 'black' : 'white';
  }

  return {
    init: init,
    getAIMove: getAIMove,
    setPlayerMove: setPlayerMove,
  };
})();

export default AI;
