import React from "react"
import { db, userLeft, renderUsers, vacantRoom } from "../firebase/firebase"
import { Route } from "react-router-dom"
import { Link } from "react-router-dom"
//import { getMyData } from "../spotifyLogin"
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store"
import { connect } from "react-redux"
import { Modal } from "@material-ui/core"
import Messages from "./Messages"
import { SearchBar } from "."
class SingleRoom extends React.Component {
  constructor() {
    super()
    this.state = {
      users: [],
      // open: false
    }
    this.leaveRoom = this.leaveRoom.bind(this)
  }
  async componentDidMount() {
    if (!this.props.userData.display_name) {
      window.sessionStorage.setItem("roomId", this.props.match.params.roomId)
      this.props.history.push("/")
    }
    this.props.getUserData(this.props.access_token)
    // await renderUsers(this.props.match.params.roomId);
    // this.setState({
    //   users: [...this.state.users, await renderUsers(this.props.match.params.roomId)],
    // })
    //     console.log('in mount', this.state.users)
    await db
      .collection("Rooms")
      .doc(this.props.match.params.roomId)
      .collection("Users")
      .onSnapshot((snapshot) => {
        const allUsers = []
        snapshot.forEach((doc) => allUsers.push(doc.data()))
        this.setState({
          users: allUsers,
        })
      })
  }

  async leaveRoom(roomId, displayName) {
    console.log(roomId, displayName)
    await userLeft(roomId, displayName)
    await vacantRoom(roomId)
    this.props.history.push("/")
  }

  render() {
    console.log("users in render", this.state.users)
    return (
      <div>
        <div className="header">
          <button
            type="button"
            onClick={() =>
              this.leaveRoom(
                this.props.match.params.roomId,
                this.props.userData.display_name
              )
            }
          >
            Leave Room
          </button>
          <button type="button">Invite Friend</button>
        </div>

        <div className="main-container">
          <div className="messages-container">
            <h2>Users</h2>
            <div>
              {Object.values(this.state.users).map((user, i) => {
                console.log("user", user)
                return <li key={i}>{user.name}</li>
              })}
            </div>
            <Messages />
          </div>

          <SearchBar roomId={this.props.match.params.roomId} />
        </div>
        <div className="footer">Footer Text</div>
      </div>
    )
  }
}
const stateToProps = (state) => ({
  access_token: state.access_token,
  userData: state.userData,
  refresh_token: state.refresh_token,
})

const dispatchToProps = (dispatch) => ({
  getAccessToken: (code) => dispatch(getAccessToken(code)),
  setSpotifyCode: (code) => dispatch(setSpotifyCode(code)),
  getUserData: (token) => dispatch(getUserData(token)),
})

export default connect(stateToProps, dispatchToProps)(SingleRoom)
