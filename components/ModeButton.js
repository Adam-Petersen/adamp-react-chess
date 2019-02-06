import React from 'react';

class ModeButton extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <button className="mode-button" type="button" disabled={this.props.disabled} onClick={this.props.onClick}>{this.props.text}</button>
    );
  }
}

export default ModeButton;
