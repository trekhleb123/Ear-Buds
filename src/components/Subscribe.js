import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

//need to pass playingEp as props from player
const Subscribe = (props) => {
  const subscribe = async (event, showId) => {
    const subToShow = await axios.put(
      `https://api.spotify.com/v1/me/shows?ids=${showId}`,
      {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      }
    );
  };

  return (
    <Button variant="contained" onClick={() => subscribe(null, props.show.id)}>
      {" "}
      Subscribe{" "}
    </Button>
  );
};
const stateToProps = (state) => ({
  token: state.access_token,
});
export default connect(stateToProps)(Subscribe);
