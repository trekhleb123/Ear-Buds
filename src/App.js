import React from "react"
import logo from "./logo.svg"
import "./App.css"
import { createNewRoom, getRoom, getCurrentRoomData } from "./firebase/firebase"
import SpotifyLogin from "react-spotify-login"

const clientId = ""
const redirectUri = "http://localhost:3000"

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
        <SpotifyLogin
          clientId={clientId}
          redirectUri={redirectUri}
          onSuccess={(response) => console.log(response)}
          onFailure={(response) => console.log(response)}
        />
      </header>
    </div>
  )
}

export default App
