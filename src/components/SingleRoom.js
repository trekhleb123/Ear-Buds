import React, { useEffect, useState } from "react"
import { db } from "../firebase/firebase"
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store"
import { connect } from "react-redux"
import Messages from "./Messages"
import { SearchBar } from "."
import Header from "./Header"
import { Button } from "@material-ui/core"
import Card from "@material-ui/core/Card"
import Footer from "./Footer"
import CardContent from "@material-ui/core/CardContent"
import Popover from "@material-ui/core/Popover"
import Typography from "@material-ui/core/Typography"
import PersonAddIcon from "@material-ui/icons/PersonAdd"
import { Alert } from "@material-ui/lab"
import Slide from "@material-ui/core/Slide"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"

const SingleRoom = (props) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [users, setUsers] = useState([])
  const [alert, setAlert] = useState(false)

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

  const handleOpenInviteBox = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseInviteBox = () => {
    setAnchorEl(null)
  }

  const currentRoomCode = () => {
    const currentRoomCode = document.getElementById("room-code")
    currentRoomCode.select()
    currentRoomCode.setSelectionRange(0, 99999) /*For mobile devices*/

    document.execCommand("copy")
    setAlert(true)
    handleCloseInviteBox()
    setTimeout(() => {
      setAlert(false)
    }, 3000)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined
  return (
    <div>
      <Header roomId={props.match.params.roomId} history={props.history} />
      {alert ? (
        <Slide direction="up" in={alert} mountOnEnter unmountOnExit>
          <Alert
            variant="filled"
            onClose={() => setAlert(false)}
            severity="info"
          >
            Invite code was copied to clipboard!
          </Alert>
        </Slide>
      ) : null}
      <div className="main-container">
        <div className="left-box">
          <div className="messages-container">
            <div className="users-container">
              <Typography color="textSecondary">Users</Typography>
              <List>
                {Object.values(users).map((user, i) => {
                  return (
                    <ListItem id="userList" key={i}>
                      <ListItemIcon>
                        <img
                          style={{
                            width: "25px",
                            height: "25px",
                            borderRadius: "30%",
                            padding: "5px",
                          }}
                          alt="avatar"
                          src={
                            user.image.length > 0
                              ? user.image[0].url
                              : "https://www.mentoring.org/new-site/wp-content/uploads/2019/05/default-user-300x300.png"
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary={user.name} />
                    </ListItem>
                  )
                })}
                <Button
                  style={{
                    padding: "5px",
                  }}
                  onClick={handleOpenInviteBox}
                >
                  <ListItem>
                    <ListItemIcon>
                      <PersonAddIcon
                        style={{
                          width: "25px",
                          height: "25px",
                        }}
                      />
                    </ListItemIcon>

                    <ListItemText primary="Add Buddy" />
                  </ListItem>
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleCloseInviteBox}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "left",
                  }}
                >
                  <Card>
                    <CardContent className="invite-card">
                      <Typography variant="subtitle1" color="textSecondary">
                        Send Invite Code
                      </Typography>
                      <input
                        type="text"
                        value={props.roomCode}
                        id="room-code"
                      ></input>
                      <Button
                        onClick={() => currentRoomCode()}
                        variant="outlined"
                        id="search-button"
                      >
                        Copy Code
                      </Button>
                    </CardContent>
                  </Card>
                </Popover>
              </List>
            </div>
            <Messages roomId={props.match.params.roomId} />
          </div>
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
