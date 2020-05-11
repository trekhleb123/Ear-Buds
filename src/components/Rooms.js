import React from 'react';
import { db } from '../firebase/firebase';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

class Rooms extends React.Component {
  constructor() {
    super();
    this.state = {
      roomCode: '',
      joinForm: false,
      roomCode: ''
    };
    this.getRooms = this.getRooms.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showForm = this.showForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
    this.getRooms();
    console.log('this.props', this.props);
  }
  async getRooms() {
    const doc = db.collection('Rooms');
    const docs = await doc.get();
    let res = {};
    docs.forEach(el => {
      res = el;
      console.log(el.data());
    });
    console.log(res);
    return res;
  }

  async handleSubmit(event) {
    //event.preventDefault()
    const code =
      Math.random()
        .toString(36)
        .substring(2, 7) +
      Math.random()
        .toString(36)
        .substring(2, 7);
    console.log('in handle submit', code);
    const newRoom = await db
      .collection('Rooms')
      .add({ name: 'room1', roomCode: code });
    console.log('newRoom', newRoom);
    db.collection('Rooms')
      .doc(newRoom.id)
      .collection('Users')
      .add({
        accessToken: 'hey',
        email: 'you@email.com',
        name: 'Bob',
        roomCode: code,
      });
    console.log('this.props in submit', this.props);
    this.props.history.push(`/room/${newRoom.id}`);
    //this.setState({roomCode: code})
  }
  joinSubmit() {}
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
          <button type='submit'>Submit</button>
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
export default Rooms;
//  <Link to={`/room/${this.state.roomCode}`}></Link>
