import React from 'react';
import { db, userLeft, renderUsers, vacantRoom } from '../firebase/firebase';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
//import { getMyData } from "../spotifyLogin"
import { getAccessToken, setSpotifyCode, getUserData } from '../redux/store';
import { connect } from 'react-redux';
import { Modal } from '@material-ui/core';
import Messages from './Messages'
import { SearchBar } from '.';
class SingleRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      // open: false
    }
    this.leaveRoom = this.leaveRoom.bind(this);
    //this.open = this.open.bind(this);

  }
  async componentDidMount() {
    if (!Object.keys(this.props.userData).length) {
      this.props.history.push("/");
    }
    this.props.getUserData(this.props.access_token);
    await renderUsers(this.props.match.params.roomId);
    this.setState({
      users: [...this.state.users, await renderUsers(this.props.match.params.roomId)],
    })
        console.log('in mount', this.state.users)

  }

  async leaveRoom(roomId, displayName) {
    await userLeft(roomId, displayName);
    await vacantRoom(roomId);
    this.props.history.push("/");
  }

  render() {
    console.log('users in render', this.state.users)
    return (
      <div>
        <h2>Users</h2>
        <div>
          {Object.values(this.state.users).map((user, i) => {
            console.log('user', user)
            return <li key={i}>{user.name}</li>
          })}
        </div>
        <button type="button" onClick={() => this.leaveRoom(this.props.match.params.roomId, this.props.userData.display_name)}>
          Leave Room
        </button>
        <button type="button">
          Invite Friend
        </button>
        {/* {this.state.open ?
        <Modal open={this.state.open}>
          hello
        </Modal> : null} */}
        <Messages />
        <SearchBar roomId={this.props.match.params.roomId} />
        <button type="button">Invite Friend</button>
      </div>
    );
  }
}
const stateToProps = (state) => ({
  access_token: state.access_token,
  userData: state.userData,
  refresh_token: state.refresh_token,
});

const dispatchToProps = (dispatch) => ({
  getAccessToken: (code) => dispatch(getAccessToken(code)),
  setSpotifyCode: (code) => dispatch(setSpotifyCode(code)),
  getUserData: (token) => dispatch(getUserData(token)),
});

export default connect(stateToProps, dispatchToProps)(SingleRoom);
