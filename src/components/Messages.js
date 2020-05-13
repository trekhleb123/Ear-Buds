import React, { useState, useEffect } from "react"
import { firestore } from "../firebase/firebase"
import Form from "./Form" // This one is new

const Messages = () => {
  // Set default as null so we
  // know if it's still loading
  const [messages, setMessages] = useState(null)

  // Initialize with listening to our
  // messages collection. The second argument
  // with the empty array makes sure the
  // function only executes once
  useEffect(() => {
    listenForMessages()
  }, [])

  // Use firestore to listen for changes within
  // our newly created collection
  const listenForMessages = () => {
    firestore.collection("messages").onSnapshot(
      (snapshot) => {
        // Loop through the snapshot and collect
        // the necessary info we need. Then push
        // it into our array
        const allMessages = []
        snapshot.forEach((doc) => allMessages.push(doc.data()))

        // Set the collected array as our state
        setMessages(allMessages)
      },
      (error) => console.error(error)
    )
  }

  // If the state is null we
  // know that it's still loading
  if (!messages) {
    return <div>Loading...</div>
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
      <Form /> {/* This one is new */}
      {renderMessages()}
    </>
  )
}

export default Messages
