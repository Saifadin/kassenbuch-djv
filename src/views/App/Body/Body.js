import React, { Component } from 'react';

import './Body.scss';

class Body extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Body">
        <div className="Body__wrapper">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Body;
