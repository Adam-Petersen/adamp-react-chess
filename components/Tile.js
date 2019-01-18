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
        className={`tile ${this.props.tileColor} ${this.props.highlighted === true ? 'highlighted' : ''} ${this.props.debug && this.props.possibleTarget ? 'target' : ''}`}
        onClick={this.handleClick}
      >
        {this.props.piece &&
          <Piece
            handleClick={this.handleClick}
            //handleDrag={this.props.handleDrag}
            image={this.props.piece.image}
            row={this.props.row}
            col={this.props.col}
          />
        }
      </div>
    );
  }
}

export default Tile;
