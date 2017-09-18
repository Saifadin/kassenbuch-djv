import React, { Component } from 'react';

import Login from '../../components/Login/Login';

import './Home.scss';
import logo from '../../logo.png';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Home">
        <div className="Home__logo">
          <img src={logo} className="Home__logo--img" alt="logo" />
        </div>
        <div className="Home__login">
          <Login />
        </div>
        <div className="Home__noLogin">
          <p>Sie haben keinen Zugang zum DJV-Kassenbuch? Melden Sie sich bei <a href="mailto:info@djv-hilfe.de?subject=Zugang%20zum%20Kassenbuch">info@djv-hilfe.de</a>.</p>
        </div>
      </div>
    );
  }
}

export default Home;
