import React from 'react';
import Piece from './Piece';

class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.handleClick(this.props.row, this.props.col);
  }


  render() {
    return (
      <div
        className={`tile ${this.props.tileColor} ${this.props.highlighted === true ? 'highlighted' : ''} ${this.props.debug && this.props.debugTarget ? 'debug-target' : ''} ${this.props.possibleTarget ? 'possible-target' : ''}`}
        onClick={this.props.piece ? null : this.handleClick}
      >
        {this.props.piece &&
          <Piece
            handleClick={this.handleClick}
            highlightTargets={this.props.highlightTargets}
            handleDrag={this.props.handleDrag}
            image={this.props.piece.image}
            row={this.props.row}
            col={this.props.col}
            reset={this.props.reset}
            tileSize={this.props.tileSize}
            disableDrag={this.props.piece && this.props.piece.color !== this.props.turn }
          />
        }
      </div>
    );
  }
}

export default Tile;
