import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import './FloatingButton.scss';

class FloatingButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="FloatingButton">
        <FontAwesome size="2x" name="plus" className="FloatingButton__icon" />
      </div>
    );
  }
}

export default FloatingButton;
