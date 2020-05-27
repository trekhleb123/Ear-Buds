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
    return res;
  } catch (err) {
    console.error(err);
  }
}

export async function getCurrentRoomData(roomId) {
  try {
    const doc = db.collection("Rooms").doc(roomId);
    const result = await doc.get();
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

    return result;
  } catch (err) {
    console.error(err);
  }
}
export async function getRooms() {
  const doc = db.collection("Rooms");
  const docs = await doc.get();
  let res = [];
  docs.forEach((el) => {
    res.push(el);
  });
  return res;
}

export async function createRoom(token, username, refreshToken, image) {
  const code =
    Math.random().toString(36).substring(2, 7) +
    Math.random().toString(36).substring(2, 7);

  const newRoom = await db.collection("Rooms").add({
    name: "room1",
    roomCode: code,
    queued: {
      timestamp: 0,
      uri: "",
      status: false,
      duration_ms: 1000,
      username: "",
      name: "",
      epId: "",
    },
    playing: {
      progress: "",
      timestamp: 0,
      uri: "",
      status: false,
      duration_ms: 1000,
      username: "",
      epId: "",
    },
  });

  await db.collection("Rooms").doc(newRoom.id).collection("Users").add({
    accessToken: token,
    name: username,
    roomCode: code,
    deviceId: 2,
    refreshToken,
    image,
  });

  await db.collection("Rooms").doc(newRoom.id).collection("messages").add({});

  return code;
}
export async function joinRoom(
  token,
  username,
  refreshToken,
  res,
  roomCode,
  image
) {
  await db.collection("Rooms").doc(res).collection("Users").add({
    accessToken: token,
    name: username,
    roomCode: roomCode,
    deviceId: 2,
    refreshToken,
    image,
  });
}

export async function findRoom(roomCode) {
  const rooms = db.collection("Rooms");
  const currentRoom = await rooms.where("roomCode", "==", roomCode).get();
  let res = {};
  currentRoom.forEach((el) => {
    res = el.id;
  });
  return res;
}
export async function userLeft(roomId, displayName) {
  const users = await db.collection("Rooms").doc(roomId).collection("Users");
  const currentUser = await users.where("name", "==", displayName).get();
  currentUser.forEach(async (el) => {
    await el.ref.delete();
  });
}

export async function vacantRoom(roomId) {
  let userLength;
  await db
    .collection("Rooms")
    .doc(roomId)
    .collection("Users")
    .get()
    .then(function (user) {
      userLength = user.size;
    });
  if (userLength === 0) {
    await db.collection("Rooms").doc(roomId).delete();
  }
}

export async function updateRoomData(roomData, roomId) {
  try {
    const roomRef = db.collection("Rooms").doc(roomId);
    roomRef.update(roomData);
  } catch (err) {
    console.error(err);
  }
}

export async function playbackUpdate(token, roomId, playingStatus, username) {
  let epInfo;

  getNowPlaying(token)
    .then((res) => {
      epInfo = res;
      return getCurrentRoomData(roomId);
    })
    .then((roomData) => {
      roomData.playing.progress = epInfo.data.progress_ms;
      roomData.playing.timestamp = epInfo.data.timestamp;
      roomData.playing.status = playingStatus;
      roomData.playing.username = username;
      return roomData;
    })
    .then((res) => updateRoomData(res, roomId))
    .then(() => {
      if (playingStatus === false)
        addLog(roomId, username, `Paused the podcast`);
      if (playingStatus === true)
        addLog(roomId, username, `Resumed the podcast`);
    });
}

export async function changeQueue(roomId, epInfo, epId, username, showId) {
  getCurrentRoomData(roomId)
    .then((roomData) => {
      roomData.queued.epId = epId;
      roomData.queued.name = epInfo.name;
      roomData.queued.showId = showId;
      roomData.queued.duration = epInfo.duration_ms;
      roomData.queued.uri = epInfo.uri;
      roomData.queued.timestamp = Date.now();
      roomData.queued.status = true;
      roomData.queued.username = username;
      return roomData;
    })
    .then((res) => updateRoomData(res, roomId))
    .then(() => addLog(roomId, username, `Queued up ${epInfo.name}`));
}

export async function clearQueue(roomId) {
  getCurrentRoomData(roomId)
    .then((roomData) => {
      roomData.queued.epId = "";
      roomData.queued.name = "";
      // roomData.queued.show = "";
      roomData.queued.timestamp = Date.now();
      roomData.queued.duration = 0;
      // roomData.queued.imageUrl = "";
      // roomData.queued.description = "";
      roomData.queued.uri = "";
      roomData.queued.status = false;
      roomData.queued.username = "";
      return roomData;
    })
    .then((res) => updateRoomData(res, roomId));
}

export async function addMessage(roomCode, item) {
  let roomId;
  roomId = await findRoom(roomCode);
  if (item.message.length) {
    firestore
      .collection("Rooms")
      .doc(roomId)
      .collection("messages")
      .doc()
      .set(item)
      .catch((error) => console.error(error));
  }
}

export async function addLog(roomId, username, message) {
  let item = {
    name: username,
    message: message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };

  firestore
    .collection("Rooms")
    .doc(roomId)
    .collection("messages")
    .doc()
    .set(item)
    .catch((error) => console.error(error));
}

export async function playbackStart(roomId, username) {
  try {
    let title;
    getCurrentRoomData(roomId)
      .then((roomData) => {
        title = roomData.queued.name;
        roomData.playing.progress = 0;
        roomData.playing.showId = roomData.queued.showId;
        roomData.playing.timestamp = Date.now();
        roomData.playing.uri = roomData.queued.uri;
        roomData.playing.duration_ms = roomData.queued.duration_ms;
        roomData.playing.status = true;
        roomData.playing.username = username;
        roomData.playing.epId = roomData.queued.epId;
        return roomData;
      })
      .then((res) => updateRoomData(res, roomId))
      .then(() => clearQueue(roomId))
      .then(() => addLog(roomId, username, `Started ${title}`));
  } catch (err) {
    console.error(err);
  }
}

export const getPlaylist = async (playlistId, token) => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const ppJSON = await response.json();

  if (ppJSON.items) {
    return await ppJSON.items.map((item) => {
      return {
        uri: item.track.uri,
        name: item.track.name,
        image: item.track.album.images[1].url,
        id: item.track.id,
      };
    });
  }
};
