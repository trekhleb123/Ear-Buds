import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { connect } from "react-redux";

class Ticker extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      start: Date.now(),
      currentPosition: 0,
    };
    this.timer = null;
    this.tick = () => {
      console.log("ticking", this.state.currentPosition);

      this.setState({
        currentPosition:
          Date.now() - this.state.start + (this.props.position || 0),
      });
    };
  }
  componentWillReceiveProps(props) {
    if (
      this.props.position !== props.position ||
      this.props.duration !== props.duration
    ) {
      this.setState({
        start: Date.now(),
        currentPosition: 0,
      });
    }

    console.log("PROPS", props);
    console.log("this.props", this.props);

    if (this.props.status === true && !this.timer) {
      this.timer = setInterval(this.tick, 300);
    }
    if (this.props.status === false) {
      clearInterval(this.timer);
    }
  }
  componentDidMount() {
    this.timer = setInterval(this.tick, 300);
  }
  // componentWillUnmount() {
  //   clearInterval(this.timer);
  // }
  render() {
    const checker = () => {
      if (this.props.status === true && !this.timer) {
        this.timer = setInterval(this.tick, 300);
      }
      if (this.props.status === false) {
        clearInterval(this.timer);
      }
    };

    const msConversion = (s) => {
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;

      return hrs + ":" + mins + ":" + secs;
    };
    const percentage = +(
      (this.state.currentPosition * 100) /
      this.props.duration
    );

    const position = msConversion(this.state.currentPosition);

    return (
      <div>
        {console.log(percentage)}
        <div className="progress-container">
          <span>{position}</span>
          <span>{msConversion(this.props.duration)}</span>
          <span>{percentage}</span>
        </div>
        <LinearProgress variant="determinate" value={percentage} />
      </div>
    );
  }
}

const stateToProps = (state) => ({
  position: state.position,
});

export default connect(stateToProps, null)(Ticker);

// export default Ticker;
