import React from "react";
import { setDeviceId } from "../redux/store";
import { connect } from "react-redux";

import { PlayCircleFilled, PauseCircleFilled, Sync } from "@material-ui/icons";
import {
  createNewRoom,
  getRoom,
  getCurrentRoomData,
  getCurrentUserData,
} from "../firebase/firebase";
import {
  getNowPlaying,
  pausePlayback,
  startPodcast,
  startPodcastAnywhere,
  resumePlayback,
} from "../api/spotifyApi";
import Sdk from "./Sdk";

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
  let deviceId = props.deviceId;
  let playing = null;

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
      usersArr.map((user) => startPodcastAnywhere(user.token, props.uri))
    );
  };

  const start = () => {
    startPodcast(props.token, deviceId, props.uri);
  };

  const click = () => {
    console.log("props!!!", props);
  };

  return (
    <div>
      <div className="player-container">
        <Sdk token={props.token} />
        {/* {loadScript("https://sdk.scdn.co/spotify-player.js")}
        {handleLogin()} */}
        <PauseCircleFilled onClick={pause} />
        <PlayCircleFilled onClick={play} />
        <Sync onClick={start} />
      </div>
      <div className="player-container">
        <button onClick={pauseAll}>Pause All</button>
        <button onClick={startAll}>Start All</button>
        <button onClick={click}>test</button>
      </div>
    </div>
  );
};

const stateToProps = (state) => ({
  deviceId: state.deviceId,
});

const dispatchToProps = (dispatch) => ({
  setDeviceId: (code) => dispatch(setDeviceId(code)),
});

export default connect(stateToProps, dispatchToProps)(Player);
