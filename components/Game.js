import React from 'react';
import TwoPlayerBoard from './TwoPlayerBoard';
import GameModeSelect from './GameModeSelect';
import PlayerName from './PlayerName'


class Game extends React.Component {
  constructor(props) {
    super(props);

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
        <PlayerName
          value={"Player 2"}
          onChange={this.changePlayer2}
          color="dark"
          upNext={this.state.turn == "black"}
        />
        {!this.state.mode &&
          <GameModeSelect
            onClick={this.onModeClick}
          />
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
            />
          </div>
        }
        <PlayerName
          value="Player 1"
          onChange={this.changePlayer1}
          color="light"
          upNext={this.state.turn == "white"}
        />
      </div>
    );
  }
}

export default Game;
