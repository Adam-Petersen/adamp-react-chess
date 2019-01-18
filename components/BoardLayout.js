import React from 'react';
import Board from './Board';

class BoardLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      turn: 'white',
      check: false,
      checkMate: false,
      debug: true,
    };

    this.changeTurn = this.changeTurn.bind(this);
    this.toggleDebug = this.toggleDebug.bind(this);
  }

  changeTurn(vals) {
    this.setState({...this.state, ...vals, turn: this.state.turn === 'white' ? 'black' : 'white'});
  }

  toggleDebug() {
    this.setState({
      ...this.state,
      debug: !this.state.debug,
    });
  }

  render() {
    return (
      <div className="board-layout">
        <button onClick={this.toggleDebug}>Debug Mode</button>
        <p>Color: {this.state.color}</p>
        {this.state.checkMate &&
          <p className="checkmate-text">
            Checkmate, {this.state.turn === 'white' ? 'black' : 'white'} wins!
          </p>
        }
        <Board
          changeTurn={this.changeTurn}
          checkMate={this.state.checkMate}
          turn={this.state.turn}
          debug={this.state.debug}
        />
      </div>
    );
  }
}

export default BoardLayout;
