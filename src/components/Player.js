import React, { useState, useEffect } from "react";
import { setDeviceId } from "../redux/store";
import { connect } from "react-redux";
import { useDocumentData } from "react-firebase-hooks/firestore";

import LinearProgress from "@material-ui/core/LinearProgress";
import { PlayCircleFilled, PauseCircleFilled, Sync } from "@material-ui/icons";
import {
  getRoom,
  getCurrentRoomData,
  updateRoomData,
  db,
  playbackUpdate,
} from "../firebase/firebase";
import { pausePlayback, startPodcast, resumePlayback } from "../api/spotifyApi";
import Sdk from "./Sdk";

const Player = (props) => {
  const roomId = props.match.params.roomId;
  const docId = props.docId;
  const [value, loading, error] = useDocumentData(
    db.doc(`Rooms/${docId}`)
    // {
    //   snapshotListenOptions: { includeMetadataChanges: true },
    // }
  );
  let deviceIdFlag = false;
  let deviceId = props.deviceId;
  let uri = props.uri;
  let [currentPosition, setCurrentPosition] = useState(0);
  // let [progress, setProgress] = useState("");
  // let [nowPlaying, setNowPlaying] = useState({});

  const play = () => {
    playbackUpdate(props.token, roomId, true);
  };

  const pause = () => {
    playbackUpdate(props.token, roomId, false);
  };

  const start = () => {
    let roomId;

    getRoom(roomId)
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

  // const click = () => {

  // };

  // useEffect(() => {
  //   let roomId;
  //   getRoom(roomId)
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
        resumePlayback(props.token);
      } else if (value.playing === false) {
        pausePlayback(props.token);
      }

      console.log("value", value);
    }
  }, [value]);

  useEffect(() => {
    if (deviceId) deviceIdFlag = true;
    console.log("FLAGGED");
  }, []);

  return (
    <div>
      <div className="player-container">
        <Sdk token={props.token} />
        <PauseCircleFilled onClick={pause} />
        <PlayCircleFilled onClick={play} />
        {uri && <Sync onClick={start} />}
      </div>
      <LinearProgress variant="determinate" value={currentPosition} />
      <div className="player-container">
        {/* <button onClick={click}>test</button> */}
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

// let timer = null;
// playing = !playing;
// if (playing) {
//   timer = setInterval(setCurrentPosition(currentPosition++), 300);
// } else {
//   clearInterval(timer);
// }
