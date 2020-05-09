import React, {Component} from 'react'
import { BrowserRouter, Route, Switch} from 'react-router-dom'

import {
 Navbar,
 SignIn,
 Player
} from './components'

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
        <BrowserRouter>
            <Navbar />
            <Switch>
                <Route path="/signin" component={SignIn} />
                <Route path="/player" component={Player} />
            </Switch>
            </BrowserRouter>
    )
  }
}
export default Routes
