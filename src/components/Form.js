import React, { useState } from "react"
import { connect } from "react-redux"
import { firestore, findRoom } from "../firebase/firebase" // This one is new

const Form = (props) => {
  // Initial item contains empty strings
  // with the name and message
  const initialItemValues = {
    name: props.userData.display_name,
    message: "",
    timestamp: new Date(),
  }
  const [item, setItem] = useState(initialItemValues)

  // Will be executed when the form is submitted.
  // If the name and message has some length
  // we'll send the object to our firestore
  // collection as a document. Then we clear the
  // item state when it has succeeded
  const onSubmit = async (event) => {
    event.preventDefault()

    let roomId
    if (props.roomCode) {
      roomId = await findRoom(props.roomCode)
    }
    // These lines are new
    if (roomId) {
      if (item.message.length) {
        firestore
          .collection("Rooms")
          .doc(roomId)
          .collection("messages")
          .doc()
          .set(item)
          .then(() => setItem(initialItemValues))
          .catch((error) => console.error(error))
      }
    }
  }

  // Set the value for the current
  // element within our state
  const onChange = ({ target }) => {
    setItem({
      ...item,
      [target.name]: target.value,
    })
  }

  return (
    <form onSubmit={onSubmit}>
      {/* <input
        type="text"
        name="name"
        placeholder="Name"
        value={item.name}
        onChange={onChange}
      /> */}
      <textarea
        name="message"
        placeholder="Message"
        value={item.message}
        onChange={onChange}
      />
      <button type="submit">Send</button>
    </form>
  )
}

const stateToProps = (state) => ({
  userData: state.userData,
  roomCode: state.roomCode,
})

export default connect(stateToProps, null)(Form)
