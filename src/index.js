import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import client from './client';
// import history from './history';

import App from './views/App/App';
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
  <MuiThemeProvider>
    <ApolloProvider client={client}>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <ProtectedAppRoute />
        </Switch>
      </HashRouter>
    </ApolloProvider>
  </MuiThemeProvider>, document.getElementById('root'));
