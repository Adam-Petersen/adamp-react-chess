import React from 'react';
import TwoPlayerBoard from './TwoPlayerBoard';
import OnePlayerBoard from './OnePlayerBoard';
import OnlineBoard from './OnlineBoard';
import GameModeSelect from './GameModeSelect';


class Game extends React.Component {
  constructor(props) {
    super(props);

    this.tileSize = 75;

    this.state = {
      mode: null,
    };

    this.onModeClick = this.onModeClick.bind(this);
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
            tileSize={this.tileSize}
          />
        }
        {this.state.mode == "one" &&
          <OnePlayerBoard
            tileSize={this.tileSize}
          />
        }
        {this.state.mode == "online" &&
          <OnlineBoard
            tileSize={this.tileSize}
          />
        }
      </div>
    );
  }
}

export default Game;
