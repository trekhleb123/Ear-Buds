import React from "react"
import logo from "./logo.svg"
import "./App.css"
import { createNewRoom, getRoom, getCurrentRoomData } from "./firebase/firebase"

function App() {
  const buttonClick = () => {
    createNewRoom({
      name: "room11",
      password: "123",
      users: [
        { name: "Alona", accessTocken: "someTocken", email: "some email" },
        { name: "Justin", accessTocken: "tocken", email: "email" },
      ],
      currentPodcast: { apiData: "somedata" },
    })
    getRoom("room11", "123").then((res) => getCurrentRoomData(res))
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={buttonClick}>Button</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
