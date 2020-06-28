import React from "react"
import { setDeviceId, setPosition } from "../redux/store"
import { connect } from "react-redux"

const Sdk = (props) => {
  let player = ""
  let checkInterval = null

  const loadScript = function (src) {
    var tag = document.createElement("script")
    tag.async = false
    tag.src = src
    document.querySelector("body").appendChild(tag)
  }

  const createEventHandlers = () => {
    player.on("initialization_error", (e) => {
      console.error(e)
    })
    player.on("authentication_error", (e) => {
      console.error(e)
    })
    player.on("account_error", (e) => {
      console.error(e)
    })
    player.on("playback_error", (e) => {
      console.error(e)
    })

    // Playback status updates
    player.on("player_state_changed", (state) => {
      setPosition(state.position)
      console.log(state)
    })

    // Ready
    player.on("ready", (data) => {
      let { device_id } = data
      props.setDeviceId(device_id)
    })
  }

  const checkForPlayer = () => {
    if (window.Spotify) {
      clearInterval(checkInterval)
      player = new window.Spotify.Player({
        name: "EarBuds Web Player",
        getOAuthToken: (cb) => {
          cb(props.token)
        },
      })
      createEventHandlers()
      player.connect()
    }
  }

  const handleLogin = () => {
    if (props.token) {
      // check every second for the player.
      checkInterval = setInterval(() => checkForPlayer(), 1000)
    }
  }

  return (
    <div>
      {loadScript("https://sdk.scdn.co/spotify-player.js")}
      {handleLogin()}
    </div>
  )
}

const stateToProps = (state) => ({
  deviceId: state.deviceId,
  position: state.position,
})

const dispatchToProps = (dispatch) => ({
  setDeviceId: (code) => dispatch(setDeviceId(code)),
  setPosition: (position) => dispatch(setPosition(position)),
})

export default connect(stateToProps, dispatchToProps)(Sdk)
