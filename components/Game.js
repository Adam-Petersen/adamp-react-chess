import React from 'react';
import TwoPlayerBoard from './TwoPlayerBoard';
import GameModeSelect from './GameModeSelect';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: null,
      turn: 'white',
      check: false,
      checkMate: false,
      debug: false,
    };

    this.changeTurn = this.changeTurn.bind(this);
    this.toggleDebug = this.toggleDebug.bind(this);
    this.onModeClick = this.onModeClick.bind(this);
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

  onModeClick(mode) {
    this.setState({...this.state, mode: mode});
  }

  render() {
    return (
      <div className="game">
        {!this.state.mode &&
          <GameModeSelect
            onClick={this.onModeClick}
          />
        }
        {this.state.mode == "two" &&
          <div className="two-board">
            <button onClick={this.toggleDebug}>Debug Mode</button>
            <p>Color: {this.state.turn}</p>
            {this.state.checkMate &&
              <p className="checkmate-text">
                Checkmate, {this.state.turn === 'white' ? 'black' : 'white'} wins!
              </p>
            }
            <TwoPlayerBoard
              changeTurn={this.changeTurn}
              checkMate={this.state.checkMate}
              turn={this.state.turn}
              debug={this.state.debug}
            />
          </div>
        }
      </div>
    );
  }
}

export default Game;
