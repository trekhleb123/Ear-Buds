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
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import IconButton from '@material-ui/core/IconButton';

const Header = (props) => {
  const leaveRoom = async (roomId, displayName) => {
    console.log(roomId, displayName);
    await userLeft(roomId, displayName);
    await vacantRoom(roomId);
    props.history.push("/");
  };

  return (
    <div className="header">
      <Button
        type="button"
        onClick={() => leaveRoom(props.roomId, props.userData.display_name)}
        variant="outlined"
      >
        Leave Room
      </Button>
    </div>
  );
};

const stateToProps = (state) => ({
  roomCode: state.roomCode,
  userData: state.userData,
});

export default connect(stateToProps, null)(Header);
