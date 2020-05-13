import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
  // copy and paste your firebase credential here
  apiKey: "AIzaSyBYMe0vrHWmvoWoMrZGB62EXeEhgdNVZvM",
  authDomain: "podcastparty-402e2.web.app",
  databaseURL: "https://podcastparty-402e2.firebaseio.com",
  projectId: "podcastparty-402e2",
  storageBucket: "gs://podcastparty-402e2.appspot.com",
  messagingSenderId: "311285409494",
})

const db = firebaseApp.firestore()
//const firestore = getFirestore()
const firestore = firebase.firestore()
export { db, firestore }

export async function createNewRoom(newRoom) {
  try {
    const room = await db.collection("Rooms").add(newRoom)
    console.log(room)
  } catch (err) {
    console.error(err)
  }
}

export async function getRoom(roomName, roomPassword) {
  try {
    const rooms = db.collection("Rooms")
    const currentRoom = await rooms
      .where("name", "==", roomName)
      .where("password", "==", roomPassword)
      .get()
    let res = {}
    currentRoom.forEach((el) => {
      res = el.id
    })
    console.log(res)
    return res
  } catch (err) {
    console.error(err)
  }
}

export async function getCurrentRoomData(docId) {
  try {
    const doc = db.collection("Rooms").doc(docId)
    const result = await doc.get()

    console.log(result.data())
    return result.data()
  } catch (err) {
    console.error(err)
  }
}

export async function getCurrentUserData(docId, callback) {
  try {
    const users = db.collection("Rooms").doc(docId).collection("Users")
    const result = await users.get()

    result.forEach((user) => console.log(user.id, "=>", user.data()))

    // console.log(result.data());
    return result
  } catch (err) {
    console.error(err)
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
    Math.random().toString(36).substring(2, 7)
  console.log("in handle submit", code)
  const newRoom = await db
    .collection("Rooms")
    .add({ name: "room1", roomCode: code })
  console.log("newRoom", newRoom)
  await db.collection("Rooms").doc(newRoom.id).collection("Users").add({
    accessToken: token,
    name: username,
    roomCode: code,
    deviceId: 2,
    refreshToken,
  })

  return newRoom.id
}

export async function joinRoom(token, username, roomCode, refreshToken) {
  const rooms = db.collection("Rooms")
  const currentRoom = await rooms.where("roomCode", "==", roomCode).get()
  let res = {}
  currentRoom.forEach((el) => {
    res = el.id
  })
  console.log("currentroom", res, currentRoom)
  await db.collection("Rooms").doc(res).collection("Users").add({
    accessToken: token,
    name: username,
    roomCode: roomCode,
    deviceId: 2,
    refreshToken,
  })
  return res
}
