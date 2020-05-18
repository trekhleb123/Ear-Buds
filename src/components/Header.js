import React, { useState, useEffect } from "react";
import { firestore, findRoom } from "../firebase/firebase";
import Form from "./Form";
import _sortBy from "lodash/sortBy";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Popover from "@material-ui/core/Popover";
import { db, userLeft, renderUsers, vacantRoom } from "../firebase/firebase";
import Typography from "@material-ui/core/Typography";

const Header = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const leaveRoom = async (roomId, displayName) => {
    console.log(roomId, displayName);
    await userLeft(roomId, displayName);
    await vacantRoom(roomId);
    props.history.push("/");
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const copyText = () => {
    var copyText = document.getElementById("room-code");

    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    document.execCommand("copy");

    alert("Copied the text: " + copyText.value);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="header">
      <Button
        type="button"
        onClick={() => leaveRoom(props.roomId, props.userData.display_name)}
        variant="outlined"
      >
        Leave Room
      </Button>

      <Button type="button" onClick={handleOpen} variant="outlined">
        Invite Friend
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Card>
          <CardContent className="invite-card">
            <Typography variant="subtitle1" color="textSecondary">
              Send Link
            </Typography>
            <input type="text" value="URL Placeholder" id="invite-url"></input>
            <Button disabled="true" variant="contained" color="primary">
              Copy Link
            </Button>
            <Typography variant="subtitle1" color="textSecondary">
              Send Invite Code
            </Typography>
            <input type="text" value={props.roomCode} id="room-code"></input>
            <Button
              onClick={() => copyText()}
              variant="contained"
              color="primary"
              id="search-button"
            >
              Copy Code
            </Button>
          </CardContent>
        </Card>
      </Popover>
    </div>
  );
};

const stateToProps = (state) => ({
  roomCode: state.roomCode,
  userData: state.userData,
});

export default connect(stateToProps, null)(Header);
