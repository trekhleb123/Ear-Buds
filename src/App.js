import React, { useState, useEffect } from "react";
import Routes from "./routes";
import SearchBar from "./components/SearchBar";
import "./App.css";
import {
  createNewRoom,
  getRoom,
  getCurrentRoomData,
} from "./firebase/firebase";
import { spotfityLogin, getNewToken, getMyData } from "./spotifyLogin";
import axios from "axios";
import queryString from "querystring";
import SearchBar2 from "./components/SearchBar2";

const redirectUri = "http://localhost:3000";
const clientId = "74b86e0094c34c8b9a76145e822d2e96";
const clientSecret = "7daca85fa8e14fdc9605e0f88d9c8329";
const scopes = [
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-library-read",
  "user-library-modify",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
];
//'user-read-currently-playing user-read-playback-state user-library-read user-library-modify user-read-email user-read-playback-state user-modify-playback-state'
function App() {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState();
  const [episodeUrl, setEpisodeUrl] = useState();
  const [mySpotifyData, setMySpotifyData] = useState();

  useEffect(() => {
    spotfityLogin(setToken, setRefreshToken);
  }, []);

  const getSampleData = async (token, episodeId) => {
    try {
      const episode = await axios.get(
        `https://api.spotify.com/v1/episodes/${episodeId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("EPISODE", episode);
      setEpisodeUrl(episode);
    } catch (err) {
      console.log(err);
    }
  };

  const buttonClick = () => {
    if (mySpotifyData && token) {
      console.log("sending data");
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
      });
    }

    getRoom("room11", "123").then((res) => getCurrentRoomData(res));
    getSampleData(token, "1oLdBqEIgphJN3O6ULyw4T");
    //getMyData(token, setMySpotifyData)
  };

  return (
    <div className="App">
      <Routes />
      <SearchBar token={token} />
      <SearchBar2 token={token} />
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
    </div>
  );
}

export default App;
