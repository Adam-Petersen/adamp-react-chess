import React from 'react';
import TwoPlayerBoard from './TwoPlayerBoard';
import GameModeSelect from './GameModeSelect';
import PlayerName from './PlayerName'
import Timer from './Timer';


class Game extends React.Component {
  constructor(props) {
    super(props);

    this.tileSize = 75;

    this.state = {
      mode: null,
      turn: null,
      check: false,
      checkMate: false,
      debug: false,
    };

    this.changeTurn = this.changeTurn.bind(this);
    this.toggleDebug = this.toggleDebug.bind(this);
    this.onModeClick = this.onModeClick.bind(this);
    this.changePlayer1 = this.changePlayer1.bind(this);
    this.changePlayer2 = this.changePlayer2.bind(this);
  }

  changePlayer1(name) {

  }

  changePlayer2(name) {

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
    this.setState({...this.state, mode: mode, turn: "white"});
  }

  render() {
    return (
      <div className="game">
        {!this.state.mode &&
          <div>
          <GameModeSelect
            onClick={this.onModeClick}
          />
          <div className="bottom-text">
              <span id="turn-indicator">New Game</span>
              <span id="timer">00:00</span>
          </div>
          </div>
        }
        {this.state.mode == "two" &&
          <div className="two-board">
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
              tileSize={this.tileSize}
            />

            <div className="bottom-text">
                <span id="turn-indicator">{this.state.turn}'s turn</span>
                <Timer id="timer"/>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Game;
