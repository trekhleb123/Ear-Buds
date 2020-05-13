import React, { useState, useEffect } from "react";
import { setDeviceId } from "../redux/store";
import { connect } from "react-redux";
import { useDocumentData } from "react-firebase-hooks/firestore";

import LinearProgress from "@material-ui/core/LinearProgress";
import { PlayCircleFilled, PauseCircleFilled, Sync } from "@material-ui/icons";
import {
  createNewRoom,
  getRoom,
  getCurrentUserData,
  getCurrentRoomData,
  updateRoomData,
  db,
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
  const [value, loading, error] = useDocumentData(
    db.doc("Rooms/0Wi4FBK0StEXKc0zQwS9")
    // {
    //   snapshotListenOptions: { includeMetadataChanges: true },
    // }
  );
  const docId = "sdg8vb82ch";
  let deviceIdFlag = false;
  let playing = false;
  let uri = props.uri;
  let [currentPosition, setCurrentPosition] = useState(0);
  let [progress, setProgress] = useState("");
  let [nowPlaying, setNowPlaying] = useState({});
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

  const play = () => {
    // resumePlayback(props.token);
    // playing = true;
    // const foo = getRoom("room1", "6qtt6iq8wm").then((res) =>
    //   getCurrentUserData(res)
    // );
    // console.log("foo", foo);

    let roomId;
    let epInfo;

    getNowPlaying(props.token)
      .then((res) => {
        epInfo = res;
        return getRoom(docId);
      })
      .then((res) => {
        roomId = res;
        return getCurrentRoomData(res);
      })
      .then((roomData) => {
        roomData.nowPlayingProgress = epInfo.data.progress_ms;
        roomData.timestamp = epInfo.data.timestamp;
        roomData.playing = true;
        return roomData;
      })
      .then((res) => updateRoomData(res, roomId));
  };

  const pause = async () => {
    let roomId;
    let epInfo;

    getNowPlaying(props.token)
      .then((res) => {
        console.log("NOW PLAYING!!", res);
        epInfo = res;
        return getRoom(docId);
      })
      .then((res) => {
        roomId = res;
        return getCurrentRoomData(res);
      })
      .then((roomData) => {
        roomData.nowPlayingProgress = epInfo.data.progress_ms;
        roomData.timestamp = epInfo.data.timestamp || Date.now();
        roomData.playing = false;
        return roomData;
      })
      .then((res) => updateRoomData(res, roomId));
  };

  const start = () => {
    let roomId;

    getRoom(docId)
      .then((res) => {
        roomId = res;
        return getCurrentRoomData(res);
      })
      .then((roomData) => {
        roomData.nowPlayingProgress = 0;
        roomData.timestamp = Date.now();
        roomData.nowPlayingUri = uri;
        roomData.playing = true;
        uri = null;
        return roomData;
      })
      .then((res) => updateRoomData(res, roomId));
  };

  // const pauseAll = async () => {
  //   let [firstUser, secondUser] = await Promise.all(
  //     usersArr.map((user) => pausePlayback(user.token))
  //   );
  //   console.log("firstPa", firstUser);
  //   console.log("secondPa", secondUser);
  // };

  // const startAll = async () => {
  //   await Promise.all(
  //     usersArr.map((user) => startPodcastAnywhere(user.token, props.uri))
  //   );
  // };

  const progressFunc = () => {
    setCurrentPosition(progress++);
  };

  let i = 0;

  const click = () => {
    // let timer = null;
    // playing = !playing;
    // if (playing) {
    //   timer = setInterval(setCurrentPosition(currentPosition++), 300);
    // } else {
    //   clearInterval(timer);
    // }
    let roomId;
    let epInfo;

    // updateRoomData(roomData, roomId);
    // // const roomRef = db.collection("Rooms").doc(docId);
    // // roomRef.update(roomData);

    console.log("epInfo", epInfo);
  };

  // useEffect(() => {
  //   let roomId;
  //   getRoom(docId)
  //     .then((res) => {
  //       roomId = res;
  //       return getCurrentRoomData(res);
  //     })
  //     .then((roomData) => {
  //       if (roomData.playing === true) {
  //         const startTime =
  //           Date.now() - roomData.timestamp + roomData.nowPlayingProgress;
  //         console.log("Time Elapsed", startTime);
  //         console.log(roomData.timestamp);
  //         console.log(roomData.timeElapsed);
  //         console.log("time", Date.now());
  //         startPodcast(
  //           props.token,
  //           deviceId,
  //           roomData.nowPlayingUri,
  //           startTime
  //         );
  //       }
  //     });
  // }, [props.deviceId]);

  useEffect(() => {
    if (value) {
      const timeElapsed = Date.now() - value.timestamp;

      if (
        value.playing === true &&
        value.nowPlayingProgress === 0 &&
        timeElapsed < 5000
      ) {
        startPodcast(props.token, deviceId, value.nowPlayingUri, 0);
      } else if (value.playing === true && value.nowPlayingProgress !== 0) {
        console.log("IT SHOULD PLAY");
        resumePlayback(props.token);
        // setCurrentPosition(value.nowPlayingProgress)
      } else if (value.playing === false) {
        console.log("IT SHOULD PAUSE");
        pausePlayback(props.token);
      }

      console.log("value", value);
    }
  }, [value]);

  useEffect(() => {
    if (deviceId) deviceIdFlag = true;
    console.log("FLAGGED");
  }, []);

  // const tick = () => {
  //   set
  // };

  // //Triggered by timer
  // useEffect(() => {
  //   setCurrentPosition(Date.now() - this.state.start + (this.props.position || 0))
  //   setProgress(+(
  //     (currentPosition * 100) /
  //     props.track.duration_ms
  //   ).toFixed(2) + "%")
  // }, []);

  //   //Triggered by playing status

  // const progressTick = (status, width = 1) => {
  //   if (status) {
  //     var elem = document.getElementById("progress");
  //     var id = setInterval(tick, 1000);
  //     function tick() {
  //       if (width >= 100) {
  //         clearInterval(id);
  //       } else {
  //         width++;
  //         elem.style.width = width + "%";
  //       }
  //     }
  //   } else {
  //     clearInterval(id);
  //   }
  // };

  // useEffect(() => {
  //   setProgress(0)
  //   function progressFunc() {
  //     setCurrentPosition(progress++)
  //   }

  //   const timer = setInterval(progressFunc, 1000);

  //   while(currentPosition < 100) {

  //   }
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return (
    <div>
      <div className="player-container">
        <Sdk token={props.token} />
        <PauseCircleFilled onClick={pause} />
        <PlayCircleFilled onClick={play} />
        {uri && <Sync onClick={start} />}
      </div>
      <LinearProgress variant="determinate" value={currentPosition} />
      {/* <div id="progress-bar">
        <div id="progress" style={{ width: progress }}></div>
      </div> */}
      <div className="player-container">
        {/* <button onClick={pauseAll}>Pause All</button>
        <button onClick={startAll}>Start All</button> */}
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
