import React, { useState, useEffect } from "react"
import "./App.css"
import { createNewRoom, getRoom, getCurrentRoomData } from "./firebase/firebase"
import { spotfityLogin, getNewToken, getMyData } from "./spotifyLogin"
import { getAccessToken } from "./redux/store"
import axios from "axios"
import queryString from "querystring"
import { connect } from "react-redux"
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom"

const redirectUri = "http://localhost:3000"
const clientId = "5831023fb4004d61a610f092f1e612b4"
const clientSecret = "a0174569adec4c988e845ace473ae66a"

function App(props) {
  console.log(props)
  const [token, setToken] = useState("")
  const [refreshToken, setRefreshToken] = useState()
  const [episodeUrl, setEpisodeUrl] = useState()
  const [mySpotifyData, setMySpotifyData] = useState()

  useEffect(() => {
    console.log(props)
  }, [props])

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
  const loginLinkClick = () => {
    props.getAccessToken()
    console.log(props)
  }
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
    //getMyData(token, setMySpotifyData)
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={buttonClick}>Button</button>
        {mySpotifyData && <div>Hello, {mySpotifyData.display_name}</div>}
        <button onClick={loginLinkClick}>Login to Spotify</button>
      </header>
    </div>
  )
}

const stateToProps = (state) => ({
  access_token: state.access_token,
  refresh_token: state.refresh_token,
})

const dispatchToProps = (dispatch) => ({
  getAccessToken: () => dispatch(getAccessToken()),
})

export default connect(stateToProps, dispatchToProps)(App)
