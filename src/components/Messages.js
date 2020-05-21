import React, { useState, useEffect, useRef } from "react"
import { firestore, findRoom } from "../firebase/firebase"
import Form from "./Form"
import _sortBy from "lodash/sortBy"
import { connect } from "react-redux"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { useCollection } from "react-firebase-hooks/firestore"

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
    border: "0.5px azure",
    color: "azure",
    borderRadius: "10px",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    margin: "5px",
    padding: "10px",
    display: "inline-block",
  },
}))

const Messages = (props) => {
  const [messages, loading, error] = useCollection(
    firestore
      .collection("Rooms")
      .doc(props.roomId)
      .collection("messages")
      .orderBy("timestamp", "asc")
  )
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current &&
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const classes = useStyles()

  if (loading) return <div>Loading..</div>
  if (error) return <div>Error..</div>

  const renderMessages = () => {
    if (!messages.docs.length) {
      return (
        <div className={`${classes.bubble}`}>There's no messages yet...</div>
      )
    }
    return messages.docs.map((doc, index) => {
      const { name, message } = doc.data()
      return (
        <div key={index}>
          <div
            className={`${classes.bubbleContainer} ${
              props.userData.display_name === name
                ? "right-message"
                : "left-message"
            }`}
          >
            <div className={classes.bubble}>
              <div>{message}</div>
              <div className="message-name">{name}</div>
            </div>
          </div>
        </div>
      )
    })
  }
  return (
    <div className="chat-send-container">
      <div className="chat-container">
        {renderMessages()}
        {messages && <div ref={messagesEndRef} />}
      </div>

      <Form roomId={props.roomId} />
    </div>
  )
}

const stateToProps = (state) => ({
  roomCode: state.roomCode,
  userData: state.userData,
})

export default connect(stateToProps, null)(Messages)
