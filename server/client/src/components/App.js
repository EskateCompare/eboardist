import React from 'react';
import { connect } from 'react-redux';
import {  Route, Switch, Redirect } from 'react-router-dom';
import CompareProducts from './Containers/CompareProducts';
import Product from './Containers/Product';
import Home from './Home';
import GlobalHeader from './Globals/GlobalHeader';
import GlobalFooter from './Globals/GlobalFooter';
import About from './Home/About';
import Contact from './Home/About';

import { resetRedirect } from '../actions/Main';

const navRoutes = [
  {
    path: '/compare',
    component: CompareProducts
  },
  {
    path: '/compare/:query',
    component: CompareProducts
  },
  {
    path: '/product/:slug',
    component: Product
  },
  {
    path: '/about',
    component: About
  },
    {
    path: '/contact',
    component: Contact
  },
]

const mapStateToProps = state => ({
  ...state.Main,
  ...state.User,
})

const mapDispatchToProps = dispatch => ({
  resetRedirect: () => dispatch(resetRedirect())
})

class App extends React.Component {
  componentDidMount() {
    // console.log(this.props, 'appstart')
    localStorage.clear();
    // console.log(localStorage);
  }

  render() {
    if (this.props.redirectTo != null) {
      this.props.resetRedirect();
      return ( <Redirect to={this.props.redirectTo} push={false} /> );
    }
    return (
      <div style={{background: '#fafafa'}}>
        <Route path={[...navRoutes.map(route => route.path)]} component={GlobalHeader} />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/compare' component={CompareProducts} />
          <Route exact path='/compare/:query' component={CompareProducts} />
          <Route exact path='/product/:slug' component={Product} />
          <Route exact path='/about' component={About} />
          <Route exact path='/contact' component={Contact} />
        </Switch>
        <GlobalFooter />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
