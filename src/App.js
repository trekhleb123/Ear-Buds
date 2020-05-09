import React, { useState, useEffect } from "react";
import Routes from "./routes";
import "./App.css";
import {
  createNewRoom,
  getRoom,
  getCurrentRoomData,
} from "./firebase/firebase";
import { spotfityLogin, getNewToken, getMyData } from "./spotifyLogin";
import axios from "axios";
import queryString from "querystring";
import Player from "./components/Player";

const redirectUri = "http://localhost:3000";
const clientId = "101d0a7fe97d422c82d77f1db036f484";
const clientSecret = "60ecde3741104c5996693c9c6c9cc179";
const scopes =
  "user-read-currently-playing user-read-playback-state user-modify-playback-state streaming user-read-email user-read-private";
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
      {token && <Player token={token} />}

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
