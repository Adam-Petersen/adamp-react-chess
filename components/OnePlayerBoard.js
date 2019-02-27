import React from 'react';
import Board from './Board';
import Timer from './Timer';
import rules from '../helpers/rules';
import AI from '../helpers/AI';
import helper from '../helpers/boardHelper';

class OnePlayerBoard extends React.Component {
  constructor(props) {
    super(props);

    var startBoard = helper.initializeBoard();
    this.moves = rules.getMoves(startBoard, 'white');

    var startTime = (new Date).getTime();

    this.state = {
      board: startBoard,
      highlightedTile: null,
      reset: null,
      checkMate: false,
      winner: null,
      moveAI: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.highlightTargets = this.highlightTargets.bind(this);
  }

  componentDidUpdate() {
    if (this.state.moveAI) {
      setTimeout(() => this.moveAI(this.state.aiMove));
    }
  }

  handleDrag(startRow, startCol, finRow, finCol) {
    if (this.state.checkMate) {
      return;
    }

    var newState = {board: this.state.board};
    var startTile = this.state.board[startRow][startCol];
    var targetTile = this.state.board[finRow][finCol];

    if (helper.movePiece(this.state.board, this.moves, startTile, targetTile, newState)) {
      newState.moveAI = true;
    } else {
      newState.reset = startTile;
      newState.highlightedTile = startTile;
    }

    helper.setTargetHighlights(newState.board, this.moves, newState.highlightedTile);

    this.setState({
      ...this.state,
      ...newState,
    });
  }

  handleClick(row, col) {
    if (this.state.checkMate) {
      return;
    }

    var newState = { board: this.state.board };
    var highlightedTile = this.state.highlightedTile;
    let clickedTile = this.state.board[row][col];


    if (highlightedTile) {
      if(highlightedTile.id === clickedTile.id) {
        newState.highlightedTile = null;
      }
      else if(clickedTile.piece && clickedTile.piece.color === 'white') {
        newState.highlightedTile = clickedTile;
      } else if (helper.movePiece(this.state.board, this.moves, highlightedTile, clickedTile, newState)) {
        newState.moveAI = true;
      }
    }
    else if (clickedTile.piece && clickedTile.piece.color === 'white') {
      newState.highlightedTile = clickedTile;
    }

    helper.setTargetHighlights(newState.board, this.moves, newState.highlightedTile);

    this.setState({
      ...this.state,
      ...newState,
    });
  }

  moveAI() {
    var aiMove = AI.getAIMove(this.state.board);

    if (!aiMove) {
      this.setState({
        ...this.state,
        checkMate: true,
        winner: 'white',
        moveAI: false,
      });
    } else {
      var newBoard = helper.getNewBoard(this.state.board, aiMove.startTile, aiMove.targetTile);
      this.moves = rules.getMoves(newBoard, 'white');

      this.setState({
        ...this.state,
        board: newBoard,
        moveAI: false,
        checkMate: this.moves.length === 0,
        winner: this.moves.length === 0 ? 'black' : null,
      });
    }
  }

  highlightTargets(row, col) {
    var newBoard = helper.copyBoard(this.state.board);
    helper.setTargetHighlights(newBoard, this.moves, newBoard[row][col]);
    this.setState({
      ...this.state,
      board: newBoard,
      highlightedTile: newBoard[row][col],
    });
  }

  render() {
    return (
      <div className="one-board">
        {this.state.checkMate &&
          <p className="checkmate-text">
            Checkmate, {this.state.winner} wins!
          </p>
        }
        <Board
          checkMate={this.state.checkMate}
          board={this.state.board}
          handleClick={this.handleClick}
          handleDrag={this.handleDrag}
          highlightTargets={this.highlightTargets}
          highlightedTile={this.state.highlightedTile}
          reset={this.state.reset}
          tileSize={this.props.tileSize}
          turn={'white'}
        />
        <div className="bottom-text">
            <span id="turn-indicator">white's turn</span>
            <Timer id="timer"/>
        </div>
      </div>
    );
  }
}

export default OnePlayerBoard;
