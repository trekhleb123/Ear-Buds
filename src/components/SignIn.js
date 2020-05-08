import React, { Component } from 'react'
import SpotifyLogin from 'react-spotify-login';
import { client_id, redirect_uri } from '../settings';
import { Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline'
import {Paper, Button} from '@material-ui/core'


class SignIn extends Component {
    constructor(){
      super()
      this.onSuccess = this.onSuccess.bind(this)
      this.onFailure = this.onSuccess.bind(this)
    }
    onSuccess = response => console.log(response);
    onFailure = response => console.error(response);
    render()  {
        return (
          <SpotifyLogin clientId={client_id}
          redirectUri={redirect_uri}
          onSuccess={this.onSuccess}
          onFailure={this.onFailure}
          scope={'user-library-read user-library-modify user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing'}/>
        )
    }
}

export default SignIn
