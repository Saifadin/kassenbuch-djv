import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import client from './client';
import history from './history';

import App from './components/App/App';
import Home from './views/Home/Home';
import './index.scss';

const ProtectedAppRoute = () => (
  <div>
    { localStorage.token && localStorage.user ?
      <Route path="/dashboard" component={App} /> :
      <Redirect to="/" />
    }
  </div>
);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <ProtectedAppRoute />
      </Switch>
    </Router>
  </ApolloProvider>, document.getElementById('root'));
