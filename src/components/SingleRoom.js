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
import Header from "./Header"

class SingleRoom extends React.Component {
  constructor() {
    super()
    this.state = {
      users: [],
      // open: false
    }
  }
  async componentDidMount() {
    if (!this.props.userData.display_name) {
      window.sessionStorage.setItem("roomId", this.props.match.params.roomId)
      this.props.history.push("/")
    } else {
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
  }

  render() {
    console.log("users in render", this.state.users)
    return (
      <div>
        <Header
          roomId={this.props.match.params.roomId}
          history={this.props.history}
        />

        <div className="main-container">
          <div className="messages-container">
            <h2>Users</h2>
            <div>
              {Object.values(this.state.users).map((user, i) => {
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
            <Messages roomId={this.props.match.params.roomId} />
          </div>
          <div className="right-box">
            <SearchBar roomId={this.props.match.params.roomId} />
          </div>
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
  roomCode: state.roomCode,
})

const dispatchToProps = (dispatch) => ({
  getAccessToken: (code) => dispatch(getAccessToken(code)),
  setSpotifyCode: (code) => dispatch(setSpotifyCode(code)),
  getUserData: (token) => dispatch(getUserData(token)),
})

export default connect(stateToProps, dispatchToProps)(SingleRoom)
