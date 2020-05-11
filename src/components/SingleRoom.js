import React from 'react';
import { db } from '../firebase/firebase';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

class SingleRoom extends React.Component {
  constructor() {
    super();
    this.data = this.data.bind(this)
  }
  async data() {
    const stuff = await db.collection('Rooms').doc(this.props.match.params.roomId).get()
    .then(function(doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        return doc.data()
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
console.log('stuff', stuff)
  }
  render() {
    return (
      <div>
        <button type='button' onClick={this.data}>yo</button>
      </div>
    );
  }
}
export default SingleRoom;
//  <Link to={`/room/${this.state.roomCode}`}></Link>
