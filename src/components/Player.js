import React, { useState, useEffect, useRef } from "react";
import { setDeviceId } from "../redux/store";
import { connect } from "react-redux";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { isEqual } from "lodash";

import LinearProgress from "@material-ui/core/LinearProgress";
import { PlayCircleFilled, PauseCircleFilled, Sync } from "@material-ui/icons";
import { db, playbackUpdate, playbackStart } from "../firebase/firebase";
import {
  pausePlayback,
  startPodcast,
  resumePlayback,
  getEpisode,
  getDevices,
  transferDevice,
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

  const msConversion = (s) => {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + ":" + mins + ":" + secs;
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

        if (
          value.playing.status === true &&
          value.playing.progress === 0 &&
          playTimeElapsed < 300
        ) {
          console.log("PLAYINGEP", playingEp);
          console.log("selected", selectedEp);
          startPodcast(props.token, activeDevId, value.playing.uri, 0)
            .then(() => {
              if (value.playing.uri !== playingEp.uri) {
                setPlayingEp(selectedEp);
                setSelectedEp(blank);
              }
            })
            .then(() => {
              setTimeElapsed(0);
            })
            .then(() => {
              // if (!timer) setTimer(setInterval(increment, 1000));
            });
        } else if (
          value.playing.status === true &&
          value.playing.progress !== 0
        ) {
          resumePlayback(props.token, activeDevId);
        } else if (value.playing.status === false) {
          pausePlayback(props.token, activeDevId);
        }
        if (value.queued.status === true && queueTimeElapsed < 500) {
          getEpisode(value.queued.epId, props.token).then((res) =>
            setSelectedEp(res)
          );
        }
        console.log("value", value);
      }
    }
  });

  let counter = 0;

  const increment = () => {
    console.log("Incrementing", counter);
    counter++;
  };

  useEffect(() => {
    timeElapsed = counter * 1000;
  }, [counter]);

  useEffect(() => {
    if (activeDevId.length < 10) setActiveDevId(props.deviceId);
  });

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
                <VolumeUpIcon />
                <Sdk token={props.token} />
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
                  <List component="nav" aria-label="secondary mailbox folders">
                    {devices.length > 1 &&
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
                <span>{msConversion(timeElapsed)}</span>
                <span>{msConversion(playingEp.duration_ms)}</span>
              </div>
              <LinearProgress variant="determinate" value={currentPosition} />
            </div>
          </div>

          <CardMedia
            component="img"
            src={playingEp.images[1].url}
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
  userData: state.userData,
});

const dispatchToProps = (dispatch) => ({
  setDeviceId: (code) => dispatch(setDeviceId(code)),
});

export default connect(stateToProps, dispatchToProps)(Player);
