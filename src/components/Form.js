import React, { useState } from "react"
import { firestore } from "../firebase/firebase" // This one is new

const Form = () => {
  // Initial item contains empty strings
  // with the name and message
  const initialItemValues = {
    name: "",
    message: "",
  }
  const [item, setItem] = useState(initialItemValues)

  // Will be executed when the form is submitted.
  // If the name and message has some length
  // we'll send the object to our firestore
  // collection as a document. Then we clear the
  // item state when it has succeeded
  const onSubmit = (event) => {
    event.preventDefault()

    // These lines are new
    if (item.name.length && item.message.length) {
      firestore
        .collection("messages")
        .doc()
        .set(item)
        .then(() => setItem(initialItemValues))
        .catch((error) => console.error(error))
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
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={item.name}
        onChange={onChange}
      />
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

export default Form
