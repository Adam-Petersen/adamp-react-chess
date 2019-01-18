import React from 'react';
//import Draggable from 'react-draggable';


class Piece extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    //this.onStop = this.onStop.bind(this);
  }

  handleClick(e) {
    this.props.handleClick(this.props.row, this.props.col);
  }

    /*
  onStop(e, drag) {
    var finRow, finCol;
    console.log(drag);
    finRow = this.props.row + Math.round(drag.y / 100);
    finCol = this.props.col + Math.round(drag.x / 100);
    this.props.handleDrag(this.props.row, this.props.col, finRow, finCol);
  } */

  render() {
    return (
      /*<Draggable onStop={this.onStop}>
        <img src={this.props.image} draggable="false" className="image" alt="logo" />
      </Draggable> */
      <img src={this.props.image} className="image" alt="logo" />
    );
  }
}

export default Piece;
