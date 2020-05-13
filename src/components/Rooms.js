import React from "react"
import { db, createRoom, joinRoom } from "../firebase/firebase"
import { Route } from "react-router-dom"
import { Link } from "react-router-dom"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store"

class Rooms extends React.Component {
  constructor() {
    super()
    this.state = {
      roomCode: "",
      joinForm: false,
    }
    this.getRooms = this.getRooms.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.showForm = this.showForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.joinSubmit = this.joinSubmit.bind(this)
  }
  componentDidMount() {
    //this.props.getUserData(this.props.access_token)
    this.getRooms()
    console.log("this.props in Rooms Component", this.props)
    //this.props.getUserData(this.props.access_token)
  }
  async getRooms() {
    const doc = db.collection("Rooms")
    const docs = await doc.get()
    let res = {}
    docs.forEach((el) => {
      res = el
      // console.log(el.data());
    })
    console.log("res", res)
    return res
  }

  async handleSubmit() {
    const id = await createRoom(
      this.props.access_token,
      this.props.userData.display_name,
      this.props.refresh_token
    )
    console.log("id in handleSubmit", id)
    console.log("PROPS in handle submit", this.props)
    this.props.history.push(`/room/${id}`)
    //this.props.getUserData(this.props.access_token)
    console.log("props in submit", this.props)
  }

  async joinSubmit(event) {
    event.preventDefault()
    const room = await joinRoom(
      this.props.access_token,
      this.props.userData.display_name,
      this.state.roomCode,
      this.props.refresh_token
    )
    this.props.history.push(`/room/${room}`)
    this.setState({
      joinForm: false,
      roomCode: "",
    })
  }
  showForm() {
    this.setState({
      joinForm: !this.state.joinForm,
    })
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
    console.log(event.target.name, event.target.value)
  }
  render() {
    return (
      <div>
        {/* redirect when room is created */}
        <button onClick={this.handleSubmit} type="button">
          Create Room
        </button>
        <br />
        <button onClick={this.showForm} type="button">
          Join Room
        </button>
        {this.state.joinForm ? (
          <form>
            <label>Room Code:</label>
            <input
              name="roomCode"
              value={this.state.roomCode}
              onChange={this.handleChange}
            />
            <button onClick={this.joinSubmit} type="button">
              Submit
            </button>
          </form>
        ) : null}
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
})

const dispatchToProps = (dispatch) => ({
  getUserData: (token) => dispatch(getUserData(token)),
})

export default withRouter(connect(stateToProps, dispatchToProps)(Rooms))
