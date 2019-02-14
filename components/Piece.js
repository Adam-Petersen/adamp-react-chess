import React from 'react';
import Draggable from 'react-draggable';


class Piece extends React.Component {
  constructor(props) {
    super(props);

    this.dragging = false;
    this.doneDragging = false;

    this.handleClick = this.handleClick.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onDrag = this.onDrag.bind(this);
  }

  handleClick(e) {
    if (!this.doneDragging) {
      //console.log("Calling handlClick");
      this.props.handleClick(this.props.row, this.props.col);
    } else {
      this.doneDragging = false;
    }
  }


  onStop(e, drag) {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;
    this.doneDragging = true;
    var finRow, finCol;
    finRow = this.props.row + Math.round(drag.y / this.props.tileSize);
    finCol = this.props.col + Math.round(drag.x / this.props.tileSize);
    this.props.handleDrag(this.props.row, this.props.col, finRow, finCol);
  }

  onDrag(e, drag) {
    if(!this.dragging) {
      this.props.highlightTargets(this.props.row, this.props.col);
    }
    this.dragging = true;
  }

  render() {
    return (
      <Draggable
        disabled={this.props.disableDrag}
        onDrag={this.onDrag}
        onStop={this.onStop}
        position={this.props.reset ? {x: 0, y: 0} : null }
        bounds={{left: -1 * this.props.col * this.props.tileSize,
                 top: -1 * this.props.row * this.props.tileSize,
                 right: (7-this.props.col) * this.props.tileSize,
                 bottom:(7-this.props.row) * this.props.tileSize
               }}
      >
        <img src={this.props.image} draggable="false" onClick={this.handleClick} className="image" alt="logo" />
      </Draggable>
    );
  }
}

export default Piece;
