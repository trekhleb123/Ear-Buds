import React, { useState } from "react"
import { connect } from "react-redux"
import { firestore, findRoom } from "../firebase/firebase"

const Form = (props) => {
  const initialItemValues = {
    name: props.userData.display_name,
    message: "",
    timestamp: new Date(),
  }
  const [item, setItem] = useState(initialItemValues)

  const onSubmit = async (event) => {
    event.preventDefault()

    let roomId
    if (props.roomCode) {
      roomId = await findRoom(props.roomCode)
    }

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

  const onChange = ({ target }) => {
    setItem({
      ...item,
      [target.name]: target.value,
    })
  }

  return (
    <form onSubmit={onSubmit}>
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
