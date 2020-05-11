import React, {Component} from 'react'
import { BrowserRouter, Route, Switch} from 'react-router-dom'

import {
 Navbar,
 SignIn
} from './components'
import Rooms from './components/Rooms';
import App from './components/App';

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
        <BrowserRouter>
            <Navbar />
            <Switch>
            <Route exact path='/' Component={App} />
              <Route path='/rooms' Component={Rooms} />
                <Route path="/signin" component={SignIn} />
            </Switch>
            </BrowserRouter>
    )
  }
}
export default Routes
