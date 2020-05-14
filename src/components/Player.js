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
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cover: {
    height: 151,
  },
});

const Player = (props) => {
  const classes = useStyles();
  const selectedEp = {
    audio_preview_url:
      "https://p.scdn.co/mp3-preview/566fcc94708f39bcddc09e4ce84a8e5db8f07d4d",
    description:
      "En ny tysk bok granskar för första gången Tredje rikets drogberoende, från Führerns knarkande till hans soldater på speed. Och kändisförfattaren Antony Beevor får nu kritik av en svensk kollega.  Hitler var beroende av sin livläkare, som gav honom mängder av narkotiska preparat, och blitzkrigssoldaterna knaprade 35 miljoner speedtabletter under invasionen av Frankrike 1940. I den nyutkomna boken Der Totale Rausch, Det totala ruset, ger författaren Norman Ohler för första gången en samlad bild av knarkandet i Tredje riket. Mycket tyder på att Hitler var gravt drogpåverkad under flera avgörande beslut under kriget, säger han, och får medhåll av medicinhistorikern Peter Steinkamp som undersökt de tyska soldaternas intensiva användande av pervitin, en variant av crystal meth.Dessutom får nu den kände militärhistoriska författaren Antony Beevor kritik för att hans senaste bok om Ardenneroffensiven lutar sig alltför tungt mot amerikanska källor, och dessutom innehåller många felaktiga detaljer. Det menar författarkollegan Christer Bergström, som själv skrivit en bok om striderna i Ardennerna.Programledare är Tobias Svanelid.",
    duration_ms: 1502795,
    explicit: false,
    external_urls: {
      spotify: "https://open.spotify.com/episode/512ojhOuo1ktJprKbVcKyQ",
    },
    href: "https://api.spotify.com/v1/episodes/512ojhOuo1ktJprKbVcKyQ",
    id: "512ojhOuo1ktJprKbVcKyQ",
    images: [
      {
        height: 640,
        url: "https://i.scdn.co/image/6bcff849a483dd3c2883b3f0272848b909f1bbce",
        width: 640,
      },
      {
        height: 300,
        url: "https://i.scdn.co/image/66250bd121ee949ed5026decbfd97e255b25a5c8",
        width: 300,
      },
      {
        height: 64,
        url: "https://i.scdn.co/image/e29c75799cad73927fad713011edad574868d8da",
        width: 64,
      },
    ],
    is_externally_hosted: false,
    is_playable: true,
    language: "sv",
    languages: ["sv"],
    name: "Tredje rikets knarkande granskas",
    release_date: "2015-10-01",
    release_date_precision: "day",
    show: {
      copyrights: [],
      description: "Vi är där historien är. Ansvarig utgivare: Nina Glans",
      explicit: false,
      external_urls: {
        spotify: "https://open.spotify.com/show/38bS44xjbVVZ3No3ByF1dJ",
      },
      href: "https://api.spotify.com/v1/shows/38bS44xjbVVZ3No3ByF1dJ",
      id: "38bS44xjbVVZ3No3ByF1dJ",
      images: [
        {
          height: 640,
          url:
            "https://i.scdn.co/image/3c59a8b611000c8b10c8013013c3783dfb87a3bc",
          width: 640,
        },
        {
          height: 300,
          url:
            "https://i.scdn.co/image/2d70c06ac70d8c6144c94cabf7f4abcf85c4b7e4",
          width: 300,
        },
        {
          height: 64,
          url:
            "https://i.scdn.co/image/3dc007829bc0663c24089e46743a9f4ae15e65f8",
          width: 64,
        },
      ],
      is_externally_hosted: false,
      languages: ["sv"],
      media_type: "audio",
      name: "Vetenskapsradion Historia",
      publisher: "Sveriges Radio",
      type: "show",
      uri: "spotify:show:38bS44xjbVVZ3No3ByF1dJ",
    },
    type: "episode",
    uri: "spotify:episode:512ojhOuo1ktJprKbVcKyQ",
  };
  const roomId = props.roomId;
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
      <div className="podcast-info-container">
        <Card className={classes.root}>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              On Deck
            </Typography>
            <Typography variant="h5" component="h2">
              {selectedEp.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {selectedEp.show.publisher}
            </Typography>
            <CardMedia
              className={classes.cover}
              src="https://i.scdn.co/image/6bcff849a483dd3c2883b3f0272848b909f1bbce"
              title="Show Artwork"
            />
            <Typography variant="body2" component="p">
              {selectedEp.description}
            </Typography>
          </CardContent>
          <CardActions>
            <button size="small">Start Podcast</button>
          </CardActions>
        </Card>
        {/* <button onClick={click}>test</button> */}
      </div>
      <div className="player-container">
        <Sdk token={props.token} />
        <PauseCircleFilled onClick={pause} />
        <PlayCircleFilled onClick={play} />
        {uri && <Sync onClick={start} />}
      </div>
      <LinearProgress variant="determinate" value={currentPosition} />
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
