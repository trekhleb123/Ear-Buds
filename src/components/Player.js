import React from "react";
import axios from "axios";
import { PlayCircleFilled, PauseCircleFilled, Sync } from "@material-ui/icons";
import {
  createNewRoom,
  getRoom,
  getCurrentRoomData,
  getCurrentUserData,
} from "../firebase/firebase";

const Player = (props) => {
  let usersArr = [
    { name: "Michael", token: props.token },
    {
      name: "Sam",
      token:
        "BQBUsxLv0fjLNRYoz-utiuF2FG04_2srMZUxpFyLB6clqQwxR3YmFeYdmczlnj6ZD3tsYvr0R9pTNirLrDzI4pBB71-U9vkF5aYJExZXRevpqY9m5whQkYqkVEvAzxQW7bEDGP8v-kDxc3-r-ByXfofQb1MfOSMD1_QB69mUYllN",
    },
  ];
  let player = "";
  let deviceId = null;
  let checkInterval = null;
  let playing = null;
  const getNowPlaying = async (token) => {
    try {
      const episode = await axios.get(
        `https://api.spotify.com/v1/me/player/currently-playing`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Now Playing", episode);
      return episode;
    } catch (err) {
      console.log(err);
    }
  };

  const pausePlayback = async (token) => {
    try {
      fetch(`https://api.spotify.com/v1/me/player/pause`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log("timeStamp", Date.now());
    } catch (err) {
      console.log(err);
    }
  };

  const startPodcast = async (token, devId, podcastUri) => {
    try {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${devId}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          uris: [podcastUri],
          position_ms: 0,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const startPodcastAnywhere = async (token, podcastUri) => {
    try {
      fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          uris: [podcastUri],
          position_ms: 0,
        }),
      });
      console.log("timeStamp", Date.now());
    } catch (err) {
      console.log(err);
    }
  };

  const resumePlayback = async (token) => {
    try {
      fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
        // body: JSON.stringify({
        //   uris: [`spotify:track:${action.track.id}`],
        // }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const play = () => {
    resumePlayback(props.token);
    playing = true;
    getRoom("room1", "420").then((res) => getCurrentUserData(res));
  };

  const pause = () => {
    getNowPlaying(props.token);
    pausePlayback(props.token);
    playing = false;
  };

  const pauseAll = async () => {
    let [firstUser, secondUser] = await Promise.all(
      usersArr.map((user) => pausePlayback(user.token))
    );
    console.log("firstPa", firstUser);
    console.log("secondPa", secondUser);
  };

  const startAll = async () => {
    let [firstUser, secondUser] = await Promise.all(
      usersArr.map((user) =>
        startPodcastAnywhere(
          user.token,
          "spotify:episode:1oLdBqEIgphJN3O6ULyw4T"
        )
      )
    );
    console.log("firstPl", firstUser);
    console.log("secondPl", secondUser);
  };

  const start = () => {
    startPodcast(
      props.token,
      deviceId,
      "spotify:episode:1oLdBqEIgphJN3O6ULyw4T"
    );
  };

  const loadScript = function (src) {
    var tag = document.createElement("script");
    tag.async = false;
    tag.src = src;
    document.querySelector("body").appendChild(tag);
  };

  const checkForPlayer = () => {
    if (window.Spotify !== null) {
      clearInterval(checkInterval);
      player = new window.Spotify.Player({
        name: "earBudz",
        getOAuthToken: (cb) => {
          cb(props.token);
        },
      });
      createEventHandlers();

      // finally, connect!
      player.connect();
    }
  };

  const handleLogin = () => {
    if (props.token) {
      // check every second for the player.
      checkInterval = setInterval(() => checkForPlayer(), 1000);
    }
  };

  const createEventHandlers = () => {
    player.on("initialization_error", (e) => {
      console.error(e);
    });
    player.on("authentication_error", (e) => {
      console.error(e);
      // this.setState({ loggedIn: false });
    });
    player.on("account_error", (e) => {
      console.error(e);
    });
    player.on("playback_error", (e) => {
      console.error(e);
    });

    // Playback status updates
    player.on("player_state_changed", (state) => {
      console.log(state);
    });

    // Ready
    player.on("ready", (data) => {
      let { device_id } = data;
      console.log("Ready with Device ID", device_id);
      deviceId = device_id;
    });
  };

  return (
    <div>
      {loadScript("https://sdk.scdn.co/spotify-player.js")}
      {handleLogin()}
      <div>
        <PauseCircleFilled onClick={pause} />
        <PlayCircleFilled onClick={play} />
        <Sync onClick={start} />
        <button onClick={pauseAll}>Pause All</button>
        <button onClick={startAll}>Start All</button>
      </div>
    </div>
  );
};

export default Player;
