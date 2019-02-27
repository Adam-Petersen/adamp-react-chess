import React from 'react';
import Board from './Board';
import Timer from './Timer';
import helper from '../helpers/boardHelper';
import rules from '../helpers/rules';
import api from '../helpers/api';

class OnlineBoard extends React.Component {
  constructor(props) {
    super(props);

    var startBoard = helper.initializeBoard();
    this.moves = rules.getMoves(startBoard, this.props.turn);

    this.state = {
      board: startBoard,
      highlightedTile: null,
      reset: null,
      checkMate: false,
      searching: true,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.highlightTargets = this.highlightTargets.bind(this);
  }

  componentDidMount() {
    api.init(this.handlePlayerFound, this.handleOpponentMove, this.handleOpponentCheckmate);
  }

  handlePlayerFound() {
    this.setState({
      ...this.state,
      searching: false,
      color: color,
    });
  }

  handleOpponentMove(newBoard) {
    let checkMate = false;
    this.moves = rules.getMoves(newBoard, this.state.color);

    if (this.moves.length === 0) {
      api.checkmate();
      checkMate = true;
    } else {
      this.props.changeTurn();
    }

    this.setState({
      ...this.state,
      board: newBoard,
      checkmate: checkMate,
    });
  }

  handleOpponentCheckmate() {
    this.setState({
      ...this.state,
      checkMate: true,
    });
  }

  handleDrag(startRow, startCol, finRow, finCol) {
    if (this.state.checkMate || this.state.searching) {
      return;
    }

    var startTile = this.state.board[startRow][startCol];
    var targetTile = this.state.board[finRow][finCol];
    var newState = {board: this.state.board};

    if (helper.movePiece(this.state.board, this.moves, startTile, targetTile, newState)) {
      api.update(newState.board);
      this.props.changeTurn();
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
    if (this.state.checkMate || this.state.searching) {
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
        api.update(newState.board);
        this.props.changeTurn();
      }
    }
    else if (clickedTile.piece && clickedTile.piece.color === this.state.color && this.props.turn === this.state.color) {
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

  render() {
    return (
      <div className="two-board">
        {this.state.searching &&
          <p className="checkmate-text">
            Searching...
          </p>
        }
        {this.props.checkMate &&
          <p className="checkmate-text">
            Checkmate, {this.props.turn} wins!
          </p>
        }
        <Board
          checkMate={this.props.checkMate}
          board={this.state.board}
          handleClick={this.handleClick}
          handleDrag={this.handleDrag}
          highlightTargets={this.highlightTargets}
          highlightedTile={this.state.highlightedTile}
          reset={this.state.reset}
          tileSize={this.props.tileSize}
          turn={this.state.color}
        />
        <div className="bottom-text">
            <span id="turn-indicator">{this.props.turn}'s turn</span>
            <Timer id="timer"/>
        </div>
      </div>
    );
  }

}

export default OnlineBoard;
