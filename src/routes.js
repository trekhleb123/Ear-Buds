import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import {
  Navbar,
} from './components'
import Rooms from './components/Rooms';
import App from './components/App';
import SingleRoom from './components/SingleRoom';

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
        <>
            <Navbar />
            <Switch>
            <Route exact path='/room/:roomId' component={SingleRoom} />
              {/* <Route exact path='/rooms' component={Rooms} /> */}
                {/* <Route exact path="/signin" component={SignIn} /> */}
            </Switch>
            </>
    )
  }
}
export default Routes
