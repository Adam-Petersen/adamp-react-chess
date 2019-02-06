import React from 'react';

class PlayerName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e){
    this.setState({...this.state, value: e.target.value});
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <input className="player-name" type="text" value={this.state.value} onChange={this.onChange}/>
    );
  }
}

export default PlayerName;
