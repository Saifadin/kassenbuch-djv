import React from 'react';
import { Link } from 'react-router-dom';

import './Header.scss';
import logo from '../../../logo.png';

const Header = () => (
  <div>
    <div className="Header">
      <img src={logo} className="App-logo" alt="logo" />

      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Registration</Link></li>
          <li><Link to="/dashboard">Overview</Link></li>
        </ul>
      </nav>
    </div>
  </div>
);

export default Header;
