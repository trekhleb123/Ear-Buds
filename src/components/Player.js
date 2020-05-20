import React, { useState, useEffect, useRef } from "react";
import { setDeviceId } from "../redux/store";
import { connect } from "react-redux";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { isEqual } from "lodash";
import Volume from "./Volume";
import LinearProgress from "@material-ui/core/LinearProgress";
import { PlayCircleFilled, PauseCircleFilled, Sync } from "@material-ui/icons";
import {
  getRoom,
  getCurrentRoomData,
  updateRoomData,
  db,
  playbackUpdate,
  playbackStart,
  clearQueue,
} from "../firebase/firebase";
import {
  pausePlayback,
  startPodcast,
  resumePlayback,
  getEpisode,
  getDevices,
  transferDevice,
  seekPodcast,
} from "../api/spotifyApi";
import Sdk from "./Sdk";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import DevicesIcon from "@material-ui/icons/Devices";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Popover from "@material-ui/core/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Ticker from "./Ticker";

let counter = 0;

const Player = (props) => {
  const blank = {
    isBlank: true,
    name: "",
    show: { publisher: "" },
    duration_ms: 0,
    description: "",
    images: [
      { url: "" },
      {
        url:
          "https://www.messy.fm/static/media/podcast_placeholder.b5c814ab.png",
      },
    ],
  };
  let [selectedEp, setSelectedEp] = useState(blank);
  let [timer, setTimer] = useState(null);
  let [playingEp, setPlayingEp] = useState(blank);

  let [timeElapsed, setTimeElapsed] = useState(0);
  let [devices, setDevices] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeDevId, setActiveDevId] = useState(props.deviceId);

  // const [state, setState] = useState({
  //   timeElapsed: "",
  //   timeElapsedMs: 0,
  //   timeRemaining: "",
  //   timeRemainingMs: 0,
  // });
  const roomId = props.roomId;
  const [value, loading, error] = useDocumentData(db.doc(`Rooms/${roomId}`));

  let deviceId = props.deviceId;

  let [currentPosition, setCurrentPosition] = useState(0);
  // let [progress, setProgress] = useState("");
  // let [nowPlaying, setNowPlaying] = useState({});

  const play = () => {
    playbackUpdate(props.token, roomId, true, props.userData.display_name);
  };

  const pause = () => {
    playbackUpdate(props.token, roomId, false, props.userData.display_name);
  };

  const start = () => {
    playbackStart(roomId, props.userData.display_name);
  };

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
        const playTimeElapsed = Date.now() - value.playing.timestamp;
        const queueTimeElapsed = Date.now() - value.queued.timestamp;

        // && value.playing.uri !== playingEp.uri
        // value.playing.progress === 0 &&

        //USER QUEUES UP NEW PODCAST OR ENTERS ROOM WHILE PODCAST IS QUEUED
        if (
          value.queued.status === true &&
          value.queued.uri !== selectedEp.uri
        ) {
          console.log("time elapsed", queueTimeElapsed);
          getEpisode(value.queued.epId, props.token).then((res) =>
            setSelectedEp(res)
          );
        }

        //PROPS ARE LOADED
        //USER STARTS NEW PODCAST WHILE IN ROOM
        if (
          value.playing.status === true &&
          value.playing.uri !== playingEp.uri
        ) {
          console.log("time elapsed", playTimeElapsed);
          console.log("PLAYINGEP", playingEp);
          console.log("selected", selectedEp);
          startPodcast(
            props.token,
            activeDevId,
            value.playing.uri,
            value.playing.progress + playTimeElapsed
          )
            .then(() => setSelectedEp(blank))
            .then(() => getEpisode(value.playing.epId, props.token))
            .then((res) => setPlayingEp(res));
          // .then(() =>
          //   setTimeElapsed(value.playing.progress + playTimeElapsed)
          // );
          // .then(() => {
          //   if (!timer) {
          //     console.log("created timer", counter);
          //     counter = value.playing.progress + playTimeElapsed;
          //     setTimer(setInterval(increment, 1000));
          //   }
          // });
          //USER RESUMES PODCAST WHILE PREVIOUSLY LISTENING TO PODCAST
        } else if (
          value.playing.status === true &&
          value.playing.uri === playingEp.uri
        ) {
          resumePlayback(props.token, activeDevId);
          // .then(() =>
          //   setTimeElapsed(value.playing.progress + playTimeElapsed)
          // );
          //USER PAUSES PODCAST WHILE ALREADY LISTENING TO PODCAST
        } else if (
          value.playing.status === false &&
          value.playing.uri === playingEp.uri
        ) {
          pausePlayback(props.token, activeDevId);
          console.log("PROPPS", props);
          // .then(() =>
          //   setTimeElapsed(value.playing.progress + playTimeElapsed)
          // );
          //USER ENTERS ROOM WHILE PODCAST IS PAUSED
        } else if (
          value.playing.uri.length &&
          value.playing.status === false &&
          value.playing.uri !== playingEp.uri
        ) {
          getEpisode(value.playing.epId, props.token).then((res) => {
            res.uri = "";
            setPlayingEp(res);
          });
        }
      }
    }
  });

  const increment = () => {
    console.log("Incrementing", counter);
    counter++;
  };

  // useEffect(() => {
  //   timeElapsed = counter * 1000;
  //   console.log("TimeElapsed", timeElapsed);
  // }, [counter]);

  useEffect(() => {
    if (activeDevId.length < 10) setActiveDevId(props.deviceId);
  });

  useEffect(() => {
    if (playingEp.duration_ms) {
      setTimeElapsed((props.position * 100) / playingEp.duration_ms);
    }

    console.log("position changing", props.position);
    console.log("time changing", timeElapsed);
  }, [props.position]);

  const handleDevicePopover = (event) => {
    setAnchorEl(event.currentTarget);
    getDevices(props.token)
      .then((res) => setDevices(res))
      .then(() => console.log(devices));
  };

  const handleDeviceSelection = (id) => {
    console.log("this is the ID", activeDevId, id);
    setActiveDevId(id);
    transferDevice(props.token, id);

    // .then(() => setActiveDevId(id))
    // .then(() => resumePlayback(props.token, id))
    // .then(() => console.log("LOOK", activeDevId, id));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const msConversion = (s) => {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + ":" + mins + ":" + secs;
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
            src={selectedEp.images[1].url}
            id="on-deck-card-image"
            title="Show Artwork"
            className="card-media"
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
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <div>
                      <Button {...bindTrigger(popupState)}>
                        <VolumeUpIcon />
                      </Button>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                      >
                        <Box className="volume" autoWidth="true" p={2}>
                          <Volume />
                        </Box>
                      </Popover>
                    </div>
                  )}
                </PopupState>

                {/* <Sdk token={props.token} /> */}
                <div>
                  <PauseCircleFilled onClick={pause} />
                  <PlayCircleFilled onClick={play} />
                </div>
                <DevicesIcon onClick={handleDevicePopover} />
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  <List>
                    {devices.length > 0 &&
                      devices.map((device, ind) => {
                        return (
                          <ListItem
                            button
                            onClick={() => handleDeviceSelection(device.id)}
                            key={ind}
                          >
                            <ListItemText primary={device.name} />
                          </ListItem>
                        );
                      })}
                  </List>
                </Popover>
              </div>

              <div className="progress-container">
                <span>{props.position}</span>
                <span>{msConversion(playingEp.duration_ms)}</span>
              </div>
              <LinearProgress variant="determinate" value={timeElapsed} />

              {/* {value && value.playing.uri.length && (
                <Ticker
                  status={value.playing.status}
                  duration={playingEp.duration_ms}
                />
              )} */}
            </div>
          </div>

          <CardMedia
            component="img"
            src={playingEp.images[1].url}
            id="on-deck-card-image"
            title="Show Artwork"
            className="card-media"
          />
        </Card>
      </div>
    </div>
  );
};

const stateToProps = (state) => ({
  deviceId: state.deviceId,
  userData: state.userData,
  position: state.position,
});

const dispatchToProps = (dispatch) => ({
  setDeviceId: (code) => dispatch(setDeviceId(code)),
});

export default connect(stateToProps, dispatchToProps)(Player);
