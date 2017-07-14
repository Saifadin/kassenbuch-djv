import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      username: '',
      password: '',
      errors: [],
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this._handleLoginEmailChange = this._handleLoginEmailChange.bind(this);
    this._handleLoginPasswordChange = this._handleLoginPasswordChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
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
    return (
      this.state.username && this.state.username.length &&
      this.state.loginPassword && this.state.loginPassword.length
    );
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
          this.props.history.push('/home');
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
    return (
      <div>
        <h2>Login</h2>
        <form>
          <input type="text" onChange={this._handleLoginEmailChange} />
          <input type="password" onChange={this._handleLoginPasswordChange} />
          <input type="submit" onClick={this.loginUser} />
        </form>
      </div>
    );
  }
}

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
