import React from "react";
import axios from "axios";
import Spotify from "react-spotify-player";

const Player = (props) => {
  let player = "";
  let deviceId = null;
  let checkInterval = null;
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
  };

  const pause = () => {
    getNowPlaying(props.token);
    pausePlayback(props.token);
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
      this.setState({ loggedIn: false });
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
        <button onClick={play}>Play</button>
        <button onClick={pause}>Pause</button>
        <button onClick={start}>Start</button>
      </div>
      )
    </div>
  );
};

export default Player;
