import React from 'react';
import ModeButton from './ModeButton'

class GameModeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.onLocalClick = this.onLocalClick.bind(this);
    this.onAIClick = this.onAIClick.bind(this);
    this.onOnlineClick = this.onOnlineClick.bind(this);
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

  render() {
    return (
      <div>
        <div className="board transparent">
          <div className="mode-select">
            <p className="mode-header"> Select Game Mode </p>
            <ModeButton
              text={"Local 1v1"}
              disabled={true}
              onClick={this.onLocalClick}
            />

            <ModeButton
              text={"AI mode"}
              disabled={false}
              onClick={this.onAIClick}
            />

            <ModeButton
              text={"Online Mode"}
              disabled={true}
              onClick={this.onOnlineClick}
            />
          </div>
        </div>

      </div>
    );
  }

}

export default GameModeSelect;
