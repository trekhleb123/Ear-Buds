import React from 'react'
import {db} from '../firebase/firebase'
import {Route} from 'react-router-dom'
import {Link} from 'react-router-dom'

class Rooms extends React.Component {
  constructor() {
    super()
    this.state = {
      roomCode: '',
    }
    this.getRooms = this.getRooms.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.showForm = this.showForm.bind(this)
    // this.isPrivate = this.isPrivate.bind(this)

  }
  componentDidMount() {
    this.getRooms()
    console.log('this.props',this.props)
  }
  async getRooms() {
    const doc = db.collection('Rooms')
   const docs = await doc.get()
       let res = {}
    docs.forEach((el) => {
      res = el
      console.log(el.data())
    })
    console.log(res)
    return res
  }

  async handleSubmit(event) {
    //event.preventDefault()
    const code = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)
    console.log('in handle submit', code)
    db.collection('Rooms').add({name:'room1', roomCode: code})
  }
  render() {

    return(
      <div>
        {/* redirect when room is created */}
       <button onClick={this.handleSubmit} type='button'>Create Room</button>
        <br />
        {/* <div>
          <h2>All Rooms</h2>
          <div>
          </div>
        </div> */}
      </div>
    )
  }
}
export default Rooms
//  <Link to={`/room/${this.state.roomCode}`}></Link>
