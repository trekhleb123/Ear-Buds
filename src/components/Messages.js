import React, { useState, useEffect } from "react";
import { firestore, findRoom } from "../firebase/firebase";
import Form from "./Form";
import _sortBy from "lodash/sortBy";
import { connect } from "react-redux";

const Messages = (props) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    listenForMessages();
  }, []);

  const listenForMessages = async () => {
    console.log("room code", props);
    let roomId;
    if (props.roomCode) {
      roomId = await findRoom(props.roomCode);
    }

    if (roomId) {
      firestore
        .collection("Rooms")
        .doc(roomId)
        .collection("messages")
        .onSnapshot(
          (snapshot) => {
            const allMessages = [];
            snapshot.forEach((doc) => allMessages.push(doc.data()));

            // Set the collected array as our state
            setMessages(_sortBy(allMessages, ["timestamp"]));
          },
          (error) => console.error(error)
        );
    }
  };

  const renderMessages = () => {
    if (!messages.length) {
      return <div>There's no messages yet...</div>;
    }

    return messages.map(({ name, message }, index) => (
      <div key={index}>
        <b>{name}</b>
        <div>{message}</div>
      </div>
    ));
  };

  return (
    <>
      {renderMessages()}
      <Form />
    </>
  );
};

const stateToProps = (state) => ({
  roomCode: state.roomCode,
});

export default connect(stateToProps, null)(Messages);
