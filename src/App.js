import React, { useState, useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"
import { createNewRoom, getRoom, getCurrentRoomData } from "./firebase/firebase"

import axios from "axios"
import queryString from "querystring"
import Rooms from "./Rooms";

const redirectUri = "http://localhost:3000"
<<<<<<< HEAD
const clientId = "33df8c09f715445bbe190001081175e9"
const clientSecret = "7d233a1577dc47df9ac8f81fed144945"
const scopes = ["user-read-currently-playing", "user-read-playback-state"]

=======
const clientId = "74b86e0094c34c8b9a76145e822d2e96"
const clientSecret = "7daca85fa8e14fdc9605e0f88d9c8329"
const scopes = ["user-read-playback-state","user-read-currently-playing",  "user-library-read", "user-library-modify", "user-read-email", "user-read-playback-state", "user-modify-playback-state"]
//'user-read-currently-playing user-read-playback-state user-library-read user-library-modify user-read-email user-read-playback-state user-modify-playback-state'
>>>>>>> cebe9169c19aec15c462ea6b2025dced2eedd516
function App() {
  const [token, setToken] = useState("")
  const [refreshToken, setRefreshToken] = useState()
  const [episodeUrl, setEpisodeUrl] = useState()
  const [mySpotifyData, setMySpotifyData] = useState()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code")
    if (code !== null) {
      const accessForm = queryString.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      })
      // base64 encode auth data
      const auth = btoa(`${clientId}:${clientSecret}`)
      axios
        .post("https://accounts.spotify.com/api/token", accessForm, {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            Authorization: `Basic ${auth}`,
          },
        })
        .then((res) => {
          console.log(res)
          // removes 'code' query param to clean up URL
          window.history.replaceState(null, null, window.location.pathname)
          setToken(res.data.access_token)
          setRefreshToken(res.data.refresh_token)
          console.log(token)
        })
        .catch((err) => console.log(err))
    }
  })

  const getNewToken = () => {
    const accessForm = queryString.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    })
    const auth = btoa(`${clientId}:${clientSecret}`)
    axios
      .post("https://accounts.spotify.com/api/token", accessForm, {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: `Basic ${auth}`,
        },
      })
      .then((res) => {
        console.log(res)
        setToken(res.data.access_token)
      })
  }
  setTimeout(getNewToken, 3600 * 1000)

  const getMyData = () => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => res.json())
        .catch((err) => console.log(err))
        .then((data) => setMySpotifyData(data))
    }
  }

  const getSampleData = async (token, episodeId) => {
    try {
      const episode = await axios.get(
        `https://api.spotify.com/v1/episodes/${episodeId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      console.log("EPISODE", episode)
      return episode
    } catch (err) {
      console.log(err)
    }
  }

  const buttonClick = () => {
    createNewRoom({
      name: "room11",
      password: "123",
      users: [
        { name: "Alona", accessToken: token, email: "some email" },
        { name: "Justin", accessToken: "token", email: "email" },
      ],
      currentPodcast: { apiData: "" },
    })
    getRoom("room11", "123").then((res) => getCurrentRoomData(res))
    getSampleData(token, "1oLdBqEIgphJN3O6ULyw4T")
    getMyData()
    getNewToken()
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={buttonClick}>Button</button>
        {mySpotifyData && <div>Hello, {mySpotifyData.display_name}</div>}
        <a
          href={
            "https://accounts.spotify.com/authorize?" +
            queryString.stringify({
              response_type: "code",
              client_id: clientId,
              scope: scopes,
              redirect_uri: redirectUri,
            })
          }
        >
          Login to Spotify
        </a>
      </header>
      <Rooms />
    </div>
  )
}

export default App
