import React, { useState, useEffect } from "react"
import Routes from './routes'
import "./App.css"
import { createNewRoom, getRoom, getCurrentRoomData } from "./firebase/firebase"
import { spotifyLogin, getNewToken, getMyData } from "./spotifyLogin"
import { getAccessToken, setSpotifyCode, getUserData } from "./redux/store"
import axios from "axios"
import queryString from "querystring"
import { connect } from "react-redux"
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom"

const redirectUri = "http://localhost:3000"
<<<<<<< HEAD
const clientId = "74b86e0094c34c8b9a76145e822d2e96"
const clientSecret = "7daca85fa8e14fdc9605e0f88d9c8329"
const scopes = ["user-read-playback-state","user-read-currently-playing",  "user-library-read", "user-library-modify", "user-read-email", "user-read-playback-state", "user-modify-playback-state"]
//'user-read-currently-playing user-read-playback-state user-library-read user-library-modify user-read-email user-read-playback-state user-modify-playback-state'
function App() {
=======
const clientId = "5831023fb4004d61a610f092f1e612b4"
const clientSecret = "a0174569adec4c988e845ace473ae66a"

function App(props) {
  console.log(props)
>>>>>>> 20b06588c79e9e0bc9a2f6aa12b50e6ac8a9c267
  const [token, setToken] = useState("")
  const [refreshToken, setRefreshToken] = useState()
  const [episodeUrl, setEpisodeUrl] = useState()
  const [mySpotifyData, setMySpotifyData] = useState()

  useEffect(() => {
    if(!props.code) {
      console.log('no props.code --> need to set')
      let code = new URLSearchParams(window.location.search).get("code")
      if(code) {
        console.log('SPOTIFY CODE FROM URL', code)
        props.setSpotifyCode(code)
        props.getAccessToken(code)
      }
    }
    console.log('inside useEffect', props)
  }, [])

  // const getSampleData = async (token, episodeId) => {
  //   try {
  //     const episode = await axios.get(
  //       `https://api.spotify.com/v1/episodes/${episodeId}`,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     )
  //     console.log("EPISODE", episode)
  //     setEpisodeUrl(episode)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  const buttonClick = () => {
    if (mySpotifyData && token) {
      console.log("sending data")
      createNewRoom({
        name: "room11",
        password: "123",
        users: [
          {
            name: mySpotifyData.display_name,
            accessToken: token,
            refreshToken: refreshToken,
          },
          { name: "Justin", accessToken: "token" },
        ],
        currentPodcast: { apiData: "" },
      })
    }

    getRoom("room11", "123").then((res) => getCurrentRoomData(res))
    //getSampleData(token, "1oLdBqEIgphJN3O6ULyw4T")
    props.getUserData(props.access_token)
  }

  return (
    <div className="App">
      <Routes />
      <header className="App-header">
        <button onClick={buttonClick}>Button</button>
        {mySpotifyData && <div>Hello, {mySpotifyData.display_name}</div>}
        <button onClick={() => spotifyLogin(props.code)}>Login to Spotify</button>
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
