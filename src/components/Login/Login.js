import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import TextField from 'material-ui/TextField';

import PropTypes from 'prop-types';

import './Login.scss';

const LoginUserMutation = gql `
  mutation LoginUserMutation($data: LoginUserInput!) {
    loginUser(input: $data) {
      token
      user {
        id
        username
      }
    }
  }
`;

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      username: '',
      password: '',
      formValid: true,
      errors: [],
    };
    this._handleLoginEmailChange = this._handleLoginEmailChange.bind(this);
    this._handleLoginPasswordChange = this._handleLoginPasswordChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  _handleLoginEmailChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  _handleLoginPasswordChange(e) {
    this.setState({
      loginPassword: e.target.value,
    });
  }

  validateInput() {
    this.setState({
      formValid: this.state.username && this.state.username.length &&
      this.state.loginPassword && this.state.loginPassword.length,
    });

    return this.state.username && this.state.username.length &&
    this.state.loginPassword && this.state.loginPassword.length;
  }

  loginUser(e) {
    e.preventDefault();
    if (this.validateInput()) {
      this.props.login({
        username: this.state.username,
        password: this.state.loginPassword,
      }).then(({ data }) => {
        if (!data.errors) {
          localStorage.setItem('token', data.loginUser.token);
          localStorage.setItem('user', JSON.stringify(data.loginUser.user));
          this.setState({ errors: [] });
          this.context.router.history.push('/dashboard');
        } else {
          this.setState({ errors: data.errors });
        }
      }).catch(errors => {
        this.setState({ errors: errors.graphQLErrors });
      });
    } else {
      this.setState({
        errors: [{
          message: 'Username or password was not filled out. Please fill out the required fields.',
        }],
      });
    }
  }

  render() {
    const formInvalidClass = this.state.formValid ? '' : 'Login__form--isInvalid';

    return (
      <form className={`Login__form ${formInvalidClass}`}>
        <TextField className="Login__input" type="email" onChange={this._handleLoginEmailChange} floatingLabelText="Benutzername" required="true" />
        <TextField className="Login__input" type="password" onChange={this._handleLoginPasswordChange} floatingLabelText="Passwort" required="true" />
        <input type="submit" className="Login__button" onClick={this.loginUser} />
      </form>
    );
  }
}

Login.contextTypes = {
  router: PropTypes.object,
};

const LoginWithData = graphql(LoginUserMutation, {
  props: ({ mutate }) => ({
    login: (data) => mutate({
      variables: {
        data,
      },
    }),
  }),
})(Login);
export default LoginWithData;
