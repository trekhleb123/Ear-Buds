import React, { useState, useEffect, useRef } from "react";
import { setDeviceId } from "../redux/store";
import { connect } from "react-redux";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { isEqual } from "lodash";
import Volume from "./Volume";
import LinearProgress from "@material-ui/core/LinearProgress";
import { PlayCircleFilled, PauseCircleFilled } from "@material-ui/icons";
import { db, playbackUpdate, playbackStart } from "../firebase/firebase";
import {
  pausePlayback,
  startPodcast,
  resumePlayback,
  getEpisode,
  getDevices,
  transferDevice,
  subscribe,
  checkSubscription,
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
import ListItemText from "@material-ui/core/ListItemText";
import Popover from "@material-ui/core/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Ticker from "./Ticker";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import OverflowTip from "./OverflowTip";

let counter = 0;

const Player = (props) => {
  const blank = {
    isBlank: true,
    uri: null,
    name: "",
    show: { publisher: "", id: 0 },
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
  let [playingEp, setPlayingEp] = useState(blank);
  let [playingStatus, setPlayingStatus] = useState(false);
  let [subStatus, setSubStatus] = useState(true);

  let [timeElapsed, setTimeElapsed] = useState(0);
  let [devices, setDevices] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeDevId, setActiveDevId] = useState(props.deviceId);
  const roomId = props.roomId;
  const [value, loading, error] = useDocumentData(db.doc(`Rooms/${roomId}`));

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

        //USER QUEUES UP NEW PODCAST OR ENTERS ROOM WHILE PODCAST IS QUEUED
        if (
          value.queued.status === true &&
          value.queued.uri !== selectedEp.uri
        ) {
          getEpisode(value.queued.epId, props.token).then((res) =>
            setSelectedEp(res)
          );
        }

        //USER STARTS NEW PODCAST WHILE IN ROOM
        if (
          value.playing.status === true &&
          value.playing.uri !== playingEp.uri
        ) {
          startPodcast(
            props.token,
            activeDevId,
            value.playing.uri,
            value.playing.progress + playTimeElapsed
          )
            .then(() => setSelectedEp(blank))
            .then(() => getEpisode(value.playing.epId, props.token))
            .then((res) => setPlayingEp(res))
            .then(() => setPlayingStatus(true))
            .then(() => checkSubscription(props.token, value.playing.showId))
            .then((res) => setSubStatus(res));

          //USER RESUMES PODCAST WHILE PREVIOUSLY LISTENING TO PODCAST
        } else if (
          value.playing.status === true &&
          value.playing.uri === playingEp.uri
        ) {
          resumePlayback(props.token, activeDevId).then(() =>
            setPlayingStatus(true)
          );

          //USER PAUSES PODCAST WHILE ALREADY LISTENING TO PODCAST
        } else if (
          value.playing.status === false &&
          value.playing.uri === playingEp.uri
        ) {
          pausePlayback(props.token, activeDevId).then(() =>
            setPlayingStatus(false)
          );

          //USER ENTERS ROOM WHILE PODCAST IS PAUSED
        } else if (
          value.playing.uri.length &&
          value.playing.status === false &&
          value.playing.uri !== playingEp.uri
        ) {
          getEpisode(value.playing.epId, props.token)
            .then((res) => {
              res.uri = "";
              setPlayingEp(res);
            })
            .then(() => checkSubscription(props.token, value.playing.showId))
            .then((res) => setSubStatus(res));
        }
      }
    }
  });

  useEffect(() => {
    if (value) {
      setTimeElapsed(value.playing.progress + props.position);
    }
  }, [props.position]);

  useEffect(() => {
    if (activeDevId.length < 10) setActiveDevId(props.deviceId);
  });

  const handleDevicePopover = (event) => {
    setAnchorEl(event.currentTarget);
    getDevices(props.token).then((res) => setDevices(res));
  };

  const handleDeviceSelection = (id) => {
    setActiveDevId(id);
    transferDevice(props.token, id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const msConversion = (s) => {
    const intCheck = (num) => {
      return (num < 10 ? "0" : "") + num;
    };
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + ":" + intCheck(mins) + ":" + intCheck(secs);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="podcast-info-container">
      <div>
        <Card className="on-deck-card">
          <div className="on-deck-card-details">
            <div className="card-label">
              <Typography color="textSecondary">On Deck {"   "}</Typography>
              {selectedEp.description && (
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <>
                      <Tooltip title="Episode Info">
                        <IconButton
                          style={{
                            padding: "0px 5px 0px 5px",
                          }}
                          {...bindTrigger(popupState)}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "center",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <div className="on-deck-card-description">
                          <Typography variant="body2" component="p">
                            {selectedEp.description}
                          </Typography>
                        </div>
                      </Popover>
                    </>
                  )}
                </PopupState>
              )}
            </div>

            <div className="on-deck-card-content">
              <CardContent id="card">
                {selectedEp.name && (
                  <OverflowTip>
                    <Typography variant="subtitle1">
                      {selectedEp.name}
                    </Typography>
                  </OverflowTip>
                )}

                <Typography variant="subtitle2" color="textSecondary">
                  {selectedEp.show.publisher}
                </Typography>
              </CardContent>
            </div>
            {selectedEp.uri && (
              <div className="on-deck-button-container">
                <Tooltip title="Start Listening">
                  <Button size="small" variant="outlined" onClick={start}>
                    Start
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
          <div className="card-image-container">
            <CardMedia
              component="img"
              src={selectedEp.images[1].url}
              id="card-image"
              title="Show Artwork"
              className="card-media"
            />
          </div>
        </Card>
      </div>
      <div>
        <Card className="on-deck-card">
          <div className="on-deck-card-details">
            <div className="card-label">
              <Typography color="textSecondary">Now Playing</Typography>
            </div>
            <div className="on-deck-card-content">
              <CardContent id="card">
                {playingEp.name && (
                  <OverflowTip>
                    <Typography variant="subtitle1">
                      {playingEp.name}
                    </Typography>
                  </OverflowTip>
                )}
                <Typography variant="subtitle2" color="textSecondary">
                  {playingEp.show.publisher}
                </Typography>
              </CardContent>
            </div>

            {playingEp.uri && !subStatus && (
              <div className="on-deck-button-container">
                <Tooltip title="Subscribe to Show">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      subscribe(props.token, value.playing.showId);
                    }}
                    size="small"
                  >
                    Subscribe
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
          <div className="card-image-container">
            <CardMedia
              component="img"
              src={playingEp.images[1].url}
              id="card-image"
              title="Show Artwork"
              className="card-media"
            />
          </div>
        </Card>
      </div>
      <Card>
        <div className="player-container">
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <Tooltip title="Volume">
                  <IconButton {...bindTrigger(popupState)}>
                    <VolumeUpIcon />
                  </IconButton>
                </Tooltip>
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
          <div>
            {playingEp.uri &&
              (playingStatus ? (
                <Tooltip title="Pause">
                  <IconButton onClick={pause}>
                    <PauseCircleFilled />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Play">
                  <IconButton onClick={play}>
                    <PlayCircleFilled />
                  </IconButton>
                </Tooltip>
              ))}
          </div>
          <Tooltip title="Devices Available">
            <IconButton onClick={handleDevicePopover}>
              <DevicesIcon />
            </IconButton>
          </Tooltip>

          <Popover
            fontSize="large"
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
          <span>{msConversion(timeElapsed)}</span>
          <span>{msConversion(playingEp.duration_ms)}</span>
        </div>
        <LinearProgress
          variant="determinate"
          value={(timeElapsed * 100) / playingEp.duration_ms}
        />

        {value && value.playing.status && <Ticker />}
      </Card>
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
