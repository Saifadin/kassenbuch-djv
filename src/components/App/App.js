import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import gql from 'graphql-tag';

import client from '../../client';

import Body from './Body/Body';
import Header from './Header/Header';

import Registration from '../Registration/Registration';

import './App.scss';

const userQuery = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
    }
  }
`;

const Dashboard = () => (
  <div>
    <h2>Overview</h2>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;
    if (token && userId) {
      // If we are logged in subscribe to the user and render the app.
      this.subscribeToUser(userId);
    } else {
      // We are not logged in so stop loading and render the landing page.
      this.setState({ // eslint-disable-line
        loading: false,
      });
    }
  }

  subscribeToUser(id) {
    const that = this;
    const observable = client.watchQuery({
      query: userQuery,
      pollInterval: 60000,
      fetchPolicy: true,
      variables: {
        id,
      },
    });
    const subscription = observable.subscribe({
      next(result) {
        if (result && result.errors) {
          const unauthed = result.errors.reduce((acc, err) => (
            acc || err.status === 401
          ), false);
          if (unauthed) {
            localStorage.clear();
            that.setState({
              user: result.data.getUser,
              loading: false,
            });
          }
        } else {
          localStorage.setItem('currentUsername', result.data.getUser.username);
          that.setState({
            user: result.data.getUser,
            loading: false,
          });
        }
      },
      error(error) {
        console.log(`Error subscribing to user: ${error.toString()}`);
        that.setState({
          loading: false,
        });
      }, // Network error, etc.
      complete() {
        console.log('Subscription complete');
      },
    });
    this.setState({
      userSubscription: subscription,
    });
  }

  render() {
    return (
      <div className="App">
        <Header />

        <Body>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route path="/dashboard/register" component={Registration} />
        </Body>
      </div>
    );
  }
}

App.propTypes = {};

export default App;
