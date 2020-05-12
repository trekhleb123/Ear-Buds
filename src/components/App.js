import React, { useState, useEffect } from "react"
import Routes from "../routes"
import SearchBar from "./SearchBar"
import "./App.css"
import { spotifyLogin } from "../spotifyLogin"
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store"
import { connect } from "react-redux"
import Rooms from "./Rooms"
function App(props) {
  //console.log(props)
  useEffect(() => {
    if (!props.code) {
      console.log("no props.code --> need to set")
      let code = new URLSearchParams(window.location.search).get("code")
      if (code) {
        console.log("SPOTIFY CODE FROM URL", code)
        props.setSpotifyCode(code)
        props.getAccessToken(code)
      }
    }
    console.log("inside useEffect", props)
  }, [])

  return (
    <div className="App">
      <Routes />
      <Rooms />
      <SearchBar token={props.access_token} />
      <header className="App-header">
        <button onClick={() => spotifyLogin(props.code)}>
          Login to Spotify
        </button>
        {/* {props.access_token && <Player token={props.access_token} />} */}
      </header>
    </div>
  )
}

const stateToProps = (state) => ({
  code: state.code,
  access_token: state.access_token,
  refresh_token: state.refresh_token,
  userData: state.userData,
})

const dispatchToProps = (dispatch) => ({
  getAccessToken: (code) => dispatch(getAccessToken(code)),
  setSpotifyCode: (code) => dispatch(setSpotifyCode(code)),
  getUserData: (token) => dispatch(getUserData(token)),
})

export default connect(stateToProps, dispatchToProps)(App)
