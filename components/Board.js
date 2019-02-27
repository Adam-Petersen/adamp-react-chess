import React from 'react';
import Tile from './Tile';

class Board extends React.Component {

  render() {
    return (
      <table className={`board ${this.props.checkMate ? 'checkmate' : ''}`}>
        <tbody className="board-body">
          {this.props.board.map((row,i) =>
            <tr key={`${i}`}>
              {row.map((col,j) =>
                <td key={`${i}${j}`}>
                  <Tile
                    name={this.props.board[i][j].name}
                    tileColor={this.props.board[i][j].tileColor}
                    row={i}
                    col={j}
                    piece={this.props.board[i][j].piece}
                    handleClick= {this.props.handleClick}
                    handleDrag= {this.props.handleDrag}
                    highlightTargets = {this.props.highlightTargets}
                    highlighted= {this.props.highlightedTile && this.props.highlightedTile.id === this.props.board[i][j].id}
                    possibleTarget = {this.props.board[i][j].possibleTarget}
                    reset = { this.props.reset && this.props.reset.id == this.props.board[i][j].id }
                    tileSize = {this.props.tileSize}
                    turn = {this.props.turn}
                    checkMate = {this.props.checkMate}
                    searching = {this.props.searching}
                    disableDrag={this.props.disableDrag}
                  />
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}
export default Board;
