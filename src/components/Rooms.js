import React from "react"
import { createRoom, joinRoom, findRoom, getRoom } from "../firebase/firebase"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { getUserData, setRoomCode } from "../redux/store"
import { Button } from "@material-ui/core"
import Box from "@material-ui/core/Box"
import TextField from "@material-ui/core/TextField"
import "./App.css"
import Sdk from "./Sdk"

class Rooms extends React.Component {
  constructor() {
    super()
    this.state = {
      joinForm: false,
      wrongRoomCode: false,
      open: false,
      anchorEl: null,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.showForm = this.showForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.joinSubmit = this.joinSubmit.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  componentDidMount() {
    if (!Object.keys(this.props.userData).length) {
      this.props.history.push("/")
    }
  }

  async handleSubmit() {
    const roomCode = await createRoom(
      this.props.access_token,
      this.props.userData.display_name,
      this.props.refresh_token,
      this.props.userData.images
    )
    const roomId = await getRoom(roomCode)
    this.props.setRoomCode(roomCode)
    this.props.history.push(`/room/${roomId}`)
  }

  async joinSubmit(event) {
    event.preventDefault()
    const room = await findRoom(this.props.roomCode)
    if (typeof room === "string") {
      await joinRoom(
        this.props.access_token,
        this.props.userData.display_name,
        this.props.refresh_token,
        room,
        this.props.roomCode,
        this.props.userData.images
      )
      this.props.history.push(`/room/${room}`)
      this.setState({
        joinForm: false,
      })
    } else {
      this.setState({
        wrongRoomCode: true,
      })
    }
  }

  showForm() {
    this.setState({
      joinForm: !this.state.joinForm,
    })
  }

  handleChange(event) {
    this.props.setRoomCode(event.target.value)
  }

  handleOpen = (event) => {
    this.setState({
      open: !this.state.open,
      anchorEl: this.state.anchorEl ? null : event.currentTarget,
    })
  }

  handleClose = () => {
    this.setState({
      open: false,
    })
  }

  render() {
    return (
      <div>
        <div className="App-header">
          <Sdk token={this.props.access_token} />
          <Box display="flex" justifyContent="center">
            <Box m={5} display="inline">
              <Button
                variant="outlined"
                onClick={this.handleSubmit}
                type="button"
              >
                Create Room
              </Button>
            </Box>
            <Box m={5} display="inline">
              <Button variant="outlined" onClick={this.showForm} type="button">
                Join Room
              </Button>
            </Box>
          </Box>
          <Box display="flex" justifyContent="center">
            {this.state.joinForm ? (
              <form>
                <TextField
                  id="textForJoin"
                  size="small"
                  name="roomCode"
                  value={this.props.roomCode}
                  onChange={this.handleChange}
                  variant="filled"
                  label="Room Code"
                />
                <Box m={2} display="inline">
                  <Button
                    variant="outlined"
                    onClick={this.joinSubmit}
                    type="button"
                  >
                    Submit
                  </Button>
                </Box>
              </form>
            ) : null}
          </Box>
          {this.state.wrongRoomCode && (
            <p>Opps, wrong code. Please try again</p>
          )}
        </div>
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
  getUserData: (token) => dispatch(getUserData(token)),
  setRoomCode: (roomCode) => dispatch(setRoomCode(roomCode)),
})

export default withRouter(connect(stateToProps, dispatchToProps)(Rooms))
