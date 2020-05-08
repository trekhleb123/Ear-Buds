import React from 'react'
import {db} from './firebase/firebase'
import {Route} from 'react-router-dom'
class Rooms extends React.Component {
  constructor() {
    super()
    this.state = {
      roomCode: '',
    }
    //this.getRooms = this.getRooms.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.showForm = this.showForm.bind(this)
    // this.isPrivate = this.isPrivate.bind(this)

  }
  // async getRooms() {
  //   const doc = db.collection('Rooms')
  //  const docs = await doc.get()
  //   console.log(doc)
  //   let res = {}
  //   docs.forEach((el) => {
  //     res = el.id
  //   })
  // }

  handleSubmit(event) {
    //event.preventDefault()
    const code = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)
    this.setState({
      roomCode: code
    })
    console.log('in handle submit', this.state)
  }
  render() {
    console.log(this.state)
    return(
      <div>
        {/* <Route exact path='/rooms' Component={Rooms} /> */}
        <button onClick={this.handleSubmit} type='button'>Create Room</button>
        <br />
        {this.state.roomCode ? 'Room Code: ' + this.state.roomCode : null}
        <div>
          <h2>All Rooms</h2>
          <div>
            {/* all rooms */}
          </div>
        </div>
      </div>
    )
  }
}
export default Rooms
