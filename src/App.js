import React, { useState, useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"
import { createNewRoom, getRoom, getCurrentRoomData } from "./firebase/firebase"
//import SpotifyLogin from "react-spotify-login"
import axios from "axios"
import queryString from "querystring"

const redirectUri = "http://localhost:3000"
const clientId = "5831023fb4004d61a610f092f1e612b4"
const clientSecret = "a0174569adec4c988e845ace473ae66a"
const scopes = ["user-read-currently-playing", "user-read-playback-state"]

function App() {
  const [token, setToken] = useState("")
  const [episodeUrl, setEpisodeUrl] = useState()

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
          console.log(token)
        })
        .catch((err) => console.log(err))
    }
  })

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
        { name: "Alona", accessTocken: token, email: "some email" },
        { name: "Justin", accessTocken: "token", email: "email" },
      ],
      currentPodcast: { apiData: "" },
    })
    getRoom("room11", "123").then((res) => getCurrentRoomData(res))
    getSampleData(token, "1oLdBqEIgphJN3O6ULyw4T")
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={buttonClick}>Button</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
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
    </div>
  )
}

export default App
