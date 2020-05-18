import React, { useState, useEffect } from "react"
import { firestore, findRoom } from "../firebase/firebase"
import Form from "./Form"
import _sortBy from "lodash/sortBy"
import { connect } from "react-redux"
import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles((theme) => ({
  container: {
    bottom: 0,
    // position: "fixed" // remove this so we can apply flex design
  },
  bubbleContainer: {
    width: "100%",
    display: "flex",
  },
  bubble: {
    border: "0.5px #353535",
    backgroundColor: "#E0FBFC",
    borderRadius: "10px",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    margin: "5px",
    padding: "10px",
    display: "inline-block",
  },
}))

const Messages = (props) => {
  const [messages, setMessages] = useState([])

  const classes = useStyles()

  useEffect(() => {
    listenForMessages()
  }, [])

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
            const allMessages = []
            snapshot.forEach((doc) => allMessages.push(doc.data()))

            // Set the collected array as our state
            setMessages(_sortBy(allMessages, ["timestamp"]))
          },
          (error) => console.error(error)
        )
    }
  }

  const renderMessages = () => {
    if (!messages.length) {
      return <div>There's no messages yet...</div>
    }

    return messages.map(({ name, message }, index) => (
      <div
        key={index}
        className={`${classes.bubbleContainer} ${
          props.userData.display_name === name
            ? "right-message"
            : "left-message"
        }`}
      >
        {message && (
          <div className={classes.bubble}>
            <div>{message}</div>
            <div className="message-name">{name}</div>
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="chat-send-container">
      <div className="chat-container">{renderMessages()} </div>
      <Form />
    </div>
  )
}

const stateToProps = (state) => ({
  roomCode: state.roomCode,
  userData: state.userData,
})

export default connect(stateToProps, null)(Messages)
