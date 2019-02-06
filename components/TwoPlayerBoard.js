import React from 'react';
import Tile from './Tile';
import pieces from '../helpers/pieces';
import rules from '../helpers/rules';

class TwoPlayerBoard extends React.Component {
  constructor(props) {
    super(props);

    var startBoard = this.initializeBoard();
    this.moves = rules.setNewBoard(startBoard, this.props.turn);
    this.debugSetHighlights(startBoard);

    this.tileDraggedFrom;

    this.state = {
      board: startBoard,
      highlightedTile: null,
      checkMate: false,
    };

    this.handleClick = this.handleClick.bind(this);
    //this.handleDrag = this.handleDrag.bind(this);
  }

  /*handleDrag(startRow, startCol, finRow, finCol) {
    console.log(startRow);
    console.log(startCol);
    console.log(finRow);
    console.log(finCol);

    this.tileDraggedFrom = this.state.board[startRow][startCol];
    this.handleClick(finRow, finCol);
  } */

  handleClick(row, col) {
    if (this.state.checkMate) {
      return;
    }

    var newState = { board: this.state.board };
    var highlightedTile = this.tileDraggedFrom ? this.tileDraggedFrom : this.state.highlightedTile;
    let clickedTile = this.state.board[row][col];

    if (highlightedTile) {
      if(highlightedTile.id === clickedTile.id) {
        newState.highlightedTile = null;
      }
      else if(clickedTile.piece && clickedTile.piece.color === highlightedTile.piece.color) {
        newState.highlightedTile = clickedTile;
      }
      else if(rules.isValidMove(highlightedTile, clickedTile)) {
        var newBoard = this.copyBoard(this.state.board);
        newBoard[highlightedTile.row][highlightedTile.col] = {...highlightedTile, piece: null};
        newBoard[row][col] = {...clickedTile, piece: highlightedTile.piece }
        this.moves = rules.setNewBoard(newBoard);
        newState.board = newBoard;

        if (rules.isCheckMate()) {
          newState.checkMate = true;
          this.props.changeTurn({checkMate: true});
        }
        else if (rules.isCheck()) {
          this.props.changeTurn({check: true});
        }
        else {
          this.props.changeTurn({check: false});
        }
        newState.highlightedTile = null;
      }
      else {
        newState.highlightedTile = null;
      }
    }
    else if (clickedTile.piece && clickedTile.piece.color === this.props.turn) {
      newState.highlightedTile = clickedTile;
    }

    this.debugSetHighlights(newState.board, newState.highlightedTile)

    console.log('setting state');
    this.setState({
      ...this.state,
      ...newState,
    });
  }

  render() {
    return (
      <table className={`board ${this.props.checkMate ? 'checkmate' : ''}`}>
        <tbody className="board-body">
          {this.state.board.map((row,i) =>
            <tr key={`${i}`}>
              {row.map((col,j) =>
                <td key={`${i}${j}`}>
                  <Tile
                    name={this.state.board[i][j].name}
                    tileColor={this.state.board[i][j].tileColor}
                    row={i}
                    col={j}
                    piece={this.state.board[i][j].piece}
                    handleClick= {this.handleClick}
                    //handleDrag= {this.handleDrag}
                    highlighted= {this.state.highlightedTile && this.state.highlightedTile.id === this.state.board[i][j].id}
                    possibleTarget = {this.state.board[i][j].possibleTarget}
                    debug = {this.props.debug}
                  />
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  getInitialPiecesArray() {
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

  initializeBoard() {
    var board = [];
    var pieceLocations = this.getInitialPiecesArray();

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

  copyBoard(oldBoard) {
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

  debugSetHighlights(board, highlightedTile) {
    board.forEach((row, i) => row.forEach((col, j) => board[i][j].possibleTarget = false));

    this.moves.forEach(move => {
      if (!highlightedTile || move.startTile.id === highlightedTile.id) {
        board[move.targetTile.row][move.targetTile.col].possibleTarget = true;
      }
    });
  }
}

export default TwoPlayerBoard;
