import React, { useState, useEffect } from "react"
import { firestore, findRoom, db } from "../firebase/firebase"
import Form from "./Form" // This one is new
import _sortBy from "lodash/sortBy"
import { connect } from "react-redux"

const Messages = (props) => {
  // Set default as null so we
  // know if it's still loading
  const [messages, setMessages] = useState([])

  // Initialize with listening to our
  // messages collection. The second argument
  // with the empty array makes sure the
  // function only executes onc
  useEffect(() => {
    listenForMessages()
  }, [])

  // Use firestore to listen for changes within
  // our newly created collection
  const listenForMessages = async () => {
    console.log("room code", props)
    let roomId
    if (props.roomCode) {
      roomId = await findRoom(props.roomCode)
    }

    if (roomId) {
      firestore
        .collection("Rooms")
        .doc(roomId)
        .collection("messages")
        .onSnapshot(
          (snapshot) => {
            // Loop through the snapshot and collect
            // the necessary info we need. Then push
            // it into our array
            const allMessages = []
            snapshot.forEach((doc) => allMessages.push(doc.data()))

            // Set the collected array as our state
            setMessages(_sortBy(allMessages, ["timestamp"]))
          },
          (error) => console.error(error)
        )
    }
  }

  // Render all the messages with no
  // specific order. Using the index as
  // the key, this is not the best practice
  // but it's good enough for the small example
  const renderMessages = () => {
    // If the array is empty we inform
    // the user that there's no messages
    if (!messages.length) {
      return <div>There's no messages yet...</div>
    }

    // Otherwise we'll render the messages
    return messages.map(({ name, message }, index) => (
      <div key={index}>
        <b>{name}</b>
        <div>{message}</div>
      </div>
    ))
  }

  // Show the messages
  // and the form
  return (
    <>
      {renderMessages()}
      <Form /> {/* This one is new */}
    </>
  )
}

const stateToProps = (state) => ({
  roomCode: state.roomCode,
})

export default connect(stateToProps, null)(Messages)
