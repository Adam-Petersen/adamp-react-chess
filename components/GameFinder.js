import React from 'react';
import Loader from './Loader';

class GameFinder extends React.Component {
  constructor(props) {
    super(props);
    this.onRandomClick = this.onRandomClick.bind(this);

    this.state = {
      searching: false,
    }
  }

  onRandomClick() {
    this.props.onRandomClick();

    this.setState({
      ...this.state,
      searching: true,
    })
  }


  render() {
    return (
      <div className="board transparent">
        <div className="mode-select wide">
          <p className="mode-header"> Find a Game </p>

          <label>Host a game: </label>
          <input type="text" placeholder="Enter a game id"/>

          <label>Join a game: </label>
          <input type="text" placeholder="Enter a game id"/>

          <button id="random-button" type="button" onClick={this.onRandomClick} disabled={this.state.searching}>
            <span>Join Random Game</span>
            {this.state.searching &&
              <div className="loader">
              <img src="/images/loader.gif"></img>
              </div>
            }
          </button>
        </div>
      </div>
    );
  }

}

export default GameFinder;
