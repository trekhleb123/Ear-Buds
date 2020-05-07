import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar'

import SignIn from './components/SignIn'



function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
          <Switch>
          {/* <Route exact path="/" component={} /> */}
            <Route path="/signin" component={SignIn} />
          </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
