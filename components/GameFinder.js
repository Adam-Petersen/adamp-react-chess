import React from 'react';

class GameFinder extends React.Component {
  constructor(props) {
    super(props);
    this.onHostChange = this.onHostChange.bind(this);
    this.onJoinChange = this.onJoinChange.bind(this);
    this.onRandomClick = this.onRandomClick.bind(this);

    this.onHostGoClick = this.onHostGoClick.bind(this);
    this.hostExists = this.hostExists.bind(this);

    this.onJoinGoClick = this.onJoinGoClick.bind(this);
    this.gameNotFound = this.gameNotFound.bind(this);

    this.state = {
      hostVal: '',
      joinVal: '',
      creatingHost: false,
      joiningGame: false,
      randomSearch: false,
      hostExists: false,
      gameNotFound: false,
    }
  }

  onHostChange(e) {
    this.setState({
      ...this.state,
      hostVal: e.target.value,
      hostExists: false,
    })
  }

  onJoinChange(e) {
    this.setState({
      ...this.state,
      joinVal: e.target.value,
      gameNotFound: false,
    })
  }

  onHostGoClick() {
    if (this.state.randomSearch) {
      this.props.api.removeSearch();
    }

    this.setState({
      ...this.state,
      creatingHost: true,
      joiningGame: false,
      randomSearch: false,
    });
    this.props.api.hostGame(this.state.hostVal, this.props.handlePlayerFound, this.hostExists);
  }

  hostExists() {
    this.setState({
      ...this.state,
      creatingHost: false,
      hostExists: true,
    })
  }

  onJoinGoClick() {
    if (this.state.creatingHost) {
      this.props.api.removeHost();
    }
    if (this.state.randomSearch) {
      this.props.api.removeSearch();
    }

    this.setState({
      ...this.state,
      creatingHost: false,
      joiningGame: true,
      randomSearch: false,
    });

    setTimeout(function() {this.props.api.joinGame(this.state.joinVal, this.props.handlePlayerFound, this.gameNotFound)}.bind(this),
      500);
  }

  gameNotFound() {
    this.setState({
      ...this.state,
      joiningGame: false,
      gameNotFound: true,
    })
  }

  onRandomClick() {
    if (this.state.creatingHost) {
      this.props.api.removeHost();
    }

    this.setState({
      ...this.state,
      creatingHost: false,
      joiningGame: false,
      randomSearch: true,
    });

    this.props.api.search(this.props.handlePlayerFound)
  }


  render() {
    return (
      <div className="board transparent">
        <div className="online-mode-select">
          <p className="online-header"> Find a Game </p>

          <div className="online-input">
            <label className="game-finder-label">Host a game</label>
            <div className="input-line">
              <input
                className={`game-finder-input ${this.state.hostExists ? 'error' : ''}`}
                type="text" placeholder="Enter a game id"
                value={this.state.hostExists ? "Host already exists" : this.state.hostVal} onChange={this.onHostChange}
              />
              <button type="button" onClick={this.onHostGoClick}>
                {!this.state.creatingHost &&
                  <p>Go</p>
                }
                {this.state.creatingHost &&
                  <div className="host-loader">
                  <img src="/images/loader.gif"></img>
                  </div>
                }
              </button>
            </div>
          </div>

          <div className="online-input">
            <label className="game-finder-label">Join a game</label>
            <div className="input-line">
              <input
                className={`game-finder-input ${this.state.gameNotFound ? 'error' : ''}`}
                type="text" placeholder="Enter a game id"
                value={this.state.gameNotFound ? "Game not found" : this.state.joinVal} onChange={this.onJoinChange}
              />
              <button type="button" onClick={this.onJoinGoClick}>
                {!this.state.joiningGame &&
                  <p>Go</p>
                }
                {this.state.joiningGame &&
                  <div className="host-loader">
                  <img src="/images/loader.gif"></img>
                  </div>
                }
              </button>
            </div>
          </div>

          <p className="or">OR</p>

          <button id="random-button" type="button" onClick={this.onRandomClick} disabled={this.state.randomSearch}>
            <span>Join Random Game</span>
            {this.state.randomSearch &&
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
