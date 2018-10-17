import App from './components/App';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import store from './store';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import createHistory from 'history/createBrowserHistory';
const history = createHistory();

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route component={App} />
    </Router>
  </Provider>
), document.getElementById('root'));
