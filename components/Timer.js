import React from 'react';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      value: "00:00"
    };
  }
  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  formatTime(time) {
    let minutes = Math.floor(time/60);
    let seconds = time - (minutes * 60);

    return ((minutes < 10 ? `0${minutes}` : minutes.toString()) + ":" + (seconds < 10 ? `0${seconds}` : seconds.toString()));
  }

  tick() {
    let new_time = this.state.time + 1;
    this.setState({
      time: new_time,
      value: this.formatTime(new_time),
    });
  }
  render() {
    return (
      <span id={this.props.id} className="timer">
        {this.state.value}
      </span>
    );
  }
}

export default Timer;
