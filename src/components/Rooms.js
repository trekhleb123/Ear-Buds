import React from "react"
import {
  db,
  createRoom,
  joinRoom,
  findRoom,
  getRoom,
} from "../firebase/firebase"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { getUserData, setRoomCode } from "../redux/store"
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import "./App.css"

class Rooms extends React.Component {
  constructor() {
    super()
    this.state = {
      joinForm: false,
      wrongRoomCode: false,
      open: false
    }
    this.getRooms = this.getRooms.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.showForm = this.showForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.joinSubmit = this.joinSubmit.bind(this)
  }
  componentDidMount() {
    this.getRooms()
    if (!Object.keys(this.props.userData).length) {
      this.props.history.push("/")
    }
  }

  async getRooms() {
    const doc = db.collection("Rooms")
    const docs = await doc.get().then(function (room) {
      room.forEach(function (doc) {
        //console.log(doc.id, " => ", doc.data());
      })
    })
  }

  async handleSubmit() {
    const roomCode = await createRoom(
      this.props.access_token,
      this.props.userData.display_name,
      this.props.refresh_token
    )
    const id = await getRoom(roomCode)
    this.props.setRoomCode(roomCode)
    this.props.history.push(`/room/${id}`)
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
        this.props.roomCode
      )
      this.props.history.push(`/room/${room}`)
      console.log("PROPS", this.props)
      this.setState({
        joinForm: false,
      })
    } else {
      this.setState({
        wrongRoomCode: true,
      })
      console.log("wrong room code")
    }
  }
  showForm() {
    this.setState({
      joinForm: !this.state.joinForm,
    })
  }
  handleChange(event) {
    console.log([event.target.name], event.target.value)
    this.props.setRoomCode(event.target.value)
  }
  render() {
    return (
      <div className='App-header'>
        <Box display="flex" justifyContent="center">
        <Box m={5} display='inline'>
        <Button variant='contained' onClick={this.handleSubmit} type="button">
          Create Room
        </Button>
        </Box>
        <Box m={5} display='inline'>
        <Button variant='contained' onClick={this.showForm} type="button">
          Join Room
        </Button>
        </Box>
        </Box>
        <Box display="flex" justifyContent="center">
        {this.state.joinForm ? (
          <form>
            <TextField
            size='small'
              name="roomCode"
              value={this.props.roomCode}
              onChange={this.handleChange}
              variant="outlined"
              label="Room Code"
            />
             <Box m={2} display='inline'>
            <Button variant='contained' onClick={this.joinSubmit} type="button">
              Submit
            </Button>
            </Box>
          </form>
        ) : null}
        </Box>
        {this.state.wrongRoomCode && <p>Opps, wrong code. Please try again</p>}
        {/* <div>
          <h2>All Rooms</h2>
          <div>
          </div>
        </div> */}
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
