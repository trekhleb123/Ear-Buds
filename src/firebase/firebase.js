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

export { db }

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
