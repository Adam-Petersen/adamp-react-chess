import React from 'react';
import TwoPlayerBoard from './TwoPlayerBoard';
import OnePlayerBoard from './OnePlayerBoard';
import GameModeSelect from './GameModeSelect';


class Game extends React.Component {
  constructor(props) {
    super(props);

    this.tileSize = 75;

    this.state = {
      mode: null,
      turn: null,
      check: false,
      checkMate: false,
    };

    this.changeTurn = this.changeTurn.bind(this);
    this.onModeClick = this.onModeClick.bind(this);
    this.setCheckMate = this.setCheckMate.bind(this);
  }

  changeTurn() {
    this.setState({...this.state, turn: this.state.turn === 'white' ? 'black' : 'white'});
  }

  setCheckMate(winner) {
    if (winner) {
      this.setState({...this.state, turn: winner, checkMate: true})
    } else {
      this.setState({...this.state, checkMate: true});
    }
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
          <TwoPlayerBoard
            changeTurn={this.changeTurn}
            turn={this.state.turn}
            tileSize={this.tileSize}
            setCheckMate={this.setCheckMate}
            checkMate={this.state.checkMate}
          />
        }
        {this.state.mode == "one" &&
          <OnePlayerBoard
            tileSize={this.tileSize}
            setCheckMate={this.setCheckMate}
            checkMate={this.state.checkMate}
          />
        }
      </div>
    );
  }
}

export default Game;
