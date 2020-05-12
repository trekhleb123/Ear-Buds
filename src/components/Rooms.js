import React from 'react';
import { db, createRoom } from '../firebase/firebase';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

class Rooms extends React.Component {
  constructor() {
    super();
    this.state = {
      roomCode: '',
      joinForm: false,
    };
    this.getRooms = this.getRooms.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showForm = this.showForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.joinSubmit = this.joinSubmit.bind(this)

  }
  componentDidMount() {
    this.getRooms();
    console.log('this.props in Rooms Component', this.props);
  }
  async getRooms() {
    const doc = db.collection('Rooms');
    const docs = await doc.get();
    let res = {};
    docs.forEach(el => {
      res = el;
      // console.log(el.data());
    });
    console.log('res', res)
    return res;
  }

  async handleSubmit() {
    const id = await createRoom()
    console.log('id in handleSubmit', id)
    this.props.history.push(`/room/${id}`);
  }
  async joinSubmit(event) {
    event.preventDefault()
    console.log('in submit')
    const rooms = db.collection("Rooms")
    const currentRoom = await rooms
      .where('roomCode', '==', this.state.roomCode)
      .get()
      let res = {}
    currentRoom.forEach((el) => {
      res = el.id
    })
    console.log('currentroom', res,currentRoom)
    await db.collection('Rooms')
    .doc(res)
    .collection('Users')
    .add({
      accessToken: 'hey',
      email: 'you@email.com',
      name: 'Bob',
      roomCode: this.state.roomCode,
    });
    // const room = await db.collection('Rooms').doc()
    // room.where('roomCode', '==', this.state.roomCode)
    console.log('room', res, currentRoom)
  this.props.history.push(`/room/${res}`)
  this.setState({
    joinForm: false,
    roomCode: ''
  })
  }
showForm() {
  this.setState({
    joinForm: !this.state.joinForm
  })
}
handleChange(event) {
  this.setState({
    [event.target.name]: event.target.value
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
        {this.state.joinForm ? <form>
          <label>Room Code:</label>
          <input name='roomCode' value={this.state.roomCode} onChange={this.handleChange}/>
          <button onClick={this.joinSubmit} type='button'>Submit</button>
        </form> : null}
        {/* <div>
          <h2>All Rooms</h2>
          <div>
          </div>
        </div> */}
      </div>
    );
  }
}
export default withRouter(Rooms);
