import React, { useEffect, useState } from "react"
import { db, userLeft, renderUsers, vacantRoom } from "../firebase/firebase"
import { Route } from "react-router-dom"
import { Link } from "react-router-dom"
//import { getMyData } from "../spotifyLogin"
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store"
import { connect } from "react-redux"
import { Modal } from "@material-ui/core"
import Messages from "./Messages"
import { SearchBar } from "."
import Header from "./Header"
import { Button } from "@material-ui/core"
import Card from "@material-ui/core/Card"
import { List } from "@material-ui/core"
import Footer from "./Footer"
import useDarkMode from "use-dark-mode"

const SingleRoom = (props) => {
  const [users, setUsers] = useState([])
  const darkMode = useDarkMode(false)

  const getNewUsers = async () => {
    await db
      .collection("Rooms")
      .doc(props.match.params.roomId)
      .collection("Users")
      .onSnapshot((snapshot) => {
        const allUsers = []
        snapshot.forEach((doc) => allUsers.push(doc.data()))
        setUsers(allUsers)
      })
  }

  useEffect(() => {
    if (!props.userData.display_name) {
      props.history.push("/")
    } else {
      getNewUsers()
    }
  }, [])

  const click = () => {
    darkMode.toggle()
    console.log(darkMode.value)
  }

  console.log("users in render", users)
  return (
    <div>
      <Header roomId={props.match.params.roomId} history={props.history} />
      <div className="main-container">
        <div className="messages-container">
          <button onClick={click}>Toggle Day / Night</button>
          <h2>Users</h2>
          <div>
            {Object.values(users).map((user, i) => {
              console.log("user", user)
              return (
                <div id="userList" key={i}>
                  <img
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "30%",
                    }}
                    alt="avatar"
                    src={
                      user.image.length > 0
                        ? user.image[0].url
                        : "https://www.mentoring.org/new-site/wp-content/uploads/2019/05/default-user-300x300.png"
                    }
                  />{" "}
                  {user.name}
                </div>
              )
            })}
          </div>
          <Messages roomId={props.match.params.roomId} />
        </div>
        <div className="right-box">
          <SearchBar roomId={props.match.params.roomId} />
        </div>
      </div>
      <Footer roomCode={props.roomCode} />
    </div>
  )
}
const stateToProps = (state) => ({
  access_token: state.access_token,
  userData: state.userData,
  refresh_token: state.refresh_token,
  roomCode: state.roomCode,
})

const dispatchToProps = (dispatch) => ({
  getAccessToken: (code) => dispatch(getAccessToken(code)),
  setSpotifyCode: (code) => dispatch(setSpotifyCode(code)),
  getUserData: (token) => dispatch(getUserData(token)),
})

export default connect(stateToProps, dispatchToProps)(SingleRoom)
