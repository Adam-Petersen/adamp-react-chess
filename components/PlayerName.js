import React from 'react';

class PlayerName extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.upNext);

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
      <input className={`player-name ${this.props.color} ${this.props.upNext ? "up-next" : ""}`} type="text" value={this.state.value} onChange={this.onChange}/>
    );
  }
}

export default PlayerName;
