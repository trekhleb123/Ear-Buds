import React, { Component } from "react"
import { Route, Switch } from "react-router-dom"
import Rooms from "./components/Rooms"
import App from "./components/App"
import Error from "./components/Error"
import SingleRoom from "./components/SingleRoom"

class Routes extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/home" component={Rooms} />
          <Route exact path="/error" component={Error} />
          <Route exact path="/room/:roomId" component={SingleRoom} />
        </Switch>
      </>
    )
  }
}
export default Routes
