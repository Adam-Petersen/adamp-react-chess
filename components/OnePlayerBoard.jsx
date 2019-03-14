import React from 'react';
import Board from './Board';
import Timer from './Timer';
import rules from '../helpers/rules';
import AI from '../helpers/AI';
import helper from '../helpers/boardHelper';

class OnePlayerBoard extends React.Component {
  static lastMove(move) {
    return `${8 - move.startTile.row}${String.fromCharCode(97 + move.startTile.col)} -> ${8 - move.targetTile.row}${String.fromCharCode(97 + move.targetTile.col)}`;
  }

  constructor(props) {
    super(props);

    let startBoard = helper.initializeBoard();
    this.moves = rules.getMoves(startBoard, 'white');

    this.state = {
      board: startBoard,
      highlightedTile: null,
      reset: null,
      checkMate: false,
      winner: null,
      moveAI: false,
      lastMove: '',
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

    let newState = { board: this.state.board };
    let startTile = this.state.board[startRow][startCol];
    let targetTile = this.state.board[finRow][finCol];

    if (helper.movePiece(this.state.board, this.moves, startTile, targetTile, newState)) {
      newState.moveAI = true;
    } else {
      newState.reset = startTile;
      newState.highlightedTile = startTile;
    }

    helper.setTargetHighlights(newState.board, this.moves, newState.highlightedTile);

    let oldState = this.state;
    this.setState({
      ...oldState,
      ...newState,
    });
  }

  handleClick(row, col) {
    if (this.state.checkMate) {
      return;
    }

    let newState = { board: this.state.board };
    let { highlightedTile } = this.state;
    let clickedTile = this.state.board[row][col];


    if (highlightedTile) {
      if (highlightedTile.id === clickedTile.id) {
        newState.highlightedTile = null;
      } else if (clickedTile.piece && clickedTile.piece.color === 'white') {
        newState.highlightedTile = clickedTile;
      } else {
        let movePiece = helper.movePiece(
          this.state.board,
          this.moves,
          highlightedTile,
          clickedTile,
          newState,
        );
        if (movePiece) {
          newState.moveAI = true;
        }
      }
    } else if (clickedTile.piece && clickedTile.piece.color === 'white') {
      newState.highlightedTile = clickedTile;
    }

    helper.setTargetHighlights(newState.board, this.moves, newState.highlightedTile);

    let oldState = this.state;
    this.setState({
      ...oldState,
      ...newState,
    });
  }

  moveAI() {
    let aiMove = AI.getAIMove(this.state.board);
    let oldState = this.state;

    if (!aiMove) {
      this.setState({
        ...oldState,
        checkMate: true,
        winner: 'white',
        moveAI: false,
      });
    } else {
      let newBoard = helper.getNewBoard(oldState.board, aiMove.startTile, aiMove.targetTile);
      this.moves = rules.getMoves(newBoard, 'white');

      this.setState({
        ...oldState,
        board: newBoard,
        moveAI: false,
        lastMove: this.lastMove(aiMove),
        checkMate: this.moves.length === 0,
        winner: this.moves.length === 0 ? 'black' : null,
      });
    }
  }

  highlightTargets(row, col) {
    let oldState = this.state;
    let newBoard = helper.copyBoard(oldState.board);
    helper.setTargetHighlights(newBoard, this.moves, newBoard[row][col]);
    this.setState({
      ...oldState,
      board: newBoard,
      highlightedTile: newBoard[row][col],
    });
  }

  render() {
    return (
      <div className="one-board">
        {this.state.checkMate
          && (
          <div id="overlay-wrapper">
            <div id="overlay" />
            <p className="overlay-text">{`Checkmate, ${this.state.winner} wins!`}</p>
          </div>
          )
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
          turn="white"
        />
        <div className="bottom-text">
          <span id="turn-indicator">Your turn</span>
          <Timer id="timer" />
        </div>
      </div>
    );
  }
}

export default OnePlayerBoard;
