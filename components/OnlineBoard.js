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
    this.moves = [];

    this.state = {
      board: startBoard,
      turn: 'white',
      highlightedTile: null,
      reset: null,
      checkMate: false,
      winner: null,
      searching: true,
    };

    this.handlePlayerFound = this.handlePlayerFound.bind(this);
    this.handleOpponentMove = this.handleOpponentMove.bind(this);
    this.handleOpponentCheckmate = this.handleOpponentCheckmate.bind(this);
    this.handleOpponentDisconnect = this.handleOpponentDisconnect.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.highlightTargets = this.highlightTargets.bind(this);
  }

  componentDidMount() {
    api.init(this.handlePlayerFound, this.handleOpponentMove,
             this.handleOpponentCheckmate, this.handleOpponentDisconnect);
  }

  handlePlayerFound(color) {
    if(color === 'white') {
      this.moves = rules.getMoves(this.state.board, 'white');
    } else {
      //this.flipBoard();
    }

    this.setState({
      ...this.state,
      searching: false,
      color: color,
    });
  }

  handleOpponentMove(newBoard) {
    this.moves = rules.getMoves(newBoard, this.state.color);

    if (this.moves.length === 0) {
      console.log('sending checkmate')
      api.checkmate();
      helper.setTargetHighlights(newBoard, this.moves, null);
      this.setState({
        ...this.state,
        board: newBoard,
        checkMate: true,
        winner: this.state.turn,
        highlightedTile: null,
      });
    } else {
      helper.setTargetHighlights(newBoard, this.moves, null);
      this.setState({
        ...this.state,
        board: newBoard,
        turn: this.state.color,
        highlightedTile: null,
      });
    }
  }

  handleOpponentCheckmate() {
    console.log('handle checkmate')
    this.setState({
      ...this.state,
      checkMate: true,
      winner: this.state.color,
    });
  }

  handleOpponentDisconnect() {
    console.log('opponent disconnect');
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
      newState.turn = helper.nextTurn(this.state.turn);
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
        newState.turn = helper.nextTurn(this.state.turn);
      }
    }
    else if (clickedTile.piece && clickedTile.piece.color === this.state.color && this.state.turn === this.state.color) {
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
          turn={this.state.turn}
          disableDrag={this.state.turn !== this.state.color}
          searching={this.state.searching}
          flip={this.state.color === 'black'}
        />
        <div className="bottom-text">
            <span id="turn-indicator">{this.state.turn}'s turn</span>
            <span>   You are {this.state.color}</span>
            <Timer id="timer"/>
        </div>
      </div>
    );
  }
}

export default OnlineBoard;
