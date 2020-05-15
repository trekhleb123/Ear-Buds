import React from "react";
import Messages from "./Messages";
import { db, userLeft, renderUsers, vacantRoom } from "../firebase/firebase";
import { getAccessToken, setSpotifyCode, getUserData } from "../redux/store";
import { connect } from "react-redux";
import SearchBar from "./SearchBar";

class SingleRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      users: {},
    };
    this.leaveRoom = this.leaveRoom.bind(this);
  }
  async componentDidMount() {
    if (!Object.keys(this.props.userData).length) {
      this.props.history.push("/");
    }
    this.props.getUserData(this.props.access_token);
    await renderUsers(this.props.match.params.roomId);
    this.setState({
      users: await renderUsers(this.props.match.params.roomId),
    });
  }

  async leaveRoom(roomId, displayName) {
    await userLeft(roomId, displayName);
    await vacantRoom(roomId);
    this.props.history.push("/");
  }

  render() {
    return (
      <div>
        <h2>Users</h2>
        <div>
          {Object.values(this.state.users).map((user) => {
            return <li key={user}>{user}</li>;
          })}
        </div>
        <button
          type="button"
          onClick={() =>
            this.leaveRoom(
              this.props.match.params.roomId,
              this.props.userData.display_name
            )
          }
        >
          Leave Room
        </button>
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
