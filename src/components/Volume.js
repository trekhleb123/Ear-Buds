import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/core/Slider"
import VolumeDown from "@material-ui/icons/VolumeDown"
import VolumeUp from "@material-ui/icons/VolumeUp"
import { connect } from "react-redux"

const Volume = (props) => {
  const token = props.token
  const deviceId = props.deviceId
  let [volume, setVolume] = useState(30)
  const volumeChanger = async (event, vol) => {
    setVolume(vol)
    const setVol = await fetch(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${vol}&device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }

  return (
    <div className="volume">
      <Typography id="continuous-slider" gutterBottom>
        Volume
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs>
          <Slider
            value={volume}
            onChange={volumeChanger}
            aria-labelledby="continuous-slider"
          />
        </Grid>
        <Grid item>
          <VolumeUp />
        </Grid>
      </Grid>
    </div>
  )
}

const stateToProps = (state) => ({
  token: state.access_token,
  deviceId: state.deviceId,
})

export default connect(stateToProps, null)(Volume)
