import React, { useState, useEffect, useRef } from "react";
import { setDeviceId } from "../redux/store";
import { connect } from "react-redux";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { isEqual } from "lodash";

import LinearProgress from "@material-ui/core/LinearProgress";
import { PlayCircleFilled, PauseCircleFilled, Sync } from "@material-ui/icons";
import {
  getRoom,
  getCurrentRoomData,
  updateRoomData,
  db,
  playbackUpdate,
  clearQueue,
} from "../firebase/firebase";
import {
  pausePlayback,
  startPodcast,
  resumePlayback,
  sampleEp,
} from "../api/spotifyApi";
import Sdk from "./Sdk";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";

const Player = (props) => {
  const blank = {
    name: "",
    show: { publisher: "" },
    duration_ms: 1000,
    description: "",
    imageUrl:
      "https://i.scdn.co/image/a7de7e0497e4b718a08d99e98241533f5113a3e1",
  };
  let [selectedEp, setSelectedEp] = useState(blank);
  let [playingEp, setPlayingEp] = useState(blank);
  const roomId = props.roomId;
  const [value, loading, error] = useDocumentData(
    db.doc(`Rooms/${roomId}`)
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
    setPlayingEp(selectedEp);
    setSelectedEp(blank);

    getCurrentRoomData(roomId)
      .then((roomData) => {
        roomData.nowPlayingProgress = 0;
        roomData.timestamp = Date.now();
        roomData.nowPlayingUri = roomData.queued.uri;
        roomData.playing = true;
        return roomData;
      })
      .then((res) => updateRoomData(res, roomId))
      .then(() => clearQueue(roomId));
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

  // function useDeepCompareMemoize(value) {
  //   const ref = useRef();
  //   // it can be done by using useMemo as well
  //   // but useRef is rather cleaner and easier

  //   if (!deepCompareEquals(value, ref.current)) {
  //     ref.current = value;
  //   }

  //   return ref.current;
  // }

  // function useDeepCompareEffect(callback, dependencies) {
  //   useEffect(function checkVal() {
  //     if (value) {
  //       const timeElapsed = Date.now() - value.timestamp;
  //       const queueTimeElapsed = Date.now() - value.queued.timestamp;
  //       const queue = value.queued;

  //       if (
  //         value.playing === true &&
  //         value.nowPlayingProgress === 0 &&
  //         timeElapsed < 5000
  //       ) {
  //         startPodcast(props.token, deviceId, value.nowPlayingUri, 0);
  //       } else if (value.playing === true && value.nowPlayingProgress !== 0) {
  //         resumePlayback(props.token);
  //       } else if (
  //         value.playing === false &&
  //         timeElapsed > 500 &&
  //         queueTimeElapsed > 500
  //       ) {
  //         pausePlayback(props.token);
  //       }

  //       if (value.queued.status === true) {
  //         setSelectedEp(queue);
  //       }

  //       console.log("value", value);
  //     }
  //   }, useDeepCompareMemoize(value))
  // }

  const usePrevious = (val) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = val;
    });
    return ref.current;
  };

  const previousValue = usePrevious(value);

  useEffect(() => {
    if (!isEqual(value, previousValue)) {
      if (value) {
        const timeElapsed = Date.now() - value.timestamp;
        const queueTimeElapsed = Date.now() - value.queued.timestamp;
        const queue = value.queued;

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

        if (value.queued.status === true) {
          setSelectedEp(queue);
        }

        console.log("value", value);
      }
    }
  });

  // useEffect(
  //   function checkVal() {
  //     if (value) {
  //       const timeElapsed = Date.now() - value.timestamp;
  //       const queueTimeElapsed = Date.now() - value.queued.timestamp;
  //       const queue = value.queued;

  //       if (
  //         value.playing === true &&
  //         value.nowPlayingProgress === 0 &&
  //         timeElapsed < 5000
  //       ) {
  //         startPodcast(props.token, deviceId, value.nowPlayingUri, 0);
  //       } else if (value.playing === true && value.nowPlayingProgress !== 0) {
  //         resumePlayback(props.token);
  //       } else if (
  //         value.playing === false
  //       ) {
  //         pausePlayback(props.token);
  //       }

  //       if (value.queued.status === true) {
  //         setSelectedEp(queue);
  //       }

  //       console.log("value", value);
  //     }
  //   },
  //   [value]
  // );

  // useEffect(() => {
  //   changeQueue(roomId, props.episode);
  //   console.log("CHANGED QUEUE");
  // }, [props.episode]);

  return (
    <div>
      <div className="podcast-info-container">
        <Card className="on-deck-card">
          <div className="on-deck-card-content">
            <div className="on-deck-card-details">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  On Deck
                </Typography>
                <Typography variant="h5" component="h2">
                  {selectedEp.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {selectedEp.show.publisher}
                </Typography>
              </CardContent>
            </div>
            <div className="on-deck-card-description">
              <Typography variant="body2" component="p">
                {selectedEp.description}
              </Typography>
            </div>
            <div className="player-container">
              {selectedEp.uri && <Sync onClick={start} />}
            </div>
          </div>

          <CardMedia
            component="img"
            src={selectedEp.imageUrl}
            id="on-deck-card-image"
            title="Show Artwork"
          />
        </Card>
      </div>
      <div className="podcast-info-container">
        <Card className="on-deck-card">
          <div className="on-deck-card-content">
            <div className="on-deck-card-details">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Now Playing
                </Typography>
                <Typography variant="h5" component="h2">
                  {playingEp.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {playingEp.show.publisher}
                </Typography>
              </CardContent>
            </div>
            <div className="on-deck-card-description">
              <div className="player-container">
                <Sdk token={props.token} />
                <PauseCircleFilled onClick={pause} />
                <PlayCircleFilled onClick={play} />
              </div>
              <LinearProgress variant="determinate" value={currentPosition} />
            </div>
          </div>

          <CardMedia
            component="img"
            src={playingEp.imageUrl}
            id="on-deck-card-image"
            title="Show Artwork"
          />
        </Card>
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
