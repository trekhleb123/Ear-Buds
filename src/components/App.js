import React, { useEffect } from "react"
import Routes from "../routes"
import SearchBar from "./SearchBar"
import "./App.css"
import { spotifyLogin } from "../spotifyLogin"
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store"
import { connect } from "react-redux"
import Rooms from "./Rooms"

function App(props) {
  useEffect(() => {
    if (!props.code) {
      let code = new URLSearchParams(window.location.search).get("code")
      if (code) {
        props.setSpotifyCode(code)
        props.getAccessToken(code)
      }
    }
  }, [])

  useEffect(() => {
    if (props.access_token) {
      props.getUserData(props.access_token)
    }
  }, [props.access_token])

  useEffect(() => {
    if (!!props.userData.display_name) {
      props.history.push(`/home`)
    }
  }, [props])

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => spotifyLogin(props.code)}>
          Login to Spotify
        </button>
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
