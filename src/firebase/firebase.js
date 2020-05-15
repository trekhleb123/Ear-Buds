import firebase from "firebase";
import { getNowPlaying } from "../api/spotifyApi";

const firebaseApp = firebase.initializeApp({
  // copy and paste your firebase credential here
  apiKey: "AIzaSyBYMe0vrHWmvoWoMrZGB62EXeEhgdNVZvM",
  authDomain: "podcastparty-402e2.web.app",
  databaseURL: "https://podcastparty-402e2.firebaseio.com",
  projectId: "podcastparty-402e2",
  storageBucket: "gs://podcastparty-402e2.appspot.com",
  messagingSenderId: "311285409494",
});

const db = firebaseApp.firestore();
//const firestore = getFirestore()
const firestore = firebase.firestore();
export { db, firestore };

export async function createNewRoom(newRoom) {
  try {
    const room = await db.collection("Rooms").add(newRoom);
    console.log(room);
  } catch (err) {
    console.error(err);
  }
}

export async function getRoom(roomCode) {
  try {
    const rooms = db.collection("Rooms");
    const currentRoom = await rooms.where("roomCode", "==", roomCode).get();
    let res = {};
    currentRoom.forEach((el) => {
      res = el.id;
    });
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
}

export async function getCurrentRoomData(roomId) {
  try {
    const doc = db.collection("Rooms").doc(roomId);
    const result = await doc.get();

    // console.log(result.data());
    return result.data();
  } catch (err) {
    console.error(err);
  }
}

export async function getCurrentUserData(roomId, callback) {
  try {
    const users = db.collection("Rooms").doc(roomId).collection("Users");
    const result = await users.get();

    result.forEach((user) => console.log(user.id, "=>", user.data()));

    // console.log(result.data());
    return result;
  } catch (err) {
    console.error(err);
  }
}
// export async function getRooms() {
//   const doc = db.collection('Rooms')
//  const docs = await doc.get()
//      let res = {}
//   docs.forEach((el) => {
//     res = el
//   })
//   console.log(res)
//   return res
// }

export async function createRoom(token, username, refreshToken) {
  //event.preventDefault()
  const code =
    Math.random().toString(36).substring(2, 7) +
    Math.random().toString(36).substring(2, 7);
  console.log("in handle submit", code);
  const newRoom = await db.collection("Rooms").add({
    name: "room1",
    roomCode: code,
    queued: {
      timestamp: 0,
      uri: "",
      status: false,
      duration_ms: 1000,
    },
  });
  console.log("newRoom", newRoom);
  await db.collection("Rooms").doc(newRoom.id).collection("Users").add({
    accessToken: "hey",
    email: "you@email.com",
    name: "Bob",
    roomCode: code,
  });
  // console.log('this.props in submit', newRoom.id);
  // this.props.history.push(`/room/${newRoom.id}`);
  return newRoom.id;
}
export async function joinRoom(token, username, roomCode, refreshToken) {
  const rooms = db.collection("Rooms");
  const currentRoom = await rooms.where("roomCode", "==", roomCode).get();
  let res = {};
  currentRoom.forEach((el) => {
    res = el.id;
  });
  console.log("currentroom", res, currentRoom);
  await db.collection("Rooms").doc(res).collection("Users").add({
    accessToken: token,
    name: username,
    roomCode: roomCode,
    deviceId: 2,
    refreshToken,
  });
  return res;
}

export async function updateRoomData(roomData, roomId) {
  try {
    const roomRef = db.collection("Rooms").doc(roomId);
    roomRef.update(roomData);
    // console.log("new room", roomRef);
  } catch (err) {
    console.error(err);
  }
}

export async function playbackUpdate(token, roomId, playingStatus) {
  let epInfo;

  getNowPlaying(token)
    .then((res) => {
      epInfo = res;
      return getCurrentRoomData(roomId);
    })
    .then((roomData) => {
      roomData.nowPlayingProgress = epInfo.data.progress_ms;
      roomData.timestamp = epInfo.data.timestamp;
      roomData.playing = playingStatus;
      return roomData;
    })
    .then((res) => updateRoomData(res, roomId));
}

export async function changeQueue(roomId, epInfo, epId) {
  getCurrentRoomData(roomId)
    .then((roomData) => {
      roomData.queued.epId = epId;
      // roomData.queued.name = epInfo.name;
      // roomData.queued.show = epInfo.show.publisher;
      roomData.queued.duration = epInfo.duration_ms;
      // roomData.queued.imageUrl = epInfo.images[1].url;
      // roomData.queued.description = epInfo.description;
      roomData.queued.uri = epInfo.uri;
      roomData.queued.timestamp = Date.now();
      roomData.queued.status = true;
      return roomData;
    })
    .then((res) => updateRoomData(res, roomId));
}

export async function clearQueue(roomId) {
  getCurrentRoomData(roomId)
    .then((roomData) => {
      roomData.queued.epId = "";
      // roomData.queued.name = "";
      // roomData.queued.show = "";
      roomData.queued.timestamp = Date.now();
      roomData.queued.duration = 0;
      // roomData.queued.imageUrl = "";
      // roomData.queued.description = "";
      roomData.queued.uri = "";
      roomData.queued.status = false;
      return roomData;
    })
    .then((res) => updateRoomData(res, roomId));
}
