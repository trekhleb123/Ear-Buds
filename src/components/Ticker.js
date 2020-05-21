import LinearProgress from "@material-ui/core/LinearProgress";
import { connect } from "react-redux";

import React, { useState, useEffect } from "react";
import { setPosition } from "../redux/store";

const Ticker = (props) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("seconds", seconds);
    props.setPosition(seconds);
    console.log("secondsState", props);
  }, [seconds]);

  return <div></div>;
};

const stateToProps = (state) => ({
  position: state.position,
});

const dispatchToProps = (dispatch) => ({
  setPosition: (position) => dispatch(setPosition(position)),
});

export default connect(stateToProps, dispatchToProps)(Ticker);

// export default Ticker;
