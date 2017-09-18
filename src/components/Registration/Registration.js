import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

const CreateUserQuery = gql`
  mutation CreateUserMutation($data: CreateUserInput!) {
    createUser(input: $data) {
      token
      changedUser {
        id
        username
      }
    }
  }
`;

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: [],
    };

    this._handleRegisterEmailChange = this._handleRegisterEmailChange.bind(this);
    this._handleRegisterPasswordChange = this._handleRegisterPasswordChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  validateInput() {
    return (
      this.state.username && this.state.username.length &&
      this.state.password && this.state.password.length
    );
  }

  registerUser(e) {
    e.preventDefault();
    if (this.validateInput()) {
      this.props.createUser({
        username: this.state.username,
        password: this.state.password,
      }).then(({ data }) => {
        if (!data.errors) {
          localStorage.setItem('token', data.createUser.token);
          localStorage.setItem('user', JSON.stringify(data.createUser.changedUser));
          this.setState({
            errors: [],
          });
          this.props.history.push('/home');
        } else {
          this.setState({ errors: data.errors });
        }
      }).catch((errors) => {
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

  _handleRegisterEmailChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  _handleRegisterPasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <h2>Registrierung</h2>
        <form>
          <input type="text" onChange={this._handleRegisterEmailChange} />
          <input type="password" onChange={this._handleRegisterPasswordChange} />
          <input type="submit" onClick={this.registerUser} />
        </form>
      </div>
    );
  }
}

export default compose(
  graphql(CreateUserQuery, {
    props: ({ mutate }) => ({
      createUser: (data) => mutate({
        variables: {
          data,
        },
      }),
    }),
  }),
)(Registration);
