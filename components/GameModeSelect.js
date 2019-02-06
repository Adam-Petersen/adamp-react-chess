import React from 'react';
import ModeButton from './ModeButton'
import PlayerName from './PlayerName'

class GameModeSelect extends React.Component {
  constructor(props) {
    super(props);

    this.onLocalClick = this.onLocalClick.bind(this);
    this.onAIClick = this.onAIClick.bind(this);
    this.onOnlineClick = this.onOnlineClick.bind(this);
    this.changePlayer1 = this.changePlayer1.bind(this);
    this.changePlayer2 = this.changePlayer2.bind(this);
  }

  onLocalClick() {
    this.props.onClick("two");
  }

  onAIClick() {
    this.props.onClick("one");
  }

  onOnlineClick() {
    this.props.onClick("online");
  }

  changePlayer1(name) {

  }

  changePlayer2(name) {
    
  }

  render() {
    return (
      <div>
        <PlayerName
          value={"Player 2"}
          onChange={this.changePlayer2}
        />
        <div className="board transparent">
          <div className="mode-select">
            <p className="mode-header"> Select Game Mode </p>
            <ModeButton
              text={"Local 1v1"}
              disabled={false}
              onClick={this.onLocalClick}
            />

            <ModeButton
              text={"AI mode"}
              disabled={true}
              onClick={this.onAIClick}
            />

            <ModeButton
              text={"Online Mode"}
              disabled={true}
              onClick={this.onOnlineClick}
            />
          </div>
        </div>
        <PlayerName
          value="Player 1"
          onChange={this.changePlayer1}
        />
      </div>
    );
  }

}

export default GameModeSelect;
