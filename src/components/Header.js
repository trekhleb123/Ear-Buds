import React from "react"
import { connect } from "react-redux"
import Button from "@material-ui/core/Button"
import { userLeft, vacantRoom } from "../firebase/firebase"
import Grid from "@material-ui/core/Grid"
import { grey, blue } from "@material-ui/core/colors"
import Switch from "@material-ui/core/Switch"
import { withStyles } from "@material-ui/core/styles"
import useDarkMode from "use-dark-mode"

const SwitchStyle = withStyles({
  switchBase: {
    color: blue[200],
    "&$checked": {
      color: blue[900],
    },
    "&$checked + $track": {
      backgroundColor: grey[200],
    },
  },
  checked: {},
  track: {},
})(Switch)

const Header = (props) => {
  let isDark = window.localStorage.getItem("darkMode") === "true" ? true : false
  const darkMode = useDarkMode(isDark)

  const leaveRoom = async (roomId, displayName) => {
    await userLeft(roomId, displayName)
    await vacantRoom(roomId)
    props.history.push("/")
  }

  const toggleDarkMode = () => {
    darkMode.toggle()
  }

  return (
    <div className="header">
      <Button
        type="button"
        onClick={() => leaveRoom(props.roomId, props.userData.display_name)}
        variant="outlined"
        size="small"
        style={{ margin: "7px 2.5%" }}
      >
        Leave Room
      </Button>
      <div style={{ margin: "7px 2.5%" }}>
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>Light</Grid>
          <Grid item>
            <SwitchStyle checked={darkMode.value} onChange={toggleDarkMode} />
          </Grid>
          <Grid item>Dark</Grid>
        </Grid>
      </div>
    </div>
  )
}

const stateToProps = (state) => ({
  roomCode: state.roomCode,
  userData: state.userData,
})

export default connect(stateToProps, null)(Header)
