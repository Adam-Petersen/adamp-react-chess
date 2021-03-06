import React from 'react';
import Board from './Board';
import Timer from './Timer';
import helper from '../helpers/boardHelper';
import rules from '../helpers/rules';

class TwoPlayerBoard extends React.Component {
  constructor(props) {
    super(props);

    var startBoard = helper.initializeBoard();
    this.moves = rules.getMoves(startBoard, 'white');

    this.state = {
      board: startBoard,
      turn: 'white',
      highlightedTile: null,
      reset: null,
      checkMate: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.highlightTargets = this.highlightTargets.bind(this);
  }

  handleDrag(startRow, startCol, finRow, finCol) {
    if (this.state.checkMate) {
      return;
    }

    var startTile = this.state.board[startRow][startCol];
    var targetTile = this.state.board[finRow][finCol];
    var newState = {board: this.state.board};

    if (helper.movePiece(this.state.board, this.moves, startTile, targetTile, newState)) {
      this.moves = rules.getMoves(newState.board, helper.nextTurn(this.state.turn));
      if (this.moves.length == 0) {
        newState.checkMate = true;
      } else {
        newState.turn = helper.nextTurn(this.state.turn);
      }
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
      else if(clickedTile.piece && clickedTile.piece.color === highlightedTile.piece.color) {
        newState.highlightedTile = clickedTile;
      } else if (helper.movePiece(this.state.board, this.moves, highlightedTile, clickedTile, newState)) {
        this.moves = rules.getMoves(newState.board, helper.nextTurn(this.state.turn));
        if (this.moves.length === 0) {
          newState.checkMate = true;
        } else {
          newState.turn = helper.nextTurn(this.state.turn);
        }
      }
    }
    else if (clickedTile.piece && clickedTile.piece.color === this.state.turn) {
      newState.highlightedTile = clickedTile;
    }

    helper.setTargetHighlights(newState.board, this.moves, newState.highlightedTile);

    this.setState({
      ...this.state,
      ...newState,
    });
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

  setCheckMate() {

  }

  changeTurn() {

  }

  render() {
    return (
      <div className="two-board">
        {this.state.checkMate &&
          <div id="overlay-wrapper">
            <div id="overlay"></div>
            <p className="overlay-text">
              Checkmate, {this.state.turn} wins!
            </p>
          </div>
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
          turn={this.state.turn}
        />
        <div className="bottom-text">
            <span id="turn-indicator">{this.state.turn}'s turn</span>
            <Timer id="timer"/>
        </div>
      </div>
    );
  }

}

export default TwoPlayerBoard;
