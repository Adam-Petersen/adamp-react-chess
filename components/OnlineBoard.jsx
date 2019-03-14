import React from 'react';
import Board from './Board';
import Timer from './Timer';
import GameFinder from './GameFinder';
import helper from '../helpers/boardHelper';
import rules from '../helpers/rules';
import api from '../helpers/api';

class OnlineBoard extends React.Component {
  constructor(props) {
    super(props);

    let startBoard = helper.initializeBoard();
    this.moves = [];
    this.opponentName = '';

    this.state = {
      board: startBoard,
      turn: 'white',
      highlightedTile: null,
      reset: null,
      checkMate: false,
      winner: null,
      searching: true,
      opponentDisconnected: false,
    };

    // Game Finder Screen
    this.handlePlayerFound = this.handlePlayerFound.bind(this);

    // Callbacks for API
    this.handlePlayerFound = this.handlePlayerFound.bind(this);
    this.handleOpponentMove = this.handleOpponentMove.bind(this);
    this.handleOpponentCheckmate = this.handleOpponentCheckmate.bind(this);
    this.handleOpponentDisconnect = this.handleOpponentDisconnect.bind(this);

    // Functions for Board
    this.handleClick = this.handleClick.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.highlightTargets = this.highlightTargets.bind(this);
  }

  componentDidMount() {
    api.init(this.handleOpponentMove, this.handleOpponentCheckmate, this.handleOpponentDisconnect);
  }

  handlePlayerFound(data) {
    if (data.color === 'white') {
      this.moves = rules.getMoves(this.state.board, 'white');
    }

    this.opponentName = data.opp_id;

    let oldState = this.state;
    this.setState({
      ...oldState,
      searching: false,
      color: data.color,
    });
  }

  handleOpponentMove(newBoard) {
    this.moves = rules.getMoves(newBoard, this.state.color);
    let oldState = this.state;

    if (this.moves.length === 0) {
      api.checkmate();
      helper.setTargetHighlights(newBoard, this.moves, null);
      this.setState({
        ...oldState,
        board: newBoard,
        checkMate: true,
        winner: oldState.turn,
        highlightedTile: null,
      });
    } else {
      helper.setTargetHighlights(newBoard, this.moves, null);
      this.setState({
        ...oldState,
        board: newBoard,
        turn: oldState.color,
        highlightedTile: null,
      });
    }
  }

  handleOpponentCheckmate() {
    let oldState = this.state;
    this.setState({
      ...oldState,
      checkMate: true,
      winner: oldState.color,
    });
  }

  handleOpponentDisconnect() {
    let oldState = this.state;
    this.setState({
      ...oldState,
      opponentDisconnected: true,
    });
  }

  handleDrag(startRow, startCol, finRow, finCol) {
    if (this.state.checkMate || this.state.searching) {
      return;
    }

    let startTile = this.state.board[startRow][startCol];
    let targetTile = this.state.board[finRow][finCol];
    let newState = { board: this.state.board };

    if (helper.movePiece(this.state.board, this.moves, startTile, targetTile, newState)) {
      api.update(newState.board);
      newState.turn = helper.nextTurn(this.state.turn);
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

  // Board callbacks
  handleClick(row, col) {
    if (this.state.checkMate || this.state.searching) {
      return;
    }

    let newState = { board: this.state.board };
    let { highlightedTile } = this.state;
    let clickedTile = this.state.board[row][col];

    if (highlightedTile) {
      if (highlightedTile.id === clickedTile.id) {
        newState.highlightedTile = null;
      } else if (clickedTile.piece && clickedTile.piece.color === highlightedTile.piece.color) {
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
          api.update(newState.board);
          newState.turn = helper.nextTurn(this.state.turn);
        }
      }
    } else if (clickedTile.piece
        && clickedTile.piece.color === this.state.color
        && this.state.turn === this.state.color) {
      newState.highlightedTile = clickedTile;
    }

    helper.setTargetHighlights(newState.board, this.moves, newState.highlightedTile);

    let oldState = this.state;
    this.setState({
      ...oldState,
      ...newState,
    });
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
      <div className="two-board">
        {!this.state.color
          && (
          <GameFinder
            handlePlayerFound={this.handlePlayerFound}
            api={api}
          />
          )
        }
        {this.state.checkMate
          && (
          <div id="overlay-wrapper">
            <div id="overlay" />
            <p className="overlay-text">{`Checkmate, ${this.state.winner} wins!`}</p>
          </div>
          )
        }
        {this.state.opponentDisconnected
          && (
          <div id="overlay-wrapper">
            <div id="overlay" />
            <p className="overlay-text">Opponent Disconnected</p>
          </div>
          )
        }
        {this.state.color
          && (
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
          )
        }
        {this.state.color
          && (
          <div className="bottom-text">
            <span id="turn-indicator">{this.state.turn === this.state.color ? 'Your turn' : "Opponent's turn"}</span>
            <Timer id="timer" />
          </div>
          )
        }
        {!this.state.color
          && (
          <div className="bottom-text">
            <span id="turn-indicator">New Game</span>
            <span id="timer">00:00</span>
          </div>
          )
        }
      </div>
    );
  }
}

export default OnlineBoard;
