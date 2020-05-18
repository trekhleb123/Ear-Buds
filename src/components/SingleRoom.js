import React from 'react';
import { db, userLeft, renderUsers, vacantRoom } from '../firebase/firebase';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
//import { getMyData } from "../spotifyLogin"
import { getAccessToken, setSpotifyCode, getUserData } from '../redux/store';
import { connect } from 'react-redux';
import { Modal } from '@material-ui/core';
import Messages from './Messages';
import { SearchBar } from '.';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { List } from '@material-ui/core';
class SingleRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      // open: false
    };
    this.leaveRoom = this.leaveRoom.bind(this);
  }
  async componentDidMount() {
    if (!Object.keys(this.props.userData).length) {
      this.props.history.push('/');
    }
    this.props.getUserData(this.props.access_token);
    // await renderUsers(this.props.match.params.roomId);
    // this.setState({
    //   users: [...this.state.users, await renderUsers(this.props.match.params.roomId)],
    // })
    //     console.log('in mount', this.state.users)
    await db
      .collection('Rooms')
      .doc(this.props.match.params.roomId)
      .collection('Users')
      .onSnapshot(snapshot => {
        const allUsers = [];
        snapshot.forEach(doc => allUsers.push(doc.data()));
        this.setState({
          users: allUsers,
        });
      });
  }

  async leaveRoom(roomId, displayName) {
    console.log(roomId, displayName);
    await userLeft(roomId, displayName);
    await vacantRoom(roomId);
    this.props.history.push('/');
  }

  render() {
    console.log('users in render', this.state.users, this.props.userData);
    return (
      <div>
        <h2>Users</h2>
        <div>
          {Object.values(this.state.users).map((user, i) => {
            console.log('user', user);
            return (
            <div className='userList'key={i}>
              <img alt='avatar' src={user.image.length > 0 ? user.image[0].url : "https://www.mentoring.org/new-site/wp-content/uploads/2019/05/default-user-300x300.png"}/>
              <p>{user.name}</p>
              </div>
              );
          })}
        </div>
        <Button
          size="small"
          variant="contained"
          type="button"
          onClick={() =>
            this.leaveRoom(
              this.props.match.params.roomId,
              this.props.userData.display_name
            )
          }
        >
          Leave Room
        </Button>
        <Button size="small" variant="contained" type="button">
          Invite Friend
        </Button>
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
const stateToProps = state => ({
  access_token: state.access_token,
  userData: state.userData,
  refresh_token: state.refresh_token,
});

const dispatchToProps = dispatch => ({
  getAccessToken: code => dispatch(getAccessToken(code)),
  setSpotifyCode: code => dispatch(setSpotifyCode(code)),
  getUserData: token => dispatch(getUserData(token)),
});

export default connect(stateToProps, dispatchToProps)(SingleRoom);
