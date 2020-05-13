import React from "react";
import { db, getRoom } from "../firebase/firebase";
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
//import { getMyData } from "../spotifyLogin"
import { getAccessToken } from "../redux/store";
import SearchBar from "./SearchBar";

class SingleRoom extends React.Component {
  constructor() {
    super();
    this.docId = null;
    this.data = this.data.bind(this);
  }
  componentDidMount() {
    //getAccessToken()
  }

  async data() {
    const stuff = await db
      .collection("Rooms")
      .doc(this.props.match.params.roomId)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          return doc.data();
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    this.docId = await getRoom(this.props.match.params.roomId);
    //console.log("stuff", stuff, getMyData()) //need access token
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.data}>
          yo
        </button>
        <SearchBar docId={this.docId} roomId={this.props.match.params.roomId} />
      </div>
    );
  }
}

export default SingleRoom;
//  <Link to={`/room/${this.state.roomCode}`}></Link>
