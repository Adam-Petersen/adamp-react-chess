import React from 'react';
import Tile from './Tile';

class Board extends React.Component {

  render() {
    let board = [];
    for(let i = 0; i < 8; i++) {
      let col = [];
      for(let j = 0; j < 8; j++) {
        col.push(this.props.flip ? this.props.board[7 - i][7 - j] : this.props.board[i][j]);
      }
      board.push(col);
    }
    return (
      <table className={`board ${this.props.checkMate || this.props.searching ? 'checkmate' : ''}`}>
        <tbody className="board-body">
          {board.map((row,i) =>
            <tr key={`${i}`}>
              {row.map((col,j) => {
                let tile = board[i][j]
                return (
                  <td key={`${i}${j}`}>
                    <Tile
                      name={tile.name}
                      tileColor={tile.tileColor}
                      row={tile.row}
                      col={tile.col}
                      i={i}
                      j={j}
                      piece={tile.piece}
                      handleClick= {this.props.handleClick}
                      handleDrag= {this.props.handleDrag}
                      highlightTargets = {this.props.highlightTargets}
                      highlighted= {this.props.highlightedTile && this.props.highlightedTile.id === tile.id}
                      possibleTarget = {tile.possibleTarget}
                      reset ={ this.props.reset && this.props.reset.id == tile.id }
                      tileSize={this.props.tileSize}
                      turn={this.props.turn}
                      checkMate={this.props.checkMate}
                      searching={this.props.searching}
                      disableDrag={this.props.disableDrag}
                      flip={this.props.flip}
                    />
                  </td>
                )}
              )}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}
export default Board;
