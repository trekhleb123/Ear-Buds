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
      name: "Shreya",
      token:
        "BQCL7a4_pdhumPfxBnrTp4VJiKlcs164P6fwTHE1IrFR6dRU5ULVOpk3RQ7PXh-BxZPQwQ8HePaPW-TAaI_2wCsC9ue4BRXeH12sBCES2xMNifDtbMZP2TUXG9fHSimM4XPTHY0Wavko7VnJfkRdLN7m0YNH06FXN4pXgM_jjg8",
    },
    {
      name: "Priti",
      token:
        "BQCmvlu88MubPtURsdGkXCn219fQJTSG8vXvgQuIXH2kshgA2dMg8dz58SHc8fsTIkf8KqSTv-l8HzYFV8ezWYKTsDCgRWLj4iPreJh7FPG4F_ZyPmZfV5UliU4rCcGJWvcdqDlKmXTnSgEwQhUZLPa3a6kgPm-03kAhA0US",
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
    const foo = getRoom("room1", "6qtt6iq8wm").then((res) =>
      getCurrentUserData(res)
    );
    console.log("foo", foo);
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
    await Promise.all(
      usersArr.map((user) =>
        startPodcastAnywhere(
          user.token,
          props.uri
        )
      )
    );
  };

  const start = () => {
    startPodcast(
      props.token,
      deviceId,
      props.uri
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

  const click = () => {
    console.log("token props", props.token);
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
        <button onClick={click}>test</button>
      </div>
    </div>
  );
};

export default Player;
