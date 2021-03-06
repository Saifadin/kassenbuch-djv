import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import './Header.scss';
import logo from '../../../logo-white.png';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: true,
    };

    this._logOut = this._logOut.bind(this);
  }

  _logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentUsername');

    this.setState({
      loggedIn: false,
    });

    this.context.router.history.push('/');
  }

  render() {
    return (
      <div className="Header">
        <div className="Header__wrapper">
          <Link to="/">
            <img src={logo} className="Header__logo" alt="logo" />
          </Link>

          <nav className="Header__navigation">
            <ul className="Header-Navigation__ul">
              <li className="Header-Navigation__li">
                <Link to="/dashboard" className="Header-Navigation__link"><FontAwesome name="list" /></Link>
              </li>
              <li className="Header-Navigation__li">
                <Link to="/dashboard/new-entry" className="Header-Navigation__link"><FontAwesome name="plus" /></Link>
              </li>
              <li className="Header-Navigation__li">
                <Link to="/dashboard/register" className="Header-Navigation__link"><FontAwesome name="user" /></Link>
              </li>
              <li className="Header-Navigation__li">
                <a role="presentation" className="Header-Navigation__link Header-Navigation__link--logout" onClick={this._logOut}><FontAwesome name="sign-out" /></a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

Header.contextTypes = {
  router: PropTypes.object,
};

export default Header;
